import { motion } from 'motion/react';
import { Calendar, DollarSign, Users } from 'lucide-react';
import type { Campaign } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
  onClick?: () => void;
  compact?: boolean;
}

export function CampaignCard({ campaign, index = 0, onClick, compact = false }: CampaignCardProps) {
  const deadlineText = formatDistanceToNow(new Date(campaign.deadline), { addSuffix: true });

  if (compact) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
          'w-full text-left bg-white rounded-2xl border border-[#E8ECF2] p-3.5',
          'shadow-card hover:shadow-card-hover transition-shadow duration-300',
          'active:scale-[0.98]'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F7F8FA] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[#E8ECF2]">
            {campaign.brandLogo ? (
              <img src={campaign.brandLogo} alt={campaign.brandName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-[#6C63FF]">{campaign.brandName[0]}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#111827] truncate">{campaign.title}</p>
            <p className="text-xs text-[#6B7280] truncate">{campaign.brandName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-[#6C63FF]">${campaign.payout.toLocaleString()}</p>
            <p className="text-[10px] text-[#6B7280]">{deadlineText}</p>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        'w-full text-left bg-white rounded-2xl border border-[#E8ECF2] overflow-hidden',
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        'active:scale-[0.96]'
      )}
    >
      {campaign.bannerImage && (
        <div className="relative h-32 overflow-hidden">
          <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#6C63FF]">
              {campaign.category}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#F7F8FA] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[#E8ECF2]">
              {campaign.brandLogo ? (
                <img src={campaign.brandLogo} alt={campaign.brandName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#6C63FF]">{campaign.brandName[0]}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#111827] truncate">{campaign.brandName}</p>
              <p className="text-xs text-[#6B7280]">{campaign.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#F3F1FF] px-2 py-1 rounded-lg flex-shrink-0">
            <DollarSign className="w-3 h-3 text-[#6C63FF]" />
            <span className="text-xs font-bold text-[#6C63FF]">{campaign.payout.toLocaleString()}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-[#111827] mb-1.5 line-clamp-1">{campaign.title}</h3>
        <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">{campaign.description}</p>

        <div className="flex items-center gap-4 text-[10px] text-[#6B7280]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{deadlineText}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{campaign.applicationsCount} applied</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
