import React, { useState } from 'react';
import { ARABIC_LETTERS_DATA } from '../data/initialData';
import { ArabicLetterItem } from '../types/index';
import {
  speakArabicText,
  stopSpeaking,
  playClickSound,
  playSyllableBlendSound,
} from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  BookOpen,
  RotateCcw,
  Gauge,
  CheckCircle,
} from 'lucide-react';

export const Grade1ArabicReading: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetterItem>(
    ARABIC_LETTERS_DATA[0]
  );
  const [activeSpeechSpeed, setActiveSpeechSpeed] = useState<'normal' | 'slow'>('slow');
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);

  const getSpeechRate = () => (activeSpeechSpeed === 'slow' ? 0.72 : 0.88);

  const handleSpeak = (textToSpeak: string, id: string) => {
    if (currentlySpeaking === id) {
      stopSpeaking();
      setCurrentlySpeaking(null);
      return;
    }

    setCurrentlySpeaking(id);
    speakArabicText(
      textToSpeak,
      {
        onStart: () => setCurrentlySpeaking(id),
        onEnd: () => setCurrentlySpeaking(null),
        onError: () => setCurrentlySpeaking(null),
      },
      { rate: getSpeechRate(), pitch: 1.08 }
    );
  };

  const handleLetterSelect = (item: ArabicLetterItem) => {
    playClickSound();
    setSelectedLetter(item);
    // Automatically pronounce letter and its sound for the child
    handleSpeak(
      `${item.name}. وصوته هو: ${item.letter}ْ. مثل كلمة ${item.sampleWords[0]?.word || ''}`,
      `letter-${item.id}`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Audio Processing & Tuning Control Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              وحدة النطق الصوتي ومعالجة مخارج الحروف للأطفال
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              نطق عربي واضح ومخصص لتلاميذ الصف الأول الابتدائي لتعلم القراءة السليمة
            </p>
          </div>
        </div>

        {/* Speed Adjustment */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200">
          <Gauge className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-slate-600">سرعة نطق الصوت:</span>
          <button
            onClick={() => {
              playClickSound();
              setActiveSpeechSpeed('slow');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSpeechSpeed === 'slow'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            هادئ وبطيء للطفل
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveSpeechSpeed('normal');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSpeechSpeed === 'normal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            عادي
          </button>
        </div>
      </div>

      {/* Letters Grid Carousel */}
      <div className="space-y-2">
        <p className="text-xs font-black text-slate-700 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>اختر الحرف للاستماع لاسمه وصوته ومقاطعه:</span>
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {ARABIC_LETTERS_DATA.map((item) => {
            const isSelected = selectedLetter.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLetterSelect(item)}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800 hover:shadow-xs'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black">{item.letter}</span>
                <span className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Letter Interactive Learning Center */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Main Letter Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-5xl font-black shadow-md shadow-emerald-500/20">
              {selectedLetter.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {selectedLetter.name}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  منهج قراءتي 📖
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {selectedLetter.soundDescription}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              handleSpeak(
                `نحن نتعلم ${selectedLetter.name}. صوت الحرف هو: ${selectedLetter.letter}ْ. اسمع صوته الجميل: ${selectedLetter.letter}ْ`,
                `full-${selectedLetter.id}`
              )
            }
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            {currentlySpeaking === `full-${selectedLetter.id}` ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>إيقاف النطق</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>نطق الحرف والصوت للأطفال 🔊</span>
              </>
            )}
          </button>
        </div>

        {/* 1. Short Vowels (الحركات القصيرة: فتحة، ضمة، كسرة) */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>1. أصوات الحرف مع الحركات القصيرة (الفتحة والضمة والكسرة):</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Fatha */}
            <div
              onClick={() => {
                playClickSound();
                handleSpeak(
                  `صوت الفتحة مع الحرف هو: ${selectedLetter.fatha}`,
                  `fatha-${selectedLetter.id}`
                );
              }}
              className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-amber-800">الفتحة َ (صوت آ قصير)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{selectedLetter.fatha}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>

            {/* Damma */}
            <div
              onClick={() => {
                playClickSound();
                handleSpeak(
                  `صوت الضمة مع الحرف هو: ${selectedLetter.damma}`,
                  `damma-${selectedLetter.id}`
                );
              }}
              className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 hover:border-sky-300 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-sky-800">الضمة ُ (صوت أو قصير)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{selectedLetter.damma}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>

            {/* Kasra */}
            <div
              onClick={() => {
                playClickSound();
                handleSpeak(
                  `صوت الكسرة مع الحرف هو: ${selectedLetter.kasra}`,
                  `kasra-${selectedLetter.id}`
                );
              }}
              className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-rose-800">الكسرة ِ (صوت إي قصير)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{selectedLetter.kasra}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Long Vowels / Syllables (المقاطع الطويلة مع حروف المد ا، و، ي) */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-emerald-600" />
            <span>2. المقاطع الصوتية الطويلة مع حروف المد (ا، و، ي):</span>
          </h4>

          <div className="grid grid-cols-3 gap-3">
            {selectedLetter.syllables.map((syl, sIdx) => (
              <div
                key={sIdx}
                onClick={() => {
                  playSyllableBlendSound();
                  handleSpeak(
                    `المقطع الصوتي الطويل: ${syl}. نمد الصوت: ${syl}`,
                    `syl-${selectedLetter.id}-${sIdx}`
                  );
                }}
                className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer text-center group"
              >
                <span className="text-xs font-bold text-emerald-800">مقطع مد طويل</span>
                <p className="text-3xl font-black text-emerald-950 mt-1 group-hover:scale-110 transition-transform">
                  {syl}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استمع للمقطع</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Sample Words from the Iraqi Curriculum (كلمات المنهج العراقي دار دور دادا) */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-600" />
            <span>3. كلمات ودروس المنهج العراقي المقررة:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedLetter.sampleWords.map((wordItem, wIdx) => (
              <div
                key={wIdx}
                onClick={() => {
                  playClickSound();
                  handleSpeak(
                    `كلمة: ${wordItem.word}. معناها: ${wordItem.meaning}. تهجئة الكلمة: ${wordItem.word}`,
                    `word-${selectedLetter.id}-${wIdx}`
                  );
                }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{wordItem.emoji}</span>
                  <div>
                    <h5 className="text-xl font-black text-slate-900">{wordItem.word}</h5>
                    <p className="text-[11px] text-slate-500 font-medium">{wordItem.meaning}</p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
