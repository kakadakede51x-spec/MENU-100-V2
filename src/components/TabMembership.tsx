import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ROYAL_STICKERS } from '../data/mockData';
import { 
  Crown, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ShoppingBag, 
  ThumbsUp, 
  QrCode, 
  Star, 
  Award, 
  CheckCircle2,
  Lock,
  Zap,
  Gift
} from 'lucide-react';

interface TabMembershipProps {
  user: UserProfile;
  isAuthenticated: boolean;
  onRequireAuth: (reason: 'membership') => void;
  onToggleRoyal: () => void;
  onSelectTab: (tab: any) => void;
}

export const TabMembership: React.FC<TabMembershipProps> = ({
  user,
  isAuthenticated,
  onRequireAuth,
  onToggleRoyal,
  onSelectTab,
}) => {
  const [upgradedNotice, setUpgradedNotice] = useState(false);

  const handleUpgradeClick = () => {
    if (!isAuthenticated) {
      onRequireAuth('membership');
      return;
    }
    onToggleRoyal();
    setUpgradedNotice(true);
    setTimeout(() => setUpgradedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-amber-950 via-stone-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-amber-500/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>menu100 ROYAL MEMBERSHIP PRIVILEGES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              ระบบสมาชิก & เอกสิทธิ์ <span className="text-amber-400">Royal Vote 👑</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ยกระดับพลังเสียงของคุณสู่อันดับอาหารระดับประเทศ! ผลโหวตของคุณจะถูกนับแยกเป็น <strong className="text-amber-400">Royal Vote</strong> ที่มีน้ำหนักคะแนนสูงกว่าคนทั่วไป พร้อมปลดล็อกคลังสติกเกอร์ VIP และส่วนลดสินค้า Merch 15%
            </p>
          </div>

          {/* Instant Switch Mode */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-amber-400/40 text-center w-full md:w-80 shrink-0 space-y-3 shadow-xl">
            <div className="text-xs text-amber-200 font-bold">
              สลับโหมดทดลองใช้งานเพื่อทดสอบระบบ:
            </div>
            <button
              id="membership-toggle-btn"
              onClick={handleUpgradeClick}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                user.isRoyal
                  ? 'bg-slate-800 hover:bg-slate-900 text-amber-300 border border-amber-400/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-102'
              }`}
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>{user.isRoyal ? 'สลับกลับเป็น: สมาชิกทั่วไป' : 'สลับเปิดใช้งาน: ROYAL MEMBER 👑'}</span>
            </button>
            <p className="text-[10px] text-slate-300">
              {user.isRoyal ? '✓ ขณะนี้คุณได้รับสิทธิพิเศษ Royal Vote เต็มรูปแบบ' : 'คลิกเพื่อทดสอบพลังโหวตและสติกเกอร์ VIP ได้ทันที'}
            </p>
          </div>
        </div>
      </section>

      {/* Upgraded Alert */}
      {upgradedNotice && (
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>
              {user.isRoyal 
                ? 'ยินดีต้อนรับสู่ Royal Member! โหวตของคุณจะถูกนับเป็น Royal Vote 👑 และปลดล็อกสติกเกอร์ VIP แล้ว' 
                : 'เปลี่ยนเป็นสมาชิกทั่วไปเรียบร้อยแล้ว'}
            </span>
          </div>
        </div>
      )}

      {/* Digital Member Card Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Virtual VIP Card */}
        <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden transition-all ${
          user.isRoyal
            ? 'bg-gradient-to-tr from-stone-900 via-amber-950 to-orange-950 border-2 border-amber-400/60'
            : 'bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700'
        }`}>
          {/* Card background sheen */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-400 uppercase">
                <span>menu100</span>
                <span className="bg-amber-400/20 px-1.5 py-0.5 rounded text-[10px]">THAILAND</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {user.isRoyal ? 'ROYAL FOODIE PASS' : 'STANDARD FOODIE PASS'}
              </h3>
            </div>
            
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              {user.isRoyal ? (
                <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
              ) : (
                <Award className="w-6 h-6 text-slate-300" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 my-6">
            <img
              src={user.avatar}
              alt={user.name}
              className={`w-14 h-14 rounded-2xl object-cover border-2 ${
                user.isRoyal ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-400'
              }`}
            />
            <div>
              <div className="text-base font-black text-white flex items-center gap-1.5">
                <span>{user.name}</span>
                {user.isRoyal && <span className="text-amber-400 text-xs">👑 VIP</span>}
              </div>
              <p className="text-xs text-slate-300">สมาชิกตั้งแต่: {user.joinedDate}</p>
              <div className="text-[11px] font-mono text-amber-300/80 mt-1">
                ID: {user.id.toUpperCase()}-ROYAL-{user.isRoyal ? '8888' : '0001'}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-white/15 pt-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">ระดับสถานะสมาชิก</span>
              <span className="font-extrabold text-amber-300 text-sm">
                {user.isRoyal ? `💎 ${user.royalLevel} TIER` : 'REGULAR TIER'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">สิทธิ์โหวตประจำเดือน</span>
              <span className="font-bold text-white">
                {user.isRoyal ? 'Royal Vote: ไม่จำกัด 👑' : 'โหวตทั่วไป: ปกติ'}
              </span>
            </div>
          </div>
        </div>

        {/* Perks Comparison Summary */}
        <div className="bg-white dark:bg-[#0c101b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800/90 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>เปรียบเทียบสิทธิประโยชน์ (Free vs Royal Member)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 fill-amber-300" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">1. ระบบ Royal Vote (แยกคะแนนเฉพาะ)</h4>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                  คะแนนโหวตของคุณจะถูกบันทึกในช่อง <strong>Royal Vote</strong> มีน้ำหนักคะแนนคูณ 2 ในการจัดอันดับ Top 20 อาหารโลก และ Top 10 ของจังหวัด
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#111624] border border-slate-200 dark:border-slate-800 rounded-2xl">
              <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">2. สติกเกอร์ VIP 8 ลายในห้องสนทนา</h4>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                  ใช้สติกเกอร์พิเศษ เช่น มงกุฎทอง, แสงอร่อยเหาะ, และไฟลุกครกเดือด ได้ในทุกกระทู้ถกประเด็นอาหาร
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#111624] border border-slate-200 dark:border-slate-800 rounded-2xl">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">3. ส่วนลด 15% สินค้า Merch ทุกชิ้น</h4>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                  ลดทันที 15% สำหรับเสื้อผ้า หมวกแก๊ป กระเป๋าผ้า และขวดน้ำสุญญากาศ ทั้งสแกนจ่าย QR และบัตรเครดิต
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Royal Stickers Gallery Showcase */}
      <section className="bg-white dark:bg-[#0c101b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>คลังสติกเกอร์พิเศษสำหรับ Royal Member (Exclusive Stickers Pack)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ใช้งานได้ในกระทู้ถกประเด็นนักชิม เพื่อยกระดับความเห็นของคุณ
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700">
            8 สติกเกอร์พรีเมียม
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ROYAL_STICKERS.map((stk) => (
            <div
              key={stk.id}
              className="p-3.5 bg-slate-50 dark:bg-[#111624] hover:bg-amber-50/70 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 rounded-2xl transition-all flex flex-col items-center text-center space-y-1.5"
            >
              <span className="text-3xl">{stk.emoji}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{stk.name}</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{stk.description}</p>
              <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full mt-1 border border-amber-300 dark:border-amber-700">
                {stk.royaltyTier}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
