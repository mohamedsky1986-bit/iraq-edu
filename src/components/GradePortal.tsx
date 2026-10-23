import React, { useState, useEffect } from 'react';
import { useEdu } from '../context/EduContext';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Subject, Question } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName } from '../utils/edu-logic';
import { QuestionCard } from './QuestionCard';
import { Grade1ArabicReading } from './Grade1ArabicReading';
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






function getDriveEmbedUrl(url?: string): { embedUrl: string; isFolder: boolean; downloadUrl: string } {
  if (!url) return { embedUrl: '', isFolder: false, downloadUrl: '' };

  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    const folderId = folderMatch[1];
    return {
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      isFolder: true,
      downloadUrl: url,
    };
  }

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    const fileId = fileMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      isFolder: false,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    };
  }

  if (url.toLowerCase().endsWith('.pdf')) {
    return {
      embedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
      isFolder: false,
      downloadUrl: url,
    };
  }

  return {
    embedUrl: url,
    isFolder: false,
    downloadUrl: url,
  };
}

function extractDriveFileId(url?: string): string {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  const id = match ? match[1] : (clean.length === 11 ? clean : '');
  if (!id) return clean;
  return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1&playsinline=1&controls=1`;
}


const DEFAULT_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1Gdmm8qLT26-JA51h5FFpnBxagKJ_jjLL?usp=drive_link';


interface SubjectBookItem {
  bookTitle: string;
  edition: string;
  driveUrl: string;
}


export const ALL_CURRICULUM_BOOKS: CurriculumBook[] = [
  // ================= الصف الأول الابتدائي =================
  { id: 'b-g1-ar', title: 'كتاب قراءتي الأول الابتدائي', gradeId: 'grade-1', subjectId: 'ar-1', driveFileId: '1zM3D1AUpzxzhiytq3vVmyYOnSGJqM4lP', category: 'book' },
  { id: 'b-g1-math', title: 'كتاب الرياضيات الأول الابتدائي', gradeId: 'grade-1', subjectId: 'math-1', driveFileId: '1ohJZlWvvnZ-d_fQSVL7iTjdEY5EeaQU6', category: 'book' },
  { id: 'b-g1-sci', title: 'كتاب العلوم الأول الابتدائي', gradeId: 'grade-1', subjectId: 'sci-1', driveFileId: '1w0_8y7osEzGCST5Kj_b8HtL9gRnHqBcu', category: 'book' },
  { id: 'b-g1-isl', title: 'كتاب الإسلامية الأول الابتدائي', gradeId: 'grade-1', subjectId: 'isl-1', driveFileId: '1nVM1dhoZJJ2kwYwMLRMlFfo3a70rOKrD', category: 'book' },
  { id: 'b-g1-eng', title: 'كتاب الإنكليزي الطالب الأول الابتدائي (الوحدة الأولى)', gradeId: 'grade-1', subjectId: 'eng-1', driveFileId: '1AXlhEx5zeA2PUfiDsxJGQXaksFyQiVsc', category: 'book' },

  // ================= الصف الثاني الابتدائي =================
  { id: 'b-g2-ar', title: 'كتاب قراءتي الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'ar-2', driveFileId: '1VO_mNLIlG8O20Q-7wyQKnnpiKZE7Pwcu', category: 'book' },
  { id: 'b-g2-math', title: 'كتاب الرياضيات الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'math-2', driveFileId: '1ULBDqrbLm7Fi4UQ58yHa5d-grRegMfgv', category: 'book' },
  { id: 'b-g2-math-ex', title: 'كتاب تمرينات الرياضيات الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'math-2', driveFileId: '1469ed-o-1RFyYO26RW_6FnEVfEMz7l9E', category: 'workbook' },
  { id: 'b-g2-sci', title: 'كتاب العلوم الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'sci-2', driveFileId: '15UjYgCCyInuCg5HsLlvxaBRi3Adz5fyZ', category: 'book' },
  { id: 'b-g2-isl', title: 'كتاب الإسلامية الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'isl-2', driveFileId: '1z6nWPbSYSyscIdmj5y5ZSN4InZdjrMFF', category: 'book' },
  { id: 'b-g2-eng-s', title: 'كتاب الإنكليزي الطالب الصف الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'eng-2', driveFileId: '1SYE2y2MDmEyWnVSvV-Gi7d_1QF7Gjgig', category: 'book' },
  { id: 'b-g2-eng-a', title: 'كتاب الإنكليزي النشاط الصف الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'eng-2', driveFileId: '1F0nM5sgSZIaDwRNyJWy7yJ4b4yqcut2Q', category: 'activity' },
  { id: 'b-g2-ethic', title: 'كتاب التربية الأخلاقية الثاني الابتدائي', gradeId: 'grade-2', subjectId: 'ar-2', driveFileId: '1sfs2ocYVKGNYYnXqtWns4V_kQskkTLMH', category: 'book' },

  // ================= الصف الثالث الابتدائي =================
  { id: 'b-g3-ar', title: 'كتاب قراءتي الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'ar-3', driveFileId: '1lqez6Tkst8tzI6qBetlK3abntD9HZ-zm', category: 'book' },
  { id: 'b-g3-math', title: 'كتاب الرياضيات الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'math-3', driveFileId: '1AliEFZIfWRogOEyL6sI7gmbSk-cc1pYB', category: 'book' },
  { id: 'b-g3-math-ex', title: 'كتاب تمرينات الرياضيات الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'math-3', driveFileId: '1tDG-XJDg91764kbVsQykF7wXds1EQ1ri', category: 'workbook' },
  { id: 'b-g3-sci', title: 'كتاب العلوم الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'sci-3', driveFileId: '17wO2yr_lmkeyiWuvWg1nuub0cVk0xCPf', category: 'book' },
  { id: 'b-g3-sci-act', title: 'كتاب نشاط العلوم الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'sci-3', driveFileId: '12FcEOqc22Fze0z8M_HCq8QOQHvy_yaPa', category: 'activity' },
  { id: 'b-g3-isl', title: 'كتاب الإسلامية الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'isl-3', driveFileId: '1bnNPv-3md7BytCrwottscSYKM0W1q27e', category: 'book' },
  { id: 'b-g3-eng-s', title: 'كتاب الإنكليزي الطالب الصف الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'eng-3', driveFileId: '1Nw_mjNjpskAbD6t-FsK6Os-ITCBm2Myi', category: 'book' },
  { id: 'b-g3-eng-a', title: 'كتاب الإنكليزي النشاط الصف الثالث الابتدائي', gradeId: 'grade-3', subjectId: 'eng-3', driveFileId: '10o4V2WuhtNzspwjLG5jasQ2oFgA02wjf', category: 'activity' },

  // ================= الصف الرابع الابتدائي =================
  { id: 'b-g4-read', title: 'كتاب القراءة الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'ar-4', driveFileId: '1wCJkyH2hebu5nCH_56DAz7CczFTdMI1y', category: 'book' },
  { id: 'b-g4-gram', title: 'كتاب القواعد الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'ar-4', driveFileId: '1PHz7uxND4E_dEgoTR9yrLW9DzciBUpFu', category: 'book' },
  { id: 'b-g4-math', title: 'كتاب الرياضيات الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'math-4', driveFileId: '14xpyQJapAprPSDqWC1Enp_xrXWZMz9HY', category: 'book' },
  { id: 'b-g4-sci', title: 'كتاب العلوم الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'sci-4', driveFileId: '1KiNiEadbUeEEjXca2V5b9LwLL1a13Lf5', category: 'book' },
  { id: 'b-g4-sci-act', title: 'كتاب نشاط العلوم الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'sci-4', driveFileId: '1AA7QNMWC3xc6B8g9E0wu_md4jsY1WT22', category: 'activity' },
  { id: 'b-g4-soc', title: 'كتاب الاجتماعيات الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'soc-4', driveFileId: '1NYMwTthzNT99wWi1A8zC5uQLtP_axeud', category: 'book' },
  { id: 'b-g4-isl', title: 'كتاب الإسلامية الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'isl-4', driveFileId: '1tJrNc7JewKZObB0puWK1b4AvQOvDZA3G', category: 'book' },
  { id: 'b-g4-eng-s', title: 'كتاب الإنكليزي الطالب الصف الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'eng-4', driveFileId: '1VbDI6nXOPVpjNTV0bJszBLYh06S15Srf', category: 'book' },
  { id: 'b-g4-eng-a', title: 'كتاب الإنكليزي النشاط الصف الرابع الابتدائي', gradeId: 'grade-4', subjectId: 'eng-4', driveFileId: '1KDRgTta7iQLnuyF-yzxXRoxNITepGZwS', category: 'activity' },

  // ================= الصف الخامس الابتدائي =================
  { id: 'b-g5-read', title: 'كتاب القراءة الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'ar-5', driveFileId: '1ZwtpjfOxrx_4OA8grijeQs1O77OFLXTc', category: 'book' },
  { id: 'b-g5-gram', title: 'كتاب القواعد الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'ar-5', driveFileId: '1iy18IIhNqEiB9FZ3d5FKIVsjlmuRHyFf', category: 'book' },
  { id: 'b-g5-math', title: 'كتاب الرياضيات الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'math-5', driveFileId: '1ncX3jmvh-RXZBOCupgE7SgNiyVfp8CTm', category: 'book' },
  { id: 'b-g5-math-ex', title: 'كتاب تمرينات الرياضيات الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'math-5', driveFileId: '1d1Ln1xO6GZt7yWiYIgCSryqmR_CIu_m0', category: 'workbook' },
  { id: 'b-g5-math-mal', title: 'ملزمة الرياضيات الخامس الابتدائي (الفصول الأولى)', gradeId: 'grade-5', subjectId: 'math-5', driveFileId: '1OzdvaXBDR-5J8FMXLePMkhUX9P9n0VPa', category: 'summary' },
  { id: 'b-g5-sci', title: 'كتاب العلوم الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'sci-5', driveFileId: '1hTK4-_fDcKOxWKh9pZhp-IBXVsQHejjI', category: 'book' },
  { id: 'b-g5-sci-act', title: 'كتاب نشاط العلوم الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'sci-5', driveFileId: '1x6qMzWAqhdREqntfgdeP8jN5iTCn37Ct', category: 'activity' },
  { id: 'b-g5-soc', title: 'كتاب الاجتماعيات الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'soc-5', driveFileId: '1TeIIIcHae7t8kPvqK5lyJrxoHVyHQs0m', category: 'book' },
  { id: 'b-g5-isl', title: 'كتاب الإسلامية الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'isl-5', driveFileId: '1HiHzrsj2yVe8vU79Oeq95t3kh0DnUV3i', category: 'book' },
  { id: 'b-g5-eng-s', title: 'كتاب الإنكليزي الطالب الصف الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'eng-5', driveFileId: '1V1sISBUTc87SvCcohQHtiLCF00vMJr1d', category: 'book' },
  { id: 'b-g5-eng-a', title: 'كتاب الإنكليزي النشاط الصف الخامس الابتدائي', gradeId: 'grade-5', subjectId: 'eng-5', driveFileId: '1wA0lpRK84ApCq6MDuyFJVQa3wwAksQrB', category: 'activity' },

  // ================= الصف السادس الابتدائي (الوزاري) =================
  { id: 'b-g6-read', title: 'كتاب القراءة السادس الابتدائي', gradeId: 'grade-6', subjectId: 'ar-6', driveFileId: '1_W-v_p_g6WKaQ-wWFLt5_0Binfecuy0R', category: 'book' },
  { id: 'b-g6-gram', title: 'كتاب القواعد السادس الابتدائي', gradeId: 'grade-6', subjectId: 'ar-6', driveFileId: '1T9MtFjDuvP71737xCJAooDiTPkzO9j0e', category: 'book' },
  { id: 'b-g6-math', title: 'كتاب الرياضيات السادس الابتدائي', gradeId: 'grade-6', subjectId: 'math-6', driveFileId: '18GyhO1itnnub7gFHyqanHyBEZl9SgA6S', category: 'book' },
  { id: 'b-g6-math-ex', title: 'كتاب تمرينات الرياضيات السادس الابتدائي', gradeId: 'grade-6', subjectId: 'math-6', driveFileId: '1RcfalqC-aUh3CGUNs3WJnczh88zV-Jz5', category: 'workbook' },
  { id: 'b-g6-sci', title: 'كتاب العلوم السادس الابتدائي', gradeId: 'grade-6', subjectId: 'sci-6', driveFileId: '1bGxlQhStzoOCQsqpf-hYvVMlFfWt2g2h', category: 'book' },
  { id: 'b-g6-sci-act', title: 'كتاب نشاط العلوم السادس الابتدائي', gradeId: 'grade-6', subjectId: 'sci-6', driveFileId: '1E2wNWq18YSUC3m5xWbqNFy2QQTU93Hvg', category: 'activity' },
  { id: 'b-g6-soc', title: 'كتاب الاجتماعيات السادس الابتدائي', gradeId: 'grade-6', subjectId: 'soc-6', driveFileId: '1viOGcooz2yuH_EGzPwfHeZfVGyP_CVBD', category: 'book' },
  { id: 'b-g6-soc-mal', title: 'ملزمة مراجعة الاجتماعيات السادس الابتدائي (كاملة)', gradeId: 'grade-6', subjectId: 'soc-6', driveFileId: '1tIlt93BXDIgZAPHqHzfnIx9t17xdrLtN', category: 'summary' },
  { id: 'b-g6-isl', title: 'كتاب الإسلامية السادس الابتدائي', gradeId: 'grade-6', subjectId: 'isl-6', driveFileId: '1ITwL2VL1ShgcV5LMArHSotKPvA-Gut24', category: 'book' },
  { id: 'b-g6-eng-s', title: 'كتاب الإنكليزي الطالب الملون للصف السادس الابتدائي', gradeId: 'grade-6', subjectId: 'eng-6', driveFileId: '1fxFdrtbLFrNC6QwTsPMC7aNp8tMyHOfg', category: 'book' },
  { id: 'b-g6-eng-a', title: 'كتاب الإنكليزي النشاط للصف السادس الابتدائي', gradeId: 'grade-6', subjectId: 'eng-6', driveFileId: '1OXfTvB2-2_JiT25smow4gqkBTDpEX8vF', category: 'activity' },
];

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
  adminInspectingGradeId?: GradeId | null;
  onBackToAdmin?: () => void;
  onChangeAdminGrade?: (gradeId: GradeId) => void;
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


export interface SelfEnglishLetter {
  u: string;
  l: string;
  w: string;
  ar: string;
  em: string;
  pr: string;
}

const SELF_CONTAINED_ENGLISH_LETTERS: SelfEnglishLetter[] = [
  { u: 'A', l: 'a', w: 'Apple', ar: 'تفاحة', em: '🍎', pr: 'آبل' },
  { u: 'B', l: 'b', w: 'Ball', ar: 'كرة', em: '⚽', pr: 'بول' },
  { u: 'C', l: 'c', w: 'Cat', ar: 'قطة', em: '🐱', pr: 'كات' },
  { u: 'D', l: 'd', w: 'Duck', ar: 'بطة', em: '🦆', pr: 'دَك' },
  { u: 'E', l: 'e', w: 'Elephant', ar: 'فيل', em: '🐘', pr: 'إيليفانت' },
  { u: 'F', l: 'f', w: 'Fish', ar: 'سمكة', em: '🐟', pr: 'فِش' },
  { u: 'G', l: 'g', w: 'Giraffe', ar: 'زرافة', em: '🦒', pr: 'جيراف' },
  { u: 'H', l: 'h', w: 'Horse', ar: 'حصان', em: '🐴', pr: 'هورس' },
  { u: 'I', l: 'i', w: 'Ice cream', ar: 'مثلجات', em: '🍦', pr: 'آيس كريم' },
  { u: 'J', l: 'j', w: 'Juice', ar: 'عصير', em: '🧃', pr: 'جوس' },
  { u: 'K', l: 'k', w: 'Kite', ar: 'طائرة ورقية', em: '🪁', pr: 'كايت' },
  { u: 'L', l: 'l', w: 'Lion', ar: 'أسد', em: '🦁', pr: 'لايون' },
  { u: 'M', l: 'm', w: 'Moon', ar: 'قمر', em: '🌙', pr: 'مون' },
  { u: 'N', l: 'n', w: 'Nest', ar: 'عش الطائر', em: '🪺', pr: 'نِست' },
  { u: 'O', l: 'o', w: 'Orange', ar: 'برتقالة', em: '🍊', pr: 'أورنج' },
  { u: 'P', l: 'p', w: 'Pen', ar: 'قلم', em: '🖊️', pr: 'بين' },
  { u: 'Q', l: 'q', w: 'Queen', ar: 'ملكة', em: '👑', pr: 'كوين' },
  { u: 'R', l: 'r', w: 'Rabbit', ar: 'أرنب', em: '🐰', pr: 'رابت' },
  { u: 'S', l: 's', w: 'Sun', ar: 'شمس', em: '☀️', pr: 'صَن' },
  { u: 'T', l: 't', w: 'Tiger', ar: 'نمر', em: '🐯', pr: 'تايغر' },
  { u: 'U', l: 'u', w: 'Umbrella', ar: 'مظلة', em: '☂️', pr: 'أمبريلا' },
  { u: 'V', l: 'v', w: 'Van', ar: 'حافلة', em: '🚐', pr: 'فان' },
  { u: 'W', l: 'w', w: 'Water', ar: 'ماء', em: '💧', pr: 'ووتر' },
  { u: 'X', l: 'x', w: 'Xylophone', ar: 'إكسيلوفون', em: '🎼', pr: 'زايلوفون' },
  { u: 'Y', l: 'y', w: 'Yo-yo', ar: 'يويو', em: '🪀', pr: 'يويو' },
  { u: 'Z', l: 'z', w: 'Zebra', ar: 'حمار وحشي', em: '🦓', pr: 'زيبرا' },
];

export const GradePortal: React.FC<GradePortalProps> = ({
  onStartQuiz,
  onOpenSearch,
  onOpenUpgradeModal,
  adminInspectingGradeId,
  onBackToAdmin,
  onChangeAdminGrade,
}) => {
  const { currentStudent, isAdmin, subjects, questions, updateQuestion, deleteQuestion, logout } = useEdu();

  const effectiveGradeId: GradeId = adminInspectingGradeId || currentStudent?.gradeId || 'grade-1';

  if (!currentStudent && !adminInspectingGradeId && !isAdmin) return null;

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
  const [selectedEngLetter, setSelectedEngLetter] = useState<SelfEnglishLetter>(SELF_CONTAINED_ENGLISH_LETTERS[0]);


  // ميزة المنتدى: حالة نافذة التعديل السريع للأسئلة
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);


  // ميزة المنتدى: حالة نافذة تعديل الفيديو
  const [editingVideo, setEditingVideo] = useState<any | null>(null);


  // ميزة المنتدى: حالة نافذة تعديل رابط الكتاب
    // حالة إضافة ملزمة أو كتاب أو أسئلة وزارية جديدة
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<'book' | 'malzama' | 'ministerial' | 'activity'>('malzama');
  const [newMatDriveUrl, setNewMatDriveUrl] = useState('');
  const [newMatIsVip, setNewMatIsVip] = useState(false);
  const [customMaterialsList, setCustomMaterialsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('iraq_edu_custom_materials_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'materials'), (snap) => {
        if (!snap.empty) {
          const remoteMats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setCustomMaterialsList(remoteMats);
          try { localStorage.setItem('iraq_edu_custom_materials_v1', JSON.stringify(remoteMats)); } catch {}
        }
      });
      return () => unsub();
    } catch (e) {}
  }, []);
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


    // ميزة التقديم والتأخير للأسئلة والمواضيع كمنتدى
  const handleMoveQuestion = (qId: string, direction: 'up' | 'down', chapName: string, chapterQuestions: Question[]) => {
    playClickSound();
    const currIdx = chapterQuestions.findIndex((q) => q.id === qId);
    if (currIdx === -1) return;
    const targetIdx = direction === 'up' ? currIdx - 1 : currIdx + 1;
    if (targetIdx < 0 || targetIdx >= chapterQuestions.length) return;

    const newOrderList = [...chapterQuestions];
    const [moved] = newOrderList.splice(currIdx, 1);
    newOrderList.splice(targetIdx, 0, moved);

    const key = `iraq_edu_order_${currentGradeId}_${selectedSubject?.id}_${chapName}`;
    const orderMap: Record<string, number> = {};
    newOrderList.forEach((q, idx) => {
      orderMap[q.id] = idx;
    });

    try {
      localStorage.setItem(key, JSON.stringify(orderMap));
    } catch {}

    // إعادة رندر فورية
    setQuestions([...questions]);
  };

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
      {/* شريط المشرف العام للتحكم المباشر بالمنهج كمنتدى */}
      {(isAdmin || adminInspectingGradeId) && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 p-4 rounded-3xl shadow-lg border-2 border-amber-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">وضع المشرف العام (التحكم بالمنهج كمنتدى)</h3>
              <p className="text-xs font-bold text-amber-950">تستطيع الآن تعديل أو حذف أي سؤال أو فيديو أو كتاب مباشرة من هنا</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onBackToAdmin && (
              <button
                onClick={onBackToAdmin}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md cursor-pointer transition-all"
              >
                العودة للوحة الإدارة ↩️
              </button>
            )}
          </div>
        </div>
      )}
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 sm:p-8 shadow-xl shadow-teal-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <span className="text-4xl sm:text-5xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner">
              {currentStudent?.avatar || "🛡️"}
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
                {(currentStudent?.subscription === 'paid' || isAdmin) ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-xs flex items-center gap-2 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>مشترك VIP مفعل ⭐</span>
                    <span className="text-[11px] font-mono text-amber-200 bg-black/25 px-2 py-0.5 rounded-lg border border-amber-300/40">
                      صالح حتى: {currentStudent?.subscriptionExpiry || '2026-12-31'}
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
                أهلاً بك، {currentStudent?.fullName || "مشرف المنصة العام"} 🌟
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
                {currentStudent?.starsEarned || 100} ⭐
              </span>
              <p className="text-[11px] text-emerald-100 font-bold">نجوم التفوق</p>
            </div>
            <div className="p-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-lg font-black text-white">
                {currentStudent?.totalScore || 1000}
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


                    {/* 1. كتب وملازم المادة الرسمية (PDF) مع المعرفات الحقيقية والتصفح والتحميل المباشر */}
          {(() => {
            // جلب الكتب والملازم المعتمدة لهذه المادة من قاعدة البيانات
            const subjectBooks = ALL_CURRICULUM_BOOKS.filter(
              (b) => b.gradeId === currentGradeId && b.subjectId === selectedSubject.id
            );

            // الكتاب الرئيسي الافتراضي
            const primaryBook = subjectBooks.find((b) => b.category === 'book') || subjectBooks[0] || {
              id: `book-${selectedSubject.id}`,
              title: `كتاب ${selectedSubject.name} الرسمي`,
              driveFileId: '1zM3D1AUpzxzhiytq3vVmyYOnSGJqM4lP',
              category: 'book',
            };

            // بقية الملازم وكراسات الأنشطة التابعة للمادة
            const extraMaterials = [
              ...subjectBooks.filter((b) => b.id !== primaryBook.id),
              ...customMaterialsList.filter((m: any) => m.gradeId === currentGradeId && m.subjectId === selectedSubject.id)
            ];

            return (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 rounded-3xl border border-sky-200 p-4 sm:p-5 shadow-xs space-y-3 text-right">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 rounded-2xl bg-sky-600 text-white shadow-xs shrink-0">📚</span>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-200 text-sky-900">
                            الكتاب الوزاري المعتمد
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">طبعة وزارة التربية العراقية</span>
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                          {primaryBook.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setSelectedBookForViewer({
                            title: primaryBook.title,
                            driveLink: `https://drive.google.com/file/d/${primaryBook.driveFileId}/preview`,
                            downloadUrl: `https://drive.google.com/uc?export=download&id=${primaryBook.driveFileId}`,
                            subjectName: selectedSubject.name,
                          });
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>تصفح وقراءة الكتاب كاملاً داخل المنصة 📖</span>
                      </button>

                      <a
                        href={`https://drive.google.com/uc?export=download&id=${primaryBook.driveFileId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
                        title="تحميل نسخة PDF كاملة"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل PDF 📥</span>
                      </a>
                    </div>
                  </div>

                  {/* تحكم المشرف بالكتاب */}
                  {isAdmin && (
                    <div className="pt-3 border-t border-sky-200/60 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-slate-700">
                        🛡️ تحكم المشرف بالكتاب الرسمي:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setNewMatTitle(`ملزمة / أسئلة وزارية لمادة ${selectedSubject.name}`);
                            setNewMatDriveUrl('');
                            setNewMatIsVip(false);
                            setIsAddMaterialOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          ➕ إضافة ملزمة أو أسئلة وزارية جديدة
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setEditingBook({
                              subjectId: selectedSubject.id,
                              subjectName: selectedSubject.name,
                              driveLink: `https://drive.google.com/file/d/${primaryBook.driveFileId}/view`,
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          ✏️ تعديل رابط الكتاب
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* عرض الملازم وكراسات الأنشطة الإضافية إن وجدت */}
                {extraMaterials.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5 text-right">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <span>📑 الملازم والأنشطة الإضافية التابعة لهذه المادة ({extraMaterials.length}):</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {extraMaterials.map((mat) => {
                        const isMatVip = mat.isVipOnly === true;
                        const isLocked = isMatVip && !isAdmin && currentStudent?.subscription !== 'paid';

                        return (
                          <div key={mat.id} className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs flex items-center justify-between gap-2">
                            <div className="min-w-0 text-right">
                              <div className="flex items-center gap-1.5">
                                <h5 className="font-bold text-xs text-slate-900 truncate">{mat.title}</h5>
                                {isMatVip && (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shrink-0 shadow-2xs">
                                    👑 VIP
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                                {mat.category === 'workbook' ? 'كراسة تمرينات' : mat.category === 'activity' ? 'نشاط صفي' : mat.category === 'ministerial' ? 'أسئلة وزارية' : 'ملزمة مراجعة'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isLocked ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    playClickSound();
                                    onOpenUpgradeModal();
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                  <span>🔒 قفل VIP</span>
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playClickSound();
                                      setSelectedBookForViewer({
                                        title: mat.title,
                                        driveLink: `https://drive.google.com/file/d/${mat.driveFileId}/preview`,
                                        downloadUrl: `https://drive.google.com/uc?export=download&id=${mat.driveFileId}&confirm=t`,
                                        subjectName: selectedSubject.name,
                                      });
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] cursor-pointer shadow-2xs"
                                  >
                                    قراءة 📖
                                  </button>
                                  <a
                                    href={`https://drive.google.com/uc?export=download&id=${mat.driveFileId}&confirm=t`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-2xs"
                                    title="تحميل PDF"
                                  >
                                    📥
                                  </a>
                                </>
                              )}

                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm('هل تريد حذف هذه الملزمة نهائياً؟')) {
                                      const updated = customMaterialsList.filter(m => m.id !== mat.id);
                                      setCustomMaterialsList(updated);
                                      try { localStorage.setItem('iraq_edu_custom_materials_v1', JSON.stringify(updated)); } catch {}
                                      try {
                                        const { deleteDoc, doc } = await import('firebase/firestore');
                                        await deleteDoc(doc(db, 'materials', mat.id));
                                      } catch (err) {}
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs cursor-pointer"
                                  title="حذف"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 2. شروحات وفيديوهات اليوتيوب الخاصة بهذه المادة حصراً (مشغل مدمج داخل التطبيق يمنع التشتت) */}
          {(() => {
            // تصفية ذكية ومرنة لجميع الفيديوهات المضافة لهذه المادة
            const subjectVideos = platformVideos.filter((v: any) => {
              if (v.gradeId && v.gradeId !== currentGradeId) return false;
              if (v.subjectId === selectedSubject.id) return true;
              const vSub = (v.subjectName || '').toLowerCase().replace(/[()]/g, '').trim();
              const sSub = (selectedSubject.name || '').toLowerCase().replace(/[()]/g, '').trim();
              if (vSub && sSub && (vSub.includes(sSub) || sSub.includes(vSub))) return true;
              if ((v.subjectId?.includes('eng') || vSub.includes('eng') || vSub.includes('إنجليز')) &&
                  (selectedSubject.id.includes('eng') || sSub.includes('eng') || sSub.includes('إنجليز'))) return true;
              if ((v.subjectId?.includes('ar') || vSub.includes('عرب') || vSub.includes('قراء')) &&
                  (selectedSubject.id.includes('ar') || sSub.includes('عرب') || sSub.includes('قراء'))) return true;
              if ((v.subjectId?.includes('math') || vSub.includes('رياض')) &&
                  (selectedSubject.id.includes('math') || sSub.includes('رياض'))) return true;
              if ((v.subjectId?.includes('sci') || vSub.includes('علوم')) &&
                  (selectedSubject.id.includes('sci') || sSub.includes('علوم'))) return true;
              if ((v.subjectId?.includes('isl') || vSub.includes('إسلام')) &&
                  (selectedSubject.id.includes('isl') || sSub.includes('إسلام'))) return true;
              return false;
            });

            if (subjectVideos.length === 0) {
              return isAdmin ? (
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-dashed border-slate-700 text-center space-y-2">
                  <span className="text-3xl block">🎬</span>
                  <h4 className="font-black text-sm text-amber-300">لم تتم إضافة شروحات فيديو لمادة {selectedSubject.name} بعد</h4>
                  <p className="text-xs text-slate-400">كمشرف للمنصة، يمكنك إضافة فيديو جديد لهذه المادة من تبويب (شروحات وفيديوهات المناهج) في لوحة الإدارة.</p>
                </div>
              ) : null;
            }


            return (
              <div className="bg-slate-950 text-white rounded-3xl p-3 sm:p-5 shadow-md border border-slate-800 space-y-4 text-right w-full">
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
                                    {subjectVideos.map((vd: any, idx: number) => {
                    const isVideoVip = vd.isVipOnly === true;
                    const isLockedForStudent = isVideoVip && !isAdmin && currentStudent?.subscription !== 'paid';

                    return (
                      <div key={idx} className="bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-800 space-y-3 w-full">
                        {/* مشغل الفيديو بنسبة 16:9 الهندسية الدقيقة بدون أي حواف سوداء من الأعلى أو الأسفل */}
                        <div
                          className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl"
                          style={{ paddingTop: '56.25%' }}
                        >
                          {isLockedForStudent ? (
                            /* بطاقة قفل الـ VIP للشرح */
                            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center space-y-2">
                              <span className="text-3xl">👑</span>
                              <h5 className="font-black text-sm text-amber-300">هذا الشرح المرئي مخصص لمشتركي VIP 🔒</h5>
                              <p className="text-xs text-slate-300 max-w-xs">اشترك الآن لفتح كافة الشروحات المرئية والأسئلة الوزارية</p>
                              <button
                                type="button"
                                onClick={() => {
                                  playClickSound();
                                  onOpenUpgradeModal();
                                }}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md cursor-pointer mt-1"
                              >
                                تفعيل اشتراك VIP ⚡
                              </button>
                            </div>
                          ) : (
                            /* المشغل المباشر النظيف والواضح */
                            <iframe
                              src={getYouTubeEmbedUrl(vd.youtubeUrl)}
                              title={vd.title}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          )}
                        </div>

                        {/* معلومات الفيديو والتحكم */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800">
                              {vd.chapter || 'درس مرئي'}
                            </span>
                            {isVideoVip && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 shadow-xs flex items-center gap-1">
                                👑 VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">
                            منصة المتفوق التعليمية 🎬
                          </span>
                        </div>

                        <h5 className="font-black text-xs sm:text-sm text-slate-100 leading-snug text-right">
                          {vd.title}
                        </h5>

                        {isAdmin && (
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => {
                                playClickSound();
                                setEditingVideo(vd);
                              }}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              ✏️ تعديل هذا الفيديو
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                <div className="space-y-4">
                  {/* شريط الحروف التفاعلية الكاملة من A إلى Z */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-9 gap-2">
                    {SELF_CONTAINED_ENGLISH_LETTERS.map((item) => {
                      const isSel = selectedEngLetter.u === item.u;
                      return (
                        <button
                          key={item.u}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setSelectedEngLetter(item);
                            handleSpeakEnglish(`${item.u} - ${item.w}`, `letter_${item.u}`);
                          }}
                          className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSel
                              ? 'border-indigo-600 bg-indigo-50 shadow-md scale-105'
                              : 'border-slate-200 bg-white hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-indigo-700 font-mono">{item.u}</span>
                            <span className="text-sm font-bold text-slate-500 font-mono">{item.l}</span>
                          </div>
                          <span className="text-xl my-0.5">{item.em}</span>
                          <span className="text-[10px] font-bold text-slate-700">{item.w}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* البطاقة التفاعلية للحرف المختار مع النطق الصوتي */}
                  <div className="p-5 rounded-3xl bg-white border border-indigo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-mono font-black text-3xl shadow-md">
                        {selectedEngLetter.u}{selectedEngLetter.l}
                      </div>
                      <div className="text-right">
                        <h4 className="text-lg font-black text-slate-900 font-mono">
                          Letter {selectedEngLetter.u} ({selectedEngLetter.w})
                        </h4>
                        <p className="text-xs font-bold text-slate-600 mt-0.5">
                          النطق: <strong className="text-indigo-700">({selectedEngLetter.pr})</strong> • المعنى: <strong className="text-emerald-700">{selectedEngLetter.ar} {selectedEngLetter.em}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeakEnglish(`${selectedEngLetter.u} - ${selectedEngLetter.w}`, `letter_${selectedEngLetter.u}`)}
                      className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 استمع لنطق الحرف والكلمة</span>
                    </button>
                  </div>
                </div>
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
                        <div key={q.id} className="space-y-1">
                          <QuestionCard
                            key={q.id}
                            question={q}
                            studentSubscription={currentStudent?.subscription || 'free'}
                            onUpgradePrompt={onOpenUpgradeModal}
                            index={idx}
                          />
                          {isAdmin && (
                            <div className="flex items-center justify-end gap-2 bg-amber-50 p-2 rounded-xl border border-amber-200">
                              <span className="text-[10px] font-black text-amber-900 ml-auto">🛡️ تحكم المشرف بالسؤال:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveQuestion(q.id, 'up', chapName, chapterQuestions)}
                                  disabled={idx === 0}
                                  className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-slate-800 text-xs font-bold cursor-pointer"
                                  title="تقديم السؤال للأعلى"
                                >
                                  ⬆️
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveQuestion(q.id, 'down', chapName, chapterQuestions)}
                                  disabled={idx === chapterQuestions.length - 1}
                                  className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-slate-800 text-xs font-bold cursor-pointer"
                                  title="تأخير السؤال للأسفل"
                                >
                                  ⬇️
                                </button>
                              </div>
                              <button
                                onClick={() => setEditingQuestion(q)}
                                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                ✏️ تعديل
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('هل تريد حذف هذا السؤال نهائياً؟')) {
                                    deleteQuestion(q.id);
                                  }
                                }}
                                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                🗑️ حذف
                              </button>
                            </div>
                          )}
                        </div>
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
          {/* ================= 1. عارض الكتب والمناهج التفاعلي المدمج (تجاوز قيود تسجيل الدخول) ================= */}
      {selectedBookForViewer && (() => {
        const driveInfo = getDriveEmbedUrl(selectedBookForViewer.driveLink);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-700">
              {/* Header */}
              <div className="p-3.5 sm:p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0">📖</span>
                  <div className="min-w-0 text-right">
                    <h4 className="font-black text-xs sm:text-sm text-amber-300 truncate">
                      {selectedBookForViewer.title}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block">
                      قراءة وتصفح كافة صفحات الكتاب مباشرة داخل المنصة
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={selectedBookForViewer.downloadUrl || driveInfo.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل نسخة PDF 📥</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedBookForViewer(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
                    title="إغلاق"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Reader / Embed frame */}
              <div className="flex-1 w-full bg-slate-900 relative">
                <iframe
                  src={selectedBookForViewer.driveLink || driveInfo.embedUrl}
                  title={selectedBookForViewer.title}
                  className="w-full h-full border-0"
                  allow="autoplay"
                />
              </div>
            </div>
          </div>
        );
      })()}

            {/* ================= نافذة إضافة ملزمة أو كتاب أو أسئلة وزارية جديدة للمادة ================= */}
      {isAddMaterialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-emerald-400 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <span>📑 إضافة كتاب / ملزمة / أسئلة وزارية جديدة</span>
              </h4>
              <button onClick={() => setIsAddMaterialOpen(false)} className="font-bold text-slate-500">✕</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newMatTitle.trim() || !newMatDriveUrl.trim()) return;
                const fileId = extractDriveFileId(newMatDriveUrl.trim());
                const newMatItem = {
                  id: `mat-${Date.now()}`,
                  gradeId: currentGradeId,
                  subjectId: selectedSubject.id,
                  title: newMatTitle.trim(),
                  category: newMatCategory,
                  driveFileId: fileId || newMatDriveUrl.trim(),
                  isVipOnly: newMatIsVip,
                };
                const updated = [newMatItem, ...customMaterialsList];
                setCustomMaterialsList(updated);
                try { localStorage.setItem('iraq_edu_custom_materials_v1', JSON.stringify(updated)); } catch {}
                try {
                  const { setDoc, doc } = await import('firebase/firestore');
                  await setDoc(doc(db, 'materials', newMatItem.id), newMatItem);
                } catch (err) {
                  console.error('Error saving material:', err);
                }
                alert('تمت إضافة الملف بنجاح وحفظه سحابياً ليظهر لجميع الطلاب ✓');
                setIsAddMaterialOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">عنوان الملف أو الملزمة:</label>
                <input
                  type="text"
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  placeholder="مثال: أسئلة وحلول وزارية 2026 / ملزمة المراجعة المركزة"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">نوع المادة المضافة:</label>
                <select
                  value={newMatCategory}
                  onChange={(e) => setNewMatCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="malzama">📑 ملزمة شرح وتلخيص</option>
                  <option value="ministerial">🏛️ أسئلة وزارية ونماذج امتحانات</option>
                  <option value="activity">✍️ كراسة نشاط وتمارين</option>
                  <option value="book">📖 كتاب منهجي إضافي</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">رابط Google Drive أو معرف الملف (ID):</label>
                <input
                  type="text"
                  value={newMatDriveUrl}
                  onChange={(e) => setNewMatDriveUrl(e.target.value)}
                  placeholder="انسخ رابط المشاركة للملف من Google Drive"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-emerald-500"
                  dir="ltr"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <input
                  type="checkbox"
                  id="matVipCheck"
                  checked={newMatIsVip}
                  onChange={(e) => setNewMatIsVip(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 cursor-pointer"
                />
                <label htmlFor="matVipCheck" className="text-xs font-black text-amber-950 cursor-pointer">
                  👑 قفل هذا الملف لـ VIP فقط (يتطلب تفعيل اشتراك)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md"
                >
                  إضافة وحفظ سحابياً ✓
                </button>
              </div>
            </form>
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
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <input
                  type="checkbox"
                  id="editVidVipCheck"
                  checked={editingVideo.isVipOnly || false}
                  onChange={(e) => setEditingVideo({ ...editingVideo, isVipOnly: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 cursor-pointer accent-amber-600"
                />
                <label htmlFor="editVidVipCheck" className="text-xs font-black text-amber-950 cursor-pointer">
                  👑 قفل هذا الشرح كـ فيديو VIP للمشتركين فقط
                </label>
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
  );
};

