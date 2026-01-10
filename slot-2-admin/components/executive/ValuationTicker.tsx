"use client";

import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { useAdmin } from '@/app/context/AdminContext';

export default function ValuationTicker() {
  const { intangibleAssetsValue } = useAdmin();
  const MULTIPLIER = 12.5; // Hypothetical valuation multiplier
  const estimatedValuation = intangibleAssetsValue * MULTIPLIER;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <TrendingUp size={100} />
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Real-Time Valuation</h3>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl text-gray-400 font-light">$</span>
        <span className="text-4xl font-bold text-white tracking-tight">
          {estimatedValuation.toLocaleString()}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-green-400">
          <TrendingUp size={14} />
          <span className="font-mono">+{MULTIPLIER}x Multiple</span>
        </div>
        <div className="text-gray-500">
          Based on Asset Count
        </div>
      </div>
    </div>
  );
}
