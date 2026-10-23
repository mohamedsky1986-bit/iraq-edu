import React, { useState, useEffect } from 'react';
import { useEdu } from '../context/EduContext';
import { getIraqiGradeName } from '../utils/edu-logic';
import { playClickSound } from '../utils/audio';
import {
  GraduationCap,
  Volume2,
  VolumeX,
  ShieldCheck,
  LogOut,
  Sparkles,
  Download,
  HelpCircle,
  Crown,
  Search,
  X,
  Smartphone,
  Share2,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAdminLogin: () => void;
  onOpenSupport: () => void;
  onOpenZipModal: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenAdminLogin,
  onOpenSupport,
  onOpenZipModal,
  onOpenSearch,
}) => {
  const { currentStudent, isAdmin, logout, logoutAdmin, soundOn, toggleSound } = useEdu();

  // حالة التثبيت التلقائي PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // كشف نوع الجهاز وبيئة التشغيل
    const ios = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!standalone);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    playClickSound();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else {
      // إظهار نافذة إرشادات التثبيت لكافة الهواتف التي لا تدعم الحدث التلقائي فوراً
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand identity - اللوجو المطور وشارة علم العراق IQ */}
          <div 
            onClick={() => {
              playClickSound();
              window.location.href = '/';
            }}
            className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer group select-none"
            title="منصة المتفوق التعليمية - جمهورية العراق"
          >
            {/* أيقونة اللوجو */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-200/90 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-xs" />
              <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>

            {/* نص الشعار وشارة علم العراق وزر التثبيت */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-sm sm:text-lg text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  منصة المتفوّق
                </span>

                {/* شارة علم العراق الصغيرة */}
                <div className="hidden xs:inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs">
                  <div className="w-3.5 h-2.5 rounded-[2px] overflow-hidden border border-white/50 flex flex-col shrink-0">
                    <div className="h-[33.3%] bg-[#ce1126]" />
                    <div className="h-[33.4%] bg-white flex items-center justify-center">
                      <span className="text-[3px] font-black text-[#007a3d] leading-none">★</span>
                    </div>
                    <div className="h-[33.3%] bg-black" />
                  </div>
                  <span className="text-[9px] font-black font-mono text-emerald-400">IQ</span>
                </div>

                {/* زر تثبيت التطبيق البارز بجانب الشعار مباشرة */}
                {!isStandalone && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInstallClick();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-[11px] sm:text-xs shadow-md shadow-amber-500/25 border border-amber-300/80 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 animate-pulse"
                    title="تثبيت التطبيق على شاشة الهاتف أو الحاسبة"
                  >
                    <span>📲</span>
                    <span className="whitespace-nowrap">تثبيت التطبيق</span>
                  </button>
                )}
              </div>

              <p className="hidden sm:block text-[11px] text-slate-500 font-semibold mt-0.5">
                المنهاج الرسمي لوزارة التربية العراقية 🇮🇶
              </p>
            </div>
          </div>

          {/* User state & controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                playClickSound();
                toggleSound();
              }}
              aria-label={soundOn ? 'كتم الصوت' : 'تفعيل أصوات النظام'}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
              title={soundOn ? 'الأصوات مفعلة' : 'الأصوات مكتومة'}
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              )}
            </button>

            {/* If Student is logged in */}
            {currentStudent ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 px-2 py-1 rounded-xl transition-all">
                  <span className="text-xl sm:text-2xl shrink-0" role="img" aria-label="avatar">
                    {currentStudent.avatar}
                  </span>
                  <div className="text-right flex flex-col justify-center min-w-0">
                    <span className="text-[11px] sm:text-xs font-black text-slate-950 truncate max-w-[90px] sm:max-w-[140px]">
                      {currentStudent.fullName}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700">
                      {getIraqiGradeName(currentStudent.gradeId)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    logout();
                  }}
                  className="p-1.5 sm:p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdmin ? (
              <div className="flex items-center gap-1.5">
                <div className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-black">
                  مشرف المنصة
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    logoutAdmin();
                  }}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="مغادرة"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenAuth();
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <span>دخول الطالب</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* نافذة إرشادات تثبيت التطبيق لجميع الهواتف */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-right space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                  <Smartphone className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    تثبيت تطبيق "منصة المتفوق" 📲
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    خطوتان سريعتان لتثبيت التطبيق على هاتفك
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* تنبيه مهم لمتصفح الواتساب */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800">
                <span>⚠️</span>
                <span>تنبيه هام إذا فتحت الرابط من الواتساب:</span>
              </div>
              <p className="text-[11px] text-slate-700 font-normal leading-relaxed">
                متصفح الواتساب الداخلي يمنع التثبيت المباشر. اضغط على النقاط الثلاث (⋮) في أعلى شاشة الواتساب واختر <strong>(فتح في Chrome)</strong> ثم ثبّت التطبيق.
              </p>
            </div>

            {/* إرشادات حسب نوع الجهاز */}
            {isIOS ? (
              /* إرشادات آيفون */
              <div className="space-y-2.5 text-xs text-slate-800">
                <p className="font-black text-emerald-800">لهواتف الآيفون (iPhone / Safari):</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <span>اضغط على زر المشاركة (المربع الذي يخرج منه سهم ⬆️) في أسفل شاشة Safari.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <span>مرر للأسفل واختر <strong>(إضافة إلى الشاشة الرئيسية 📲)</strong>.</span>
                </div>
              </div>
            ) : (
              /* إرشادات أندرويد والكمبيوتر */
              <div className="space-y-2.5 text-xs text-slate-800">
                <p className="font-black text-emerald-800">لهواتف الأندرويد (Chrome):</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <span>اضغط على النقاط الثلاث <strong>(⋮)</strong> في أعلى زاوية المتصفح.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <span>اختر <strong>(تثبيت التطبيق / Install App)</strong> أو (إضافة للشاشة الرئيسية).</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-colors cursor-pointer"
            >
              حسناً، فهمت ✓
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

