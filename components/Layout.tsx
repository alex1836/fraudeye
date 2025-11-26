import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  Bell,
  Search,
  Activity,
  Check,
  Database,
  Link
} from 'lucide-react';
import { User, Alert } from '../types';
import { LogoIcon } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  alerts: Alert[];
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 mb-1 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  activePage, 
  onNavigate, 
  onLogout,
  alerts 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-20 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <LogoIcon className="w-10 h-10 shadow-lg" />
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              FraudEye
            </span>
          </div>
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto">
          <nav>
            <div className="mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
              Overview
            </div>
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={activePage === 'dashboard'} 
              onClick={() => onNavigate('dashboard')} 
            />
            <SidebarItem 
              icon={Activity} 
              label="Fraud Check" 
              active={activePage === 'fraud-check'} 
              onClick={() => onNavigate('fraud-check')} 
            />
            <SidebarItem 
              icon={CreditCard} 
              label="Transactions" 
              active={activePage === 'transactions'} 
              onClick={() => onNavigate('transactions')} 
            />
            <SidebarItem 
              icon={Database} 
              label="Integrations" 
              active={activePage === 'integrations'} 
              onClick={() => onNavigate('integrations')} 
            />
            
            <div className="mt-8 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
              Management
            </div>
            {user.role === 'ADMIN' && (
              <SidebarItem 
                icon={Settings} 
                label="Admin Panel" 
                active={activePage === 'admin'} 
                onClick={() => onNavigate('admin')} 
              />
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
            <div className="relative w-full text-slate-500 focus-within:text-blue-600">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Search transactions, users, or alerts..." 
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                      <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                      <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-medium">{unreadCount} New</span>
                    </div>
                    <div className="max-h-[24rem] overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        alerts.slice(0, 10).map((alert) => (
                          <div key={alert.id} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer group">
                            <div className="flex items-start gap-3">
                              <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-blue-500'}`} />
                              <div className="flex-1">
                                <p className="text-sm text-slate-800 font-medium leading-snug group-hover:text-blue-600 transition-colors">{alert.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                      <button 
                        onClick={() => { onNavigate('transactions'); setShowNotifications(false); }}
                        className="w-full py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm hover:shadow"
                      >
                        View All Activity
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};