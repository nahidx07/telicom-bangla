import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, Smartphone, CheckCircle2, Hash, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { sendAdminNotification, formatAddMoneyMsg } from '../../services/telegramService';
import { db, collection, addDoc, doc, getDoc } from '../../firebase';

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
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01XXXXXXXXX', nagad: '01XXXXXXXXX', rocket: '01XXXXXXXXX'
  });

  useEffect(() => {
    const fetchNumbers = async () => {
      const snap = await getDoc(doc(db, "settings", "payment_numbers"));
      if (snap.exists()) setPaymentNumbers(snap.data() as any);
    };
    fetchNumbers();
  }, []);

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
        date: new Date().toISOString()
      };
      await addDoc(collection(db, "transactions"), txData);
      await sendAdminNotification(formatAddMoneyMsg(txData));
      setStep(3);
    } catch (error) {
      alert("তথ্য জমা দিতে সমস্যা হয়েছে।");
    } finally { setLoading(false); }
  };

  const getTargetNumber = () => {
    if (method === 'Bkash') return paymentNumbers.bkash;
    if (method === 'Nagad') return paymentNumbers.nagad;
    if (method === 'Rocket') return paymentNumbers.rocket;
    return 'N/A';
  };

  const methods = [
    { id: 'Bkash', name: 'বিকাশ', lightColor: 'bg-pink-50', textColor: 'text-pink-600', icon: <Smartphone size={28} /> },
    { id: 'Nagad', name: 'নগদ', lightColor: 'bg-orange-50', textColor: 'text-orange-600', icon: <Smartphone size={28} /> },
    { id: 'Rocket', name: 'রকেট', lightColor: 'bg-purple-50', textColor: 'text-purple-700', icon: <CreditCard size={28} /> },
    { id: 'Bank', name: 'ব্যাংক', lightColor: 'bg-blue-50', textColor: 'text-blue-800', icon: <Wallet size={28} /> },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <h2 className="text-lg font-bold text-gray-800">অ্যাড মানি</h2>
      </div>

      <div className="p-4">
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {methods.map(m => (
              <button key={m.id} onClick={() => { setMethod(m.id as any); setStep(2); }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all">
                <div className={`w-14 h-14 ${m.lightColor} ${m.textColor} rounded-2xl flex items-center justify-center`}>{m.icon}</div>
                <span className="font-bold text-gray-700">{m.name}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <div className="bg-blue-50 p-4 rounded-2xl">
                <p className="text-xs text-blue-600 font-bold mb-1">প্রথমে আমাদের এই নাম্বারে টাকা পাঠান:</p>
                <p className="text-xl font-black text-blue-900">{getTargetNumber()}</p>
                <p className="text-[10px] text-blue-500 font-bold uppercase mt-1">{method} Personal</p>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">টাকার পরিমান</label>
                <input type="number" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">আপনার নাম্বার</label>
                <input type="tel" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" value={senderMobile} onChange={e => setSenderMobile(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">TrxID</label>
                <input type="text" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-mono" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl">{loading ? 'প্রসেসিং...' : 'রিকুয়েস্ট পাঠান'}</button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-20 px-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={48} /></div>
            <h3 className="text-2xl font-bold text-gray-800">অপেক্ষা করুন</h3>
            <p className="text-gray-500 mt-2">আপনার অনুরোধটি যাচাই করা হচ্ছে। ২০-৩০ মিনিটের মধ্যে ব্যালেন্স যুক্ত হবে।</p>
            <button onClick={() => navigate('/')} className="w-full mt-10 py-5 bg-gray-900 text-white rounded-2xl font-bold">হোমে ফিরে যান</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMoneyPage;
