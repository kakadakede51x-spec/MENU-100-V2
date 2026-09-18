import React, { useState } from 'react';
import { RestaurantItem, ThailandRegion, ProvinceData } from '../types';
import { PROVINCES_DATA } from '../data/mockData';
import { 
  MapPin, 
  Search, 
  Star, 
  ShieldCheck, 
  Store, 
  Compass, 
  Award, 
  Phone, 
  Clock, 
  Filter, 
  Sparkles, 
  Heart, 
  ExternalLink, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Building
} from 'lucide-react';

interface TabRestaurantsProps {
  restaurants: RestaurantItem[];
  isAuthenticated?: boolean;
  onRequireAuth?: (reason: 'verify') => void;
  onOpenVerifyModal: () => void;
  onBookmarkRestaurant?: (id: string) => void;
}

export const TabRestaurants: React.FC<TabRestaurantsProps> = ({
  restaurants,
  isAuthenticated,
  onRequireAuth,
  onOpenVerifyModal,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<ThailandRegion | 'all'>('all');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStarFilter, setSelectedStarFilter] = useState<number>(0);
  const [smeOnlyFilter, setSmeOnlyFilter] = useState(false);
  const [leagueFilter, setLeagueFilter] = useState<'all' | 'national' | 'regional' | 'provincial'>('all');
  const [selectedRestaurantDetail, setSelectedRestaurantDetail] = useState<RestaurantItem | null>(null);

  const handleOpenVerify = () => {
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth('verify');
      return;
    }
    onOpenVerifyModal();
  };

  // Region details mapping
  const REGION_LABELS: Record<ThailandRegion, { name: string; icon: string }> = {
    north: { name: 'ภาคเหนือ', icon: '🏔️' },
    central: { name: 'ภาคกลาง', icon: '🌾' },
    northeast: { name: 'ภาคอีสาน', icon: '🌶️' },
    south: { name: 'ภาคใต้', icon: '🌊' },
    east: { name: 'ภาคตะวันออก', icon: '🏖️' },
    west: { name: 'ภาคตะวันตก', icon: '🌲' },
  };

  // Filter provinces based on region
  const availableProvinces = PROVINCES_DATA.filter((p) => {
    if (selectedRegion === 'all') return true;
    return p.region === selectedRegion;
  });

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    // Region
    if (selectedRegion !== 'all' && r.region !== selectedRegion) return false;
    // Province
    if (selectedProvinceId !== 'all' && r.provinceId !== selectedProvinceId) return false;
    // League
    if (leagueFilter !== 'all' && r.leagueTier !== leagueFilter) return false;
    // Stars
    if (selectedStarFilter > 0 && r.verifiedStars < selectedStarFilter) return false;
    // SME
    if (smeOnlyFilter && !r.isSme) return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.provinceName.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.highlightDishes.some((d) => d.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Selected Province info if any
  const currentProvinceInfo = PROVINCES_DATA.find((p) => p.id === selectedProvinceId);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Section: Hero & SME Promotion League Intro */}
      <section className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>menu100 RESTAURANT VERIFICATION & THAILAND LEAGUE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              ระบบโปรโมทร้านอาหารทั่วไทย & <span className="text-amber-400">ส่งเสริม SME ท้องถิ่น</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ค้นหาร้านเด็ด 77 จังหวัด ผ่านแผนที่แบบเจาะลึก ทุกร้านผ่านการ <strong className="text-white">Verify โดยเจ้าของเว็บ menu100</strong> และได้รับตราดาว 1-5 ดาว พร้อมแบ่งการจัดอันดับเป็นลีกระดับจังหวัด ลีกภูมิภาค และลีกระดับประเทศ
            </p>
          </div>

          {/* Owner Request CTA button */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center w-full md:w-auto shrink-0 space-y-2">
            <p className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
              <Store className="w-4 h-4" />
              สำหรับเจ้าของร้านอาหารทั่วไทย
            </p>
            <button
              id="restaurant-tab-request-verify-btn"
              onClick={handleOpenVerify}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ยื่นขอ Verify รับ 1-5 ดาว (ฟรี)</span>
            </button>
            <p className="text-[10px] text-slate-300">
              เพื่อนำร้านมาโปรโมทสู่ Top 10 ของจังหวัด
            </p>
          </div>
        </div>
      </section>

      {/* SME & Local Street Food Banner */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800/50 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                โครงการสนับสนุน SME รายย่อย & ร้านลับชุมชน
              </h3>
              <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                SME SUPPORT
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              menu100 ให้พื้นที่โฆษณาฟรีแก่ร้านค้ารายย่อยที่มีเอกลักษณ์ เพื่อกระจายรายได้สู่ชุมชนทั้ง 77 จังหวัด
            </p>
          </div>
        </div>

        <button
          id="restaurants-filter-sme-toggle"
          onClick={() => setSmeOnlyFilter(!smeOnlyFilter)}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            smeOnlyFilter
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{smeOnlyFilter ? 'กำลังแสดง: เฉพาะร้าน SME ✓' : 'กดดูเฉพาะร้าน SME ท้องถิ่น'}</span>
        </button>
      </section>

      {/* Interactive Thailand Map & Region Selector */}
      <section className="bg-white dark:bg-[#0c101b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800/90 shadow-xs space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span>แผนที่ประเทศไทย & เลือกค้นหาตามภูมิภาค / จังหวัด</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                กดเลือกภาคเพื่อดูจังหวัด และกดดู 10 อันดับร้านเด็ดของแต่ละจังหวัด
              </p>
            </div>
            {selectedProvinceId !== 'all' && (
              <button
                onClick={() => setSelectedProvinceId('all')}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 bg-orange-50 dark:bg-orange-950/50 px-3 py-1 rounded-lg self-start"
              >
                ดูทุกจังหวัด (รีเซ็ต)
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <button
              id="region-selector-all"
              onClick={() => {
                setSelectedRegion('all');
                setSelectedProvinceId('all');
              }}
              className={`p-2.5 rounded-2xl text-xs font-bold transition-all text-center border ${
                selectedRegion === 'all'
                  ? 'bg-slate-900 dark:bg-orange-600 text-white border-slate-900 dark:border-orange-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-[#111624] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="text-sm mb-0.5">🇹🇭</div>
              <span>ทั่วประเทศ (77 จว.)</span>
            </button>

            {(Object.keys(REGION_LABELS) as ThailandRegion[]).map((regKey) => {
              const info = REGION_LABELS[regKey];
              const isSelected = selectedRegion === regKey;
              return (
                <button
                  key={regKey}
                  id={`region-selector-${regKey}`}
                  onClick={() => {
                    setSelectedRegion(regKey);
                    setSelectedProvinceId('all');
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-bold transition-all text-center border ${
                    isSelected
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#111624] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-sm mb-0.5">{info.icon}</div>
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Province Carousel / Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            เลือกจังหวัดใน{selectedRegion === 'all' ? 'ประเทศไทย' : REGION_LABELS[selectedRegion].name} เพื่อดู 10 อันดับร้านเด็ด:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableProvinces.map((prov) => {
              const isSelected = selectedProvinceId === prov.id;
              return (
                <button
                  key={prov.id}
                  id={`province-btn-${prov.id}`}
                  onClick={() => setSelectedProvinceId(prov.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border text-left ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                      : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>{prov.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                    จานเด็ด: {prov.signatureDish}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight Banner of Selected Province */}
        {currentProvinceInfo && (
          <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  📍 จังหวัด{currentProvinceInfo.name} ({currentProvinceInfo.nameEn})
                </span>
                <span className="bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  10 อันดับประจำจังหวัด
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                เมนูประจำถิ่นเอกลักษณ์: <strong className="text-orange-700 dark:text-orange-400">{currentProvinceInfo.signatureDish}</strong> • มีร้านอาหารในระบบ {currentProvinceInfo.restaurantCount} แห่ง
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">คะแนนความอร่อยเฉลี่ย:</span>
              <span className="text-lg font-black text-orange-600 dark:text-orange-400">{currentProvinceInfo.topRankScore} / 100</span>
            </div>
          </div>
        )}
      </section>

      {/* Search Bar & League Tiers Filter (ระดับจังหวัด -> ภูมิภาค -> ประเทศ) */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* League Tier Pills (เป็นลีคๆ ไป ตามโจทย์) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 shrink-0">ลีกการแข่งขัน:</span>
          
          <button
            id="league-tier-all"
            onClick={() => setLeagueFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              leagueFilter === 'all'
                ? 'bg-slate-900 dark:bg-orange-600 text-white'
                : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            ทุกลีก
          </button>

          <button
            id="league-tier-national"
            onClick={() => setLeagueFilter('national')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              leagueFilter === 'national'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>🏆 ลีกระดับประเทศ (National League)</span>
          </button>

          <button
            id="league-tier-regional"
            onClick={() => setLeagueFilter('regional')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              leagueFilter === 'regional'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>🥇 ลีกระดับภูมิภาค (Regional League)</span>
          </button>

          <button
            id="league-tier-provincial"
            onClick={() => setLeagueFilter('provincial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              leagueFilter === 'provincial'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#111624] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>📍 ลีกระดับจังหวัด (Provincial)</span>
          </button>
        </div>

        {/* Text Search & Star filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Star Filter */}
          <select
            id="restaurants-star-filter"
            value={selectedStarFilter}
            onChange={(e) => setSelectedStarFilter(Number(e.target.value))}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-white dark:bg-[#111624] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={0}>ดาว Verify ทั้งหมด</option>
            <option value={5}>⭐⭐⭐⭐⭐ 5 ดาวเท่านั้น</option>
            <option value={4}>⭐⭐⭐⭐ 4 ดาวขึ้นไป</option>
            <option value={3}>⭐⭐⭐ 3 ดาวขึ้นไป</option>
          </select>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="restaurants-search-input"
              type="text"
              placeholder="พิมพ์ชื่อร้านอาหาร หรือเมนู..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#111624] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Restaurant Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>
              รายชื่อร้านอาหารที่ผ่านการ Verify ({filteredRestaurants.length} ร้าน)
            </span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            เกณฑ์ดาว 1-5 ดาว ประเมินโดยผู้เชี่ยวชาญ menu100
          </span>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0c101b] rounded-3xl border border-slate-200 dark:border-slate-800">
            <Store className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">ไม่พบร้านอาหารตามเงื่อนไขที่ค้นหา</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ลองเปลี่ยนจังหวัด หรือเลือกดาว Verify ทั้งหมด</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-white dark:bg-[#0c101b] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                  {/* Top Left: League & Province */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-400" />
                      <span>{rest.provinceName}</span>
                    </span>
                    {rest.isSme && (
                      <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        SME ท้องถิ่น
                      </span>
                    )}
                  </div>

                  {/* Top Right: Verified Star Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md border border-amber-300 dark:border-amber-600 flex items-center gap-1">
                    <div className="flex">
                      {Array.from({ length: rest.verifiedStars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] font-black text-amber-900 dark:text-amber-300 ml-0.5">
                      {rest.verifiedStars} ดาว
                    </span>
                  </div>

                  {/* Bottom Image: League tier & Rank in Province */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        rest.leagueTier === 'national' ? 'bg-amber-400 text-amber-950' :
                        rest.leagueTier === 'regional' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-white'
                      }`}>
                        {rest.leagueTier === 'national' ? '👑 ลีกระดับประเทศ' :
                         rest.leagueTier === 'regional' ? '⭐ ลีกภูมิภาค' : '📍 ลีกจังหวัด'}
                      </span>
                    </div>
                    <span className="text-[11px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold">
                      อันดับ #{rest.rankInProvince} ของจังหวัด
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {rest.name}
                      </h4>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md shrink-0 border border-emerald-200 dark:border-emerald-800">
                        {rest.priceRange}
                      </span>
                    </div>

                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-0.5">{rest.cuisine}</p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {rest.description}
                    </p>

                    {/* Highlight Dishes */}
                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">เมนูซิกเนเจอร์เด็ด:</span>
                      <div className="flex flex-wrap gap-1">
                        {rest.highlightDishes.map((dish, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium">
                            • {dish}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rest.openHours.split(' ')[0]}</span>
                    </div>
                    <button
                      id={`rest-detail-btn-${rest.id}`}
                      onClick={() => setSelectedRestaurantDetail(rest)}
                      className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1"
                    >
                      <span>ดูข้อมูลร้าน & รีวิว</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Restaurant Detail Modal */}
      {selectedRestaurantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56">
              <img
                src={selectedRestaurantDetail.image}
                alt={selectedRestaurantDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedRestaurantDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>menu100 Verified: {selectedRestaurantDetail.verifiedStars} ดาว</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedRestaurantDetail.name}</h3>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-bold">{selectedRestaurantDetail.cuisine}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{selectedRestaurantDetail.description}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>{selectedRestaurantDetail.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>เวลาทำการ: {selectedRestaurantDetail.openHours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>โทรสอบถาม / จองโต๊ะ: {selectedRestaurantDetail.phone}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">เมนูแนะนำที่ต้องลอง:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRestaurantDetail.highlightDishes.map((dish, i) => (
                    <span key={i} className="text-xs bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl font-bold">
                      ⭐ {dish}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedRestaurantDetail(null)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-orange-600 dark:hover:bg-orange-700 font-bold text-xs transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
