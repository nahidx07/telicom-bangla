import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, User as UserIcon, Wallet, ShieldAlert, CheckCircle, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from '../../firebase';
import { User } from '../../types';

const AdminUserMgmt: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleBlock = async (user: User) => {
    if (!window.confirm(`${user.isBlocked ? 'Unblock' : 'Block'} this user?`)) return;
    try {
      await updateDoc(doc(db, "users", user.id), { isBlocked: !user.isBlocked });
      fetchUsers();
    } catch (e) { alert("Error"); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই ইউজারটি ডিলিট করতে চান? এটি আর ফিরে পাওয়া যাবে না।")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      alert("ইউজার ডিলিট করা হয়েছে");
      fetchUsers();
    } catch (e) { alert("Error deleting user"); }
  };

  const handleUpdateBalance = async (user: User) => {
    const val = window.prompt(`নতুন ব্যালেন্স লিখুন (বর্তমান: ${user.balance})`, user.balance.toString());
    if (val === null) return;
    const amount = parseFloat(val);
    if (isNaN(amount)) return alert("সঠিক সংখ্যা দিন");
    try {
      await updateDoc(doc(db, "users", user.id), { balance: amount });
      fetchUsers();
    } catch (e) { alert("Error updating balance"); }
  };

  const filtered = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.mobile?.includes(searchTerm));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"><ArrowLeft /></button>
          <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full p-3 pl-10 rounded-xl bg-white border outline-none" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-center text-gray-400 py-10">লোড হচ্ছে...</p>
        ) : filtered.length > 0 ? filtered.map(u => (
          <div key={u.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${u.isBlocked ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                <UserIcon />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{u.name || 'Unknown'} <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-2">{u.type}</span></h3>
                <p className="text-xs text-gray-500">{u.mobile} • <span className={u.isBlocked ? 'text-red-500' : 'text-green-600'}>{u.isBlocked ? 'Blocked' : 'Active'}</span></p>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Balance</p>
                <p className="font-bold text-gray-800">৳{u.balance.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleUpdateBalance(u)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={18}/></button>
                <button onClick={() => handleToggleBlock(u)} className={`p-2 rounded-lg ${u.isBlocked ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {u.isBlocked ? <CheckCircle size={18}/> : <ShieldAlert size={18}/>}
                </button>
                <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-gray-50 text-red-500 rounded-lg hover:bg-red-50"><Trash2 size={18}/></button>
              </div>
            </div>
          </div>
        )) : <div className="p-10 text-center text-gray-400">No users found</div>}
      </div>
    </div>
  );
};

export default AdminUserMgmt;
