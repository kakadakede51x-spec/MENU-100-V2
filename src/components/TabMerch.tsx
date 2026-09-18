import React, { useState } from 'react';
import { MerchItem, UserProfile } from '../types';
import { MERCH_PRODUCTS } from '../data/mockData';
import { 
  ShoppingBag, 
  Crown, 
  Sparkles, 
  QrCode, 
  CreditCard, 
  Check, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Flame,
  ArrowRight
} from 'lucide-react';

interface TabMerchProps {
  onAddToCart: (merch: MerchItem, size?: string, color?: string) => void;
  onQuickBuy: (merch: MerchItem, size?: string, color?: string) => void;
  user: UserProfile;
  isAuthenticated: boolean;
  onRequireAuth: (reason: 'merch') => void;
  merchList?: MerchItem[];
}

export const TabMerch: React.FC<TabMerchProps> = ({
  onAddToCart,
  onQuickBuy,
  user,
  isAuthenticated,
  onRequireAuth,
  merchList = MERCH_PRODUCTS,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductDetail, setSelectedProductDetail] = useState<MerchItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '🛍️' },
    { id: 'clothing', name: 'เสื้อผ้า & ผ้ากันเปื้อน', icon: '👕' },
    { id: 'bottle', name: 'ขวดน้ำเก็บความเย็น', icon: '🍶' },
    { id: 'hat', name: 'หมวกแก๊ป', icon: '🧢' },
    { id: 'accessories', name: 'ถุงผ้า & แอคเซสเซอรี่', icon: '👜' },
    { id: 'stickers', name: 'ชุดสติกเกอร์', icon: '✨' },
  ];

  const filteredProducts = (merchList || MERCH_PRODUCTS).filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleAdd = (item: MerchItem) => {
    if (!isAuthenticated) {
      onRequireAuth('merch');
      return;
    }
    const size = selectedSize || (item.sizes ? item.sizes[0] : undefined);
    const color = selectedColor || (item.colors ? item.colors[0] : undefined);
    onAddToCart(item, size, color);
    setAddedNotice(item.name);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  const handleBuyNow = (item: MerchItem) => {
    if (!isAuthenticated) {
      onRequireAuth('merch');
      return;
    }
    const size = selectedSize || (item.sizes ? item.sizes[0] : undefined);
    const color = selectedColor || (item.colors ? item.colors[0] : undefined);
    onQuickBuy(item, size, color);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>menu100 OFFICIAL MERCH STORE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              สินค้า Official จาก <span className="text-orange-400">menu100</span> สำหรับสายกิน
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ของสะสมพรีเมียม เสื้อยืดฟู้ดดี้ ขวดน้ำสุญญากาศ หมวกแก๊ปปักด้ายทอง และผ้ากันเปื้อนเชฟมือทอง รองรับการ <strong className="text-white">สแกนจ่าย QR Code (PromptPay)</strong> และ <strong className="text-white">บัตรเครดิต/เดบิต</strong>
            </p>

            {/* Payment methods badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <QrCode className="w-4 h-4 text-blue-400" />
                <span>สแกนจ่าย PromptPay ทุกธนาคาร</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>บัตรเครดิต Visa / Mastercard</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>ส่งฟรีทั่วประเทศ</span>
              </span>
            </div>
          </div>

          {/* Royal Discount Banner */}
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-md p-5 rounded-2xl border border-amber-400/40 text-center w-full md:w-72 shrink-0 space-y-2 shadow-inner">
            <div className="w-10 h-10 bg-amber-400 text-amber-950 rounded-full mx-auto flex items-center justify-center font-black">
              <Crown className="w-6 h-6 fill-amber-950" />
            </div>
            <h4 className="text-base font-black text-amber-300">สิทธิ์ลด 15% ทันที</h4>
            <p className="text-xs text-slate-200">
              {user.isRoyal 
                ? 'คุณกำลังใช้สิทธิ์ Royal Member ส่วนลดถูกหักอัตโนมัติในทุกคำสั่งซื้อ' 
                : 'สมาชิก Royal Member รับส่วนลดทันที 15% ทุกชิ้น'}
            </p>
            {user.isRoyal ? (
              <span className="inline-block bg-amber-400 text-amber-950 text-[11px] font-black px-3 py-1 rounded-full">
                👑 สิทธิ์ VIP ใช้งานอยู่
              </span>
            ) : (
              <span className="inline-block bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                อัปเกรดเพื่อรับส่วนลด
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Added notice alert */}
      {addedNotice && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>เพิ่ม "{addedNotice}" ลงในตะกร้าสินค้าเรียบร้อยแล้ว</span>
          </div>
        </div>
      )}

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`merch-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                : 'bg-white dark:bg-[#0f1422] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161d30] border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Merch Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const discountPrice = user.isRoyal
            ? Math.round(product.price * (1 - product.royalDiscountPercent / 100))
            : product.price;

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-[#0c101b] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {product.featured && (
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>สินค้ายอดฮิต</span>
                  </span>
                )}

                {user.isRoyal && (
                  <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-950" />
                    <span>ลด 15% (Royal)</span>
                  </span>
                )}
              </div>

              {/* Product Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{product.nameEn}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Sizes & Colors preview */}
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    {product.sizes?.map((size, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-200 dark:border-slate-700">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      {user.isRoyal ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-orange-600 dark:text-orange-400">
                            ฿{discountPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ฿{product.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                          ฿{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      พร้อมส่ง (In Stock)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`merch-add-cart-${product.id}`}
                      onClick={() => handleAdd(product)}
                      className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span>ใส่ตะกร้า</span>
                    </button>

                    <button
                      id={`merch-buy-now-${product.id}`}
                      onClick={() => handleBuyNow(product)}
                      className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>สั่งซื้อทันที</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
