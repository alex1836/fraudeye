import React, { useState } from 'react';
import { analyzeTransactionRisk } from '../services/geminiService';
import { FraudPrediction } from '../types';
import { ShieldCheck, ShieldAlert, Loader2, Info, Activity } from 'lucide-react';

export const FraudCheck: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '120.00',
    merchant: 'Amazon US',
    category: 'Retail',
    location: 'New York, US',
    timestamp: new Date().toISOString().slice(0, 16)
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudPrediction | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const prediction = await analyzeTransactionRisk({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    setResult(prediction);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Real-time Fraud Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Input transaction details below to run the ML model and Gemini reasoning engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-fit transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b dark:border-slate-800 pb-2">Transaction Details</h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transaction Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Merchant Name</label>
              <input 
                type="text" 
                value={formData.merchant}
                onChange={(e) => setFormData({...formData, merchant: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                >
                  <option>Retail</option>
                  <option>Electronics</option>
                  <option>Travel</option>
                  <option>Services</option>
                  <option>Dining</option>
                  <option>Groceries</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timestamp</label>
              <input 
                type="datetime-local" 
                value={formData.timestamp}
                onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Risk...
                  </>
                ) : (
                  'Analyze Risk'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
              <Activity className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Ready to Analyze</p>
              <p className="text-sm">Submit transaction details to see risk assessment.</p>
            </div>
          )}

          {result && (
            <>
              {/* Score Card */}
              <div className={`
                p-6 rounded-xl shadow-sm border-l-8 
                ${result.isFraud 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                  : 'bg-green-50 dark:bg-green-900/20 border-green-500'
                } transition-colors
              `}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-xl font-bold ${result.isFraud ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                      {result.isFraud ? 'High Fraud Probability' : 'Low Fraud Risk'}
                    </h3>
                    <p className={`text-sm mt-1 ${result.isFraud ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'}`}>
                      Confidence Score: <span className="font-bold text-lg">{(result.confidence * 100).toFixed(1)}%</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${result.isFraud ? 'bg-red-200 dark:bg-red-900/50' : 'bg-green-200 dark:bg-green-900/50'}`}>
                    {result.isFraud ? (
                      <ShieldAlert className={`w-8 h-8 ${result.isFraud ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                    ) : (
                      <ShieldCheck className={`w-8 h-8 ${result.isFraud ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Explanation Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center mb-4">
                  <Info className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Model Explanation (SHAP-like)</h3>
                </div>
                
                <div className="space-y-3">
                  {result.explanation.map((reason, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className={`mt-1.5 w-2 h-2 rounded-full mr-3 shrink-0 ${result.isFraud ? 'bg-red-400' : 'bg-green-400'}`} />
                      <p className="text-slate-700 dark:text-slate-300 text-sm">{reason}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                   <h4 className="text-xs font-semibold uppercase text-slate-400 mb-3">Feature Contribution (Simulation)</h4>
                   {/* Simulated feature bars */}
                   <div className="space-y-2">
                     <div className="flex items-center text-sm">
                       <span className="w-24 text-slate-500 dark:text-slate-400">Amount</span>
                       <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ml-2">
                         <div className="h-full bg-blue-500" style={{ width: `${Math.min(result.confidence * 120, 100)}%` }}></div>
                       </div>
                     </div>
                     <div className="flex items-center text-sm">
                       <span className="w-24 text-slate-500 dark:text-slate-400">Merchant</span>
                       <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ml-2">
                         <div className="h-full bg-blue-400" style={{ width: `${Math.min(result.confidence * 90, 100)}%` }}></div>
                       </div>
                     </div>
                     <div className="flex items-center text-sm">
                       <span className="w-24 text-slate-500 dark:text-slate-400">Location</span>
                       <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ml-2">
                         <div className="h-full bg-blue-300" style={{ width: `${Math.min(result.confidence * 60, 100)}%` }}></div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};