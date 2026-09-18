import React from 'react';
import { TabType, UserProfile } from '../types';
import { 
  Trophy, 
  MapPin, 
  ShoppingBag, 
  MessageSquare, 
  Crown, 
  Dice5, 
  Sparkles, 
  UserCheck, 
  Store,
  Sliders,
  LogOut,
  ShieldCheck,
  Download
} from 'lucide-react';


interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  user: UserProfile;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  onToggleTheme?: () => void;
  onToggleRoyal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenRoulette: () => void;
  onOpenVerifyModal: () => void;
  onOpenAdmin: () => void;
  onOpenSettings: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  isAuthenticated,
  theme,
  onToggleTheme,
  onToggleRoyal,
  cartCount,
  onOpenCart,
  onOpenRoulette,
  onOpenVerifyModal,
  onOpenAdmin,
  onOpenSettings,
  onOpenLogin,
  onLogout,
}) => {

  return (
    <header className="sticky top-0 z-40 bg-[#080b11]/95 dark:bg-[#080b11]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xs transition-colors">
      {/* Top Banner: Season & Actions (Deep Sleek Dark Palette) */}
      <div className="bg-gradient-to-r from-black via-stone-950 to-zinc-950 text-slate-200 text-xs py-1.5 px-4 font-medium border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide">
              SEASON 5
            </span>
            <span className="hidden sm:inline text-slate-300">⚡ รอบจัดอันดับ 2 เดือน (ก.ค. - ส.ค.) — เหลือเวลาโหวตอีก 24 วัน!</span>
            <span className="sm:hidden text-slate-300">⚡ รอบจัดอันดับ Season 5</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Theme Switcher Pill */}
            {onToggleTheme && (
              <button
                id="header-btn-toggle-theme"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-2.5 py-0.5 rounded-full transition-all text-[11px] font-bold shadow-2xs hover:border-amber-400/50"
                title="คลิกเพื่อสลับโหมด มืด (Dark) / สว่าง (Light) ทันที"
              >
                <span>{theme === 'dark' ? '🌙 ธีมมืด (Dark)' : '☀️ ธีมสว่าง (Light)'}</span>
              </button>
            )}

            {/* Web Settings (Theme & Supabase) */}
            <button
              id="header-btn-web-settings"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-2.5 py-0.5 rounded-full transition-all text-[11px] font-semibold"
              title="ตั้งค่าธีมและฐานข้อมูล Database / Supabase"
            >
              <span>⚙️ ตั้งค่าเว็บ</span>
            </button>

            {/* Backoffice Admin Portal Entrance - ONLY SHOWN TO ADMIN USERS */}
            {isAuthenticated && user.role === 'admin' && (
              <button
                id="header-btn-admin-portal"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 px-3 py-0.5 rounded-full transition-all text-[11px] font-black shadow-md shadow-amber-500/20 hover:scale-103"
                title="เข้าสู่ระบบหลังบ้านเพื่ออัปเดตเมนู ตรวจสอบร้านค้า จัดการสต็อกสินค้า และดู Dashboard (เฉพาะยศ Admin)"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-950" />
                <span>หลังบ้าน (Admin)</span>
              </button>
            )}

            {/* Owner verify button shortcut */}
            <button
              id="header-btn-verify-restaurant"
              onClick={onOpenVerifyModal}
              className="hidden lg:inline-flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 px-2.5 py-0.5 rounded-full transition-colors text-[11px]"
              title="เจ้าของร้านยื่นขอรับการตรวจสอบ 1-5 ดาว"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>ขอ Verify ร้าน</span>
            </button>

            {/* Quick Demo Switcher (if authenticated) */}
            {isAuthenticated && (
              <button
                id="header-btn-toggle-royal"
                onClick={onToggleRoyal}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                  user.isRoyal
                    ? 'bg-amber-300 text-amber-950 shadow-xs'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title="กดเพื่อสลับสิทธิ์การใช้งานจำลองระหว่าง สมาชิกทั่วไป กับ Royal Member"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{user.isRoyal ? 'ROYAL 👑' : 'สลับเป็น ROYAL'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectTab('ranking')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tighter">m</span>
              <span className="font-bold text-xs bg-white text-orange-600 rounded-md px-1 py-0.5 -ml-0.5">100</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  menu<span className="text-orange-500">100</span>
                </span>
                <span className="bg-amber-950/70 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-amber-700">
                  THAI FOOD AWARDS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ศูนย์รวมอันดับอาหารโลก • แผนที่ร้านเด็ด 77 จังหวัด • สังคมนักชิม
              </p>
            </div>
          </div>

          {/* Quick Actions (Roulette + Cart + Profile / Login) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Food Roulette Button */}
            <button
              id="header-btn-food-roulette"
              onClick={onOpenRoulette}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-950/50 hover:bg-orange-900/70 text-orange-300 text-xs sm:text-sm font-bold border border-orange-800/70 transition-all hover:scale-102 active:scale-98 shadow-2xs"
            >
              <Dice5 className="w-4 h-4 text-orange-400 animate-spin-slow" />
              <span className="hidden sm:inline">กินอะไรดีวันนี้?</span>
              <span className="sm:hidden">สุ่มเมนู</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Cart Button */}
            <button
              id="header-btn-cart"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl text-slate-200 hover:bg-slate-800 border border-slate-750 bg-slate-900/80 transition-colors"
              aria-label="ตะกร้าสินค้า"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Authenticated User vs Guest Entrance */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* User Profile Badge */}
                <div 
                  onClick={() => onSelectTab('membership')}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    user.role === 'admin'
                      ? 'bg-amber-950/70 border-amber-500/80 text-amber-200 shadow-xs'
                      : user.isRoyal 
                      ? 'bg-amber-950/50 border-amber-700/80 text-amber-200 shadow-xs' 
                      : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-full object-cover border border-amber-400"
                    />
                    {user.role === 'admin' ? (
                      <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-1.5 -right-1.5 fill-amber-400 drop-shadow" />
                    ) : user.isRoyal ? (
                      <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-1.5 -right-1.5 fill-amber-400 drop-shadow" />
                    ) : null}
                  </div>
                  <div className="text-left hidden md:block leading-tight">
                    <div className="text-xs font-bold flex items-center gap-1">
                      <span>{user.name}</span>
                      {user.role === 'admin' ? (
                        <span className="text-[10px] text-amber-400 font-extrabold bg-amber-900/60 px-1 rounded border border-amber-500/40">ADMIN</span>
                      ) : user.isRoyal ? (
                        <span className="text-[10px] text-amber-400 font-extrabold">👑 VIP</span>
                      ) : null}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {user.role === 'admin' ? 'ผู้ดูแลระบบสูงสุด' : user.isRoyal ? 'Royal Member • โหวต 2x' : 'สมาชิกทั่วไป'}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  id="header-btn-logout"
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 bg-slate-900/80 transition-colors"
                  title="ออกจากระบบ เพื่อเข้าสู่โหมด Guest"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Guest Mode: Show Login / Register Button */
              <button
                id="header-btn-login-gate"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm shadow-orange-500/20 hover:scale-102 transition-all"
                title="เข้าสู่ระบบหรือสมัครสมาชิก เพื่อโหวตอาหาร สั่งซื้อของ และคอมเมนต์"
              >
                <UserCheck className="w-4 h-4" />
                <span>เข้าสู่ระบบ / สมัครไอดี</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Primary Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2 border-t border-slate-800/80">
          <button
            id="nav-tab-ranking"
            onClick={() => onSelectTab('ranking')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              currentTab === 'ranking'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>1. ระบบ Ranking & Top 20</span>
          </button>

          <button
            id="nav-tab-restaurants"
            onClick={() => onSelectTab('restaurants')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              currentTab === 'restaurants'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>2. ร้านอาหารทั่วไทย & SME</span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              77 จังหวัด
            </span>
          </button>

          <button
            id="nav-tab-merch"
            onClick={() => onSelectTab('merch')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              currentTab === 'merch'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>3. สินค้า Merch</span>
            {user?.isRoyal && (
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                ลด 15%
              </span>
            )}
          </button>

          <button
            id="nav-tab-forum"
            onClick={() => onSelectTab('forum')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              currentTab === 'forum'
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. กระทู้นักชิม</span>
          </button>

          <button
            id="nav-tab-membership"
            onClick={() => onSelectTab('membership')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              currentTab === 'membership'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/30'
                : 'text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/40'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>5. ระบบเมมเบอร์ & Royal Vote</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

