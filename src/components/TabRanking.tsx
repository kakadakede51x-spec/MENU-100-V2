import React, { useState } from 'react';
import { FoodItem, FoodCategory, UserProfile } from '../types';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Clock, 
  Search, 
  Globe2, 
  ChevronUp, 
  Sparkles, 
  Check, 
  ThumbsUp,
  Info,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

interface TabRankingProps {
  foods: FoodItem[];
  user: UserProfile;
  isAuthenticated: boolean;
  onVote: (foodId: string) => void;
  onRequireAuth: (reason: 'vote' | 'royal') => void;
  onSelectFoodDetail: (food: FoodItem) => void;
}

export const TabRanking: React.FC<TabRankingProps> = ({
  foods,
  user,
  isAuthenticated,
  onVote,
  onRequireAuth,
  onSelectFoodDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'global_top20'>('global_top20');
  const [searchQuery, setSearchQuery] = useState('');
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  // Filter foods based on category & search
  const filteredFoods = foods.filter((food) => {
    if (selectedCategory === 'global_top20' && !food.isGlobalTop20) {
      return false;
    }
    if (selectedCategory !== 'global_top20' && selectedCategory !== 'all' && food.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        food.name.toLowerCase().includes(q) ||
        food.nameEn.toLowerCase().includes(q) ||
        food.origin.toLowerCase().includes(q) ||
        food.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  }).sort((a, b) => {
    // Total weighted score = regularVotes + (royalVotes * 2)
    const scoreA = a.regularVotes + a.royalVotes * 2;
    const scoreB = b.regularVotes + b.royalVotes * 2;
    return scoreB - scoreA;
  });

  const handleVoteClick = (foodId: string) => {
    if (!isAuthenticated) {
      onRequireAuth('vote');
      return;
    }
    onVote(foodId);
    setJustVotedId(foodId);
    setTimeout(() => setJustVotedId(null), 1500);
  };

  const topThree = filteredFoods.slice(0, 3);
  const remainingFoods = filteredFoods.slice(3);

  // Visual Spotlight Top Dishes for visual-heavy hero
  const spotlightDishes = foods.slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      {/* Visual Hero Banner: Image-Centric Showcase */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-stone-900 to-amber-950 text-white p-6 sm:p-8 shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Concise Description & Visual Indicators */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>GLOBAL & THAI FOOD AWARDS</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              ทำเนียบสุดยอดอาหาร <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
                Top 20 ทั่วโลก & ไทย
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              ระบบจัดอันดับอาหารโดยคะแนนมหาชน ร่วมกับ <strong className="text-amber-300">Royal Vote 👑 (คะแนนถ่วงน้ำหนัก x2)</strong> คัดสรรความอร่อยแท้จริงทุก 2 เดือน
            </p>

            {/* Quick Visual Chips */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                <Crown className="w-4 h-4 text-amber-400" />
                Royal Vote x2
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                <Calendar className="w-4 h-4 text-orange-400" />
                รีเซ็ตทุก 2 เดือน (เหลือ 24 วัน)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                77 จังหวัด & ทั่วโลก
              </span>
            </div>
          </div>

          {/* Right: Visual Image Collage Grid (Less Text, More Visual Pictures!) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            {spotlightDishes.map((dish, i) => (
              <div
                key={dish.id}
                onClick={() => onSelectFoodDetail(dish)}
                className="group relative h-32 sm:h-36 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/15 transition-transform hover:scale-103 hover:border-amber-400"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow">
                      #{i + 1}
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold">
                      {(dish.regularVotes + dish.royalVotes * 2).toLocaleString()} pt
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm truncate mt-1">{dish.name}</h4>
                  <span className="text-[10px] text-slate-300 truncate">{dish.origin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="ranking-cat-top20"
            onClick={() => setSelectedCategory('global_top20')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategory === 'global_top20'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>🌍 Top 20 ทั่วโลก</span>
          </button>

          <button
            id="ranking-cat-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            ทั้งหมด
          </button>

          <button
            id="ranking-cat-soup"
            onClick={() => setSelectedCategory('soup_curry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'soup_curry'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            🍲 ต้ม & แกง
          </button>

          <button
            id="ranking-cat-stirfry"
            onClick={() => setSelectedCategory('stirfry_fry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'stirfry_fry'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            🍳 ผัด & ทอด
          </button>

          <button
            id="ranking-cat-single"
            onClick={() => setSelectedCategory('single_dish')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'single_dish'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            🍜 จานเดียว & เส้น
          </button>

          <button
            id="ranking-cat-street"
            onClick={() => setSelectedCategory('street_food')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'street_food'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            🍢 สตรีทฟู้ด
          </button>

          <button
            id="ranking-cat-dessert"
            onClick={() => setSelectedCategory('dessert_cafe')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'dessert_cafe'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            🍧 ของหวาน & คาเฟ่
          </button>

          <button
            id="ranking-cat-international"
            onClick={() => setSelectedCategory('international')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'international'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-[#0f1422] text-slate-300 hover:bg-[#171f33] border border-slate-800'
            }`}
          >
            🍕 อาหารนานาชาติ
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="ranking-search-input"
            type="text"
            placeholder="ค้นหาชื่ออาหาร, สัญชาติ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#0f1422] border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs text-white placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* TOP 3 PODIUM (Rank #1, #2, #3) */}
      {topThree.length >= 3 && !searchQuery && (
        <section className="bg-gradient-to-b from-[#111626] to-[#090c14] dark:from-[#111626] dark:to-[#090c14] p-6 rounded-3xl border border-slate-800/80 shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>โพเดียม 3 อันดับสูงสุดประจำรอบ (The Golden Trio)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              คะแนนคำนวณจาก General Vote + (Royal Vote x2) แบบเรียลไทม์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
            {/* #2 Silver (Left) */}
            <div className="order-2 md:order-1 bg-[#101422] rounded-2xl p-5 border-2 border-slate-700/80 shadow-sm relative flex flex-col items-center text-center">
              <div className="absolute -top-4 bg-slate-700 text-slate-100 text-xs font-black px-3 py-1 rounded-full shadow-xs flex items-center gap-1 border border-slate-600">
                🥈 อันดับ 2 (เหรียญเงิน)
              </div>
              <img
                src={topThree[1].image}
                alt={topThree[1].name}
                className="w-28 h-28 rounded-2xl object-cover shadow-md mt-3 mb-3 border-2 border-slate-700"
              />
              <span className="text-[11px] text-orange-400 font-bold bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-800/50">
                {topThree[1].origin}
              </span>
              <h3 className="font-bold text-white text-sm mt-1.5 line-clamp-1">{topThree[1].name}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">{topThree[1].nameEn}</p>

              {/* Vote Breakdown */}
              <div className="w-full my-3 p-2.5 bg-[#0b0e18] rounded-xl text-xs space-y-1 border border-slate-800">
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>👥 General:</span>
                  <span className="font-bold text-white">{topThree[1].regularVotes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-400 text-[11px]">
                  <span className="flex items-center gap-1">👑 Royal:</span>
                  <span className="font-extrabold">{topThree[1].royalVotes.toLocaleString()}</span>
                </div>
              </div>

              <button
                id={`ranking-vote-btn-${topThree[1].id}`}
                onClick={() => handleVoteClick(topThree[1].id)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  user.votedFoodIds.includes(topThree[1].id)
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : user.isRoyal
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:opacity-95'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {user.votedFoodIds.includes(topThree[1].id) ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>คุณโหวตแล้ว</span>
                  </>
                ) : (
                  <>
                    {user.isRoyal ? <Crown className="w-3.5 h-3.5" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                    <span>{user.isRoyal ? 'Royal Vote (x2)' : 'กดโหวต'}</span>
                  </>
                )}
              </button>
            </div>

            {/* #1 Gold (Center - taller) */}
            <div className="order-1 md:order-2 bg-gradient-to-b from-[#1e1910] via-[#141724] to-[#0a0d16] rounded-3xl p-6 border-3 border-amber-400/90 shadow-xl shadow-amber-500/10 relative flex flex-col items-center text-center -mt-4">
              <div className="absolute -top-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Crown className="w-4 h-4 fill-white" />
                <span>🥇 อันดับ 1 (แชมเปี้ยนประจำซีซัน)</span>
              </div>
              <img
                src={topThree[0].image}
                alt={topThree[0].name}
                className="w-36 h-36 rounded-2xl object-cover shadow-lg mt-4 mb-3 border-4 border-amber-400 ring-4 ring-amber-500/20"
              />
              <span className="text-xs text-amber-300 font-black bg-amber-900/60 px-2.5 py-0.5 rounded-md border border-amber-700/60">
                {topThree[0].origin}
              </span>
              <h3 className="font-black text-white text-base mt-2">{topThree[0].name}</h3>
              <p className="text-xs text-slate-400">{topThree[0].nameEn}</p>
              <p className="text-xs text-slate-300 line-clamp-2 mt-1 px-2">{topThree[0].description}</p>

              {/* Vote Breakdown */}
              <div className="w-full my-3 p-3 bg-[#0b0e18] rounded-2xl border border-amber-800/60 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-300 text-xs">
                  <span>👥 General Vote:</span>
                  <span className="font-bold text-white">{topThree[0].regularVotes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-300 text-xs font-bold">
                  <span className="flex items-center gap-1 text-amber-400">👑 Royal Vote:</span>
                  <span className="font-black text-amber-300">{topThree[0].royalVotes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-amber-800/60 pt-1 text-xs font-black text-amber-400">
                  <span>รวมคะแนนถ่วงน้ำหนัก:</span>
                  <span>{(topThree[0].regularVotes + topThree[0].royalVotes * 2).toLocaleString()} pt</span>
                </div>
              </div>

              <button
                id={`ranking-vote-btn-${topThree[0].id}`}
                onClick={() => handleVoteClick(topThree[0].id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  user.votedFoodIds.includes(topThree[0].id)
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : user.isRoyal
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30 hover:scale-102'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md'
                }`}
              >
                {user.votedFoodIds.includes(topThree[0].id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>คุณโหวตแชมป์จานนี้แล้ว</span>
                  </>
                ) : (
                  <>
                    {user.isRoyal ? <Crown className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                    <span>{user.isRoyal ? 'โหวตให้แชมป์ (Royal x2 👑)' : 'โหวตให้แชมป์จานนี้'}</span>
                  </>
                )}
              </button>
            </div>

            {/* #3 Bronze (Right) */}
            <div className="order-3 bg-[#101422] rounded-2xl p-5 border-2 border-amber-800/60 shadow-sm relative flex flex-col items-center text-center">
              <div className="absolute -top-4 bg-amber-900 text-amber-200 text-xs font-black px-3 py-1 rounded-full shadow-xs flex items-center gap-1 border border-amber-700">
                🥉 อันดับ 3 (เหรียญทองแดง)
              </div>
              <img
                src={topThree[2].image}
                alt={topThree[2].name}
                className="w-28 h-28 rounded-2xl object-cover shadow-md mt-3 mb-3 border-2 border-amber-700/60"
              />
              <span className="text-[11px] text-orange-400 font-bold bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-800/50">
                {topThree[2].origin}
              </span>
              <h3 className="font-bold text-white text-sm mt-1.5 line-clamp-1">{topThree[2].name}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">{topThree[2].nameEn}</p>

              {/* Vote Breakdown */}
              <div className="w-full my-3 p-2.5 bg-[#0b0e18] rounded-xl text-xs space-y-1 border border-slate-800">
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>👥 General:</span>
                  <span className="font-bold text-white">{topThree[2].regularVotes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-400 text-[11px]">
                  <span className="flex items-center gap-1">👑 Royal:</span>
                  <span className="font-extrabold">{topThree[2].royalVotes.toLocaleString()}</span>
                </div>
              </div>

              <button
                id={`ranking-vote-btn-${topThree[2].id}`}
                onClick={() => handleVoteClick(topThree[2].id)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  user.votedFoodIds.includes(topThree[2].id)
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : user.isRoyal
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:opacity-95'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {user.votedFoodIds.includes(topThree[2].id) ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>คุณโหวตแล้ว</span>
                  </>
                ) : (
                  <>
                    {user.isRoyal ? <Crown className="w-3.5 h-3.5" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                    <span>{user.isRoyal ? 'Royal Vote (x2)' : 'กดโหวต'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Complete Rankings List Table / Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>
              ตารางอันดับเมนูอาหาร ({filteredFoods.length} รายการ)
            </span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            แสดงผลโหวตแยกตามคำสั่ง: Royal Vote 👑 vs General Vote 👥
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredFoods.map((food, index) => {
            const hasVoted = user.votedFoodIds.includes(food.id);
            const totalScore = food.regularVotes + food.royalVotes * 2;
            const rankDisplay = index + 1;

            return (
              <div
                key={food.id}
                className={`bg-[#0d111d] rounded-2xl p-4 border transition-all hover:bg-[#131828] hover:shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  hasVoted ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800'
                }`}
              >
                {/* Left: Rank & Image & Info */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 text-center shrink-0">
                    <span className={`text-base sm:text-lg font-black ${
                      rankDisplay === 1 ? 'text-amber-400' :
                      rankDisplay === 2 ? 'text-slate-300' :
                      rankDisplay === 3 ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      #{rankDisplay}
                    </span>
                  </div>

                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-750 cursor-pointer hover:opacity-90"
                    onClick={() => onSelectFoodDetail(food)}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-800/50">
                        {food.origin}
                      </span>
                      {food.isGlobalTop20 && (
                        <span className="text-[10px] font-extrabold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded-md border border-blue-800/50">
                          TOP 20 โลก
                        </span>
                      )}
                      {food.calories && (
                        <span className="text-[10px] text-slate-400">
                          {food.calories} kcal
                        </span>
                      )}
                    </div>

                    <h4 
                      onClick={() => onSelectFoodDetail(food)}
                      className="text-sm sm:text-base font-bold text-white truncate hover:text-orange-400 cursor-pointer mt-0.5"
                    >
                      {food.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{food.nameEn}</p>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {food.flavorProfile.slice(0, 2).map((flv, idx) => (
                        <span key={idx} className="text-[10px] text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
                          #{flv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Detailed Vote Breakdown & Vote Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  {/* Detailed Vote Counts Box */}
                  <div className="text-right text-xs">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-slate-400 text-[11px]">👥 คนทั่วไป:</span>
                      <span className="font-bold text-slate-200">{food.regularVotes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end text-amber-400 font-semibold">
                      <span className="flex items-center gap-0.5 text-amber-400 text-[11px]">
                        <Crown className="w-3 h-3 inline" /> Royal:
                      </span>
                      <span className="font-extrabold text-amber-300">{food.royalVotes.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-orange-400 font-bold">
                      รวม: {totalScore.toLocaleString()} pt
                    </div>
                  </div>

                  {/* Vote button */}
                  <button
                    id={`ranking-table-vote-${food.id}`}
                    onClick={() => handleVoteClick(food.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                      hasVoted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : user.isRoyal
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {hasVoted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>โหวตแล้ว</span>
                      </>
                    ) : user.isRoyal ? (
                      <>
                        <Crown className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                        <span>Royal Vote</span>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>โหวต</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
