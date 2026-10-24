import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import { X, ShieldCheck, KeyRound, UserCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { loginAdmin } = useEdu();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const res: any = loginAdmin(cleanUser, cleanPass);
    const isSuccess = res === true || (res && res.success === true);

    if (isSuccess) {
      playCorrectSound();
      setUsername('');
      setPassword('');
      setErrorMsg('');
      onClose();
    } else {
      playWrongSound();
      setErrorMsg((res && res.error) ? res.error : 'بيانات الدخول غير صحيحة، يرجى التأكد من اسم المشرف وكلمة المرور السرية.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                تسجيل دخول الإدارة (Admin)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                بوابة المشرف الخاصة والمؤمنة
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <span>← رجوع</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم المشرف أو البريد الإلكتروني
            </label>
            <div className="relative">
              <UserCheck className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="اكتب admin أو البريد الإلكتروني..."
                className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-hidden text-xs sm:text-sm font-bold transition-all text-right"
                dir="auto"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور الخاصة بالمشرف
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-hidden text-xs sm:text-sm font-bold transition-all text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-sm shadow-lg shadow-rose-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
          >
            دخول لوحة التحكم 🔐
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;

