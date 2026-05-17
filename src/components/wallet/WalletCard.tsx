import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface WalletCardProps {
  balance: number;
  totalEarned: number;
  currency?: string;
}

export function WalletCard({ balance, totalEarned, currency = 'USD' }: WalletCardProps) {
  const [hidden, setHidden] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#6C63FF] to-[#4EA8FF] shadow-float"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Total Balance</span>
          <button
            onClick={() => setHidden(!hidden)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {hidden ? (
              <EyeOff className="w-3.5 h-3.5 text-white/90" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-white/90" />
            )}
          </button>
        </div>

        <motion.div
          key={hidden ? 'hidden' : 'visible'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {hidden ? '••••••' : formatCurrency(balance)}
          </h2>
        </motion.div>

        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/15">
            <ArrowUpRight className="w-3 h-3 text-white/90" />
            <span className="text-[10px] font-medium text-white/90">+12.5%</span>
          </div>
          <span className="text-[10px] text-white/60">vs last month</span>
        </div>

        <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/60 mb-0.5">Total Earned</p>
            <p className="text-sm font-semibold text-white">
              {hidden ? '••••' : formatCurrency(totalEarned)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60 mb-0.5">Pending</p>
            <p className="text-sm font-semibold text-white">
              {hidden ? '••••' : formatCurrency(balance * 0.35)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
