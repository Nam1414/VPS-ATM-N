import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCheck,
  CheckCircle2,
  FileCheck,
  LayoutDashboard,
  PackageCheck,
  Store,
  Users,
  X,
  ShieldCheck,
  Search,
  ShoppingCart,
  Box 
} from 'lucide-react';
import { ScreenType } from '../types';
import { formatVND } from '../data/mockData';

export const AdminView: React.FC<{ onNavigate: (screen: ScreenType) => void }> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'listings' | 'orders'>('overview');
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({ total_users: 0, total_orders: 0, total_products: 0 });
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);

  const [searchOrderId, setSearchOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [isSearchingOrder, setIsSearchingOrder] = useState(false);

  // 1. GỌI API LẤY THỐNG KÊ (DASHBOARD)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('https://atmn.sytes.net/api/v1/auth/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          // HIỂN THỊ LỖI NẾU KHÔNG CÓ QUYỀN
          const errorData = await res.json();
          console.warn("API Thống kê bị chặn:", errorData.detail);
          if(res.status === 403) {
            alert("Tài khoản của bạn chưa có quyền Admin trong cơ sở dữ liệu. Vui lòng vào pgAdmin sửa cột 'role' thành 'admin'.");
          }
        }
      } catch (error) { 
        console.error("Lỗi lấy thống kê", error); 
      }
    };
    fetchStats();
  }, []);

  // 2. GỌI API LẤY DANH SÁCH SẢN PHẨM CHỜ DUYỆT
  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://atmn.sytes.net/api/v1/admin/products/pending', { 
          headers: token ? { 'Authorization': `Bearer ${token}` } : {} 
        });

        if (response.ok) {
          const data = await response.json();
          setPendingProducts(data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách chờ duyệt:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingProducts();
  }, []);

  const handleApproveProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://atmn.sytes.net/api/v1/admin/products/${productId}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showAdminNotice('Đã duyệt tin đăng thành công!');
        setPendingProducts(current => current.filter(p => p.id.toString() !== productId.toString()));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderId) return;
    setIsSearchingOrder(true);
    setFoundOrder(null);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`https://atmn.sytes.net/api/v1/orders/${searchOrderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFoundOrder(data);
      } else {
        alert("Không tìm thấy đơn hàng hoặc bạn không có quyền xem!");
      }
    } catch (error) {
      alert("Lỗi kết nối.");
    } finally {
      setIsSearchingOrder(false);
    }
  };

  const handleUpdateOrderStatus = async (newStatus: string) => {
    if (!foundOrder) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`https://atmn.sytes.net/api/v1/orders/${foundOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setFoundOrder(updated);
        showAdminNotice(`Đã cập nhật đơn hàng sang: ${newStatus}`);
      }
    } catch (error) {
      alert("Lỗi cập nhật trạng thái.");
    }
  };

  const showAdminNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div id="admin-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <button type="button" onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
      </button>

      <section className="rounded-[28px] bg-slate-950 text-white p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sky-300 text-xs font-black uppercase tracking-[0.18em]">
            <ShieldCheck className="w-4 h-4" /> Trung tâm vận hành Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-3">Quản lý hệ thống 2HAND</h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">Tổng quan dữ liệu thực tế và quản trị nền tảng.</p>
        </div>
        <div className="absolute -right-8 -bottom-16 w-56 h-56 rounded-full border-[24px] border-sky-400/20" />
      </section>

      <nav className="bg-white rounded-2xl border border-slate-200/80 p-1.5 flex gap-1 overflow-x-auto shadow-xs">
        <AdminNavButton active={activeSection === 'overview'} icon={<LayoutDashboard />} label="Tổng quan" onClick={() => setActiveSection('overview')} />
        <AdminNavButton active={activeSection === 'listings'} icon={<FileCheck />} label={`Tin chờ duyệt (${pendingProducts.length})`} onClick={() => setActiveSection('listings')} />
        <AdminNavButton active={activeSection === 'orders'} icon={<ShoppingCart />} label="Quản lý Đơn hàng" onClick={() => setActiveSection('orders')} />
      </nav>

      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center"><Users className="w-6 h-6"/></div>
              <div><p className="text-sm text-slate-500 font-bold">Tổng Người Dùng</p><p className="text-2xl font-black">{stats.total_users}</p></div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><ShoppingCart className="w-6 h-6"/></div>
              <div><p className="text-sm text-slate-500 font-bold">Tổng Đơn Hàng</p><p className="text-2xl font-black">{stats.total_orders}</p></div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><Box className="w-6 h-6"/></div>
              <div><p className="text-sm text-slate-500 font-bold">Tổng Sản Phẩm</p><p className="text-2xl font-black">{stats.total_products}</p></div>
            </div>
          </div>

          {pendingProducts.length > 0 && (
            <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 flex justify-between items-center">
              <div>
                <h3 className="font-black text-sky-950 text-xl">Sản phẩm chờ lên sàn</h3>
                <p className="text-sm text-sky-800/70 mt-1">Đang có {pendingProducts.length} sản phẩm cần bạn kiểm duyệt.</p>
              </div>
              <button onClick={() => setActiveSection('listings')} className="px-6 py-3 bg-sky-600 text-white font-bold rounded-2xl shadow-md cursor-pointer hover:bg-sky-700">Chuyển đến Kiểm duyệt</button>
            </div>
          )}
        </div>
      )}

      {activeSection === 'listings' && (
        <OperationsPanel type="listings" isLoading={isLoading} pendingProducts={pendingProducts} onApproveProduct={handleApproveProduct} />
      )}

      {activeSection === 'orders' && (
        <section className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs min-h-[400px]">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600"><ShoppingCart className="w-4 h-4" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-950">Tra cứu & Cập nhật đơn hàng</h2>
              <p className="text-xs text-slate-400 mt-1">Nhập ID đơn hàng để xem chi tiết và thay đổi trạng thái (Giao hàng, Hoàn thành...).</p>
            </div>
          </div>

          <form onSubmit={handleSearchOrder} className="flex gap-3 max-w-lg mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <input type="number" required placeholder="Nhập ID đơn hàng (VD: 100)" value={searchOrderId} onChange={e => setSearchOrderId(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-sky-500" />
            </div>
            <button type="submit" disabled={isSearchingOrder} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl cursor-pointer">
              {isSearchingOrder ? 'Đang tìm...' : 'Tra cứu'}
            </button>
          </form>

          {foundOrder && (
            <div className="p-6 rounded-3xl border border-sky-100 bg-sky-50/30 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Mã đơn: #{foundOrder.id}</h3>
                  <p className="text-xs text-slate-500 mt-1">Ngày tạo: {new Date(foundOrder.created_at).toLocaleString('vi-VN')}</p>
                </div>
                <span className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider">{foundOrder.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-2xl border border-slate-100">
                <div><span className="block text-xs text-slate-400 mb-1">Khách hàng / SĐT:</span><span className="font-bold">{foundOrder.address?.title} - {foundOrder.address?.phone_number}</span></div>
                <div><span className="block text-xs text-slate-400 mb-1">Địa chỉ giao:</span><span className="font-bold">{foundOrder.address?.address_line}, {foundOrder.address?.city}</span></div>
                <div><span className="block text-xs text-slate-400 mb-1">Tổng tiền:</span><span className="font-black text-sky-600 text-base">{formatVND(foundOrder.total)}</span></div>
                <div><span className="block text-xs text-slate-400 mb-1">Thanh toán:</span><span className="font-bold text-amber-600">{foundOrder.payments?.[0]?.status === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}</span></div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-3">CẬP NHẬT TRẠNG THÁI MỚI:</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleUpdateOrderStatus('confirmed')} className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold rounded-xl text-xs cursor-pointer">Xác nhận đơn</button>
                  <button onClick={() => handleUpdateOrderStatus('shipping')} className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 font-bold rounded-xl text-xs cursor-pointer">Đang giao hàng</button>
                  <button onClick={() => handleUpdateOrderStatus('completed')} className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold rounded-xl text-xs cursor-pointer">Hoàn thành</button>
                  <button onClick={() => handleUpdateOrderStatus('cancelled')} className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold rounded-xl text-xs cursor-pointer">Hủy đơn</button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {notice && <div className="fixed bottom-5 right-5 z-[60] max-w-sm px-4 py-3 rounded-2xl bg-slate-950 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5"><CheckCheck className="w-4 h-4 text-emerald-400" />{notice}</div>}
    </div>
  );
};

const AdminNavButton = ({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${active ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>{label}
  </button>
);

const OperationsPanel = ({ type, pendingProducts, isLoading, onApproveProduct }: { type: 'listings'; pendingProducts: any[]; isLoading: boolean; onApproveProduct?: (id: string) => void }) => (
  <section className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs">
    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-50 text-sky-600">
        <PackageCheck className="w-4 h-4" />
      </div>
      <div>
        <h2 className="text-lg font-black text-slate-950">Kiểm duyệt tin đăng</h2>
        <p className="text-xs text-slate-400 mt-1">Sản phẩm người dùng vừa tạo (Status: pending). Hãy kiểm tra để đưa lên sàn.</p>
      </div>
    </div>

    {isLoading ? (
      <div className="py-12 text-center text-sm text-slate-400 animate-pulse">Đang tải dữ liệu từ máy chủ...</div>
    ) : pendingProducts.length === 0 ? (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 opacity-50" />
        <p className="text-sm font-bold text-slate-700">Tuyệt vời! Hệ thống đã sạch sẽ.</p>
      </div>
    ) : (
      <div className="divide-y divide-slate-100">
        {pendingProducts.map((prod) => (
          <div key={prod.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 hover:bg-slate-50/50 rounded-2xl px-2 transition-colors">
            <img src={prod.cover || 'https://via.placeholder.com/100'} alt={prod.name} className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{prod.name}</h4>
              <p className="text-xs text-slate-500 font-bold text-sky-600">{formatVND(prod.price)}</p>
            </div>
            <button type="button" onClick={() => onApproveProduct && onApproveProduct(prod.id)} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />Duyệt & Đăng lên sàn
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
);