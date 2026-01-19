
import React from 'react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Sat', sales: 4000, profit: 2400 },
  { name: 'Sun', sales: 3000, profit: 1398 },
  { name: 'Mon', sales: 2000, profit: 9800 },
  { name: 'Tue', sales: 2780, profit: 3908 },
  { name: 'Wed', sales: 1890, profit: 4800 },
  { name: 'Thu', sales: 2390, profit: 3800 },
  { name: 'Fri', sales: 3490, profit: 4300 },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Users', value: '1,284', icon: <Users />, color: 'bg-blue-500' },
    { label: 'Total Balance', value: '৳ 42,500', icon: <Wallet />, color: 'bg-green-500' },
    { label: 'Today Profit', value: '৳ 3,420', icon: <TrendingUp />, color: 'bg-orange-500' },
    { label: 'Pending Orders', value: '12', icon: <AlertCircle />, color: 'bg-red-500' },
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
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-gray-500">Live Server</span>
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
        {/* Quick Actions */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <h2 className="font-bold text-gray-800 mb-2">Quick Controls</h2>
          <button 
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Users size={20} className="text-blue-500" />
            <span className="font-medium text-gray-700">User Management</span>
          </button>
          <button 
            onClick={() => navigate('/admin/packages')}
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Package size={20} className="text-green-500" />
            <span className="font-medium text-gray-700">Package Control</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <Activity size={20} className="text-orange-500" />
            <span className="font-medium text-gray-700">Recharge History</span>
          </button>
          <button 
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Settings size={20} className="text-gray-500" />
            <span className="font-medium text-gray-700">App Settings</span>
          </button>
        </div>

        {/* Charts */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-800 mb-6">Sales Performance</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Recent Transactions</h2>
          <button className="text-sm text-green-600 font-bold">View All</button>
        </div>
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
            {[1, 2, 3, 4, 5].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">Abir Hasan</span>
                    <span className="text-xs text-gray-400">01700000000</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">Recharge</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">৳ 500</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase">
                    Success
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
