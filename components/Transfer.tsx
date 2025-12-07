import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Globe, User, Zap, Clock, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export const Transfer: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState<'international' | 'domestic'>('international');
  const [speed, setSpeed] = useState<'instant' | 'fast' | 'standard'>('instant');
  const [showConfirm, setShowConfirm] = useState(false);

  const fees = {
    instant: 2.99,
    fast: 0.99,
    standard: 0.00
  };

  const handleSendClick = () => {
    if (!amount || !recipient) return;
    setShowConfirm(true);
  };

  const confirmTransfer = () => {
    setShowConfirm(false);
    setStep(2);
    setTimeout(() => {
        setStep(1);
        setAmount('');
        setRecipient('');
        setSpeed('instant');
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

  const currentFee = fees[speed];
  const numericAmount = parseFloat(amount) || 0;
  const totalAmount = numericAmount + currentFee;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn relative">
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-[#4facfe] shadow-[0_0_50px_rgba(79,172,254,0.15)] relative">
            <button 
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#4facfe]/10 rounded-full text-[#4facfe]">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Confirm Transfer</h3>
            </div>

            <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-[#1e2a5e]/20 border border-white/5 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Recipient</span>
                        <span className="font-medium text-white text-right break-all ml-4">{recipient}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                         <span className="text-gray-400">Transfer Speed</span>
                         <div className="flex items-center gap-2">
                            {speed === 'instant' && <Zap className="w-3 h-3 text-yellow-500" />}
                            {speed === 'fast' && <Clock className="w-3 h-3 text-blue-500" />}
                            <span className="font-medium capitalize text-[#4facfe]">{speed}</span>
                         </div>
                    </div>
                </div>

                <div className="space-y-3 px-2">
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Transfer Amount</span>
                        <span>{numericAmount.toFixed(2)} {currency}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Transaction Fee</span>
                        <span>${currentFee.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium text-gray-300">Total Debit</span>
                        <span className="text-2xl font-bold text-white">{totalAmount.toFixed(2)} <span className="text-sm font-normal text-gray-400">{currency}</span></span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button onClick={confirmTransfer}>Confirm Payment</Button>
            </div>
          </Card>
        </div>
      )}

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
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
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
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 text-white focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe]"
              >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
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
          <span className="font-bold text-white">${fees.instant.toFixed(2)}</span>
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
          <span className="font-bold text-white">${fees.fast.toFixed(2)}</span>
        </div>
      </div>

      <Button fullWidth onClick={handleSendClick} disabled={!amount || !recipient}>
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