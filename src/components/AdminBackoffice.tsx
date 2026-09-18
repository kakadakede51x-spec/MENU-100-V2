import React, { useState, useEffect } from 'react';
import { FoodItem, RestaurantItem, MerchItem, UserProfile, UserAccountRecord, OrderRecord } from '../types';
import { dbService } from '../services/dbService';
import { 
  LayoutDashboard, 
  Utensils, 
  Store, 
  ShoppingBag, 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Save, 
  X, 
  Check, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  Search, 
  RotateCcw,
  Users,
  Award,
  DollarSign,
  Image,
  Flame,
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  Database,
  RefreshCw,
  Package,
  Layers,
  Settings,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface AdminBackofficeProps {
  foods: FoodItem[];
  onUpdateFoods: (newFoods: FoodItem[]) => void;
  restaurants: RestaurantItem[];
  onUpdateRestaurants: (newRestaurants: RestaurantItem[]) => void;
  merchList: MerchItem[];
  onUpdateMerch: (newMerch: MerchItem[]) => void;
  onSwitchToClient: () => void;
  user: UserProfile;
  onOpenSettings?: () => void;
}

export const AdminBackoffice: React.FC<AdminBackofficeProps> = ({
  foods,
  onUpdateFoods,
  restaurants,
  onUpdateRestaurants,
  merchList,
  onUpdateMerch,
  onSwitchToClient,
  user,
  onOpenSettings,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'foods' | 'restaurants' | 'merch' | 'users' | 'database'>('dashboard');
  
  // Food States
  const [searchFoodQuery, setSearchFoodQuery] = useState('');
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodNameEn, setNewFoodNameEn] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState<any>('single_dish');
  const [newFoodOrigin, setNewFoodOrigin] = useState('ไทย');
  const [newFoodImage, setNewFoodImage] = useState('');
  const [newFoodDesc, setNewFoodDesc] = useState('');
  const [newFoodCalories, setNewFoodCalories] = useState(450);
  const [newFoodFlavor, setNewFoodFlavor] = useState('กลมกล่อม, หอมเครื่องเทศ');
  const [newFoodRegularVotes, setNewFoodRegularVotes] = useState(100);
  const [newFoodRoyalVotes, setNewFoodRoyalVotes] = useState(25);

  // Restaurant States
  const [searchRestQuery, setSearchRestQuery] = useState('');
  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantItem | null>(null);
  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestProvince, setNewRestProvince] = useState('กรุงเทพมหานคร');
  const [newRestRegion, setNewRestRegion] = useState<'central' | 'north' | 'northeast' | 'south' | 'east' | 'west'>('central');
  const [newRestCuisine, setNewRestCuisine] = useState('อาหารไทยต้นตำรับ');
  const [newRestImage, setNewRestImage] = useState('');
  const [newRestStars, setNewRestStars] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [newRestRating, setNewRestRating] = useState(4.8);
  const [newRestSignatureDish, setNewRestSignatureDish] = useState('');
  const [newRestDescription, setNewRestDescription] = useState('');
  const [newRestAddress, setNewRestAddress] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('02-123-4567');
  const [newRestIsSme, setNewRestIsSme] = useState(true);
  const [newRestLeague, setNewRestLeague] = useState<'provincial' | 'regional' | 'national'>('provincial');

  // Merch States
  const [editingMerch, setEditingMerch] = useState<MerchItem | null>(null);
  const [isAddingMerch, setIsAddingMerch] = useState(false);
  const [newMerchName, setNewMerchName] = useState('');
  const [newMerchNameEn, setNewMerchNameEn] = useState('');
  const [newMerchPrice, setNewMerchPrice] = useState(590);
  const [newMerchDiscount, setNewMerchDiscount] = useState(15);
  const [newMerchStock, setNewMerchStock] = useState(50);
  const [newMerchCategory, setNewMerchCategory] = useState<'clothing' | 'accessories' | 'food_gift' | 'kitchenware'>('clothing');
  const [newMerchImage, setNewMerchImage] = useState('');
  const [newMerchDesc, setNewMerchDesc] = useState('');

  // User Accounts & Orders (From DB)
  const [userAccounts, setUserAccounts] = useState<UserAccountRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [searchUserQuery, setSearchUserQuery] = useState('');

  // Notification Banner
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 3500);
  };

  // Load Database Records
  const loadDatabaseData = () => {
    const users = dbService.getUserAccounts();
    const ords = dbService.getOrders();
    setUserAccounts(users);
    setOrders(ords);
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Preset food images for quick selection
  const PRESET_FOOD_IMAGES = [
    { name: 'ต้มยำกุ้ง', url: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80' },
    { name: 'ผัดไทย', url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80' },
    { name: 'ราเมน', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
    { name: 'สเต๊กเนื้อ', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    { name: 'พิซซ่า', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
    { name: 'ของหวาน / บิงซู', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
  ];

  // ===================== FOOD HANDLERS =====================
  const handleAdjustVotes = (foodId: string, type: 'regular' | 'royal', amount: number) => {
    const updated = foods.map((f) => {
      if (f.id === foodId) {
        if (type === 'regular') {
          return { ...f, regularVotes: Math.max(0, f.regularVotes + amount) };
        } else {
          return { ...f, royalVotes: Math.max(0, f.royalVotes + amount) };
        }
      }
      return f;
    });

    updated.sort((a, b) => (b.regularVotes + b.royalVotes * 2) - (a.regularVotes + a.royalVotes * 2));
    const reRanked = updated.map((item, idx) => ({ ...item, rank: idx + 1 }));

    onUpdateFoods(reRanked);
    showNotice(`ปรับคะแนน ${type === 'royal' ? 'Royal Vote' : 'คะแนนปกติ'} เรียบร้อยแล้ว`);
  };

  const handleDeleteFood = (foodId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้ออกจากระบบ menu100?')) {
      const filtered = foods.filter((f) => f.id !== foodId);
      onUpdateFoods(filtered);
      showNotice('ลบเมนูอาหารออกจากฐานข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleSaveEditFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood) return;

    const updated = foods.map((f) => (f.id === editingFood.id ? editingFood : f));
    updated.sort((a, b) => (b.regularVotes + b.royalVotes * 2) - (a.regularVotes + a.royalVotes * 2));
    const reRanked = updated.map((item, idx) => ({ ...item, rank: idx + 1 }));

    onUpdateFoods(reRanked);
    setEditingFood(null);
    showNotice(`บันทึกการแก้ไขเมนู "${editingFood.name}" สำเร็จ!`);
  };

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;

    const newId = `food-${Date.now()}`;
    const newFood: FoodItem = {
      id: newId,
      name: newFoodName,
      nameEn: newFoodNameEn || newFoodName,
      category: newFoodCategory,
      origin: newFoodOrigin,
      countryCode: 'TH',
      image: newFoodImage || PRESET_FOOD_IMAGES[0].url,
      description: newFoodDesc || 'เมนูอาหารแนะนำประจำระบบ menu100 คัดสรรโดยแอดมิน',
      tags: ['เมนูใหม่', 'menu100'],
      regularVotes: Number(newFoodRegularVotes) || 0,
      royalVotes: Number(newFoodRoyalVotes) || 0,
      rank: foods.length + 1,
      calories: Number(newFoodCalories) || 400,
      flavorProfile: newFoodFlavor.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const newFoods = [newFood, ...foods];
    newFoods.sort((a, b) => (b.regularVotes + b.royalVotes * 2) - (a.regularVotes + a.royalVotes * 2));
    const reRanked = newFoods.map((item, idx) => ({ ...item, rank: idx + 1 }));

    onUpdateFoods(reRanked);
    setIsAddingFood(false);
    setNewFoodName('');
    setNewFoodNameEn('');
    setNewFoodImage('');
    setNewFoodDesc('');
    showNotice(`เพิ่มเมนู "${newFood.name}" เข้าสู่ระบบเรียบร้อยแล้ว!`);
  };

  // ===================== RESTAURANT HANDLERS =====================
  const handleUpdateRestaurantStars = (restId: string, stars: 1 | 2 | 3 | 4 | 5) => {
    const updated = restaurants.map((r) => (r.id === restId ? { ...r, verifiedStars: stars } : r));
    onUpdateRestaurants(updated);
    showNotice(`ปรับระดับ Verify เป็น ${stars} ดาว เรียบร้อยแล้ว`);
  };

  const handleUpdateRestaurantLeague = (restId: string, league: 'provincial' | 'regional' | 'national') => {
    const updated = restaurants.map((r) => (r.id === restId ? { ...r, leagueTier: league } : r));
    onUpdateRestaurants(updated);
    showNotice(`ปรับระดับลีกเป็น: ${league}`);
  };

  const handleToggleSme = (restId: string) => {
    const updated = restaurants.map((r) => (r.id === restId ? { ...r, isSme: !r.isSme } : r));
    onUpdateRestaurants(updated);
    showNotice('อัปเดตสถานะโครงการสนับสนุน SME แล้ว');
  };

  const handleDeleteRestaurant = (restId: string) => {
    if (confirm('คุณต้องการลบร้านอาหารนี้ออกจากระบบหรือไม่?')) {
      const updated = restaurants.filter((r) => r.id !== restId);
      onUpdateRestaurants(updated);
      showNotice('ลบร้านอาหารเรียบร้อยแล้ว');
    }
  };

  const handleSaveEditRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRestaurant) return;

    const updated = restaurants.map((r) => (r.id === editingRestaurant.id ? editingRestaurant : r));
    onUpdateRestaurants(updated);
    setEditingRestaurant(null);
    showNotice(`บันทึกการแก้ไขร้าน "${editingRestaurant.name}" สำเร็จ!`);
  };

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const newRest: RestaurantItem = {
      id: `rest-${Date.now()}`,
      name: newRestName,
      provinceName: newRestProvince,
      region: newRestRegion,
      cuisine: newRestCuisine,
      verifiedStars: newRestStars,
      rating: newRestRating,
      reviewsCount: 1,
      image: newRestImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      description: newRestDescription || 'ร้านอาหารคุณภาพผ่านเกณฑ์การตรวจสอบจาก menu100',
      signatureDishes: newRestSignatureDish ? [newRestSignatureDish] : ['เมนูแนะนำประจำร้าน'],
      isSme: newRestIsSme,
      isStreetFood: false,
      leagueTier: newRestLeague,
      address: newRestAddress || `อ.เมือง จ.${newRestProvince}`,
      phoneNumber: newRestPhone,
      priceRange: '฿฿',
      votesCount: 50,
    };

    onUpdateRestaurants([newRest, ...restaurants]);
    setIsAddingRestaurant(false);
    setNewRestName('');
    setNewRestImage('');
    setNewRestSignatureDish('');
    setNewRestDescription('');
    showNotice(`เพิ่มร้านค้า "${newRest.name}" สำเร็จ!`);
  };

  // ===================== MERCH & STOCK HANDLERS =====================
  const handleAdjustMerchStock = (merchId: string, amount: number) => {
    const updated = merchList.map((item) => {
      if (item.id === merchId) {
        const currentStock = item.stockCount ?? 50;
        const newStock = Math.max(0, currentStock + amount);
        return { ...item, stockCount: newStock };
      }
      return item;
    });
    onUpdateMerch(updated);
    showNotice(`อัปเดตจำนวนสต็อกสินค้าเรียบร้อยแล้ว`);
  };

  const handleSetExactStock = (merchId: string, stock: number) => {
    const updated = merchList.map((item) => {
      if (item.id === merchId) {
        return { ...item, stockCount: Math.max(0, stock) };
      }
      return item;
    });
    onUpdateMerch(updated);
    showNotice(`ปรับสต็อกสินค้าเป็น ${stock} ชิ้นแล้ว`);
  };

  const handleDeleteMerch = (merchId: string) => {
    if (confirm('คุณต้องการลบสินค้า Merch นี้หรือไม่?')) {
      const updated = merchList.filter((m) => m.id !== merchId);
      onUpdateMerch(updated);
      showNotice('ลบสินค้าออกจากระบบแล้ว');
    }
  };

  const handleSaveEditMerch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerch) return;

    const updated = merchList.map((m) => (m.id === editingMerch.id ? editingMerch : m));
    onUpdateMerch(updated);
    setEditingMerch(null);
    showNotice(`บันทึกสินค้า "${editingMerch.name}" สำเร็จ!`);
  };

  const handleCreateMerch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchName.trim()) return;

    const newItem: MerchItem = {
      id: `merch-${Date.now()}`,
      name: newMerchName,
      nameEn: newMerchNameEn || newMerchName,
      price: Number(newMerchPrice) || 390,
      royalDiscountPercent: Number(newMerchDiscount) || 15,
      stockCount: Number(newMerchStock) || 50,
      inStock: (Number(newMerchStock) || 50) > 0,
      category: newMerchCategory,
      image: newMerchImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      description: newMerchDesc || 'สินค้า Official ลิขสิทธิ์แท้จากโครงการ menu100',
      isLimited: false,
    };

    onUpdateMerch([...merchList, newItem]);
    setIsAddingMerch(false);
    setNewMerchName('');
    setNewMerchNameEn('');
    setNewMerchImage('');
    setNewMerchDesc('');
    showNotice(`เพิ่มสินค้า "${newItem.name}" พร้อมสต็อก ${newItem.stockCount} ชิ้น สำเร็จ!`);
  };

  // ===================== USER MANAGEMENT HANDLERS =====================
  const handleToggleUserRoyal = (userId: string) => {
    const updated = userAccounts.map((u) => {
      if (u.id === userId) {
        return { ...u, isRoyal: !u.isRoyal };
      }
      return u;
    });
    setUserAccounts(updated);
    dbService.saveUserAccounts(updated);
    showNotice('ปรับสถานะ Royal Member สำเร็จ!');
  };

  const handleToggleUserRole = (userId: string) => {
    const updated = userAccounts.map((u) => {
      if (u.id === userId) {
        return { ...u, role: (u.role === 'admin' ? 'user' : 'admin') as 'user' | 'admin' };
      }
      return u;
    });
    setUserAccounts(updated);
    dbService.saveUserAccounts(updated);
    showNotice('ปรับเปลี่ยนสิทธิ์ Role สำเร็จ!');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('คุณต้องการลบผู้ใช้นี้ออกจากระบบ Database หรือไม่?')) {
      const updated = userAccounts.filter((u) => u.id !== userId);
      setUserAccounts(updated);
      dbService.saveUserAccounts(updated);
      showNotice('ลบผู้ใช้สำเร็จ');
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Calculations for Dashboard
  const totalRegularVotes = foods.reduce((sum, f) => sum + f.regularVotes, 0);
  const totalRoyalVotes = foods.reduce((sum, f) => sum + f.royalVotes, 0);
  const royalMembersCount = userAccounts.filter((u) => u.isRoyal).length;
  const royalRevenue = royalMembersCount * 199; // 199 THB / month
  const merchRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalRevenue = royalRevenue + merchRevenue;

  // Filtered Foods
  const filteredFoods = foods.filter((f) => {
    if (!searchFoodQuery.trim()) return true;
    const q = searchFoodQuery.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.nameEn.toLowerCase().includes(q) || f.origin.toLowerCase().includes(q);
  });

  // Filtered Restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    if (!searchRestQuery.trim()) return true;
    const q = searchRestQuery.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.provinceName.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q);
  });

  // Filtered Users
  const filteredUsers = userAccounts.filter((u) => {
    if (!searchUserQuery.trim()) return true;
    const q = searchUserQuery.toLowerCase();
    return u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
  });

  const dbConfig = dbService.getConfig();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Backoffice Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-orange-500/20">
              m100
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  menu100 BACKOFFICE
                </h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  ADMIN CONTROL CENTER
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${dbConfig.type === 'supabase' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {dbConfig.type === 'supabase' ? '🟢 Supabase DB' : '💾 Local Engine DB'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ระบบจัดการหลังบ้าน • ดึงข้อมูลจาก Database • จัดการเมนู • ตรวจสอบร้านค้า • คุมสต็อกสินค้า • Dashboard ผู้ใช้ & รายได้
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden md:block">
              <span className="text-[10px] text-slate-400 block">ผู้ดูแลระบบ</span>
              <span className="text-xs font-bold text-amber-300">{user.name} ({user.role})</span>
            </div>

            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700 shadow-xs"
                title="ตั้งค่าระบบธีมและเชื่อมต่อ Supabase"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>ตั้งค่า DB / ธีม</span>
              </button>
            )}

            <button
              id="admin-switch-to-public-site-btn"
              onClick={onSwitchToClient}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-transform hover:scale-102"
            >
              <ExternalLink className="w-4 h-4" />
              <span>🌐 ดูหน้าเว็บหลัก</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notice Banner */}
      {adminNotice && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 text-center shadow-lg animate-in fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          <button
            id="admin-tab-dashboard"
            onClick={() => setActiveAdminTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
              activeAdminTab === 'dashboard'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>📊 Dashboard & รายได้</span>
          </button>

          <button
            id="admin-tab-foods"
            onClick={() => setActiveAdminTab('foods')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
              activeAdminTab === 'foods'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>1. จัดการเมนูอาหาร ({foods.length})</span>
          </button>

          <button
            id="admin-tab-restaurants"
            onClick={() => setActiveAdminTab('restaurants')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
              activeAdminTab === 'restaurants'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>2. จัดการ & ตรวจสอบร้านค้า ({restaurants.length})</span>
          </button>

          <button
            id="admin-tab-merch"
            onClick={() => setActiveAdminTab('merch')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
              activeAdminTab === 'merch'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>3. จัดการสินค้า & สต็อก ({merchList.length})</span>
          </button>

          <button
            id="admin-tab-users"
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
              activeAdminTab === 'users'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. ข้อมูลผู้ใช้ & รหัสผ่าน ({userAccounts.length})</span>
          </button>

          <button
            id="admin-tab-database"
            onClick={() => setActiveAdminTab('database')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
              activeAdminTab === 'database'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>5. ฐานข้อมูล & รีเซ็ตซีซัน</span>
          </button>
        </div>

        {/* ================= TAB: DASHBOARD & REVENUE ================= */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 4 Financial & User Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 shadow-md space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Users className="w-4 h-4 text-blue-400" />
                    ผู้เข้าใช้ในระบบ (Registered Users)
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Live
                  </span>
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {userAccounts.length.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-400">คน</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  มีบัญชีบันทึกอยู่ใน Database (พร้อมระบบรหัสผ่าน)
                </p>
              </div>

              <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 shadow-md space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                    สมาชิก Royal Member
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    VIP
                  </span>
                </div>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {royalMembersCount} <span className="text-sm font-sans font-normal text-slate-400">คน</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  สัดส่วน {userAccounts.length ? ((royalMembersCount / userAccounts.length) * 100).toFixed(1) : 0}% ของผู้ใช้ทั้งหมด
                </p>
              </div>

              <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 shadow-md space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    รายได้จากขายสินค้า Merch
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Orders
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  ฿{merchRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-slate-400">
                  จากการสั่งซื้อ Merch {orders.length} ออเดอร์
                </p>
              </div>

              <div className="bg-slate-800/90 p-5 rounded-3xl border border-amber-500/40 shadow-md space-y-2 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <DollarSign className="w-24 h-24 text-amber-400" />
                </div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-amber-300">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    รายได้รวมทั้งหมด (Gross Revenue)
                  </span>
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  ฿{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-amber-300/80">
                  (Merch ฿{merchRevenue.toLocaleString()} + Royal ฿{royalRevenue.toLocaleString()})
                </p>
              </div>
            </div>

            {/* Orders Breakdown & Leaderboard Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order History */}
              <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>ประวัติรายการสั่งซื้อ Merch ล่าสุด ({orders.length})</span>
                  </h3>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-slate-900 rounded-2xl border border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{ord.id}</span>
                          <span className="text-slate-300 font-medium">โดย @{ord.username}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {ord.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                        </p>
                        <span className="text-[10px] text-slate-500">{ord.createdAt}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-black text-white text-sm">฿{ord.totalAmount.toLocaleString()}</div>
                        <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-md font-bold mt-1">
                          {ord.status === 'completed' ? '✓ สำเร็จ' : ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Top 5 Food Votes */}
              <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>ผู้นำผลโหวต Top 5 ปัจจุบัน</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    รวม {totalRegularVotes.toLocaleString()} โหวต
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {foods.slice(0, 5).map((food, idx) => {
                    const score = food.regularVotes + food.royalVotes * 2;
                    return (
                      <div
                        key={food.id}
                        className="p-3 bg-slate-900 rounded-2xl flex items-center justify-between gap-3 border border-slate-700/60"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            idx === 0 ? 'bg-amber-400 text-slate-950' :
                            idx === 1 ? 'bg-slate-300 text-slate-950' :
                            idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <img src={food.image} alt={food.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-white text-xs block">{food.name}</span>
                            <span className="text-[10px] text-slate-400">{food.origin}</span>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <div className="font-mono font-black text-orange-400">{score.toLocaleString()} pt</div>
                          <span className="text-[10px] text-slate-500">👑 {food.royalVotes} x2</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 1: จัดการเมนูอาหาร ================= */}
        {activeAdminTab === 'foods' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-food-search"
                  type="text"
                  placeholder="ค้นหาเมนู, สัญชาติ, หรือชื่อ..."
                  value={searchFoodQuery}
                  onChange={(e) => setSearchFoodQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                id="admin-add-food-btn"
                onClick={() => setIsAddingFood(true)}
                className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มเมนูใหม่เข้าสู่ระบบ</span>
              </button>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="bg-slate-800/60 p-4 rounded-3xl border border-slate-700 flex flex-col justify-between space-y-3 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-white text-sm truncate">{food.name}</h4>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                          #{food.rank}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{food.nameEn}</p>
                      <span className="text-[10px] text-orange-400 font-medium">สัญชาติ: {food.origin}</span>
                    </div>
                  </div>

                  {/* Vote adjuster buttons */}
                  <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">โหวตปกติ: {food.regularVotes}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustVotes(food.id, 'regular', -10)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold"
                          title="-10 คะแนน"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleAdjustVotes(food.id, 'regular', 10)}
                          className="px-2 py-0.5 bg-orange-600 hover:bg-orange-700 rounded text-white font-bold"
                          title="+10 คะแนน"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-1.5">
                      <span className="text-amber-400 text-[11px] font-bold">👑 Royal: {food.royalVotes}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustVotes(food.id, 'royal', -5)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-400 font-bold"
                          title="-5 คะแนน"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjustVotes(food.id, 'royal', 5)}
                          className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 rounded text-slate-950 font-black"
                          title="+5 คะแนน"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingFood(food)}
                      className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: จัดการร้านอาหาร & VERIFY ================= */}
        {activeAdminTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อร้านอาหาร, จังหวัด, ประเภทอาหาร..."
                  value={searchRestQuery}
                  onChange={(e) => setSearchRestQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                id="admin-add-restaurant-btn"
                onClick={() => setIsAddingRestaurant(true)}
                className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มร้านอาหารใหม่เข้าระบบ</span>
              </button>
            </div>

            {/* Restaurant List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-base">{rest.name}</h4>
                        <span className="text-[10px] bg-slate-700 text-amber-300 font-bold px-2 py-0.5 rounded-md">
                          จ.{rest.provinceName}
                        </span>
                      </div>
                      <p className="text-xs text-orange-400 font-medium">{rest.cuisine}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{rest.description}</p>
                    </div>
                  </div>

                  {/* Controls: Stars, League, SME */}
                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80 space-y-2.5 text-xs">
                    {/* Stars Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">ตราดาว Verify:</span>
                      <div className="flex items-center gap-1">
                        {([1, 2, 3, 4, 5] as const).map((num) => (
                          <button
                            key={num}
                            onClick={() => handleUpdateRestaurantStars(rest.id, num)}
                            className={`p-1 rounded-md transition-colors ${
                              rest.verifiedStars >= num ? 'text-amber-400' : 'text-slate-600 hover:text-slate-500'
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        ))}
                        <span className="text-amber-400 font-bold ml-1">({rest.verifiedStars} ดาว)</span>
                      </div>
                    </div>

                    {/* League Tier */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">ลีกการแข่งขัน:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateRestaurantLeague(rest.id, 'provincial')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rest.leagueTier === 'provincial' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          ลีกจังหวัด
                        </button>
                        <button
                          onClick={() => handleUpdateRestaurantLeague(rest.id, 'regional')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rest.leagueTier === 'regional' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          ลีกภูมิภาค
                        </button>
                        <button
                          onClick={() => handleUpdateRestaurantLeague(rest.id, 'national')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rest.leagueTier === 'national' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          ลีกประเทศ 🏆
                        </button>
                      </div>
                    </div>

                    {/* SME Status */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400 text-[11px]">สถานะร้าน SME ชุมชน:</span>
                      <button
                        onClick={() => handleToggleSme(rest.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          rest.isSme
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rest.isSme ? '✓ ผ่านเกณฑ์ SME' : 'ร้านทั่วไป'}
                      </button>
                    </div>
                  </div>

                  {/* Edit and Delete buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                    <button
                      onClick={() => setEditingRestaurant(rest)}
                      className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>แก้ไขข้อมูลร้าน</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRestaurant(rest.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบร้าน</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: จัดการสินค้า MERCH & สต็อก ================= */}
        {activeAdminTab === 'merch' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>จัดการสินค้า Official Merch & ระบบสต็อก ({merchList.length} รายการ)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  ปรับเพิ่ม-ลดสต็อกสินค้า, แก้ไขราคา, ส่วนลด Royal Member และสถานะการวางจำหน่าย
                </p>
              </div>

              <button
                id="admin-add-merch-btn"
                onClick={() => setIsAddingMerch(true)}
                className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มสินค้า Merch ใหม่</span>
              </button>
            </div>

            {/* Merch Cards with Stock Management */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchList.map((item) => {
                const stock = item.stockCount ?? 50;
                const isOutOfStock = stock <= 0;
                const isLowStock = stock > 0 && stock <= 10;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/60 rounded-3xl overflow-hidden border border-slate-700 flex flex-col justify-between"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        ลด Royal {item.royalDiscountPercent}%
                      </span>
                      {isOutOfStock ? (
                        <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          สินค้าหมด (Out of Stock)
                        </span>
                      ) : isLowStock ? (
                        <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          สต็อกเหลือน้อย ({stock} ชิ้น)
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          มีสินค้า ({stock} ชิ้น)
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-400">{item.nameEn}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">ราคาขาย:</span>
                        <span className="font-mono font-black text-amber-400 text-base">฿{item.price}</span>
                      </div>

                      {/* Stock Adjustment Controls */}
                      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-bold flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-orange-400" />
                            สต็อกคงเหลือ:
                          </span>
                          <span className={`font-mono font-black text-sm ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {stock} ชิ้น
                          </span>
                        </div>

                        {/* Stepper Buttons: -10, -1, +1, +10 */}
                        <div className="flex items-center justify-between gap-1">
                          <button
                            onClick={() => handleAdjustMerchStock(item.id, -10)}
                            disabled={stock <= 0}
                            className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-[11px] font-bold text-slate-300"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleAdjustMerchStock(item.id, -1)}
                            disabled={stock <= 0}
                            className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-[11px] font-bold text-slate-300"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleAdjustMerchStock(item.id, 1)}
                            className="flex-1 py-1 bg-orange-600/80 hover:bg-orange-600 rounded text-[11px] font-bold text-white"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleAdjustMerchStock(item.id, 10)}
                            className="flex-1 py-1 bg-orange-600 hover:bg-orange-700 rounded text-[11px] font-bold text-white"
                          >
                            +10
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => setEditingMerch(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>แก้ไขสินค้า</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMerch(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: ผู้เข้าใช้ & รหัสผ่าน ================= */}
        {activeAdminTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>ฐานข้อมูลบัญชีผู้ใช้งาน (User Accounts Database - {userAccounts.length} บัญชี)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  เก็บบัญชีผู้เข้าใช้, ชื่อ user, รหัสผ่าน, สิทธิ์การใช้งาน, ยอดใช้จ่าย และสถานะ Royal Member
                </p>
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้ใช้, username..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/60 rounded-3xl border border-slate-700 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3.5">ผู้ใช้งาน</th>
                      <th className="p-3.5">รหัสผ่าน (Password)</th>
                      <th className="p-3.5">สถานะสมาชิก</th>
                      <th className="p-3.5">สิทธิ์ (Role)</th>
                      <th className="p-3.5">วันที่สมัคร</th>
                      <th className="p-3.5">ยอดใช้จ่าย</th>
                      <th className="p-3.5 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredUsers.map((acc) => {
                      const isPwdShown = showPasswords[acc.id];
                      return (
                        <tr key={acc.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-medium text-white">
                            <div className="flex items-center gap-2.5">
                              <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                              <div>
                                <div className="font-bold flex items-center gap-1">
                                  <span>{acc.name}</span>
                                  {acc.isRoyal && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                                </div>
                                <span className="text-[11px] text-slate-400 font-mono">@{acc.username}</span>
                              </div>
                            </div>
                          </td>

                          {/* Password with view/hide toggle */}
                          <td className="p-3.5">
                            <div className="inline-flex items-center gap-2 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-xs">
                              <span>{isPwdShown ? acc.password : '••••••••'}</span>
                              <button
                                onClick={() => togglePasswordVisibility(acc.id)}
                                className="text-slate-400 hover:text-white"
                                title={isPwdShown ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                              >
                                {isPwdShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          {/* Member Status */}
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleUserRoyal(acc.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                                acc.isRoyal
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                              }`}
                              title="คลิกเพื่อสลับสถานะ Royal Member"
                            >
                              {acc.isRoyal ? '👑 ROYAL MEMBER' : 'สมาชิกทั่วไป'}
                            </button>
                          </td>

                          {/* Role */}
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleUserRole(acc.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                                acc.role === 'admin'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {acc.role.toUpperCase()}
                            </button>
                          </td>

                          {/* Registered date */}
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {acc.createdAt}
                          </td>

                          {/* Spent */}
                          <td className="p-3.5 font-mono font-bold text-emerald-400">
                            ฿{(acc.spentAmount || 0).toLocaleString()}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteUser(acc.id)}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
                              title="ลบบัญชีนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: DATABASE & SEASON RESET ================= */}
        {activeAdminTab === 'database' && (
          <div className="space-y-6 max-w-3xl">
            {/* Database Engine Status Card */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>สถานะการเชื่อมต่อ Database / Supabase</span>
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  dbConfig.type === 'supabase'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}>
                  {dbConfig.type === 'supabase' ? '🟢 Supabase PostgreSQL Connected' : '💾 Local Persistent Engine Active'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                ระบบ menu100 รองรับทั้งระบบ Local Database (จัดเก็บถาวรใน Browser) และรองรับการต่อตรงเข้า PostgreSQL / Supabase ผ่าน REST API และ SQL Schema พร้อมใช้
              </p>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>โหมด Database ปัจจุบัน:</span>
                  <span className="font-mono font-bold text-amber-400">{((dbConfig.type || dbConfig.provider) || 'local').toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Supabase Project URL:</span>
                  <span className="font-mono text-slate-400">{dbConfig.supabaseUrl || 'ยังไม่ได้ระบุ (ใช้ Local Engine)'}</span>
                </div>
              </div>

              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Settings className="w-4 h-4" />
                  <span>เปิดหน้าต่างตั้งค่า Supabase URL & Key</span>
                </button>
              )}
            </div>

            {/* Season Reset Card */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-orange-400" />
                <span>การบริหารรอบการโหวต & ซีซัน (ทุก 2 เดือน)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ตามเกณฑ์ของ menu100 อันดับอาหาร Top 20 โลก จะมีการแข่งขันในแต่ละรอบเป็นเวลา 2 เดือน เมื่อสิ้นสุดรอบ แอดมินสามารถกดรีเซ็ตเพื่อเริ่มเปิดรับคะแนนใหม่ในซีซันถัดไปได้ทันที
              </p>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>ซีซันปัจจุบัน:</span>
                  <span className="font-bold text-amber-400">Season 5 (มีนาคม - เมษายน 2026)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>สถานะการคำนวณคะแนน:</span>
                  <span className="font-bold text-emerald-400">ปกติ (เปิดรับคะแนนโหวต)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>รอบรีเซ็ตถัดไป:</span>
                  <span className="font-bold text-white">อีก 24 วัน</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="admin-reset-season-btn"
                  onClick={() => {
                    if (confirm('คุณต้องการรีเซ็ตคะแนนโหวตรอบ 2 เดือนเพื่อเริ่มซีซันใหม่หรือไม่?')) {
                      const reset = foods.map((f) => ({ ...f, regularVotes: 0, royalVotes: 0 }));
                      onUpdateFoods(reset);
                      showNotice('⚡ รีเซ็ตคะแนนโหวตซีซันใหม่เรียบร้อยแล้ว');
                    }
                  }}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-600/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>รีเซ็ตคะแนนโหวตรอบ 2 เดือน (Reset Season Votes)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* Edit Food Modal */}
      {editingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-orange-400" />
                <span>แก้ไขเมนู: {editingFood.name}</span>
              </h3>
              <button onClick={() => setEditingFood(null)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFood} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">รูปภาพเมนูอาหาร (Image URL)</label>
                <div className="flex items-center gap-3">
                  <img src={editingFood.image} alt="Preview" className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0" />
                  <input
                    type="url"
                    value={editingFood.image}
                    onChange={(e) => setEditingFood({ ...editingFood, image: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อเมนู (ไทย) *</label>
                  <input
                    type="text"
                    required
                    value={editingFood.name}
                    onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อเมนู (English)</label>
                  <input
                    type="text"
                    value={editingFood.nameEn}
                    onChange={(e) => setEditingFood({ ...editingFood, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">สัญชาติ / แหล่งกำเนิด</label>
                  <input
                    type="text"
                    value={editingFood.origin}
                    onChange={(e) => setEditingFood({ ...editingFood, origin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">แคลอรี (kcal)</label>
                  <input
                    type="number"
                    value={editingFood.calories || 400}
                    onChange={(e) => setEditingFood({ ...editingFood, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายรสชาติ</label>
                <textarea
                  rows={3}
                  value={editingFood.description}
                  onChange={(e) => setEditingFood({ ...editingFood, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingFood(null)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-bold">
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md">
                  <Save className="w-4 h-4" />
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      {isAddingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <span>เพิ่มเมนูอาหารใหม่เข้าสู่ระบบ</span>
              </h3>
              <button onClick={() => setIsAddingFood(false)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFood} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อเมนู (ไทย) *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ข้าวซอยไก่แม่สาย"
                    value={newFoodName}
                    onChange={(e) => setNewFoodName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อเมนู (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Khao Soi"
                    value={newFoodNameEn}
                    onChange={(e) => setNewFoodNameEn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">หมวดหมู่</label>
                  <select
                    value={newFoodCategory}
                    onChange={(e) => setNewFoodCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="single_dish">จานเดียว & ข้าว/เส้น</option>
                    <option value="soup_curry">ต้ม & แกง</option>
                    <option value="stirfry_fry">ผัด & ทอด</option>
                    <option value="street_food">สตรีทฟู้ด</option>
                    <option value="dessert_cafe">ของหวาน & คาเฟ่</option>
                    <option value="international">อาหารนานาชาติ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ประเทศต้นกำเนิด</label>
                  <input
                    type="text"
                    value={newFoodOrigin}
                    onChange={(e) => setNewFoodOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูปภาพ</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newFoodImage}
                  onChange={(e) => setNewFoodImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">คะแนนโหวตคนทั่วไป</label>
                  <input
                    type="number"
                    value={newFoodRegularVotes}
                    onChange={(e) => setNewFoodRegularVotes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">คะแนน Royal Vote</label>
                  <input
                    type="number"
                    value={newFoodRoyalVotes}
                    onChange={(e) => setNewFoodRoyalVotes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายเมนู</label>
                <textarea
                  rows={2}
                  value={newFoodDesc}
                  onChange={(e) => setNewFoodDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddingFood(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-bold">
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md">
                  <Check className="w-4 h-4" />
                  <span>เพิ่มเมนูทันที</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {editingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-orange-400" />
                <span>แก้ไขข้อมูลร้านค้า: {editingRestaurant.name}</span>
              </h3>
              <button onClick={() => setEditingRestaurant(null)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRestaurant} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อร้านค้า *</label>
                  <input
                    type="text"
                    required
                    value={editingRestaurant.name}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">จังหวัด</label>
                  <input
                    type="text"
                    value={editingRestaurant.provinceName}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, provinceName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ประเภทอาหาร</label>
                  <input
                    type="text"
                    value={editingRestaurant.cuisine}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, cuisine: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ดาว Verify (1-5)</label>
                  <select
                    value={editingRestaurant.verifiedStars}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, verifiedStars: Number(e.target.value) as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={1}>⭐ 1 ดาว</option>
                    <option value={2}>⭐⭐ 2 ดาว</option>
                    <option value={3}>⭐⭐⭐ 3 ดาว</option>
                    <option value={4}>⭐⭐⭐⭐ 4 ดาว</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5 ดาว</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูปภาพร้าน</label>
                <input
                  type="url"
                  value={editingRestaurant.image}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายร้าน</label>
                <textarea
                  rows={2}
                  value={editingRestaurant.description}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingRestaurant(null)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-bold">
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md">
                  <Save className="w-4 h-4" />
                  <span>บันทึกการแก้ไขร้าน</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isAddingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <span>เพิ่มร้านอาหารใหม่เข้าสู่ระบบ</span>
              </h3>
              <button onClick={() => setIsAddingRestaurant(false)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อร้านอาหาร *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ครัวคุณย่า ปากช่อง"
                    value={newRestName}
                    onChange={(e) => setNewRestName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">จังหวัด *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น นครราชสีมา"
                    value={newRestProvince}
                    onChange={(e) => setNewRestProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ประเภทอาหาร</label>
                  <input
                    type="text"
                    placeholder="เช่น อาหารอีสานพื้นบ้าน"
                    value={newRestCuisine}
                    onChange={(e) => setNewRestCuisine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">จำนวนดาว Verify</label>
                  <select
                    value={newRestStars}
                    onChange={(e) => setNewRestStars(Number(e.target.value) as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={1}>⭐ 1 ดาว</option>
                    <option value={2}>⭐⭐ 2 ดาว</option>
                    <option value={3}>⭐⭐⭐ 3 ดาว</option>
                    <option value={4}>⭐⭐⭐⭐ 4 ดาว</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5 ดาว</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูปภาพร้าน</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newRestImage}
                  onChange={(e) => setNewRestImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">เมนูเด่นประจำร้าน</label>
                <input
                  type="text"
                  placeholder="เช่น ไก่ย่างเขาสวนกวาง, ส้มตำปูปลาร้า"
                  value={newRestSignatureDish}
                  onChange={(e) => setNewRestSignatureDish(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddingRestaurant(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-bold">
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md">
                  <Check className="w-4 h-4" />
                  <span>เพิ่มร้านค้าทันที</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Merch Modal */}
      {editingMerch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-orange-400" />
                <span>แก้ไขสินค้า Merch: {editingMerch.name}</span>
              </h3>
              <button onClick={() => setEditingMerch(null)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMerch} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อสินค้า (ไทย) *</label>
                  <input
                    type="text"
                    required
                    value={editingMerch.name}
                    onChange={(e) => setEditingMerch({ ...editingMerch, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อสินค้า (English)</label>
                  <input
                    type="text"
                    value={editingMerch.nameEn}
                    onChange={(e) => setEditingMerch({ ...editingMerch, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ราคาขาย (฿)</label>
                  <input
                    type="number"
                    value={editingMerch.price}
                    onChange={(e) => setEditingMerch({ ...editingMerch, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ลด Royal (%)</label>
                  <input
                    type="number"
                    value={editingMerch.royalDiscountPercent}
                    onChange={(e) => setEditingMerch({ ...editingMerch, royalDiscountPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">สต็อกคงเหลือ</label>
                  <input
                    type="number"
                    value={editingMerch.stockCount ?? 50}
                    onChange={(e) => setEditingMerch({ ...editingMerch, stockCount: Math.max(0, Number(e.target.value)) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูปภาพ</label>
                <input
                  type="url"
                  value={editingMerch.image}
                  onChange={(e) => setEditingMerch({ ...editingMerch, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">คำอธิบายสินค้า</label>
                <textarea
                  rows={2}
                  value={editingMerch.description}
                  onChange={(e) => setEditingMerch({ ...editingMerch, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingMerch(null)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-bold">
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md">
                  <Save className="w-4 h-4" />
                  <span>บันทึกสินค้า</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Merch Modal */}
      {isAddingMerch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <span>เพิ่มสินค้า Official Merch ใหม่</span>
              </h3>
              <button onClick={() => setIsAddingMerch(false)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMerch} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อสินค้า (ไทย) *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น หมวกแก๊ป menu100 Foodie"
                    value={newMerchName}
                    onChange={(e) => setNewMerchName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อสินค้า (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. menu100 Cap"
                    value={newMerchNameEn}
                    onChange={(e) => setNewMerchNameEn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ราคาขาย (฿)</label>
                  <input
                    type="number"
                    value={newMerchPrice}
                    onChange={(e) => setNewMerchPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ลด Royal (%)</label>
                  <input
                    type="number"
                    value={newMerchDiscount}
                    onChange={(e) => setNewMerchDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">สต็อกแรกเข้า</label>
                  <input
                    type="number"
                    value={newMerchStock}
                    onChange={(e) => setNewMerchStock(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL รูปภาพสินค้า</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newMerchImage}
                  onChange={(e) => setNewMerchImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddingMerch(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-bold">
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md">
                  <Check className="w-4 h-4" />
                  <span>เพิ่มสินค้าพร้อมสต็อก</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
