
import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AppTheme } from '../types';
import { ArrowDownUp, RefreshCcw, TrendingUp, AlertCircle, CheckCircle2, FileText, ShieldCheck, Copy, Upload, X, Loader2, ArrowRight } from 'lucide-react';

interface Rates {
  [key: string]: number;
}

interface ReceiptDetails {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  fee: number;
  totalDebited: number;
  timestamp: string;
  transactionId: string;
}

export const Exchange: React.FC<{ theme: AppTheme }> = ({ theme }) => {
  const [view, setView] = useState<'form' | 'settlement' | 'receipt'>('form');
  const [receipt, setReceipt] = useState<ReceiptDetails | null>(null);

  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<Rates>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Settlement State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const feePercentage = 0.015;
  const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'TZS', 'CNY', 'CHF', 'SGD'];

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch rates');
      const data = await response.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'form') {
        fetchRates();
        const interval = setInterval(fetchRates, 60000);
        return () => clearInterval(interval);
    }
  }, [fromCurrency, view]);

  const currentRate = rates[toCurrency] || 0;
  const rawConversion = fromAmount * currentRate;
  const conversionFee = rawConversion * feePercentage;
  const finalAmount = rawConversion - conversionFee;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleStartSettlement = () => {
    setView('settlement');
  };

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

  const handleFinalConfirm = () => {
    if (!selectedFile) return;
    setIsConfirming(true);
    setTimeout(() => {
        const newReceipt: ReceiptDetails = {
            fromAmount,
            fromCurrency,
            toAmount: finalAmount,
            toCurrency,
            rate: currentRate,
            fee: conversionFee,
            totalDebited: fromAmount,
            timestamp: new Date().toLocaleString(),
            transactionId: `PN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };
        setReceipt(newReceipt);
        setIsConfirming(false);
        setView('receipt');
    }, 2500);
  };

  const getFlagUrl = (currency: string) => {
    const map: Record<string, string> = {
      'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'AUD': 'au', 'CAD': 'ca',
      'INR': 'in', 'TZS': 'tz', 'CNY': 'cn', 'CHF': 'ch', 'SGD': 'sg'
    };
    return `https://flagcdn.com/h60/${map[currency] || 'us'}.png`;
  };

  if (view === 'receipt' && receipt) {
    return (
        <div className="max-w-xl mx-auto space-y-6 animate-fadeIn pb-20">
             <div className="text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Swap Confirmed</h2>
                <p className="text-gray-400 mt-2">ID: <span className="font-mono text-current opacity-80">{receipt.transactionId}</span></p>
            </div>

            <Card className="relative p-8">
                <div className="space-y-8">
                    <div className="flex justify-between items-start border-b border-gray-500/10 pb-6">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Exchange From</p>
                            <p className="text-3xl font-bold">{receipt.fromAmount.toLocaleString()} <span className="text-sm text-gray-400 font-normal">{receipt.fromCurrency}</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Payout Total</p>
                            <p className="text-3xl font-bold text-blue-500">{receipt.toAmount.toFixed(2)} <span className="text-sm text-blue-500/60 font-normal">{receipt.toCurrency}</span></p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <span className="text-gray-500">Rate</span>
                        <span className="text-right font-medium">1 {receipt.fromCurrency} = {receipt.rate.toFixed(4)} {receipt.toCurrency}</span>
                        
                        <span className="text-gray-500">Fee (1.5%)</span>
                        <span className="text-right text-red-500">-{receipt.fee.toFixed(2)} {receipt.toCurrency}</span>
                        
                        <span className="text-gray-500">Date</span>
                        <span className="text-right">{receipt.timestamp}</span>
                    </div>

                    <div className="bg-blue-500/5 rounded-2xl p-4 flex items-center gap-4 border border-blue-500/10">
                        <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            Proof of payment received and verified. Funds have been distributed to your secondary wallet.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="flex gap-4">
                <Button variant="secondary" fullWidth className="h-14" onClick={() => window.print()}>
                    <FileText className="w-5 h-5 mr-2" /> Save PDF
                </Button>
                <Button fullWidth className="h-14" onClick={() => { setView('form'); setSelectedFile(null); setFilePreview(null); }}>
                    New Exchange
                </Button>
            </div>
        </div>
    )
  }

  if (view === 'settlement') {
    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn pb-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('form')} className="p-2 hover:bg-black/5 rounded-full transition-all">
                    <X className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold">Manual Settlement</h2>
                    <p className="text-sm text-gray-400">Complete the manual transfer to finalize the swap</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank 1: MPesa */}
                <Card className="p-6 border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">MPESA</div>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Account Name</p>
                            <p className="text-sm font-bold">Cuthbert Gonzalva Rwebilumi</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Account Number</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-lg font-mono font-bold">+255741046593</p>
                                <button onClick={() => copyToClipboard('+255741046593')} className="p-1.5 hover:bg-black/5 rounded"><Copy className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bank 2: NMB */}
                <Card className="p-6 border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">NMB BANK</div>
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Account Name</p>
                            <p className="text-sm font-bold">Craig Furahini Mbwilo</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Account Number</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-lg font-mono font-bold">22510121264</p>
                                <button onClick={() => copyToClipboard('22510121264')} className="p-1.5 hover:bg-black/5 rounded"><Copy className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Upload className="w-6 h-6 text-blue-500" />
                        <h3 className="font-bold">Proof of Bank Receipt</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Please upload a clear screenshot or photo of your bank receipt. 
                        A PayNova agent will verify the funds within 60 seconds of submission.
                    </p>

                    {!filePreview ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${theme === 'dark' ? 'border-white/10 hover:border-blue-500/50 bg-white/5' : 'border-slate-200 hover:border-blue-500 bg-slate-50'}`}
                        >
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold">Drop receipt here</p>
                                <p className="text-xs text-gray-500 mt-1">Click to browse (JPG, PNG, PDF)</p>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                        </div>
                    ) : (
                        <div className="relative group rounded-2xl overflow-hidden border border-blue-500/30">
                            <img src={filePreview} alt="Receipt Preview" className="w-full h-40 object-cover opacity-50" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                <p className="text-xs text-white font-bold">{selectedFile?.name}</p>
                            </div>
                            <button onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-lg hover:bg-red-500"><X className="w-4 h-4" /></button>
                        </div>
                    )}

                    <Button 
                        fullWidth 
                        className="h-16 text-lg" 
                        disabled={!selectedFile || isConfirming}
                        onClick={handleFinalConfirm}
                    >
                        {isConfirming ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-6 h-6 animate-spin" /> Verifying Settlement...
                            </div>
                        ) : 'Submit Verification'}
                    </Button>
                </div>
            </Card>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-20">
       <div className="flex items-end justify-between px-2">
        <div>
          <p className="text-blue-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">Vault Network</p>
          <h2 className="text-4xl font-bold tracking-tight">Swap Engine</h2>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rate Sync</span>
            <button 
              onClick={fetchRates} 
              disabled={isLoading}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-blue-500 text-blue-400' : 'bg-slate-100 border-slate-200 hover:border-blue-500 text-blue-600'}`}
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 relative p-8">
            <div className="space-y-8">
                <div className="relative">
                    <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">You Sell</label>
                    </div>
                    <div className={`flex items-center gap-4 border rounded-2xl p-2 pl-6 transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 focus-within:border-blue-500'}`}>
                        <div className="flex-1">
                            <input 
                                type="number" 
                                value={fromAmount}
                                onChange={(e) => setFromAmount(Number(e.target.value))}
                                className={`w-full bg-transparent text-3xl font-bold focus:outline-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                            />
                        </div>
                        <div className="relative shrink-0">
                            <select 
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            >
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-slate-50 border border-slate-200'}`}>
                                <img src={getFlagUrl(fromCurrency)} alt="" className="w-6 h-4 object-cover rounded shadow-sm" />
                                <span className="font-bold tracking-tighter">{fromCurrency}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center -my-4 relative z-10">
                    <div className="h-px bg-gray-500/10 flex-1"></div>
                    <button onClick={handleSwap} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 shadow-xl ${theme === 'dark' ? 'bg-[#0d0d0d] border-white/10 text-white hover:border-blue-500' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500'}`}>
                        <ArrowDownUp className="w-6 h-6 text-blue-500" />
                    </button>
                    <div className="h-px bg-gray-500/10 flex-1"></div>
                </div>

                <div className="relative">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">You Receive</label>
                    <div className={`flex items-center gap-4 border rounded-2xl p-2 pl-6 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex-1">
                            <div className="text-3xl font-bold text-blue-500 tabular-nums">
                                {isLoading ? <span className="animate-pulse">---</span> : finalAmount.toFixed(2)}
                            </div>
                        </div>
                        <div className="relative shrink-0">
                            <select 
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            >
                                {CURRENCIES.filter(c => c !== fromCurrency).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-slate-50 border border-slate-200'}`}>
                                <img src={getFlagUrl(toCurrency)} alt="" className="w-6 h-4 object-cover rounded shadow-sm" />
                                <span className="font-bold tracking-tighter">{toCurrency}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.2em] text-gray-500 border-t border-gray-500/10 pt-6 uppercase">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span>Execution: 1 {fromCurrency} = {currentRate?.toFixed(4)} {toCurrency}</span>
                    </div>
                </div>

                <Button fullWidth className="h-16 text-lg font-bold" onClick={handleStartSettlement} disabled={isLoading || fromAmount <= 0}>
                    <span className="flex items-center gap-3">Initiate Settlement <ArrowRight className="w-5 h-5" /></span>
                </Button>
            </div>
          </Card>

          <div className="space-y-6">
              <Card className="p-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center justify-between">Market Trends <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></h4>
                  <div className="space-y-5">
                      {['EUR', 'GBP', 'JPY'].map((c) => (
                          <div key={c} className="flex items-center justify-between group cursor-pointer" onClick={() => setToCurrency(c)}>
                              <div className="flex items-center gap-3">
                                  <img src={getFlagUrl(c)} alt="" className="w-6 h-4 object-cover rounded shadow-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                                  <span className="text-sm font-bold text-gray-500 group-hover:text-blue-500 transition-colors">{fromCurrency}/{c}</span>
                              </div>
                              <span className="text-sm font-mono font-bold">{rates[c]?.toFixed(4)}</span>
                          </div>
                      ))}
                  </div>
              </Card>

              <div className={`rounded-3xl p-6 border space-y-4 ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center"><AlertCircle className="w-6 h-6" /></div>
                  <h5 className="font-bold text-sm">Escrow Secure</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider font-semibold">
                    Funds are held in high-security escrow accounts until proof of manual deposit is verified by our regional node operators.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};
