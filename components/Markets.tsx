
import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MarketCoin, API_BASE_URL } from '../types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Search, Filter, Star, X, CheckCircle2, Bell, BellRing, TrendingUp, Loader2 } from 'lucide-react';

interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'alert';
}

type MarketCategory = 'crypto' | 'stocks' | 'forex' | 'watchlist';

export const Markets: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('crypto');
  const [marketData, setMarketData] = useState<{ [key: string]: MarketCoin[] }>({
    crypto: [],
    stocks: [],
    forex: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('paynova_watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Transaction State
  const [selectedCoin, setSelectedCoin] = useState<MarketCoin | null>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell' | null>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Alert State
  const [alertCoin, setAlertCoin] = useState<MarketCoin | null>(null);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');
  const [activeAlerts, setActiveAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem('paynova_watchlist', JSON.stringify(starredIds));
  }, [starredIds]);

  // Fetch real-time market data from backend
  const fetchMarketData = async () => {
    try {
      // Assuming backend has a categorized market endpoint
      const response = await fetch(`${API_BASE_URL}/markets?category=${activeCategory}`);
      if (!response.ok) throw new Error('Market fetch failed');
      const data = await response.json();
      
      setMarketData(prev => ({
        ...prev,
        [activeCategory]: data
      }));
      
      checkAlerts(data);
    } catch (err) {
      console.error('Market API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000); // Poll every 5 seconds for "realtime" feel
    return () => clearInterval(interval);
  }, [activeCategory, activeAlerts]);

  const checkAlerts = (coins: MarketCoin[]) => {
    const newNotifications: Notification[] = [];
    const remainingAlerts: PriceAlert[] = [];

    activeAlerts.forEach(alert => {
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) {
        remainingAlerts.push(alert);
        return;
      }

      let isTriggered = false;
      if (alert.condition === 'above' && coin.price >= alert.targetPrice) {
        isTriggered = true;
      } else if (alert.condition === 'below' && coin.price <= alert.targetPrice) {
        isTriggered = true;
      }

      if (isTriggered) {
        newNotifications.push({
          id: Date.now().toString() + Math.random(),
          title: 'Price Alert Triggered!',
          message: `${coin.name} has crossed ${alert.condition} $${alert.targetPrice.toLocaleString()}`,
          type: 'alert'
        });
      } else {
        remainingAlerts.push(alert);
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
      setActiveAlerts(remainingAlerts);
      setTimeout(() => {
        setNotifications(prev => prev.slice(newNotifications.length));
      }, 5000);
    }
  };

  const toggleWatchlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStarredIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getSourceList = () => {
    if (activeCategory === 'watchlist') {
      return Object.values(marketData).flat().filter(coin => starredIds.includes(coin.id));
    }
    return marketData[activeCategory] || [];
  };

  const displayedCoins = getSourceList()
    .filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.change24h - a.change24h);

  const topAsset = (activeCategory !== 'watchlist' && displayedCoins.length > 0) ? displayedCoins[0] : null;

  const handleTransaction = (coin: MarketCoin, type: 'buy' | 'sell') => {
    setSelectedCoin(coin);
    setTransactionType(type);
    setAmount('');
    setShowSuccess(false);
  };

  const closeTransaction = () => {
    setSelectedCoin(null);
    setTransactionType(null);
    setShowSuccess(false);
  };

  const executeTransaction = async () => {
    if (!amount || !selectedCoin) return;
    setIsProcessing(true);
    try {
        const response = await fetch(`${API_BASE_URL}/trade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                coinId: selectedCoin.id,
                type: transactionType,
                amount: parseFloat(amount)
            })
        });
        if (!response.ok) throw new Error('Trade execution failed');
        setShowSuccess(true);
        setTimeout(closeTransaction, 2000);
    } catch (error) {
        alert('Trade failed. Please check backend connection.');
    } finally {
        setIsProcessing(false);
    }
  };

  const openAlertModal = (coin: MarketCoin) => {
    setAlertCoin(coin);
    setAlertTargetPrice(coin.price.toFixed(2));
  };

  const createAlert = () => {
    if (!alertCoin || !alertTargetPrice) return;
    const target = parseFloat(alertTargetPrice);
    const condition = target > alertCoin.price ? 'above' : 'below';
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      coinId: alertCoin.id,
      coinName: alertCoin.name,
      targetPrice: target,
      condition,
    };
    setActiveAlerts([...activeAlerts, newAlert]);
    setAlertCoin(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      <div className="fixed top-24 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto p-4 rounded-lg shadow-lg border backdrop-blur-md flex items-start gap-3 ${n.type === 'alert' ? 'bg-[#1e2a5e]/90 border-[#4facfe] text-white' : 'bg-green-900/90 border-green-500 text-white'}`}>
            <div className={`p-2 rounded-full ${n.type === 'alert' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-green-500/20 text-green-400'}`}>
              {n.type === 'alert' ? <BellRing className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{n.title}</h4>
              <p className="text-xs opacity-90">{n.message}</p>
            </div>
            <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {selectedCoin && transactionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <Card className="w-full max-w-md relative overflow-hidden">
            {!showSuccess && <button onClick={closeTransaction} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"><X className="w-5 h-5" /></button>}
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]"><CheckCircle2 className="w-8 h-8 text-black" /></div>
                 <h3 className="text-2xl font-bold mb-2">Transaction Successful</h3>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold capitalize">{transactionType} {selectedCoin.name}</h3>
                  <p className="text-sm text-[#4facfe]">Backend Price: ${selectedCoin.price.toLocaleString()}</p>
                </div>
                <div className="space-y-4">
                   <div>
                     <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" autoFocus className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 pl-8 text-white focus:border-[#4facfe] focus:outline-none" />
                     </div>
                   </div>
                </div>
                <Button fullWidth onClick={executeTransaction} disabled={!amount || isProcessing}>{isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : `Confirm ${transactionType}`}</Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {alertCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-sm relative">
            <button onClick={() => setAlertCoin(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-6">Set Price Alert</h3>
            <div className="space-y-4">
               <input type="number" value={alertTargetPrice} onChange={(e) => setAlertTargetPrice(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white" />
               <Button fullWidth onClick={createAlert}>Create Alert</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Backend Markets</h2>
          <p className="text-gray-400 text-sm">Real-time data from PayNova Node Network</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search markets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1e2a5e]/40 border border-[#4facfe]/30 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {['crypto', 'stocks', 'forex', 'watchlist'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat as MarketCategory)} className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#4facfe] text-black font-bold' : 'bg-[#1e2a5e]/40 border border-[#4facfe]/30 text-white'}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4facfe]" /></div>
      ) : (
        <div className="space-y-4">
          {displayedCoins.map(coin => (
            <Card key={coin.id} className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 hover:bg-[#4facfe]/5 transition-all group">
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <button onClick={(e) => toggleWatchlist(e, coin.id)}><Star className={`w-5 h-5 ${starredIds.includes(coin.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} /></button>
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#1e2a5e] flex items-center justify-center text-[#4facfe] font-bold">{coin.symbol[0]}</div>
                <div className="truncate"><p className="font-bold">{coin.name}</p><p className="text-xs text-gray-400">{coin.symbol}</p></div>
              </div>
              <div className="text-right flex-1">
                <p className="font-bold">${coin.price.toLocaleString()}</p>
                <p className={`text-sm ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openAlertModal(coin)} className="p-2 rounded-lg bg-[#1e2a5e]/30 text-gray-400 hover:text-[#4facfe]"><Bell className="w-4 h-4" /></button>
                <button onClick={() => handleTransaction(coin, 'buy')} className="px-4 py-1.5 rounded-lg bg-[#4facfe]/10 text-[#4facfe] border border-[#4facfe]/30 hover:bg-[#4facfe] hover:text-black">Buy</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
