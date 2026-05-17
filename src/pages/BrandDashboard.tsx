import { motion } from 'motion/react';
import { Plus, Megaphone, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/stores/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { CampaignCard } from '@/components/campaign/CampaignCard';

export default function BrandDashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { user } = useAuth();
  const { campaigns } = state;

  const brandCampaigns = campaigns.filter((c) => c.brandId === user?.uid);
  const totalApplications = brandCampaigns.reduce((acc, c) => acc + (c.applicationsCount || 0), 0);
  const totalBudget = brandCampaigns.reduce((acc, c) => acc + c.payout, 0);

  const stats = [
    { label: 'Campaigns', value: String(brandCampaigns.length), icon: Megaphone, color: 'from-[#6C63FF] to-[#8B5CF6]' },
    { label: 'Applications', value: String(totalApplications), icon: Users, color: 'from-[#4EA8FF] to-[#60A5FA]' },
    { label: 'Budget', value: `$${(totalBudget / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-[#22C55E] to-[#34D399]' },
  ];

  return (
    <MobileLayout title="Dashboard">
      <div className="px-5 pt-2 pb-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-[#6B7280]">Welcome back</p>
          <h2 className="text-xl font-bold text-[#111827] mt-0.5">{user?.displayName || user?.name || 'Brand'}</h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2.5 mt-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-[#E8ECF2] p-3 shadow-card">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-base font-bold text-[#111827]">{stat.value}</p>
                <p className="text-[10px] text-[#6B7280] font-medium">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Create Campaign CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/create-campaign')}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white font-semibold text-sm shadow-float flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Campaign
          </motion.button>
        </motion.div>

        {/* Active Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">Your Campaigns</h3>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F3F1FF]">
              <TrendingUp className="w-3 h-3 text-[#6C63FF]" />
              <span className="text-[10px] font-semibold text-[#6C63FF]">Active</span>
            </div>
          </div>
          <div className="space-y-3">
            {brandCampaigns.map((campaign, i) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                index={i}
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              />
            ))}
            {brandCampaigns.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-[#6B7280]">No campaigns yet</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Create your first campaign</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
