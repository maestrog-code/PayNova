
export type NavView = 'home' | 'exchange' | 'transfer' | 'assistant';
export type SeasonalTheme = 'default' | 'halloween' | 'winter' | 'valentine';
export type AppTheme = 'light' | 'dark';

export const API_BASE_URL = 'https://paynova-backend-349841929338.us-central1.run.app';

export interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'exchange';
  counterparty: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Wallet {
  currency: string;
  balance: number;
  change: number;
  isCrypto: boolean;
}

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  history: { value: number }[];
}

export interface ExchangeRate {
  pair: string;
  rate: number;
  change: number;
}
