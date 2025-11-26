export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  merchant: string;
  category: string;
  location: string;
  riskScore: number;
  isFraud: boolean;
  status: 'PENDING' | 'APPROVED' | 'BLOCKED' | 'FLAGGED';
  features?: Record<string, number>; // V1-V28 simulation
}

export interface FraudPrediction {
  isFraud: boolean;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string[];
  shapValues?: Record<string, number>;
}

export interface Alert {
  id: string;
  transactionId: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  read: boolean;
}

export type Period = '24h' | '7d' | '30d' | '1y';

export interface Integration {
  id: string;
  name: string;
  type: 'SHEET' | 'API' | 'WEBHOOK';
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  lastSync: string;
  config?: Record<string, string>;
}