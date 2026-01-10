"use client";

import React, { useState, useEffect } from 'react';
import { Box, Layers, PlayCircle } from 'lucide-react';
import ContractSigningModal from '@/components/legal/ContractSigningModal';
import RouteGuard from '@/components/RouteGuard';
import { interactiveApi } from '@/lib/api';

interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  status: 'pending' | 'signed';
}

import { useAuth } from '@/app/context/AuthContext';

export default function InteractiveDivisionPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState<{ id: string; name: string; value: number } | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchAssets();
  }, [authLoading, user]);

  const fetchAssets = async () => {
    try {
      const response = await interactiveApi.getAssets();
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (assetId: string, assetName: string, value: number) => {
    setActiveAsset({ id: assetId, name: assetName, value });
    setIsModalOpen(true);
  };

  const handleSignSuccess = async () => {
    if (!activeAsset) return;
    try {
      await interactiveApi.signAsset({
        assetId: activeAsset.id,
        assetName: activeAsset.name
      });
      alert('Asset Signed & Queued!');
      fetchAssets(); // Refresh list
    } catch (error) {
      console.error('Failed to sign asset:', error);
      alert('Failed to sign asset');
    }
  };

  return (
    <RouteGuard allowedDivision="interactive">
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Interactive Division</h1>
            <p className="text-gray-400 mt-1">Gaming & Interactive Workspace</p>
          </div>
          <div className="px-4 py-2 bg-orange-900/20 text-orange-400 rounded-lg border border-orange-500/30 text-sm font-medium">
            Build v0.4.2 Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Asset Library */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400">
                <Box size={20} />
              </div>
              <h3 className="font-semibold text-white">3D Asset Pipeline</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isLoading ? (
                <p className="text-gray-400">Loading assets...</p>
              ) : assets.map((asset) => (
                <div key={asset.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4 group hover:border-orange-500/50 transition-colors">
                  <div className="h-32 bg-gray-900 rounded mb-3 flex items-center justify-center text-gray-700">
                    <Box size={32} />
                  </div>
                  <h4 className="text-white font-medium text-sm truncate" title={asset.name}>{asset.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{asset.type}</p>
                  <button 
                    onClick={() => handleUpload(asset.id, asset.name, asset.value)}
                    disabled={asset.status === 'signed'}
                    className={`w-full py-2 rounded text-xs font-bold transition-colors ${
                      asset.status === 'signed' 
                        ? 'bg-green-900/30 text-green-500 cursor-default' 
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {asset.status === 'signed' ? 'SIGNED & VERIFIED' : 'VERIFY & SIGN'}
                  </button>
                </div>
              ))}

              {/* Upload New */}
              <div className="border-2 border-dashed border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-gray-600 hover:text-gray-300 transition-colors cursor-pointer min-h-[250px]">
                <Layers size={32} className="mb-2" />
                <span className="text-sm">Upload New Asset</span>
              </div>
            </div>
          </div>

          {/* Level Design Checklist */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400">
                <Layers size={20} />
              </div>
              <h3 className="font-semibold text-white">Level Milestones</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span>The Iron Keep (Structure)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                </div>
                <span>Blacksmith Interior (Lighting)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-4 h-4 rounded-full border border-gray-600"></div>
                <span>Village Outskirts (Terrain)</span>
              </div>
            </div>
          </div>

          {/* Build Tracker */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                <PlayCircle size={20} />
              </div>
              <h3 className="font-semibold text-white">Build Status</h3>
            </div>
            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-mono text-sm">Build #422</span>
                <span className="text-green-400 text-xs px-2 py-1 bg-green-900/20 rounded">SUCCESS</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Duration: 14m 22s • Unity 2022.3.4f1</p>
            </div>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-colors">
              Trigger New Build
            </button>
          </div>
        </div>

        {activeAsset && (
          <ContractSigningModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            assetName={activeAsset.name}
            assetValue={activeAsset.value}
            onSuccess={handleSignSuccess}
          />
        )}
      </div>
    </RouteGuard>
  );
}
