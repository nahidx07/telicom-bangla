
import React from 'react';
import { ArrowLeft, Plus, Package, Edit2, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PACKAGES } from '../../constants';

const AdminPackageMgmt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Package Control</h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-bold">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-100">
            <Plus size={16} /> New Package
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Package Name</th>
              <th className="px-6 py-4">Operator</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Validity</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_PACKAGES.map(pkg => (
              <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <Package size={16} />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{pkg.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">{pkg.operator}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">৳ {pkg.price}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{pkg.validity}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPackageMgmt;
