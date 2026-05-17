import { motion } from 'motion/react';
import { Home, Megaphone, Wallet, User } from 'lucide-react';
import { useApp } from '@/stores/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/campaigns' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function BottomNav() {
  const { state, setActiveTab } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    navigate(path);
  };

  // Determine active tab from current route
  const currentTab = tabs.find((t) => location.pathname === t.path)?.id || state.activeTab;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="mx-auto max-w-md px-4 pb-3 pt-2">
        <div className="glass-strong rounded-2xl border border-[#E8ECF2] shadow-lg shadow-black/5">
          <nav className="flex items-center justify-around px-1 py-1.5">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id, tab.path)}
                  className={cn(
                    'relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors duration-200',
                    isActive ? 'text-[#6C63FF]' : 'text-[#6B7280]'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#6C63FF]/8 rounded-xl"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -1 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                    className="relative z-10"
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors duration-200',
                        isActive ? 'text-[#6C63FF]' : 'text-[#6B7280]'
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.div>
                  <motion.span
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                      scale: isActive ? 1 : 0.95,
                    }}
                    className={cn(
                      'relative z-10 text-[10px] font-semibold mt-0.5 transition-colors duration-200',
                      isActive ? 'text-[#6C63FF]' : 'text-[#6B7280]'
                    )}
                  >
                    {tab.label}
                  </motion.span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
