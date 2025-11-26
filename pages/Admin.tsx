import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Database, Server, Cpu, Activity } from 'lucide-react';

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
  return (
    <div className="space-y-8">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
         <p className="text-slate-500">Model Performance & System Health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
           <div className="p-4 bg-indigo-100 text-indigo-600 rounded-lg mr-4">
             <Cpu className="w-8 h-8" />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500">Model Accuracy</p>
             <p className="text-2xl font-bold text-slate-900">99.8%</p>
             <p className="text-xs text-green-600 font-medium">XGBoost v2.1</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
           <div className="p-4 bg-blue-100 text-blue-600 rounded-lg mr-4">
             <Server className="w-8 h-8" />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500">API Latency</p>
             <p className="text-2xl font-bold text-slate-900">45ms</p>
             <p className="text-xs text-slate-500">99th Percentile</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
           <div className="p-4 bg-orange-100 text-orange-600 rounded-lg mr-4">
             <Database className="w-8 h-8" />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500">Total Records</p>
             <p className="text-2xl font-bold text-slate-900">2.4M</p>
             <p className="text-xs text-slate-500">PostgreSQL DB</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Confusion Matrix</h3>
          <div className="grid grid-cols-2 gap-4 h-64">
            <div className="bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 text-sm mb-1">True Negative</span>
              <span className="text-3xl font-bold text-blue-700">85,201</span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-2">Correct Normal</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 text-sm mb-1">False Positive</span>
              <span className="text-3xl font-bold text-red-700">12</span>
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded mt-2">False Alarm</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 text-sm mb-1">False Negative</span>
              <span className="text-3xl font-bold text-red-700">5</span>
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded mt-2">Missed Fraud</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 text-sm mb-1">True Positive</span>
              <span className="text-3xl font-bold text-blue-700">1,240</span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-2">Caught Fraud</span>
            </div>
          </div>
        </div>

        {/* Feature Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Fraud vs Normal Distribution (V14 vs V10)</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid />
                 <XAxis type="number" dataKey="x" name="V14" unit="" />
                 <YAxis type="number" dataKey="y" name="V10" unit="" />
                 <Tooltip cursor={{ strokeDasharray: '3 3' }} />
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Recent API Logs</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Endpoint</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Latency</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[200, 200, 403, 200, 500].map((status, i) => (
              <tr key={i}>
                <td className="px-6 py-3 text-sm text-slate-500">{new Date().toLocaleTimeString()}</td>
                <td className="px-6 py-3 text-sm text-slate-900 font-mono">/api/v1/predict</td>
                <td className="px-6 py-3 text-sm text-slate-500">POST</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${status === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500">{Math.floor(Math.random() * 100)}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};