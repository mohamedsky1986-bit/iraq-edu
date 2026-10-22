import React, { useState, useEffect } from 'react';
import { GRADES_DATA, DEFAULT_SUBJECTS } from '../data/initialData';
import { GradeId } from '../types/index';
import { playClickSound, playCorrectSound } from '../utils/audio';
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
  MessageSquare,
  Star,
  Send,
  User,
  Quote,
} from 'lucide-react';

interface HomeHeroProps {
  onSelectGrade: (gradeId: GradeId) => void;
  onOpenAuth: () => void;
  onOpenAdminLogin: () => void;
  onOpenZipModal: () => void;
}

export interface StudentComment {
  id: string;
  studentName: string;
  gradeName: string;
  rating: number; // 1 - 5
  commentText: string;
  date: string;
}

const COMMENTS_STORAGE_KEY = 'iraq_edu_platform_comments_v1';

const INITIAL_COMMENTS: StudentComment[] = [
  {
    id: 'c-1',
    studentName: 'حيدر علي الكرخي',
    gradeName: 'الصف السادس الابتدائي',
    rating: 5,
    commentText: 'منصة المتفوق ساعدتني جداً في فهم قواعد العربي والأسئلة الوزارية، خصوصاً نائب الفاعل وحل التمارين اليومية!',
    date: '2026-10-20',
  },
  {
    id: 'c-2',
    studentName: 'زينب أحمد البصري',
    gradeName: 'الصف الرابع الابتدائي',
    rating: 5,
    commentText: 'النطق الصوتي للمحفوظات والآيات يخليني أحفظ بسرعة، والامتحانات الذكية تنطيني ثقة عالية بالمدرسة.',
    date: '2026-10-21',
  },
  {
    id: 'c-3',
    studentName: 'ولي أمر التلميذ يوسف',
    gradeName: 'الصف الأول الابتدائي',
    rating: 5,
    commentText: 'طريقة تدريب الحروف والمقاطع بالقراءة رائعة ومسلية جداً للأطفال، بارك الله بجهودكم على هذا المجهود العراقي المتميز.',
    date: '2026-10-22',
  },
];

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectGrade,
  onOpenAuth,
  onOpenAdminLogin,
  onOpenZipModal,
}) => {
  const [comments, setComments] = useState<StudentComment[]>(() => {
    try {
      const saved = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COMMENTS;
  });

  // State for adding a new comment
  const [newAuthor, setNewAuthor] = useState('');
  const [newGrade, setNewGrade] = useState('الصف الأول الابتدائي');
  const [newRating, setNewRating] = useState(5);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSentFeedback, setCommentSentFeedback] = useState(false);

  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newCommentText.trim()) return;

    const newCommentItem: StudentComment = {
      id: `comm-${Date.now()}`,
      studentName: newAuthor.trim(),
      gradeName: newGrade,
      rating: newRating,
      commentText: newCommentText.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [newCommentItem, ...comments];
    setComments(updated);
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));

    playCorrectSound();
    setNewAuthor('');
    setNewCommentText('');
    setCommentSentFeedback(true);
    setTimeout(() => setCommentSentFeedback(false), 4000);
  };

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
                onOpenZipModal();
              }}
              className="px-5 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تحميل المشروع كاملاً (ZIP)</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onOpenAdminLogin();
              }}
              className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>لوحة تحكم المشرف 🔒</span>
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

                {/* عرض المواد الدراسية المعتمدة للصف مباشرة بالصفحة الرئيسية */}
                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-slate-700">
                      المواد المقررة:
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {DEFAULT_SUBJECTS.filter((s) => s.gradeId === grade.id).length} مواد دراسية
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_SUBJECTS.filter((s) => s.gradeId === grade.id).map((subj) => (
                      <span
                        key={subj.id}
                        className="px-2.5 py-1 rounded-xl bg-slate-50 text-slate-800 text-[11px] font-bold border border-slate-200/80 flex items-center gap-1 group-hover:bg-emerald-50 group-hover:text-emerald-900 group-hover:border-emerald-200 transition-colors"
                      >
                        <span>{subj.icon}</span>
                        <span>{subj.name.replace(/\s*\(.*\)/, '').trim()}</span>
                      </span>
                    ))}
                  </div>
                </div>
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
            تحكم كامل بتفعيل الاشتراكات (مجاني/مدفوع)، تعديل المناهج والأسئلة والتحكم بالتعليقات.
          </p>
        </div>
      </div>

      {/* قسم التعليقات وآراء الطلبة وأولياء الأمور في الصفحة الرئيسية */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-right">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                آراء وانطباعات أبطال المنصة وأولياء الأمور 💬
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              تجارب حقيقية لطلبة متفوقين وأولياء أمورهم في مسيرتهم التعليمية مع منصة المتفوق
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            {comments.length} تقييم مسجل ⭐
          </span>
        </div>

        {/* عرض بطاقات التعليقات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comments.map((comm) => (
            <div
              key={comm.id}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                      {comm.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-slate-900">{comm.studentName}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{comm.gradeName}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: comm.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                  "{comm.commentText}"
                </p>
              </div>

              <span className="text-[10px] text-slate-400 font-mono block pt-2 border-t border-slate-200/60">
                {comm.date}
              </span>
            </div>
          ))}
        </div>

        {/* نموذج إضافة تعليق جديد للطالب */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-6 rounded-2xl border border-emerald-200 space-y-4">
          <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
            <span>✍️ أضف رأيك وتجربتك في منصة المتفوق:</span>
          </h3>

          <form onSubmit={handleAddComment} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسمك الكريم أو كنية ولي الأمر:</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="مثال: علي محمد / والد التلميذة فاطمة"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المرحلة الدراسية:</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none cursor-pointer"
                >
                  {GRADES_DATA.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                  <option value="المنصة بشكل عام">المنصة بشكل عام</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التقييم بالنجوم:</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (ممتاز جداً 5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (جيد جداً 4/5)</option>
                  <option value={3}>⭐⭐⭐ (متوسط 3/5)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رأيك واقتراحك في المنصة:</label>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="اكتب تجربتك مع المنصة، فائدة الدروس، سهولة التمارين..."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium outline-none focus:border-emerald-500"
                required
              />
            </div>

            {commentSentFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>شكراً لمشاركتك! تم نشر تعليقك بنجاح وسيظهر لجميع زوار المنصة ✓</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال ونشر التعليق</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

