import React, { useState } from 'react';
import { ENGLISH_LETTERS_DATA } from '../data/initialData';
import { EnglishLetterItem } from '../types/index';
import {
  speakEnglishPhonics,
  stopSpeaking,
  playClickSound,
  playCorrectSound,
  playWrongSound,
} from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Globe,
  Star,
} from 'lucide-react';

export const Grade1EnglishLetters: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<EnglishLetterItem>(
    ENGLISH_LETTERS_DATA[0]
  );
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const handleSpeakPhonics = (item: EnglishLetterItem) => {
    playClickSound();
    const id = `eng-${item.letterUpper}`;
    if (isSpeaking === id) {
      stopSpeaking();
      setIsSpeaking(null);
      return;
    }

    setIsSpeaking(id);
    const speechText = `Letter ${item.letterUpper}. Small ${item.letterLower}. Sound is ${item.phonicSound}. ${item.sampleWord}. ${item.exampleSentence}`;

    speakEnglishPhonics(speechText, {
      onStart: () => setIsSpeaking(id),
      onEnd: () => setIsSpeaking(null),
      onError: () => setIsSpeaking(null),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* English Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-md">
            🔤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black">
                الحروف الإنجليزية التفاعلية للأول الابتدائي (English for Iraq)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                Letters & Phonics
              </span>
            </div>
            <p className="text-xs text-sky-100 font-medium mt-0.5">
              استمع للنطق الإنجليزي السليم للحروف مع الصوت والكلمات الممتعة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-2xl border border-white/20 self-start sm:self-auto text-xs font-bold text-white">
          <Globe className="w-4 h-4 text-sky-200" />
          <span>منهج وزارة التربية الرسمي</span>
        </div>
      </div>

      {/* Letters Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ENGLISH_LETTERS_DATA.map((item) => {
          const isSelected = selectedLetter.letterUpper === item.letterUpper;
          return (
            <button
              key={item.letterUpper}
              onClick={() => {
                setSelectedLetter(item);
                handleSpeakPhonics(item);
              }}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-between cursor-pointer text-center ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/80 shadow-md scale-102 ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-3xl font-black text-indigo-700 font-mono">
                  {item.letterUpper}
                </span>
                <span className="text-2xl font-bold text-slate-500 font-mono">
                  {item.letterLower}
                </span>
              </div>

              <span className="text-3xl my-2 block">{item.emoji}</span>

              <div>
                <p className="font-extrabold text-xs text-slate-800">{item.sampleWord}</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {item.arabicTranslation}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 w-full flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-600">
                <Volume2 className="w-3.5 h-3.5" />
                <span>نطق الصوت</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Selected Letter Big Interactive Card */}
      {selectedLetter && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white flex items-center justify-center font-mono font-black text-4xl shadow-md">
                {selectedLetter.letterUpper}{selectedLetter.letterLower}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-black text-slate-900 font-mono">
                    Letter {selectedLetter.letterUpper}
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    صوت الحرف: {selectedLetter.phonicSound}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Example: <strong>{selectedLetter.sampleWord}</strong> ({selectedLetter.arabicTranslation})
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSpeakPhonics(selectedLetter)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              {isSpeaking === `eng-${selectedLetter.letterUpper}` ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>إيقاف النطق</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>استمع لنطق الحرف والكلمة بالإنجليزي 🔊</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
              <span className="text-xs font-bold text-indigo-800">جملة تعليمية مبسطة:</span>
              <p className="text-base font-bold text-slate-800 font-mono">
                "{selectedLetter.exampleSentence}"
              </p>
              <p className="text-xs text-slate-600">
                كرر نطق الجملة خلف المتحدث لتتقن لكنة اللغة الإنجليزية!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-800">الصوت الصوتي (Phonics):</span>
              <p className="text-base font-bold text-slate-900">
                الصوت: <span className="font-mono text-indigo-700">{selectedLetter.phonicSound}</span>
              </p>
              <p className="text-xs text-slate-600">
                في منهج الصف الأول العراقي، نركز على صوت الحرف وليس اسمه فقط لتسهيل القراءة.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
