import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  BatteryCharging,
  Monitor,
  MessageCircle,
  Tag,
  ShoppingCart
} from 'lucide-react';
import { Product, ScreenType, UserProfile } from '../types';
import { formatVND } from '../data/mockData';
import { MakeOfferModal } from '../components/MakeOfferModal';
import { ChatModal } from '../components/ChatModal';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  currentUser?: UserProfile | null;
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenType) => void;
  onToggleLike?: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  currentUser,
  onSelectProduct,
  onNavigate,
  onToggleLike,
  onAddToCart,
  onOpenCart,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const isOwner = String(currentUser?.id) === String(product.seller?.id);

  // Xử lý an toàn Avatar bị "null" từ Database
  const sellerAvatar = (!product.seller.avatar || String(product.seller.avatar).trim() === 'null') 
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' 
    : product.seller.avatar;

  const recommendations = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const categoryLabel = product.category === 'electronics' ? 'ĐIỆN TỬ' : 'THỂ THAO';

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <nav className="text-xs font-semibold text-slate-400 flex items-center gap-2">
        <button onClick={() => onNavigate('catalog')} className="hover:text-slate-700">Trang mua sắm</button>
        <span>/</span>
        <button onClick={() => onNavigate('catalog')} className="hover:text-slate-700">{categoryLabel}</button>
        <span>/</span>
        <span className="text-slate-800 line-clamp-1 max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img src={gallery[selectedImageIndex] || product.image} alt={product.title} className="w-full h-full object-cover transition-all duration-300" />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs border border-slate-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{product.conditionLabel}</span>
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider text-white shadow-xs ${product.category === 'electronics' ? 'bg-[#009ee2]' : 'bg-[#e11d48]'}`}>
                  {categoryLabel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {gallery.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImageIndex === idx ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200 opacity-70 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center"><ShieldCheck className="w-6 h-6 stroke-[2.3]" /></div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Báo cáo Kiểm định Ngoại quan</h3>
                  <p className="text-xs text-slate-400">Được chuyên viên 2HAND.VN đối soát</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5"><div className="flex items-center gap-2 font-bold text-slate-800"><Monitor className="w-4 h-4 text-sky-500" /><span>Màn hình & Bề mặt</span></div><p className="text-slate-600">{product.inspectionSummary?.screen || 'Hiển thị sắc nét, không điểm chết, không vết xước dăm sâu.'}</p></div>
              <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5"><div className="flex items-center gap-2 font-bold text-slate-800"><BatteryCharging className="w-4 h-4 text-emerald-500" /><span>Chức năng & Nguồn</span></div><p className="text-slate-600">{product.inspectionSummary?.battery || 'Hoạt động bền bỉ, không lỗi vặt.'}</p></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400"><span className="font-bold uppercase tracking-wider text-slate-500">{product.brand}</span><span>{product.location}</span></div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{product.title}</h2>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/60 via-white to-[#F29BC4]/15 border border-slate-200 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 tabular-nums">{formatVND(product.price)}</span>
                {product.originalPrice > product.price && (
                  <><span className="text-sm text-slate-400 line-through tabular-nums">{formatVND(product.originalPrice)}</span><span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span></>
                )}
              </div>
            </div>

            {isOwner ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-1"><ShieldCheck className="w-6 h-6" /></div>
                <p className="font-bold text-slate-900 text-sm">Đây là sản phẩm do bạn đăng bán</p>
                <p className="text-xs text-slate-500 leading-relaxed">Bạn không thể tự đưa ra đề nghị hoặc bỏ vào giỏ hàng của chính mình.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    setTimeout(() => onOpenCart(), 300);
                  }} 
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-black text-sm shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Thêm giỏ hàng & Thanh toán</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setIsOfferOpen(true)} className="py-2.5 px-4 rounded-2xl border border-[#F29BC4]/40 hover:border-[#F29BC4] bg-[#F29BC4]/10 text-[#c23f79] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"><Tag className="w-3.5 h-3.5" /><span>Đưa ra đề nghị</span></button>
                  <button onClick={() => setIsChatOpen(true)} className="py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"><MessageCircle className="w-3.5 h-3.5" /><span>Nhắn tin người bán</span></button>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-start gap-2.5"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><p><strong>Ký quỹ giữ tiền 48h:</strong> Tiền của bạn được giữ an toàn trên sàn. Chỉ giải ngân khi bạn đã nhận đồ và kiểm tra đúng mô tả.</p></div>
              <div className="flex items-start gap-2.5"><RotateCcw className="w-4 h-4 text-[#F29BC4] shrink-0 mt-0.5" /><p><strong>Hoàn tiền ngay:</strong> Trả hàng miễn phí trong vòng 48h nếu phát hiện sai lệch thông số.</p></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={sellerAvatar} alt={product.seller.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#F29BC4]/30" />
                <div><h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1"><span>{product.seller.name}</span><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /></h4><p className="text-xs text-slate-500">{product.seller.badge || 'Thành viên xác thực'}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 space-y-6">
        <div>
          <h3 className="font-black text-xl text-slate-900">Có thể bạn cũng quan tâm</h3>
          <p className="text-xs text-slate-500 mt-0.5">Các món đồ cùng phân khúc được kiểm định bởi 2HAND.VN</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              currentUser={currentUser}
              onAddToCart={onAddToCart}
              onSelect={(p) => {
                onSelectProduct(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>

      <MakeOfferModal product={product} isOpen={isOfferOpen} onClose={() => setIsOfferOpen(false)} />
      <ChatModal product={product} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};