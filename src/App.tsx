import React, { useState } from 'react';
import { EduProvider, useEdu } from './context/EduContext';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { GradePortal } from './components/GradePortal';
import { AdminPanel } from './components/AdminPanel';
import { StudentAuthModal } from './components/StudentAuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SupportModal } from './components/SupportModal';
import { ZipDownloadModal } from './components/ZipDownloadModal';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { CertificateModal } from './components/CertificateModal';
import { QuestionSearchModal } from './components/QuestionSearchModal';
import { UpgradeModal } from './components/UpgradeModal';
import { GradeId, Subject, Question, CertificateData } from './types/index';
import { playClickSound } from './utils/audio';
import { Heart, Sparkles, Download, ShieldCheck, HelpCircle } from 'lucide-react';

function AppContent() {
  const { currentStudent, isAdmin, subjects } = useEdu();

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Active Quiz State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [activeQuizSubject, setActiveQuizSubject] = useState<Subject | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);

  // Certificate Modal State
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

  // Open Auth with specific grade selected
  const handleSelectGradeFromHero = (gradeId: GradeId) => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  // Launch quiz
  const handleStartQuiz = (subject: Subject, quizQuestions: Question[]) => {
    setActiveQuizSubject(subject);
    setActiveQuizQuestions(quizQuestions);
    setIsQuizModalOpen(true);
  };

  // View Certificate
  const handleViewCertificate = (data: CertificateData) => {
    setCertificateData(data);
    setIsCertificateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Global Header */}
      <Header
        onOpenAuth={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        onOpenZipModal={() => setIsZipModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin ? (
          <AdminPanel />
        ) : currentStudent ? (
          <GradePortal
            onStartQuiz={handleStartQuiz}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />
        ) : (
          <HomeHero
            onSelectGrade={handleSelectGradeFromHero}
            onOpenAuth={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            onOpenAdminLogin={() => setIsAdminModalOpen(true)}
            onOpenZipModal={() => setIsZipModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">منصة المتفوق التعليمية</span>
            <span>•</span>
            <span>المرحلة الابتدائية - جمهورية العراق 🇮🇶</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                playClickSound();
                setIsZipModalOpen(true);
              }}
              className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل المشروع ZIP</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setIsSupportModalOpen(true);
              }}
              className="text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>الدعم الفوري</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setIsAdminModalOpen(true);
              }}
              className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة الأدمن</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <ZipDownloadModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
      />

      {currentStudent && activeQuizSubject && (
        <InteractiveQuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          subject={activeQuizSubject}
          questions={activeQuizQuestions}
          gradeId={currentStudent.gradeId}
          onViewCertificate={handleViewCertificate}
        />
      )}

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        data={certificateData}
      />

      {currentStudent && (
        <QuestionSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          gradeId={currentStudent.gradeId}
          subscription={currentStudent.subscription}
          subjects={subjects}
          onUpgradePrompt={() => {
            setIsSearchModalOpen(false);
            setIsUpgradeModalOpen(true);
          }}
        />
      )}

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <EduProvider>
      <AppContent />
    </EduProvider>
  );
}
