import React, { useState, useEffect } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName } from '../utils/edu-logic';
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

function containsArabicCharacters(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  initialGradeId,
}) => {
  const { loginStudent, registerStudent } = useEdu();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [selectedGrade, setSelectedGrade] = useState<GradeId | ''>(initialGradeId || '');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [usernameNotice, setUsernameNotice] = useState('');

  useEffect(() => {
    setMode(defaultMode);
    setErrorMsg('');
    setSuccessMsg('');
    if (initialGradeId) setSelectedGrade(initialGradeId);
  }, [defaultMode, isOpen, initialGradeId]);

  if (!isOpen) return null;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (containsArabicCharacters(val)) {
      setUsernameNotice('⚠️ اسم المستخدم يقبل فقط حروف إنجليزية وأرقام (English letters only)');
      const filtered = val.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]/g, '');
      setUsername(filtered.toLowerCase());
      return;
    }
    setUsernameNotice('');
    setUsername(val.replace(/\s+/g, '').toLowerCase());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser) {
      playWrongSound();
      setErrorMsg('يرجى كتابة اسم المستخدم');
      return;
    }

    const res = loginStudent(cleanUser, password.trim());
    if (res.success) {
      playCorrectSound();
      setSuccessMsg('أهلاً بك يا بطل! تم تسجيل دخولك بنجاح ⭐');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Step 1: Grade validation
    if (!selectedGrade) {
      playWrongSound();
      setErrorMsg('خطوة 1 إلزامية: يرجى اختيار المرحلة الدراسية أولاً (من الصف الأول إلى السادس)');
      return;
    }

    // Step 2: Full name validation
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 3 || trimmedName.split(/\s+/).length < 2) {
      playWrongSound();
      setErrorMsg('يرجى كتابة اسم الطالب الكامل (الثنائي أو الثلاثي على الأقل)');
      return;
    }

    // Step 3: English-only username validation (min 3 chars)
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      playWrongSound();
      setErrorMsg('اسم المستخدم يجب ألا يقل عن 3 أحرف أو أرقام إنجليزية');
      return;
    }

    if (containsArabicCharacters(cleanUsername)) {
      playWrongSound();
      setErrorMsg('اسم المستخدم يقبل فقط حروف إنجليزية وأرقام (English letters only) بدون أحرف عربية');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(cleanUsername)) {
      playWrongSound();
      setErrorMsg('اسم المستخدم يجب أن يحتوي على حروف إنجليزية وأرقام وشرطة سفلية فقط (مثال: ahmed_2026)');
      return;
    }

    // Step 4: Password validation (min 6 chars)
    if (!password || password.length < 6) {
      playWrongSound();
      setErrorMsg('كلمة المرور يجب أن تكون 6 خانات أو أرقام على الأقل لزيادة الأمان');
      return;
    }

    if (password !== confirmPassword) {
      playWrongSound();
      setErrorMsg('كلمة المرور وتأكيدها غير متطابقين، يرجى إعادة التأكد');
      return;
    }

    const res = registerStudent({
      fullName: trimmedName,
      username: cleanUsername,
      gradeId: selectedGrade as GradeId,
      password: password,
      avatar: selectedAvatar,
      schoolName: schoolName.trim() || undefined,
      city: city.trim() || undefined,
    });

    if (res.success) {
      playCorrectSound();
      setSuccessMsg('تم إنشاء حسابك بنجاح! مرحباً بك في منصة المتفوق 🌟');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      playWrongSound();
      setErrorMsg(res.error || 'حدث خطأ أثناء التسجيل، جرب اسماً آخر');
    }
  };

  const isGradeChosen = Boolean(selectedGrade);
  const isNameEntered = isGradeChosen && fullName.trim().length >= 3;
  const isUsernameReady = isNameEntered && username.trim().length >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-t-3xl relative text-center sm:text-right">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-xs">
              {mode === 'login' ? '🔐' : '🎓'}
            </div>
            <div>
              <h2 className="text-lg font-black">
                {mode === 'login' ? 'تسجيل دخول الطالب' : 'إنشاء حساب طالب جديد'}
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                {mode === 'login'
                  ? 'أهلاً بعودتك لمنصة المتفوق التعليمية'
                  : 'سجل صفك أولاً ثم بياناتك لتنضم لأبطال العراق'}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-black/20 rounded-2xl mt-3">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>حساب جديد</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 text-right">
                  اسم المستخدم (اليوزر):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
                    placeholder="مثال: ahmed_ali"
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono"
                    dir="ltr"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 text-right">
                  كلمة المرور:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    dir="ltr"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول للمنصة 🚀</span>
              </button>
            </form>
          ) : (
            /* SEQUENTIAL REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* STEP 1: GRADE SELECTION (MANDATORY FIRST) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-emerald-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>الخطوة 1 (إلزامية أولاً): حدد صفك الدراسي</span>
                  </span>
                  {selectedGrade && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      تم الاختيار ✓
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
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
                        className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-102'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base">{g.icon}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-[11px] font-black leading-tight">{g.shortName}</span>
                        <span
                          className={`text-[9px] font-medium leading-tight ${
                            isSelected ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          {g.stageName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: FULL NAME (LOCKED UNTIL GRADE CHOSEN) */}
              <div className={`transition-all duration-300 ${!isGradeChosen ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="block text-xs font-black text-slate-700 mb-1.5 text-right flex items-center justify-between">
                  <span>الخطوة 2: اسم الطالب الثلاثي أو الثنائي:</span>
                  {!isGradeChosen && (
                    <span className="text-[10px] text-amber-600 font-bold">(يفتح بعد اختيار الصف)</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!isGradeChosen}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: علي حيدر الكرخي"
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              {/* STEP 3: USERNAME (ENGLISH ONLY, MIN 3 CHARS, LOCKED UNTIL NAME ENTERED) */}
              <div className={`transition-all duration-300 ${!isNameEntered ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="block text-xs font-black text-slate-700 mb-1 text-right flex items-center justify-between">
                  <span>الخطوة 3: اسم المستخدم (حروف إنجليزية فقط):</span>
                  {!isNameEntered && (
                    <span className="text-[10px] text-amber-600 font-bold">(يفتح بعد إدخال الاسم)</span>
                  )}
                </label>
                <p className="text-[10px] text-slate-400 font-medium mb-1 text-right">
                  English letters & numbers only • 3 أحرف فأكثر (بدون عربي)
                </p>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!isNameEntered}
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="مثال: ali_iraq26"
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono"
                    dir="ltr"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
                {usernameNotice && (
                  <p className="text-[10px] text-amber-600 font-bold mt-1 text-right animate-pulse">
                    {usernameNotice}
                  </p>
                )}
              </div>

              {/* STEP 4: PASSWORD & CONFIRMATION (MIN 6 CHARACTERS) */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-300 ${
                  !isUsernameReady ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1 text-right">
                    كلمة المرور (6 خانات+):
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      disabled={!isUsernameReady}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-3 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 font-mono"
                      dir="ltr"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1 text-right">
                    تأكيد كلمة المرور:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      disabled={!isUsernameReady}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-3 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 font-mono"
                      dir="ltr"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              {/* OPTIONAL: AVATAR & SCHOOL/CITY */}
              {isUsernameReady && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1.5 text-right">
                      اختر صورتك الرمزية (الأفاتار):
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center sm:justify-start">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setSelectedAvatar(av);
                          }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                            selectedAvatar === av
                              ? 'bg-emerald-100 border-2 border-emerald-500 scale-110 shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-slate-700 mb-1 text-right">
                        المحافظة / المدينة:
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="مثال: البصرة، بغداد..."
                        className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-700 mb-1 text-right">
                        اسم المدرسة الابتدائية:
                      </label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="مثال: مدرسة الفيحاء"
                        className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!isGradeChosen}
                className={`w-full py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${
                  isGradeChosen
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>إتمام تسجيل الطالب والبدء فوراً ⭐</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

