import React from 'react';
import { Calendar, Zap, Share2 } from 'lucide-react';

interface ProductionVelocityProps {
  creativeProgress: number; // 0-100
  worldCompletion: number; // 0-100
  nextBlastDate: string;
}

export default function ProductionVelocity({ creativeProgress, worldCompletion, nextBlastDate }: ProductionVelocityProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-900/30 rounded-lg text-green-400">
          <Zap size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-white">Production Velocity</h3>
          <p className="text-xs text-gray-500">Live Timeline</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Creative Timeline */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <Calendar size={14} className="text-purple-400" />
                <span className="text-sm font-medium text-white">Creative: Next Book Release</span>
            </div>
            <span className="text-xs text-gray-400">Feb 1st, 2026</span>
          </div>
          <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600" 
                style={{ width: `${creativeProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 text-right">{creativeProgress}% Written</p>
        </div>

        {/* Unity Sprint */}
        <div>
           <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <Zap size={14} className="text-blue-400" />
                <span className="text-sm font-medium text-white">Unity: World Completion</span>
            </div>
            <span className="text-xs text-gray-400">Duskfall Hollow</span>
          </div>
          <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
             <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" 
                style={{ width: `${worldCompletion}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 text-right">{worldCompletion}% Populated</p>
        </div>

        {/* Nexus Social Blast */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded text-pink-400">
                    <Share2 size={16} />
                </div>
                <div>
                    <p className="text-xs font-bold text-white">Nexus Social Blast</p>
                    <p className="text-[10px] text-gray-500">Scheduled Post (Slot 1)</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs font-mono text-green-400">SCHEDULED</p>
                <p className="text-[10px] text-gray-500">{nextBlastDate}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
