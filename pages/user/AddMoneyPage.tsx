
import React, { useState } from 'react';
import { ArrowLeft, Wallet, Smartphone, CheckCircle2, Hash, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Fix: Removed .ts extensions from import paths.
import { User } from '../../types';
import { sendAdminNotification, formatAddMoneyMsg } from '../../services/telegramService';
import { db, collection, addDoc } from '../../firebase';

interface AddMoneyPageProps {
  user: User | null;
}

const AddMoneyPage: React.FC<AddMoneyPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'Bkash' | 'Nagad' | 'Rocket' | 'Bank' | null>(null);
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const txData = {
        userId: user?.id || 'guest',
        userMobile: user?.mobile || 'N/A',
        amount: parseFloat(amount),
        method: method,
        senderMobile: senderMobile,
        transactionId: transactionId,
        status: 'Pending',
        type: 'Add Money',
        createdAt: new Date().toISOString()
      };

      // 1. Save to Firebase
      await addDoc(collection(db, "transactions"), txData);

      // 2. Send Telegram Notification
      await sendAdminNotification(formatAddMoneyMsg(txData));

      setStep(3);
    } catch (error) {
      console.error("Error submitting transaction: ", error);
      alert("তথ্য জমা দিতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    { id: 'Bkash', name: 'বিকাশ', color: 'bg-pink-600', lightColor: 'bg-pink-50', textColor: 'text-pink-600', icon: <Smartphone size={28} /> },
    { id: 'Nagad', name: 'নগদ', color: 'bg-orange-600', lightColor: 'bg-orange-50', textColor: 'text-orange-600', icon: <Smartphone size={28} /> },
    { id: 'Rocket', name: 'রকেট', color: 'bg-purple-700', lightColor: 'bg-purple-50', textColor: 'text-purple-700', icon: <CreditCard size={28} /> },
    { id: 'Bank', name: 'ব্যাংক', color: 'bg-blue-800', lightColor: 'bg-blue-50', textColor: 'text-blue-800', icon: <Wallet size={28} /> },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <h2 className="text-lg font-bold text-gray-800">অ্যাড মানি</h2>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">পেমেন্ট মেথড সিলেক্ট করুন</p>
            <div className="grid grid-cols-2 gap-4">
              {methods.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setMethod(m.id as any); setStep(2); }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform group hover:border-green-500"
                >
                  <div className={`w-14 h-14 ${m.lightColor} ${m.textColor} rounded-2xl flex items-center justify-center shadow-inner`}>
                    {m.icon}
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-green-600 transition-colors">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                <div className={`w-12 h-12 ${methods.find(m => m.id === method)?.lightColor} ${methods.find(m => m.id === method)?.textColor} rounded-2xl flex items-center justify-center`}>
                   {methods.find(m => m.id === method)?.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{method} Personal</h3>
                  <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    017XXXXXXXX (আমাদের নাম্বার)
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">টাকার পরিমান</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none text-xl font-bold transition-all"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">৳</div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">প্রেরক নাম্বার (যে নাম্বার থেকে পাঠিয়েছেন)</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none font-bold transition-all"
                    value={senderMobile}
                    onChange={(e) => setSenderMobile(e.target.value)}
                  />
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">ট্রানজেকশন আইডি (Transaction ID)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="ABC123XYZ"
                    className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none font-mono transition-all"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !amount || !senderMobile || !transactionId}
              className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:bg-gray-400"
            >
              {loading ? 'প্রসেসিং হচ্ছে...' : 'রিকুয়েস্ট সাবমিট করুন'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="bg-white rounded-[40px] p-10 flex flex-col items-center gap-6 shadow-xl text-center border border-gray-50 mt-10 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-50">
              <CheckCircle2 size={64} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">অনুরোধ সফল!</h3>
              <p className="text-gray-500 mt-2 leading-relaxed">
                আপনার ৳{amount} এর অ্যাড মানি রিকুয়েস্টটি গ্রহণ করা হয়েছে। যাচাই শেষে ব্যালেন্স আপডেট করা হবে।
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
            >
              হোমে ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMoneyPage;
