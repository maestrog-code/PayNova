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

export const INITIAL_STOCKS_DATA: MarketCoin[] = [
  { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA Corp', price: 924.75, change24h: 4.15, volume: '$48.2B', history: Array.from({length: 20}, () => ({value: 900 + Math.random() * 50})) },
  { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change24h: 1.25, volume: '$52.4B', history: Array.from({length: 20}, () => ({value: 185 + Math.random() * 10})) },
  { id: 'msft', symbol: 'MSFT', name: 'Microsoft', price: 425.20, change24h: 0.85, volume: '$30.1B', history: Array.from({length: 20}, () => ({value: 420 + Math.random() * 10})) },
  { id: 'amzn', symbol: 'AMZN', name: 'Amazon.com', price: 182.10, change24h: 0.45, volume: '$22.3B', history: Array.from({length: 20}, () => ({value: 180 + Math.random() * 5})) },
  { id: 'tsla', symbol: 'TSLA', name: 'Tesla Inc.', price: 175.50, change24h: -1.20, volume: '$18.5B', history: Array.from({length: 20}, () => ({value: 170 + Math.random() * 15})) },
  { id: 'googl', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 172.80, change24h: -0.35, volume: '$15.8B', history: Array.from({length: 20}, () => ({value: 170 + Math.random() * 5})) },
];

export const INITIAL_FOREX_DATA: MarketCoin[] = [
  { id: 'eurusd', symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0845, change24h: 0.15, volume: '$120B', history: Array.from({length: 20}, () => ({value: 1.08 + Math.random() * 0.01})) },
  { id: 'gbpusd', symbol: 'GBP/USD', name: 'British Pound / USD', price: 1.2730, change24h: -0.12, volume: '$95B', history: Array.from({length: 20}, () => ({value: 1.27 + Math.random() * 0.01})) },
  { id: 'usdjpy', symbol: 'USD/JPY', name: 'US Dollar / Yen', price: 155.40, change24h: 0.25, volume: '$88B', history: Array.from({length: 20}, () => ({value: 155 + Math.random() * 1})) },
  { id: 'audusd', symbol: 'AUD/USD', name: 'Aus Dollar / US Dollar', price: 0.6620, change24h: 0.35, volume: '$38B', history: Array.from({length: 20}, () => ({value: 0.66 + Math.random() * 0.01})) },
  { id: 'usdcad', symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: 1.3650, change24h: 0.05, volume: '$42B', history: Array.from({length: 20}, () => ({value: 1.36 + Math.random() * 0.01})) },
  { id: 'usdchf', symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', price: 0.9050, change24h: -0.08, volume: '$35B', history: Array.from({length: 20}, () => ({value: 0.90 + Math.random() * 0.01})) },
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