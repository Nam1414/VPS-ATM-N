import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from 'lucide-react';
import { Product, ScreenType, UserProfile } from '../types';

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
  const [name, setName] = useState(currentUser?.name || 'Sarah Mitchell');
  const [phone, setPhone] = useState(currentUser?.phone || '0988 123 456');
  const [location, setLocation] = useState(currentUser?.location || 'Hà Nội');
  const [bio, setBio] = useState(
    currentUser?.bio || 'Runner & người chơi cầu lông, đam mê công nghệ lướt nguyên zin.'
  );
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const userName = currentUser?.name || 'Sarah Mitchell';
  const userEmail = currentUser?.email || 'sarah.mitchell@2hand.vn';
  const userPhone = currentUser?.phone || '0988 123 456';
  const userLocation = currentUser?.location || 'Hà Nội';
  const userBio = currentUser?.bio || 'Runner & người chơi cầu lông, đam mê công nghệ lướt nguyên zin.';
  const avatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdateUser?.({ name, phone, location, bio });
    setEditOpen(false);
  };

  const savePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (!oldPassword) {
      setPasswordError('Vui lòng nhập mật khẩu cũ.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmation) {
      setPasswordError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    onChangePassword?.(password);
    setOldPassword('');
    setPassword('');
    setConfirmation('');
    setPasswordError('');
    setPasswordOpen(false);
  };

  return (
    <div id="profile-view-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        )}
      </div>

      <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={avatar}
              alt={userName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-pink-100"
            />
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5 fill-white stroke-[2.5]" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Hồ sơ cá nhân</h1>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            </div>
            <p className="font-bold text-sm text-slate-900 mt-1">{userName}</p>
            <p className="text-xs text-slate-500 mt-1">{userEmail}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-black text-slate-950">Thông tin cá nhân</h2>
            <p className="text-xs text-slate-400 mt-1">Cập nhật thông tin liên hệ và giới thiệu của bạn.</p>
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="shrink-0 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-400" />
            <span>Chỉnh sửa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem icon={<UserRound />} label="Họ và tên" value={userName} />
          <InfoItem icon={<Mail />} label="Email" value={userEmail} />
          <InfoItem icon={<Phone />} label="Số điện thoại" value={userPhone} />
          <InfoItem icon={<MapPin />} label="Khu vực" value={userLocation} />
        </div>
        <div className="mt-4 min-h-[74px] rounded-[20px] border border-slate-100 px-4 py-4">
          <p className="text-xs text-slate-400 mb-2">Giới thiệu</p>
          <p className="text-xs text-slate-700 leading-relaxed">{userBio}</p>
        </div>
      </section>

      <section className="relative bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5 sm:min-h-[136px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Mật khẩu tài khoản</h2>
            <p className="text-xs text-slate-400 mt-1">Đổi mật khẩu để bảo vệ tài khoản của bạn.</p>
          </div>
        </div>
        <button
          id="btn-change-password"
          type="button"
          onClick={() => setPasswordOpen(true)}
          aria-label="Đổi mật khẩu tài khoản"
          className="relative z-10 w-full sm:w-auto sm:absolute sm:right-5 sm:top-1/2 sm:-translate-y-1/2 min-w-[134px] h-12 shrink-0 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs text-center cursor-pointer"
        >
          Đổi mật khẩu
        </button>
      </section>

      {editOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <ModalHeader title="Thông tin cá nhân" onClose={() => setEditOpen(false)} />
            <form onSubmit={saveProfile} className="space-y-4 text-xs">
              <Field label="Họ và tên" value={name} onChange={setName} required />
              <Field label="Số điện thoại" value={phone} onChange={setPhone} />
              <Field label="Khu vực" value={location} onChange={setLocation} />
              <label className="block font-bold text-slate-700">
                Giới thiệu
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </label>
              <ModalActions onCancel={() => setEditOpen(false)} submit="Lưu thay đổi" />
            </form>
          </div>
        </div>
      )}

      {passwordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <ModalHeader title="Đổi mật khẩu" onClose={() => setPasswordOpen(false)} />
            <form onSubmit={savePassword} className="space-y-4 text-xs">
              <PasswordField label="Mật khẩu cũ" value={oldPassword} onChange={setOldPassword} visible={showPassword} />
              <PasswordField label="Mật khẩu mới" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              <PasswordField label="Xác nhận mật khẩu mới" value={confirmation} onChange={setConfirmation} visible={showPassword} />
              {passwordError && <p className="text-rose-600 font-semibold">{passwordError}</p>}
              <ModalActions onCancel={() => setPasswordOpen(false)} submit="Cập nhật mật khẩu" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="min-h-[64px] rounded-[20px] bg-slate-50 px-4 py-3.5 flex items-center gap-3">
    <span className="text-sky-500 shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{value}</p>
    </div>
  </div>
);

const Field = ({ label, value, onChange, required = false, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) => (
  <label className="block font-bold text-slate-700">
    {label}
    <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-sky-500" />
  </label>
);

const PasswordField = ({ label, value, onChange, visible, onToggle }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle?: () => void }) => (
  <label className="block font-bold text-slate-700">
    {label}
    <div className="relative mt-1">
      <input required type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500" />
      {onToggle && <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">{visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
    </div>
  </label>
);

const ModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
    <h2 className="text-base font-black text-slate-900">{title}</h2>
    <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
  </div>
);

const ModalActions = ({ onCancel, submit }: { onCancel: () => void; submit: string }) => (
  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-2xl border border-slate-200 font-bold text-slate-600 cursor-pointer">Hủy</button>
    <button type="submit" className="px-5 py-2 rounded-2xl bg-[#009ee2] text-white font-bold cursor-pointer">{submit}</button>
  </div>
);
