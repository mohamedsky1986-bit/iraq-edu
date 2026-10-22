import React, { useState, useEffect } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { validateRegistration, getIraqiGradeName, containsArabicCharacters } from '../utils/edu-logic';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import {
  X,
  UserPlus,
  LogIn,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  User,
  KeyRound,
  GraduationCap,
  AlertCircle,
  Lock,
  Unlock,
  CheckCircle2,
  ShieldCheck,
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
  // Sequential gate: Step 1 (Grade) must be selected first
  const [selectedGrade, setSelectedGrade] = useState<GradeId | ''>(initialGradeId || '');
  const [selectedAvatar, setSelectedAvatar] = useState('👦🏻');
  const [errorMsg, setErrorMsg] = useState('');

  // Step unlocks
  const isStep1GradeSelected = selectedGrade !== '';
  const isStep2NameValid = isStep1GradeSelected && fullName.trim().length >= 3 && fullName.trim().split(/\s+/).length >= 2;
  const isUsernameEnglishOnly = !containsArabicCharacters(username) && /^[a-zA-Z0-9_]{3,}$/.test(username.trim());
  const isStep3UsernameValid = isStep2NameValid && isUsernameEnglishOnly;
  const isStep4PasswordValid = isStep3UsernameValid && password.length >= 6 && password === confirmPassword;

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

    // Step 1: Grade validation
    if (!selectedGrade) {
      playWrongSound();
      setErrorMsg('⚠️ الخطوة الأولى: يرجى اختيار صفك الدراسي أولاً!');
      return;
    }

    // Step 2: Name validation
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.split(/\s+/).length < 2) {
      playWrongSound();
      setErrorMsg('⚠️ الخطوة الثانية: يرجى كتابة اسم الطالب الكامل (الثنائي أو الثلاثي على الأقل).');
      return;
    }

    // Step 3: Username validation (English letters only, no Arabic, min 3)
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    if (containsArabicCharacters(cleanUsername)) {
      playWrongSound();
      setErrorMsg('❌ اسم المستخدم يقبل فقط حروف إنجليزية وأرقام (English letters only) بدون لغة عربية نهائياً!');
      return;
    }

    if (!cleanUsername || cleanUsername.length < 3) {
      playWrongSound();
      setErrorMsg('⚠️ اسم المستخدم يجب ألا يقل عن 3 خانات إنجليزية أو أرقام (مثال: ahmed2026).');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,}$/.test(cleanUsername)) {
      playWrongSound();
      setErrorMsg('⚠️ اسم المستخدم يحتوي على رموز غير مسموحة. استخدم أحرف إنجليزية وأرقام فقط.');
      return;
    }

    // Step 4: Password validation (min 6 characters)
    if (!password || password.length < 6) {
      playWrongSound();
      setErrorMsg('🔒 كلمة المرور يجب ألا تقل عن 6 خانات أو أرقام لزيادة الأمان.');
      return;
    }

    if (password !== confirmPassword) {
      playWrongSound();
      setErrorMsg('⚠️ كلمتا المرور غير متطابقتين! يرجى إعادة كتابة نفس كلمة المرور للتأكيد بدقة.');
      return;
    }

    const validation = validateRegistration({
      fullName: trimmedName,
      username: cleanUsername,
      password: password,
      gradeId: selectedGrade as GradeId,
    });

    if (!validation.isValid) {
      playWrongSound();
      setErrorMsg(validation.error || 'يرجى مراجع البيانات المدخلة');
      return;
    }

    const res = registerStudent({
      fullName: trimmedName,
      username: cleanUsername,
      gradeId: selectedGrade as GradeId,
      password: password,
      avatar: selectedAvatar,
      city: 'العراق',
      schoolName: 'الابتدائية',
    });

    if (res.success) {
      playCorrectSound();
      onClose();
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'تعذر إنشاء الحساب، يرجى اختيار اسم مستخدم آخر');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanUsername) {
      playWrongSound();
      setErrorMsg('يرجى إدخال اسم المستخدم');
      return;
    }

    const res = loginStudent(cleanUsername, password);
    if (res.success) {
      playCorrectSound();
      onClose();
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'اسم المستخدم أو رمز المرور غير صحيح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {mode === 'login' ? 'تسجيل دخول الطالب 👦🏻' : 'إنشاء حساب طالب جديد ✨'}
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                منصة المتفوق التعليمية • المنهاج العراقي الرسمي 🇮🇶
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>إنشاء حساب جديد ✨</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-center sm:text-right">
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs font-bold text-blue-900 leading-relaxed text-right">
              👋 مرحباً بك يا بطل! اكتب اسم المستخدم (اليوزر بالإنجليزية) وكلمة المرور الخاصة بك لتكمل دروسك واختباراتك.
            </div>

            <div className="text-right">
              <label className="block text-xs font-black text-slate-800 mb-1.5">
                اسم المستخدم (اليوزر بالإنجليزية)
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

            <div className="text-right">
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
                  <span>{showPassword ? 'إخفاء' : 'إظهار'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="اكتب رمز المرور الخاص بحسابك..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left"
                  dir="ltr"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>دخول إلى المنهاج الآن 🚀</span>
            </button>
          </form>
        )}

        {/* Sequential Step-by-Step Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-right">
            {/* STEP 1: MANDATORY GRADE SELECTION (تظهر أولاً ويجب اختيارها لفتح ما بعدها) */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/40 border-2 border-emerald-400 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <label className="text-xs sm:text-sm font-black text-slate-900">
                    الخطوة الأولى: اختر صفك الدراسي <span className="text-rose-600 font-black">* إجباري أولاً</span>
                  </label>
                </div>
                {isStep1GradeSelected ? (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>تم الاختيار ✓</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    مطلوب للبدء 👇
                  </span>
                )}
              </div>

              <p className="text-[11px] text-emerald-950 font-bold mb-3 leading-relaxed">
                اضغط على صفك الدراسي لفتح استمارة كتابة الاسم واسم المستخدم وكلمة المرور:
              </p>

              {/* 6 Interactive Grade Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRADES_DATA.map((g) => {
                  const isSelected = selectedGrade === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedGrade(g.id);
                        setErrorMsg('');
                      }}
                      className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-300 scale-102'
                          : 'border-slate-200 bg-white/80 hover:border-emerald-300 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <span className="text-xs font-black text-slate-900 leading-tight">
                        {g.name}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                          محدد ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: FULL NAME (يفتح فقط بعد اختيار الصف) */}
            <div
              className={`p-3.5 rounded-2xl border-2 transition-all ${
                !isStep1GradeSelected
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 focus-within:border-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black flex items-center justify-center">
                    2
                  </span>
                  <label className="text-xs font-black text-slate-800">
                    اسم الطالب الكامل (الثلاثي أو الثنائي)
                  </label>
                </div>
                {!isStep1GradeSelected ? (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3" /> مقفول
                  </span>
                ) : isStep2NameValid ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> تم
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-bold">مفتوح الآن</span>
                )}
              </div>

              <input
                type="text"
                disabled={!isStep1GradeSelected}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  isStep1GradeSelected
                    ? 'اكتب اسمك الثلاثي، مثلاً: علي حيدر الكرخي'
                    : '🔒 اختر الصف أولاً لفتح كتابة الاسم...'
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                required
              />
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                🎖️ سيظهر هذا الاسم بالشهادة التقديرية الرسمية بعد كل اختبار وفي لوحة الأوائل.
              </p>
            </div>

            {/* STEP 3: USERNAME (حروف إنجليزية وأرقام فقط، لا يقبل عربي نهائياً، 3 خانات فأكثر) */}
            <div
              className={`p-3.5 rounded-2xl border-2 transition-all ${
                !isStep2NameValid
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 focus-within:border-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black flex items-center justify-center">
                    3
                  </span>
                  <label className="text-xs font-black text-slate-800">
                    اسم المستخدم (اليوزر بالإنجليزية فقط - 3 خانات وأكثر)
                  </label>
                </div>
                {!isStep2NameValid ? (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3" /> مقفول
                  </span>
                ) : isUsernameEnglishOnly ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> صحيح
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-bold">إنجليزية فقط</span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  disabled={!isStep2NameValid}
                  value={username}
                  onChange={(e) => {
                    const rawVal = e.target.value.replace(/\s+/g, '');
                    setUsername(rawVal);
                  }}
                  placeholder={
                    isStep2NameValid
                      ? 'English letters & numbers only (e.g. ali_2026)'
                      : '🔒 اكتب اسم الطالب الكامل أولاً لفتح اليوزر...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left disabled:bg-slate-100 disabled:cursor-not-allowed"
                  dir="ltr"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>

              {/* Realtime Alert if Arabic letters entered */}
              {containsArabicCharacters(username) && (
                <p className="text-[11px] font-black text-rose-600 mt-1 flex items-center gap-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>خطأ: اسم المستخدم يقبل فقط حروف إنجليزية وأرقام بدون أحرف عربية!</span>
                </p>
              )}
              {username.length > 0 && username.length < 3 && !containsArabicCharacters(username) && (
                <p className="text-[10px] font-bold text-amber-600 mt-1">
                  أقل شيء 3 خانات (أحرف إنجليزية أو أرقام).
                </p>
              )}
            </div>

            {/* STEP 4: PASSWORD (قوية، 6 خانات أو أرقام على الأقل لزيادة الأمان) */}
            <div
              className={`p-3.5 rounded-2xl border-2 transition-all ${
                !isStep3UsernameValid
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 focus-within:border-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black flex items-center justify-center">
                    4
                  </span>
                  <label className="text-xs font-black text-slate-800">
                    كلمة المرور وتأكيدها (6 خانات أو أرقام على الأقل 🔒)
                  </label>
                </div>
                {!isStep3UsernameValid ? (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3" /> مقفول
                  </span>
                ) : isStep4PasswordValid ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> قوية ومتطابقة
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={!isStep3UsernameValid}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة السر (6 خانات+)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left disabled:bg-slate-100 disabled:cursor-not-allowed"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={!isStep3UsernameValid}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="تأكيد كلمة السر"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold transition-all text-left disabled:bg-slate-100 disabled:cursor-not-allowed"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {password.length > 0 && password.length < 6 && (
                <p className="text-[10px] font-bold text-rose-600 mt-1">
                  🔒 كلمة المرور قصيرة: يجب أن تكون 6 خانات أو أرقام على الأقل لزيادة الأمان.
                </p>
              )}
              {password.length >= 6 && confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-[10px] font-bold text-rose-600 mt-1">
                  ⚠️ كلمتا المرور غير متطابقتين بعد.
                </p>
              )}
            </div>

            {/* Avatar Selector */}
            {isStep1GradeSelected && (
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  اختر شخصيتك الكرتونية المفضلة (الأفاتار):
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
            )}

            {/* Submit Registration Button */}
            <button
              type="submit"
              disabled={!isStep4PasswordValid}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all transform flex items-center justify-center gap-2 cursor-pointer ${
                isStep4PasswordValid
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 text-white shadow-emerald-600/30 hover:-translate-y-0.5'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {isStep4PasswordValid
                  ? 'إنشاء الحساب وبدء التعلم فوراً 🚀'
                  : 'أكمل خطوات التسجيل أعلاه لتفعيل الزر 🔒'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

