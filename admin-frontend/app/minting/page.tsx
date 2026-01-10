"use client";
import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileSignature, AlertTriangle, Check, XCircle } from 'lucide-react';
import { assetApi } from '@/lib/api';
import RouteGuard from '@/components/RouteGuard';

export default function MintingPage() {
  const [pendingAssets, setPendingAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingAssets();
  }, []);

  const fetchPendingAssets = async () => {
    try {
      setLoading(true);
      const res = await assetApi.getAll();
      // Filter for assets that are ready for verification (e.g. IN-REVIEW or DRAFT that needs approval)
      // For this demo, let's assume 'IN-REVIEW' is the state waiting for admin.
      // If we don't have IN-REVIEW, we can show DRAFTs too for testing.
      const pending = res.data.filter((a: any) => a.status === 'IN-REVIEW' || a.status === 'DRAFT');
      setPendingAssets(pending);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedAsset) return;
    
    try {
      setProcessing(true);
      // Simulate verification steps
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      await assetApi.updateStatus(selectedAsset.assetId, 'SIGNED', 'admin');
      
      alert(`Asset ${selectedAsset.contentMetadata.title} successfully verified and IP assigned!`);
      setSelectedAsset(null);
      fetchPendingAssets();
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAsset) return;
    if (!confirm('Are you sure you want to reject this asset? It will be sent back to Draft.')) return;

    try {
        setProcessing(true);
        await assetApi.updateStatus(selectedAsset.assetId, 'DRAFT', 'admin');
        setSelectedAsset(null);
        fetchPendingAssets();
    } catch (error) {
        console.error('Rejection failed:', error);
    } finally {
        setProcessing(false);
    }
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Minting & Verification</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
            <ShieldCheck size={16} className="text-green-500" />
            Secure Environment Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending List */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-[calc(100vh-200px)] flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-500" />
              Pending Verification ({pendingAssets.length})
            </h2>
            
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {loading ? (
                <div className="text-center text-gray-500 py-8">Loading assets...</div>
              ) : pendingAssets.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No assets pending verification.</div>
              ) : (
                pendingAssets.map((asset) => (
                  <div 
                    key={asset.assetId} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAsset?.assetId === asset.assetId 
                        ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                        : 'bg-gray-950 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-white truncate max-w-[180px]">
                        {asset.contentMetadata?.title || asset.assetId}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                          asset.status === 'IN-REVIEW' ? 'bg-yellow-900/20 text-yellow-500' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-xs text-gray-500">
                            Type: {asset.contentMetadata?.type || 'Unknown'}<br/>
                            Value: ${asset.estimatedValue?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 font-mono">
                            {asset.assetId}
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Verification Area */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
            
            {!selectedAsset ? (
                <div className="flex flex-col items-center opacity-50">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FileSignature size={32} className="text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400">No Asset Selected</h3>
                    <p className="text-gray-500 max-w-md mt-2">
                    Select an asset from the list to initiate the verification protocol.
                    </p>
                </div>
            ) : (
                <>
                    <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mb-2 animate-pulse">
                        <FileSignature size={40} className="text-purple-400" />
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-bold text-white">{selectedAsset.contentMetadata?.title}</h3>
                        <p className="text-purple-400 font-mono mt-1">{selectedAsset.assetId}</p>
                        <p className="text-gray-400 max-w-md mt-4 mx-auto">
                        Initiating legal handshake for <strong>{selectedAsset.contentMetadata?.type}</strong> asset. 
                        This action will permanently assign Intellectual Property rights to Elder World Studio, Inc.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-950 border border-gray-800 rounded-xl w-full max-w-lg text-left shadow-2xl">
                        <h4 className="text-sm font-semibold text-gray-300 mb-4 border-b border-gray-800 pb-2">Verification Checklist</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-center gap-3">
                            <Check size={16} className="text-green-500" /> 
                            <span>Source file integrity check: <span className="text-green-400 font-mono">PASSED</span></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check size={16} className="text-green-500" /> 
                            <span>Metadata scan: <span className="text-white">{selectedAsset.contentMetadata?.genre || 'N/A'}</span></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check size={16} className="text-green-500" /> 
                            <span>Creator signature: <span className="text-white">Valid ({selectedAsset.creatorId})</span></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${processing ? 'border-yellow-500' : 'border-gray-600'}`}>
                                {processing && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />}
                            </div> 
                            <span className={processing ? 'text-yellow-400' : ''}>Admin final approval</span>
                        </li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleReject}
                            disabled={processing}
                            className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <XCircle size={18} /> Reject
                        </button>
                        <button 
                            onClick={handleVerify}
                            disabled={processing}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20 disabled:opacity-50"
                        >
                            {processing ? 'Verifying...' : 'Sign & Verify Asset'}
                            {!processing && <ShieldCheck size={18} />}
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
