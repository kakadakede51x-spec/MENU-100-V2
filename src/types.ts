export type TabType = 'ranking' | 'restaurants' | 'merch' | 'forum' | 'membership';

export type FoodCategory = 
  | 'all'
  | 'global_top20'
  | 'soup_curry'
  | 'stirfry_fry'
  | 'single_dish'
  | 'street_food'
  | 'dessert_cafe'
  | 'international';

export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  category: FoodCategory;
  origin: string;
  countryCode: string; // e.g. TH, JP, IT, MX
  image: string;
  description: string;
  tags: string[];
  regularVotes: number;
  royalVotes: number;
  rank: number;
  previousRank?: number;
  isGlobalTop20?: boolean;
  calories?: number;
  flavorProfile: string[]; // e.g. 'เข้มข้น', 'เผ็ดกลมกล่อม', 'หอมกะทิ'
}

export type ThailandRegion = 'north' | 'central' | 'northeast' | 'south' | 'east' | 'west';

export interface ProvinceData {
  id: string;
  name: string;
  nameEn: string;
  region: ThailandRegion;
  signatureDish: string;
  restaurantCount: number;
  topRankScore: number;
}

export interface RestaurantItem {
  id: string;
  name: string;
  provinceId?: string;
  provinceName: string;
  region: ThailandRegion;
  address: string;
  verifiedStars: 1 | 2 | 3 | 4 | 5;
  menu100Score?: number; // 0 - 100
  rating?: number;
  isSme: boolean;
  isStreetFood: boolean;
  leagueTier: 'provincial' | 'regional' | 'national';
  image: string;
  cuisine: string;
  priceRange: '฿' | '฿฿' | '฿฿฿' | '฿฿฿฿';
  highlightDishes?: string[];
  signatureDishes?: string[];
  openHours?: string;
  phone?: string;
  phoneNumber?: string;
  reviewCount?: number;
  reviewsCount?: number;
  description: string;
  rankInProvince?: number;
  votesCount?: number;
}

export interface MerchItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'clothing' | 'bottle' | 'hat' | 'accessories' | 'stickers' | 'food_gift' | 'kitchenware';
  price: number;
  royalDiscountPercent: number;
  image: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  stockCount?: number;
  featured?: boolean;
  isLimited?: boolean;
}

export interface CartItem {
  merch: MerchItem;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerUsername: string;
  items: {
    merchId: string;
    merchName: string;
    quantity: number;
    price?: number;
    pricePerUnit?: number;
    size?: string;
    color?: string;
  }[];
  totalAmount: number;
  discountAmount?: number;
  isRoyalDiscountApplied?: boolean;
  createdAt: string;
  status?: 'completed' | 'processing' | 'shipped';
  orderStatus?: 'completed' | 'processing' | 'shipped';
  paymentMethod?: string;
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  isRoyalMember: boolean;
  royalBadgeTitle?: string;
  content: string;
  stickerUrl?: string;
  likes: number;
  createdAt: string;
}

export interface ForumThread {
  id: string;
  title: string;
  category: 'noodle' | 'street' | 'finedining' | 'dessert' | 'cooking' | 'shabu';
  authorName: string;
  authorAvatar: string;
  isRoyalMember: boolean;
  content: string;
  tags: string[];
  image?: string;
  likes: number;
  views: number;
  comments: ForumComment[];
  createdAt: string;
  isPinned?: boolean;
}

export interface RoyalSticker {
  id: string;
  name: string;
  emoji: string;
  description: string;
  royaltyTier: 'VIP' | 'Gold' | 'Diamond';
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isRoyal: boolean;
  royalLevel: 'Gold' | 'Platinum' | 'Diamond';
  role: 'user' | 'admin';
  joinedDate: string;
  votedFoodIds: string[];
  bookmarkedRestaurantIds: string[];
  royalVotesLeftThisMonth: number;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string; // Stored for teacher/admin inspection dashboard
  displayName: string;
  avatar: string;
  isRoyal: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  voteCount: number;
  totalSpent: number;
}

export type UserAccountRecord = UserAccount;

export type ViewMode = 'client' | 'admin';
export type ThemeMode = 'light' | 'dark';
export type AuthGateReason = 'vote' | 'merch' | 'forum' | 'membership' | 'general' | 'verify';

export interface DatabaseConfig {
  provider: 'local' | 'supabase';
  type?: 'local' | 'supabase' | 'cloudsql';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}


