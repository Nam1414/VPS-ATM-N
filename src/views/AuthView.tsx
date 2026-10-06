import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, Lock, Mail, User, Phone, ArrowLeft, Sparkles, Zap, Eye, EyeOff } from 'lucide-react';
import { ScreenType, UserProfile } from '../types';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login', onNavigate, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>(initialMode); 
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    try {
      const response = await fetch('https://atmn.sytes.net/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginEmail, password: loginPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) { 
        // Bắt chính xác lỗi từ Backend trả về
        const errorMessage = data.detail ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)) : 'Lỗi kết nối máy chủ';
        alert(errorMessage); 
        setIsSubmitting(false); 
        return; 
      }
      
      localStorage.setItem('accessToken', data.access_token);

      const userRes = await fetch('https://atmn.sytes.net/api/v1/auth/me', { headers: { 'Authorization': `Bearer ${data.access_token}` } });
      const userData = await userRes.json();
      setSuccessMsg('Đăng nhập thành công!');
      
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({ 
            id: userData.id?.toString() || '1', 
            name: userData.full_name, 
            email: userData.email, 
            phone: userData.phone_number, 
            avatar: userData.avatar, 
            isVerified: true, 
            walletBalance: 0, 
            escrowPending: 0, 
            itemsSold: 0, 
            itemsListed: 0, 
            rating: 5.0, 
            reviewCount: 0, 
            joinedDate: '', 
            location: 'Việt Nam' 
        });
        if (userData.role === 'admin' || loginEmail.trim().toLowerCase() === 'admin@2hand.com') onNavigate('admin' as ScreenType);
        else onNavigate('home');
      }, 700);
    } catch (error: any) { 
        alert(error.message || "Lỗi mạng!"); 
        setIsSubmitting(false); 
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://atmn.sytes.net/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: regName, username: regEmail.split('@')[0], email: regEmail, password: regPassword, phone_number: regPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)) : 'Lỗi kết nối máy chủ';
        throw new Error(errorMessage);
      }

      setSuccessMsg('Tạo tài khoản thành công!');
      setTimeout(() => { setIsSubmitting(false); setAuthMode('login'); setLoginEmail(regEmail); }, 1000);
    } catch (error: any) {
      alert(error.message || 'Lỗi không xác định');
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('https://atmn.sytes.net/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setSuccessMsg('Nếu email tồn tại, link khôi phục đã được gửi.');
      setTimeout(() => { setIsSubmitting(false); setAuthMode('login'); }, 3000);
    } catch (error) { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-[36px] shadow-2xl flex overflow-hidden">
        <div className="w-5/12 p-10 bg-slate-50 border-r border-slate-100 hidden lg:flex flex-col justify-between">
          <div><h1 className="text-3xl font-black text-sky-500">2HAND.VN</h1><p className="text-sm text-slate-500 mt-2">Nền tảng mua bán đồ cũ uy tín.</p></div>
        </div>

        <div className="w-full lg:w-7/12 p-8 sm:p-12">
          {successMsg && <div className="mb-5 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold">{successMsg}</div>}

          {authMode === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <h2 className="text-2xl font-black mb-4">Khôi phục mật khẩu</h2>
              <input type="email" required placeholder="Nhập email của bạn" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-sky-500" />
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-2xl bg-[#009ee2] text-white font-bold cursor-pointer">Gửi mật khẩu mới vào Email</button>
              <button type="button" onClick={() => setAuthMode('login')} className="w-full text-sm font-bold text-slate-500 hover:text-slate-800 cursor-pointer">Quay lại Đăng nhập</button>
            </form>
          ) : authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <h2 className="text-2xl font-black mb-4">Đăng Nhập</h2>
              <input type="text" required placeholder="Email đăng nhập" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-sky-500" />
              <input type="password" required placeholder="Mật khẩu" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-sky-500" />
              <div className="flex justify-end"><button type="button" onClick={() => setAuthMode('forgot')} className="text-xs font-bold text-sky-600 cursor-pointer">Quên mật khẩu?</button></div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-2xl bg-[#009ee2] text-white font-bold cursor-pointer">Đăng nhập</button>
              <p className="text-center text-xs mt-4">Chưa có tài khoản? <button type="button" onClick={() => setAuthMode('register')} className="text-sky-600 font-bold cursor-pointer">Đăng ký</button></p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <h2 className="text-2xl font-black mb-4">Đăng Ký Mới</h2>
              <input type="text" required placeholder="Họ và tên" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-sky-500" />
              <input type="email" required placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-sky-500" />
              <input type="password" required placeholder="Mật khẩu (ít nhất 6 ký tự)" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-sky-500" />
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-2xl bg-[#e11d48] text-white font-bold cursor-pointer">Tạo tài khoản</button>
              <p className="text-center text-xs mt-4">Đã có tài khoản? <button type="button" onClick={() => setAuthMode('login')} className="text-sky-600 font-bold cursor-pointer">Đăng nhập</button></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};