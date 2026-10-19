import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { Subject, Question } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName } from '../utils/edu-logic';
import { QuestionCard } from './QuestionCard';
import { Grade1ArabicReading } from './Grade1ArabicReading';
import { Grade1EnglishLetters } from './Grade1EnglishLetters';
import { Grade1Science } from './Grade1Science';
import { playClickSound } from '../utils/audio';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  PlayCircle,
  Crown,
  Search,
  CheckCircle,
  School,
  MapPin,
  Flame,
  Award,
} from 'lucide-react';

interface GradePortalProps {
  onStartQuiz: (subject: Subject, questions: Question[]) => void;
  onOpenSearch: () => void;
  onOpenUpgradeModal: () => void;
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

  // Filter subjects strictly for the student's grade
  const gradeSubjects = subjects.filter((s) => s.gradeId === currentGradeId);

  // Active selected subject
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    gradeSubjects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'qa' | 'curriculum'>('qa');

  const selectedSubject =
    gradeSubjects.find((s) => s.id === selectedSubjectId) || gradeSubjects[0];

  // Questions for current subject
  const currentSubjectQuestions = questions.filter(
    (q) => q.gradeId === currentGradeId && q.subjectId === selectedSubject?.id
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Student Welcome & Grade Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 sm:p-10 shadow-xl shadow-teal-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl sm:text-5xl shadow-lg shrink-0">
              {currentStudent.avatar}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs">
                  بوابة الطالب الخاصة 🎓
                </span>
                {currentStudent.subscription === 'paid' ? (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 flex items-center gap-1 shadow-xs">
                    <Crown className="w-3.5 h-3.5" /> اشتراك المنهاج مفعل (VIP)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenUpgradeModal();
                    }}
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer border border-white/20"
                  >
                    حساب مجاني • ترقية المنهاج وطلب VIP ⭐
                  </button>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                أهلاً بك يا بطل: {currentStudent.fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-emerald-100 font-medium">
                <span className="font-bold text-white bg-emerald-500/40 px-2 py-0.5 rounded-lg border border-white/10">
                  {getIraqiGradeName(currentGradeId)}
                </span>
                {currentStudent.schoolName && (
                  <span className="flex items-center gap-1">
                    <School className="w-3.5 h-3.5" />
                    <span>{currentStudent.schoolName}</span>
                  </span>
                )}
                {currentStudent.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{currentStudent.city}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Student Stats Badges */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shrink-0">
            <div className="text-center px-3 py-1 border-l border-white/20">
              <div className="flex items-center justify-center gap-1 text-amber-300 text-lg font-black">
                <Sparkles className="w-4 h-4 fill-amber-300" />
                <span>{currentStudent.starsEarned}</span>
              </div>
              <p className="text-[11px] text-emerald-100">النجوم المكتسبة</p>
            </div>

            <div className="text-center px-3 py-1 border-l border-white/20">
              <div className="flex items-center justify-center gap-1 text-cyan-200 text-lg font-black">
                <CheckCircle className="w-4 h-4" />
                <span>{currentStudent.completedQuizzesCount}</span>
              </div>
              <p className="text-[11px] text-emerald-100">اختبارات مكتملة</p>
            </div>

            <div className="text-center px-3 py-1">
              <div className="flex items-center justify-center gap-1 text-rose-300 text-lg font-black">
                <Flame className="w-4 h-4" />
                <span>{currentStudent.totalScore}</span>
              </div>
              <p className="text-[11px] text-emerald-100">نقاط التفوق</p>
            </div>
          </div>
        </div>

        {/* Badges Ribbon */}
        {currentStudent.badges && currentStudent.badges.length > 0 && (
          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-200 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> الأوسمة الممنوحة:
            </span>
            {currentStudent.badges.map((badge, bIdx) => (
              <span
                key={bIdx}
                className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white/15 backdrop-blur-xs text-white border border-white/20"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-amber-400/10 pointer-events-none" />
      </div>

      {/* Grade Subject Carousel */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>مناهج {gradeInfo?.name}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {gradeSubjects.length} مواد مقررة
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              المناهج الرسمية المعتمدة لوزارة التربية العراقية
            </p>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onOpenSearch();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>البحث السريع في بنك الأسئلة</span>
          </button>
        </div>

        {/* Subjects Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {gradeSubjects.map((subj) => {
            const isSelected = selectedSubject?.id === subj.id;
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
                  <span className="text-emerald-700">
                    {questions.filter((q) => q.gradeId === currentGradeId && q.subjectId === subj.id).length} سؤال
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Interactive Section for 1st Grade Arabic Reading, English Letters & Science */}
      {currentGradeId === 'grade-1' && selectedSubject?.id === 'ar-1' && (
        <Grade1ArabicReading />
      )}

      {currentGradeId === 'grade-1' && selectedSubject?.id === 'eng-1' && (
        <Grade1EnglishLetters />
      )}

      {currentGradeId === 'grade-1' && selectedSubject?.id === 'sci-1' && (
        <Grade1Science />
      )}

      {/* Selected Subject Area */}
      {selectedSubject && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 rounded-2xl bg-slate-100">
                {selectedSubject.icon}
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedSubject.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium max-w-xl">
                  {selectedSubject.description}
                </p>
              </div>
            </div>

            {/* Launch Quiz Button */}
            <button
              onClick={() => {
                playClickSound();
                onStartQuiz(selectedSubject, currentSubjectQuestions);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <PlayCircle className="w-5 h-5" />
              <span>بدء الاختبار التفاعلي والتقييم 🎯</span>
            </button>
          </div>

          {/* Tabs for Questions vs Lessons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('qa');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qa'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>أسئلة وأجوبة ونطق صوتي ({currentSubjectQuestions.length})</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('curriculum');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'curriculum'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>خطة المنهاج والوحدات المقررة</span>
            </button>
          </div>

          {/* Tab Content: Questions Bank */}
          {activeTab === 'qa' && (
            <div className="space-y-4 pt-2">
              {currentSubjectQuestions.length > 0 ? (
                currentSubjectQuestions.map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    studentSubscription={currentStudent.subscription}
                    onUpgradePrompt={onOpenUpgradeModal}
                    index={idx}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <p className="font-bold text-sm">
                    لا توجد أسئلة مضافة لهذه المادة بعد.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    يمكن للمشرف إضافة أسئلة من لوحة التحكم.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Curriculum Units */}
          {activeTab === 'curriculum' && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  الوحدة الأولى
                </span>
                <h4 className="font-bold text-slate-800 text-sm">
                  المفاهيم الأساسية والدروس التمهيدية
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تشمل شروحات المنهج المعتمدة من وزارة التربية العراقية، مع الأمثلة التوضيحية والتمارين الصفية.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  الوحدة الثانية
                </span>
                <h4 className="font-bold text-slate-800 text-sm">
                  التطبيقات والتدريبات والأنشطة العملية
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تمارين لتعزيز الفهم والاستيعاب مع التركيز على النطق السليم والقراءة النموذجية وحل المسائل.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
