import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { SideDrawer } from './SideDrawer';
import { PageTransition } from '@/components/animations/PageTransition';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
  showTopBar?: boolean;
  transparentTopBar?: boolean;
  className?: string;
}

const noNavPaths = ['/login', '/register', '/campaigns/', '/apply/', '/create-campaign', '/brand-dashboard'];

export function MobileLayout({
  children,
  title,
  showNav = true,
  showTopBar = true,
  transparentTopBar = false,
  className,
}: MobileLayoutProps) {
  const location = useLocation();

  const shouldShowNav = showNav && !noNavPaths.some((path) => location.pathname.startsWith(path) || location.pathname === path);
  const shouldShowTopBar = showTopBar && !['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-[100dvh] min-h-screen bg-white">
      <div className="mx-auto max-w-md relative min-h-[100dvh] min-h-screen bg-white shadow-2xl shadow-black/5">
        {shouldShowTopBar && (
          <TopBar title={title} transparent={transparentTopBar} />
        )}

        <main
          className={cn(
            'min-h-[100dvh] min-h-screen pb-28',
            shouldShowTopBar && !transparentTopBar && 'pt-topbar',
            shouldShowTopBar && transparentTopBar && 'pt-safe',
            !shouldShowTopBar && 'pt-safe',
            className
          )}
        >
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {shouldShowNav && <BottomNav />}
        <SideDrawer />
      </div>
    </div>
  );
}
