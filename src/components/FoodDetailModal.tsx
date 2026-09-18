import React from 'react';
import { FoodItem, UserProfile } from '../types';
import { X, Crown, Flame, ThumbsUp, Check, Globe2, Sparkles, Scale } from 'lucide-react';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
  user: UserProfile;
  onVote: (id: string) => void;
  isAuthenticated?: boolean;
  onRequireAuth?: (reason: 'vote') => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  onClose,
  user,
  onVote,
  isAuthenticated = true,
  onRequireAuth,
}) => {
  if (!food) return null;

  const hasVoted = user.votedFoodIds.includes(food.id);
  const totalScore = food.regularVotes + food.royalVotes * 2;

  const handleVoteClick = () => {
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth('vote');
      return;
    }
    onVote(food.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <button
            id="food-detail-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>อันดับ #{food.rank} ของโลก</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 px-2.5 py-0.5 rounded-md">
                {food.origin}
              </span>
              {food.calories && (
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {food.calories} แคลอรี
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">{food.name}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">{food.nameEn}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">{food.description}</p>
          </div>

          {/* Flavor Profiles */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">มิติด้านรสชาติ (Flavor Profile):</h5>
            <div className="flex flex-wrap gap-1.5">
              {food.flavorProfile.map((flv, idx) => (
                <span key={idx} className="text-xs bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl font-bold">
                  ✨ {flv}
                </span>
              ))}
            </div>
          </div>

          {/* Vote Counts Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="font-bold text-slate-700 dark:text-slate-200">สถิติการโหวตในซีซันปัจจุบัน:</div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>👥 คะแนนโหวตคนธรรมดา (General Vote):</span>
              <span className="font-bold">{food.regularVotes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-amber-900 dark:text-amber-300 font-bold">
              <span className="flex items-center gap-1">👑 คะแนนโหวต Royal Vote (x2):</span>
              <span className="font-extrabold">{food.royalVotes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5 font-black text-orange-600 dark:text-orange-400 text-sm">
              <span>คะแนนรวมถ่วงน้ำหนัก:</span>
              <span>{totalScore.toLocaleString()} pt</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              ปิดหน้าต่าง
            </button>

            <button
              id={`food-detail-vote-btn-${food.id}`}
              onClick={handleVoteClick}
              className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all ${
                hasVoted
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : user.isRoyal
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {hasVoted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>คุณโหวตแล้ว</span>
                </>
              ) : (
                <>
                  {user.isRoyal ? <Crown className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
                  <span>{user.isRoyal ? 'Royal Vote (x2)' : 'กดโหวตอาหารนี้'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
