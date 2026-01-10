"use client";
import { DollarSign, TrendingUp, PieChart, Download, LayoutDashboard, Calculator } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import { useAdmin } from '@/app/context/AdminContext';
import { useMemo, useState } from 'react';
import BudgetTab from './BudgetTab';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';

export default function FinancialsPage() {
  const { intangibleAssetsValue, royaltyCategories, generatedReceipts } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate Pending Royalties (Creator Share - 18% of Total Revenue)
  const totalRevenue = useMemo(() => {
    return royaltyCategories.reduce((acc, curr) => acc + curr.value, 0);
  }, [royaltyCategories]);
  
  const pendingRoyalties = totalRevenue * 0.18;

  // Calculate Asset Distribution
  const assetDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    if (royaltyCategories.length === 0) return [];
    
    royaltyCategories.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return Object.entries(counts).map(([category, count]) => ({
      category,
      percentage: Math.round((count / royaltyCategories.length) * 100)
    }));
  }, [royaltyCategories]);

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Financials & Ledger</h1>
          <GlassButton className="flex items-center gap-2 text-gray-300 px-4 py-2 text-sm border-gray-700">
            <Download size={16} /> Export Report
          </GlassButton>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <LayoutDashboard size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('budgeting')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'budgeting'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calculator size={16} />
            Budgeting
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="text-gray-400 font-medium">Total Intangible Assets</h3>
                </div>
                <p className="text-3xl font-bold text-white">${intangibleAssetsValue.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+12.5% vs last quarter</p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-gray-400 font-medium">Pending Royalties</h3>
                </div>
                <p className="text-3xl font-bold text-white">${pendingRoyalties.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mt-1">Next payout: Jan 15</p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <PieChart size={20} />
                  </div>
                  <h3 className="text-gray-400 font-medium">Asset Distribution</h3>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {assetDistribution.length > 0 ? (
                    assetDistribution.map((item) => (
                      <span key={item.category} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 border border-white/5">
                        {item.category}: {item.percentage}%
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No assets distributed</span>
                  )}
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Recent Ledger Transactions</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {generatedReceipts.length > 0 ? (
                    generatedReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">TX-{receipt.id}</td>
                        <td className="px-6 py-4 text-gray-200">
                          {receipt.asset} ({receipt.signer})
                        </td>
                        <td className="px-6 py-4 text-gray-400">Asset Entry</td>
                        <td className="px-6 py-4 text-white font-medium">
                          ${receipt.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-green-400 text-xs">Completed</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No transactions found in the ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </GlassCard>
          </>
        )}

        {activeTab === 'budgeting' && (
          <BudgetTab />
        )}
      </div>
    </RouteGuard>
  );
}