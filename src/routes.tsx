import { lazy, Suspense, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const ApplyFlow = lazy(() => import('./pages/ApplyFlow'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const BrandDashboard = lazy(() => import('./pages/BrandDashboard'));
const CreateCampaign = lazy(() => import('./pages/CreateCampaign'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function PageLoader({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-white flex flex-col p-5 space-y-4"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <Skeleton className="h-8 w-32 rounded-lg bg-muted" />
          <Skeleton className="h-40 w-full rounded-2xl bg-muted" />
          <Skeleton className="h-24 w-full rounded-2xl bg-muted" />
          <Skeleton className="h-24 w-full rounded-2xl bg-muted" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Login', path: '/login', element: <PageLoader><Login /></PageLoader>, public: true },
  { name: 'Register', path: '/register', element: <PageLoader><Register /></PageLoader>, public: true },
  { name: 'Home', path: '/', element: <PageLoader><Home /></PageLoader> },
  { name: 'Campaigns', path: '/campaigns', element: <PageLoader><Campaigns /></PageLoader> },
  { name: 'Campaign Detail', path: '/campaigns/:id', element: <PageLoader><CampaignDetail /></PageLoader> },
  { name: 'Apply', path: '/apply/:id', element: <PageLoader><ApplyFlow /></PageLoader> },
  { name: 'Wallet', path: '/wallet', element: <PageLoader><Wallet /></PageLoader> },
  { name: 'Profile', path: '/profile', element: <PageLoader><Profile /></PageLoader> },
  { name: 'Settings', path: '/settings', element: <PageLoader><Settings /></PageLoader> },
  { name: 'Brand Dashboard', path: '/brand-dashboard', element: <PageLoader><BrandDashboard /></PageLoader> },
  { name: 'Create Campaign', path: '/create-campaign', element: <PageLoader><CreateCampaign /></PageLoader> },
  { name: 'Admin Panel', path: '/admin', element: <PageLoader><AdminPanel /></PageLoader> },
];
