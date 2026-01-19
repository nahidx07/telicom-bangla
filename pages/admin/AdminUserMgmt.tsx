import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, User as UserIcon, MoreVertical, ShieldAlert, Wallet, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs, doc, updateDoc } from '../../firebase';
import { User } from '../../types';

const AdminUserMgmt: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Use Firestore doc ID as user id
      })) as User[];
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId: string, currentStatus: boolean, mobile: string) => {
    const confirmMsg = currentStatus ? "আনব্লক করতে চান?" : "ব্লক করতে চান?";
    if (!window.confirm(confirmMsg)) return;

    try {
      // Note: We use the document ID to update. In our app, document ID is often the mobile number.
      await updateDoc(doc(db, "users", userId), {
        isBlocked: !currentStatus
      });
      alert("সফলভাবে আপডেট করা হয়েছে!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  const handleUpdateBalance = async (userId: string, currentBalance: number) => {
    const amountStr = window.prompt(`নতুন ব্যালেন্স লিখুন (বর্তমান: ${currentBalance})`, currentBalance.toString());
    if (amountStr === null) return;
    
    const newAmount = parseFloat(amountStr);
    if (isNaN(newAmount)) {
      alert("সঠিক সংখ্যা দিন!");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        balance: newAmount
      });
      alert("ব্যালেন্স আপডেট করা হয়েছে!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating balance:", error);
      alert("আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.mobile?.includes(searchTerm) ||
    u.id?.includes(searchTerm)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search name or mobile..."
            className="w-full p-3 pl-10 rounded-xl bg-white border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p>লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.length > 0 ? filteredUsers.map(u => (
            <div key={u.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${u.isBlocked ? 'border-red-100 bg-red-50/10' : 'border-gray-100'} flex flex-col md:flex-row items-center justify-between gap-4 transition-all`}>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                  <UserIcon />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    {u.name || 'No Name'} 
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${u.type === 'Agent' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {u.type}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">{u.mobile} • <span className={u.isBlocked ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{u.isBlocked ? 'Blocked' : 'Active'}</span></p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {u.id}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Balance</p>
                  <p className="font-bold text-gray-800">৳ {u.balance?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleUpdateBalance(u.id, u.balance)}
                    className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors shadow-sm"
                    title="Add/Edit Balance"
                  >
                    <Wallet size={18} />
                  </button>
                  <button 
                    onClick={() => handleToggleBlock(u.id, u.isBlocked, u.mobile)}
                    className={`p-3 rounded-xl transition-all shadow-sm ${u.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    title={u.isBlocked ? "Unblock User" : "Block User"}
                  >
                    {u.isBlocked ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                  </button>
                  <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
              কোনো ইউজার পাওয়া যায়নি
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUserMgmt;
