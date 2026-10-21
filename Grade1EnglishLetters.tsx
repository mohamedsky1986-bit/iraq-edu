import React, { useState } from 'react';
import { ENGLISH_LETTERS_DATA } from '../data/initialData';
import { EnglishLetterItem } from '../types/index';
import {
  speakEnglishPhonics,
  stopSpeaking,
  playClickSound,
} from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  BookOpen,
} from 'lucide-react';

const ARABIC_LETTER_PRONUNCIATION: Record<string, { arLetterName: string; wordPronounce: string; meaningDetail: string }> = {
  A: { arLetterName: 'إي (A)', wordPronounce: 'آبل', meaningDetail: 'تفاحة حمراء 🍎' },
  B: { arLetterName: 'بي (B)', wordPronounce: 'بول', meaningDetail: 'كرة لعب ⚽' },
  C: { arLetterName: 'سي (C)', wordPronounce: 'كات', meaningDetail: 'قطة أليفة 🐱' },
  D: { arLetterName: 'دي (D)', wordPronounce: 'دَك', meaningDetail: 'بطة تسبح 🦆' },
  E: { arLetterName: 'إي (E)', wordPronounce: 'إيغ', meaningDetail: 'بيضة طعام 🥚' },
  F: { arLetterName: 'إف (F)', wordPronounce: 'فِش', meaningDetail: 'سمكة في الماء 🐟' },
  G: { arLetterName: 'جي (G)', wordPronounce: 'غيرل', meaningDetail: 'بنت / فتاة 👧' },
  H: { arLetterName: 'إتش (H)', wordPronounce: 'هات', meaningDetail: 'قبعة رأس 👒' },
  I: { arLetterName: 'آي (I)', wordPronounce: 'آيس كريم', meaningDetail: 'مثلجات لذيذة 🍦' },
  J: { arLetterName: 'جاي (J)', wordPronounce: 'جَم', meaningDetail: 'مربى فواكه 🍯' },
  K: { arLetterName: 'كاي (K)', wordPronounce: 'كايت', meaningDetail: 'طائرة ورقية 🪁' },
  L: { arLetterName: 'إل (L)', wordPronounce: 'ليون', meaningDetail: 'أسد قوي 🦁' },
  M: { arLetterName: 'إم (M)', wordPronounce: 'مونكي', meaningDetail: 'قرد شقي 🐵' },
  N: { arLetterName: 'إن (N)', wordPronounce: 'نِست', meaningDetail: 'عش العصافير 🪹' },
  O: { arLetterName: 'أو (O)', wordPronounce: 'أورنج', meaningDetail: 'برتقالة طازجة 🍊' },
  P: { arLetterName: 'پي (P)', wordPronounce: 'بينسل', meaningDetail: 'قلم رصاص ✏️' },
  Q: { arLetterName: 'كيو (Q)', wordPronounce: 'كوين', meaningDetail: 'ملكة تاج 👑' },
  R: { arLetterName: 'آر (R)', wordPronounce: 'رابت', meaningDetail: 'أرنب يقفز 🐰' },
  S: { arLetterName: 'إس (S)', wordPronounce: 'سن', meaningDetail: 'شمس مشرقة ☀️' },
  T: { arLetterName: 'تي (T)', wordPronounce: 'تايغر', meaningDetail: 'نمر مخطط 🐯' },
  U: { arLetterName: 'يو (U)', wordPronounce: 'أمبريلا', meaningDetail: 'مظلة المطر ☂️' },
  V: { arLetterName: 'ڤي (V)', wordPronounce: 'فان', meaningDetail: 'سيارة حافلة 🚐' },
  W: { arLetterName: 'دبليو (W)', wordPronounce: 'واتش', meaningDetail: 'ساعة يد ⌚' },
  X: { arLetterName: 'إكس (X)', wordPronounce: 'إكس راي', meaningDetail: 'صورة أشعة 🩻' },
  Y: { arLetterName: 'واي (Y)', wordPronounce: 'يو يو', meaningDetail: 'لعبة يويو 🪀' },
  Z: { arLetterName: 'زِد (Z)', wordPronounce: 'زيبرا', meaningDetail: 'حمار وحشي 🦓' },
};

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
    const detail = ARABIC_LETTER_PRONUNCIATION[item.letterUpper] || {
      arLetterName: item.letterUpper,
      wordPronounce: item.sampleWord,
      meaningDetail: item.arabicTranslation,
    };

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // 1. النطق بالعربي باسم الحرف
      const u1 = new SpeechSynthesisUtterance(`حرف ال ${detail.arLetterName.split(' ')[0]}`);
      u1.lang = 'ar-SA';
      u1.rate = 0.85;

      // 2. النطق بالإنجليزي ببطء ووضوح تام للطفل
      const u2 = new SpeechSynthesisUtterance(`${item.letterUpper} ... ${item.sampleWord}`);
      u2.lang = 'en-US';
      u2.rate = 0.75; // هادئ ومريح ومناسب للأطفال

      // 3. النطق بالعربي لترجمة ومعنى الكلمة
      const u3 = new SpeechSynthesisUtterance(`معناها ${item.arabicTranslation}`);
      u3.lang = 'ar-SA';
      u3.rate = 0.85;

      u3.onend = () => setIsSpeaking(null);
      u3.onerror = () => setIsSpeaking(null);

      window.speechSynthesis.speak(u1);
      window.speechSynthesis.speak(u2);
      window.speechSynthesis.speak(u3);
    } else {
      speakEnglishPhonics(`${item.letterUpper}. ${item.sampleWord}`, {
        onStart: () => setIsSpeaking(id),
        onEnd: () => setIsSpeaking(null),
        onError: () => setIsSpeaking(null),
      });
    }
  };

  const currentDetail = ARABIC_LETTER_PRONUNCIATION[selectedLetter.letterUpper] || {
    arLetterName: selectedLetter.letterUpper,
    wordPronounce: selectedLetter.sampleWord,
    meaningDetail: selectedLetter.arabicTranslation,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* English Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-md">
            🔠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black">
                نطق الحروف والمفردات المبسطة (English for Iraq)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                صوت عربي + إنجليزي 🔊
              </span>
            </div>
            <p className="text-xs text-sky-100 font-medium mt-0.5">
              استمع لاسم الحرف والكلمة بالإنجليزي وترجمتها ومعناها فوراً بالعربي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-2xl border border-white/20 self-start sm:self-auto text-xs font-bold text-white">
          <Globe className="w-4 h-4 text-sky-200" />
          <span>منهاج التأسيس العراقي</span>
        </div>
      </div>

      {/* Letters Carousel Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5">
        {ENGLISH_LETTERS_DATA.map((item) => {
          const isSelected = selectedLetter.letterUpper === item.letterUpper;
          const letterInfo = ARABIC_LETTER_PRONUNCIATION[item.letterUpper] || {
            arLetterName: item.letterUpper,
            wordPronounce: item.sampleWord,
            meaningDetail: item.arabicTranslation,
          };

          return (
            <button
              key={item.letterUpper}
              onClick={() => {
                setSelectedLetter(item);
                handleSpeakPhonics(item);
              }}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between cursor-pointer text-center ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/90 shadow-md scale-102 ring-2 ring-indigo-300'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-indigo-700 font-mono">
                  {item.letterUpper}
                </span>
                <span className="text-lg font-bold text-slate-500 font-mono">
                  {item.letterLower}
                </span>
              </div>

              <span className="text-2xl my-1.5 block">{item.emoji}</span>

              <div className="w-full">
                <p className="font-extrabold text-xs text-slate-900">{item.sampleWord}</p>
                <p className="text-[10px] text-indigo-700 font-bold">({letterInfo.wordPronounce})</p>
                <p className="text-[10px] text-slate-500 font-medium">{item.arabicTranslation}</p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100 w-full flex items-center justify-center gap-1 text-[9px] font-bold text-indigo-600">
                <Volume2 className="w-3 h-3" />
                <span>استمع</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Big Interactive Card For Selected Letter */}
      {selectedLetter && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-indigo-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-mono font-black text-4xl shadow-md">
                {selectedLetter.letterUpper}{selectedLetter.letterLower}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    Letter {selectedLetter.letterUpper}
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    حرف {currentDetail.arLetterName}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  الكلمة: <strong className="text-indigo-700 font-mono text-base">{selectedLetter.sampleWord}</strong> ({currentDetail.wordPronounce}) = {currentDetail.meaningDetail}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSpeakPhonics(selectedLetter)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              {isSpeaking === `eng-${selectedLetter.letterUpper}` ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>إيقاف النطق</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>🔊 استمع لنطق الحرف والكلمة وترجمتها</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 text-right">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>كيف ينطق الحرف والكلمة؟</span>
              </span>
              <p className="text-sm font-black text-slate-900">
                الحرف: <span className="font-mono text-indigo-700">{selectedLetter.letterUpper}</span> ({currentDetail.arLetterName}) • الكلمة: <span className="font-mono text-indigo-700">{selectedLetter.sampleWord}</span> ({currentDetail.wordPronounce})
              </p>
              <p className="text-xs text-slate-600">
                المعنى باللغة العربية: <strong className="text-emerald-700">{currentDetail.meaningDetail}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5 text-right">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>نصيحة تعليمية للأبطال:</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                اضغط على الزر واستمع للمعلم وهو ينطق اسم الحرف ثم الكلمة بالإنجليزي، ثم يترجم معناها فوراً بالعربي لتتعلم الكلمات بسهولة ومتعة!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grade1EnglishLetters;
