import React, { useState } from 'react';
import { Send, X, Shield, CheckCheck } from 'lucide-react';
import { Product } from '../types';

interface ChatModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ product, isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ id: string; sender: 'user' | 'seller'; text: string; time: string }[]>([
    {
      id: '1',
      sender: 'seller',
      text: `Chào bạn! Cảm ơn bạn đã quan tâm đến ${product.title}. Thiết bị được kiểm định đầy đủ theo chuẩn LoopGear, bạn cần mình hỗ trợ thêm thông tin gì không?`,
      time: '12:30',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMessage = inputMsg;
    setInputMsg('');
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: userMessage, time: 'Vừa xong' },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'seller',
          text: 'Cảm ơn câu hỏi của bạn! Máy nguyên zin 100% chưa qua sửa chữa, pin giữ cực tốt và luôn sẵn sàng gửi bảo hiểm hoặc gặp mặt tại trạm kiểm định của LoopGear nhé!',
          time: 'Vừa xong',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div
        id="chat-seller-modal"
        className="bg-white w-full max-w-lg h-[540px] rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-900">{product.seller.name}</h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Người bán xác thực
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Phản hồi trung bình ~15 phút • Đang hoạt động</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security bar */}
        <div className="bg-sky-50 px-3 py-1.5 text-[11px] text-sky-800 flex items-center justify-center gap-1.5 border-b border-sky-100">
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>Luôn giao dịch qua <strong>Ký quỹ LoopGuard</strong> để được bảo vệ quyền lợi 100%.</span>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-rose-500 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                {m.time}
                {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-rose-500" />}
              </span>
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Nhắn tin cho người bán..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
