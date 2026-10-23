import React from 'react';
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand identity - اللوجو المطور وشارة علم العراق IQ */}
        <div 
          onClick={() => {
            playClickSound();
            window.location.href = '/';
          }}
          className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 cursor-pointer group select-none"
          title="منصة المتفوق التعليمية - جمهورية العراق"
        >
          {/* أيقونة اللوجو الفخمة والواضحة */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-200/90 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-xs" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>

          {/* نص الشعار وشارة علم العراق IQ الفخمة */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-xl text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                منصة المتفوّق
              </span>

              {/* شارة فيكة علم العراق و IQ المرتبة والجاذبة */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-white shadow-xs">
                {/* مجسم علم العراق الصغير المصمم بدقة */}
                <div 
                  className="w-4 h-3 rounded-[2.5px] overflow-hidden border border-white/50 shadow-2xs flex flex-col shrink-0" 
                  title="علم جمهورية العراق 🇮🇶"
                >
                  <div className="h-[33.3%] bg-[#ce1126]" />
                  <div className="h-[33.4%] bg-white flex items-center justify-center">
                    <span className="text-[4px] font-black text-[#007a3d] leading-none select-none">
                      ★
                    </span>
                  </div>
                  <div className="h-[33.3%] bg-black" />
                </div>

                <span className="text-[10px] sm:text-[11px] font-black text-white tracking-wide">
                  العراق
                </span>
                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-mono">
                  IQ
                </span>
              </div>
            </div>

            <p className="hidden sm:block text-[11px] text-slate-500 font-semibold mt-0.5">
              المنهاج الرسمي لوزارة التربية العراقية 🇮🇶
            </p>
          </div>
        </div>

        {/* Center / Action buttons */}
        <div className="hidden md:flex items-center gap-2">
          {currentStudent && (
            <button
              onClick={() => {
                playClickSound();
                onOpenSearch();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>بحث عن سؤال أو مسألة</span>
              <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded-sm border border-slate-300 text-slate-500">
                سريع
              </kbd>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              onOpenSupport();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>دعم فوري</span>
          </button>
        </div>

        {/* User state & controls */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              playClickSound();
              toggleSound();
            }}
            aria-label={soundOn ? 'كتم الصوت' : 'تفعيل أصوات النظام'}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title={soundOn ? 'الأصوات مفعلة' : 'الأصوات مكتومة'}
          >
            {soundOn ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* If Student is logged in */}
          {currentStudent ? (
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl transition-all shadow-2xs">
                <span className="text-2xl sm:text-3xl shrink-0" role="img" aria-label="avatar">
                  {currentStudent.avatar}
                </span>
                <div className="text-right flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5">
                    {/* الاسم الأول واسم الوالد بالموبايل، والاسم الكامل بالشاشات الأكبر */}
                    <span className="text-xs sm:text-sm font-black text-slate-950 leading-tight">
                      <span className="sm:hidden">
                        {(currentStudent.fullName || '').trim().split(/\s+/).slice(0, 2).join(' ')}
                      </span>
                      <span className="hidden sm:inline">
                        {currentStudent.fullName}
                      </span>
                    </span>
                    {currentStudent.subscription === 'paid' ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs shrink-0">
                        <Crown className="w-2.5 h-2.5" /> VIP
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">
                        مجاني
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 font-bold mt-0.5">
                    <span className="text-emerald-700 font-extrabold">
                      {getIraqiGradeName(currentStudent.gradeId)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-amber-600 font-bold">
                      <Sparkles className="w-3 h-3 fill-amber-500" />
                      {currentStudent.starsEarned} نجمة
                    </span>
                  </div>
                </div>
              </div>



              <button
                onClick={() => {
                  playClickSound();
                  logout();
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors shrink-0 cursor-pointer"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          ) : isAdmin ? (
            /* Admin active badge */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>لوحة تحكم المشرف (Admin)</span>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  logoutAdmin();
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                title="مغادرة لوحة التحكم"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Guest buttons */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  onOpenAuth();
                }}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>دخول الطالب</span>
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

