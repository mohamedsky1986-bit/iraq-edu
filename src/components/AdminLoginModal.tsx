import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
} from '../utils/audio';
import {
  X,
  ShieldCheck,
  KeyRound,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { loginAdmin } = useEdu();
  const [username, setUsername] = useState('mohamedsky1986@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await loginAdmin(username, password);

      if (res.success) {
        playCorrectSound();
        setPassword('');
        setErrorMsg('');
        onClose();
      } else {
        playWrongSound();
        setErrorMsg(
          res.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة!'
        );
      }
    } catch (err) {
      playWrongSound();
      setErrorMsg('حدث خطأ أثناء تسجيل الدخول. تحقق من الاتصال.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                تسجيل دخول المشرف العام
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                يرجى إدخال البريد الإلكتروني وكلمة المرور للمتابعة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              البريد الإلكتروني للمشرف
            </label>

            <div className="relative">
              <UserCheck className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />

              <input
                type="email"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="admin@example.com"
                className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-xs sm:text-sm font-medium transition-all"
                dir="ltr"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور
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
                placeholder="أدخل كلمة المرور"
                className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-xs sm:text-sm font-medium transition-all"
                dir="ltr"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-sm shadow-lg shadow-rose-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'جاري التحقق...' : 'دخول لوحة المشرف 🔐'}
          </button>
        </form>
      </div>
    </div>
  );
};
