import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, ShoppingBag, ArrowRight, Loader2, MapPin, User, Phone } from 'lucide-react';
import { formatVND } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (qrUrl: string | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // State lưu thông tin giao hàng thật của người dùng
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Hồ Chí Minh');

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

  const handleCheckout = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!customerName.trim() || !phone.trim() || !addressLine.trim()) {
      alert("Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ giao hàng!");
      return;
    }

    setIsCheckingOut(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://atmn.sytes.net/api/v1/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          new_address: {
            title: customerName,
            address_line: addressLine,
            city: city,
            country: "Việt Nam",
            phone_number: phone
          },
          payment_provider: "COD"
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.detail || "Đặt hàng thất bại. Vui lòng kiểm tra lại tồn kho!");
        setIsCheckingOut(false);
        return;
      }

      const orderData = await res.json();
      const qrUrl = orderData.payments?.[0]?.qr_url || null;
      
      setIsCheckingOut(false);
      onCheckoutSuccess(qrUrl);
      
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Lỗi kết nối đến máy chủ thanh toán!");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Giỏ hàng 2Hand</h2>
                <p className="text-xs text-slate-500">{items.length} món đồ đã chọn</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">Giỏ hàng đang trống</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Khám phá các món đồ điện tử & đồ thể thao 2hand được kiểm định và thêm vào giỏ.</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer">
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
                  <span>Danh sách sản phẩm</span>
                  <button onClick={onClearCart} className="text-pink-600 hover:underline font-semibold cursor-pointer">Xóa tất cả</button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl border border-slate-100 bg-white flex gap-3 items-center">
                      <img src={item.product.cover || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase text-slate-400">Sản phẩm trên sàn</span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-slate-900">{formatVND(item.product.price)}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">SL: {item.quantity}</span>
                        </div>
                      </div>
                      <button onClick={() => onRemoveItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                {/* FORM ĐIỀN THÔNG TIN GIAO HÀNG */}
                <div className="pt-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-500"/> Thông tin nhận hàng</h3>
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <input type="text" placeholder="Họ và tên người nhận" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500" />
                      <input type="tel" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500" />
                    </div>
                    <div className="flex gap-2.5">
                      <input type="text" placeholder="Số nhà, Tên đường, Phường/Xã..." value={addressLine} onChange={e => setAddressLine(e.target.value)} className="w-full flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500" />
                      <select value={city} onChange={e => setCity(e.target.value)} className="w-32 px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 bg-white">
                        <option value="Hồ Chí Minh">TP.HCM</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Khác">Tỉnh Khác</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-sky-800">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Bảo vệ đồng kiểm 48h an toàn</span>
                  </div>
                  <p className="text-[11px] text-sky-700 leading-relaxed">Tiền của bạn được giữ tại hệ thống. Bạn có 48 giờ kiểm tra ngoại quan trước khi tiền chuyển cho người bán.</p>
                </div>
              </>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500"><span>Tạm tính</span><span className="font-bold text-slate-900">{formatVND(totalAmount)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Phí bảo hiểm</span><span className="font-bold text-emerald-600">Miễn phí</span></div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200"><span className="font-black text-slate-900">Tổng thanh toán</span><span className="font-black text-slate-900 text-base">{formatVND(totalAmount)}</span></div>
              </div>

              <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full py-3 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-200 transition-all cursor-pointer">
                {isCheckingOut ? <><Loader2 className="w-4 h-4 animate-spin"/> Đang xử lý thanh toán...</> : <><span>Đặt cọc & Lấy mã QR</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};