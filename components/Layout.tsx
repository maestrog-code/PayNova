import React from 'react';
import { NavView } from '../types';
import { LayoutDashboard, Repeat, Send, BarChart2, Bell, Settings, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
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
              <div className="w-10 h-10 paynova-orb flex items-center justify-center font-bold text-[#4facfe] text-xl transition-transform duration-300 group-hover:scale-110">
                P
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#4facfe]">PayNova</span>
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
                <span className="hidden sm:block font-medium text-sm">John Doe</span>
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