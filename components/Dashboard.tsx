import React from 'react';
import { Button } from './ui/Button';
import { Repeat, Send, BarChart2 } from 'lucide-react';
import { NavView } from '../types';

export const Dashboard: React.FC<{ onNavigate: (view: NavView) => void }> = ({ onNavigate }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn space-y-12">
      
      {/* Central Logo Element */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Background Glow */}
        <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-[80px]"></div>
        
        {/* The Orb */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1e2a5e] to-[#0a0a2a] shadow-2xl border-2 border-blue-400/20">
          
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-lime-300/30 animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute inset-1 rounded-full border-t-2 border-lime-300/80 animate-[spin_15s_linear_infinite]"></div>

          {/* Vortex Graphic */}
          <div className="w-32 h-32 relative">
             <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                <defs>
                    <linearGradient id="vortexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f2fe" />
                        <stop offset="100%" stopColor="#4facfe" />
                    </linearGradient>
                    <filter id="vortexBlur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    </filter>
                </defs>
                <g className="animate-[spin_6s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <path
                      key={i}
                      d="M 50,50 L 85,50 A 35,35 0 0 0 50,15 Z"
                      fill="url(#vortexGrad)"
                      transform={`rotate(${i * 45}, 50, 50)`}
                      opacity="0.7"
                      filter="url(#vortexBlur)"
                    />
                  ))}
                </g>
                <circle cx="50" cy="50" r="18" fill="black" />
             </svg>
          </div>

          <div className="absolute bottom-[-1.5rem] left-0 right-0 text-center">
             <p className="text-xs text-gray-400 italic">"With one Tap, Instant Teleport, Instant Transfer"</p>
          </div>
        </div>
      </div>

      {/* PAYNOVA Text */}
      <div className="text-6xl md:text-7xl font-bold tracking-wider">
        <span style={{ color: '#9cff57', textShadow: '0 0 10px rgba(156, 255, 87, 0.5)'}}>PAY</span>
        <span style={{
          background: 'linear-gradient(to right, #4facfe, #a7e6ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>NOVA</span>
      </div>
      <p className="text-lg text-gray-300 tracking-widest -mt-8">Tap, Teleport, Transfer</p>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-6">
        <Button variant="secondary" className="h-16 text-lg" onClick={() => onNavigate('exchange')}>
          <Repeat className="w-5 h-5 mr-2" /> Exchange
        </Button>
        <Button variant="secondary" className="h-16 text-lg" onClick={() => onNavigate('transfer')}>
          <Send className="w-5 h-5 mr-2" /> Transfer
        </Button>
        <Button variant="secondary" className="h-16 text-lg" onClick={() => onNavigate('markets')}>
          <BarChart2 className="w-5 h-5 mr-2" /> Markets
        </Button>
      </div>
    </div>
  );
};
