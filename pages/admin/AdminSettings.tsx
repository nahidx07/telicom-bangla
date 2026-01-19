
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Globe, Smartphone, Bell, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppSettings } from '../../types';

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>({
    latestVersion: '1.0.0',
    currentVersion: '1.0.0',
    updateUrl: 'https://telicom-bangla.com/download',
    maintenanceMode: false,
    notice: 'এখনই আপনার জিপি সিমের জন্য সেরা অফারটি লুফে নিন!'
  });

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">App Configuration</h1>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Smartphone size={20} className="text-blue-500" /> Update Management
          </h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Latest App Version</label>
            <input
              type="text"
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={settings.latestVersion}
              onChange={(e) => setSettings({...settings, latestVersion: e.target.value})}
              placeholder="e.g. 2.1.0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Download / Update URL</label>
            <div className="relative">
              <input
                type="url"
                className="w-full p-4 pl-12 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={settings.updateUrl}
                onChange={(e) => setSettings({...settings, updateUrl: e.target.value})}
                placeholder="https://..."
              />
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Bell size={20} className="text-orange-500" /> Notifications & Status
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Home Screen Notice</label>
            <textarea
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24"
              value={settings.notice}
              onChange={(e) => setSettings({...settings, notice: e.target.value})}
              placeholder="Enter ticker notice..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <p className="text-sm font-bold text-red-900">Maintenance Mode</p>
                <p className="text-[10px] text-red-600">Restrict app access</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 flex items-center gap-2 hover:bg-green-700 transition-all"
          >
            <Save size={20} /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
