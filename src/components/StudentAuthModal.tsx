import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import { X, UserPlus, LogIn, Sparkles, Check, School, MapPin } from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AVATARS = ['👦🏻', '👧🏻', '🧒🏽', '🧕🏻', '👶🏻', '🦁', '🚀', '🌟', '🦄'];

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { loginStudent, registerStudent } = useEdu();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gradeId, setGradeId] = useState<GradeId>('grade-1');
  const [avatar, setAvatar] = useState('👦🏻');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('بغداد');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !username.trim()) {
      setErrorMsg('يرجى ملء الاسم الكامل واسم المستخدم');
      playWrongSound();
      return;
    }

    const res = registerStudent({
      fullName,
      username,
      gradeId,
      password,
      avatar,
      schoolName,
      city,
    });

    if (res.success) {
      playCorrectSound();
      onClose();
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'حدث خطأ أثناء التسجيل');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('يرجى كتابة اسم المستخدم');
      playWrongSound();
      return;
    }

    const res = loginStudent(username, password);
    if (res.success) {
      playCorrectSound();
      onClose();
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'اسم المستخدم أو رمز المرور غير صحيح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto text-right">
        {/* Header with Back button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {mode === 'login' ? 'تسجيل دخول الطالب' : 'إنشاء حساب تلميذ جديد'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                بوابتك للتفوق في المناهج الابتدائية العراقية
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

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mt-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تسجيل دخول
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form (خاص وسري لكل طالب) */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المستخدم (Username)
              </label>
              <input
                type="text"
                placeholder="اكتب اسم المستخدم الخاص بك..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-xs sm:text-sm font-bold transition-all text-right"
                dir="ltr"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رمز المرور (Password)
              </label>
              <input
                type="password"
                placeholder="اكتب رمز المرور الخاص بحسابك..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-xs sm:text-sm font-bold transition-all text-right"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              دخول إلى منصتي التعليمية 🚀
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="mt-5 space-y-4">
            {/* Avatar selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اختر شخصيتك الكرتونية المفضلة:
              </label>
              <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setAvatar(av);
                    }}
                    className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      avatar === av ? 'bg-white ring-2 ring-emerald-500 shadow-xs scale-110' : 'hover:bg-slate-200/60'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الاسم الكامل للتلميذ (الثنائي أو الثلاثي)
              </label>
              <input
                type="text"
                placeholder="مثال: زينب محمد قاسم"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-xs sm:text-sm font-bold transition-all text-right"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المستخدم للدخول (باللغة الإنجليزية أو أرقام)
              </label>
              <input
                type="text"
                placeholder="مثال: zainab2026"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-xs sm:text-sm font-bold transition-all text-right font-mono"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المرحلة الدراسية
              </label>
              <select
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value as GradeId)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-hidden text-xs sm:text-sm font-bold transition-all text-right"
              >
                {GRADES_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.stageName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رمز المرور للحساب (اختياري)
              </label>
              <input
                type="password"
                placeholder="أدخل رمز مرور بسيط لتتذكره..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-hidden text-xs sm:text-sm font-bold transition-all text-right"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              إنشاء الحساب وبدء التفوق 🌟
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentAuthModal;
