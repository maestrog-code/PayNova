
import React, { useMemo } from 'react';
import { Button } from './ui/Button';
import { Repeat, Send, MessageSquare, Snowflake, Heart, Ghost, Sparkles } from 'lucide-react';
import { NavView, SeasonalTheme } from '../types';

export const Dashboard: React.FC<{ onNavigate: (view: NavView) => void }> = ({ onNavigate }) => {
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
    <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn space-y-16 py-10 relative">
      
      {/* Cinematic Atmosphere Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,172,254,0.1)_0%,_transparent_70%)] animate-pulse"></div>
      </div>

      {/* Central Visual Core */}
      <div className="relative group">
        <div className="absolute inset-[-40px] rounded-full border border-current opacity-[0.03] animate-[spin_25s_linear_infinite]"></div>
        <div className="absolute inset-[-20px] rounded-full blur-[80px] bg-blue-500/5"></div>
        
        <div className={`relative w-72 h-72 md:w-96 md:h-96 rounded-full flex items-center justify-center border overflow-hidden transition-all duration-700 shadow-2xl dark:bg-black dark:border-white/10 bg-white border-slate-200`}>
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-[3000ms]"
            style={{ backgroundImage: `url(${currentTheme.texture})`, backgroundSize: 'cover' }}
          ></div>
          
          <div className="w-48 h-48 relative flex items-center justify-center">
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
             <div className="z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 dark:bg-black/60 dark:border-white/10 bg-slate-50 border border-slate-200 group-hover:scale-110">
                <div className="animate-pulse">{currentTheme.icon}</div>
             </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:bg-white/5 dark:border-white/5 bg-slate-100 border-slate-200">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[8px] text-gray-500 uppercase tracking-[0.4em] font-black">
                    Quantum Active
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
          <div className="flex flex-col items-center">
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none">
                <span style={{ color: currentTheme.logoPart }}>PAY</span>
                <span className={`bg-gradient-to-b bg-clip-text text-transparent dark:from-white dark:to-gray-600 from-slate-900 to-slate-400`}>NOVA</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-lg font-medium tracking-[0.5em] uppercase opacity-60 mt-2">The Future of Value</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl pt-10 px-6">
            <button onClick={() => onNavigate('exchange')} className="group p-8 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden dark:bg-white/[0.02] dark:border-white/5 dark:hover:border-blue-500/30 bg-slate-50 border-slate-200 hover:border-blue-500/30">
                <Repeat className="w-8 h-8 text-blue-500 mb-4 group-hover:rotate-180 transition-transform duration-700" />
                <h3 className="font-bold text-lg mb-1">Exchange</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">Direct Liquidity</p>
            </button>
            <button onClick={() => onNavigate('transfer')} className="group p-8 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden dark:bg-white/[0.02] dark:border-white/5 dark:hover:border-green-500/30 bg-slate-50 border-slate-200 hover:border-green-500/30">
                <Send className="w-8 h-8 text-green-500 mb-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <h3 className="font-bold text-lg mb-1">Transfer</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">Global Node</p>
            </button>
            <button onClick={() => onNavigate('assistant')} className="group p-8 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden dark:bg-white/[0.02] dark:border-white/5 dark:hover:border-purple-500/30 bg-slate-50 border-slate-200 hover:border-purple-500/30">
                <MessageSquare className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-1">Nova AI</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">Quantum Insight</p>
            </button>
          </div>
      </div>
    </div>
  );
};
