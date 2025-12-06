export type NavView = 'home' | 'exchange' | 'transfer' | 'markets';

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