import React, { useState } from 'react';
import { CartItem, UserProfile, OrderRecord, MerchItem } from '../types';
import { dbService } from '../services/dbService';
import { 
  X, 
  Trash2, 
  QrCode, 
  CreditCard, 
  Crown, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Lock
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  user: UserProfile;
  isAuthenticated?: boolean;
  onRequireAuth?: (reason: 'merch') => void;
  onOrderCompleted?: (updatedMerch?: MerchItem[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  isAuthenticated = true,
  onRequireAuth,
  onOrderCompleted,
}) => {
  const [paymentStep, setPaymentStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'credit_card'>('promptpay');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  if (!isOpen) return null;

  const rawTotal = cart.reduce((sum, item) => sum + item.merch.price * item.quantity, 0);
  const discountAmount = user.isRoyal ? Math.round(rawTotal * 0.15) : 0;
  const grandTotal = rawTotal - discountAmount;

  const handleProceedCheckout = () => {
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth('merch');
      return;
    }
    setPaymentStep('checkout');
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Record real order into dbService & adjust stock automatically
      try {
        const newOrder: OrderRecord = {
          id: `ORD-${Date.now().toString().slice(-6)}`,
          customerUsername: user.username || 'user',
          customerName: user.name || 'ลูกค้า',
          items: cart.map((c) => ({
            merchId: c.merch.id,
            merchName: c.merch.name,
            quantity: c.quantity,
            pricePerUnit: c.merch.price,
            size: c.selectedSize,
            color: c.selectedColor,
          })),
          totalAmount: grandTotal,
          discountAmount,
          paymentMethod,
          orderStatus: 'shipped',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        };
        dbService.createOrder(newOrder);
        if (onOrderCompleted) {
          onOrderCompleted(dbService.getMerch());
        }
      } catch (err) {
        console.error('Failed to create order', err);
      }

      setIsProcessing(false);
      setPaymentStep('success');
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col relative z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="font-bold text-slate-800 dark:text-white">ตะกร้าสินค้า Merch ของคุณ</h3>
            <span className="text-xs bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-bold px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              {cart.reduce((s, i) => s + i.quantity, 0)} ชิ้น
            </span>
          </div>
          <button
            id="cart-drawer-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {paymentStep === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-3 opacity-40 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-600">ตะกร้ายังว่างอยู่</p>
                  <p className="text-xs text-slate-400 mt-1">เลือกเสื้อผ้า หมวก หรือขวดน้ำลายเท่ๆ ได้ในแท็บ Merch</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item.merch.id} 
                      className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl items-center"
                    >
                      <img 
                        src={item.merch.image} 
                        alt={item.merch.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.merch.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {item.selectedSize ? `ขนาด: ${item.selectedSize}` : ''} 
                          {item.selectedColor ? ` | สี: ${item.selectedColor}` : ''}
                        </p>
                        <div className="text-xs font-extrabold text-orange-600 mt-1">
                          ฿{item.merch.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity counter */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                        <button
                          id={`cart-item-minus-${item.merch.id}`}
                          onClick={() => onUpdateQuantity(item.merch.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          id={`cart-item-plus-${item.merch.id}`}
                          onClick={() => onUpdateQuantity(item.merch.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        id={`cart-item-remove-${item.merch.id}`}
                        onClick={() => onRemoveItem(item.merch.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Royal Discount Announcement */}
              {user.isRoyal ? (
                <div className="p-3 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-2xl flex items-center gap-3">
                  <Crown className="w-6 h-6 text-amber-600 fill-amber-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-950">สิทธิพิเศษ Royal Member ลดทันที 15%</p>
                    <p className="text-amber-800 text-[11px]">คุณประหยัดได้ ฿{discountAmount.toLocaleString()} ในออเดอร์นี้</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>อัปเกรดเป็น Royal รับส่วนลด 15% ทันที</span>
                  </div>
                </div>
              )}
            </>
          )}

          {paymentStep === 'checkout' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>ยอดสินค้า ({cart.reduce((s, i) => s + i.quantity, 0)} ชิ้น)</span>
                  <span>฿{rawTotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-amber-700 font-bold mb-1">
                    <span>ส่วนลด Royal Member (-15%)</span>
                    <span>-฿{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-600 mb-2">
                  <span>ค่าจัดส่ง (ด่วน Flash / Kerry)</span>
                  <span className="text-emerald-600 font-bold">ฟรี</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>ยอดชำระสุทธิ</span>
                  <span className="text-orange-600 text-base">฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  เลือกช่องทางการชำระเงิน:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="checkout-method-promptpay"
                    type="button"
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'promptpay'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                      <QrCode className="w-4 h-4 text-blue-700" />
                      <span>สแกนจ่าย QR</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">พร้อมเพย์ / ทุกแอปธนาคาร</span>
                  </button>

                  <button
                    id="checkout-method-creditcard"
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>บัตรเครดิต</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">Visa / Mastercard / JCB</span>
                  </button>
                </div>
              </div>

              {/* PromptPay View */}
              {paymentMethod === 'promptpay' && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-3">
                  <div className="inline-flex items-center gap-2 bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/40">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Thai QR Payment (PromptPay)</span>
                  </div>

                  {/* QR Box */}
                  <div className="bg-white p-4 rounded-xl max-w-[200px] mx-auto shadow-inner text-slate-900">
                    <div className="border-4 border-slate-900 p-2 rounded-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY_MENU100_AMOUNT_${grandTotal}`}
                        alt="Thai QR PromptPay"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 mt-1">สแกนเพื่อจ่าย ฿{grandTotal.toLocaleString()}</p>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    เปิดแอปธนาคารใดก็ได้ สแกน QR เพื่อชำระเงินแบบอัตโนมัติ
                  </p>
                </div>
              )}

              {/* Credit Card View */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">ชื่อผู้ถือบัตร</label>
                    <input
                      id="checkout-card-name"
                      type="text"
                      placeholder="SOMCHAI TASTE"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">หมายเลขบัตรเครดิต</label>
                    <input
                      id="checkout-card-number"
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">วันหมดอายุ (MM/YY)</label>
                      <input
                        id="checkout-card-exp"
                        type="text"
                        placeholder="12/28"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">CVV / CVC</label>
                      <input
                        id="checkout-card-cvv"
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>การชำระเงินปลอดภัยด้วยการเข้ารหัส SSL 256-bit</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-600 shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900">ชำระเงินสำเร็จแล้ว!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                ขอบคุณที่สนับสนุน Merch ของ menu100 สินค้ากำลังถูกจัดส่งไปยังที่อยู่ของคุณ พร้อมรับสติกเกอร์ลิมิเต็ดฟรีในกล่อง
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs inline-block text-left">
                <div className="font-mono text-slate-500 text-[11px]">รหัสคำสั่งซื้อ: #MN100-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div className="text-emerald-700 font-bold mt-0.5">สถานะ: ชำระเรียบร้อย (เตรียมจัดส่ง)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {paymentStep === 'cart' && cart.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                <span>ยอดรวมทั้งหมด:</span>
                <span className="text-xl text-orange-600 dark:text-orange-400">฿{grandTotal.toLocaleString()}</span>
              </div>
              <button
                id="cart-proceed-checkout-btn"
                onClick={handleProceedCheckout}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm shadow-md shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
              >
                {!isAuthenticated && <Lock className="w-4 h-4" />}
                <span>{isAuthenticated ? 'ดำเนินการสั่งซื้อ & ชำระเงิน' : 'เข้าสู่ระบบเพื่อดำเนินการสั่งซื้อ'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {paymentStep === 'checkout' && (
            <div className="space-y-2">
              <button
                id="checkout-confirm-payment-btn"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังตรวจสอบยอดชำระ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>ยืนยันการชำระเงิน ฿{grandTotal.toLocaleString()}</span>
                  </>
                )}
              </button>
              <button
                id="checkout-back-to-cart-btn"
                onClick={() => setPaymentStep('cart')}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                ย้อนกลับไปแก้ไขสินค้า
              </button>
            </div>
          )}

          {paymentStep === 'success' && (
            <button
              id="checkout-finish-btn"
              onClick={() => {
                setPaymentStep('cart');
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm transition-colors"
            >
              เสร็จสิ้น / กลับสู่หน้าหลัก
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
