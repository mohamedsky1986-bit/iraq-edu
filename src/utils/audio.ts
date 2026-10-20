/**
 * Web Audio API synthesizer for interactive kids sounds
 * + Enhanced Arabic and English Speech Synthesis with tuned audio processing for primary pupils.
 * + Universal Cloud Audio Fallback for Arabic speech on Windows PCs without Arabic TTS voice packs.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let currentAudio: HTMLAudioElement | null = null;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCorrectSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.08);

    gain.gain.setValueAtTime(0, now + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.36);
  });
}

export function playWrongSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.3);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.36);
}

export function playSyllableBlendSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.26);
}

export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.055);
}

export function playCelebrationFanfare() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const sequence = [
    { freq: 523.25, time: 0.0, dur: 0.15 },
    { freq: 659.25, time: 0.15, dur: 0.15 },
    { freq: 783.99, time: 0.3, dur: 0.15 },
    { freq: 1046.5, time: 0.45, dur: 0.5 },
  ];

  sequence.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    gain.gain.setValueAtTime(0, now + note.time);
    gain.gain.linearRampToValueAtTime(0.3, now + note.time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + note.dur + 0.02);
  });
}

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

// النطق العربي الشامل والمضمون لجميع الحواسيب والهواتف
export function speakArabicText(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  },
  options?: {
    rate?: number;
    pitch?: number;
  }
) {
  if (typeof window === 'undefined') {
    callbacks?.onEnd?.();
    return;
  }

  stopSpeaking();

  const cleanText = text.replace(/[*#_~`[\]()]/g, ' ').trim();
  if (!cleanText) {
    callbacks?.onEnd?.();
    return;
  }

  // 1. فحص وجود صوت عربي في المتصفح
  if ('speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('ar') ||
        v.name.toLowerCase().includes('arabic') ||
        v.name.toLowerCase().includes('عربي')
    );

    if (arabicVoice) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang || 'ar-SA';
      utterance.rate = options?.rate ?? 0.82;
      utterance.pitch = options?.pitch ?? 1.05;

      utterance.onstart = () => callbacks?.onStart?.();
      utterance.onend = () => callbacks?.onEnd?.();
      utterance.onerror = (e) => {
        callbacks?.onError?.(e);
        callbacks?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
      return;
    }
  }

  // 2. تشغيل النطق العربي السحابي عالي الدقة في حال عدم توفر صوت عربي في ويندوز
  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText.slice(0, 160)
    )}&tl=ar&client=tw-ob`;

    const audio = new Audio(ttsUrl);
    currentAudio = audio;
    audio.playbackRate = options?.rate ?? 0.9;

    audio.onplay = () => callbacks?.onStart?.();
    audio.onended = () => {
      currentAudio = null;
      callbacks?.onEnd?.();
    };
    audio.onerror = () => {
      currentAudio = null;
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(cleanText);
        u.lang = 'ar';
        u.onend = () => callbacks?.onEnd?.();
        window.speechSynthesis.speak(u);
      } else {
        callbacks?.onEnd?.();
      }
    };

    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(cleanText);
        u.lang = 'ar';
        window.speechSynthesis.speak(u);
      }
      callbacks?.onEnd?.();
    });
  } catch {
    callbacks?.onEnd?.();
  }
}

export function speakEnglishPhonics(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  },
  options?: {
    rate?: number;
    pitch?: number;
  }
) {
  if (typeof window === 'undefined') {
    callbacks?.onEnd?.();
    return;
  }

  stopSpeaking();

  const cleanText = text.replace(/[*#_~`[\]()]/g, ' ').trim();
  if (!cleanText) {
    callbacks?.onEnd?.();
    return;
  }

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate ?? 0.85;
    utterance.pitch = options?.pitch ?? 1.1;

    const voices = window.speechSynthesis.getVoices();
    const enVoice =
      voices.find(
        (v) =>
          (v.lang.startsWith('en') || v.name.toLowerCase().includes('english')) &&
          (v.name.toLowerCase().includes('natural') ||
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('samantha'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = (e) => {
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return;
  }

  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText.slice(0, 160)
    )}&tl=en&client=tw-ob`;
    const audio = new Audio(ttsUrl);
    currentAudio = audio;
    audio.onplay = () => callbacks?.onStart?.();
    audio.onended = () => {
      currentAudio = null;
      callbacks?.onEnd?.();
    };
    audio.onerror = () => callbacks?.onEnd?.();
    audio.play().catch(() => callbacks?.onEnd?.());
  } catch {
    callbacks?.onEnd?.();
  }
}
