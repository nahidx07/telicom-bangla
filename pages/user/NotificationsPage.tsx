
import React from 'react';
import { Bell, ArrowLeft, Info, Gift, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const notifications = [
    { id: '1', title: 'ধামাকা অফার!', message: 'জিপি ফাইভ জি সিমের সাথে ৫ জিবি ফ্রি ইন্টারনেট। অফারটি চেক করুন মাই অফার সেকশনে।', type: 'offer', date: '১০ মিনিট আগে' },
    { id: '2', title: 'রিচার্জ সফল', message: 'আপনার ০১৭XXXXXXXX নাম্বারে ৫০০ টাকা রিচার্জ সফল হয়েছে।', type: 'success', date: '২ ঘণ্টা আগে' },
    { id: '3', title: 'সিস্টেম আপডেট', message: 'আগামী রাত ২টা থেকে ৪টা পর্যন্ত এপ মেইনটেনেন্স এর জন্য বন্ধ থাকবে।', type: 'info', date: '৫ ঘণ্টা আগে' },
    { id: '4', title: 'ট্রানজেকশন ফেইল', message: 'আপনার রকেট ক্যাশআউট রিকুয়েস্ট বাতিল করা হয়েছে। পর্যাপ্ত ব্যালেন্স নেই।', type: 'error', date: 'গতকাল' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'offer': return <Gift className="text-pink-500" />;
      case 'info': return <Info className="text-blue-500" />;
      case 'error': return <AlertCircle className="text-red-500" />;
      default: return <Bell className="text-green-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <h2 className="text-lg font-bold text-gray-800">নোটিফিকেশন</h2>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {notifications.map(notif => (
          <div key={notif.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center">
              {getIcon(notif.type)}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 leading-tight">{notif.title}</h3>
                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2 uppercase tracking-tighter">{notif.date}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
