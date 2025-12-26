
import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AppTheme } from '../types';
import { Globe, User, Zap, Clock, ShieldCheck, CheckCircle2, X, Upload, Image as ImageIcon, FileText, Loader2, Copy } from 'lucide-react';

export const Transfer: React.FC<{ theme: AppTheme }> = ({ theme }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState<'international' | 'domestic'>('international');
  const [speed, setSpeed] = useState<'instant' | 'fast' | 'standard'>('instant');
  const [showSettlement, setShowSettlement] = useState(false);
  
  // Proof of Payment State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fees = { instant: 2.99, fast: 0.99, standard: 0.00 };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const handleSendClick = () => {
    if (!amount || !recipient) return;
    setShowSettlement(true);
  };

  const confirmTransfer = () => {
    setIsUploading(true);
    setTimeout(() => {
        setIsUploading(false);
        setShowSettlement(false);
        setStep(2);
        setTimeout(() => {
            setStep(1);
            setAmount('');
            setRecipient('');
            setSelectedFile(null);
            setFilePreview(null);
        }, 4000);
    }, 2500);
  };

  if (step === 2) {
      return (
          <div className="h-full flex flex-col items-center justify-center py-20 animate-fadeIn text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Verification Sent</h2>
              <div className="max-w-md p-6 border rounded-2xl space-y-4 dark:bg-white/5 dark:border-green-500/30 bg-slate-50 border-slate-200">
                  <p className="text-gray-500">Your manual transfer is being verified by our regional node.</p>
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Expected Settlement: 60s</p>
              </div>
              <Button variant="secondary" className="mt-8" onClick={() => setStep(1)}>Return Home</Button>
          </div>
      )
  }

  const currentFee = fees[speed];
  const numericAmount = parseFloat(amount) || 0;
  const totalAmount = numericAmount + currentFee;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn relative">
      {showSettlement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <Card className="w-full max-w-4xl relative max-h-[90vh] overflow-y-auto scrollbar-hide p-8">
            {!isUploading && <button onClick={() => setShowSettlement(false)} className="absolute top-4 right-4 text-gray-400 hover:text-current transition-colors"><X className="w-5 h-5" /></button>}
            
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Manual Settlement Required</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 rounded-xl border dark:bg-white/5 dark:border-white/10 bg-slate-100 border-slate-200 space-y-2">
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">MPESA (VODACOM)</p>
                        <p className="text-sm font-bold truncate">Cuthbert Gonzalva Rwebilumi</p>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold">+255741046593</span>
                            <button onClick={() => copyToClipboard('+255741046593')} className="p-1 hover:bg-blue-500/10 rounded"><Copy className="w-3 h-3" /></button>
                        </div>
                    </div>
                     <div className="p-4 rounded-xl border dark:bg-white/5 dark:border-white/10 bg-slate-100 border-slate-200 space-y-2">
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">NMB BANK</p>
                        <p className="text-sm font-bold truncate">Craig Furahini Mbwilo</p>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold">22510121264</span>
                            <button onClick={() => copyToClipboard('22510121264')} className="p-1 hover:bg-blue-500/10 rounded"><Copy className="w-3 h-3" /></button>
                        </div>
                    </div>
                     <div className="p-4 rounded-xl border dark:bg-white/5 dark:border-white/10 bg-slate-100 border-slate-200 space-y-2">
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">CRDB BANK</p>
                        <p className="text-sm font-bold truncate">Godson Martin Rubenga</p>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold">0152873704000</span>
                            <button onClick={() => copyToClipboard('0152873704000')} className="p-1 hover:bg-blue-500/10 rounded"><Copy className="w-3 h-3" /></button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto w-full">
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Amount Due</span>
                        <span className="text-xl font-bold text-blue-500">{totalAmount.toFixed(2)} {currency}</span>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4 text-blue-500" /> Upload Bank Receipt Proof
                        </label>
                        {!filePreview ? (
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 cursor-pointer hover:border-blue-500 transition-all text-center">
                                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-xs text-gray-500 font-bold">SELECT RECEIPT SCREENSHOT</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-green-500/30">
                                <img src={filePreview} alt="Proof" className="w-full h-32 object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <button onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="absolute top-2 right-2 p-1 bg-black/80 rounded"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>
                </div>

                <Button fullWidth onClick={confirmTransfer} disabled={isUploading || !selectedFile} className="max-w-2xl mx-auto">
                    {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Deposit & Finish'}
                </Button>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-1">Global Transfer</h2>
        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Node: Secure-Net-01</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setTransferType('international')} className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${transferType === 'international' ? (theme === 'dark' ? 'bg-blue-500/10 border-blue-500/40 shadow-xl' : 'bg-blue-50 border-blue-200 shadow-lg') : (theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200')}`}>
          <Globe className={`w-8 h-8 ${transferType === 'international' ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="font-bold text-sm tracking-widest">INTERNATIONL</span>
        </button>
        <button onClick={() => setTransferType('domestic')} className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${transferType === 'domestic' ? (theme === 'dark' ? 'bg-blue-500/10 border-blue-500/40 shadow-xl' : 'bg-blue-50 border-blue-200 shadow-lg') : (theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200')}`}>
          <User className={`w-8 h-8 ${transferType === 'domestic' ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="font-bold text-sm tracking-widest">DOMESTIC</span>
        </button>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recipient Network ID</label>
            <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Email, Phone or PayNova Handle" className={`w-full rounded-2xl p-4 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Value</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={`w-full rounded-2xl p-4 pl-8 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              </div>
            </div>
             <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`w-full rounded-2xl p-4 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                  <option value="USD">USD - Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - Pound</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Network Speed</label>
        <div onClick={() => setSpeed('instant')} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${speed === 'instant' ? 'bg-blue-500/5 border-blue-500' : (theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200')}`}>
          <div className="flex items-center gap-3">
            <Zap className={`w-5 h-5 ${speed === 'instant' ? 'text-blue-500' : 'text-gray-500'}`} />
            <div>
              <p className="font-bold text-sm uppercase tracking-tighter">Instant Pulse</p>
              <p className="text-[10px] text-gray-500">Atomic Settlement &lt; 60s</p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold">${fees.instant.toFixed(2)}</span>
        </div>
      </div>

      <Button fullWidth className="h-16 text-lg" onClick={handleSendClick} disabled={!amount || !recipient}>
        Verify Settlement Proof
      </Button>

      <div className={`rounded-3xl p-6 border flex gap-4 items-center ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
          <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0" />
          <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest">All global transfers are cryptographically signed and secured by the PayNova node network.</p>
      </div>
    </div>
  );
};
