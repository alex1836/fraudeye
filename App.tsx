import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FraudCheck } from './pages/FraudCheck';
import { Transactions } from './pages/Transactions';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Integrations } from './pages/Integrations'; 
import { User, UserRole, Transaction, Alert } from './types';
import { MOCK_TRANSACTIONS, MOCK_ALERTS } from './services/mockData';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  // Auto-login check (simulated)
  useEffect(() => {
    const storedUser = localStorage.getItem('fraudGuardUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem('fraudGuardUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fraudGuardUser');
    setActivePage('dashboard');
  };

  const handleAddTransaction = (txn: Transaction) => {
    setTransactions(prev => [txn, ...prev]);
    
    if (txn.isFraud) {
      const newAlert: Alert = {
        id: `alert_${txn.id}`,
        transactionId: txn.id,
        timestamp: txn.timestamp,
        severity: 'high',
        message: `High risk transaction detected via API: ${txn.merchant} ($${txn.amount})`,
        read: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'fraud-check':
        return <FraudCheck />;
      case 'transactions':
        return <Transactions transactions={transactions} />;
      case 'integrations':
        return <Integrations onAddTransaction={handleAddTransaction} />;
      case 'admin':
        return user.role === UserRole.ADMIN ? <Admin /> : <Dashboard transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <Layout 
      user={user} 
      activePage={activePage} 
      onNavigate={setActivePage}
      onLogout={handleLogout}
      alerts={alerts}
    >
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;