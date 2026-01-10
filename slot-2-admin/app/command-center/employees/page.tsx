"use client";

import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api';
import { Users, Plus, Search, Filter, MoreVertical, Trash2, Edit, Phone, MapPin, History } from 'lucide-react';
import Link from 'next/link';
import EmployeeForm from '@/components/employee/EmployeeForm';
import AuditLogViewer from '@/components/employee/AuditLogViewer';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await usersApi.getAll();
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await usersApi.create(data);
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to create employee:', error);
      alert('Failed to create employee');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingEmployee) return;
    try {
      await usersApi.update(editingEmployee.id, data);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to update employee:', error);
      alert('Failed to update employee');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    try {
      await usersApi.delete(id);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      alert('Failed to delete employee');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Employee Management</h1>
          <p className="text-gray-400 mt-1">Manage personnel, roles, and access controls</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={() => setShowAuditLogs(true)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-700"
            >
              <History size={20} /> Audit Logs
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} /> Add Employee
            </button>
        </div>
      </div>

      {(showAddModal || editingEmployee) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <EmployeeForm 
            initialData={editingEmployee}
            onSubmit={editingEmployee ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowAddModal(false);
              setEditingEmployee(null);
            }}
          />
        </div>
      )}

      {showAuditLogs && <AuditLogViewer onClose={() => setShowAuditLogs(false)} />}

      {/* Filters & Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Employee List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Role & Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
               <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading employees...</td></tr>
            ) : (Array.isArray(employees) && employees.length > 0) ? (
              employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">
                      {employee.username ? employee.username.slice(0, 2).toUpperCase() : '??'}
                    </div>
                    <div>
                      <div className="font-medium text-white">{employee.fullName || employee.username || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-300">{employee.position || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{employee.department || 'General'} • <span className="capitalize">{employee.role}</span></div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    employee.status === 'active' ? 'bg-green-900/20 text-green-400 border-green-900' : 
                    employee.status === 'inactive' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                    'bg-red-900/20 text-red-400 border-red-900'
                  }`}>
                    {employee.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                    <div className="text-xs text-gray-400 flex flex-col gap-1">
                        {employee.contactDetails?.phone && <span className="flex items-center gap-1"><Phone size={12}/> {employee.contactDetails.phone}</span>}
                        {employee.contactDetails?.location && <span className="flex items-center gap-1"><MapPin size={12}/> {employee.contactDetails.location}</span>}
                    </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingEmployee(employee)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(employee.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))) : (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}