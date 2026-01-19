import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  Package, 
  Settings, 
  ArrowLeft, 
  TrendingUp, 
  Activity, 
  AlertCircle 
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map(doc => doc.data() as User);
        setUserCount(users.length);
        const balance = users.reduce((acc, curr) => acc + (curr.balance || 0), 0);
        setTotalBalance(balance);

        // Fetch Recent Transactions
        const txQuery = query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(5));
        const txSnap = await getDocs(txQuery);
        const transactions = txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        setRecentTx(transactions);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Sat', sales: 4000 },
    { name: 'Sun', sales: 3000 },
    { name: 'Mon', sales: 2000 },
    { name: 'Tue', sales: 2780 },
    { name: 'Wed', sales: 1890 },
    { name: 'Thu', sales: 2390 },
    { name: 'Fri', sales: 3490 },
  ];

  const stats = [
    { label: 'Total Users', value: userCount.toLocaleString(), icon: <Users />, color: 'bg-blue-500' },
    { label: 'Total Balance', value: `৳ ${totalBalance.toLocaleString()}`, icon: <Wallet />, color: 'bg-green-500' },
    { label: 'Live Server', value: 'Online', icon: <Activity />, color: 'bg-orange-500' },
    { label: 'Recent Orders', value: recentTx.length.toString(), icon: <AlertCircle />, color: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 max-w-4xl mx-auto p-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 bg-white rounded-lg shadow-sm">
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <h2 className="font-bold text-gray-800 mb-2">Quick Controls</h2>
          <button onClick={() => navigate('/admin/users')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <Users size={20} className="text-blue-500" />
            <span className="font-medium text-gray-700">User Management</span>
          </button>
          <button onClick={() => navigate('/admin/packages')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <Package size={20} className="text-green-500" />
            <span className="font-medium text-gray-700">Package Control</span>
          </button>
          <button onClick={() => navigate('/admin/settings')} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <Settings size={20} className="text-gray-500" />
            <span className="font-medium text-gray-700">App Settings</span>
          </button>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-800 mb-6">Sales Performance</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTx.length > 0 ? recentTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">User</span>
                      <span className="text-xs text-gray-400">{tx.number || tx.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.type}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">৳ {tx.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${
                      tx.status === 'Success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">কোনো লেনদেন পাওয়া যায়নি</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
