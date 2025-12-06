import { MarketCoin, Transaction, Wallet } from '../types';

export const INITIAL_WALLETS: Wallet[] = [
  { currency: 'USD', balance: 15420.50, change: 2.50, isCrypto: false },
  { currency: 'EUR', balance: 8930.75, change: 1.12, isCrypto: false },
  { currency: 'BTC', balance: 0.4500, change: 5.20, isCrypto: true },
  { currency: 'ETH', balance: 4.210, change: -1.4, isCrypto: true },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'received', counterparty: 'Sarah Wilson', amount: 500, currency: 'USD', date: '2 hours ago', status: 'completed' },
  { id: '2', type: 'sent', counterparty: 'Michael Chen', amount: 1200, currency: 'EUR', date: '5 hours ago', status: 'completed' },
  { id: '3', type: 'exchange', counterparty: 'USD to BTC', amount: 800, currency: 'USD', date: '1 day ago', status: 'completed' },
  { id: '4', type: 'received', counterparty: 'Staking Reward', amount: 0.05, currency: 'ETH', date: '2 days ago', status: 'completed' },
];

export const INITIAL_MARKET_DATA: MarketCoin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 89634.00, change24h: 1.37, volume: '$45.1B', history: Array.from({length: 20}, () => ({value: 89000 + Math.random() * 2000})) },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3033.40, change24h: -2.98, volume: '$22.6B', history: Array.from({length: 20}, () => ({value: 3000 + Math.random() * 200})) },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 132.94, change24h: 2.79, volume: '$3.8B', history: Array.from({length: 20}, () => ({value: 120 + Math.random() * 20})) },
  { id: 'bnb', symbol: 'BNB', name: 'Binance Coin', price: 585.65, change24h: 0.71, volume: '$1.4B', history: Array.from({length: 20}, () => ({value: 580 + Math.random() * 10})) },
  { id: 'xrp', symbol: 'XRP', name: 'Ripple', price: 2.03, change24h: -1.69, volume: '$2.7B', history: Array.from({length: 20}, () => ({value: 1.9 + Math.random() * 0.3})) },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', price: 0.14, change24h: 3.23, volume: '$1.1B', history: Array.from({length: 20}, () => ({value: 0.12 + Math.random() * 0.04})) },
];

// Helper to simulate live price updates
export const simulatePriceUpdate = (coins: MarketCoin[]): MarketCoin[] => {
  return coins.map(coin => {
    const volatility = 0.002; // 0.2% fluctuation
    const change = 1 + (Math.random() * volatility * 2 - volatility);
    const newPrice = coin.price * change;
    
    // Update history for sparkline
    const newHistory = [...coin.history.slice(1), { value: newPrice }];

    return {
      ...coin,
      price: newPrice,
      change24h: coin.change24h + (Math.random() * 0.1 - 0.05), // Slight drift in 24h change
      history: newHistory
    };
  });
};