"use client";

import React from 'react';
import { RefreshCw, Users, Briefcase } from 'lucide-react';
import { useAdmin } from '@/app/context/AdminContext';
import { GlassCard } from '@/components/ui/GlassCard';

export default function RoyaltyEscrow() {
  const { royaltyCategories } = useAdmin();
  
  // Calculate total revenue from streams (mock calculation for now)
  const totalRevenue = royaltyCategories.reduce((acc, curr) => acc + curr.value, 0);
  
  const creatorShare = totalRevenue * 0.18; // 18% Royalty Escrow
  const hiringFund = totalRevenue * 0.82; // Remainder to Hiring/Ops

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">18% Royalty Escrow</h3>
        <RefreshCw size={18} className="text-gray-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 p-4 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <Users size={16} />
            <span className="text-xs font-semibold uppercase">Creator Payouts</span>
          </div>
          <p className="text-2xl font-bold text-white">${creatorShare.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">18% Allocation</p>
        </div>

        <div className="bg-black/30 p-4 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Briefcase size={16} />
            <span className="text-xs font-semibold uppercase">Hiring Fund</span>
          </div>
          <p className="text-2xl font-bold text-white">${hiringFund.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Reinvestment</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-2">Active Streams: {royaltyCategories.length}</p>
        <div className="flex -space-x-2 overflow-hidden">
           {/* Visual filler for streams */}
           {[...Array(Math.min(royaltyCategories.length, 5))].map((_, i) => (
             <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-gray-900 bg-gray-700 flex items-center justify-center text-[10px] text-white">
               {i + 1}
             </div>
           ))}
           {royaltyCategories.length > 5 && (
             <div className="inline-block h-6 w-6 rounded-full ring-2 ring-gray-900 bg-gray-800 flex items-center justify-center text-[10px] text-white">
               +
             </div>
           )}
        </div>
      </div>
    </GlassCard>
  );
}
