import { Transaction, Alert } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 50 }).map((_, i) => {
  const isFraud = Math.random() > 0.92;
  return {
    id: `txn_${1000 + i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    amount: parseFloat((Math.random() * (isFraud ? 5000 : 500)).toFixed(2)),
    merchant: isFraud ? "Unknown Overseas Vendor" : ["Amazon", "Walmart", "Uber", "Starbucks", "Target"][Math.floor(Math.random() * 5)],
    category: isFraud ? "Electronics" : ["Retail", "Dining", "Travel", "Groceries"][Math.floor(Math.random() * 4)],
    location: isFraud ? "Lagos, NG" : "New York, US",
    riskScore: isFraud ? 0.95 : 0.02,
    isFraud,
    status: (isFraud ? 'BLOCKED' : 'APPROVED') as 'BLOCKED' | 'APPROVED',
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const MOCK_ALERTS: Alert[] = MOCK_TRANSACTIONS
  .filter(t => t.isFraud)
  .map(t => ({
    id: `alert_${t.id}`,
    transactionId: t.id,
    timestamp: t.timestamp,
    severity: 'high',
    message: `High risk transaction detected: ${t.merchant} ($${t.amount})`,
    read: false,
  }));

export const generateRandomTransaction = (idOffset: number = 0): Transaction => {
  const isFraud = Math.random() > 0.85; // Slightly higher chance for demo purposes
  const merchants = ["Amazon", "Netflix", "Apple Store", "Unknown Vendor", "Uber Eats", "Target", "Shell Station"];
  const categories = ["Retail", "Subscription", "Electronics", "Digital", "Dining", "Groceries", "Fuel"];
  const locations = ["New York, US", "San Francisco, US", "London, UK", "Moscow, RU", "Lagos, NG", "Paris, FR"];

  return {
    id: `txn_${Date.now()}_${idOffset}`,
    timestamp: new Date().toISOString(),
    amount: parseFloat((Math.random() * (isFraud ? 2000 : 200) + 10).toFixed(2)),
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    location: isFraud ? locations[Math.floor(Math.random() * 3) + 3] : locations[Math.floor(Math.random() * 3)],
    riskScore: isFraud ? 0.85 + Math.random() * 0.14 : Math.random() * 0.1,
    isFraud,
    status: isFraud ? 'BLOCKED' : 'APPROVED',
  };
};
