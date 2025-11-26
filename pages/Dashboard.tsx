import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Users, AlertOctagon } from 'lucide-react';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
}

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold mt-2 text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trendUp ? (
        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
      </span>
      <span className="text-sm text-slate-400 ml-1">vs last month</span>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  // Calculate stats dynamically from props
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const fraudCount = transactions.filter(t => t.isFraud).length;
  const fraudVolume = transactions.filter(t => t.isFraud).reduce((acc, t) => acc + t.amount, 0);
  
  // Prepare Chart Data (group by date)
  const chartData = useMemo(() => {
    const days: Record<string, {name: string, transactions: number, fraud: number}> = {};
    const today = new Date();
    
    // Initialize last 7 days
    for(let i=6; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const name = d.toLocaleDateString('en-US', { weekday: 'short' });
      days[name] = { name, transactions: 0, fraud: 0 };
    }

    // Fill with data
    transactions.forEach(t => {
      const d = new Date(t.timestamp);
      const name = d.toLocaleDateString('en-US', { weekday: 'short' });
      if (days[name]) {
        days[name].transactions += t.amount;
        if (t.isFraud) days[name].fraud += t.amount;
      }
    });

    return Object.values(days);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
        <div className="flex space-x-2">
           <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
             <option>Last 7 Days</option>
             <option>Last 30 Days</option>
             <option>This Year</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Transactions" 
          value={transactions.length.toLocaleString()}
          trend="+12.5%" 
          trendUp={true} 
          icon={Activity}
          color="bg-blue-500"
        />
        <StatCard 
          title="Fraud Detected" 
          value={fraudCount.toLocaleString()} 
          trend={fraudCount > 5 ? "+12%" : "-2.4%"} 
          trendUp={false} 
          icon={AlertOctagon}
          color="bg-red-500"
        />
        <StatCard 
          title="Total Volume" 
          value={`$${(totalVolume / 1000).toFixed(1)}k`} 
          trend="+8.2%" 
          trendUp={true} 
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Avg Transaction" 
          value={`$${(totalVolume / transactions.length).toFixed(0)}`}
          trend="+5.1%" 
          trendUp={true} 
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Transaction Volume vs Fraud</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" />
                <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFraud)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Fraud by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Electronics', value: 400 },
                { name: 'Travel', value: 300 },
                { name: 'Services', value: 200 },
                { name: 'Retail', value: 100 },
              ]} layout="vertical">
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={80} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {/* Reusing existing data variable from closure scope, should be fine or defined outside */}
                    {['#ef4444', '#f97316', '#eab308', '#3b82f6'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
             <div className="flex items-center justify-between text-sm">
               <span className="flex items-center text-slate-600"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>Electronics</span>
               <span className="font-semibold text-slate-900">40%</span>
             </div>
             <div className="flex items-center justify-between text-sm">
               <span className="flex items-center text-slate-600"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Travel</span>
               <span className="font-semibold text-slate-900">30%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};