
import React from 'react';
import { History, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { User } from '../../types';

interface TransactionsPageProps {
  user: User | null;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ user }) => {
  const transactions = [
    { id: '1', type: 'Recharge', amount: 199, status: 'Success', date: '20 Oct, 2023', number: '01700000000' },
    { id: '2', type: 'Add Money', amount: 1000, status: 'Success', date: '19 Oct, 2023', number: 'Bkash' },
    { id: '3', type: 'Internet', amount: 299, status: 'Pending', date: '18 Oct, 2023', number: '01800000000' },
    { id: '4', type: 'Minute', amount: 50, status: 'Failed', date: '17 Oct, 2023', number: '01900000000' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <History size={24} className="text-gray-400" /> লেনদেন ইতিহাস
        </h2>
        <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-400">
          <Filter size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.map(tx => (
          <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                tx.type === 'Add Money' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
              }`}>
                {tx.type === 'Add Money' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{tx.type === 'Add Money' ? 'অ্যাড মানি' : 'ফ্লেক্সিলোড / প্যাক'}</h3>
                <p className="text-xs text-gray-500">{tx.number} • {tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-lg ${tx.type === 'Add Money' ? 'text-green-600' : 'text-gray-800'}`}>
                {tx.type === 'Add Money' ? '+' : '-'} ৳{tx.amount}
              </p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                tx.status === 'Success' ? 'bg-green-50 text-green-600' :
                tx.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                'bg-red-50 text-red-600'
              }`}>
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsPage;
