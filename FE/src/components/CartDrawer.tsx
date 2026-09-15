import React from 'react';
import { X, Trash2, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
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

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">Giỏ hàng đang trống</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Khám phá các món đồ điện tử & đồ thể thao 2hand được kiểm định và thêm vào giỏ.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
                  <span>Danh sách sản phẩm</span>
                  <button
                    onClick={onClearCart}
                    className="text-pink-600 hover:underline font-semibold"
                  >
                    Xóa tất cả
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white flex gap-3 items-center group transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {item.brand} • {item.location}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-slate-900">
                            {formatVND(item.price)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                            {item.conditionLabel}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 48h Escrow Guarantee Notice */}
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-sky-800">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Bảo vệ đồng kiểm 48h an toàn</span>
                  </div>
                  <p className="text-[11px] text-sky-700 leading-relaxed">
                    Tiền cọc được giữ tại hệ thống <strong>2HAND.VN</strong>. Bạn có 48 giờ để kiểm tra ngoại quan và chức năng trước khi tiền được chuyển cho người bán.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span className="font-bold text-slate-900">{formatVND(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phí bảo hiểm đồng kiểm 48h</span>
                  <span className="font-bold text-emerald-600">Miễn phí (Ưu đãi)</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="font-black text-slate-900">Tổng thanh toán</span>
                  <span className="font-black text-slate-900 text-base">{formatVND(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3 rounded-2xl bg-[#009ee2] hover:bg-[#0284c7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-200 transition-all active:scale-98"
              >
                <span>Đặt cọc & Giữ hàng ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
