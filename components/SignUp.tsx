
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { User, Lock, Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
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

  /**
   * Primary calling function for backend registration.
   * Reverted to /auth/register based on server response.
   */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsLoading(true);
    setError(null);

    const payload = {
      name: fullName,
      fullName: fullName,
      email: email,
      password: password
    };

    // We will try these paths in order if we get a 404
    const pathsToTry = ['/auth/register', '/register'];
    let lastError = '';

    for (const path of pathsToTry) {
      const targetUrl = `${API_BASE_URL}${path}`;
      try {
        console.log(`[PayNova Auth] Attempting Registration at: ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // If it's a 404, we try the next path in our list
        if (response.status === 404) {
          console.warn(`[PayNova Auth] Path ${path} not found (404). Trying next fallback...`);
          lastError = `Endpoint ${targetUrl} not found (404).`;
          continue; 
        }

        const responseText = await response.text();
        let data;
        
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("[PayNova Auth] Server returned non-JSON response:", responseText);
          throw new Error(`Server at ${path} returned HTML/Text instead of JSON. Status: ${response.status}`);
        }

        if (!response.ok) {
          throw new Error(data.message || data.error || `Registration failed at ${path} with status ${response.status}`);
        }

        console.log("[PayNova Auth] Registration successful at:", path, data);
        onSignUp();
        return; // Success! Exit the function

      } catch (err: any) {
        console.error(`[PayNova Auth] Error at ${path}:`, err);
        lastError = err.message;
        // If it's not a 404 (e.g. 500 error or network error), we stop trying other paths
        if (!err.message.includes('404')) break;
      }
    }

    // If we reach here, all attempts failed
    setError(lastError || "Could not connect to registration service. Please verify backend routes.");
    setIsLoading(false);
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
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] leading-relaxed rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
                 <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 pl-12 text-white focus:border-[#4facfe] focus:outline-none" required />
                 </div>
                 
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 pl-12 text-white focus:border-[#4facfe] focus:outline-none" required />
                 </div>

                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 pl-12 text-white focus:border-[#4facfe] focus:outline-none" required />
                 </div>

                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4facfe] transition-colors" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className={`w-full bg-black/40 border rounded-xl p-4 pl-12 text-white focus:outline-none ${password !== confirmPassword && confirmPassword !== '' ? 'border-red-500' : 'border-gray-700 focus:border-[#4facfe]'}`} required />
                 </div>

                 <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 bg-black border-gray-600 text-[#4facfe] rounded focus:ring-[#4facfe]" />
                    <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">I agree to the PayNova Terms of Service.</label>
                </div>
            </div>
            <Button fullWidth disabled={isLoading || !canSubmit} className="mt-6">
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
            </Button>
          </form>
        </Card>
        <p className="text-center text-gray-500 text-sm">Already have an account? <button onClick={onNavigateToSignIn} className="text-[#4facfe] hover:text-white font-medium transition-colors">Sign In</button></p>
      </div>
    </div>
  );
};
