import React, { useState } from 'react';
import { GRADE1_SCIENCE_TOPICS } from '../data/initialData';
import { ScienceTopicItem, Question } from '../types/index';
import { useEdu } from '../context/EduContext';
import {
  speakArabicText,
  stopSpeaking,
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playFanfareSound,
} from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  HelpCircle,
  Award,
  RotateCcw,
  BookOpen,
  Compass,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const Grade1Science: React.FC = () => {
  const { questions } = useEdu();
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopicItem>(
    GRADE1_SCIENCE_TOPICS[0]
  );
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);
  const [openAnswerIndex, setOpenAnswerIndex] = useState<number | null>(null);

  // Mini Interactive Quiz inside Science
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Filter 1st grade science questions
  const scienceQuestions = questions.filter(
    (q) => q.gradeId === 'grade-1' && q.subjectId === 'sci-1'
  );

  const handleSpeak = (text: string, id: string) => {
    if (currentlySpeaking === id) {
      stopSpeaking();
      setCurrentlySpeaking(null);
      return;
    }

    setCurrentlySpeaking(id);
    speakArabicText(
      text,
      {
        onStart: () => setCurrentlySpeaking(id),
        onEnd: () => setCurrentlySpeaking(null),
        onError: () => setCurrentlySpeaking(null),
      },
      { rate: 0.8, pitch: 1.05 }
    );
  };

  const handleStartMiniQuiz = () => {
    playClickSound();
    setQuizActive(true);
    setQuizQuestionIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleSelectQuizOption = (optionIdx: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(optionIdx);

    const currentQ = scienceQuestions[quizQuestionIndex];
    if (optionIdx === currentQ.correctAnswerIndex) {
      playCorrectSound();
      setQuizScore((prev) => prev + 1);
    } else {
      playWrongSound();
    }
  };

  const handleNextQuizQuestion = () => {
    playClickSound();
    if (quizQuestionIndex + 1 < scienceQuestions.length && quizQuestionIndex < 3) {
      setQuizQuestionIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
    } else {
      setQuizFinished(true);
      playFanfareSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Science Header Hero */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-lime-600 via-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-md shrink-0">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black">
                العلوم التفاعلي للأول الابتدائي (عالمنا الجميل)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                منهج العراق
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              استكشف الكائنات الحية وأجزاء النبات والحواس الخمسة وبيئة العراق مع الشرح الصوتي
            </p>
          </div>
        </div>

        <button
          onClick={handleStartMiniQuiz}
          className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Award className="w-4 h-4" />
          <span>تحدي واختبار العلوم السريع 🎯</span>
        </button>
      </div>

      {/* Mini Quiz Modal / Banner if active */}
      {quizActive && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h4 className="font-black text-slate-900 text-sm sm:text-base">
                اختبار العلوم التفاعلي للأبطال
              </h4>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setQuizActive(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              إغلاق الاختبار ✕
            </button>
          </div>

          {!quizFinished && scienceQuestions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>
                  السؤال {quizQuestionIndex + 1} من {Math.min(scienceQuestions.length, 4)}
                </span>
                <span>النقاط: {quizScore} 🌟</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-200 text-slate-900 font-bold text-sm sm:text-base flex items-start justify-between gap-3">
                <p>{scienceQuestions[quizQuestionIndex].questionText}</p>
                <button
                  onClick={() =>
                    handleSpeak(
                      scienceQuestions[quizQuestionIndex].questionText,
                      `quiz-q-${quizQuestionIndex}`
                    )
                  }
                  className="p-2 rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors shrink-0"
                  aria-label="نطق السؤال"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scienceQuestions[quizQuestionIndex].options.map((opt, oIdx) => {
                  const isChosen = selectedQuizOption === oIdx;
                  const isCorrect =
                    oIdx === scienceQuestions[quizQuestionIndex].correctAnswerIndex;
                  const showResult = selectedQuizOption !== null;

                  let btnStyle = 'border-slate-200 bg-white hover:border-amber-400 text-slate-800';
                  if (showResult) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      btnStyle = 'border-rose-500 bg-rose-100 text-rose-950 font-bold';
                    } else {
                      btnStyle = 'border-slate-200 bg-white opacity-50';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={selectedQuizOption !== null}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`p-3.5 rounded-2xl border-2 text-right text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResult && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedQuizOption !== null && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>السؤال التالي</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl mx-auto shadow-md">
                🏆
              </div>
              <h4 className="text-lg font-black text-slate-900">
                ما شاء الله! أحسنت يا عبقري العلوم الصغير
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                حصلت على {quizScore} إجابة صحيحة في علوم الصف الأول الابتدائي!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleStartMiniQuiz}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:bg-amber-600 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>
                <button
                  onClick={() => setQuizActive(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs hover:bg-slate-800 cursor-pointer"
                >
                  متابعة الدروس
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Units Horizontal Selector */}
      <div className="space-y-2">
        <p className="text-xs font-black text-slate-700 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>اختر الوحدة الدراسية لاستكشافها:</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {GRADE1_SCIENCE_TOPICS.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  playClickSound();
                  setSelectedTopic(topic);
                  handleSpeak(
                    `${topic.title}. ${topic.summary}`,
                    `topic-intro-${topic.id}`
                  );
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-md scale-102 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <span className="text-3xl block mb-1">{topic.icon}</span>
                <span className="font-extrabold text-xs text-slate-900 line-clamp-1">
                  {topic.title}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-medium line-clamp-1">
                  {topic.unitName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Detail Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-4xl p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              {selectedTopic.icon}
            </span>
            <div>
              <span className="text-xs font-extrabold text-emerald-700">
                {selectedTopic.unitName}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {selectedTopic.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 max-w-xl">
                {selectedTopic.summary}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              handleSpeak(
                `${selectedTopic.title}. ${selectedTopic.voiceNote}. ${selectedTopic.funFact}`,
                `full-${selectedTopic.id}`
              )
            }
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
          >
            {currentlySpeaking === `full-${selectedTopic.id}` ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>إيقاف الشرح الصوتي</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>استمع للشرح الصوتي للدرس 🔊</span>
              </>
            )}
          </button>
        </div>

        {/* Key Concepts Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>المفاهيم العلمية الأساسية:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedTopic.keyConcepts.map((concept, cIdx) => (
              <div
                key={cIdx}
                onClick={() => {
                  playClickSound();
                  handleSpeak(
                    `${concept.title}. ${concept.desc}`,
                    `concept-${selectedTopic.id}-${cIdx}`
                  );
                }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{concept.emoji}</span>
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shadow-2xs">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900">
                    {concept.title}
                  </h5>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">
                    {concept.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-amber-900">
              معلومة علمية مدهشة للأذكياء:
            </span>
            <p className="text-xs text-amber-950 font-medium mt-0.5 leading-relaxed">
              {selectedTopic.funFact}
            </p>
          </div>
        </div>

        {/* Q&A Accordion specific to 1st grade science */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>أسئلة وأجوبة نموذجية لمذاكرة العلوم:</span>
          </h4>

          <div className="space-y-2.5">
            {scienceQuestions.map((q, idx) => {
              const isOpen = openAnswerIndex === idx;
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
                >
                  <div
                    onClick={() => {
                      playClickSound();
                      setOpenAnswerIndex(isOpen ? null : idx);
                    }}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">
                        {q.questionText}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(
                            `السؤال: ${q.questionText}. الجواب الصحيح هو: ${q.answerText}. الشرح: ${q.explanation}`,
                            `qa-${q.id}`
                          );
                        }}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                        aria-label="نطق السؤال والجواب"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-emerald-50/30 text-xs space-y-2">
                      <div className="p-3 rounded-xl bg-white border border-emerald-200 text-emerald-950 font-bold">
                        <span className="text-emerald-700 block mb-1">الجواب النموذجي:</span>
                        {q.answerText}
                      </div>
                      {q.explanation && (
                        <p className="text-slate-600 font-medium px-1">
                          💡 <strong>توضيح للمعلم والولي:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
