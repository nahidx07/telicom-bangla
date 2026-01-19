
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Key, 
  BadgeCheck, 
  Phone, 
  Mail, 
  ArrowLeft,
  Save,
  CircleUser
} from 'lucide-react';
// Fix: Removed .ts extension from import path.
import { User } from '../../types';

interface ProfilePageProps {
  user: User | null;
  onLogout: () => void;
}

type ProfileView = 'main' | 'personal' | 'pin' | 'kyc' | 'security';

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<ProfileView>('main');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  if (!user) return null;

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('পিন কমপক্ষে ৪ সংখ্যার হতে হবে');
      return;
    }
    if (newPin !== confirmPin) {
      alert('পিন মিলছে না');
      return;
    }
    alert('পিন সফলভাবে পরিবর্তন হয়েছে!');
    setActiveView('main');
  };

  const renderPersonal = () => (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={20}/></button>
        <h3 className="text-xl font-bold text-gray-800">ব্যক্তিগত তথ্য</h3>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">পূর্ণ নাম</label>
          <p className="text-gray-800 font-bold">{user.name || 'N/A'}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">মোবাইল নাম্বার</label>
          <p className="text-gray-800 font-bold">{user.mobile}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">ইমেইল</label>
          <p className="text-gray-800 font-bold">{user.email || 'N/A'}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">একাউন্ট টাইপ</label>
          <p className="text-green-600 font-bold">{user.type}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">ডিভাইস আইডি</label>
          <p className="text-gray-500 text-xs break-all font-mono">{user.deviceId}</p>
        </div>
      </div>
    </div>
  );

  const renderPinChange = () => (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={20}/></button>
        <h3 className="text-xl font-bold text-gray-800">পিন পরিবর্তন</h3>
      </div>
      <form onSubmit={handleUpdatePin} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">নতুন পিন</label>
          <input 
            type="password" 
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="••••••"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">পিন নিশ্চিত করুন</label>
          <input 
            type="password" 
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="••••••"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100">
          <Save size={20}/> আপডেট করুন
        </button>
      </form>
    </div>
  );

  const renderKyc = () => (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={20}/></button>
        <h3 className="text-xl font-bold text-gray-800">KYC ভেরিফিকেশন</h3>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <BadgeCheck size={40}/>
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-800">আপনার একাউন্ট ভেরিফাইড!</h4>
          <p className="text-sm text-gray-500 mt-1">আপনার এনআইডি কার্ড দিয়ে একাউন্টটি সফলভাবে ভেরিফাই করা হয়েছে।</p>
        </div>
      </div>
    </div>
  );

  if (activeView === 'personal') return <div className="p-6">{renderPersonal()}</div>;
  if (activeView === 'pin') return <div className="p-6">{renderPinChange()}</div>;
  if (activeView === 'kyc') return <div className="p-6">{renderKyc()}</div>;

  const menuItems: { label: string; icon: React.ReactNode; color: string; view: ProfileView }[] = [
    { label: 'ব্যক্তিগত তথ্য', icon: <UserIcon size={20} />, color: 'bg-blue-50 text-blue-600', view: 'personal' },
    { label: 'পিন পরিবর্তন', icon: <Key size={20} />, color: 'bg-orange-50 text-orange-600', view: 'pin' },
    { label: 'KYC ভেরিফিকেশন', icon: <BadgeCheck size={20} />, color: 'bg-green-50 text-green-600', view: 'kyc' },
    { label: 'নিরাপত্তা সেটিংস', icon: <Shield size={20} />, color: 'bg-purple-50 text-purple-600', view: 'security' },
  ];

  return (
    <div className="flex flex-col bg-gray-50 min-h-full">
      {/* Profile Header */}
      <div className="bg-white p-8 flex flex-col items-center gap-4 rounded-b-[40px] shadow-sm mb-6 border-b border-gray-100">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
             <CircleUser size={80} />
          </div>
          <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 text-white rounded-full border-2 border-white flex items-center justify-center shadow-md">
            <BadgeCheck size={16} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">{user.name || 'সম্মানিত গ্রাহক'}</h2>
          <p className="text-gray-500 font-medium">{user.mobile}</p>
          <div className="mt-2 inline-block px-3 py-1 bg-yellow-400 text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">
            {user.type} ACCOUNT
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Contact Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1">
            <div className="text-gray-400 mb-1"><Phone size={16} /></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Mobile Number</span>
            <span className="text-xs font-bold text-gray-800">{user.mobile}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1">
            <div className="text-gray-400 mb-1"><Mail size={16} /></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Email</span>
            <span className="text-xs font-bold text-gray-800 truncate">{user.email}</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.view !== 'security' && setActiveView(item.view)}
              className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight className="text-gray-300" size={20} />
            </button>
          ))}
        </div>

        <button
          onClick={onLogout}
          className="bg-white text-red-600 font-bold py-5 rounded-3xl shadow-sm border border-red-50 flex items-center justify-center gap-3 hover:bg-red-50 active:scale-[0.98] transition-all mb-10"
        >
          <LogOut size={20} /> লগআউট করুন
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
