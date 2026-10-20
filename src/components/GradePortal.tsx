import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { Subject, Question } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName } from '../utils/edu-logic';
import { QuestionCard } from './QuestionCard';
import { Grade1ArabicReading } from './Grade1ArabicReading';
import { Grade1EnglishLetters } from './Grade1EnglishLetters';
import { playClickSound } from '../utils/audio';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  PlayCircle,
  Award,
  Trophy,
  FileText,
  Clock,
  ArrowRight,
  Folder,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface GradePortalProps {
  onStartQuiz: (subject: Subject, questions: Question[]) => void;
  onOpenSearch: () => void;
  onOpenUpgradeModal: () => void;
}

const DEFAULT_IRAQI_CHAPTERS: Record<string, string[]> = {
  'sci-1': [
    'الفصل الأول: الكائنات الحية وأجزاؤها',
    'الفصل الثاني: البيئة الطبيعية ومكوناتها',
    'الفصل الثالث: المادة وخصائصها',
    'الفصل الرابع: الحركة والقوة',
    'الفصل الخامس: الأرض والموارد الطبيعية',
  ],
  'ar-1': [
    'الفصل الأول: الحروف والمقاطع بالحركات',
    'الفصل الثاني: الكلمات والجمل البسيطة',
    'الفصل الثالث: القصص والمطالعة',
  ],
  'math-1': [
    'الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر',
    'الفصل الثاني: الجمع حتى العدد 9',
    'الفصل الثالث: الطرح حتى العدد 9',
    'الفصل الرابع: الأعداد حتى 20',
    'الفصل الخامس: الأشكال الهندسية والقياس',
  ],
  'isl-1': [
    'الفصل الأول: السور القرآنية والآداب الإسلامية',
    'الفصل الثاني: العقيدة وسيرة النبي محمد (ص)',
    'الفصل الثالث: الأخلاق والأدعية والحديث الشريف',
  ],
  'eng-1': [
    'Unit 1: Hello & Alphabet Phonics',
    'Unit 2: Numbers & Colors',
    'Unit 3: Family & Classroom Objects',
  ],
  'sci-2': [
    'الفصل الأول: أعضاء جسم الإنسان',
    'الفصل الثاني: الحفاظ على صحة الجسم',
    'الفصل الثالث: البيئة اليابسة والبيئة المائية',
    'الفصل الرابع: الغذاء والتغذية',
  ],
};

function sanitizeQuestionSubject(q: Question): Question {
  const text = `${q.questionText || ''} ${q.chapter || ''} ${q.lessonName || ''} ${(q.tags || []).join(' ')}`.toLowerCase();

  if (q.gradeId === 'grade-1') {
    const scienceKeywords = [
      'كائن', 'كائنات', 'نبات', 'حيوان', 'بيئة', 'جذور', 'ساق', 'أوراق',
      'مادة', 'صلبة', 'سائلة', 'غازية', 'دفع', 'سحب', 'حركة', 'خياشيم',
      'صحراو', 'موارد', 'حواس', 'حي وغير حي', 'جماد', 'علوم'
    ];
    const readingKeywords = [
      'حرف', 'مقطع', 'مقاطع', 'دار', 'دور', 'دادا', 'رباب', 'بابا', 'ماما',
      'ميزان', 'قدوري', 'وزان', 'تهجي', 'قراءتي', 'أصوات'
    ];

    const isScience = scienceKeywords.some((k) => text.includes(k));
    const isReading = readingKeywords.some((k) => text.includes(k));

    if (isScience && !isReading && q.subjectId === 'ar-1') {
      return { ...q, subjectId: 'sci-1' };
    }

    if (isReading && !isScience && q.subjectId === 'sci-1') {
      return { ...q, subjectId: 'ar-1' };
    }
  }

  return q;
}

export const GradePortal: React.FC<GradePortalProps> = ({
  onStartQuiz,
  onOpenSearch,
  onOpenUpgradeModal,
}) => {
  const { currentStudent, subjects, questions } = useEdu();

  if (!currentStudent) return null;

  const currentGradeId = currentStudent.gradeId;
  const gradeInfo = GRADES_DATA.find((g) => g.id === currentGradeId);
  const gradeSubjects = subjects.filter((s) => s.gradeId === currentGradeId);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    gradeSubjects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'qa' | 'exams' | 'curriculum'>('qa');

  const selectedSubject =
    gradeSubjects.find((s) => s.id === selectedSubjectId) || gradeSubjects[0];

  const currentSubjectQuestions = questions
    .map(sanitizeQuestionSubject)
    .filter(
      (q) => q.gradeId === currentGradeId && q.subjectId === selectedSubject?.id
    );

  const getSubjectChapters = (subjectId: string): string[] => {
    try {
      const saved = localStorage.getItem('iraq_edu_subject_chapters_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[subjectId] && parsed[subjectId].length > 0) {
          return parsed[subjectId];
        }
      }
    } catch (e) {}

    const defaults = DEFAULT_IRAQI_CHAPTERS[subjectId] || [
      'الفصل الأول: المفاهيم والدروس الأساسية',
      'الفصل الثاني: الأنشطة والتطبيقات العملية',
      'الفصل الثالث: مراجعة شاملة ونصف السنة',
      'الفصل الرابع: الاختبارات والوزاريات النهائية',
    ];

    const fromQuestions = currentSubjectQuestions.map((q) => q.chapter).filter(Boolean);
    return Array.from(new Set([...defaults, ...fromQuestions]));
  };

  const subjectChapters = selectedSubject ? getSubjectChapters(selectedSubject.id) : [];

  const getOrderedQuestionsForChapter = (chapName: string): Question[] => {
    const raw = currentSubjectQuestions.filter((q) => q.chapter === chapName);
    const key = `iraq_edu_order_${currentGradeId}_${selectedSubject?.id}_${chapName}`;
    let orderMap: Record<string, number> = {};
    try {
      const saved = localStorage.getItem(key);
      if (saved) orderMap = JSON.parse(saved);
    } catch (e) {}

    return [...raw].sort((a, b) => {
      const orderA = orderMap[a.id] !== undefined ? orderMap[a.id] : 9999;
      const orderB = orderMap[b.id] !== undefined ? orderMap[b.id] : 9999;
      return orderA - orderB;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 sm:p-8 shadow-xl shadow-teal-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <span className="text-4xl sm:text-5xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner">
              {currentStudent.avatar}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 shadow-xs">
                  {gradeInfo?.name}
                </span>
                {currentStudent.subscription === 'paid' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>مشترك VIP مفعل ⭐</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/15 text-white/90">
                    حساب مجاني
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                أهلاً بك يا بطل، {currentStudent.fullName} 🌟
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5">
                منهاجك مرتب بالفصول، التعاليل، التعاريف، والامتحانات النموذجية التفاعلية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-lg font-black text-amber-300">
                {currentStudent.starsEarned || 0} ⭐
              </span>
              <p className="text-[11px] text-emerald-100 font-bold">نجوم التفوق</p>
            </div>
            <div className="p-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-lg font-black text-white">
                {currentStudent.totalScore || 0}
              </span>
              <p className="text-[11px] text-emerald-100 font-bold">النقاط الكلية</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>المواد الدراسية المقررة لـ {gradeInfo?.name}:</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {gradeSubjects.length} مواد معتمدة
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {gradeSubjects.map((subj) => {
            const isSelected = selectedSubject?.id === subj.id;
            const subjectQuestionsCount = questions
              .map(sanitizeQuestionSubject)
              .filter((q) => q.gradeId === currentGradeId && q.subjectId === subj.id).length;

            return (
              <button
                key={subj.id}
                onClick={() => {
                  playClickSound();
                  setSelectedSubjectId(subj.id);
                }}
                className={`p-4 rounded-3xl border-2 text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md scale-102 ring-2 ring-emerald-200'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <span className="text-3xl block mb-2">{subj.icon}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                    {subj.name}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{subj.lessonsCount} درس</span>
                  <span className="text-emerald-700 font-bold">
                    {subjectQuestionsCount} سؤال
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedSubject && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 text-center sm:text-right">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                {selectedSubject.icon}
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedSubject.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {gradeInfo?.name} • منهاج وزارة التربية العراقية المعتمد
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onStartQuiz(selectedSubject, currentSubjectQuestions);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <PlayCircle className="w-5 h-5" />
              <span>بدء الاختبار التفاعلي والتقييم 🎯</span>
            </button>
          </div>

          {(currentGradeId === 'grade-1' || currentGradeId === 'grade-2') &&
            (selectedSubject.id.startsWith('ar-') || selectedSubject.name.includes('قراءتي') || selectedSubject.name.includes('العربية')) && (
              <details className="group bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 p-4 sm:p-5 transition-all shadow-xs" open={currentGradeId === 'grade-1'}>
                <summary className="cursor-pointer font-black text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm sm:text-base select-none list-none text-center sm:text-right">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">📁</span>
                    <span>مجلد تأسيس ومراجعة الحروف والمقاطع بالحركات ({currentGradeId === 'grade-1' ? 'الصف الأول' : 'الصف الثاني'})</span>
                  </span>
                  <span className="text-xs bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold group-open:rotate-180 transition-transform">
                    ▼ فتح / غلق المجلد
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-amber-200/80">
                  <Grade1ArabicReading />
                </div>
              </details>
          )}

          {(currentGradeId === 'grade-1' || currentGradeId === 'grade-2') &&
            (selectedSubject.id.startsWith('eng-') || selectedSubject.name.toLowerCase().includes('english') || selectedSubject.name.includes('إنجليزية')) && (
              <details className="group bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-4 sm:p-5 transition-all shadow-xs" open={currentGradeId === 'grade-1'}>
                <summary className="cursor-pointer font-black text-blue-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm sm:text-base select-none list-none text-center sm:text-right">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">📁</span>
                    <span>English Letters & Phonics Sounds (حروف وأصوات الإنجليزية)</span>
                  </span>
                  <span className="text-xs bg-blue-200 text-blue-900 px-3 py-1 rounded-full font-bold group-open:rotate-180 transition-transform">
                    ▼ فتح / غلق المجلد
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-blue-200/80">
                  <Grade1EnglishLetters />
                </div>
              </details>
          )}

          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('qa');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qa'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>المنهاج والأسئلة مرتبة بالفصول ({currentSubjectQuestions.length})</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('exams');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'exams'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>📝 الامتحانات والاختبارات النموذجية</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('curriculum');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'curriculum'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>خطة ومفردات المنهاج</span>
            </button>
          </div>

          {activeTab === 'qa' && (
            <div className="space-y-6 pt-2">
              {subjectChapters.map((chapName, chapIdx) => {
                const chapterQuestions = getOrderedQuestionsForChapter(chapName);
                if (chapterQuestions.length === 0) return null;

                return (
                  <div key={chapIdx} className="rounded-3xl border border-slate-200 bg-slate-50/40 overflow-hidden shadow-2xs">
                    <div className="p-4 bg-slate-100/90 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-right">
                        <span className="text-2xl">📁</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                              #{chapIdx + 1}
                            </span>
                            <h4 className="font-black text-sm sm:text-base text-slate-900">
                              {chapName}
                            </h4>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">
                            يتضمن {chapterQuestions.length} سؤال وشرح ونطق صوتي
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playClickSound();
                          onStartQuiz(selectedSubject, chapterQuestions);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-2xs"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>اختبار {chapName} 🎯</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      {chapterQuestions.map((q, idx) => (
                        <QuestionCard
                          key={q.id}
                          question={q}
                          studentSubscription={currentStudent.subscription}
                          onUpgradePrompt={onOpenUpgradeModal}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {currentSubjectQuestions.length === 0 && (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                    📚
                  </div>
                  <p className="text-sm font-bold">
                    لم يقم المعلم أو المشرف بإضافة أسئلة لهذا المنهج بعد.
                  </p>
                  <p className="text-xs text-slate-400">
                    ستظهر الأسئلة والتعاليل والامتحانات هنا بمجرد إضافتها من لوحة الإشراف.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-6 pt-2">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-xl shadow-amber-600/15 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                      🏆
                    </span>
                    <div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/25 text-white">
                        الامتحان الشامل والنهائي
                      </span>
                      <h4 className="text-lg sm:text-xl font-black mt-1">
                        الامتحان النموذجي الشامل لمادة {selectedSubject.name}
                      </h4>
                      <p className="text-xs text-amber-100 font-medium mt-0.5">
                        اختبار تفاعلي يقيس الفهم الكامل لجميع فصول المنهج مع التقييم الذكي وشهادة التقدير
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={currentSubjectQuestions.length === 0}
                    onClick={() => {
                      playClickSound();
                      onStartQuiz(selectedSubject, currentSubjectQuestions);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0 transition-transform hover:scale-105"
                  >
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>ابدأ الامتحان الشامل الآن ({currentSubjectQuestions.length} سؤال)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/20 text-center text-xs font-bold">
                  <div className="p-2 rounded-xl bg-white/10">⏱️ اختبار بدون وقت محدد</div>
                  <div className="p-2 rounded-xl bg-white/10">⭐ نجوم تفوق عند النجاح</div>
                  <div className="p-2 rounded-xl bg-white/10">📜 شهادة تقدير فورية</div>
                  <div className="p-2 rounded-xl bg-white/10">🎯 نطق صوتي للأسئلة</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>امتحانات الفصول الدورية (اختبر معلوماتك فصلاً بفصل):</span>
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    {subjectChapters.length} فصول مقررة
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjectChapters.map((chapName, chapIdx) => {
                    const chapterQuestions = getOrderedQuestionsForChapter(chapName);
                    const hasQuestions = chapterQuestions.length > 0;

                    return (
                      <div
                        key={chapIdx}
                        className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between text-right ${
                          hasQuestions
                            ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm'
                            : 'bg-slate-50 border-slate-200/60 opacity-70'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900">
                              امتحان الفصل #{chapIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                              {chapterQuestions.length} سؤال
                            </span>
                          </div>

                          <h5 className="font-black text-sm text-slate-900">
                            {chapName}
                          </h5>
                          <p className="text-xs text-slate-500">
                            اختبار تدريبي وتقييمي شامل لأسئلة وتعاليل وتعريفات هذا الفصل
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>تصحيح فوري ذكي</span>
                          </span>

                          <button
                            disabled={!hasQuestions}
                            onClick={() => {
                              playClickSound();
                              onStartQuiz(selectedSubject, chapterQuestions);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>بدء امتحان الفصل</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 text-right">
              <h4 className="font-black text-slate-900 text-base">
                مفردات ومنهاج {selectedSubject.name} - {gradeInfo?.name}
              </h4>
              <p>
                يتضمن هذا المنهج {selectedSubject.lessonsCount} درساً تدريبياً مع تمارين واختبارات تفاعلية، متطابقة مع كتاب وزارة التربية العراقية الرسمي.
              </p>
              <div className="p-4 rounded-xl bg-white border border-slate-200 font-medium">
                💡 <strong>نصيحة للمتفوق:</strong> يمكنك حل الأسئلة والاستماع للنطق الصوتي لترسيخ المعلومات قبل بدء الاختبار التقييمي للحصول على وسام التفوق الذهبي.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradePortal;
