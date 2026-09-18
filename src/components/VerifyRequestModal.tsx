import React, { useState } from 'react';
import { X, Star, Store, ShieldCheck, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { PROVINCES_DATA } from '../data/mockData';

interface VerifyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: any) => void;
}

export const VerifyRequestModal: React.FC<VerifyRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [provinceId, setProvinceId] = useState('bangkok');
  const [cuisine, setCuisine] = useState('');
  const [phone, setPhone] = useState('');
  const [isSme, setIsSme] = useState(true);
  const [highlightDishes, setHighlightDishes] = useState('');
  const [story, setStory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess({
        restaurantName,
        provinceId,
        cuisine,
        phone,
        isSme,
        highlightDishes,
        story,
      });
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 text-white relative">
          <button
            id="verify-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black">ยื่นขอรับการ Verify ร้านอาหาร (1-5 ดาว)</h3>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  OFFICIAL
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                โดยทีมผู้ทรงคุณวุฒิ menu100 เพื่อติดป้ายการันตีและโปรโมทสู่ระดับประเทศ
              </p>
            </div>
          </div>
        </div>

        {/* Verification Star Criteria Info */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-200/70">
          <h4 className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            เกณฑ์การประเมินดาว menu100 Verified (1 - 5 ดาว):
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-amber-950">
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="font-bold block text-orange-600">⭐ 1 ดาว</span>
              <span>สะอาด ถูกสุขอนามัย รสชาติดีมาตรฐาน</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="font-bold block text-orange-600">⭐⭐ 2 ดาว</span>
              <span>รสชาติเป็นเอกลักษณ์ วัตถุดิบสดใหม่</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="font-bold block text-orange-600">⭐⭐⭐ 3 ดาว</span>
              <span>ร้านเด็ดประจำจังหวัด คุ้มค่าคู่ควรแวะ</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="font-bold block text-orange-600">⭐⭐⭐⭐ 4 ดาว</span>
              <span>ระดับภูมิภาค โดดเด่น สูตรเฉพาะตัว</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="font-bold block text-orange-600">⭐⭐⭐⭐⭐ 5 ดาว</span>
              <span>ตำนานระดับประเทศ รสชาติยอดเยี่ยมไร้ที่ติ</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อร้านอาหาร <span className="text-red-500">*</span>
              </label>
              <input
                id="verify-form-input-name"
                type="text"
                required
                placeholder="เช่น ครัวยายทอง ก๋วยเตี๋ยวต้มยำโบราณ"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                จังหวัดที่ตั้ง <span className="text-red-500">*</span>
              </label>
              <select
                id="verify-form-select-province"
                value={provinceId}
                onChange={(e) => setProvinceId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {PROVINCES_DATA.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.signatureDish})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ประเภทอาหาร / สัญชาติ
              </label>
              <input
                id="verify-form-input-cuisine"
                type="text"
                placeholder="เช่น อาหารไทยปักษ์ใต้ / สตรีทฟู้ดรอบดึก"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เบอร์โทรศัพท์ติดต่อ <span className="text-red-500">*</span>
              </label>
              <input
                id="verify-form-input-phone"
                type="tel"
                required
                placeholder="เช่น 081-xxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เมนูไฮไลต์เด็ด (คั่นด้วยจุลภาค)
            </label>
            <input
              id="verify-form-input-highlights"
              type="text"
              placeholder="เช่น แกงคั่วปูใบชะพลู, หมูฮ้องสูตรคุณยาย, กุ้งทอดซอสมะขาม"
              value={highlightDishes}
              onChange={(e) => setHighlightDishes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เรื่องราวความเป็นมาของร้าน หรือความใส่ใจในวัตถุดิบ
            </label>
            <textarea
              id="verify-form-input-story"
              rows={3}
              placeholder="เล่าจุดเด่น สูตรลับเฉพาะ หรือความตั้งใจของร้าน..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* SME Checkbox */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-3">
            <input
              id="verify-form-checkbox-sme"
              type="checkbox"
              checked={isSme}
              onChange={(e) => setIsSme(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
            />
            <label htmlFor="verify-form-checkbox-sme" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold text-slate-900 block">ร้านของฉันเป็น SME รายย่อย / ร้านท้องถิ่นชุมชน</span>
              menu100 มีโครงการสนับสนุนพื้นที่สื่อฟรี ดันร้านติดอันดับ Top 10 ของจังหวัดและระดับภูมิภาค
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="verify-modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              id="verify-form-submit-btn"
              type="submit"
              disabled={submitted}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  <span>กำลังส่งข้อมูลเข้าสู่ระบบตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ส่งคำขอตรวจสอบ Verify (ฟรีไม่มีค่าใช้จ่าย)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
