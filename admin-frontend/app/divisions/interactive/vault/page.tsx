"use client";

import React, { useState, useEffect } from 'react';
import { Box, Search, Filter, AlertTriangle, Check, Plus, FileText, Database } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import { assetApi } from '@/lib/api';
import AssetModal from '@/components/AssetManagement/AssetModal';
import { useAuth } from '@/app/context/AuthContext';

interface AssetPacket {
  assetId: string;
  creatorId: string;
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
}

export default function VaultPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [assets, setAssets] = useState<AssetPacket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetPacket | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await assetApi.getAll({ divisionId: 'wayfarer' });
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    fetchAssets();
  }, [authLoading, user]);

  const handleCreate = () => {
    setSelectedAsset(null);
    setIsModalOpen(true);
  };

  const handleEdit = (asset: AssetPacket) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchAssets();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED': return 'text-green-400';
      case 'IN-REVIEW': return 'text-yellow-400';
      case 'DRAFT': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
      switch (status) {
          case 'SIGNED': return <Check size={14} />;
          case 'IN-REVIEW': return <AlertTriangle size={14} />;
          case 'DRAFT': return <FileText size={14} />;
          default: return <FileText size={14} />;
      }
  }

  return (
    <RouteGuard allowedDivision="wayfarer">
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Omnivael Asset Vault</h1>
            <p className="text-gray-400 mt-1">Centralized Asset Management & Legal Repository</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              New Asset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-400">Loading assets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <div 
                key={asset.assetId} 
                onClick={() => handleEdit(asset)}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group hover:border-orange-500/50 transition-colors cursor-pointer"
              >
                {/* Thumbnail Placeholder */}
                <div className="h-48 bg-gray-950 flex items-center justify-center relative">
                  <Box size={48} className="text-gray-800" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur rounded text-xs text-white font-medium">
                    {asset.contentMetadata.type}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur rounded text-xs text-gray-300 font-mono">
                    {asset.assetId}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-medium truncate mb-1">{asset.contentMetadata.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span>{asset.contentMetadata.genre}</span>
                    <span>•</span>
                    <span>Creator: {asset.creatorId}</span>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Status</span>
                      <span className={`flex items-center gap-1 ${getStatusColor(asset.status)} font-medium`}>
                        {getStatusIcon(asset.status)}
                        <span className="capitalize">{asset.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* IP Status Tag */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">IP Rights</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          asset.ipStatus === 'Siron_Royalty_18' ? 'bg-purple-900/30 text-purple-400 border border-purple-800' : 'bg-gray-800 text-gray-400'
                      }`}>
                          {asset.ipStatus === 'Siron_Royalty_18' ? 'Siron Royalty' : 'Work for Hire'}
                      </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AssetModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          asset={selectedAsset}
        />
      </div>
    </RouteGuard>
  );
}