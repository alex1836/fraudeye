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
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  transactions: Transaction[];
}

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: any) => {
  const { dir, t } = useLanguage();
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trendUp ? (
          <ArrowUpRight className={`w-4 h-4 text-green-500 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
        ) : (
          <ArrowDownRight className={`w-4 h-4 text-red-500 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
        )}
        <span className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
        <span className={`text-sm text-slate-400 dark:text-slate-500 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('vsLastMonth') || 'vs last month'}</span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const { t, dir } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{t('dash.title')}</h1>
        <div className="flex space-x-2 rtl:space-x-reverse">
           <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors">
             <option>{t('time.last7')}</option>
             <option>{t('time.last30')}</option>
             <option>{t('time.year')}</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('dash.totalTx')}
          value={transactions.length.toLocaleString()}
          trend="+12.5%" 
          trendUp={true} 
          icon={Activity}
          color="bg-blue-500"
        />
        <StatCard 
          title={t('dash.fraud')} 
          value={fraudCount.toLocaleString()} 
          trend={fraudCount > 5 ? "+12%" : "-2.4%"} 
          trendUp={false} 
          icon={AlertOctagon}
          color="bg-red-500"
        />
        <StatCard 
          title={t('dash.volume')} 
          value={`$${(totalVolume / 1000).toFixed(1)}k`} 
          trend="+8.2%" 
          trendUp={true} 
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <StatCard 
          title={t('dash.avg')} 
          value={`$${(totalVolume / transactions.length).toFixed(0)}`}
          trend="+5.1%" 
          trendUp={true} 
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t('dash.chart.vol')}</h3>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b'}} inverted={dir === 'rtl'} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b'}} orientation={dir === 'rtl' ? 'right' : 'left'} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '8px', 
                    border: isDark ? '1px solid #334155' : 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#fff' : '#000'
                  }}
                  itemStyle={{ color: isDark ? '#e2e8f0' : '#334155' }}
                />
                <Area type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" />
                <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFraud)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t('dash.chart.cat')}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Electronics', value: 400 },
                { name: 'Travel', value: 300 },
                { name: 'Services', value: 200 },
                { name: 'Retail', value: 100 },
              ]} layout="vertical">
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={80} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} axisLine={false} tickLine={false} orientation={dir === 'rtl' ? 'right' : 'left'} />
                 <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{
                      borderRadius: '8px', 
                      border: isDark ? '1px solid #334155' : 'none', 
                      backgroundColor: isDark ? '#1e293b' : '#fff',
                      color: isDark ? '#fff' : '#000'
                    }}
                 />
                 <Bar dataKey="value" radius={dir === 'rtl' ? [4, 0, 0, 4] : [0, 4, 4, 0]}>
                    {['#ef4444', '#f97316', '#eab308', '#3b82f6'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
             <div className="flex items-center justify-between text-sm">
               <span className="flex items-center text-slate-600 dark:text-slate-400"><span className={`w-2 h-2 rounded-full bg-red-500 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}></span>Electronics</span>
               <span className="font-semibold text-slate-900 dark:text-white">40%</span>
             </div>
             <div className="flex items-center justify-between text-sm">
               <span className="flex items-center text-slate-600 dark:text-slate-400"><span className={`w-2 h-2 rounded-full bg-orange-500 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}></span>Travel</span>
               <span className="font-semibold text-slate-900 dark:text-white">30%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};