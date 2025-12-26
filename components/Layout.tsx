
import React, { useMemo } from 'react';
import { NavView, SeasonalTheme, AppTheme } from '../types';
import { LayoutDashboard, Repeat, Send, MessageSquare, Bell, User, LogOut, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onLogout: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout, theme, onToggleTheme }) => {
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
      dark: { bg: 'radial-gradient(circle at 50% 0%, #0d122b 0%, #000000 100%)', texture: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000' },
      light: { bg: 'radial-gradient(circle at 50% 0%, #f0f4f8 0%, #ffffff 100%)', texture: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000' },
      accent: '#4facfe',
      logoPart: '#9cff57',
      particles: []
    },
    halloween: {
      dark: { bg: 'radial-gradient(circle at 50% 0%, #2a104a 0%, #0a0510 100%)', texture: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=2000' },
      light: { bg: 'radial-gradient(circle at 50% 0%, #fff7ed 0%, #ffffff 100%)', texture: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=2000' },
      accent: '#ff7700',
      logoPart: '#a855f7',
      particles: ['🎃', '🦇', '👻', '🕸️']
    },
    winter: {
      dark: { bg: 'radial-gradient(circle at 50% 0%, #102a43 0%, #050a10 100%)', texture: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=2000' },
      light: { bg: 'radial-gradient(circle at 50% 0%, #f1f5f9 0%, #ffffff 100%)', texture: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=2000' },
      accent: '#4facfe',
      logoPart: '#3b82f6',
      particles: ['❄️', '✨', '🌨️', '⛄']
    },
    valentine: {
      dark: { bg: 'radial-gradient(circle at 50% 0%, #4a1024 0%, #100508 100%)', texture: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=2000' },
      light: { bg: 'radial-gradient(circle at 50% 0%, #fff1f2 0%, #ffffff 100%)', texture: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=2000' },
      accent: '#ff4f81',
      logoPart: '#f43f5e',
      particles: ['❤️', '💖', '💘', '🌹']
    }
  };

  const currentThemeConfig = themeConfig[seasonalTheme];
  const activeStyle = theme === 'dark' ? currentThemeConfig.dark : currentThemeConfig.light;

  const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'exchange', label: 'Exchange', icon: <Repeat className="w-5 h-5" /> },
    { id: 'transfer', label: 'Transfer', icon: <Send className="w-5 h-5" /> },
    { id: 'assistant', label: 'Assistant', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className={`min-h-screen relative flex flex-col selection:bg-[#4facfe] selection:text-black transition-colors duration-500 ${theme === 'dark' ? 'text-white bg-black' : 'text-slate-900 bg-white'}`}>
      {/* Real-world Texture Background */}
      <div 
        className="fixed inset-0 z-[-2] opacity-10 mix-blend-overlay grayscale pointer-events-none"
        style={{ 
          backgroundImage: `url(${activeStyle.texture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Animated Atmosphere */}
      <div className="fixed inset-0 z-[-1] transition-all duration-700" style={{ background: activeStyle.bg }}></div>
      <div className={`fixed inset-0 z-[-1] transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100' : 'opacity-30'}`} style={{ background: 'radial-gradient(circle at 80% 20%, rgba(79,172,254,0.15) 0%, transparent 50%)' }}></div>

      {/* Seasonal Particles */}
      {currentThemeConfig.particles.length > 0 && Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i} 
          className="particle" 
          style={{ 
            left: `${Math.random() * 100}vw`,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * -20}s`,
            fontSize: `${10 + Math.random() * 20}px`,
            filter: theme === 'dark' ? 'blur(1px)' : 'none'
          }}
        >
          {currentThemeConfig.particles[i % currentThemeConfig.particles.length]}
        </div>
      ))}

      {/* Top Navigation */}
      <header className={`sticky top-0 z-50 backdrop-blur-3xl border-b transition-all duration-300 ${theme === 'dark' ? 'bg-black/20 border-white/5 shadow-2xl' : 'bg-white/40 border-slate-200 shadow-lg'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
                 <svg viewBox="0 0 100 100" className="w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                    <defs>
                        <linearGradient id="vortexGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={currentThemeConfig.accent} />
                            <stop offset="100%" stopColor={theme === 'dark' ? '#ffffff' : '#000000'} stopOpacity="0.2" />
                        </linearGradient>
                         <filter id="vortexBlurHeader" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
                        </filter>
                    </defs>
                    <g className="animate-[spin_10s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <path
                          key={i}
                          d="M 50,50 L 90,50 A 40,40 0 0 0 50,10 Z"
                          fill="url(#vortexGradHeader)"
                          transform={`rotate(${i * 45}, 50, 50)`}
                          opacity="0.6"
                          filter="url(#vortexBlurHeader)"
                        />
                      ))}
                    </g>
                    <circle cx="50" cy="50" r="18" fill={theme === 'dark' ? 'black' : 'white'} />
                 </svg>
              </div>
              <div className="text-2xl font-bold tracking-wider">
                <span style={{ color: currentThemeConfig.logoPart, textShadow: theme === 'dark' ? `0 0 12px ${currentThemeConfig.logoPart}44` : 'none' }}>PAY</span>
                <span className={`bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-500' : 'from-slate-900 to-slate-500'} bg-clip-text text-transparent`}>NOVA</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 relative ${
                    currentView === item.id 
                      ? (theme === 'dark' ? 'text-white bg-white/5' : 'text-slate-900 bg-slate-900/5 font-bold')
                      : (theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-900/5')
                  }`}
                >
                  <span className={currentView === item.id ? (theme === 'dark' ? 'text-[#4facfe]' : 'text-blue-600') : ''}>{item.icon}</span>
                  <span className="text-sm tracking-wide">{item.label}</span>
                  {currentView === item.id && (
                    <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full blur-[2px] ${theme === 'dark' ? 'bg-[#4facfe]' : 'bg-blue-600'}`}></div>
                  )}
                </button>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onToggleTheme}
                className={`p-2.5 rounded-xl transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-[0.1em] transition-colors duration-300 shadow-inner ${theme === 'dark' ? 'bg-black/40 border-white/5 text-gray-400' : 'bg-slate-100 border-slate-200 text-slate-500'}">
                {seasonalTheme !== 'default' && (
                  <>
                    <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{seasonalTheme.toUpperCase()}</span>
                    <div className="w-1.5 h-1.5 bg-[#4facfe] rounded-full animate-pulse shadow-[0_0_8px_#4facfe]"></div>
                  </>
                )}
                NODE-SECURE
              </div>
              <div className={`flex items-center gap-3 pl-4 border-l transition-colors duration-300 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-[#4facfe]/50' : 'bg-slate-100 border-slate-200 hover:border-blue-500/50'}`}>
                  <User className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`} />
                </div>
                <button onClick={onLogout} className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}>
                    <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Mobile Nav */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-3xl border-t pb-safe z-50 transition-all duration-300 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white/60 border-slate-200'}`}>
         <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                    currentView === item.id ? (theme === 'dark' ? 'text-white' : 'text-blue-600 font-bold') : 'text-gray-500'
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] uppercase tracking-tighter">{item.label}</span>
                </button>
            ))}
         </div>
      </nav>
    </div>
  );
};
