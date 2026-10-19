import React from 'react';
import { GRADES_DATA } from '../data/initialData';
import { GradeId } from '../types/index';
import { playClickSound } from '../utils/audio';
import {
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle,
  Crown,
  Search,
  Award,
  ArrowLeft,
  Download,
  ShieldCheck,
} from 'lucide-react';

interface HomeHeroProps {
  onSelectGrade: (gradeId: GradeId) => void;
  onOpenAuth: () => void;
  onOpenAdminLogin: () => void;
  onOpenZipModal: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectGrade,
  onOpenAuth,
  onOpenAdminLogin,
  onOpenZipModal,
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-14 shadow-2xl border border-emerald-900/30">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>المنصة التفاعلية الرسمية للتعليم الابتدائي في العراق</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            تعلّم، تدرّب وتفوّق في منهاجك الابتدائي مع{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-300">
              منصة المتفوق
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            من الصف الأول إلى الصف السادس الابتدائي: مناهج دراسية معتمدة، نطق صوتي مخصص للأطفال، بنك أسئلة وأجوبة مع خيار البحث السريع، اختبارات تفاعلية بنظام أصوات تشجيعية، ولوحة تحكم شاملة للمشرف.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playClickSound();
                onOpenAuth();
              }}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>دخول الطالب / تسجيل حساب جديد</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playClickSound();
                onOpenAdminLogin();
              }}
              className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>لوحة تحكم الأدمن</span>
            </button>
          </div>
        </div>

        {/* Decorative subtle glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grade Selection Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-900">
            اختر مرحلتك الدراسية للبدء فوراً
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تفتح المنصة لكل طالب المواد والاختبارات المقررة لمرحلته حصراً
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GRADES_DATA.map((grade) => (
            <div
              key={grade.id}
              onClick={() => {
                playClickSound();
                onSelectGrade(grade.id);
              }}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
                    {grade.icon}
                  </span>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${grade.badgeColor}`}>
                    {grade.stageName}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                  {grade.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {grade.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  مناهج وأسئلة واختبارات
                </span>
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <span>فتح المنهاج</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights / Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">نطق صوتي للأطفال</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            قراءة صوتية تفاعلية للأسئلة والأجوبة بنبرة دافئة وواضحة تناسب تلاميذ المرحلة الابتدائية.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">اختبارات تفاعلية بأصوات النظام</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            مؤثرات صوتية محفزة للإجابات الصحيحة والتقييم بالنجوم والأوسمة وشهادات التفوق المدرسية.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <Search className="w-5 h-5 text-sky-600" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">بحث فوري عن أي سؤال</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            محرك بحث ذكي يتجاوز الهمزات والحركات للعثور على حل أي مسألة أو سؤال وزاري في ثوانٍ.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">لوحة تحكم المشرف (Admin)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            تحكم كامل بتفعيل الاشتراكات (مجاني/مدفوع)، تعديل المناهج والأسئلة وتغيير رمز الحماية.
          </p>
        </div>
      </div>
    </div>
  );
};
