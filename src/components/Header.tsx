import React, { useState } from 'react';
import {
  Layers,
  Search,
  PlusCircle,
  ShoppingBag,
  User,
  Laptop,
  Dumbbell,
  CheckCircle2,
  LogOut,
  ChevronDown,
  UserCheck,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { CategoryTab, UserProfile } from '../types';

interface HeaderProps {
  selectedCategory: CategoryTab;
  onSelectCategory: (category: CategoryTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSell: () => void;
  onOpenProfile: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAdmin?: () => void; 
  isLoggedIn: boolean;
  currentUser?: UserProfile | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenSell,
  onOpenProfile,
  onOpenAuth,
  onOpenAdmin,
  isLoggedIn,
  currentUser,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // SỬA ĐIỀU KIỆN KIỂM TRA ADMIN: Kiểm tra đúng role hoặc email gốc
  const isAdmin = currentUser?.email === 'thanhnam14112005@gmail.com' || currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          {/* 1. BRAND LOGO */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-3 text-left shrink-0 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-xl font-black text-slate-900 tracking-tight">2HAND</span>
                <span className="text-xl font-black text-sky-500">.VN</span>
              </div>
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase -mt-0.5">
                TECH & SPORT
              </p>
            </div>
          </button>

          {/* 2. MAIN CATEGORY PILLS */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trang Chủ
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory('electronics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === 'electronics'
                  ? 'bg-sky-50 text-sky-600 border border-sky-200 shadow-xs font-black'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-sky-500" />
              <span>Đồ điện tử</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCategory('sports')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === 'sports'
                  ? 'bg-[#F29BC4]/15 text-[#c23f79] border border-[#F29BC4]/40 shadow-xs font-black'
                  : 'text-slate-600 hover:text-[#c23f79]'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-[#F29BC4]" />
              <span>Đồ thể thao</span>
            </button>
          </div>

          {/* 3. SEARCH BAR */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm tai nghe, iPhone, vợt Yonex, giày Nike 2hand..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
              />
            </div>
          </div>

          {/* 4. ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* NẾU LÀ ADMIN: HIỂN THỊ NƯỚC ĐI TẮT "TRUNG TÂM VẬN HÀNH" Ở MENU NGANG */}
            {isAdmin && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hidden lg:flex px-3 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs items-center gap-1.5 shadow-sm hover:bg-amber-600 transition-all cursor-pointer border border-amber-600/20"
                title="Trung tâm vận hành"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Trung tâm vận hành</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSell}
              className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white stroke-[2.2]" />
              <span className="whitespace-nowrap">Đăng tin thanh lý</span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.2rem] h-4.5 px-1 rounded-full bg-[#F29BC4] text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span>Đăng nhập</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 border border-pink-200 text-xs font-bold text-pink-700 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-pink-600" />
                  <span>Đăng ký</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-pink-100"
                    />
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{currentUser?.name || 'Thành viên'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{currentUser?.name}</p>
                      <p className="text-slate-400 text-[11px] truncate">{currentUser?.email}</p>
                    </div>

                    {/* HIỂN THỊ NÚT ADMIN Ở DROPDOWN TRÊN ĐIỆN THOẠI/MÀN HÌNH NHỎ */}
                    {isAdmin && onOpenAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-4 py-2.5 text-left font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2 cursor-pointer bg-amber-50/50"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Vào Trang Quản Trị</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full px-4 py-2.5 text-left font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-sky-500" />
                      <span>Hồ sơ cá nhân</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};