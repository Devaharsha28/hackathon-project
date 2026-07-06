import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Timer, 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft,
  Clock,
  History,
  Info,
  X
} from 'lucide-react';
import { MockTest, PlacementQuestion, StudentProfile } from '../types';

interface MockTestsProps {
  student: StudentProfile;
  onTestSubmitSuccess?: () => void;
}

export default function MockTests({ student, onTestSubmitSuccess }: MockTestsProps) {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');
  
  // Active Test States
  const [currentTest, setCurrentTest] = useState<MockTest | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<PlacementQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [quizTimer, setQuizTimer] = useState<any>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  
  // Scoring Screen states
  const [testResult, setTestResult] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    passed: boolean;
    historyRecordId: string;
    explanations: { questionId: string; questionText: string; selectedAnswer: string; correctAnswer: string; isCorrect: boolean; explanation: string }[];
  } | null>(null);

  const fetchTestData = async () => {
    if (!student || !student.email) return;
    try {
      setLoading(true);
      // Fetch available tests
      const testRes = await fetch('/api/mock-tests');
      const testData = await testRes.json();
      setTests(testData);

      // Fetch student's test history
      const histRes = await fetch(`/api/mock-tests/history?email=${encodeURIComponent(student.email)}`);
      const histData = await histRes.json();
      setHistory(histData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, [student]);

  // Handle active countdown timer
  useEffect(() => {
    if (currentTest && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest(true); // force auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentTest, timeLeft]);

  const startTest = async (test: MockTest) => {
    try {
      setLoading(true);
      // Fetch test specific questions
      const res = await fetch(`/api/mock-tests/questions?testId=${test.id}`);
      const questionsData = await res.json();
      
      setCurrentTest(test);
      setCurrentQuestions(questionsData);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(test.durationMinutes * 60);
      setTestResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers({
      ...answers,
      [questionId]: option
    });
  };

  const handleSubmitTest = async (forceAutoSubmit = false) => {
    if (!currentTest) return;

    setLoading(true);
    try {
      const res = await fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: student.email,
          testId: currentTest.id,
          answers
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTestResult(data.result);
      setCurrentTest(null);
      setShowConfirmSubmit(false);
      fetchTestData(); // Reload history
      if (onTestSubmitSuccess) onTestSubmitSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleReviewHistoryItem = (record: any) => {
    // If record has pre-saved explanations, use them!
    if (record.explanations && record.explanations.length > 0) {
      setTestResult(record);
      return;
    }

    // Otherwise, find the test in our tests list
    const originalTest = tests.find(t => t.id === record.testId);
    if (originalTest) {
      const reconstructedExplanations = originalTest.questions.map(q => {
        return {
          questionId: q.id,
          questionText: q.text,
          selectedAnswer: 'Not captured for legacy records',
          correctAnswer: q.options[q.correctOptionIndex] || 'N/A',
          isCorrect: false,
          explanation: q.explanation || 'Refer to branch syllabus preparation guidelines.'
        };
      });
      setTestResult({
        score: record.score,
        totalQuestions: record.totalQuestions,
        correctAnswers: record.correctAnswers,
        percentage: record.percentage || Math.round((record.score / record.totalQuestions) * 100),
        passed: record.passed,
        historyRecordId: record.id,
        explanations: reconstructedExplanations
      });
    } else {
      setTestResult({
        score: record.score,
        totalQuestions: record.totalQuestions,
        correctAnswers: record.correctAnswers,
        percentage: record.percentage || Math.round((record.score / record.totalQuestions) * 100),
        passed: record.passed,
        historyRecordId: record.id,
        explanations: []
      });
    }
  };

  if (loading && !currentTest) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-white rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-white rounded-3xl"></div>
          <div className="h-48 bg-white rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="mock-tests-panel">
      
      {/* 1. Header or Test Session Info */}
      {!currentTest && !testResult && (
        <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 shadow-2xs flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1c1a19] flex items-center gap-1.5">
              <Award className="h-5 w-5 text-blue-600" /> Diploma Placement Mock Exams
            </h3>
            <p className="text-xs text-[#7c756e]">Practice quantitative, logical, and core engineering questions. Review answers instantly.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'available' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-[#faf9f6] border border-[#e8e6dd] text-[#5c5650] hover:bg-slate-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Available Tests ({tests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'history' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-[#faf9f6] border border-[#e8e6dd] text-[#5c5650] hover:bg-slate-50'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Attempt History ({history.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Tab Views: Available tests list */}
      {!currentTest && !testResult && activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div 
              key={test.id} 
              className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                    {test.category}
                  </span>
                  <span className="text-[10px] text-[#7c756e] font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {test.durationMinutes} Mins
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-[#1c1a19]">{test.title}</h3>
                <p className="text-xs text-[#5c5650] leading-relaxed line-clamp-2">{test.description}</p>
                
                <div className="flex items-center gap-1 text-[10px] text-[#8c857e] font-mono">
                  <span>Questions count: <strong>5 Questions</strong></span>
                  <span>•</span>
                  <span>Passing Score: <strong>{test.passingScorePercentage}%</strong></span>
                </div>
              </div>

              <button
                onClick={() => startTest(test)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Start Practice Test</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* History view tab (Interactive Result Dashboard) */}
      {!currentTest && !testResult && activeTab === 'history' && (() => {
        const totalAttempts = history.length;
        const avgPercentage = totalAttempts > 0 
          ? Math.round(history.reduce((sum, item) => sum + (item.percentage || 0), 0) / totalAttempts)
          : 0;
        const passedAttempts = history.filter(item => item.passed).length;
        const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
        
        let rating = "Not Rated";
        let ratingColor = "text-gray-500";
        if (totalAttempts > 0) {
          if (avgPercentage >= 80) {
            rating = "Elite Candidate";
            ratingColor = "text-indigo-600 bg-indigo-50 border-indigo-100";
          } else if (avgPercentage >= 60) {
            rating = "Placement Ready";
            ratingColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
          } else {
            rating = "Needs Practice";
            ratingColor = "text-amber-700 bg-amber-50 border-amber-100";
          }
        }

        return (
          <div className="space-y-6" id="result-dashboard">
            {/* KPI STATS CARDS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8e6dd] rounded-2xl p-4 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold text-[#8c857e] uppercase block">Exams Taken</span>
                <span className="text-2xl font-black text-[#1c1a19] block font-mono">{totalAttempts}</span>
                <span className="text-[10px] text-[#7c756e] block">Completed practice tests</span>
              </div>

              <div className="bg-white border border-[#e8e6dd] rounded-2xl p-4 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold text-[#8c857e] uppercase block">Average Accuracy</span>
                <span className="text-2xl font-black text-blue-600 block font-mono">{avgPercentage}%</span>
                <span className="text-[10px] text-[#7c756e] block">Mean performance score</span>
              </div>

              <div className="bg-white border border-[#e8e6dd] rounded-2xl p-4 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold text-[#8c857e] uppercase block">Exam Pass Rate</span>
                <span className="text-2xl font-black text-emerald-600 block font-mono">{passRate}%</span>
                <span className="text-[10px] text-[#7c756e] block">{passedAttempts} of {totalAttempts} cleared</span>
              </div>

              <div className="bg-white border border-[#e8e6dd] rounded-2xl p-4 shadow-2xs space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#8c857e] uppercase block">Readiness Rank</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md border inline-block mt-1 ${ratingColor}`}>
                    {rating}
                  </span>
                </div>
                <span className="text-[10px] text-[#7c756e] block">Based on average score</span>
              </div>
            </div>

            {/* ATTEMPTS TABLE AND DETAIL VIEWER */}
            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Historical Test Attempts & Solutions Review</h3>
                {totalAttempts > 0 && (
                  <span className="text-[10px] font-mono text-[#7c756e]">Click "Review Solutions" to inspect mistakes</span>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-[#2c2a29]">
                  <thead className="bg-[#faf9f6] border-b border-[#e8e6dd] text-[#8c857e] uppercase text-[9px] tracking-wider font-extrabold">
                    <tr>
                      <th className="p-4 rounded-l-xl">Test Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Cutoff Status</th>
                      <th className="p-4 rounded-r-xl text-right">Solutions Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1efe8]">
                    {history.map((record) => {
                      const formattedDate = new Date(record.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      return (
                        <tr key={record.id} className="hover:bg-[#faf9f6]/40 transition">
                          <td className="p-4 font-bold text-[#1c1a19]">{record.testTitle}</td>
                          <td className="p-4">
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                              {record.category || 'General'}
                            </span>
                          </td>
                          <td className="p-4 text-[#7c756e] font-mono">{formattedDate}</td>
                          <td className="p-4 font-bold font-mono text-blue-700">
                            {record.percentage}% ({record.score} / {record.totalQuestions})
                          </td>
                          <td className="p-4">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              record.passed 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                : 'bg-red-50 border-red-100 text-red-700'
                            }`}>
                              {record.passed ? 'Cleared Cutoff' : 'Below Cutoff'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleReviewHistoryItem(record)}
                              className="px-3 py-1.5 bg-[#faf9f6] hover:bg-blue-50 hover:text-blue-700 border border-[#e8e6dd] hover:border-blue-200 text-[#5c5650] text-[10px] font-bold rounded-lg transition inline-flex items-center gap-1"
                            >
                              <span>Review Solutions</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {history.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-xs text-[#a29b93] italic">
                          You have not taken any mock tests yet. Get started on the "Available Tests" tab to build your readiness report!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. ACTIVE QUIZ PLAYGROUND SCREEN */}
      {currentTest && currentQuestions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in" id="active-quiz-frame">
          
          {/* Main Question view column */}
          <div className="lg:col-span-8 bg-white border border-[#e8e6dd] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Countdown timer ticker */}
            <div className="flex items-center justify-between border-b border-[#f1efe8] pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c857e]">Active Exam Session</span>
                <h3 className="text-sm font-bold text-[#1c1a19]">{currentTest.title}</h3>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-700 rounded-xl font-mono font-extrabold text-xs">
                <Timer className="h-4.5 w-4.5 text-red-600 animate-pulse" />
                <span>{formatTime(timeLeft)} Left</span>
              </div>
            </div>

            {/* Pagination tabs */}
            <div className="flex flex-wrap gap-1.5">
              {currentQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition border ${
                    currentQuestionIndex === idx 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : answers[currentQuestions[idx].id] 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-[#faf9f6] border-[#e8e6dd] text-[#5c5650] hover:bg-[#efede6]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Core question body card */}
            <div className="bg-[#faf9f6] p-5 border border-[#e8e6dd] rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#1c1a19] leading-relaxed">
                {currentQuestions[currentQuestionIndex].text || (currentQuestions[currentQuestionIndex] as any).questionText}
              </p>
            </div>

            {/* Options choices radio group */}
            <div className="space-y-3 pt-2">
              {currentQuestions[currentQuestionIndex].options.map((option, oIdx) => {
                const qId = currentQuestions[currentQuestionIndex].id;
                const isSelected = answers[qId] === option;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(qId, option)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-semibold flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-100' 
                        : 'bg-white border-[#e8e6dd] text-[#2c2a29] hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-[#c6c2b3]'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Pagination buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-[#f1efe8]">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="px-4 py-2 bg-white hover:bg-slate-50 disabled:opacity-30 border border-[#e2dfd4] rounded-xl text-xs font-bold text-[#5c5650] flex items-center gap-1 transition"
              >
                Previous Question
              </button>

              {currentQuestionIndex < currentQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                  id="quiz-submit-trigger"
                >
                  Submit Final Answers
                </button>
              )}
            </div>

          </div>

          {/* Sidebar guidelines details list */}
          <div className="lg:col-span-4 bg-white border border-[#e8e6dd] rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase text-[#8c857e]">Safety Guidelines</h4>
            <ul className="text-xs text-[#5c5650] space-y-2.5 leading-relaxed">
              <li className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Do not refresh or minimize this tab. Doing so does not pause the session countdown.</span>
              </li>
              <li className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>If the countdown timer ticks to zero, your answers will be captured and submitted automatically.</span>
              </li>
              <li className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Review explanations after submission to repair weaknesses listed on the home report.</span>
              </li>
            </ul>
          </div>

        </div>
      )}

      {/* 4. PERFORMANCE ASSESSMENT SCORE REPORT VIEW */}
      {testResult && (
        <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 sm:p-8 space-y-8 animate-fade-in" id="score-report-frame">
          
          {/* Diagnostic overview banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#f1efe8]">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600">Performance report compiled</span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1c1a19]">Your Quiz Scoring Report</h2>
              <p className="text-xs text-[#7c756e]">This score has been submitted to the placement officer and integrated into your ReadinessScore.</p>
            </div>

            <div className="shrink-0 text-center space-y-1">
              <div className="text-4xl font-black font-mono text-blue-600">
                {testResult.percentage}%
              </div>
              <div className={`text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-full border ${
                testResult.passed 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}>
                {testResult.passed ? 'PASSED CUTOFF' : 'BELOW CUTOFF'}
              </div>
            </div>
          </div>

          {/* Quick Metrics columns */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-[#faf9f6] rounded-2xl border border-[#efede6]">
              <span className="text-[9px] font-bold text-[#8c857e] uppercase block">Correct</span>
              <span className="text-sm font-bold text-emerald-600 font-mono">{testResult.correctAnswers} Qs</span>
            </div>
            <div className="p-3 bg-[#faf9f6] rounded-2xl border border-[#efede6]">
              <span className="text-[9px] font-bold text-[#8c857e] uppercase block">Incorrect</span>
              <span className="text-sm font-bold text-red-600 font-mono">{testResult.totalQuestions - testResult.correctAnswers} Qs</span>
            </div>
            <div className="p-3 bg-[#faf9f6] rounded-2xl border border-[#efede6]">
              <span className="text-[9px] font-bold text-[#8c857e] uppercase block">Total</span>
              <span className="text-sm font-bold text-[#2c2a29] font-mono">{testResult.totalQuestions} Questions</span>
            </div>
          </div>

          {/* Substantive Question explanations list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Detailed Answer Diagnostic explanations</h3>
            
            <div className="space-y-4">
              {testResult.explanations.map((exp, idx) => (
                <div key={idx} className="p-5 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-semibold text-[#1c1a19] leading-relaxed">
                      <strong>Q{idx + 1}.</strong> {exp.questionText}
                    </h4>
                    
                    <span className="shrink-0 mt-0.5">
                      {exp.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 bg-white rounded-xl border border-[#f1efe8]">
                      <span className="text-[9px] text-[#8c857e] uppercase block mb-0.5">Your Response</span>
                      <span className={`font-medium ${exp.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                        {exp.selectedAnswer || 'Not answered'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-[#f1efe8]">
                      <span className="text-[9px] text-[#8c857e] uppercase block mb-0.5">Correct Answer Key</span>
                      <span className="font-medium text-[#2c2a29]">
                        {exp.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Step explanations block */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-blue-800 uppercase tracking-wide block">Solution Explanation</span>
                    <p className="text-[11px] text-[#4c4844] leading-relaxed">
                      {exp.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return actions */}
          <div className="pt-4 border-t border-[#f1efe8] flex justify-end">
            <button
              onClick={() => setTestResult(null)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
            >
              Return to available Tests board
            </button>
          </div>

        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#f1efe8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1c1a19]">Submit Mock Test?</h3>
                  <p className="text-[10px] text-[#7c756e]">Evaluate and finalize your results</p>
                </div>
              </div>
              <button 
                onClick={() => setShowConfirmSubmit(false)}
                className="p-1 hover:bg-slate-50 text-[#8c857e] rounded-lg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-3 text-xs leading-relaxed text-[#5c5650]">
              <p>
                Are you sure you want to submit your mock test answers?
              </p>
              <div className="bg-[#faf9f6] border border-[#efede6] rounded-xl p-3 space-y-1 font-semibold">
                <div className="flex justify-between">
                  <span className="text-[#8c857e]">Answered Questions:</span>
                  <span className="font-bold text-blue-700">
                    {Object.keys(answers).length} of {currentQuestions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c857e]">Time Remaining:</span>
                  <span className="font-bold text-amber-700 font-mono">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-amber-600 font-semibold bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg">
                ⚠️ Once submitted, you cannot change your answers. Your final score will be recorded and logged on your dashboard.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2 border-t border-[#f1efe8]">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={() => handleSubmitTest(true)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Yes, Submit Answers
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
