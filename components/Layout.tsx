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
  Link,
  Languages,
  Sun,
  Moon
} from 'lucide-react';
import { User, Alert } from '../types';
import { LogoIcon } from './Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  alerts: Alert[];
}

const SidebarItem = ({ icon: Icon, label, active, onClick, dir }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 mb-1 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800'
    }`}
  >
    <Icon className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
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
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:relative flex flex-col
        border-r border-slate-800 dark:border-slate-800
        ${dir === 'rtl' ? (sidebarOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full lg:translate-x-0') : (sidebarOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full lg:translate-x-0')}
      `}>
        <div className="flex items-center justify-center h-20 border-b border-slate-800">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <LogoIcon className="w-10 h-10 shadow-lg" />
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {t('app.name')}
            </span>
          </div>
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto">
          <nav>
            <div className="mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
              {t('nav.overview')}
            </div>
            <SidebarItem 
              icon={LayoutDashboard} 
              label={t('nav.dashboard')} 
              active={activePage === 'dashboard'} 
              onClick={() => onNavigate('dashboard')} 
              dir={dir}
            />
            <SidebarItem 
              icon={Activity} 
              label={t('nav.fraudCheck')} 
              active={activePage === 'fraud-check'} 
              onClick={() => onNavigate('fraud-check')} 
              dir={dir}
            />
            <SidebarItem 
              icon={CreditCard} 
              label={t('nav.transactions')} 
              active={activePage === 'transactions'} 
              onClick={() => onNavigate('transactions')} 
              dir={dir}
            />
            <SidebarItem 
              icon={Database} 
              label={t('nav.integrations')} 
              active={activePage === 'integrations'} 
              onClick={() => onNavigate('integrations')} 
              dir={dir}
            />
            
            <div className="mt-8 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
              {t('nav.management')}
            </div>
            {user.role === 'ADMIN' && (
              <SidebarItem 
                icon={Settings} 
                label={t('nav.admin')} 
                active={activePage === 'admin'} 
                onClick={() => onNavigate('admin')} 
                dir={dir}
              />
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className={`overflow-hidden ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {t('nav.signOut')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className={`hidden md:flex items-center flex-1 max-w-md ${dir === 'rtl' ? 'mr-4' : 'ml-4'}`}>
            <div className="relative w-full text-slate-500 dark:text-slate-400 focus-within:text-blue-600 dark:focus-within:text-blue-400">
              <div className={`absolute inset-y-0 flex items-center pointer-events-none ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                className={`block w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors text-slate-900 dark:text-white ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                placeholder={t('header.search')} 
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
             {/* Theme Toggle */}
             <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
             >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             {/* Language Switcher */}
             <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none text-sm font-medium"
              >
                <Languages className="w-5 h-5" />
                <span className={`hidden sm:block ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}>{language.toUpperCase()}</span>
              </button>
              
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                  <div className={`absolute mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                    <button 
                      onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 ${language === 'en' ? 'bg-slate-50 dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => { setLanguage('ar'); setShowLangMenu(false); }}
                      className={`block w-full text-right px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-arabic ${language === 'ar' ? 'bg-slate-50 dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      العربية
                    </button>
                    <button 
                      onClick={() => { setLanguage('fr'); setShowLangMenu(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 ${language === 'fr' ? 'bg-slate-50 dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      Français
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
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
                  <div className={`absolute mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-20 ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-xl">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{t('notifications')}</h3>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-0.5 px-2 rounded-full text-xs font-medium">{unreadCount} {t('notif.new')}</span>
                    </div>
                    <div className="max-h-[24rem] overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="bg-slate-50 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('notif.empty')}</p>
                        </div>
                      ) : (
                        alerts.slice(0, 10).map((alert) => (
                          <div key={alert.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 cursor-pointer group">
                            <div className="flex items-start gap-3">
                              <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-blue-500'}`} />
                              <div className="flex-1">
                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{alert.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-xl">
                      <button 
                        onClick={() => { onNavigate('transactions'); setShowNotifications(false); }}
                        className="w-full py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow"
                      >
                        {t('notif.viewAll')}
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