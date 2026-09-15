import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowLeft,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ScreenType, UserProfile } from '../types';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onNavigate,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Loading & feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Demo Account (1-click test)
  const handleQuickDemo = () => {
    setIsSubmitting(true);
    setSuccessMsg('Đang đăng nhập tài khoản mẫu...');
    setTimeout(() => {
      setIsSubmitting(false);
      const demoUser: UserProfile = {
        id: 'user-sarah',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@2hand.vn',
        phone: '0988 123 456',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        isVerified: true,
        walletBalance: 24500000,
        escrowPending: 4200000,
        itemsSold: 28,
        itemsListed: 6,
        rating: 4.98,
        reviewCount: 54,
        joinedDate: '03/2022',
        bio: 'Runner & người chơi cầu lông, đam mê công nghệ lướt nguyên zin.',
        location: 'Hà Nội',
      };
      onLoginSuccess(demoUser);
      onNavigate('home');
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const displayName = loginEmail ? loginEmail.split('@')[0] : 'Minh';
      setSuccessMsg('Đăng nhập thành công!');
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: loginEmail || 'user@2hand.vn',
        phone: '0912 345 678',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        isVerified: true,
        walletBalance: 12500000,
        escrowPending: 2800000,
        itemsSold: 12,
        itemsListed: 4,
        rating: 4.95,
        reviewCount: 26,
        joinedDate: '08/2023',
        bio: 'Thành viên mua bán uy tín trên sàn 2HAND.VN',
        location: 'Hà Nội',
      };
      setTimeout(() => {
        onLoginSuccess(user);
        onNavigate('home');
      }, 700);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      alert('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('Tạo tài khoản thành công!');
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: regName || 'Thành viên mới',
        email: regEmail || 'member@2hand.vn',
        phone: regPhone || '0901 234 567',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        isVerified: true,
        walletBalance: 0,
        escrowPending: 0,
        itemsSold: 0,
        itemsListed: 0,
        rating: 5.0,
        reviewCount: 0,
        joinedDate: 'Hôm nay',
        bio: 'Thành viên mới gia nhập cộng đồng 2HAND.VN',
        location: 'Toàn quốc',
      };
      setTimeout(() => {
        onLoginSuccess(newUser);
        onNavigate('home');
      }, 700);
    }, 700);
  };

  return (
    <div
      id="auth-view-container"
      className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden"
    >
      {/* Soft Pastel Ambient Glows in Background (Pastel Pink & Pastel Water Blue) */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-[#e0f2fe]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fce7f3]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* THE MAIN CARD (Exact match to User's Uploaded Images) */}
      <div className="w-full max-w-5xl bg-white rounded-3xl sm:rounded-[36px] border border-slate-200/90 shadow-2xl shadow-sky-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* ================= LEFT COLUMN: BRAND & TRUST PILLARS ================= */}
        <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 bg-[#fbfdfd] flex flex-col justify-between space-y-6 sm:space-y-8">
          <div className="space-y-6">
            {/* 1. Quay lại trang chủ */}
            <button
              id="btn-auth-back-home"
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Quay lại trang chủ</span>
            </button>

            {/* 2. Logo 2HAND.VN */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#009ee2] flex items-center justify-center text-white shadow-md shadow-sky-200">
                  <Layers className="w-6 h-6 stroke-[2.3]" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">2HAND</span>
                  <span className="text-2xl font-black text-[#009ee2]">.VN</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal pt-1">
                Nền tảng mua bán đồ cũ tuyển chọn chuyên về Công nghệ và Thể thao hàng đầu Việt Nam.
              </p>
            </div>

            {/* 3. Three Trust Cards (Exact match to image) */}
            <div className="space-y-3 pt-2">
              {/* Card 1: Minh bạch 100% (Pastel Water Blue Icon) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-start gap-3.5 transition-all hover:border-sky-200">
                <div className="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#009ee2] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Minh bạch 100%</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    Đánh giá độ mới chuẩn xác từ Like New 99% đến linh kiện rã xác.
                  </p>
                </div>
              </div>

              {/* Card 2: Đăng tin thanh lý nhanh (Pastel Pink Icon) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-start gap-3.5 transition-all hover:border-pink-200">
                <div className="w-10 h-10 rounded-full bg-[#fce7f3] text-[#ec4899] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-5 h-5 fill-current stroke-[1.8]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Đăng tin thanh lý nhanh</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    Đăng bán đồ công nghệ, vợt tập, giày chạy chỉ trong 60 giây.
                  </p>
                </div>
              </div>

              {/* Card 3: Được đồng kiểm tra hàng (Pastel Green Icon) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-start gap-3.5 transition-all hover:border-emerald-200">
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Được đồng kiểm tra hàng</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    Yên tâm kiểm tra ngoại quan và bật máy test trước khi thanh toán.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Demo Shortcut */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-50 to-pink-50 border border-sky-200/70 text-sky-700 hover:text-sky-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Đăng nhập nhanh tài khoản mẫu (1-Click Demo)</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
        <div className="lg:col-span-7 p-7 sm:p-9 lg:p-11 flex flex-col justify-between">
          <div>
            {/* 1. Pill Badge (Exact match to Image 1 & Image 2) */}
            <div className="mb-3">
              {authMode === 'login' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Chào mừng bạn quay lại!</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Tham gia cộng đồng 2hand</span>
                </span>
              )}
            </div>

            {/* 2. Main Heading & Subtitle */}
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {authMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                {authMode === 'login'
                  ? 'Đăng nhập để quản lý tin đăng thanh lý và đơn mua hàng của bạn.'
                  : 'Đăng ký miễn phí chỉ trong vài bước để bắt đầu mua bán.'}
              </p>
            </div>

            {/* 3. Segmented Switcher Pill (Đăng nhập vs Đăng ký mới) */}
            <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl mb-7">
              <button
                id="tab-switcher-login"
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Đăng nhập
              </button>

              <button
                id="tab-switcher-register"
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Đăng ký mới
              </button>
            </div>

            {/* Feedback notification if any */}
            {successMsg && (
              <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ================= FORM 1: ĐĂNG NHẬP (Image 1) ================= */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* ĐỊA CHỈ EMAIL * */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 tracking-wider uppercase">
                    ĐỊA CHỈ EMAIL *
                  </label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="tenban@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all bg-white"
                    />
                  </div>
                </div>

                {/* MẬT KHẨU * */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 tracking-wider uppercase">
                    MẬT KHẨU *
                  </label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Row: Ghi nhớ đăng nhập + Quên mật khẩu? */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    <span className="text-slate-700 font-medium">Ghi nhớ đăng nhập</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Vui lòng liên hệ hotline hỗ trợ hoặc nhấn nút "Đăng nhập nhanh tài khoản mẫu" ở bên trái!')}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* Main Submit: Đăng nhập vào hệ thống (Pastel Water Blue: #009ee2) */}
                <div className="pt-2">
                  <button
                    id="btn-login-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-200/80 transition-all active:scale-[0.99] cursor-pointer text-center"
                  >
                    {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
                  </button>
                </div>
              </form>
            ) : (
              /* ================= FORM 2: TẠO TÀI KHOẢN MỚI (Image 2) ================= */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* HỌ VÀ TÊN CỦA BẠN * */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 tracking-wider uppercase">
                    HỌ VÀ TÊN CỦA BẠN *
                  </label>
                  <div className="relative">
                    <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="VD: Nguyễn Nhật Nam"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                    />
                  </div>
                </div>

                {/* SỐ ĐIỆN THOẠI LIÊN HỆ */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 tracking-wider uppercase">
                    SỐ ĐIỆN THOẠI LIÊN HỆ
                  </label>
                  <div className="relative">
                    <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-phone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="VD: 0988 123 456"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                    />
                  </div>
                </div>

                {/* ĐỊA CHỈ EMAIL * */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 tracking-wider uppercase">
                    ĐỊA CHỈ EMAIL *
                  </label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="tenban@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                    />
                  </div>
                </div>

                {/* MẬT KHẨU * */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 tracking-wider uppercase">
                    MẬT KHẨU *
                  </label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* XÁC NHẬN LẠI MẬT KHẨU * */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 tracking-wider uppercase">
                    XÁC NHẬN LẠI MẬT KHẨU *
                  </label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Main Submit: Hoàn tất đăng ký (Pastel Vibrant Pink: #e11d48 / #ec4899 - Image 2) */}
                <div className="pt-3">
                  <button
                    id="btn-register-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-200/80 transition-all active:scale-[0.99] cursor-pointer text-center"
                  >
                    {isSubmitting ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

