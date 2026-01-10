"use client";

import { useState } from 'react';
import { Users, Mail, Phone, MapPin, Briefcase, Shield, X } from 'lucide-react';

interface EmployeeFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EmployeeForm = ({ initialData, onSubmit, onCancel, isLoading }: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    username: initialData?.username || '',
    position: initialData?.position || '',
    department: initialData?.department || '',
    role: initialData?.role || 'user',
    divisionId: initialData?.divisionId || '',
    status: initialData?.status || 'active',
    phone: initialData?.contactDetails?.phone || '',
    location: initialData?.contactDetails?.location || '',
    password: '', // Only for new users
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      contactDetails: {
        phone: formData.phone,
        location: formData.location
      }
    };
    onSubmit(submitData);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-purple-500" />
          {initialData ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Personal Info</h3>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-500" size={14} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                required
                disabled={!!initialData} // Username immutable on edit usually
              />
            </div>

            {!initialData && (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Initial Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Role & Position</h3>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Position / Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-gray-500" size={14} />
                <input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="Executive">Executive</option>
                  <option value="Creative">Creative</option>
                  <option value="Operations">Operations</option>
                  <option value="Interactive">Interactive</option>
                  <option value="Legal">Legal</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Division ID</label>
                <select
                  name="divisionId"
                  value={formData.divisionId}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">None</option>
                  <option value="creative">Creative</option>
                  <option value="operations">Operations</option>
                  <option value="wayfarer">Wayfarer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 text-gray-500" size={14} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="user">User</option>
                    <option value="division">Division Lead</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-t border-gray-800 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 text-gray-500" size={14} />
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 text-gray-500" size={14} />
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;