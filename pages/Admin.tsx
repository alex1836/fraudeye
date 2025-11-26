import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Database, Server, Cpu, Activity } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const modelPerformanceData = [
  { x: 10, y: 200, z: 200, name: 'Normal' },
  { x: 120, y: 100, z: 260, name: 'Normal' },
  { x: 170, y: 300, z: 400, name: 'Normal' },
  { x: 140, y: 250, z: 280, name: 'Normal' },
  { x: 150, y: 400, z: 500, name: 'Fraud' },
  { x: 110, y: 280, z: 200, name: 'Fraud' },
  { x: 160, y: 350, z: 300, name: 'Fraud' },
  { x: 180, y: 450, z: 400, name: 'Fraud' },
];

export const Admin: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">System Administration</h1>
         <p className="text-slate-500 dark:text-slate-400">Model Performance & System Health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center transition-colors">
           <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg mr-4">
             <Cpu className="w-8 h-8" />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Model Accuracy</p>
             <p className="text-2xl font-bold text-slate-900 dark:text-white">99.8%</p>
             <p className="text-xs text-green-600 dark:text-green-400 font-medium">XGBoost v2.1</p>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center transition-colors">
           <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg mr-4">
             <Server className="w-8 h-8" />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">API Latency</p>
             <p className="text-2xl font-bold text-slate-900 dark:text-white">45ms</p>
             <p className="text-xs text-slate-500 dark:text-slate-500">99th Percentile</p>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center transition-colors">
           <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg mr-4">
             <Database className="w-8 h-8" />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Records</p>
             <p className="text-2xl font-bold text-slate-900 dark:text-white">2.4M</p>
             <p className="text-xs text-slate-500 dark:text-slate-500">PostgreSQL DB</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Confusion Matrix</h3>
          <div className="grid grid-cols-2 gap-4 h-64">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">True Negative</span>
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">85,201</span>
              <span className="text-xs text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded mt-2">Correct Normal</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">False Positive</span>
              <span className="text-3xl font-bold text-red-700 dark:text-red-400">12</span>
              <span className="text-xs text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded mt-2">False Alarm</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">False Negative</span>
              <span className="text-3xl font-bold text-red-700 dark:text-red-400">5</span>
              <span className="text-xs text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded mt-2">Missed Fraud</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">True Positive</span>
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">1,240</span>
              <span className="text-xs text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded mt-2">Caught Fraud</span>
            </div>
          </div>
        </div>

        {/* Feature Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Fraud vs Normal Distribution (V14 vs V10)</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                 <XAxis type="number" dataKey="x" name="V14" unit="" tick={{fill: isDark ? '#94a3b8' : '#64748b'}} />
                 <YAxis type="number" dataKey="y" name="V10" unit="" tick={{fill: isDark ? '#94a3b8' : '#64748b'}} />
                 <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{
                      borderRadius: '8px', 
                      border: isDark ? '1px solid #334155' : 'none', 
                      backgroundColor: isDark ? '#1e293b' : '#fff',
                      color: isDark ? '#fff' : '#000'
                    }}
                 />
                 <Legend />
                 <Scatter name="Transactions" data={modelPerformanceData} fill="#8884d8">
                    {modelPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Fraud' ? '#ef4444' : '#3b82f6'} />
                    ))}
                 </Scatter>
               </ScatterChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent API Logs</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Endpoint</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Latency</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
            {[200, 200, 403, 200, 500].map((status, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleTimeString()}</td>
                <td className="px-6 py-3 text-sm text-slate-900 dark:text-white font-mono">/api/v1/predict</td>
                <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">POST</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${status === 200 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">{Math.floor(Math.random() * 100)}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};