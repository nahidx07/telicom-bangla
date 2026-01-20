import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  Package, 
  Settings, 
  ArrowLeft, 
  Activity, 
  AlertCircle,
  CreditCard,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db, collection, getDocs, query, orderBy, limit } from '../firebase';
import { User, Transaction } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [pendingTx, setPendingTx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map(doc => doc.data() as User);
        setUserCount(users.length);
        setTotalBalance(users.reduce((acc, curr) => acc + (curr.balance || 0), 0));

        const txSnap = await getDocs(collection(db, "transactions"));
        const allTx = txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        setPendingTx(allTx.filter(t => t.status === 'Pending').length);
        
        const sortedTx = [...allTx].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentTx(sortedTx.slice(0, 5));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'Sat', sales: 4000 }, { name: 'Sun', sales: 3000 },
    { name: 'Mon', sales: 2000 }, { name: 'Tue', sales: 2780 },
    { name: 'Wed', sales: 1890 }, { name: 'Thu', sales: 2390 },
    { name: 'Fri', sales: 3490 },
  ];

  const stats = [
    { label: 'Total Users', value: userCount.toString(), icon: <Users />, color: 'bg-blue-500' },
    { label: 'Total Balance', value: `৳${totalBalance.toFixed(0)}`, icon: <Wallet />, color: 'bg-green-500' },
    { label: 'Pending Requests', value: pendingTx.toString(), icon: <AlertCircle />, color: 'bg-red-500' },
    { label: 'Server Status', value: 'Live', icon: <Activity />, color: 'bg-indigo-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-4xl mx-auto p-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <h2 className="font-bold text-gray-800 mb-2">ম্যানেজমেন্ট</h2>
          <button onClick={() => navigate('/admin/users')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">
            <Users size={18} className="text-blue-500" /> User Management
          </button>
          <button onClick={() => navigate('/admin/transactions')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">
            <History size={18} className="text-red-500" /> Transaction Requests
          </button>
          <button onClick={() => navigate('/admin/packages')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">
            <Package size={18} className="text-green-500" /> Package Control
          </button>
          <button onClick={() => navigate('/admin/payments')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">
            <CreditCard size={18} className="text-indigo-500" /> Payment Methods
          </button>
          <button onClick={() => navigate('/admin/settings')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">
            <Settings size={18} className="text-gray-500" /> App Settings
          </button>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-6">Sales Chart</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fill="#10b98120" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
