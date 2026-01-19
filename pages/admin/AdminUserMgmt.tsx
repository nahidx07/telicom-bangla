
import React, { useState } from 'react';
import { ArrowLeft, Search, User as UserIcon, MoreVertical, ShieldAlert, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUserMgmt: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: '1', name: 'Abir Hasan', mobile: '01700000000', balance: 500, type: 'Normal', status: 'Active' },
    { id: '2', name: 'Sumon Ali', mobile: '01800000000', balance: 12500, type: 'Agent', status: 'Active' },
    { id: '3', name: 'Rahim Sheikh', mobile: '01900000000', balance: 0, type: 'Normal', status: 'Blocked' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 pl-10 rounded-xl bg-white border border-gray-200 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map(u => (
          <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <UserIcon />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{u.name} <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded ml-2">{u.type}</span></h3>
                <p className="text-xs text-gray-500">{u.mobile} • {u.status}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Balance</p>
                <p className="font-bold text-gray-800">৳ {u.balance}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Wallet size={18} />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${u.status === 'Blocked' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}>
                  <ShieldAlert size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserMgmt;
