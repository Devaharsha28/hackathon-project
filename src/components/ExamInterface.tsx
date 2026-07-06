import React, { useState, useEffect, useRef } from 'react';
import { Question, QuestionStatus, SubjectSection } from '../types';
import { generateFull200Questions, generateSubjectQuestions, getSectionForId, getQuestionNumberWithinSection } from '../data/questions';
import MathFormula from './MathFormula';
import { 
  Award, Clock, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, 
  BookOpen, Eye, Info, ListOrdered, CheckCircle, RotateCcw, Zap, Flame
} from 'lucide-react';

interface ExamInterfaceProps {
  candidateName: string;
  rollNumber: string;
  onFinishExam: (answers: Record<number, number>, statuses: Record<number, QuestionStatus>, questions: Question[], timeRemaining: number) => void;
  initialAnswers?: Record<number, number>;
  initialStatuses?: Record<number, QuestionStatus>;
  initialCurrentId?: number;
  initialTimeLeft?: number;
  examMode: 'MOCK' | 'SUBJECT';
  selectedSubject?: SubjectSection;
}

export default function ExamInterface({ 
  candidateName, 
  rollNumber, 
  onFinishExam,
  initialAnswers,
  initialStatuses,
  initialCurrentId,
  initialTimeLeft,
  examMode,
  selectedSubject
}: ExamInterfaceProps) {
  // Load questions
  const [questions] = useState<Question[]>(() => {
    if (examMode === 'SUBJECT' && selectedSubject) {
      return generateSubjectQuestions(selectedSubject);
    }
    return generateFull200Questions(selectedSubject);
  });

  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem('tg-ecet-mock-notes') || '';
    } catch {
      return '';
    }
  });

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    try {
      localStorage.setItem('tg-ecet-mock-notes', val);
    } catch (err) {
      console.error(err);
    }
  };
  
  // State for exam core
  const [currentId, setCurrentId] = useState<number>(initialCurrentId || 1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(initialAnswers || {});
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionStatus>>(() => {
    if (initialStatuses) return initialStatuses;
    const initial: Record<number, QuestionStatus> = {};
    const totalQs = examMode === 'SUBJECT' ? 50 : 200;
    for (let i = 1; i <= totalQs; i++) {
      initial[i] = 'NOT_VISITED';
    }
    // Question 1 is immediately active and visited
    initial[1] = 'NOT_ANSWERED';
    return initial;
  });

  // Modals status
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Focus Mode / Grind Mode State
  const [focusMode, setFocusMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tg-ecet-focus-mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleFocusMode = () => {
    setFocusMode((prev) => {
      const newVal = !prev;
      try {
        localStorage.setItem('tg-ecet-focus-mode', String(newVal));
      } catch (e) {
        console.error(e);
      }
      return newVal;
    });
  };

  // Timer: 180 minutes = 10800 seconds, 45 minutes for subject practice = 2700 seconds
  const defaultTime = examMode === 'SUBJECT' ? 2700 : 10800;
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft !== undefined ? initialTimeLeft : defaultTime);
  const isTimeCritical = timeLeft < 600; // < 10 mins

  // Keep track of the last saved answers/statuses JSON serialization to avoid redundant disk I/O on every clock tick
  const lastSavedJsonRef = useRef<string>('');

  // Auto-save session state to local storage on changes
  useEffect(() => {
    // Only update local storage for time change when it is a multiple of 5, or critical last 15 seconds
    const isTimeInterval = timeLeft % 5 === 0 || timeLeft <= 15;
    
    const stateObj = {
      candidateName,
      rollNumber,
      selectedAnswers,
      questionStatuses,
      currentId
    };
    const stateJson = JSON.stringify(stateObj);
    const stateChanged = stateJson !== lastSavedJsonRef.current;

    // Save immediately if answers or questions changed. Otherwise, save only at 5 second intervals to keep UI lag-free
    if (stateChanged || isTimeInterval) {
      try {
        const sessionData = {
          ...stateObj,
          timeLeft
        };
        localStorage.setItem('tg-ecet-mock-session', JSON.stringify(sessionData));
        if (stateChanged) {
          lastSavedJsonRef.current = stateJson;
        }
      } catch (e) {
        console.error("Local storage auto-save failed", e);
      }
    }
  }, [candidateName, rollNumber, selectedAnswers, questionStatuses, currentId, timeLeft]);

  // Reference for previous question to manage visited states properly
  const previousIdRef = useRef<number>(1);

  // Countdown timer logic optimized with Absolute Epoch Times to prevent JS interval drift and slowdown
  useEffect(() => {
    const startTimeStamp = Date.now();
    const durationMs = (initialTimeLeft !== undefined ? initialTimeLeft : (examMode === 'SUBJECT' ? 2700 : 10800)) * 1000;
    const targetEndTime = startTimeStamp + durationMs;

    const timer = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(timer);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTimeLeft]);

  // Update status when changing questions
  const handleQuestionChange = (nextId: number) => {
    const prevId = currentId;
    
    setQuestionStatuses((prev) => {
      const updated = { ...prev };
      
      // If we are leaving the previous question and its status was NOT_VISITED, it becomes NOT_ANSWERED
      if (updated[prevId] === 'NOT_VISITED') {
        updated[prevId] = 'NOT_ANSWERED';
      }
      
      // The target question we are moving to, if NOT_VISITED, becomes NOT_ANSWERED
      if (updated[nextId] === 'NOT_VISITED') {
        updated[nextId] = 'NOT_ANSWERED';
      }
      
      return updated;
    });

    setCurrentId(nextId);
  };

  const handleAutoSubmit = () => {
    try {
      localStorage.removeItem('tg-ecet-mock-session');
    } catch (e) {
      console.error(e);
    }
    onFinishExam(selectedAnswers, questionStatuses, questions, 0);
  };

  // Active question and options details
  const activeQuestion = questions.find((q) => q.id === currentId) || questions[0];
  const activeSection = activeQuestion.section;
  
  // Format seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Answer selections
  const handleSelectOption = (index: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentId]: index,
    }));
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentId];
      return copy;
    });
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentId]: 'NOT_ANSWERED',
    }));
  };

  const handleSaveAndNext = () => {
    const hasSelection = selectedAnswers[currentId] !== undefined;
    
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentId]: hasSelection ? 'ANSWERED' : 'NOT_ANSWERED',
    }));

    if (currentId < questions.length) {
      handleQuestionChange(currentId + 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    const hasSelection = selectedAnswers[currentId] !== undefined;

    setQuestionStatuses((prev) => ({
      ...prev,
      [currentId]: hasSelection ? 'ANSWERED_AND_MARKED_FOR_REVIEW' : 'MARKED_FOR_REVIEW',
    }));

    if (currentId < questions.length) {
      handleQuestionChange(currentId + 1);
    }
  };

  // Section Tab Clicking
  const handleSectionTabClick = (section: SubjectSection) => {
    if (examMode === 'SUBJECT') {
      handleQuestionChange(1);
      return;
    }
    // Jump to the very first question of that section
    let targetId = 1;
    if (section === 'Physics') targetId = 51;
    if (section === 'Chemistry') targetId = 76;
    if (section === 'Computer Science') targetId = 101;
    handleQuestionChange(targetId);
  };

  // Palette counts helper
  const getPaletteCounts = () => {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let markedReview = 0;
    let answeredMarkedReview = 0;

    Object.values(questionStatuses).forEach((status) => {
      if (status === 'ANSWERED') answered++;
      else if (status === 'NOT_ANSWERED') notAnswered++;
      else if (status === 'NOT_VISITED') notVisited++;
      else if (status === 'MARKED_FOR_REVIEW') markedReview++;
      else if (status === 'ANSWERED_AND_MARKED_FOR_REVIEW') answeredMarkedReview++;
    });

    return { answered, notAnswered, notVisited, markedReview, answeredMarkedReview };
  };

  const counts = getPaletteCounts();

  // Final submission trigger from modal confirmation
  const handleFinalSubmit = () => {
    try {
      localStorage.removeItem('tg-ecet-mock-session');
    } catch (e) {
      console.error(e);
    }
    onFinishExam(selectedAnswers, questionStatuses, questions, timeLeft);
  };

  // Keyboard shortcuts listener for Grind Mode
  useEffect(() => {
    if (!focusMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in notes scratchpad or any form element
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key;

      // 1-4 to select option index 0-3
      if (key === '1' || key === '2' || key === '3' || key === '4') {
        const optionIndex = parseInt(key) - 1;
        if (activeQuestion.options[optionIndex] !== undefined) {
          handleSelectOption(optionIndex);
        }
      }

      // Left arrow to go previous
      if (key === 'ArrowLeft') {
        if (currentId > 1) {
          handleQuestionChange(currentId - 1);
        }
      }

      // Right arrow to go next
      if (key === 'ArrowRight') {
        if (currentId < questions.length) {
          handleQuestionChange(currentId + 1);
        }
      }

      // Space to save and next
      if (key === ' ' || key === 'Spacebar') {
        e.preventDefault(); // prevent page scroll
        handleSaveAndNext();
      }

      // 'm' or 'r' to mark for review and next
      if (key.toLowerCase() === 'm' || key.toLowerCase() === 'r') {
        handleMarkForReviewAndNext();
      }

      // 'c' to clear response
      if (key.toLowerCase() === 'c') {
        handleClearResponse();
      }

      // Escape to exit focus mode
      if (key === 'Escape') {
        setFocusMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, currentId, selectedAnswers, questions, activeQuestion]);

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none transition-colors duration-300 ${focusMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} id="exam-portal">
      {/* Premium Minimal Header */}
      {!focusMode && (
        <header className="bg-white border-b border-slate-150 px-6 py-4 flex justify-between items-center flex-none">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase">
                TG ECET MOCK PORTAL
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Grind Mode Toggle */}
            <button
              onClick={toggleFocusMode}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-750 cursor-pointer active:scale-95 transition"
              title="Minimize distractions & enter dark focus mode"
            >
              <Zap className="h-3.5 w-3.5 fill-orange-500 text-orange-500 animate-pulse shrink-0" />
              <span>Grind Mode</span>
            </button>

            <div className="flex items-center text-xs space-x-1.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
              <Clock className={`h-4 w-4 ${isTimeCritical ? 'text-red-500 animate-pulse' : 'text-slate-550'}`} />
              <span className="font-bold text-slate-400">Time Left:</span>
              <span className={`font-mono font-bold text-sm ${isTimeCritical ? 'text-red-650' : 'text-slate-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button 
              onClick={() => setShowSubmitModal(true)}
              className="bg-slate-900 hover:bg-slate-800 font-bold px-4 py-2 text-xs text-white rounded-lg transition active:scale-95 cursor-pointer uppercase flex items-center space-x-1.5 shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Submit Exam</span>
            </button>
          </div>
        </header>
      )}

      {/* Modern Minimal Candidate Profile Row */}
      {!focusMode && (
        <div className="bg-slate-50 border-b border-slate-150 px-6 py-2.5 flex justify-between items-center text-xs font-medium text-slate-500 flex-none">
          <div>
            <span className="font-bold text-indigo-600 uppercase tracking-wider mr-2 text-[10px]">
              Active Subject:
            </span>
            <span className="font-extrabold text-slate-850 uppercase tracking-wide">{activeSection}</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-650">
            <span>Candidate: <strong className="text-slate-900 uppercase font-mono font-bold">{candidateName}</strong></span>
            <span className="text-slate-250">|</span>
            <span>Hall Ticket: <strong className="text-slate-900 font-mono font-bold">{rollNumber}</strong></span>
          </div>
        </div>
      )}

      {/* Premium Tab Bar */}
      {!focusMode && (
        <div className="bg-white border-b border-slate-150 flex items-center flex-wrap px-4 flex-none">
          {(examMode === 'SUBJECT' && selectedSubject ? [selectedSubject] : ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'] as SubjectSection[]).map((section) => {
            const isActive = activeSection === section;
            return (
              <button
                key={section}
                onClick={() => handleSectionTabClick(section)}
                className={`px-5 py-3.5 text-xs font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer select-none relative ${
                  isActive 
                    ? 'text-indigo-600 font-extrabold' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{section === 'Computer Science' ? 'Computer Science & Engg' : section}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Core split panel layout */}
      <div className={`flex-1 flex flex-col md:flex-row overflow-hidden ${focusMode ? 'max-w-4xl w-full mx-auto p-4 md:p-6' : ''}`}>
        
        {/* LEFT WORKSPACE: Current Question & Radio options (~75% width) */}
        <div className={`flex-1 flex flex-col overflow-hidden justify-between ${
          focusMode 
            ? 'bg-slate-900 border border-slate-805 rounded-2xl shadow-2xl text-slate-100 shadow-orange-950/5' 
            : 'bg-white border-r border-slate-200 text-slate-900'
        }`}>
          
          {/* GRIND MODE TOP BAR */}
          {focusMode && (
            <div className="bg-slate-950 border-b border-slate-805 px-6 py-3 flex justify-between items-center text-xs select-none flex-none rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                <span className="font-extrabold text-orange-500 tracking-wider uppercase font-mono flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>GRIND MODE</span>
                </span>
                <span className="text-slate-800">|</span>
                <span className="text-slate-300 font-bold uppercase tracking-wide">
                  {activeSection}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Glowing Timer */}
                <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-300 font-bold bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                  <Clock className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-orange-400 font-extrabold tracking-widest">{formatTime(timeLeft)}</span>
                </div>
                {/* Submit Exam Button */}
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-red-650 hover:bg-red-750 font-extrabold px-3 py-1.5 text-[10px] text-white rounded-lg transition uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  Submit
                </button>
                {/* Exit Grind Mode */}
                <button
                  onClick={toggleFocusMode}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 text-[10px] rounded-lg transition uppercase tracking-wider border border-slate-700 cursor-pointer active:scale-95"
                >
                  Exit Focus
                </button>
              </div>
            </div>
          )}
          
          {/* Question Meta details */}
          <div className={`px-6 py-3 flex justify-between items-center text-xs font-semibold select-none flex-none ${
            focusMode 
              ? 'bg-slate-950 border-b border-slate-805 text-slate-400' 
              : 'bg-slate-50 border-b border-slate-150 text-slate-550'
          }`}>
            <div className="flex items-center space-x-3">
              <span className={`font-extrabold font-mono px-2.5 py-1 rounded-lg text-[10px] tracking-wide ${
                focusMode ? 'bg-orange-500 text-slate-950' : 'bg-slate-900 text-white'
              }`}>
                QUESTION {activeQuestion.questionNumber}
              </span>
              {activeQuestion.code && (
                <span className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] border ${
                  focusMode 
                    ? 'bg-slate-850 text-slate-300 border-slate-750' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}>
                  Pool: {activeQuestion.code}
                </span>
              )}
              <span className={focusMode ? 'text-slate-800' : 'text-slate-250'}>|</span>
              <span>Multiple Choice Question (MCQ)</span>
            </div>
            <div className="flex items-center space-x-3 font-bold font-mono text-[11px]">
              <span className={focusMode ? 'text-emerald-400' : 'text-emerald-600'}>+1.00 Mark</span>
              <span className={focusMode ? 'text-slate-805' : 'text-slate-200'}>|</span>
              <span className={focusMode ? 'text-slate-500' : 'text-slate-400'}>0.00 Neg.</span>
            </div>
          </div>

          {/* Scrolling Question area with formatted details */}
          <div className={`flex-1 p-6 overflow-y-auto space-y-6 ${focusMode ? 'bg-slate-900/40' : ''}`}>
            
            {/* Subject Indicator Badge */}
            <div className={`inline-flex items-center space-x-1.5 rounded-full px-3.5 py-1 text-[10px] font-bold tracking-wider uppercase select-none border ${
              focusMode 
                ? 'bg-slate-850 text-slate-300 border-slate-800' 
                : 'bg-indigo-50/50 border border-indigo-100 text-indigo-750'
            }`}>
              <span>{activeSection} SECTION</span>
            </div>

            {/* Question Text */}
            <div className={`font-extrabold text-sm sm:text-base leading-relaxed tracking-tight ${
              focusMode ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {/* Highlight math formulas or parse them cleanly */}
              {activeQuestion.questionText.split('\n').map((para, i) => (
                <p key={i} className="mb-2">
                  <MathFormula text={para} />
                </p>
              ))}
            </div>

            {/* If there is a preformatted code snippet or block */}
            {activeQuestion.codeSnippet && (
              <pre className={`p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-sm border ${
                focusMode 
                  ? 'bg-slate-950 text-amber-400 border-slate-850' 
                  : 'bg-slate-950 text-emerald-400 border-slate-800'
              }`}>
                <code>{activeQuestion.codeSnippet}</code>
              </pre>
            )}

            {/* Answer Radio Options */}
            <div className="space-y-3 pt-2 select-none">
              {activeQuestion.options.map((option, index) => {
                const isSelected = selectedAnswers[currentId] === index;
                return (
                  <label
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`flex items-center p-3.5 sm:p-4 rounded-xl border transition cursor-pointer select-none group ${
                      focusMode
                        ? isSelected
                          ? 'bg-orange-500/10 border-orange-500 text-orange-200 shadow-sm shadow-orange-500/10'
                          : 'bg-slate-850/60 border-slate-800/85 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300'
                        : isSelected
                          ? 'bg-indigo-50/40 border-indigo-500 shadow-xs text-slate-900'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50/60 text-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-center mr-3 shrink-0">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        focusMode
                          ? isSelected
                            ? 'border-orange-500 bg-orange-500 text-slate-950'
                            : 'border-slate-700 group-hover:border-slate-600'
                          : isSelected 
                            ? 'border-indigo-600 bg-indigo-600 text-white' 
                            : 'border-slate-300 group-hover:border-slate-450'
                      }`}>
                        {isSelected && <div className={`w-1.5 h-1.5 rounded-full ${focusMode ? 'bg-slate-950' : 'bg-white'}`}></div>}
                      </div>
                    </div>
                    {/* Option Text */}
                    <div className="text-xs sm:text-sm font-medium">
                      <span className={`font-bold font-mono mr-2 ${focusMode ? 'text-slate-500' : 'text-slate-450'}`}>Option ({index + 1})</span>
                      <MathFormula text={option} />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTONS footer */}
          <div className={`border-t p-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 flex-none rounded-b-2xl ${
            focusMode 
              ? 'bg-slate-950 border-slate-850' 
              : 'bg-slate-50 border-slate-150'
          }`}>
            {/* Left box */}
            <div className="flex space-x-2.5 w-full sm:w-auto">
              {/* Previous Question Button - Extremely useful for Focus Mode */}
              <button
                onClick={() => {
                  if (currentId > 1) {
                    handleQuestionChange(currentId - 1);
                  }
                }}
                disabled={currentId === 1}
                className={`flex-1 sm:flex-initial font-bold py-2.5 px-4 rounded-xl text-xs select-none cursor-pointer uppercase transition tracking-wide active:scale-97 flex items-center justify-center space-x-1 ${
                  currentId === 1 
                    ? 'opacity-30 cursor-not-allowed' 
                    : ''
                } ${
                  focusMode 
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' 
                    : 'bg-white border border-slate-200 text-slate-750 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleMarkForReviewAndNext}
                className={`flex-1 sm:flex-initial font-bold py-2.5 px-4 rounded-xl text-xs select-none cursor-pointer uppercase transition tracking-wide active:scale-97 ${
                  focusMode 
                    ? 'bg-slate-900 border border-slate-800 text-orange-400 hover:bg-slate-800' 
                    : 'bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200'
                }`}
              >
                Mark for Review
              </button>
              <button
                onClick={handleClearResponse}
                className={`flex-1 sm:flex-initial font-bold py-2.5 px-4 rounded-xl text-xs select-none cursor-pointer uppercase transition tracking-wide active:scale-97 ${
                  focusMode 
                    ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800' 
                    : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-200'
                }`}
              >
                Clear
              </button>
            </div>

            {/* Right box */}
            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              {/* Keyboard shortcuts cheat sheet (visible only in Grind Mode) */}
              {focusMode && (
                <div className="hidden lg:flex items-center space-x-2 text-[10px] text-slate-500 font-mono bg-slate-900 px-3 py-2 rounded-lg border border-slate-850">
                  <span className="text-slate-450 uppercase font-semibold">Shortcuts:</span>
                  <span>[←/→] Nav</span>
                  <span>•</span>
                  <span>[1-4] Ans</span>
                  <span>•</span>
                  <span>[Space] Save</span>
                </div>
              )}

              <button
                onClick={handleSaveAndNext}
                className={`w-full sm:w-auto font-bold py-2.5 px-6 rounded-xl text-xs select-none cursor-pointer uppercase transition tracking-wider flex items-center justify-center space-x-1.5 active:scale-97 ${
                  focusMode 
                    ? 'bg-orange-550 hover:bg-orange-600 text-slate-950 font-extrabold shadow-lg shadow-orange-500/10' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                <span>Save & Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION RIGHT PANEL (~25% width) */}
        {!focusMode && (
          <aside className="w-full md:w-80 bg-slate-50/50 flex flex-col overflow-hidden border-t md:border-t-0 border-slate-200">
            
            {/* Legend container */}
            <div className="bg-white p-5 border-b border-slate-150 flex-none select-none text-[11px] text-slate-500 font-semibold">
              <h3 className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] mb-3">Palette Status Guide</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-150 text-emerald-700 font-extrabold text-[10px] flex items-center justify-center">
                    {counts.answered}
                  </div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-red-50 border border-red-150 text-red-650 font-extrabold text-[10px] flex items-center justify-center">
                    {counts.notAnswered}
                  </div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-extrabold text-[10px] flex items-center justify-center">
                    {counts.notVisited}
                  </div>
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-violet-50 border border-violet-150 text-violet-750 font-extrabold text-[10px] flex items-center justify-center">
                    {counts.markedReview}
                  </div>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2 border-t border-slate-100 pt-2">
                  <div className="w-6 h-6 rounded-full bg-violet-50 border border-violet-150 text-violet-750 font-extrabold text-[10px] flex items-center justify-center relative shrink-0">
                    {counts.answeredMarkedReview}
                    <div className="absolute right-0 bottom-0 bg-emerald-500 rounded-full w-2 h-2 border border-white flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span>Answered & Marked Review</span>
                </div>
              </div>
            </div>

            {/* Palette Questions Grid */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/30 flex flex-col justify-start space-y-3">
              <div className="bg-slate-100/80 border border-slate-200/60 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 flex justify-between items-center select-none">
                <span className="uppercase tracking-wider text-[10px]">Palette Index</span>
                <span className="font-mono text-[10px] text-slate-450 font-semibold">
                  {examMode === 'SUBJECT' ? `1-${questions.length}` : (activeSection === 'Mathematics' ? '1-50' : activeSection === 'Physics' ? '51-75' : activeSection === 'Chemistry' ? '76-100' : '101-200')}
                </span>
              </div>

              {/* Index Grid */}
              <div className="bg-white border border-slate-200 p-4 grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-[35vh] md:max-h-[45vh] overflow-y-auto shadow-xs rounded-xl">
                {questions
                  .filter((q) => q.section === activeSection)
                  .map((q) => {
                    const status = questionStatuses[q.id];
                    const isCurrent = q.id === currentId;
                    const isAnswered = selectedAnswers[q.id] !== undefined;

                    let styleClass = 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100/80 rounded-lg';
                    let statusChar = '';

                    if (status === 'ANSWERED') {
                      styleClass = 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold rounded-lg';
                    } else if (status === 'NOT_ANSWERED') {
                      styleClass = 'bg-red-50 border border-red-200 text-red-650 font-extrabold rounded-lg';
                    } else if (status === 'MARKED_FOR_REVIEW') {
                      styleClass = 'bg-violet-50 border border-violet-200 text-violet-750 font-extrabold rounded-full';
                    } else if (status === 'ANSWERED_AND_MARKED_FOR_REVIEW') {
                      styleClass = 'bg-violet-50 border border-violet-200 text-violet-750 font-extrabold rounded-full relative';
                      statusChar = 'tick';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => handleQuestionChange(q.id)}
                        className={`h-9.5 w-9.5 text-xs flex items-center justify-center font-mono font-bold tracking-tight cursor-pointer transition active:scale-90 ${styleClass} ${
                          isCurrent ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                        }`}
                      >
                        <span>{q.questionNumber}</span>
                        {statusChar === 'tick' && (
                          <div className="absolute right-0 bottom-0 bg-emerald-500 rounded-full w-2.5 h-2.5 border border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Practice Scratchpad Notes */}
            <div className="px-4 pb-4 flex-none select-none animate-fade-in">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 space-y-1.5 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] text-amber-800 font-extrabold uppercase tracking-wider">
                  <span>Notes Scratchpad</span>
                </div>
                <textarea
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Type your equations or rough notes here..."
                  className="w-full h-24 bg-white border border-amber-200 rounded-lg p-2 text-xs text-slate-750 placeholder-amber-600/45 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
                  id="exam-scratchpad-textarea"
                />
              </div>
            </div>

            {/* Action sidebar footer utilities */}
            <div className="bg-slate-50 border-t border-slate-150 p-4 grid grid-cols-2 gap-3 text-center text-xs font-bold flex-none">
              <button
                onClick={() => setShowQuestionPaper(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 py-2 px-2.5 rounded-xl cursor-pointer transition select-none flex items-center justify-center space-x-1.5 active:scale-97 text-slate-700"
              >
                <ListOrdered className="h-4 w-4 text-slate-500" />
                <span>Question Paper</span>
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 py-2 px-2.5 rounded-xl cursor-pointer transition select-none flex items-center justify-center space-x-1.5 active:scale-97 text-slate-700"
              >
                <Info className="h-4 w-4 text-slate-500" />
                <span>Instructions</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* --- FLOATING MODALS --- */}

      {/* Modal 1: Complete Question Paper View */}
      {showQuestionPaper && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-250 max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden">
            <header className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm tracking-wider uppercase">Exam Question Paper condensed view</h3>
              <button 
                onClick={() => setShowQuestionPaper(false)}
                className="text-slate-400 hover:text-white transition font-bold text-xs bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer uppercase tracking-wider"
              >
                Close View
              </button>
            </header>
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm divide-y divide-slate-100 bg-slate-50/50">
              {questions.map((q, idx) => (
                <div key={q.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex space-x-2 text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider select-none">
                    <span>Q{q.id} • {q.section} Q{q.questionNumber} {q.code && `[ID: ${q.code}]`}</span>
                    <span>• Status: {questionStatuses[q.id].replace(/_/g, ' ')}</span>
                  </div>
                  <p className="font-bold text-slate-850 text-sm leading-relaxed">{q.questionText}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pl-4 py-1">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-start">
                        <strong className="text-slate-400 font-mono mr-1.5">({oIdx + 1})</strong>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: General instructions lookup */}
      {showInstructions && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-250 max-w-2xl w-full h-[70vh] flex flex-col overflow-hidden">
            <header className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm tracking-wider uppercase">General Instructions</h3>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-white transition font-bold text-xs bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer uppercase tracking-wider"
              >
                Close View
              </button>
            </header>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 font-medium">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">CBT Test Overview:</h4>
              <p>
                {examMode === 'SUBJECT' 
                  ? `The practice test contains 50 questions from the ${selectedSubject} pool. Total duration is 45 minutes.`
                  : `The exam contains 200 questions: Mathematics (50), Physics (25), Chemistry (25), Computer Science (100). Total duration is 180 minutes.`
                }
              </p>
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-tight mt-4">Answering Guide:</h4>
              <p>Click "Save & Next" to save answers. If left skipped or changed without clicking, the answers will not be registered as Answered.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Exam Submission Confirmation */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/65 z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-250 max-w-md w-full overflow-hidden">
            <header className="bg-slate-900 text-white p-5 text-center font-extrabold tracking-wider uppercase text-xs sm:text-sm">
              Verify Exam Submission
            </header>
            <div className="p-6 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <p className="font-bold text-slate-900 text-center text-sm">
                Are you absolutely sure you want to finish and submit your draft answers?
              </p>
              
              {/* Table of metrics */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-2 text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-150 pb-2 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <span>Metric Parameter</span>
                  <span>Counts</span>
                </div>
                <div className="flex justify-between text-slate-650 items-center">
                  <span>Answered Standard:</span>
                  <span className="text-emerald-600 font-bold font-mono">{counts.answered}</span>
                </div>
                <div className="flex justify-between text-slate-650 items-center">
                  <span>Answered & Marked Review:</span>
                  <span className="text-violet-600 font-bold font-mono">{counts.answeredMarkedReview}</span>
                </div>
                <div className="flex justify-between text-slate-650 items-center">
                  <span>Marked for Review:</span>
                  <span className="text-violet-550 font-bold font-mono">{counts.markedReview}</span>
                </div>
                <div className="flex justify-between text-slate-650 items-center">
                  <span>Not Answered / Skipped:</span>
                  <span className="text-red-500 font-bold font-mono">{counts.notAnswered}</span>
                </div>
                <div className="flex justify-between text-slate-650 items-center border-t border-slate-100 pt-1.5 mt-1">
                  <span>Not Visited Drafts:</span>
                  <span className="text-slate-400 font-bold font-mono">{counts.notVisited}</span>
                </div>
              </div>

              <p className="text-red-500 font-bold text-center text-xs leading-relaxed">
                Important: Once submitted, you cannot re-enter the test workspace or alter any responses!
              </p>
            </div>

            <footer className="bg-slate-50 border-t border-slate-150 p-4.5 flex space-x-3 justify-end">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs select-none cursor-pointer uppercase tracking-wider active:scale-97"
              >
                Back to Test
              </button>
              <button
                onClick={handleFinalSubmit}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs select-none cursor-pointer uppercase tracking-wider active:scale-97 shadow-xs"
              >
                Submit Exam
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
