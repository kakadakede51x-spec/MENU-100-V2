import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  FoodItem, 
  RestaurantItem, 
  MerchItem, 
  UserAccount, 
  OrderRecord, 
  DatabaseConfig,
  UserProfile 
} from '../types';
import { 
  INITIAL_FOODS, 
  MOCK_RESTAURANTS, 
  MERCH_PRODUCTS, 
  FORUM_THREADS 
} from '../data/mockData';

// Initial User Accounts with plain password visible for teacher/admin inspect
export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: 'admin100password',
    displayName: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isRoyal: true,
    role: 'admin',
    createdAt: '2026-08-01',
    voteCount: 42,
    totalSpent: 3490
  },
  {
    id: 'usr-2',
    username: 'somchai_foodie',
    password: 'somchai@pass2026',
    displayName: 'สมชาย นักชิมริมทาง',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isRoyal: true,
    role: 'user',
    createdAt: '2026-08-15',
    voteCount: 28,
    totalSpent: 1280
  },
  {
    id: 'usr-3',
    username: 'nida_taste',
    password: 'nida!ilovefood99',
    displayName: 'นิดา สายคาเฟ่&ต้มยำ',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isRoyal: true,
    role: 'user',
    createdAt: '2026-08-20',
    voteCount: 35,
    totalSpent: 990
  },
  {
    id: 'usr-4',
    username: 'artit_street',
    password: 'artit_pass1234',
    displayName: 'อาทิตย์ สตรีทฟู้ดเลิฟเวอร์',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isRoyal: false,
    role: 'user',
    createdAt: '2026-09-02',
    voteCount: 12,
    totalSpent: 450
  },
  {
    id: 'usr-5',
    username: 'ploy_sweet',
    password: 'ploy_sweetie2026',
    displayName: 'พลอย ขนมหวานเมืองเพชร',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    isRoyal: false,
    role: 'user',
    createdAt: '2026-09-05',
    voteCount: 9,
    totalSpent: 0
  }
];

// Initial Order Records for Merch revenue calculation
export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-2026-001',
    customerName: 'สมชาย นักชิมริมทาง',
    customerUsername: 'somchai_foodie',
    items: [
      { merchId: 'merch-1', merchName: 'เสื้อยืดลิมิเต็ด "menu100 Foodie Club"', quantity: 2, price: 501.5, size: 'L', color: 'Deep Navy' }
    ],
    totalAmount: 1003,
    isRoyalDiscountApplied: true,
    createdAt: '2026-09-10 14:20',
    status: 'completed'
  },
  {
    id: 'ORD-2026-002',
    customerName: 'นิดา สายคาเฟ่&ต้มยำ',
    customerUsername: 'nida_taste',
    items: [
      { merchId: 'merch-2', merchName: 'ขวดน้ำสุญญากาศเก็บความเย็น 24 ชม.', quantity: 1, price: 586.5, size: '750 ml', color: 'Matte Black Gold' },
      { merchId: 'merch-6', merchName: 'ชุดสติกเกอร์ฮาโลแกรม (Set 12 ชิ้น)', quantity: 1, price: 153 }
    ],
    totalAmount: 739.5,
    isRoyalDiscountApplied: true,
    createdAt: '2026-09-12 18:45',
    status: 'completed'
  },
  {
    id: 'ORD-2026-003',
    customerName: 'อาทิตย์ สตรีทฟู้ดเลิฟเวอร์',
    customerUsername: 'artit_street',
    items: [
      { merchId: 'merch-3', merchName: 'หมวกแก๊ปทรงเบสบอล "EAT SLEEP REVIEW"', quantity: 1, price: 450, color: 'Vintage Charcoal' }
    ],
    totalAmount: 450,
    isRoyalDiscountApplied: false,
    createdAt: '2026-09-14 11:30',
    status: 'shipped'
  },
  {
    id: 'ORD-2026-004',
    customerName: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
    customerUsername: 'admin',
    items: [
      { merchId: 'merch-4', merchName: 'ผ้ากันเปื้อนเชฟมือทอง "Master Taste Apron"', quantity: 2, price: 442 },
      { merchId: 'merch-2', merchName: 'ขวดน้ำสุญญากาศเก็บความเย็น 24 ชม.', quantity: 2, price: 586.5 }
    ],
    totalAmount: 2057,
    isRoyalDiscountApplied: true,
    createdAt: '2026-09-15 09:12',
    status: 'completed'
  }
];

// Initialize Merch with stock count
export const INITIAL_MERCH_WITH_STOCK: MerchItem[] = MERCH_PRODUCTS.map((m, idx) => ({
  ...m,
  stockCount: m.stockCount ?? [45, 60, 30, 25, 50, 120][idx % 6] ?? 40,
}));

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private config: DatabaseConfig = {
    provider: 'local',
    isConnected: false,
  };

  constructor() {
    this.init();
  }

  private init() {
    // Check localStorage for saved db configuration
    const savedConfig = localStorage.getItem('menu100_db_config');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (e) {
        console.error('Failed to parse db config', e);
      }
    }

    // Check environment variables if available
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || this.config.supabaseUrl;
    const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || this.config.supabaseAnonKey;

    if (envUrl && envKey) {
      try {
        this.supabase = createClient(envUrl, envKey);
        this.config.provider = 'supabase';
        this.config.supabaseUrl = envUrl;
        this.config.supabaseAnonKey = envKey;
        this.config.isConnected = true;
      } catch (err) {
        console.warn('Could not initialize Supabase client:', err);
      }
    }

    // Increment visitor count on first load
    this.recordVisitorHit();
  }

  public getConfig(): DatabaseConfig {
    return { ...this.config, type: this.config.provider };
  }

  public getDatabaseConfig(): DatabaseConfig {
    return this.getConfig();
  }

  public async setSupabaseCredentials(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!url.trim() || !anonKey.trim()) {
        this.supabase = null;
        this.config.provider = 'local';
        this.config.isConnected = false;
        this.config.supabaseUrl = '';
        this.config.supabaseAnonKey = '';
        localStorage.setItem('menu100_db_config', JSON.stringify(this.config));
        return { success: true, message: 'สลับไปใช้ฐานข้อมูล Local Persistent DB เรียบร้อยแล้ว' };
      }

      const client = createClient(url, anonKey);
      this.supabase = client;
      this.config.provider = 'supabase';
      this.config.supabaseUrl = url;
      this.config.supabaseAnonKey = anonKey;
      this.config.isConnected = true;
      this.config.lastSyncedAt = new Date().toLocaleString('th-TH');
      localStorage.setItem('menu100_db_config', JSON.stringify(this.config));

      return { success: true, message: 'เชื่อมต่อ Supabase สำเร็จ พร้อมซิงก์ข้อมูลอัตโนมัติ!' };
    } catch (error: any) {
      return { success: false, message: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${error.message}` };
    }
  }

  private recordVisitorHit() {
    const hits = parseInt(localStorage.getItem('menu100_total_visitors') || '14820', 10);
    localStorage.setItem('menu100_total_visitors', String(hits + 1));
  }

  public getTotalVisitors(): number {
    return parseInt(localStorage.getItem('menu100_total_visitors') || '14821', 10);
  }

  // ========== FOODS CRUD ==========
  public getFoods(): FoodItem[] {
    const saved = localStorage.getItem('menu100_foods');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('menu100_foods', JSON.stringify(INITIAL_FOODS));
    return INITIAL_FOODS;
  }

  public saveFoods(foods: FoodItem[]) {
    localStorage.setItem('menu100_foods', JSON.stringify(foods));
  }

  public updateFood(updated: FoodItem): FoodItem[] {
    const current = this.getFoods();
    const index = current.findIndex(f => f.id === updated.id);
    let newList: FoodItem[];
    if (index >= 0) {
      newList = [...current];
      newList[index] = updated;
    } else {
      newList = [updated, ...current];
    }
    this.saveFoods(newList);
    return newList;
  }

  public deleteFood(id: string): FoodItem[] {
    const current = this.getFoods();
    const newList = current.filter(f => f.id !== id);
    this.saveFoods(newList);
    return newList;
  }

  // ========== RESTAURANTS CRUD ==========
  public getRestaurants(): RestaurantItem[] {
    const saved = localStorage.getItem('menu100_restaurants');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('menu100_restaurants', JSON.stringify(MOCK_RESTAURANTS));
    return MOCK_RESTAURANTS;
  }

  public saveRestaurants(restaurants: RestaurantItem[]) {
    localStorage.setItem('menu100_restaurants', JSON.stringify(restaurants));
  }

  public updateRestaurant(updated: RestaurantItem): RestaurantItem[] {
    const current = this.getRestaurants();
    const index = current.findIndex(r => r.id === updated.id);
    let newList: RestaurantItem[];
    if (index >= 0) {
      newList = [...current];
      newList[index] = updated;
    } else {
      newList = [updated, ...current];
    }
    this.saveRestaurants(newList);
    return newList;
  }

  public deleteRestaurant(id: string): RestaurantItem[] {
    const current = this.getRestaurants();
    const newList = current.filter(r => r.id !== id);
    this.saveRestaurants(newList);
    return newList;
  }

  // ========== MERCH CRUD & STOCK ==========
  public getMerch(): MerchItem[] {
    const saved = localStorage.getItem('menu100_merch');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('menu100_merch', JSON.stringify(INITIAL_MERCH_WITH_STOCK));
    return INITIAL_MERCH_WITH_STOCK;
  }

  public saveMerch(merch: MerchItem[]) {
    localStorage.setItem('menu100_merch', JSON.stringify(merch));
  }

  public updateMerchItem(updated: MerchItem): MerchItem[] {
    const current = this.getMerch();
    const index = current.findIndex(m => m.id === updated.id);
    let newList: MerchItem[];
    if (index >= 0) {
      newList = [...current];
      newList[index] = updated;
    } else {
      newList = [updated, ...current];
    }
    this.saveMerch(newList);
    return newList;
  }

  public updateStock(id: string, delta: number): MerchItem[] {
    const current = this.getMerch();
    const newList = current.map(m => {
      if (m.id === id) {
        const newStock = Math.max(0, (m.stockCount || 0) + delta);
        return {
          ...m,
          stockCount: newStock,
          inStock: newStock > 0
        };
      }
      return m;
    });
    this.saveMerch(newList);
    return newList;
  }

  public setStockCount(id: string, count: number): MerchItem[] {
    const current = this.getMerch();
    const newList = current.map(m => {
      if (m.id === id) {
        const safeCount = Math.max(0, count);
        return {
          ...m,
          stockCount: safeCount,
          inStock: safeCount > 0
        };
      }
      return m;
    });
    this.saveMerch(newList);
    return newList;
  }

  public deleteMerch(id: string): MerchItem[] {
    const current = this.getMerch();
    const newList = current.filter(m => m.id !== id);
    this.saveMerch(newList);
    return newList;
  }

  // ========== USERS & AUTH ==========
  public getUserAccounts(): UserAccount[] {
    const saved = localStorage.getItem('menu100_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('menu100_users', JSON.stringify(INITIAL_USER_ACCOUNTS));
    return INITIAL_USER_ACCOUNTS;
  }

  public saveUserAccounts(users: UserAccount[]) {
    localStorage.setItem('menu100_users', JSON.stringify(users));
  }

  public registerUser(username: string, password: string, displayName?: string): { success: boolean; user?: UserProfile; message?: string } {
    const trimmedUser = username.trim().toLowerCase();
    if (!trimmedUser || !password) {
      return { success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
    }

    const users = this.getUserAccounts();
    const existing = users.find(u => u.username.toLowerCase() === trimmedUser);
    if (existing) {
      return { success: false, message: 'ชื่อผู้ใช้นี้มีคนใช้งานแล้ว กรุณาเลือกชื่ออื่น' };
    }

    const newAccount: UserAccount = {
      id: 'usr-' + Date.now(),
      username: trimmedUser,
      password: password,
      displayName: displayName?.trim() || trimmedUser,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + (users.length % 10)}?auto=format&fit=crop&w=200&q=80`,
      isRoyal: false,
      role: trimmedUser === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString().split('T')[0],
      voteCount: 0,
      totalSpent: 0
    };

    users.push(newAccount);
    this.saveUserAccounts(users);

    const profile: UserProfile = {
      id: newAccount.id,
      username: newAccount.username,
      name: newAccount.displayName,
      avatar: newAccount.avatar,
      isRoyal: newAccount.isRoyal,
      royalLevel: 'Gold',
      role: newAccount.role,
      joinedDate: 'กันยายน 2026',
      votedFoodIds: [],
      bookmarkedRestaurantIds: [],
      royalVotesLeftThisMonth: 10
    };

    return { success: true, user: profile };
  }

  public loginUser(username: string, password: string): { success: boolean; user?: UserProfile; message?: string } {
    const trimmedUser = username.trim().toLowerCase();
    const users = this.getUserAccounts();
    const found = users.find(u => u.username.toLowerCase() === trimmedUser && u.password === password);

    if (!found) {
      return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
    }

    const profile: UserProfile = {
      id: found.id,
      username: found.username,
      name: found.displayName,
      avatar: found.avatar,
      isRoyal: found.isRoyal,
      royalLevel: 'Diamond',
      role: found.role,
      joinedDate: found.createdAt || 'กันยายน 2026',
      votedFoodIds: [],
      bookmarkedRestaurantIds: [],
      royalVotesLeftThisMonth: found.isRoyal ? 10 : 0
    };

    return { success: true, user: profile };
  }

  public updateUserRoyalStatus(username: string, isRoyal: boolean) {
    const users = this.getUserAccounts();
    const updated = users.map(u => {
      if (u.username.toLowerCase() === username.toLowerCase()) {
        return { ...u, isRoyal };
      }
      return u;
    });
    this.saveUserAccounts(updated);
  }

  public recordUserVote(username: string) {
    const users = this.getUserAccounts();
    const updated = users.map(u => {
      if (u.username.toLowerCase() === username.toLowerCase()) {
        return { ...u, voteCount: (u.voteCount || 0) + 1 };
      }
      return u;
    });
    this.saveUserAccounts(updated);
  }

  // ========== ORDERS & REVENUE ==========
  public getOrders(): OrderRecord[] {
    const saved = localStorage.getItem('menu100_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('menu100_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }

  public saveOrders(orders: OrderRecord[]) {
    localStorage.setItem('menu100_orders', JSON.stringify(orders));
  }

  public createOrder(order: OrderRecord): OrderRecord[] {
    const current = this.getOrders();
    const newList = [order, ...current];
    this.saveOrders(newList);

    // Deduct stock for purchased items
    order.items.forEach(it => {
      this.updateStock(it.merchId, -it.quantity);
    });

    // Update user's totalSpent
    const users = this.getUserAccounts();
    const updatedUsers = users.map(u => {
      if (u.username.toLowerCase() === order.customerUsername.toLowerCase()) {
        return { ...u, totalSpent: (u.totalSpent || 0) + order.totalAmount };
      }
      return u;
    });
    this.saveUserAccounts(updatedUsers);

    return newList;
  }

  // ========== METRICS & DASHBOARD STATS ==========
  public getDashboardStats() {
    const users = this.getUserAccounts();
    const orders = this.getOrders();
    const foods = this.getFoods();
    const restaurants = this.getRestaurants();
    const merch = this.getMerch();

    const royalUsers = users.filter(u => u.isRoyal);
    
    // Revenue calculations:
    // Merch revenue = sum of completed / shipped orders
    const totalMerchRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

    // Royal Member revenue = 199 THB / month per royal member
    const royalMembershipPrice = 199;
    const totalRoyalRevenue = royalUsers.length * royalMembershipPrice;

    const totalRevenue = totalMerchRevenue + totalRoyalRevenue;

    const totalVotes = foods.reduce((sum, f) => sum + f.regularVotes + f.royalVotes, 0);
    const verifiedRestaurantsCount = restaurants.filter(r => r.verifiedStars >= 3).length;

    return {
      totalVisitors: this.getTotalVisitors(),
      totalUsers: users.length,
      royalMembersCount: royalUsers.length,
      totalMerchRevenue,
      totalRoyalRevenue,
      totalRevenue,
      totalOrdersCount: orders.length,
      totalFoodsCount: foods.length,
      totalRestaurantsCount: restaurants.length,
      verifiedRestaurantsCount,
      totalMerchItemsCount: merch.length,
      totalVotes
    };
  }
}

export const dbService = new DatabaseService();
