
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Mail } from 'lucide-react';
import { User } from '../../types';
import { sendAdminNotification, formatRegistrationMsg } from '../../services/telegramService';
import { db, doc, setDoc } from '../../firebase';

interface OtpPageProps {
  onVerify: (user: User) => void;
}

const OtpPage: React.FC<OtpPageProps> = ({ onVerify }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationData = location.state || {};
  
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      alert('পিন কমপক্ষে ৪ সংখ্যার হতে হবে');
      return;
    }
    if (pin !== confirmPin) {
      alert('পিন ম্যাচিং হয়নি!');
      return;
    }

    setLoading(true);
    try {
      const userId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const newUser: User = {
        id: userId,
        mobile: registrationData.mobile || 'N/A',
        email: registrationData.email || '',
        name: registrationData.name || 'নতুন ইউজার',
        pin: pin,
        balance: 0,
        type: registrationData.type || 'Normal',
        referCode: registrationData.referCode || '',
        deviceId: 'DEV-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        isBlocked: false,
        kycStatus: 'None'
      };

      // 1. Save to database
      await setDoc(doc(db, "users", newUser.mobile), newUser);
      
      // 2. Notify Admin via Telegram
      await sendAdminNotification(formatRegistrationMsg(newUser));

      onVerify(newUser);
      navigate('/');
    } catch (error) {
      console.error("Error saving user: ", error);
      alert("রেজিস্ট্রেশনে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8">
      <div className="mt-8 mb-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">ভেরিফিকেশন</h1>
        <div className="flex items-center gap-2 mt-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <Mail size={16} className="text-blue-600" />
          <p className="text-blue-800 text-xs font-bold truncate max-w-[200px]">{registrationData.email}</p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">OTP কোড</label>
          <input
            type="text"
            required
            maxLength={6}
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center text-2xl font-bold tracking-[0.5em] focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">নতুন পিন সেট করুন</label>
          <div className="relative">
            <input
              type="password"
              required
              maxLength={6}
              className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="৪ সংখ্যার পিন"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">পিন নিশ্চিত করুন</label>
          <div className="relative">
            <input
              type="password"
              required
              maxLength={6}
              className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="আবার পিন দিন"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          {loading ? 'প্রসেসিং হচ্ছে...' : 'ভেরিফাই ও ফিনিশ'} <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default OtpPage;
