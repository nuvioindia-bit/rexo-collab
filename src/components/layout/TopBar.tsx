import { Menu, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '@/stores/AppContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  showMenu?: boolean;
  showNotification?: boolean;
  transparent?: boolean;
}

export function TopBar({ title = 'Rexo', showMenu = true, showNotification = true, transparent = false }: TopBarProps) {
  const { toggleDrawer } = useApp();
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        transparent ? '' : 'glass-strong border-b border-[#E8ECF2]/60'
      )}
    >
      <div className="mx-auto max-w-md">
        <div
          className="flex items-center justify-between px-4 pb-2.5"
          style={{ paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 8px), 12px)' }}
        >
          {showMenu ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDrawer}
              className="p-2 -ml-1 rounded-xl hover:bg-[#F7F8FA] active:bg-[#E8ECF2] transition-colors"
            >
              <Menu className="w-5 h-5 text-[#111827]" strokeWidth={2} />
            </motion.button>
          ) : (
            <div className="w-9" />
          )}

          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base font-bold text-[#111827] tracking-tight"
          >
            {title}
          </motion.h1>

          {showNotification ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/settings?tab=notifications')}
              className="relative p-2 -mr-1 rounded-xl hover:bg-[#F7F8FA] active:bg-[#E8ECF2] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#111827]" strokeWidth={2} />
            </motion.button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </div>
    </div>
  );
}
