import React from 'react';
import { AlertTriangle, Clock, FileCheck } from 'lucide-react';

interface BottleneckDetectorProps {
  legalQueueCount: number;
  feedbackLoopHours: number;
  assetGapCount: number;
}

export default function BottleneckDetector({ legalQueueCount, feedbackLoopHours, assetGapCount }: BottleneckDetectorProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-900/30 rounded-lg text-red-400">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-white">Bottleneck Detector</h3>
          <p className="text-xs text-gray-500">Pipeline Friction Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Legal Queue */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-400">Legal Queue</span>
            <FileCheck size={16} className="text-gray-600" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">{legalQueueCount}</span>
            <span className="text-xs text-gray-500 ml-2">Signed, Not Minted</span>
          </div>
          {legalQueueCount > 0 && (
             <div className="mt-2 text-[10px] text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded w-fit">
                Action Required
             </div>
          )}
        </div>

        {/* Feedback Loop */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex flex-col justify-between">
           <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-400">Feedback Loop</span>
            <Clock size={16} className="text-gray-600" />
          </div>
          <div>
            <span className={`text-2xl font-bold ${feedbackLoopHours > 48 ? 'text-red-500' : 'text-white'}`}>
                {feedbackLoopHours}h
            </span>
            <span className="text-xs text-gray-500 ml-2">Avg Wait Time</span>
          </div>
          {feedbackLoopHours > 48 && (
             <div className="mt-2 text-[10px] text-red-500 bg-red-900/20 px-2 py-1 rounded w-fit">
                Critical Delay
             </div>
          )}
        </div>

        {/* Asset Gap Report */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex flex-col justify-between">
           <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-400">Asset Gap</span>
            <AlertTriangle size={16} className="text-orange-500" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">{assetGapCount}</span>
            <span className="text-xs text-gray-500 ml-2">Requested vs Uploaded</span>
          </div>
          {assetGapCount > 5 && (
             <div className="mt-2 text-[10px] text-orange-500 bg-orange-900/20 px-2 py-1 rounded w-fit">
                High Demand
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
