import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  UserCircle,
  Bell,
  Shield,
  Link2,
  Moon,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Mail,
  Smartphone,
  Globe,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/stores/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'account';
  const { state } = useApp();
  const { user, signOut } = useAuth();
  

  const [activeTab, setActiveTab] = useState(initialTab);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: UserCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'socials', label: 'Connected Socials', icon: Link2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Full Name</label>
              <Input defaultValue={user?.displayName || user?.name} className="h-11 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Email</label>
              <Input defaultValue={user?.email} className="h-11 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Bio</label>
              <textarea
                defaultValue={user?.bio}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border border-[#E8ECF2] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] resize-none"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success('Profile updated')}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white font-semibold text-sm shadow-float"
            >
              Save Changes
            </motion.button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F3F1FF] flex items-center justify-center">
                  <Mail className="w-[18px] h-[18px] text-[#6C63FF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">Email Notifications</p>
                  <p className="text-[11px] text-[#6B7280]">Updates and campaign alerts</p>
                </div>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F4FF] flex items-center justify-center">
                  <Smartphone className="w-[18px] h-[18px] text-[#4EA8FF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">Push Notifications</p>
                  <p className="text-[11px] text-[#6B7280]">Real-time alerts</p>
                </div>
              </div>
              <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <Shield className="w-[18px] h-[18px] text-[#D97706]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">Two-Factor Authentication</p>
                  <p className="text-[11px] text-[#6B7280]">Extra account security</p>
                </div>
              </div>
              <Switch checked={twoFA} onCheckedChange={setTwoFA} />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.info('Password change coming soon')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                  <Globe className="w-[18px] h-[18px] text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">Change Password</p>
                  <p className="text-[11px] text-[#6B7280]">Update your password</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </motion.button>
          </div>
        );

      case 'socials':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Instagram</label>
              <Input
                defaultValue={user?.socials?.instagram}
                placeholder="https://instagram.com/..."
                className="h-11 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">YouTube</label>
              <Input
                defaultValue={user?.socials?.youtube}
                placeholder="https://youtube.com/..."
                className="h-11 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">TikTok</label>
              <Input
                defaultValue={user?.socials?.tiktok}
                placeholder="https://tiktok.com/@..."
                className="h-11 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success('Social links saved')}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white font-semibold text-sm shadow-float"
            >
              Save Social Links
            </motion.button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8ECF2]">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-[#F7F8FA] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#111827]" />
          </motion.button>
          <h1 className="text-base font-bold text-[#111827]">Settings</h1>
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#6C63FF] text-white shadow-sm'
                    : 'bg-[#F7F8FA] text-[#6B7280] border border-[#E8ECF2]'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-5 py-4"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
