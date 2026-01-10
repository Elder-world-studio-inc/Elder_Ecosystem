import React from 'react';
import { Activity, Layers, Server } from 'lucide-react';

interface DivisionHealthProps {
  unity: {
    stability: number; // 0-100
    unplacedAssets: number;
  };
  creative: {
    scriptToArtVelocity: number; // 0-100
  };
  infra: {
    uptime: number; // 99.9 etc
    latency: number; // ms
  };
}

export default function DivisionHealth({ unity, creative, infra }: DivisionHealthProps) {
  const getStatusColor = (val: number) => {
    if (val >= 90) return 'text-green-500';
    if (val >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBgColor = (val: number) => {
    if (val >= 90) return 'bg-green-500';
    if (val >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Interactive (Unity) */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Interactive</h3>
            <p className="text-xs text-gray-500">Slot 5: Nexus Beta</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Build Stability</span>
              <span className={getStatusColor(unity.stability)}>{unity.stability}%</span>
            </div>
            <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getBgColor(unity.stability)}`} 
                style={{ width: `${unity.stability}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-950 p-3 rounded border border-gray-800">
             <span className="text-xs text-gray-400">Unplaced Assets</span>
             <span className="text-white font-bold">{unity.unplacedAssets}</span>
          </div>
        </div>
      </div>

      {/* Creative (Omnivael) */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Creative</h3>
            <p className="text-xs text-gray-500">Slot 3: Omnivael Reader</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Script-to-Art Velocity</span>
              <span className={getStatusColor(creative.scriptToArtVelocity)}>{creative.scriptToArtVelocity}%</span>
            </div>
            <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getBgColor(creative.scriptToArtVelocity)}`} 
                style={{ width: `${creative.scriptToArtVelocity}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-950 p-3 rounded border border-gray-800">
             <span className="text-xs text-gray-400">Status</span>
             <span className="text-green-400 text-xs font-bold bg-green-900/20 px-2 py-1 rounded">ON TRACK</span>
          </div>
        </div>
      </div>

      {/* Infrastructure (Sakura) */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-900/30 rounded-lg text-pink-400">
            <Server size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Infrastructure</h3>
            <p className="text-xs text-gray-500">Slot 4: The Core</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-gray-950 p-2 rounded text-center border border-gray-800">
               <p className="text-[10px] text-gray-500 uppercase">Uptime</p>
               <p className="text-green-400 font-bold">{infra.uptime}%</p>
             </div>
             <div className="bg-gray-950 p-2 rounded text-center border border-gray-800">
               <p className="text-[10px] text-gray-500 uppercase">Latency</p>
               <p className="text-yellow-400 font-bold">{infra.latency}ms</p>
             </div>
          </div>
           <div className="flex justify-between items-center bg-gray-950 p-2 rounded border border-gray-800">
             <span className="text-xs text-gray-400">Active Nodes</span>
             <span className="text-white font-bold text-xs">5/5 Slots</span>
          </div>
        </div>
      </div>
    </div>
  );
}
