import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  DollarSign,
  Truck,
  ShieldCheck,
  Sparkles,
  Camera,
  Layers,
  Star,
  ArrowRight,
  ArrowLeft,
  Eye,
  MapPin,
  Laptop,
  Dumbbell,
} from 'lucide-react';
import { ConditionGrade, Product, ScreenType } from '../types';
import { formatVND } from '../data/mockData';

interface CreateListingViewProps {
  onListingCreated: (newProduct: Product) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CreateListingView: React.FC<CreateListingViewProps> = ({
  onListingCreated,
  onNavigate,
}) => {
  const [categoryType, setCategoryType] = useState<'sports' | 'electronics'>('sports');
  const [subCategory, setSubCategory] = useState('Đồng hồ GPS & Định vị');
  const [brand, setBrand] = useState('Garmin');
  const [title, setTitle] = useState('Đồng hồ GPS thể thao Garmin Forerunner 965 Titanium Bezel');
  const [condition, setCondition] = useState<ConditionGrade>('like_new');
  const [conditionPercent, setConditionPercent] = useState<number>(96);
  const [price, setPrice] = useState<number>(8500000);
  const [originalPrice, setOriginalPrice] = useState<number>(15000000);
  const [batteryHealth, setBatteryHealth] = useState<number>(98);
  const [location, setLocation] = useState('Cầu Giấy');
  const [description, setDescription] = useState(
    'Đồng hồ Garmin Forerunner 965 bản viền Titanium đen. Dùng chạy bộ giữ gìn cẩn thận, pin trâu dùng được 18 ngày, màn hình AMOLED không vết xước dăm. Đầy đủ cáp sạc zin và hộp kèm theo.'
  );
  const [hasBox, setHasBox] = useState(true);
  const [hasCharger, setHasCharger] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
  );
  const [isPublished, setIsPublished] = useState(false);

  const samplePhotos = [
    {
      label: 'Ảnh bìa',
      url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Số seri / IMEI',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Phụ kiện & Hộp',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const handlePublish = () => {
    const newProduct: Product = {
      id: `listing-${Date.now()}`,
      title: title || 'Món đồ thể thao & công nghệ mới',
      category: categoryType,
      subCategory: subCategory,
      brand: brand,
      price: price,
      originalPrice: originalPrice,
      condition: condition,
      conditionLabel: `Like New ${conditionPercent}%`,
      conditionPercent: conditionPercent,
      conditionDotColor: conditionPercent >= 96 ? 'green' : 'blue',
      conditionDescription: description,
      timeAgo: 'Vừa xong',
      image: selectedPhoto,
      location: location,
      seller: {
        id: 'sarah-mitchell',
        name: 'Sarah Mitchell',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        rating: 4.98,
        reviewCount: 54,
        verified: true,
        badge: 'Thành viên xác thực',
        responseTime: '< 24h',
        itemsSold: 29,
        joinedDate: '03/2022',
      },
      tags: ['Người bán xác thực', 'Đồng kiểm 48h', 'Pin ' + batteryHealth + '%'],
      batteryHealth: batteryHealth,
      likes: 1,
      sellerNotes: description,
      directPickupAvailable: true,
      featured: true,
    };

    setIsPublished(true);
    setTimeout(() => {
      onListingCreated(newProduct);
      onNavigate('profile');
    }, 1500);
  };

  return (
    <div id="create-listing-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">
          Đăng bài thanh lý với 0% phí sàn
        </span>
      </div>

      {/* 1. TOP 5-STEP PROGRESS BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between max-w-4xl mx-auto overflow-hidden gap-4">
          {[
            { num: 1, label: 'Hình ảnh & Video', icon: Camera },
            { num: 2, label: 'Chi tiết & Danh mục', icon: Layers },
            { num: 3, label: 'Độ mới & Tình trạng', icon: Star },
            { num: 4, label: 'Định giá & Ký quỹ', icon: DollarSign },
            { num: 5, label: 'Vận chuyển', icon: Truck },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="flex items-center gap-2 text-left shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white shadow-md flex items-center justify-center font-bold text-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Bước {s.num}</p>
                  <p className="text-xs font-bold leading-tight text-slate-900">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FORM BODY & STICKY PRICING / PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Sections */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Photos */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">1. Hình ảnh & Video xác thực</h3>
                <p className="text-xs text-slate-500">Chụp rõ các góc cạnh, tem mác và số seri để duyệt nhanh trong 15 phút.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                Đã thêm 3/12 ảnh
              </span>
            </div>

            {/* Drag & drop upload target */}
            <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-sky-50/20 transition-all cursor-pointer">
              <UploadCloud className="w-10 h-10 text-sky-500 mx-auto mb-2" />
              <p className="font-bold text-xs text-slate-800">Kéo thả ảnh vào đây hoặc bấm để chọn ảnh từ máy</p>
              <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 15MB mỗi ảnh)</p>
            </div>

            {/* Photo preview slots */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {samplePhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPhoto(photo.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedPhoto === photo.url ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'
                  }`}
                >
                  <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold py-0.5 px-1 rounded text-center truncate">
                    {photo.label}
                  </span>
                </div>
              ))}
              <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs font-semibold hover:border-slate-300 cursor-pointer">
                <span>+ Thêm ảnh</span>
              </div>
            </div>
          </div>

          {/* Section 2: Details & Category */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
              2. Chi tiết & Danh mục sản phẩm
            </h3>

            {/* Main category toggle (Pastel Blue & Pastel Pink) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategoryType('electronics')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                  categoryType === 'electronics'
                    ? 'border-sky-400 bg-sky-50/70 ring-2 ring-sky-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Đồ điện tử (Tech & Audio)</span>
                  <span className="text-[11px] text-slate-500">Laptop, tai nghe, iPad, bàn phím</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategoryType('sports')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                  categoryType === 'sports'
                    ? 'border-[#F29BC4] bg-[#F29BC4]/15 ring-2 ring-[#F29BC4]/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#F29BC4]/20 text-[#c23f79] flex items-center justify-center shrink-0 mt-0.5">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Dụng cụ & Trang phục Thể thao</span>
                  <span className="text-[11px] text-slate-500">Vợt, giày chạy, đồng hồ GPS</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Danh mục phụ</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="Đồng hồ GPS & Định vị">Đồng hồ GPS & Định vị</option>
                  <option value="Vợt cầu lông & Pickleball">Vợt cầu lông & Pickleball</option>
                  <option value="Giày chạy bộ & Thể thao">Giày chạy bộ & Thể thao</option>
                  <option value="Tai nghe chống ồn">Tai nghe chống ồn</option>
                  <option value="Bàn phím & Chuột gaming">Bàn phím & Chuột gaming</option>
                  <option value="Laptop & Máy tính bảng">Laptop & Máy tính bảng</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Thương hiệu</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ví dụ: Garmin, Apple, Sony, Nike..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Khu vực giao dịch</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Quận 1, Cầu Giấy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề tin đăng bán</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Section 3: Condition & History */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
              3. Độ mới ngoại quan & Tình trạng sử dụng
            </h3>

            {/* Percentage selector matching Image 1 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-700">Ước tính độ mới ngoại quan:</span>
                <span className="font-black text-sky-600 text-sm tabular-nums">● {conditionPercent}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="99"
                value={conditionPercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setConditionPercent(val);
                  if (val >= 97) setCondition('like_new');
                  else if (val >= 92) setCondition('good');
                  else setCondition('fair');
                }}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Cũ nhẹ 80%</span>
                <span>Cũ đẹp 93%-96%</span>
                <span>Like New 98%-99%</span>
              </div>
            </div>

            {/* Battery health */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-700">Dung lượng pin còn lại (nếu có):</span>
                <span className="font-extrabold text-emerald-600 tabular-nums">{batteryHealth}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Detailed description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mô tả chi tiết & Nguồn gốc xuất xứ
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed"
              />
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBox}
                  onChange={(e) => setHasBox(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="font-medium text-slate-800">Còn nguyên hộp gốc</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCharger}
                  onChange={(e) => setHasCharger(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="font-medium text-slate-800">Cáp sạc zin</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLoggedOut}
                  onChange={(e) => setIsLoggedOut(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="font-medium text-slate-800">Đã thoát tài khoản</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sticky Column: AI Pricing Match & Live Preview */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* AI Match Pricing Guidance */}
          <div
            id="ai-pricing-card"
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>GỢI Ý ĐỊNH GIÁ NHANH</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Giá bạn muốn bán (VNĐ):
              </label>
              <input
                type="number"
                step="100000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-lg font-black text-sky-600 tabular-nums"
              />
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Giá đăng bán:</span>
                <span className="font-bold text-slate-800 tabular-nums">{formatVND(price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí sàn 2HAND.VN:</span>
                <span className="font-bold text-emerald-600">0đ (0% Miễn phí người bán)</span>
              </div>
              <div className="flex justify-between">
                <span>Bảo hiểm & Đồng kiểm:</span>
                <span className="text-slate-500">Người mua chi trả</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Thực nhận về tài khoản:</span>
                <span className="text-[#009ee2] tabular-nums text-base">{formatVND(price)}</span>
              </div>
            </div>

            {/* Guarantee notice */}
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>100% An Toàn:</strong> Tiền được giữ ký quỹ trên sàn và chuyển khoản trực tiếp về ngân hàng ngay khi người mua hoàn tất kiểm tra.
              </p>
            </div>
          </div>

          {/* Live Preview Card matching Image 1 layout */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Xem trước thẻ hiển thị</h4>
              <Eye className="w-4 h-4 text-slate-400" />
            </div>

            {/* Preview Card matching Image 1 */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                <img src={selectedPhoto} alt="Live preview" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1.5 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Like New {conditionPercent}%</span>
                </div>
                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white shadow-xs ${
                  categoryType === 'electronics' ? 'bg-[#009ee2]' : 'bg-[#e11d48]'
                }`}>
                  {categoryType === 'electronics' ? 'ĐIỆN TỬ' : 'THỂ THAO'}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-extrabold uppercase tracking-wider text-slate-600">{brand}</span>
                  <span className="flex items-center gap-0.5 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{location}</span>
                  </span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                  {title}
                </h4>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-black text-slate-900 tabular-nums">
                    {formatVND(price)}
                  </span>
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    {formatVND(originalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM STICKY ACTION BAR */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-800">Bản nháp: Đã sẵn sàng duyệt</span>
          <span className="text-slate-400">• Phí hoa hồng sàn 0%</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lưu nháp
          </button>
          <button
            id="btn-publish-listing"
            type="button"
            onClick={handlePublish}
            disabled={isPublished}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-200 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
          >
            {isPublished ? (
              <>
                <CheckCircle2 className="w-4 h-4 animate-spin" />
                <span>Đang đăng tin lên sàn...</span>
              </>
            ) : (
              <>
                <span>Đăng tin ngay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
