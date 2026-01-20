
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Smartphone, Send } from 'lucide-react';
import { OPERATORS } from './constants';
import { User, Operator, TransactionType } from '../../types';
import { sendAdminNotification, formatOrderMsg } from '../../services/telegramService';
import { db, collection, addDoc } from '../../firebase';

interface ServicePageProps {
  user: User | null;
}

const ServicePage: React.FC<ServicePageProps> = ({ user }) => {
  const { type: pathType } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const getTransactionType = (): TransactionType => {
    switch(pathType) {
      case 'internet': return 'Internet';
      case 'minute': return 'Minute';
      case 'bundle': return 'Offer';
      case 'offers': return 'Offer';
      case 'recharge': return 'Recharge';
      case 'bank': return 'Bank Withdraw';
      default: return 'Recharge';
    }
  };

  const getLabel = () => {
    switch(pathType) {
      case 'internet': return 'ইন্টারনেট প্যাক';
      case 'minute': return 'মিনিট অফার';
      case 'bundle': return 'বান্ডেল প্যাক';
      case 'offers': return 'মাই অফার';
      case 'recharge': return 'ফ্লেক্সিলোড';
      case 'bank': return 'ব্যাংক উইথড্র';
      case 'rocket': return 'রকেট ট্রান্সফার';
      default: return 'সার্ভিস অর্ডার';
    }
  };

  const handleSubmitOrder = async () => {
    if (!user || !selectedOperator) return;
    setLoading(true);
    
    const txType = getTransactionType();
    const txData = {
      userId: user.id,
      userMobile: user.mobile,
      type: txType,
      operator: selectedOperator,
      number: mobileNumber,
      amount: parseFloat(amount),
      status: 'Pending',
      date: new Date().toISOString(),
      description: `${selectedOperator} ${getLabel()} for ${mobileNumber}`
    };

    try {
      // 1. Save to Database
      await addDoc(collection(db, "transactions"), txData);
      
      // 2. Notify Admin via Telegram
      await sendAdminNotification(formatOrderMsg({
        userMobile: user.mobile,
        targetNumber: mobileNumber,
        operator: selectedOperator,
        type: txType,
        category: getLabel(),
        amount: amount
      }));

      setStep(3);
    } catch (error) {
      console.error("Order error:", error);
      alert("অর্ডার সম্পন্ন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => step === 1 ? navigate('/') : setStep(step - 1);

  if (step === 3) {
    return (
      <div className="flex flex-col h-full bg-white p-6 justify-center items-center text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">অনুরোধ পাঠানো হয়েছে!</h3>
        <p className="text-gray-500 mt-2 px-4 text-sm">আমাদের এডমিন আপনার অনুরোধটি যাচাই করছেন। শীঘ্রই আপনার নাম্বারে রিচার্জ সম্পন্ন হবে।</p>
        
        <div className="w-full bg-gray-50 p-6 rounded-3xl mt-8 flex flex-col gap-3 border border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">অপারেটর</span>
            <span className="font-bold">{selectedOperator}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">পরিমান</span>
            <span className="font-bold text-green-600">৳{amount}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">নাম্বার</span>
            <span className="font-bold">{mobileNumber}</span>
          </div>
        </div>

        <button onClick={() => navigate('/')} className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-bold">হোমে ফিরে যান</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={handleBack} className="p-2 bg-gray-50 rounded-xl"><ArrowLeft size={20} /></button>
        <h2 className="text-lg font-bold text-gray-800">{getLabel()}</h2>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider ml-1">অপারেটর বেছে নিন</p>
            <div className="grid grid-cols-2 gap-4">
              {OPERATORS.map(op => (
                <button
                  key={op.name}
                  onClick={() => { setSelectedOperator(op.name); setStep(2); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-[32px] border bg-white shadow-sm hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                    <img src={op.logo} alt={op.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-gray-800">{op.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">মোবাইল নাম্বার</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">পরিমান (৳)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all text-xl font-bold text-green-600"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={mobileNumber.length < 11 || !amount || loading}
              onClick={handleSubmitOrder}
              className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-lg disabled:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} /> {loading ? 'লোড হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
