import React, { useState } from 'react';
import { UserProfile, AuthGateReason } from '../types';
import { dbService } from '../services/dbService';
import { 
  Lock, 
  User, 
  KeyRound, 
  CheckCircle2, 
  Crown, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Utensils,
  X,
  Vote,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';

interface AuthGateModalProps {
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
  reason?: AuthGateReason;
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({ 
  onLoginSuccess,
  onClose,
  reason = 'general'
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRoyalSignup, setIsRoyalSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getReasonInfo = () => {
    switch (reason) {
      case 'vote':
        return {
          icon: <Vote className="w-5 h-5 text-amber-500" />,
          title: 'ต้องเข้าสู่ระบบเพื่อร่วมโหวตอาหาร',
          desc: 'การโหวตจัดอันดับเมนูยอดเยี่ยมระดับโลกและประเทศไทย สงวนสิทธิ์สำหรับสมาชิกที่มีบัญชีเท่านั้น'
        };
      case 'merch':
        return {
          icon: <ShoppingBag className="w-5 h-5 text-orange-500" />,
          title: 'ต้องเข้าสู่ระบบเพื่อสั่งซื้อสินค้า',
          desc: 'กรุณาเข้าสู่ระบบหรือสมัครสมาชิก เพื่อบันทึกคำสั่งซื้อสินค้าที่ระลึกและรับส่วนลดพิเศษ'
        };
      case 'forum':
        return {
          icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
          title: 'ต้องเข้าสู่ระบบเพื่อแสดงความคิดเห็น',
          desc: 'กรุณาเข้าสู่ระบบเพื่อร่วมตั้งกระทู้รีวิวร้านเด็ดและคอมเมนต์แลกเปลี่ยนกับเพื่อนนักชิม'
        };
      case 'membership':
        return {
          icon: <Crown className="w-5 h-5 text-amber-500 fill-amber-300" />,
          title: 'ต้องเข้าสู่ระบบเพื่อสมัคร Royal Member',
          desc: 'เข้าสู่ระบบบัญชีของคุณก่อนเพื่อรับสิทธิพิเศษคะแนนโหวต x2 และสติกเกอร์จักรพรรดิ'
        };
      default:
        return {
          icon: <Lock className="w-5 h-5 text-amber-500" />,
          title: 'ยินดีต้อนรับสู่ menu100',
          desc: 'เข้าสู่ระบบหรือสมัครไอดี เพื่อใช้งานฟังก์ชันโหวต ซื้อของ และร่วมคอมเมนต์อย่างเต็มรูปแบบ'
        };
    }
  };

  const reasonInfo = getReasonInfo();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    const cleanDisplayName = displayName.trim() || cleanUsername;

    if (!cleanUsername) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้งาน (Username)');
      return;
    }

    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    // Register via Database Service
    const res = dbService.registerUser(cleanUsername, password, cleanDisplayName);
    if (!res.success) {
      setErrorMessage(res.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      return;
    }

    if (res.user) {
      if (isRoyalSignup) {
        dbService.updateUserRoyalStatus(cleanUsername, true);
        res.user.isRoyal = true;
      }
      onLoginSuccess(res.user);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }

    const res = dbService.loginUser(cleanUsername, password);
    if (!res.success) {
      setErrorMessage(res.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      return;
    }

    if (res.user) {
      onLoginSuccess(res.user);
    }
  };

  // Quick preset login for teacher / demo review
  const handleQuickEnter = (role: 'foodie' | 'admin') => {
    if (role === 'admin') {
      const res = dbService.loginUser('admin', 'admin100password');
      if (res.user) {
        onLoginSuccess(res.user);
        return;
      }
    } else {
      const res = dbService.loginUser('somchai_foodie', 'somchai@pass2026');
      if (res.user) {
        onLoginSuccess(res.user);
        return;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 my-8 transition-colors relative">
        {/* Close Button (Allows browsing as Guest) */}
        {onClose && (
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            title="ปิดหน้าต่างและดูต่อแบบผู้เยี่ยมชม (Guest)"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Top Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 p-6 text-white text-center relative border-b border-amber-500/30">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg mb-3">
            m100
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>menu</span><span className="text-amber-400">100</span>
          </h2>

          {/* Action-Specific Notification Pill */}
          <div className="mt-3 p-3 bg-white/10 dark:bg-black/30 rounded-2xl border border-white/15 text-left flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-amber-500/20 shrink-0 mt-0.5">
              {reasonInfo.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                {reasonInfo.title}
              </div>
              <div className="text-[11px] text-slate-300 leading-snug mt-0.5">
                {reasonInfo.desc}
              </div>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-white/10 rounded-2xl border border-white/10">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                !isRegisterMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              เข้าสู่ระบบ (Login)
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                isRegisterMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              สมัครไอดีใหม่ (Register)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isRegisterMode ? (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อผู้ใช้งาน (Username) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="register-input-username"
                    type="text"
                    required
                    placeholder="เช่น somchai_foodie"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อเล่น / ชื่อที่ใช้แสดงในเว็บ
                </label>
                <input
                  id="register-input-display-name"
                  type="text"
                  placeholder="เช่น สมชาย สายกินเนื้อ"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  รหัสผ่าน (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="register-input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="รหัสผ่านอย่างน้อย 4 ตัวอักษร"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ยืนยันรหัสผ่าน (Confirm Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="register-input-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="พิมพ์รหัสผ่านอีกครั้งให้ตรงกัน"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Royal Member Perks Selection */}
              <div 
                onClick={() => setIsRoyalSignup(!isRoyalSignup)}
                className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 cursor-pointer flex items-center justify-between hover:bg-amber-100/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-amber-600 fill-amber-300 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-amber-950 dark:text-amber-200 block">
                      เปิดสิทธิ์ Royal Member 👑 ทันที (สิทธิ์ทดลอง)
                    </span>
                    <span className="text-[11px] text-amber-800 dark:text-amber-300">
                      ได้คะแนนโหวต Royal Vote (x2) และสติกเกอร์ VIP
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isRoyalSignup}
                  onChange={() => {}}
                  className="w-4 h-4 text-orange-600 rounded-md border-amber-400 focus:ring-orange-500"
                />
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-600/30 transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันการสมัคร & บันทึกลง Database</span>
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อผู้ใช้งาน (Username)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-input-username"
                    type="text"
                    required
                    placeholder="เช่น somchai_foodie หรือ admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  รหัสผ่าน (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="กรอกรหัสผ่านของคุณ"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-600/30 transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
            </form>
          )}

          {/* Quick Demo Entrance for Teacher / Review */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ⚡ บัญชีทดสอบที่บันทึกอยู่ใน Database แล้ว:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="auth-quick-user-btn"
                type="button"
                onClick={() => handleQuickEnter('foodie')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <Utensils className="w-3.5 h-3.5 text-orange-600" />
                <span>somchai_foodie</span>
              </button>
              <button
                id="auth-quick-admin-btn"
                type="button"
                onClick={() => handleQuickEnter('admin')}
                className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 text-[11px] font-bold border border-amber-300 dark:border-amber-700 transition-colors flex items-center justify-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>admin (ผู้ดูแลระบบ)</span>
              </button>
            </div>

            {/* Browse as guest link */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline pt-1 block mx-auto"
              >
                กลับไปดูหน้าหลักต่อแบบผู้เยี่ยมชม (Guest Mode)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

