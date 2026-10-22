import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question, Subject, GradeId } from '../types/index';
import { useEdu } from '../context/EduContext';
import {
  calculateQuizEvaluation,
  QuizEvaluationResult,
  getIraqiGradeName,
  gradeFlexibleAnswer,
  FlexibleGradingResult,
} from '../utils/edu-logic';
import {
  playCorrectSound,
  playWrongSound,
  playClickSound,
  playFanfareSound,
  speakArabicText,
  stopSpeaking,
} from '../utils/audio';
import {
  X,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  Star,
  ChevronLeft,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
} from 'lucide-react';

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  questions: Question[];
  gradeId: GradeId;
  onViewCertificate: (certData: {
    studentName: string;
    gradeName: string;
    subjectName: string;
    score: number;
    total: number;
    percentage: number;
    date: string;
    stars: number;
    honorTitle: string;
  }) => void;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  subject,
  questions,
  gradeId,
  onViewCertificate,
}) => {
  const { currentStudent, recordQuizAttempt } = useEdu();

  // Active quiz pool (can be full list or mistaken-only retry list)
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isMistakesOnlyMode, setIsMistakesOnlyMode] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [writtenGradingResults, setWrittenGradingResults] = useState<Record<string, FlexibleGradingResult>>({});
  const [answerMode, setAnswerMode] = useState<'choice' | 'written'>('choice');

  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isSelfAnswerRevealed, setIsSelfAnswerRevealed] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [evaluation, setEvaluation] = useState<QuizEvaluationResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize questions when modal opens or questions prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveQuestions(questions || []);
      setIsMistakesOnlyMode(false);
      resetState();
    }
  }, [isOpen, questions]);

  const resetState = () => {
    setCurrentIndex(0);
    setSelectedOptions({});
    setWrittenAnswers({});
    setWrittenGradingResults({});
    setIsAnswerSubmitted(false);
    setIsSelfAnswerRevealed(false);
    setIsQuizCompleted(false);
    setEvaluation(null);
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  const currentQ = activeQuestions[currentIndex];
  const hasOptions = currentQ && currentQ.options && currentQ.options.length >= 2;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted || isQuizCompleted || !currentQ) return;
    playClickSound();
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleWrittenChange = (val: string) => {
    if (isAnswerSubmitted || isQuizCompleted || !currentQ) return;
    setWrittenAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handleConfirmAnswer = () => {
    if (!currentQ) return;

    if (answerMode === 'written') {
      const studentInput = (writtenAnswers[currentQ.id] || '').trim();
      if (!studentInput) return;

      const result = gradeFlexibleAnswer(
        studentInput,
        currentQ.answerText,
        10,
        currentQ.options,
        currentQ.correctAnswerIndex
      );

      setWrittenGradingResults((prev) => ({
        ...prev,
        [currentQ.id]: result,
      }));

      setIsAnswerSubmitted(true);
      if (result.isCorrect || result.isPartial) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    } else {
      if (selectedOptions[currentQ.id] === undefined) return;
      setIsAnswerSubmitted(true);
      const isCorrect = selectedOptions[currentQ.id] === currentQ.correctAnswerIndex;
      if (isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }
  };

  const handleSelfGrade = (isCorrect: boolean) => {
    if (isAnswerSubmitted || !currentQ) return;
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQ.id]: isCorrect ? 0 : -1,
    }));
    setIsAnswerSubmitted(true);
    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  const handleNextQuestion = () => {
    playClickSound();
    stopSpeaking();
    setIsSpeaking(false);

    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
      setIsSelfAnswerRevealed(false);
      // Auto-set mode depending on question type
      const nextQ = activeQuestions[currentIndex + 1];
      if (nextQ && (!nextQ.options || nextQ.options.length < 2)) {
        setAnswerMode('written');
      }
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const evalResult = calculateQuizEvaluation(
      selectedOptions,
      activeQuestions,
      writtenAnswers,
      10
    );

    setEvaluation(evalResult);
    setIsQuizCompleted(true);

    if (evalResult.passed) {
      playFanfareSound();
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
        });
      } catch {}
    } else {
      playWrongSound();
    }

    if (currentStudent) {
      recordQuizAttempt({
        studentId: currentStudent.id,
        studentName: currentStudent.fullName,
        gradeId,
        subjectId: subject.id,
        subjectName: subject.name,
        score: evalResult.correctCount,
        totalQuestions: evalResult.totalQuestions,
        percentage: evalResult.percentage,
        passed: evalResult.passed,
        stars: evalResult.stars,
      });
    }
  };

  // Retake ONLY mistaken questions for focused practice
  const handlePracticeMistakesOnly = () => {
    if (!evaluation || evaluation.mistakenQuestions.length === 0) return;
    playClickSound();
    setActiveQuestions(evaluation.mistakenQuestions);
    setIsMistakesOnlyMode(true);
    resetState();
  };

  // Restart complete quiz
  const handleRestartFullQuiz = () => {
    playClickSound();
    setActiveQuestions(questions || []);
    setIsMistakesOnlyMode(false);
    resetState();
  };

  const handleReadQuestionAudio = () => {
    if (!currentQ) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    let fullText = currentQ.questionText;
    if (hasOptions && answerMode === 'choice') {
      const optionsText = currentQ.options.map((opt, i) => `الخيار ${i + 1}: ${opt}`).join('. ');
      fullText = `${currentQ.questionText}. الخيارات هي: ${optionsText}`;
    }

    speakArabicText(fullText, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleOpenCertificate = () => {
    if (!evaluation || !currentStudent) return;
    playClickSound();
    onClose();
    onViewCertificate({
      studentName: currentStudent.fullName,
      gradeName: getIraqiGradeName(gradeId),
      subjectName: subject.name,
      score: evaluation.totalScore,
      total: evaluation.maxPossibleScore,
      percentage: evaluation.percentage,
      date: new Date().toISOString().split('T')[0],
      stars: evaluation.stars,
      honorTitle: evaluation.badgeEarned || 'فارس التفوق والاجتهاد 🌟',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
              {subject.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {subject.name}
                </h2>
                {isMistakesOnlyMode ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse flex items-center gap-1">
                    <Target className="w-3 h-3 text-rose-600" />
                    <span>إعادة تدريب الأخطاء فقط</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    امتحان تفاعلي ذكي
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                {getIraqiGradeName(gradeId)} • تصحيح تلقائي مرن لدرجات الأجوبة
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If no questions available in subject */}
        {activeQuestions.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl border border-amber-200">
              📚
            </div>
            <p className="text-base font-black text-slate-800">
              لم تتم إضافة أسئلة أو امتحانات لهذه المادة بعد.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              يمكنك إضافة أسئلة جديدة أو تعاليل أو تعاريف لهذه المادة من لوحة تحكم المشرف لتظهر هنا فوراً.
            </p>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer shadow-md"
            >
              ← العودة لجميع المواد الدراسية
            </button>
          </div>
        ) : !isQuizCompleted ? (
          /* Active Question Screen */
          <div className="mt-4 space-y-5">
            {/* Progress & Header */}
            <div>
              <div className="flex items-center justify-between text-xs font-black text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">
                    {currentIndex + 1}
                  </span>
                  <span>من أصل {activeQuestions.length} سؤال</span>
                  <span className="text-slate-400 font-normal">| (10 درجات للسؤال)</span>
                </span>
                <span className="text-emerald-700 font-extrabold">
                  {Math.round(((currentIndex + 1) / activeQuestions.length) * 100)}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/90 border border-slate-200 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {currentQ.chapter || 'الفصل الأول'}
                  </span>
                  {currentQ.questionType === 'reasoning' && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
                      🧐 تعليل وزاري (علل)
                    </span>
                  )}
                  {currentQ.questionType === 'definition' && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                      📖 تعريف ومصطلح
                    </span>
                  )}
                  {currentQ.questionType === 'fill_in_the_blank' && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      ✏️ أكمل الفراغ
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    درجة السؤال: 10
                  </span>
                </div>

                {/* Voice Button */}
                <button
                  type="button"
                  onClick={handleReadQuestionAudio}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-emerald-500 text-white shadow-md speaking-animation'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                  title="استمع للسؤال"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>إيقاف الصوت</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                      <span>استمع للسؤال 🔊</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentQ.questionText}
              </h3>
            </div>

            {/* Answer Mode Switcher (if options exist) */}
            {hasOptions && !isAnswerSubmitted && (
              <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setAnswerMode('choice');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    answerMode === 'choice'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🔘 اختيار من متعدد
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setAnswerMode('written');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    answerMode === 'written'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✍️ كتابة الجواب باليد</span>
                </button>
              </div>
            )}

            {/* Format 1: Written Text Input with Flexible Fuzzy Grading */}
            {(!hasOptions || answerMode === 'written') ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-bold leading-relaxed">
                  💡 <strong>نظام التصحيح الذكي والمرن:</strong> اكتب التعريف أو الجواب هنا. النظام متسامح مع الأخطاء الإملائية البسيطة (مثل نسيان نقطة أو همزة أو كلمة فرعية) ويمنحك درجات جزئية أو كاملة حسب صحة المفهوم!
                </div>

                <div>
                  <textarea
                    rows={3}
                    disabled={isAnswerSubmitted}
                    value={writtenAnswers[currentQ.id] || ''}
                    onChange={(e) => handleWrittenChange(e.target.value)}
                    placeholder="اكتب هنا جوابك أو تعريفك، مثلاً: القلب هو عضو عضلي يضخ الدم..."
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm font-bold transition-all text-right disabled:bg-slate-100 disabled:text-slate-700"
                    dir="rtl"
                  ></textarea>
                </div>

                {/* Feedback Box after submission */}
                {isAnswerSubmitted && writtenGradingResults[currentQ.id] && (
                  <div
                    className={`p-4 rounded-2xl border-2 text-right space-y-2 animate-in zoom-in-95 duration-200 ${
                      writtenGradingResults[currentQ.id].isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : writtenGradingResults[currentQ.id].isPartial
                        ? 'bg-amber-50 border-amber-400 text-amber-950'
                        : 'bg-rose-50 border-rose-400 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm flex items-center gap-1.5">
                        {writtenGradingResults[currentQ.id].isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : writtenGradingResults[currentQ.id].isPartial ? (
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                        <span>{writtenGradingResults[currentQ.id].feedback}</span>
                      </span>

                      <span className="font-black text-xs px-2.5 py-1 rounded-xl bg-white shadow-2xs border">
                        الدرجة: {writtenGradingResults[currentQ.id].earnedMarks} من 10
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-xs">
                      <span className="font-bold text-slate-700">الجواب النموذجي المعتمد: </span>
                      <span className="font-bold text-slate-900">{currentQ.answerText}</span>
                    </div>

                    {currentQ.explanation && (
                      <div className="text-[11px] text-slate-600">
                        <span className="font-bold">توضيح المعلم: </span>
                        <span>{currentQ.explanation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Format 2: Multiple Choice Options */
              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOptions[currentQ.id] === idx;
                  const isCorrect = idx === currentQ.correctAnswerIndex;

                  let stateClasses = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      stateClasses = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                    } else if (isSelected && !isCorrect) {
                      stateClasses = 'bg-rose-500 text-white border-rose-600';
                    } else {
                      stateClasses = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                    }
                  } else if (isSelected) {
                    stateClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${stateClasses}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold leading-snug">
                          {opt}
                        </span>
                      </div>

                      {isAnswerSubmitted && (
                        <div>
                          {isCorrect && <CheckCircle className="w-5 h-5 text-white" />}
                          {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (confirm('هل تريد إنهاء الاختبار الآن والعودة للمنهاج؟')) {
                    stopSpeaking();
                    playClickSound();
                    onClose();
                  }
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer"
              >
                ← خروج ورجوع للمنهاج
              </button>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={
                    answerMode === 'written' || !hasOptions
                      ? !(writtenAnswers[currentQ.id] || '').trim()
                      : selectedOptions[currentQ.id] === undefined
                  }
                  onClick={handleConfirmAnswer}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer ${
                    (answerMode === 'written' || !hasOptions
                      ? (writtenAnswers[currentQ.id] || '').trim().length > 0
                      : selectedOptions[currentQ.id] !== undefined)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  تأكيد الإجابة والتصحيح ✓
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < activeQuestions.length
                      ? 'السؤال التالي ←'
                      : 'عرض النتيجة النهائية وحصاد الدرجات 🏆'}
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Screen */
          evaluation && (
            <div className="mt-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <Star
                    key={starNum}
                    className={`w-8 h-8 ${
                      starNum <= evaluation.stars
                        ? 'text-amber-400 fill-amber-400 scale-110'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              <div className="inline-block p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200">
                <span className="text-4xl font-black text-emerald-700">
                  {evaluation.percentage}%
                </span>
                <p className="text-xs font-black text-slate-600 mt-1">
                  الدرجة الكلية: {evaluation.totalScore} من أصل {evaluation.maxPossibleScore} درجة
                </p>
                <p className="text-[11px] text-slate-500 font-bold">
                  (أجبت بشكل صحيح على {evaluation.correctCount} من أصل {evaluation.totalQuestions} أسئلة)
                </p>
              </div>

              <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs sm:text-sm">
                {evaluation.appreciation}
              </div>

              {/* RE-TRAINING MISTAKES BUTTON (الزر الذهبي لإعادة الأسئلة الخاطئة) */}
              {evaluation.mistakenQuestions.length > 0 && (
                <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-300 max-w-lg mx-auto shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-rose-800 font-black text-xs sm:text-sm mb-2">
                    <Target className="w-4 h-4 text-rose-600 animate-spin" />
                    <span>خطة التميز: إعادة تدريب الأسئلة الخاطئة</span>
                  </div>
                  <p className="text-xs text-slate-600 font-bold mb-3">
                    أخطأت في {evaluation.mistakenQuestions.length} أسئلة. أعد التدريب عليها وحدها حتى تتقنها 100%!
                  </p>
                  <button
                    type="button"
                    onClick={handlePracticeMistakesOnly}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer transition-all transform hover:-translate-y-0.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>🔁 تدرب الآن على الأسئلة الخاطئة فقط ({evaluation.mistakenQuestions.length} أسئلة)</span>
                  </button>
                </div>
              )}

              {/* Action buttons with Certificate, Full Restart, and Close */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                {evaluation.passed && (
                  <button
                    type="button"
                    onClick={handleOpenCertificate}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>عرض شهادة التفوق 📜</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRestartFullQuiz}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار بالكامل</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  إنهاء والرجوع للمنهاج
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

