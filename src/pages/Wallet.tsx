import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { WalletCard } from '@/components/wallet/WalletCard';
import { TransactionItem } from '@/components/wallet/TransactionItem';
import { useApp } from '@/stores/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const chartData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 2800 },
  { name: 'Mar', value: 2100 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 3800 },
  { name: 'Jun', value: 5200 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[#E8ECF2] px-3 py-2">
        <p className="text-xs font-semibold text-[#111827]">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Wallet() {
  const { state } = useApp();
  const { user } = useAuth();
  const { transactions } = state;
  const [filter, setFilter] = useState<'all' | 'earnings' | 'withdrawals'>('all');

  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'earning' || t.type === 'deposit') return acc + t.amount;
      if (t.type === 'withdrawal' || t.type === 'payout') return acc - t.amount;
      return acc;
    }, 0);
  }, [transactions]);

  const totalEarned = useMemo(() => {
    return transactions.filter((t) => t.type === 'earning').reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'earnings') return transactions.filter((t) => t.type === 'earning');
    return transactions.filter((t) => t.type === 'withdrawal');
  }, [transactions, filter]);

  const handleWithdraw = () => {
    if (balance < 100) {
      toast.error('Minimum withdrawal is $100');
      return;
    }
    toast.info('Withdrawal feature coming soon');
  };

  return (
    <MobileLayout title="Wallet">
      <div className="px-5 pt-2 pb-6">
        {/* Wallet Card */}
        <WalletCard balance={balance} totalEarned={totalEarned} />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mt-4"
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleWithdraw}
            className="flex-1 h-12 rounded-xl bg-[#111827] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => toast.info('Deposit feature coming soon')}
            className="flex-1 h-12 rounded-xl bg-[#F7F8FA] border border-[#E8ECF2] text-[#111827] text-sm font-semibold flex items-center justify-center gap-2"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Deposit
          </motion.button>
        </motion.div>

        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 bg-white rounded-2xl border border-[#E8ECF2] p-4 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">Earnings</h3>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F3F1FF]">
              <ArrowUpRight className="w-3 h-3 text-[#6C63FF]" />
              <span className="text-[10px] font-semibold text-[#6C63FF]">+24%</span>
            </div>
          </div>
          <div className="h-32 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6C63FF"
                  strokeWidth={2.5}
                  fill="url(#colorValue)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">Transactions</h3>
            <div className="flex gap-1">
              {(['all', 'earnings', 'withdrawals'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    filter === f ? 'bg-[#6C63FF] text-white' : 'bg-[#F7F8FA] text-[#6B7280]'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'earnings' ? 'Earnings' : 'Withdrawals'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0.5">
            {filteredTransactions.map((t, i) => (
              <TransactionItem key={t.id} transaction={t} index={i} />
            ))}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-[#6B7280]">No transactions found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
