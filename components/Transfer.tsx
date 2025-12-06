import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Globe, User, Zap, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Transfer: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState<'international' | 'domestic'>('international');
  const [speed, setSpeed] = useState<'instant' | 'fast' | 'standard'>('instant');

  const handleSend = () => {
    setStep(2);
    setTimeout(() => {
        setStep(1);
        setAmount('');
        alert("Transfer Successful! (Simulated)");
    }, 2000);
  };

  if (step === 2) {
      return (
          <div className="h-full flex flex-col items-center justify-center py-20 animate-fadeIn">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Transfer Processing</h2>
              <p className="text-gray-400">Your funds are on the way safely.</p>
          </div>
      )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold mb-2">Send Money</h2>
        <p className="text-gray-400">Transfer funds globally with competitive rates</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setTransferType('international')}
          className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${
            transferType === 'international' 
              ? 'bg-[#1e2a5e]/60 border-[#4facfe] shadow-[0_0_15px_rgba(79,172,254,0.3)]' 
              : 'bg-transparent border-gray-700 hover:border-gray-500'
          }`}
        >
          <Globe className={`w-8 h-8 ${transferType === 'international' ? 'text-[#4facfe]' : 'text-gray-400'}`} />
          <span className="font-medium">International</span>
        </button>
        <button 
          onClick={() => setTransferType('domestic')}
          className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${
            transferType === 'domestic' 
              ? 'bg-[#1e2a5e]/60 border-[#4facfe] shadow-[0_0_15px_rgba(79,172,254,0.3)]' 
              : 'bg-transparent border-gray-700 hover:border-gray-500'
          }`}
        >
          <User className={`w-8 h-8 ${transferType === 'domestic' ? 'text-[#4facfe]' : 'text-gray-400'}`} />
          <span className="font-medium">Domestic</span>
        </button>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recipient</label>
            <input 
              type="text" 
              placeholder="Enter email or phone number"
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 text-white focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 pl-8 text-white focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe]"
                />
              </div>
            </div>
             <div>
              <label className="block text-sm text-gray-400 mb-2">Currency</label>
              <select className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 text-white focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe]">
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <label className="block text-sm text-gray-400">Transfer Speed</label>
        
        <div 
          onClick={() => setSpeed('instant')}
          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
            speed === 'instant' ? 'bg-[#1e2a5e]/40 border-[#4facfe]' : 'bg-transparent border-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500"><Zap className="w-5 h-5" /></div>
            <div>
              <p className="font-medium">Instant Transfer</p>
              <p className="text-xs text-gray-400">Arrives in &lt; 1 minute</p>
            </div>
          </div>
          <span className="font-bold text-white">$2.99</span>
        </div>

        <div 
          onClick={() => setSpeed('fast')}
          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
            speed === 'fast' ? 'bg-[#1e2a5e]/40 border-[#4facfe]' : 'bg-transparent border-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="font-medium">Fast Transfer</p>
              <p className="text-xs text-gray-400">Arrives in 2-4 hours</p>
            </div>
          </div>
          <span className="font-bold text-white">$0.99</span>
        </div>
      </div>

      <Button fullWidth onClick={handleSend} disabled={!amount}>
        Continue Transfer
      </Button>

      <Card className="bg-blue-900/10 border-blue-500/20">
        <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#4facfe] shrink-0" />
            <div>
                <h4 className="font-medium text-[#4facfe]">Secure Transfers</h4>
                <p className="text-sm text-gray-400 mt-1">All transfers are protected with bank-level encryption and fraud monitoring. Your money is safe with PayNova.</p>
            </div>
        </div>
      </Card>
    </div>
  );
};