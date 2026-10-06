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
  Loader2,
  X
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
  const [categoryType, setCategoryType] = useState<'sports' | 'electronics'>('electronics');
  const [subCategory, setSubCategory] = useState('Linh kiện');
  const [brand, setBrand] = useState('Khác');
  
  // ĐÃ SỬA THÀNH FORM TRỐNG
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState<ConditionGrade>('like_new');
  const [conditionPercent, setConditionPercent] = useState<number>(95);
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [location, setLocation] = useState('Hồ Chí Minh');
  const [description, setDescription] = useState('');

  // ẢNH TRỐNG
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMsg(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', '2hand_preset'); 

        const cloudName = 'dy9rmenzc'; 
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.secure_url);
        } else {
          throw new Error("Lỗi tải ảnh lên Cloudinary!");
        }
      }

      const updatedImages = [...imageUrls, ...uploadedUrls];
      setImageUrls(updatedImages);
      if (!selectedPhoto && updatedImages.length > 0) {
        setSelectedPhoto(updatedImages[0]);
      }
    } catch (err: any) {
      console.error("Lỗi upload ảnh:", err);
      setErrorMsg("Không thể tải ảnh lên. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = imageUrls.filter((_, idx) => idx !== indexToRemove);
    setImageUrls(updated);
    if (selectedPhoto === imageUrls[indexToRemove]) {
      setSelectedPhoto(updated[0] || '');
    }
  };

  const handlePublish = async () => {
    // KIỂM TRA ĐIỀU KIỆN TRƯỚC KHI ĐĂNG
    if (!title || !price || !description) {
      setErrorMsg("Vui lòng điền đầy đủ Tiêu đề, Giá và Mô tả!");
      return;
    }
    if (imageUrls.length === 0) {
      setErrorMsg("Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm!");
      return;
    }

    setIsPublished(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error("Vui lòng đăng nhập lại để thực hiện đăng tin.");

      // GỌI API VỀ MÁY TÍNH LOCAL
      const response = await fetch('https://atmn.sytes.net/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: categoryType === 'electronics' ? 2 : 1,
          name: title,
          summary: description.slice(0, 100),
          description: description,
          cover: selectedPhoto || imageUrls[0],
          price: Number(price),
          condition_status: `Độ mới ${conditionPercent}%`,
          status: 'pending', 
          stock_quantity: 1,
          image_urls: imageUrls,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Không thể đăng tin lên máy chủ.');
      }

      const savedProduct = await response.json();

      const newProduct: Product = {
        id: savedProduct.id.toString(),
        title: savedProduct.name,
        category: categoryType,
        subCategory: subCategory,
        brand: brand,
        price: savedProduct.price,
        originalPrice: Number(originalPrice) || savedProduct.price,
        condition: condition,
        conditionLabel: savedProduct.condition_status,
        conditionPercent: conditionPercent,
        conditionDotColor: 'amber', 
        conditionDescription: description,
        timeAgo: 'Vừa đăng',
        image: savedProduct.cover,
        location: location,
        status: 'pending',
        seller: {
          id: 'current-user',
          name: 'Bạn',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          rating: 5.0,
          reviewCount: 0,
          verified: true,
          badge: 'Thành viên mới',
        },
        tags: ['Chờ duyệt'],
        batteryHealth: 100,
        likes: 0,
      };

      setTimeout(() => {
        onListingCreated(newProduct);
        onNavigate('home');
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Lỗi kết nối Backend');
      setIsPublished(false);
    }
  };

  return (
    <div id="create-listing-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /><span>Quay lại trang chủ</span>
        </button>
        <span className="text-xs font-semibold text-slate-400">Đăng bài thanh lý với 0% phí sàn</span>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">1. Hình ảnh xác thực</h3>
                <p className="text-xs text-slate-500">Tải ảnh thật của sản phẩm lên hệ thống.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                Đã thêm {imageUrls.length} ảnh
              </span>
            </div>

            <label className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-sky-50/20 transition-all cursor-pointer block">
              <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-2" />
                  <p className="font-bold text-xs text-slate-800">Đang tải ảnh lên hệ thống...</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-sky-500 mx-auto mb-2" />
                  <p className="font-bold text-xs text-slate-800">Kéo thả ảnh vào đây hoặc bấm để chọn ảnh từ máy</p>
                  <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
                </>
              )}
            </label>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {imageUrls.map((url, i) => (
                  <div key={i} onClick={() => setSelectedPhoto(url)} className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selectedPhoto === url ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'}`}>
                    <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-rose-600 transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
                    <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] font-bold py-0.5 px-1 rounded text-center truncate">{selectedPhoto === url ? 'Ảnh bìa' : `Ảnh ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">2. Chi tiết & Danh mục sản phẩm</h3>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setCategoryType('electronics')} className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${categoryType === 'electronics' ? 'border-sky-400 bg-sky-50/70 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                <Laptop className="w-5 h-5 text-sky-600 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Đồ điện tử (Tech)</span>
                  <span className="text-[11px] text-slate-500">Linh kiện, thiết bị</span>
                </div>
              </button>
              <button type="button" onClick={() => setCategoryType('sports')} className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${categoryType === 'sports' ? 'border-pink-400 bg-pink-50/70 ring-2 ring-pink-100' : 'border-slate-200'}`}>
                <Dumbbell className="w-5 h-5 text-pink-600 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Thể thao</span>
                  <span className="text-[11px] text-slate-500">Dụng cụ tập luyện</span>
                </div>
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề tin đăng bán</label>
              <input type="text" placeholder="Ví dụ: Bán VGA RTX 3060 cũ..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả chi tiết</label>
              <textarea rows={3} placeholder="Mô tả chi tiết tình trạng máy, phụ kiện đi kèm..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">3. Độ mới & Tình trạng</h3>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Độ mới ngoại quan:</span>
                <span className="font-black text-sky-600">{conditionPercent}%</span>
              </div>
              <input type="range" min="80" max="99" value={conditionPercent} onChange={(e) => setConditionPercent(Number(e.target.value))} className="w-full accent-sky-500 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>GỢI Ý ĐỊNH GIÁ & THANH TOÁN</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Giá bán mong muốn (VNĐ):</label>
              <input type="number" placeholder="Nhập giá bán..." value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-lg font-black text-sky-600 tabular-nums focus:outline-none focus:border-sky-500" />
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Phí sàn 2HAND.VN:</span>
                <span className="font-bold text-emerald-600">0đ (Miễn phí)</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Thực nhận về tài khoản:</span>
                <span className="text-[#009ee2] tabular-nums text-base">{formatVND(Number(price) || 0)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublished}
              className="w-full py-3.5 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isPublished ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang xử lý...</span></>
              ) : (
                <><span>Gửi duyệt tin đăng</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">Tin đăng sẽ được Admin xét duyệt trước khi hiển thị công khai trên hệ thống.</p>
          </div>
        </div>
      </div>
    </div>
  );
};