"use client";

import React, { useState } from 'react';
import ValuationTicker from '@/components/executive/ValuationTicker';
import CapTableLedger from '@/components/executive/CapTableLedger';
import RoyaltyEscrow from '@/components/executive/RoyaltyEscrow';
import LegalShieldIndicator from '@/components/executive/LegalShieldIndicator';
import UserManagement from '@/components/executive/UserManagement';
import EquityManagement from '@/components/executive/EquityManagement';
import { useAdmin } from '@/app/context/AdminContext';
import { Activity, Globe, Clock, LayoutDashboard, Users, PieChart } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';

export default function CommandCenterPage() {
  const { kpiData } = useAdmin();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'equity'>('dashboard');

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Command Center</h1>
            <p className="text-gray-400 mt-2">Executive Suite • Governance & Capital Control</p>
          </div>
          <LegalShieldIndicator />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-800">
            <button
                onClick={() => setActiveTab('dashboard')}
                className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                    activeTab === 'dashboard' 
                    ? 'text-blue-500 border-b-2 border-blue-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                <LayoutDashboard size={18} />
                Overview
            </button>
            <button
                onClick={() => setActiveTab('users')}
                className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                    activeTab === 'users' 
                    ? 'text-blue-500 border-b-2 border-blue-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                <Users size={18} />
                User Management
            </button>
            <button
                onClick={() => setActiveTab('equity')}
                className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                    activeTab === 'equity' 
                    ? 'text-blue-500 border-b-2 border-blue-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                <PieChart size={18} />
                Equity & Cap Table
            </button>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            {/* Top Row: Valuation & KPI Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ValuationTicker />
              
              {/* Strategic KPI Board */}
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">Strategic KPI Board</h3>
                <div className="grid grid-cols-3 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
                      <Globe size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{kpiData.portfolioSize}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total IP Portfolio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{kpiData.headcount}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Global Headcount</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-900/20 rounded-lg text-orange-400">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{kpiData.runwayDays} Days</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Runway to Launch</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Cap Table & Escrow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CapTableLedger />
              <RoyaltyEscrow />
            </div>
          </>
        ) : activeTab === 'users' ? (
          <UserManagement />
        ) : (
          <EquityManagement />
        )}
      </div>
    </RouteGuard>
  );
}
