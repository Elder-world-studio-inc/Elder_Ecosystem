"use client";

import React, { useState } from 'react';
import { Server, Database, UploadCloud, Globe, Cpu, CheckCircle, AlertCircle, Play, FileJson } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import { interactiveApi } from '@/lib/api';

export default function UnityBridgePage() {
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      await interactiveApi.deploy();
      alert('Zone successfully deployed to Nexus Beta!');
    } catch (error) {
      console.error("Deployment failed", error);
      alert('Deployment failed!');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <RouteGuard allowedDivision="interactive">
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Unity Bridge Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage synchronization between Unity Client and Game Servers</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 text-blue-400 rounded-lg border border-blue-500/30 text-sm font-medium">
            <Globe size={16} />
            <span>Connection Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Addressables Management Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400">
                <Database size={20} />
              </div>
              <h3 className="font-semibold text-white">Addressables Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium">Catalog Update</span>
                  <span className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded">Live</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Last updated: 2 hours ago</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-xs font-bold transition-colors">
                    CHECK DIFFS
                  </button>
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-xs font-bold transition-colors">
                    PUSH UPDATE
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                 <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Assets</h4>
                 <div className="flex justify-between items-center p-3 bg-gray-950 rounded border border-gray-800 text-sm">
                    <span className="text-white">Forest_Zone_04.bundle</span>
                    <span className="text-gray-500">24.5 MB</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-950 rounded border border-gray-800 text-sm">
                    <span className="text-white">Weapon_Pack_v2.bundle</span>
                    <span className="text-gray-500">12.8 MB</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Remote Build Hosting */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                <Server size={20} />
              </div>
              <h3 className="font-semibold text-white">Remote Build Hosting</h3>
            </div>
            
            <div className="mb-6">
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Asset Server URL
               </label>
               <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://cdn.sakura-engine.com/builds/v0.4.2/"
                    className="flex-1 bg-gray-950 border border-gray-800 text-gray-300 px-3 py-2 rounded text-sm font-mono"
                  />
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors">
                    Copy
                  </button>
               </div>
               <p className="text-xs text-gray-500 mt-2">
                  Unity Client checks this URL for new content manifests at startup.
               </p>
            </div>

            <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-400 mt-0.5" size={18} />
                    <div>
                        <h4 className="text-blue-400 text-sm font-medium">Hosting Status</h4>
                        <p className="text-blue-300/70 text-xs mt-1">
                            CDN is healthy. All regions serving v0.4.2 with 99.9% uptime.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          {/* Manifest Tracker */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400">
                <FileJson size={20} />
              </div>
              <h3 className="font-semibold text-white">Manifest Tracker</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-950">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Version</th>
                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="px-4 py-3 font-mono">zone_forest_01</td>
                    <td className="px-4 py-3">Zone</td>
                    <td className="px-4 py-3">v1.2</td>
                    <td className="px-4 py-3"><span className="text-green-500">Synced</span></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="px-4 py-3 font-mono">prop_ruins_arch</td>
                    <td className="px-4 py-3">Prop</td>
                    <td className="px-4 py-3">v1.0</td>
                    <td className="px-4 py-3"><span className="text-green-500">Synced</span></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="px-4 py-3 font-mono">zone_cave_deep</td>
                    <td className="px-4 py-3">Zone</td>
                    <td className="px-4 py-3">v0.8</td>
                    <td className="px-4 py-3"><span className="text-yellow-500">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deploy Action */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-900/30 rounded-lg text-green-400">
                    <UploadCloud size={20} />
                </div>
                <h3 className="font-semibold text-white">Deploy to Nexus Beta</h3>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                    Pushing updates here will make them available to all beta testers immediately. Ensure all QA checks have passed.
                </p>
            </div>
            
            <button 
                onClick={handleDeploy}
                disabled={deploying}
                className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    deploying 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
                }`}
            >
                {deploying ? (
                    <>
                        <Cpu className="animate-spin" size={20} />
                        DEPLOYING...
                    </>
                ) : (
                    <>
                        <Play size={20} fill="currentColor" />
                        DEPLOY RELEASE
                    </>
                )}
            </button>
          </div>

        </div>
      </div>
    </RouteGuard>
  );
}
