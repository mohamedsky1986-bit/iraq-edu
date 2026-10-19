import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question, Subject, GradeId } from '../types/index';
import { useEdu } from '../context/EduContext';
import {
  calculateQuizEvaluation,
  QuizEvaluationResult,
  getIraqiGradeName,
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [evaluation, setEvaluation] = useState<QuizEvaluationResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter available questions (ensure at least questions with options)
  const quizQuestions = questions.filter(
    (q) => q.options && q.options.length >= 2
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedOptions({});
      setIsAnswerSubmitted(false);
      setIsQuizCompleted(false);
      setEvaluation(null);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted || isQuizCompleted) return;
    playClickSound();
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleConfirmAnswer = () => {
    if (selectedOptions[currentQ.id] === undefined) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOptions[currentQ.id] === currentQ.correctAnswerIndex;

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

    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const evalResult = calculateQuizEvaluation(selectedOptions, quizQuestions);
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
      } catch {
        // Safe fallback
      }
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

  const handleReadQuestionAudio = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const optionsText = currentQ.options
      .map((opt, i) => `الخيار ${i + 1}: ${opt}`)
      .join('. ');

    const fullText = `${currentQ.questionText}. ${optionsText}`;

    speakArabicText(fullText, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleRestart = () => {
    playClickSound();
    setCurrentIndex(0);
    setSelectedOptions({});
    setIsAnswerSubmitted(false);
    setIsQuizCompleted(false);
    setEvaluation(null);
  };

  const handleOpenCertificate = () => {
    if (!evaluation) return;
    playClickSound();
    onViewCertificate({
      studentName: currentStudent?.fullName || 'بطل العراق المتفوق',
      gradeName: getIraqiGradeName(gradeId),
      subjectName: subject.name,
      score: evaluation.correctCount,
      total: evaluation.totalQuestions,
      percentage: evaluation.percentage,
      date: new Date().toLocaleDateString('ar-IQ'),
      stars: evaluation.stars,
      honorTitle: evaluation.percentage === 100 ? 'وسام العبقرية والتفوق الأول' : 'شهادة اجتهاد ونجاح متميز',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[95vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                اختبار تفاعلي: {subject.name}
              </h2>
              <p className="text-xs text-slate-500">
                {getIraqiGradeName(gradeId)} • أسئلة تقييم تفاعلية مع نظام الأصوات
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="إغلاق الاختبار"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If no questions available */}
        {quizQuestions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-base font-bold text-slate-700 mb-2">
              لا توجد أسئلة متعددة الخيارات مضافة لهذه المادة بعد.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              يمكنك إضافة أسئلة جديدة من خلال لوحة تحكم المشرف (Admin).
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-bold"
            >
              العودة للمنهاج
            </button>
          </div>
        ) : !isQuizCompleted ? (
          /* Active Quiz Question Screen */
          <div className="mt-5 space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                <span>
                  السؤال {currentIndex + 1} من {quizQuestions.length}
                </span>
                <span className="text-emerald-700">
                  {Math.round(((currentIndex + 1) / quizQuestions.length) * 100)}%
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                  {currentQ.chapter || 'فصل المنهاج'}
                </span>

                {/* Kids Voice Pronunciation Button */}
                <button
                  type="button"
                  onClick={handleReadQuestionAudio}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-emerald-500 text-white shadow-md speaking-animation'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                  title="استمع للسؤال بصوت واضح للأطفال"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>إيقاف النطق</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                      <span>اقرأ لي السؤال 🔊</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {currentQ.questionText}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
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
                    className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between font-bold text-sm sm:text-base cursor-pointer ${stateClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-black ${
                          isAnswerSubmitted && isCorrect
                            ? 'bg-white text-emerald-700'
                            : isAnswerSubmitted && isSelected && !isCorrect
                            ? 'bg-white text-rose-700'
                            : isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-white shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback / Next Button */}
            <div className="pt-2">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOptions[currentQ.id] === undefined}
                  onClick={handleConfirmAnswer}
                  className={`w-full py-4 rounded-2xl text-base font-extrabold shadow-md transition-all cursor-pointer ${
                    selectedOptions[currentQ.id] !== undefined
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  تأكيد الإجابة ✓
                </button>
              ) : (
                <div className="space-y-3">
                  {/* Feedback explanation box */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      selectedOptions[currentQ.id] === currentQ.correctAnswerIndex
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="font-extrabold text-sm mb-1 flex items-center gap-2">
                      {selectedOptions[currentQ.id] === currentQ.correctAnswerIndex ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>إجابة صحيحة يا بطل! أحسنت 🌟</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-amber-600" />
                          <span>إجابة غير دقيقة. الجواب الصحيح هو: {currentQ.options[currentQ.correctAnswerIndex]}</span>
                        </>
                      )}
                    </div>
                    {currentQ.explanation && (
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        <span className="font-bold">الشرح: </span>
                        {currentQ.explanation}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-base font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 cursor-pointer"
                  >
                    <span>
                      {currentIndex + 1 < quizQuestions.length
                        ? 'السؤال التالي'
                        : 'عرض النتيجة النهائية والتقييم 🏆'}
                    </span>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results and Evaluation Screen */
          evaluation && (
            <div className="mt-5 text-center space-y-6 animate-in zoom-in-95 duration-200">
              {/* Stars animation */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <Star
                    key={starNum}
                    className={`w-9 h-9 transition-all ${
                      starNum <= evaluation.stars
                        ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-md'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Score circle */}
              <div className="inline-block p-6 rounded-3xl bg-gradient-to-tr from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-200">
                <span className="text-5xl font-black text-emerald-700">
                  {evaluation.percentage}%
                </span>
                <p className="text-sm font-bold text-slate-600 mt-1">
                  أجبت على {evaluation.correctCount} من أصل {evaluation.totalQuestions} أسئلة
                </p>
              </div>

              {/* Appreciation phrase */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-base leading-relaxed">
                {evaluation.appreciation}
              </div>

              {/* Badge awarded */}
              {evaluation.badgeEarned && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>تم منحك: {evaluation.badgeEarned}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                {evaluation.passed && (
                  <button
                    type="button"
                    onClick={handleOpenCertificate}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    <span>عرض وطباعة شهادة التفوق 📜</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm cursor-pointer"
                >
                  العودة للمنهاج
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
