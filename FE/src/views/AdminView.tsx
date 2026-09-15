import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Ban,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Filter,
  FileCheck,
  LayoutDashboard,
  Mail,
  MoreHorizontal,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { ScreenType } from '../types';

type AccountStatus = 'active' | 'pending' | 'suspended';
type AccountRole = 'seller' | 'buyer';

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: AccountRole;
  status: AccountStatus;
  verified: boolean;
  listings: number;
  sold: number;
  joined: string;
  location: string;
  rating: number;
};

const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'minh-seller',
    name: 'Minh Nguyễn',
    email: 'minh.nguyen@2hand.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    role: 'seller',
    status: 'active',
    verified: true,
    listings: 6,
    sold: 28,
    joined: '03/2022',
    location: 'Quận 1, TP.HCM',
    rating: 4.98,
  },
  {
    id: 'quoc-viet',
    name: 'Quốc Việt',
    email: 'quoc.viet@2hand.vn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    role: 'seller',
    status: 'active',
    verified: true,
    listings: 4,
    sold: 14,
    joined: '06/2023',
    location: 'Thanh Xuân, Hà Nội',
    rating: 4.95,
  },
  {
    id: 'thanh-tung',
    name: 'Thanh Tùng',
    email: 'tung.apple@2hand.vn',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    role: 'seller',
    status: 'pending',
    verified: false,
    listings: 3,
    sold: 32,
    joined: '09/2024',
    location: 'Bình Thạnh, TP.HCM',
    rating: 5,
  },
  {
    id: 'linh-chi',
    name: 'Linh Chi',
    email: 'linh.chi@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    role: 'buyer',
    status: 'active',
    verified: true,
    listings: 0,
    sold: 0,
    joined: '02/2025',
    location: 'Cầu Giấy, Hà Nội',
    rating: 0,
  },
  {
    id: 'quang-huy',
    name: 'Quang Huy',
    email: 'quang.huy@2hand.vn',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
    role: 'seller',
    status: 'suspended',
    verified: false,
    listings: 1,
    sold: 19,
    joined: '11/2023',
    location: 'Hải Châu, Đà Nẵng',
    rating: 4.8,
  },
];

const statusLabels: Record<AccountStatus, string> = {
  active: 'Đang hoạt động',
  pending: 'Chờ duyệt',
  suspended: 'Đã khóa',
};

export const AdminView: React.FC<{ onNavigate: (screen: ScreenType) => void }> = ({ onNavigate }) => {
  const [users, setUsers] = useState(INITIAL_MANAGED_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AccountRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'sellers' | 'listings' | 'reports'>('overview');
  const [notice, setNotice] = useState<string | null>(null);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${user.location}`.toLowerCase().includes(search.toLowerCase().trim());
    return matchesSearch && (roleFilter === 'all' || user.role === roleFilter) && (statusFilter === 'all' || user.status === statusFilter);
  }), [users, search, roleFilter, statusFilter]);

  const updateStatus = (id: string, status: AccountStatus) => {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, status } : user));
    setSelectedUser((current) => current?.id === id ? { ...current, status } : current);
  };

  const approveSeller = (id: string) => {
    setUsers((current) => current.map((user) => user.id === id
      ? { ...user, role: 'seller', status: 'active', verified: true }
      : user));
    setSelectedUser((current) => current?.id === id
      ? { ...current, role: 'seller', status: 'active', verified: true }
      : current);
    setNotice('Đã duyệt hồ sơ bán hàng và cấp quyền đăng tin.');
  };

  const showAdminNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const stats = {
    total: users.length,
    sellers: users.filter((user) => user.role === 'seller').length,
    pending: users.filter((user) => user.status === 'pending').length,
    active: users.filter((user) => user.status === 'active').length,
  };

  const pendingSellers = users.filter((user) => user.role === 'seller' && user.status === 'pending');

  return (
    <div id="admin-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <button type="button" onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Quay lại sàn giao dịch
      </button>

      <section className="rounded-[28px] bg-slate-950 text-white p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sky-300 text-xs font-black uppercase tracking-[0.18em]
          ">
            <ShieldCheck className="w-4 h-4" /> Trung tâm vận hành
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-3">Quản lý người dùng & người bán</h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">Theo dõi tình trạng tài khoản, duyệt hồ sơ người bán và giữ cho cộng đồng 2HAND luôn đáng tin cậy.</p>
        </div>
        <div className="absolute -right-8 -bottom-16 w-56 h-56 rounded-full border-[24px] border-sky-400/20" />
        <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-pink-400/15 blur-2xl" />
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={<Users />} label="Tổng tài khoản" value={stats.total} tone="sky" />
        <StatCard icon={<Store />} label="Người bán" value={stats.sellers} tone="pink" />
        <StatCard icon={<Filter />} label="Chờ duyệt" value={stats.pending} tone="amber" />
        <StatCard icon={<CheckCircle2 />} label="Đang hoạt động" value={stats.active} tone="emerald" />
      </section>

      <nav className="bg-white rounded-2xl border border-slate-200/80 p-1.5 flex gap-1 overflow-x-auto shadow-xs" aria-label="Khu vực quản trị">
        <AdminNavButton active={activeSection === 'overview'} icon={<LayoutDashboard />} label="Tổng quan" onClick={() => setActiveSection('overview')} />
        <AdminNavButton active={activeSection === 'users'} icon={<Users />} label="Tài khoản" onClick={() => setActiveSection('users')} />
        <AdminNavButton active={activeSection === 'sellers'} icon={<Store />} label={`Duyệt người bán${pendingSellers.length ? ` (${pendingSellers.length})` : ''}`} onClick={() => setActiveSection('sellers')} />
        <AdminNavButton active={activeSection === 'listings'} icon={<FileCheck />} label="Tin đăng" onClick={() => setActiveSection('listings')} />
        <AdminNavButton active={activeSection === 'reports'} icon={<AlertTriangle />} label="Báo cáo" onClick={() => setActiveSection('reports')} />
      </nav>

      {activeSection === 'overview' && <OverviewPanel pendingSellers={pendingSellers.length} onNavigate={setActiveSection} onAction={showAdminNotice} />}

      {activeSection === 'sellers' && (
        <SellerApprovalPanel users={pendingSellers} onApprove={approveSeller} onReview={setSelectedUser} />
      )}

      {activeSection === 'listings' && <OperationsPanel type="listings" onAction={showAdminNotice} />}
      {activeSection === 'reports' && <OperationsPanel type="reports" onAction={showAdminNotice} />}

      {(activeSection === 'overview' || activeSection === 'users') && <section className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">Danh sách tài khoản</h2>
              <p className="text-xs text-slate-400 mt-1">{filteredUsers.length} tài khoản phù hợp với bộ lọc hiện tại</p>
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, email, khu vực..." className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-sky-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect value={roleFilter} onChange={(value) => setRoleFilter(value as 'all' | AccountRole)} options={[['all', 'Tất cả vai trò'], ['seller', 'Người bán'], ['buyer', 'Người mua']]} />
            <FilterSelect value={statusFilter} onChange={(value) => setStatusFilter(value as 'all' | AccountStatus)} options={[['all', 'Tất cả trạng thái'], ['active', 'Đang hoạt động'], ['pending', 'Chờ duyệt'], ['suspended', 'Đã khóa']]} />
            {(search || roleFilter !== 'all' || statusFilter !== 'all') && <button type="button" onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); }} className="px-3 py-2 rounded-xl text-xs font-bold text-pink-600 hover:bg-pink-50">Xóa bộ lọc</button>}
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[minmax(220px,1.5fr)_120px_150px_120px_90px_44px] gap-4 px-6 py-3 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span>Tài khoản</span><span>Vai trò</span><span>Trạng thái</span><span>Hiệu suất</span><span>Tham gia</span><span />
        </div>
        <div className="divide-y divide-slate-100">
          {filteredUsers.map((user) => (
            <div key={user.id} className="grid grid-cols-1 md:grid-cols-[minmax(220px,1.5fr)_120px_150px_120px_90px_44px] gap-3 md:gap-4 items-center px-5 sm:px-6 py-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" />
                <div className="min-w-0"><p className="text-sm font-black text-slate-900 truncate">{user.name}</p><p className="text-[11px] text-slate-400 truncate flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p></div>
              </div>
              <div><span className={`inline-flex items-center gap-1.5 text-xs font-bold ${user.role === 'seller' ? 'text-pink-600' : 'text-slate-600'}`}><span className={`w-1.5 h-1.5 rounded-full ${user.role === 'seller' ? 'bg-pink-400' : 'bg-slate-400'}`} />{user.role === 'seller' ? 'Người bán' : 'Người mua'}</span></div>
              <div><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : user.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{statusLabels[user.status]}</span></div>
              <div className="text-xs text-slate-500"><b className="text-slate-900">{user.sold}</b> đã bán <span className="text-slate-300">/</span> {user.listings} tin</div>
              <div className="text-xs text-slate-500">{user.joined}</div>
              <button type="button" onClick={() => setSelectedUser(user)} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900" title="Xem chi tiết"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        {filteredUsers.length === 0 && <div className="py-16 text-center text-sm text-slate-400">Không tìm thấy tài khoản phù hợp.</div>}
      </section>}

      {selectedUser && <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} onUpdateStatus={updateStatus} onApproveSeller={approveSeller} />}
      {notice && <div className="fixed bottom-5 right-5 z-[60] max-w-sm px-4 py-3 rounded-2xl bg-slate-950 text-white text-xs font-bold shadow-2xl flex items-center gap-2"><CheckCheck className="w-4 h-4 text-emerald-400" />{notice}</div>}
    </div>
  );
};

const AdminNavButton = ({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${active ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>{label}
  </button>
);

const OverviewPanel = ({ pendingSellers, onNavigate, onAction }: { pendingSellers: number; onNavigate: (section: 'sellers' | 'listings' | 'reports') => void; onAction: (message: string) => void }) => (
  <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <button type="button" onClick={() => onNavigate('sellers')} className="text-left bg-amber-50 border border-amber-100 rounded-3xl p-5 hover:border-amber-300 transition-colors cursor-pointer">
      <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-2xl bg-white text-amber-600 flex items-center justify-center"><Store className="w-5 h-5" /></div><span className="text-2xl font-black text-amber-800">{pendingSellers}</span></div>
      <h3 className="font-black text-amber-950 mt-4">Hồ sơ bán hàng chờ duyệt</h3><p className="text-xs text-amber-800/70 mt-1">Kiểm tra thông tin và cấp quyền đăng tin cho user.</p>
    </button>
    <button type="button" onClick={() => onNavigate('listings')} className="text-left bg-sky-50 border border-sky-100 rounded-3xl p-5 hover:border-sky-300 transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-2xl bg-white text-sky-600 flex items-center justify-center"><FileCheck className="w-5 h-5" /></div><h3 className="font-black text-sky-950 mt-4">Kiểm duyệt tin đăng</h3><p className="text-xs text-sky-800/70 mt-1">Xử lý tin mới, tin vi phạm và nội dung bị báo cáo.</p>
    </button>
    <button type="button" onClick={() => onNavigate('reports')} className="text-left bg-rose-50 border border-rose-100 rounded-3xl p-5 hover:border-rose-300 transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div><h3 className="font-black text-rose-950 mt-4">Báo cáo & giao dịch</h3><p className="text-xs text-rose-800/70 mt-1">Theo dõi khiếu nại, giao dịch cần can thiệp và hoàn tiền.</p>
    </button>
  </section>
);

const SellerApprovalPanel = ({ users, onApprove, onReview }: { users: ManagedUser[]; onApprove: (id: string) => void; onReview: (user: ManagedUser) => void }) => (
  <section className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
    <div className="p-5 sm:p-6 border-b border-slate-100"><p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Khu vực kiểm duyệt</p><h2 className="text-lg font-black text-slate-950 mt-1">Tài khoản đăng ký bán hàng</h2><p className="text-xs text-slate-400 mt-1">Duyệt hồ sơ để user được đăng tin và tham gia giao dịch với vai trò người bán.</p></div>
    {users.length === 0 ? <div className="py-16 text-center"><CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" /><p className="text-sm font-bold text-slate-700 mt-3">Không còn hồ sơ chờ duyệt</p><p className="text-xs text-slate-400 mt-1">Tất cả đăng ký bán hàng đã được xử lý.</p></div> : <div className="divide-y divide-slate-100">{users.map((user) => <div key={user.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 sm:px-6 py-4"><img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover" /><div className="flex-1 min-w-0"><p className="font-black text-sm text-slate-900">{user.name}</p><p className="text-xs text-slate-500 mt-1">{user.email} <span className="text-slate-300">•</span> {user.location}</p><p className="text-[11px] text-slate-400 mt-1">Đăng ký từ {user.joined} <span className="text-slate-300">•</span> {user.listings} tin nháp</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => onReview(user)} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Xem hồ sơ</button><button type="button" onClick={() => onApprove(user.id)} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 flex items-center gap-1.5 cursor-pointer"><Check className="w-3.5 h-3.5" /> Duyệt bán hàng</button></div></div>)}</div>}
  </section>
);

const OperationsPanel = ({ type, onAction }: { type: 'listings' | 'reports'; onAction: (message: string) => void }) => {
  const isListings = type === 'listings';
  const rows = isListings ? [
    ['Tai nghe Bose QC45 cần kiểm tra', 'Minh Nguyễn', 'Chờ kiểm duyệt'],
    ['Apple Watch Series 8 45mm', 'Thanh Tùng', 'Có báo cáo'],
    ['Vợt cầu lông Victor Auraspeed', 'Quốc Việt', 'Chờ kiểm duyệt'],
  ] : [
    ['Khiếu nại sai mô tả sản phẩm', 'Đơn #2H-1048', 'Cần xử lý'],
    ['Yêu cầu hoàn tiền đồng kiểm', 'Đơn #2H-1039', 'Đang chờ'],
    ['Báo cáo tài khoản spam', 'Quang Huy', 'Cần xem xét'],
  ];
  return <section className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden"><div className="p-5 sm:p-6 border-b border-slate-100"><div className="flex items-center gap-2"><div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isListings ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'}`}>{isListings ? <PackageCheck className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}</div><div><h2 className="text-lg font-black text-slate-950">{isListings ? 'Kiểm duyệt tin đăng' : 'Báo cáo & giao dịch cần xử lý'}</h2><p className="text-xs text-slate-400 mt-1">{isListings ? 'Duyệt nội dung trước khi hiển thị công khai trên sàn.' : 'Theo dõi các trường hợp cần admin can thiệp.'}</p></div></div></div><div className="divide-y divide-slate-100">{rows.map(([title, owner, status]) => <div key={title} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 sm:px-6 py-4"><div className="flex-1"><p className="text-sm font-bold text-slate-900">{title}</p><p className="text-xs text-slate-400 mt-1">{owner}</p></div><span className={`self-start px-2.5 py-1 rounded-full text-[11px] font-bold ${status === 'Cần xử lý' || status === 'Có báo cáo' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{status}</span><button type="button" onClick={() => onAction(`${isListings ? 'Đã mở hồ sơ tin đăng' : 'Đã tiếp nhận báo cáo'}: ${title}`)} className="px-3 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"><ClipboardCheck className="w-3.5 h-3.5" /> Xử lý</button></div>)}</div></section>;
};

const StatCard = ({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: 'sky' | 'pink' | 'amber' | 'emerald' }) => {
  const colors = { sky: 'bg-sky-50 text-sky-600', pink: 'bg-pink-50 text-pink-600', amber: 'bg-amber-50 text-amber-600', emerald: 'bg-emerald-50 text-emerald-600' };
  return <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs"><div className={`w-9 h-9 rounded-xl flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 ${colors[tone]}`}>{icon}</div><p className="text-[11px] text-slate-400 font-bold mt-3">{label}</p><p className="text-2xl font-black text-slate-950 mt-0.5">{value}</p></div>;
};

const FilterSelect = ({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[][] }) => <label className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer">{options.map(([option, label]) => <option key={option} value={option}>{label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /></label>;

const UserDetail = ({ user, onClose, onUpdateStatus, onApproveSeller }: { user: ManagedUser; onClose: () => void; onUpdateStatus: (id: string, status: AccountStatus) => void; onApproveSeller: (id: string) => void }) => <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-[28px] w-full max-w-lg max-h-[calc(100vh-2rem)] shadow-2xl overflow-y-auto"><div className="flex items-center justify-between p-5 border-b border-slate-100"><div><p className="text-[10px] font-black uppercase tracking-widest text-sky-500">Chi tiết tài khoản</p><h3 className="text-lg font-black text-slate-950 mt-1">Hồ sơ người dùng</h3></div><button type="button" onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button></div><div className="p-5 sm:p-6 space-y-5"><div className="flex items-center gap-4"><img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-3xl object-cover" /><div className="min-w-0"><h4 className="font-black text-slate-950 flex items-center gap-1.5">{user.name}{user.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}</h4><p className="text-xs text-slate-500 mt-1 truncate">{user.email}</p><p className="text-xs text-slate-400 mt-1 truncate">{user.location}</p></div></div><div className="grid grid-cols-3 gap-2 text-center"><InfoStat label="Đã bán" value={user.sold} /><InfoStat label="Tin đăng" value={user.listings} /><InfoStat label="Đánh giá" value={user.rating || '—'} /></div><div className="p-4 rounded-2xl bg-slate-50 text-xs space-y-2"><p className="font-black text-slate-800">Quản lý trạng thái</p><p className="text-slate-500 leading-relaxed">Thay đổi trạng thái sẽ ảnh hưởng quyền đăng tin và giao dịch của tài khoản.</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1"><button type="button" onClick={() => user.status === 'pending' ? onApproveSeller(user.id) : onUpdateStatus(user.id, 'active')} className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${user.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}><Check className="w-3.5 h-3.5" /> {user.status === 'pending' ? 'Duyệt bán hàng' : 'Kích hoạt'}</button><button type="button" onClick={() => onUpdateStatus(user.id, 'pending')} className={`w-full px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${user.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>Đưa về chờ duyệt</button><button type="button" onClick={() => onUpdateStatus(user.id, 'suspended')} className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${user.status === 'suspended' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}><Ban className="w-3.5 h-3.5" /> Khóa tài khoản</button></div></div></div></div></div>;

const InfoStat = ({ label, value }: { label: string; value: number | string }) => <div className="rounded-2xl border border-slate-100 py-3"><p className="text-[10px] text-slate-400">{label}</p><p className="text-sm font-black text-slate-900 mt-1">{value}</p></div>;
