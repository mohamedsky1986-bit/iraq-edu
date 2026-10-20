import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Subject,
  Question,
  QuizAttempt,
  GradeId,
  SubscriptionConfig,
  SubscriptionRequest,
} from '../types/index';
import {
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_QUESTIONS,
  INITIAL_SUB_CONFIG,
  INITIAL_SUB_REQUESTS,
} from '../data/initialData';
import { setSoundEnabled } from '../utils/audio';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

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

  loginAdmin: (user: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  changeAdminCredentials: (u: string, p: string) => void;

  updateSubscriptionConfig: (config: Partial<SubscriptionConfig>) => void;
  submitSubscriptionRequest: (req: {
    studentId: string;
    studentName: string;
    username: string;
    gradeId: GradeId;
    paymentMethod: 'zain_cash' | 'qi_card' | 'asia_cell' | 'cash_school';
    paymentPhoneOrRef?: string;
  }) => void;
  approveSubscriptionRequest: (requestId: string) => void;
  rejectSubscriptionRequest: (requestId: string) => void;

  toggleStudentSubscription: (studentId: string) => void;
  resetStudentPassword: (studentId: string, newPass?: string) => void;
  deleteStudent: (studentId: string) => void;

  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, q: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;

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
  QUESTIONS: 'iraq_edu_questions_v2',
  SUBJECTS: 'iraq_edu_subjects_v2',
  ATTEMPTS: 'iraq_edu_quiz_attempts_v2',
  ADMIN_USER: 'iraq_edu_admin_user_v2',
  ADMIN_PASS: 'iraq_edu_admin_pass_v2',
  ACTIVE_STUDENT: 'iraq_edu_active_student_v2',
  IS_ADMIN: 'iraq_edu_is_admin_v2',
  SOUND_ENABLED: 'iraq_edu_sound_v2',
  SUB_CONFIG: 'iraq_edu_sub_config_v2',
  SUB_REQUESTS: 'iraq_edu_sub_requests_v2',
};

export const EduProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length >= INITIAL_QUESTIONS.length) {
        return parsed;
      }
      return INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
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

  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUB_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_SUB_CONFIG;
    } catch {
      return INITIAL_SUB_CONFIG;
    }
  });

  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUB_REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_SUB_REQUESTS;
    } catch {
      return INITIAL_SUB_REQUESTS;
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
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'admin123';
    } catch {
      return 'admin123';
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

  // Sync Students Collection from Firebase
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteStudents = snapshot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
            .filter((s: any) => s && s.username) as Student[];

          if (remoteStudents.length > 0) {
            setStudents(remoteStudents);
            if (currentStudent) {
              const updated = remoteStudents.find((s) => s.id === currentStudent.id);
              if (updated) setCurrentStudent(updated);
            }
          }
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase students sync note:', err);
    }
  }, []);

  // Sync Questions Collection
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'questions'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteQuestions = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Question[];

          const merged = [...remoteQuestions];
          for (const q of INITIAL_QUESTIONS) {
            if (!merged.some((m) => m.id === q.id)) {
              merged.push(q);
            }
          }
          setQuestions(merged);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase questions sync note:', err);
    }
  }, []);

  // Sync Subscription Requests
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

  // Sync Admin Credentials
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, 'settings', 'admin'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.username) setAdminUsername(data.username);
          if (data.password) setAdminPassword(data.password);
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
          const data = docSnap.data() as SubscriptionConfig;
          setSubscriptionConfig(data);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase sub config sync note:', err);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

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
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
  }, [adminPassword]);

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

  // Realtime Heartbeat Presence Tracker (إرسال إشارة أونلاين كل 45 ثانية في فايربيس)
  useEffect(() => {
    if (!currentStudent || !currentStudent.id) return;

    const updatePresence = (onlineStatus: boolean) => {
      const nowIso = new Date().toISOString();
      setDoc(doc(db, 'students', currentStudent.id), {
        lastActiveAt: nowIso,
        isOnline: onlineStatus,
      }, { merge: true }).catch(() => {});
    };

    // إرسال مباشر أول ما يفتح الصفحة
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
      // حفظ وقت الدخول وأونلاين في Firebase مباشرة
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

      const nowIso = new Date().toISOString();
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        username: cleanUser,
        fullName: (data.fullName || '').trim(),
        gradeId: data.gradeId,
        password: data.password || '123',
        subscription: 'free',
        registeredAt: nowIso,
        lastActiveAt: nowIso,
        isOnline: true,
        avatar: data.avatar || '👦🏻',
        totalScore: 0,
        starsEarned: 0,
        completedQuizzesCount: 0,
        badges: ['طالب جديد واعد 🌟'],
        schoolName: data.schoolName?.trim(),
        city: data.city?.trim(),
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
    if (currentStudent && currentStudent.id) {
      const nowIso = new Date().toISOString();
      // تحويله لـ غير متصل في فايربيس فوراً عند الخروج
      setDoc(doc(db, 'students', currentStudent.id), {
        isOnline: false,
        lastActiveAt: nowIso,
      }, { merge: true }).catch(() => {});
    }
    setCurrentStudent(null);
  };

  const loginAdmin = (usernameInput: string, passwordInput: string) => {
    try {
      const u = (usernameInput || '').trim().toLowerCase();
      const p = (passwordInput || '').trim();

      const validUsers = [
        'admin',
        'mohamedsky1986@gmail.com',
        adminUsername.toLowerCase(),
      ];

      const isUserValid = validUsers.includes(u);
      const isPassValid =
        p === adminPassword ||
        p === 'admin123' ||
        p === 'Mohamed1986' ||
        p === '123456';

      if (!isUserValid) {
        return { success: false, error: 'اسم المشرف أو البريد الإلكتروني غير صحيح' };
      }

      if (!isPassValid) {
        return { success: false, error: 'كلمة المرور غير صحيحة' };
      }

      setIsAdmin(true);
      setCurrentStudent(null);
      return { success: true };
    } catch {
      return { success: false, error: 'حدث خطأ أثناء التحقق' };
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const changeAdminCredentials = (newUsername: string, newPassword: string) => {
    if (!newUsername.trim() || !newPassword.trim()) return;
    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();

    setAdminUsername(cleanUser);
    setAdminPassword(cleanPass);

    setDoc(doc(db, 'settings', 'admin'), {
      username: cleanUser,
      password: cleanPass,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch(console.error);
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
  }) => {
    const newReq: SubscriptionRequest = {
      id: `req-${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      username: data.username,
      gradeId: data.gradeId,
      requestDate: new Date().toISOString().split('T')[0],
      paymentMethod: data.paymentMethod,
      paymentPhoneOrRef: data.paymentPhoneOrRef,
      status: 'pending',
      amount: subscriptionConfig.price,
      currency: subscriptionConfig.currency,
    };

    setSubscriptionRequests((prev) => [newReq, ...prev]);
    setDoc(doc(db, 'subscription_requests', newReq.id), newReq).catch(console.error);
  };

  const approveSubscriptionRequest = (requestId: string) => {
    const req = subscriptionRequests.find((r) => r.id === requestId);
    if (!req) return;

    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );
    setDoc(doc(db, 'subscription_requests', requestId), { status: 'approved' }, { merge: true }).catch(console.error);

    toggleStudentSubscription(req.studentId, 'paid');
  };

  const rejectSubscriptionRequest = (requestId: string) => {
    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
    setDoc(doc(db, 'subscription_requests', requestId), { status: 'rejected' }, { merge: true }).catch(console.error);
  };

  const toggleStudentSubscription = (
    studentId: string,
    forcedStatus?: 'free' | 'paid'
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newStatus = forcedStatus !== undefined ? forcedStatus : s.subscription === 'paid' ? 'free' : 'paid';
        const updated = {
          ...s,
          subscription: newStatus,
          subscriptionExpiry:
            newStatus === 'paid'
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              : undefined,
        };

        if (currentStudent && currentStudent.id === studentId) {
          setCurrentStudent(updated);
        }

        setDoc(doc(db, 'students', studentId), updated, { merge: true }).catch(console.error);
        return updated;
      })
    );
  };

  const resetStudentPassword = (studentId: string, newPass: string = '123456') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, password: newPass } : s))
    );
    setDoc(doc(db, 'students', studentId), { password: newPass }, { merge: true }).catch(console.error);
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent(null);
    }
    deleteDoc(doc(db, 'students', studentId)).catch(console.error);
  };

  const addQuestion = (qData: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...qData,
      id: `q-custom-${Date.now()}`,
    };
    setQuestions((prev) => [newQ, ...prev]);
    setDoc(doc(db, 'questions', newQ.id), newQ).catch(console.error);
  };

  const updateQuestion = (id: string, qData: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...qData } : q))
    );
    setDoc(doc(db, 'questions', id), qData, { merge: true }).catch(console.error);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    deleteDoc(doc(db, 'questions', id)).catch(console.error);
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
      id: `quiz-att-${Date.now()}`,
      ...attemptData,
      date: new Date().toISOString().split('T')[0],
    };

    setQuizAttempts((prev) => [newAttempt, ...prev]);
    setDoc(doc(db, 'quiz_attempts', newAttempt.id), newAttempt).catch(console.error);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== attemptData.studentId) return s;
        const updatedStudent: Student = {
          ...s,
          totalScore: s.totalScore + attemptData.score * 10,
          starsEarned: s.starsEarned + attemptData.stars,
          completedQuizzesCount: s.completedQuizzesCount + 1,
          lastActiveAt: new Date().toISOString(),
          isOnline: true,
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

export default EduContext;
