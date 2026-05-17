import { motion, AnimatePresence } from 'motion/react';
import { X, UserCircle, Bell, Shield, Link2, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useApp } from '@/stores/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const menuItems = [
  { id: 'account', label: 'Account', icon: UserCircle, path: '/settings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings?tab=notifications' },
  { id: 'security', label: 'Security', icon: Shield, path: '/settings?tab=security' },
  { id: 'socials', label: 'Connected Socials', icon: Link2, path: '/settings?tab=socials' },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const drawerVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.9 } },
  exit: { x: '-100%', transition: { type: 'spring' as const, stiffness: 380, damping: 38 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.08 + i * 0.045, duration: 0.25, ease: 'easeOut' as const },
  }),
};

export function SideDrawer() {
  const { state, setDrawer } = useApp();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => setDrawer(false);

  const handleNavigate = (path: string) => {
    setDrawer(false);
    setTimeout(() => navigate(path), 200);
  };

  const handleLogout = async () => {
    setDrawer(false);
    await signOut();
    setTimeout(() => navigate('/login'), 200);
  };

  return (
    <AnimatePresence>
      {state.drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 bottom-0 z-[70] w-[78%] max-w-[300px] bg-white shadow-2xl flex flex-col"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <span className="text-base font-bold text-[#111827]">Menu</span>
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-[#F7F8FA] hover:bg-[#E8ECF2] transition-colors"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="px-5 pb-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#F3F1FF] to-[#E8F4FF]">
                  <div className="w-11 h-11 rounded-full bg-[#6C63FF] flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-base">
                      {(user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#111827] text-sm truncate">{user.displayName}</p>
                    <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
                    {user.isAdmin && (
                      <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#6C63FF] bg-[#F3F1FF] px-1.5 py-0.5 rounded-full">
                        Super Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="mx-5 border-t border-[#F3F4F6] mb-1" />

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors',
                      'hover:bg-[#F7F8FA] active:bg-[#E8ECF2]'
                    )}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#F7F8FA] flex items-center justify-center shrink-0">
                      <Icon className="w-[17px] h-[17px] text-[#6B7280]" />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium text-[#111827]">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C4C9D4]" />
                  </motion.button>
                );
              })}

              {/* Admin Panel – सिर्फ Super Admin को */}
              {user?.isAdmin && (
                <motion.button
                  custom={menuItems.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleNavigate('/admin')}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F3F1FF] active:bg-[#E8ECF2] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F3F1FF] flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-[17px] h-[17px] text-[#6C63FF]" />
                  </div>
                  <span className="flex-1 text-left text-sm font-medium text-[#6C63FF]">Admin Panel</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6C63FF]/50" />
                </motion.button>
              )}
            </div>

            {/* Logout */}
            <div className="px-5 pb-4 pt-2">
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FEF2F2] text-[#EF4444] font-medium text-sm active:scale-[0.98] transition-transform"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
