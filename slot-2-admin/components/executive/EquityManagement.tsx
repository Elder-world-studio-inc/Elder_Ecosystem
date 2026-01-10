import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/app/context/AdminContext';
import { adminApi, shareholdersApi, usersApi } from '@/lib/api';
import { PieChart, Plus, Users, UserPlus, Coins, Percent } from 'lucide-react';

export default function EquityManagement() {
  const { shareholders, capTable, refreshShareholders } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  
  // Forms
  const [newShareholder, setNewShareholder] = useState({ name: '', type: 'Investor', shares: '', email: '' });
  const [grantData, setGrantData] = useState({ userId: '', shares: '' });

  const fetchEmployees = async () => {
    try {
      const res = await usersApi.getAll();
      setEmployees(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (showGrantModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchEmployees();
    }
  }, [showGrantModal]);

  const handleAddShareholder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shareholdersApi.create(newShareholder);
      await refreshShareholders();
      setShowAddModal(false);
      setNewShareholder({ name: '', type: 'Investor', shares: '', email: '' });
    } catch (e) {
      console.error(e);
      alert('Failed to add shareholder');
    }
  };

  const handleGrantOptions = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.grantOptions(grantData.userId, parseInt(grantData.shares));
      await refreshShareholders(); // Refresh list to see new grant
      // In a real app we would also refresh CapTable context here
      setShowGrantModal(false);
      setGrantData({ userId: '', shares: '' });
      alert('Options granted successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to grant options. Check pool availability.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Shares Issued</p>
              <p className="text-3xl font-bold text-white mt-2">
                {shareholders.reduce((acc, s) => acc + s.shares, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
              <PieChart size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Option Pool Available</p>
              <p className="text-3xl font-bold text-white mt-2">
                {(capTable.pool - capTable.poolUtilized).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">of {capTable.pool.toLocaleString()} Total Pool</p>
            </div>
            <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400">
              <Coins size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Shareholders</p>
              <p className="text-3xl font-bold text-white mt-2">{shareholders.length}</p>
            </div>
            <div className="p-3 bg-green-900/20 rounded-lg text-green-400">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Shareholder Directory</h3>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowGrantModal(true)}
              className="flex items-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-600/50 px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus size={18} /> Grant Options
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} /> Add Shareholder
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-950 text-gray-500 text-xs uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Shares Owned</th>
                <th className="px-6 py-4">Ownership %</th>
                <th className="px-6 py-4">Grant Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {shareholders.map((holder) => (
                <tr key={holder.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{holder.name}</div>
                    <div className="text-xs text-gray-500">{holder.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      holder.type === 'Founder' ? 'bg-blue-900/30 border-blue-800 text-blue-400' : 
                      holder.type === 'Investor' ? 'bg-green-900/30 border-green-800 text-green-400' :
                      'bg-purple-900/30 border-purple-800 text-purple-400'
                    }`}>
                      {holder.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono">
                    {holder.shares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {holder.percentage.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {holder.grantDate ? new Date(holder.grantDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {shareholders.length === 0 && (
                 <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No shareholders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shareholder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Add Shareholder</h3>
            <form onSubmit={handleAddShareholder} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input 
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newShareholder.name}
                  onChange={e => setNewShareholder({...newShareholder, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newShareholder.email}
                  onChange={e => setNewShareholder({...newShareholder, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select 
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newShareholder.type}
                  onChange={e => setNewShareholder({...newShareholder, type: e.target.value})}
                >
                  <option value="Investor">Investor</option>
                  <option value="Founder">Founder</option>
                  <option value="Advisor">Advisor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Shares</label>
                <input 
                  type="number"
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newShareholder.shares}
                  onChange={e => setNewShareholder({...newShareholder, shares: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Add Shareholder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Options Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Grant Employee Options</h3>
            <form onSubmit={handleGrantOptions} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Employee</label>
                <select 
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={grantData.userId}
                  onChange={e => setGrantData({...grantData, userId: e.target.value})}
                >
                  <option value="">Select Employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.username} ({emp.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Number of Options</label>
                <input 
                  type="number"
                  required
                  max={capTable.pool - capTable.poolUtilized}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={grantData.shares}
                  onChange={e => setGrantData({...grantData, shares: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max available: {(capTable.pool - capTable.poolUtilized).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowGrantModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg">Grant Options</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
