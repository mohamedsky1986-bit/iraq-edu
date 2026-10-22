import {
  GradeId,
  GradeInfo,
  Subject,
  Question,
  Student,
  ArabicLetterItem,
  EnglishLetterItem,
  ScienceTopicItem,
  SubscriptionConfig,
  SubscriptionRequest,
} from '../types/index';

export const GRADES_DATA: GradeInfo[] = [
  {
    id: 'grade-1',
    order: 1,
    name: 'الصف الأول الابتدائي',
    stageName: 'الأول الأساسي',
    shortName: 'الأول',
    description: 'تأسيس الحروف العربية والأصوات والمقاطع، الحروف الإنجليزية، والعلوم المبسطة.',
    icon: '🌱',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgColor: 'from-emerald-50 to-teal-50',
    accentColor: 'text-emerald-600',
  },
  {
    id: 'grade-2',
    order: 2,
    name: 'الصف الثاني الابتدائي',
    stageName: 'الثاني الأساسي',
    shortName: 'الثاني',
    description: 'تطوير مهارات القراءة، الجمع والطرح، واستكشاف عجائب الطبيعة والعلوم.',
    icon: '🚀',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    bgColor: 'from-sky-50 to-indigo-50',
    accentColor: 'text-sky-600',
  },
  {
    id: 'grade-3',
    order: 3,
    name: 'الصف الثالث الابتدائي',
    stageName: 'الثالث الأساسي',
    shortName: 'الثالث',
    description: 'تعلم جدول الضرب، قواعد اللغة المبسطة، وتوسيع مدارك المعرفة.',
    icon: '📚',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    bgColor: 'from-amber-50 to-orange-50',
    accentColor: 'text-amber-600',
  },
  {
    id: 'grade-4',
    order: 4,
    name: 'الصف الرابع الابتدائي',
    stageName: 'الرابع الأساسي',
    shortName: 'الرابع',
    description: 'بداية مادة الاجتماعيات وتاريخ العراق العريق، والكسور وقواعد اللغة.',
    icon: '🏛️',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    bgColor: 'from-indigo-50 to-purple-50',
    accentColor: 'text-indigo-600',
  },
  {
    id: 'grade-5',
    order: 5,
    name: 'الصف الخامس الابتدائي',
    stageName: 'الخامس الأساسي',
    shortName: 'الخامس',
    description: 'قواعد اللغة العربية المتقدمة، جغرافية العراق، والعلوم الحيوية.',
    icon: '🔬',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
    bgColor: 'from-violet-50 to-pink-50',
    accentColor: 'text-violet-600',
  },
  {
    id: 'grade-6',
    order: 6,
    name: 'الصف السادس الابتدائي',
    stageName: 'المرحلة الوزارية (البكالوريا)',
    shortName: 'السادس',
    description: 'المرحلة الوزارية الذهبية: تدريب مكثف على الأسئلة الوزارية وحصاد التفوق.',
    icon: '👑',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    bgColor: 'from-rose-50 to-amber-50',
    accentColor: 'text-rose-600',
  },
];

export const DEFAULT_SUBSCRIPTION_CONFIG: SubscriptionConfig = {
  price: 15000,
  currency: 'د.ع',
  periodName: 'اشتراك الفصل الدراسي الكامل',
  featureList: [
    'فتح بنك الأسئلة الوزارية والنموذجية المقفولة بالكامل',
    'نطق صوتي تفاعلي لامحدود لكل الحروف والمقاطع والأسئلة',
    'اختبارات تقييمية مع أوسمة وشهادات تفوق رسمية باسم الطالب',
    'متابعة مستوى الطالب وتحديثات مستمرة للمنهج العراقي',
  ],
  zainCashWallet: '07801234567',
  qiCardNumber: '6037-9988-1122-3344',
  supportPhone: '07709876543',
};

export const INITIAL_SUBSCRIPTION_REQUESTS: SubscriptionRequest[] = [
  {
    id: 'req-1',
    studentId: 'std-2',
    studentName: 'زينب أحمد البصري',
    username: 'zainab_basra',
    gradeId: 'grade-4',
    requestDate: '2026-10-18',
    paymentMethod: 'zain_cash',
    paymentPhoneOrRef: '07801122334',
    status: 'pending',
    amount: 15000,
    currency: 'د.ع',
    notes: 'تم التحويل عبر محفظة زين كاش',
  },
  {
    id: 'req-2',
    studentId: 'std-3',
    studentName: 'يوسف كرار الموصلي',
    username: 'yousif_mosul',
    gradeId: 'grade-1',
    requestDate: '2026-10-19',
    paymentMethod: 'qi_card',
    paymentPhoneOrRef: 'وصل رقم 98214',
    status: 'pending',
    amount: 15000,
    currency: 'د.ع',
    notes: 'تفعيل منهج الأول الابتدائي لقراءتي والحروف',
  },
];

// All 28 Arabic Letters with Iraqi Primary Curriculum context (قراءتي)
export const ARABIC_LETTERS_DATA: ArabicLetterItem[] = [
  {
    id: 'ar-let-a',
    letter: 'أ',
    name: 'حرف الألف',
    soundDescription: 'صوته: أَ أو إِ أو أُ (حرف المد الطويل ااا)',
    fatha: 'أَ (أُمِّي)',
    damma: 'أُ (أُسْتَاذ)',
    kasra: 'إِ (إِبْرِيق)',
    syllables: ['أَ', 'أُو', 'إِي'],
    sampleWords: [
      { word: 'أُمِّي', meaning: 'أمي الغالية حنان الدار', emoji: '👩🏻' },
      { word: 'أَبِي', meaning: 'أبي السند والقدوة', emoji: '👨🏻' },
      { word: 'أَرْنَب', meaning: 'أرنب يقفز في البستان', emoji: '🐇' },
    ],
  },
  {
    id: 'ar-let-b',
    letter: 'ب',
    name: 'حرف الباء',
    soundDescription: 'صوته: بْ (إطباق الشفتين ونقطة تحته)',
    fatha: 'بَ (بَابَا)',
    damma: 'بُ (بُرْتُقَال)',
    kasra: 'بِ (بِنْت)',
    syllables: ['با', 'بو', 'بي'],
    sampleWords: [
      { word: 'بَابَا', meaning: 'درس بابا بابا في قراءتي', emoji: '👨🏻' },
      { word: 'بَاب', meaning: 'باب دارنا الجميل', emoji: '🚪' },
      { word: 'بَدْر', meaning: 'القمر المكتمل المستدير', emoji: '🌕' },
    ],
  },
  {
    id: 'ar-let-t',
    letter: 'ت',
    name: 'حرف التاء',
    soundDescription: 'صوته: تْ (نقطتان فوق الصحن)',
    fatha: 'تَ (تَمْر)',
    damma: 'تُ (تُفَّاح)',
    kasra: 'تِ (تِلْمِيذ)',
    syllables: ['تا', 'تو', 'تي'],
    sampleWords: [
      { word: 'تَمْر', meaning: 'تمر العراق اللذيذ والمغذي', emoji: '🌴' },
      { word: 'تُفَّاح', meaning: 'تفاح أحمر حلو الطعم', emoji: '🍎' },
      { word: 'تِين', meaning: 'فاكهة التين الشهية', emoji: '🫐' },
    ],
  },
  {
    id: 'ar-let-th',
    letter: 'ث',
    name: 'حرف الثاء',
    soundDescription: 'صوته: ثْ (إخراج طرف اللسان مع الأسنان و3 نقاط)',
    fatha: 'ثَ (ثَوْب)',
    damma: 'ثُ (ثُعْبَان)',
    kasra: 'ثِ (ثِمَار)',
    syllables: ['ثا', 'ثو', 'ثي'],
    sampleWords: [
      { word: 'ثَعْلَب', meaning: 'ثعلب ذكي ورشيق', emoji: '🦊' },
      { word: 'ثَوْب', meaning: 'ثوب نظيف وأنيق', emoji: '👗' },
      { word: 'ثَلْج', meaning: 'ثلج أبيض ناصع في الشتاء', emoji: '❄️' },
    ],
  },
  {
    id: 'ar-let-j',
    letter: 'ج',
    name: 'حرف الجيم',
    soundDescription: 'صوته: جْ (وسط اللسان ونقطة في بطنه)',
    fatha: 'جَ (جَمَل)',
    damma: 'جُ (جُنْدِي)',
    kasra: 'جِ (جِسْر)',
    syllables: ['جا', 'جو', 'جي'],
    sampleWords: [
      { word: 'جَمَل', meaning: 'سفينة الصحراء الصبورة', emoji: '🐪' },
      { word: 'جَبَل', meaning: 'جبال كردستان العراق العالية', emoji: '⛰️' },
      { word: 'جِسْر', meaning: 'جسر يربط بين ضفتي دجلة والفرات', emoji: '🌉' },
    ],
  },
  {
    id: 'ar-let-h',
    letter: 'ح',
    name: 'حرف الحاء',
    soundDescription: 'صوته: حْ (صوت دافئ من وسط الحلق بلا نقاط)',
    fatha: 'حَ (حَلِيب)',
    damma: 'حُ (حُوت)',
    kasra: 'حِ (حِصَان)',
    syllables: ['حا', 'حو', 'حي'],
    sampleWords: [
      { word: 'حَلِيب', meaning: 'حليب يقوي العظام والأسنان', emoji: '🥛' },
      { word: 'حِصَان', meaning: 'حصان عربي أصيل وسريع', emoji: '🐴' },
      { word: 'حَمَامَة', meaning: 'حمامة السلام البيضاء', emoji: '🕊️' },
    ],
  },
  {
    id: 'ar-let-kh',
    letter: 'خ',
    name: 'حرف الخاء',
    soundDescription: 'صوته: خْ (نقطة فوق رأسه)',
    fatha: 'خَ (خَرُوف)',
    damma: 'خُ (خُبْز)',
    kasra: 'خِ (خِيَار)',
    syllables: ['خا', 'خو', 'خي'],
    sampleWords: [
      { word: 'خُبْز', meaning: 'خبز التنور العراقي الشهي', emoji: '🥖' },
      { word: 'خَرُوف', meaning: 'خروف ذو صوف دافئ', emoji: '🐑' },
      { word: 'خَيْمَة', meaning: 'خيمة في البراري', emoji: '⛺' },
    ],
  },
  {
    id: 'ar-let-d',
    letter: 'د',
    name: 'حرف الدال',
    soundDescription: 'صوته: دْ (نقر طرف اللسان خلف الثنايا العليا)',
    fatha: 'دَ (دَار)',
    damma: 'دُ (دُور)',
    kasra: 'دِ (دِمَاغ)',
    syllables: ['دا', 'دو', 'دي'],
    sampleWords: [
      { word: 'دَار', meaning: 'البيت الدافئ الجميل', emoji: '🏠' },
      { word: 'دُور', meaning: 'بيوت كثيرة في المحلة', emoji: '🏘️' },
      { word: 'دَادَا', meaning: 'الطفل الصغير اللطيف', emoji: '👶🏻' },
    ],
  },
  {
    id: 'ar-let-th-thal',
    letter: 'ذ',
    name: 'حرف الذال',
    soundDescription: 'صوته: ذْ (إخراج اللسان قليلاً وفوقه نقطة)',
    fatha: 'ذَ (ذَهَب)',
    damma: 'ذُ (ذُرَة)',
    kasra: 'ذِ (ذِئْب)',
    syllables: ['ذا', 'ذو', 'ذي'],
    sampleWords: [
      { word: 'ذُرَة', meaning: 'ذرة صفراء حلوة ولذيذة', emoji: '🌽' },
      { word: 'ذَهَب', meaning: 'معدن ثمين لامع وبراق', emoji: '🪙' },
      { word: 'ذِئْب', meaning: 'ذئب يعيش في البرية', emoji: '🐺' },
    ],
  },
  {
    id: 'ar-let-r',
    letter: 'ر',
    name: 'حرف الراء',
    soundDescription: 'صوته: رْ (طرف اللسان كالهلال الصغير)',
    fatha: 'رَ (رَبَاب)',
    damma: 'رُ (رُمَّان)',
    kasra: 'رِ (رِمَال)',
    syllables: ['را', 'رو', 'ري'],
    sampleWords: [
      { word: 'رَبَاب', meaning: 'درس دادا رباب في قراءتي', emoji: '👧🏻' },
      { word: 'رُمَّان', meaning: 'رمان شهي مليء بالحبات الحمراء', emoji: '🍎' },
      { word: 'رَسَّام', meaning: 'يرسم لوحات رائعة للعراق', emoji: '🎨' },
    ],
  },
  {
    id: 'ar-let-z',
    letter: 'ز',
    name: 'حرف الزاي',
    soundDescription: 'صوته: زْ (طنين النحلة ززز وفوقه نقطة)',
    fatha: 'زَ (زَيْد)',
    damma: 'زُ (زُهُور)',
    kasra: 'زِ (زِرّ)',
    syllables: ['زا', 'زو', 'زي'],
    sampleWords: [
      { word: 'زَيْد', meaning: 'درس وز وز زيد زيد', emoji: '👦🏻' },
      { word: 'زَوْرَق', meaning: 'زورق مازن يدور في الماء', emoji: '⛵' },
      { word: 'زَيْتُون', meaning: 'شجرة الزيتون المباركة', emoji: '🫒' },
    ],
  },
  {
    id: 'ar-let-s',
    letter: 'س',
    name: 'حرف السين',
    soundDescription: 'صوته: سْ (ثلاث أسنان وصحن رشيق)',
    fatha: 'سَ (سَالِم)',
    damma: 'سُ (سُوق)',
    kasra: 'سِ (سَمَك)',
    syllables: ['سا', 'سو', 'سي'],
    sampleWords: [
      { word: 'سَالِم', meaning: 'درس سالم مزارع في قراءتي', emoji: '👨🏻‍🌾' },
      { word: 'سَمَك', meaning: 'سمك طازج يسبح في النهر', emoji: '🐟' },
      { word: 'سَيَّارَة', meaning: 'سيارة تسير بأمان', emoji: '🚗' },
    ],
  },
  {
    id: 'ar-let-sh',
    letter: 'ش',
    name: 'حرف الشين',
    soundDescription: 'صوته: شْ (ثلاث نقاط فوق حرف السين)',
    fatha: 'شَ (شَمْس)',
    damma: 'شُ (شُرْطِي)',
    kasra: 'شِ (شِتَاء)',
    syllables: ['شا', 'شو', 'شي'],
    sampleWords: [
      { word: 'شَمْس', meaning: 'شمس تضيء أرض العراق بالدفء', emoji: '☀️' },
      { word: 'شَجَرَة', meaning: 'شجرة خضراء وارفة الظلال', emoji: '🌳' },
      { word: 'شَامِل', meaning: 'درس شامل شرطي المرور', emoji: '👮🏻' },
    ],
  },
  {
    id: 'ar-let-sad',
    letter: 'ص',
    name: 'حرف الصاد',
    soundDescription: 'صوته: صْ (حرف مفخم قوي ممتلئ الفم)',
    fatha: 'صَ (صَقْر)',
    damma: 'صُ (صُنْدُوق)',
    kasra: 'صِ (صَبَاح)',
    syllables: ['صا', 'صو', 'صي'],
    sampleWords: [
      { word: 'صَقْر', meaning: 'صقر جارح وقوي', emoji: '🦅' },
      { word: 'صَابُون', meaning: 'صابون ينظف أيدينا بالرغوة', emoji: '🧼' },
      { word: 'صَبَاح', meaning: 'صباح الخير والنشاط', emoji: '🌅' },
    ],
  },
  {
    id: 'ar-let-dad',
    letter: 'ض',
    name: 'حرف الضاد',
    soundDescription: 'صوته: ضْ (حرف لغة الضاد الفريد بنقطة في الأعلى)',
    fatha: 'ضَ (ضَوْء)',
    damma: 'ضُ (ضُيُوف)',
    kasra: 'ضِ (ضِرْس)',
    syllables: ['ضا', 'ضو', 'ضي'],
    sampleWords: [
      { word: 'ضَوْء', meaning: 'ضوء يطرد الظلام', emoji: '💡' },
      { word: 'ضِفْدَع', meaning: 'ضفدع يقفز في بحيرة الماء', emoji: '🐸' },
      { word: 'ضِرْس', meaning: 'ضرس قوي نظيف بالفرشاة', emoji: '🦷' },
    ],
  },
  {
    id: 'ar-let-t-taa',
    letter: 'ط',
    name: 'حرف الطاء',
    soundDescription: 'صوته: طْ (حرف مطبق قوي وعصا للأعلى)',
    fatha: 'طَ (طَيَّارَة)',
    damma: 'طُ (طُيُور)',
    kasra: 'طِ (طِفْل)',
    syllables: ['طا', 'طو', 'طي'],
    sampleWords: [
      { word: 'طَيَّارَة', meaning: 'درس طيارة وقاص تطير عالياً', emoji: '✈️' },
      { word: 'طُيُور', meaning: 'درس بط وطيور في قراءتي', emoji: '🐦' },
      { word: 'طَبِيب', meaning: 'طبيب يعالج المرضى برحمة', emoji: '🩺' },
    ],
  },
  {
    id: 'ar-let-zaa',
    letter: 'ظ',
    name: 'حرف الظاء',
    soundDescription: 'صوته: ظْ (إخراج طرف اللسان مع تفخيم ونقطة)',
    fatha: 'ظَ (ظَبْي)',
    damma: 'ظُ (ظُفْر)',
    kasra: 'ظِ (ظِلّ)',
    syllables: ['ظا', 'ظو', 'ظي'],
    sampleWords: [
      { word: 'ظَبْي', meaning: 'غزال رشيق في الطبيعة', emoji: '🦌' },
      { word: 'ظَرْف', meaning: 'ظرف يحتوي رسالة جميلة', emoji: '✉️' },
      { word: 'ظِلّ', meaning: 'ظل الأشجار البارد في الصيف', emoji: '👥' },
    ],
  },
  {
    id: 'ar-let-ain',
    letter: 'ع',
    name: 'حرف العين',
    soundDescription: 'صوته: عْ (من وسط الحلق صوت عربي أصيل)',
    fatha: 'عَ (عَلَم)',
    damma: 'عُ (عُشّ)',
    kasra: 'عِ (عِنَب)',
    syllables: ['عا', 'عو', 'عي'],
    sampleWords: [
      { word: 'عَلَم', meaning: 'علم العراق يرفرف خفاقاً بالسلام', emoji: '🇮🇶' },
      { word: 'عِنَب', meaning: 'عنب لذيذ ينمو في كروم الشمال', emoji: '🍇' },
      { word: 'عُصْفُور', meaning: 'عصفور يغرد بأجمل الألحان', emoji: '🐤' },
    ],
  },
  {
    id: 'ar-let-ghain',
    letter: 'غ',
    name: 'حرف الغين',
    soundDescription: 'صوته: غْ (نقطة فوق رأس حرف العين)',
    fatha: 'غَ (غَزَال)',
    damma: 'غُ (غُرَاب)',
    kasra: 'غِ (غِطَاء)',
    syllables: ['غا', 'غو', 'غي'],
    sampleWords: [
      { word: 'غَزَال', meaning: 'غزال جميل وسريع الجري', emoji: '🦌' },
      { word: 'غَيْمَة', meaning: 'غيمة بيضاء تمطر خيراً', emoji: '☁️' },
      { word: 'غُرَاب', meaning: 'طائر ذكي ذو ريش أسود', emoji: '🦅' },
    ],
  },
  {
    id: 'ar-let-f',
    letter: 'ف',
    name: 'حرف الفاء',
    soundDescription: 'صوته: فْ (الأسنان العليا مع الشفة السفلى)',
    fatha: 'فَ (فَرَاشَة)',
    damma: 'فُ (فُلْفُل)',
    kasra: 'فِ (فِيل)',
    syllables: ['فا', 'فو', 'في'],
    sampleWords: [
      { word: 'فَرَاشَة', meaning: 'فراشة ملونة تطير بين الأزهار', emoji: '🦋' },
      { word: 'فِيل', meaning: 'فيل ضخم ذو خرطوم طويل', emoji: '🐘' },
      { word: 'فَتَّاح', meaning: 'درس بلبل فتاح طار البلبل', emoji: '🦜' },
    ],
  },
  {
    id: 'ar-let-q',
    letter: 'ق',
    name: 'حرف القاف',
    soundDescription: 'صوته: قْ (أقصى اللسان مع نقطتين)',
    fatha: 'قَ (قَلَم)',
    damma: 'قُ (قُبَّعَة)',
    kasra: 'قِ (قِطَار)',
    syllables: ['قا', 'قو', 'قي'],
    sampleWords: [
      { word: 'قَلَم', meaning: 'قلم نكتب به ونتعلم العلم', emoji: '✏️' },
      { word: 'قَمَر', meaning: 'قمر ينير السماء في الليل', emoji: '🌙' },
      { word: 'قَدُّورِي', meaning: 'درس ميزان قدوري وزان', emoji: '⚖️' },
    ],
  },
  {
    id: 'ar-let-k',
    letter: 'ك',
    name: 'حرف الكاف',
    soundDescription: 'صوته: كْ (بداخله كاف صغيرة تشبه الهمزة)',
    fatha: 'كَ (كِتَاب)',
    damma: 'كُ (كُرَة)',
    kasra: 'كِ (كِلاب)',
    syllables: ['كا', 'كو', 'كي'],
    sampleWords: [
      { word: 'كِتَاب', meaning: 'كتاب القراءة الممتع للأول الابتدائي', emoji: '📖' },
      { word: 'كُرَة', meaning: 'كرة نلعب بها مع الأصدقاء', emoji: '⚽' },
      { word: 'كَلْب', meaning: 'كلب وفي يحرس الدار', emoji: '🐕' },
    ],
  },
  {
    id: 'ar-let-l',
    letter: 'ل',
    name: 'حرف اللام',
    soundDescription: 'صوته: لْ (عصا طويلة تنزل وتستدير كالصنارة)',
    fatha: 'لَ (لَيْمُون)',
    damma: 'لُ (لُعْبَة)',
    kasra: 'لِ (لِسَان)',
    syllables: ['لا', 'لو', 'لي'],
    sampleWords: [
      { word: 'لَيْمُون', meaning: 'ليمون منعش وغني بفيتامين C', emoji: '🍋' },
      { word: 'لُعْبَة', meaning: 'لعبة مسلية نلعب بها بأدب', emoji: '🧸' },
      { word: 'لِسَان', meaning: 'لسان نتذوق به الطعام ونتكلم الصدق', emoji: '👅' },
    ],
  },
  {
    id: 'ar-let-m',
    letter: 'م',
    name: 'حرف الميم',
    soundDescription: 'صوته: مْ (إغلاق الشفتين مع غنة خفيفة)',
    fatha: 'مَ (مَامَا)',
    damma: 'مُ (مُعَلِّم)',
    kasra: 'مِ (مِيزَان)',
    syllables: ['ما', 'مو', 'مي'],
    sampleWords: [
      { word: 'مَامَا', meaning: 'أمي الحنونة الغالية', emoji: '👩🏻' },
      { word: 'مِيزَان', meaning: 'ميزان قدوري للوزن العادل', emoji: '⚖️' },
      { word: 'مَزْمَار', meaning: 'درس مزمار مازن قديم', emoji: '🎺' },
    ],
  },
  {
    id: 'ar-let-n',
    letter: 'ن',
    name: 'حرف النون',
    soundDescription: 'صوته: نْ (صحن بداخله نقطة في الأعلى)',
    fatha: 'نَ (نَمِير)',
    damma: 'نُ (نُور)',
    kasra: 'نِ (نِسْر)',
    syllables: ['نا', 'نو', 'ني'],
    sampleWords: [
      { word: 'نُور', meaning: 'درس دار نُور وباب دارنا', emoji: '✨' },
      { word: 'نَمِير', meaning: 'درس نمير نام نام نمير', emoji: '👦🏻' },
      { word: 'نَخْلَة', meaning: 'نخلة العراق الباسقة بالتمور', emoji: '🌴' },
    ],
  },
  {
    id: 'ar-let-ha',
    letter: 'هـ',
    name: 'حرف الهاء',
    soundDescription: 'صوته: هـْ (خروج الهواء برقة من أقصى الحلق)',
    fatha: 'هَـ (هَرَم)',
    damma: 'هُـ (هُدْهُد)',
    kasra: 'هِـ (هِلال)',
    syllables: ['ها', 'هو', 'هي'],
    sampleWords: [
      { word: 'هِلال', meaning: 'هلال يبشر ببداية الشهر الفضيل', emoji: '🌙' },
      { word: 'هُدْهُد', meaning: 'هدهد جميل ذو تاج ملون', emoji: '🐦' },
      { word: 'هَدِيَّة', meaning: 'هدية مفرحة للمتفوق', emoji: '🎁' },
    ],
  },
  {
    id: 'ar-let-w',
    letter: 'و',
    name: 'حرف الواو',
    soundDescription: 'صوته: وْ (ضم الشفتين للأمام كالدائرة)',
    fatha: 'وَ (وَرْد)',
    damma: 'وُ (وُجُوه)',
    kasra: 'وِ (وِشَاح)',
    syllables: ['وا', 'وو', 'وي'],
    sampleWords: [
      { word: 'وَرْد', meaning: 'ورد لطيف يعطر حديقة البيت', emoji: '🌹' },
      { word: 'وَزّ', meaning: 'درس وَزّ وَزّ زيد زيد زورق', emoji: '🦆' },
      { word: 'وَلَد', meaning: 'ولد مهذب يستمع لكلام والديه', emoji: '👦🏻' },
    ],
  },
  {
    id: 'ar-let-y',
    letter: 'ي',
    name: 'حرف الياء',
    soundDescription: 'صوته: يْ (يشبه البطة وتحته نقطتان)',
    fatha: 'يَ (يَد)',
    damma: 'يُ (يُوسُف)',
    kasra: 'يِ (يَقِين)',
    syllables: ['يا', 'يو', 'يي'],
    sampleWords: [
      { word: 'يَد', meaning: 'يدنا نكتب بها ونرسم ونتعلم', emoji: '✋🏻' },
      { word: 'يَقْطِين', meaning: 'نبات صحي وغذاء مبارك', emoji: '🎃' },
      { word: 'يَمَامَة', meaning: 'يمامة وديعة في البستان', emoji: '🕊️' },
    ],
  },
];

// All 26 English Letters with Phonics, sample words and friendly child audio
export const ENGLISH_LETTERS_DATA: EnglishLetterItem[] = [
  {
    letterUpper: 'A',
    letterLower: 'a',
    phonicSound: 'æ (آه)',
    sampleWord: 'Apple',
    arabicTranslation: 'تفاحة',
    emoji: '🍎',
    exampleSentence: 'A is for Apple, sweet and red!',
  },
  {
    letterUpper: 'B',
    letterLower: 'b',
    phonicSound: 'b (ب)',
    sampleWord: 'Ball',
    arabicTranslation: 'كرة',
    emoji: '⚽',
    exampleSentence: 'B is for Ball, bounce it high!',
  },
  {
    letterUpper: 'C',
    letterLower: 'c',
    phonicSound: 'k (ك)',
    sampleWord: 'Cat',
    arabicTranslation: 'قطة',
    emoji: '🐱',
    exampleSentence: 'C is for Cat, saying meow!',
  },
  {
    letterUpper: 'D',
    letterLower: 'd',
    phonicSound: 'd (د)',
    sampleWord: 'Duck',
    arabicTranslation: 'بطة',
    emoji: '🦆',
    exampleSentence: 'D is for Duck, swimming in the pond!',
  },
  {
    letterUpper: 'E',
    letterLower: 'e',
    phonicSound: 'e (إي)',
    sampleWord: 'Elephant',
    arabicTranslation: 'فيل',
    emoji: '🐘',
    exampleSentence: 'E is for Elephant, big and strong!',
  },
  {
    letterUpper: 'F',
    letterLower: 'f',
    phonicSound: 'f (ف)',
    sampleWord: 'Fish',
    arabicTranslation: 'سمكة',
    emoji: '🐟',
    exampleSentence: 'F is for Fish, swimming fast!',
  },
  {
    letterUpper: 'G',
    letterLower: 'g',
    phonicSound: 'g (گ)',
    sampleWord: 'Giraffe',
    arabicTranslation: 'زرافة',
    emoji: '🦒',
    exampleSentence: 'G is for Giraffe, tall and gentle!',
  },
  {
    letterUpper: 'H',
    letterLower: 'h',
    phonicSound: 'h (هـ)',
    sampleWord: 'Horse',
    arabicTranslation: 'حصان',
    emoji: '🐴',
    exampleSentence: 'H is for Horse, galloping proud!',
  },
  {
    letterUpper: 'I',
    letterLower: 'i',
    phonicSound: 'ɪ (إي قصيرة)',
    sampleWord: 'Ice cream',
    arabicTranslation: 'مثلجات',
    emoji: '🍦',
    exampleSentence: 'I is for Ice cream, cool and sweet!',
  },
  {
    letterUpper: 'J',
    letterLower: 'j',
    phonicSound: 'dʒ (ج)',
    sampleWord: 'Juice',
    arabicTranslation: 'عصير',
    emoji: '🧃',
    exampleSentence: 'J is for Juice, fresh and yummy!',
  },
  {
    letterUpper: 'K',
    letterLower: 'k',
    phonicSound: 'k (ك)',
    sampleWord: 'Kite',
    arabicTranslation: 'طائرة ورقية',
    emoji: '🪁',
    exampleSentence: 'K is for Kite, flying in the sky!',
  },
  {
    letterUpper: 'L',
    letterLower: 'l',
    phonicSound: 'l (ل)',
    sampleWord: 'Lion',
    arabicTranslation: 'أسد',
    emoji: '🦁',
    exampleSentence: 'L is for Lion, the brave king!',
  },
  {
    letterUpper: 'M',
    letterLower: 'm',
    phonicSound: 'm (م)',
    sampleWord: 'Moon',
    arabicTranslation: 'قمر',
    emoji: '🌙',
    exampleSentence: 'M is for Moon, glowing at night!',
  },
  {
    letterUpper: 'N',
    letterLower: 'n',
    phonicSound: 'n (ن)',
    sampleWord: 'Nest',
    arabicTranslation: 'عش الطائر',
    emoji: '🪺',
    exampleSentence: 'N is for Nest, home for the birds!',
  },
  {
    letterUpper: 'O',
    letterLower: 'o',
    phonicSound: 'ɒ (أو)',
    sampleWord: 'Orange',
    arabicTranslation: 'برتقالة',
    emoji: '🍊',
    exampleSentence: 'O is for Orange, juicy and round!',
  },
  {
    letterUpper: 'P',
    letterLower: 'p',
    phonicSound: 'p (پ خفيفة)',
    sampleWord: 'Pen',
    arabicTranslation: 'قلم',
    emoji: '🖊️',
    exampleSentence: 'P is for Pen, we write and draw!',
  },
  {
    letterUpper: 'Q',
    letterLower: 'q',
    phonicSound: 'kw (كُو)',
    sampleWord: 'Queen',
    arabicTranslation: 'ملكة',
    emoji: '👑',
    exampleSentence: 'Q is for Queen, wearing a crown!',
  },
  {
    letterUpper: 'R',
    letterLower: 'r',
    phonicSound: 'r (ر)',
    sampleWord: 'Rabbit',
    arabicTranslation: 'أرنب',
    emoji: '🐰',
    exampleSentence: 'R is for Rabbit, hopping so fast!',
  },
  {
    letterUpper: 'S',
    letterLower: 's',
    phonicSound: 's (س)',
    sampleWord: 'Sun',
    arabicTranslation: 'شمس',
    emoji: '☀️',
    exampleSentence: 'S is for Sun, giving warm light!',
  },
  {
    letterUpper: 'T',
    letterLower: 't',
    phonicSound: 't (ت)',
    sampleWord: 'Tiger',
    arabicTranslation: 'نمر',
    emoji: '🐯',
    exampleSentence: 'T is for Tiger, strong and striped!',
  },
  {
    letterUpper: 'U',
    letterLower: 'u',
    phonicSound: 'ʌ (آه سريعة)',
    sampleWord: 'Umbrella',
    arabicTranslation: 'مظلة',
    emoji: '☂️',
    exampleSentence: 'U is for Umbrella, keeps off the rain!',
  },
  {
    letterUpper: 'V',
    letterLower: 'v',
    phonicSound: 'v (ڤ)',
    sampleWord: 'Van',
    arabicTranslation: 'سيارة نقل',
    emoji: '🚐',
    exampleSentence: 'V is for Van, driving down the road!',
  },
  {
    letterUpper: 'W',
    letterLower: 'w',
    phonicSound: 'w (و)',
    sampleWord: 'Water',
    arabicTranslation: 'ماء',
    emoji: '💧',
    exampleSentence: 'W is for Water, cool and refreshing!',
  },
  {
    letterUpper: 'X',
    letterLower: 'x',
    phonicSound: 'ks (إكس)',
    sampleWord: 'Xylophone',
    arabicTranslation: 'آلة الإكسيلوفون الموسيقية',
    emoji: '🎼',
    exampleSentence: 'X is for Xylophone, making music bells!',
  },
  {
    letterUpper: 'Y',
    letterLower: 'y',
    phonicSound: 'j (ي)',
    sampleWord: 'Yo-yo',
    arabicTranslation: 'لعبة اليويو',
    emoji: '🪀',
    exampleSentence: 'Y is for Yo-yo, goes up and down!',
  },
  {
    letterUpper: 'Z',
    letterLower: 'z',
    phonicSound: 'z (ز)',
    sampleWord: 'Zebra',
    arabicTranslation: 'حمار وحشي',
    emoji: '🦓',
    exampleSentence: 'Z is for Zebra, black and white stripes!',
  },
];

// Interactive Science Topics for 1st Grade Primary (كتاب العلوم للصف الأول الابتدائي العراقي)
export const GRADE1_SCIENCE_TOPICS: ScienceTopicItem[] = [
  {
    id: 'sci-topic-1',
    title: 'الكائنات الحية والأشياء غير الحية',
    unitName: 'الوحدة الأولى: الكائنات الحية حولنا',
    icon: '🌱',
    summary: 'الكائنات الحية تحتاج إلى الماء والهواء والغذاء وتكبر وتتحرك، بينما الأشياء غير الحية لا تتنفس ولا تكبر.',
    keyConcepts: [
      {
        title: 'الكائن الحي (Living Thing)',
        desc: 'الإنسان والحيوان والنبات، يحتاجون للماء والهواء والغذاء لكي يعيشوا وينموا.',
        emoji: '🌿',
      },
      {
        title: 'الشيء غير الحي (Non-living)',
        desc: 'الصخور والسيارة والكرسي والقلم، أشياء لا تتغذى ولا تتنفس ولا تكبر وحدها.',
        emoji: '🪨',
      },
      {
        title: 'النمو والحركة',
        desc: 'الطفل الصغير يكبر ليصبح كبيراً، والنبتة الصغيرة تصبح شجرة خضراء.',
        emoji: '📈',
      },
    ],
    funFact: 'هل تعلم؟ حتى الأشجار العملاقة بدأت من بذرة صغيرة كانت تحتاج للماء وضوء الشمس فقط لتكبر!',
    voiceNote: 'في العلوم للصف الأول: الكائنات الحية هي الإنسان والحيوان والنبات. تحتاج إلى ماء وهواء وغذاء.',
  },
  {
    id: 'sci-topic-2',
    title: 'أجزاء النبات ووظائفها العجيبة',
    unitName: 'الوحدة الثانية: عالم النبات الجميل',
    icon: '🌻',
    summary: 'يتكون النبات من الجذر والساق والأوراق والزهرة، وكل جزء له وظيفة مهمة لحياة النبتة.',
    keyConcepts: [
      {
        title: 'الجذور (Roots)',
        desc: 'تثبت النبتة في التربة وتمتص الماء والأملاح الذائبة.',
        emoji: '🪴',
      },
      {
        title: 'الساق (Stem)',
        desc: 'يحمل الأوراق والأزهار وينقل الماء من الجذور إلى كل أجزاء النبتة.',
        emoji: '🎋',
      },
      {
        title: 'الأوراق الخضراء (Leaves)',
        desc: 'مصنع الغذاء الصغير! تصنع الغذاء للنبات بمساعدة ضوء الشمس.',
        emoji: '🍃',
      },
      {
        title: 'الزهرة والثمرة (Flower & Fruit)',
        desc: 'الزهرة تعطينا ثماراً شهية تحتوي على البذور مثل التفاح والرمان.',
        emoji: '🍎',
      },
    ],
    funFact: 'نخيل العراق المبارك يمتلك جذوراً قوية تتعمق في الأرض لتمتص الماء العذب في دجلة والفرات!',
    voiceNote: 'أجزاء النبات هي: الجذر يمتص الماء، الساق ينقل الماء، والورقة تصنع الغذاء للشجرة.',
  },
  {
    id: 'sci-topic-3',
    title: 'الحواس الخمسة في جسم الإنسان',
    unitName: 'الوحدة الثالثة: جسمي وكيف أتعرف على العالم',
    icon: '👀',
    summary: 'أنعم الله علينا بخمس حواس رائعة لنكتشف العالم: الإبصار، السمع، الشم، التذوق، واللمس.',
    keyConcepts: [
      {
        title: 'حاسة الإبصار (العينان)',
        desc: 'نرى بهما الألوان الجميلة والوجوه والكتب.',
        emoji: '👁️',
      },
      {
        title: 'حاسة السمع (الأذنان)',
        desc: 'نسمع بهما أصوات الطيور والقرآن وكلام المعلم.',
        emoji: '👂',
      },
      {
        title: 'حاسة الشم (الأنف)',
        desc: 'نشم به الروائح العطرة للورود والطعام.',
        emoji: '👃',
      },
      {
        title: 'حاسة التذوق (اللسان)',
        desc: 'نميز به بين الحلو والمالح والحامض.',
        emoji: '👅',
      },
      {
        title: 'حاسة اللمس (اليد والجلد)',
        desc: 'نشعر بالنعومة والخشونة والحرارة والبرودة.',
        emoji: '✋',
      },
    ],
    funFact: 'اللسان يستطيع التمييز بين حلاوة العسل وملوحة الحساء في أقل من ثانية واحدة!',
    voiceNote: 'الحواس الخمسة هي: العين للإبصار، الأذن للسمع، الأنف للشم، اللسان للتذوق، والجلد للمس.',
  },
  {
    id: 'sci-topic-4',
    title: 'البيئة الطبيعية في العراق (اليابسة والمائية)',
    unitName: 'الوحدة الرابعة: بيئتنا العراقية الخلابة',
    icon: '🏞️',
    summary: 'العراق يمتلك بيئات مائية عظيمة كنهري دجلة والفرات والأهوار، وبيئات يابسة كالسهول والجبال.',
    keyConcepts: [
      {
        title: 'البيئة المائية (نهري دجلة والفرات والأهوار)',
        desc: 'يعيش فيها الأسماك مثل الشبوط والطيور المهاجرة كالبط واللقلق ونبات القصب.',
        emoji: '🌊',
      },
      {
        title: 'البيئة اليابسة (السهول والجبال)',
        desc: 'يعيش فيها الإنسان والأبقار والأغنام والخيول والطيور المختلفة.',
        emoji: '⛰️',
      },
      {
        title: 'حماية البيئة',
        desc: 'الحفاظ على نظافة الماء والأشجار وعدم رمي النفايات في الأنهار.',
        emoji: '♻️',
      },
    ],
    funFact: 'أهوار جنوب العراق من أقدم وأجمل البيئات المائية الطبيعية في العالم ومدرجة على لائحة التراث العالمي!',
    voiceNote: 'بيئة العراق نوعان: بيئة مائية كالأنهار والأهوار، وبيئة يابسة كالسهول الخضراء والجبال.',
  },
  {
    id: 'sci-topic-5',
    title: 'الغذاء الصحي ونظافة الجسم',
    unitName: 'الوحدة الخامسة: صحة الأبطال والنشاط',
    icon: '🥗',
    summary: 'تناول الخضراوات والفواكه والحليب، وغسل اليدين بالماء والصابون يمنحنا قوة وصحة للتعلم.',
    keyConcepts: [
      {
        title: 'الغذاء الصحي المتنوع',
        desc: 'شرب الحليب، أكل التمر، الفواكه الطازجة، والبيض يقوي عظامنا وعقولنا.',
        emoji: '🥛',
      },
      {
        title: 'النظافة الشخصية',
        desc: 'غسل اليدين قبل وبعد الأكل بالماء والصابون، وتنظيف الأسنان يومياً.',
        emoji: '🧼',
      },
      {
        title: 'النوم المبكر والرياضة',
        desc: 'النوم مبكراً يريح الجسم ويجعلنا نستيقظ بنشاط للمدرسة.',
        emoji: '🛌',
      },
    ],
    funFact: 'غسل اليدين لمدة عشرين ثانية يطرد الجراثيم ويحميك من نزلات البرد ويجعلك بطلاً دائماً!',
    voiceNote: 'الغذاء الصحي هو الفواكه والخضار والحليب، والنظافة وغسل اليدين تحمينا من الأمراض.',
  },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  // Grade 1 (Specialized Interactive Subjects for Reading, Letters, English & Science)
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
    description: 'العلوم للصف الأول: الكائنات الحية، أجزاء النبات، الحواس الخمسة، حالات المادة والبيئة العراقية',
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
    description: 'الأعداد من 1 إلى 20، الجمع والطرح البسيط، الأشكال الهندسية والوقت',
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
    description: 'السور القرآنية القصيرة، أركان الإيمان، هوية الطفل المسلم، والآداب والأحاديث الشريفة',
    lessonsCount: 16,
    questionsCount: 20,
  },

  // Grade 2
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
    themeColor: 'blue',
    description: 'الأعداد حتى 999، جدول القيمة المكانية، الجمع والطرح مع إعادة التسمية',
    lessonsCount: 12,
    questionsCount: 12,
  },
  {
    id: 'sci-2',
    gradeId: 'grade-2',
    name: 'العلوم',
    code: 'SCIENCE_2',
    icon: '🌱',
    themeColor: 'cyan',
    description: 'دورة حياة النباتات والحيوانات، الغذاء الصحي، والبيئات الطبيعية',
    lessonsCount: 10,
    questionsCount: 10,
  },
  {
    id: 'isl-2',
    gradeId: 'grade-2',
    name: 'التربية الإسلامية',
    code: 'ISLAMIC_2',
    icon: '🕌',
    themeColor: 'emerald',
    description: 'سورة الفاتحة والإخلاص، سيرة الرسول محمد (ص)، وبر الوالدين',
    lessonsCount: 8,
    questionsCount: 8,
  },

  {
    id: "eng-2",
    gradeId: "grade-2",
    name: "اللغة الإنجليزية (English)",
    code: "ENG_2",
    icon: "🇬🇧",
    themeColor: "sky",
    description: "English for Iraq: Alphabet, Phonics, numbers, colors and classroom items",
    lessonsCount: 12,
    questionsCount: 10,
  },
  // Grade 3
  {
    id: 'ar-3',
    gradeId: 'grade-3',
    name: 'قراءتي (اللغة العربية)',
    code: 'ARABIC_3',
    icon: '📝',
    themeColor: 'amber',
    description: 'الهمزة، اللام الشمسية والقمرية، نصوص شعرية ونثرية هادفة',
    lessonsCount: 18,
    questionsCount: 16,
  },
  {
    id: 'math-3',
    gradeId: 'grade-3',
    name: 'الرياضيات',
    code: 'MATH_3',
    icon: '✖️',
    themeColor: 'orange',
    description: 'جدول الضرب الكامل، القسمة البسيطة، القياس والكسور الاعتيادية',
    lessonsCount: 15,
    questionsCount: 15,
  },
  {
    id: 'sci-3',
    gradeId: 'grade-3',
    name: 'العلوم',
    code: 'SCIENCE_3',
    icon: '🧲',
    themeColor: 'yellow',
    description: 'المغناطيسية، حالات المادة، التربة والصخور، والتغذية السليمة',
    lessonsCount: 12,
    questionsCount: 12,
  },
  {
    id: 'isl-3',
    gradeId: 'grade-3',
    name: 'التربية الإسلامية',
    code: 'ISLAMIC_3',
    icon: '🕌',
    themeColor: 'amber',
    description: 'القرآن الكريم، أحاديث نبوية شريفة في الصدق والأمانة',
    lessonsCount: 10,
    questionsCount: 10,
  },

  {
    id: "eng-3",
    gradeId: "grade-3",
    name: "اللغة الإنجليزية (English)",
    code: "ENG_3",
    icon: "🇬🇧",
    themeColor: "sky",
    description: "English for Iraq: My family, food, animals, daily routines and vocabulary",
    lessonsCount: 12,
    questionsCount: 10,
  },
  // Grade 4
  {
    id: 'ar-4',
    gradeId: 'grade-4',
    name: 'قواعد اللغة العربية والمطالعة',
    code: 'ARABIC_4',
    icon: '📚',
    themeColor: 'indigo',
    description: 'أقسام الكلام (اسم، فعل، حرف)، المذكر والمؤنث، المفرد والمثنى والجمع',
    lessonsCount: 20,
    questionsCount: 18,
  },
  {
    id: 'math-4',
    gradeId: 'grade-4',
    name: 'الرياضيات',
    code: 'MATH_4',
    icon: '📐',
    themeColor: 'blue',
    description: 'الملايين، ضرب عدد من مرتبتين، القسمة على عدد من مرتبة واحدة، والكسور العشرية',
    lessonsCount: 18,
    questionsCount: 16,
  },
  {
    id: 'sci-4',
    gradeId: 'grade-4',
    name: 'العلوم',
    code: 'SCIENCE_4',
    icon: '🧬',
    themeColor: 'violet',
    description: 'النظام البيئي، التغيرات الفيزيائية والكيميائية، والضوء والصوت',
    lessonsCount: 14,
    questionsCount: 14,
  },
  {
    id: 'soc-4',
    gradeId: 'grade-4',
    name: 'الاجتماعيات',
    code: 'SOC_4',
    icon: '🗺️',
    themeColor: 'purple',
    description: 'جغرافيا العراق ومحافظاته، حضارات بلاد الرافدين القديمة (سومر، بابل، آشور)',
    lessonsCount: 12,
    questionsCount: 12,
  },
  {
    id: 'eng-4',
    gradeId: 'grade-4',
    name: 'اللغة الإنجليزية (English)',
    code: 'ENG_4',
    icon: '🇬🇧',
    themeColor: 'sky',
    description: 'English for Iraq: Vocabulary, simple sentences, greetings and colors',
    lessonsCount: 12,
    questionsCount: 10,
  },

  {
    id: "isl-4",
    gradeId: "grade-4",
    name: "التربية الإسلامية",
    code: "ISLAMIC_4",
    icon: "🕌",
    themeColor: "emerald",
    description: "السور المقررة، أركان الإسلام، والآداب والأخلاق الإسلامية الفاضلة",
    lessonsCount: 12,
    questionsCount: 12,
  },
  // Grade 5
  {
    id: 'ar-5',
    gradeId: 'grade-5',
    name: 'قواعد اللغة العربية',
    code: 'ARABIC_5',
    icon: '📖',
    themeColor: 'violet',
    description: 'الفعل والفاعل والمفعول به، المبتدأ والخبر، وكان وأخواتها وإن وأخواتها',
    lessonsCount: 22,
    questionsCount: 20,
  },
  {
    id: 'math-5',
    gradeId: 'grade-5',
    name: 'الرياضيات',
    code: 'MATH_5',
    icon: '📊',
    themeColor: 'purple',
    description: 'المليارات، التحليل إلى العوامل الأولية، القاسم المشترك والمضاعف المشترك',
    lessonsCount: 20,
    questionsCount: 18,
  },
  {
    id: 'sci-5',
    gradeId: 'grade-5',
    name: 'العلوم',
    code: 'SCIENCE_5',
    icon: '🔬',
    themeColor: 'fuchsia',
    description: 'جهاز الدوران والتنفس والهضم في الإنسان، الكهرباء والمغناطيس',
    lessonsCount: 16,
    questionsCount: 16,
  },
  {
    id: 'soc-5',
    gradeId: 'grade-5',
    name: 'الاجتماعيات',
    code: 'SOC_5',
    icon: '🏛️',
    themeColor: 'rose',
    description: 'تضاريس العراق، مناخ وموارد العراق المائية، والتاريخ الإسلامي لبغداد والكوفة',
    lessonsCount: 14,
    questionsCount: 14,
  },

  {
    id: "isl-5",
    gradeId: "grade-5",
    name: "التربية الإسلامية",
    code: "ISLAMIC_5",
    icon: "🕌",
    themeColor: "emerald",
    description: "القرآن الكريم، أحكام التلاوة، السيرة النبوية الشريفة وأخلاق المسلم",
    lessonsCount: 14,
    questionsCount: 14,
  },
  {
    id: "eng-5",
    gradeId: "grade-5",
    name: "اللغة الإنجليزية (English)",
    code: "ENG_5",
    icon: "🇬🇧",
    themeColor: "blue",
    description: "English for Iraq: Time, sports, travel, grammar and vocabulary",
    lessonsCount: 16,
    questionsCount: 14,
  },
  // Grade 6 (Baccalaureate / الوزاري)
  {
    id: 'ar-6',
    gradeId: 'grade-6',
    name: 'قواعد اللغة العربية (وزاري)',
    code: 'ARABIC_6',
    icon: '👑',
    themeColor: 'rose',
    description: 'المنهج الوزاري الرسمي: النكرة والمعرفة، الفاعل والمفعول، نائب الفاعل، الأفعال الخمسة',
    lessonsCount: 24,
    questionsCount: 25,
  },
  {
    id: 'math-6',
    gradeId: 'grade-6',
    name: 'الرياضيات (وزاري)',
    code: 'MATH_6',
    icon: '🧮',
    themeColor: 'red',
    description: 'الأعداد الصحيحة، العمليات على الكسور الاعتيادية والعشرية، النسبة والتناسب والدائرة',
    lessonsCount: 22,
    questionsCount: 24,
  },
  {
    id: 'sci-6',
    gradeId: 'grade-6',
    name: 'العلوم (وزاري)',
    code: 'SCIENCE_6',
    icon: '⚡',
    themeColor: 'amber',
    description: 'التكاثر في النباتات، الجهاز العصبي والعضلي والهيكلي، الكتلة والوزن والآلات البسيطة',
    lessonsCount: 20,
    questionsCount: 20,
  },
  {
    id: 'isl-6',
    gradeId: 'grade-6',
    name: 'التربية الإسلامية (وزاري)',
    code: 'ISLAMIC_6',
    icon: '🕌',
    themeColor: 'emerald',
    description: 'أحكام التلاوة (اللام الشمسية والقمرية)، السور الوزارية المقررة، وسيرة أهل البيت والصحابة',
    lessonsCount: 16,
    questionsCount: 18,
  },
  {
    id: 'soc-6',
    gradeId: 'grade-6',
    name: 'الاجتماعيات (وزاري)',
    code: 'SOC_6',
    icon: '🗺️',
    themeColor: 'orange',
    description: 'محافظات العراق الثماني عشرة (الموقع، التضاريس، الموارد، والنبذة التاريخية العريقة)',
    lessonsCount: 20,
    questionsCount: 22,
  },
  {
    id: 'eng-6',
    gradeId: 'grade-6',
    name: 'اللغة الإنجليزية (English for Iraq)',
    code: 'ENG_6',
    icon: '🌐',
    themeColor: 'blue',
    description: 'Official Ministry Units: Family, Jobs, Materials, Tenses, Fun with English',
    lessonsCount: 18,
    questionsCount: 18,
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    "id": "q-g1-ar-1",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "درس دَار دُور",
    "questionText": "📖 ما هو الحرف الأول وصوته في كلمة [green]«دَار»[/green] و [blue]«دُور»[/blue]؟",
    "answerText": "هو **حرف الدال وصوته (دْ)**، ومعناها البيت الصغير الدافئ لأسرتنا 🏠.",
    "options": [
      "حرف الدال (د)",
      "حرف الباء (ب)",
      "حرف الراء (ر)",
      "حرف الميم (م)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حرف الدال يكتب على السطر ويشبه المنقار المفتوح، وصوته (د).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حروف",
      "قراءتي",
      "أصوات"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-ar-2",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "المقطع الصوتي (دا)",
    "questionText": "✏️ عند دمج صوت حرف الدال (د) مع حرف المد الطويل (ا)، يتكون المقطع [blue]......[/blue]",
    "answerText": "يتكون المقطع **(دَا)**، ومثاله كلمة: [red]«دَادَا»[/red] و [green]«دَار»[/green].",
    "options": [
      "دَا",
      "دُو",
      "دِي",
      "دَرْ"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المقطع الصوتي يتكون من حرف صحيح متبوعاً بحرف مد طويل (ا).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مقاطع",
      "مدود"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-3",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "حرف الراء وصوته",
    "questionText": "🔘 ما هو الحرف الذي يشبه الموزة أو الهلال الصغير في كلمة [red]«رَبَاب»[/red] و [orange]«رُمَّان»[/orange]؟",
    "answerText": "هو **حرف الراء (ر)** وصوته (رْ) 🌙.",
    "options": [
      "حرف الراء (ر)",
      "حرف النون (ن)",
      "حرف اللام (ل)",
      "حرف الكاف (ك)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حرف الراء حرف هابط ينزل طرفه تحت السطر وصوته رقيق وجميل.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حروف",
      "أصوات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-8",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "حرف الواو والمد بالواو",
    "questionText": "🕊️ ما هو المقطع الصوتي الناتج من دمج حرف الدال (د) مع حرف الواو (و) في كلمة [blue]«دُور»[/blue]؟",
    "answerText": "هو المقطع الصوتي **(دُو)**، وكلمة دور تعني بيوت كثيرة 🏘️.",
    "options": [
      "دُو",
      "دَا",
      "دِي",
      "وَا"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حرف الواو عندما يأتي بعد الدال يشكل مقطع المد الطويل (دُو).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مقاطع",
      "مدود"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-9",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "حرف الباء (بـ / ـب)",
    "questionText": "👶 ما الحرف الذي تحته نقطة واحدة في كلمة [purple]«بَابَا»[/purple] و [green]«بَاب»[/green]؟",
    "answerText": "هو **حرف الباء (ب)** وصوته (بْ) وتحته نقطة واحدة جميلة 🫓.",
    "options": [
      "حرف الباء (ب)",
      "حرف التاء (ت)",
      "حرف الثاء (ث)",
      "حرف النون (ن)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حرف الباء يشبه الصحن الصغير وتحته تفاحة أو نقطة واحدة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حروف",
      "أصوات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-ar-10",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "حرف النون (نـ / ـن)",
    "questionText": "🌟 كم نقطة يحمل حرف النون في بطنه في كلمة [orange]«نُور»[/orange] و [red]«نَار»[/red]؟",
    "answerText": "يحمل **نقطة واحدة في الأعلى** داخل بطنه المستدير 🥣.",
    "options": [
      "نقطة واحدة فوقه",
      "نقطتان تحته",
      "ثلاث نقاط فوقه",
      "بدون نقاط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "النون يشبه الهلال وبداخله نجمة أو نقطة واحدة في الأعلى.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حروف",
      "تأسيس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-11",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "حرف الميم (مـ / ـم)",
    "questionText": "🤱 ما هو الحرف الذي تبدأ به أجمل كلمة في الوجود [pink]«مَامَا»[/pink] و [blue]«مَاء»[/blue]؟",
    "answerText": "هو **حرف الميم (م)** وصوته الرقيق (مْ) ❤️.",
    "options": [
      "حرف الميم (م)",
      "حرف الراء (ر)",
      "حرف الفاء (ف)",
      "حرف الدال (د)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "كلمة ماما تتكون من مقطعين صوتيين متماثلين: (مَا + مَا = مَامَا).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حروف",
      "مقاطع"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-ar-12",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الأول: الحروف والمقاطع بالحركات",
    "lessonName": "حرف الياء والمد بالياء",
    "questionText": "🦆 أين تقع نقطتا حرف الياء (يـ) في كلمة [cyan]«دِيك»[/cyan] و [blue]«يَد»[/blue]؟",
    "answerText": "تقع **نقطتان اثنتان تحت الحرف** (يـ) مثل عيني البطة 🦆.",
    "options": [
      "نقطتان تحته",
      "نقطة واحدة فوقه",
      "ثلاث نقاط تحته",
      "نقطتان فوقه"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الياء الأولية والوسطية تكتب بنقطتين في الأسفل وصوتها (ي).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حروف",
      "تأسيس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-4",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثاني: الكلمات والجمل البسيطة",
    "lessonName": "تحليل الكلمات إلى مقاطع",
    "questionText": "📝 كم مقطعاً صوتياً تتكون منه كلمة [purple]«بَابَا»[/purple]؟",
    "answerText": "تتكون من **مقطعين صوتيين** هما: [red](بَا)[/red] + [blue](بَا)[/blue] = بَابَا 👨.",
    "options": [
      "مقطعان (با + با)",
      "مقطع واحد",
      "ثلاثة مقاطع",
      "أربعة مقاطع"
    ],
    "correctAnswerIndex": 0,
    "explanation": "التحليل الصوتي يساعد التلميذ على التهجي والقراءة السريعة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "تحليل",
      "مقاطع"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-ar-5",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثاني: الكلمات والجمل البسيطة",
    "lessonName": "حركة الفتحة القصيرة",
    "questionText": "📖 أين تكتب [amber]«حركة الفتحة َ»[/amber]؟ وكيف نفتح فمنا عند نطقها؟",
    "answerText": "تكتب الفتحة **فوق الحرف مباشرة**، ونفتح فمنا قليلاً للأعلى بصوت خفيف مثل: دَ ، رَ ، بَ.",
    "options": [
      "فوق الحرف ونفتح فمنا قليلاً",
      "تحت الحرف ونكسر فمنا",
      "أمام الحرف ونغمض أعيننا",
      "في نهاية السطر فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الفتحة بنت الألف وصوتها قصير ولطيف فوق الحرف.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حركات",
      "تأسيس"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-ar-13",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثاني: الكلمات والجمل البسيطة",
    "lessonName": "حركة الكسرة القصيرة",
    "questionText": "🎵 في درس [blue]«مِزْمَارُ مَازِن»[/blue]، أين توضع حركة الكسرة ( ِ) تحت الحرف؟",
    "answerText": "توضع **تحت الحرف** مباشرة ونبتسم ونكسر صوتنا قليلاً مثل: مِـ ، زِ ، رِ 🎻.",
    "options": [
      "تحت الحرف مباشرة (مِـ)",
      "فوق الحرف مباشرة",
      "بجانب الحرف الأخير",
      "فوق السطر"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الكسرة صوتها قصير وتكتب أسفل الحرف وصوتها يشبه الياء الخفيفة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حركات",
      "كسرة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-14",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثاني: الكلمات والجمل البسيطة",
    "lessonName": "حركة الضمة القصيرة",
    "questionText": "🎈 ما هي الحركة التي تشبه حرف الواو الصغير وتجلس فوق الحرف في [red]«دُبُّ مُنِير»[/red]؟",
    "answerText": "هي **حركة الضمة ( ُ)**، ونضم شفتينا كأننا نبتسم لدائرة صغيرة 🧸.",
    "options": [
      "الضمة ( ُ)",
      "الكسرة ( ِ)",
      "السكون ( ْ)",
      "تنوين الفتح ( ً)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الضمة واو صغيرة تجلس فوق الحرف وتدل على الصوت القصير (أُو).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حركات",
      "ضمة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-15",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثاني: الكلمات والجمل البسيطة",
    "lessonName": "تنوين الضم في قراءتي",
    "questionText": "🔔 كيف ننطق تنوين الضم ( ٌ) في نهاية الكلمة مثل: [green]«وَرْدٌ»[/green] و [blue]«قِطَارٌ»[/blue]؟",
    "answerText": "نسمع في نهايتها **صوت نون ساكنة خفيفة** تُلفظ ولا تُكتب: (وَرْدُنْ - قِطَارُنْ) 🚂.",
    "options": [
      "صوت نون ساكنة خفيفة ترن كالجرَس",
      "صوت ميم ممدودة",
      "صوت ألف طويلة",
      "لا ينطق أبداً"
    ],
    "correctAnswerIndex": 0,
    "explanation": "التنوين نون ساكنة تلحق آخر الاسم تنطق ولا تكتب ونرسمها ضمتين ( ٌ).",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "تنوين",
      "قواعد"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-ar-16",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثاني: الكلمات والجمل البسيطة",
    "lessonName": "درس بُوق نَدِيم",
    "questionText": "🎺 ما الحرف الذي ينتهي بنقطتين في الأعلى في كلمة [red]«بُوق»[/red] و [purple]«نَدِيم»[/purple]؟",
    "answerText": "هو **حرف القاف (ق)** في كلمة بوق، وصوته قوي ونقطتاه في الأعلى 📢.",
    "options": [
      "حرف القاف (ق)",
      "حرف الفاء (ف)",
      "حرف الكاف (ك)",
      "حرف اللام (ل)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "القاف حرف له رقبة ورأسه مستدير وفوقه نقطتان، وصوته (ق).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حروف",
      "أصوات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-17",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثاني: الكلمات والجمل البسيطة",
    "lessonName": "درس رِيف مَنَاف",
    "questionText": "🐄 ماذا يوجد في ريف مناف الجميل في كتاب قراءتي؟",
    "answerText": "في ريف مناف **بَقَرٌ وَوَزٌّ**، وبقر مناف يَرعى في الحقل الأخضر 🌾.",
    "options": [
      "بَقَرٌ وَوَزٌّ",
      "أسماك في الحوض فقط",
      "سيارات وطائرات",
      "ثلج وجبال فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "درس ريف مناف يدرب التلميذ على نطق حرف الفاء (ف) في الريف والوز.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مطالعة",
      "قصص"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-6",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "مِيزَانُ قَدُّورِي",
    "questionText": "⚖️ ماذا يزن قدوري في درسه الجميل بالميزان؟",
    "answerText": "قدوري وزّان يزن [green]«الزَّبِيب»[/green] اللذيذ بالميزان، ومعه نادر بزّاز 🍇.",
    "options": [
      "الزَّبِيب",
      "الحجارة",
      "الألعاب",
      "الملابس"
    ],
    "correctAnswerIndex": 0,
    "explanation": "درس ميزان قدوري يدرب التلميذ على نطق الحرف المشدد بالشدة ّ.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مطالعة",
      "شدة"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-7",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "درس دَادَا رَبَاب",
    "questionText": "✏️ أكمل قراءة الجملة الجميلة: دادا رباب، نَمِيرٌ [blue]......[/blue] وبدري ما نام.",
    "answerText": "نَمِيرٌ **نَامَ** 💤، وبدري ما نام.",
    "options": [
      "نَامَ",
      "أَكَلَ",
      "لَعِبَ",
      "طَارَ"
    ],
    "correctAnswerIndex": 0,
    "explanation": "جملة سهلة تدرب التلميذ على تمييز حرف النون والميم والألف.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قراءتي",
      "جمل"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-18",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "الشدّة في الكلمات ( ّ)",
    "questionText": "👑 ما هي العلامة التي توضع فوق الحرف لتقول لنا: (هذا الحرف مكرر مرتين، الأول ساكن والثاني متحرك)؟",
    "answerText": "هي **عَلامَةُ الشَّدَّة ( ّ)**، وتشبه التاج الصغير مثل: حَدَّاد، نَجَّار 🔨.",
    "options": [
      "الشَّدَّة ( ّ)",
      "السكون ( ْ)",
      "الفتحة ( َ)",
      "الهمزة (ء)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الشدة تدمج الحرفين المتماثلين في حرف واحد مشدد قوي.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "شدة",
      "قواعد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-ar-19",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "درس بَطٌّ وَطُيُور",
    "questionText": "🦆 في درس «بَطٌّ وَطُيُور»، أين يسبح البط في الماء؟",
    "answerText": "يسبح البط في **حَوْضِ المَاءِ** ويقول: واق واق 🌊.",
    "options": [
      "فِي الحَوْضِ وَالمَاءِ",
      "فوق الأشجار العالية",
      "في الصحراء الجافة",
      "داخل المنزل المغلق"
    ],
    "correctAnswerIndex": 0,
    "explanation": "درس بط وطيور يعلم التلميذ حرف الطاء (ط) وتنوين الضم (بطٌّ).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مطالعة",
      "طيور"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-20",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "درس سَالِمٌ مُزَارِع",
    "questionText": "🌾 ماذا يزرع سالم المزارع النشيط في بستانه؟",
    "answerText": "يزرع سالم [green]«الوَرْدَ وَالفُلْفُلَ»[/green]، ويزرع الخضار اللذيذة 🍅.",
    "options": [
      "الوَرْدَ وَالفُلْفُلَ وَالخُضَار",
      "الحجارة والرمال",
      "الملابس والأحذية",
      "الأواني فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "درس سالم مزارع يدرب التلميذ على حرف العين (عـ / ـعـ / ـع / ع) بأشكاله الأربعة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مطالعة",
      "حرف العين"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-21",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "درس عَلَمُ بِلادِي",
    "questionText": "🇮🇶 ماذا يرفع علي في مدرسته وهو يهتف: عاش العراق؟",
    "answerText": "يرفع **عَلَمَ العِرَاقِ العَزِيزِ** عالياً في ساحة المدرسة رفرافاً 🇮🇶.",
    "options": [
      "عَلَمَ بِلادِي العِرَاق",
      "لوحة الرسم فقط",
      "طائرة ورقية",
      "المظلة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "درس علم بلادي يغرس حب العراق والاعتزاز براية الوطن.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مطالعة",
      "وطني"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-ar-22",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "اللام القمرية واللام الشمسية",
    "questionText": "🌙 في كلمة [blue]«القَمَر»[/blue]، هل ننطق صوت حرف اللام؟",
    "answerText": "نعم، ننطق اللام واضحة ساكنة: **(اَلْـ قَمَر)**، وهي لام قمرية ناصعة 🌕.",
    "options": [
      "نعم، تُلفظ اللام واضحة (الْـ)",
      "لا، تحذف ولا تلفظ أبداً",
      "تلفظ نوناً",
      "تلفظ واواً"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حروف اللام القمرية (ابغ حجك وخف عقيمه) تظهر فيها اللام صريحة بالسكون.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "لام قمرية",
      "تأسيس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-23",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "اللام الشمسية في قراءتي",
    "questionText": "☀️ في كلمة [amber]«الشَّمْس»[/amber]، لماذا لا ننطق اللام ونشدد الحرف الذي بعدها؟",
    "answerText": "لأنها **لام شمسية** تُكتب ولا تُلفظ، ويأتي الحرف الشمسي بعدها مشدداً (اَشَّمْس) ☀️.",
    "options": [
      "لأنها لام شمسية تكتب ولا تنطق ويشدد ما بعدها",
      "لأن اللام سقطت في الماء",
      "لأن الشمس حارقة فأذابتها",
      "لأنها كلمة إنجليزية"
    ],
    "correctAnswerIndex": 0,
    "explanation": "اللام الشمسية تدغم في الحرف الذي يليها ويوضع عليه شدة.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "لام شمسية",
      "قواعد"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-ar-24",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "درس غَزَالٌ وَغُرَاب",
    "questionText": "🦌 من الذي ساعد الغزال الصغير وقطع عنه الحبل في القصة؟",
    "answerText": "صديقه **الغُرَابُ الشُّجَاعُ** وفأر الحقل الوفي 🕊️.",
    "options": [
      "الغُرَابُ الصَّدِيقُ",
      "الذئب الماكر",
      "الصياد",
      "النمر"
    ],
    "correctAnswerIndex": 0,
    "explanation": "قصة غزال وغراب تعلم التلميذ حرف الغين (غ) وقيمة الصداقة والتعاون.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مطالعة",
      "حرف الغين"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-ar-25",
    "gradeId": "grade-1",
    "subjectId": "ar-1",
    "chapter": "الفصل الثالث: القصص والمطالعة",
    "lessonName": "درس نَبِيلٌ بَقَّال",
    "questionText": "🍎 ماذا قال نبيل البقال عندما سأله إسماعيل: ماذا عندك يا نبيل؟",
    "answerText": "قال نبيل: **عندنا لَبَنٌ، وعندنا رُمَّانٌ** لَذِيذ 🥛.",
    "options": [
      "عِنْدَنَا لَبَنٌ وَرُمَّانٌ",
      "عندنا خشب وحديد",
      "عندنا ألعاب ودمى",
      "ليس عندنا شيء"
    ],
    "correctAnswerIndex": 0,
    "explanation": "درس نبيل بقال يدرب التلميذ على حرف اللام (ل) في أول ووسط وآخر الكلمة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مطالعة",
      "حرف اللام"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-1",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر",
    "lessonName": "العد البسيط وتمثيل الأعداد",
    "questionText": "🍎 كم تفاحة تظهر أمامك إذا كان في السلة: تفاحة، وتفاحة، وتفاحة؟",
    "answerText": "يوجد **ثلاث تفاحات (3)** 🍎🍎🍎.",
    "options": [
      "3 تفاحات",
      "تفاحة واحدة",
      "5 تفاحات",
      "صفر"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نعد الأشياء واحداً تلو الآخر: واحد، اثنان، ثلاثة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "رياضيات",
      "أعداد",
      "عد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-2",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر",
    "lessonName": "مفهوم الصفر (0)",
    "questionText": "🌳 كان على الغصن عصفوران فطار كلاهما بعيداً، كم عصفوراً بقي على الغصن؟",
    "answerText": "لم يبقَ أي عصفور، والعدد هو **صفر (0)** 🕊️.",
    "options": [
      "العدد صفر (0)",
      "عصفوران",
      "عصفور واحد",
      "أربعة عصافير"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الصفر يعني خلو المكان من أي عنصر أو شيء مادي.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "رياضيات",
      "الصفر"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-math-3",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر",
    "lessonName": "المقارنة بين الأعداد (أكبر وأصغر)",
    "questionText": "⚖️ أيهما أكبر: العدد [red]«5»[/red] أم العدد [blue]«2»[/blue]؟ وما هي الإشارة المناسبة؟",
    "answerText": "العدد **5 أكبر من 2**، والإشارة المناسبة هي: (5 > 2) ⭐.",
    "options": [
      "العدد 5 أكبر من 2 (5 > 2)",
      "العدد 2 أكبر من 5",
      "العددان متساويان تماماً",
      "لا يمكن المقارنة بينهما"
    ],
    "correctAnswerIndex": 0,
    "explanation": "خمسة عناصر أكثر وأكبر من عنصرين، وفم التمساح يفتح دائماً نحو العدد الأكبر.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "رياضيات",
      "مقارنة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-9",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر",
    "lessonName": "الأنماط وتكملتها",
    "questionText": "🎨 ما هو الشكل القادم في النمط التالي: 🔴 🔵 🔴 🔵 [blue]......[/blue]؟",
    "answerText": "الشكل القادم هو **الدائرة الحمراء 🔴** ليكتمل تكرار النمط بانتظام.",
    "options": [
      "دائرة حمراء 🔴",
      "دائرة خضراء 🟢",
      "مثلث أصفر 🔺",
      "مربع أزرق 🟦"
    ],
    "correctAnswerIndex": 0,
    "explanation": "النمط هو تتابع منتظم للألوان أو الأشكال يتكرر بنفس القاعدة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أنماط",
      "تفكير"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-math-10",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر",
    "lessonName": "الترتيب التصاعدي والتنازلي",
    "questionText": "🪜 ما هو العدد الذي يأتي مباشرة بعد العدد 6 عند العد التصاعدي؟",
    "answerText": "العدد الذي يليه هو **العدد سبعة (7)** 🎈.",
    "options": [
      "العدد 7",
      "العدد 5",
      "العدد 4",
      "العدد 9"
    ],
    "correctAnswerIndex": 0,
    "explanation": "العد التصاعدي نصعد كالسلم: 1، 2، 3، 4، 5، 6، 7.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "ترتيب",
      "أعداد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-4",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثاني: الجمع حتى العدد 9",
    "lessonName": "مفهوم الجمع البسيط (+)",
    "questionText": "➕ كم ناتج جمع: [blue]3 + 2 = ؟[/blue]",
    "answerText": "ناتج الجمع هو **خمسة (5)** 🖐️.",
    "options": [
      "5",
      "4",
      "6",
      "1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نضم 3 أصابع مع إصبعين فيكون المجموع 5.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "رياضيات",
      "جمع"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-5",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثاني: الجمع حتى العدد 9",
    "lessonName": "مسألة جمع حياتية ممتعة",
    "questionText": "🎈 كان مع أحمد 4 بالونات حمراء، وأعطته أخته بالونين أزرقين، كم بالوناً أصبح مع أحمد؟",
    "answerText": "أصبح مع أحمد: **4 + 2 = 6 بالونات** 🎈.",
    "options": [
      "6 بالونات",
      "5 بالونات",
      "7 بالونات",
      "2 بالون"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نجمع ما كان معه مع ما حصل عليه: 4 زائد 2 يساوي 6.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "رياضيات",
      "مسائل"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-11",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثاني: الجمع حتى العدد 9",
    "lessonName": "خاصية جمع الصفر",
    "questionText": "🌟 كم ناتج جمع أي عدد مع الصفر، مثل: [purple]6 + 0 = ؟[/purple]",
    "answerText": "يبقى العدد نفسه دون تغيير: **6** 🎯.",
    "options": [
      "6",
      "0",
      "7",
      "1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الصفر عنصر محايد في الجمع ولا يغير من قيمة العدد شيئاً.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "جمع",
      "صفر"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-math-12",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثاني: الجمع حتى العدد 9",
    "lessonName": "جمع العدد مع نفسه (المضاعفة)",
    "questionText": "✌️ كم يساوي ناتج جمع العدد مع نفسه: [green]4 + 4 = ؟[/green]",
    "answerText": "الناتج هو **ثمانية (8)** 🐙.",
    "options": [
      "8",
      "7",
      "9",
      "6"
    ],
    "correctAnswerIndex": 0,
    "explanation": "جمع الأعداد المتماثلة ينمي مهارة الحساب الذهني السريع.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "جمع",
      "حساب ذهني"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-13",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثاني: الجمع حتى العدد 9",
    "lessonName": "تكوين الأعداد حتى 9",
    "questionText": "🧩 أي عددين من التاليين يكون مجموعهما يساوي [red]«7»[/red]؟",
    "answerText": "العددان هما: **5 و 2** (5 + 2 = 7) 🎲.",
    "options": [
      "5 + 2",
      "3 + 1",
      "6 + 3",
      "4 + 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "العدد 7 يمكن تكوينه من (5 + 2) أو (4 + 3) أو (6 + 1).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "تكوين الأعداد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-6",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثالث: الطرح حتى العدد 9",
    "lessonName": "مفهوم الطرح البسيط (-)",
    "questionText": "➖ كان في الصحن 5 برتقالات، أكلت مريم برتقالتين، كم برتقالة بقيت في الصحن؟",
    "answerText": "بقيت **3 برتقالات** (5 - 2 = 3) 🍊.",
    "options": [
      "3 برتقالات",
      "2 برتقالة",
      "4 برتقالات",
      "5 برتقالات"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الطرح يعني الأخذ أو الإنقاص من المجموعة الأصلية.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "طرح",
      "حساب"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-14",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثالث: الطرح حتى العدد 9",
    "lessonName": "طرح العدد من نفسه",
    "questionText": "🍬 كان مع علي 4 قطع حلوى وأعطاها كلها لأصدقائه، كم قطعة بقيت معه: [blue]4 - 4 = ؟[/blue]",
    "answerText": "بقي معه **صفر (0)** لأنه طرح العدد من نفسه بالكامل 🍭.",
    "options": [
      "0",
      "4",
      "1",
      "2"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عند طرح أي عدد من نفسه فإن الناتج يكون دائماً صفراً.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "طرح",
      "صفر"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-math-15",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثالث: الطرح حتى العدد 9",
    "lessonName": "طرح الصفر من أي عدد",
    "questionText": "🎯 كم ناتج طرح الصفر من العدد تسعة: [red]9 - 0 = ؟[/red]",
    "answerText": "الناتج هو **تسعة (9)** كما هو دون أي نقصان 🌟.",
    "options": [
      "9",
      "0",
      "8",
      "1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "طرح الصفر يعني أننا لم ننقص شيئاً فيبقى العدد كما هو.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "طرح"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-16",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثالث: الطرح حتى العدد 9",
    "lessonName": "حقائق الطرح المترابطة",
    "questionText": "🤔 إذا كان 3 + 4 = 7، فكم يكون ناتج: [purple]7 - 4 = ؟[/purple]",
    "answerText": "الناتج هو **ثلاثة (3)** لأن الجمع والطرح عمليتان عكسيتان 🔄.",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عائلة الحقائق المترابطة تربط بين الأعداد الثلاثة (3، 4، 7).",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "طرح",
      "علاقة الجمع بالطرح"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-math-17",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الثالث: الطرح حتى العدد 9",
    "lessonName": "العد إلى الوراء للطرح",
    "questionText": "🏃 عند طرح 8 - 3 بالعد إلى الوراء ثلاث خطوات من العدد 8، نصل إلى العدد:",
    "answerText": "نصل إلى العدد **خمسة (5)** (8 ← 7 ← 6 ← 5) 🖐️.",
    "options": [
      "5",
      "6",
      "4",
      "7"
    ],
    "correctAnswerIndex": 0,
    "explanation": "العد إلى الوراء على خط الأعداد استراتيجية سهلة للطرح في الصف الأول.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "طرح",
      "خط الأعداد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-7",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الرابع: الأعداد حتى 20",
    "lessonName": "الآحاد والعشرات في العدد 15",
    "questionText": "🔢 في العدد [blue]«15»[/blue]، كم الآحاد وكم العشرات؟",
    "answerText": "يوجد **5 آحاد و 1 عشرة** (5 في مرتبة الآحاد، و1 في مرتبة العشرات) 🏷️.",
    "options": [
      "5 آحاد و 1 عشرة",
      "1 آحاد و 5 عشرات",
      "15 عشرة",
      "صفر آحاد"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المرتبة الأولى من اليمين هي الآحاد وتليها مرتبة العشرات.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "آحاد وعشرات",
      "أعداد"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-math-18",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الرابع: الأعداد حتى 20",
    "lessonName": "العدد عشرة (10) وتكوينه",
    "questionText": "🖐️ إذا فتحت أصابع يديك الاثنتين معاً، كم إصبعاً في اليدين؟",
    "answerText": "يوجد **عشرة أصابع (10)** (5 في اليد اليمنى + 5 في اليد اليسرى) 👐.",
    "options": [
      "10 أصابع",
      "8 أصابع",
      "12 إصبعاً",
      "5 أصابع"
    ],
    "correctAnswerIndex": 0,
    "explanation": "العشرة تتكون من 5 + 5 وتمثل حزمة عشرة واحدة كاملة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "العدد 10"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-19",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الرابع: الأعداد حتى 20",
    "lessonName": "مقارنة الأعداد حتى 20",
    "questionText": "⚖️ أي العددين أكبر: [red]«18»[/red] أم [blue]«13»[/blue]؟",
    "answerText": "العدد **18 أكبر من 13** لأن آحاد الـ 18 أكبر من آحاد الـ 13 🏆.",
    "options": [
      "العدد 18 أكبر",
      "العدد 13 أكبر",
      "متساويان",
      "لا نعلم"
    ],
    "correctAnswerIndex": 0,
    "explanation": "العشرات متساوية (10 واحدة)، ولكن 8 أكبر من 3 لذا فالعدد 18 هو الأكبر.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مقارنة",
      "أعداد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-20",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الرابع: الأعداد حتى 20",
    "lessonName": "العدد السابق والتالي حتى 20",
    "questionText": "❓ ما هو العدد الواقع بين العددين 11 و 13؟",
    "answerText": "العدد الواقع بينهما هو **العدد اثنا عشر (12)** 🎯.",
    "options": [
      "12",
      "14",
      "10",
      "15"
    ],
    "correctAnswerIndex": 0,
    "explanation": "التسلسل العددي: 11 ثم 12 ثم 13.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "تسلسل",
      "أعداد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-21",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الرابع: الأعداد حتى 20",
    "lessonName": "جمع الأعداد حتى 20",
    "questionText": "➕ كم ناتج جمع: [purple]10 + 6 = ؟[/purple]",
    "answerText": "الناتج هو **ستة عشر (16)** 🌟.",
    "options": [
      "16",
      "15",
      "17",
      "14"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عشرة واحدة نضيف إليها 6 آحاد تصبح 16 مباشرة وبسهولة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "جمع",
      "أعداد حتى 20"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-math-8",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الخامس: الأشكال الهندسية والقياس",
    "lessonName": "الأشكال المستوية الهندسية",
    "questionText": "🔺 ما اسم الشكل الهندسي الذي يمتلك 3 أضلاع و 3 زوايا ويشبه قطعة البيتزا؟",
    "answerText": "هو **المثلث** 📐.",
    "options": [
      "المثلث",
      "المربع",
      "الدائرة",
      "المستطيل"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المثلث يتكون من 3 قطع مستقيمة تلتقي في 3 رؤوس.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "هندسة",
      "أشكال"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-22",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الخامس: الأشكال الهندسية والقياس",
    "lessonName": "المربع والدائرة",
    "questionText": "⚪ ما هو الشكل المستدير الذي يشبه الشمس وقرص الساعة ولا يمتلك أي زوايا؟",
    "answerText": "هو **الدائرة** المستديرة 🌕.",
    "options": [
      "الدائرة",
      "المربع",
      "المثلث",
      "المخروط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الدائرة شكل هندسي منحنٍ ومستدير بالكامل دون أي أضلاع مستقيمة أو زوايا.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "هندسة",
      "دائرة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-23",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الخامس: الأشكال الهندسية والقياس",
    "lessonName": "قراءة الساعة بالساعات الكاملة",
    "questionText": "⏰ عندما يشير العقرب الصغير إلى الرقم 3 والعقرب الكبير إلى الرقم 12، كم تكون الساعة؟",
    "answerText": "تكون الساعة **الثالثة تماماً (3:00)** 🕒.",
    "options": [
      "الساعة الثالثة تماماً",
      "الساعة الثانية عشرة",
      "الساعة السادسة",
      "الساعة الواحدة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "العقرب القصير يشير إلى الساعات والعقرب الطويل عندما يكون عند 12 تكون الساعة تماماً.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وقت",
      "ساعة"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-math-24",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الخامس: الأشكال الهندسية والقياس",
    "lessonName": "أيام الأسبوع السبعة",
    "questionText": "📅 كم عدد أيام الأسبوع؟ وما هو اليوم المفضل للصلاة والعطلة في العراق؟",
    "answerText": "عدد أيام الأسبوع **7 أيام**، ويوم الجمعة هو يوم العطلة والاجتماع العائلي المبارك 🕌.",
    "options": [
      "7 أيام، ويوم الجمعة",
      "5 أيام فقط",
      "10 أيام",
      "3 أيام"
    ],
    "correctAnswerIndex": 0,
    "explanation": "أيام الأسبوع هي: السبت، الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أيام الأسبوع",
      "قياس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-math-25",
    "gradeId": "grade-1",
    "subjectId": "math-1",
    "chapter": "الفصل الخامس: الأشكال الهندسية والقياس",
    "lessonName": "مقارنة الأطوال والأوزان",
    "questionText": "🦒 أيهما أطول: الزرافة الجميلة أم الأرنب الصغير؟",
    "answerText": "الزرافة **أطول بكثير** من الأرنب برقبتها الطويلة 🦒.",
    "options": [
      "الزرافة أطول",
      "الأرنب أطول",
      "لهما نفس الطول",
      "الأرنب أطول من الشجرة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المقارنة بين الأطوال تعتمد على قياس الارتفاع والامتداد من الأسفل إلى الأعلى.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أطوال",
      "مقارنة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-1",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الأول: الكائنات الحية وأجزاؤها",
    "lessonName": "الكائنات الحية واحتياجاتها",
    "questionText": "🌿 ما هي الكائنات الحية؟ وماذا تحتاج لكي تعيش وتكبر؟",
    "answerText": "الكائنات الحية هي التي **تتحرك وتتنفس وتكبر وتتغذى**، وتحتاج إلى: [red]الماء والغذاء والهواء المناسب[/red]، مثل: الإنسان والحيوان والنبات 🦁🌱.",
    "options": [
      "الماء والغذاء والهواء لكي تنمو وتكبر",
      "الحجارة والرمال والتراب فقط",
      "الألعاب والأجهزة الكهربائية",
      "الملابس فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "جميع الكائنات الحية تتنفس الهواء وتشرب الماء وتتغذى لكي تنمو وتعيش.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "كائنات حية",
      "الصف الأول"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-sci-2",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الأول: الكائنات الحية وأجزاؤها",
    "lessonName": "أهمية الماء للنبات",
    "questionText": "🧐 علل: لماذا تذبل شجرة الورد وتموت إذا انقطع عنها سقي الماء؟",
    "answerText": "لأن النبات **كائن حي يحتاج إلى الماء** مع ضوء الشمس لكي يصنع غذاءه وينمو ويبقى نضراً ومزدهراً 🌸.",
    "options": [
      "لأن النبات كائن حي يحتاج الماء للعيش وصنع الغذاء",
      "لأن النبات جماد لا يحتاج أي شيء",
      "لكي يلعب مع الطيور في الهواء",
      "لأن أوراقه تحب العطش"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الماء ضروري جداً لجميع خلايا النبات لصنع الغذاء والنمو.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "نبات",
      "ماء"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-3",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الأول: الكائنات الحية وأجزاؤها",
    "lessonName": "أجزاء النبات الرئيسي",
    "questionText": "🌴 ما هي الأجزاء الرئيسية الثلاثة التي تتكون منها معظم النباتات؟",
    "answerText": "تتكون النباتات من ثلاثة أجزاء رئيسية: **الجذور، والساق، والأوراق** 🌱.",
    "options": [
      "الجذور، والساق، والأوراق",
      "العجلات، والمقود، والمحرك",
      "الأبواب، والشبابيك، والسقف",
      "الأصابع، والعيون، والأنف"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الجذر يثبت النبات، والساق يحمله، والورقة تصنع الغذاء الأخضر.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "أجزاء النبات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-4",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الأول: الكائنات الحية وأجزاؤها",
    "lessonName": "التمييز بين الحي والجماد",
    "questionText": "🧸 أي مما يلي يعتبر شيئاً غير حي (جماد) لا يتنفس ولا يأكل ولا يكبر؟",
    "answerText": "هو **الحجر والسيارة واللعبة** 🚗، فهي أشياء غير حية.",
    "options": [
      "اللعبة والسيارة والحجر",
      "السمكة الصغيرة",
      "شجرة النخيل العالية",
      "الطفل الصغير"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الأشياء غير الحية لا تتنفس ولا تنمو ولا تحتاج إلى طعام أو شراب.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "جمادات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-5",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الأول: الكائنات الحية وأجزاؤها",
    "lessonName": "وظيفة الجذور في النبات",
    "questionText": "🌱 أين تنمو جذور النبات غالباً؟ وما هي وظيفتها الأساسية؟",
    "answerText": "تنمو الجذور **تحت التراب** لتثبيت النبات في الأرض وامتصاص الماء والأملاح المعدنية من التربة 🌾.",
    "options": [
      "تثبت النبات في التربة وتمتص الماء",
      "تطير في الهواء للبحث عن الشمس",
      "تصدر أصواتاً موسيقية",
      "تتحرك لتلعب مع الفراشات"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الجذر يمتص الماء والغذاء المذاب في التربة ويرسله للأعلى.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "جذور"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-sci-6",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثاني: البيئة الطبيعية ومكوناتها",
    "lessonName": "مفهوم البيئة وأنواعها",
    "questionText": "🌍 ما هي البيئة؟ وما البيئتان الرئيسيتان على كوكب الأرض؟",
    "answerText": "البيئة هي **المكان الذي يعيش فيه الكائن الحي** ومحيطه، وتنقسم إلى: بيئة اليابسة وبيئة مائية 🌊.",
    "options": [
      "بيئة اليابسة وبيئة مائية",
      "بيئة الفضاء وبيئة القمر",
      "بيئة الألعاب وبيئة الأثاث",
      "بيئة الدفتر وبيئة القلم"
    ],
    "correctAnswerIndex": 0,
    "explanation": "اليابسة تضم الغابات والصحاري، والبيئة المائية تضم الأنهار والبحار والأهوار.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "بيئة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-7",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثاني: البيئة الطبيعية ومكوناتها",
    "lessonName": "بيئة الأسماك المائية وكيف تتنفس",
    "questionText": "🐟 كيف تتنفس الأسماك الهواء المذاب في بيئتها المائية دون أن تغرق؟",
    "answerText": "تتنفس الأسماك بواسطة **الخياشيم** الموجودة على جانبي رأسها، وتسبح بزعانفها 🐠.",
    "options": [
      "بواسطة الخياشيم والزعانف",
      "بواسطة الرئتين مثل الإنسان",
      "بواسطة قشورها فقط",
      "عن طريق فتح عينيها"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الخياشيم عضو خاص خلقه الله للأسماك لامتصاص الأكسجين من الماء.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "أسماك",
      "خياشيم"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-sci-8",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثاني: البيئة الطبيعية ومكوناتها",
    "lessonName": "حيوانات الصحراء وسفينة الصحراء",
    "questionText": "🐪 ما هو الحيوان القوي الذي يستطيع العيش في بيئة الصحراء الحارة ويسمى سفينة الصحراء؟",
    "answerText": "هو **الجمل (سفينة الصحراء)** 🐪 الذي يتحمل العطش والجوع لعدة أيام.",
    "options": [
      "الجمل الصبور",
      "الدب القطبي الأبيض",
      "الدلفين الذكي",
      "البطريق اللطيف"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الجمل يمتلك سناماً لتخزين الدهون وخفاً عريضاً ليمشي على الرمال دون أن يغوص.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "صحراء",
      "جمل"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-14",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثاني: البيئة الطبيعية ومكوناتها",
    "lessonName": "بيئة الأهوار في جنوب العراق",
    "questionText": "🌾 ماذا يوجد بكثرة في بيئة الأهوار المائية في جنوب العراق الحبيب؟",
    "answerText": "يوجد **نبات القصب والبردي، والأسماك، والطيور المهاجرة**، والجاموس 🐃.",
    "options": [
      "القصب والبردي والأسماك والطيور",
      "الثلوج والدببة القطبية",
      "الرمال الجافة بدون ماء",
      "أشجار الصنوبر فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "أهوار العراق بيئة مائية طبيعية فريدة ومشهورة عالمياً بتنوعها البيئي.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أهوار",
      "العراق",
      "بيئة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-sci-15",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثاني: البيئة الطبيعية ومكوناتها",
    "lessonName": "الحواس الخمس وصحتها",
    "questionText": "👁️ بماذا نرى الألوان والأشكال من حولنا؟ وبماذا نسمع أصوات الطيور والقرآن؟",
    "answerText": "نرى **بالعينين 👀**، ونسمع الأصوات الجميلة **بالأذنين 👂**.",
    "options": [
      "نرى بالعين ونسمع بالأذن",
      "نرى بالأنف ونسمع باللسان",
      "نرى باليد ونسمع بالقدم",
      "نرى بالشعر فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الحواس الخمس هي: البصر بالعين، السمع بالأذن، الشم بالأنف، التذوق باللسان، واللمس بالجلد.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حواس",
      "جسم الإنسان"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-9",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثالث: المادة وخصائصها",
    "lessonName": "حالات المادة الثلاث",
    "questionText": "🧊 ما هي حالات المادة الثلاث الموجودة في الطبيعة؟",
    "answerText": "حالات المادة الثلاث هي: **الحالة الصلبة، والحالة السائلة، والحالة الغازية** 💨.",
    "options": [
      "صلبة، سائلة، غازية",
      "ساخنة، باردة، دافئة",
      "حلوة، مالحة، حامضة",
      "كبيرة، صغيرة، متوسطة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الثلج صلب، والماء سائل، وبخار الماء غاز.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "حالات المادة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-sci-10",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثالث: المادة وخصائصها",
    "lessonName": "الحالة الغازية والهواء",
    "questionText": "🎈 ما المادة التي تملأ البالون المنفوخ وتجعله ينتفخ ويطير في الهواء؟",
    "answerText": "هي **الهواء** وهو مادة في [blue]الحالة الغازية[/blue] لا نراها ولكن نشعر بها 💨.",
    "options": [
      "الهواء وهو مادة غازية",
      "الحجارة الصغيرة",
      "الماء السائل",
      "الخشب الصلب"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الغازات ليس لها شكل ثابت وتنتشر لتملأ المكان الذي توجد فيه.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "غازات"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-16",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثالث: المادة وخصائصها",
    "lessonName": "الحالة الصلبة وشكلها الثابت",
    "questionText": "🧱 ما الذي يميز المادة الصلبة مثل الكتاب أو الحجر عن السائل؟",
    "answerText": "المادة الصلبة لها **شكل ثابت وحجم محدد** لا يتغير بسهولة 📚.",
    "options": [
      "لها شكل ثابت وحجم محدد",
      "تجري وتنسكب كالعصير",
      "تطير وتنتشر كالدخان",
      "تذوب وحدها في الهواء"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المادة الصلبة تحتفظ بشكلها حتى لو نقلناها من طاولة إلى أخرى.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "صلبة",
      "مادة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-17",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثالث: المادة وخصائصها",
    "lessonName": "الطفو والغطس في الماء",
    "questionText": "⛵ إذا وضعنا قطعة خشب ومسمار حديد في حوض ماء، ماذا يحدث لكل منهما؟",
    "answerText": "قطعة الخشب **تطفو فوق الماء** 🪵، بينما يغطس مسمار الحديد إلى القاع ⚓.",
    "options": [
      "الخشب يطفو والحديد يغطس",
      "الحديد يطفو والخشب يغطس",
      "كلاهما يطير في الهواء",
      "كلاهما يذوب في ثانية"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المواد الخفيفة مثل الفلين والخشب تطفو، والمواد الثقيلة مثل الحصى والحديد تغطس.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "طفو وغطس",
      "تجارب"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-sci-18",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الثالث: المادة وخصائصها",
    "lessonName": "الذوبان في الماء",
    "questionText": "☕ ماذا يحدث لملعقة السكر عند وضعها في كوب الشاي الدافئ وتحريكها؟",
    "answerText": "السكر **يذوب تماماً في الماء** ويصبح طعم الشاي حلواً لذيذاً 🍯.",
    "options": [
      "يذوب ويختفي في الماء",
      "يتحول إلى حجارة صلبة",
      "يطفو ويبقى يابساً",
      "يغير لون الكوب إلى أسود"
    ],
    "correctAnswerIndex": 0,
    "explanation": "السكر والملح من المواد التي تذوب في الماء بسهولة بالتسخين والتحريك.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "ذوبان",
      "مادة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-11",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الرابع: الحركة والقوة",
    "lessonName": "قوة الدفع وقوة السحب",
    "questionText": "🛒 ما الفرق بين قوة الدفع وقوة السحب عند تحريك الأشياء؟",
    "answerText": "قوة الدفع **تبعد الشيء عنا** (مثل ركل الكرة)، وقوة السحب **تقرب الشيء إلينا** (مثل سحب الحبل) 🪢.",
    "options": [
      "الدفع يبعد الجسم والسحب يقربه إلينا",
      "الدفع يقرب والجسم والسحب يبعده",
      "كلاهما يجعل الشيء يختفي",
      "لا يوجد أي فرق بينهما"
    ],
    "correctAnswerIndex": 0,
    "explanation": "القوة هي المؤثر الذي يغير من حركة الأجسام وسكونها.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "حركة",
      "قوة"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-sci-12",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الرابع: الحركة والقوة",
    "lessonName": "الأجسام الساكنة والمتحركة",
    "questionText": "⚽ هل تتحرك الكرة الموضوعة على الأرض من تلقاء نفسها إذا لم يدفعها أحد؟",
    "answerText": "كلا، الكرة جسم ساكن **لا يتحرك إلا إذا أثرت عليه قوة** دفع أو ركل 🦵.",
    "options": [
      "كلا، لا تتحرك إلا بوجود قوة تؤثر عليها",
      "نعم، تتحرك وحدها في أي وقت",
      "تتحرك فقط في المساء",
      "تتحرك إذا أغمضنا أعيننا"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الجسم الساكن يبقى ساكناً ما لم تؤثر عليه قوة خارجية تحركه.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "أجسام ساكنة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-19",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الرابع: الحركة والقوة",
    "lessonName": "مفهوم الحركة وتغير المكان",
    "questionText": "🏃 ماذا نعني بكلمة «الحركة» في مادة العلوم؟",
    "answerText": "الحركة تعني **تغير مكان الجسم أو موقعه** من مكان إلى مكان آخر 📍.",
    "options": [
      "تغير موقع ومكان الجسم بالنسبة لشيء آخر",
      "بقاء الجسم نائماً في مكانه دائماً",
      "تحول اللون من أحمر لأزرق",
      "إصدار صوت فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عندما يمشي التلميذ من البيت إلى المدرسة فهو في حالة حركة مستمرة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حركة",
      "موقع"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-20",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الرابع: الحركة والقوة",
    "lessonName": "الجاذبية وسقوط الأجسام",
    "questionText": "🍎 لماذا تسقط التفاحة نحو الأرض دائماً عندما تسقط من الشجرة؟",
    "answerText": "بسبب **قوة الجاذبية الأرضية** التي تسحب الأشياء نحو الأرض 🌍.",
    "options": [
      "بسبب قوة الجاذبية الأرضية",
      "لأن التفاحة تحب النوم في التراب",
      "بسبب حرارة الشمس فقط",
      "لأن الهواء يدفعها للأعلى"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الجاذبية الأرضية تسحب كل الأجسام نحو مركز الأرض فتسقط للأسفل.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "جاذبية",
      "قوة"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-sci-21",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الرابع: الحركة والقوة",
    "lessonName": "الحركة السريعة والبطيئة",
    "questionText": "🐢 أيهما يتحرك أسرع: الفهد الصياد أم السلحفاة الصغيرة؟",
    "answerText": "الفهد **أسرع بكثير**، والسلحفاة حركتها بطيئة جداً 🐆.",
    "options": [
      "الفهد سريع جداً والسلحفاة بطيئة",
      "السلحفاة أسرع من الطائرة",
      "لهما نفس السرعة تماماً",
      "السلحفاة تطير أسرع"
    ],
    "correctAnswerIndex": 0,
    "explanation": "تختلف سرعة الأجسام بحسب قوة عضلاتها وتكوين جسمها.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "سرعة",
      "حركة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-13",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الخامس: الأرض والموارد الطبيعية",
    "lessonName": "موارد الأرض الطبيعية",
    "questionText": "💎 اذكر ثلاثة من أهم الموارد الطبيعية التي وهبها الله لنا على كوكب الأرض؟",
    "answerText": "الموارد الطبيعية هي: **الماء النقي، والهواء العذب، والتربة الصالحة للزراعة**، والنفط والمعادن 💧.",
    "options": [
      "الماء، والهواء، والتربة والصخور",
      "السيارات، والطائرات، والقطارات فقط",
      "الكتب، والدفاتر، والمساطر",
      "شاشات التلفاز والألعاب الإلكترونية"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المورد الطبيعي هو كل ما نجده في الطبيعة من نعم الله دون تدخل الإنسان في صنعه.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "علوم",
      "موارد طبيعية"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-sci-22",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الخامس: الأرض والموارد الطبيعية",
    "lessonName": "شكل كوكب الأرض ومكوناته",
    "questionText": "🌍 ما هو شكل كوكب الأرض الذي نعيش عليه؟ ومما يتكون سطحه؟",
    "answerText": "شكل الأرض **كروي يشبه الكرة**، وسطحه يتكون من اليابسة والماء 🌊.",
    "options": [
      "كروي ويتكون من اليابسة والماء",
      "مربع مسطح تماماً",
      "مثلث مثل الجبل فقط",
      "أسطوانة خالية من الماء"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الماء يغطي الجزء الأكبر من سطح الكرة الأرضية بالبحار والمحيطات والأنهار.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "كوكب الأرض",
      "جغرافيا"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-23",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الخامس: الأرض والموارد الطبيعية",
    "lessonName": "فصول السنة الأربعة",
    "questionText": "🍂 في أي فصل من فصول السنة تتساقط أوراق الأشجار الصفراء ويصبح الطقس معتدلاً؟",
    "answerText": "في **فصل الخريف** 🍁، ويليه فصل الشتاء الماطر.",
    "options": [
      "فصل الخريف",
      "فصل الصيف الحار",
      "فصل الربيع المزهر",
      "في كل الأيام"
    ],
    "correctAnswerIndex": 0,
    "explanation": "فصول السنة الأربعة هي: الخريف، الشتاء، الربيع، الصيف.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "فصول السنة",
      "طقس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-24",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الخامس: الأرض والموارد الطبيعية",
    "lessonName": "فصل الشتاء والملابس الدافئة",
    "questionText": "❄️ ماذا نرتدي في فصل الشتاء البارد عندما تسقط الأمطار والثلوج؟",
    "answerText": "نرتدي **الملابس الصوفية الدافئة ونحمل المظلة** لحمايتنا من البرد والمطر 🧥.",
    "options": [
      "الملابس الصوفية الثقيلة والمعطف",
      "ملابس السباحة الخفيفة فقط",
      "ملابس صيفية بدون حذاء",
      "نظارات شمسية للشاطئ فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "فصل الشتاء تنخفض فيه درجات الحرارة وتهطل الأمطار وتكثر الغيوم.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "شتاء",
      "طقس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-sci-25",
    "gradeId": "grade-1",
    "subjectId": "sci-1",
    "chapter": "الفصل الخامس: الأرض والموارد الطبيعية",
    "lessonName": "أهمية المحافظة على نظافة الماء والبيئة",
    "questionText": "🚰 كيف نحافظ على نعمة الماء العذب والبيئة من التلوث؟",
    "answerText": "عن طريق **غلق صنبور الماء بعد الاستعمال**، وعدم رمي النفايات في النهر والشارع 💧.",
    "options": [
      "ترشيد استهلاك الماء وعدم رمي النفايات",
      "ترك الصنبور مفتوحاً طوال اليوم",
      "رمي الأكياس في النهر",
      "قطع الأشجار والزهور"
    ],
    "correctAnswerIndex": 0,
    "explanation": "النظافة وترشيد الماء سلوك إيماني وحضاري يحمي صحة الجميع.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "بيئة",
      "ترشيد الماء"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-isl-1",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الأول: السور القرآنية والآداب الإسلامية",
    "lessonName": "سورة الفاتحة المباركة",
    "questionText": "📖 ما هي السورة الكريمة التي نفتتح بها الصلاة ونقرأها في كل ركعة؟",
    "answerText": "هي **سورة الفاتحة** الشريفة ﴿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ * الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾.",
    "options": [
      "سورة الفاتحة",
      "سورة الإخلاص",
      "سورة الناس",
      "سورة الفلق"
    ],
    "correctAnswerIndex": 0,
    "explanation": "سورة الفاتحة هي أم الكتاب وتجب قراءتها في كل ركعة من ركعات الصلاة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قرآن",
      "الفاتحة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-isl-4",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الأول: السور القرآنية والآداب الإسلامية",
    "lessonName": "سورة الإخلاص (التوحيد)",
    "questionText": "☝️ ما هي السورة التي تعلمنا أن الله واحد أحد لا شريك له ولا مثيل؟",
    "answerText": "هي **سورة الإخلاص**: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾.",
    "options": [
      "سورة الإخلاص",
      "سورة الكوثر",
      "سورة النصر",
      "سورة العصر"
    ],
    "correctAnswerIndex": 0,
    "explanation": "سورة الإخلاص تعدل ثلث القرآن الكريم وتؤكد وحدانية الله تعالى.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قرآن",
      "توحيد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-5",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الأول: السور القرآنية والآداب الإسلامية",
    "lessonName": "سورة الكوثر المباركة",
    "questionText": "🌊 ما هو الكوثر الذي أعطاه الله لنبينا محمد (ص) في الجنة؟",
    "answerText": "الكوثر هو **نهر عظيم في الجنة** ماؤه أشد بياضاً من اللبن وأحلى من العسل 🍯.",
    "options": [
      "نهر عظيم في الجنة لنبينا محمد (ص)",
      "جبل في مكة",
      "شجرة في الحديقة",
      "بئر قديمة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "قال تعالى: ﴿إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ * فَصَلِّ لِرَبِّكَ وَانْحَرْ﴾.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قرآن",
      "سورة الكوثر"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-6",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الأول: السور القرآنية والآداب الإسلامية",
    "lessonName": "سورة النصر وبشارة الفتح",
    "questionText": "🕊️ أكمل قوله تعالى في سورة النصر: ﴿إِذَا جَاءَ نَصْرُ اللَّهِ وَ......﴾",
    "answerText": "﴿إِذَا جَاءَ نَصْرُ اللَّهِ **وَالْفَتْحُ**﴾، ورأيت الناس يدخلون في دين الله أفواجاً.",
    "options": [
      "وَالْفَتْحُ",
      "وَالْفَجْرُ",
      "وَالصُّبْحُ",
      "وَالنُّورُ"
    ],
    "correctAnswerIndex": 0,
    "explanation": "سورة النصر تبشر بنصر الإسلام ودخول الناس في دين الله أفواجاً.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قرآن",
      "سورة النصر"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-7",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الأول: السور القرآنية والآداب الإسلامية",
    "lessonName": "سورة العصر وأهمية الوقت",
    "questionText": "⏳ بماذا يقسم الله عز وجل في سورة العصر؟ وما أهمية ذلك؟",
    "answerText": "يقسم الله **بالوقت والزمان (وَالْعَصْرِ)** ليعلمنا أن الوقت ثمين ويجب استثماره في الإيمان والعمل الصالح ⏱️.",
    "options": [
      "يقسم بالوقت والزمان (العصر)",
      "يقسم بالذهب والفضة",
      "يقسم بالبحر فقط",
      "يقسم بالليل فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "قال تعالى: ﴿وَالْعَصْرِ * إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ * إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ﴾.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "قرآن",
      "سورة العصر"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-isl-8",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الأول: السور القرآنية والآداب الإسلامية",
    "lessonName": "سورة الفلق والتحصين من الشرور",
    "questionText": "🛡️ لمن نلجأ ونستعيذ في سورة الفلق لحمايتنا من كل شر ومكروه؟",
    "answerText": "نستعيذ **برب الفلق (الله سبحانه وتعالى)** خالق النور والصباح 🌅.",
    "options": [
      "برب الفلق (الله تعالى)",
      "بالأصدقاء فقط",
      "بالطبيب فقط",
      "بالألعاب"
    ],
    "correctAnswerIndex": 0,
    "explanation": "قراءة المعوذتين (الفلق والناس) تحصن المسلم وتحفظه بفضل الله.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قرآن",
      "سورة الفلق"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-9",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الأول: السور القرآنية والآداب الإسلامية",
    "lessonName": "سورة الناس الكريمة",
    "questionText": "🤲 ماذا نقول في أول آية من سورة الناس الكريمة؟",
    "answerText": "نقول: **﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ﴾**.",
    "options": [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "تَبَّتْ يَدَا أَبِي لَهَبٍ",
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ"
    ],
    "correctAnswerIndex": 0,
    "explanation": "سورة الناس تعلم التلميذ اللجوء إلى الله والاعتصام به من وساوس الشيطان.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قرآن",
      "سورة الناس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-2",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثاني: العقيدة وسيرة النبي محمد (ص)",
    "lessonName": "نبينا محمد (صلى الله عليه وآله وسلم)",
    "questionText": "🕌 من هو نبي الإسلام ورسول الله الرحيم إلى الناس كافة؟",
    "answerText": "هو نبينا الأعظم **محمد بن عبد الله (صلى الله عليه وآله وسلم)** خاتم الأنبياء والمرسلين.",
    "options": [
      "نبينا محمد (صلى الله عليه وآله وسلم)",
      "النبي موسى (عليه السلام)",
      "النبي عيسى (عليه السلام)",
      "النبي إبراهيم (عليه السلام)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نبينا محمد (ص) هو الرحمة المهداة ومعلم الأخلاق الفاضلة للبشرية.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "سيرة",
      "النبي محمد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g1-isl-10",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثاني: العقيدة وسيرة النبي محمد (ص)",
    "lessonName": "هوية الطفل المسلم (من ربك وما دينك)",
    "questionText": "🌟 من ربك؟ وما هو دينك الحق؟ وما هو كتابك المقدس؟",
    "answerText": "**الله ربي، والإسلام ديني، والقرآن الكريم كتابي**، والكعبة قبلتي 🕋.",
    "options": [
      "الله ربي، والإسلام ديني، والقرآن كتابي",
      "لا أعرف من هو ربي",
      "الكتب المدرسية فقط هي كتابي",
      "الشمس هي ربي"
    ],
    "correctAnswerIndex": 0,
    "explanation": "هذه هي الأصول الثلاثة والأسس العقدية الأولى لكل طفل مسلم.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "عقيدة",
      "هوية المسلم"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-isl-11",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثاني: العقيدة وسيرة النبي محمد (ص)",
    "lessonName": "مولد النبي محمد (ص) ومكان ولادته",
    "questionText": "🕋 في أي مدينة مباركة ولد نبينا محمد (ص)؟ وفي أي عام؟",
    "answerText": "ولد في **مكة المكرمة في عام الفيل** يتيماً فآواه الله ورعاه 🌟.",
    "options": [
      "في مكة المكرمة في عام الفيل",
      "في المدينة المنورة",
      "في بغداد",
      "في دمشق"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ولد الرسول الكريم في مكة المكرمة ونشأ بها محبوباً بين أهله وقومه.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "سيرة",
      "مولد النبي"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-12",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثاني: العقيدة وسيرة النبي محمد (ص)",
    "lessonName": "اسم أم النبي ومرضعته",
    "questionText": "🌸 ما اسم أم النبي محمد (ص) الكريمة؟ وما اسم مرضعته الصالحة؟",
    "answerText": "أمه هي السيدة **آمنة بنت وهب**، ومرضعته هي السيدة **حليمة السعدية** 🕊️.",
    "options": [
      "أمه آمنة بنت وهب، ومرضعته حليمة السعدية",
      "أمه خديجة بنت خويلد",
      "أمه فاطمة الزهراء",
      "أمه عائشة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نشأ النبي ص في بادية بني سعد عند حليمة السعدية وحلت البركة في بيتها.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "سيرة",
      "نسب النبي"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-isl-13",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثاني: العقيدة وسيرة النبي محمد (ص)",
    "lessonName": "لقب النبي محمد (ص) وأخلاقه",
    "questionText": "💎 بمَ كان أهل مكة يلقبون نبينا محمد (ص) قبل البعثة لشدة أمانته وصدقه؟",
    "answerText": "كانوا يلقبونه بـ **«الصادق الأمين»** لأنه لم يكذب أبداً وكان يحفظ الأمانات 🤝.",
    "options": [
      "الصادق الأمين",
      "الفارس القوي",
      "التاجر الكبير",
      "الرحالة الشهير"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الصدق والأمانة من أعظم صفات النبي محمد (ص) التي يجب أن نقتدي بها.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "سيرة",
      "أخلاق النبي"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-isl-14",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثاني: العقيدة وسيرة النبي محمد (ص)",
    "lessonName": "الشهادتان ركن الإسلام الأول",
    "questionText": "☝️ ما هما الشهادتان اللتان يدخل بهما الإنسان في دين الإسلام الحنيف؟",
    "answerText": "هما: **«أشهد أن لا إله إلا الله، وأشهد أن محمداً رسول الله»** 🕌.",
    "options": [
      "أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله",
      "سبحان الله وبحمده فقط",
      "الحمد لله رب العالمين فقط",
      "الله أكبر فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الشهادتان هما مفتاح الجنة والركن الأساسي الأول من أركان الإسلام.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أركان الإسلام",
      "شهادة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-15",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثاني: العقيدة وسيرة النبي محمد (ص)",
    "lessonName": "أركان الإيمان الستة",
    "questionText": "✨ بمن نؤمن كمسلمين؟",
    "answerText": "نؤمن **بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره** 🌟.",
    "options": [
      "بالله وملائكته وكتبه ورسله واليوم الآخر",
      "بالمال والكنوز فقط",
      "بالشمس والقمر فقط",
      "بالأقوياء فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الإيمان يملأ قلب المؤمن طمأنينة ومحبة وعملاً صالحاً.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "عقيدة",
      "أركان الإيمان"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-3",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثالث: الأخلاق والأدعية والحديث الشريف",
    "lessonName": "حديث بر الوالدين",
    "questionText": "❤️ ماذا يقول التلميذ المؤدب لوالديه عند الصباح والمساء تقديراً لهما؟",
    "answerText": "يقول لهما: **صباح الخير يا أمي ويا أبي**، ويدعو لهما بالصحة والعافية ويطيعهما دائماً.",
    "options": [
      "يدعو لهما ويطيعهما ويبرهما بأدب",
      "يصرخ بصوت عالٍ",
      "لا يتكلم معهما أبداً",
      "يرفض المساعدة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "رضا الله من رضا الوالدين وبرهما واجب عظيم.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أخلاق",
      "بر الوالدين"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-16",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثالث: الأخلاق والأدعية والحديث الشريف",
    "lessonName": "حديث النظافة من الإيمان",
    "questionText": "🧼 ماذا قال النبي محمد (ص) في الحديث الشريف عن النظافة الشخصية والبيئة؟",
    "answerText": "قال رسول الله (ص): **«النَّظَافَةُ مِنَ الإِيمَانِ»** 🚿.",
    "options": [
      "«النَّظَافَةُ مِنَ الإِيمَانِ»",
      "النظافة للمنزل فقط",
      "لا حاجة لغسل الأيدي",
      "النظافة في العيد فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الإسلام دين الطهارة والنظافة في البدن والثياب والمدرسة والشارع.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "حديث شريف",
      "نظافة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-isl-17",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثالث: الأخلاق والأدعية والحديث الشريف",
    "lessonName": "آداب إفشاء السلام",
    "questionText": "🤝 ماذا نقول عندما نقابل أصدقاءنا ومعلمنا في المدرسة؟ وماذا يردون علينا؟",
    "answerText": "نقول: **«السلام عليكم ورحمة الله وبركاته»**، ويردون: **«وعليكم السلام ورحمة الله وبركاته»** 🌸.",
    "options": [
      "السلام عليكم ورحمة الله وبركاته",
      "صباح الصمت بدون كلام",
      "مرحباً فقط بدون سلام",
      "لا نسلم على أحد"
    ],
    "correctAnswerIndex": 0,
    "explanation": "إفشاء السلام ينشر المحبة والسلام والمودة بين أفراد المجتمع.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "آداب",
      "تحية الإسلام"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-18",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثالث: الأخلاق والأدعية والحديث الشريف",
    "lessonName": "آداب الطعام والشراب",
    "questionText": "🍽️ ماذا نقول قبل أن نبدأ بتناول الطعام؟ وبأي يد نأكل؟",
    "answerText": "نقول: **«بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ»** ونأكل **باليد اليمنى** مما يلينا 🍲.",
    "options": [
      "نقول بسم الله ونأكل باليد اليمنى",
      "نبدأ بالأكل مباشرة بدون تسمية",
      "نأكل باليد اليسرى ونحن واقفون",
      "نرمي الطعام على الأرض"
    ],
    "correctAnswerIndex": 0,
    "explanation": "من السنة النبوية الشريفة: سمّ الله وكل بيمينك وكل مما يليك.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "آداب الطعام",
      "سنة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-19",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثالث: الأخلاق والأدعية والحديث الشريف",
    "lessonName": "شكر الله بعد الأكل والشرب",
    "questionText": "🥤 ماذا نقول عندما ننتهي من شرب الماء أو أكل وجبة الطعام اللذيذة؟",
    "answerText": "نقول: **«الحَمْدُ لِلَّهِ رَبِّ العَالَمِينَ»** شكراً لله على نعمه الكثيرة 🤲.",
    "options": [
      "الحَمْدُ لِلَّهِ رَبِّ العَالَمِينَ",
      "أريد طعاماً آخر الآن",
      "لا نقول أي شيء",
      "نترك الأطباق مبعثرة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "شكر الله يديم النعم ويبارك في الرزق والعافية.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أدعية",
      "شكر النعمة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-isl-20",
    "gradeId": "grade-1",
    "subjectId": "isl-1",
    "chapter": "الفصل الثالث: الأخلاق والأدعية والحديث الشريف",
    "lessonName": "الصدق والأمانة مع الأصدقاء",
    "questionText": "🌟 لماذا يحب الله والمعلم التلميذ الصادق الذي لا يكذب أبداً؟",
    "answerText": "لأن الصدق **يهدي إلى البر والجنة**، والتلميذ الصادق يثق به الجميع ويحبونه ❤️.",
    "options": [
      "لأن الصدق يهدي إلى البر والجنة ويثق به الجميع",
      "لأنه يخفي أخطاءه",
      "لأنه يلعب طوال اليوم",
      "لأن الصدق غير مهم"
    ],
    "correctAnswerIndex": 0,
    "explanation": "قال رسول الله (ص): عليكم بالصدق فإن الصدق يهدي إلى البر.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "أخلاق",
      "صدق"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-eng-1",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 1: Hello & Alphabet Phonics",
    "lessonName": "Letter A & Phonics",
    "questionText": "🔤 What sound does the letter [red]«A»[/red] make in **Apple** and **Ant**? (ما صوت حرف A؟)",
    "answerText": "It makes the short sound **«/æ/»** as in 🍎 **Apple** (تفاحة حمراء) and 🐜 **Ant** (نملة).",
    "options": [
      "/æ/ like Apple and Ant",
      "/b/ like Bag",
      "/k/ like Cat",
      "/d/ like Duck"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Letter A is the first letter in the English alphabet (حرف الألف في الإنجليزية).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "phonics",
      "letter a",
      "english 1"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-eng-2",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 1: Hello & Alphabet Phonics",
    "lessonName": "Letter B & Words",
    "questionText": "🎒 Which letter does the word **«Bag»** (حقيبة) and **«Bus»** (باص) start with?",
    "answerText": "It starts with the letter **«B b»** and its sound is /b/ 🚌.",
    "options": [
      "Letter B",
      "Letter C",
      "Letter A",
      "Letter D"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Letter B sounds like /b/ as in Book, Bag, Ball, Bus.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "phonics",
      "letter b"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-7",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 1: Hello & Alphabet Phonics",
    "lessonName": "Letter C & Sound",
    "questionText": "🐱 What letter starts the words **«Car»** (سيارة) and **«Cat»** (قطة)?",
    "answerText": "Letter **«C c»** with the sound /k/ 🚗.",
    "options": [
      "Letter C (/k/)",
      "Letter M",
      "Letter P",
      "Letter S"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Letter C makes the /k/ sound in Cat and Car in primary Grade 1.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "phonics",
      "letter c"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-8",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 1: Hello & Alphabet Phonics",
    "lessonName": "Letter D & Phonics",
    "questionText": "🦆 What is the starting letter of **«Duck»** (بطة) and **«Dog»** (كلب)?",
    "answerText": "Letter **«D d»** with the sound /d/ 🐕.",
    "options": [
      "Letter D",
      "Letter B",
      "Letter T",
      "Letter F"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Letter D has a round belly to the left in lowercase: d.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "phonics",
      "letter d"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-9",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 1: Hello & Alphabet Phonics",
    "lessonName": "Letter E & Egg",
    "questionText": "🥚 What letter starts the word **«Egg»** (بيضة) and **«Elephant»** (فيل)?",
    "answerText": "Letter **«E e»** with the sound /e/ 🐘.",
    "options": [
      "Letter E",
      "Letter A",
      "Letter I",
      "Letter O"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Letter E is a vowel: E for Egg and Elephant.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "phonics",
      "letter e"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-10",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 1: Hello & Alphabet Phonics",
    "lessonName": "Letter F & Fish",
    "questionText": "🐟 Which letter starts the word **«Fish»** (سمكة) and **«Frog»** (ضفدع)?",
    "answerText": "Letter **«F f»** with the sound /f/ 🐸.",
    "options": [
      "Letter F",
      "Letter V",
      "Letter T",
      "Letter P"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Letter F sounds like /f/ as in Flower, Fish, Family.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "phonics",
      "letter f"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-11",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 1: Hello & Alphabet Phonics",
    "lessonName": "Alphabet Phonics Review",
    "questionText": "🔠 How many letters are there in the English alphabet? (كم حرفاً في الإنجليزية؟)",
    "answerText": "There are **26 letters** from A to Z (ستة وعشرون حرفاً) 🎓.",
    "options": [
      "26 letters",
      "28 letters",
      "20 letters",
      "30 letters"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The English alphabet consists of 26 letters (A, B, C, ... Z).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "alphabet",
      "phonics"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-eng-3",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 2: Numbers & Colors",
    "lessonName": "Colors in English (الألوان)",
    "questionText": "🔴 What color is the ripe apple and the strawberry? (ما لون التفاحة الناضجة؟)",
    "answerText": "It is **Red** (أحمر) 🍓.",
    "options": [
      "Red (أحمر)",
      "Blue (أزرق)",
      "Green (أخضر)",
      "Yellow (أصفر)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Red is the color of apples, roses, and hearts.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "colors",
      "vocabulary"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-eng-4",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 2: Numbers & Colors",
    "lessonName": "Counting 1 to 5 (الأرقام)",
    "questionText": "🔢 Count the stars: ⭐ ⭐ ⭐ ⭐ - How many stars are there? (كم نجمة؟)",
    "answerText": "There are **Four (4)** stars (أربع نجمات) ✨.",
    "options": [
      "Four (4)",
      "Three (3)",
      "Five (5)",
      "Two (2)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "One, Two, Three, Four = 4 stars.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "numbers",
      "counting"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-12",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 2: Numbers & Colors",
    "lessonName": "The Color Blue (اللون الأزرق)",
    "questionText": "🌊 What color is the clear sky and the sea? (ما لون السماء الصافية والبحر؟)",
    "answerText": "It is **Blue** (أزرق) 💙.",
    "options": [
      "Blue (أزرق)",
      "Yellow (أصفر)",
      "Black (أسود)",
      "Orange (برتقالي)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Blue is the color of the Iraqi sky and the rivers Tigris and Euphrates.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "colors",
      "blue"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-13",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 2: Numbers & Colors",
    "lessonName": "The Color Green (اللون الأخضر)",
    "questionText": "🌿 What color are tree leaves and fresh grass? (ما لون أوراق الشجر والعشب؟)",
    "answerText": "It is **Green** (أخضر) 🍃.",
    "options": [
      "Green (أخضر)",
      "Red (أحمر)",
      "Purple (بنفسجي)",
      "White (أبيض)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Green is the color of plants, gardens, and palms in Iraq.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "colors",
      "green"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-14",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 2: Numbers & Colors",
    "lessonName": "The Color Yellow (اللون الأصفر)",
    "questionText": "☀️ What color is the bright sun and a sweet banana? (ما لون الشمس والموز؟)",
    "answerText": "It is **Yellow** (أصفر) 🍌.",
    "options": [
      "Yellow (أصفر)",
      "Blue (أزرق)",
      "Brown (بني)",
      "Grey (رمادي)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Yellow shines like the warm sun.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "colors",
      "yellow"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-15",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 2: Numbers & Colors",
    "lessonName": "Number One (1) to Five (5)",
    "questionText": "🖐️ How many fingers are there on one hand in English?",
    "answerText": "There are **Five (5)** fingers (خمسة أصابع) ✋.",
    "options": [
      "Five (5)",
      "Ten (10)",
      "Three (3)",
      "One (1)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "1 (One), 2 (Two), 3 (Three), 4 (Four), 5 (Five).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "numbers",
      "fingers"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g1-eng-16",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 2: Numbers & Colors",
    "lessonName": "Counting Objects",
    "questionText": "🚗 If you see 2 red cars and 1 blue car, how many cars are there in total?",
    "answerText": "There are **Three (3)** cars in total (2 + 1 = 3) 🚙.",
    "options": [
      "Three (3)",
      "Four (4)",
      "Two (2)",
      "Five (5)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Two plus one equals three.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "numbers",
      "math english"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-5",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 3: Family & Classroom Objects",
    "lessonName": "Classroom Objects (أدوات الصف)",
    "questionText": "✏️ What do you use to draw and write in your copybook? (ماذا تستخدم للكتابة والرسم؟)",
    "answerText": "A **Pencil** (قلم رصاص) 📝.",
    "options": [
      "Pencil (قلم رصاص)",
      "Chair (كرسي)",
      "Window (نافذة)",
      "Desk (طاولة)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Pencil is a school essential used by 1st primary pupils.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "school",
      "classroom",
      "pencil"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g1-eng-6",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 3: Family & Classroom Objects",
    "lessonName": "Greetings & Hello (التحية)",
    "questionText": "👋 What friendly word do you say when you meet your teacher and friends in the morning?",
    "answerText": "You say: **«Hello!»** (مرحباً وأهلاً) 😃.",
    "options": [
      "Hello! (مرحباً)",
      "Goodbye! (مع السلامة)",
      "Sleep! (نم)",
      "Sit down! (اجلس)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "We say 'Hello!' when greeting, and 'Goodbye!' when leaving.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "greetings",
      "hello"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-17",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 3: Family & Classroom Objects",
    "lessonName": "Saying Goodbye (الوداع)",
    "questionText": "👋 What do you say when the school day ends and you go home? (ماذا تقول عند المغادرة؟)",
    "answerText": "You say: **«Goodbye!»** (مع السلامة وإلى اللقاء) 🏫.",
    "options": [
      "Goodbye! (مع السلامة)",
      "Hello! (مرحباً)",
      "Good morning! (صباح الخير)",
      "Open your book! (افتح كتابك)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Goodbye is the polite word to wave and say farewell.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "greetings",
      "goodbye"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-18",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 3: Family & Classroom Objects",
    "lessonName": "Classroom Commands (أوامر المعلم)",
    "questionText": "🙋 What should you do when the teacher says: **«Stand up!»**? (ماذا تعني Stand up؟)",
    "answerText": "You **stand on your feet** respectfully (قف على قدميك) 🧍.",
    "options": [
      "Stand up (قف على قدميك)",
      "Sit down (اجلس)",
      "Sleep (نم)",
      "Close your eyes (أغمض عينيك)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Stand up means rise to your feet, and Sit down means take your seat.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "commands",
      "classroom"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-19",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 3: Family & Classroom Objects",
    "lessonName": "The School Bag (الحقيبة المدرسية)",
    "questionText": "🎒 What is the English word for the bag you carry your books and pencils in?",
    "answerText": "It is a **Bag** or **School Bag** (حقيبة مدرسية) 🎒.",
    "options": [
      "School Bag (حقيبة مدرسية)",
      "Chair (كرسي)",
      "Door (باب)",
      "Board (سبورة)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bag starts with letter B: B - a - g.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "classroom",
      "bag"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g1-eng-20",
    "gradeId": "grade-1",
    "subjectId": "eng-1",
    "chapter": "Unit 3: Family & Classroom Objects",
    "lessonName": "Book & Reading (الكتاب المدرسي)",
    "questionText": "📖 What is the English word for what you read lessons and stories from?",
    "answerText": "It is a **Book** (كتاب) 📚.",
    "options": [
      "Book (كتاب)",
      "Ruler (مسطرة)",
      "Rubber (ممحاة)",
      "Pen (قلم حبر)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The teacher says: 'Open your book' and 'Close your book'.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "classroom",
      "book"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g2-math-1",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الأول: الأعداد حتى 999 والقيمة المكانية",
    "lessonName": "القيمة المكانية",
    "questionText": "🔢 ما هي القيمة المكانية للرقم 5 في العدد [blue]543[/blue]؟",
    "answerText": "قيمته المكانية هي **500 (خمس مئات)** لأن الرقم 5 يقع في مرتبة المئات.",
    "options": [
      "500",
      "50",
      "5",
      "5000"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المراتب هي: 3 آحاد، 4 عشرات (40)، 5 مئات (500).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "القيمة المكانية",
      "الصف الثاني"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g2-math-2",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الأول: الأعداد حتى 999 والقيمة المكانية",
    "lessonName": "الصورة التحليلية",
    "questionText": "✏️ اكتب العدد [green]728[/green] بالصورة التحليلية: 728 = 8 + 20 + [blue]......[/blue]",
    "answerText": "8 + 20 + **700**.",
    "options": [
      "700",
      "70",
      "7",
      "7000"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الصورة التحليلية تبين قيمة كل رقم حسب مرتبته.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "صورة تحليلية"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g2-math-3",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الثاني: مقارنة الأعداد وترتيبها",
    "lessonName": "مقارنة الأعداد",
    "questionText": "🔘 قارن بين العددين وضع الرمز المناسب: [blue]672[/blue] ...... [orange]627[/orange]",
    "answerText": "**672 > 627** (أكبر من؛ لأن مرتبة العشرات 7 أكبر من 2).",
    "options": [
      "> (أكبر من)",
      "< (أصغر من)",
      "= (يساوي)",
      "لا يمكن التحديد"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نقارن المئات أولاً (متساوية 6=6)، ثم نقارن العشرات: 7 عشرات أكبر من 2 عشرات.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مقارنة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g2-math-4",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الثالث: جمع الأعداد حتى 999",
    "lessonName": "الجمع العمودي",
    "questionText": "✏️ احسب ناتج الجمع العمودي: [blue]134 + 253 = ......[/blue] ➕",
    "answerText": "الناتج هو **387** (نجمع الآحاد 4+3=7، والعشرات 3+5=8، والمئات 1+2=3).",
    "options": [
      "387",
      "378",
      "487",
      "287"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نجمع كل مرتبة مع ما يقابلها بدءاً من الآحاد.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "جمع"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g2-math-5",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الثالث: جمع الأعداد حتى 999",
    "lessonName": "إعادة التسمية",
    "questionText": "➕ ما ناتج جمع: [green]458 + 215[/green] مع إعادة تسمية الآحاد؟",
    "answerText": "الناتج هو **673** (8+5=13، نكتب 3 ونحمل 1 للعشرات، 1+5+1=7، 4+2=6).",
    "options": [
      "673",
      "663",
      "683",
      "773"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عندما يزيد ناتج الآحاد عن 9 نعيد التسمية بنقل 1 عشرات للمرتبة التالية.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "إعادة تسمية"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g2-math-6",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الرابع: طرح الأعداد حتى 999",
    "lessonName": "الطرح البسيط",
    "questionText": "✏️ احسب ناتج الطرح التالي: [red]586 - 243 = ......[/red] ➖",
    "answerText": "الناتج هو **343** (6-3=3، 8-4=4، 5-2=3).",
    "options": [
      "343",
      "334",
      "443",
      "243"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نطرح الآحاد ثم العشرات ثم المئات بالتسلسل.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "طرح"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g2-math-7",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الخامس: الهندسة والقياس والوقت",
    "lessonName": "قراءة الساعة",
    "questionText": "⏰ إذا كان عقرب الساعات الصغير على الرقم [blue]3[/blue] وعقرب الدقائق الطويل على [green]12[/green]، فكم تكون الساعة؟",
    "answerText": "تكون الساعة **الثالثة تماماً (3:00)** 🕒.",
    "options": [
      "الثالثة تماماً (3:00)",
      "الثانية عشرة والنصف",
      "السادسة تماماً",
      "الرابعة والربع"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عندما يستقر عقرب الدقائق على 12 تكون الساعة تامة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "وقت"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g2-math-8",
    "gradeId": "grade-2",
    "subjectId": "math-2",
    "chapter": "الفصل الخامس: الهندسة والقياس والوقت",
    "lessonName": "وحدات الطول",
    "questionText": "📏 ما هي الوحدة القياسية المناسبة لقياس طول قلم الرصاص أو دفتر الواجبات؟",
    "answerText": "نقيسه بوحدة **السنتيمتر (سم)** باستعمال المسطرة المدرسية.",
    "options": [
      "السنتيمتر (سم)",
      "الكيلومتر (كم)",
      "اللتر",
      "الكيلوغرام"
    ],
    "correctAnswerIndex": 0,
    "explanation": "السنتيمتر للأطوال الصغيرة، والمتر للأطوال الكبيرة كالغرفة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قياس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g2-ar-1",
    "gradeId": "grade-2",
    "subjectId": "ar-2",
    "chapter": "الفصل الأول: الأرنب الوفي ومدرستي",
    "lessonName": "درس الأرنب الوفي",
    "questionText": "🐇 في قصة (الأرنب الوفي)، كيف ساعدت السلحفاة الصديقة الأرنب الصغير عندما فاض النهر؟",
    "answerText": "حملته **على ظهرها وعبرت به مياه النهر بأمان** دون أن يصيبه مكروه 🐢.",
    "options": [
      "حملته على ظهرها وعبرت به النهر",
      "بنت له جسراً خشبياً",
      "أعطته طوق نجاة",
      "طلبت من الثعلب مساعدته"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الوفاء ومساعدة الصديق في الشدة خلق إسلامي وإنساني نبيل.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قراءتي"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g2-ar-2",
    "gradeId": "grade-2",
    "subjectId": "ar-2",
    "chapter": "الفصل الثاني: اللام الشمسية والقمرية وحركات التنوين",
    "lessonName": "اللام الشمسية واللام القمرية",
    "questionText": "📖 ما الفرق في النطق بين اللام في [blue]«القَمَر»[/blue] واللام في [red]«الشَّمْس»[/red]؟",
    "answerText": "لام **«القمر» قمرية تُلفظ وتكتب** وعليها سكون ْ، أما لام **«الشمس» شمسية تُكتب ولا تُلفظ** والحرف بعدها مشدد ّ.",
    "options": [
      "القمرية تُلفظ والشمسية لا تُلفظ",
      "كلاهما لا يُلفظان أبداً",
      "الشمسية تُلفظ والقمرية لا تُلفظ",
      "لا يوجد فرق في النطق"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حروف اللام القمرية مجموعة في عبارة: (ابغِ حجّك وخف عقيمه).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "لام شمسية وقمرية"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g2-ar-3",
    "gradeId": "grade-2",
    "subjectId": "ar-2",
    "chapter": "الفصل الثاني: اللام الشمسية والقمرية وحركات التنوين",
    "lessonName": "أنواع التنوين",
    "questionText": "✏️ ما هي أنواع التنوين الثلاثة في اللغة العربية؟",
    "answerText": "هي: [blue]تنوين الضم (ٌ)[/blue]، و[green]تنوين الفتح (ً)[/green]، و[red]تنوين الكسر (ٍ)[/red].",
    "options": [
      "تنوين الضم والفتح والكسر",
      "الفتحة والضمة والكسرة فقط",
      "الشدة والسكون فقط",
      "حروف المد الطويلة"
    ],
    "correctAnswerIndex": 0,
    "explanation": "التنوين نون ساكنة تنطق في آخر الأسماء ولا تكتب نوناً.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "تنوين"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g2-ar-4",
    "gradeId": "grade-2",
    "subjectId": "ar-2",
    "chapter": "الفصل الثالث: المحفوظات والأناشيد والمطالعة",
    "lessonName": "نشيد مدرستي",
    "questionText": "🏫 أكمل شطر البيت الجميل من أنشودة المدرسة: أهلاً أهلاً يا مدرستي، فيكِ أقضي [blue]......[/blue]",
    "answerText": "فيكِ أقضي **أحلى وقتي** 📚.",
    "options": [
      "أحلى وقتي",
      "يوم عطلتي",
      "وقت نومي",
      "ساعة غدائي"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المدرسة بيت العلم والتربية وفيها نقضي أجمل أوقات التعلم.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "محفوظات"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g2-sci-1",
    "gradeId": "grade-2",
    "subjectId": "sci-2",
    "chapter": "الفصل الأول: أعضاء جسم الإنسان",
    "lessonName": "وظيفة القلب",
    "questionText": "❤️ ما هي وظيفة [red]القلب[/red] العضلي في جسم الإنسان؟",
    "answerText": "وظيفة القلب هي **ضخ الدم المحمل بالأكسجين والغذاء** إلى جميع أنحاء الجسم وينبض بلا توقف.",
    "options": [
      "ضخ الدم إلى جميع أنحاء الجسم",
      "هضم الطعام والشراب",
      "التفكير وحفظ الدروس",
      "تنفس الهواء الخارجي"
    ],
    "correctAnswerIndex": 0,
    "explanation": "القلب عضلة في الصدر تنبض بانتظام حوالي 70-80 نبضة في الدقيقة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "القلب",
      "أعضاء الجسم"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g2-sci-2",
    "gradeId": "grade-2",
    "subjectId": "sci-2",
    "chapter": "الفصل الأول: أعضاء جسم الإنسان",
    "lessonName": "وظيفة الرئتين",
    "questionText": "🫁 ما هما العضوان المسؤولان عن عملية التنفس وإمداد الدم بالأكسجين النقي؟",
    "answerText": "هما **الرئتان (الرئة اليمنى والرئة اليسرى)** في التجويف الصدري.",
    "options": [
      "الرئتان",
      "المعدة والأمعاء",
      "العينان والأذنان",
      "الكليتان"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الشهيق يدخل الأكسجين للرئتين والزفير يطرد ثاني أكسيد الكربون.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "التنفس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g2-sci-3",
    "gradeId": "grade-2",
    "subjectId": "sci-2",
    "chapter": "الفصل الأول: أعضاء جسم الإنسان",
    "lessonName": "وظيفة المعدة",
    "questionText": "📖 ما هي وظيفة [purple]المعدة[/purple] عند تناول وجبة الغذاء؟",
    "answerText": "وظيفتها **استقبال الطعام وهضمه وتفتيته** بمساعدة العصارات الهضمية ليتحول إلى طاقة يستفيد منها الجسم.",
    "options": [
      "هضم الطعام وتفتيته",
      "تصفية الهواء المستنشق",
      "ضخ الدم للأطراف",
      "تحريك العظام والعضلات"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المعدة كيس عضلي يتمدد لاستقبال الطعام ويطحنه كالمطحنة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "المعدة"
    ],
    "questionType": "definition",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g2-sci-4",
    "gradeId": "grade-2",
    "subjectId": "sci-2",
    "chapter": "الفصل الثاني: الحفاظ على صحة الجسم",
    "lessonName": "الغذاء الصحي المتوازن",
    "questionText": "🥗 أي من الأغذية التالية يعتبر [green]غذاءً صحياً ومفيداً[/green] لنمو عظامنا وأسناننا؟",
    "answerText": "**الحليب والبيض والفواكه والخضراوات الطازجة** 🥛🥚🍎.",
    "options": [
      "الحليب والبيض والخضراوات الطازجة",
      "الحلويات والمشروبات الغازية المفرطة",
      "الأطعمة المكشوفة والمعلبات الفاسدة",
      "السكاكر الملونة فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الكالسيوم في الحليب والبروتين في البيض يبني العضلات والعظام.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "صحة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g2-sci-5",
    "gradeId": "grade-2",
    "subjectId": "sci-2",
    "chapter": "الفصل الثالث: البيئة اليابسة والبيئة المائية",
    "lessonName": "التكيف في البيئة",
    "questionText": "🧐 علل: [red]لماذا تمتلك الطيور أجنحة وعظاماً خفيفة مجوفة؟[/red]",
    "answerText": "لكي **تساعدها على الطيران والارتفاع في الهواء** والبحث عن طعامها بسهولة 🦅.",
    "options": [
      "لتساعدها على الطيران في الهواء بخفة",
      "لتسبح في قاع المحيطات العميقة",
      "لكي تنام طوال فصل الشتاء",
      "لحفر الجحور في باطن الصخور"
    ],
    "correctAnswerIndex": 0,
    "explanation": "شكل جسم الطائر الانسيابي وخفة عظامه تكيف إلهي للطيران.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "طيور",
      "تكيف"
    ],
    "questionType": "reasoning",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g3-math-1",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الأول: الأعداد حتى 9999 والقيمة المكانية",
    "lessonName": "القيمة المكانية للآلاف",
    "questionText": "🔢 ما هي القيمة المكانية للرقم 4 في العدد [blue]4,520[/blue]؟",
    "answerText": "قيمته هي **4,000 (أربعة آلاف)** لأنه في مرتبة ألوف.",
    "options": [
      "4000",
      "400",
      "40",
      "4"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المراتب: 0 آحاد، 2 عشرات، 5 مئات، 4 ألوف.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قيمة مكانية"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g3-math-2",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الأول: الأعداد حتى 9999 والقيمة المكانية",
    "lessonName": "التقريب لأقرب مئة",
    "questionText": "🎯 قرب العدد [green]368[/green] إلى أقرب مئة؟",
    "answerText": "يقرب إلى **400** (لأن مرتبة العشرات 6 أكبر من 5 فتزيد المئات واحداً).",
    "options": [
      "400",
      "300",
      "370",
      "350"
    ],
    "correctAnswerIndex": 0,
    "explanation": "إذا كان العشرات 5 فما فوق نقرب للأعلى (الأعداد الكريمة).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "تقريب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g3-math-3",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الثاني: جمع وطرح الأعداد المكونة من 4 مراتب",
    "lessonName": "جمع الآلاف",
    "questionText": "✏️ احسب ناتج الجمع التالي: [blue]2,450 + 1,320 = ......[/blue] ➕",
    "answerText": "الناتج هو **3,770**.",
    "options": [
      "3770",
      "3780",
      "3670",
      "4770"
    ],
    "correctAnswerIndex": 0,
    "explanation": "0+0=0, 5+2=7, 4+3=7, 2+1=3.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "جمع"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g3-math-4",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الثالث: جدول الضرب وحقائق الضرب الأساسية",
    "lessonName": "ضرب 6 في 7",
    "questionText": "✖️ احسب ناتج الضرب: [blue]6 × 7 = ......[/blue]؟",
    "answerText": "الناتج هو **42**.",
    "options": [
      "42",
      "48",
      "36",
      "49"
    ],
    "correctAnswerIndex": 0,
    "explanation": "6 مجموعات في كل منها 7 = 42.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "جدول الضرب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g3-math-5",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الثالث: جدول الضرب وحقائق الضرب الأساسية",
    "lessonName": "ضرب 8 في 9",
    "questionText": "✖️ احسب ناتج الضرب: [green]8 × 9 = ......[/green]؟",
    "answerText": "الناتج هو **72**.",
    "options": [
      "72",
      "64",
      "81",
      "70"
    ],
    "correctAnswerIndex": 0,
    "explanation": "8 في 9 = 72.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "جدول الضرب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g3-math-6",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الثالث: جدول الضرب وحقائق الضرب الأساسية",
    "lessonName": "مسألة ضرب تطبيقية",
    "questionText": "🎨 اشترت معلمة 5 علب ألوان، في كل علبة 6 أقلام تلوين، كم قلماً اشترت في المجموع؟",
    "answerText": "نضرب عدد العلب في عدد الأقلام: 5 × 6 = **30 قلماً**.",
    "options": [
      "30 قلماً",
      "25 قلماً",
      "35 قلماً",
      "11 قلماً"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الضرب جمع متكرر: 6+6+6+6+6 = 30.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مسائل"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g3-math-7",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الرابع: القسمة وعلاقتها بالضرب",
    "lessonName": "القسمة البسيطة",
    "questionText": "➗ احسب ناتج القسمة التالي: [purple]24 ÷ 6 = ......[/purple]؟",
    "answerText": "الناتج هو **4** (لأن 4 × 6 = 24).",
    "options": [
      "4",
      "3",
      "5",
      "6"
    ],
    "correctAnswerIndex": 0,
    "explanation": "القسمة عملية عكسية للضرب.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قسمة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g3-math-8",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الرابع: القسمة وعلاقتها بالضرب",
    "lessonName": "مسألة قسمة توزيع بالتساوي",
    "questionText": "💰 وزع أب 35 ألف دينار بالتساوي على أبنائه الخمسة، كم نصيب كل واحد منهم؟",
    "answerText": "نقسم المبلغ على عددهم: 35 ÷ 5 = **7 آلاف دينار**.",
    "options": [
      "7 آلاف دينار",
      "6 آلاف دينار",
      "8 آلاف دينار",
      "5 آلاف دينار"
    ],
    "correctAnswerIndex": 0,
    "explanation": "35 ÷ 5 = 7 لأن 7 × 5 = 35.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قسمة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g3-math-9",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الخامس: الكسور والقياس والأشكال الهندسية",
    "lessonName": "الكسور الاعتيادية",
    "questionText": "🍕 ما الكسر الذي يمثل الجزء المأكول إذا قسمنا فطيرة إلى 4 أقسام متساوية وأكلنا قسماً واحداً؟",
    "answerText": "الكسر هو **1/4 (رُبع)**.",
    "options": [
      "1/4 (رُبع)",
      "1/2 (نصف)",
      "3/4 (ثلاثة أرباع)",
      "1/3 (ثُلث)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "البسط يمثل الجزء (1) والمقام يمثل الكل (4).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "كسور"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g3-math-10",
    "gradeId": "grade-3",
    "subjectId": "math-3",
    "chapter": "الفصل الخامس: الكسور والقياس والأشكال الهندسية",
    "lessonName": "محيط المربع",
    "questionText": "📐 احسب محيط مربع طول ضلعه [blue]5 سم[/blue]؟",
    "answerText": "محيط المربع = طول الضلع × 4 = 5 × 4 = **20 سم**.",
    "options": [
      "20 سم",
      "25 سم",
      "15 سم",
      "10 سم"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المربع أضلاعه الأربعة متساوية في الطول: 5+5+5+5 = 20 سم.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "محيط"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g4-math-1",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل الأول: الأعداد ضمن الملايين والقيمة المكانية",
    "lessonName": "المليون",
    "questionText": "🔢 عدد المليون يكتب كواحد وأمامه كم صفراً؟",
    "answerText": "يكتب كواحد وأمامه **6 أصفار: (1,000,000)**.",
    "options": [
      "6 أصفار (1,000,000)",
      "5 أصفار",
      "7 أصفار",
      "9 أصفار"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ألف ألف يساوي مليوناً واحداً.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "ملايين"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g4-math-2",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل الأول: الأعداد ضمن الملايين والقيمة المكانية",
    "lessonName": "القيمة المكانية للملايين",
    "questionText": "🔢 ما هي القيمة المكانية للرقم 7 في العدد [blue]7,345,120[/blue]؟",
    "answerText": "قيمته هي **7,000,000 (سبعة ملايين)**.",
    "options": [
      "7,000,000",
      "700,000",
      "70,000",
      "70,000,000"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الرقم 7 يقع في مرتبة أحاد الملايين.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "قيمة مكانية"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g4-math-3",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل الأول: الأعداد ضمن الملايين والقيمة المكانية",
    "lessonName": "التقريب لأقرب ألف",
    "questionText": "🎯 قرب العدد [green]648,720[/green] إلى أقرب ألف؟",
    "answerText": "يقرب إلى **649,000** (لأن مرتبة المئات 7 كريمة تزيد الآحاد واحداً).",
    "options": [
      "649,000",
      "648,000",
      "650,000",
      "640,000"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ننظر إلى مرتبة المئات قبل الألف، 7 تزيد المرتبة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "تقريب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g4-math-4",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل الثالث: ضرب الأعداد (ضرب في عدد من مرتبتين)",
    "lessonName": "ضرب العشرات",
    "questionText": "✖️ احسب ناتج ضرب الأعداد التي فيها أصفار: [blue]40 × 50 = ......[/blue]؟",
    "answerText": "الناتج هو **2,000** (نضرب 4 × 5 = 20 وننزل الصفرين).",
    "options": [
      "2000",
      "200",
      "20000",
      "90"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عند ضرب مضاعفات العشرة، نجمع الأصفار ونضرب الأرقام.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "ضرب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g4-math-5",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل الثالث: ضرب الأعداد (ضرب في عدد من مرتبتين)",
    "lessonName": "ضرب 125 في 4",
    "questionText": "✏️ احسب ناتج ضرب: [green]125 × 4 = ......[/green]؟",
    "answerText": "الناتج هو **500**.",
    "options": [
      "500",
      "450",
      "600",
      "425"
    ],
    "correctAnswerIndex": 0,
    "explanation": "100 × 4 = 400، و 25 × 4 = 100، المجموع 500.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "ضرب"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g4-math-6",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل الرابع: القسمة على عدد من مرتبة واحدة",
    "lessonName": "القسمة مع باقٍ",
    "questionText": "➗ عند قسمة [purple]25 ÷ 4[/purple]، ما هو ناتج القسمة وما هو الباقي؟",
    "answerText": "الناتج هو **6 والباقي 1** (لأن 4 × 6 = 24، و 25 - 24 = 1).",
    "options": [
      "الناتج 6 والباقي 1",
      "الناتج 5 والباقي 5",
      "الناتج 6 ولا يوجد باقٍ",
      "الناتج 7 والباقي 0"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المقسوم = (الناتج × المقسوم عليه) + الباقي.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "قسمة مع باق"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g4-math-7",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل الخامس: الكسور الاعتيادية والكسور العشرية",
    "lessonName": "الأعشار",
    "questionText": "✏️ اكتب الكسر العشري الذي يعبر عن [blue]سبعة أعشار (7/10)[/blue]؟",
    "answerText": "يكتب بصورة الكسر العشري: **0.7**.",
    "options": [
      "0.7",
      "0.07",
      "7.0",
      "0.007"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المرتبة الأولى بعد الفاصلة العشرية تسمى جزءاً من عشرة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "كسور عشرية"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g4-math-8",
    "gradeId": "grade-4",
    "subjectId": "math-4",
    "chapter": "الفصل السادس: الهندسة والزوايا والقياس",
    "lessonName": "الزاوية القائمة",
    "questionText": "📐 ما هو قياس [green]«الزاوية القائمة»[/green] بالدرجات بالمنقلة؟",
    "answerText": "قياس الزاوية القائمة هو **90 درجة (90°)** مثل زاوية الباب أو الكتاب 📐.",
    "options": [
      "90° (تسعون درجة)",
      "180°",
      "45°",
      "60°"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الزاوية الحادة أقل من 90°، والمنفرجة أكبر من 90°، والقائمة 90° تماماً.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "زوايا"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g5-math-1",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الأول: الأعداد ضمن المليارات والقيمة المكانية",
    "lessonName": "المليار",
    "questionText": "🔢 عدد [blue]المليار[/blue] هو عدد مكون من الرقم 1 وأمامه كم صفراً؟",
    "answerText": "المليار أمامه **9 أصفار: (1,000,000,000)**.",
    "options": [
      "9 أصفار (1,000,000,000)",
      "6 أصفار",
      "8 أصفار",
      "12 صفراً"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المليار يساوي ألف مليون (1000 × 1,000,000).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مليارات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g5-math-2",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الأول: الأعداد ضمن المليارات والقيمة المكانية",
    "lessonName": "القيمة المكانية لعشرات المليارات",
    "questionText": "🔢 ما هي القيمة المكانية للرقم 3 في العدد [green]35,000,000,000[/green]؟",
    "answerText": "قيمته هي **30,000,000,000 (ثلاثون ملياراً)**.",
    "options": [
      "30,000,000,000",
      "3,000,000,000",
      "300,000,000",
      "30,000,000"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الرقم 3 يقع في مرتبة عشرات المليارات.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "قيمة مكانية"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g5-math-3",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الثاني: الضرب في عدد من ثلاث مراتب والقسمة على مرتبتين",
    "lessonName": "ضرب المئات",
    "questionText": "✖️ احسب ناتج ضرب: [blue]342 × 200 = ......[/blue]؟",
    "answerText": "الناتج هو **68,400** (نضرب 342 × 2 = 684 وننزل الصفرين).",
    "options": [
      "68,400",
      "6,840",
      "684,000",
      "78,400"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ضرب عدد في مضاعفات المئة.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "ضرب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g5-math-4",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الثاني: الضرب في عدد من ثلاث مراتب والقسمة على مرتبتين",
    "lessonName": "القسمة على مرتبتين",
    "questionText": "➗ احسب ناتج القسمة: [green]8,400 ÷ 20 = ......[/green]؟",
    "answerText": "الناتج هو **420** (نحذف صفراً من الطرفين ونقسم 840 ÷ 2 = 420).",
    "options": [
      "420",
      "42",
      "4200",
      "210"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حذف الأصفار المشتركة يسهل القسمة.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "قسمة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g5-math-5",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الثالث: جمع وطرح الكسور الاعتيادية والأعداد الكسرية",
    "lessonName": "توحيد المقامات",
    "questionText": "✏️ عند جمع كسرين مختلفي المقامات مثل [purple]1/2 + 1/4[/purple]، ما هو الناتج بعد توحيد المقامات؟",
    "answerText": "الناتج هو **3/4 (ثلاثة أرباع)** (نوحد على 4: 2/4 + 1/4 = 3/4).",
    "options": [
      "3/4",
      "2/6",
      "1/6",
      "4/4"
    ],
    "correctAnswerIndex": 0,
    "explanation": "لا يجوز جمع الكسور قبل توحيد المقامات بإيجاد المضاعف المشترك.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "كسور اعتيادية"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g5-math-6",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الرابع: الكسور العشرية والعمليات عليها",
    "lessonName": "جمع الكسور العشرية",
    "questionText": "✏️ احسب ناتج جمع الكسور العشرية: [blue]0.45 + 0.32 = ......[/blue]؟",
    "answerText": "الناتج هو **0.77**.",
    "options": [
      "0.77",
      "0.76",
      "0.87",
      "0.13"
    ],
    "correctAnswerIndex": 0,
    "explanation": "نحاذي الفواصل العشرية ونجمع الأجزاء من مئة ثم الأجزاء من عشرة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "كسور عشرية"
    ],
    "questionType": "fill_in_the_blank",
    "badgeType": "none"
  },
  {
    "id": "q-g5-math-7",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الخامس: المساحة والمحيط والدائرة",
    "lessonName": "مساحة المستطيل",
    "questionText": "📐 حديقة مدرسية مستطيلة الشكل طولها [blue]8 أمتار[/blue] وعرضها [green]5 أمتار[/green]، فما مساحتها؟",
    "answerText": "مساحة المستطيل = الطول × العرض = 8 × 5 = **40 متراً مربعاً (م²)**.",
    "options": [
      "40 م²",
      "26 م²",
      "13 م²",
      "45 م²"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المساحة تقاس بالوحدات المربعة: 8 × 5 = 40 م².",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "مساحة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g5-math-8",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الخامس: المساحة والمحيط والدائرة",
    "lessonName": "النسبة التقريبية باي",
    "questionText": "📖 ما هي النسبة الثابتة [purple]باي (π)[/purple] المستعملة في حساب محيط ومساحة الدائرة؟",
    "answerText": "قيمتها تساوي تقريباً **22/7 أو 3.14**.",
    "options": [
      "3.14 أو 22/7",
      "2.14",
      "4.13",
      "1.73"
    ],
    "correctAnswerIndex": 0,
    "explanation": "باي هي نسبة محيط أي دائرة إلى طول قطرها وهي ثابت رياضي شهير.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "دائرة",
      "باي"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g6-math-1",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الأول: الأعداد الصحيحة وتمثيلها على خط الأعداد والعمليات عليها",
    "lessonName": "الأعداد الصحيحة على خط الأعداد",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] أين تقع [blue]الأعداد الموجبة (+)[/blue] و [red]الأعداد السالبة (-)[/red] بالنسبة للصفر على خط الأعداد؟",
    "answerText": "الأعداد الموجبة تقع **على يمين الصفر** (أكبر من صفر)، والأعداد السالبة تقع **على يسار الصفر** (أصغر من صفر)، والصفر هو نقطة الأصل الفاصلة بينهما.",
    "options": [
      "الموجبة على اليمين والسالبة على اليسار",
      "الموجبة على اليسار والسالبة على اليمين",
      "كلاهما في نفس الجهة",
      "الصفر أكبر من جميع الأعداد"
    ],
    "correctAnswerIndex": 0,
    "explanation": "كلما اتجهنا يميناً كبر العدد، وكلما اتجهنا يساراً صغر العدد.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "وزاري",
      "أعداد صحيحة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-2",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الأول: الأعداد الصحيحة وتمثيلها على خط الأعداد والعمليات عليها",
    "lessonName": "مقارنة الأعداد الصحيحة",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] قارن بين العددين وضع الرمز المناسب: [red]-7[/red] ...... [blue]+2[/blue]",
    "answerText": "**-7 < +2** (أصغر من؛ لأن أي عدد موجب دائماً أكبر من أي عدد سالب، والـ +2 على يمين -7).",
    "options": [
      "< (أصغر من)",
      "> (أكبر من)",
      "= (يساوي)",
      "غير معروف"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الأعداد السالبة أصغر من الصفر ومن كل الأعداد الموجبة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "وزاري",
      "مقارنة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-3",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الأول: الأعداد الصحيحة وتمثيلها على خط الأعداد والعمليات عليها",
    "lessonName": "جمع الأعداد الصحيحة",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] احسب ناتج جمع عددين بإشارتين مختلفتين: [blue](-15) + (+8) = ......[/blue]؟",
    "answerText": "الناتج هو **-7** (نأخذ إشارة العدد الأكبر في القيمة المطلقة 15 وهو سالب، ثم نطرح: 15 - 8 = 7).",
    "options": [
      "-7",
      "+7",
      "-23",
      "+23"
    ],
    "correctAnswerIndex": 0,
    "explanation": "قاعدة جمع إشارات مختلفة: نضع إشارة الأكبر ونطرح العددين.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "جمع الأعداد الصحيحة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-4",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الأول: الأعداد الصحيحة وتمثيلها على خط الأعداد والعمليات عليها",
    "lessonName": "ضرب الأعداد الصحيحة",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] احسب ناتج ضرب عددين سالبين: [purple](-6) × (-4) = ......[/purple]؟",
    "answerText": "الناتج هو **+24 (موجب 24)** (لأن ضرب سالب في سالب يعطي ناتجاً موجباً دائماً: (-) × (-) = (+)).",
    "options": [
      "+24",
      "-24",
      "-10",
      "+10"
    ],
    "correctAnswerIndex": 0,
    "explanation": "إشارات متشابهة في الضرب تعطي موجب، وإشارات مختلفة تعطي سالب.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "ضرب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-5",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الثاني: العبارات الجبرية والمعادلات",
    "lessonName": "كتابة العبارات الجبرية",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] اكتب العبارة الجبرية التي تعبر عن: [green]«أكثر من س بتسعة»[/green]؟",
    "answerText": "العبارة هي: **س + 9**.",
    "options": [
      "س + 9",
      "س - 9",
      "9 س",
      "س ÷ 9"
    ],
    "correctAnswerIndex": 0,
    "explanation": "كلمة (أكثر من) تدل على عملية الجمع (+).",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "وزاري",
      "جبر"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-6",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الثاني: العبارات الجبرية والمعادلات",
    "lessonName": "حل معادلات الجمع",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] حل المعادلة التالية وأوجد قيمة المتغير: [blue]س + 12 = 30[/blue]؟",
    "answerText": "قيمة المتغير **س = 18** (نستعمل العلاقة بين الجمع والطرح: س = 30 - 12 = 18).",
    "options": [
      "س = 18",
      "س = 42",
      "س = 12",
      "س = 20"
    ],
    "correctAnswerIndex": 0,
    "explanation": "التحقق: 18 + 12 = 30 (صحيح).",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "معادلات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-7",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الثاني: العبارات الجبرية والمعادلات",
    "lessonName": "حل معادلات الضرب",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] حل معادلة الضرب التالية: [purple]5 ص = 45[/purple]؟",
    "answerText": "قيمة المتغير **ص = 9** (نستعمل القسمة: ص = 45 ÷ 5 = 9).",
    "options": [
      "ص = 9",
      "ص = 40",
      "ص = 50",
      "ص = 8"
    ],
    "correctAnswerIndex": 0,
    "explanation": "التحقق: 5 × 9 = 45 (صحيح).",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "معادلات ضرب"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-8",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الثالث: العمليات على الكسور الاعتيادية والأعداد الكسرية",
    "lessonName": "ضرب الكسور الاعتيادية",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] احسب ناتج ضرب الكسرين بأبسط صورة: [blue]2/3 × 9/10 = ......[/blue]؟",
    "answerText": "الناتج بأبسط صورة هو **3/5** (نختصر 2 مع 10 تصبح 5 بالمقام، و3 مع 9 تصبح 3 بالبسط: 1/1 × 3/5 = 3/5).",
    "options": [
      "3/5",
      "18/30",
      "1/2",
      "2/5"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الاختصار بين البسط والمقام قبل الضرب يبسط الحل.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "ضرب كسور"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-9",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الثالث: العمليات على الكسور الاعتيادية والأعداد الكسرية",
    "lessonName": "قسمة الكسور الاعتيادية",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] ما الخطوة الرياضية الأولى عند قسمة الكسور الاعتيادية مثل: [green]3/4 ÷ 1/2[/green]؟",
    "answerText": "نقلب علامة القسمة (÷) إلى ضرب (×)، و **نقلب الكسر الثاني (المقسوم عليه) فيصبح 2/1** فتصبح المسألة: 3/4 × 2/1.",
    "options": [
      "نقلب القسمة إلى ضرب ونقلب الكسر الثاني",
      "نجمع المقامات مباشرة",
      "نطرح البسوط مباشرة",
      "نقلب الكسر الأول فقط"
    ],
    "correctAnswerIndex": 0,
    "explanation": "القسمة هي الضرب في مقلوب الكسر المقسوم عليه.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "وزاري",
      "قسمة كسور"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-10",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الرابع: العمليات على الكسور العشرية",
    "lessonName": "ضرب الكسور العشرية في 100",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] احسب ناتج ضرب كسر عشري في 100: [blue]0.035 × 100 = ......[/blue]؟",
    "answerText": "الناتج هو **3.5** (نحرك الفاصلة العشرية مرتبتين إلى اليمين بعدد أصفار المئة).",
    "options": [
      "3.5",
      "0.35",
      "35",
      "350"
    ],
    "correctAnswerIndex": 0,
    "explanation": "في الضرب بالأعداد 10، 100، 1000 تتحرك الفاصلة نحو اليمين.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "كسور عشرية"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-11",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الخامس: النسبة والتناسب ومقياس الرسم والتقسيم التناسبي",
    "lessonName": "قانون مقياس الرسم",
    "questionText": "🌟 [blue]سؤال وزاري مكرر:[/blue] ما هو القانون الرياضي المعتمد لحساب [purple]«مقياس الرسم»[/purple] على الخريطة؟",
    "answerText": "مقياس الرسم = **البعد على الخارطة ÷ البعد الحقيقي** (نسبة خالية من الوحدات).",
    "options": [
      "البعد على الخارطة ÷ البعد الحقيقي",
      "البعد الحقيقي ÷ البعد على الخارطة",
      "الطول × العرض",
      "المحيط ÷ القطر"
    ],
    "correctAnswerIndex": 0,
    "explanation": "مقياس الرسم يكتب دائماً ككسر بسطه 1 (مثل 1 / 100,000).",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "مقياس رسم"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-12",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل الخامس: النسبة والتناسب ومقياس الرسم والتقسيم التناسبي",
    "lessonName": "مسألة مقياس رسم وزارية",
    "questionText": "🌟 [blue]سؤال وزاري مهم:[/blue] قيس البعد بين مدينتي بغداد والبصرة على خارطة بمقياس رسم (1 / 10,000,000) فوجد أنه 5 سم، ما البعد الحقيقي بينهما بالكيلومترات؟",
    "answerText": "البعد الحقيقي = 5 × 10,000,000 سم = 50,000,000 سم، وللتحويل إلى كيلومتر نقسم على 100,000 فيكون البعد الحقيقي = **500 كيلومتر (500 كم)**.",
    "options": [
      "500 كم",
      "50 كم",
      "5000 كم",
      "250 كم"
    ],
    "correctAnswerIndex": 0,
    "explanation": "1 كيلومتر = 100,000 سم، 50,000,000 ÷ 100,000 = 500 كم.",
    "isVipOnly": false,
    "difficulty": "hard",
    "tags": [
      "وزاري",
      "مسائل مقياس رسم"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-13",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل السادس: الدائرة ومحيطها ومساحتها والرسم الهندسي",
    "lessonName": "حساب محيط الدائرة",
    "questionText": "🌟 [blue]سؤال وزاري مكرر:[/blue] احسب محيط دائرة طول قطرها [blue]21 سم[/blue] باستعمال النسبة الثابتة (π = 22/7)؟",
    "answerText": "محيط الدائرة = القطر × π = 21 × 22/7 = (21 نختصرها مع 7 تصبح 3) 3 × 22 = **66 سم**.",
    "options": [
      "66 سم",
      "44 سم",
      "132 سم",
      "22 سم"
    ],
    "correctAnswerIndex": 0,
    "explanation": "محيط الدائرة = القطر × π = 21 × 22/7 = 66 سم.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "دائرة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-math-14",
    "gradeId": "grade-6",
    "subjectId": "math-6",
    "chapter": "الفصل السابع: الإحصاء والاحتمال (الوسط الحسابي والوسيط والمنوال)",
    "lessonName": "الوسط الحسابي والمنوال",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] ما هو [blue]«الوسط الحسابي (المعدل)»[/blue] للدرجات: (4 ، 6 ، 8)؟ وما هو [purple]«المنوال»[/purple] لمجموعة الأعداد: (5 ، 7 ، 9 ، 7 ، 2 ، 7)؟",
    "answerText": "1. **الوسط الحسابي** = مجموع القيم ÷ عددها = (4 + 6 + 8) ÷ 3 = 18 ÷ 3 = **6**.\\n2. **المنوال** هو القيمة الأكثر تكراراً وهو **7**.",
    "options": [
      "الوسط الحسابي = 6 ، والمنوال = 7",
      "الوسط الحسابي = 18 ، والمنوال = 5",
      "الوسط الحسابي = 8 ، والمنوال = 9",
      "الوسط الحسابي = 7 ، والمنوال = 6"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الوسط الحسابي يمثل المعدل التوزيعي، والمنوال هو الأكثر تكراراً وشيوعاً.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "إحصاء"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-ar-1",
    "gradeId": "grade-6",
    "subjectId": "ar-6",
    "chapter": "الوحدة الأولى: أنواع المعارف (وزاري)",
    "lessonName": "المعرف بأل والعلم والمعرف بالإضافة",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] ما هي المعارف الثلاثة الأساسية المقررة في قواعد اللغة العربية للسادس الابتدائي؟",
    "answerText": "هي: [blue]المُعرّف بأل[/blue] (مثل: الكتاب، المدرسة)، و[green]العَلَم[/green] (مثل: محمد، بغداد، دجلة)، و[purple]المُعرّف بالإضافة[/purple] (مثل: كتابُ القواعدِ).",
    "options": [
      "المعرف بأل، والعلم، والمعرف بالإضافة",
      "الاسم والفعل والحرف فقط",
      "المبتدأ والخبر والفاعل فقط",
      "حروف الجر وحروف العطف"
    ],
    "correctAnswerIndex": 0,
    "explanation": "النكرة ما دل على شيء غير معين، والمعرفة ما دل على شيء معين.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "وزاري",
      "قواعد"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-ar-2",
    "gradeId": "grade-6",
    "subjectId": "ar-6",
    "chapter": "الوحدة الثالثة: نائب الفاعل (وزاري)",
    "lessonName": "نائب الفاعل وإعرابه",
    "questionText": "🌟 [blue]وزاري مرشح:[/blue] عند حذف الفاعل وبناء الفعل للمجهول مثل: [green]«كُتِبَ الدَّرْسُ»[/green]، ما إعراب كلمة «الدَّرْسُ» وما علامة رفعه؟",
    "answerText": "يُعرب: **نائب فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره** (لأن المفعول به حل محل الفاعل وأخذ علامة رفعه).",
    "options": [
      "نائب فاعل مرفوع وعلامة رفعه الضمة",
      "مفعول به منصوب بالفتحة",
      "فاعل مرفوع بالضمة",
      "مبتدأ مؤخر مرفوع"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الفعل الماضي يضم أوله ويكسر ما قبل آخره عند البناء للمجهول (كُتِبَ).",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "وزاري",
      "نائب الفاعل"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g3-eng-1",
    "gradeId": "grade-3",
    "subjectId": "eng-3",
    "chapter": "Unit 1: Welcome Back & My Family",
    "lessonName": "Greetings & Introductions",
    "questionText": "🇬🇧 What is your name? [blue]كيف تجيب بالإنجليزية عندما يسألك شخص عن اسمك؟[/blue]",
    "answerText": "نقول: **My name is Ali** (اسمي علي) أو **I am Sara** (أنا سارة).",
    "options": [
      "My name is ...",
      "I am ten o'clock",
      "Goodbye my teacher",
      "Yes, I can"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عند السؤال عن الاسم بـ What is your name، نبدأ الإجابة بـ My name is متبوعاً بالاسم.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف الثالث",
      "محادثة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g3-eng-2",
    "gradeId": "grade-3",
    "subjectId": "eng-3",
    "chapter": "Unit 2: Colors & Classroom Items",
    "lessonName": "Colors in English",
    "questionText": "🎨 [green]ما هو اللون الأحمر والأزرق باللغة الإنجليزية؟[/green]",
    "answerText": "اللون الأحمر هو: **Red** 🔴، واللون الأزرق هو: **Blue** 🔵.",
    "options": [
      "Red (أحمر) و Blue (أزرق)",
      "Green (أخضر) و Yellow (أصفر)",
      "Black (أسود) و White (أبيض)",
      "Orange (برتقالي) و Pink (وردي)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Red يعني أحمر و Blue يعني أزرق.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف الثالث",
      "ألوان"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g4-isl-1",
    "gradeId": "grade-4",
    "subjectId": "isl-4",
    "chapter": "الوحدة الأولى: القرآن الكريم وأحكامه",
    "lessonName": "سورة الزلزلة المباركة",
    "questionText": "📖 ما معنى قوله تعالى في سورة الزلزلة: [green]«وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا»[/green]؟",
    "answerText": "أي: **أخرجت الأرض ما في بطنها من الموتى والكنوز** بأمر الله تعالى عند قيام الساعة ليُحاسب الناس على أعمالهم.",
    "options": [
      "أخرجت الأرض ما في بطنها من الموتى والكنوز بأمر الله تعالى",
      "نبتت الأشجار والزهور فقط",
      "فاضت مياه البحار والأنهار",
      "انزلقت الصخور من الجبال"
    ],
    "correctAnswerIndex": 0,
    "explanation": "سورة الزلزلة تبين أهوال يوم القيامة حين تتزلزل الأرض وتخرج ما في داخلها.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "إسلامية",
      "سورة الزلزلة",
      "الصف الرابع"
    ],
    "questionType": "qa",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g4-isl-2",
    "gradeId": "grade-4",
    "subjectId": "isl-4",
    "chapter": "الوحدة الثانية: العقيدة والحديث النبوي",
    "lessonName": "حديث نبوي شريف في الصدق والأمانة",
    "questionText": "🌟 قال رسول الله (ص): [green]«إنّ الصدقَ يَهدي إلى...»[/green] أكمل الحديث الشريف مع ذكر المعنى.",
    "answerText": "«إنّ الصدقَ يَهدي إلى **البِرّ**، وإنّ البِرّ يَهدي إلى **الجنّة**». الصدق هو قول الحق وهو طريق السعادة ورضا الله تعالى.",
    "options": [
      "البِرّ، وإنّ البِرّ يَهدي إلى الجنّة",
      "الخوف والضعف",
      "الكذب والخداع",
      "النسيان"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الصدق خلق عظيم يحبه الله ورسوله ويهدي صاحبه إلى كل خير وإلى الجنة.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "إسلامية",
      "أحاديث نبوية",
      "الصف الرابع"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g4-soc-1",
    "gradeId": "grade-4",
    "subjectId": "soc-4",
    "chapter": "الفصل الأول: البيئة الجغرافية للعراق",
    "lessonName": "مفهوم البيئة والمدينة والقرية",
    "questionText": "🏛️ ما هو الفرق الأساسي بين [blue]المدينة[/blue] و[green]القرية[/green] في وطننا العراق؟",
    "answerText": "**المدينة** تجمع سكاني كبير يعمل سكانه بالدوائر الحكومية والتجارة والصناعة، بينما **القرية** تجمع سكاني صغير يعمل سكانه بالزراعة وتربية الحيوانات 🌾🐄.",
    "options": [
      "المدينة سكانها يعملون بالتجارة والوظائف، والقرية سكانها يعملون بالزراعة وتربية الحيوانات",
      "المدينة ليس فيها مدارس والقرية فيها جامعات",
      "المدينة تقع في الفضاء والقرية تحت الماء",
      "لا يوجد أي فرق بينهما إطلاقاً"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المدينة تتميز بكثرة المباني والخدمات، والقرية تتميز بالطبيعة الزراعية والهدوء.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "اجتماعيات",
      "الصف الرابع",
      "جغرافيا"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g5-eng-1",
    "gradeId": "grade-5",
    "subjectId": "eng-5",
    "chapter": "Unit 1: Time, Countries & Nationalities",
    "lessonName": "Telling the Time",
    "questionText": "⏰ [blue]What time is it?[/blue] إذا كانت الساعة تشير إلى السابعة تماماً، كيف نجيب بالإنجليزية؟",
    "answerText": "نقول: **It is 7:00 (It is seven o'clock)** 🕖.",
    "options": [
      "It is seven o'clock",
      "It is seven meters",
      "It is Monday",
      "I am seven years old"
    ],
    "correctAnswerIndex": 0,
    "explanation": "عند الإجابة عن الوقت نستخدم It is متبوعاً برقم الساعة مع كلمة o'clock للتمام.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف الخامس",
      "الوقت"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g5-eng-2",
    "gradeId": "grade-5",
    "subjectId": "eng-5",
    "chapter": "Unit 2: Animals and Nature",
    "lessonName": "Habitats and Wild Animals",
    "questionText": "🦁 Where does a lion live? [blue]أين يعيش الأسد في الطبيعة؟[/blue]",
    "answerText": "The lion lives in the **grasslands / savanna** (يعيش في حشائش السافانا والغابات المفتوحة).",
    "options": [
      "In the grasslands and savanna",
      "Under the ocean water",
      "In the classroom",
      "On the moon"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الأسود تعيش في السهول العشبية المفتوحة والغابات.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف الخامس",
      "حيوانات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g5-soc-1",
    "gradeId": "grade-5",
    "subjectId": "soc-5",
    "chapter": "الفصل الأول: الموقع الجغرافي للعراق وحدوده",
    "lessonName": "موقع وطننا العراق الجغرافي والفلكي",
    "questionText": "🗺️ [green]أين يقع وطننا الحبيب العراق في قارة آسيا؟[/green] وما هي الدول المجاورة له؟",
    "answerText": "يقع العراق في **القسم الجنوبي الغربي من قارة آسيا**، وفي القسم الشمالي الشرقي من الوطن العربي. تجاوره من الشمال تركيا، ومن الشرق إيران، ومن الغرب والجنوب الغربي سوريا والأردن والسعودية والكويت 🇮🇶.",
    "options": [
      "في القسم الجنوبي الغربي من قارة آسيا والشمالي الشرقي من الوطن العربي",
      "في أقصى قارة أوروبا",
      "في وسط قارة إفريقيا فقط",
      "في المحيط الهادئ"
    ],
    "correctAnswerIndex": 0,
    "explanation": "موقع العراق استراتيجي مهم جداً يربط قارات العالم القديم الثلاث.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "اجتماعيات",
      "الصف الخامس",
      "جغرافيا العراق"
    ],
    "questionType": "qa",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g5-soc-2",
    "gradeId": "grade-5",
    "subjectId": "soc-5",
    "chapter": "الفصل الثاني: الموارد المائية في العراق",
    "lessonName": "نهرا دجلة والفرات وشط العرب",
    "questionText": "🌊 ما هو أصل تسمية العراق بـ [red]«بلاد الرافدين»[/red]؟ وأين يلتقي النهران؟",
    "answerText": "سمي ببلاد الرافدين لوجود **نهري دجلة والفرات** العظيمين، ويلتقي النهران عند **مدينة القرنة في البصرة الفيحاء** ليكونا شط العرب بطول 180 كم.",
    "options": [
      "لوجود نهري دجلة والفرات، ويلتقيان في القرنة بمحافظة البصرة",
      "لوجود بحر قزوين فقط",
      "لكثرة الأمطار في الصيف",
      "لوجود نهر النيل في بغداد"
    ],
    "correctAnswerIndex": 0,
    "explanation": "شط العرب يتكون من التقاء الرافدين دجلة والفرات عند القرنة شمال البصرة.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "اجتماعيات",
      "الصف الخامس",
      "موارد مائية"
    ],
    "questionType": "qa",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g2-eng-1",
    "gradeId": "grade-2",
    "subjectId": "eng-2",
    "chapter": "Unit 1: Numbers & Colors",
    "lessonName": "Numbers 1 to 10",
    "questionText": "🔢 [blue]How do we say the number 5 in English?[/blue] كيف ننطق الرقم 5 بالإنجليزية؟",
    "answerText": "الرقم 5 بالإنجليزية هو: **Five** (فايف) 🖐️.",
    "options": [
      "Five",
      "Four",
      "Six",
      "Ten"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الأعداد من 1 إلى 5: One, Two, Three, Four, Five.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف الثاني",
      "أرقام"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g2-eng-2",
    "gradeId": "grade-2",
    "subjectId": "eng-2",
    "chapter": "Unit 2: My Classroom",
    "lessonName": "Classroom Objects",
    "questionText": "🎒 What is this? [green]ما اسم الحقيبة المدرسية بالإنجليزية؟[/green]",
    "answerText": "الحقيبة المدرسية هي: **Bag** أو **School bag** 🎒.",
    "options": [
      "Bag",
      "Pen",
      "Desk",
      "Door"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bag تعني حقيبة مدرسية يحمل فيها التلميذ كتبه وأقلامه.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف الثاني",
      "أدوات"
    ],
    "questionType": "multiple_choice",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g5-isl-1",
    "gradeId": "grade-5",
    "subjectId": "isl-5",
    "chapter": "الوحدة الأولى: القرآن الكريم",
    "lessonName": "سورة النصر المباركة",
    "questionText": "📖 ما هي المناسبة العظيمة التي نزلت فيها سورة النصر المباركة: [green]«إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ»[/green]؟",
    "answerText": "نزلت بشارة بـ **فتح مكة المكرمة** ودخول الناس في دين الله أفواجاً، واقتراب أجل النبي (ص) بعد إتمام رسالته.",
    "options": [
      "بشارة بفتح مكة ودخول الناس في دين الله أفواجاً",
      "بشارة بغزوة بدر فقط",
      "نزلت في الهجرة إلى الحبشة",
      "نزلت في بناء الكعبة قديماً"
    ],
    "correctAnswerIndex": 0,
    "explanation": "سورة النصر آخر سورة كاملة نزلت على رسول الله (ص) وبشرت بفتح مكة.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "إسلامية",
      "سورة النصر",
      "الصف الخامس"
    ],
    "questionType": "qa",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g5-isl-2",
    "gradeId": "grade-5",
    "subjectId": "isl-5",
    "chapter": "الوحدة الثانية: السيرة والحديث النبوي",
    "lessonName": "حديث نبوي شريف في صلة الرحم",
    "questionText": "🌟 قال رسول الله (ص) في صلة الرحم: [green]«مَن أحبّ أن يُبسط له في رزقه...»[/green] أكمل الحديث الشريف.",
    "answerText": "«مَن أحبّ أن يُبسط له في رزقه، ويُنسأ له في أثره، **فليصلْ رَحِمَه**». صلة الرحم تزيد في البركة والمحبة والعمر.",
    "options": [
      "فليصلْ رَحِمَه",
      "فليجلس في بيته",
      "فلينم كثيراً",
      "فليترك العمل"
    ],
    "correctAnswerIndex": 0,
    "explanation": "صلة الرحم وزيارة الأقارب من أعظم القربات التي توسع الرزق وتبارك في الأجل.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "إسلامية",
      "أحاديث نبوية",
      "الصف الخامس"
    ],
    "questionType": "qa",
    "badgeType": "focus_tip"
  },
  {
    "id": "q-g5-eng-3",
    "gradeId": "grade-5",
    "subjectId": "eng-5",
    "chapter": "Unit 3: Sports & Activities",
    "lessonName": "Sports We Like",
    "questionText": "⚽ [blue]Which sport is played with a ball and two goals?[/blue] ما هي اللعبة التي تُلعب بالكرة ومرميين؟",
    "answerText": "It is **Football** (كرة القدم) ⚽.",
    "options": [
      "Football",
      "Swimming",
      "Running",
      "Karate"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Football هي الرياضة الشعبية الأولى وتلعب بفريقين وكرة وقدمين.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف الخامس",
      "رياضة"
    ],
    "questionType": "multiple_choice",
    "badgeType": "none"
  },
  {
    "id": "q-g5-math-1",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الأول: الأعداد ضمن المليارات",
    "lessonName": "القيمة المكانية للمليار",
    "questionText": "🔢 [blue]كم صفراً يوجد في العدد واحد مليار (1,000,000,000)؟[/blue]",
    "answerText": "العدد مليار يحتوي على **9 أصفار** (ألف مليون) 💰.",
    "options": [
      "9 أصفار",
      "6 أصفار",
      "7 أصفار",
      "12 صفراً"
    ],
    "correctAnswerIndex": 0,
    "explanation": "المليون فيه 6 أصفار، والمليار فيه 9 أصفار ويأتي بعد مئات الملايين.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "رياضيات",
      "المليارات",
      "الصف الخامس"
    ],
    "questionType": "multiple_choice",
    "badgeType": "smart_challenge"
  },
  {
    "id": "q-g5-math-2",
    "gradeId": "grade-5",
    "subjectId": "math-5",
    "chapter": "الفصل الثاني: جمع وطرح الأعداد الكبيرة",
    "lessonName": "تقدير نواتج الجمع والطرح",
    "questionText": "📐 ما هو ناتج تقريب العدد 4,785,210 لأقرب [green]مئة ألف[/green]؟",
    "answerText": "الناتج المقرب هو: **4,800,000** (لأن الرقم في خانة عشرات الألوف 8 وهو عدد كريم يعطي 1).",
    "options": [
      "4,800,000",
      "4,700,000",
      "5,000,000",
      "4,780,000"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ننظر إلى مرتبة عشرات الألوف (8)، بما أنها 5 أو أكبر نقرب بزيادة 1 على مئات الألوف.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "رياضيات",
      "التقريب",
      "الصف الخامس"
    ],
    "questionType": "qa",
    "badgeType": "none"
  },
  {
    "id": "q-g6-eng-1",
    "gradeId": "grade-6",
    "subjectId": "eng-6",
    "chapter": "Unit 1: Jobs and Places of Work",
    "lessonName": "Jobs and Workplaces",
    "questionText": "🏥 Where does a doctor work? [blue]أين يعمل الطبيب أو الممرض باللغة الإنجليزية؟[/blue]",
    "answerText": "A doctor works in a **hospital** (في المستشفى) 🏥.",
    "options": [
      "In a hospital",
      "In a school",
      "On a farm",
      "In a restaurant"
    ],
    "correctAnswerIndex": 0,
    "explanation": "الوظائف وأماكن العمل المقررة وزارياً: Doctor -> Hospital, Teacher -> School, Farmer -> Farm.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف السادس",
      "وزاري"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-eng-2",
    "gradeId": "grade-6",
    "subjectId": "eng-6",
    "chapter": "Unit 2: It's made of...",
    "lessonName": "Materials and Objects",
    "questionText": "👕 What is a T-shirt usually made of? [green]مم يُصنع القميص عادة؟[/green]",
    "answerText": "A T-shirt is made of **cotton** (من القطن الطبيعي) 🧵.",
    "options": [
      "Cotton",
      "Wood",
      "Glass",
      "Rubber"
    ],
    "correctAnswerIndex": 0,
    "explanation": "قواعد صنع المواد: T-shirt -> Cotton, Shoes -> Leather, Keys -> Metal.",
    "isVipOnly": false,
    "difficulty": "easy",
    "tags": [
      "English",
      "الصف السادس",
      "وزاري"
    ],
    "questionType": "multiple_choice",
    "badgeType": "ministerial"
  },
  {
    "id": "q-g6-isl-1",
    "gradeId": "grade-6",
    "subjectId": "isl-6",
    "chapter": "الوحدة الأولى: أحكام التلاوة",
    "lessonName": "أحكام لام التعريف (اللام الشمسية والقمرية)",
    "questionText": "📖 ما هو حكم لام التعريف في كلمة [green]«الْقَمَرُ»[/green] وكلمة [red]«الشَّمْسُ»[/red] مع ذكر السبب وزارياً؟",
    "answerText": "في «الْقَمَرُ»: **إظهار قمري** لأن حرف القاف قمري مجموع في (ابغِ حجّك وخَفْ عقيمَه). وفي «الشَّمْسُ»: **إدغام شمسي** لأن حرف الشين شمسي.",
    "options": [
      "الْقَمَرُ: إظهار قمري، والشَّمْسُ: إدغام شمسي",
      "كلاهما إظهار قمري",
      "كلاهما إدغام شمسي",
      "إخفاء حقيقي"
    ],
    "correctAnswerIndex": 0,
    "explanation": "حروف الإظهار القمري مجموعة في جملة: (ابغِ حجّك وخَفْ عقيمَه) وما عداها شمسية.",
    "isVipOnly": false,
    "difficulty": "medium",
    "tags": [
      "إسلامية",
      "أحكام التلاوة",
      "وزاري",
      "الصف السادس"
    ],
    "questionType": "qa",
    "badgeType": "ministerial"
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    username: 'haider_iraq',
    fullName: 'حيدر علي الكرخي',
    gradeId: 'grade-6',
    password: '123',
    subscription: 'paid',
    subscriptionExpiry: '2026-12-31',
    registeredAt: '2026-09-10',
    avatar: '👦🏻',
    totalScore: 980,
    starsEarned: 24,
    completedQuizzesCount: 6,
    badges: ['فارس البكالوريا 🏆', 'بطل القواعد 🌟', 'عبقري الرياضيات 📐'],
    schoolName: 'مدرسة المنصور الابتدائية للبنين',
    city: 'بغداد - الكرخ',
  },
  {
    id: 'std-2',
    username: 'zainab_basra',
    fullName: 'زينب أحمد البصري',
    gradeId: 'grade-4',
    password: '123',
    subscription: 'free',
    registeredAt: '2026-09-15',
    avatar: '👧🏻',
    totalScore: 650,
    starsEarned: 16,
    completedQuizzesCount: 4,
    badges: ['نجمة الفيحاء ⭐', 'صديقة الطبيعة 🌿'],
    schoolName: 'مدرسة شط العرب الابتدائية',
    city: 'البصرة',
  },
  {
    id: 'std-3',
    username: 'yousif_mosul',
    fullName: 'يوسف كرار الموصلي',
    gradeId: 'grade-1',
    password: '123',
    subscription: 'free',
    registeredAt: '2026-09-20',
    avatar: '👶🏻',
    totalScore: 420,
    starsEarned: 10,
    completedQuizzesCount: 2,
    badges: ['بطل الحروف الأولى 🔤'],
    schoolName: 'مدرسة الحدباء الابتدائية',
    city: 'الموصل',
  },
  {
    id: 'std-4',
    username: 'fatima_najaf',
    fullName: 'فاطمة محمد النجفي',
    gradeId: 'grade-5',
    password: '123',
    subscription: 'paid',
    subscriptionExpiry: '2026-11-30',
    registeredAt: '2026-09-05',
    avatar: '🧕🏻',
    totalScore: 890,
    starsEarned: 22,
    completedQuizzesCount: 5,
    badges: ['ملكة الإعراب 👑', 'نجمة العلوم 🔬'],
    schoolName: 'مدرسة الغري النموذجية',
    city: 'النجف الأشرف',
  },
  {
    id: 'std-5',
    username: 'abdullah_samarra',
    fullName: 'عبد الله عمر السامرائي',
    gradeId: 'grade-3',
    password: '123',
    subscription: 'free',
    registeredAt: '2026-09-25',
    avatar: '🧒🏽',
    totalScore: 510,
    starsEarned: 12,
    completedQuizzesCount: 3,
    badges: ['سيد الأرقام 🔢'],
    schoolName: 'مدرسة الملوية الابتدائية',
    city: 'صلاح الدين',
  },
];
initialData.ts
// ================= الصف السادس الابتدائي (المنهج المعتمد) =================
  'soc-6': [
    'الفصل الأول: محافظات المنطقة الشمالية',
    'الفصل الثاني: محافظات المنطقة الوسطى',
    'الفصل الثالث: محافظات المنطقة الجنوبية والفرات الأوسط',
    'الفصل الرابع: مجتمعنا العراقي وقضاياه الاجتماعية',
  ],
  'isl-6': [
    'الفصل الأول: أحكام التلاوة والوحدة الأولى (لقمان وحسن الجوار)',
    'الفصل الثاني: الوحدة الثانية (سورة النجم وأولو العزم وخيبر)',
    'الفصل الثالث: الوحدة الثالثة (سورة الرحمن ونبي الله يونس ع)',
    'الفصل الرابع: الوحدة الرابعة (سورة الإنسان وفريضة الحج والغيبة)',
    'الفصل الخامس: الوحدة الخامسة (سورة الشمس وخديجة الكبرى ع)',
  ],
  'math-6': [
    'الفصل الأول: الأعداد الصحيحة وتمثيلها والعمليات عليها',
    'الفصل الثاني: العبارات الجبرية والمعادلات',
    'الفصل الثالث: العمليات على الكسور الاعتيادية والأعداد الكسرية',
    'الفصل الرابع: العمليات على الكسور العشرية',
    'الفصل الخامس: النسبة والتناسب ومقياس الرسم',
    'الفصل السادس: الإحصاء وتمثيل البيانات',
    'الفصل السابع: الزوايا والمستقيمات المتوازية والدائرة',
  ],
