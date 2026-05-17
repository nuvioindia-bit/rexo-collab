import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, DollarSign, CheckCircle, Users, MapPin, Target } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/stores/AppContext';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const { campaigns, applications } = state;

  const campaign = useMemo(() => campaigns.find((c) => c.id === id), [campaigns, id]);
  const hasApplied = useMemo(() => applications.some((a) => a.campaignId === id), [applications, id]);

  if (!campaign) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Campaign not found</p>
      </div>
    );
  }

  const handleApply = () => {
    if (hasApplied) {
      toast.info('You have already applied to this campaign');
      return;
    }
    navigate(`/apply/${campaign.id}`);
  };

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-52 overflow-hidden"
      >
        <img
          src={campaign.bannerImage}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass-strong flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#111827]" />
          </motion.button>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#6C63FF]">
            {campaign.category}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="px-5 -mt-3 relative z-10 bg-white rounded-t-3xl pt-5 pb-8"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#F7F8FA] flex items-center justify-center overflow-hidden border border-[#E8ECF2]">
            {campaign.brandLogo ? (
              <img src={campaign.brandLogo} alt={campaign.brandName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-[#6C63FF]">{campaign.brandName[0]}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-[#111827]">{campaign.brandName}</p>
            <p className="text-xs text-[#6B7280]">{campaign.category}</p>
          </div>
        </div>

        {/* Title & Payout */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-lg font-bold text-[#111827] leading-tight flex-1">{campaign.title}</h1>
          <div className="flex items-center gap-1 bg-[#F3F1FF] px-3 py-1.5 rounded-xl flex-shrink-0">
            <DollarSign className="w-3.5 h-3.5 text-[#6C63FF]" />
            <span className="text-sm font-bold text-[#6C63FF]">{campaign.payout.toLocaleString()}</span>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F7F8FA] text-[11px] text-[#6B7280]">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(campaign.deadline), { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F7F8FA] text-[11px] text-[#6B7280]">
            <Users className="w-3 h-3" />
            {campaign.applicationsCount} applied
          </div>
          {campaign.creatorRequirements.location && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F7F8FA] text-[11px] text-[#6B7280]">
              <MapPin className="w-3 h-3" />
              {campaign.creatorRequirements.location}
            </div>
          )}
          {campaign.creatorRequirements.minFollowers && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F7F8FA] text-[11px] text-[#6B7280]">
              <Target className="w-3 h-3" />
              {campaign.creatorRequirements.minFollowers.toLocaleString()}+ followers
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-5">
          <h2 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">About</h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">{campaign.description}</p>
        </div>

        {/* Requirements */}
        <div className="mb-5">
          <h2 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Requirements</h2>
          <div className="space-y-2">
            {campaign.requirements.map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-start gap-2.5"
              >
                <CheckCircle className="w-4 h-4 text-[#6C63FF] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#111827]">{req}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="mb-5">
          <h2 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Deliverables</h2>
          <div className="flex flex-wrap gap-2">
            {campaign.deliverables.map((d, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="px-3 py-1.5 rounded-lg bg-[#F3F1FF] text-xs font-medium text-[#6C63FF]"
              >
                {d}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div className="mb-6 p-3 rounded-xl bg-[#F7F8FA] border border-[#E8ECF2]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#6B7280]">Application Deadline</p>
              <p className="text-sm font-semibold text-[#111827]">{format(new Date(campaign.deadline), 'MMMM d, yyyy')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#D97706]" />
            </div>
          </div>
        </div>

        {/* Apply CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleApply}
            disabled={hasApplied}
            className={`w-full h-14 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              hasApplied
                ? 'bg-[#F7F8FA] text-[#6B7280] border border-[#E8ECF2] cursor-default'
                : 'bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white shadow-float hover:shadow-lg'
            }`}
          >
            {hasApplied ? 'Already Applied' : 'Apply Now'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
