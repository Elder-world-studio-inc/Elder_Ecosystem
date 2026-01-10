import React, { useState, useMemo } from 'react';
import { useAdmin, BudgetItem } from '@/app/context/AdminContext';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortField = 'category' | 'allocated' | 'actual' | 'variance' | 'startDate' | 'endDate';
type SortDirection = 'asc' | 'desc';

export default function BudgetTab() {
  const { budgetItems } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const filteredItems = useMemo(() => {
    return budgetItems.filter(item => {
      const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = (!dateFilter.start || item.startDate >= dateFilter.start) &&
                          (!dateFilter.end || item.endDate <= dateFilter.end);
                          
      return matchesSearch && matchesDate;
    }).sort((a, b) => {
      let valA: any = a[sortField as keyof BudgetItem];
      let valB: any = b[sortField as keyof BudgetItem];
      
      if (sortField === 'variance') {
        valA = a.allocated - a.actual;
        valB = b.allocated - b.actual;
      }

      // Handle strings/dates vs numbers
      if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [budgetItems, searchTerm, sortField, sortDirection, dateFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="ml-1 text-gray-600" />;
    return sortDirection === 'asc' ? 
      <ArrowUp size={14} className="ml-1 text-blue-400" /> : 
      <ArrowDown size={14} className="ml-1 text-blue-400" />;
  };

  return (
    <GlassCard className="p-0 overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
             {/* Search */}
            <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    className="bg-black/20 border border-white/10 text-gray-300 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Date Filter */}
            <div className="flex gap-2 items-center w-full md:w-auto">
                <input 
                    type="date" 
                    className="bg-black/20 border border-white/10 text-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full md:w-auto"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                />
                <span className="text-gray-500">-</span>
                <input 
                    type="date" 
                    className="bg-black/20 border border-white/10 text-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full md:w-auto"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                />
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('category')}>
                            <div className="flex items-center">Budget Category <SortIcon field="category" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('allocated')}>
                            <div className="flex items-center">Allocated <SortIcon field="allocated" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('actual')}>
                            <div className="flex items-center">Actual <SortIcon field="actual" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('variance')}>
                            <div className="flex items-center">Variance <SortIcon field="variance" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('startDate')}>
                            <div className="flex items-center">Start Date <SortIcon field="startDate" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('endDate')}>
                            <div className="flex items-center">End Date <SortIcon field="endDate" /></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {filteredItems.map((item) => {
                        const variance = item.allocated - item.actual;
                        const percentUsed = item.allocated > 0 ? Math.min((item.actual / item.allocated) * 100, 100) : 0;
                        const varianceColor = variance >= 0 ? 'text-green-400' : 'text-red-400';
                        
                        return (
                            <tr key={item.id} className="hover:bg-white/5">
                                <td className="px-6 py-4">
                                    <div className="text-white font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-500">{item.category}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">${item.allocated.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-300 mb-1">${item.actual.toFixed(2)}</div>
                                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${item.actual > item.allocated ? 'bg-red-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${percentUsed}%` }}
                                        />
                                    </div>
                                </td>
                                <td className={`px-6 py-4 font-medium ${varianceColor}`}>
                                    {variance >= 0 ? '+' : ''}{variance.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{item.startDate}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{item.endDate}</td>
                            </tr>
                        );
                    })}
                    {filteredItems.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No budget items found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </GlassCard>
  );
}
