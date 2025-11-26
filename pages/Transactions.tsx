import React, { useState } from 'react';
import { Transaction } from '../types';
import { Search, Filter, Download } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showFilters, setShowFilters] = useState(true);

  const filteredData = transactions.filter(t => {
    const matchesSearch = 
      t.merchant.toLowerCase().includes(filter.toLowerCase()) || 
      t.id.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'FRAUD' ? t.isFraud : !t.isFraud);
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Merchant', 'Category', 'Date', 'Amount', 'Status', 'Risk Score', 'Fraud Detected'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(t => [
        t.id,
        `"${t.merchant}"`,
        t.category,
        t.timestamp,
        t.amount.toFixed(2),
        t.status,
        t.riskScore.toFixed(2),
        t.isFraud ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Transactions</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Filter'}
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Toolbar */}
        {showFilters && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search ID or Merchant..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'ALL' ? 'bg-slate-800 text-white shadow-sm dark:bg-slate-700' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                All
              </button>
              <button 
                 onClick={() => setStatusFilter('FRAUD')}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'FRAUD' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                Fraud
              </button>
              <button 
                 onClick={() => setStatusFilter('CLEAN')}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'CLEAN' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                Clean
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Merchant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk Score</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredData.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{txn.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{txn.merchant}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{txn.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(txn.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    ${txn.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      txn.isFraud 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    }`}>
                      {txn.isFraud ? 'FRAUD DETECTED' : 'APPROVED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mr-2">
                        <div 
                          className={`h-full ${txn.riskScore > 0.8 ? 'bg-red-500' : txn.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                          style={{width: `${txn.riskScore * 100}%`}}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{(txn.riskScore * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              No transactions found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};