import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { User, Lock, ShieldCheck, ArrowRight, Loader2, KeyRound, Mail, CheckCircle2 } from 'lucide-react';

interface SignInProps {
  onLogin: () => void;
  onNavigateToSignUp: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onLogin, onNavigateToSignUp }) => {
  const [step, setStep] = useState<'credentials' | '2fa' | 'forgotPassword' | 'resetSent'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('2fa');
    }, 1500);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handlePasswordResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('resetSent');
    }, 1500);
  };

  const renderContent = () => {
    switch(step) {
        case 'credentials':
            return (
                <form onSubmit={handleCredentialsSubmit} className="space-y-6 animate-fadeIn">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Welcome Back</h2>
                        <p className="text-gray-400 text-sm">Enter your credentials to access your dashboard</p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john.doe@example.com"
                                    className="w-full bg-[#0a0a0a]/50 border border-gray-700 rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center ml-1">
                                <label className="text-sm text-gray-400">Password</label>
                                <button type="button" onClick={() => setStep('forgotPassword')} className="text-xs text-[#4facfe] hover:text-white transition-colors">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0a0a0a]/50 border border-gray-700 rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <Button fullWidth disabled={isLoading} className="mt-6">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>}
                    </Button>
                </form>
            );
        case '2fa':
            return (
                <form onSubmit={handle2FASubmit} className="space-y-6 animate-fadeIn">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-[#4facfe]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#4facfe]/30 text-[#4facfe]">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
                        <p className="text-gray-400 text-sm">Enter the 6-digit code sent to your device</p>
                    </div>
                    <div className="space-y-2">
                         <div className="relative group">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                            <input 
                                type="text" 
                                value={code}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    if (val.length <= 6) setCode(val);
                                }}
                                placeholder="000000"
                                className="w-full bg-[#0a0a0a]/50 border border-gray-700 rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all text-center text-2xl tracking-[0.5em] font-mono"
                                autoFocus
                            />
                        </div>
                         <p className="text-xs text-center text-gray-500 mt-2">Didn't receive code? <button type="button" className="text-[#4facfe] hover:text-white">Resend</button></p>
                    </div>
                     <div className="grid grid-cols-2 gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setStep('credentials')} disabled={isLoading}>
                            Back
                        </Button>
                        <Button disabled={isLoading || code.length < 6}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                        </Button>
                    </div>
                </form>
            );
        case 'forgotPassword':
            return (
                <form onSubmit={handlePasswordResetRequest} className="space-y-6 animate-fadeIn">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Reset Password</h2>
                        <p className="text-gray-400 text-sm">Enter your email to receive a reset link</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john.doe@example.com"
                                className="w-full bg-[#0a0a0a]/50 border border-gray-700 rounded-xl p-4 pl-12 text-white placeholder-gray-600 focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setStep('credentials')}>Back to Sign In</Button>
                        <Button disabled={isLoading}>
                           {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                        </Button>
                    </div>
                </form>
            );
        case 'resetSent':
            return (
                <div className="text-center space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/30 text-green-400">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Check Your Email</h2>
                    <p className="text-gray-400 text-sm">
                        We have sent a password reset link to <span className="font-medium text-[#4facfe]">{email}</span>. Please follow the instructions in the email.
                    </p>
                    <Button fullWidth onClick={() => setStep('credentials')}>
                        Back to Sign In
                    </Button>
                </div>
            )
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
       <div className="fixed inset-0 z-[-1]" style={{
          background: 'radial-gradient(circle at 50% 50%, #1e2a5e 0%, #000000 100%)'
      }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4facfe] rounded-full blur-[120px] opacity-10 animate-pulse"></div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full rounded-full bg-black/50 shadow-[0_0_30px_rgba(79,172,254,0.6)] border border-[#4facfe]/30">
                     <defs>
                        <linearGradient id="vortexGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f2fe" />
                            <stop offset="100%" stopColor="#4facfe" />
                        </linearGradient>
                         <filter id="vortexBlurLogin" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
                        </filter>
                    </defs>
                    <g className="animate-[spin_8s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <path
                          key={i}
                          d="M 50,50 L 90,50 A 40,40 0 0 0 50,10 Z"
                          fill="url(#vortexGradLogin)"
                          transform={`rotate(${i * 45}, 50, 50)`}
                          opacity="0.6"
                          filter="url(#vortexBlurLogin)"
                        />
                      ))}
                    </g>
                    <circle cx="50" cy="50" r="18" fill="black" />
                </svg>
            </div>
            <div className="text-4xl font-bold tracking-wider">
                <span style={{ color: '#9cff57', textShadow: '0 0 10px rgba(156, 255, 87, 0.4)'}}>PAY</span>
                <span style={{
                background: 'linear-gradient(to right, #4facfe, #a7e6ff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
                }}>NOVA</span>
            </div>
        </div>

        <Card className="border-[#4facfe]/30 shadow-[0_0_40px_rgba(30,42,94,0.6)] backdrop-blur-xl">
            {renderContent()}
        </Card>

        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <button onClick={onNavigateToSignUp} className="font-medium text-[#4facfe] hover:text-white transition-colors">
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
