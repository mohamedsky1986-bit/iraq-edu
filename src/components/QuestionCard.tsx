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
  const parts = text.split(/(\*\*.*?\*\*|==.*?==|«.*?»|[red].*?\[\/red\]|[blue].*?\[\/blue\]|[green].*?\[\/green\]|[purple].*?\[\/purple\]|[orange].*?\[\/orange\]|\.\.\.\.\.\.)/g);
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
    if (part.startsWith('[red]') && part.endsWith('[/red]')) {
      return (
        <span key={i} className="text-rose-600 font-black">
          {part.slice(5, -6)}
        </span>
      );
    }
    if (part.startsWith('[blue]') && part.endsWith('[/blue]')) {
      return (
        <span key={i} className="text-blue-600 font-black">
          {part.slice(6, -7)}
        </span>
      );
    }
    if (part.startsWith('[green]') && part.endsWith('[/green]')) {
      return (
        <span key={i} className="text-emerald-600 font-black">
          {part.slice(7, -8)}
        </span>
      );
    }
    if (part.startsWith('[orange]') && part.endsWith('[/orange]')) {
      return (
        <span key={i} className="text-amber-600 font-black">
          {part.slice(8, -9)}
        </span>
      );
    }
    if (part.startsWith('[purple]') && part.endsWith('[/purple]')) {
      return (
        <span key={i} className="text-purple-600 font-black">
          {part.slice(8, -9)}
        </span>
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

    const textToRead = `${question.questionText}. الجواب النموذجي هو: ${question.answerText}. الشرح: ${question.explanation}`;
    speakArabicText(textToRead, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
        canAccess
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
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-right">
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-2.5">
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
              {(question as any).badgeType === 'ministerial' ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs border border-amber-500 flex items-center gap-1 animate-pulse">
                  🌟 سؤال وزاري مرشح
                </span>
              ) : (question as any).badgeType === 'smart_challenge' ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white shadow-xs flex items-center gap-1">
                  🎯 تحدي الأذكياء
                </span>
              ) : (question as any).badgeType === 'focus_tip' ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs flex items-center gap-1">
                  💡 فهم وتركيز
                </span>
              ) : null}
              {question.questionType === 'reasoning' || question.questionText.startsWith('علل') || question.questionText.includes('السبب') ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
                  🧐 تعليل وزاري (علل)
                </span>
              ) : question.questionType === 'definition' || question.questionText.startsWith('عرّف') || question.questionText.includes('المقصود') ? (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                  📖 تعريف ومصطلح مهم
                </span>
              ) : question.questionType === 'fill_in_the_blank' || question.questionText.includes('......') || question.questionText.includes('____') ? (
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

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug text-center sm:text-right">
              {renderFormattedText(question.questionText)}
            </h3>

            {(question as any).imageUrl && (
              <div className="my-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-w-sm mx-auto shadow-2xs">
                <img
                  src={(question as any).imageUrl}
                  alt="توضيح السؤال"
                  className="w-full h-auto max-h-56 object-contain mx-auto"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {canAccess ? (
              <>
                <button
                  onClick={handleSpeakQuestion}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-100 text-rose-600 animate-pulse ring-2 ring-rose-300'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                  title={isSpeaking ? 'إيقاف النطق' : 'استمع لنطق السؤال والجواب بصوت واضح'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <div className="p-2 rounded-2xl text-slate-400">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-800 text-xs font-black">
                <Lock className="w-4 h-4" />
                <span>اشتراك VIP</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && canAccess && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in text-center sm:text-right">
          {question.options && question.options.length >= 2 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                الخيارات التفاعلية:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === question.correctAnswerIndex;
                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between border ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black">
                          الإجابة الصحيحة ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {question.questionType !== 'fill_in_the_blank' && (
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>الجواب النموذجي المعتمد:</span>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {renderFormattedText(question.answerText)}
              </p>
            </div>
          )}

          {question.explanation && (
            <div className="text-xs text-slate-600 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">توضيح المعلم: </span>
                <span>{renderFormattedText(question.explanation)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
