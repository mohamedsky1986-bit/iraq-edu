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
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

const EXTRA_GRADE4_QUESTIONS: Question[] = [
  {
    id: 'q-g4-ar-1',
    gradeId: 'grade-4',
    subjectId: 'ar-4',
    chapter: 'الوحدة الأولى: أقسام الكلام',
    lessonName: 'الاسم والفعل والحرف',
    questionText: 'ما هي أقسام الكلام في لغتنا العربية الجميلة؟',
    answerText: 'يقسم الكلام إلى ثلاثة أقسام: الاسم، والفعل، والحرف.',
    options: ['اسم وفعل وحرف', 'مبتدأ وخبر فقط', 'ماضي ومضارع فقط', 'حروف الجر فقط'],
    correctAnswerIndex: 0,
    explanation: 'كل كلمة ننطقها في اللغة العربية هي إما اسم (مثل أحمد، شجرة) أو فعل (كتب، يقرأ) أو حرف (في، على).',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-ar-2',
    gradeId: 'grade-4',
    subjectId: 'ar-4',
    chapter: 'الوحدة الثانية: الجملة الاسمية',
    lessonName: 'المبتدأ والخبر',
    questionText: 'ما هما الركنان الأساسيان في الجملة الاسمية؟',
    answerText: 'المبتدأ والخبر، وكلاهما مرفوعان دائماً بالضمة.',
    options: ['المبتدأ والخبر', 'الفعل والفاعل', 'حرف الجر والاسم المجرور', 'الصفة والموصوف'],
    correctAnswerIndex: 0,
    explanation: 'مثل: (العِلْمُ نُورٌ) - العلم مبتدأ مرفوع، ونور خبر مرفوع.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-soc-1',
    gradeId: 'grade-4',
    subjectId: 'soc-4',
    chapter: 'الفصل الأول: تاريخ بلاد الرافدين',
    lessonName: 'حضارة وادي الرافدين',
    questionText: 'ما الاسمان التاريخيان الشهيران لوطننا الحبيب العراق قديماً؟',
    answerText: 'بلاد وادي الرافدين، وبلاد ما بين النهرين (دجلة والفرات).',
    options: ['بلاد وادي الرافدين', 'بلاد الأهرامات', 'بلاد الشام', 'بلاد النيل'],
    correctAnswerIndex: 0,
    explanation: 'سمي العراق ببلاد الرافدين لوجود نهري دجلة والفرات العظيمين الخالدين.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-soc-2',
    gradeId: 'grade-4',
    subjectId: 'soc-4',
    chapter: 'الفصل الثاني: جغرافية العراق',
    lessonName: 'الجهات الأربع الأصلية',
    questionText: 'من أين تشرق الشمس كل صباح؟',
    answerText: 'تشرق الشمس دائماً من جهة الشرق، وتغرب في جهة الغرب.',
    options: ['الشرق', 'الغرب', 'الشمال', 'الجنوب'],
    correctAnswerIndex: 0,
    explanation: 'الجهات الأصلية أربع: الشمال والجنوب والشرق والغرب.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-isl-1',
    gradeId: 'grade-4',
    subjectId: 'isl-4',
    chapter: 'الوحدة الأولى: القرآن الكريم',
    lessonName: 'سورة الضحى المباركة',
    questionText: 'ما المعنى الإيماني الجميل لقسم الله تعالى في بداية سورة الضحى؟',
    answerText: 'يقسم الله تعالى بوقت الضحى وبالليل إذا سجى بأن رحمته بنبيه والمؤمنين دائمة لا تنقطع.',
    options: ['رحمة الله دائمة بنبيه والمؤمنين', 'الأمر بالنوم المبكر', 'النهي عن العمل', 'طلب السفر'],
    correctAnswerIndex: 0,
    explanation: 'سورة الضحى تبث الطمأنينة والأمل في قلوب المسلمين وتحث على رعاية اليتيم ومساعدة السائل.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-isl-2',
    gradeId: 'grade-4',
    subjectId: 'isl-4',
    chapter: 'الوحدة الثانية: العقيدة الإسلامية',
    lessonName: 'أركان الإيمان الستة',
    questionText: 'ما هو الركن الأول والأعظم من أركان الإيمان في ديننا الإسلامي الحنيف؟',
    answerText: 'الإيمان بالله الواحد الأحد الذي لا شريك له، خالق كل شيء.',
    options: ['الإيمان بالله تعالى وحده', 'الإيمان بالكتب فقط', 'الإيمان باليوم الآخر فقط', 'الإيمان بالملائكة فقط'],
    correctAnswerIndex: 0,
    explanation: 'يبدأ الإيمان بالشهادة بوحدانية الله جل جلاله ثم الإيمان بملائكته وكتبه ورسله.',
    isVipOnly: false,
    difficulty: 'easy',
  },
  {
    id: 'q-g4-eng-1',
    gradeId: 'grade-4',
    subjectId: 'eng-4',
    chapter: 'Unit 1: New Friends',
    lessonName: 'Greetings and Introductions',
    questionText: 'What do you say when you meet a friend in the morning at school?',
    answerText: 'Good morning! (صباح الخير يا صديقي).',
    options: ['Good morning', 'Good night', 'Goodbye', 'See you tomorrow'],
    correctAnswerIndex: 0,
    explanation: 'We say Good morning in the morning and Good afternoon in the afternoon.',
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
  registerStudent: (data: Omit<Student, 'id' | 'totalScore' | 'starsEarned' | 'completedQuizzesCount' | 'registeredAt'>) => { success: boolean; error?: string };
  logout: () => void;

  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  changeAdminCredentials: (newUser: string, newPass: string) => void;

  updateSubscriptionConfig: (config: SubscriptionConfig) => void;
  submitSubscriptionRequest: (req: Omit<SubscriptionRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveSubscriptionRequest: (requestId: string) => void;
  rejectSubscriptionRequest: (requestId: string) => void;
  toggleStudentSubscription: (studentId: string) => void;
  resetStudentPassword: (studentId: string) => void;
  deleteStudent: (studentId: string) => void;

  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, q: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;

  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  toggleSound: () => void;
}

const STORAGE_KEYS = {
  ACTIVE_STUDENT: 'iraq_edu_active_student_v4',
  IS_ADMIN: 'iraq_edu_is_admin_v4',
  SOUND: 'iraq_edu_sound_v4',
  ADMIN_USER: 'iraq_edu_adm_u_v4',
  ADMIN_PASS: 'iraq_edu_adm_p_v4',
  SUB_CONFIG: 'iraq_edu_sub_conf_v4',
  SUB_REQUESTS: 'iraq_edu_sub_reqs_v4',
  QUESTIONS: 'iraq_edu_questions_v4',
};
updateQuestion: (questionOrId: any, partialQuestion?: any) => void;
const EduContext = createContext<EduContextType | undefined>(undefined);

export const EduProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [adminUsername, setAdminUsername] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_USER) || 'admin';
    } catch {
      return 'admin';
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'iraq2026';
    } catch {
      return 'iraq2026';
    }
  });

  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

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

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [subjects] = useState<Subject[]>(DEFAULT_SUBJECTS);

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return ALL_CURRICULUM_QUESTIONS;
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Student[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setStudents(loaded);
      } else {
        INITIAL_STUDENTS.forEach((st) => {
          setDoc(doc(db, 'students', st.id), st).catch(console.error);
        });
        setStudents(INITIAL_STUDENTS);
      }
    }, (error) => {
      console.error('Firestore students listener error:', error);
      setStudents(INITIAL_STUDENTS);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subscriptionConfig'), (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data() as SubscriptionConfig;
        setSubscriptionConfig(data);
        localStorage.setItem(STORAGE_KEYS.SUB_CONFIG, JSON.stringify(data));
      } else {
        setDoc(doc(db, 'subscriptionConfig', 'global_config'), DEFAULT_SUBSCRIPTION_CONFIG).catch(console.error);
      }
    }, (error) => {
      console.error('Firestore config listener error:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subscriptionRequests'), (snapshot) => {
      const loaded: SubscriptionRequest[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      setSubscriptionRequests(loaded);
      localStorage.setItem(STORAGE_KEYS.SUB_REQUESTS, JSON.stringify(loaded));
    }, (error) => {
      console.error('Firestore requests listener error:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'questions'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Question[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        const customIds = new Set(loaded.map((q) => q.id));
        const merged = [
          ...loaded,
          ...ALL_CURRICULUM_QUESTIONS.filter((baseQ) => !customIds.has(baseQ.id)),
        ];
        setQuestions(merged);
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(merged));
      } else {
        setQuestions(ALL_CURRICULUM_QUESTIONS);
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(ALL_CURRICULUM_QUESTIONS));
      }
    }, (error) => {
      console.error('Firestore questions listener error:', error);
      setQuestions(ALL_CURRICULUM_QUESTIONS);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'adminCredentials'), (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        if (data && data.username && data.password) {
          setAdminUsername(data.username);
          setAdminPassword(data.password);
          localStorage.setItem(STORAGE_KEYS.ADMIN_USER, data.username);
          localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, data.password);
        }
      } else {
        setDoc(doc(db, 'adminCredentials', 'master_admin'), {
          username: 'admin',
          password: 'iraq2026',
        }).catch(console.error);
      }
    }, (error) => {
      console.error('Firestore admin listener error:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (!currentStudent || !currentStudent.id) return;

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
    }, 45000);

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

  const registerStudent = (data: Omit<Student, 'id' | 'totalScore' | 'starsEarned' | 'completedQuizzesCount' | 'registeredAt'>) => {
    try {
      const cleanUser = (data.username || '').trim().toLowerCase();
      if (!cleanUser) {
        return { success: false, error: 'يرجى إدخال اسم مستخدم صحيح' };
      }

      const exists = students.some((s) => s && s.username && s.username.toLowerCase() === cleanUser);
      if (exists) {
        return { success: false, error: 'اسم المستخدم مستخدم مسبقاً، اختر اسماً آخر يا بطل.' };
      }

      const newId = `st_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const nowIso = new Date().toISOString();
      const newStudent: Student = {
        ...data,
        username: cleanUser,
        id: newId,
        totalScore: 0,
        starsEarned: 0,
        completedQuizzesCount: 0,
        registeredAt: nowIso.split('T')[0],
        lastActiveAt: nowIso,
        isOnline: true,
      };

      setDoc(doc(db, 'students', newId), newStudent).catch(console.error);
      setStudents((prev) => [newStudent, ...prev]);
      setCurrentStudent(newStudent);
      setIsAdmin(false);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(newStudent));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'فشل التسجيل' };
    }
  };

  const logout = () => {
    if (currentStudent && currentStudent.id) {
      const nowIso = new Date().toISOString();
      setDoc(doc(db, 'students', currentStudent.id), {
        isOnline: false,
        lastActiveAt: nowIso,
      }, { merge: true }).catch(console.error);
    }
    setCurrentStudent(null);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
  };

  const loginAdmin = (user: string, pass: string): boolean => {
    if (user.trim() === adminUsername && pass === adminPassword) {
      setIsAdmin(true);
      setCurrentStudent(null);
      localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
  };

  const changeAdminCredentials = (newUser: string, newPass: string) => {
    setAdminUsername(newUser);
    setAdminPassword(newPass);
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, newUser);
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass);
    setDoc(doc(db, 'adminCredentials', 'master_admin'), {
      username: newUser,
      password: newPass,
      updatedAt: new Date().toISOString(),
    }).catch(console.error);
  };

  const updateSubscriptionConfig = (config: SubscriptionConfig) => {
    setSubscriptionConfig(config);
    localStorage.setItem(STORAGE_KEYS.SUB_CONFIG, JSON.stringify(config));
    setDoc(doc(db, 'subscriptionConfig', 'global_config'), config).catch(console.error);
  };

  const submitSubscriptionRequest = (req: Omit<SubscriptionRequest, 'id' | 'createdAt' | 'status'>) => {
    const newId = `req_${Date.now()}`;
    const newReq: SubscriptionRequest = {
      ...req,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setSubscriptionRequests((prev) => [newReq, ...prev]);
    setDoc(doc(db, 'subscriptionRequests', newId), newReq).catch(console.error);
  };

  const approveSubscriptionRequest = (requestId: string) => {
    const target = subscriptionRequests.find((r) => r.id === requestId);
    if (!target) return;

    updateDoc(doc(db, 'subscriptionRequests', requestId), { status: 'approved' }).catch(console.error);
    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );

    const studentToUpdate = students.find((s) => s.id === target.studentId);
    if (studentToUpdate) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      const updateData = {
        subscription: 'paid' as SubscriptionType,
        subscriptionExpiry: expDate.toISOString(),
      };
      updateDoc(doc(db, 'students', studentToUpdate.id), updateData).catch(console.error);
      setStudents((prev) =>
        prev.map((s) => (s.id === studentToUpdate.id ? { ...s, ...updateData } : s))
      );
      if (currentStudent?.id === studentToUpdate.id) {
        const updated = { ...currentStudent, ...updateData };
        setCurrentStudent(updated);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(updated));
      }
    }
  };

  const rejectSubscriptionRequest = (requestId: string) => {
    updateDoc(doc(db, 'subscriptionRequests', requestId), { status: 'rejected' }).catch(console.error);
    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
  };

  const toggleStudentSubscription = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const newSub: SubscriptionType = student.subscription === 'paid' ? 'free' : 'paid';
    const updateData = {
      subscription: newSub,
      subscriptionExpiry: newSub === 'paid' ? new Date(Date.now() + 30 * 86400000).toISOString() : undefined,
    };
    updateDoc(doc(db, 'students', studentId), updateData).catch(console.error);
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, ...updateData } : s)));
    if (currentStudent?.id === studentId) {
      const updated = { ...currentStudent, ...updateData };
      setCurrentStudent(updated);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(updated));
    }
  };

  const resetStudentPassword = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const newPass = prompt(`أدخل كلمة المرور الجديدة للطالب (${student.fullName}):`, '123456');
    if (!newPass || !newPass.trim()) return;
    updateDoc(doc(db, 'students', studentId), { password: newPass.trim() }).catch(console.error);
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, password: newPass.trim() } : s)));
    alert(`تم تحديث كلمة مرور الطالب إلى: ${newPass.trim()}`);
  };

  const deleteStudent = (studentId: string) => {
    deleteDoc(doc(db, 'students', studentId)).catch(console.error);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (currentStudent?.id === studentId) {
      logout();
    }
  };

  const addQuestion = (q: Omit<Question, 'id'>) => {
    const newId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const questionWithId: Question = { ...q, id: newId };
    setDoc(doc(db, 'questions', newId), questionWithId).catch(console.error);
    setQuestions((prev) => [questionWithId, ...prev]);
  };

  const updateQuestion = (id: string, q: Partial<Question>) => {
    updateDoc(doc(db, 'questions', id), q).catch(console.error);
    setQuestions((prev) =>
      prev.map((item) => (item.id === id ? ({ ...item, ...q } as Question) : item))
    );
  };

  const deleteQuestion = (id: string) => {
    deleteDoc(doc(db, 'questions', id)).catch(console.error);
    setQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  const recordQuizAttempt = (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt_${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setQuizAttempts((prev) => [newAttempt, ...prev]);

    if (currentStudent && currentStudent.id === attempt.studentId) {
      const isPerfect = attempt.percentage === 100;
      const additionalStars = isPerfect ? 5 : attempt.percentage >= 70 ? 3 : 1;
      const updatedStudent: Student = {
        ...currentStudent,
        totalScore: currentStudent.totalScore + attempt.score * 10,
        starsEarned: (currentStudent.starsEarned || 0) + additionalStars,
        completedQuizzesCount: (currentStudent.completedQuizzesCount || 0) + 1,
      };
      setCurrentStudent(updatedStudent);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(updatedStudent));
      updateDoc(doc(db, 'students', currentStudent.id), {
        totalScore: updatedStudent.totalScore,
        starsEarned: updatedStudent.starsEarned,
        completedQuizzesCount: updatedStudent.completedQuizzesCount,
      }).catch(console.error);
    }
  };

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.SOUND, String(next));
      return next;
    });
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
// دالة لتنظيف أي حقول غير معرّفة لمنع توقف الحفظ في Firestore
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
