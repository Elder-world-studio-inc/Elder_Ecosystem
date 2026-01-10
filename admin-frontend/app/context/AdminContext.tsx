"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { INITIAL_ASSETS_VALUE, INITIAL_ROYALTY_STREAMS, INITIAL_RECEIPTS, INITIAL_CONTRACTS, KPI_DATA, CAP_TABLE, INITIAL_BUDGET_ITEMS } from '@/lib/mockData';
import { adminApi, shareholdersApi } from '@/lib/api';

export interface RoyaltyStream {
  id: string;
  name: string;
  value: number;
  category: string;
}

export interface Receipt {
  id: string;
  date: string;
  asset: string;
  signer: string;
  amount: number;
}

export interface Contract {
  id: string;
  assetId: string;
  signer: string;
  date: string;
}

export interface KPIData {
  portfolioSize: number;
  headcount: number;
  runwayDays: number;
}

export interface CapTable {
  founders: number;
  pool: number;
  poolUtilized: number;
}

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  allocated: number;
  actual: number;
  startDate: string;
  endDate: string;
  frequency: string;
}

export interface Shareholder {
  id: string;
  name: string;
  type: 'Founder' | 'Investor' | 'Employee';
  shares: number;
  percentage: number;
  email?: string;
  grantDate?: string;
}

interface AdminContextType {
  intangibleAssetsValue: number;
  royaltyCategories: RoyaltyStream[];
  generatedReceipts: Receipt[];
  signedContracts: Contract[];
  budgetItems: BudgetItem[];
  kpiData: KPIData;
  capTable: CapTable;
  shareholders: Shareholder[];
  executeContract: (signerName: string, assetName: string, assetValue: number) => Promise<void>;
  refreshShareholders: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [intangibleAssetsValue, setIntangibleAssetsValue] = useState(INITIAL_ASSETS_VALUE);
  const [royaltyCategories, setRoyaltyCategories] = useState<RoyaltyStream[]>(INITIAL_ROYALTY_STREAMS);
  const [generatedReceipts, setGeneratedReceipts] = useState<Receipt[]>(INITIAL_RECEIPTS);
  const [signedContracts, setSignedContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_ITEMS);
  const [kpiData, setKpiData] = useState<KPIData>(KPI_DATA);
  const [capTable, setCapTable] = useState<CapTable>(CAP_TABLE);
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  // Ensure loading state starts as true to prevent premature rendering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShareholders = async () => {
      try {
          const res = await shareholdersApi.getAll();
          setShareholders(res.data);
      } catch (error) {
          console.error("Failed to fetch shareholders", error);
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch data from backend
        const [assetsRes, royaltyRes, receiptsRes, contractsRes, kpiRes, capTableRes, shareholdersRes] = await Promise.all([
          adminApi.getAssetsValue(),
          adminApi.getRoyaltyStreams(),
          adminApi.getReceipts(),
          adminApi.getContracts(),
          adminApi.getKpi(),
          adminApi.getCapTable(),
          shareholdersApi.getAll()
        ]);

        setIntangibleAssetsValue(assetsRes.data.value);
        setRoyaltyCategories(royaltyRes.data);
        setGeneratedReceipts(receiptsRes.data);
        setSignedContracts(contractsRes.data);
        setKpiData(kpiRes.data);
        setCapTable(capTableRes.data);
        setShareholders(shareholdersRes.data);
        setError(null);

      } catch (err) {
        console.error('Error connecting to backend:', err);
        setError('Error connecting to backend');
        // Fallback to mock data is already set by initial state
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const executeContract = async (signerName: string, assetName: string, assetValue: number) => {
    const date = new Date().toISOString().split('T')[0];
    
    try {
        // Action A: Create Contract Record
        const contractRes = await adminApi.createContract({
            assetId: `asset-${Math.random().toString(36).substr(2, 5)}`, // In a real flow, this should come from the asset creation
            signer: signerName,
            date
        });

        // Action B: Generate Receipt
        const receiptRes = await adminApi.createReceipt({
            date,
            asset: assetName,
            signer: signerName,
            amount: assetValue
        });

        // Update Client State
        setSignedContracts(prev => [contractRes.data, ...prev]);
        setGeneratedReceipts(prev => [receiptRes.data, ...prev]);
        
        // Action C: Increase Asset Value (This is derived in backend usually, but we update UI)
        setIntangibleAssetsValue(prev => prev + assetValue);

        // Action D: Add Royalty Category (Mock for now as backend doesn't have create endpoint for this yet)
        const newRoyalty: RoyaltyStream = {
          id: Math.random().toString(36).substr(2, 9),
          name: `${assetName} Royalty`,
          value: 0,
          category: 'Pending',
        };
        setRoyaltyCategories(prev => [...prev, newRoyalty]);

    } catch (err) {
        console.error("Failed to execute contract:", err);
        // Fallback or error handling
    }
  };

  return (
    <AdminContext.Provider value={{
      intangibleAssetsValue,
      royaltyCategories,
      generatedReceipts,
      signedContracts,
      budgetItems,
      kpiData,
      capTable,
      shareholders,
      executeContract,
      refreshShareholders: fetchShareholders,
      isLoading,
      error,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}