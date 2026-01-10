"use client";

import React, { useEffect, useState } from 'react';
import GlobalClock from '@/components/ops/GlobalClock';
import DivisionHealth from '@/components/ops/DivisionHealth';
import BottleneckDetector from '@/components/ops/BottleneckDetector';
import ProductionVelocity from '@/components/ops/ProductionVelocity';
import ResourceCounter from '@/components/ops/ResourceCounter';
import { useAdmin } from '@/app/context/AdminContext';
import RouteGuard from '@/components/RouteGuard';
import api, { assetApi, interactiveApi } from '@/lib/api';

import { useAuth } from '@/app/context/AuthContext';

export default function OperationsDivisionPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { generatedReceipts } = useAdmin();
  
  // State for dashboard metrics
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    unity: { stability: 94, unplacedAssets: 0 },
    creative: { scriptToArtVelocity: 78 },
    infra: { uptime: 99.9, latency: 45 },
    bottleneck: { legalQueueCount: 0, feedbackLoopHours: 12, assetGapCount: 0 },
    production: { creativeProgress: 65, worldCompletion: 0, nextBlastDate: '2026-02-05' },
    resource: { totalIpCount: 0, creatorUtilization: { modeller: 0, levelDesigner: 0 }, valuationGrowth: 12.5 }
  });

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchData = async () => {
      try {
        const [projectsRes, assetsRes] = await Promise.all([
          interactiveApi.getProjects(),
          assetApi.getAll()
        ]);

        const projects = projectsRes.data;
        const assets = assetsRes.data;

        // Calculate Asset Gap (Total Requests)
        let totalRequests = 0;
        let totalZones = 0;
        let liveZones = 0;

        projects.forEach((p: any) => {
            if (p.requests) totalRequests += p.requests.length;
            if (p.zones) {
                totalZones += p.zones.length;
                liveZones += p.zones.filter((z: any) => z.status === 'live').length;
            }
        });

        // Calculate Legal Queue (Signed but not Minted - assuming all Signed are in queue for now)
        // In real app, we might check if they are in the Vault or have a specific 'Minted' flag.
        const legalQueue = assets.filter((a: any) => a.status === 'SIGNED').length;

        // Calculate World Completion
        const worldCompletion = totalZones > 0 ? Math.round((liveZones / totalZones) * 100) : 0;

        // Calculate Total IP
        const totalIp = assets.length;

        setMetrics(prev => ({
            ...prev,
            unity: { ...prev.unity, unplacedAssets: 12 }, // Mocked unplaced for now or fetch from Vault
            bottleneck: { ...prev.bottleneck, assetGapCount: totalRequests, legalQueueCount: legalQueue },
            production: { ...prev.production, worldCompletion },
            resource: { 
                ...prev.resource, 
                totalIpCount: totalIp,
                creatorUtilization: {
                    modeller: totalRequests,
                    levelDesigner: 0 // Mocked
                }
            }
        }));

      } catch (error) {
        console.error('Failed to fetch ops metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, user]);

  return (
    <RouteGuard allowedDivision="operations">
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Operations Division</h1>
            <p className="text-gray-400 mt-1">Global Logistics & HR Workspace</p>
          </div>
          <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400">Week 2, 2026</span>
          </div>
        </div>

        {/* Global Clock */}
        <GlobalClock />

        {/* 1. Division Health Overview */}
        <DivisionHealth 
            unity={metrics.unity}
            creative={metrics.creative}
            infra={metrics.infra}
        />

        {/* 2. Bottleneck Detector */}
        <BottleneckDetector 
            legalQueueCount={metrics.bottleneck.legalQueueCount}
            feedbackLoopHours={metrics.bottleneck.feedbackLoopHours}
            assetGapCount={metrics.bottleneck.assetGapCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3. Production Velocity */}
            <ProductionVelocity 
                creativeProgress={metrics.production.creativeProgress}
                worldCompletion={metrics.production.worldCompletion}
                nextBlastDate={metrics.production.nextBlastDate}
            />

            {/* 4. Resource & Book Value */}
            <ResourceCounter 
                totalIpCount={metrics.resource.totalIpCount}
                creatorUtilization={metrics.resource.creatorUtilization}
                valuationGrowth={metrics.resource.valuationGrowth}
            />
        </div>

        {/* Recent Legal Logs (Receipts) - Kept as historical record */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Work-for-Hire Receipts</h3>
            <span className="text-xs text-gray-500">Auto-Generated by Legal Gate</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Receipt ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Signer</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {generatedReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{receipt.id}</td>
                  <td className="px-6 py-4 text-gray-300">{receipt.date}</td>
                  <td className="px-6 py-4 text-white font-medium">{receipt.signer}</td>
                  <td className="px-6 py-4 text-gray-300">{receipt.asset}</td>
                  <td className="px-6 py-4 text-right text-green-400 font-mono">${receipt.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RouteGuard>
  );
}
