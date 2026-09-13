import React from 'react';
import { Layers, ShieldCheck, Globe, Mail, Share2 } from 'lucide-react';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate?: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="app-footer" className="bg-white border-t border-slate-200/80 pt-16 pb-12 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-200">
                <Layers className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-slate-900 tracking-tight">2HAND</span>
                  <span className="text-xl font-black text-sky-500">.VN</span>
                </div>
                <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase -mt-0.5">
                  TECH & SPORT
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              Sàn giao dịch chuyên biệt cho đồ điện tử lướt & dụng cụ thể thao tuyển chọn. Minh bạch ngoại quan, kiểm định trung thực và hỗ trợ đồng kiểm 48h.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs text-sky-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <div>
                <p className="font-bold text-sky-950 leading-tight">Đồng kiểm & Ký quỹ 48h</p>
                <p className="text-[11px] text-sky-700 leading-tight">Bảo đảm người mua kiểm tra thiết bị trước khi thanh toán</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <button id="footer-social-globe" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Website">
                <Globe className="w-4 h-4" />
              </button>
              <button id="footer-social-mail" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Hỗ trợ qua email">
                <Mail className="w-4 h-4" />
              </button>
              <button id="footer-social-share" className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Chia sẻ cộng đồng">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 1: Sports */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              <span>Dụng Cụ Thể Thao</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-pink-600 transition-colors text-left">
                  Vợt cầu lông & Pickleball
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-pink-600 transition-colors text-left">
                  Giày chạy bộ Nike, Garmin
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-pink-600 transition-colors text-left">
                  Đồng hồ GPS & Thiết bị nhịp tim
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-pink-600 transition-colors text-left">
                  Xe đạp thể thao & Phụ kiện can
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Electronics */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>Đồ Điện Tử (Tech)</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-sky-600 transition-colors text-left">
                  Tai nghe chống ồn Sony, Bose
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-sky-600 transition-colors text-left">
                  Bàn phím cơ & Chuột gaming
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-sky-600 transition-colors text-left">
                  iPad, Máy tính bảng lướt 99%
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-sky-600 transition-colors text-left">
                  MacBook & Laptop văn phòng
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-4">Tin cậy & Hỗ trợ</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <button onClick={() => onNavigate?.('home')} className="hover:text-sky-600 transition-colors text-left">
                  Chính sách đồng kiểm 48h
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('catalog')} className="hover:text-sky-600 transition-colors text-left">
                  Thang đo độ mới ngoại quan %
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('sell')} className="hover:text-sky-600 transition-colors text-left">
                  Phí sàn 0% cho người bán
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('home')} className="hover:text-sky-600 transition-colors text-left">
                  Trung tâm trợ giúp 24/7
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2025 2HAND.VN (Tech & Sport). Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-600 transition-colors">Chính sách bảo mật</a>
            <a href="#terms" className="hover:text-slate-600 transition-colors">Điều khoản dịch vụ</a>
            <a href="#escrow" className="hover:text-slate-600 transition-colors">Thỏa thuận đồng kiểm</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
