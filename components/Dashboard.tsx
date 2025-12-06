import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { INITIAL_WALLETS, INITIAL_TRANSACTIONS } from '../services/mockData';
import { ArrowUpRight, ArrowDownLeft, Plus, Wallet as WalletIcon, TrendingUp, DollarSign, Activity } from 'lucide-react';

export const Dashboard: React.FC<{ onNavigate: (view: any) => void }> = ({ onNavigate }) => {
  const totalBalance = 74475.37;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Section */}
      <Card className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 bg-[#4facfe] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Portfolio Value</h2>
              <h1 className="text-5xl font-bold text-gradient-green tracking-tight">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h1>
            </div>
            <div className="p-3 bg-[#4facfe]/10 rounded-xl border border-[#4facfe]/20">
              <Activity className="w-6 h-6 text-[#4facfe]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <Button variant="secondary" className="h-24 flex-col gap-2" onClick={() => onNavigate('transfer')}>
              <div className="p-2 bg-[#4facfe]/10 rounded-full text-[#4facfe]">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="text-sm">Send</span>
            </Button>
            <Button variant="secondary" className="h-24 flex-col gap-2">
              <div className="p-2 bg-green-500/10 rounded-full text-green-400">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <span className="text-sm">Request</span>
            </Button>
            <Button variant="secondary" className="h-24 flex-col gap-2">
               <div className="p-2 bg-purple-500/10 rounded-full text-purple-400">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm">Add Money</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Wallets & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <WalletIcon className="w-5 h-5 text-[#4facfe]" /> My Wallets
            </h3>
          </div>
          <div className="grid gap-3">
            {INITIAL_WALLETS.map((wallet) => (
              <Card key={wallet.currency} className="flex items-center justify-between py-4 hover:translate-x-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${wallet.isCrypto ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    {wallet.currency[0]}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{wallet.currency}</p>
                    <p className="text-xs text-gray-400">{wallet.isCrypto ? 'Crypto Asset' : 'Fiat Currency'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {wallet.isCrypto 
                      ? `${wallet.balance.toFixed(4)} ${wallet.currency}` 
                      : `$${wallet.balance.toLocaleString()}`
                    }
                  </p>
                  <p className={`text-xs font-medium ${wallet.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {wallet.change > 0 ? '+' : ''}{wallet.change}%
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4facfe]" /> Recent Transactions
            </h3>
            <span className="text-sm text-[#4facfe] cursor-pointer hover:underline">View All</span>
          </div>
          <Card noPadding className="overflow-hidden">
            <div className="divide-y divide-[#4facfe]/20">
              {INITIAL_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-[#4facfe]/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'received' ? 'bg-green-500/10 text-green-400' : 
                      tx.type === 'sent' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {tx.type === 'received' && <ArrowDownLeft className="w-5 h-5" />}
                      {tx.type === 'sent' && <ArrowUpRight className="w-5 h-5" />}
                      {tx.type === 'exchange' && <DollarSign className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.counterparty}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className={`text-right font-medium ${tx.type === 'received' ? 'text-green-400' : 'text-white'}`}>
                    {tx.type === 'received' ? '+' : '-'}{tx.type === 'exchange' ? '' : (tx.currency === 'USD' ? '$' : '')}
                    {tx.amount.toLocaleString()} {tx.currency !== 'USD' ? tx.currency : ''}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};