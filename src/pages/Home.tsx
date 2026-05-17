import { useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Megaphone, CheckCircle, DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/stores/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeCampaigns } from '@/firebase/firestore';
import { CampaignCarousel } from '@/components/campaign/CampaignCarousel';
import { CampaignCard } from '@/components/campaign/CampaignCard';
import { BannerCarousel } from '@/components/banners/BannerCarousel';
import { MobileLayout } from '@/components/layout/MobileLayout';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, setCampaigns } = useApp();
  const { campaigns } = state;

  // Firestore से campaigns subscribe करो
  useEffect(() => {
    const unsub = subscribeCampaigns((data) => {
      setCampaigns(data);
    });
    return () => unsub();
  }, [setCampaigns]);

  const featuredCampaigns = campaigns.slice(0, 3);
  const trendingCampaigns = campaigns.slice(0, 3);

  const stats = [
    { label: 'Applied', value: '—', icon: Megaphone, color: 'from-[#6C63FF] to-[#8B5CF6]' },
    { label: 'Approved', value: '—', icon: CheckCircle, color: 'from-[#22C55E] to-[#34D399]' },
    { label: 'Earnings', value: '₹0', icon: DollarSign, color: 'from-[#4EA8FF] to-[#60A5FA]' },
  ];

  return (
    <MobileLayout title="Rexo" transparentTopBar>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pb-6"
      >
        {/* Welcome */}
        <motion.div variants={itemVariants} className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6B7280] font-medium">Welcome back</p>
              <h2 className="text-xl font-bold text-[#111827] mt-0.5 text-balance">
                {user?.displayName?.split(' ')[0] || 'User'}
              </h2>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F3F1FF]">
              <span className="text-[10px] font-semibold text-[#6C63FF] capitalize">
                {user?.role === 'brand' ? 'Brand' : 'Creator'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Banner Carousel – header के नीचे */}
        <motion.div variants={itemVariants}>
          <BannerCarousel />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="px-5 mt-4">
          <div className="grid grid-cols-3 gap-2.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white rounded-2xl border border-[#E8ECF2] p-3 shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-base font-bold text-[#111827]">{stat.value}</p>
                  <p className="text-[10px] text-[#6B7280] font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Campaigns */}
        {featuredCampaigns.length > 0 && (
          <motion.div variants={itemVariants} className="mt-6">
            <div className="flex items-center justify-between px-5 mb-3">
              <h3 className="text-sm font-bold text-[#111827]">Featured Campaigns</h3>
              <button
                onClick={() => navigate('/campaigns')}
                className="flex items-center gap-0.5 text-xs font-medium text-[#6C63FF]"
              >
                सभी देखें <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <CampaignCarousel
              campaigns={featuredCampaigns}
              onSelect={(c) => navigate(`/campaigns/${c.id}`)}
            />
          </motion.div>
        )}

        {/* Trending */}
        {trendingCampaigns.length > 0 && (
          <motion.div variants={itemVariants} className="mt-6 px-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#6C63FF]" />
              <h3 className="text-sm font-bold text-[#111827]">Trending Now</h3>
            </div>
            <div className="space-y-3">
              {trendingCampaigns.map((campaign, i) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  index={i}
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  compact
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {campaigns.length === 0 && (
          <motion.div variants={itemVariants} className="mt-10 px-5 text-center">
            <div className="py-10 bg-[#F7F8FA] rounded-2xl border border-[#E8ECF2]">
              <Megaphone className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#6B7280]">अभी कोई campaign नहीं है</p>
              <p className="text-xs text-[#9CA3AF] mt-1">जल्द ही नए campaigns आएंगे।</p>
            </div>
          </motion.div>
        )}

        {/* Quick Action */}
        <motion.div variants={itemVariants} className="mt-6 px-5">
          <div className="bg-gradient-to-r from-[#F3F1FF] to-[#E8F4FF] rounded-2xl p-4 border border-[#E8ECF2]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#111827] text-balance">Profile complete करें</h4>
                <p className="text-xs text-[#6B7280] mt-0.5 text-pretty">Top brands द्वारा discover हों</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                className="shrink-0 px-4 py-2 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold shadow-sm"
              >
                Edit
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}
