import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { validateRegistration } from '../utils/edu-logic';
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
  const { loginStudent, registerStudent, students } = useEdu();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('123');
  const [selectedGrade, setSelectedGrade] = useState<GradeId>('grade-4');
  const [selectedAvatar, setSelectedAvatar] = useState('👦🏻');
  const [schoolName, setSchoolName] = useState('المدرسة الابتدائية');
  const [city, setCity] = useState('بغداد');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = validateRegistration({
      fullName,
      username,
      gradeId: selectedGrade,
    });

    if (!validation.isValid) {
      playWrongSound();
      setErrorMsg(validation.error || 'يرجى مراجعة البيانات المدخلة');
      return;
    }

    const res = registerStudent({
      fullName,
      username,
      gradeId: selectedGrade,
      password,
      avatar: selectedAvatar,
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
      playWrongSound();
      setErrorMsg('يرجى كتابة اسم المستخدم للدخول');
      return;
    }

    const res = loginStudent(username, password);
    if (res.success) {
      playCorrectSound();
      onClose();
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'فشل تسجيل الدخول');
    }
  };

  const handleQuickDemoLogin = (studentUsername: string) => {
    playClickSound();
    const res = loginStudent(studentUsername, '123');
    if (res.success) {
      playCorrectSound();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {mode === 'login' ? 'تسجيل دخول الطالب' : 'إنشاء حساب بطل جديد'}
              </h2>
              <p className="text-xs text-slate-500">
                منصة المتفوق للمراحل الابتدائية العراقية (١ - ٦)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1.5 my-5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>تسجيل جديد</span>
            </div>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المستخدم للطالب
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثال: haider_iraq"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رمز المرور (PIN)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل الرمز"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
                dir="ltr"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                (رمز الحسابات الافتراضية هو 123)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              دخول إلى منصتي التعليمية 🚀
            </button>

            {/* Quick Demo Pupils selection */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-600 mb-2.5">
                أو جرب الدخول المباشر كأحد الطلاب المسجلين لكل صف:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {students.slice(0, 5).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(s.username)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-right transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-xl">{s.avatar}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {s.fullName}
                      </p>
                      <p className="text-[10px] text-emerald-700 truncate">
                        {GRADES_DATA.find((g) => g.id === s.gradeId)?.shortName || s.gradeId}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Avatar selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اختر صورتك الرمزية (الأفاتار)
              </label>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedAvatar(av);
                    }}
                    className={`text-2xl p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'border-emerald-500 bg-emerald-50 scale-110 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم الطالب الكامل (الثنائي أو الثلاثي)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: حيدر علي الكرخي"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
                required
              />
            </div>

            {/* Username & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المستخدم (يوزر الطالب)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: haider2026"
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رمز المرور / PIN
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Grade Selector - CRITICAL requirement */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المرحلة الدراسية (تفتح للطالب فقط مناهجه واختباراته)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRADES_DATA.map((grade) => {
                  const isSelected = selectedGrade === grade.id;
                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedGrade(grade.id);
                      }}
                      className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <span className="text-xl block mb-1">{grade.icon}</span>
                      <p className="font-extrabold text-xs text-slate-900">
                        {grade.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {grade.stageName}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional School & City */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <School className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="اسم المدرسة"
                  className="w-full text-xs outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المحافظة (بغداد، البصرة...)"
                  className="w-full text-xs outline-none bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              تسجيل وحفظ الحساب الآن 🎉
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
