import React, { useState, useEffect } from 'react';
import DashboardScreen from './components/DashboardScreen';
import InstructionsScreen from './components/InstructionsScreen';
import ExamInterface from './components/ExamInterface';
import ResultScreen from './components/ResultScreen';
import AIHelpWidget from './components/AIHelpWidget';

// PlacementPro Components
import Dashboard from './components/Dashboard';
import CompaniesList from './components/CompaniesList';
import ResumeBuilder from './components/ResumeBuilder';
import MockTests from './components/MockTests';
import TechnicalPrep from './components/TechnicalPrep';
import ApplicationTracker from './components/ApplicationTracker';
import AdminPanel from './components/AdminPanel';
import HeroFuturistic from './components/ui/hero-futuristic';

import { Question, QuestionStatus, SubjectSection, StudentProfile } from './types';
import { 
  Clock, AlertTriangle, User, Play, Trash2, 
  Compass, Briefcase, History, FileText, ClipboardList, 
  LogOut, Menu, X, ShieldCheck, Building, Bell, 
  TrendingUp, ChevronRight, GraduationCap, Lock, 
  Mail, ArrowRight, BookOpen, Sparkles, CheckCircle, 
  ShieldAlert 
} from 'lucide-react';

type PortalMode = 'NONE' | 'ECET' | 'PLACEMENT';
type ECETScreenState = 'LOGIN' | 'INSTRUCTIONS' | 'EXAM' | 'RESULTS';

export default function App() {
  // Portal Navigation States
  const [portalMode, setPortalMode] = useState<PortalMode>('NONE');
  const [gatewayTab, setGatewayTab] = useState<'ecet' | 'placement'>('ecet');

  // ECET App States
  const [currentScreen, setCurrentScreen] = useState<ECETScreenState>('LOGIN');
  const [candidateName, setCandidateName] = useState(() => {
    try {
      return localStorage.getItem('tg-ecet-candidate-name') || 'Candidate';
    } catch {
      return 'Candidate';
    }
  });
  const [rollNumber, setRollNumber] = useState(() => {
    try {
      return localStorage.getItem('tg-ecet-roll-number') || 'TG-ECET-2026';
    } catch {
      return 'TG-ECET-2026';
    }
  });
  const [examMode, setExamMode] = useState<'MOCK' | 'SUBJECT'>('MOCK');
  const [selectedSubject, setSelectedSubject] = useState<SubjectSection | undefined>(undefined);

  // Saved Session state for active recovery (ECET)
  const [savedSession, setSavedSession] = useState<{
    candidateName: string;
    rollNumber: string;
    selectedAnswers: Record<number, number>;
    questionStatuses: Record<number, QuestionStatus>;
    currentId: number;
    timeLeft: number;
    examMode?: 'MOCK' | 'SUBJECT';
    selectedSubject?: SubjectSection;
  } | null>(null);

  const [restoreSessionData, setRestoreSessionData] = useState<any>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Exam result logs (ECET)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(10800);

  // PlacementPro States
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Auth Inputs (PlacementPro)
  const [placementEmail, setPlacementEmail] = useState('');
  const [placementPassword, setPlacementPassword] = useState('');
  const [placementName, setPlacementName] = useState('');
  const [placementBranch, setPlacementBranch] = useState('Computer Engineering');
  const [placementCollege, setPlacementCollege] = useState('State Government Polytechnic College');
  const [placementPercentage, setPlacementPercentage] = useState('80');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Check for saved session on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tg-ecet-mock-session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.timeLeft > 0) {
          setSavedSession(parsed);
          setShowRestoreModal(true);
        }
      }
    } catch (e) {
      console.error("Failed to read saved session", e);
    }

    // Load placement session if any from localStorage on mount
    const savedRole = localStorage.getItem('placementpro_role');
    const savedUser = localStorage.getItem('placementpro_user');
    const savedPortal = localStorage.getItem('portal_mode') as PortalMode;
    
    if (savedPortal) {
      setPortalMode(savedPortal);
    }
    if (savedRole && savedUser) {
      setUserRole(savedRole as any);
      setCurrentUser(JSON.parse(savedUser));
      setActiveTab(savedRole === 'admin' ? 'analytics' : 'dashboard');
    }
  }, []);

  // Fetch placement notifications
  const fetchNotifications = async (email: string) => {
    try {
      const res = await fetch(`/api/notifications?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (userRole === 'student' && currentUser?.email) {
      fetchNotifications(currentUser.email);
    }
  }, [userRole, currentUser]);

  // ECET Handlers
  const handleUpdateProfile = (name: string, roll: string) => {
    setCandidateName(name);
    setRollNumber(roll);
    try {
      localStorage.setItem('tg-ecet-candidate-name', name);
      localStorage.setItem('tg-ecet-roll-number', roll);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (name: string, roll: string, mode?: 'MOCK' | 'SUBJECT', subject?: SubjectSection) => {
    setCandidateName(name);
    setRollNumber(roll);
    if (mode) {
      setExamMode(mode);
    } else {
      setExamMode('MOCK');
    }
    setSelectedSubject(subject);
    setCurrentScreen('INSTRUCTIONS');
  };

  const handleBeginExam = () => {
    setCurrentScreen('EXAM');
  };

  const handleResume = () => {
    if (savedSession) {
      setCandidateName(savedSession.candidateName);
      setRollNumber(savedSession.rollNumber);
      if (savedSession.examMode) {
        setExamMode(savedSession.examMode);
      }
      if (savedSession.selectedSubject) {
        setSelectedSubject(savedSession.selectedSubject);
      }
      setRestoreSessionData(savedSession);
      setPortalMode('ECET');
      setCurrentScreen('EXAM');
      setShowRestoreModal(false);
    }
  };

  const handleDiscardSavedSession = () => {
    try {
      localStorage.removeItem('tg-ecet-mock-session');
    } catch (e) {
      console.error(e);
    }
    setSavedSession(null);
    setShowRestoreModal(false);
  };

  const handleFinishExam = (
    finalAnswers: Record<number, number>,
    finalStatuses: Record<number, QuestionStatus>,
    allQuestions: Question[],
    secsRemaining: number
  ) => {
    setAnswers(finalAnswers);
    setStatuses(finalStatuses);
    setQuestions(allQuestions);
    setTimeRemaining(secsRemaining);

    try {
      let correctCount = 0;
      const sectionScores: Record<string, number> = {
        'Mathematics': 0,
        'Physics': 0,
        'Chemistry': 0,
        'Computer Science': 0,
        'Electronics & Communication': 0,
        'Electrical & Electronics': 0,
        'Mechanical Engineering': 0,
        'Civil Engineering': 0
      };

      allQuestions.forEach((q) => {
        const userAnswerIndex = finalAnswers[q.id];
        if (userAnswerIndex !== undefined && userAnswerIndex === q.correctOptionIndex) {
          correctCount++;
          if (q.section in sectionScores) {
            sectionScores[q.section]++;
          } else {
            sectionScores[q.section] = 1;
          }
        }
      });

      const totalQs = allQuestions.length || 200;
      const attemptAccuracy = Math.round((correctCount / totalQs) * 100);
      const limitSeconds = examMode === 'SUBJECT' ? 2700 : 10800;
      const timeSpentSecs = limitSeconds - secsRemaining;
      const timeSpentMins = Math.round(timeSpentSecs / 60);

      const isSub = examMode === 'SUBJECT';

      const newAttempt = {
        id: 'attempt-' + Date.now(),
        name: isSub ? `Practice: ${selectedSubject}` : `Real-time Mock Test`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        totalScore: correctCount,
        accuracy: attemptAccuracy,
        timeTakenMinutes: timeSpentMins,
        scores: sectionScores,
        examMode,
        selectedSubject,
        totalQuestions: totalQs
      };

      const savedHistoryStr = localStorage.getItem('tg-ecet-mock-history');
      let currentHistory = [];
      if (savedHistoryStr) {
        currentHistory = JSON.parse(savedHistoryStr);
      } else {
        currentHistory = [
          {
            id: 'mock-1',
            name: 'Practice Mock Test 1',
            date: '3 days ago',
            totalScore: 115,
            accuracy: 58,
            timeTakenMinutes: 142,
            scores: { 'Mathematics': 28, 'Physics': 15, 'Chemistry': 14, 'Computer Science': 58 }
          },
          {
            id: 'mock-2',
            name: 'Practice Mock Test 2',
            date: '2 days ago',
            totalScore: 138,
            accuracy: 69,
            timeTakenMinutes: 165,
            scores: { 'Mathematics': 35, 'Physics': 18, 'Chemistry': 17, 'Computer Science': 68 }
          },
          {
            id: 'mock-3',
            name: 'Practice Mock Test 3',
            date: 'Yesterday',
            totalScore: 154,
            accuracy: 77,
            timeTakenMinutes: 155,
            scores: { 'Mathematics': 39, 'Physics': 21, 'Chemistry': 19, 'Computer Science': 75 }
          }
        ];
      }
      currentHistory.push(newAttempt);
      localStorage.setItem('tg-ecet-mock-history', JSON.stringify(currentHistory));
    } catch (err) {
      console.error("Failed to append test history to dashboard", err);
    }

    try {
      localStorage.removeItem('tg-ecet-mock-session');
    } catch (e) {
      console.error(e);
    }
    setRestoreSessionData(null);
    setSavedSession(null);
    setCurrentScreen('RESULTS');
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem('tg-ecet-mock-session');
    } catch (e) {
      console.error(e);
    }
    setAnswers({});
    setStatuses({});
    setQuestions([]);
    setTimeRemaining(10800);
    setExamMode('MOCK');
    setSelectedSubject(undefined);
    setRestoreSessionData(null);
    setSavedSession(null);
    setCurrentScreen('LOGIN');
  };

  // PlacementPro Handlers
  const handlePlacementLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementEmail || !placementPassword) return;
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: placementEmail, password: placementPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      handleAuthSuccess(data.role, data.user);
    } catch (err: any) {
      setAuthError(err.message || 'Server connection failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePlacementRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementName || !placementEmail || !placementPassword || !placementBranch || !placementCollege || !placementPercentage) {
      setAuthError("Please fill out all mandatory fields.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: placementName, 
          email: placementEmail, 
          password: placementPassword, 
          branch: placementBranch, 
          college: placementCollege, 
          percentage: Number(placementPercentage) 
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      setAuthSuccessMsg("Registration successful! Logging you in...");
      setTimeout(() => {
        handleAuthSuccess(data.role, data.user);
      }, 1500);
    } catch (err: any) {
      setAuthError(err.message || 'Server connection failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePlacementForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementEmail) return;
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: placementEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuthSuccessMsg(data.message || "A secure reset link has been dispatched to your email address.");
      setTimeout(() => {
        setAuthSuccessMsg(null);
        setAuthMode('login');
      }, 4000);
    } catch (err: any) {
      setAuthError(err.message || 'Forgot password failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleBypassLogin = async (role: 'student' | 'admin') => {
    setAuthLoading(true);
    setAuthError(null);
    const bypassEmail = role === 'student' ? 'student@placementpro.in' : 'admin@placementpro.in';
    const bypassPassword = role === 'student' ? 'password' : 'admin';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: bypassEmail, password: bypassPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      handleAuthSuccess(data.role, data.user);
    } catch (err: any) {
      setAuthError(err.message || 'Bypass failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSuccess = (role: 'student' | 'admin', user: any) => {
    setUserRole(role);
    setCurrentUser(user);
    setPortalMode('PLACEMENT');
    localStorage.setItem('portal_mode', 'PLACEMENT');
    localStorage.setItem('placementpro_role', role);
    localStorage.setItem('placementpro_user', JSON.stringify(user));
    setActiveTab(role === 'student' ? 'dashboard' : 'analytics');
    
    // Clear auth fields
    setPlacementEmail('');
    setPlacementPassword('');
    setPlacementName('');
    setAuthError(null);
    setAuthSuccessMsg(null);
  };

  const handlePlacementLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setPortalMode('NONE');
    localStorage.removeItem('portal_mode');
    localStorage.removeItem('placementpro_role');
    localStorage.removeItem('placementpro_user');
    setActiveTab('dashboard');
  };

  const refreshStudentProfile = async () => {
    if (userRole !== 'student' || !currentUser?.email) return;
    try {
      const res = await fetch(`/api/student/profile?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        localStorage.setItem('placementpro_user', JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotificationsRead = async () => {
    if (!currentUser?.email) return;
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Exit from a portal to the gateway
  const handleExitToGateway = () => {
    setPortalMode('NONE');
    localStorage.removeItem('portal_mode');
  };

  // Switch to TG-ECET Companion Hub directly on Gateway
  const handleLaunchECET = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;
    handleUpdateProfile(candidateName, rollNumber);
    setPortalMode('ECET');
    localStorage.setItem('portal_mode', 'ECET');
    setCurrentScreen('LOGIN');
  };

  // Convert seconds to readable format
  const getReadableTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard Hub', icon: Compass },
    { id: 'companies', label: 'Job Openings', icon: Building },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'mock-tests', label: 'Mock Test Exams', icon: ClipboardList },
    { id: 'technical-prep', label: 'Study Library', icon: BookOpen },
    { id: 'applications', label: 'Application Pipeline', icon: History }
  ];

  const BRANCHES = [
    "Computer Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      
      {/* ----------------------------------------------------
          UNIFIED TOP PORTAL CONTROL HEADER
          ---------------------------------------------------- */}
      {portalMode !== 'NONE' && (
        <div className="bg-[#1e1b4b] text-white text-[11px] px-6 py-3 flex flex-col sm:flex-row justify-between items-center border-b border-indigo-950/80 gap-3 shadow-md z-40 relative no-print">
          <div className="flex items-center space-x-3">
            <span className="bg-amber-500 text-slate-905 font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
              {portalMode === 'ECET' ? 'TG-ECET Portal Active' : 'PlacementPro Portal Active'}
            </span>
            <span className="font-semibold text-slate-300">
              Logged User: <strong className="text-white text-xs font-black">{portalMode === 'ECET' ? candidateName : currentUser?.name}</strong> • {portalMode === 'ECET' ? `Hall Ticket: ${rollNumber}` : `Branch: ${currentUser?.branch}`}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleExitToGateway}
              className="bg-indigo-900/60 hover:bg-indigo-800 hover:text-white text-indigo-200 border border-indigo-700/50 text-[10px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 uppercase tracking-wider active:scale-97"
              id="btn-return-gateway"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Gateway Home</span>
            </button>
            
            <button 
              onClick={portalMode === 'ECET' ? handleExitToGateway : handlePlacementLogout}
              className="bg-red-950/40 hover:bg-red-900 text-red-250 border border-red-800/40 text-[10px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 uppercase tracking-wider active:scale-97"
              id="btn-portal-exit"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          GATEWAY HOME & LOGIN LANDING SCREEN
          ---------------------------------------------------- */}
      {/* ----------------------------------------------------
          GATEWAY HOME & LOGIN LANDING SCREEN
          ---------------------------------------------------- */}
      {portalMode === 'NONE' && (
        <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 select-text" id="gateway-landing">
          {/* Futuristic Interactive Scanning Hero Section */}
          <HeroFuturistic 
            title="Academic & Career Hub" 
            subtitle="The ultimate unified companion for Telangana Polytechnic candidates. Seamlessly prepare for TG-ECET or unlock premium core campus placements."
            onExploreClick={() => {
              const el = document.getElementById('gateway-auth-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Core Content Area */}
          <div className="max-w-7xl mx-auto w-full py-16 px-6 sm:px-8" id="gateway-auth-section">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Side: Dynamic Informative Vibe */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                    <span>State Integrated Platform</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-serif font-black leading-tight tracking-tight text-slate-900">
                    Your Gateway to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">
                      Top Ranks & Core Careers
                    </span>
                  </h2>
                  
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold max-w-xl">
                    Whether your goal is to secure a state top-rank for direct B.Tech lateral entry or crack a premier core company recruitment drive, this custom-engineered platform provides precise tools for diploma holders.
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* TG-ECET Column */}
                  <div className="p-6 bg-white border border-slate-200 hover:border-indigo-200 rounded-3xl space-y-3 shadow-2xs hover:shadow-sm transition-all duration-300">
                    <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">TG-ECET 2026 Simulator</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      Simulate real 200-mark mock exams, practice topic questions, view previous cutoffs, and track subject-wise progress.
                    </p>
                  </div>

                  {/* PlacementPro Column */}
                  <div className="p-6 bg-white border border-slate-200 hover:border-indigo-200 rounded-3xl space-y-3 shadow-2xs hover:shadow-sm transition-all duration-300">
                    <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-2xl">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">PlacementPro Core Drives</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      Build professional ATS resumes, attempt core engineering mock interviews, and apply to premium corporate hiring pipelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gateway Unified Authentication Card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-500"></div>
                
                {/* Portal Mode Switcher Tabs */}
                <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-2xl mb-8 font-extrabold text-xs">
                  <button
                    onClick={() => { setGatewayTab('ecet'); setAuthError(null); setAuthSuccessMsg(null); }}
                    className={`flex-1 py-3 px-2 rounded-xl text-center font-extrabold uppercase tracking-wider transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer ${
                      gatewayTab === 'ecet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>TG-ECET Prep</span>
                  </button>
                  <button
                    onClick={() => { setGatewayTab('placement'); setAuthError(null); setAuthSuccessMsg(null); }}
                    className={`flex-1 py-3 px-2 rounded-xl text-center font-extrabold uppercase tracking-wider transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer ${
                      gatewayTab === 'placement' ? 'bg-amber-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>PlacementPro</span>
                  </button>
                </div>

                {/* 1. TG-ECET LOGIN CARD FORM */}
                {gatewayTab === 'ecet' && (
                  <form onSubmit={handleLaunchECET} className="space-y-5 animate-fade-in text-left">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black tracking-tight flex items-center space-x-2 text-slate-900">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                        <span>TG-ECET Exam Companion</span>
                      </h2>
                      <p className="text-xs text-slate-500 font-semibold">Enter your mock credentials to launch the testing center.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Candidate Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="E.g., Sai Kiran Reddy"
                            value={candidateName === 'Candidate' ? '' : candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-bold"
                            id="input-candidate-name"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Hall Ticket / Roll Number</label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="E.g., TS2026-CSE104"
                            value={rollNumber === 'TG-ECET-2026' ? '' : rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono font-bold"
                            id="input-roll-number"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-indigo-650/20 active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer mt-4"
                      id="btn-ecet-submit"
                    >
                      <span>Launch Companion Hub</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-[11px] text-indigo-700 leading-relaxed font-semibold">
                      💡 <strong>Lateral Entry note:</strong> Logging in lets you attempt both the comprehensive 200-mark mock examinations as well as targeted subject drills across Mathematics, Physics, Chemistry, and CSE topics.
                    </div>
                  </form>
                )}

                {/* 2. PLACEMENTPRO LOGIN CARD FORM */}
                {gatewayTab === 'placement' && (
                  <div className="space-y-5 animate-fade-in text-left">
                    
                    {/* Title */}
                    <div className="space-y-1">
                      <h2 className="text-lg font-black tracking-tight flex items-center space-x-2 text-slate-900">
                        <Briefcase className="h-5 w-5 text-amber-600" />
                        <span>PlacementPro Portal</span>
                      </h2>
                      <p className="text-xs text-slate-500 font-semibold">
                        {authMode === 'login' ? 'Access student profiles, company drives, & resumes.' : authMode === 'register' ? 'Register a new polytechnic student account.' : 'Request secure password reset link.'}
                      </p>
                    </div>

                    {authError && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-600 flex items-center space-x-2 font-semibold">
                        <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {authSuccessMsg && (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-600 flex items-center space-x-2 font-semibold">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                        <span>{authSuccessMsg}</span>
                      </div>
                    )}

                    {/* FORM FIELDS BASED ON MODE */}
                    {authMode === 'login' && (
                      <form onSubmit={handlePlacementLogin} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              type="email"
                              required
                              placeholder="E.g., student@placementpro.in"
                              value={placementEmail}
                              onChange={(e) => setPlacementEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-bold"
                              id="input-placement-email"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Security Password</label>
                            <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] text-amber-600 hover:underline">Forgot?</button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              type="password"
                              required
                              placeholder="Password or passcode"
                              value={placementPassword}
                              onChange={(e) => setPlacementPassword(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-bold"
                              id="input-placement-password"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
                          id="btn-placement-login-submit"
                        >
                          <span>{authLoading ? 'Signing in...' : 'Sign In to Portal'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    )}

                    {authMode === 'register' && (
                      <form onSubmit={handlePlacementRegister} className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-bold">Full Student Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Sai Kumar Reddy"
                            value={placementName}
                            onChange={(e) => setPlacementName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:border-amber-500 focus:bg-white text-slate-800 font-bold"
                            id="reg-name"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-bold">Email Address</label>
                            <input
                              type="email"
                              required
                              placeholder="sai@email.com"
                              value={placementEmail}
                              onChange={(e) => setPlacementEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:border-amber-500 focus:bg-white text-slate-800 font-bold"
                              id="reg-email"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-bold">Password</label>
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={placementPassword}
                              onChange={(e) => setPlacementPassword(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:border-amber-500 focus:bg-white text-slate-800 font-bold"
                              id="reg-password"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-bold">College Name</label>
                          <input
                            type="text"
                            required
                            value={placementCollege}
                            onChange={(e) => setPlacementCollege(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:border-amber-500 focus:bg-white text-slate-800 font-bold"
                            id="reg-college"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-bold">Diploma Branch</label>
                            <select
                              value={placementBranch}
                              onChange={(e) => setPlacementBranch(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:border-amber-500 focus:bg-white text-slate-800 font-bold cursor-pointer"
                              id="reg-branch"
                            >
                              {BRANCHES.map(b => (
                                <option key={b} value={b} className="bg-white text-slate-800">{b}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-bold">Cumulative %</label>
                            <input
                              type="number"
                              required
                              min="40"
                              max="100"
                              placeholder="78"
                              value={placementPercentage}
                              onChange={(e) => setPlacementPercentage(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:border-amber-500 focus:bg-white text-slate-800 font-bold"
                              id="reg-percentage"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition mt-3 cursor-pointer"
                          id="btn-register-submit"
                        >
                          {authLoading ? 'Registering...' : 'Register Profile'}
                        </button>
                      </form>
                    )}

                    {authMode === 'forgot' && (
                      <form onSubmit={handlePlacementForgot} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="E.g., student@placementpro.in"
                            value={placementEmail}
                            onChange={(e) => setPlacementEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:border-amber-500 focus:bg-white text-slate-800 font-bold"
                            id="forgot-email"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                          id="btn-forgot-submit"
                        >
                          Reset Password
                        </button>
                      </form>
                    )}

                    {/* Mode Swappers Links */}
                    <div className="text-center pt-2">
                      {authMode === 'login' && (
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Don't have a profile?{' '}
                          <button onClick={() => setAuthMode('register')} className="text-amber-600 font-extrabold hover:underline">Register Profile</button>
                        </p>
                      )}
                      {authMode !== 'login' && (
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Already have an account?{' '}
                          <button onClick={() => setAuthMode('login')} className="text-amber-600 font-extrabold hover:underline">Login here</button>
                        </p>
                      )}
                    </div>

                    {/* EVALUATOR BYPASS PANEL */}
                    <div className="border-t border-slate-200 pt-5 space-y-3">
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block text-center">
                        ⚡ Quick Evaluation Bypass (Evaluators Only)
                      </span>
                      <button
                        onClick={() => handleBypassLogin('student')}
                        className="w-full p-2.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 text-[10px] font-extrabold rounded-xl transition cursor-pointer text-center uppercase tracking-wider block"
                        id="btn-bypass-student"
                      >
                        Login as Student
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          ACTIVE PORTAL: TG-ECET ENGINE WRAPPER
          ---------------------------------------------------- */}
      {portalMode === 'ECET' && (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
          {currentScreen === 'LOGIN' && (
            <DashboardScreen 
              onStartExam={handleLogin}
              candidateName={candidateName}
              rollNumber={rollNumber}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {currentScreen === 'INSTRUCTIONS' && (
            <InstructionsScreen
              candidateName={candidateName}
              rollNumber={rollNumber}
              onBegin={handleBeginExam}
              examMode={examMode}
              selectedSubject={selectedSubject}
              onHome={() => setCurrentScreen('LOGIN')}
            />
          )}

          {currentScreen === 'EXAM' && (
            <ExamInterface
              candidateName={candidateName}
              rollNumber={rollNumber}
              onFinishExam={handleFinishExam}
              initialAnswers={restoreSessionData?.selectedAnswers}
              initialStatuses={restoreSessionData?.questionStatuses}
              initialCurrentId={restoreSessionData?.currentId}
              initialTimeLeft={restoreSessionData?.timeLeft}
              examMode={examMode}
              selectedSubject={selectedSubject}
            />
          )}

          {currentScreen === 'RESULTS' && (
            <ResultScreen
              candidateName={candidateName}
              rollNumber={rollNumber}
              answers={answers}
              statuses={statuses}
              questions={questions}
              timeRemainingSeconds={timeRemaining}
              onRestart={handleRestart}
            />
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          ACTIVE PORTAL: PLACEMENTPRO ENGINE WRAPPER
          ---------------------------------------------------- */}
      {portalMode === 'PLACEMENT' && (
        <div className="flex-1 flex flex-col bg-[#faf9f6] text-[#2c2a29]">
          
          {/* Inner Header with Alert Feeds Bell */}
          <header className="border-b border-[#e5e3da] bg-white sticky top-0 z-35 px-6 py-4 shadow-2xs no-print">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Logo Brand */}
              <div 
                onClick={() => setActiveTab(userRole === 'admin' ? 'analytics' : 'dashboard')}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                  <ShieldCheck className="h-5 w-5 stroke-[2]" />
                </div>
                <div className="text-left">
                  <h1 className="text-lg font-serif font-black tracking-tight text-[#1c1a19]">PlacementPro</h1>
                  <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Diploma Placement Companion</p>
                </div>
              </div>

              {/* Authenticated Controls */}
              <div className="flex items-center gap-4">
                
                {/* Notification Bell */}
                {userRole === 'student' && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications) handleMarkNotificationsRead();
                      }}
                      className="p-2 hover:bg-slate-50 border border-[#e8e6dd] rounded-xl text-[#5c5650] relative transition cursor-pointer"
                      id="notifications-bell-btn"
                    >
                      <Bell className="h-4.5 w-4.5" />
                      {notifications.some(n => !n.read) && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                      )}
                    </button>

                    {/* Dropdown Drawer */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-3 w-80 bg-white border border-[#e8e6dd] rounded-3xl p-4 shadow-xl z-50 space-y-3" id="notifications-dropdown">
                        <div className="flex justify-between items-center border-b border-[#f1efe8] pb-2">
                          <span className="text-xs font-bold text-[#1c1a19]">Placement Alert Feeds</span>
                          <button onClick={() => setShowNotifications(false)} className="text-[10px] text-[#8c857e] hover:underline cursor-pointer">Close</button>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-3 rounded-2xl text-[11px] leading-relaxed border transition text-left ${
                                n.read ? 'bg-slate-50 border-[#efede6]' : 'bg-blue-50/50 border-blue-100 font-medium'
                              }`}
                            >
                              <p className="text-[#2c2a29] font-medium">{n.content || n.text}</p>
                              <span className="text-[9px] text-[#a29b93] font-mono block mt-1">{n.date}</span>
                            </div>
                          ))}

                          {notifications.length === 0 && (
                            <p className="text-xs text-[#a29b93] italic text-center py-4">No placement alerts received.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* User Card Label */}
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#1c1a19]">{currentUser?.name}</span>
                  <span className="text-[9px] uppercase font-bold text-[#8c857e] tracking-wider">
                    {userRole === 'admin' ? 'TPO Director' : currentUser?.branch}
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handlePlacementLogout}
                  className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 rounded-xl transition flex items-center justify-center cursor-pointer"
                  title="Log out of session"
                  id="header-logout-btn"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>

                {/* Mobile Menu Hamburger */}
                {userRole === 'student' && (
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="sm:hidden p-2 hover:bg-slate-50 border border-[#e8e6dd] rounded-xl cursor-pointer"
                  >
                    {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                  </button>
                )}

              </div>
            </div>
          </header>

          {/* Mobile Sidebar overlay */}
          {userRole === 'student' && isMobileMenuOpen && (
            <div className="sm:hidden fixed inset-0 top-[73px] bg-white z-30 p-6 space-y-4 shadow-lg border-b border-[#e5e3da] animate-slide-down no-print">
              <div className="space-y-1.5 text-left">
                {studentNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 text-xs font-bold transition cursor-pointer ${
                        activeTab === item.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-50 border border-[#e8e6dd] text-[#5c5650]'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Placement Main Column Workspace Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full text-left">
            {userRole === 'admin' ? (
              <AdminPanel adminEmail={currentUser?.email} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
                
                {/* Desktop Left Sidebar navigation */}
                <div className="hidden sm:block sm:col-span-3 space-y-3 sticky top-24 no-print">
                  <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c857e]">Polytechnic Workspace</span>
                    <div className="h-px bg-[#efede6] my-1"></div>
                    <div className="space-y-1.5">
                      {studentNavItems.map((item) => {
                        const Icon = item.icon;
                        const isSelected = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-blue-600 text-white shadow-xs' 
                                : 'bg-white hover:bg-slate-50 border border-transparent text-[#5c5650]'
                            }`}
                            id={`sidebar-tab-${item.id}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="h-4.5 w-4.5 stroke-[1.5]" />
                              <span>{item.label}</span>
                            </div>
                            {isSelected && <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Simple sidebar summary card */}
                  <div className="p-5 bg-white border border-[#e8e6dd] rounded-3xl space-y-2 text-left">
                    <div className="text-[9px] uppercase font-bold text-[#8c857e]">Syllabus matching:</div>
                    <p className="text-[11px] text-[#5c5650] leading-relaxed font-semibold">
                      Your branch is configured as <strong>{currentUser?.branch}</strong>. Tests and recommendations target this curriculum.
                    </p>
                  </div>
                </div>

                {/* Right Workspace Column */}
                <div className="col-span-1 sm:col-span-9" id="active-workspace-canvas">
                  {activeTab === 'dashboard' && (
                    <Dashboard 
                      student={currentUser} 
                      onNavigate={(tab) => setActiveTab(tab)} 
                    />
                  )}

                  {activeTab === 'companies' && (
                    <CompaniesList 
                      student={currentUser} 
                      onApplySuccess={refreshStudentProfile} 
                    />
                  )}

                  {activeTab === 'resume-builder' && (
                    <ResumeBuilder 
                      student={currentUser} 
                      onSaveSuccess={refreshStudentProfile} 
                    />
                  )}

                  {activeTab === 'mock-tests' && (
                    <MockTests 
                      student={currentUser} 
                      onTestSubmitSuccess={refreshStudentProfile} 
                    />
                  )}

                  {activeTab === 'technical-prep' && (
                    <TechnicalPrep 
                      student={currentUser} 
                    />
                  )}

                  {activeTab === 'applications' && (
                    <ApplicationTracker 
                      student={currentUser} 
                    />
                  )}
                </div>

              </div>
            )}
          </main>

          {/* Inner Placement Footer */}
          <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#e5e3da] mt-16 text-center text-xs text-[#a29b93] space-y-2 no-print w-full">
            <p>© 2026 PlacementPro. Dedicated Placement Companion exclusively for Polytechnic Engineering candidates.</p>
            <p className="font-mono text-[9px] opacity-85">Full-Stack Mode • Integrated Express JSON Store • Port: 3000</p>
          </footer>

        </div>
      )}

      {/* ----------------------------------------------------
          ACTIVE EXAMINATION RECOVERY RESTORE MODAL (ECET)
          ---------------------------------------------------- */}
      {showRestoreModal && savedSession && (
        <div className="fixed inset-0 bg-slate-900/75 z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transition-all transform scale-100 text-left">
            <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 text-center font-bold tracking-wide uppercase text-sm flex items-center justify-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-white animate-bounce" />
              <span>Unfinished Session Detected</span>
            </header>

            <div className="p-6 space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed">
              <p className="font-semibold text-slate-800 text-center">
                We found an active, auto-saved exam attempt under your profile. Would you like to resume?
              </p>

              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3 font-semibold text-slate-700">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-slate-900">
                  <User className="h-4.5 w-4.5 text-orange-500" />
                  <span className="font-bold uppercase tracking-wide">
                    {savedSession.candidateName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Hall Ticket</span>
                    <span className="font-mono text-slate-800 font-bold">{savedSession.rollNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Time Left</span>
                    <span className="font-mono text-orange-600 font-extrabold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 inline shrink-0" />
                      <span>{getReadableTime(savedSession.timeLeft)}</span>
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-slate-100 pt-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Answered Progress</span>
                    <span className="text-slate-800 font-extrabold text-sm font-mono">
                      {Object.keys(savedSession.selectedAnswers).length} / 200 Questions Completed
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-red-500 font-bold text-center text-xs">
                Caution: If you choose to discard this session, the system will permanently wipe your answers and start a new test!
              </p>
            </div>

            <footer className="bg-slate-100 border-t border-slate-200 p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-end">
              <button
                onClick={handleDiscardSavedSession}
                className="bg-white hover:bg-slate-50 text-red-650 border border-slate-300 px-4 py-2.5 rounded font-bold text-xs select-none cursor-pointer uppercase tracking-wider active:scale-97 flex items-center justify-center space-x-1.5"
                id="btn-discard"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Discard Session</span>
              </button>
              <button
                onClick={handleResume}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded font-bold text-xs select-none cursor-pointer uppercase tracking-wider active:scale-97 shadow flex items-center justify-center space-x-1.5"
                id="btn-resume"
              >
                <Play className="w-4.5 h-4.5 fill-current text-white animate-pulse" />
                <span>Resume Attempt</span>
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Global AI Tutor Widget overlay */}
      <AIHelpWidget />
    </div>
  );
}
