import React, { useState } from 'react';
import { Question, SubscriptionType } from '../types/index';
import { canStudentAccessQuestion } from '../utils/edu-logic';
import { playClickSound, speakArabicText, stopSpeaking } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  studentSubscription: SubscriptionType;
  onUpgradePrompt?: () => void;
  index: number;
}

function renderFormattedText(text: string) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|==.*?==|«.*?»|\.\.\.\.\.\.)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-black text-slate-950 underline decoration-amber-400 decoration-2">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={i} className="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-black">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.startsWith('«') && part.endsWith('»')) {
      return (
        <span key={i} className="text-emerald-800 font-bold font-serif">
          {part}
        </span>
      );
    }
    if (part === '......') {
      return (
        <span
          key={i}
          className="inline-block px-3 mx-1 font-mono font-black text-amber-600 bg-amber-50 border-b-2 border-dashed border-amber-500"
        >
          ......
        </span>
      );
    }
    return part;
  });
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  studentSubscription,
  onUpgradePrompt,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const canAccess = canStudentAccessQuestion(question, studentSubscription);

  const handleSpeakQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${question.questionText}. الجواب المعتمد هو: ${question.answerText}. ${question.explanation ? `توضيح المعلم: ${question.explanation}` : ''}`;
    speakArabicText(textToRead, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const isMinisterial = (question as any).badgeType === 'ministerial';
  const isSmartChallenge = (question as any).badgeType === 'smart_challenge';

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
        isMinisterial
          ? 'border-amber-400 bg-gradient-to-r from-amber-50/40 via-white to-white shadow-sm ring-1 ring-amber-300'
          : isSmartChallenge
          ? 'border-purple-300 bg-gradient-to-r from-purple-50/40 via-white to-white shadow-sm'
          : canAccess
          ? 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-md'
          : 'bg-slate-50/80 border-slate-200 opacity-95'
      }`}
    >
      <div
        onClick={() => {
          if (!canAccess) {
            onUpgradePrompt?.();
            return;
          }
          playClickSound();
          setIsOpen(!isOpen);
        }}
        className="p-5 sm:p-6 cursor-pointer select-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {question.chapter}
              </span>
              {question.lessonName && (
                <span className="text-xs text-slate-500">
                  • {question.lessonName}
                </span>
              )}

              {isMinisterial ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs border border-amber-500 flex items-center gap-1 animate-pulse">
                  🌟 سؤال وزاري مرشح
                </span>
              ) : isSmartChallenge ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white shadow-xs flex items-center gap-1">
                  🎯 تحدي الأذكياء
                </span>
              ) : (question as any).badgeType === 'focus_tip' ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs flex items-center gap-1">
                  💡 فهم وتركيز
                </span>
              ) : null}

              {question.questionType === 'fill_in_the_blank' || question.questionText.includes('......') || question.questionText.includes('____') ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                  ✏️ أكمل الفراغ
                </span>
              ) : question.questionType === 'qa' || (!question.options || question.options.length < 2) ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                  📝 سؤال وجواب للمراجعة
                </span>
              ) : (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                  🔘 اختبار متعدد الخيارات
                </span>
              )}

              {question.isVipOnly && (
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  ⭐ مخصص للاشتراك المفعّل
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {renderFormattedText(question.questionText)}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {canAccess ? (
              <>
                <button
                  type="button"
                  onClick={handleSpeakQuestion}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-emerald-500 text-white shadow-md speaking-animation'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                  }`}
                  title={isSpeaking ? 'إيقاف النطق' : 'استمع لنطق السؤال للأطفال'}
                  aria-label="استمع لنطق السؤال للأطفال"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <div className="p-2 text-slate-400">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={onUpgradePrompt}
                className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 hover:bg-amber-200 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>مقفول</span>
              </button>
            )}
          </div>
        </div>

        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {question.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {isOpen && canAccess && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-emerald-50/30 animate-in fade-in duration-200 space-y-3">
          {(question.questionType === 'multiple_choice' || (question.options && question.options.length >= 2 && question.questionType !== 'qa')) && (
            <div>
              <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>الخيارات المتاحة:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === question.correctAnswerIndex;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border ${
                        isCorrect
                          ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && (
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          الإجابة الصحيحة ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(question.questionType === 'fill_in_the_blank' || question.questionText.includes('......')) && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">الكلمة أو العبارة الصحيحة لملء الفراغ:</span>
                <span className="text-sm font-black text-amber-950 font-mono mt-0.5 inline-block">
                  {question.answerText}
                </span>
              </div>
              <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-1 rounded-xl font-bold">
                الحل الصحيح ✓
              </span>
            </div>
          )}

          {question.questionType !== 'fill_in_the_blank' && (
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>الجواب النموذجي المعتمد:</span>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {question.answerText}
              </p>
            </div>
          )}

          {question.explanation && (
            <div className="text-xs text-slate-600 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">توضيح المعلم: </span>
                <span>{question.explanation}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
