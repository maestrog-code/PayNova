
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold transition-all duration-300 rounded-2xl flex items-center justify-center uppercase tracking-widest text-xs";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-transparent disabled:bg-gray-700 disabled:text-gray-400",
    secondary: "dark:bg-white/5 bg-slate-100 text-current hover:bg-slate-200 dark:hover:bg-white/10 border dark:border-white/10 border-slate-200",
    icon: "p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full border border-blue-500/30",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full py-4' : 'px-6 py-3'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
