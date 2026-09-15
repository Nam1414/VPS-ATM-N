import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, X, Clock, ArrowRight, Truck, CreditCard } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../data/mockData';

interface EscrowModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const EscrowModal: React.FC<EscrowModalProps> = ({ product, isOpen, onClose }) => {
  const [step, setStep] = useState<'review' | 'shipping' | 'success'>('review');
  const [shippingMethod, setShippingMethod] = useState<'courier' | 'pickup'>('courier');
  const [buyerName, setBuyerName] = useState('Đinh Quỳnh Anh');
  const [buyerPhone, setBuyerPhone] = useState('0912 345 678');
  const [buyerAddress, setBuyerAddress] = useState('Số 18 Phố Lý Thường Kiệt, Hoàn Kiếm, Hà Nội');

  if (!isOpen) return null;

  const shippingFee = shippingMethod === 'courier' ? 290000 : 0;
  const totalAmount = product.price + shippingFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="escrow-checkout-modal"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm shadow-rose-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                Ký quỹ Bảo vệ Người mua LoopGuard™
              </h3>
              <p className="text-xs text-rose-700 font-medium">
                Tiền được giữ an toàn 48h tới khi bạn nhận và test máy thành công
              </p>
            </div>
          </div>
          <button
            id="close-escrow-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'review' && (
            <div className="space-y-5">
              {/* Product mini summary */}
              <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 rounded-lg object-cover bg-white"
                />
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                    {product.conditionLabel}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{product.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Người bán: {product.seller.name} ★ 5.0</p>
                  <p className="text-base font-extrabold text-rose-600 mt-1 tabular-nums">
                    {formatVND(product.price)}
                  </p>
                </div>
              </div>

              {/* LoopGuard Guarantee Pillars */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cơ chế an toàn 3 tầng:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>48h Kiểm tra:</strong> Toàn quyền test phần cứng trước khi đồng ý giải ngân.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-50/60 border border-sky-100 text-sky-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Ký quỹ trung gian:</strong> Người bán chưa nhận tiền cho đến khi bạn xác nhận.</span>
                  </div>
                </div>
              </div>

              {/* Delivery method selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Phương thức giao hàng</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('courier')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      shippingMethod === 'courier'
                        ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Truck className="w-4 h-4 text-rose-600" />
                      <span className="text-xs font-bold text-slate-900 tabular-nums">290.000đ</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-2">Chuyển phát bảo hiểm</p>
                    <p className="text-[11px] text-slate-500">2-3 ngày, hộp chống sốc</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('pickup')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      shippingMethod === 'pickup'
                        ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-emerald-600">Miễn phí</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-2">Tại Điểm xác thực</p>
                    <p className="text-[11px] text-slate-500">Test trực tiếp tại trung tâm</p>
                  </button>
                </div>
              </div>

              {/* Price summary */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Giá thiết bị:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{formatVND(product.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí bảo hiểm vận chuyển:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {shippingMethod === 'courier' ? '290.000đ' : '0đ (Nhận tại trạm)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí bảo vệ ký quỹ LoopGuard™:</span>
                  <span className="font-semibold text-emerald-600">Miễn phí (Tài trợ bởi LoopGear)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Tổng tiền vào tài khoản ký quỹ:</span>
                  <span className="text-rose-600 tabular-nums text-base">{formatVND(totalAmount)}</span>
                </div>
              </div>

              <button
                id="btn-proceed-shipping"
                onClick={() => setStep('shipping')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
              >
                <span>Tiếp tục: Nhập địa chỉ nhận hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'shipping' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Thông tin người nhận & Địa chỉ giao hàng</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Họ và tên người nhận</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 text-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 text-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Địa chỉ nhận hàng chi tiết</label>
                  <input
                    type="text"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 text-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <div className="flex-1">
                  <p className="font-bold text-slate-800">Phương thức chuyển khoản Ký quỹ</p>
                  <p className="text-[11px] text-slate-500">Mã QR VietQR chuẩn ngân hàng Napas247</p>
                </div>
                <span className="font-extrabold text-rose-600 tabular-nums">{formatVND(totalAmount)}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Quay lại
                </button>
                <button
                  id="btn-confirm-escrow-payment"
                  onClick={() => setStep('success')}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Xác nhận Nạp Ký quỹ an toàn</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">Ký quỹ thành công! Mã đơn #LG-89421</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Số tiền <strong>{formatVND(totalAmount)}</strong> đã được khóa trong tài khoản bảo chứng LoopGuard an toàn.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Các bước tiếp theo:</span>
                </div>
                <p className="text-slate-600 pl-6">1. Người bán Marcus Chen đã nhận được thông báo đóng gói thiết bị.</p>
                <p className="text-slate-600 pl-6">2. Đơn vị vận chuyển lấy hàng trong vòng 24 giờ với mã vận đơn có bảo hiểm.</p>
                <p className="text-slate-600 pl-6">3. Sau khi nhận máy, bạn có <strong>48 giờ thử nghiệm</strong> trước khi tiền giải ngân.</p>
              </div>

              <button
                id="btn-finish-escrow"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Đóng và theo dõi đơn hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
