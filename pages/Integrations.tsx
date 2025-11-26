import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Settings, 
  Globe, 
  ArrowRightLeft, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Code,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Server
} from 'lucide-react';
import { Transaction } from '../types';
import { generateRandomTransaction } from '../services/mockData';
import { analyzeTransactionRisk } from '../services/geminiService';

interface IntegrationsProps {
  onAddTransaction: (txn: Transaction) => void;
}

export const Integrations: React.FC<IntegrationsProps> = ({ onAddTransaction }) => {
  // Client Configuration State
  const [clientUrl, setClientUrl] = useState('https://api.mybank.com/v1/fraud-callback');
  const [apiKey, setApiKey] = useState('sk_live_51Mz...');
  const [configSaved, setConfigSaved] = useState(false);

  // Sandbox State
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    "transaction_id": "txn_123456789",
    "amount": 1500.00,
    "merchant": "Apple Store",
    "category": "Electronics",
    "location": "Lagos, NG",
    "timestamp": new Date().toISOString()
  }, null, 2));

  const [responseBody, setResponseBody] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'BLOCKED'>('IDLE');
  const [latency, setLatency] = useState(0);

  const handleSaveConfig = () => {
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const generateNewPayload = () => {
    const mock = generateRandomTransaction();
    const payload = {
      transaction_id: mock.id,
      amount: mock.amount,
      merchant: mock.merchant,
      category: mock.category,
      location: mock.location,
      timestamp: mock.timestamp
    };
    setRequestBody(JSON.stringify(payload, null, 2));
    setResponseBody('');
    setStatus('IDLE');
  };

  const executeApiCall = async () => {
    setStatus('LOADING');
    setResponseBody('Processing request...');
    const startTime = performance.now();

    try {
      // 1. Parse Input
      const data = JSON.parse(requestBody);

      // 2. Run AI Model (Simulated Logic + Gemini Service)
      // We convert the raw JSON into our App's Transaction format
      const analysisInput: Partial<Transaction> = {
        amount: data.amount,
        merchant: data.merchant,
        category: data.category,
        location: data.location,
        timestamp: data.timestamp
      };

      const result = await analyzeTransactionRisk(analysisInput);
      
      const isFraud = result.isFraud;
      const riskScore = result.confidence;

      // 3. Update App State (Dashboard)
      const newTransaction: Transaction = {
        id: data.transaction_id || `txn_${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        amount: data.amount,
        merchant: data.merchant,
        category: data.category,
        location: data.location,
        riskScore: riskScore,
        isFraud: isFraud,
        status: isFraud ? 'BLOCKED' : 'APPROVED'
      };

      onAddTransaction(newTransaction);

      // 4. Construct API Response (What we send back to the Bank)
      const apiResponse = {
        status: isFraud ? "DECLINED" : "APPROVED",
        risk_score: riskScore.toFixed(4),
        risk_level: result.riskLevel,
        action_taken: isFraud ? "BLOCK_TRANSACTION" : "ALLOW_TRANSACTION",
        reasons: result.explanation,
        processing_id: `req_${Date.now().toString(36)}`,
        callback_sent_to: clientUrl
      };

      // Simulate network delay
      setTimeout(() => {
        const endTime = performance.now();
        setLatency(Math.round(endTime - startTime));
        setResponseBody(JSON.stringify(apiResponse, null, 2));
        setStatus(isFraud ? 'BLOCKED' : 'SUCCESS');
      }, 800);

    } catch (e) {
      setResponseBody(JSON.stringify({ error: "Invalid JSON format in request body" }, null, 2));
      setStatus('IDLE');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">API Sandbox & Integration</h1>
        <p className="text-slate-500">Configure client endpoints and test the Fraud Detection Engine in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          {/* Localhost Alert */}
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Server className="w-24 h-24" />
             </div>
             <h3 className="font-bold text-lg mb-2 flex items-center">
               <Server className="w-5 h-5 mr-2 text-green-400" />
               Run Real Backend
             </h3>
             <p className="text-slate-300 text-sm mb-4">
               To process real external requests, run the included Python server:
             </p>
             <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-green-300 mb-2 border border-slate-700">
               uvicorn backend.main:app --reload
             </div>
             <p className="text-[10px] text-slate-400">
               Listening on: http://127.0.0.1:8000
             </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-slate-500 mr-2" />
              <h3 className="font-bold text-slate-900">Client Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Callback URL (Webhook)</label>
                <div className="relative">
                   <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                   <input 
                    type="text" 
                    value={clientUrl}
                    onChange={(e) => setClientUrl(e.target.value)}
                    className="w-full pl-9 p-2 text-sm border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono"
                   />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">We send the decision (Block/Allow) to this URL.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value={apiKey}
                    readOnly
                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-slate-50 font-mono text-slate-500"
                  />
                  <button className="p-2 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSaveConfig}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                {configSaved ? <CheckCircle className="w-4 h-4 mr-2" /> : null}
                {configSaved ? 'Saved' : 'Update Configuration'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2 text-sm">Integration Guide</h3>
            <p className="text-xs text-blue-800 mb-4 leading-relaxed">
              To integrate your banking system:
            </p>
            <ol className="list-decimal pl-4 text-xs text-blue-700 space-y-2">
              <li>Send a <b>POST</b> request to <code>api.fraudeye.com/predict</code></li>
              <li>Include transaction details in JSON body.</li>
              <li>We return a decision immediately.</li>
              <li>(Optional) We also send a webhook to your Callback URL.</li>
            </ol>
            <button className="mt-4 text-xs text-blue-600 font-medium hover:underline flex items-center">
              View Full Documentation <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Sandbox */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          
          {/* Toolbar */}
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <span className="text-slate-200 font-mono text-sm font-medium">API Playground</span>
            </div>
            <div className="flex items-center space-x-3">
               <button 
                 onClick={generateNewPayload}
                 className="text-xs text-slate-400 hover:text-white transition-colors"
               >
                 Generate Sample Data
               </button>
               <button 
                onClick={executeApiCall}
                disabled={status === 'LOADING'}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-bold flex items-center transition-all"
               >
                 {status === 'LOADING' ? 'Processing...' : (
                   <>
                     <Play className="w-3 h-3 mr-2 fill-current" />
                     SEND REQUEST
                   </>
                 )}
               </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700">
            
            {/* Input (Request) */}
            <div className="flex flex-col h-full">
              <div className="px-4 py-2 bg-slate-800/50 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between">
                <span>Request Body (JSON)</span>
                <span className="text-slate-500">POST /v1/predict</span>
              </div>
              <textarea 
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="flex-1 bg-slate-900 text-slate-300 p-4 font-mono text-sm focus:outline-none resize-none"
                spellCheck="false"
              />
            </div>

            {/* Output (Response) */}
            <div className="flex flex-col h-full bg-black/20">
              <div className="px-4 py-2 bg-slate-800/50 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between items-center">
                <span>Response Body</span>
                <div className="flex items-center space-x-3">
                  {status !== 'IDLE' && status !== 'LOADING' && (
                    <span className="text-xs text-slate-500">{latency}ms</span>
                  )}
                  {status === 'SUCCESS' && <span className="text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> 200 OK</span>}
                  {status === 'BLOCKED' && <span className="text-red-400 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> 403 FORBIDDEN</span>}
                </div>
              </div>
              <div className="relative flex-1">
                 <textarea 
                    readOnly
                    value={responseBody}
                    placeholder="// Response will appear here..."
                    className={`w-full h-full bg-transparent p-4 font-mono text-sm focus:outline-none resize-none ${
                        status === 'BLOCKED' ? 'text-red-300' : 'text-green-300'
                    }`}
                  />
                  {status === 'LOADING' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Flow Diagram */}
      <div className="mt-12 border-t border-slate-200 pt-12">
        <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">Data Flow Architecture</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm w-48">
             <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
               <Globe className="w-6 h-6 text-slate-600" />
             </div>
             <p className="font-bold text-slate-900">Client / Bank</p>
             <p className="text-xs text-slate-500">Sends Transaction</p>
          </div>

          <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />
          <div className="rotate-90 md:rotate-0 text-slate-300"><ArrowRight className="w-6 h-6 md:hidden" /></div>

          <div className="p-4 bg-blue-600 border border-blue-700 rounded-xl shadow-lg w-48 text-white relative">
             <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm animate-pulse">
                AI ACTIVE
             </div>
             <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
               <ArrowRightLeft className="w-6 h-6 text-white" />
             </div>
             <p className="font-bold">FraudEye API</p>
             <p className="text-xs text-blue-100">Analyzes Risk</p>
          </div>

          <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />
          <div className="rotate-90 md:rotate-0 text-slate-300"><ArrowRight className="w-6 h-6 md:hidden" /></div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm w-48 relative">
             <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
               <CheckCircle className="w-6 h-6 text-green-600" />
             </div>
             <p className="font-bold text-slate-900">Response</p>
             <p className="text-xs text-slate-500">JSON Decision</p>
          </div>
        </div>
      </div>
    </div>
  );
};