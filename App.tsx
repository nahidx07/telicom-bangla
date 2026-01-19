import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User } from './types';
import { NAV_ITEMS } from './pages/user/constants';
import { db, doc, getDoc, setDoc } from './firebase';

// Pages - User Facing
import LoginPage from './pages/admin/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OtpPage from './pages/admin/OtpPage';
import UserHome from './pages/user/UserHome';
import ProfilePage from './pages/user/ProfilePage';
import TransactionsPage from './pages/user/TransactionsPage';
import ServicePage from './pages/user/ServicePage';
import AddMoneyPage from './pages/user/AddMoneyPage';
import NotificationsPage from './pages/user/NotificationsPage';
import UpdatePage from './pages/user/UpdatePage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUserMgmt from './pages/admin/AdminUserMgmt';
import AdminPackageMgmt from './pages/admin/AdminPackageMgmt';
import AdminLogin from './AdminLogin'; // Root level
import AdminSettings from './pages/admin/AdminSettings';

const Layout: React.FC<{ children: React.ReactNode; user: User | null }> = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPath = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/otp';

  // Protecting User Routes (If not logged in and not an auth/admin path)
  if (!user && !location.pathname.startsWith('/admin') && !isAuthPath) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>
      
      {/* Bottom Nav for Users */}
      {!location.pathname.startsWith('/admin') && user && !isAuthPath && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around items-center py-2 px-4 shadow-lg z-50">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                location.pathname === item.path ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  useEffect(() => {
    const checkTelegramLogin = async () => {
      // @ts-ignore
      const tg = window.Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        const tgId = `TG_${tgUser.id}`;
        
        try {
          const userDoc = await getDoc(doc(db, "users", tgId));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
          } else {
            // Auto register new Telegram user
            const newUser: User = {
              id: tgId,
              mobile: tgUser.username || tgId,
              email: `${tgUser.id}@telegram.com`,
              name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
              pin: '0000', // Default PIN for TG users
              balance: 0,
              type: 'Normal',
              deviceId: `TG-DEV-${tgUser.id}`,
              isBlocked: false,
              kycStatus: 'None'
            };
            await setDoc(doc(db, "users", tgId), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Telegram Auto-login error:", error);
        }
      }
      setLoading(false);
      if (tg) tg.ready();
    };

    checkTelegramLogin();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">অপেক্ষা করুন...</h2>
        <p className="text-gray-500 mt-2">আপনার একাউন্ট যাচাই করা হচ্ছে</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/register" element={<RegisterPage onRegister={setUser} />} />
        <Route path="/otp" element={<OtpPage onVerify={setUser} />} />

        {/* User Routes */}
        <Route path="/" element={<Layout user={user}><UserHome user={user} /></Layout>} />
        <Route path="/profile" element={<Layout user={user}><ProfilePage user={user} onLogout={() => setUser(null)} /></Layout>} />
        <Route path="/transactions" element={<Layout user={user}><TransactionsPage user={user} /></Layout>} />
        <Route path="/notifications" element={<Layout user={user}><NotificationsPage /></Layout>} />
        <Route path="/update" element={<Layout user={user}><UpdatePage /></Layout>} />
        <Route path="/add-money" element={<Layout user={user}><AddMoneyPage user={user} /></Layout>} />
        <Route path="/service/:type" element={<Layout user={user}><ServicePage user={user} /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/users" element={isAdmin ? <AdminUserMgmt /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/packages" element={isAdmin ? <AdminPackageMgmt /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/settings" element={isAdmin ? <AdminSettings /> : <Navigate to="/admin/login" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
