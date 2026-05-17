import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/stores/AppContext';
import { CampaignCard } from '@/components/campaign/CampaignCard';
import { MobileLayout } from '@/components/layout/MobileLayout';

import { cn } from '@/lib/utils';

const categories = ['All', 'Fashion', 'Technology', 'Beauty', 'Fitness', 'Travel', 'Lifestyle', 'Food', 'Gaming'];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export default function Campaigns() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { campaigns } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest_payout' | 'deadline'>('newest');

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];

    if (activeCategory !== 'All') {
      result = result.filter((c) => c.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.brandName.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'highest_payout':
        result.sort((a, b) => b.payout - a.payout);
        break;
      case 'deadline':
        result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [campaigns, activeCategory, searchQuery, sortBy]);

  return (
    <MobileLayout title="Campaigns">
      <div className="px-5 pt-2">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search campaigns, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#F7F8FA] border border-[#E8ECF2] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
            >
              <X className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1 -mx-5 px-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                activeCategory === cat
                  ? 'bg-[#6C63FF] text-white shadow-sm'
                  : 'bg-[#F7F8FA] text-[#6B7280] border border-[#E8ECF2]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#6B7280]">
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
              showFilters ? 'bg-[#F3F1FF] text-[#6C63FF]' : 'bg-[#F7F8FA] text-[#6B7280]'
            )}
          >
            <SlidersHorizontal className="w-3 h-3" />
            Sort
          </button>
        </div>

        {/* Sort options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mb-4"
          >
            {(['newest', 'highest_payout', 'deadline'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => {
                  setSortBy(sort);
                  setShowFilters(false);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  sortBy === sort
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#F7F8FA] text-[#6B7280] border border-[#E8ECF2]'
                )}
              >
                {sort === 'newest' ? 'Newest' : sort === 'highest_payout' ? 'Highest Payout' : 'Deadline'}
              </button>
            ))}
          </motion.div>
        )}

        {/* Campaign list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 pb-4"
        >
          {filteredCampaigns.map((campaign, i) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={i}
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            />
          ))}

          {filteredCampaigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-[#9CA3AF]" />
              </div>
              <p className="text-sm font-medium text-[#111827]">No campaigns found</p>
              <p className="text-xs text-[#6B7280] mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
