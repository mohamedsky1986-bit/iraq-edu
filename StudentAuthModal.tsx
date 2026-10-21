import React, { useState, useEffect } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { validateRegistration, getIraqiGradeName } from '../utils/edu-logic';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import {
  X,
  UserPlus,
  LogIn,
  Sparkles,
  Check,
  School,
  MapPin,
  Eye,
  EyeOff,
  User,
  KeyRound,
  GraduationCap,
  AlertCircle
} from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  initialGradeId?: GradeId;
}

const AVATARS = ['👦🏻', '👧🏻', '🧒🏽', '🧕🏻', '👶🏻', '🦁', '🚀', '🌟', '🦄'];

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  initialGradeId,
}) => {
  const { loginStudent, registerStudent } = useEdu();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // عدم تحديد الصف مسبقاً لإجبار الطالب على الاختيار من القائمة
  const [selectedGrade, setSelectedGrade] = useState<GradeId | ''>(initialGradeId || '');
  const [selectedAvatar, setSelectedAvatar] = useState('👦🏻');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setErrorMsg('');
      if (initialGradeId) {
        setSelectedGrade(initialGradeId);
      }
    }
  }, [isOpen, defaultMode, initialGradeId]);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. التحقق الإجباري من اختيار الصف
    if (!selectedGrade) {
      playWrongSound();
      setErrorMsg('⚠️ يرجى اختيار صفك الدراسي من القائمة المنسدلة أولاً ليتم تجهيز وعرض مناهجك واختباراتك الخاصة بصفك!');
      return;
    }

    // 2. التحقق من الاسم الكامل
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.split(/\s+/).length < 2) {
      playWrongSound();
      setErrorMsg('⚠️ يرجى كتابة اسم الطالب الكامل (الثنائي أو الثلاثي على الأقل) ليظهر في الشهادات التقديرية ولوحة الشرف.');
      return;
    }

    // 3. التحقق من اسم المستخدم
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      playWrongSound();
      setErrorMsg('⚠️ يرجى كتابة اسم مستخدم (يوزر) صحيح لا يقل عن 3 أحرف أو أرقام بدون مسافات (مثال: ali2026).');
      return;
    }

    // 4. التحقق من كلمة المرور
    if (!password || password.length < 3) {
      playWrongSound();
      setErrorMsg('⚠️ كلمة المرور يجب ألا تقل عن 3 خانات (أحرف أو أرقام).');
      return;
    }

    // 5. التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
      playWrongSound();
      setErrorMsg('⚠️ كلمتا المرور غير متطابقتين! يرجى إعادة كتابة نفس كلمة المرور في حقل التأكيد بدقة حتى لا تنساها.');
      return;
    }

    const validation = validateRegistration({
      fullName: trimmedName,
      username: cleanUsername,
      gradeId: selectedGrade as GradeId,
    });

    if (!validation.isValid) {
      playWrongSound();
      setErrorMsg(validation.error || 'يرجى مراجعة البيانات المدخلة');
      return;
    }

    const res = registerStudent({
      fullName: trimmedName,
      username: cleanUsername,
      gradeId: selectedGrade as GradeId,
      password,
      avatar: selectedAvatar,
      schoolName: schoolName.trim() || 'المدرسة الابتدائية',
      city: city.trim() || 'العراق',
    });

    if (res.success) {
      playCorrectSound();
      onClose();
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'اسم المستخدم هذا مستخدم مسبقاً، يرجى تجربة اسم مستخدم آخر.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanUsername) {
      playWrongSound();
      setErrorMsg('يرجى كتابة اسم المستخدم (اليوزر) للدخول');
      return;
    }

    if (!password) {
      playWrongSound();
      setErrorMsg('يرجى كتابة كلمة المرور للدخول');
      return;
    }

    const res = loginStudent(cleanUsername, password);
    if (res.success) {
      playCorrectSound();
      onClose();
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'اسم المستخدم أو كلمة المرور غير صحيحة، يرجى التأكد والمحاولة ثانية.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {mode === 'login' ? 'تسجيل دخول الطالب' : 'إنشاء حساب طالب جديد'}
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                منصة المتفوق للمناهج الابتدائية العراقية (١ - ٦)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* أزرار التبديل الواضحة بين الدخول والتسجيل */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-emerald-600" />
            <span>تسجيل الدخول (لدي حساب)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>إنشاء حساب جديد ✨</span>
          </button>
        </div>

        {/* تنبيه الأخطاء إن وجد */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs font-bold text-blue-900 leading-relaxed">
              👋 مرحباً بك مجدداً يا بطل! اكتب اسم المستخدم ورمز المرور الخاص بك لتكمل دروسك واختباراتك.
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1.5">
                اسم المستخدم (اليوزر)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="مثال: ali2026 أو haider_iraq"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left"
                  dir="ltr"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-slate-800">
                  رمز المرور (كلمة السر)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[11px] text-slate-500 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'إخفاء الرمز' : 'إظهار الرمز'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل رمز المرور الخاص بك"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left"
                  dir="ltr"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block font-medium">
                (رمز الحسابات الافتراضية هو 123)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              دخول إلى منصتي التعليمية 🚀
            </button>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('register');
                  setErrorMsg('');
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                طالب جديد؟ اضغط هنا لإنشاء حساب واختيار صفك الدراسي في ثوانٍ ✨
              </button>
            </div>
          </form>
        )}

        {/* نموذج إنشاء حساب جديد */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* اختيار الشخصية */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1.5">
                اختر شخصيتك الكرتونية (الأفاتار):
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

            {/* الاسم الكامل */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                اسم الطالب الكامل (الثلاثي أو الثنائي) <span className="text-rose-500 font-bold">* إجباري</span>:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب هنا اسمك الثلاثي، مثلاً: علي حيدر الكرخي"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all"
                required
              />
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                🎖️ سيظهر هذا الاسم بالشهادة التقديرية بعد إكمال الاختبارات وفي لوحة الشرف.
              </p>
            </div>

            {/* القائمة المنسدلة للمرحلة الدراسية */}
            <div className="bg-emerald-50/50 p-3.5 rounded-2xl border-2 border-emerald-300/80">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black text-slate-900">
                  المرحلة الدراسية (الصف الدراسي) <span className="text-rose-600 font-black">* إجباري</span>:
                </label>
                {selectedGrade && (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>تم الاختيار: {getIraqiGradeName(selectedGrade as GradeId)}</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-emerald-950 font-bold mb-2">
                👇 يرجى الضغط واختيار صفك الحالي من القائمة المنسدلة ليتم تجهيز وعرض مناهجك واختباراتك الخاصة:
              </p>

              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    playClickSound();
                    setSelectedGrade(e.target.value as GradeId);
                    setErrorMsg('');
                  }}
                  className={`w-full px-4 py-3 rounded-2xl border-2 text-xs sm:text-sm font-black transition-all cursor-pointer appearance-none bg-white text-right leading-relaxed ${
                    selectedGrade
                      ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 shadow-xs'
                      : 'border-amber-400 bg-amber-50/50 text-amber-900 hover:border-amber-500'
                  }`}
                  required
                >
                  <option value="" disabled className="text-slate-400 font-bold">
                    -- اضغط هنا لاختيار صفك الدراسي من القائمة المنسدلة (إجباري) 👇 --
                  </option>
                  <option value="grade-1" className="text-slate-900 font-black py-2">
                    🎒 الصف الأول الابتدائي (مرحلة التأسيس والحروف والقراءة)
                  </option>
                  <option value="grade-2" className="text-slate-900 font-black py-2">
                    📘 الصف الثاني الابتدائي
                  </option>
                  <option value="grade-3" className="text-slate-900 font-black py-2">
                    📗 الصف الثالث الابتدائي
                  </option>
                  <option value="grade-4" className="text-slate-900 font-black py-2">
                    📙 الصف الرابع الابتدائي
                  </option>
                  <option value="grade-5" className="text-slate-900 font-black py-2">
                    📕 الصف الخامس الابتدائي
                  </option>
                  <option value="grade-6" className="text-slate-900 font-black py-2">
                    🎓 الصف السادس الابتدائي (المرحلة الوزارية المهمة)
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3.5 text-emerald-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* اسم المستخدم */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                اسم المستخدم (اليوزر لدخول المنصة) <span className="text-rose-500 font-bold">* إجباري</span>:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="مثال: ali2026 أو ahmed_iq"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left"
                  dir="ltr"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                💡 اكتب يوزر باللغة الإنجليزية أو أرقام بدون مسافات ليسهل عليك الدخول به دائماً.
              </p>
            </div>

            {/* كلمة المرور وتأكيد كلمة المرور */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-slate-800">
                    رمز المرور (كلمة السر) <span className="text-rose-500 font-bold">*</span>:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[10px] text-slate-500 hover:text-emerald-700 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'إخفاء' : 'إظهار'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="اكتب رمزاً لا تنساه"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left"
                    dir="ltr"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-slate-800">
                    تأكيد رمز المرور <span className="text-rose-500 font-bold">* إجباري</span>:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-[10px] text-slate-500 hover:text-emerald-700 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showConfirmPassword ? 'إخفاء' : 'إظهار'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد كتابة نفس الرمز للتأكيد"
                    className={`w-full px-3.5 py-2.5 rounded-2xl border outline-none text-xs font-bold transition-all text-left ${
                      confirmPassword && confirmPassword === password
                        ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                        : confirmPassword && confirmPassword !== password
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    }`}
                    dir="ltr"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <span className="text-[10px] text-rose-600 font-bold mt-1 block">
                    ⚠️ الرمز غير متطابق مع الرمز أعلاه
                  </span>
                )}
                {confirmPassword && confirmPassword === password && (
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                    ✓ الرمز متطابق تماماً
                  </span>
                )}
              </div>
            </div>

            {/* المدرسة والمحافظة (اختياري) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50">
                <School className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="اسم المدرسة (اختياري)"
                  className="w-full text-xs font-bold outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المحافظة (بغداد، البصرة...)"
                  className="w-full text-xs font-bold outline-none bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              تسجيل وحفظ الحساب الآن 🎉
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
