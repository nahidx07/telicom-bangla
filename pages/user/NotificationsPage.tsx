import React, { useState, useEffect } from 'react';
import { Bell, ArrowLeft, Info, Gift, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs } from '../../firebase';

interface LiveNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const snap = await getDocs(collection(db, "notifications"));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiveNotification));
        setNotifications(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchNotif();
  }, []);

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
        {loading ? (
          <p className="text-center py-10 text-gray-400">অপেক্ষা করুন...</p>
        ) : notifications.length > 0 ? notifications.map(notif => (
          <div key={notif.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center">
              {getIcon(notif.type)}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 leading-tight">{notif.title}</h3>
                <span className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap ml-2">
                  {new Date(notif.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center text-gray-400">কোনো নোটিফিকেশন নেই</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
