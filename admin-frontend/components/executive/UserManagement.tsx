import React, { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api';
import { Search, Shield, Key, Edit, Save, X, Lock, History, UserCheck, Trash2, Plus } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  divisionId?: string;
  nexus_level?: number;
  shard_balance?: number;
  mfaEnabled?: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  targetUserId: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user', divisionId: '' });
  const [passwordResetUser, setPasswordResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [showLogs, setShowLogs] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, logsRes] = await Promise.all([
        usersApi.getAll(),
        usersApi.getAuditLogs()
      ]);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
        await usersApi.create(newUser);
        setCreatingUser(false);
        setNewUser({ username: '', email: '', password: '', role: 'user', divisionId: '' });
        fetchData();
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user. Please try again.');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await usersApi.update(editingUser.id, editingUser);
      setEditingUser(null);
      fetchData(); // Refresh data and logs
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordResetUser || !newPassword) return;
    try {
      await usersApi.resetPassword(passwordResetUser.id, newPassword);
      setPasswordResetUser(null);
      setNewPassword('');
      fetchData(); // Refresh logs
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const toggleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = async (action: 'reset_mfa' | 'deactivate') => {
      // Mock implementation for bulk actions
      alert(`Bulk action ${action} triggered for ${selectedUsers.length} users. Backend support needed for batch operations.`);
      // In a real app, I'd loop through selectedUsers and call API, or call a batch API endpoint.
      setSelectedUsers([]);
  };

  const filteredUsers = users.filter(user => 
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.divisionId && user.divisionId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
            <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text"
                placeholder="Search users..."
                className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1">
                    <span className="text-sm text-gray-400">{selectedUsers.length} selected</span>
                    <button 
                        onClick={() => handleBulkAction('reset_mfa')}
                        className="p-1 hover:text-white text-gray-400 text-xs uppercase font-medium"
                    >
                        Reset MFA
                    </button>
                    <div className="w-px h-4 bg-gray-700"></div>
                     <button 
                        onClick={() => handleBulkAction('deactivate')}
                        className="p-1 hover:text-red-400 text-gray-400 text-xs uppercase font-medium"
                    >
                        Deactivate
                    </button>
                </div>
            )}
        </div>

        <button 
          onClick={() => setShowLogs(!showLogs)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showLogs ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'}`}
        >
          <History size={18} />
          {showLogs ? 'Hide Audit Logs' : 'View Audit Logs'}
        </button>

        <button 
            onClick={() => setCreatingUser(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white ml-2"
        >
            <Plus size={18} />
            Create User
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User List */}
        <div className={`${showLogs ? 'lg:col-span-2' : 'lg:col-span-3'} bg-gray-900 border border-gray-800 rounded-xl overflow-hidden`}>
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Shield size={20} className="text-blue-500" />
              User Directory
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-950 text-gray-500 uppercase tracking-wider font-medium">
                <tr>
                  <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                  </th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Division</th>
                  <th className="px-6 py-4">MFA</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map(user => (
                  <tr key={user.id} className={`hover:bg-gray-800/50 transition-colors ${selectedUsers.includes(user.id) ? 'bg-blue-900/10' : ''}`}>
                    <td className="px-6 py-4">
                         <input 
                            type="checkbox" 
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleSelectUser(user.id)}
                            className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          />
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${
                        user.role === 'admin' ? 'bg-purple-900/30 border-purple-800 text-purple-400' : 
                        user.role === 'division' ? 'bg-blue-900/30 border-blue-800 text-blue-400' :
                        'bg-gray-800 border-gray-700 text-gray-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">{user.divisionId || '-'}</td>
                    <td className="px-6 py-4">
                        {user.mfaEnabled ? (
                            <span className="flex items-center gap-1 text-green-500 text-xs">
                                <UserCheck size={14} /> On
                            </span>
                        ) : (
                            <span className="text-gray-600 text-xs">Off</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                          title="Edit Permissions"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => setPasswordResetUser(user)}
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                          title="Reset Password"
                        >
                          <Key size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs Sidebar */}
        {showLogs && (
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
             <div className="p-6 border-b border-gray-800">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <History size={20} className="text-orange-500" />
                Audit Logs
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {logs.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No logs found.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="p-3 bg-gray-950 rounded-lg border border-gray-800 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-blue-400 font-medium text-xs">{log.action}</span>
                      <span className="text-gray-600 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-300 mb-1">{log.details}</p>
                    <p className="text-gray-600 text-xs">By: <span className="text-gray-500">{log.performedBy}</span></p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {creatingUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Create New User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input 
                  type="text"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input 
                  type="password"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select 
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="division">Division Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {newUser.role === 'division' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Division</label>
                    <select 
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                      value={newUser.divisionId}
                      onChange={(e) => setNewUser({...newUser, divisionId: e.target.value})}
                    >
                      <option value="">Select Division</option>
                      <option value="creative">Creative</option>
                      <option value="operations">Operations</option>
                      <option value="interactive">Interactive</option>
                    </select>
                  </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setCreatingUser(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit User: {editingUser.username}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select 
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="division">Division Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Division</label>
                <select 
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                  value={editingUser.divisionId || ''}
                  onChange={(e) => setEditingUser({...editingUser, divisionId: e.target.value || undefined})}
                >
                  <option value="">None</option>
                  <option value="creative">Creative</option>
                  <option value="operations">Operations</option>
                  <option value="wayfarer">Interactive (Wayfarer)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                 <input 
                    type="checkbox"
                    id="mfaToggle"
                    className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    checked={editingUser.mfaEnabled || false}
                    onChange={(e) => setEditingUser({...editingUser, mfaEnabled: e.target.checked})}
                 />
                 <label htmlFor="mfaToggle" className="text-sm text-gray-400">Enable Multi-Factor Authentication</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {passwordResetUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="text-red-400" size={20} />
              Reset Password
            </h3>
            <p className="text-gray-400 mb-4">
              Enter a new password for <span className="text-white font-medium">{passwordResetUser.username}</span>.
            </p>
            
            <div className="space-y-4">
              <input 
                type="password"
                placeholder="New Password"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => { setPasswordResetUser(null); setNewPassword(''); }}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleResetPassword}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-2"
              >
                <Key size={16} /> Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
