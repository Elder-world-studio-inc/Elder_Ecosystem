"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { assetApi } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

interface AssetPacket {
  assetId?: string;
  creatorId: string;
  divisionId?: string; // Added divisionId to interface
  ipStatus: 'Work_for_Hire' | 'Siron_Royalty_18';
  legalSignatureStatus: 'NULL' | string;
  status: 'DRAFT' | 'IN-REVIEW' | 'SIGNED';
  contentMetadata: {
    title: string;
    genre: string;
    type: 'Book' | 'Comic' | 'Script' | '3D_Model' | 'Environment';
  };
  financialTag: {
    shardPrice: number;
    releaseDate: string;
  };
  estimatedValue?: number; // Added estimatedValue to interface
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  asset?: AssetPacket | null; // If null, creating new
}

export default function AssetModal({ isOpen, onClose, onSuccess, asset }: AssetModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<AssetPacket>>({
    ipStatus: 'Work_for_Hire',
    contentMetadata: {
      title: '',
      genre: '',
      type: '3D_Model'
    },
    financialTag: {
      shardPrice: 0,
      releaseDate: ''
    }
  });

  useEffect(() => {
    if (asset) {
      setFormData(asset);
    } else {
      // Reset for create
      setFormData({
        ipStatus: 'Work_for_Hire',
        contentMetadata: {
          title: '',
          genre: '',
          type: '3D_Model'
        },
        financialTag: {
          shardPrice: 0,
          releaseDate: '' // YYYY-MM-DD
        }
      });
    }
  }, [asset, isOpen]);

  if (!isOpen) return null;

  const handleChange = (section: string, field: string, value: any) => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'contentMetadata') {
      setFormData(prev => ({
        ...prev,
        contentMetadata: { ...prev.contentMetadata!, [field]: value }
      }));
    } else if (section === 'financialTag') {
      setFormData(prev => ({
        ...prev,
        financialTag: { ...prev.financialTag!, [field]: value }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (asset && asset.assetId) {
        // Update
        await assetApi.update(asset.assetId, formData);
      } else {
        // Create
        // Handle file upload
        const data = new FormData();
        data.append('creatorId', user?.id || 'unknown');
        if (formData.divisionId) data.append('divisionId', formData.divisionId); // Ensure divisionId is passed if available
        data.append('ipStatus', formData.ipStatus || 'Work_for_Hire');
        data.append('contentMetadata', JSON.stringify(formData.contentMetadata));
        data.append('financialTag', JSON.stringify(formData.financialTag));
        if (formData.estimatedValue) data.append('estimatedValue', String(formData.estimatedValue));

        if (file) {
            data.append('file', file);
        }

        await assetApi.create(data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Failed to save asset.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!asset?.assetId) return;
    setLoading(true);
    try {
      await assetApi.updateStatus(asset.assetId, newStatus, user?.role || 'division');
      onSuccess(); // Refresh parent
      onClose();
    } catch (error: any) {
        console.error("Error updating status:", error);
        alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = asset?.status === 'SIGNED' && user?.role !== 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50 sticky top-0 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-white">
              {asset ? 'Edit Asset Packet' : 'New Asset Packet'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {asset?.assetId ? `ID: ${asset.assetId}` : 'Generates ID upon creation'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Bar */}
          {asset && (
            <div className="flex items-center justify-between bg-gray-950 p-4 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  asset.status === 'SIGNED' ? 'bg-green-500' : 
                  asset.status === 'IN-REVIEW' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <span className="font-mono text-sm font-bold text-white">{asset.status}</span>
              </div>
              
              <div className="flex gap-2">
                {asset.status === 'DRAFT' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('IN-REVIEW')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded hover:bg-yellow-500/20 text-xs font-medium transition-colors"
                  >
                    <Send size={14} />
                    Submit for Review
                  </button>
                )}
                
                {asset.status === 'IN-REVIEW' && user?.role === 'admin' && (
                   <button
                   type="button"
                   onClick={() => handleStatusChange('SIGNED')}
                   className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded hover:bg-green-500/20 text-xs font-medium transition-colors"
                 >
                   <CheckCircle size={14} />
                   Sign & Approve
                 </button>
                )}

                 {asset.status === 'IN-REVIEW' && user?.role === 'admin' && (
                   <button
                   type="button"
                   onClick={() => handleStatusChange('DRAFT')}
                   className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 text-xs font-medium transition-colors"
                 >
                   <AlertCircle size={14} />
                   Reject
                 </button>
                )}
              </div>
            </div>
          )}

          {/* Content Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Content Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.contentMetadata?.title}
                  onChange={(e) => handleChange('contentMetadata', 'title', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Genre</label>
                <input
                  type="text"
                  value={formData.contentMetadata?.genre}
                  onChange={(e) => handleChange('contentMetadata', 'genre', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select
                  value={formData.contentMetadata?.type}
                  onChange={(e) => handleChange('contentMetadata', 'type', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                >
                  {/* Filter types based on division */}
                  {(user?.divisionId === 'creative' || user?.role === 'admin') && (
                    <>
                      <option value="Book" className="bg-gray-900">Book</option>
                      <option value="Comic" className="bg-gray-900">Comic</option>
                      <option value="Script" className="bg-gray-900">Script</option>
                    </>
                  )}
                  {(user?.divisionId === 'interactive' || user?.role === 'admin') && (
                    <>
                      <option value="3D_Model" className="bg-gray-900">3D Model</option>
                      <option value="Environment" className="bg-gray-900">Environment</option>
                    </>
                  )}
                  {/* Fallback if no specific division or admin */}
                  {!user?.divisionId && user?.role !== 'admin' && (
                     <>
                      <option value="Book" className="bg-gray-900">Book</option>
                      <option value="Comic" className="bg-gray-900">Comic</option>
                      <option value="Script" className="bg-gray-900">Script</option>
                      <option value="3D_Model" className="bg-gray-900">3D Model</option>
                      <option value="Environment" className="bg-gray-900">Environment</option>
                     </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Financial Tag */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Financial Tag</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!['3D_Model', 'Environment'].includes(formData.contentMetadata?.type || '') && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Shard Price</label>
                  <input
                    type="number"
                    value={formData.financialTag?.shardPrice}
                    onChange={(e) => handleChange('financialTag', 'shardPrice', Number(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Release Date</label>
                <input
                  type="date"
                  value={formData.financialTag?.releaseDate}
                  onChange={(e) => handleChange('financialTag', 'releaseDate', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* IP Status */}
          <div className="space-y-4 pt-4 border-t border-white/10">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal & IP</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">IP Status</label>
                    <select
                        value={formData.ipStatus}
                        onChange={(e) => handleChange('root', 'ipStatus', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    >
                        <option value="Work_for_Hire" className="bg-gray-900">Work for Hire (Standard)</option>
                        <option value="Siron_Royalty_18" className="bg-gray-900">Siron Royalty 18 (Special)</option>
                    </select>
                </div>
                <div>
                     <label className="block text-xs text-gray-500 mb-1">Legal Signature</label>
                     <div className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-gray-400 text-sm">
                         {asset?.legalSignatureStatus === 'NULL' ? 'Not Signed' : asset?.legalSignatureStatus || 'Not Signed'}
                     </div>
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {!isReadOnly && (
                <GlassButton
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-orange-600/80 hover:bg-orange-500 text-white"
                >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Asset'}
                </GlassButton>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
}