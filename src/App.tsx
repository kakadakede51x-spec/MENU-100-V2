import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  FoodItem, 
  RestaurantItem, 
  MerchItem, 
  CartItem, 
  UserProfile, 
  ViewMode, 
  ThemeMode,
  DatabaseConfig,
  AuthGateReason
} from './types';
import { dbService } from './services/dbService';
import { Header } from './components/Header';
import { TabRanking } from './components/TabRanking';
import { TabRestaurants } from './components/TabRestaurants';
import { TabMerch } from './components/TabMerch';
import { TabForum } from './components/TabForum';
import { TabMembership } from './components/TabMembership';
import { FoodRouletteModal } from './components/FoodRouletteModal';
import { VerifyRequestModal } from './components/VerifyRequestModal';
import { CartDrawer } from './components/CartDrawer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { AuthGateModal } from './components/AuthGateModal';
import { WebSettingsModal } from './components/WebSettingsModal';
import { AdminBackoffice } from './components/AdminBackoffice';
import { 
  Sparkles, 
  Sliders
} from 'lucide-react';

const GUEST_USER: UserProfile = {
  id: 'guest-visitor',
  username: '',
  name: 'ผู้เยี่ยมชมทั่วไป (Guest)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isRoyal: false,
  royalLevel: 'Gold',
  role: 'user',
  joinedDate: 'ผู้เยี่ยมชม',
  votedFoodIds: [],
  bookmarkedRestaurantIds: [],
  royalVotesLeftThisMonth: 0,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('ranking');
  const [viewMode, setViewMode] = useState<ViewMode>('client');

  // Theme Management (Default dark mode per user request: "อยากได้เป็นมืด ดำๆเน้นสีดำเข้มๆ ดูสุขุม เเละสีขาว สว่างสดใส")
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('menu100_theme');
    return (saved as ThemeMode) || 'dark';
  });

  // Apply dark theme class to root HTML
  useEffect(() => {
    localStorage.setItem('menu100_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Database Configuration
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => dbService.getDatabaseConfig());

  // Authentication State: Default to Guest mode (non-blocking) on first entry
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('menu100_auth_session') === 'true';
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const isAuthed = localStorage.getItem('menu100_auth_session') === 'true';
    if (isAuthed) {
      const saved = localStorage.getItem('menu100_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return GUEST_USER;
  });

  // Data loaded via centralized dbService (with local fallback & cloud sync support)
  const [foods, setFoods] = useState<FoodItem[]>(() => dbService.getFoods());
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>(() => dbService.getRestaurants());
  const [merchList, setMerchList] = useState<MerchItem[]>(() => dbService.getMerch());
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('menu100_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Modals & Gate state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<AuthGateReason>('general');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFoodDetail, setSelectedFoodDetail] = useState<FoodItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local storage & dbService
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('menu100_user', JSON.stringify(user));
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    dbService.saveFoods(foods);
  }, [foods]);

  useEffect(() => {
    dbService.saveRestaurants(restaurants);
  }, [restaurants]);

  useEffect(() => {
    dbService.saveMerch(merchList);
  }, [merchList]);

  useEffect(() => {
    localStorage.setItem('menu100_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Guard Trigger
  const handleRequireAuth = (reason: AuthGateReason) => {
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  };

  // Login / Register success handler
  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    localStorage.setItem('menu100_auth_session', 'true');
    localStorage.setItem('menu100_user', JSON.stringify(newUser));
    showToast(`✓ ยินดีต้อนรับคุณ ${newUser.name} เข้าสู่ menu100!`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(GUEST_USER);
    localStorage.removeItem('menu100_auth_session');
    localStorage.removeItem('menu100_user');
    showToast('ออกจากระบบเรียบร้อยแล้ว เข้าสู่โหมดผู้เยี่ยมชม (Guest)');
  };

  // Toggle user Royal status (requires authentication)
  const handleToggleRoyal = () => {
    if (!isAuthenticated) {
      handleRequireAuth('membership');
      return;
    }
    const nextRoyal = !user.isRoyal;
    const updated = { 
      ...user, 
      isRoyal: nextRoyal,
      royalVotesLeftThisMonth: nextRoyal ? 10 : 0
    };
    setUser(updated);
    if (user.username) {
      dbService.updateUserRoyalStatus(user.username, nextRoyal);
    }
    showToast(
      nextRoyal
        ? '👑 สลับเป็นสถานะ: ROYAL MEMBER แล้ว! (โหวตน้ำหนัก x2, ลด Merch 15%)'
        : 'สลับกลับเป็นสถานะ: สมาชิกทั่วไป เรียบร้อยแล้ว'
    );
  };

  // Vote handler (requires authentication)
  const handleVote = (foodId: string) => {
    if (!isAuthenticated) {
      handleRequireAuth('vote');
      return;
    }

    const isAlreadyVoted = user.votedFoodIds.includes(foodId);

    if (isAlreadyVoted) {
      // Unvote
      setUser((prev) => ({
        ...prev,
        votedFoodIds: prev.votedFoodIds.filter((id) => id !== foodId),
      }));
      setFoods((prev) =>
        prev.map((f) => {
          if (f.id === foodId) {
            return user.isRoyal
              ? { ...f, royalVotes: Math.max(0, f.royalVotes - 1) }
              : { ...f, regularVotes: Math.max(0, f.regularVotes - 1) };
          }
          return f;
        })
      );
      showToast('ยกเลิกการโหวตเมนูนี้แล้ว');
    } else {
      // Vote
      setUser((prev) => ({
        ...prev,
        votedFoodIds: [...prev.votedFoodIds, foodId],
      }));
      setFoods((prev) =>
        prev.map((f) => {
          if (f.id === foodId) {
            return user.isRoyal
              ? { ...f, royalVotes: f.royalVotes + 1 }
              : { ...f, regularVotes: f.regularVotes + 1 };
          }
          return f;
        })
      );
      if (user.username) {
        dbService.recordUserVote(user.username);
      }
      showToast(
        user.isRoyal
          ? '👑 ลงคะแนนแบบ ROYAL VOTE สำเร็จ! (นับแยกและถ่วงน้ำหนัก x2)'
          : 'ลงคะแนนโหวตสำเร็จ! ขอบคุณที่ร่วมส่งเสียงให้นักชิม'
      );
    }
  };

  // Cart operations
  const handleAddToCart = (merch: MerchItem, size?: string, color?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.merch.id === merch.id);
      if (existing) {
        return prev.map((item) =>
          item.merch.id === merch.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { merch, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    showToast(`เพิ่ม "${merch.name}" ลงในตะกร้าแล้ว`);
  };

  const handleQuickBuy = (merch: MerchItem, size?: string, color?: string) => {
    if (!isAuthenticated) {
      handleRequireAuth('merch');
      return;
    }
    handleAddToCart(merch, size, color);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.merch.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.merch.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Verify request handler
  const handleVerifySubmitSuccess = (data: any) => {
    const newRest: RestaurantItem = {
      id: `rest-${Date.now()}`,
      name: data.restaurantName,
      provinceId: data.provinceId,
      provinceName: data.provinceId,
      region: 'central',
      address: `จ.${data.provinceId} (อยู่ระหว่างการปักหมุด GPS)`,
      verifiedStars: 3,
      menu100Score: 90,
      isSme: data.isSme,
      isStreetFood: true,
      leagueTier: 'provincial',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
      cuisine: data.cuisine || 'อาหารไทยต้นตำรับ',
      priceRange: '฿฿',
      highlightDishes: data.highlightDishes ? data.highlightDishes.split(',') : ['เมนูเด็ดประจำร้าน'],
      openHours: '09:00 - 20:00 น.',
      phone: data.phone,
      reviewCount: 1,
      description: data.story || 'ร้านอาหารที่ยื่นขอรับการ Verify จาก menu100',
      rankInProvince: restaurants.length + 1,
    };

    const updatedList = [newRest, ...restaurants];
    setRestaurants(updatedList);
    dbService.saveRestaurants(updatedList);
    showToast(`✓ ยื่นขอ Verify สำเร็จ! ร้าน "${data.restaurantName}" ได้รับการพิจารณาเบื้องต้น ⭐⭐⭐ 3 ดาว`);
    setCurrentTab('restaurants');
  };

  // If admin backoffice mode is active, guard strictly for admin role
  if (viewMode === 'admin') {
    if (!isAuthenticated || user.role !== 'admin') {
      setViewMode('client');
      showToast('⚠️ เฉพาะบัญชียศ Admin เท่านั้นที่สามารถเข้าถึงระบบหลังบ้านได้');
    } else {
      return (
        <AdminBackoffice
          foods={foods}
          onUpdateFoods={setFoods}
          restaurants={restaurants}
          onUpdateRestaurants={setRestaurants}
          merchList={merchList}
          onUpdateMerch={setMerchList}
          onSwitchToClient={() => setViewMode('client')}
          user={user}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      );
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#07090e] text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-200`}>
      {/* Non-blocking Auth Gate Modal (shown only on demand when user wants to login or perform protected actions) */}
      {isAuthModalOpen && (
        <AuthGateModal 
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsAuthModalOpen(false)}
          reason={authReason}
        />
      )}

      {/* Website & Database Settings Modal */}
      <WebSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onSelectTheme={(newTheme) => setTheme(newTheme)}
        dbConfig={dbConfig}
        onConfigUpdated={(newCfg) => setDbConfig(newCfg)}
      />

      {/* Header with Navigation, Theme toggle, and Quick Actions */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        isAuthenticated={isAuthenticated}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onToggleRoyal={handleToggleRoyal}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        onOpenVerifyModal={() => {
          if (!isAuthenticated) {
            handleRequireAuth('verify');
          } else {
            setIsVerifyModalOpen(true);
          }
        }}
        onOpenAdmin={() => {
          if (isAuthenticated && user.role === 'admin') {
            setViewMode('admin');
          } else {
            showToast('⚠️ เฉพาะบัญชียศ Admin เท่านั้นที่สามารถเข้าถึงระบบหลังบ้านได้');
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogin={() => handleRequireAuth('general')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'ranking' && (
          <TabRanking
            foods={foods}
            user={user}
            isAuthenticated={isAuthenticated}
            onRequireAuth={handleRequireAuth}
            onVote={handleVote}
            onSelectFoodDetail={setSelectedFoodDetail}
          />
        )}

        {currentTab === 'restaurants' && (
          <TabRestaurants
            restaurants={restaurants}
            isAuthenticated={isAuthenticated}
            onRequireAuth={handleRequireAuth}
            onOpenVerifyModal={() => {
              if (!isAuthenticated) {
                handleRequireAuth('verify');
              } else {
                setIsVerifyModalOpen(true);
              }
            }}
          />
        )}

        {currentTab === 'merch' && (
          <TabMerch
            merchList={merchList}
            onAddToCart={handleAddToCart}
            onQuickBuy={handleQuickBuy}
            user={user}
            isAuthenticated={isAuthenticated}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {currentTab === 'forum' && (
          <TabForum 
            user={user} 
            isAuthenticated={isAuthenticated}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {currentTab === 'membership' && (
          <TabMembership
            user={user}
            isAuthenticated={isAuthenticated}
            onRequireAuth={handleRequireAuth}
            onToggleRoyal={handleToggleRoyal}
            onSelectTab={setCurrentTab}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 bg-slate-900/95 dark:bg-black/95 text-white rounded-2xl shadow-2xl border border-amber-400/40 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <FoodRouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        foods={foods}
        onSelectFood={(food) => setSelectedFoodDetail(food)}
      />

      <VerifyRequestModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onSubmitSuccess={handleVerifySubmitSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        user={user}
        isAuthenticated={isAuthenticated}
        onRequireAuth={handleRequireAuth}
        onOrderCompleted={(updatedMerch) => {
          if (updatedMerch) setMerchList(updatedMerch);
        }}
      />

      <FoodDetailModal
        food={selectedFoodDetail}
        onClose={() => setSelectedFoodDetail(null)}
        user={user}
        onVote={handleVote}
        isAuthenticated={isAuthenticated}
        onRequireAuth={handleRequireAuth}
      />

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-12 border-t border-slate-800 text-xs mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-orange-500/20">
                m100
              </div>
              <div>
                <span className="text-white font-extrabold text-base">menu100 Thailand</span>
                <p className="text-[11px] text-slate-500">
                  ระบบจัดอันดับอาหารโลก • แผนที่ 77 จังหวัด • สินค้า Merch • ชุมชนนักชิม
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button onClick={() => setCurrentTab('ranking')} className="hover:text-white transition-colors">1. Ranking</button>
              <button onClick={() => setCurrentTab('restaurants')} className="hover:text-white transition-colors">2. ร้านอาหารทั่วไทย</button>
              <button onClick={() => setCurrentTab('merch')} className="hover:text-white transition-colors">3. Merch</button>
              <button onClick={() => setCurrentTab('forum')} className="hover:text-white transition-colors">4. กระทู้</button>
              <button onClick={() => setCurrentTab('membership')} className="hover:text-white transition-colors">5. Royal Member</button>
              <button onClick={() => setIsSettingsOpen(true)} className="text-slate-300 hover:text-white transition-colors">⚙️ ตั้งค่าธีม & ฐานข้อมูล</button>
              {isAuthenticated && user.role === 'admin' && (
                <button onClick={() => setViewMode('admin')} className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>ระบบหลังบ้าน (Admin)</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© 2026 menu100. All rights reserved. เว็บแนะนำเมนูอาหารและอันดับร้านเด็ดทั่วไทย</p>
            <p>รอบรีเซ็ต 2 เดือน (ทุกวันสิ้นเดือนคู่) • ผลโหวต Royal Vote x2 ถ่วงน้ำหนัก</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
