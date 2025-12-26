
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div 
      className={`
        relative overflow-hidden
        backdrop-blur-3xl 
        rounded-[2rem] border transition-all duration-500
        dark:bg-[#0a0a0a]/40 dark:border-white/5 dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] dark:hover:border-white/10
        bg-white/40 border-slate-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:border-slate-300
        ${noPadding ? '' : 'p-8'} 
        ${className}
      `} 
      {...props}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br dark:from-white/[0.02] from-white/20 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
