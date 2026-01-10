"use client";

import React, { useState } from 'react';
import { ShieldCheck, X, FileText, Lock } from 'lucide-react';
import { useAdmin } from '@/app/context/AdminContext';

interface ContractSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
  assetValue: number;
  onSuccess?: (signerName: string) => void;
}

export default function ContractSigningModal({
  isOpen,
  onClose,
  assetName,
  assetValue,
  onSuccess
}: ContractSigningModalProps) {
  const { executeContract } = useAdmin();
  const [signerName, setSignerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!signerName.trim()) {
      setError('Digital signature is required.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Simulate network delay for "Formal Business Transaction" feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      executeContract(signerName, assetName, assetValue);
      
      if (onSuccess) onSuccess(signerName);
      onClose();
    } catch (err) {
      setError('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-purple-500/30 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-950 p-6 border-b border-gray-800 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/50 text-purple-400">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">IP ASSIGNMENT AGREEMENT</h2>
              <p className="text-purple-400 text-sm font-mono uppercase">Elder World Studio, Inc. • Legal Gate</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Contract Body */}
        <div className="p-8 space-y-6 bg-gray-900/50">
          
          <div className="bg-gray-950 border border-gray-800 p-6 rounded-lg font-serif text-gray-300 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-gray-500 mb-4 font-sans text-xs uppercase tracking-wider">
              <FileText size={14} />
              <span>Work-For-Hire Agreement • Ref: {Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
            </div>
            <p className="mb-4">
              I, the undersigned (&quot;Creator&quot;), hereby irrevocably assign, transfer, and convey to 
              <strong className="text-white"> Elder World Studio, Inc.</strong> (&quot;Company&quot;) all right, title, and interest 
              in and to the asset designated as <strong className="text-white">&quot;{assetName}&quot;</strong>.
            </p>
            <p className="mb-4">
              This transfer includes, but is not limited to, all copyrights, trademarks, moral rights, 
              and any other intellectual property rights, in perpetuity, throughout the universe, 
              in any and all media now known or hereafter devised.
            </p>
            <p>
              By executing this agreement, I acknowledge this work is a &quot;work made for hire&quot; 
              and I have received fair consideration.
            </p>
          </div>

          {/* Signing Area */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Digital Signature (Full Name)</label>
              <input 
                type="text" 
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="e.g. Sara Siron"
                className="w-full bg-gray-950 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Date Stamp</label>
              <div className="w-full bg-gray-950 border border-gray-800 text-gray-400 px-4 py-3 rounded-lg font-mono">
                {today}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-800 bg-gray-950 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleExecute}
            disabled={isProcessing}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-lg text-white font-bold tracking-wide transition-all
              ${isProcessing 
                ? 'bg-purple-900/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 shadow-lg shadow-purple-900/20'}
            `}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Lock size={18} />
                EXECUTE AGREEMENT
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
