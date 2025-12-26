
import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { simulatePriceUpdate, INITIAL_MARKET_DATA, INITIAL_STOCKS_DATA, INITIAL_FOREX_DATA } from '../services/mockData';
import { MarketCoin } from '../types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Search, Filter, Star, X, CheckCircle2, Bell, BellRing, TrendingUp } from 'lucide-react';

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
  const [marketData, setMarketData] = useState({
    crypto: INITIAL_MARKET_DATA,
    stocks: INITIAL_STOCKS_DATA,
    forex: INITIAL_FOREX_DATA
  });
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

  // Simulate real-time updates and check alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const newData = {
            crypto: simulatePriceUpdate(prev.crypto),
            stocks: simulatePriceUpdate(prev.stocks),
            forex: simulatePriceUpdate(prev.forex)
        };
        
        // Check alerts across all categories
        checkAlerts([...newData.crypto, ...newData.stocks, ...newData.forex]);
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeAlerts]);

  const checkAlerts = (allCoins: MarketCoin[]) => {
    const newNotifications: Notification[] = [];
    const remainingAlerts: PriceAlert[] = [];

    activeAlerts.forEach(alert => {
      const coin = allCoins.find(c => c.id === alert.coinId);
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
      return [...marketData.crypto, ...marketData.stocks, ...marketData.forex]
        .filter(coin => starredIds.includes(coin.id));
    }
    return marketData[activeCategory];
  };

  const displayedCoins = getSourceList()
    .filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.change24h - a.change24h); // Sort by profitability

  const topAsset = (activeCategory !== 'watchlist' && displayedCoins.length > 0) ? displayedCoins[0] : null;

  // --- Transaction Handlers ---
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

  const executeTransaction = () => {
    if (!amount) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        closeTransaction();
      }, 2000);
    }, 1500);
  };

  // --- Alert Handlers ---
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
    
    const notif: Notification = {
      id: Date.now().toString(),
      title: 'Alert Set',
      message: `We'll notify you when ${alertCoin.symbol} is ${condition} $${target}`,
      type: 'success'
    };
    setNotifications(prev => [...prev, notif]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notif.id)), 3000);
  };

  const removeAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Notification Toast Container */}
      <div className="fixed top-24 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto p-4 rounded-lg shadow-lg border backdrop-blur-md animate-[slideIn_0.3s_ease-out] flex items-start gap-3 ${
              n.type === 'alert' 
                ? 'bg-[#1e2a5e]/90 border-[#4facfe] text-white' 
                : 'bg-green-900/90 border-green-500 text-white'
            }`}
          >
            <div className={`p-2 rounded-full ${n.type === 'alert' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-green-500/20 text-green-400'}`}>
              {n.type === 'alert' ? <BellRing className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{n.title}</h4>
              <p className="text-xs opacity-90">{n.message}</p>
            </div>
            <button onClick={() => removeNotification(n.id)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Transaction Modal */}
      {selectedCoin && transactionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-[#4facfe] shadow-[0_0_50px_rgba(79,172,254,0.15)] relative overflow-hidden">
            {!showSuccess && (
              <button 
                  onClick={closeTransaction}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                  <X className="w-5 h-5" />
              </button>
            )}

            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <CheckCircle2 className="w-8 h-8 text-black" />
                 </div>
                 <h3 className="text-2xl font-bold mb-2">Transaction Successful</h3>
                 <p className="text-gray-400">
                   You successfully {transactionType === 'buy' ? 'bought' : 'sold'} {selectedCoin.name}.
                 </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold capitalize">{transactionType} {selectedCoin.name}</h3>
                  <p className="text-sm text-[#4facfe]">Current Price: ${selectedCoin.price.toLocaleString()}</p>
                </div>
                <div className="space-y-4">
                   <div>
                     <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          autoFocus
                          className="w-full bg-[#1e2a5e]/30 border border-gray-700 rounded-lg p-4 pl-8 text-white focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe]"
                        />
                     </div>
                   </div>
                   <div className="p-4 rounded-lg bg-[#1e2a5e]/20 border border-white/5 flex justify-between items-center text-sm">
                      <span className="text-gray-400">Estimated {selectedCoin.symbol}</span>
                      <span className="font-mono font-bold">
                        {amount ? (parseFloat(amount) / selectedCoin.price).toFixed(6) : '0.000000'}
                      </span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="secondary" onClick={closeTransaction}>Cancel</Button>
                    <Button 
                      onClick={executeTransaction} 
                      disabled={!amount || isProcessing}
                      className={transactionType === 'buy' ? '' : '!bg-gradient-to-r !from-red-500 !to-pink-600 !text-white !border-none hover:!shadow-[0_0_20px_rgba(239,68,68,0.4)]'}
                    >
                      {isProcessing ? 'Processing...' : `Confirm ${transactionType === 'buy' ? 'Buy' : 'Sell'}`}
                    </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Alert Setting Modal */}
      {alertCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <Card className="w-full max-w-sm bg-[#0a0a0a] border-[#4facfe] shadow-[0_0_50px_rgba(79,172,254,0.15)] relative">
            <button 
                onClick={() => setAlertCoin(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#4facfe]/10 rounded-full text-[#4facfe]">
                    <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Set Price Alert</h3>
                  <p className="text-xs text-gray-400">For {alertCoin.name} ({alertCoin.symbol})</p>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 rounded-lg bg-[#1e2a5e]/20 border border-white/5">
                   <span className="text-gray-400 text-sm">Current Price</span>
                   <span className="font-mono font-bold">${alertCoin.price.toLocaleString()}</span>
                </div>

                <div>
                   <label className="block text-sm text-gray-400 mb-2">Target Price</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        value={alertTargetPrice}
                        onChange={(e) => setAlertTargetPrice(e.target.value)}
                        className="w-full bg-[#1e2a5e]/30 border border-gray-700 rounded-lg p-4 pl-8 text-white focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe]"
                      />
                   </div>
                   {alertTargetPrice && (
                     <p className="text-xs text-[#4facfe] mt-2 text-right">
                       Alert when price goes {parseFloat(alertTargetPrice) > alertCoin.price ? 'above' : 'below'} this value.
                     </p>
                   )}
                </div>
            </div>

            <Button fullWidth onClick={createAlert}>Create Alert</Button>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Markets</h2>
          <p className="text-gray-400 text-sm">Track global financial markets in real-time</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search markets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e2a5e]/40 border border-[#4facfe]/30 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#4facfe]"
            />
          </div>
          <button className="p-2 bg-[#1e2a5e]/40 border border-[#4facfe]/30 rounded-lg text-[#4facfe] hover:bg-[#4facfe] hover:text-black transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <button 
            onClick={() => setActiveCategory('crypto')}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === 'crypto' ? 'bg-[#4facfe] text-black font-bold shadow-[0_0_15px_rgba(79,172,254,0.4)]' : 'bg-[#1e2a5e]/40 border border-[#4facfe]/30 text-white hover:border-[#4facfe]'}`}
        >
            Crypto
        </button>
        <button 
            onClick={() => setActiveCategory('stocks')}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === 'stocks' ? 'bg-[#4facfe] text-black font-bold shadow-[0_0_15px_rgba(79,172,254,0.4)]' : 'bg-[#1e2a5e]/40 border border-[#4facfe]/30 text-white hover:border-[#4facfe]'}`}
        >
            Stocks
        </button>
        <button 
            onClick={() => setActiveCategory('forex')}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === 'forex' ? 'bg-[#4facfe] text-black font-bold shadow-[0_0_15px_rgba(79,172,254,0.4)]' : 'bg-[#1e2a5e]/40 border border-[#4facfe]/30 text-white hover:border-[#4facfe]'}`}
        >
            Forex
        </button>
        <button 
            onClick={() => setActiveCategory('watchlist')}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${activeCategory === 'watchlist' ? 'bg-[#9cff57] text-black font-bold shadow-[0_0_15px_rgba(156,255,87,0.4)]' : 'bg-[#1e2a5e]/40 border border-[#4facfe]/30 text-white hover:border-[#4facfe]'}`}
        >
            <Star className={`w-4 h-4 ${activeCategory === 'watchlist' ? 'fill-current' : ''}`} />
            Watchlist ({starredIds.length})
        </button>
      </div>

      {/* Active Alerts List */}
      {activeAlerts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {activeAlerts.map(alert => (
             <div key={alert.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2a5e]/50 border border-[#4facfe]/30 text-xs whitespace-nowrap">
               <Bell className="w-3 h-3 text-[#4facfe]" />
               <span className="text-gray-300">{alert.coinName} {alert.condition === 'above' ? '>' : '<'} ${alert.targetPrice}</span>
               <button onClick={() => removeAlert(alert.id)} className="ml-1 text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
             </div>
           ))}
        </div>
      )}

      {/* Featured Top Asset */}
      {topAsset && !searchTerm && (
        <Card className="p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 bg-[#4facfe] rounded-full blur-[100px] opacity-5"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> TOP MOVER
                 </div>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-2xl">{topAsset.name}</h3>
                <span className="text-gray-400 text-sm bg-white/5 px-2 py-1 rounded">{topAsset.symbol}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">${topAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: topAsset.price < 1 ? 4 : 2 })}</span>
                <span className={`font-bold text-lg ${topAsset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {topAsset.change24h > 0 ? '+' : ''}{topAsset.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
            <button 
              onClick={(e) => toggleWatchlist(e, topAsset.id)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Star 
                className={`w-6 h-6 transition-all duration-300 ${starredIds.includes(topAsset.id) ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-gray-400 hover:text-yellow-400'}`} 
              />
            </button>
          </div>
          <div className="h-48 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={topAsset.history}>
                <defs>
                   <linearGradient id="gradientChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4facfe" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#4facfe', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff' }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Market List */}
      <div className="space-y-4">
        {displayedCoins.length === 0 ? (
          <div className="py-20 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-[#1e2a5e]/20 rounded-full flex items-center justify-center mx-auto border border-[#4facfe]/20 text-gray-500">
               <Star className="w-8 h-8" />
            </div>
            <p className="text-gray-400">
              {activeCategory === 'watchlist' 
                ? "Your watchlist is empty. Star some assets to track them here!" 
                : "No matching assets found."}
            </p>
          </div>
        ) : (
          displayedCoins.map(coin => (
            <Card key={coin.id} className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 hover:bg-[#4facfe]/5 transition-all duration-300 group">
              
              {/* Coin Info */}
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <button 
                  onClick={(e) => toggleWatchlist(e, coin.id)}
                  className="shrink-0 group/star"
                >
                  <Star 
                    className={`w-5 h-5 transition-all duration-300 ${starredIds.includes(coin.id) ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] scale-110' : 'text-gray-600 hover:text-yellow-400/50'}`} 
                  />
                </button>
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#1e2a5e] flex items-center justify-center text-[#4facfe] font-bold border border-[#4facfe]/30 group-hover:scale-105 transition-transform">
                  {coin.symbol[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{coin.name}</p>
                  <p className="text-xs text-gray-400 truncate">{coin.symbol} • Vol: {coin.volume}</p>
                </div>
              </div>
              
              {/* Chart (Hidden on small mobile) */}
              <div className="hidden md:block w-full md:w-1/3 h-10 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coin.history}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={coin.change24h >= 0 ? '#76c958' : '#ef4444'} 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false}
                    />
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between w-full md:w-1/3 gap-4">
                 <div className="text-right flex-1">
                    <p className="font-bold">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: (coin.price < 1 ? 4 : 2) })}
                    </p>
                    <p className={`text-sm ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <button 
                      onClick={() => openAlertModal(coin)}
                      className="p-2 rounded-lg bg-[#1e2a5e]/30 text-gray-400 border border-transparent hover:text-[#4facfe] hover:border-[#4facfe]/30 transition-all"
                      title="Set Price Alert"
                   >
                      <Bell className="w-4 h-4" />
                   </button>
                   <button 
                      onClick={() => handleTransaction(coin, 'buy')}
                      className="px-4 py-1.5 rounded-lg bg-[#4facfe]/10 text-[#4facfe] border border-[#4facfe]/30 hover:bg-[#4facfe] hover:text-black font-medium text-sm transition-all"
                   >
                      Buy
                   </button>
                   <button 
                      onClick={() => handleTransaction(coin, 'sell')}
                      className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white font-medium text-sm transition-all"
                   >
                      Sell
                   </button>
                 </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
