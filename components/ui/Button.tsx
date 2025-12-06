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
  const baseStyles = "font-medium transition-all duration-300 rounded-lg flex items-center justify-center";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-black hover:shadow-[0_0_20px_rgba(79,172,254,0.6)] border border-transparent",
    secondary: "bg-[#1e2a5e]/50 text-white hover:bg-[#1e2a5e] border border-[#4facfe]/30 hover:border-[#4facfe]",
    icon: "p-2 bg-[#1e2a5e]/30 text-[#4facfe] hover:bg-[#4facfe] hover:text-black rounded-full border border-[#4facfe]/30",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full py-3' : 'px-4 py-2'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};