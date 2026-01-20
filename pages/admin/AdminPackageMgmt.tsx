import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Package as PackageIcon, Trash2, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from '../../firebase';
import { Package } from '../../types';

const AdminPackageMgmt: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Package>>({
    name: '', operator: 'GP', price: 0, validity: '', type: 'Internet', description: ''
  });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "packages"));
      setPackages(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Package));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "packages"), form);
      alert("Package added!");
      setShowModal(false);
      fetchPackages();
    } catch (e) { alert("Error"); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("ডিলিট করতে চান?")) return;
    await deleteDoc(doc(db, "packages", id));
    fetchPackages();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"><ArrowLeft /></button>
          <h1 className="text-xl font-bold text-gray-800">Package Control</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-100"><Plus size={16} /> New Package</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p>Loading...</p> : packages.map(pkg => (
          <div key={pkg.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center"><PackageIcon size={20}/></div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{pkg.name}</h3>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{pkg.operator} • {pkg.validity}</p>
                <p className="text-sm font-bold text-green-600 mt-1">৳{pkg.price}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
              <button onClick={() => handleDelete(pkg.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">নতুন প্যাকেজ যুক্ত করুন</h2>
              <button onClick={() => setShowModal(false)}><X/></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="প্যাকেজের নাম" className="p-4 rounded-xl bg-gray-50 border outline-none" required onChange={e => setForm({...form, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="p-4 rounded-xl bg-gray-50 border outline-none" onChange={e => setForm({...form, operator: e.target.value as any})}>
                  <option value="GP">GP</option><option value="Robi">Robi</option><option value="Airtel">Airtel</option><option value="Banglalink">Banglalink</option>
                </select>
                <input type="number" placeholder="দাম (৳)" className="p-4 rounded-xl bg-gray-50 border outline-none" required onChange={e => setForm({...form, price: parseFloat(e.target.value)})} />
              </div>
              <input type="text" placeholder="মেয়াদ (উদা: ৩০ দিন)" className="p-4 rounded-xl bg-gray-50 border outline-none" required onChange={e => setForm({...form, validity: e.target.value})} />
              <button type="submit" className="bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg mt-4">প্যাকেজ সেভ করুন</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackageMgmt;
