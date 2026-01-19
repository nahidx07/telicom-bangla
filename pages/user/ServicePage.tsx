import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle2, Wallet, Smartphone, Landmark, Send, Hash, CreditCard } from 'lucide-react';
import { OPERATORS, MOCK_PACKAGES } from './constants';
import { User, Operator } from '../../types';
import { sendAdminNotification, formatOrderMsg } from '../../services/telegramService';

interface ServicePageProps {
  user: User | null;
}

const ServicePage: React.FC<ServicePageProps> = ({ user }) => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);

  const isAddMoneyFlow = type === 'bank' || type === 'rocket';
  const isRechargeFlow = type === 'recharge';

  const getTitle = () => {
    switch(type) {
      case 'internet': return 'ইন্টারনেট প্যাক';
      case 'minute': return 'মিনিট অফার';
      case 'bundle': return 'বান্ডেল প্যাক';
      case 'offers': return 'মাই অফার';
      case 'recharge': return 'ফ্লেক্সিলোড';
      case 'rocket': return 'রকেট অ্যাড মানি';
      case 'bank': return 'ব্যাংক অ্যাড মানি';
      default: return 'সার্ভিস';
    }
  };

  const handleNext = () => {
    if ((isRechargeFlow && step === 2) || (!isRechargeFlow && !isAddMoneyFlow && step === 3)) {
      sendAdminNotification(formatOrderMsg({
        userMobile: user?.mobile || 'N/A',
        targetNumber: mobileNumber,
        operator: selectedOperator,
        type: getTitle(),
        amount: amount
      }));
    }
    setStep(step + 1);
  };

  const handleBack = () => step === 1 ? navigate('/') : setStep(step - 1);

  if ((isRechargeFlow && step === 3) || (isAddMoneyFlow && step === 2) || (!isRechargeFlow && !isAddMoneyFlow && step === 4)) {
    return (
      <div className="flex flex-col h-full bg-white p-6 justify-center items-center text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-50">
          <CheckCircle2 size={56} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">অনুরোধ সফল হয়েছে!</h3>
        <p className="text-gray-500 mt-2 max-w-xs">
          {isAddMoneyFlow 
            ? 'আপনার অ্যাড মানি রিকুয়েস্টটি যাচাই করা হচ্ছে। কিছুক্ষণের মধ্যে ব্যালেন্স যুক্ত হবে।'
            : 'আপনার রিচার্জ অনুরোধটি সফলভাবে গ্রহণ করা হয়েছে।'}
        </p>
        
        <div className="w-full bg-gray-50 p-6 rounded-[32px] mt-8 flex flex-col gap-4 border border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">লেনদেন আইডি</span>
            <span className="font-mono font-bold text-gray-800">#{(Math.random() * 1000000).toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">পরিমান</span>
            <span className="font-bold text-green-600 text-lg">৳{amount || '৯৯'}</span>
          </div>
          {mobileNumber && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">নাম্বার</span>
              <span className="font-bold text-gray-800">{mobileNumber}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-10 py-5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={handleBack} className="p-2 bg-gray-50 rounded-xl"><ArrowLeft size={20} /></button>
        <h2 className="text-lg font-bold text-gray-800">{getTitle()}</h2>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {isRechargeFlow && (
          <>
            {step === 1 && (
              <div className="flex flex-col gap-4 animate-in slide-in-from-right-4">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider ml-1">অপারেটর সিলেক্ট করুন</p>
                <div className="grid grid-cols-2 gap-4">
                  {OPERATORS.map(op => (
                    <button
                      key={op.name}
                      onClick={() => { setSelectedOperator(op.name); handleNext(); }}
                      className="flex flex-col items-center gap-3 p-6 rounded-[32px] border bg-white shadow-sm hover:border-green-500 hover:bg-green-50 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-white shadow-sm">
                        <img src={op.logo} alt={op.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-gray-800">{op.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img src={OPERATORS.find(o => o.name === selectedOperator)?.logo} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Selected Operator</p>
                      <p className="font-bold text-gray-800">{selectedOperator} - Flexiload</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">মোবাইল নাম্বার</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className="w-full p-5 pl-14 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-lg font-bold"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                      <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">রিচার্জের পরিমান (৳)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full p-5 pl-14 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-2xl font-black text-green-600"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">৳</div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={mobileNumber.length < 11 || !amount}
                  onClick={handleNext}
                  className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-green-100 disabled:bg-gray-200 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} /> রিচার্জ করুন
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServicePage;