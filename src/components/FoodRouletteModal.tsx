import React, { useState } from 'react';
import { FoodItem } from '../types';
import { X, Dice5, Sparkles, Flame, CheckCircle, RefreshCw } from 'lucide-react';

interface FoodRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
}

export const FoodRouletteModal: React.FC<FoodRouletteModalProps> = ({
  isOpen,
  onClose,
  foods,
  onSelectFood,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    setIsSpinning(true);
    setSelectedFood(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * foods.length);
      setSelectedFood(foods[randomIndex]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalFood = foods[Math.floor(Math.random() * foods.length)];
        setSelectedFood(finalFood);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header pattern */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 p-6 text-white text-center relative">
          <button
            id="roulette-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Dice5 className={`w-8 h-8 text-white ${isSpinning ? 'animate-spin' : ''}`} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">วันนี้กินอะไรดี? (เมนูสุ่ม 1 ใน 100)</h2>
          <p className="text-orange-100 text-xs mt-1">
            หมดปัญหาคิดไม่ออก! ให้ระบบ AI & Randomizer ของ menu100 คัดสรรเมนูเด็ดให้คุณ
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 text-center">
          {selectedFood ? (
            <div className="space-y-4">
              <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-amber-400 group">
                <img 
                  src={selectedFood.image} 
                  alt={selectedFood.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>อันดับ #{selectedFood.rank}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  {selectedFood.origin}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedFood.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedFood.nameEn}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 px-4">
                  {selectedFood.description}
                </p>
              </div>

              {/* Flavor tags */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {selectedFood.flavorProfile.map((flv, idx) => (
                  <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                    #{flv}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="roulette-btn-spin-again"
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>สุ่มใหม่อีกที</span>
                </button>

                <button
                  id="roulette-btn-select-food"
                  onClick={() => {
                    onSelectFood(selectedFood);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/30"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>เลือกเมนูนี้เลย!</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-4">
              <div className="w-20 h-20 bg-amber-50 rounded-full mx-auto flex items-center justify-center border-2 border-dashed border-amber-300">
                <Sparkles className="w-10 h-10 text-amber-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">พร้อมทายใจมื้ออร่อยของคุณแล้วหรือยัง?</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  กดปุ่มด้านล่างเพื่อเริ่มการสุ่มเมนูเด็ดจาก Top 100 อันดับเมนูแนะนำ
                </p>
              </div>

              <button
                id="roulette-btn-start-spin"
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <Dice5 className="w-5 h-5" />
                <span>กดสุ่มเมนูมื้อนี้ทันที!</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
