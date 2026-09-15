import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Laptop,
  Dumbbell,
  Layers,
  X,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { Product, CategoryTab } from '../types';
import { ProductCard } from '../components/ProductCard';

type PriceFilter = 'all' | 'under_1m' | '1m_to_5m' | 'over_5m';
type ConditionFilter = 'all' | 'like_new' | 'good' | 'fair' | 'parts';
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'discount';

interface CatalogViewProps {
  products: Product[];
  selectedCategory: CategoryTab;
  onSelectCategory: (cat: CategoryTab) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleLike?: (id: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<ConditionFilter>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filter products based on Category, Search Query, Condition, and Price
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // 2. Condition
        if (selectedCondition !== 'all') {
          if (selectedCondition === 'like_new' && p.condition !== 'like_new') return false;
          if (selectedCondition === 'good' && p.condition !== 'good') return false;
          if (selectedCondition === 'fair' && p.condition !== 'fair') return false;
          if (selectedCondition === 'parts' && p.condition !== 'parts') return false;
        }

        // 3. Price
        if (selectedPrice === 'under_1m' && p.price >= 1000000) return false;
        if (selectedPrice === '1m_to_5m' && (p.price < 1000000 || p.price > 5000000)) return false;
        if (selectedPrice === 'over_5m' && p.price <= 5000000) return false;

        // 4. Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchBrand = p.brand.toLowerCase().includes(query);
          const matchLocation = p.location.toLowerCase().includes(query);
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchBrand && !matchLocation && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'discount') {
          const discA = (a.originalPrice - a.price) / a.originalPrice;
          const discB = (b.originalPrice - b.price) / b.originalPrice;
          return discB - discA;
        }
        return 0; // Default order in array
      });
  }, [products, selectedCategory, selectedCondition, selectedPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    onSelectCategory('all');
    setSelectedCondition('all');
    setSelectedPrice('all');
    onClearSearch();
  };

  // Title and subtitle matching Image 1 & Image 2
  const pageTitle =
    selectedCategory === 'electronics'
      ? 'Kho Đồ Điện Tử (Tech & Audio)'
      : selectedCategory === 'sports'
      ? 'Kho Dụng Cụ & Trang Phục Thể Thao'
      : 'Kho Đồ Cũ Tuyển Chọn 2HAND.VN';

  const categoryLabel =
    selectedCategory === 'electronics'
      ? 'Đồ điện tử'
      : selectedCategory === 'sports'
      ? 'Đồ thể thao'
      : 'Tất cả';

  // Active pill theme color for left sidebar based on current page
  const activePillColor =
    selectedCategory === 'sports'
      ? 'bg-[#F29BC4]/20 text-[#c23f79] font-bold border border-[#F29BC4]/40'
      : 'bg-sky-50 text-sky-700 font-bold border border-sky-200/80';

  return (
    <div id="catalog-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* 1. HEADER ROW (Title, Count & Active Filter Tag from Image 1 & 2) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tìm thấy{' '}
            <span className="font-extrabold text-slate-800 tabular-nums">
              {filteredProducts.length}
            </span>{' '}
            món đồ thanh lý phù hợp
            {searchQuery && (
              <span>
                {' '}
                cho từ khóa &quot;<strong>{searchQuery}</strong>&quot;
              </span>
            )}
          </p>
        </div>

        {/* Right Filter Chips: e.g. "Đồ điện tử ✕" + "Xóa tất cả" */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Active Category Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
            <span>{categoryLabel}</span>
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="hover:text-rose-500"
                title="Bỏ chọn ngành hàng"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Active Condition Chip */}
          {selectedCondition !== 'all' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
              <span>
                {selectedCondition === 'like_new'
                  ? 'Like New'
                  : selectedCondition === 'good'
                  ? 'Cũ đẹp'
                  : selectedCondition === 'fair'
                  ? 'Cũ nhẹ'
                  : 'Linh kiện / Xác'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCondition('all')}
                className="hover:text-rose-500"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Active Price Chip */}
          {selectedPrice !== 'all' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
              <span>
                {selectedPrice === 'under_1m'
                  ? '< 1 triệu'
                  : selectedPrice === '1m_to_5m'
                  ? '1 - 5 triệu'
                  : '> 5 triệu'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPrice('all')}
                className="hover:text-rose-500"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Reset all button */}
          {(selectedCategory !== 'all' ||
            selectedCondition !== 'all' ||
            selectedPrice !== 'all' ||
            searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-pink-600 hover:underline pl-1 cursor-pointer"
            >
              Xóa tất cả
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-bold text-slate-700 bg-transparent border-0 focus:outline-none cursor-pointer"
            >
              <option value="newest">Mới lên sàn</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
              <option value="discount">Giảm giá sâu %</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR (LEFT) + 4-COLUMN PRODUCT GRID (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT SIDEBAR: "Bộ Lọc 2Hand" (Matching Image 1 & 2) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-6 lg:sticky lg:top-28">
          {/* Header of Filter */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
              <span>Bộ Lọc 2Hand</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Section 1: NGÀNH HÀNG */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
              NGÀNH HÀNG
            </h3>
            <div className="space-y-1 text-xs">
              {/* Tất cả ngành hàng */}
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-2.5 ${
                  selectedCategory === 'all'
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Tất cả ngành hàng</span>
              </button>

              {/* Đồ điện tử (Image 1 active style) */}
              <button
                type="button"
                onClick={() => onSelectCategory('electronics')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-2.5 ${
                  selectedCategory === 'electronics'
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/80 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <Laptop className="w-4 h-4 text-sky-500" />
                <span>Đồ điện tử</span>
              </button>

              {/* Dụng cụ & Đồ thể thao (Image 2 active style) */}
              <button
                type="button"
                onClick={() => onSelectCategory('sports')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-2.5 ${
                  selectedCategory === 'sports'
                    ? 'bg-[#F29BC4]/20 text-[#c23f79] font-bold border border-[#F29BC4]/40 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-[#F29BC4]" />
                <span>Dụng cụ & Đồ thể thao</span>
              </button>
            </div>
          </div>

          {/* Section 2: ĐỘ MỚI / TÌNH TRẠNG */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
              ĐỘ MỚI / TÌNH TRẠNG
            </h3>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'Tất cả tình trạng', dot: 'bg-slate-400' },
                { id: 'like_new', label: 'Like New (98% - 99%)', dot: 'bg-emerald-500' },
                { id: 'good', label: 'Cũ đẹp (90% - 97%)', dot: 'bg-sky-500' },
                { id: 'fair', label: 'Cũ nhẹ (75% - 89%)', dot: 'bg-amber-500' },
                { id: 'parts', label: 'Linh kiện / Xác (< 75%)', dot: 'bg-slate-400' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCondition(item.id as ConditionFilter)}
                  className={`w-full text-left px-3.5 py-2 rounded-2xl transition-all flex items-center gap-2.5 ${
                    selectedCondition === item.id
                      ? activePillColor
                      : 'text-slate-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0`}></span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: KHOẢNG GIÁ */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
              KHOẢNG GIÁ
            </h3>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'Tất cả mức giá' },
                { id: 'under_1m', label: 'Dưới 1.000.000đ' },
                { id: '1m_to_5m', label: '1.000.000đ - 5.000.000đ' },
                { id: 'over_5m', label: 'Trên 5.000.000đ' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPrice(item.id as PriceFilter)}
                  className={`w-full text-left px-3.5 py-2 rounded-2xl transition-all flex items-center gap-2.5 ${
                    selectedPrice === item.id
                      ? activePillColor
                      : 'text-slate-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT PRODUCT GRID (4 columns matching Image 1 & Image 2) */}
        <div className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Không tìm thấy món đồ thanh lý phù hợp
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hãy thử chọn lại tình trạng, khoảng giá hoặc xóa từ khóa tìm kiếm.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
