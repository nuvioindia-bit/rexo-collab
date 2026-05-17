import { motion } from 'motion/react';
import {
  Settings,
  ChevronRight,
  Instagram,
  Youtube,
  CheckCircle,
  TrendingUp,
  Users,
  Eye,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Please log in</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Followers',
      value: user.stats?.followers ? `${(user.stats.followers / 1000).toFixed(0)}K` : '245K',
      icon: Users,
      color: 'bg-[#F3F1FF] text-[#6C63FF]',
    },
    {
      label: 'Engagement',
      value: `${user.stats?.engagement || 4.8}%`,
      icon: Eye,
      color: 'bg-[#E8F4FF] text-[#4EA8FF]',
    },
    {
      label: 'Campaigns',
      value: String(user.stats?.campaignsCompleted || 32),
      icon: Briefcase,
      color: 'bg-[#F0FDF4] text-[#22C55E]',
    },
    {
      label: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'bg-[#FEF3C7] text-[#D97706]',
    },
  ];

  const menuItems = [
    { label: 'Edit Profile', path: '/settings', icon: Settings },
    { label: 'My Applications', path: '/campaigns', icon: Briefcase },
    { label: 'Account Settings', path: '/settings', icon: Settings },
  ];

  return (
    <MobileLayout title="Profile">
      <div className="px-5 pt-2 pb-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center py-4"
        >
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[#6C63FF] to-[#4EA8FF]">
              <img
                src={user.avatar || ''}
                alt={user.displayName}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            {user.verified && (
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#6C63FF] rounded-full flex items-center justify-center border-[3px] border-white">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold text-[#111827]">{user.displayName}</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">{user.email}</p>

          {user.bio && (
            <p className="text-xs text-[#6B7280] mt-2 max-w-xs leading-relaxed">{user.bio}</p>
          )}

          {/* Social Links */}
          <div className="flex gap-2 mt-3">
            {user.socials?.instagram && (
              <a
                href={user.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#F7F8FA] flex items-center justify-center hover:bg-[#F3F1FF] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#6B7280]" />
              </a>
            )}
            {user.socials?.youtube && (
              <a
                href={user.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#F7F8FA] flex items-center justify-center hover:bg-[#E8F4FF] transition-colors"
              >
                <Youtube className="w-4 h-4 text-[#6B7280]" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-4 gap-2 mt-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-[#E8ECF2] p-2.5 text-center shadow-sm"
              >
                <div className={`w-7 h-7 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-1.5`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-bold text-[#111827]">{stat.value}</p>
                <p className="text-[9px] text-[#6B7280] font-medium">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 space-y-0.5"
        >
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#F7F8FA] active:bg-[#E8ECF2] transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F7F8FA] flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-[#6B7280]" />
                </div>
                <span className="flex-1 text-sm font-medium text-[#111827]">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#F3F1FF] to-[#E8F4FF] border border-[#E8ECF2]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF] flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#111827]">Creator Verification</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                {user.verified ? 'You are a verified creator' : 'Get verified to unlock premium campaigns'}
              </p>
            </div>
            {!user.verified && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded-lg bg-[#6C63FF] text-white text-xs font-semibold"
              >
                Verify
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
