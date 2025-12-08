import React from 'react';
import { NavView } from '../types';
import { LayoutDashboard, Repeat, Send, BarChart2, Bell, Settings, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'exchange', label: 'Exchange', icon: <Repeat className="w-5 h-5" /> },
    { id: 'transfer', label: 'Transfer', icon: <Send className="w-5 h-5" /> },
    { id: 'markets', label: 'Markets', icon: <BarChart2 className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen text-white relative flex flex-col">
      {/* Radial Gradient Background Wrapper matching PayNova theme */}
      <div className="fixed inset-0 z-[-1]" style={{
          background: 'radial-gradient(circle at 50% 0%, #1e2a5e 0%, #000000 100%)'
      }}></div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
                 <svg viewBox="0 0 100 100" className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity">
                    <defs>
                        <linearGradient id="vortexGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f2fe" />
                            <stop offset="100%" stopColor="#4facfe" />
                        </linearGradient>
                         <filter id="vortexBlurHeader" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
                        </filter>
                    </defs>
                    <g className="animate-[spin_8s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
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
                    <circle cx="50" cy="50" r="18" fill="black" />
                 </svg>
              </div>
              <div className="text-2xl font-bold tracking-wider">
                <span style={{ color: '#9cff57', textShadow: '0 0 5px rgba(156, 255, 87, 0.4)'}}>PAY</span>
                <span style={{
                  background: 'linear-gradient(to right, #4facfe, #a7e6ff)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>NOVA</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentView === item.id 
                      ? 'bg-[#4facfe]/10 text-[#4facfe] shadow-[0_0_10px_rgba(79,172,254,0.1)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border-2 border-white/20">
                  <User className="w-5 h-5 text-white" />
                </div>
                 <div className="hidden sm:block">
                    <span className="block font-medium text-sm">John Doe</span>
                </div>
                <button onClick={onLogout} className="p-2 ml-1 text-gray-400 hover:text-red-400 transition-colors" title="Log Out">
                    <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Nav (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-white/10 pb-safe z-50">
         <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                    currentView === item.id ? 'text-[#4facfe]' : 'text-gray-500'
                  }`}
                >
                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
         </div>
      </nav>
    </div>
  );
};
