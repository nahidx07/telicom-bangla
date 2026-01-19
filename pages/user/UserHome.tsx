
import React from 'react';
import { User } from '../../types.ts';
import { Bell, PlusCircle, Settings, Smartphone } from 'lucide-react';
import { SERVICE_GRID, OPERATORS } from '../../constants.tsx';
import { useNavigate } from 'react-router-dom';

interface UserHomeProps {
  user: User | null;
}

const UserHome: React.FC<UserHomeProps> = ({ user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl shadow-lg flex items-center justify-center text-white">
            <Smartphone size={24} />
          </div>
          <div>
            <h1 className="text-gray-800 font-bold text-lg leading-tight">Telicom Bangla</h1>
            <div className="flex items-center gap-1">
              <span className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                👑 স্বাধীন
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/notifications')}
          className="p-2 text-gray-400 hover:text-gray-600 relative"
        >
          <Bell size={24} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
            ৳
          </div>
          <div>
            <p className="text-gray-500 text-sm">একাউন্ট ব্যালেন্স</p>
            <p className="text-2xl font-bold text-gray-800">৳ {user.balance.toFixed(2)}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/add-money')}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
            <PlusCircle size={24} />
          </div>
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">অ্যাড মানি</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-4 gap-4">
        {SERVICE_GRID.map((service) => (
          <button
            key={service.id}
            onClick={() => navigate(service.path)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-full aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-active:scale-95 transition-transform">
              <div className="text-gray-600">
                {React.cloneElement(service.icon as React.ReactElement<any>, { size: 28 })}
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-700 text-center">{service.label}</span>
          </button>
        ))}
      </div>

      {/* Admin Floating Gear */}
      <button 
        onClick={() => navigate('/admin/login')}
        className="fixed right-4 bottom-24 w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
      >
        <Settings size={28} />
      </button>

      {/* Notice Section */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="text-blue-800 font-bold text-sm mb-1 flex items-center gap-2">
          <Bell size={16} /> নোটিশ
        </h3>
        <p className="text-blue-700 text-xs leading-relaxed">
          এখনই আপনার জিপি সিমের জন্য সেরা অফারটি লুফে নিন! ৫জিবি মাত্র ৯৯ টাকায়। অফারটি সীমিত সময়ের জন্য।
        </p>
      </div>
    </div>
  );
};

export default UserHome;
