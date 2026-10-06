import React, { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, RotateCcw, Laptop, Dumbbell, Layers, X, ArrowUpDown, Search, Loader2 } from 'lucide-react';
import { Product, CategoryTab, UserProfile } from '../types';
import { ProductCard } from '../components/ProductCard';

type PriceFilter = 'all' | 'under_1m' | '1m_to_5m' | 'over_5m';
type ConditionFilter = 'all' | 'like_new' | 'good' | 'fair' | 'parts';
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'discount';

interface CatalogViewProps {
  products: Product[];
  currentUser?: UserProfile | null;
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
  currentUser,
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

  // State quản lý dữ liệu gọi trực tiếp từ VPS
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const [isSearching, setIsSearching] = useState(false);

  // GỌI API TÌM KIẾM THỰC TẾ
  useEffect(() => {
    const fetchCatalogFromAPI = async () => {
      setIsSearching(true);
      try {
        let url = 'https://atmn.sytes.net/api/v1/products?limit=100';
        
        // Truyền params category
        if (selectedCategory === 'electronics') url += '&category_id=2';
        if (selectedCategory === 'sports') url += '&category_id=1';
        
        // Truyền params search
        if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Map dữ liệu Database sang giao diện ProductCard
          const mapped = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.name,
            category: item.category_id === 2 ? 'electronics' : 'sports',
            subCategory: 'Linh kiện',
            brand: 'Khác',
            price: item.price,
            originalPrice: item.price * 1.2,
            condition: 'good',
            conditionLabel: item.condition_status || 'Đã qua sử dụng',
            image: item.cover || 'https://via.placeholder.com/400',
            location: 'Kho tổng',
            seller: {
              id: item.seller_id?.toString() || 'admin',
              name: 'Người bán',
              avatar: 'https://via.placeholder.com/150',
              rating: 5.0,
              reviewCount: 0,
              verified: true,
            },
            tags: ['Giao nhanh'],
            likes: 0,
          }));
          setLiveProducts(mapped);
        }
      } catch (err) {
        console.error("Lỗi tìm kiếm API:", err);
      } finally {
        setIsSearching(false);
      }
    };

    // Tạo độ trễ 400ms để chống spam API khi người dùng gõ phím liên tục
    const timer = setTimeout(() => {
      fetchCatalogFromAPI();
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Bộ lọc phụ tại FE (Giá, Độ mới, Sắp xếp)
  const filteredProducts = useMemo(() => {
    return liveProducts
      .filter((p) => {
        // Condition
        if (selectedCondition !== 'all') {
          if (selectedCondition === 'like_new' && p.condition !== 'like_new') return false;
          if (selectedCondition === 'good' && p.condition !== 'good') return false;
          if (selectedCondition === 'fair' && p.condition !== 'fair') return false;
          if (selectedCondition === 'parts' && p.condition !== 'parts') return false;
        }

        // Price
        if (selectedPrice === 'under_1m' && p.price >= 1000000) return false;
        if (selectedPrice === '1m_to_5m' && (p.price < 1000000 || p.price > 5000000)) return false;
        if (selectedPrice === 'over_5m' && p.price <= 5000000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'discount') return ((b.originalPrice - b.price) / b.originalPrice) - ((a.originalPrice - a.price) / a.originalPrice);
        return 0; 
      });
  }, [liveProducts, selectedCondition, selectedPrice, sortBy]);

  const resetFilters = () => {
    onSelectCategory('all');
    setSelectedCondition('all');
    setSelectedPrice('all');
    onClearSearch();
  };

  const pageTitle = selectedCategory === 'electronics' ? 'Kho Đồ Điện Tử (Tech & Audio)' : selectedCategory === 'sports' ? 'Kho Dụng Cụ & Trang Phục Thể Thao' : 'Kho Đồ Cũ Tuyển Chọn 2HAND.VN';
  const categoryLabel = selectedCategory === 'electronics' ? 'Đồ điện tử' : selectedCategory === 'sports' ? 'Đồ thể thao' : 'Tất cả';
  const activePillColor = selectedCategory === 'sports' ? 'bg-[#F29BC4]/20 text-[#c23f79] font-bold border border-[#F29BC4]/40' : 'bg-sky-50 text-sky-700 font-bold border border-sky-200/80';

  return (
    <div id="catalog-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{pageTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tìm thấy <span className="font-extrabold text-slate-800 tabular-nums">{filteredProducts.length}</span> món đồ thanh lý phù hợp
            {searchQuery && <span> cho từ khóa &quot;<strong>{searchQuery}</strong>&quot;</span>}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
            <span>{categoryLabel}</span>
            {selectedCategory !== 'all' && (
              <button type="button" onClick={() => onSelectCategory('all')} className="hover:text-rose-500 cursor-pointer"><X className="w-3.5 h-3.5 stroke-[2.5]" /></button>
            )}
          </div>

          {selectedCondition !== 'all' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
              <span>{selectedCondition === 'like_new' ? 'Like New' : selectedCondition === 'good' ? 'Cũ đẹp' : selectedCondition === 'fair' ? 'Cũ nhẹ' : 'Linh kiện / Xác'}</span>
              <button type="button" onClick={() => setSelectedCondition('all')} className="hover:text-rose-500 cursor-pointer"><X className="w-3.5 h-3.5 stroke-[2.5]" /></button>
            </div>
          )}

          {selectedPrice !== 'all' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
              <span>{selectedPrice === 'under_1m' ? '< 1 triệu' : selectedPrice === '1m_to_5m' ? '1 - 5 triệu' : '> 5 triệu'}</span>
              <button type="button" onClick={() => setSelectedPrice('all')} className="hover:text-rose-500 cursor-pointer"><X className="w-3.5 h-3.5 stroke-[2.5]" /></button>
            </div>
          )}

          {(selectedCategory !== 'all' || selectedCondition !== 'all' || selectedPrice !== 'all' || searchQuery) && (
            <button type="button" onClick={resetFilters} className="text-xs font-bold text-pink-600 hover:underline pl-1 cursor-pointer">Xóa tất cả</button>
          )}

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="text-xs font-bold text-slate-700 bg-transparent border-0 focus:outline-none cursor-pointer">
              <option value="newest">Mới lên sàn</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
              <option value="discount">Giảm giá sâu %</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <aside className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900"><SlidersHorizontal className="w-4 h-4 text-sky-500" /><span>Bộ Lọc 2Hand</span></div>
            <button type="button" onClick={resetFilters} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"><RotateCcw className="w-3 h-3" /><span>Đặt lại</span></button>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">NGÀNH HÀNG</h3>
            <div className="space-y-1 text-xs">
              <button type="button" onClick={() => onSelectCategory('all')} className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer ${selectedCategory === 'all' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
                <Layers className="w-4 h-4 text-slate-400" /><span>Tất cả ngành hàng</span>
              </button>
              <button type="button" onClick={() => onSelectCategory('electronics')} className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer ${selectedCategory === 'electronics' ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/80 shadow-2xs' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
                <Laptop className="w-4 h-4 text-sky-500" /><span>Đồ điện tử</span>
              </button>
              <button type="button" onClick={() => onSelectCategory('sports')} className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer ${selectedCategory === 'sports' ? 'bg-[#F29BC4]/20 text-[#c23f79] font-bold border border-[#F29BC4]/40 shadow-2xs' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
                <Dumbbell className="w-4 h-4 text-[#F29BC4]" /><span>Dụng cụ & Đồ thể thao</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">ĐỘ MỚI / TÌNH TRẠNG</h3>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'Tất cả tình trạng', dot: 'bg-slate-400' },
                { id: 'like_new', label: 'Like New (98% - 99%)', dot: 'bg-emerald-500' },
                { id: 'good', label: 'Cũ đẹp (90% - 97%)', dot: 'bg-sky-500' },
                { id: 'fair', label: 'Cũ nhẹ (75% - 89%)', dot: 'bg-amber-500' },
                { id: 'parts', label: 'Linh kiện / Xác (< 75%)', dot: 'bg-slate-400' },
              ].map((item) => (
                <button key={item.id} type="button" onClick={() => setSelectedCondition(item.id as ConditionFilter)} className={`w-full text-left px-3.5 py-2 rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer ${selectedCondition === item.id ? activePillColor : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
                  <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0`}></span><span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">KHOẢNG GIÁ</h3>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'Tất cả mức giá' },
                { id: 'under_1m', label: 'Dưới 1.000.000đ' },
                { id: '1m_to_5m', label: '1.000.000đ - 5.000.000đ' },
                { id: 'over_5m', label: 'Trên 5.000.000đ' },
              ].map((item) => (
                <button key={item.id} type="button" onClick={() => setSelectedPrice(item.id as PriceFilter)} className={`w-full text-left px-3.5 py-2 rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer ${selectedPrice === item.id ? activePillColor : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {isSearching ? (
             <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 flex flex-col items-center justify-center">
               <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-3" />
               <p className="text-sm font-bold text-slate-600">Đang tìm kiếm trên hệ thống...</p>
             </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentUser={currentUser}
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
              <h3 className="font-extrabold text-base text-slate-900">Không tìm thấy món đồ thanh lý phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Hãy thử chọn lại tình trạng, khoảng giá hoặc xóa từ khóa tìm kiếm.</p>
              <button type="button" onClick={resetFilters} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer">
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};