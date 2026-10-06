import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Edit3, KeyRound, LogOut, PackageOpen, Store, Loader2, UploadCloud, X , Eye} from 'lucide-react';
import { Product, ScreenType, UserProfile } from '../types';
import { formatVND } from '../data/mockData';

interface ProfileViewProps {
  currentUser?: UserProfile | null;
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct?: (product: Product) => void;
  onLogout?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onChangePassword?: (password: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onNavigate,
  onLogout,
  onUpdateUser,
  onChangePassword,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  
  // Xử lý an toàn Avatar bị "null" từ Database
  const safeAvatar = (!currentUser?.avatar || String(currentUser.avatar).trim() === 'null') 
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' 
    : currentUser.avatar;

  // States Form Edit
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || 'Việt Nam');
  const [avatarUrl, setAvatarUrl] = useState(safeAvatar);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // States Password
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const resOrders = await fetch('https://atmn.sytes.net/api/v1/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        if (resOrders.ok) {
          const data = await resOrders.json();
          setOrders(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        }

        const resProducts = await fetch('https://atmn.sytes.net/api/v1/products/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (resProducts.ok) {
          const prodData = await resProducts.json();
          setMyProducts(prodData);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoadingOrders(false);
        setLoadingProducts(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleAvatarUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingAvatar(true);
    setProfileError(null);
    try {
      const file = files[0];
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
        setAvatarUrl(data.secure_url);
      } else {
        setProfileError("Lỗi tải ảnh lên Cloudinary! Vui lòng kiểm tra lại cloud_name.");
      }
    } catch (err) {
      setProfileError("Lỗi kết nối khi tải ảnh!");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://atmn.sytes.net/api/v1/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ full_name: name, phone_number: phone, avatar: avatarUrl })
      });
      if (res.ok) {
        onUpdateUser?.({ name, phone, location, avatar: avatarUrl });
        setEditOpen(false);
      } else {
        setProfileError("Lỗi hệ thống khi cập nhật hồ sơ.");
      }
    } catch (e) { 
      setProfileError("Lỗi kết nối mạng.");
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);
    
    if (password !== confirmation) { 
      setPasswordError('Mật khẩu xác nhận không khớp'); 
      return; 
    }
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://atmn.sytes.net/api/v1/auth/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ old_password: oldPassword, new_password: password })
      });
      
      if (res.ok) {
        onChangePassword?.(password);
        setPasswordOpen(false);
        setOldPassword(''); setPassword(''); setConfirmation('');
      } else {
        setPasswordError("Mật khẩu cũ không chính xác!");
      }
    } catch (e) { 
      setPasswordError("Lỗi kết nối mạng."); 
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /><span>Quay lại trang chủ</span>
        </button>
        {onLogout && (
          <button type="button" onClick={onLogout} className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
            <LogOut className="w-4 h-4" /><span>Đăng xuất</span>
          </button>
        )}
      </div>

      <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img src={safeAvatar} alt={currentUser?.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-pink-100" />
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-sm"><CheckCircle2 className="w-5 h-5 fill-white stroke-[2.5]" /></span>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Hồ sơ cá nhân</h1>
            <p className="font-bold text-sm text-slate-900 mt-1">{currentUser?.name}</p>
            <p className="text-xs text-slate-500 mt-1">{currentUser?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setPasswordOpen(true); setPasswordError(null); }} className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-2 cursor-pointer"><KeyRound className="w-4 h-4" /><span>Đổi mật khẩu</span></button>
          <button type="button" onClick={() => { setEditOpen(true); setProfileError(null); }} className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><Edit3 className="w-4 h-4" /><span>Chỉnh sửa</span></button>
        </div>
      </section>

      <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600"><PackageOpen className="w-5 h-5" /></div>
          <div><h2 className="text-lg font-black text-slate-950">Lịch sử Đơn hàng đã mua</h2></div>
        </div>
        {loadingOrders ? <div className="text-center py-8 text-xs text-slate-500 animate-pulse">Đang tải...</div> : orders.length === 0 ? <p className="text-center py-5 text-sm font-bold text-slate-600">Bạn chưa mua đơn hàng nào.</p> : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-slate-200 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                  <div><p className="text-xs font-bold text-slate-900">Mã đơn: #{order.id}</p><p className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleString('vi-VN')}</p></div>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-md border bg-slate-100">{order.status}</span>
                </div>
                <div className="mt-4 pt-3 flex justify-between items-center">
                  <p className="text-[11px] text-slate-500">Giao tới: <span className="font-semibold text-slate-700">{order.address?.title}</span></p>
                  <p className="text-sm font-black text-sky-600">Tổng: {formatVND(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600"><Store className="w-5 h-5" /></div>
          <div><h2 className="text-lg font-black text-slate-950">Tin đăng của tôi</h2></div>
        </div>
        {loadingProducts ? <div className="text-center py-8 text-xs text-slate-500 animate-pulse">Đang tải...</div> : myProducts.length === 0 ? <p className="text-center py-5 text-sm font-bold text-slate-600">Chưa có sản phẩm.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProducts.map((prod) => (
              <div key={prod.id} className="border border-slate-100 rounded-2xl p-4 flex gap-4">
                <img src={prod.cover || 'https://via.placeholder.com/100'} alt={prod.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{prod.name}</h4>
                  <p className="font-black text-sky-600 text-sm mt-1">{formatVND(prod.price)}</p>
                  <span className="px-2 py-1 text-[10px] bg-slate-100 mt-2 inline-block rounded font-bold">{prod.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal Sửa Hồ Sơ */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <ModalHeader title="Thông tin cá nhân" onClose={() => setEditOpen(false)} />
            <form onSubmit={saveProfile} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Ảnh Đại Diện</label>
                <div className="flex items-center gap-4">
                  <img src={avatarUrl} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                  <label className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors border border-slate-200 hover:border-sky-200">
                    {isUploadingAvatar ? <><Loader2 className="w-4 h-4 animate-spin"/> Đang tải...</> : <><UploadCloud className="w-4 h-4"/> Chọn ảnh từ máy</>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files)} disabled={isUploadingAvatar} />
                  </label>
                </div>
              </div>

              {profileError && <p className="text-rose-500 font-bold">{profileError}</p>}

              <Field label="Họ và tên" value={name} onChange={setName} required />
              <Field label="Số điện thoại" value={phone} onChange={setPhone} />
              <Field label="Khu vực" value={location} onChange={setLocation} />
              <div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-2xl border font-bold cursor-pointer">Hủy</button><button type="submit" disabled={isUploadingAvatar} className="px-5 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold cursor-pointer disabled:opacity-50">Lưu thay đổi</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Đổi Mật Khẩu */}
      {passwordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <ModalHeader title="Đổi mật khẩu" onClose={() => setPasswordOpen(false)} />
            <form onSubmit={savePassword} className="space-y-4 text-xs">
              
              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-bold">
                  {passwordError}
                </div>
              )}

              <PasswordField label="Mật khẩu cũ" value={oldPassword} onChange={setOldPassword} visible={showPassword} />
              <PasswordField label="Mật khẩu mới" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              <PasswordField label="Xác nhận mật khẩu mới" value={confirmation} onChange={setConfirmation} visible={showPassword} />
              <div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setPasswordOpen(false)} className="px-4 py-2 rounded-2xl border font-bold cursor-pointer">Hủy</button><button type="submit" className="px-5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer">Lưu mật khẩu</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, onChange, required = false }: any) => (
  <label className="block font-bold text-slate-700">{label}<input required={required} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500" /></label>
);
const PasswordField = ({ label, value, onChange, visible, onToggle }: any) => (
  <label className="block font-bold text-slate-700">{label}<div className="relative mt-1"><input required type={visible ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500" />{onToggle && <button type="button" onClick={onToggle} className="absolute right-3 top-3 cursor-pointer"><Eye className="w-4 h-4 text-slate-400" /></button>}</div></label>
);
const ModalHeader = ({ title, onClose }: any) => (
  <div className="flex justify-between pb-3 border-b border-slate-100"><h2 className="text-base font-black">{title}</h2><button type="button" onClick={onClose} className="cursor-pointer"><X className="w-5 h-5" /></button></div>
);