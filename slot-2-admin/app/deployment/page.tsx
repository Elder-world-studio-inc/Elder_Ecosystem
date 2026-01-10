"use client";
import { Rocket, Globe, Server, CheckCircle } from 'lucide-react';

export default function DeploymentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Deployment Bridge</h1>
        <div className="flex items-center gap-2">
           <span className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-900">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             Bridge Active
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source: Admin Engine */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
          <div className="absolute top-6 right-6 text-gray-600">
            <Server size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Admin Engine (Master)</h2>
          <p className="text-sm text-gray-500 mb-6">Source of Truth</p>

          <div className="space-y-4">
             <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
               <h3 className="text-sm font-semibold text-gray-300 mb-3">Ready for Deployment</h3>
               <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm p-2 bg-gray-900 rounded border border-gray-800">
                   <span className="text-gray-200">Chapter 5 (Final).docx</span>
                   <span className="text-green-400 text-xs">Signed</span>
                 </div>
                 <div className="flex items-center justify-between text-sm p-2 bg-gray-900 rounded border border-gray-800">
                   <span className="text-gray-200">Vrog_Mesh_v2.obj</span>
                   <span className="text-green-400 text-xs">Signed</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Destination: Website */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
          <div className="absolute top-6 right-6 text-gray-600">
            <Globe size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Omnivael Universe</h2>
          <p className="text-sm text-gray-500 mb-6">Public Storefront</p>

          <div className="space-y-4">
             <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
               <h3 className="text-sm font-semibold text-gray-300 mb-3">Live Content</h3>
               <div className="space-y-2 opacity-50">
                 <div className="flex items-center justify-between text-sm p-2 bg-gray-900 rounded border border-gray-800">
                   <span className="text-gray-200">Chapter 4.docx</span>
                   <span className="text-blue-400 text-xs">Live</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-8">
        <button className="group relative bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-purple-900/30 flex items-center gap-3">
          <Rocket className="group-hover:translate-x-1 transition-transform" />
          Deploy to Production
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Deployment History</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm border-b border-gray-800 pb-2 last:border-0">
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-gray-300">Deploy #8821</span>
            </div>
            <span className="text-gray-500">Jan 7, 2026 • 14:30 PM</span>
          </div>
          <div className="flex items-center justify-between text-sm border-b border-gray-800 pb-2 last:border-0">
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-gray-300">Deploy #8820</span>
            </div>
            <span className="text-gray-500">Jan 5, 2026 • 09:15 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
