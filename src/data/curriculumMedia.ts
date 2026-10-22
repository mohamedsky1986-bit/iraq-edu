import { GradeId } from '../types/index';

export interface CurriculumBook {
  id: string;
  title: string;
  gradeId: GradeId;
  subjectId: string;
  driveFileId: string;
  category: 'book' | 'workbook' | 'activity' | 'summary';
  isVipOnly?: boolean;
}

export interface EducationalVideo {
  id: string;
  title: string;
  gradeId: GradeId;
  subjectId: string;
  youtubeUrl: string;
  youtubeId: string;
  description?: string;
  teacherName?: string;
  isVipOnly?: boolean;
  createdAt?: string;
}

// استخراج معرف فيديو اليوتيوب من أي رابط
export const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[\w-]{11}$/.test(clean)) {
    return clean;
  }
  return clean;
};

// استخراج معرف ملف قوقل درايف من أي رابط مشاركة
export const extractDriveFileId = (input: string): string => {
  if (!input) return '';
  const clean = input.trim();
  const matchD = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  if (matchD && matchD[1]) return matchD[1];

  const matchId = clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (matchId && matchId[1]) return matchId[1];

  return clean;
};

export const INITIAL_VIDEOS: EducationalVideo[] = [
  {
    id: 'vid-g1-ar-baa',
    title: 'حفظ الحروف العربية ( أ ب ت ث ج ح خ د ) مع الحركات والأمثلة',
    gradeId: 'grade-1',
    subjectId: 'ar-1',
    youtubeUrl: 'https://youtu.be/sW8cpXQU0sY',
    youtubeId: 'sW8cpXQU0sY',
    teacherName: 'شرح تفاعلي للأطفال',
    description: 'شرح صوتي ومرئي مبسط لنطق الحروف الهجائية بالحركات مع الكلمات والصور التوضيحية',
    createdAt: '2026-10-22',
  },
];

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

