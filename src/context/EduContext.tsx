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
import { validateAdminCredentials } from '../utils/edu-logic';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
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
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
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

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
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

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'students'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteStudents = snapshot.docs
              .map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
              }))
              .filter((s: any) => s && s.username) as Student[];

            if (remoteStudents.length > 0) {
              setStudents(remoteStudents);

              if (currentStudent) {
                const updatedCurrent = remoteStudents.find((s) => s.id === currentStudent.id);
                if (updatedCurrent) setCurrentStudent(updatedCurrent);
              }
            }
          }
        },
        (error) => {
          console.warn('Firebase students sync error:', error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase initialization note:', err);
    }
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'questions'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteQuestions = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as Question[];
            setQuestions(remoteQuestions);
          }
        },
        (error) => {
          console.warn('Firebase questions sync error:', error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase initialization note:', err);
    }
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'subscription_requests'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteReqs = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as SubscriptionRequest[];
            setSubscriptionRequests(remoteReqs);
          }
        },
        (error) => {
          console.warn('Firebase requests sync error:', error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase initialization note:', err);
    }
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'quiz_attempts'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteAttempts = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as QuizAttempt[];
            setQuizAttempts(remoteAttempts);
          }
        },
        (error) => {
          console.warn('Firebase quiz attempts sync error:', error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase initialization note:', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students.filter((s) => s && s.username)));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
  }, [adminPassword]);

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

      setCurrentStudent(student);
      setIsAdmin(false);
      return { success: true };
    } catch (err: any) {
      console.error('loginStudent error:', err);
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

      setDoc(doc(db, 'students', newStudent.id), newStudent).catch((err) => {
        console.error('Error saving new student to Firebase:', err);
      });

      return { success: true };
    } catch (err: any) {
      console.error('registerStudent error:', err);
      return { success: false, error: err?.message || 'حدث خطأ أثناء التسجيل' };
    }
  };

  const logout = () => {
    setCurrentStudent(null);
  };

  const loginAdmin = (usernameInput: string, passwordInput: string) => {
    const check = validateAdminCredentials(
      usernameInput,
      passwordInput,
      adminUsername,
      adminPassword
    );
    if (check.isValid) {
      setIsAdmin(true);
      setCurrentStudent(null);
      return { success: true };
    }
    return { success: false, error: check.error || 'فشل تسجيل الدخول' };
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const changeAdminCredentials = (newUsername: string, newPassword: string) => {
    if (!newUsername.trim() || newUsername.trim().length < 3) return false;
    if (!newPassword || newPassword.trim().length < 4) return false;

    setAdminUsername(newUsername.trim());
    setAdminPassword(newPassword.trim());
    return true;
  };

  const updateSubscriptionConfig = (updated: Partial<SubscriptionConfig>) => {
    setSubscriptionConfig((prev) => ({
      ...prev,
      ...updated,
    }));
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

    setDoc(doc(db, 'subscription_requests', newReq.id), newReq).catch((err) => {
      console.error('Error saving subscription request to Firebase:', err);
    });

    return newReq;
  };

  const approveSubscriptionRequest = (requestId: string) => {
    const target = subscriptionRequests.find((r) => r.id === requestId);
    if (!target) return;

    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );

    updateDoc(doc(db, 'subscription_requests', requestId), { status: 'approved' }).catch((err) => {
      console.error('Error updating request in Firebase:', err);
    });

    toggleStudentSubscription(target.studentId, 'paid');
  };

  const rejectSubscriptionRequest = (requestId: string) => {
    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );

    updateDoc(doc(db, 'subscription_requests', requestId), { status: 'rejected' }).catch((err) => {
      console.error('Error rejecting request in Firebase:', err);
    });
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

    setDoc(doc(db, 'students', studentId), updated, { merge: true }).catch((err) => {
      console.error('Error updating student subscription in Firebase:', err);
    });
  };

  const resetStudentPassword = (studentId: string, newPass: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, password: newPass } : s))
    );
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent((prev) => (prev ? { ...prev, password: newPass } : null));
    }

    updateDoc(doc(db, 'students', studentId), { password: newPass }).catch((err) => {
      console.error('Error updating password in Firebase:', err);
    });
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent(null);
    }

    deleteDoc(doc(db, 'students', studentId)).catch((err) => {
      console.error('Error deleting student from Firebase:', err);
    });
  };

  const addQuestion = (newQ: Omit<Question, 'id'>) => {
    const questionWithId: Question = {
      ...newQ,
      id: `q-${Date.now()}`,
    };
    setQuestions((prev) => [questionWithId, ...prev]);

    setDoc(doc(db, 'questions', questionWithId.id), questionWithId).catch((err) => {
      console.error('Error adding question to Firebase:', err);
    });
  };

  const updateQuestion = (updatedQ: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
    );

    setDoc(doc(db, 'questions', updatedQ.id), updatedQ, { merge: true }).catch((err) => {
      console.error('Error updating question in Firebase:', err);
    });
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));

    deleteDoc(doc(db, 'questions', questionId)).catch((err) => {
      console.error('Error deleting question from Firebase:', err);
    });
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

    setDoc(doc(db, 'quiz_attempts', newAttempt.id), newAttempt).catch((err) => {
      console.error('Error recording quiz attempt in Firebase:', err);
    });

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

        setDoc(doc(db, 'students', s.id), updatedStudent, { merge: true }).catch((err) => {
          console.error('Error updating student score in Firebase:', err);
        });

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
