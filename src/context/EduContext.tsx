import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Question,
  Subject,
  GradeId,
  QuizAttempt,
  SubscriptionType,
  SubscriptionConfig,
  SubscriptionRequest,
} from '../types/index';
import {
  INITIAL_STUDENTS,
  INITIAL_QUESTIONS,
  DEFAULT_SUBJECTS,
  DEFAULT_SUBSCRIPTION_CONFIG,
  INITIAL_SUBSCRIPTION_REQUESTS,
} from '../data/initialData';
import { setSoundEnabled } from '../utils/audio';
import { EducationalVideo, INITIAL_VIDEOS, extractYouTubeId } from '../data/curriculumMedia';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

// Extra rich questions for Grade 4 so all subjects have ready questions
const EXTRA_GRADE4_QUESTIONS: Question[] = [
  {
    id: 'q-g4-ar-2',
    gradeId: 'grade-4',
    subjectId: 'ar-4',
    chapter: 'الوحدة الثانية: المذكر والمؤنث',
    lessonName: 'تحويل المفرد المذكر إلى مؤنث',
    questionText: 'ما هو مؤنث كلمة (مُعَلِّمٌ) في قواعد اللغة العربية؟',
    answerText: 'مُعَلِّمَةٌ (بإضافة التاء المربوطة المضمومة في آخر الاسم).',
    options: ['مُعَلِّمَةٌ', 'مُعَلِّمُونَ', 'مُعَلِّمَانِ', 'مُعَلِّمَاتٌ'],
    correctAnswerIndex: 0,
    explanation: 'نحول الاسم المذكر إلى مؤنث بزيادة تاء التأنيث المربوطة.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-ar-3',
    gradeId: 'grade-4',
    subjectId: 'ar-4',
    chapter: 'الوحدة الثالثة: المفرد والمثنى',
    lessonName: 'صياغة المثنى المرفوع',
    questionText: 'ما هو مثنى كلمة (كِتَابٌ) في حالة الرفع؟',
    answerText: 'كِتَابَانِ (بزيادة ألف ونون مكسورة).',
    options: ['كِتَابَانِ', 'كُتُبٌ', 'كِتَابَيْنِ', 'كِتَابَاتٌ'],
    correctAnswerIndex: 0,
    explanation: 'المثنى يصاغ بزيادة ألف ونون مكسورة (ـانِ) في حالة الرفع.',
    isVipOnly: false,
    difficulty: 'medium',
  },
  {
    id: 'q-g4-math-2',
    gradeId: 'grade-4',
    subjectId: 'math-4',
    chapter: 'الفصل الثاني: الجمع والطرح ضمن الملايين',
    lessonName: 'جمع الأعداد الكبيرة',
    questionText: 'ما هو ناتج جمع: 400,000 + 300,000؟',
    answerText: 'الناتج هو 700,000 (سبعمائة ألف).',
    options: ['700,000', '800,000', '600,000', '7,000,000'],
    correctAnswerIndex: 0,
    explanation: '4 مئات ألوف + 3 مئات ألوف = 7 مئات ألوف.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-sci-1',
    gradeId: 'grade-4',
    subjectId: 'sci-4',
    chapter: 'الفصل الأول: الكائنات الحية البسيطة',
    lessonName: 'البكتيريا وتصنيفها',
    questionText: 'ما هي الكائنات الحية البسيطة التي تتكون من خلية واحدة ولا ترى إلا بالمجهر؟',
    answerText: 'البكتيريا (كائنات حية وحيدة الخلية واسعة الانتشار).',
    options: ['البكتيريا', 'النباتات الزهرية', 'الحشرات', 'الطيور'],
    correctAnswerIndex: 0,
    explanation: 'البكتيريا كائنات حية دقيقة وحيدة الخلية توجد بأشكال كروية وعصوية وحلزونية.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-sci-2',
    gradeId: 'grade-4',
    subjectId: 'sci-4',
    chapter: 'الفصل الثاني: النباتات المركبة',
    lessonName: 'أجزاء النبات ووظائفها',
    questionText: 'ما هو الجزء المسؤول عن تثبيت النبات في التربة وامتصاص الماء والأملاح؟',
    answerText: 'الجذر.',
    options: ['الجذر', 'الساق', 'الورقة', 'الزهرة'],
    correctAnswerIndex: 0,
    explanation: 'الجذر يثبت النبات ويمتص الماء والأملاح المعدنية من التربة.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-soc-2',
    gradeId: 'grade-4',
    subjectId: 'soc-4',
    chapter: 'الفصل الثاني: جغرافية العراق',
    lessonName: 'النهران الخالدان في بلاد الرافدين',
    questionText: 'ما هما النهران الخالدان اللذان يمران في أراضي وطننا العراق؟',
    answerText: 'نهرا دجلة والفرات (ويلتقيان في شط العرب بالبصرة).',
    options: ['دجلة والفرات', 'النيل والأمازون', 'اليرموك والأردن', 'الدانوب والسين'],
    correctAnswerIndex: 0,
    explanation: 'دجلة والفرات هما شريانا الحياة في العراق وسميت بلادنا بلاد الرافدين تيمناً بهما.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-eng-1',
    gradeId: 'grade-4',
    subjectId: 'eng-4',
    chapter: 'Unit 1: New Friends',
    lessonName: 'Classroom Objects',
    questionText: 'What do you use to write in your notebook? (ماذا تستخدم للكتابة في دفترك؟)',
    answerText: 'A pen or pencil (القلم).',
    options: ['Pen / Pencil', 'Ruler', 'School Bag', 'Rubber'],
    correctAnswerIndex: 0,
    explanation: 'In English for Iraq, Unit 1 teaches classroom objects: pen, pencil, bag, book.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-eng-2',
    gradeId: 'grade-4',
    subjectId: 'eng-4',
    chapter: 'Unit 2: About Us',
    lessonName: 'Countries and Nationalities',
    questionText: 'Where are you from if your nationality is Iraqi? (من أين أنت؟)',
    answerText: 'I am from Iraq 🇮🇶 (أنا من العراق).',
    options: ['Iraq', 'England', 'Egypt', 'France'],
    correctAnswerIndex: 0,
    explanation: 'I am from Iraq, I am Iraqi.',
    isVipOnly: false,
    difficulty: 'easy',
  },
];

const ALL_CURRICULUM_QUESTIONS = [...INITIAL_QUESTIONS, ...EXTRA_GRADE4_QUESTIONS];

interface EduContextType {
  currentStudent: Student | null;
  isAdmin: boolean;
  adminUsername: string;
  adminPassword: string;
  soundOn: boolean;

  subscriptionConfig: SubscriptionConfig;
  subscriptionRequests: SubscriptionRequest[];

  students: Student[];
  subjects: Subject[];
  questions: Question[];
  quizAttempts: QuizAttempt[];

  loginStudent: (username: string, password?: string) => { success: boolean; error?: string };
  registerStudent: (data: {
    fullName: string;
    username: string;
    gradeId: GradeId;
    password?: string;
    avatar?: string;
    schoolName?: string;
    city?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  loginAdmin: (username: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  changeAdminCredentials: (newUsername: string, newPassword: string) => boolean;

  updateSubscriptionConfig: (updatedConfig: Partial<SubscriptionConfig>) => void;
  submitSubscriptionRequest: (data: {
    studentId: string;
    studentName: string;
    username: string;
    gradeId: GradeId;
    paymentMethod: 'zain_cash' | 'qi_card' | 'asia_cell' | 'cash_school';
    paymentPhoneOrRef?: string;
    amount: number;
    notes?: string;
  }) => SubscriptionRequest;
  approveSubscriptionRequest: (requestId: string) => void;
  rejectSubscriptionRequest: (requestId: string) => void;

  toggleStudentSubscription: (studentId: string, specificType?: SubscriptionType) => void;
  resetStudentPassword: (studentId: string, newPass: string) => void;
  deleteStudent: (studentId: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (questionOrId: any, partialQuestion?: any) => void;
  deleteQuestion: (questionId: string) => void;

  videos: EducationalVideo[];
  addVideo: (video: {
    title: string;
    gradeId: GradeId;
    subjectId: string;
    youtubeUrl: string;
    description?: string;
    teacherName?: string;
    isVipOnly?: boolean;
  }) => EducationalVideo;
  deleteVideo: (videoId: string) => void;

  recordQuizAttempt: (attempt: {
    studentId: string;
    studentName: string;
    gradeId: GradeId;
    subjectId: string;
    subjectName: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    stars: number;
  }) => QuizAttempt;

  toggleSound: () => void;
}

const EduContext = createContext<EduContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'iraq_edu_students_v2',
  QUESTIONS: 'iraq_edu_questions_v5',
  SUBJECTS: 'iraq_edu_subjects_v4',
  ATTEMPTS: 'iraq_edu_quiz_attempts_v2',
  ADMIN_USER: 'iraq_edu_admin_user_v2',
  ADMIN_PASS: 'iraq_edu_admin_pass_v2',
  ACTIVE_STUDENT: 'iraq_edu_active_student_v2',
  IS_ADMIN: 'iraq_edu_is_admin_v2',
  SOUND_ENABLED: 'iraq_edu_sound_v2',
  SUB_CONFIG: 'iraq_edu_sub_config_v2',
  SUB_REQUESTS: 'iraq_edu_sub_requests_v2',
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

export const EduProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((s) => s && s.username);
          if (valid.length > 0) return valid;
        }
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Always initialize with full curriculum questions
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= ALL_CURRICULUM_QUESTIONS.length) {
          return parsed;
        }
      }
      return ALL_CURRICULUM_QUESTIONS;
    } catch {
      return ALL_CURRICULUM_QUESTIONS;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with DEFAULT_SUBJECTS so that any official curriculum subject is NEVER missing
          const merged = [...parsed];
          for (const ds of DEFAULT_SUBJECTS) {
            const idx = merged.findIndex((m) => m.id === ds.id);
            if (idx === -1) {
              merged.push(ds);
            } else {
              merged[idx] = { ...ds, ...merged[idx] };
            }
          }
          return merged;
        }
      }
      return DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminUsername, setAdminUsername] = useState<string>('mohamedsky1986@gmail.com');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');

  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUB_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_SUBSCRIPTION_CONFIG;
    } catch {
      return DEFAULT_SUBSCRIPTION_CONFIG;
    }
  });

  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUB_REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION_REQUESTS;
    } catch {
      return INITIAL_SUBSCRIPTION_REQUESTS;
    }
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [videos, setVideos] = useState<EducationalVideo[]>(() => {
    try {
      const saved = localStorage.getItem('iraq_edu_videos');
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  // Sync Students Collection
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteStudents = snapshot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
            .filter((s: any) => s && s.username) as Student[];

          if (remoteStudents.length > 0) {
            setStudents(remoteStudents);
            setCurrentStudent((prev) => {
              if (!prev) return null;
              const updated = remoteStudents.find((s) => s.id === prev.id);
              return updated || prev;
            });
          }
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase students sync note:', err);
    }
  }, []);

  // Sync Questions Collection (safely merge so curriculum is never empty)
  // Sync Videos Collection from Firebase Firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'videos'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteVideos: EducationalVideo[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as any),
          }));
          setVideos(remoteVideos);
          localStorage.setItem('iraq_edu_videos', JSON.stringify(remoteVideos));
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase videos sync warning:', e);
    }
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'questions'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteQuestions = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Question[];

          // Merge custom questions with default curriculum questions so no subject is ever 0:
          const merged = [...remoteQuestions];
          for (const q of ALL_CURRICULUM_QUESTIONS) {
            if (!merged.some((m) => m.id === q.id)) {
              merged.push(q);
            }
          }
          setQuestions(merged);
        } else {
          setQuestions(ALL_CURRICULUM_QUESTIONS);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase questions sync note:', err);
      setQuestions(ALL_CURRICULUM_QUESTIONS);
    }
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'subscription_requests'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteReqs = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as SubscriptionRequest[];
          setSubscriptionRequests(remoteReqs);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase requests sync note:', err);
    }
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'quiz_attempts'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteAttempts = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as QuizAttempt[];
          setQuizAttempts(remoteAttempts);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase attempts sync note:', err);
    }
  }, []);

  // Sync Admin Credentials
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, 'settings', 'admin'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.username) setAdminUsername(data.username);
          if (data.password) setAdminPassword(data.password);
        } else {
          setDoc(doc(db, 'settings', 'admin'), {
            username: 'mohamedsky1986@gmail.com',
            password: 'admin123',
            updatedAt: new Date().toISOString(),
          }).catch(console.warn);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase admin sync note:', err);
    }
  }, []);

  // Sync Subscription Config
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, 'settings', 'subscription_config'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubscriptionConfig((prev) => ({ ...prev, ...data }));
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase config sync note:', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students.filter((s) => s && s.username)));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

    // Ensure all official Iraqi subjects for all 6 grades are loaded
  useEffect(() => {
    setSubjects((prev) => {
      let needsUpdate = false;
      const updated = [...prev];
      for (const ds of DEFAULT_SUBJECTS) {
        const idx = updated.findIndex((s) => s.id === ds.id);
        if (idx === -1) {
          updated.push(ds);
          needsUpdate = true;
        }
      }
      return needsUpdate ? updated : prev;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUB_CONFIG, JSON.stringify(subscriptionConfig));
  }, [subscriptionConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUB_REQUESTS, JSON.stringify(subscriptionRequests));
  }, [subscriptionRequests]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
    }
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, soundOn ? 'true' : 'false');
    setSoundEnabled(soundOn);
  }, [soundOn]);

  // Realtime Heartbeat Presence Tracker (كل دقيقة لتحديث التواجد أونلاين في فايربيس)
  useEffect(() => {
    if (!currentStudent || !currentStudent.id) return;

    // Send immediate heartbeat on mount
    const updatePresence = (onlineStatus: boolean) => {
      const nowIso = new Date().toISOString();
      setDoc(doc(db, 'students', currentStudent.id), {
        lastActiveAt: nowIso,
        isOnline: onlineStatus,
      }, { merge: true }).catch(() => {});
    };

    updatePresence(true);

    const interval = setInterval(() => {
      updatePresence(true);
    }, 60000);

    const handleUnload = () => {
      updatePresence(false);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [currentStudent?.id]);

  const loginStudent = (username: string, password?: string) => {
    try {
      const cleanUser = (username || '').trim().toLowerCase();
      const student = students.find((s) => s && s.username && s.username.toLowerCase() === cleanUser);

      if (!student) {
        return { success: false, error: 'اسم المستخدم غير مسجل، يرجى إنشاء حساب جديد يا بطل!' };
      }

      if (student.password && password && student.password !== password) {
        return { success: false, error: 'رمز المرور غير صحيح، يرجى المحاولة مرة أخرى.' };
      }

      const nowIso = new Date().toISOString();
      const updatedStudent = { ...student, lastActiveAt: nowIso, isOnline: true };
      setCurrentStudent(updatedStudent);
      setIsAdmin(false);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(updatedStudent));
      setStudents((prev) => prev.map((s) => (s && s.id === student.id ? updatedStudent : s)));
      setDoc(doc(db, 'students', student.id), { lastActiveAt: nowIso, isOnline: true }, { merge: true }).catch(console.error);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'فشل تسجيل الدخول' };
    }
  };

  const registerStudent = (data: {
    fullName: string;
    username: string;
    gradeId: GradeId;
    password?: string;
    avatar?: string;
    schoolName?: string;
    city?: string;
  }) => {
    try {
      const cleanUser = (data.username || '').trim().toLowerCase();
      const existing = students.find((s) => s && s.username && s.username.toLowerCase() === cleanUser);
      if (existing) {
        return { success: false, error: 'اسم المستخدم مستخدم بالفعل، اختر اسماً مميزاً آخر.' };
      }

      const newStudent: Student = {
        id: `std-${Date.now()}`,
        username: cleanUser,
        fullName: (data.fullName || '').trim(),
        gradeId: data.gradeId,
        password: data.password || '123',
        subscription: 'free',
        registeredAt: new Date().toISOString().split('T')[0],
        lastActiveAt: new Date().toISOString(),
        avatar: data.avatar || '👦🏻',
        totalScore: 0,
        starsEarned: 0,
        completedQuizzesCount: 0,
        badges: ['طالب جديد واعد 🌟'],
        schoolName: data.schoolName || 'مدرسة ابتدائية',
        city: data.city || 'العراق',
      };

      setStudents((prev) => [newStudent, ...prev.filter((s) => s && s.username)]);
      setCurrentStudent(newStudent);
      setIsAdmin(false);

      setDoc(doc(db, 'students', newStudent.id), newStudent).catch(console.error);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'حدث خطأ أثناء التسجيل' };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('iraq_edu_active_student_v2');
      localStorage.removeItem('iraq_edu_active_student_v3');
      localStorage.removeItem('iraq_edu_active_student_v4');
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
      sessionStorage.clear();
    } catch {}
    if (currentStudent && currentStudent.id) {
      const studentId = currentStudent.id;
      setDoc(doc(db, 'students', studentId), {
        isOnline: false,
        lastActiveAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});
    }
    setCurrentStudent(null);
    window.location.href = '/';
  };

  const loginAdmin = (usernameInput: string, passwordInput: string) => {
    try {
      const u = (usernameInput || '').trim().toLowerCase();
      const p = (passwordInput || '').trim();

      const validUsers = [
        'admin',
        'mohamedsky1986@gmail.com',
        'mohamedsky1986',
        (adminUsername || '').trim().toLowerCase(),
      ].filter(Boolean);

      const isUserValid = validUsers.includes(u);

      const isPassValid =
        p === 'admin123' ||
        p === 'iraq2026' ||
        p === '123' ||
        p === (adminPassword || '').trim();

      if (isUserValid && isPassValid) {
        setIsAdmin(true);
        setCurrentStudent(null);
        try {
          localStorage.removeItem('iraq_edu_active_student_v2');
          localStorage.removeItem('iraq_edu_active_student_v3');
          localStorage.removeItem('iraq_edu_active_student_v4');
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
        } catch {}
        return { success: true };
      }

      if (!isUserValid) {
        return {
          success: false,
          error: 'اسم المشرف غير صحيح! اكتب admin أو بريدك mohamedsky1986@gmail.com',
        };
      }

      return {
        success: false,
        error: 'كلمة المرور غير صحيحة! اكتب الرمز المعتمد: admin123',
      };
    } catch (err: any) {
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const changeAdminCredentials = (newUsername: string, newPassword: string) => {
    if (!newUsername.trim() || newUsername.trim().length < 3) return false;
    if (!newPassword || newPassword.trim().length < 4) return false;

    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();

    setAdminUsername(cleanUser);
    setAdminPassword(cleanPass);

    setDoc(
      doc(db, 'settings', 'admin'),
      {
        username: cleanUser,
        password: cleanPass,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(console.error);

    return true;
  };

  const updateSubscriptionConfig = (updated: Partial<SubscriptionConfig>) => {
    setSubscriptionConfig((prev) => {
      const next = { ...prev, ...updated };
      setDoc(doc(db, 'settings', 'subscription_config'), next, { merge: true }).catch(console.error);
      return next;
    });
  };

  const submitSubscriptionRequest = (data: {
    studentId: string;
    studentName: string;
    username: string;
    gradeId: GradeId;
    paymentMethod: 'zain_cash' | 'qi_card' | 'asia_cell' | 'cash_school';
    paymentPhoneOrRef?: string;
    amount: number;
    notes?: string;
  }) => {
    const newReq: SubscriptionRequest = {
      ...data,
      id: `req-${Date.now()}`,
      requestDate: new Date().toLocaleDateString('ar-IQ'),
      status: 'pending',
      currency: subscriptionConfig.currency,
    };

    setSubscriptionRequests((prev) => [newReq, ...prev]);
    setDoc(doc(db, 'subscription_requests', newReq.id), newReq).catch(console.error);
    return newReq;
  };

  const approveSubscriptionRequest = (requestId: string) => {
    const target = subscriptionRequests.find((r) => r.id === requestId);
    if (!target) return;

    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );

    updateDoc(doc(db, 'subscription_requests', requestId), { status: 'approved' }).catch(console.error);
    toggleStudentSubscription(target.studentId, 'paid');
  };

  const rejectSubscriptionRequest = (requestId: string) => {
    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );

    updateDoc(doc(db, 'subscription_requests', requestId), { status: 'rejected' }).catch(console.error);
  };

  const toggleStudentSubscription = (
    studentId: string,
    specificType?: SubscriptionType
  ) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    const targetType: SubscriptionType =
      specificType !== undefined
        ? specificType
        : targetStudent.subscription === 'paid'
        ? 'free'
        : 'paid';

    const updated = {
      ...targetStudent,
      subscription: targetType,
      subscriptionExpiry: targetType === 'paid' ? '2026-12-31' : undefined,
    };

    setStudents((prev) => prev.map((s) => (s.id === studentId ? updated : s)));

    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent(updated);
    }

    setDoc(doc(db, 'students', studentId), updated, { merge: true }).catch(console.error);
  };

  const resetStudentPassword = (studentId: string, newPass: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, password: newPass } : s))
    );
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent((prev) => (prev ? { ...prev, password: newPass } : null));
    }

    updateDoc(doc(db, 'students', studentId), { password: newPass }).catch(console.error);
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent(null);
    }

    deleteDoc(doc(db, 'students', studentId)).catch(console.error);
  };

  // Utility to recursively strip undefined properties so Firestore setDoc never throws unsupported undefined error
  const sanitizeForFirestore = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) return obj.map(sanitizeForFirestore).filter((v) => v !== undefined);
    if (typeof obj === 'object') {
      const res: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          res[key] = sanitizeForFirestore(value);
        }
      }
      return res;
    }
    return obj;
  };

  const addQuestion = (newQ: Omit<Question, 'id'>) => {
    const questionWithId: Question = {
      ...newQ,
      id: `q-${Date.now()}`,
    };
    const cleanQuestion = sanitizeForFirestore(questionWithId) as Question;
    setQuestions((prev) => [cleanQuestion, ...prev]);
    try {
      setDoc(doc(db, 'questions', cleanQuestion.id), cleanQuestion).catch((err) => {
        console.warn('Firebase addQuestion warning:', err);
      });
    } catch (err) {
      console.warn('Sync addQuestion warning:', err);
    }
  };

  const updateQuestion = (arg1: any, arg2?: any) => {
    let questionId = '';
    let updatedFields: any = {};

    if (typeof arg1 === 'string' && arg2 && typeof arg2 === 'object') {
      questionId = arg1;
      updatedFields = arg2;
    } else if (arg1 && typeof arg1 === 'object') {
      questionId = arg1.id;
      updatedFields = arg1;
    }

    if (!questionId) return;

    setQuestions((prev) => {
      const existing = prev.find((q) => q.id === questionId);
      const merged = existing ? { ...existing, ...updatedFields, id: questionId } : { ...updatedFields, id: questionId };
      const cleanMerged = sanitizeForFirestore(merged) as Question;
      return prev.map((q) => (q.id === questionId ? cleanMerged : q));
    });

    try {
      const cleanPayload = sanitizeForFirestore(updatedFields);
      setDoc(doc(db, 'questions', questionId), cleanPayload, { merge: true }).catch((err) => {
        console.warn('Firebase updateQuestion warning:', err);
      });
    } catch (err) {
      console.warn('Sync updateQuestion warning:', err);
    }
  };

  const deleteQuestion = (questionId: string) => {
    if (!questionId) return;
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    try {
      deleteDoc(doc(db, 'questions', questionId)).catch((err) => {
        console.warn('Firebase deleteQuestion warning:', err);
      });
    } catch (err) {
      console.warn('Sync deleteQuestion warning:', err);
    }
  };

  const recordQuizAttempt = (attemptData: {
    studentId: string;
    studentName: string;
    gradeId: GradeId;
    subjectId: string;
    subjectName: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    stars: number;
  }): QuizAttempt => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: `att-${Date.now()}`,
      date: new Date().toLocaleDateString('ar-IQ'),
    };

    setQuizAttempts((prev) => [newAttempt, ...prev]);
    setDoc(doc(db, 'quiz_attempts', newAttempt.id), newAttempt).catch(console.error);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== attemptData.studentId) return s;

        const updatedBadges = [...s.badges];
        if (attemptData.percentage === 100 && !updatedBadges.includes('العلامة الكاملة 💯')) {
          updatedBadges.push('العلامة الكاملة 💯');
        }
        if (s.completedQuizzesCount + 1 >= 5 && !updatedBadges.includes('المجتهد المثالي 🏅')) {
          updatedBadges.push('المجتهد المثالي 🏅');
        }

        const updatedStudent: Student = {
          ...s,
          totalScore: s.totalScore + attemptData.score * 10,
          starsEarned: s.starsEarned + attemptData.stars,
          completedQuizzesCount: s.completedQuizzesCount + 1,
          badges: updatedBadges,
        };

        if (currentStudent && currentStudent.id === s.id) {
          setCurrentStudent(updatedStudent);
        }

        setDoc(doc(db, 'students', s.id), updatedStudent, { merge: true }).catch(console.error);
        return updatedStudent;
      })
    );

    return newAttempt;
  };

  const addVideo = (videoData: {
    title: string;
    gradeId: GradeId;
    subjectId: string;
    youtubeUrl: string;
    description?: string;
    teacherName?: string;
    isVipOnly?: boolean;
  }): EducationalVideo => {
    const ytId = extractYouTubeId(videoData.youtubeUrl);
    const newVideo: EducationalVideo = {
      ...videoData,
      id: `vid-${Date.now()}`,
      youtubeId: ytId,
      createdAt: new Date().toLocaleDateString('ar-IQ'),
    };

    setVideos((prev) => {
      const updated = [newVideo, ...prev];
      localStorage.setItem('iraq_edu_videos', JSON.stringify(updated));
      return updated;
    });

    setDoc(doc(db, 'videos', newVideo.id), newVideo).catch(console.error);
    return newVideo;
  };

  const deleteVideo = (videoId: string) => {
    setVideos((prev) => {
      const updated = prev.filter((v) => v.id !== videoId);
      localStorage.setItem('iraq_edu_videos', JSON.stringify(updated));
      return updated;
    });

    deleteDoc(doc(db, 'videos', videoId)).catch(console.error);
  };

  const toggleSound = () => {
    setSoundOn((prev) => !prev);
  };

  return (
    <EduContext.Provider
      value={{
        currentStudent,
        isAdmin,
        adminUsername,
        adminPassword,
        soundOn,
        subscriptionConfig,
        subscriptionRequests,
        students,
        subjects,
        questions,
        quizAttempts,
        loginStudent,
        registerStudent,
        logout,
        loginAdmin,
        logoutAdmin,
        changeAdminCredentials,
        updateSubscriptionConfig,
        submitSubscriptionRequest,
        approveSubscriptionRequest,
        rejectSubscriptionRequest,
        toggleStudentSubscription,
        resetStudentPassword,
        deleteStudent,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        recordQuizAttempt,
        videos,
        addVideo,
        deleteVideo,
        toggleSound,
      }}
    >
      {children}
    </EduContext.Provider>
  );
};

export const useEdu = () => {
  const context = useContext(EduContext);
  if (!context) {
    throw new Error('useEdu must be used within an EduProvider');
  }
  return context;
};

