import React, { useState } from 'react';
import { Tag, X, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../data/mockData';

interface MakeOfferModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ product, isOpen, onClose }) => {
  const suggestedOffer = Math.round(product.price * 0.93 / 10000) * 10000;
  const [offerPrice, setOfferPrice] = useState<number>(suggestedOffer);
  const [message, setMessage] = useState('Chào bạn, mình rất quan tâm đến máy và muốn trả mức giá này, nếu được mình thanh toán ký quỹ ngay hôm nay.');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`https://atmn.sytes.net/api/v1/products/${product.id}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          offer_price: offerPrice,
          message: message
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      } else {
        alert("Vui lòng đăng nhập để trả giá!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-sm text-slate-800">Đưa ra đề nghị / Trả giá</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center"><Check className="w-6 h-6" /></div>
              <h4 className="font-bold text-slate-900">Đã gửi đề nghị thành công!</h4>
              <p className="text-xs text-slate-500">Người bán {product.seller.name} đã nhận được Email thông báo và sẽ phản hồi sớm nhất.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <p className="text-slate-500">Giá niêm yết hiện tại:</p>
                <p className="text-base font-extrabold text-slate-800 tabular-nums">{formatVND(product.price)}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mức giá bạn đề xuất (VNĐ)</label>
                <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(Number(e.target.value))} step="50000" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold tabular-nums text-sm focus:outline-none focus:border-sky-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tin nhắn kèm theo cho người bán</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500" />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                  {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin"/> Đang gửi...</> : <><span>Gửi mức giá này</span><ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};