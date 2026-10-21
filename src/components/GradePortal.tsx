import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { Subject, Question } from '../types/index';
import { GRADES_DATA, DEFAULT_SUBJECTS } from '../data/initialData';
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
} from 'lucide-react';

interface GradePortalProps {
  onStartQuiz: (subject: Subject, questions: Question[]) => void;
  onOpenSearch: () => void;
  onOpenUpgradeModal: () => void;
}

// نصوص وقصائد المحفوظات الشعرية العراقية للمراحل الابتدائية
const IRAQI_POEMS_DATA: Record<string, { title: string; poet: string; lines: string[]; audioText: string }[]> = {
  'grade-1': [
    {
      title: 'محفوظة (أُمّي وَأَبي)',
      poet: 'أناشيد القراءة للصف الأول',
      lines: [
        'أُمِّي أُمِّي مـا أَحْـلاها',
        'نَـوْرُ حَيـاتي مـا أَبْهاها',
        'تَسْعى دَوْماً في إِسْعـادي',
        'تَرْعـاني في يَـوْمِ مِعـادي',
        'وَأَبِي الغـالي يَشْقى عَنّي',
        'يَبْني مُسْتَقْبَلي وَيَبْني',
      ],
      audioText: 'محفوظة أمي وأبي: أمي أمي ما أحلاها، نور حياتي ما أبهاها، تسعى دوماً في إسعادي، ترعاني في يوم معادي، وأبي الغالي يشقى عني، يبني مستقبلي ويبني.',
    },
    {
      title: 'نشيد (مَدْرَسَتي الحَبيبَة)',
      poet: 'أناشيد الصف الأول',
      lines: [
        'أَهْلاً أَهْلاً مَدْرَسَتي',
        'يا بَيْتَ العِلْمِ وَمَعْرِفَتي',
        'فيها كُتُبي فيها صَحْبي',
        'أَمْضي فَرَحـاً نَحْوَ الدَّرْبِ',
      ],
      audioText: 'نشيد مدرستي الحبيبة: أهلاً أهلاً مدرستي، يا بيت العلم ومعرفتي، فيها كتبي فيها صحبي، أمضي فرحاً نحو الدرب.',
    },
  ],
  'grade-2': [
    {
      title: 'محفوظة (هَيّا نَقْرَأ)',
      poet: 'منهاج قراءتي للصف الثاني',
      lines: [
        'أَنَا تِلْمِيذٌ ذا أَدَبِ',
        'أَقْرَأُ في خَيْرِ الكُتُبِ',
        'أَتَعَلَّمُ عِلْماً يَنْفَعُني',
        'يَرْفَعُ قَدْري وَيُشَرِّفُني',
      ],
      audioText: 'محفوظة هيا نقرأ: أنا تلميذ ذا أدب، أقرأ في خير الكتب، أتعلم علماً ينفعني، يرفع قدري ويشرفني.',
    },
  ],
  'grade-3': [
    {
      title: 'محفوظة (العِراقُ وَطَني)',
      poet: 'منهاج قراءتي للصف الثالث',
      lines: [
        'عِراقُنا بِلادُنا',
        'مَهْدُ العُلا وَمَجْدُنا',
        'دِجْلَةُ فيهِ تَجْري',
        'وَالخَيْرُ فيهِ يَسْري',
        'نَفْديهِ بِالأَرْواحِ',
        'في الغُدُوِّ وَالرَّواحِ',
      ],
      audioText: 'محفوظة العراق وطني: عراقنا بلادنا، مهد العلا ومجدنا، دجلة فيه تجري، والخير فيه يسري، نفديه بالأرواح، في الغدو والرواح.',
    },
  ],
  'grade-4': [
    {
      title: 'محفوظة (مَوطِني)',
      poet: 'الشاعر إبراهيم طوقان',
      lines: [
        'مَوْطِني مَوْطِني',
        'الجَلالُ وَالجَمالُ وَالسَّناءُ وَالبَهاءُ في رُباكْ',
        'وَالحَياةُ وَالنَّجاةُ وَالهَناءُ وَالرَّجاءُ في هَواكْ',
        'هَلْ أَراكْ هَلْ أَراكْ',
        'سالِماً مُنَعَّماً وَغانِماً مُكَرَّماً',
        'هَلْ أَراكْ في عُلاكْ.. تَبْلُغُ السِّماكْ.. مَوْطِني',
      ],
      audioText: 'محفوظة موطني: موطني موطني، الجلال والجمال والسناء والبهاء في رباك، والحياة والنجاة والهناء والرجاء في هواك، هل أراك هل أراك، سالماً منعماً وغانماً مكرماً، هل أراك في علاك تبلغ السماك، موطني.',
    },
  ],
  'grade-5': [
    {
      title: 'محفوظة (تُرابُ الوَطَن)',
      poet: 'منهاج القراءة للصف الخامس',
      lines: [
        'وَطَني حَبيبي يا عِراقْ',
        'إِلَيْكَ يَحْلُو لِي العِناقْ',
        'شَمْسُكَ نُورٌ لِلدُّنى',
        'وَأَرْضُكَ الطَّيْبُ هُنا',
        'سَأَبْذُلُ النَّفْسَ لَهُ',
        'أَحْميهِ مِنْ كُلِّ عَناءْ',
      ],
      audioText: 'محفوظة تراب الوطن: وطني حبيبي يا عراق، إليك يحلو لي العناق، شمسك نور للدنى، وأرضك الطيب هنا، سأبذل النفس له، أحميه من كل عناء.',
    },
  ],
  'grade-6': [
    {
      title: 'محفوظة (أَنَا عِراقِيٌّ - مَنهَج وِزاري)',
      poet: 'الشاعر معروف الرصافي',
      lines: [
        'أَنَا عِراقِيٌّ وَلِي مَجْدٌ تَليدْ',
        'عِشْتُ حُرّاً بَيْنَ أَبْناءِ الصَّعِيدْ',
        'وَطَني أَنْتَ رَجائي وَالأَمَلْ',
        'فيكَ نَبْني المَجْدَ بِالعِلْمِ الأَجَلّْ',
        'دُمْتَ يا مَوْطِنَ آبائي كَريماً',
        'مَشْرِقَ النُّورِ مَدَى الدَّهْرِ عَظيماً',
      ],
      audioText: 'محفوظة أنا عراقي: أنا عراقي ولي مجد تليد، عشت حراً بين أبناء الصعيد، وطني أنت رجائي والأمل، فيك نبني المجد بالعلم الأجل، دمت يا موطن آبائي كريماً، مشرق النور مدى الدهر عظيماً.',
    },
  ],
};

// الآيات القرآنية والأحاديث النبوية المقررة
const IRAQI_ISLAMIC_DATA: Record<string, { type: 'quran' | 'hadith'; title: string; text: string; audioText: string; explanation: string }[]> = {
  'grade-1': [
    {
      type: 'quran',
      title: 'سُورَةُ الفاتِحَة',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾',
      audioText: 'بسم الله الرحمن الرحيم، الحمد لله رب العالمين، الرحمن الرحيم، مالك يوم الدين، إياك نعبد وإياك نستعين، اهدنا الصراط المستقيم، صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين.',
      explanation: 'سورة الفاتحة هي أعظم سور القرآن الكريم، وتسمى أم الكتاب والسبع المثاني.',
    },
  ],
  'grade-4': [
    {
      type: 'quran',
      title: 'سُورَةُ الزَّلْزَلَة',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿ إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ﴿١﴾ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا ﴿٢﴾ وَقَالَ الْإِنسَانُ مَا لَهَا ﴿٣﴾ يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا ﴿٤﴾ بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا ﴿٥﴾ يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ ﴿٦﴾ فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ﴿٧﴾ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ ﴿٨﴾ ﴾',
      audioText: 'بسم الله الرحمن الرحيم، إذا زلزلت الأرض زلزالها، وأخرجت الأرض أثقالها، وقال الإنسان ما لها، يومئذ تحدث أخبارها، بأن ربك أوحى لها، يومئذ يصدر الناس أشتاتاً ليروا أعمالهم، فمن يعمل مثقال ذرة خيراً يره، ومن يعمل مثقال ذرة شراً يره.',
      explanation: 'تبين السورة أهوال يوم القيامة وحساب العباد على كل صغيرة وكبيرة.',
    },
  ],
  'grade-5': [
    {
      type: 'hadith',
      title: 'حَديثٌ شَريف في حُسْنِ الخُلُق',
      text: 'قَالَ رَسُولُ اللَّهِ (صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ وَسَلَّمَ): «إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِساً يَوْمَ الْقِيَامَةِ، أَحَاسِنُكُمْ أَخْلَاقاً».',
      audioText: 'قال رسول الله صلى الله عليه وآله وسلم: إن من أحبكم إلي وأقربكم مني مجلساً يوم القيامة، أحاسنكم أخلاقاً.',
      explanation: 'يحث الحديث النبوي الشريف على مكارم الأخلاق والصدق والتواضع والأمانة وحسن معاملة الآخرين.',
    },
  ],
  'grade-6': [
    {
      type: 'quran',
      title: 'سُورَةُ النَّجْم (آيات الحفظ الوزارية)',
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿ وَالنَّجْمِ إِذَا هَوَىٰ ﴿١﴾ مَا ضَلَّ صَاحِبُكُمْ وَمَا غَوَىٰ ﴿٢﴾ وَمَا يَنطِقُ عَنِ الْهَوَىٰ ﴿٣﴾ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ ﴿٤﴾ عَلَّمَهُ شَدِيدُ الْقُوَىٰ ﴿٥﴾ ذُو مِرَّةٍ فَاسْتَوَىٰ ﴿٦﴾ وَهُوَ بِالْأُفُقِ الْأَعْلَىٰ ﴿٧﴾ ﴾',
      audioText: 'بسم الله الرحمن الرحيم، والنجم إذا هوى، ما ضل صاحبكم وما غوى، وما ينطق عن الهوى، إن هو إلا وحي يوحى، علمه شديد القوى، ذو مرة فاستوى، وهو بالأفق الأعلى.',
      explanation: 'الآيات الوزارية المقررة في حفظ سورة النجم لشهادة الدراسة الابتدائية الوزارية.',
    },
  ],
};

// الفونكس الإنجليزي والمحادثات لجميع المراحل
const IRAQI_ENGLISH_DATA: Record<string, { title: string; phonetic: string; arabicMeaning: string; example: string }[]> = {
  'grade-1': [
    { title: 'Letter A - Apple', phonetic: '/æ/ sound', arabicMeaning: 'تفاحة - صوت حرف الآي القصير', example: 'An Apple a day keeps the doctor away' },
    { title: 'Letter B - Book', phonetic: '/b/ sound', arabicMeaning: 'كتاب - صوت حرف البي', example: 'Open your book please' },
    { title: 'Letter C - Cat', phonetic: '/k/ sound', arabicMeaning: 'قطة - صوت حرف السي كافاً', example: 'The cat is playing' },
  ],
  'grade-5': [
    { title: 'English for Iraq: Daily Routine', phonetic: 'Present Simple', arabicMeaning: 'الروتين اليومي والأوقات', example: 'I wake up at seven o\'clock every morning' },
    { title: 'English for Iraq: Countries', phonetic: 'Where are you from?', arabicMeaning: 'البلدان والجنسيات', example: 'I am from Iraq, I am Iraqi' },
  ],
  'grade-6': [
    { title: 'Ministerial Grammar: Jobs & Places', phonetic: 'Occupations', arabicMeaning: 'الوظائف وأماكن العمل الوزارية', example: 'A doctor works in a hospital' },
    { title: 'Ministerial Grammar: Materials', phonetic: 'Passive & Origin', arabicMeaning: 'المواد وما تُصنع منه الأشياء', example: 'Keys are made of metal' },
  ],
};

const DEFAULT_IRAQI_CHAPTERS: Record<string, string[]> = {
  'ar-1': ['الفصل الأول: الحروف والمقاطع التأسيسية', 'الفصل الثاني: دار ودور وبابا وماما', 'الفصل الثالث: ميزان قدوري ونبيل بقال', 'الفصل الرابع: محفوظات وقصص تدريبية'],
  'ar-4': ['الوحدة الأولى: أقسام الكلام (اسم، فعل، حرف)', 'الوحدة الثانية: المذكر والمؤنث', 'الوحدة الثالثة: المفرد والمثنى والجمع', 'الوحدة الرابعة: محفوظات التعبير والمطالعة'],
  'math-5': ['الفصل الأول: الأعداد ضمن المليارات', 'الفصل الثاني: جمع وطرح الأعداد الكبيرة', 'الفصل الثالث: ضرب الأعداد وقسمتها', 'الفصل الرابع: الكسور الاعتيادية والعشرية'],
};

function sanitizeQuestionSubject(q: Question): Question {
  const text = `${q.questionText || ''} ${q.chapter || ''} ${q.lessonName || ''} ${(q.tags || []).join(' ')}`.toLowerCase();

  if (q.gradeId === 'grade-1') {
    const scienceKeywords = [
      'كائن', 'كائنات', 'نبات', 'حيوان', 'بيئة', 'جذور', 'ساق', 'أوراق',
      'مادة', 'صلبة', 'سائلة', 'غازية', 'دفع', 'سحب', 'حركة', 'خياشيم',
      'صحراو', 'موارد', 'حواس', 'حي وغير حي', 'جماد', 'علوم'
    ];
    const readingKeywords = [
      'حرف', 'مقطع', 'مقاطع', 'دار', 'دور', 'دادا', 'رباب', 'بابا', 'ماما',
      'ميزان', 'قدوري', 'وزان', 'تهجي', 'قراءتي', 'أصوات'
    ];

    const isScience = scienceKeywords.some((k) => text.includes(k));
    const isReading = readingKeywords.some((k) => text.includes(k));

    if (isScience && !isReading && q.subjectId === 'ar-1') {
      return { ...q, subjectId: 'sci-1' };
    }

    if (isReading && !isScience && q.subjectId === 'sci-1') {
      return { ...q, subjectId: 'ar-1' };
    }
  }

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
  const [activeGradeId, setActiveGradeId] = useState<GradeId>(currentStudent.gradeId);
  const currentGradeId = activeGradeId;
  const gradeInfo = GRADES_DATA.find((g) => g.id === currentGradeId);

  // نضمن ظهور كافة المواد الرسمية (بما فيها الإنجليزي والإسلامية والاجتماعيات) لكل صف
  const officialForGrade = DEFAULT_SUBJECTS.filter((s) => s.gradeId === currentGradeId);
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
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const selectedSubject =
    gradeSubjects.find((s) => s.id === selectedSubjectId) || gradeSubjects[0];

  const currentSubjectQuestions = questions
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
    return defaults;
  };

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
                {/* قائمة تبديل الصف الدراسي والتنقل السريع المباشر */}
                <div className="flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-xs">
                  <span className="text-[10px] font-bold">المرحلة:</span>
                  <select
                    value={activeGradeId}
                    onChange={(e) => {
                      playClickSound();
                      const ng = e.target.value as GradeId;
                      setActiveGradeId(ng);
                      const firstSubj = DEFAULT_SUBJECTS.find((s) => s.gradeId === ng);
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
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>مشترك VIP مفعل ⭐</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/15 text-white/90">
                    حساب مجاني
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                أهلاً بك يا بطل، {currentStudent.fullName} 🌟
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5">
                منهاجك متكامل: محفوظات، قرآن وحديث، رياضيات، إنجليزي، وامتحانات مطولة ذكية
              </p>

              {/* زر العودة للصفحة الرئيسية وتبديل الطالب */}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gradeSubjects.map((subj) => {
            const isSelected = selectedSubject?.id === subj.id;
            const subjectQuestionsCount = questions
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
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{subj.icon}</span>
                    {subj.isSpecialInteractive && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        تفاعلي
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-sm text-slate-900 mb-1">
                    {subj.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {subj.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{subj.lessonsCount} درس</span>
                  <span className="text-emerald-700 font-extrabold">{subjectQuestionsCount} سؤال</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Specialized Interactive Modules for Grade 1 */}
      {currentGradeId === 'grade-1' && selectedSubject?.id === 'ar-1' && (
        <Grade1ArabicReading />
      )}
      {currentGradeId === 'grade-1' && selectedSubject?.id === 'eng-1' && (
        <Grade1EnglishLetters />
      )}

      {/* Main Subject Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedSubject?.icon}</span>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {selectedSubject?.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {gradeInfo?.name} • منهاج وزارة التربية العراقية المعتمد
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onStartQuiz(selectedSubject, currentSubjectQuestions);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>بدء الاختبار التفاعلي السريع</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside the Subject */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => { playClickSound(); setActiveTab('qa'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'qa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>بنك الأسئلة والتعاليل المعتمدة ({currentSubjectQuestions.length})</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('curriculum'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>فصول ووحدات الكتاب</span>
          </button>
        </div>

        {/* Tab Content: Q&A Bank */}
        {activeTab === 'qa' && (
          <div className="space-y-4">
            {currentSubjectQuestions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-6 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-black text-slate-700 text-sm">لا توجد أسئلة مضافة لهذه المادة حالياً</h4>
                <p className="text-xs text-slate-400">يمكن للمعلم أو المشرف إضافة الأسئلة ونماذج الاختبارات من لوحة التحكم</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSubjectQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onSpeak={() => handleSpeakArabic(q.questionText + '. الجواب المعتمد: ' + q.answerText, q.id)}
                    isSpeaking={speakingId === q.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Curriculum Chapters */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getSubjectChapters(selectedSubject?.id || '').map((chap, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-xs text-slate-800">{chap}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {questions.filter((q) => q.gradeId === currentGradeId && q.subjectId === selectedSubject?.id && q.chapter === chap).length} سؤال
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recitation Drawers: Poems & Hadiths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Iraqi Poems Drawer */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-500" />
              <span>محفوظات وأناشيد {gradeInfo?.name}</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              قراءة شفهية
            </span>
          </div>

          <div className="space-y-3">
            {gradePoems.map((poem, pIdx) => (
              <div key={pIdx} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-xs sm:text-sm text-slate-900">{poem.title}</h5>
                  <button
                    onClick={() => handleSpeakArabic(poem.audioText, `poem-${pIdx}`)}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمع</span>
                  </button>
                </div>
                <div className="space-y-1 text-xs text-slate-700 font-medium leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-100 text-center font-serif">
                  {poem.lines.map((l, lIdx) => (
                    <p key={lIdx}>{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quran & Hadith Drawer */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-600" />
              <span>القرآن والحديث الشريف ({gradeInfo?.name})</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              نطق وترتيل
            </span>
          </div>

          <div className="space-y-3">
            {gradeIslamic.map((isl, iIdx) => (
              <div key={iIdx} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-xs sm:text-sm text-slate-900">{isl.title}</h5>
                  <button
                    onClick={() => handleSpeakArabic(isl.audioText, `isl-${iIdx}`)}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمع</span>
                  </button>
                </div>
                <div className="text-xs text-slate-800 font-bold leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-100 text-center font-serif">
                  {isl.text}
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{isl.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradePortal;
