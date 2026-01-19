
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User as UserIcon, Tag, ArrowRight, Smartphone, Mail } from 'lucide-react';
import { User } from '../../types';

interface RegisterPageProps {
  onRegister: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referCode, setReferCode] = useState('');
  const [type, setType] = useState<'Normal' | 'Agent'>('Normal');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !email) {
      alert('নাম্বার এবং ইমেইল দেওয়া বাধ্যতামূলক');
      return;
    }
    // Proceed to OTP screen
    navigate('/otp', { state: { mobile, email, name, referCode, type } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8">
      <div className="mt-8 mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
          <Smartphone size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">নতুন একাউন্ট</h1>
        <p className="text-gray-500">তথ্য দিয়ে রেজিস্ট্রেশন করুন</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 ml-1">নাম (ঐচ্ছিক)</label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
              placeholder="আপনার নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 ml-1">মোবাইল নাম্বার (বাধ্যতামূলক)</label>
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 ml-1">ইমেইল (কোড পাঠানোর জন্য)</label>
          <div className="relative">
            <input
              type="email"
              required
              className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 ml-1">রেফার কোড (ঐচ্ছিক)</label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
              placeholder="REF123456"
              value={referCode}
              onChange={(e) => setReferCode(e.target.value)}
            />
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">একাউন্ট টাইপ</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('Normal')}
              className={`p-4 rounded-2xl border font-bold transition-all ${
                type === 'Normal' ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setType('Agent')}
              className={`p-4 rounded-2xl border font-bold transition-all ${
                type === 'Agent' ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100'
              }`}
            >
              Agent
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100 hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          পরবর্তী ধাপ <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-8 text-center pb-8">
        <p className="text-gray-500">
          ইতিমধ্যেই একাউন্ট আছে? <button onClick={() => navigate('/login')} className="text-green-600 font-bold">লগইন করুন</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
