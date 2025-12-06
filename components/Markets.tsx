import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { simulatePriceUpdate, INITIAL_MARKET_DATA } from '../services/mockData';
import { MarketCoin } from '../types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Search, Filter, Star } from 'lucide-react';

export const Markets: React.FC = () => {
  const [coins, setCoins] = useState<MarketCoin[]>(INITIAL_MARKET_DATA);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(currentCoins => simulatePriceUpdate(currentCoins));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
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

      <div className="flex gap-4 overflow-x-auto pb-2">
        <button className="px-6 py-2 rounded-full bg-[#4facfe] text-black font-semibold whitespace-nowrap">Crypto</button>
        <button className="px-6 py-2 rounded-full bg-[#1e2a5e]/40 border border-[#4facfe]/30 text-white hover:border-[#4facfe] whitespace-nowrap">Stocks</button>
        <button className="px-6 py-2 rounded-full bg-[#1e2a5e]/40 border border-[#4facfe]/30 text-white hover:border-[#4facfe] whitespace-nowrap">Forex</button>
      </div>

      {/* Featured Coin (Bitcoin) */}
      {filteredCoins.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <img src={`https://ui-avatars.com/api/?name=${filteredCoins[0].symbol}&background=random&color=fff&size=32`} className="rounded-full w-8 h-8" alt="icon" />
                 <h3 className="font-bold text-xl">{filteredCoins[0].name}</h3>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">${filteredCoins[0].price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`font-medium ${filteredCoins[0].change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {filteredCoins[0].change24h > 0 ? '+' : ''}{filteredCoins[0].change24h.toFixed(2)}%
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Star className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredCoins[0].history}>
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
                  strokeWidth={2} 
                  dot={false} 
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Market List */}
      <div className="space-y-4">
        {filteredCoins.map(coin => (
          <Card key={coin.id} className="flex items-center justify-between p-4 hover:bg-[#4facfe]/5 transition-colors group">
            <div className="flex items-center gap-4 w-1/3">
              <div className="w-10 h-10 rounded-full bg-[#1e2a5e] flex items-center justify-center text-[#4facfe] font-bold border border-[#4facfe]/30">
                {coin.symbol[0]}
              </div>
              <div>
                <p className="font-bold">{coin.name}</p>
                <p className="text-xs text-gray-400">{coin.symbol} • Vol: {coin.volume}</p>
              </div>
            </div>
            
            <div className="hidden md:block w-1/3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={coin.history}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={coin.change24h >= 0 ? '#76c958' : '#ef4444'} 
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={false} // Disable animation for list for performance
                  />
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-right w-1/3">
              <p className="font-bold transition-colors duration-300">
                ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: (coin.price < 1 ? 4 : 2) })}
              </p>
              <p className={`text-sm ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};