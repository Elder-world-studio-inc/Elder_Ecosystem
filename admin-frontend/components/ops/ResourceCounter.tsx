import React from 'react';
import { Database, User, TrendingUp } from 'lucide-react';

interface ResourceCounterProps {
  totalIpCount: number;
  creatorUtilization: {
    modeller: number; // pending requests
    levelDesigner: number; // pending requests
  };
  valuationGrowth: number; // percentage or value
}

export default function ResourceCounter({ totalIpCount, creatorUtilization, valuationGrowth }: ResourceCounterProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400">
          <Database size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-white">Resource & Book Value</h3>
          <p className="text-xs text-gray-500">Non-Cash Asset Tracking</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Total IP Count */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
                <p className="text-xs text-gray-400 mb-1">Total IP Count</p>
                <p className="text-2xl font-bold text-white">{totalIpCount}</p>
            </div>
            <div className="text-right">
                <span className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded">+12 this week</span>
            </div>
        </div>

        {/* Creator Utilization */}
        <div>
            <p className="text-xs text-gray-400 mb-3">Creator Utilization</p>
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-white flex items-center gap-2">
                        <User size={12} className="text-blue-400"/> 3D Modeller
                    </span>
                    <span className={`font-mono ${creatorUtilization.modeller > 10 ? 'text-red-400' : 'text-gray-300'}`}>
                        {creatorUtilization.modeller} Pending
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-white flex items-center gap-2">
                        <User size={12} className="text-purple-400"/> Level Designer
                    </span>
                    <span className="text-gray-300 font-mono">
                        {creatorUtilization.levelDesigner} Pending
                    </span>
                </div>
            </div>
        </div>

        {/* Valuation Growth */}
        <div className="pt-4 border-t border-gray-800">
             <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-xs font-bold text-white">Est. Valuation</span>
                </div>
                <span className="text-lg font-bold text-green-400">+ {valuationGrowth}%</span>
             </div>
        </div>
      </div>
    </div>
  );
}
