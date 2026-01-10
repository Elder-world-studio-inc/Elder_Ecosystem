"use client";

import React from 'react';
import { PieChart } from 'lucide-react';
import { useAdmin } from '@/app/context/AdminContext';
import { GlassCard } from '@/components/ui/GlassCard';

export default function CapTableLedger() {
  const { capTable } = useAdmin();
  const founderPercent = (capTable.founders / 10000000) * 100;
  const poolPercent = (capTable.pool / 10000000) * 100;
  const utilizedPercent = (capTable.poolUtilized / capTable.pool) * 100;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">10M Cap Table Ledger</h3>
        <PieChart size={18} className="text-gray-500" />
      </div>

      <div className="space-y-6">
        {/* Founder Shares */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white font-medium">Founder Shares (Issued)</span>
            <span className="text-gray-400">{capTable.founders.toLocaleString()} ({founderPercent}%)</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[90%]"></div>
          </div>
        </div>

        {/* Option Pool */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white font-medium">Employee Option Pool</span>
            <span className="text-gray-400">{capTable.pool.toLocaleString()} ({poolPercent}%)</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
            {/* Utilized portion */}
            <div 
              className="h-full bg-purple-500" 
              style={{ width: `${utilizedPercent}%` }}
              title={`Utilized: ${capTable.poolUtilized.toLocaleString()}`}
            ></div>
            {/* Remaining portion (transparent/bg color) */}
          </div>
          <div className="flex justify-between text-xs mt-2 text-gray-500">
            <span>Utilized: {capTable.poolUtilized.toLocaleString()}</span>
            <span>Available: {(capTable.pool - capTable.poolUtilized).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
