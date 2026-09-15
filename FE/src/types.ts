export type ScreenType = 'home' | 'catalog' | 'detail' | 'sell' | 'profile' | 'admin' | 'auth';

export type CategoryTab = 'all' | 'electronics' | 'sports';

export type ConditionGrade = 'like_new' | 'good' | 'fair' | 'parts';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  isVerified: boolean;
  walletBalance: number;
  escrowPending: number;
  itemsSold: number;
  itemsListed: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  bio?: string;
  location?: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'electronics' | 'sports';
  subCategory: string;
  brand: string;
  price: number;
  originalPrice: number;
  condition: ConditionGrade;
  conditionLabel: string;
  conditionDescription?: string;
  image: string;
  gallery?: string[];
  location: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    badge?: string;
    responseTime?: string;
    itemsSold?: number;
    joinedDate?: string;
  };
  tags: string[];
  batteryHealth?: number;
  likes: number;
  isLiked?: boolean;
  specs?: Record<string, string>;
  inspectionSummary?: {
    screen?: string;
    battery?: string;
    keyboard?: string;
    chassis?: string;
    accessories?: string;
    icloudStatus?: string;
  };
  sellerNotes?: string;
  directPickupAvailable?: boolean;
  featured?: boolean;
  dateAdded?: string;
  timeAgo?: string;
  conditionPercent?: number;
  conditionDotColor?: 'green' | 'blue' | 'amber' | 'gray';
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  productTitle: string;
  rating: number;
  content: string;
  date: string;
  escrowVerified: boolean;
}
