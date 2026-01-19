
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, Transaction, Notification } from './types.ts';
import { NAV_ITEMS } from './constants.tsx';

// Pages
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import OtpPage from './pages/auth/OtpPage.tsx';
import UserHome from './pages/user/UserHome.tsx';
import ProfilePage from './pages/user/ProfilePage.tsx';
import TransactionsPage from './pages/user/TransactionsPage.tsx';
import ServicePage from './pages/user/ServicePage.tsx';
import AddMoneyPage from './pages/user/AddMoneyPage.tsx';
import NotificationsPage from './pages/user/NotificationsPage.tsx';
import UpdatePage from './pages/user/UpdatePage.tsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import AdminUserMgmt from './pages/admin/AdminUserMgmt.tsx';
import AdminPackageMgmt from './pages/admin/AdminPackageMgmt.tsx';
import AdminLogin from './pages/admin/AdminLogin.tsx';
import AdminSettings from './pages/admin/AdminSettings.tsx';

// Fix: Defining Layout outside of the App component and using explicit prop types to resolve TypeScript errors where children were not being correctly inferred in the JSX element context within Routes.
const Layout: React.FC<{ children: React.ReactNode; user: User | null }> = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPath = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/otp';

  if (!user && !location.pathname.startsWith('/admin') && !isAuthPath) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>
      
      {/* Bottom Nav */}
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

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);

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
