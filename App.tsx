import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FraudCheck } from './pages/FraudCheck';
import { Transactions } from './pages/Transactions';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Integrations } from './pages/Integrations'; // New Import
import { User, UserRole, Transaction, Alert } from './types';
import { MOCK_TRANSACTIONS, MOCK_ALERTS } from './services/mockData';

const App: React.FC = () => {
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

  const handleLogin = (role: UserRole) => {
    const newUser: User = {
      id: '1',
      name: role === UserRole.ADMIN ? 'System Administrator' : 'John Doe',
      email: role === UserRole.ADMIN ? 'admin@bank.com' : 'user@bank.com',
      role: role
    };
    setUser(newUser);
    localStorage.setItem('fraudGuardUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fraudGuardUser');
    setActivePage('dashboard');
  };

  // Function to simulate incoming transaction flow
  const handleAddTransaction = (txn: Transaction) => {
    setTransactions(prev => [txn, ...prev]);
    
    // Auto-create alert if fraud
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

export default App;