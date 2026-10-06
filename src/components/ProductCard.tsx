import React, { useState } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import { Product, UserProfile } from '../types';
import { formatVND } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  currentUser?: UserProfile | null;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleLike?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentUser,
  onSelect,
  onAddToCart,
}) => {
  const [added, setAdded] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Kiểm tra quyền sở hữu bằng cách so khớp ID (dùng String để đề phòng sai kiểu dữ liệu int/string)
  const isOwner = String(currentUser?.id) === String(product.seller?.id);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwner) return; // Chủ shop không được mua đồ của chính mình
    setAdded(true);
    if (onAddToCart) onAddToCart(product);
    setTimeout(() => setAdded(false), 2000);
  };

  const dotColorClass =
    product.conditionDotColor === 'gray' ? 'bg-slate-400'
    : product.conditionDotColor === 'amber' ? 'bg-amber-500'
    : product.conditionDotColor === 'blue' ? 'bg-sky-500'
    : 'bg-emerald-500';

  const categoryLabel = product.category === 'electronics' ? 'ĐIỆN TỬ' : 'THỂ THAO';
  const categoryBadgeClass =
    product.category === 'electronics'
      ? 'bg-[#009ee2] text-white'
      : 'bg-[#F29BC4] text-slate-900 font-black';

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div>
        <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1.5 border border-slate-100">
            <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
            <span>{product.conditionLabel || `Độ mới ${product.conditionPercent || 95}%`}</span>
          </div>
          <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase shadow-xs ${categoryBadgeClass}`}>
            {categoryLabel}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-extrabold uppercase tracking-wider text-slate-600">{product.brand}</span>
            <span className="flex items-center gap-0.5 text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{product.location}</span>
            </span>
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="flex items-baseline flex-wrap gap-2 pt-1">
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
              {formatVND(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-slate-400 line-through tabular-nums">{formatVND(product.originalPrice)}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-slate-400 font-medium">
          {product.status === 'pending' ? 'Chờ duyệt' : (product.timeAgo || 'Vừa đăng')}
        </span>

        {isOwner ? (
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-[11px] border border-slate-200">
            Tin của bạn
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAddClick}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
              added ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5 stroke-[3]" /><span>Đã thêm</span></>
            ) : (
              <><Plus className="w-3.5 h-3.5" /><span>Thêm giỏ</span></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};