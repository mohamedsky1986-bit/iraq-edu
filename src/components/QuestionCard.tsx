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
  MessageCircle,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  studentSubscription: SubscriptionType;
  onUpgradePrompt?: () => void;
  index: number;
}

/**
 * Highlights keywords like "علل", "عرف", or blanks in question text
 */
function renderFormattedText(text: string) {
  const parts = text.split(/(علل|عرّف|عرف|ما المقصود|أكمل الفراغ|......)/g);
  return parts.map((part, i) => {
    if (part === 'علل') {
      return (
        <span
          key={i}
          className="inline-block px-2 py-0.5 mx-1 rounded-md bg-rose-100 text-rose-800 font-black border border-rose-300"
        >
          علل 🧐
        </span>
      );
    }
    if (part === 'عرّف' || part === 'عرف' || part === 'ما المقصود') {
      return (
        <span
          key={i}
          className="inline-block px-2 py-0.5 mx-1 rounded-md bg-indigo-100 text-indigo-800 font-black border border-indigo-300"
        >
          {part} 📖
        </span>
      );
    }
    if (part === 'أكمل الفراغ') {
      return (
        <span
          key={i}
          className="inline-block px-2 py-0.5 mx-1 rounded-md bg-amber-100 text-amber-800 font-black border border-amber-300"
        >
          أكمل الفراغ ✏️
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

  const whatsappNumber = '07707383565';
  const whatsappUrl = `https://wa.me/9647707383565?text=${encodeURIComponent(
    `السلام عليكم، أود تفعيل اشتراك VIP في منصة المتفوق لفتح السؤال: "${question.questionText.slice(0, 60)}..." (للتواصل والدفع الفوري على الرقم ${whatsappNumber}).`
  )}`;

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
              {/* Ministerial / Smart Challenge badge */}
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
              {/* Question Format Badge */}
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

            {/* VIP LOCKED BANNER WITH WHATSAPP LINK */}
            {!canAccess && (
              <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-950">
                      سؤال مخصص لمشتركي باقة VIP • الحل النموذجي والشرح مقفول
                    </p>
                    <p className="text-[11px] text-amber-800 font-medium">
                      اضغط للتواصل المباشر للدفع والتفعيل الفوري عبر واتساب: {whatsappNumber}
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل للدفع عبر واتساب 💬</span>
                </a>
              </div>
            )}
          </div>

          {/* Action tools */}
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
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>دفع VIP واتساب</span>
              </a>
            )}
          </div>
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
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

      {/* Expanded Solution & Interactive Explanation */}
      {isOpen && canAccess && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-emerald-50/30 animate-in fade-in duration-200 space-y-3">
          {/* Multiple choice options preview if present */}
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

          {/* If Fill in the Blank, show the missing word highlighted */}
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

          {/* Model Answer Box */}
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

          {/* Teacher Explanation */}
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

