import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { getIraqiGradeName } from '../utils/edu-logic';
import { playClickSound } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  LogOut,
  Sparkles,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Logo and Platform Name */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shadow-emerald-600/30">
            <span>متفوق</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                منصة المتفوق
              </h1>
              <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 leading-none">
                العراق IQ
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-0.5 hidden xs:block">
              المنصة التعليمية الشاملة للمرحلة الابتدائية
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Audio toggle button */}
          <button
            onClick={() => {
              playClickSound();
              toggleSound();
            }}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
              soundOn
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
            title={soundOn ? 'الصوت والمؤثرات مفعلة' : 'الصوت كتم'}
            aria-label="تبديل الصوت"
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Quick Question Search Button */}
          {currentStudent && (
            <button
              onClick={() => {
                playClickSound();
                onOpenSearch();
              }}
              className="px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="بحث سريع في أسئلة المنهاج"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">بحث عن سؤال أو مسألة</span>
              <span className="sm:hidden">بحث</span>
            </button>
          )}

          {/* User state section */}
          {currentStudent ? (
            /* Student active view */
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl transition-all shadow-2xs">
                <span className="text-2xl sm:text-3xl shrink-0" role="img" aria-label="avatar">
                  {currentStudent.avatar}
                </span>
                <div className="text-right flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5">
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

              {/* زر دخول الإدارة السريع للمشرف مباشرة من حساب الطالب */}
              <button
                onClick={() => {
                  playClickSound();
                  onOpenAdminLogin();
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
                title="لوحة تحكم الإدارة (Admin)"
                aria-label="لوحة تحكم الإدارة"
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
              </button>

              {/* زر تسجيل الخروج الفوري */}
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
