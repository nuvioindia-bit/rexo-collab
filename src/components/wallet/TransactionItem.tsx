import { motion } from 'motion/react';
import { ArrowDownLeft, ArrowUpRight, Wallet, Clock } from 'lucide-react';
import type { Transaction } from '@/types';
import { format } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  index?: number;
}

export function TransactionItem({ transaction, index = 0 }: TransactionItemProps) {
  const isPositive = transaction.type === 'earning' || transaction.type === 'deposit';
  const isPending = transaction.status === 'pending';

  const icons = {
    earning: ArrowDownLeft,
    withdrawal: ArrowUpRight,
    deposit: Wallet,
    payout: ArrowUpRight,
  };

  const Icon = icons[transaction.type];

  const bgColors = {
    earning: 'bg-[#F0FDF4] text-[#22C55E]',
    withdrawal: 'bg-[#FEF2F2] text-[#EF4444]',
    deposit: 'bg-[#F3F1FF] text-[#6C63FF]',
    payout: 'bg-[#FEF2F2] text-[#EF4444]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColors[transaction.type]}`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#111827] truncate">
            {transaction.campaignTitle || transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </p>
          {isPending && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[9px] font-medium">
              <Clock className="w-2.5 h-2.5" />
              Pending
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#6B7280]">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${isPositive ? 'text-[#22C55E]' : 'text-[#111827]'}`}>
          {isPositive ? '+' : '-'}${transaction.amount.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
