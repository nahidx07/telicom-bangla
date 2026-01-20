import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Smartphone, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, doc, getDoc, setDoc } from '../../firebase';

const AdminPaymentMgmt: React.FC = () => {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState({
    bkash: '01XXXXXXXXX',
    nagad: '01XXXXXXXXX',
    rocket: '01XXXXXXXXX',
    bank: 'N/A'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNumbers = async () => {
      const snap = await getDoc(doc(db, "settings", "payment_numbers"));
      if (snap.exists()) setNumbers(snap.data() as any);
    };
    fetchNumbers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "payment_numbers"), numbers);
      alert("নাম্বারগুলো সফলভাবে সেভ করা হয়েছে!");
    } catch (e) { alert("Error saving numbers"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"><ArrowLeft /></button>
        <h1 className="text-xl font-bold text-gray-800">Payment Settings</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 max-w-lg">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Bkash Personal</label>
          <input 
            type="text" 
            className="w-full p-4 rounded-xl bg-gray-50 border outline-none focus:ring-2 focus:ring-pink-500"
            value={numbers.bkash}
            onChange={e => setNumbers({...numbers, bkash: e.target.value})}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Nagad Personal</label>
          <input 
            type="text" 
            className="w-full p-4 rounded-xl bg-gray-50 border outline-none focus:ring-2 focus:ring-orange-500"
            value={numbers.nagad}
            onChange={e => setNumbers({...numbers, nagad: e.target.value})}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Rocket Personal</label>
          <input 
            type="text" 
            className="w-full p-4 rounded-xl bg-gray-50 border outline-none focus:ring-2 focus:ring-purple-500"
            value={numbers.rocket}
            onChange={e => setNumbers({...numbers, rocket: e.target.value})}
          />
        </div>
        
        <button 
          disabled={loading}
          type="submit" 
          className="mt-4 bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all"
        >
          <Save size={20}/> {loading ? 'সেভ হচ্ছে...' : 'নাম্বার আপডেট করুন'}
        </button>
      </form>
    </div>
  );
};

export default AdminPaymentMgmt;
