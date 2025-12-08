import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowDownUp, RefreshCcw, TrendingUp, AlertCircle, Info, CheckCircle2, FileText } from 'lucide-react';

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

export const Exchange: React.FC = () => {
  const [view, setView] = useState<'form' | 'receipt'>('form');
  const [receipt, setReceipt] = useState<ReceiptDetails | null>(null);

  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<Rates>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const FEE_PERCENTAGE = 0.01; // 1% fee

  const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'TZS', 'CNY', 'CHF', 'SGD'];

  const fetchRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch rates');
      const data = await response.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setError('Using offline rates');
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
  const conversionFee = rawConversion * FEE_PERCENTAGE;
  const finalAmount = rawConversion - conversionFee;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleExchange = () => {
    const newReceipt: ReceiptDetails = {
      fromAmount,
      fromCurrency,
      toAmount: finalAmount,
      toCurrency,
      rate: currentRate,
      fee: conversionFee,
      totalDebited: fromAmount,
      timestamp: new Date().toLocaleString(),
      transactionId: `EX-${Date.now()}`
    };
    setReceipt(newReceipt);
    setView('receipt');
  };

  const getFlagUrl = (currency: string) => {
    const map: Record<string, string> = {
      'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'AUD': 'au', 'CAD': 'ca',
      'INR': 'in', 'TZS': 'tz', 'CNY': 'cn', 'CHF': 'ch', 'SGD': 'sg'
    };
    return `https://flagcdn.com/w40/${map[currency] || 'us'}.png`;
  };

  const popularPairs = [
    { pair: `${fromCurrency}/EUR`, rate: rates['EUR'], change: '+0.12%' },
    { pair: `${fromCurrency}/GBP`, rate: rates['GBP'], change: '-0.08%' },
    { pair: `${fromCurrency}/JPY`, rate: rates['JPY'], change: '+0.25%' },
    { pair: `${fromCurrency}/CAD`, rate: rates['CAD'], change: '+0.05%' },
  ].filter(p => !p.pair.startsWith(`${fromCurrency}/${fromCurrency}`));

  if (view === 'receipt' && receipt) {
    return (
        <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
             <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30 text-green-400">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Exchange Successful</h2>
                <p className="text-gray-400">Your receipt for transaction {receipt.transactionId}</p>
            </div>
            <Card>
                <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-white/10">
                        <p className="text-gray-400">You Converted</p>
                        <p className="text-3xl font-bold">{receipt.fromAmount.toLocaleString()} {receipt.fromCurrency}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">You Received</p>
                        <p className="text-3xl font-bold text-[#4facfe]">{receipt.toAmount.toFixed(2)} {receipt.toCurrency}</p>
                    </div>
                    <div className="pt-4 space-y-2 border-t border-white/10 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Rate:</span><span>1 {receipt.fromCurrency} = {receipt.rate.toFixed(4)} {receipt.toCurrency}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Fee:</span><span>{receipt.fee.toFixed(2)} {receipt.toCurrency}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Timestamp:</span><span>{receipt.timestamp}</span></div>
                    </div>
                </div>
            </Card>
            <Button fullWidth onClick={() => setView('form')}>
                Make Another Exchange
            </Button>
        </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Currency Exchange</h2>
          <p className="text-gray-400">Convert currencies at competitive real-time rates</p>
        </div>
        <button 
          onClick={fetchRates} 
          disabled={isLoading}
          className="p-2 rounded-lg bg-[#1e2a5e]/40 border border-[#4facfe]/30 hover:border-[#4facfe] text-[#4facfe] transition-colors"
        >
          <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <Card className="relative">
        <div className="space-y-6">
            {/* From */}
            <div className="space-y-2">
                <label className="text-sm text-gray-400">From</label>
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <select 
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value)}
                          className="w-full h-full absolute inset-0 opacity-0 cursor-pointer z-10"
                        >
                          {CURRENCIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="p-4 rounded-lg border border-gray-700 bg-[#0a0a0a] flex items-center justify-between hover:border-[#4facfe] transition-colors">
                            <div className="flex items-center gap-2">
                                <img src={getFlagUrl(fromCurrency)} alt={fromCurrency} className="w-6 h-4 object-cover rounded-sm" />
                                <span className="font-bold">{fromCurrency}</span>
                            </div>
                            <span className="text-xs text-gray-500">▼</span>
                        </div>
                    </div>
                    <input 
                        type="number" 
                        value={fromAmount}
                        onChange={(e) => setFromAmount(Number(e.target.value))}
                        className="flex-[2] bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 text-right text-xl font-bold focus:border-[#4facfe] focus:outline-none"
                    />
                </div>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button 
                  onClick={handleSwap}
                  className="w-12 h-12 rounded-full bg-[#1e2a5e] border border-[#4facfe] flex items-center justify-center text-[#4facfe] hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(79,172,254,0.4)]"
                >
                    <ArrowDownUp className="w-5 h-5" />
                </button>
            </div>

            {/* To */}
             <div className="space-y-2">
                <label className="text-sm text-gray-400">To (Estimated)</label>
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <select 
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value)}
                          className="w-full h-full absolute inset-0 opacity-0 cursor-pointer z-10"
                        >
                          {CURRENCIES.filter(c => c !== fromCurrency).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="p-4 rounded-lg border border-gray-700 bg-[#0a0a0a] flex items-center justify-between hover:border-[#4facfe] transition-colors">
                            <div className="flex items-center gap-2">
                                <img src={getFlagUrl(toCurrency)} alt={toCurrency} className="w-6 h-4 object-cover rounded-sm" />
                                <span className="font-bold">{toCurrency}</span>
                            </div>
                            <span className="text-xs text-gray-500">▼</span>
                        </div>
                    </div>
                    <div className="flex-[2] bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 text-right text-xl font-bold flex items-center justify-end text-[#4facfe]">
                       {isLoading ? '...' : finalAmount.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-8 p-5 bg-[#1e2a5e]/20 rounded-xl border border-[#4facfe]/20 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                    <RefreshCcw className="w-4 h-4 text-[#4facfe]" />
                    <span>Commercial Rate</span>
                </div>
                <span className="font-medium text-white">1 {fromCurrency} = {currentRate?.toFixed(4)} {toCurrency}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                    Conversion Fee ({(FEE_PERCENTAGE * 100).toFixed(1)}%)
                    <span title="Fee applied to the converted amount" className="cursor-help">
                        <Info className="w-3 h-3 text-gray-500" />
                    </span>
                </span>
                <span className="font-medium text-red-400">-{conversionFee.toFixed(2)} {toCurrency}</span>
            </div>

            <div className="h-px bg-[#4facfe]/10 my-1"></div>

             <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Total to Receive</span>
                 <div className="text-right">
                    <span className="block font-bold text-[#4facfe] text-xl">{isLoading ? '...' : finalAmount.toFixed(2)} {toCurrency}</span>
                    <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500 mt-1">
                        <span>Updated: {lastUpdated}</span>
                        {error && <span className="text-yellow-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</span>}
                    </div>
                 </div>
            </div>
        </div>

        <div className="mt-6">
            <Button fullWidth onClick={handleExchange} disabled={isLoading || fromAmount <= 0}>
                Exchange Currency
            </Button>
        </div>
      </Card>

      {/* Popular Pairs */}
      <div>
          <h3 className="font-bold text-lg mb-4">Popular Currency Pairs (Live)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularPairs.map((item) => (
                  <Card 
                    key={item.pair} 
                    className="flex items-center justify-between p-4 cursor-pointer hover:border-[#4facfe] transition-colors group"
                    onClick={() => {
                       const target = item.pair.split('/')[1];
                       if (target) setToCurrency(target);
                    }}
                  >
                      <div>
                          <p className="font-bold group-hover:text-[#4facfe] transition-colors">{item.pair}</p>
                          <p className="text-xs text-gray-400">
                             {item.rate ? `1 ${item.pair.split('/')[0]} = ${item.rate.toFixed(4)} ${item.pair.split('/')[1]}` : 'Loading...'}
                          </p>
                      </div>
                      <div className={`flex items-center gap-1 font-medium ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          <TrendingUp className="w-4 h-4" />
                          {item.change}
                      </div>
                  </Card>
              ))}
          </div>
      </div>
    </div>
  );
};
