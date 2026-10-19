import React, { useState, useMemo } from 'react';
import { GradeId, SubscriptionType, Subject } from '../types/index';
import { useEdu } from '../context/EduContext';
import { filterQuestionsForStudent } from '../utils/edu-logic';
import { QuestionCard } from './QuestionCard';
import { playClickSound } from '../utils/audio';
import { Search, X, Filter, BookOpen } from 'lucide-react';

interface QuestionSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeId: GradeId;
  subscription: SubscriptionType;
  subjects: Subject[];
  onUpgradePrompt: () => void;
}

export const QuestionSearchModal: React.FC<QuestionSearchModalProps> = ({
  isOpen,
  onClose,
  gradeId,
  subscription,
  subjects,
  onUpgradePrompt,
}) => {
  const { questions } = useEdu();
  const [query, setQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    return filterQuestionsForStudent(
      questions,
      gradeId,
      query,
      selectedSubjectId === 'all' ? undefined : selectedSubjectId
    );
  }, [questions, gradeId, query, selectedSubjectId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Search className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                البحث السريع في بنك الأسئلة والمناهج
              </h2>
              <p className="text-xs text-slate-500">
                ابحث بالكلمة أو المادة أو القاعدة في منهاجك الدراسي
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & filter controls */}
        <div className="py-4 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب كلمة من السؤال (مثال: دار، المبتدأ، القطر، القلب، حمورابي...)"
              className="w-full pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-3 top-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Subject Pills Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>المادة:</span>
            </span>

            <button
              onClick={() => {
                playClickSound();
                setSelectedSubjectId('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubjectId === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع المواد ({questions.filter((q) => q.gradeId === gradeId).length})
            </button>

            {subjects
              .filter((s) => s.gradeId === gradeId)
              .map((subj) => {
                const count = questions.filter(
                  (q) => q.gradeId === gradeId && q.subjectId === subj.id
                ).length;
                return (
                  <button
                    key={subj.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedSubjectId(subj.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedSubjectId === subj.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{subj.icon}</span>
                    <span>{subj.name}</span>
                    <span className="opacity-70 text-[10px]">({count})</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                studentSubscription={subscription}
                onUpgradePrompt={onUpgradePrompt}
                index={idx}
              />
            ))
          ) : (
            <div className="py-12 text-center text-slate-500">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700">
                لم يتم العثور على أسئلة تطابق بحثك
              </p>
              <p className="text-xs text-slate-400 mt-1">
                جرّب البحث بكلمات أخرى أو اختر مادة دراسية مختلفة.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            عدد النتائج: <strong className="text-slate-800">{filteredQuestions.length}</strong> سؤال
          </span>
          <span className="text-emerald-700 font-medium">
            اضغط على علامة السماعة للاستماع الصوتي
          </span>
        </div>
      </div>
    </div>
  );
};
