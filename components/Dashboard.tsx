
import React, { useMemo, useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Repeat, Send, MessageSquare, Snowflake, Heart, Ghost, Sparkles, Activity, Globe, Zap } from 'lucide-react';
import { NavView, SeasonalTheme, API_BASE_URL } from '../types';

interface SystemStats {
  volume: string;
  activeNodes: number;
  latency: string;
}

export const Dashboard: React.FC<{ onNavigate: (view: NavView) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState<SystemStats>({ volume: "$1.2B", activeNodes: 420, latency: "14ms" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/system/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.warn("Using fallback dashboard stats");
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const seasonalTheme: SeasonalTheme = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    if (month === 9 && day >= 20) return 'halloween';
    if ((month === 11 && day >= 10) || (month === 0 && day <= 5)) return 'winter';
    if (month === 1 && day >= 10 && day <= 15) return 'valentine';
    return 'default';
  }, []);

  const themeConfig = {
    default: {
      accent: '#4facfe',
      logoPart: '#9cff57',
      texture: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      icon: <Sparkles className="w-8 h-8 text-[#4facfe]" />
    },
    halloween: {
      accent: '#ff7700',
      logoPart: '#a855f7',
      texture: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800',
      icon: <Ghost className="w-8 h-8 text-orange-400" />
    },
    winter: {
      accent: '#9edbff',
      logoPart: '#4facfe',
      texture: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=800',
      icon: <Snowflake className="w-8 h-8 text-blue-400" />
    },
    valentine: {
      accent: '#ff4f81',
      logoPart: '#f43f5e',
      texture: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800',
      icon: <Heart className="w-8 h-8 text-pink-400" />
    }
  };

  const currentTheme = themeConfig[seasonalTheme];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn space-y-12 py-6 relative">
      
      {/* Central Visual Core */}
      <div className="relative group scale-90 md:scale-100">
        <div className="absolute inset-[-40px] rounded-full border border-current opacity-[0.03] animate-[spin_25s_linear_infinite]"></div>
        <div className="absolute inset-[-20px] rounded-full blur-[80px] bg-blue-500/5"></div>
        
        <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center border overflow-hidden transition-all duration-700 shadow-2xl dark:bg-black dark:border-white/10 bg-white border-slate-200`}>
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-[3000ms]"
            style={{ backgroundImage: `url(${currentTheme.texture})`, backgroundSize: 'cover' }}
          ></div>
          
          <div className="w-40 h-40 relative flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full opacity-40 absolute inset-0">
                <defs>
                    <linearGradient id="vortexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={currentTheme.accent} />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                <g className="animate-[spin_8s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <path key={i} d="M 50,50 L 95,50 A 45,45 0 0 0 50,5 Z" fill="url(#vortexGrad)" transform={`rotate(${i * 30}, 50, 50)`} opacity="0.3" />
                  ))}
                </g>
             </svg>
             <div className="z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 dark:bg-black/60 dark:border-white/10 bg-slate-50 border border-slate-200 group-hover:scale-110">
                <div className="animate-pulse">{currentTheme.icon}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
          <div className="flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                <span style={{ color: currentTheme.logoPart }}>PAY</span>
                <span className={`bg-gradient-to-b bg-clip-text text-transparent dark:from-white dark:to-gray-600 from-slate-900 to-slate-400`}>NOVA</span>
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-4">
              <div className="flex flex-col items-center gap-1">
                  <Activity className="w-4 h-4 text-[#4facfe]" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Latency</span>
                  <span className="text-sm font-mono text-white">{stats.latency}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                  <Globe className="w-4 h-4 text-[#9cff57]" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Nodes</span>
                  <span className="text-sm font-mono text-white">{stats.activeNodes}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">24h Volume</span>
                  <span className="text-sm font-mono text-white">{stats.volume}</span>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-8 px-6">
            <button onClick={() => onNavigate('exchange')} className="group p-6 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden dark:bg-white/[0.02] dark:border-white/5 dark:hover:border-blue-500/30 bg-slate-50 border-slate-200 hover:border-blue-500/30">
                <Repeat className="w-6 h-6 text-blue-500 mb-3 group-hover:rotate-180 transition-transform duration-700" />
                <h3 className="font-bold text-base mb-1">Exchange</h3>
                <p className="text-[8px] text-gray-500 font-bold tracking-wider uppercase">Direct Liquidity</p>
            </button>
            <button onClick={() => onNavigate('transfer')} className="group p-6 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden dark:bg-white/[0.02] dark:border-white/5 dark:hover:border-green-500/30 bg-slate-50 border-slate-200 hover:border-green-500/30">
                <Send className="w-6 h-6 text-green-500 mb-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <h3 className="font-bold text-base mb-1">Transfer</h3>
                <p className="text-[8px] text-gray-500 font-bold tracking-wider uppercase">Global Node</p>
            </button>
            <button onClick={() => onNavigate('assistant')} className="group p-6 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden dark:bg-white/[0.02] dark:border-white/5 dark:hover:border-purple-500/30 bg-slate-50 border-slate-200 hover:border-purple-500/30">
                <MessageSquare className="w-6 h-6 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Nova AI</h3>
                <p className="text-[8px] text-gray-500 font-bold tracking-wider uppercase">Quantum Insight</p>
            </button>
          </div>
      </div>
    </div>
  );
};
