
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { User, Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../types';

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
  const [error, setError] = useState<string | null>(null);

  const canSubmit = fullName && email && password && password === confirmPassword && agreed;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }
      onSignUp();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      <div className="fixed inset-0 z-[-1]" style={{ background: 'radial-gradient(circle at 50% 50%, #1e2a5e 0%, #000000 100%)' }}></div>
      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold tracking-wider"><span className="text-[#9cff57]">PAY</span><span className="text-[#4facfe]">NOVA</span></h1>
        </div>
        <Card className="border-[#4facfe]/30 shadow-xl backdrop-blur-xl">
          <form onSubmit={handleSignUp} className="space-y-6 animate-fadeIn">
            <div className="text-center"><h2 className="text-2xl font-bold">Register Account</h2></div>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">{error}</div>}
            <div className="space-y-4">
                 <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-[#4facfe] focus:outline-none" required />
                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-[#4facfe] focus:outline-none" required />
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-[#4facfe] focus:outline-none" required />
                 <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className={`w-full bg-black/40 border rounded-xl p-4 text-white focus:outline-none ${password !== confirmPassword ? 'border-red-500' : 'border-gray-700'}`} required />
                 <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 bg-black border-gray-600 text-[#4facfe]" />
                    <label htmlFor="terms" className="text-xs text-gray-400">I agree to the Terms of Service.</label>
                </div>
            </div>
            <Button fullWidth disabled={isLoading || !canSubmit} className="mt-6">{isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}</Button>
          </form>
        </Card>
        <p className="text-center text-gray-500 text-sm">Already have an account? <button onClick={onNavigateToSignIn} className="text-[#4facfe] hover:text-white">Sign In</button></p>
      </div>
    </div>
  );
};
