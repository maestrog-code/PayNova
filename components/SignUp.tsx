import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { User, Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

interface SignUpProps {
  onSignUp: () => void;
  onNavigateToSignIn: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigateToSignIn }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = fullName && email && password && password === confirmPassword && agreed;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    // Simulate API call for registration
    setTimeout(() => {
      setIsLoading(false);
      onSignUp(); // Simulate successful signup and login
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      <div className="fixed inset-0 z-[-1]" style={{
          background: 'radial-gradient(circle at 50% 50%, #1e2a5e 0%, #000000 100%)'
      }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4facfe] rounded-full blur-[120px] opacity-10 animate-pulse"></div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full rounded-full bg-black shadow-[0_0_30px_rgba(79,172,254,0.6)] border border-[#4facfe]/30">
                    <defs>
                        <filter id="vortex-glow-signup" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        </filter>
                        <linearGradient id="neon-grad-signup" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f2fe" />
                            <stop offset="100%" stopColor="#4facfe" />
                        </linearGradient>
                    </defs>
                    <g className="animate-[spin_4s_linear_infinite] origin-center">
                         <circle cx="50" cy="50" r="35" stroke="url(#neon-grad-signup)" strokeWidth="12" fill="none" strokeDasharray="60 90" strokeLinecap="round" filter="url(#vortex-glow-signup)" opacity="0.9" />
                    </g>
                    <circle cx="50" cy="50" r="16" fill="black" />
                </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#4facfe]">Create Account</h1>
        </div>

        <Card className="border-[#4facfe]/30 shadow-[0_0_40px_rgba(30,42,94,0.6)] backdrop-blur-xl">
          <form onSubmit={handleSignUp} className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Get Started</h2>
                <p className="text-gray-400 text-sm">Join PayNova and manage your finances</p>
            </div>

            <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe"
                            className="w-full bg-[#0a0a0a]/50 border border-gray-700 rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all" required />
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com"
                            className="w-full bg-[#0a0a0a]/50 border border-gray-700 rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all" required />
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            className="w-full bg-[#0a0a0a]/50 border border-gray-700 rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all" required />
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Confirm Password</label>
                    <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                            className={`w-full bg-[#0a0a0a]/50 border rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${password && confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-[#4facfe] focus:ring-[#4facfe]'}`} required />
                    </div>
                     {password && confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-400 text-right">Passwords do not match.</p>
                     )}
                </div>
                 <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 rounded bg-[#0a0a0a] border-gray-600 text-[#4facfe] focus:ring-[#4facfe]" />
                    <label htmlFor="terms" className="text-xs text-gray-400">
                        I agree to the <a href="#" className="text-[#4facfe] hover:underline">Terms of Service</a> and <a href="#" className="text-[#4facfe] hover:underline">Privacy Policy</a>.
                    </label>
                </div>
            </div>

            <Button fullWidth disabled={isLoading || !canSubmit} className="mt-6">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
            </Button>
          </form>
        </Card>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <button onClick={onNavigateToSignIn} className="font-medium text-[#4facfe] hover:text-white transition-colors">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};