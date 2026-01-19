
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, RefreshCw, Rocket, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppSettings } from '../../types';

const UpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>({
    latestVersion: '1.0.0',
    currentVersion: '1.0.0',
    updateUrl: 'https://example.com/download',
    maintenanceMode: false,
    notice: ''
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const hasUpdate = settings.latestVersion !== settings.currentVersion;

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <h2 className="text-lg font-bold text-gray-800">অ্যাপ আপডেট</h2>
      </div>

      <div className="p-8 flex flex-col items-center text-center gap-8">
        <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 border-4 border-green-100 border-dashed rounded-full animate-spin duration-[10s]"></div>
          <Rocket size={80} className="text-green-600" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {hasUpdate ? 'নতুন আপডেট পাওয়া গেছে!' : 'আপনার অ্যাপটি লেটেস্ট'}
          </h1>
          <p className="text-gray-500 text-sm px-4">
            অ্যাপের সেরা পারফরম্যান্স এবং নতুন সব ফিচার পেতে সর্বদা লেটেস্ট ভার্সন ব্যবহার করুন।
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="bg-gray-50 p-6 rounded-[32px] flex flex-col gap-4 border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Current Version</span>
              <span className="font-bold text-gray-800">{settings.currentVersion}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Latest Version</span>
              <span className="font-bold text-green-600">{settings.latestVersion}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <a
              href={settings.updateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <Download size={24} /> {hasUpdate ? 'এখনই আপডেট করুন' : 'অ্যাপ পুনরায় ডাউনলোড'}
            </a>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 text-gray-400 font-bold flex items-center justify-center gap-2 hover:text-gray-600 transition-colors"
            >
              <RefreshCw size={18} /> চেক ফর আপডেট
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-start gap-3 border border-blue-100 max-w-sm">
          <ShieldCheck className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <p className="text-xs text-blue-800 text-left leading-relaxed font-medium">
            আমরা নিয়মিত সিকিউরিটি আপডেট প্রদান করি। অনুগ্রহ করে অফিসিয়াল সোর্স ছাড়া অন্য কোনো জায়গা থেকে অ্যাপ ডাউনলোড করবেন না।
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
