import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Settings, 
  Globe, 
  CheckCircle, 
  Copy, 
  Server,
  Shield,
  ShieldAlert,
  Code,
  Key,
  Lock,
  Zap,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  Send
} from 'lucide-react';
import { Transaction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { generateApiSecret } from '../services/mockData';

interface IntegrationsProps {
  onAddTransaction: (txn: Transaction) => void;
}

type Tab = 'docs' | 'console' | 'webhooks';
type CodeLang = 'js' | 'python' | 'php';

export const Integrations: React.FC<IntegrationsProps> = ({ onAddTransaction }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('docs');
  const [activeLang, setActiveLang] = useState<CodeLang>('js');
  
  // API Credentials
  const [apiKey] = useState('pk_live_51MzXy2K9Q8Zj3N4m5L6k7P8');
  const [showKey, setShowKey] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState('whsec_...');
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // Console State
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [consoleResponse, setConsoleResponse] = useState<string | null>(null);
  const [consoleParams, setConsoleParams] = useState({
    business_name: 'TechMega Store',
    business_location: 'New York, US',
    user_id: 'usr_88219',
    amount: 150.00,
    device_fingerprint: 'fp_a1b2c3d4',
    ip_address: '192.168.1.55'
  });

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleRevealSecret = () => {
    if (webhookSecret.includes('...')) {
      setWebhookSecret(generateApiSecret());
    }
  };

  const runConsoleRequest = () => {
    setConsoleLoading(true);
    setConsoleResponse(null);

    // Simulate Network Latency and AI Processing
    setTimeout(() => {
      const isHighRisk = consoleParams.amount > 2000 || consoleParams.ip_address.startsWith('45.');
      const riskScore = isHighRisk ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 15);
      
      const response = {
        id: `evt_${Date.now().toString(36)}`,
        object: "fraud_check",
        timestamp: new Date().toISOString(),
        risk_score: riskScore,
        decision: riskScore > 85 ? "BLOCK" : riskScore > 50 ? "REVIEW" : "SAFE",
        reasons: isHighRisk 
          ? ["High transaction amount", "Suspicious IP range"] 
          : ["Known device fingerprint", "Low velocity"],
        processing_time_ms: 145
      };

      setConsoleResponse(JSON.stringify(response, null, 2));
      setConsoleLoading(false);

      // Add to main app state if critical
      if (riskScore > 50) {
        onAddTransaction({
          id: response.id,
          timestamp: response.timestamp,
          amount: consoleParams.amount,
          merchant: consoleParams.business_name,
          category: 'API Check',
          location: consoleParams.business_location,
          riskScore: riskScore / 100,
          isFraud: riskScore > 85,
          status: riskScore > 85 ? 'BLOCKED' : 'APPROVED'
        });
      }
    }, 1200);
  };

  const testWebhook = () => {
    if (!webhookUrl) {
      alert("Please enter a Webhook URL first.");
      return;
    }
    const mockPayload = {
      type: "fraud.detected",
      data: {
        transaction_id: "txn_99921",
        risk_score: 92,
        action: "BLOCK"
      },
      created: Math.floor(Date.now() / 1000)
    };
    alert(`Test event sent to ${webhookUrl}\n\nPayload:\n${JSON.stringify(mockPayload, null, 2)}`);
  };

  // --- Code Snippets ---
  const codeSnippets = {
    js: `const response = await fetch('https://api.fraudeye-system.com/v1/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey}'
  },
  body: JSON.stringify({
    business_name: 'My Store',
    amount: 150.00,
    user_id: 'user_123',
    ip_address: '1.2.3.4',
    device_fingerprint: 'fp_x9y8z7'
  })
});

const data = await response.json();
console.log(data.decision); // SAFE, REVIEW, or BLOCK`,
    
    python: `import requests

url = "https://api.fraudeye-system.com/v1/check"
headers = {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "business_name": "My Store",
    "amount": 150.00,
    "user_id": "user_123",
    "ip_address": "1.2.3.4",
    "device_fingerprint": "fp_x9y8z7"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,

    php: `$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.fraudeye-system.com/v1/check");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'x-api-key: ${apiKey}',
    'Content-Type: application/json'
));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array(
    "business_name" => "My Store",
    "amount" => 150.00,
    "user_id" => "user_123"
)));

$result = curl_exec($ch);
print_r(json_decode($result));`
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header & API Keys */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Developer API</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Integrate FraudEye into your stack. Use your keys to sign requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-lg p-1 pr-4 border border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md mr-3">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col mr-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Public Key</span>
                <span className="text-sm font-mono text-slate-900 dark:text-white">
                  {showKey ? apiKey : apiKey.substring(0, 12) + '...'}
                </span>
              </div>
              <button 
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
              <button 
                onClick={() => copyToClipboard(apiKey, 'key')}
                className="p-1.5 ml-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-600 transition-colors relative"
              >
                {copyFeedback === 'key' ? <CheckCircle className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab('docs')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm font-medium transition-all ${activeTab === 'docs' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Code className="w-4 h-4 mr-3" />
            Documentation
          </button>
          <button 
            onClick={() => setActiveTab('console')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm font-medium transition-all ${activeTab === 'console' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Terminal className="w-4 h-4 mr-3" />
            API Console
          </button>
          <button 
            onClick={() => setActiveTab('webhooks')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center text-sm font-medium transition-all ${activeTab === 'webhooks' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Globe className="w-4 h-4 mr-3" />
            Webhooks
          </button>

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 px-4">
             <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Service Health</h4>
             <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                All Systems Operational
             </div>
             <p className="text-xs text-slate-400 mt-2">Latency: 45ms</p>
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 w-full min-w-0">
          
          {/* --- TAB: DOCUMENTATION --- */}
          {activeTab === 'docs' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Endpoint Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                    <Server className="w-4 h-4 mr-2 text-blue-500" />
                    Check Transaction
                  </h3>
                  <div className="flex items-center space-x-2">
                     <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">POST</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center bg-slate-900 rounded-lg p-3 font-mono text-sm text-slate-300 mb-4 group relative">
                    <span className="text-blue-400 mr-2">POST</span>
                    <span className="text-white">https://api.fraudeye-system.com/v1/check</span>
                    <button 
                      onClick={() => copyToClipboard('https://api.fraudeye-system.com/v1/check', 'url')}
                      className="absolute right-2 top-2 p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {copyFeedback === 'url' ? <CheckCircle className="w-4 h-4 text-green-400"/> : <Copy className="w-4 h-4"/>}
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Submit transaction details for real-time fraud analysis. Returns a risk score and decision immediately.
                  </p>
                </div>
              </div>

              {/* Request Parameters */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Request Body</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Field</th>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { name: 'business_name', type: 'string', desc: 'Name of the merchant/store.' },
                        { name: 'business_location', type: 'string', desc: 'City, Country code (e.g., "Paris, FR").' },
                        { name: 'user_id', type: 'string', desc: 'Unique identifier for the customer.' },
                        { name: 'amount', type: 'number', desc: 'Transaction value (decimal).' },
                        { name: 'device_fingerprint', type: 'string', desc: 'Unique device hash ID.' },
                        { name: 'ip_address', type: 'string', desc: 'Customer IP (IPv4 or IPv6).' },
                      ].map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="px-6 py-3 font-mono text-blue-600 dark:text-blue-400">{row.name}</td>
                          <td className="px-6 py-3 text-slate-500">{row.type}</td>
                          <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code Examples */}
              <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950">
                   <div className="flex space-x-4">
                     {(['js', 'python', 'php'] as CodeLang[]).map((lang) => (
                       <button
                         key={lang}
                         onClick={() => setActiveLang(lang)}
                         className={`text-xs font-medium uppercase tracking-wider py-2 border-b-2 transition-colors ${activeLang === lang ? 'border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                       >
                         {lang === 'js' ? 'Node.js' : lang}
                       </button>
                     ))}
                   </div>
                   <button 
                    onClick={() => copyToClipboard(codeSnippets[activeLang], 'code')}
                    className="text-slate-400 hover:text-white transition-colors"
                   >
                     {copyFeedback === 'code' ? <CheckCircle className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                   </button>
                </div>
                <div className="p-4 overflow-x-auto">
                   <pre className="text-sm font-mono leading-relaxed">
                     <code className="text-slate-300">
                       {codeSnippets[activeLang]}
                     </code>
                   </pre>
                </div>
              </div>

            </div>
          )}

          {/* --- TAB: CONSOLE --- */}
          {activeTab === 'console' && (
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fadeIn">
               {/* Request Form */}
               <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                 <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                   <Terminal className="w-5 h-5 mr-2 text-slate-500" />
                   Request Builder
                 </h3>
                 <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Business Name</label>
                      <input 
                        type="text" 
                        value={consoleParams.business_name}
                        onChange={(e) => setConsoleParams({...consoleParams, business_name: e.target.value})}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Amount ($)</label>
                      <input 
                        type="number" 
                        value={consoleParams.amount}
                        onChange={(e) => setConsoleParams({...consoleParams, amount: parseFloat(e.target.value)})}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">IP Address</label>
                        <input 
                          type="text" 
                          value={consoleParams.ip_address}
                          onChange={(e) => setConsoleParams({...consoleParams, ip_address: e.target.value})}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">User ID</label>
                        <input 
                          type="text" 
                          value={consoleParams.user_id}
                          onChange={(e) => setConsoleParams({...consoleParams, user_id: e.target.value})}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Device Fingerprint</label>
                      <input 
                        type="text" 
                        value={consoleParams.device_fingerprint}
                        onChange={(e) => setConsoleParams({...consoleParams, device_fingerprint: e.target.value})}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        onClick={runConsoleRequest}
                        disabled={consoleLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {consoleLoading ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Run Request
                          </>
                        )}
                      </button>
                    </div>
                 </div>
               </div>

               {/* Response View */}
               <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col shadow-inner">
                 <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                    <h3 className="font-bold text-slate-300 flex items-center">
                      <Server className="w-4 h-4 mr-2" />
                      Response
                    </h3>
                    {consoleResponse && (
                       <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded font-mono">200 OK</span>
                    )}
                 </div>
                 <div className="flex-1 font-mono text-sm overflow-auto">
                   {consoleResponse ? (
                     <pre className="text-green-400 animate-fadeIn">
                       {consoleResponse}
                     </pre>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <Terminal className="w-12 h-12 mb-4 opacity-20" />
                        <p>Waiting for request...</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>
          )}

          {/* --- TAB: WEBHOOKS --- */}
          {activeTab === 'webhooks' && (
             <div className="space-y-6 animate-fadeIn">
               
               <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                 <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Endpoint Configuration</h3>
                      <p className="text-sm text-slate-500 mt-1">We'll send POST requests to this URL when significant events occur.</p>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                      <Zap className="w-6 h-6" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Callback URL</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Globe className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                          <input 
                            type="url" 
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            placeholder="https://your-api.com/webhooks/fraud-alerts"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:opacity-90 transition-opacity">
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Signing Secret</label>
                       <div className="flex items-center justify-between">
                          <code className="font-mono text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700">
                             {webhookSecret}
                          </code>
                          <button 
                            onClick={handleRevealSecret}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {webhookSecret.includes('...') ? 'Reveal' : 'Roll Key'}
                          </button>
                       </div>
                       <p className="text-xs text-slate-500 mt-2">
                         Use this secret to verify the <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">X-FraudEye-Signature</code> header in incoming requests.
                       </p>
                    </div>
                 </div>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4">Test Delivery</h3>
                 <p className="text-sm text-slate-500 mb-4">Send a mock event to your configured endpoint to test the connection.</p>
                 <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-300 mb-4 overflow-x-auto border border-slate-800">
                   {`{
  "type": "fraud.detected",
  "data": {
    "transaction_id": "txn_99921",
    "risk_score": 92,
    "action": "BLOCK"
  },
  "created": 1714850000
}`}
                 </div>
                 <button 
                  onClick={testWebhook}
                  className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                 >
                   <Send className="w-4 h-4 mr-2" />
                   Send Test Event
                 </button>
               </div>
             </div>
          )}

        </div>
      </div>

      {/* Footer / Security Notes */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
         <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 flex gap-4">
           <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg h-fit">
             <Lock className="w-5 h-5" />
           </div>
           <div>
             <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">Security & Best Practices</h4>
             <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
               <li>Rate Limit: 100 requests per second per API key.</li>
               <li>Always verify the signature of webhook events to prevent replay attacks.</li>
               <li>Never expose your Secret Key in client-side code.</li>
               <li>All API communication is encrypted over TLS 1.3.</li>
             </ul>
           </div>
         </div>
      </div>

    </div>
  );
};