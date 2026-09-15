import React from 'react';
import {
  Sparkles,
  ArrowRight,
  PlusCircle,
  Laptop,
  Dumbbell,
  ArrowRight as ChevronRight,
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: 'electronics' | 'sports') => void;
  onExploreAll: () => void;
  onOpenSell: () => void;
  onAddToCart: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onSelectCategory,
  onExploreAll,
  onOpenSell,
  onAddToCart,
}) => {
  return (
    <div id="home-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* 1. HERO BANNER CARD (Exact match to Image 1) */}
      <div className="relative rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 lg:p-14 shadow-xs overflow-hidden">
        {/* Soft pastel decorative gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-100/40 via-[#F29BC4]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-6">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-100/80 text-sky-600 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Sàn Giao Dịch 2Hand Chuyên Biệt</span>
          </div>

          {/* Headline matching Image 1: "Mua Bán Đồ Cũ Điện Tử & Thể Thao Tuyển Chọn." */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.15]">
            Mua Bán Đồ Cũ{' '}
            <span className="text-[#009ee2]">Điện Tử</span> &{' '}
            <span className="text-[#F29BC4]">Thể Thao</span>{' '}
            Tuyển Chọn.
          </h1>

          {/* Subtitle matching Image 1 */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
            Tối ưu ngân sách thông minh. Kiểm định ngoại quan trung thực, hiển thị rõ ràng độ mới % cho từng thiết bị công nghệ và dụng cụ tập luyện.
          </p>

          {/* 2 Action Buttons matching Image 1 */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="btn-hero-explore"
              type="button"
              onClick={onExploreAll}
              className="px-6 py-3.5 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-200 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Khám phá đồ 2hand ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-sell"
              type="button"
              onClick={onOpenSell}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-600" />
              <span>Đăng tin thanh lý đồ cũ</span>
            </button>
          </div>

          {/* 3 Metric Stats matching Image 1 */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-slate-100 max-w-xl">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                98%
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Độ trung thực mô tả
              </p>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                30% – 60%
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Tiết kiệm so với giá mới
              </p>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                100%
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Hỗ trợ đồng kiểm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NGÀNH HÀNG TRỌNG TÂM (Exact match to Image 1) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ngành Hàng Trọng Tâm
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Chọn ngành hàng để khám phá nhanh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Đồ Điện Tử (Tech & Audio) */}
          <div
            id="home-category-card-electronics"
            onClick={() => onSelectCategory('electronics')}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="space-y-2 pr-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-600 border border-sky-100">
                <Sparkles className="w-3 h-3 text-sky-500" />
                <span>Công Nghệ Tuyển Chọn</span>
              </span>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                Đồ Điện Tử (Tech & Audio)
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Laptop, iPad, Bàn phím cơ, Tai nghe chống ồn, Chuột gaming lướt 95–99%
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Laptop className="w-7 h-7 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 2: Dụng Cụ & Trang Phục Thể Thao */}
          <div
            id="home-category-card-sports"
            onClick={() => onSelectCategory('sports')}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-[#F29BC4]/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="space-y-2 pr-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F29BC4]/15 text-[#c23f79] border border-[#F29BC4]/30">
                <Sparkles className="w-3 h-3 text-[#F29BC4]" />
                <span>Thể Thao Đích Thực</span>
              </span>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#c23f79] transition-colors">
                Dụng Cụ & Trang Phục Thể Thao
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Vợt Pickleball, Vợt Yonex, Giày chạy Nike/Garmin, Tạ điều chỉnh tại nhà
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#F29BC4]/20 text-[#c23f79] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-7 h-7 stroke-[1.8]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MỚI LÊN SÀN HÔM NAY (Exact match to Image 2) */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Mới Lên Sàn Hôm Nay
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Các món đồ 2hand vừa được đăng bán gần nhất
            </p>
          </div>

          <button
            type="button"
            onClick={onExploreAll}
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 shrink-0 cursor-pointer group"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4-column Product Grid matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
