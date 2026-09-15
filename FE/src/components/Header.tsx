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
  isLoggedIn,
  currentUser,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          {/* 1. BRAND LOGO (2HAND.VN TECH & SPORT) */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-3 text-left shrink-0 group"
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

          {/* 2. MAIN 2-PAGE CATEGORY PILLS (Tất cả, Đồ điện tử, Đồ thể thao) */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl shrink-0">
            <button
              id="header-tab-all"
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>

            <button
              id="header-tab-electronics"
              type="button"
              onClick={() => onSelectCategory('electronics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedCategory === 'electronics'
                  ? 'bg-sky-50 text-sky-600 border border-sky-200 shadow-xs font-black'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-sky-500" />
              <span>Đồ điện tử</span>
            </button>

            <button
              id="header-tab-sports"
              type="button"
              onClick={() => onSelectCategory('sports')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
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
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm tai nghe, iPhone, vợt Yonex, giày Nike 2hand..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              />
            </div>
          </div>

          {/* 4. ACTIONS EXACTLY MATCHING USER SCREENSHOT:
              [ (+) Đăng tin thanh lý ]  [ Shopping Bag ]  [ 👤 Đăng nhập ]
          */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* (+) Đăng tin thanh lý button (Matches Image screenshot) */}
            <button
              id="btn-nav-sell"
              type="button"
              onClick={onOpenSell}
              className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.2]" />
              <span className="whitespace-nowrap">Đăng tin thanh lý</span>
            </button>

            {/* Shopping Bag Icon Button (Matches Image screenshot) */}
            <button
              id="btn-nav-cart"
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.2rem] h-4.5 px-1 rounded-full bg-[#F29BC4] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Login or Profile Button (Matches Image screenshot: [ 👤 Đăng nhập ]) */}
            {!isLoggedIn ? (
              <button
                id="btn-nav-login"
                type="button"
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-2xs cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-700 stroke-[1.9]" />
                <span>Đăng nhập</span>
              </button>
            ) : (
              /* When logged in: Profile Pill with dropdown to view profile or log out */
              <div className="relative">
                <button
                  id="btn-nav-profile-logged"
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-2xs cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                      alt={currentUser?.name || 'Tài khoản'}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-pink-100"
                    />
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{currentUser?.name || 'Minh'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{currentUser?.name || 'Sarah Mitchell'}</p>
                      <p className="text-slate-400 text-[11px] truncate">{currentUser?.email || 'sarah@2hand.vn'}</p>
                    </div>

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

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenSell();
                      }}
                      className="w-full px-4 py-2.5 text-left font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-500" />
                      <span>Đăng bài thanh lý mới</span>
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

        {/* Mobile Search & Category bar */}
        <div className="pb-3 md:hidden space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tai nghe, iPhone, vợt Yonex, giày Nike..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('electronics')}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
                selectedCategory === 'electronics'
                  ? 'bg-sky-50 text-sky-600 border border-sky-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-sky-500" />
              <span>Đồ điện tử</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('sports')}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
                selectedCategory === 'sports'
                  ? 'bg-[#F29BC4]/20 text-[#c23f79] border border-[#F29BC4]/40'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-[#F29BC4]" />
              <span>Đồ thể thao</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
