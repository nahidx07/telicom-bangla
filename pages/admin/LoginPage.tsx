import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Smartphone, UserPlus } from 'lucide-react';
import { User } from '../../types';
import { db, doc, getDoc } from '../../firebase';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userDoc = await getDoc(doc(db, "users", mobile));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        
        if (userData.pin === pin) {
          if (userData.isBlocked) {
            alert("আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।");
          } else {
            onLogin(userData);
            navigate('/');
          }
        } else {
          alert("ভুল পিন দিয়েছেন!");
        }
      } else {
        alert("এই নাম্বারে কোনো অ্যাকাউন্ট নেই!");
      }
    } catch (error) {
      console.error("Login error: ", error);
      alert("লগইন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8">
      <div className="mt-12 mb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white shadow-xl mb-4">
          <Smartphone size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Telicom Bangla</h1>
        <p className="text-gray-500">আপনার একাউন্টে লগইন করুন</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">মোবাইল নাম্বার</label>
          <div className="relative">
            <input
              type="tel"
              required
              className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
              placeholder="01XXXXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">পিন</label>
          <div className="relative">
            <input
              type="password"
              required
              className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
              placeholder="••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'} <ArrowRight size={20} />
        </button>
      </form>

      {/* Registration Option */}
      <div className="mt-10 text-center pb-8 border-t border-gray-50 pt-8">
        <p className="text-gray-500 mb-4 text-sm font-medium">একাউন্ট নেই? এখনই যুক্ত হোন!</p>
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 border-2 border-green-600 text-green-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-green-50 transition-all active:scale-[0.98]"
        >
          <UserPlus size={20} /> রেজিস্ট্রেশন করুন
        </button>
      </div>
    </div>
  );
};

export default LoginPage;