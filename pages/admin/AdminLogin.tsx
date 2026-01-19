
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Key, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
      navigate('/admin');
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 flex flex-col gap-8 border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Secure Management System</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="Admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Secret Key</label>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            Access Dashboard <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Powered by Telicom Bangla Secure Nodes v2.0
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
