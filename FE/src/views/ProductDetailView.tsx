import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Clock,
  BatteryCharging,
  Cpu,
  HardDrive,
  Monitor,
  KeyRound,
  FileCheck,
  Star,
  MessageCircle,
  Tag,
  Check,
  Info,
} from 'lucide-react';
import { Product, ScreenType } from '../types';
import { formatVND } from '../data/mockData';
import { EscrowModal } from '../components/EscrowModal';
import { MakeOfferModal } from '../components/MakeOfferModal';
import { ChatModal } from '../components/ChatModal';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenType) => void;
  onToggleLike?: (productId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onSelectProduct,
  onNavigate,
  onToggleLike,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const recommendations = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const categoryLabel = product.category === 'electronics' ? 'ĐIỆN TỬ' : 'THỂ THAO';

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs font-semibold text-slate-400 flex items-center gap-2">
        <button onClick={() => onNavigate('catalog')} className="hover:text-slate-700">Trang mua sắm</button>
        <span>/</span>
        <button onClick={() => onNavigate('catalog')} className="hover:text-slate-700">{categoryLabel}</button>
        <span>/</span>
        <span className="text-slate-800 line-clamp-1 max-w-xs">{product.title}</span>
      </nav>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Gallery & Inspection & Narrative */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Gallery Showcase */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={gallery[selectedImageIndex] || product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Badges on image (Image 1 style) */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs border border-slate-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{product.conditionLabel}</span>
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider text-white shadow-xs ${
                  product.category === 'electronics' ? 'bg-[#009ee2]' : 'bg-[#e11d48]'
                }`}>
                  {categoryLabel}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-sky-500 ring-2 ring-sky-200'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 28-Step Certified Inspection Report */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 stroke-[2.3]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Báo cáo Kiểm định Ngoại quan 28 Điểm</h3>
                  <p className="text-xs text-slate-400">Được chuyên viên 2HAND.VN đối soát & dán tem niêm phong</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                Đạt 28/28 Tiêu chí
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Monitor className="w-4 h-4 text-sky-500" />
                  <span>Màn hình & Bề mặt</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.inspectionSummary?.screen || 'Hiển thị sắc nét, không điểm chết, không vết xước dăm sâu.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <BatteryCharging className="w-4 h-4 text-emerald-500" />
                  <span>Dung lượng Pin & Nguồn</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.inspectionSummary?.battery || `Dung lượng pin còn ${product.batteryHealth || 96}%, hoạt động bền bỉ.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <KeyRound className="w-4 h-4 text-pink-500" />
                  <span>Cảm biến & Phím bấm</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.inspectionSummary?.keyboard || 'Tất cả các phím, cảm biến xúc giác và micro hoạt động hoàn hảo.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  <span>Tài khoản chính chủ</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.inspectionSummary?.icloudStatus || 'Đã thoát hoàn toàn tài khoản đám mây cá nhân, sẵn sàng đăng nhập mới.'}
                </p>
              </div>
            </div>
          </div>

          {/* Seller Narrative & Technical Specs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
              Chia sẻ từ Người bán & Lịch sử bảo quản
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              "{product.sellerNotes || 'Thiết bị được tôi bảo quản cẩn thận, chỉ dùng trong môi trường văn phòng máy lạnh, không trầy xước và đầy đủ hộp phụ kiện gốc.'}"
            </p>

            {product.specs && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Thông số kỹ thuật xác thực:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
                      <span className="text-slate-400">{key}:</span>
                      <span className="font-bold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Buy Box & Seller Card (Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* Main Buy Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-slate-500">{product.brand}</span>
                <span>{product.location}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {product.title}
              </h2>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/60 via-white to-[#F29BC4]/15 border border-slate-200 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 tabular-nums">
                  {formatVND(product.price)}
                </span>
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  {formatVND(product.originalPrice)}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Tiết kiệm {formatVND(product.originalPrice - product.price)} so với giá bán lẻ mới</span>
              </p>
            </div>

            {/* Action Buttons with Pastel Accent */}
            <div className="space-y-3">
              <button
                id="btn-buy-escrow"
                type="button"
                onClick={() => setIsEscrowOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-black text-sm shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Mua ngay với Bảo chứng Đồng kiểm 48h</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-make-offer"
                  type="button"
                  onClick={() => setIsOfferOpen(true)}
                  className="py-2.5 px-4 rounded-2xl border border-[#F29BC4]/40 hover:border-[#F29BC4] bg-[#F29BC4]/10 hover:bg-[#F29BC4]/20 text-[#c23f79] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5 text-[#F29BC4]" />
                  <span>Đưa ra đề nghị</span>
                </button>

                <button
                  id="btn-chat-seller"
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nhắn tin người bán</span>
                </button>
              </div>
            </div>

            {/* Escrow Guarantee bullet points */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Ký quỹ giữ tiền 48h:</strong> Tiền của bạn được giữ an toàn trên sàn. Chỉ giải ngân khi bạn đã nhận đồ và kiểm tra đúng mô tả.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Vận chuyển bảo hiểm:</strong> Đền bù 100% nếu có va đập hoặc thất lạc trong quá trình giao hàng.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#F29BC4] shrink-0 mt-0.5" />
                <p>
                  <strong>Hoàn tiền ngay:</strong> Trả hàng miễn phí trong vòng 48h nếu phát hiện sai lệch thông số hoặc trầy xước không báo trước.
                </p>
              </div>
            </div>
          </div>

          {/* Seller Profile Mini Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#F29BC4]/30"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                    <span>{product.seller.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                  </h4>
                  <p className="text-xs text-slate-500">{product.seller.badge || 'Thành viên xác thực'}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.seller.rating}</span>
                </div>
                <span className="text-[11px] text-slate-400">{product.seller.reviewCount} đánh giá</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 block">Đã bán</span>
                <span className="font-bold text-slate-800 tabular-nums">{product.seller.itemsSold || 28} món đồ</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Phản hồi</span>
                <span className="font-bold text-slate-800">{product.seller.responseTime || '< 30p'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended items carousel at bottom (ProductCard Image 1 layout) */}
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
              onSelect={(p) => {
                onSelectProduct(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive Modals */}
      <EscrowModal
        product={product}
        isOpen={isEscrowOpen}
        onClose={() => setIsEscrowOpen(false)}
      />

      <MakeOfferModal
        product={product}
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
      />

      <ChatModal
        product={product}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
