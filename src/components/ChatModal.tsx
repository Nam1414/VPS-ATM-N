import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Shield, CheckCheck, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface ChatModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ product, isOpen, onClose }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Xử lý an toàn Avatar bị "null" từ Database
  const sellerAvatar = (!product.seller.avatar || String(product.seller.avatar).trim() === 'null') 
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' 
    : product.seller.avatar;

  useEffect(() => {
    if (!isOpen) return;
    const fetchChatHistory = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return; // Nếu không có token thì không gọi API để tránh lỗi 401
        
        const res = await fetch(`https://atmn.sytes.net/api/v1/products/${product.id}/chat`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatHistory();
  }, [isOpen, product.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.");
        return;
    }

    setIsSending(true);
    const textToSend = inputMsg;
    setInputMsg('');

    try {
      // Ép ID thành số. Nếu ID là "admin" (chữ) thì mặc định gán là 1
      const parsedReceiverId = parseInt(product.seller.id);
      const safeReceiverId = isNaN(parsedReceiverId) ? 1 : parsedReceiverId;

      const res = await fetch(`https://atmn.sytes.net/api/v1/products/${product.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: safeReceiverId,
          content: textToSend
        })
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Lỗi gửi tin (${res.status}): ${errData.detail || 'Không xác định'}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const currentUserId = (() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try { return JSON.parse(atob(token.split('.')[1])).sub; } catch(e) { return null; }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-[540px] rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={sellerAvatar} alt={product.seller.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400" />
            <div>
              <h4 className="font-bold text-sm text-slate-900">{product.seller.name}</h4>
              <p className="text-[11px] text-slate-500">Người bán đã nhận thông báo qua Email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-sky-50 px-3 py-1.5 text-[11px] text-sky-800 flex items-center justify-center gap-1.5 border-b border-sky-100">
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>Luôn giao dịch qua <strong>Hệ thống 2HAND</strong> để được bảo vệ quyền lợi.</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin text-sky-500" /></div>
          ) : messages.length === 0 ? (
            <div className="text-center text-xs text-slate-400 mt-10">Chưa có tin nhắn nào. Hãy gửi lời chào!</div>
          ) : (
            messages.map((m) => {
              const isMine = String(m.sender_id) === String(currentUserId);
              return (
                <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${isMine ? 'bg-sky-500 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                    {m.content}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{new Date(m.created_at).toLocaleTimeString('vi-VN')}</span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="Nhắn tin cho người bán..." className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500" />
          <button type="submit" disabled={isSending} className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white cursor-pointer">
            {isSending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};