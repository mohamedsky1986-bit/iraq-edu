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
        {/* Brand identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 ring-2 sm:ring-4 ring-amber-100">
            <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                المتفوّق
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                العراق 🇮🇶
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 font-medium">
              المنصة التعليمية الشاملة للمرحلة الابتدائية
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all shadow-2xs"
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
              onOpenZipModal();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-all"
            title="تحميل ملف المشروع ZIP مباشرة"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>تحميل ملف ZIP</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenSupport();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-all"
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
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
                <span className="text-2xl" role="img" aria-label="avatar">
                  {currentStudent.avatar}
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">
                      {currentStudent.fullName}
                    </span>
                    {currentStudent.subscription === 'paid' ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                        <Crown className="w-3 h-3" /> VIP
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        مجاني
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-emerald-700">
                      {getIraqiGradeName(currentStudent.gradeId)}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
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
                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
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
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
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
              <button
                onClick={() => {
                  playClickSound();
                  onOpenAdminLogin();
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="تسجيل دخول الإدارة (Admin)"
                aria-label="تسجيل دخول الإدارة"
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
