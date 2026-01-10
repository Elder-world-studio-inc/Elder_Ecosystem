export const INITIAL_ASSETS_VALUE = 4250000;

export const INITIAL_ROYALTY_STREAMS = [
  { id: '1', name: 'Chapter 1 Sales', value: 1200, category: 'Book Sales' },
  { id: '2', name: 'Character Mesh License', value: 5000, category: '3D Assets' },
];

export const INITIAL_RECEIPTS = [
  { id: '1', date: '2026-01-02', asset: 'Chapter 1 Manuscript', signer: 'Sara Siron', amount: 500 },
];

export const INITIAL_CONTRACTS = [
  { id: '1', assetId: 'asset-001', signer: 'Sara Siron', date: '2026-01-02' },
];

export const INITIAL_BUDGET_ITEMS = [
  { id: '1', category: 'Operations', name: 'AT&T Company Phone', allocated: 120.00, actual: 112.00, startDate: '2026-01-01', endDate: '2026-12-31', frequency: 'Monthly' },
  { id: '2', category: 'Software', name: 'Quickbooks', allocated: 40.00, actual: 39.00, startDate: '2026-01-01', endDate: '2026-12-31', frequency: 'Monthly' },
];

export const CAP_TABLE = {
  founders: 9000000,
  pool: 1000000,
  poolUtilized: 150000,
};

export const KPI_DATA = {
  portfolioSize: 142,
  headcount: 12,
  runwayDays: 24, // Days until Feb 1st Launch
};
