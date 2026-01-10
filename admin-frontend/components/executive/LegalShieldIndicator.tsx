"use client";

import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAdmin } from '@/app/context/AdminContext';

export default function LegalShieldIndicator() {
  const { signedContracts } = useAdmin();
  
  // Logic: Shield is active if there are recently signed contracts (e.g., last 24h)
  // For demo, we just show "Active" if count > 0
  const isActive = signedContracts.length > 0;
  const latestContract = signedContracts[0];

  return (
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-500
      ${isActive 
        ? 'bg-green-900/20 border-green-500/30 text-green-400' 
        : 'bg-red-900/20 border-red-500/30 text-red-400'}
    `}>
      <div className={`p-1 rounded-full ${isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        {isActive ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide">Legal Shield</p>
        <p className="text-[10px] opacity-80">
          {isActive 
            ? `Active • ${signedContracts.length} Signed` 
            : 'Warning • Pending Signatures'}
        </p>
      </div>
    </div>
  );
}
