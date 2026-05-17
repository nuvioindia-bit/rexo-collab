export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'creator' | 'brand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  socials?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  stats?: {
    followers?: number;
    engagement?: number;
    campaignsCompleted?: number;
    totalEarned?: number;
  };
}

export type CampaignStatus = 'active' | 'closed' | 'draft';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  payout: number;
  currency: string;
  deadline: string;
  category: string;
  status: CampaignStatus;
  bannerImage?: string;
  creatorRequirements: {
    minFollowers?: number;
    categories?: string[];
    location?: string;
  };
  applicationsCount?: number;
  createdAt: string;
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  status: ApplicationStatus;
  pitch: string;
  proposedRate: number;
  portfolioLinks?: string[];
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  audienceStats?: {
    followers: number;
    engagement: number;
    platform: string;
  };
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  campaignId?: string;
  campaignTitle?: string;
  amount: number;
  currency: string;
  type: 'earning' | 'withdrawal' | 'deposit' | 'payout';
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'campaign' | 'application' | 'payment' | 'system';
  createdAt: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
  order: number;
  createdAt?: unknown;
}
