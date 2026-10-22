import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Subject, Question } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName } from '../utils/edu-logic';
import { QuestionCard } from './QuestionCard';
import { Grade1ArabicReading } from './Grade1ArabicReading';
import { Grade1EnglishLetters } from './Grade1EnglishLetters';
import {
  playClickSound,
  speakArabicText,
  speakEnglishPhonics,
  stopSpeaking,
} from '../utils/audio';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  PlayCircle,
  Award,
  Trophy,
  FileText,
  Clock,
  ArrowRight,
  Folder,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Music,
  Bookmark,
  Home,
  LogOut,
  Video,
  ExternalLink,
  Download,
  Play
} from 'lucide-react';



function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const matchShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (matchShort) {
    return `https://www.youtube-nocookie.com/embed/${matchShort[1]}?modestbranding=1&rel=0&iv_load_policy=3&controls=1&showinfo=0&playsinline=1`;
  }
  const matchLong = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (matchLong) {
    return `https://www.youtube-nocookie.com/embed/${matchLong[1]}?modestbranding=1&rel=0&iv_load_policy=3&controls=1&showinfo=0&playsinline=1`;
  }
  return url;
}

const DEFAULT_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1Gdmm8qLT26-JA51h5FFpnBxagKJ_jjLL?usp=drive_link';

interface SubjectBookItem {
  bookTitle: string;
  edition: string;
  driveUrl: string;
}

const SUBJECT_BOOKS_MAP: Record<string, SubjectBookItem> = {
  // Grade 1
  'ar-1': { bookTitle: 'كتاب قراءتي للصف الأول الابتدائي (المنهج الرسمي المطور)', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'math-1': { bookTitle: 'كتاب الرياضيات للصف الأول الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'sci-1': { bookTitle: 'كتاب العلوم للصف الأول الابتدائي (الكائنات الحية والبيئة)', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'isl-1': { bookTitle: 'كتاب التربية الإسلامية والقرآن الكريم للأول الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'eng-1': { bookTitle: 'English for Iraq - Pupil Book 1', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },

  // Grade 2
  'ar-2': { bookTitle: 'كتاب قراءتي للصف الثاني الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'math-2': { bookTitle: 'كتاب الرياضيات للصف الثاني الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'sci-2': { bookTitle: 'كتاب العلوم للصف الثاني الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'isl-2': { bookTitle: 'كتاب التربية الإسلامية للصف الثاني الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'eng-2': { bookTitle: 'English for Iraq - Pupil Book 2', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },

  // Grade 3
  'ar-3': { bookTitle: 'كتاب قراءتي للصف الثالث الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'math-3': { bookTitle: 'كتاب الرياضيات للصف الثالث الابتدائي (جدول الضرب والكسور)', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'sci-3': { bookTitle: 'كتاب العلوم للصف الثالث الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'isl-3': { bookTitle: 'كتاب التربية الإسلامية للصف الثالث الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'eng-3': { bookTitle: 'English for Iraq - Pupil Book 3', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },

  // Grade 4
  'ar-4': { bookTitle: 'كتاب قواعد اللغة العربية للصف الرابع الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'math-4': { bookTitle: 'كتاب الرياضيات للصف الرابع الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'sci-4': { bookTitle: 'كتاب العلوم للصف الرابع الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'soc-4': { bookTitle: 'كتاب الاجتماعيات للصف الرابع الابتدائي (تاريخ وحضارة بلاد الرافدين)', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'isl-4': { bookTitle: 'كتاب التربية الإسلامية للصف الرابع الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'eng-4': { bookTitle: 'English for Iraq - Pupil Book 4', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },

  // Grade 5
  'ar-5': { bookTitle: 'كتاب قواعد اللغة العربية للصف الخامس الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'math-5': { bookTitle: 'كتاب الرياضيات للصف الخامس الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'sci-5': { bookTitle: 'كتاب العلوم للصف الخامس الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'soc-5': { bookTitle: 'كتاب الاجتماعيات للصف الخامس الابتدائي (جغرافية العراق وموارده)', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'isl-5': { bookTitle: 'كتاب التربية الإسلامية للصف الخامس الابتدائي', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },
  'eng-5': { bookTitle: 'English for Iraq - Pupil Book 5', edition: 'طبعة وزارة التربية العراقية المعتمدة', driveUrl: DEFAULT_DRIVE_FOLDER },

  // Grade 6
  'ar-6': { bookTitle: 'كتاب قواعد اللغة العربية الوزاري (السادس الابتدائي)', edition: 'المنهج الوزاري الرسمي المعتمد', driveUrl: DEFAULT_DRIVE_FOLDER },
  'math-6': { bookTitle: 'كتاب الرياضيات الوزاري المطور للصف السادس الابتدائي', edition: 'المنهج الوزاري الرسمي المعتمد', driveUrl: DEFAULT_DRIVE_FOLDER },
  'sci-6': { bookTitle: 'كتاب العلوم الوزاري للصف السادس الابتدائي', edition: 'المنهج الوزاري الرسمي المعتمد', driveUrl: DEFAULT_DRIVE_FOLDER },
  'soc-6': { bookTitle: 'كتاب الاجتماعيات الوزاري (محافظات العراق الثماني عشرة)', edition: 'المنهج الوزاري الرسمي المعتمد', driveUrl: DEFAULT_DRIVE_FOLDER },
  'isl-6': { bookTitle: 'كتاب التربية الإسلامية الوزاري للصف السادس الابتدائي', edition: 'المنهج الوزاري الرسمي المعتمد', driveUrl: DEFAULT_DRIVE_FOLDER },
  'eng-6': { bookTitle: 'English for Iraq - Pupil Book 6 (Ministerial)', edition: 'المنهج الوزاري الرسمي المعتمد', driveUrl: DEFAULT_DRIVE_FOLDER },
};

export const ALL_IRAQI_OFFICIAL_SUBJECTS: Subject[] = [
  // ================= الصف الأول الابتدائي =================
  {
    id: 'ar-1',
    gradeId: 'grade-1',
    name: 'قراءتي (الحروف والأصوات والمقاطع)',
    code: 'ARABIC_1',
    icon: '🔤',
    themeColor: 'emerald',
    description: 'منهج قراءتي التفاعلي: الحركات، الحروف الهجائية، المقاطع الصوتية ونطق دار ودور وبابا وماما',
    lessonsCount: 20,
    questionsCount: 25,
    isSpecialInteractive: true,
  },
  {
    id: 'eng-1',
    gradeId: 'grade-1',
    name: 'اللغة الإنجليزية (English Letters)',
    code: 'ENG_1',
    icon: '🔠',
    themeColor: 'sky',
    description: 'English for Iraq: Letters A to Z, Phonics, Sounds, Numbers and Words with interactive audio',
    lessonsCount: 16,
    questionsCount: 20,
    isSpecialInteractive: true,
  },
  {
    id: 'sci-1',
    gradeId: 'grade-1',
    name: 'العلوم (الكائنات الحية والبيئة)',
    code: 'SCIENCE_1',
    icon: '🌿',
    themeColor: 'lime',
    description: 'العلوم للصف الأول: الكائنات الحية، أجزاء النبات، الحواس الخمسة، والبيئة العراقية',
    lessonsCount: 20,
    questionsCount: 25,
    isSpecialInteractive: true,
  },
  {
    id: 'math-1',
    gradeId: 'grade-1',
    name: 'الرياضيات',
    code: 'MATH_1',
    icon: '🔢',
    themeColor: 'teal',
    description: 'الأعداد من 1 إلى 20، الجمع والطرح البسيط والمقارنة بين الأشياء',
    lessonsCount: 20,
    questionsCount: 25,
  },
  {
    id: 'isl-1',
    gradeId: 'grade-1',
    name: 'التربية الإسلامية',
    code: 'ISLAMIC_1',
    icon: '🕌',
    themeColor: 'green',
    description: 'السور القرآنية القصيرة، أركان الإيمان، والآداب الإسلامية الحميدة',
    lessonsCount: 16,
    questionsCount: 20,
  },

  // ================= الصف الثاني الابتدائي =================
  {
    id: 'ar-2',
    gradeId: 'grade-2',
    name: 'قراءتي (اللغة العربية)',
    code: 'ARABIC_2',
    icon: '📖',
    themeColor: 'sky',
    description: 'قصص قصيرة مشوقة، التعبير الشفهي، والتدريب على الإملاء السليم',
    lessonsCount: 16,
    questionsCount: 14,
  },
  {
    id: 'math-2',
    gradeId: 'grade-2',
    name: 'الرياضيات',
    code: 'MATH_2',
    icon: '➕',
    themeColor: 'indigo',
    description: 'الأعداد حتى 999، القيمة المكانية، والجمع والطرح مع إعادة التسمية',
    lessonsCount: 14,
    questionsCount: 12,
  },
  {
    id: 'sci-2',
    gradeId: 'grade-2',
    name: 'العلوم',
    code: 'SCIENCE_2',
    icon: '🔬',
    themeColor: 'emerald',
    description: 'أعضاء جسم الإنسان، صحة الغذاء، وتنوع البيئات الطبيعية',
    lessonsCount: 12,
    questionsCount: 10,
  },
  {
    id: 'isl-2',
    gradeId: 'grade-2',
    name: 'التربية الإسلامية',
    code: 'ISLAMIC_2',
    icon: '🕌',
    themeColor: 'amber',
    description: 'سور الفيل وقريش والماعون، سيرة النبي محمد (ص) في طفولته',
    lessonsCount: 10,
    questionsCount: 10,
  },
  {
    id: 'eng-2',
    gradeId: 'grade-2',
    name: 'اللغة الإنجليزية (English for Iraq)',
    code: 'ENG_2',
    icon: '🇬🇧',
    themeColor: 'blue',
    description: 'My School, My Body, Colors and Animals with interactive vocabulary',
    lessonsCount: 12,
    questionsCount: 10,
  },

  // ================= الصف الثالث الابتدائي =================
  {
    id: 'ar-3',
    gradeId: 'grade-3',
    name: 'قراءتي (اللغة العربية)',
    code: 'ARABIC_3',
    icon: '📚',
    themeColor: 'violet',
    description: 'نصوص أدبية مختارة، التدريبات اللغوية، وعلامات الترقيم',
    lessonsCount: 18,
    questionsCount: 15,
  },
  {
    id: 'math-3',
    gradeId: 'grade-3',
    name: 'الرياضيات',
    code: 'MATH_3',
    icon: '✖️',
    themeColor: 'cyan',
    description: 'الأعداد حتى 9999، جدول الضرب كاملاً، ومبادئ القسمة والهندسة',
    lessonsCount: 16,
    questionsCount: 14,
  },
  {
    id: 'sci-3',
    gradeId: 'grade-3',
    name: 'العلوم',
    code: 'SCIENCE_3',
    icon: '🌱',
    themeColor: 'teal',
    description: 'دورة حياة النباتات والحيوانات، مصادر الطاقة، والصخور والمعادن',
    lessonsCount: 14,
    questionsCount: 12,
  },
  {
    id: 'isl-3',
    gradeId: 'grade-3',
    name: 'التربية الإسلامية',
    code: 'ISLAMIC_3',
    icon: '🕌',
    themeColor: 'emerald',
    description: 'سور التين والعلق والقدر، معجزات الرسل، والآداب الاجتماعية',
    lessonsCount: 12,
    questionsCount: 12,
  },
  {
    id: 'eng-3',
    gradeId: 'grade-3',
    name: 'اللغة الإنجليزية (English for Iraq)',
    code: 'ENG_3',
    icon: '🇬🇧',
    themeColor: 'blue',
    description: 'Numbers, Alphabet Phonics, Clothes, Food and Daily Routines',
    lessonsCount: 12,
    questionsCount: 12,
  },

  // ================= الصف الرابع الابتدائي =================
  {
    id: 'ar-4',
    gradeId: 'grade-4',
    name: 'قواعد اللغة العربية والمطالعة',
    code: 'ARABIC_4',
    icon: '📜',
    themeColor: 'rose',
    description: 'المفرد والمثنى والجمع، أسماء الإشارة، الأسماء الموصولة والضمائر',
    lessonsCount: 20,
    questionsCount: 20,
  },
  {
    id: 'math-4',
    gradeId: 'grade-4',
    name: 'الرياضيات',
    code: 'MATH_4',
    icon: '📐',
    themeColor: 'blue',
    description: 'الأعداد ضمن الملايين، الضرب في مرتبتين، القسمة على مرتبة، والكسور الاعتيادية والعشرية',
    lessonsCount: 20,
    questionsCount: 18,
  },
  {
    id: 'sci-4',
    gradeId: 'grade-4',
    name: 'العلوم',
    code: 'SCIENCE_4',
    icon: '🪐',
    themeColor: 'emerald',
    description: 'البكتيريا والفطريات، النباتات الزهرية واللازهرية، ودورات حياة الحيوانات الفقرية واللافقرية',
    lessonsCount: 18,
    questionsCount: 16,
  },
  {
    id: 'soc-4',
    gradeId: 'grade-4',
    name: 'الاجتماعيات',
    code: 'SOC_4',
    icon: '🏛️',
    themeColor: 'amber',
    description: 'جغرافية العراق: الجهات، البيئات، مدن العراق التاريخية وحضارات بلاد الرافدين',
    lessonsCount: 15,
    questionsCount: 15,
  },
  {
    id: 'isl-4',
    gradeId: 'grade-4',
    name: 'التربية الإسلامية',
    code: 'ISLAMIC_4',
    icon: '🕌',
    themeColor: 'green',
    description: 'سورة الضحى وسورة الزلزلة، سيرة النبي محمد (ص) في مكة، والآداب الإسلامية',
    lessonsCount: 14,
    questionsCount: 12,
  },
  {
    id: 'eng-4',
    gradeId: 'grade-4',
    name: 'اللغة الإنجليزية (English for Iraq)',
    code: 'ENG_4',
    icon: '🇬🇧',
    themeColor: 'sky',
    description: 'English for Iraq 4th Primary: Countries, Family, Time, School subjects and Vocabulary',
    lessonsCount: 14,
    questionsCount: 14,
  },

  // ================= الصف الخامس الابتدائي =================
  {
    id: 'ar-5',
    gradeId: 'grade-5',
    name: 'قواعد اللغة العربية والمطالعة',
    code: 'ARABIC_5',
    icon: '📖',
    themeColor: 'emerald',
    description: 'أقسام الفعل: الماضي والمضارع والأمر، الفاعل والمفعول به، المبتدأ والخبر، وكان وأخواتها وإن وأخواتها',
    lessonsCount: 20,
    questionsCount: 20,
  },
  {
    id: 'math-5',
    gradeId: 'grade-5',
    name: 'الرياضيات',
    code: 'MATH_5',
    icon: '📊',
    themeColor: 'teal',
    description: 'الأعداد ضمن المليارات، الضرب والقسمة، جمع وطرح الكسور الاعتيادية والعشرية، ومساحة المثلث والمربع',
    lessonsCount: 20,
    questionsCount: 18,
  },
  {
    id: 'sci-5',
    gradeId: 'grade-5',
    name: 'العلوم',
    code: 'SCIENCE_5',
    icon: '🔬',
    themeColor: 'cyan',
    description: 'جهاز الدوران والتنفس والهضم عند الإنسان، الكهربائية والمغناطيس، والمركبات والمخاليط في الطبيعة',
    lessonsCount: 16,
    questionsCount: 16,
  },
  {
    id: 'soc-5',
    gradeId: 'grade-5',
    name: 'الاجتماعيات',
    code: 'SOC_5',
    icon: '🏛️',
    themeColor: 'amber',
    description: 'تضاريس العراق، مناخ وموارد العراق المائية، والتاريخ الإسلامي وحضارة بابل وآشور وسومر',
    lessonsCount: 14,
    questionsCount: 14,
  },
  {
    id: 'isl-5',
    gradeId: 'grade-5',
    name: 'التربية الإسلامية',
    code: 'ISLAMIC_5',
    icon: '🕌',
    themeColor: 'green',
    description: 'سورة البلد والماعون والملك المقررة، أركان الإيمان، معركة بدر وسيرة الرسول (ص)، وآداب صلة الرحم',
    lessonsCount: 16,
    questionsCount: 14,
  },
  {
    id: 'eng-5',
    gradeId: 'grade-5',
    name: 'اللغة الإنجليزية (English for Iraq)',
    code: 'ENG_5',
    icon: '🇬🇧',
    themeColor: 'blue',
    description: 'English for Iraq 5th Primary: Countries & Nationalities, Animals, Sports, Food & Jobs',
    lessonsCount: 16,
    questionsCount: 16,
  },

  // ================= الصف السادس الابتدائي =================
  {
    id: 'ar-6',
    gradeId: 'grade-6',
    name: 'قواعد اللغة العربية (وزاري)',
    code: 'ARABIC_6',
    icon: '🏆',
    themeColor: 'amber',
    description: 'النكرة والمعرفة، المعرف بالإضافة، المفاعيل (المطلق وفيه)، إعراب الفعل المضارع، والأسماء الخمسة',
    lessonsCount: 24,
    questionsCount: 25,
  },
  {
    id: 'math-6',
    gradeId: 'grade-6',
    name: 'الرياضيات (وزاري)',
    code: 'MATH_6',
    icon: '📐',
    themeColor: 'indigo',
    description: 'الأعداد الصحيحة، العمليات على الكسور، النسبة والتناسب ومقياس الرسم، والدائرة والمجسمات',
    lessonsCount: 24,
    questionsCount: 24,
  },
  {
    id: 'sci-6',
    gradeId: 'grade-6',
    name: 'العلوم (وزاري)',
    code: 'SCIENCE_6',
    icon: '🧬',
    themeColor: 'rose',
    description: 'التكاثر في النباتات (بذور، درنات، أبصال)، الجهاز العصبي والهيكلي، الذرة، والموجات الصوتية والضوئية',
    lessonsCount: 22,
    questionsCount: 22,
  },
  {
    id: 'isl-6',
    gradeId: 'grade-6',
    name: 'التربية الإسلامية (وزاري)',
    code: 'ISLAMIC_6',
    icon: '🕌',
    themeColor: 'emerald',
    description: 'سورة النجم ولقمان والرحمن، أحكام اللام، سيرة أولي العزم والجهاد في الإسلام، والأخلاق الفاضلة',
    lessonsCount: 18,
    questionsCount: 20,
  },
  {
    id: 'soc-6',
    gradeId: 'grade-6',
    name: 'الاجتماعيات (وزاري)',
    code: 'SOC_6',
    icon: '🗺️',
    themeColor: 'orange',
    description: 'دراسة محافظات العراق الـ 18 بالتفصيل: الموقع، التضاريس، الموارد المائية، والنبذة التاريخية لكل محافظة',
    lessonsCount: 20,
    questionsCount: 20,
  },
  {
    id: 'eng-6',
    gradeId: 'grade-6',
    name: 'اللغة الإنجليزية (English for Iraq - وزاري)',
    code: 'ENG_6',
    icon: '🇬🇧',
    themeColor: 'sky',
    description: 'English for Iraq 6th Primary: Family, Jobs & Workplaces, Materials, Routine, Travel and Ministerial Grammar',
    lessonsCount: 20,
    questionsCount: 22,
  },
];


const DEFAULT_EXTRA_QUESTIONS: Question[] = [
  // Islamic Grade 5
  {
    id: 'q-isl5-1',
    gradeId: 'grade-5',
    subjectId: 'isl-5',
    chapter: 'الوحدة الأولى: القرآن الكريم والعقيدة',
    lessonName: 'سورة البلد وتفسيرها',
    questionText: 'ما المعنى الإجمالي لقوله تعالى: ﴿لا أُقْسِمُ بِهَذَا الْبَلَدِ * وَأَنْتَ حِلٌّ بِهَذَا الْبَلَدِ﴾؟',
    answerText: 'يقسم الله عز وجل بمكة المكرمة البلد الحرام تشريفاً وتعظيماً لها، وبياناً لفضل ومكانة النبي محمد (صلى الله عليه وآله وسلم) فيها.',
    difficulty: 'medium',
    isVipOnly: false,
    options: ['يقسم بمكة المكرمة تشريفاً للنبي (ص)', 'يقسم بمدينة القدس الشريف', 'يقسم بجبل الطور', 'يقسم بالبحر المحيط'],
    correctAnswerIndex: 0,
    explanation: 'سورة البلد مكية، والمقصود بالبلد هو مكة المكرمة زادها الله شرفاً.',
  },
  {
    id: 'q-isl5-2',
    gradeId: 'grade-5',
    subjectId: 'isl-5',
    chapter: 'الوحدة الثانية: الحديث النبوي الشريف والأخلاق',
    lessonName: 'صلة الرحم وبر الأهل',
    questionText: 'ما هو الأجر العظيم الذي يناله المسلم الواصل لرحمه كما ورد في الحديث الشريف؟',
    answerText: 'يبسط الله تعالى له في رزقه، ويبارك له في عمره وأثره في الدنيا والآخرة.',
    difficulty: 'easy',
    isVipOnly: false,
  },
  {
    id: 'q-isl5-3',
    gradeId: 'grade-5',
    subjectId: 'isl-5',
    chapter: 'الوحدة الثالثة: السيرة النبوية العطرة',
    lessonName: 'معركة بدر الكبرى',
    questionText: 'في أي سنة هجرية وقعت معركة بدر الكبرى؟ وما كانت نتيجتها؟',
    answerText: 'وقعت في السنة الثانية للهجرة (2 هـ) في شهر رمضان المبارك، وانتصر فيها المسلمون نصراً مؤزراً على مشركي قريش.',
    difficulty: 'medium',
    isVipOnly: false,
  },

  // English Grade 5
  {
    id: 'q-eng5-1',
    gradeId: 'grade-5',
    subjectId: 'eng-5',
    chapter: 'Unit 1: Countries & Nationalities',
    lessonName: 'Where are you from?',
    questionText: 'Choose the correct nationality: "Peter is from England. He is _______."',
    answerText: 'English (إنجليزي)',
    difficulty: 'easy',
    isVipOnly: false,
    options: ['English', 'Englandish', 'Englander', 'Englese'],
    correctAnswerIndex: 0,
    explanation: 'The nationality for someone from England is English.',
  },
  {
    id: 'q-eng5-2',
    gradeId: 'grade-5',
    subjectId: 'eng-5',
    chapter: 'Unit 2: Animals and Nature',
    lessonName: 'Animal Habitats',
    questionText: 'Which animal is friendly, intelligent and lives in the sea?',
    answerText: 'The Dolphin (الدولفين)',
    difficulty: 'easy',
    isVipOnly: false,
    options: ['Dolphin', 'Lion', 'Eagle', 'Snake'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q-eng5-3',
    gradeId: 'grade-5',
    subjectId: 'eng-5',
    chapter: 'Unit 6: Jobs and Workplaces',
    lessonName: 'Professions',
    questionText: 'Complete the sentence: "An IT Programmer works in an _______."',
    answerText: 'office (مكتب برمجة)',
    difficulty: 'medium',
    isVipOnly: false,
    options: ['office', 'oil refinery', 'hospital', 'farm'],
    correctAnswerIndex: 0,
  },

  // English Grade 2
  {
    id: 'q-eng2-1',
    gradeId: 'grade-2',
    subjectId: 'eng-2',
    chapter: 'Unit 1: Colors & School',
    lessonName: 'Primary Colors',
    questionText: 'What color is the sun? اختر لون الشمس بالإنجليزية:',
    answerText: 'Yellow (أصفر ☀️)',
    difficulty: 'easy',
    isVipOnly: false,
    options: ['Yellow', 'Blue', 'Green', 'Black'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q-eng2-2',
    gradeId: 'grade-2',
    subjectId: 'eng-2',
    chapter: 'Unit 2: Animals',
    lessonName: 'Pets and Animals',
    questionText: 'What is the English word for (قِطَّة)?',
    answerText: 'Cat (قِطَّة 🐱)',
    difficulty: 'easy',
    isVipOnly: false,
    options: ['Cat', 'Dog', 'Bird', 'Fish'],
    correctAnswerIndex: 0,
  },

  // English Grade 3
  {
    id: 'q-eng3-1',
    gradeId: 'grade-3',
    subjectId: 'eng-3',
    chapter: 'Unit 1: Numbers & Alphabet',
    lessonName: 'Counting 1 to 20',
    questionText: 'What comes after fourteen (14)? ما هو العدد الذي يلي 14؟',
    answerText: 'Fifteen (15)',
    difficulty: 'easy',
    isVipOnly: false,
    options: ['Fifteen (15)', 'Twelve (12)', 'Sixteen (16)', 'Twenty (20)'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q-eng3-2',
    gradeId: 'grade-3',
    subjectId: 'eng-3',
    chapter: 'Unit 3: Food & Drink',
    lessonName: 'Healthy Food',
    questionText: 'What is the English word for (حَلِيب)?',
    answerText: 'Milk (حليب 🥛)',
    difficulty: 'easy',
    isVipOnly: false,
    options: ['Milk', 'Water', 'Tea', 'Juice'],
    correctAnswerIndex: 0,
  },

  // Islamic Grade 2
  {
    id: 'q-isl2-1',
    gradeId: 'grade-2',
    subjectId: 'isl-2',
    chapter: 'الوحدة الأولى: القرآن الكريم والآداب',
    lessonName: 'سورة الفيل المباركة',
    questionText: 'من هو قائد الجيش الذي أراد هدم الكعبة المشرفة وحماها الله تعالى بطير أبابيل؟',
    answerText: 'أبرهة الحبشي وجيشه وأصحابه أصحاب الفيل.',
    difficulty: 'easy',
    isVipOnly: false,
  },

  // Islamic Grade 3
  {
    id: 'q-isl3-1',
    gradeId: 'grade-3',
    subjectId: 'isl-3',
    chapter: 'الوحدة الأولى: السور والآيات الكريمة',
    lessonName: 'سورة القدر المباركة',
    questionText: 'في أي ليلة مباركة نزل القرآن الكريم على نبينا محمد (ص)؟',
    answerText: 'في ليلة القدر المباركة في شهر رمضان العظيم.',
    difficulty: 'easy',
    isVipOnly: false,
  },
];

interface GradePortalProps {
  onStartQuiz: (subject: Subject, questions: Question[]) => void;
  onOpenSearch: () => void;
  onOpenUpgradeModal: () => void;
}

const DEFAULT_IRAQI_CHAPTERS: Record<string, string[]> = {
  // ================= الصف الأول الابتدائي =================
  'sci-1': [
    'الفصل الأول: الكائنات الحية وأجزاؤها',
    'الفصل الثاني: البيئة الطبيعية ومكوناتها',
    'الفصل الثالث: المادة وخصائصها',
    'الفصل الرابع: الحركة والقوة',
    'الفصل الخامس: الأرض والموارد الطبيعية',
  ],
  'ar-1': [
    'الفصل الأول: الحروف والمقاطع بالحركات',
    'الفصل الثاني: الكلمات والجمل البسيطة',
    'الفصل الثالث: القصص والمطالعة',
  ],
  'math-1': [
    'الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر',
    'الفصل الثاني: الجمع حتى العدد 9',
    'الفصل الثالث: الطرح حتى العدد 9',
    'الفصل الرابع: الأعداد حتى 20',
    'الفصل الخامس: الأشكال الهندسية والقياس',
  ],
  'eng-1': [
    'Unit 1: Hello & Alphabet Phonics',
    'Unit 2: Numbers & Colors',
    'Unit 3: Family & Classroom Objects',
  ],
  'isl-1': [
    'الفصل الأول: السور القرآنية والآداب الإسلامية',
    'الفصل الثاني: العقيدة وسيرة النبي محمد (ص)',
    'الفصل الثالث: الأخلاق والأدعية والحديث الشريف',
  ],

  // ================= الصف الثاني الابتدائي =================
  'math-2': [
    'الفصل الأول: الأعداد حتى 999 والقيمة المكانية',
    'الفصل الثاني: مقارنة الأعداد وترتيبها',
    'الفصل الثالث: جمع الأعداد حتى 999',
    'الفصل الرابع: طرح الأعداد حتى 999',
    'الفصل الخامس: الهندسة والقياس والوقت',
  ],
  'ar-2': [
    'الفصل الأول: الأرنب الوفي ومدرستي',
    'الفصل الثاني: اللام الشمسية والقمرية وحركات التنوين',
    'الفصل الثالث: المحفوظات والأناشيد والمطالعة',
  ],
  'sci-2': [
    'الفصل الأول: أعضاء جسم الإنسان',
    'الفصل الثاني: الحفاظ على صحة الجسم',
    'الفصل الثالث: البيئة اليابسة والبيئة المائية',
    'الفصل الرابع: الغذاء والتغذية',
  ],

  // ================= الصف الثالث الابتدائي =================
  'math-3': [
    'الفصل الأول: الأعداد حتى 9999 والقيمة المكانية',
    'الفصل الثاني: جمع وطرح الأعداد المكونة من 4 مراتب',
    'الفصل الثالث: جدول الضرب وحقائق الضرب الأساسية',
    'الفصل الرابع: القسمة وعلاقتها بالضرب',
    'الفصل الخامس: الكسور والقياس والأشكال الهندسية',
  ],

  // ================= الصف الرابع الابتدائي =================
  'math-4': [
    'الفصل الأول: الأعداد ضمن الملايين والقيمة المكانية',
    'الفصل الثاني: الجمع والطرح ضمن الملايين',
    'الفصل الثالث: ضرب الأعداد (ضرب في عدد من مرتبتين)',
    'الفصل الرابع: القسمة على عدد من مرتبة واحدة',
    'الفصل الخامس: الكسور الاعتيادية والكسور العشرية',
    'الفصل السادس: الهندسة والزوايا والقياس',
  ],

  // ================= الصف الخامس الابتدائي =================
  'math-5': [
    'الفصل الأول: الأعداد ضمن المليارات والقيمة المكانية',
    'الفصل الثاني: الضرب في عدد من ثلاث مراتب والقسمة على مرتبتين',
    'الفصل الثالث: جمع وطرح الكسور الاعتيادية والأعداد الكسرية',
    'الفصل الرابع: الكسور العشرية والعمليات عليها',
    'الفصل الخامس: المساحة والمحيط والدائرة',
  ],

  // ================= الصف السادس الابتدائي (الوزاري المعتمد) =================
  'math-6': [
    'الفصل الأول: الأعداد الصحيحة وتمثيلها على خط الأعداد والعمليات عليها',
    'الفصل الثاني: العبارات الجبرية والمعادلات',
    'الفصل الثالث: العمليات على الكسور الاعتيادية والأعداد الكسرية',
    'الفصل الرابع: العمليات على الكسور العشرية',
    'الفصل الخامس: النسبة والتناسب ومقياس الرسم والتقسيم التناسبي',
    'الفصل السادس: الدائرة ومحيطها ومساحتها والرسم الهندسي',
    'الفصل السابع: الإحصاء والاحتمال (الوسط الحسابي والوسيط والمنوال)',
  ],
  'ar-6': [
    'الوحدة الأولى: أنواع المعارف (وزاري)',
    'الوحدة الثانية: المبتدأ والخبر وكان وأخواتها (وزاري)',
    'الوحدة الثالثة: نائب الفاعل (وزاري)',
    'الوحدة الرابعة: المفعول المطلق والمفعول فيه (وزاري)',
  ],
};

// ================= مكتبة قصائد المحفوظات والأناشيد المقررة للحفظ =================
const IRAQI_POEMS_DATA: Record<string, { title: string; author: string; verses: { l1: string; l2: string }[] }[]> = {
  'grade-1': [
    {
      title: 'نشيد مدرستي',
      author: 'منهج قراءتي للصف الأول',
      verses: [
        { l1: 'أَهْلاً أَهْلاً يَا مَدْرَسَتِي', l2: 'أَهْلاً أَهْلاً يَا بَيْتِي الثَّانِي' },
        { l1: 'فِيكِ أَقْضِي أَحْلَى وَقْتِي', l2: 'مَعَ أَحْبَابِي وَخِلَّانِي' },
        { l1: 'فِيكِ أَتَعَلَّمُ قِرَاءَتِي', l2: 'وَكِتَابَةَ كُلِّ عُنْوَانِ' },
      ],
    },
  ],
  'grade-2': [
    {
      title: 'نشيد النَّحْلَةُ العَامِلَةُ',
      author: 'محفوظات الصف الثاني',
      verses: [
        { l1: 'مَنْ ذَا الَّذِي يَعْمَلُ دَوْماً', l2: 'بِجِدٍّ وَنَشَاطٍ كَبِيرْ؟' },
        { l1: 'إِنَّهَا النَّحْلَةُ تَسْعَى', l2: 'تَجْنِي شَهْدَ الزَّهْرِ النَّضِيرْ' },
        { l1: 'تَصْنَعُ عَسَلاً فِيهِ شِفَاءٌ', l2: 'يَسُرُّ الصَّغِيرَ وَالْكَبِيرْ' },
      ],
    },
  ],
  'grade-3': [
    {
      title: 'محفوظات العِلْمُ وَالعَمَلُ',
      author: 'قراءتي للصف الثالث',
      verses: [
        { l1: 'أَيُّهَا الطَّالِبُ اجْتَهِدْ', l2: 'تَنَلِ الرِّفْعَةَ وَالأَمَلَ' },
        { l1: 'لَيْسَ العِلْمُ بِمَا حُفِظَ', l2: 'إِنَّمَا العِلْمُ بِمَا عُمِلَ' },
        { l1: 'فَانْهَضْ يَا بُنَيَّ لِغَدٍ', l2: 'تُنِرِ الدَّرْبَ وَالمُسْتَقْبَلَ' },
      ],
    },
  ],
  'grade-4': [
    {
      title: 'محفوظات أُمِّي الحَبِيبَة',
      author: 'اللغة العربية للصف الرابع',
      verses: [
        { l1: 'أُمِّي يَا نَبْعَ الحَنَانِ', l2: 'يَا بَسْمَةً فَوْقَ الزَّمَانِ' },
        { l1: 'كَمْ سَهِرْتِ اللَّيْلَ عِنْدِي', l2: 'حِينَ أَشْكُو مِنْ هَوَانِ' },
        { l1: 'جَزَاكِ اللهُ يَا أُمِّي', l2: 'رِضَاهُ وَجَنَّةَ الرِّضْوَانِ' },
      ],
    },
  ],
  'grade-5': [
    {
      title: 'محفوظات الجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ',
      author: 'اللغة العربية للصف الخامس',
      verses: [
        { l1: 'قَدْ جَاءَ فِي القُرْآنِ ذِكْرُ حَقِّهَا', l2: 'وَفِي حَدِيثِ المُصْطَفَى بَيَانُهُ' },
        { l1: 'الجَنَّةُ الفَيْحَاءُ تَحْتَ قَدَمِهَا', l2: 'فَبِرُّهَا لِلْمُؤْمِنِ عُنْوَانُهُ' },
      ],
    },
  ],
  'grade-6': [
    {
      title: 'قصيدة البُسْتَانِيُّ (وزاري مقرر للحفظ)',
      author: 'الشاعر معروف الرصافي',
      verses: [
        { l1: 'تَرَاهُ فِي حَدِيقَتِهِ', l2: 'مَعَ الإِشْرَاقِ مُبْتَسِمَا' },
        { l1: 'يَسْقِي الغُرُوسَ بِمَائِهَا', l2: 'فَيُحْيِي الزَّهْرَ وَالعَلَمَا' },
        { l1: 'يَجْنِي الثِّمَارَ طَيِّبَةً', l2: 'وَيَجْعَلُ رَوْضَهُ حَرَمَا' },
        { l1: 'يَعْمَلُ دَوْماً فِي نَشَاطٍ', l2: 'وَيَحْمَدُ اللهَ وَالكَرَمَا' },
      ],
    },
    {
      title: 'نشيد مَوْطِنِي (النشيد الخالد)',
      author: 'الشاعر إبراهيم طوقان',
      verses: [
        { l1: 'مَوْطِنِي مَوْطِنِي', l2: 'الجَلَالُ وَالجَمَالُ وَالسَّنَاءُ وَالبَهَاءُ فِي رُبَاكْ' },
        { l1: 'وَالحَيَاةُ وَالنَّجَاةُ وَالهَنَاءُ وَالرَّجَاءُ', l2: 'فِي هَوَاكْ فِي هَوَاكْ' },
        { l1: 'هَلْ أَرَاكْ هَلْ أَرَاكْ', l2: 'سَالِماً مُنَعَّماً وَغَانِماً مُكَرَّماً؟' },
        { l1: 'مَوْطِنِي', l2: 'مَوْطِنِي!' },
      ],
    },
  ],
};

// ================= مكتبة القرآن الكريم والأحاديث النبوية المقررة للحفظ =================
const IRAQI_ISLAMIC_DATA: Record<string, { title: string; type: 'surah' | 'hadith'; text: string; lessons: string }[]> = {
  'grade-1': [
    {
      title: 'سورة الفاتحة المباركة',
      type: 'surah',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾',
      lessons: 'أم الكتاب والسبع المثاني التي نفتح بها كل صلاة ودعاء.',
    },
    {
      title: 'سورة الإخلاص (التوحيد)',
      type: 'surah',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ قُلْ هُوَ اللَّهُ أَحَدٌ ﴿٢﴾ اللَّهُ الصَّمَدُ ﴿٣﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٤﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٥﴾',
      lessons: 'إثبات وحدانية الله جل جلاله وأنه الصمد الذي تقصده الخلائق في حوائجها.',
    },
    {
      title: 'حديث بر الوالدين الشريف',
      type: 'hadith',
      text: 'قال رسول الله (صلى الله عليه وآله وسلم): «رِضَا اللَّهِ فِي رِضَا الْوَالِدَيْنِ، وَسَخَطُ اللَّهِ فِي سَخَطِ الْوَالِدَيْنِ».',
      lessons: 'طاعة الأب والأم وبرهما سبب عظيم لنيل رضا الله ودخول الجنة.',
    },
  ],
  'grade-2': [
    {
      title: 'سورة النصر المباركة',
      type: 'surah',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ﴿٢﴾ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴿٣﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا ﴿٤﴾',
      lessons: 'البشارة بنصر دين الله والدعوة للتسبيح والاستغفار دائماً.',
    },
    {
      title: 'حديث طلب العلم الشريف',
      type: 'hadith',
      text: 'قال رسول الله (صلى الله عليه وآله وسلم): «طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ وَمُسْلِمَةٍ».',
      lessons: 'التعلم واكتساب المعرفة واجب ديني وأخلاقي على كل طفل وطفلة.',
    },
  ],
  'grade-6': [
    {
      title: 'سورة النجم المباركة (وزاري مقرر للحفظ من 1 إلى 18)',
      type: 'surah',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ وَالنَّجْمِ إِذَا هَوَىٰ ﴿٢﴾ مَا ضَلَّ صَاحِبُكُمْ وَمَا غَوَىٰ ﴿٣﴾ وَمَا يَنطِقُ عَنِ الْهَوَىٰ ﴿٤﴾ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ ﴿٥﴾ عَلَّمَهُ شَدِيدُ الْقُوَىٰ ﴿٦﴾',
      lessons: 'إثبات صدق رسالة نبينا محمد (صلى الله عليه وآله) ومعجزة الإسراء والمعراج.',
    },
    {
      title: 'سورة الرحمن (وزاري مقرر للحفظ)',
      type: 'surah',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الرَّحْمَٰنُ ﴿٢﴾ عَلَّمَ الْقُرْآنَ ﴿٣﴾ خَلَقَ الْإِنسَانَ ﴿٤﴾ عَلَّمَهُ الْبَيَانَ ﴿٥﴾ الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ ﴿٦﴾ وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ ﴿٧﴾',
      lessons: 'بيان نعم الله العظيمة على الخلق وخلق الإنسان وتكريمه بالعقل والبيان.',
    },
    {
      title: 'حديث الصدق والأمانة (وزاري)',
      type: 'hadith',
      text: 'قال رسول الله (صلى الله عليه وآله وسلم): «عَلَيْكُمْ بِالصِّدْقِ؛ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ».',
      lessons: 'فضيلة الصدق والابتعاد التام عن الكذب لنيل الفوز بالجنة.',
    },
  ],
};

// ================= مكتبة اللغة الإنجليزية التفاعلية (English for Iraq) =================
const IRAQI_ENGLISH_DATA: Record<string, { unit: string; topic: string; items: { en: string; ar: string; note: string }[] }[]> = {
  'grade-1': [
    {
      unit: 'Unit 1: Alphabet Phonics',
      topic: 'Letters & Sounds',
      items: [
        { en: 'Apple', ar: 'تُفَّاحة 🍎', note: 'Letter A /æ/' },
        { en: 'Ball', ar: 'كُرة ⚽', note: 'Letter B /b/' },
        { en: 'Cat', ar: 'قِطَّة 🐱', note: 'Letter C /k/' },
        { en: 'Dog', ar: 'كَلْب 🐶', note: 'Letter D /d/' },
      ],
    },
    {
      unit: 'Unit 2: Colors & Numbers',
      topic: 'Basic Colors',
      items: [
        { en: 'Red', ar: 'أحمر 🔴', note: 'As in Red Apple' },
        { en: 'Blue', ar: 'أزرق 🔵', note: 'As in Blue Sky' },
        { en: 'Green', ar: 'أخضر 🟢', note: 'As in Green Tree' },
        { en: 'Yellow', ar: 'أصفر 🟡', note: 'As in Warm Sun' },
      ],
    },
  ],
  'grade-6': [
    {
      unit: 'Unit 1: Jobs & Workplaces (وزاري)',
      topic: 'Careers in English',
      items: [
        { en: 'Doctor', ar: 'طَبِيب 🩺', note: 'Works in a hospital' },
        { en: 'IT Programmer', ar: 'مُبَرْمِج حَاسُوب 💻', note: 'Works in an office' },
        { en: 'Engineer', ar: 'مُهَنْدِس 🏗️', note: 'Works on an oil refinery or site' },
        { en: 'Farmer', ar: 'فَلَّاح / مُزَارِع 🌾', note: 'Works on a farm' },
      ],
    },
    {
      unit: 'Unit 2: Materials (المواد - وزاري مرشح)',
      topic: 'Origin of Materials',
      items: [
        { en: 'Cotton comes from plants', ar: 'القطن يأتي من النباتات 🌿', note: 'Plant origin' },
        { en: 'Wool comes from sheep', ar: 'الصوف يأتي من الأغنام 🐑', note: 'Animal origin' },
        { en: 'Rubber comes from trees', ar: 'المطاط يأتي من الأشجار 🌳', note: 'Rubber tree' },
        { en: 'Glass is made from sand', ar: 'الزجاج مصنوع من الرمال ⏳', note: 'Mineral origin' },
      ],
    },
  ],
};

// تثبيت انتماء الأسئلة حصراً لمادتها بدون أي تداخل أو قفز بين المواد
function sanitizeQuestionSubject(q: Question): Question {
  return q;
}

export const GradePortal: React.FC<GradePortalProps> = ({
  onStartQuiz,
  onOpenSearch,
  onOpenUpgradeModal,
}) => {
  const { currentStudent, subjects, questions, logout } = useEdu();

  if (!currentStudent) return null;

  // دعم التصفح والتنقل بين كافة المراحل الدراسية مباشرة
  const [activeGradeId, setActiveGradeId] = useState<GradeId>(effectiveGradeId);
  const currentGradeId = activeGradeId;
  const gradeInfo = GRADES_DATA.find((g) => g.id === currentGradeId);

  // نضمن ظهور كافة المواد الرسمية (بما فيها الإنجليزي والإسلامية والاجتماعيات) لكل صف
  const officialForGrade = ALL_IRAQI_OFFICIAL_SUBJECTS.filter((s) => s.gradeId === currentGradeId);
  const userSubjectsForGrade = subjects.filter((s) => s.gradeId === currentGradeId);
  const gradeSubjects = [...officialForGrade];
  for (const us of userSubjectsForGrade) {
    if (!gradeSubjects.some((s) => s.id === us.id)) {
      gradeSubjects.push(us);
    }
  }

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    gradeSubjects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'qa' | 'exams' | 'curriculum'>('qa');

  // شروحات وفيديوهات المناهج المتزامنة سحابياً عبر Firebase عبر كافة الهواتف والحواسيب
    // حالة عارض كتب ومناهج الـ PDF التفاعلي المدمج لتجاوز قيود تسجيل الدخول في جوجل
  const [selectedBookForViewer, setSelectedBookForViewer] = useState<any | null>(null);

  // ميزة المنتدى: حالة نافذة التعديل السريع للأسئلة
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // ميزة المنتدى: حالة نافذة تعديل الفيديو
  const [editingVideo, setEditingVideo] = useState<any | null>(null);

  // ميزة المنتدى: حالة نافذة تعديل رابط الكتاب
  const [editingBook, setEditingBook] = useState<any | null>(null);

  // ميزة إضافة امتحان جديد لفصل محدد
  const [addingExamChapter, setAddingExamChapter] = useState<string | null>(null);
  const [newExamTitle, setNewExamTitle] = useState('');

  const [platformVideos, setPlatformVideos] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('iraq_edu_admin_custom_videos_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'vid-default-math-1',
        gradeId: 'grade-1',
        subjectId: 'math-1',
        subjectName: 'الرياضيات',
        title: 'شرح رياضيات الصف الأول الابتدائي - الأعداد والجمع',
        youtubeUrl: 'https://youtu.be/sW8cpXQU0sY',
        chapter: 'الدرس الأول',
      }
    ];
  });

  // مزامنة فورية حية مع قاعدة بيانات Firebase Firestore ليظهر الفيديو على أي موبايل أو حاسبة فوراً
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'videos'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteVids = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setPlatformVideos(remoteVids);
          try {
            localStorage.setItem('iraq_edu_admin_custom_videos_v1', JSON.stringify(remoteVids));
          } catch {}
        }
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore live videos sync fallback:', e);
    }
  }, []);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const selectedSubject =
    gradeSubjects.find((s) => s.id === selectedSubjectId) || gradeSubjects[0];

  const rawQuestions = [...questions, ...DEFAULT_EXTRA_QUESTIONS];
  const uniqueQuestionsMap = new Map<string, Question>();
  rawQuestions.forEach((q) => {
    if (q && q.id && !uniqueQuestionsMap.has(q.id)) {
      uniqueQuestionsMap.set(q.id, q);
    }
  });
  const allQuestions = Array.from(uniqueQuestionsMap.values());
  const currentSubjectQuestions = allQuestions
    .map(sanitizeQuestionSubject)
    .filter(
      (q) => q.gradeId === currentGradeId && q.subjectId === selectedSubject?.id
    );

  const handleSpeakArabic = (textToSpeak: string, id: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(id);
    speakArabicText(textToSpeak, {
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  const handleSpeakEnglish = (textToSpeak: string, id: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(id);

    // نطق صوتي مبسط للطفل (اسم الحرف بالعربي ثم بالإنجليزي ثم المعنى بالعربي)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && textToSpeak.includes(' - ')) {
      try {
        window.speechSynthesis.cancel();
        const parts = textToSpeak.split(' - ');
        const letterChar = parts[0].trim()[0].toUpperCase();
        const word = parts[1].trim();

        const AR_LETTER_MAP: Record<string, { arName: string; arMean: string }> = {
          A: { arName: 'إي', arMean: 'تفاحة حمراء' },
          B: { arName: 'بي', arMean: 'كرة لعب' },
          C: { arName: 'سي', arMean: 'قطة أليفة' },
          D: { arName: 'دي', arMean: 'كلب' },
          E: { arName: 'إي', arMean: 'بيضة طعام' },
          F: { arName: 'إف', arMean: 'سمكة في الماء' },
          G: { arName: 'جي', arMean: 'بنت أو فتاة' },
          H: { arName: 'إتش', arMean: 'قبعة رأس' },
          I: { arName: 'آي', arMean: 'مثلجات لذيذة' },
          J: { arName: 'جاي', arMean: 'مربى فواكه' },
          K: { arName: 'كاي', arMean: 'طائرة ورقية' },
          L: { arName: 'إل', arMean: 'أسد قوي' },
          M: { arName: 'إم', arMean: 'قرد شقي' },
          N: { arName: 'إن', arMean: 'شبكة صيد' },
          O: { arName: 'أو', arMean: 'برتقالة طازجة' },
          P: { arName: 'بي', arMean: 'قلم كتابة' },
          Q: { arName: 'كيو', arMean: 'ملكة تاج' },
          R: { arName: 'آر', arMean: 'أرنب يقفز' },
          S: { arName: 'إس', arMean: 'شمس مشرقة' },
          T: { arName: 'تي', arMean: 'شجرة خضراء' },
          U: { arName: 'يو', arMean: 'مظلة المطر' },
          V: { arName: 'في', arMean: 'سيارة حافلة' },
          W: { arName: 'دبليو', arMean: 'ساعة يد' },
          X: { arName: 'إكس', arMean: 'صورة أشعة' },
          Y: { arName: 'واي', arMean: 'لعبة يويو' },
          Z: { arName: 'زد', arMean: 'حمار وحشي' },
        };

        const info = AR_LETTER_MAP[letterChar];
        if (info) {
          const u1 = new SpeechSynthesisUtterance(`حرف ال ${info.arName}`);
          u1.lang = 'ar-SA';
          u1.rate = 0.85;

          const u2 = new SpeechSynthesisUtterance(`${letterChar} ... ${word}`);
          u2.lang = 'en-US';
          u2.rate = 0.75;

          const u3 = new SpeechSynthesisUtterance(`معناها ${info.arMean}`);
          u3.lang = 'ar-SA';
          u3.rate = 0.85;

          u3.onend = () => setSpeakingId(null);
          u3.onerror = () => setSpeakingId(null);

          window.speechSynthesis.speak(u1);
          window.speechSynthesis.speak(u2);
          window.speechSynthesis.speak(u3);
          return;
        }
      } catch (e) {}
    }

    speakEnglishPhonics(textToSpeak, {
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  const getSubjectChapters = (subjectId: string): string[] => {
    try {
      const saved = localStorage.getItem('iraq_edu_subject_chapters_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[subjectId] && parsed[subjectId].length > 0) {
          return parsed[subjectId];
        }
      }
    } catch (e) {}

    const defaults = DEFAULT_IRAQI_CHAPTERS[subjectId] || [
      'الفصل الأول: المفاهيم والدروس الأساسية',
      'الفصل الثاني: الأنشطة والتطبيقات العملية',
      'الفصل الثالث: مراجعة شاملة ونصف السنة',
      'الفصل الرابع: الاختبارات والوزاريات النهائية',
    ];

    const fromQuestions = currentSubjectQuestions.map((q) => q.chapter).filter(Boolean);
    return Array.from(new Set([...defaults, ...fromQuestions]));
  };

  const subjectChapters = selectedSubject ? getSubjectChapters(selectedSubject.id) : [];

  const getOrderedQuestionsForChapter = (chapName: string): Question[] => {
    const raw = currentSubjectQuestions.filter((q) => q.chapter === chapName);
    const key = `iraq_edu_order_${currentGradeId}_${selectedSubject?.id}_${chapName}`;
    let orderMap: Record<string, number> = {};
    try {
      const saved = localStorage.getItem(key);
      if (saved) orderMap = JSON.parse(saved);
    } catch (e) {}

    return [...raw].sort((a, b) => {
      const orderA = orderMap[a.id] !== undefined ? orderMap[a.id] : 9999;
      const orderB = orderMap[b.id] !== undefined ? orderMap[b.id] : 9999;
      return orderA - orderB;
    });
  };

  // هل المادة الحالية لغة عربية أو قراءة؟
  const isArabicSubject =
    selectedSubject?.id.startsWith('ar-') ||
    selectedSubject?.name.includes('قراءتي') ||
    selectedSubject?.name.includes('العربية');

  // هل المادة إسلامية؟
  const isIslamicSubject =
    selectedSubject?.id.startsWith('isl-') ||
    selectedSubject?.name.includes('إسلامية');

  // هل المادة إنجليزية؟
  const isEnglishSubject =
    selectedSubject?.id.startsWith('eng-') ||
    selectedSubject?.name.toLowerCase().includes('english') ||
    selectedSubject?.name.includes('إنجليزية');

  const gradePoems = IRAQI_POEMS_DATA[currentGradeId] || IRAQI_POEMS_DATA['grade-6'];
  const gradeIslamic = IRAQI_ISLAMIC_DATA[currentGradeId] || IRAQI_ISLAMIC_DATA['grade-1'];
  const gradeEnglish = IRAQI_ENGLISH_DATA[currentGradeId] || IRAQI_ENGLISH_DATA['grade-1'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 sm:p-8 shadow-xl shadow-teal-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <span className="text-4xl sm:text-5xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner">
              {currentStudent.avatar}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <div className="flex items-center gap-1 bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
                  <span className="text-[10px] font-bold">المرحلة:</span>
                  <select
                    value={activeGradeId}
                    onChange={(e) => {
                      playClickSound();
                      const ng = e.target.value as GradeId;
                      setActiveGradeId(ng);
                      const firstSubj = ALL_IRAQI_OFFICIAL_SUBJECTS.find((s) => s.gradeId === ng);
                      if (firstSubj) setSelectedSubjectId(firstSubj.id);
                    }}
                    className="bg-transparent font-black text-xs cursor-pointer outline-none border-none text-amber-950"
                  >
                    {GRADES_DATA.map((g) => (
                      <option key={g.id} value={g.id} className="text-slate-900 font-bold">
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                {currentStudent.subscription === 'paid' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-xs flex items-center gap-2 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>مشترك VIP مفعل ⭐</span>
                    <span className="text-[11px] font-mono text-amber-200 bg-black/25 px-2 py-0.5 rounded-lg border border-amber-300/40">
                      صالح حتى: {currentStudent.subscriptionExpiry || '2026-12-31'}
                    </span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white/90 flex items-center gap-1.5">
                    <span>حساب مجاني</span>
                    <span className="text-[10px] text-emerald-200">(تواصل لتفعيل VIP)</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                أهلاً بك يا بطل، {currentStudent.fullName} 🌟
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5">
                منهاجك متكامل: محفوظات، قرآن وحديث، رياضيات، إنجليزي، وامتحانات مطولة ذكية
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2.5">
                <button
                  onClick={() => {
                    playClickSound();
                    logout();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>الرئيسية (تبديل الطالب أو الخروج)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-lg font-black text-amber-300">
                {currentStudent.starsEarned || 0} ⭐
              </span>
              <p className="text-[11px] text-emerald-100 font-bold">نجوم التفوق</p>
            </div>
            <div className="p-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-lg font-black text-white">
                {currentStudent.totalScore || 0}
              </span>
              <p className="text-[11px] text-emerald-100 font-bold">النقاط الكلية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>المواد الدراسية المقررة لـ {gradeInfo?.name}:</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {gradeSubjects.length} مواد معتمدة
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {gradeSubjects.map((subj) => {
            const isSelected = selectedSubject?.id === subj.id;
            const subjectQuestionsCount = [...questions, ...DEFAULT_EXTRA_QUESTIONS]
              .map(sanitizeQuestionSubject)
              .filter((q) => q.gradeId === currentGradeId && q.subjectId === subj.id).length;

            return (
              <button
                key={subj.id}
                onClick={() => {
                  playClickSound();
                  stopSpeaking();
                  setSelectedSubjectId(subj.id);
                }}
                className={`p-4 rounded-3xl border-2 text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md scale-102 ring-2 ring-emerald-200'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <span className="text-3xl block mb-2">{subj.icon}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                    {subj.name}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{subj.lessonsCount} درس</span>
                  <span className="text-emerald-700 font-bold">
                    {subjectQuestionsCount} سؤال
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedSubject && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 text-center sm:text-right">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                {selectedSubject.icon}
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedSubject.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {gradeInfo?.name} • منهاج وزارة التربية العراقية المعتمد
                </p>
              </div>
            </div>

            {/* زر بدء الاختبار الشامل المطول */}
            <button
              onClick={() => {
                playClickSound();
                onStartQuiz(selectedSubject, currentSubjectQuestions);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <Trophy className="w-5 h-5 text-amber-300" />
              <span>بدء الامتحان الشامل المطول 🎯</span>
            </button>
          </div>

          {/* 1. كتاب وملزمة المادة الرسمية (PDF) - يفتح داخل نفس المادة مباشرة */}
          {(() => {
            const currentBook = SUBJECT_BOOKS_MAP[selectedSubject.id] || {
              bookTitle: `كتاب ومنهاج ${selectedSubject.name} الرسمي`,
              edition: 'طبعة وزارة التربية العراقية المعتمدة',
              driveUrl: DEFAULT_DRIVE_FOLDER,
            };

            return (
              <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 rounded-3xl border border-sky-200 p-4 sm:p-5 shadow-xs space-y-3 text-right">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-sky-600 text-white shadow-xs shrink-0">📚</span>
                    <div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 inline-block mb-0.5">
                        كتاب {selectedSubject.name} الرسمي
                      </span>
                      <h4 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                        {currentBook.bookTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {currentBook.edition} • متاح للقراءة والتحميل المباشر
                      </p>
                    </div>
                  </div>

                  <a
                    href={currentBook.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>قراءة وتصفح الكتاب مباشرة 📖</span>
                  </a>
                </div>
              </div>
            );
          })()}

          {/* 2. شروحات وفيديوهات اليوتيوب الخاصة بهذه المادة حصراً (مشغل مدمج داخل التطبيق يمنع التشتت) */}
          {(() => {
            // تصفية حصرية صارمة: فيديوهات هذه المرحلة وهذه المادة فقط!
            const subjectVideos = platformVideos.filter(
              (v: any) =>
                v.gradeId === currentGradeId &&
                (v.subjectId === selectedSubject.id ||
                  v.subjectName === selectedSubject.name ||
                  selectedSubject.name.includes(v.subjectName) ||
                  v.subjectName.includes(selectedSubject.name))
            );

            if (subjectVideos.length === 0) {
              return null;
            }

            return (
              <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 space-y-4 text-right">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-rose-600 text-white shadow-xs">🎬</span>
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-white">
                        الشروحات والدروس المرئية المعتمدة لمادة {selectedSubject.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        مشغل داخلي مخصص للدراسة داخل المنصة بدون إعلانات أو خروج لليوتيوب
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-rose-400 border border-slate-700">
                    {subjectVideos.length} فيديو تعليمي
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectVideos.map((vd: any, idx: number) => (
                    <div key={idx} className="bg-slate-900 rounded-2xl p-3 border border-slate-800 space-y-2.5">
                      {/* مشغل منصة المتفوق الداخلي: محمي من الخروج لليوتيوب ومعزول تماماً */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-2xl group">
                        {/* 1. إطار المشغل الداخلي مع حظر فتح النوافذ الخارجية (sandbox يمنع فتح روابط يوتيوب) */}
                        <iframe
                          src={getYouTubeEmbedUrl(vd.youtubeUrl)}
                          title={vd.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                        />

                        {/* 2. شريط حماية علوي يعرض هوية المنصة ويمنع الضغط على عنوان الفيديو لعدم الخروج لليوتيوب */}
                        <div className="absolute top-0 inset-x-0 h-9 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-auto flex items-center justify-between px-3 text-[11px] font-black text-amber-300 z-10 select-none">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>منصة المتفوق التعليمية 🎬</span>
                          </span>
                          <span className="text-[10px] text-slate-300 font-bold bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
                            مشاهدة آمنة داخل التطبيق
                          </span>
                        </div>

                        {/* 3. درع حماية زجاجي يغطي الزاوية السفلية لمنع النقر على شعار يوتيوب المائي */}
                        <div
                          className="absolute bottom-1 right-1 w-32 h-10 pointer-events-auto z-10 cursor-default"
                          title="العرض مخصص داخل منصة المتفوق فقط">
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800">
                          {vd.chapter || 'درس مرئي'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          منصة المتفوق التعليمية 🎬
                        </span>
                      </div>
                      <h5 className="font-black text-xs sm:text-sm text-slate-100 leading-snug">
                        {vd.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}



          {/* 1. مجلد الحروف التفاعلية: للأول والثاني قراءتي */}
          {(currentGradeId === 'grade-1' || currentGradeId === 'grade-2') && isArabicSubject && (
            <details className="group bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 p-4 sm:p-5 transition-all shadow-xs" open={currentGradeId === 'grade-1'}>
              <summary className="cursor-pointer font-black text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm sm:text-base select-none list-none text-center sm:text-right">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🔤</span>
                  <span>مجلد تأسيس ومراجعة الحروف والمقاطع بالحركات ({currentGradeId === 'grade-1' ? 'الصف الأول' : 'الصف الثاني'})</span>
                </span>
                <span className="text-xs bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold group-open:rotate-180 transition-transform">
                  ▼ فتح / غلق المجلد
                </span>
              </summary>
              <div className="mt-4 pt-4 border-t border-amber-200/80">
                <Grade1ArabicReading />
              </div>
            </details>
          )}

          {/* 2. مجلد قصائد وأناشيد المحفوظات مع النطق الصوتي التفاعلي (لكل المراحل) */}
          {isArabicSubject && gradePoems && gradePoems.length > 0 && (
            <details className="group bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl border-2 border-emerald-300 p-4 sm:p-6 transition-all shadow-xs" open>
              <summary className="cursor-pointer font-black text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm sm:text-base select-none list-none text-center sm:text-right">
                <span className="flex items-center gap-2.5">
                  <span className="text-2xl">📜</span>
                  <span>محفوظات وأناشيد الحفظ المقررة (كتابة مع النطق الصوتي والتكرار)</span>
                </span>
                <span className="text-xs bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full font-bold group-open:rotate-180 transition-transform">
                  ▼ فتح / غلق المجلد
                </span>
              </summary>
              <div className="mt-4 pt-4 border-t border-emerald-200 space-y-6">
                {gradePoems.map((poem, pIdx) => {
                  const fullPoemText = poem.verses.map((v) => `${v.l1} ... ${v.l2}`).join('. ');
                  const isSpeakingThis = speakingId === `poem_${pIdx}`;

                  return (
                    <div key={pIdx} className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <h4 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-emerald-600" />
                            <span>{poem.title}</span>
                          </h4>
                          <span className="text-xs text-slate-500 font-bold">{poem.author}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSpeakArabic(fullPoemText, `poem_${pIdx}`)}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                            isSpeakingThis
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isSpeakingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          <span>{isSpeakingThis ? 'إيقاف الإلقاء الصوتي' : '🔊 استمع لإلقاء القصيدة كاملة'}</span>
                        </button>
                      </div>

                      {/* أبيات القصيدة مشكولة بالكامل */}
                      <div className="space-y-2.5 text-center sm:text-right font-serif">
                        {poem.verses.map((v, vIdx) => {
                          const verseText = `${v.l1} ، ${v.l2}`;
                          const isVerseSpeaking = speakingId === `v_${pIdx}_${vIdx}`;

                          return (
                            <div
                              key={vIdx}
                              className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors"
                            >
                              <div className="text-sm sm:text-base font-black text-slate-900 flex-1 leading-relaxed">
                                <span className="inline-block px-2 text-emerald-800">{v.l1}</span>
                                <span className="text-slate-300 font-bold px-1">❊</span>
                                <span className="inline-block px-2 text-teal-900">{v.l2}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSpeakArabic(verseText, `v_${pIdx}_${vIdx}`)}
                                className={`p-2 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
                                  isVerseSpeaking
                                    ? 'bg-rose-100 text-rose-700 animate-pulse'
                                    : 'bg-white hover:bg-emerald-100 text-emerald-700 border border-slate-200'
                                }`}
                                title="نطق هذا البيت"
                              >
                                {isVerseSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {/* 3. مجلد القرآن الكريم والسور والأحاديث النبوية مع التلاوة الصوتية */}
          {isIslamicSubject && gradeIslamic && gradeIslamic.length > 0 && (
            <details className="group bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-3xl border-2 border-amber-300 p-4 sm:p-6 transition-all shadow-xs" open>
              <summary className="cursor-pointer font-black text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm sm:text-base select-none list-none text-center sm:text-right">
                <span className="flex items-center gap-2.5">
                  <span className="text-2xl">🕌</span>
                  <span>القرآن الكريم والأحاديث النبوية الشريفة المقررة للحفظ (كتابة وتلاوة صوتية)</span>
                </span>
                <span className="text-xs bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold group-open:rotate-180 transition-transform">
                  ▼ فتح / غلق المجلد
                </span>
              </summary>
              <div className="mt-4 pt-4 border-t border-amber-200 space-y-6">
                {gradeIslamic.map((item, idx) => {
                  const isSpeakingThis = speakingId === `isl_${idx}`;

                  return (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-amber-200 shadow-2xs space-y-3 text-right">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                            {item.type === 'surah' ? '📖 سورة كريمة' : '✨ حديث نبوي شريف'}
                          </span>
                          <h4 className="font-black text-base text-slate-900">{item.title}</h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSpeakArabic(item.text, `isl_${idx}`)}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                            isSpeakingThis
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          {isSpeakingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          <span>{isSpeakingThis ? 'إيقاف التلاوة' : '🔊 استمع للتلاوة الصوتية'}</span>
                        </button>
                      </div>

                      {/* النص القرآني أو الحديث بالرسم الواضح */}
                      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 font-serif text-base sm:text-lg font-bold text-amber-950 leading-loose text-center sm:text-right">
                        {item.text}
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        💡 <strong>الدروس والعبر: </strong> {item.lessons}
                      </p>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {/* قسم الحروف الإنجليزية التفاعلية مفتوح وظاهر ومباشر للأول والثاني الابتدائي */}
          {(currentGradeId === 'grade-1' || currentGradeId === 'grade-2') && isEnglishSubject && (
            <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 rounded-3xl border-2 border-indigo-300 p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-indigo-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">🔠</span>
                  <div>
                    <h4 className="font-black text-indigo-950 text-base sm:text-lg">
                      بنك الحروف الإنجليزية التفاعلية المباشرة (A إلى Z)
                    </h4>
                    <p className="text-xs text-indigo-800 font-medium">
                      اضغط على أي حرف للاستماع لنطقه بالعربي والإنجليزي وترجمة كلمته فوراً
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-400 text-amber-950 shadow-xs shrink-0">
                  مقرر للأول والثاني 🌟
                </span>
              </div>

              <div>
                <Grade1EnglishLetters />
              </div>
            </div>
          )}

          {/* 4. مجلد اللغة الإنجليزية التفاعلي (English for Iraq) لكافة المراحل */}
          {isEnglishSubject && gradeEnglish && gradeEnglish.length > 0 && (
            <details className="group bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-300 p-4 sm:p-6 transition-all shadow-xs" open>
              <summary className="cursor-pointer font-black text-blue-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm sm:text-base select-none list-none text-center sm:text-right">
                <span className="flex items-center gap-2.5">
                  <span className="text-2xl">🔤</span>
                  <span>English for Iraq - الاستماع والنطق الصوتي والمفردات التفاعلية</span>
                </span>
                <span className="text-xs bg-blue-200 text-blue-900 px-3 py-1 rounded-full font-bold group-open:rotate-180 transition-transform">
                  ▼ فتح / غلق المجلد
                </span>
              </summary>
              <div className="mt-4 pt-4 border-t border-blue-200 space-y-6">
                {gradeEnglish.map((u, uIdx) => (
                  <div key={uIdx} className="bg-white rounded-2xl p-5 border border-blue-200 shadow-2xs space-y-3 text-right">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-900">{u.unit}</span>
                        <h4 className="font-black text-base text-slate-900 mt-1">{u.topic}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {u.items.map((it, itIdx) => {
                        const isSpeakingThis = speakingId === `en_${uIdx}_${itIdx}`;
                        return (
                          <div
                            key={itIdx}
                            className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 flex items-center justify-between gap-3 text-left transition-colors"
                          >
                            <div>
                              <div className="text-sm font-black text-slate-950 font-sans">{it.en}</div>
                              <div className="text-xs font-bold text-slate-600">{it.ar}</div>
                              {it.note && <div className="text-[10px] text-blue-600 mt-0.5">{it.note}</div>}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSpeakEnglish(it.en, `en_${uIdx}_${itIdx}`)}
                              className={`p-2.5 rounded-xl text-xs font-bold cursor-pointer shrink-0 ${
                                isSpeakingThis
                                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                                  : 'bg-white hover:bg-blue-100 text-blue-700 border border-slate-200'
                              }`}
                              title="Listen to native English pronunciation"
                            >
                              {isSpeakingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* التبويبات الرئيسية الثلاثة */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('qa');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qa'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>المنهاج والأسئلة مرتبة بالفصول ({currentSubjectQuestions.length})</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('exams');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'exams'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>📝 الامتحانات والاختبارات المطولة النموذجية</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('curriculum');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'curriculum'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>خطة ومفردات المنهاج</span>
            </button>
          </div>

          {/* Tab 1: الأسئلة مقسمة ومرتبة بدقة حسب الفصول */}
          {activeTab === 'qa' && (
            <div className="space-y-6 pt-2">
              {subjectChapters.map((chapName, chapIdx) => {
                const chapterQuestions = getOrderedQuestionsForChapter(chapName);
                if (chapterQuestions.length === 0) return null;

                return (
                  <div key={chapIdx} className="rounded-3xl border border-slate-200 bg-slate-50/40 overflow-hidden shadow-2xs">
                    <div className="p-4 bg-slate-100/90 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-right">
                        <span className="text-2xl">📁</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                              #{chapIdx + 1}
                            </span>
                            <h4 className="font-black text-sm sm:text-base text-slate-900">
                              {chapName}
                            </h4>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">
                            يتضمن {chapterQuestions.length} سؤال وشرح ونطق صوتي
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playClickSound();
                          onStartQuiz(selectedSubject, chapterQuestions);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-2xs"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>اختبار {chapName} 🎯</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      {chapterQuestions.map((q, idx) => (
                        <QuestionCard
                          key={q.id}
                          question={q}
                          studentSubscription={currentStudent.subscription}
                          onUpgradePrompt={onOpenUpgradeModal}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {currentSubjectQuestions.length === 0 && (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                    📚
                  </div>
                  <p className="text-sm font-bold">
                    لم يقم المعلم أو المشرف بإضافة أسئلة لهذا المنهج بعد.
                  </p>
                  <p className="text-xs text-slate-400">
                    يمكن إضافة الأسئلة بنقرة واحدة من لوحة الإشراف (زر إضافة الأسئلة النموذجية الملونة).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: قسم الامتحانات والاختبارات المطولة النموذجية */}
          {activeTab === 'exams' && (
            <div className="space-y-6 pt-2">
              {/* الامتحان الشامل المطول الذهبي */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-xl shadow-amber-600/15 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                      🏆
                    </span>
                    <div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/25 text-white">
                        الامتحان الشامل والنهائي المطول
                      </span>
                      <h4 className="text-lg sm:text-xl font-black mt-1">
                        الامتحان النموذجي المطول لمادة {selectedSubject.name}
                      </h4>
                      <p className="text-xs text-amber-100 font-medium mt-0.5">
                        اختبار متكامل وشامل يقيس استيعاب كافة فصول المنهج مع التقييم الذكي وشهادة التقدير الرسمية
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={currentSubjectQuestions.length === 0}
                    onClick={() => {
                      playClickSound();
                      onStartQuiz(selectedSubject, currentSubjectQuestions);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0 transition-transform hover:scale-105"
                  >
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>ابدأ الامتحان الشامل المطول الآن ({currentSubjectQuestions.length} سؤال)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/20 text-center text-xs font-bold">
                  <div className="p-2 rounded-xl bg-white/10">⏱️ اختبار شامل ومطول</div>
                  <div className="p-2 rounded-xl bg-white/10">⭐ نجوم تفوق عند النجاح</div>
                  <div className="p-2 rounded-xl bg-white/10">📜 شهادة تقدير فورية</div>
                  <div className="p-2 rounded-xl bg-white/10">🎯 نطق صوتي للأسئلة</div>
                </div>
              </div>

              {/* امتحانات الفصول الدورية */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>امتحانات الفصول الدورية (اختبر معلوماتك فصلاً بفصل):</span>
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    {subjectChapters.length} فصول مقررة
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjectChapters.map((chapName, chapIdx) => {
                    const chapterQuestions = getOrderedQuestionsForChapter(chapName);
                    const hasQuestions = chapterQuestions.length > 0;

                    return (
                      <div
                        key={chapIdx}
                        className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between text-right ${
                          hasQuestions
                            ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm'
                            : 'bg-slate-50 border-slate-200/60 opacity-70'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900">
                              امتحان الفصل #{chapIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                              {chapterQuestions.length} سؤال
                            </span>
                          </div>

                          <h5 className="font-black text-sm text-slate-900">
                            {chapName}
                          </h5>
                          <p className="text-xs text-slate-500">
                            اختبار تدريبي وتقييمي شامل لأسئلة وتعاليل وتعريفات هذا الفصل
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>تصحيح فوري ذكي</span>
                          </span>

                          <button
                            disabled={!hasQuestions}
                            onClick={() => {
                              playClickSound();
                              onStartQuiz(selectedSubject, chapterQuestions);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>بدء امتحان الفصل</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 text-right">
              <h4 className="font-black text-slate-900 text-base">
                مفردات ومنهاج {selectedSubject.name} - {gradeInfo?.name}
              </h4>
              <p>
                يتضمن هذا المنهج {selectedSubject.lessonsCount} درساً تدريبياً مع تمارين واختبارات تفاعلية، متطابقة مع كتاب وزارة التربية العراقية الرسمي.
              </p>
              <div className="p-4 rounded-xl bg-white border border-slate-200 font-medium">
                💡 <strong>نصيحة للمتفوق:</strong> يمكنك الاستماع للنطق الصوتي للأشعار والآيات الكريمة والأسئلة لترسيخ المعلومات قبل خوض الامتحان المطول للحصول على وسام التفوق الذهبي.
              </div>
            </div>
          )}
        </div>
      )}
          {/* ================= 1. عارض الكتب التفاعلي المدمج (تجاوز تسجيل الدخول في جوجل) ================= */}
      {selectedBookForViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-700">
            {/* Header */}
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <div>
                  <h4 className="font-black text-sm text-amber-300">{selectedBookForViewer.title}</h4>
                  <span className="text-[11px] text-slate-400">تصفح الكتاب الرسمي مباشرة بدون الحاجة لحساب جوجل</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://drive.google.com/uc?export=download&id=${extractDriveFileId(selectedBookForViewer.driveLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <span>📥 تحميل PDF</span>
                </a>
                <button
                  onClick={() => setSelectedBookForViewer(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-sm flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Iframe Viewer */}
            <div className="flex-1 w-full bg-slate-800 relative">
              <iframe
                src={`https://drive.google.com/file/d/${extractDriveFileId(selectedBookForViewer.driveLink)}/preview`}
                title={selectedBookForViewer.title}
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. نافذة التعديل السريع للسؤال (مثل نظام المنتدى) ================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-2 border-amber-400 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-black">
                <span className="text-xl">✏️</span>
                <h4>تعديل السؤال المنهجي (صلاحيات المدير)</h4>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateQuestion(editingQuestion.id, editingQuestion);
                playCorrectSound();
                alert('تم تحديث السؤال وحفظه سحابياً بنجاح ✓');
                setEditingQuestion(null);
              }}
              className="space-y-3 text-right"
            >
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">نص السؤال:</label>
                <textarea
                  value={editingQuestion.questionText}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-amber-400 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">الإجابة والشرح النموذجي:</label>
                <textarea
                  value={editingQuestion.answerText}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, answerText: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 outline-hidden"
                  required
                />
              </div>

              {editingQuestion.options && editingQuestion.options.length > 0 && (
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">الخيارات الأربعة (حدد الإجابة الصحيحة):</label>
                  <div className="space-y-1.5">
                    {editingQuestion.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={editingQuestion.correctAnswerIndex === oIdx}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswerIndex: oIdx })}
                          className="w-4 h-4 text-emerald-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(editingQuestion.options || [])];
                            newOpts[oIdx] = e.target.value;
                            setEditingQuestion({ ...editingQuestion, options: newOpts });
                          }}
                          className="flex-1 p-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingQuestion.isVipOnly || false}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, isVipOnly: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                  <span>خاص بمشتركي VIP 👑</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black cursor-pointer shadow-md"
                >
                  حفظ التعديل سحابياً ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 3. نافذة تعديل الفيديو (صلاحيات المدير) ================= */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-blue-400 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-black text-sm text-slate-900">تعديل شرح الفيديو 🎬</h4>
              <button onClick={() => setEditingVideo(null)} className="font-bold text-slate-500">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">عنوان الفيديو:</label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">رابط يوتيوب أو الفيديو:</label>
                <input
                  type="text"
                  value={editingVideo.youtubeUrl}
                  onChange={(e) => setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">الفصل أو الدرس:</label>
                <input
                  type="text"
                  value={editingVideo.chapter || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, chapter: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={async () => {
                    const updated = platformVideos.map(v => v.id === editingVideo.id ? editingVideo : v);
                    setPlatformVideos(updated);
                    try {
                      const { setDoc, doc } = await import('firebase/firestore');
                      await setDoc(doc(db, 'videos', editingVideo.id), editingVideo);
                    } catch (e) {
                      console.error('Error saving edited video:', e);
                    }
                    alert('تم حفظ تعديل الفيديو سحابياً ✓');
                    setEditingVideo(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer shadow-md"
                >
                  حفظ التعديل ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. نافذة تعديل رابط الكتاب أو الملزمة ================= */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-emerald-400 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-black text-sm text-slate-900">تعديل رابط كتاب {editingBook.subjectName} 📖</h4>
              <button onClick={() => setEditingBook(null)} className="font-bold text-slate-500">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">رابط جوجل درايف أو رابط الـ PDF المباشر:</label>
                <input
                  type="text"
                  value={editingBook.driveLink}
                  onChange={(e) => setEditingBook({ ...editingBook, driveLink: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  يمكنك وضع أي رابط جوجل درايف عام، أو رابط ملف PDF مباشر.
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(`iraq_edu_book_override_${selectedSubject.id}`, editingBook.driveLink);
                    alert('تم تحديث رابط الكتاب بنجاح ✓');
                    setEditingBook(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md"
                >
                  حفظ الرابط ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
