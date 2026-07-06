import React, { useState } from 'react';
import { 
  Calendar, GraduationCap, FileText, CheckSquare, Layers, Zap, Target, Search, ArrowRight,
  ShieldCheck, MapPin, Sliders, ChevronDown, ChevronUp, RefreshCw, Star, Info, Award, BookOpen, Clock, Play, TrendingUp
} from 'lucide-react';
import { PAPERS_DATA, COLLEGES_DATA, PreviousPaper, College } from './DashboardScreen';

interface ECETCompanionHubProps {
  candidateName: string;
  rollNumber: string;
  activeTab: 'PLANNER' | 'STUDY' | 'PREDICTORS' | 'PAST_PAPERS';
  setActiveTab: (tab: 'PLANNER' | 'STUDY' | 'PREDICTORS' | 'PAST_PAPERS') => void;
}

export default function ECETCompanionHub({ candidateName, rollNumber, activeTab, setActiveTab }: ECETCompanionHubProps) {
  
  // Prep Benchmarks state
  const [daysRemaining, setDaysRemaining] = useState(132);
  const [dailyTarget, setDailyTarget] = useState(4);
  const [studyHoursLogged, setStudyHoursLogged] = useState(2.5);
  const [targetRank, setTargetRank] = useState(150);
  const [mockRank, setMockRank] = useState(315);
  
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [metricDaysInput, setMetricDaysInput] = useState('132');
  const [metricTargetHoursInput, setMetricTargetHoursInput] = useState('4');
  const [metricStudyLoggedInput, setMetricStudyLoggedInput] = useState('2.5');
  const [metricTargetRankInput, setMetricTargetRankInput] = useState('150');
  const [metricMockRankInput, setMetricMockRankInput] = useState('315');

  // Subtopics checklists for Subject Tracker
  const [mathSubtopics, setMathSubtopics] = useState([
    { name: 'Matrices & Determinants', completed: true },
    { name: 'Partial Fractions', completed: true },
    { name: 'Trigonometric Ratios & Compound Angles', completed: true },
    { name: 'Multiple & Submultiple Angles', completed: true },
    { name: 'Properties of Triangles', completed: true },
    { name: 'Hyperbolic Functions', completed: true },
    { name: 'Complex Numbers', completed: true },
    { name: 'Limits & Continuity', completed: true },
    { name: 'First-Order Derivatives', completed: true },
    { name: 'Higher-Order Derivatives', completed: true },
    { name: 'Applications of Derivatives', completed: true },
    { name: 'Indefinite Integration', completed: false },
    { name: 'Definite Integrals & Areas', completed: false },
    { name: 'Differential Equations (First Order)', completed: false },
    { name: 'Differential Equations (Higher Order)', completed: false },
    { name: 'Laplace Transforms', completed: false },
    { name: 'Inverse Laplace Transforms', completed: false }
  ]);

  const [deSubtopics, setDeSubtopics] = useState([
    { name: 'Number Systems & Codes', completed: true },
    { name: 'Logic Gates & Boolean Algebra', completed: true },
    { name: 'Karnaugh Maps minimization', completed: true },
    { name: 'Half/Full Adders & Subtractors', completed: true },
    { name: 'Multiplexers & Demultiplexers', completed: true },
    { name: 'Decoders & Encoders', completed: false },
    { name: 'SR & D Flip Flops', completed: false },
    { name: 'JK & T Flip Flops', completed: false },
    { name: 'Asynchronous Counters', completed: false },
    { name: 'Synchronous Counters', completed: false },
    { name: 'Shift Registers', completed: false },
    { name: 'D/A & A/D Converter Circuits', completed: false }
  ]);

  const [networksSubtopics, setNetworksSubtopics] = useState([
    { name: "Circuit Elements & Ohm's Law", completed: true },
    { name: "Kirchhoff's Laws (KCL & KVL)", completed: true },
    { name: 'Nodal & Mesh Analysis', completed: true },
    { name: 'Superposition Theorem', completed: true },
    { name: "Thevenin's Theorem", completed: true },
    { name: "Norton's Theorem", completed: true },
    { name: 'Maximum Power Transfer Theorem', completed: true },
    { name: 'Reciprocity Theorem', completed: true },
    { name: 'RL & RC Transient Response', completed: true },
    { name: 'RLC series resonant circuits', completed: true },
    { name: 'Parallel resonance & Q-factor', completed: true },
    { name: 'AC Circuits fundamentals', completed: true },
    { name: 'Active & Reactive Power', completed: true },
    { name: 'Three-phase balanced systems', completed: false },
    { name: 'Two-port parameters (Z & Y)', completed: false },
    { name: 'Two-port parameters (ABCD & h)', completed: false }
  ]);

  const [mpSubtopics, setMpSubtopics] = useState([
    { name: '8085 Microprocessor Pin Configuration', completed: true },
    { name: '8085 Architecture & Functional blocks', completed: true },
    { name: '8085 Addressing Modes', completed: false },
    { name: '8086 BIU & EU Architecture', completed: false },
    { name: '8086 Instruction Queue & Pipelining', completed: false },
    { name: '8086 Segment Registers', completed: false },
    { name: 'Memory & I/O Interfacing concepts', completed: false },
    { name: '8255 Programmable Peripheral Interface', completed: false }
  ]);

  // Expand states for subject trackers
  const [expandedTracker, setExpandedTracker] = useState<'Mathematics' | 'DE' | 'Networks' | 'MP' | null>('Mathematics');

  // Daily Planner schedule toggle
  const [plannerScheduleTab, setPlannerScheduleTab] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');

  // Mini-Quiz Interactive state under Daily Revision
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState(0);

  // Flashcards state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Active overlay material viewing
  const [activeMaterial, setActiveMaterial] = useState<'NOTES' | 'FORMULAS' | 'FLASHCARDS' | null>(null);

  // Rank and College Predictor States
  const [predictScoreInput, setPredictScoreInput] = useState('115');
  const [collegeCategory, setCollegeCategory] = useState<'OC' | 'BC' | 'SC' | 'ST'>('OC');
  const [collegeRegion, setCollegeRegion] = useState<'OU' | 'AU' | 'SVU'>('OU');
  const [collegeBranch, setCollegeBranch] = useState<'CSE' | 'ECE' | 'EEE'>('CSE');
  const [collegePredictTab, setCollegePredictTab] = useState<'SAFE' | 'MODERATE' | 'DREAM'>('SAFE');

  // Daily Revision checked checklist
  const [revisionCompleted, setRevisionCompleted] = useState(false);
  const [quizTaskCompleted, setQuizTaskCompleted] = useState(false);
  const [pyqsCompleted, setPyqsCompleted] = useState(false);

  // Past Papers Filters
  const [paperYearFilter, setPaperYearFilter] = useState<'ALL' | '2024' | '2023' | '2022'>('ALL');
  const [paperSubjectFilter, setPaperSubjectFilter] = useState<'ALL' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Computer Science'>('ALL');
  const [paperDifficultyFilter, setPaperDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [viewingPaperDetail, setViewingPaperDetail] = useState<PreviousPaper | null>(null);

  // Compute subtopic completion percentages dynamically
  const mathPercentage = Math.round((mathSubtopics.filter(s => s.completed).length / mathSubtopics.length) * 100);
  const dePercentage = Math.round((deSubtopics.filter(s => s.completed).length / deSubtopics.length) * 100);
  const networksPercentage = Math.round((networksSubtopics.filter(s => s.completed).length / networksSubtopics.length) * 100);
  const mpPercentage = Math.round((mpSubtopics.filter(s => s.completed).length / mpSubtopics.length) * 100);

  // Mini quiz questions
  const miniQuizQuestions = [
    {
      q: "Which interrupt has the highest priority in the 8085 microprocessor?",
      options: ["TRAP", "RST 7.5", "RST 6.5", "INTR"],
      correct: 0,
      explanation: "TRAP is a non-maskable, vectored interrupt with the absolute highest priority in the 8085 microprocessor architecture."
    },
    {
      q: "Thevenin's equivalent resistance (Rth) is found by:",
      options: [
        "Shorting voltage sources, opening current sources",
        "Opening voltage sources, shorting current sources",
        "Shorting both voltage and current sources",
        "Opening both voltage and current sources"
      ],
      correct: 0,
      explanation: "To find Rth, all independent sources are deactivated (ideal voltage sources are short-circuited and ideal current sources are open-circuited)."
    },
    {
      q: "How many selection control lines are required for a 1-to-8 Demultiplexer?",
      options: ["2", "3", "4", "8"],
      correct: 1,
      explanation: "A demultiplexer has 2^n output lines where n is the number of select lines. Since 2^3 = 8, exactly 3 lines are required."
    },
    {
      q: "What is the order of the differential equation: (dy/dx)^2 + y = sin(x)?",
      options: ["1", "2", "3", "0"],
      correct: 0,
      explanation: "The order of a differential equation is the order of the highest derivative present (which is dy/dx, hence 1). The power of the derivative (2) is its degree."
    },
    {
      q: "Which flag of the 8086 microprocessor is used to enable or disable interrupts?",
      options: ["Direction Flag", "Interrupt Flag", "Trap Flag", "Carry Flag"],
      correct: 1,
      explanation: "The Interrupt Flag (IF) is used to enable (STI instruction, IF=1) or disable (CLI instruction, IF=0) maskable hardware interrupts."
    }
  ];

  // Flashcards deck
  const flashcardsDeck = [
    {
      front: "What is the relation between the Laplace Transform of f(t) and its derivative f'(t)?",
      back: "L{f'(t)} = s * L{f(t)} - f(0)",
      subject: "Mathematics"
    },
    {
      front: "State the Maximum Power Transfer Theorem for a DC resistive network.",
      back: "Maximum power is transferred from a source to a load when the load resistance (RL) is exactly equal to the source's internal resistance (RS).",
      subject: "Networks"
    },
    {
      front: "What is the function of the Instruction Queue in the 8086 Microprocessor BIU?",
      back: "It is a 6-byte pre-fetch queue that allows instruction pipelining by fetching up to 6 instructions in advance while the Execution Unit is busy.",
      subject: "Microprocessors"
    },
    {
      front: "Calculate the mathematical limit: lim(x->0) [sin(x) / x].",
      back: "By standard limit theorem or L'Hopital's Rule, the value is exactly 1.",
      subject: "Mathematics"
    }
  ];

  // Rank prediction logic
  const handlePredictRank = (scoreVal: number) => {
    if (scoreVal >= 170) return { range: "1 - 15", message: "Exceptional! Within safe zone for absolute merit seat at JNTUH/OUCE." };
    if (scoreVal >= 150) return { range: "16 - 50", message: "Fantastic standing. Excellent chance of securing State Top 50." };
    if (scoreVal >= 130) return { range: "51 - 150", message: "Very strong score. Comfortably within target rank of <150!" };
    if (scoreVal >= 110) return { range: "151 - 400", message: "Solid performance. Good chance of securing premium colleges." };
    if (scoreVal >= 90) return { range: "401 - 1000", message: "Moderate rank. Highly viable for mainstream private universities." };
    if (scoreVal >= 70) return { range: "1001 - 2500", message: "Qualified. Eligible for admission in various regional colleges." };
    if (scoreVal >= 50) return { range: "2501 - 5000", message: "Sufficient to qualify. Work on weak areas to push above 110+." };
    return { range: "5000+", message: "Below benchmark. Focus on daily revision and PYQs to boost scores." };
  };

  const currentScore = parseFloat(predictScoreInput) || 0;
  const rankPrediction = handlePredictRank(currentScore);
  const estimatedRankNum = currentScore >= 170 ? 10 : currentScore >= 150 ? 30 : currentScore >= 130 ? 95 : currentScore >= 110 ? 250 : currentScore >= 90 ? 600 : currentScore >= 70 ? 1500 : 3500;

  // College distribution matching logic
  const filterPredictedColleges = () => {
    const results = { safe: [] as College[], moderate: [] as College[], dream: [] as College[] };
    const r = estimatedRankNum;
    const cat = collegeCategory;
    const br = collegeBranch;

    COLLEGES_DATA.forEach(col => {
      const cutoffObj = col.cutoffs[br];
      if (!cutoffObj) return;
      const cutoff = cutoffObj[cat];

      if (r < 0.7 * cutoff) {
        results.safe.push(col);
      } else if (r >= 0.7 * cutoff && r <= 1.25 * cutoff) {
        results.moderate.push(col);
      } else if (r > 1.25 * cutoff && r <= 2.2 * cutoff) {
        results.dream.push(col);
      }
    });

    return results;
  };

  const collegePredictions = filterPredictedColleges();

  return (
    <div className="space-y-8 select-none" id="ecet-companion-hub">
      {/* ECET Target Benchmarks Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-slate-450 block font-extrabold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-indigo-500" />
            <span>Goal</span>
          </span>
          <span className="text-slate-900 font-black text-xs sm:text-[13px] block mt-2 leading-snug">
            B.Tech through ECET
          </span>
          <span className="text-[9px] text-slate-400 block mt-1 font-bold uppercase tracking-wider">
            Diploma → B.Tech
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between relative group">
          <span className="text-slate-455 block font-extrabold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>Days Remaining</span>
          </span>
          {isEditingMetrics ? (
            <input
              type="number"
              value={metricDaysInput}
              onChange={(e) => setMetricDaysInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-bold mt-2"
            />
          ) : (
            <span className="text-slate-900 font-black text-xl block mt-2 font-mono">
              {daysRemaining} <span className="text-[9px] text-slate-450 font-extrabold uppercase">Days</span>
            </span>
          )}
          <span className="text-[9px] text-slate-400 block mt-1 font-bold uppercase tracking-wider">
            Countdown to Exam
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between relative group">
          <span className="text-slate-455 block font-extrabold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Target</span>
          </span>
          {isEditingMetrics ? (
            <div className="flex gap-1 items-center mt-2">
              <input
                type="number"
                step="0.5"
                value={metricStudyLoggedInput}
                onChange={(e) => setMetricStudyLoggedInput(e.target.value)}
                className="w-12 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold"
                title="Logged"
              />
              <span className="text-[9px] text-slate-400">/</span>
              <input
                type="number"
                step="1"
                value={metricTargetHoursInput}
                onChange={(e) => setMetricTargetHoursInput(e.target.value)}
                className="w-10 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold"
                title="Target"
              />
            </div>
          ) : (
            <span className="text-slate-900 font-black text-xl block mt-2 font-mono flex items-baseline gap-1">
              {studyHoursLogged} <span className="text-xs text-slate-400 font-bold">/ {dailyTarget} Hrs</span>
            </span>
          )}
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (studyHoursLogged / dailyTarget) * 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between relative group">
          <span className="text-slate-455 block font-extrabold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Mock Test Rank</span>
          </span>
          {isEditingMetrics ? (
            <input
              type="number"
              value={metricMockRankInput}
              onChange={(e) => setMetricMockRankInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-bold mt-2"
            />
          ) : (
            <span className="text-slate-900 font-black text-xl block mt-2 font-mono text-blue-600">
              #{mockRank}
            </span>
          )}
          <span className="text-[9px] text-slate-400 block mt-1 font-bold uppercase tracking-wider">
            Current Standings
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between relative group">
          <span className="text-slate-455 block font-extrabold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Target Rank</span>
          </span>
          {isEditingMetrics ? (
            <input
              type="text"
              value={metricTargetRankInput}
              onChange={(e) => setMetricTargetRankInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-bold mt-2"
            />
          ) : (
            <span className="text-emerald-600 font-black text-xl block mt-2 font-mono">
              &lt;{targetRank}
            </span>
          )}
          <span className="text-[9px] text-slate-400 block mt-1 font-bold uppercase tracking-wider">
            Aim State Rank
          </span>
        </div>
      </div>

      {/* Edit and Actions for Goals */}
      <div className="flex justify-end select-none mt-[-1rem]">
        {isEditingMetrics ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDaysRemaining(parseInt(metricDaysInput) || 132);
                setDailyTarget(parseFloat(metricTargetHoursInput) || 4);
                setStudyHoursLogged(parseFloat(metricStudyLoggedInput) || 2.5);
                setTargetRank(parseInt(metricTargetRankInput.replace('<', '')) || 150);
                setMockRank(parseInt(metricMockRankInput) || 315);
                setIsEditingMetrics(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Save Stats
            </button>
            <button
              onClick={() => {
                setMetricDaysInput(daysRemaining.toString());
                setMetricTargetHoursInput(dailyTarget.toString());
                setMetricStudyLoggedInput(studyHoursLogged.toString());
                setMetricTargetRankInput(`<${targetRank}`);
                setMetricMockRankInput(mockRank.toString());
                setIsEditingMetrics(false);
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingMetrics(true)}
            className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 hover:text-indigo-600 flex items-center gap-1 border border-slate-200 hover:border-indigo-150 px-2.5 py-1 rounded-lg bg-white transition cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>Modify Prep Benchmarks</span>
          </button>
        )}
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex flex-wrap items-center gap-1 shadow-2xs">
        <button
          onClick={() => setActiveTab('PLANNER')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
            activeTab === 'PLANNER' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>ECET Planner & Trackers</span>
        </button>

        <button
          onClick={() => setActiveTab('STUDY')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
            activeTab === 'STUDY' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Daily Revision & Materials</span>
        </button>

        <button
          onClick={() => setActiveTab('PREDICTORS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
            activeTab === 'PREDICTORS' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Rank & College Predictor</span>
        </button>

        <button
          onClick={() => setActiveTab('PAST_PAPERS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
            activeTab === 'PAST_PAPERS' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PYQs Solved Library</span>
        </button>
      </div>

      {/* CONDITIONAL RENDERING OF SECTIONS */}

      {/* PLANNER TAB */}
      {activeTab === 'PLANNER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in animate-duration-150">
          {/* Automatic Schedules Generation Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-indigo-600" />
                <span>ECET Custom Planner</span>
              </h4>
              <p className="text-xs text-slate-450 font-semibold">Custom dynamic study timetable generated for Diploma lateral entry candidates.</p>
            </div>

            {/* Timetable Sub-tab Pickers */}
            <div className="flex border border-slate-150 rounded-xl p-1 bg-slate-50">
              {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setPlannerScheduleTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition ${
                    plannerScheduleTab === tab ? 'bg-white text-indigo-700 shadow-3xs font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab} Schedule
                </button>
              ))}
            </div>

            {/* Schedule List */}
            <div className="space-y-3 font-semibold text-xs text-slate-750">
              {plannerScheduleTab === 'DAILY' && (
                <div className="space-y-2.5">
                  <div className="border-l-2 border-indigo-500 pl-3 py-1 bg-indigo-50/25 rounded-r-lg">
                    <span className="font-mono text-[10px] text-indigo-600 block uppercase font-bold">06:00 AM - 07:30 AM (Formula Drill)</span>
                    <span className="text-slate-900 block font-bold">Mathematics Formula Recap & Practice</span>
                    <span className="text-[10.5px] text-slate-500 block">Limits, matrices, and inverse Laplace integrals.</span>
                  </div>
                  <div className="border-l-2 border-amber-500 pl-3 py-1 bg-amber-50/25 rounded-r-lg">
                    <span className="font-mono text-[10px] text-amber-600 block uppercase font-bold">09:30 AM - 11:30 AM (Core Networks)</span>
                    <span className="text-slate-900 block font-bold">Electrical Networks: Theorems & Transient Response</span>
                    <span className="text-[10.5px] text-slate-500 block">Solve previous years Norton and Thevenin equivalent loops.</span>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-3 py-1 bg-blue-50/25 rounded-r-lg">
                    <span className="font-mono text-[10px] text-blue-600 block uppercase font-bold">02:00 PM - 04:00 PM (Core CSE)</span>
                    <span className="text-slate-900 block font-bold">Digital Electronics & Microprocessors Assembly</span>
                    <span className="text-[10.5px] text-slate-500 block">8086 Instruction segment register mapping & logic Gates.</span>
                  </div>
                  <div className="border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-50/25 rounded-r-lg">
                    <span className="font-mono text-[10px] text-emerald-600 block uppercase font-bold">07:30 PM - 09:00 PM (Active Recall)</span>
                    <span className="text-slate-900 block font-bold">Mock Practice & Wrong Answers Review</span>
                    <span className="text-[10.5px] text-slate-500 block">Revise incorrect questions from today's simulated test.</span>
                  </div>
                </div>
              )}

              {plannerScheduleTab === 'WEEKLY' && (
                <div className="space-y-2.5">
                  <div className="p-3 border border-slate-150 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 text-[11px] uppercase flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Mon & Tue: Mathematics Core Strength</span>
                    <p className="text-slate-500 text-[10.5px] leading-relaxed">Focus on integration derivations, differential equations of higher orders, and Laplace transforms.</p>
                  </div>
                  <div className="p-3 border border-slate-150 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 text-[11px] uppercase flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Wed & Thu: Electrical Networks & Digital Logic</span>
                    <p className="text-slate-500 text-[10.5px] leading-relaxed">Study Transient analysis, Two-Port network parameters, flip-flops, multiplexers, and decoders.</p>
                  </div>
                  <div className="p-3 border border-slate-150 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 text-[11px] uppercase flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Fri & Sat: Microprocessors & Physics/Chem PYQs</span>
                    <p className="text-slate-500 text-[10.5px] leading-relaxed">Practice 8086 BIU/EU assembly codes, units and dimensions, Work Power Energy, and corrosion chemistry notes.</p>
                  </div>
                  <div className="p-3 bg-indigo-50/30 border border-indigo-150/60 rounded-xl space-y-1">
                    <span className="font-bold text-indigo-950 text-[11px] uppercase flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-indigo-600" /> Sunday: Full 200-Question Mock Test</span>
                    <p className="text-slate-650 text-[10.5px] leading-relaxed">Take a full length CBT mock test, review weak areas, and log metrics to forecast ranks.</p>
                  </div>
                </div>
              )}

              {plannerScheduleTab === 'MONTHLY' && (
                <div className="space-y-3">
                  <div className="relative pl-6 pb-2 border-l border-slate-200">
                    <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase">Month 1: Syllabus Core Completion</span>
                    <p className="text-slate-500 text-[10.5px] leading-relaxed mt-0.5">Focus on thorough core concepts (DE, Networks, Math properties) and complete 1 simulated Mock test per week.</p>
                  </div>
                  <div className="relative pl-6 pb-2 border-l border-slate-200">
                    <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase">Month 2: Year-Wise PYQs & Chapter Drills</span>
                    <p className="text-slate-500 text-[10.5px] leading-relaxed mt-0.5">Solve state past question papers from 2022, 2023, and 2024. Perform detailed chapter-wise subtopic checklists.</p>
                  </div>
                  <div className="relative pl-6 pb-2">
                    <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase">Month 3: Elite Speed and Strategy Drills</span>
                    <p className="text-slate-500 text-[10.5px] leading-relaxed mt-0.5">Take active 180-min CBT exams. Reduce time-taken per question, review weak metrics, and target Rank top 50 standings.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subject Tracker with Checklists */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4.5 h-4.5 text-indigo-600" />
                <span>Subject & Subtopic Trackers</span>
              </h4>
              <p className="text-xs text-slate-450 font-semibold">Expand each core syllabus domain to toggle completed chapters and automatically update percentages.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mathematics Card */}
              <div className="border border-slate-200 rounded-2xl p-4.5 space-y-3 hover:border-indigo-150 transition">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase">Mathematics</span>
                  <span className="font-mono text-xs font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full">{mathPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${mathPercentage}%` }}></div>
                </div>
                <button
                  onClick={() => setExpandedTracker(expandedTracker === 'Mathematics' ? null : 'Mathematics')}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>{expandedTracker === 'Mathematics' ? 'Hide Subtopics' : 'Manage Subtopics'}</span>
                  {expandedTracker === 'Mathematics' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Digital Electronics Card */}
              <div className="border border-slate-200 rounded-2xl p-4.5 space-y-3 hover:border-indigo-150 transition">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase">Digital Electronics</span>
                  <span className="font-mono text-xs font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full">{dePercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${dePercentage}%` }}></div>
                </div>
                <button
                  onClick={() => setExpandedTracker(expandedTracker === 'DE' ? null : 'DE')}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>{expandedTracker === 'DE' ? 'Hide Subtopics' : 'Manage Subtopics'}</span>
                  {expandedTracker === 'DE' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Networks Card */}
              <div className="border border-slate-200 rounded-2xl p-4.5 space-y-3 hover:border-indigo-150 transition">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase">Electrical Networks</span>
                  <span className="font-mono text-xs font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full">{networksPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${networksPercentage}%` }}></div>
                </div>
                <button
                  onClick={() => setExpandedTracker(expandedTracker === 'Networks' ? null : 'Networks')}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>{expandedTracker === 'Networks' ? 'Hide Subtopics' : 'Manage Subtopics'}</span>
                  {expandedTracker === 'Networks' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Microprocessors Card */}
              <div className="border border-slate-200 rounded-2xl p-4.5 space-y-3 hover:border-indigo-150 transition">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase">Microprocessors</span>
                  <span className="font-mono text-xs font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full">{mpPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${mpPercentage}%` }}></div>
                </div>
                <button
                  onClick={() => setExpandedTracker(expandedTracker === 'MP' ? null : 'MP')}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>{expandedTracker === 'MP' ? 'Hide Subtopics' : 'Manage Subtopics'}</span>
                  {expandedTracker === 'MP' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Expanded Checklist Subtopics panel */}
            {expandedTracker && (
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-3 animate-scale-in">
                <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span>Syllabus Checklist: {expandedTracker}</span>
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                  {expandedTracker === 'Mathematics' && mathSubtopics.map((item, idx) => (
                    <label key={idx} className="flex items-center space-x-2 bg-white border border-slate-150 p-2.5 rounded-xl cursor-pointer hover:border-indigo-150 transition">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          const updated = [...mathSubtopics];
                          updated[idx].completed = e.target.checked;
                          setMathSubtopics(updated);
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800'}>{item.name}</span>
                    </label>
                  ))}

                  {expandedTracker === 'DE' && deSubtopics.map((item, idx) => (
                    <label key={idx} className="flex items-center space-x-2 bg-white border border-slate-150 p-2.5 rounded-xl cursor-pointer hover:border-indigo-150 transition">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          const updated = [...deSubtopics];
                          updated[idx].completed = e.target.checked;
                          setDeSubtopics(updated);
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800'}>{item.name}</span>
                    </label>
                  ))}

                  {expandedTracker === 'Networks' && networksSubtopics.map((item, idx) => (
                    <label key={idx} className="flex items-center space-x-2 bg-white border border-slate-150 p-2.5 rounded-xl cursor-pointer hover:border-indigo-150 transition">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          const updated = [...networksSubtopics];
                          updated[idx].completed = e.target.checked;
                          setNetworksSubtopics(updated);
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800'}>{item.name}</span>
                    </label>
                  ))}

                  {expandedTracker === 'MP' && mpSubtopics.map((item, idx) => (
                    <label key={idx} className="flex items-center space-x-2 bg-white border border-slate-150 p-2.5 rounded-xl cursor-pointer hover:border-indigo-150 transition">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          const updated = [...mpSubtopics];
                          updated[idx].completed = e.target.checked;
                          setMpSubtopics(updated);
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800'}>{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDY TAB */}
      {activeTab === 'STUDY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in animate-duration-150">
          {/* Daily Revision (Morning Kickstart) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4.5 h-4.5 text-indigo-600" />
                <span>Morning Revision Kickstart</span>
              </h4>
              <p className="text-xs text-slate-450 font-semibold">Active recall checklists and quizzes to study every morning before starting core practice.</p>
            </div>

            {/* Tasks list */}
            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <label className="flex items-center space-x-3 border border-slate-150 p-3 rounded-xl hover:border-indigo-150 cursor-pointer bg-slate-50/30">
                <input
                  type="checkbox"
                  checked={revisionCompleted}
                  onChange={(e) => setRevisionCompleted(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5 cursor-pointer"
                />
                <div className="flex-1">
                  <span className={`block font-bold text-slate-900 ${revisionCompleted ? 'line-through text-slate-400' : ''}`}>Today's Revision Focus</span>
                  <span className="text-slate-500 text-[10.5px]">Microprocessor 8086 Instruction segment boundaries and memory BIU configurations.</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 border border-slate-150 p-3 rounded-xl hover:border-indigo-150 cursor-pointer bg-slate-50/30">
                <input
                  type="checkbox"
                  checked={pyqsCompleted}
                  onChange={(e) => setPyqsCompleted(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5 cursor-pointer"
                />
                <div className="flex-1">
                  <span className={`block font-bold text-slate-900 ${pyqsCompleted ? 'line-through text-slate-400' : ''}`}>Today's PYQs Challenge</span>
                  <span className="text-slate-500 text-[10.5px]">Solve at least 3 Transient Analysis questions from the 2024 Question Booklet.</span>
                </div>
              </label>

              <div className="border border-slate-150 p-4 rounded-xl space-y-3 bg-slate-50/30">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-slate-900 text-xs">Today's Practice Mini-Quiz</span>
                    <span className="text-slate-500 text-[10px]">Test your speed on 5 quick-fire, multiple-choice questions.</span>
                  </div>
                  {!quizStarted && !quizCompleted && (
                    <button
                      onClick={() => setQuizStarted(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer"
                    >
                      Start Quiz
                    </button>
                  )}
                </div>

                {/* Interactive Mini-Quiz Body */}
                {quizStarted && !quizCompleted && (
                  <div className="border-t border-slate-150 pt-3 space-y-4 text-xs animate-scale-in">
                    <div className="bg-white p-3 rounded-xl border border-indigo-100">
                      <p className="font-extrabold text-slate-900 mb-2.5">
                        Answer the questions below to finish today's checklist:
                      </p>
                      
                      <div className="space-y-4">
                        {miniQuizQuestions.map((qObj, qIdx) => (
                          <div key={qIdx} className="space-y-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                            <p className="font-bold text-slate-800">{qIdx + 1}. {qObj.q}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {qObj.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                  }}
                                  className={`p-2 rounded-lg border text-left font-semibold text-[10.5px] transition-all cursor-pointer ${
                                    quizAnswers[qIdx] === optIdx 
                                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' 
                                      : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setQuizStarted(false);
                          setQuizAnswers({});
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider py-2 px-3 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          let score = 0;
                          miniQuizQuestions.forEach((q, idx) => {
                            if (quizAnswers[idx] === q.correct) score++;
                          });
                          setQuizScore(score);
                          setQuizCompleted(true);
                          setQuizTaskCompleted(score >= 4);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-4 rounded-lg cursor-pointer shadow-xs"
                      >
                        Submit Answers
                      </button>
                    </div>
                  </div>
                )}

                {/* Mini-Quiz Results */}
                {quizCompleted && (
                  <div className="border-t border-slate-150 pt-3 space-y-3 animate-scale-in">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="block font-black text-emerald-800 text-sm">Quiz Evaluation: {quizScore} / 5</span>
                        <span className="block text-[10.5px] text-emerald-700">
                          {quizScore >= 4 ? 'Fantastic job! Revision checklist requirement met.' : 'Practice further. Try reviewing explanations below.'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setQuizCompleted(false);
                          setQuizStarted(true);
                          setQuizAnswers({});
                        }}
                        className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-extrabold text-[9px] uppercase tracking-wider py-1 px-2 rounded cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                    </div>

                    {/* Explanations review */}
                    <details className="text-[10px] font-semibold text-slate-650 bg-slate-100 p-2 rounded-lg cursor-pointer">
                      <summary className="text-slate-800 font-bold uppercase tracking-wider select-none">View Solutions & Key Derivations</summary>
                      <div className="space-y-3 pt-2 pl-1 border-t border-slate-200 mt-2">
                        {miniQuizQuestions.map((q, idx) => (
                          <div key={idx} className="space-y-1">
                            <p className="font-bold text-slate-900">{idx + 1}. {q.q}</p>
                            <p className="text-emerald-700">Correct Choice: <span className="font-extrabold">{q.options[q.correct]}</span></p>
                            <p className="text-slate-500 italic font-medium leading-relaxed">Explanation: {q.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Study Material Hub */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                <span>Reference Study Material</span>
              </h4>
              <p className="text-xs text-slate-450 font-semibold">Access instant interactive formula keys, exam summaries, and revision flashcards.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveMaterial('NOTES')}
                className="p-4 rounded-xl border border-slate-200 text-left space-y-2 hover:border-indigo-200 hover:bg-indigo-50/10 cursor-pointer group transition"
              >
                <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg w-fit transition group-hover:scale-105">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black text-slate-900 text-[11px] uppercase tracking-wide">Chapter Notes</span>
                  <span className="block text-[10px] text-slate-450 leading-snug">Essential core concepts summaries and textbook outlines.</span>
                </div>
              </button>

              <button
                onClick={() => setActiveMaterial('FORMULAS')}
                className="p-4 rounded-xl border border-slate-200 text-left space-y-2 hover:border-indigo-200 hover:bg-indigo-50/10 cursor-pointer group transition"
              >
                <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg w-fit transition group-hover:scale-105">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black text-slate-900 text-[11px] uppercase tracking-wide">Formula Sheets</span>
                  <span className="block text-[10px] text-slate-450 leading-snug">Quick cheat sheet of math, networks, and logic identities.</span>
                </div>
              </button>

              <button
                onClick={() => setActiveMaterial('FLASHCARDS')}
                className="p-4 rounded-xl border border-slate-200 text-left space-y-2 hover:border-indigo-200 hover:bg-indigo-50/10 cursor-pointer group transition col-span-2"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg w-fit transition group-hover:scale-105">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Interactive Deck</span>
                </div>
                <div>
                  <span className="block font-black text-slate-900 text-[11px] uppercase tracking-wide">Daily Active Recall Flash Cards</span>
                  <span className="block text-[10px] text-slate-450 leading-snug">Self-assessment flashcards with 3D flip animation for core ECET questions.</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREDICTORS TAB */}
      {activeTab === 'PREDICTORS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in animate-duration-150">
          {/* ECET Rank Predictor Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-indigo-600" />
                <span>ECET Rank Predictor</span>
              </h4>
              <p className="text-xs text-slate-450 font-semibold">Estimate your state rank based on expected CBT scores and see admission feasibility guidelines.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 select-none">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450">Input Mock Score (0 - 200)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={predictScoreInput}
                    onChange={(e) => setPredictScoreInput(e.target.value)}
                    className="flex-1 accent-indigo-600"
                  />
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={predictScoreInput}
                    onChange={(e) => setPredictScoreInput(e.target.value)}
                    className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-center text-slate-900"
                  />
                </div>
              </div>

              {/* Dynamic Predictor Result */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 text-center space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-600">Predicted TG-ECET State Rank</span>
                <span className="block text-3xl font-black font-mono text-indigo-950 animate-pulse">{rankPrediction.range}</span>
                <p className="text-slate-650 text-[11px] font-semibold leading-relaxed px-2">{rankPrediction.message}</p>
              </div>

              <div className="text-[10px] font-semibold leading-relaxed text-slate-450 bg-slate-50 p-3 rounded-xl border border-slate-150">
                <strong className="text-slate-700 block mb-1">Rank Estimation Metric:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>Scores above 150+ yield state ranks under &lt;50.</li>
                  <li>Syllabus coverage of 75%+ is crucial to cross 130+ marks.</li>
                  <li>Use Predicted Rank directly as dynamic inputs inside the College Predictor.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* College Predictor Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4.5 h-4.5 text-indigo-600" />
                <span>State College Predictor</span>
              </h4>
              <p className="text-xs text-slate-450 font-semibold">Forecast likely engineering college lateral seat allocations based on predicted state rank.</p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[8px] font-black uppercase tracking-wider text-slate-450">Calculated Rank</label>
                <input
                  type="number"
                  value={estimatedRankNum}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono text-slate-600 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-black uppercase tracking-wider text-slate-450">Category</label>
                <select
                  value={collegeCategory}
                  onChange={(e) => setCollegeCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="OC">OC (Open)</option>
                  <option value="BC">BC (OBC)</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-black uppercase tracking-wider text-slate-450">Region</label>
                <select
                  value={collegeRegion}
                  onChange={(e) => setCollegeRegion(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="OU">OU (Osmania)</option>
                  <option value="AU">AU (Andhra)</option>
                  <option value="SVU">SVU (SVK)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-black uppercase tracking-wider text-slate-450">Branch</label>
                <select
                  value={collegeBranch}
                  onChange={(e) => setCollegeBranch(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                </select>
              </div>
            </div>

            {/* Likelihood Tabs */}
            <div className="flex border-b border-slate-150 select-none">
              {(['SAFE', 'MODERATE', 'DREAM'] as const).map(tab => {
                let count = 0;
                if (tab === 'SAFE') count = collegePredictions.safe.length;
                if (tab === 'MODERATE') count = collegePredictions.moderate.length;
                if (tab === 'DREAM') count = collegePredictions.dream.length;

                return (
                  <button
                    key={tab}
                    onClick={() => setCollegePredictTab(tab)}
                    className={`pb-2.5 px-4 text-xs font-extrabold uppercase tracking-wider relative cursor-pointer transition ${
                      collegePredictTab === tab ? 'text-indigo-650 font-black' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <span>{tab} Colleges ({count})</span>
                    {collegePredictTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Colleges List */}
            <div className="space-y-2 text-xs font-semibold">
              {collegePredictTab === 'SAFE' && (
                collegePredictions.safe.length > 0 ? (
                  collegePredictions.safe.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-150 rounded-xl bg-slate-50/20 hover:border-emerald-200 transition">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-900 block">{col.name}</span>
                        <span className="text-slate-450 text-[10px] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{col.location} | Code: {col.code}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Safe Chance</span>
                        <span className="block text-[10.5px] text-slate-500 font-mono mt-0.5">Cutoff: {col.cutoffs[collegeBranch][collegeCategory]}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 font-medium">
                    No Safe Colleges predicted for current rank input. Secure higher marks to see matches here.
                  </div>
                )
              )}

              {collegePredictTab === 'MODERATE' && (
                collegePredictions.moderate.length > 0 ? (
                  collegePredictions.moderate.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-150 rounded-xl bg-slate-50/20 hover:border-amber-200 transition">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-900 block">{col.name}</span>
                        <span className="text-slate-450 text-[10px] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{col.location} | Code: {col.code}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Moderate Chance</span>
                        <span className="block text-[10.5px] text-slate-500 font-mono mt-0.5">Cutoff: {col.cutoffs[collegeBranch][collegeCategory]}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 font-medium">
                    No Moderate Colleges predicted. Try adjusting categories or target branches.
                  </div>
                )
              )}

              {collegePredictTab === 'DREAM' && (
                collegePredictions.dream.length > 0 ? (
                  collegePredictions.dream.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-150 rounded-xl bg-slate-50/20 hover:border-indigo-200 transition">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-900 block">{col.name}</span>
                        <span className="text-slate-450 text-[10px] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{col.location} | Code: {col.code}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Dream College</span>
                        <span className="block text-[10.5px] text-slate-500 font-mono mt-0.5">Cutoff: {col.cutoffs[collegeBranch][collegeCategory]}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 font-medium">
                    No Dream Colleges predicted. Ensure target score input is at least 90+ to evaluate prestigious centers.
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAST PAPERS TAB */}
      {activeTab === 'PAST_PAPERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs animate-fade-in animate-duration-150">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-indigo-600" />
                <span>Solved State PYQs Solved Library</span>
              </h4>
              <p className="text-xs text-slate-450 font-semibold">Examine state level past year papers year-wise, chapter-wise, and difficulty-wise.</p>
            </div>

            {/* Quick Stats */}
            <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Total Papers Solved: 5</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-slate-150 rounded-xl bg-slate-50 select-none">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-450">Filter by Year</label>
              <select
                value={paperYearFilter}
                onChange={(e) => setPaperYearFilter(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="ALL">All Years (2022 - 2024)</option>
                <option value="2024">2024 papers</option>
                <option value="2023">2023 papers</option>
                <option value="2022">2022 papers</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-450">Filter by Subject</label>
              <select
                value={paperSubjectFilter}
                onChange={(e) => setPaperSubjectFilter(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="ALL">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science & CSE</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-450">Filter by Difficulty</label>
              <select
                value={paperDifficultyFilter}
                onChange={(e) => setPaperDifficultyFilter(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAPERS_DATA.filter(paper => {
              if (paperYearFilter !== 'ALL' && paper.year !== paperYearFilter) return false;
              if (paperSubjectFilter !== 'ALL' && paper.subject !== paperSubjectFilter) return false;
              if (paperDifficultyFilter !== 'ALL' && paper.difficulty !== paperDifficultyFilter) return false;
              return true;
            }).map((paper, idx) => (
              <div key={paper.id} className="border border-slate-200 hover:border-indigo-150 p-5 rounded-2xl bg-white shadow-3xs flex flex-col justify-between space-y-4 hover:shadow-2xs transition">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400">{paper.year} | {paper.subject}</span>
                    <span className={`px-2 py-0.5 rounded-full font-extrabold ${
                      paper.difficulty === 'HARD' ? 'bg-red-50 text-red-700' : paper.difficulty === 'MEDIUM' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>{paper.difficulty}</span>
                  </div>
                  <h5 className="font-black text-slate-900 text-sm tracking-tight leading-tight">{paper.title}</h5>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">{paper.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 select-none">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{paper.questions.length} Solved Questions</span>
                  <button
                    onClick={() => setViewingPaperDetail(paper)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer transition flex items-center space-x-1"
                  >
                    <span>View Solutions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED PYQ PAPER MODAL OVERLAY */}
      {viewingPaperDetail && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <header className="bg-slate-900 text-white p-5 flex justify-between items-center select-none">
              <div className="space-y-0.5">
                <span className="text-[9px] font-extrabold uppercase text-indigo-400 tracking-widest font-mono">TG-ECET Solutions Key</span>
                <h4 className="font-extrabold text-sm tracking-tight">{viewingPaperDetail.title}</h4>
              </div>
              <button
                onClick={() => setViewingPaperDetail(null)}
                className="text-slate-400 hover:text-white font-extrabold text-xs bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg cursor-pointer transition uppercase tracking-wider"
              >
                Close
              </button>
            </header>

            {/* Scrollable solutions */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              <p className="text-xs text-slate-500 italic border-b border-slate-150 pb-3">
                Review verified step-by-step solutions for this paper prepared by standard State board experts:
              </p>

              {viewingPaperDetail.questions.map((q, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-3xs">
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">Solved Q-{q.num}</span>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm leading-relaxed">{q.text}</p>
                  
                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border font-semibold flex items-center justify-between ${
                          optIdx === q.ansIdx 
                            ? 'bg-emerald-50/50 border-emerald-300 text-emerald-800 font-bold' 
                            : 'border-slate-200 bg-slate-50/20 text-slate-600'
                        }`}
                      >
                        <span>{opt}</span>
                        {optIdx === q.ansIdx && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step-by-step derivation */}
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-1 text-xs">
                    <strong className="text-slate-800 block font-bold text-[11px] uppercase tracking-wider">Step-by-Step Derivation:</strong>
                    <p className="text-slate-500 font-medium leading-relaxed italic">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FLASH CARDS INTERACTIVE OVERLAY */}
      {activeMaterial === 'FLASHCARDS' && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl animate-scale-in">
            <header className="bg-slate-900 text-white p-4.5 flex justify-between items-center select-none">
              <span className="font-extrabold text-xs uppercase tracking-wider">Syllabus Active Recall Deck</span>
              <button
                onClick={() => {
                  setActiveMaterial(null);
                  setIsFlipped(false);
                }}
                className="text-slate-400 hover:text-white font-extrabold text-[10px] bg-slate-800 px-2.5 py-1.5 rounded-lg cursor-pointer transition uppercase"
              >
                Exit Deck
              </button>
            </header>

            <div className="p-6 space-y-6 text-center select-none">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{flashcardsDeck[flashcardIdx].subject}</span>
                <span>Card {flashcardIdx + 1} / {flashcardsDeck.length}</span>
              </div>

              {/* 3D Flipping container */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-52 cursor-pointer relative transition-transform duration-500 select-none border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 p-5 flex flex-col items-center justify-center shadow-3xs"
              >
                {!isFlipped ? (
                  <div className="space-y-2 animate-fade-in">
                    <span className="block text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-fit mx-auto">Front Side</span>
                    <p className="font-black text-slate-900 text-sm leading-relaxed px-4">{flashcardsDeck[flashcardIdx].front}</p>
                    <span className="block text-[9px] text-slate-400 italic mt-4">Click Card to Reveal Answer</span>
                  </div>
                ) : (
                  <div className="space-y-2 animate-fade-in">
                    <span className="block text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mx-auto">Correct Answer</span>
                    <p className="font-extrabold text-slate-800 text-xs sm:text-sm leading-relaxed px-4">{flashcardsDeck[flashcardIdx].back}</p>
                    <span className="block text-[9px] text-slate-400 italic mt-4">Click Card to Flip Back</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIdx(prev => Math.max(0, prev - 1));
                  }}
                  disabled={flashcardIdx === 0}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-650 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition disabled:cursor-not-allowed"
                >
                  Previous Card
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIdx(prev => Math.min(flashcardsDeck.length - 1, prev + 1));
                  }}
                  disabled={flashcardIdx === flashcardsDeck.length - 1}
                  className="flex-1 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition disabled:cursor-not-allowed"
                >
                  Next Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULA SHEETS OVERLAY */}
      {activeMaterial === 'FORMULAS' && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in">
            <header className="bg-slate-900 text-white p-4.5 flex justify-between items-center select-none">
              <span className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4.5 h-4.5 text-indigo-400" />
                <span>ECET Formula Reference Guide</span>
              </span>
              <button
                onClick={() => setActiveMaterial(null)}
                className="text-slate-400 hover:text-white font-extrabold text-[10px] bg-slate-800 px-2.5 py-1.5 rounded-lg cursor-pointer transition uppercase"
              >
                Close
              </button>
            </header>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Mathematics Formularies */}
              <div className="space-y-3">
                <strong className="text-slate-900 text-xs uppercase tracking-wider border-b border-slate-150 pb-1 block">1. Mathematics Formulas</strong>
                <div className="bg-slate-50 p-3 rounded-xl space-y-2 font-mono text-[10.5px] text-slate-700">
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Laplace f'(t):</span> <span>L{'{'}f'(t){'}'} = s*L{'{'}f(t){'}'} - f(0)</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">L{'{'}e^(at){'}'}:</span> <span>1 / (s - a)</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Matrix Prod:</span> <span>A * Adj(A) = |A| * I</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Derivative ln(sec x + tan x):</span> <span>sec(x)</span></p>
                </div>
              </div>

              {/* Electrical Networks Formularies */}
              <div className="space-y-3">
                <strong className="text-slate-900 text-xs uppercase tracking-wider border-b border-slate-150 pb-1 block">2. Electrical Networks</strong>
                <div className="bg-slate-50 p-3 rounded-xl space-y-2 font-mono text-[10.5px] text-slate-700">
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Resonant Frequency:</span> <span>Fr = 1 / (2 * pi * sqrt(L * C))</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Quality Factor (Q):</span> <span>Q = (1 / R) * sqrt(L / C)</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Max Power RL:</span> <span>RL = RS (for pure resistive)</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Resonance Condition:</span> <span>XL = XC</span></p>
                </div>
              </div>

              {/* Digital Electronics Formularies */}
              <div className="space-y-3">
                <strong className="text-slate-900 text-xs uppercase tracking-wider border-b border-slate-150 pb-1 block">3. Digital Logic & Gates</strong>
                <div className="bg-slate-50 p-3 rounded-xl space-y-2 font-mono text-[10.5px] text-slate-700">
                  <p className="flex justify-between"><span className="font-bold text-slate-900">De Morgan I:</span> <span>(A + B)' = A' * B'</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">De Morgan II:</span> <span>(A * B)' = A' + B'</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Boolean law:</span> <span>A + A'B = A + B</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-900">Mux select lines:</span> <span>2^s = Inputs</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER NOTES OVERLAY */}
      {activeMaterial === 'NOTES' && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in">
            <header className="bg-slate-900 text-white p-4.5 flex justify-between items-center select-none">
              <span className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-indigo-400" />
                <span>Quick-Review Chapter Notes</span>
              </span>
              <button
                onClick={() => setActiveMaterial(null)}
                className="text-slate-400 hover:text-white font-extrabold text-[10px] bg-slate-800 px-2.5 py-1.5 rounded-lg cursor-pointer transition uppercase"
              >
                Close
              </button>
            </header>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-xs text-slate-700 font-semibold leading-relaxed">
              <div className="space-y-2">
                <strong className="text-slate-900 text-xs block uppercase">8086 Pipelining & BIU Instruction Queue</strong>
                <p className="text-slate-500 font-medium">The 8086 microprocessor is split into the Bus Interface Unit (BIU) and the Execution Unit (EU). The BIU fetches instructions in advance from memory and places them into a 6-byte instruction queue (called pre-fetch queue). Pipelining significantly improves speed by overlapping instruction fetching and execution phases.</p>
              </div>

              <div className="space-y-2 border-t border-slate-150 pt-4">
                <strong className="text-slate-900 text-xs block uppercase">Thevenin & Norton Equivalent Theorem dualities</strong>
                <p className="text-slate-500 font-medium">Any linear active DC network can be replaced by a single voltage source Vth in series with Rth (Thevenin), or by a single current source In in parallel with Rth (Norton). The relationship between Vth and In is defined by Vth = In * Rth.</p>
              </div>

              <div className="space-y-2 border-t border-slate-150 pt-4">
                <strong className="text-slate-900 text-xs block uppercase">Matrices & Linear Determinants</strong>
                <p className="text-slate-500 font-medium">A square matrix possesses an inverse only if its determinant is non-zero (non-singular). Cramer's Rule solves systems of linear equations using quotients of determinants. Standard properties of determinants: det(A*B) = det(A) * det(B) and det(k*A) = (k^n) * det(A) for n x n matrix.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
