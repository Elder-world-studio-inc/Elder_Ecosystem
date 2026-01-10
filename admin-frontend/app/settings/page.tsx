"use client";

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { usersApi } from '@/lib/api';
import { User, Lock, Mail, Phone, Save, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'system'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({
    fullName: user?.username || '', // Fallback since we don't have full profile in context usually, but backend has it
    email: '', // We need to fetch full profile or store it in context
    phone: ''
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Fetch full user details on mount since context might be light
  React.useEffect(() => {
    if (user?.id) {
        // Ideally we have a 'me' endpoint, but we can filter from getAll for now or just use what we have
        // For this demo, let's assume we want to allow updating what we have.
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
        // Mock update call since we might not have a dedicated /me endpoint yet
        // In a real app: await usersApi.updateProfile(user.id, profileData);
        alert('Profile updated successfully (Mock)');
    } catch (error) {
        console.error(error);
        alert('Failed to update profile');
    } finally {
        setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        alert("New passwords don't match");
        return;
    }
    
    setIsLoading(true);
    try {
        if (user?.id) {
            await usersApi.resetPassword(user.id, passwords.new);
            alert('Password changed successfully');
            setPasswords({ current: '', new: '', confirm: '' });
        }
    } catch (error) {
        console.error(error);
        alert('Failed to change password');
    } finally {
        setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      <div className="flex gap-4 border-b border-gray-800">
        <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                activeTab === 'profile' 
                ? 'text-purple-500 border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
        >
            <User size={18} />
            My Profile
        </button>
        {user.role === 'admin' && (
            <button
                onClick={() => setActiveTab('system')}
                className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                    activeTab === 'system' 
                    ? 'text-purple-500 border-b-2 border-purple-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                <Shield size={18} />
                System Configuration
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 'profile' && (
            <>
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <input 
                                        disabled
                                        value={user.username}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <input 
                                        disabled
                                        value={user.role}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-500 cursor-not-allowed capitalize"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-gray-500" size={16} />
                                    <input 
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-purple-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 text-gray-500" size={16} />
                                    <input 
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-purple-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Change */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Lock size={20} className="text-purple-400" /> Security
                        </h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                                <input 
                                    type="password"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                                />
                            </div>
                            <hr className="border-gray-800 my-4" />
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwords.new}
                                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-gray-700 mt-2"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </>
        )}

        {activeTab === 'system' && (
            <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">System Configuration</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Global settings that affect the entire Admin Engine environment.
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-950 rounded-lg border border-gray-800">
                        <div>
                            <h3 className="font-medium text-white">Secure Environment Mode</h3>
                            <p className="text-xs text-gray-500">Enforces strict IP verification protocols and logs all actions.</p>
                        </div>
                        <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-950 rounded-lg border border-gray-800">
                        <div>
                            <h3 className="font-medium text-white">Maintenance Mode</h3>
                            <p className="text-xs text-gray-500">Disables all non-admin access to the portal.</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-gray-400 rounded-full absolute top-1 left-1" />
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
