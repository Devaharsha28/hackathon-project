import React, { useState, useEffect } from 'react';
import { 
  Award, Clock, BookOpen, User, Edit2, Play, 
  RotateCcw, Sparkles, TrendingUp, BarChart3, AlertCircle, CheckCircle, ChevronRight, HelpCircle,
  Calendar, GraduationCap, FileText, CheckSquare, Layers, Zap, Target, Search, ArrowRight,
  ShieldCheck, MapPin, Sliders, ChevronDown, ChevronUp, RefreshCw, Star, Info
} from 'lucide-react';
import { SubjectSection } from '../types';
import ECETCompanionHub from './ECETCompanionHub';

interface AttemptHistory {
  id: string;
  name: string;
  date: string;
  totalScore: number;
  accuracy: number;
  timeTakenMinutes: number;
  scores: Record<string, number>;
}

interface DashboardScreenProps {
  onStartExam: (name: string, roll: string, mode: 'MOCK' | 'SUBJECT', subject?: SubjectSection) => void;
  candidateName: string;
  rollNumber: string;
  onUpdateProfile: (name: string, roll: string) => void;
}

// Initial mock data to display when no previous real tests are stored
const DEFAULT_HISTORY: AttemptHistory[] = [
  {
    id: 'mock-1',
    name: 'Practice Mock Test 1',
    date: '3 days ago',
    totalScore: 115,
    accuracy: 58,
    timeTakenMinutes: 142,
    scores: {
      'Mathematics': 28,
      'Physics': 15,
      'Chemistry': 14,
      'Computer Science': 58
    }
  },
  {
    id: 'mock-2',
    name: 'Practice Mock Test 2',
    date: '2 days ago',
    totalScore: 138,
    accuracy: 69,
    timeTakenMinutes: 165,
    scores: {
      'Mathematics': 35,
      'Physics': 18,
      'Chemistry': 17,
      'Computer Science': 68
    }
  },
  {
    id: 'mock-3',
    name: 'Practice Mock Test 3',
    date: 'Yesterday',
    totalScore: 154,
    accuracy: 77,
    timeTakenMinutes: 155,
    scores: {
      'Mathematics': 39,
      'Physics': 21,
      'Chemistry': 19,
      'Computer Science': 75
    }
  }
];

export interface PreviousPaper {
  id: string;
  title: string;
  year: string;
  subject: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionsCount: number;
  description: string;
  questions: {
    num: number;
    text: string;
    options: string[];
    ansIdx: number;
    explanation: string;
  }[];
}

export const PAPERS_DATA: PreviousPaper[] = [
  {
    id: 'p-2024',
    title: '2024 Official TG-ECET CSE Question Paper',
    year: '2024',
    subject: 'Computer Science',
    difficulty: 'HARD',
    questionsCount: 200,
    description: 'The official state entrance common engineering question booklet from the 2024 cycle.',
    questions: [
      {
        num: 1,
        text: 'What is the standard size of the instruction queue in 8086 microprocessor?',
        options: ['4 bytes', '6 bytes', '8 bytes', '12 bytes'],
        ansIdx: 1,
        explanation: 'The Instruction Queue in the Bus Interface Unit (BIU) of 8086 microprocessor is 6 bytes long. It is used to pre-fetch instructions to enable pipelining.'
      },
      {
        num: 2,
        text: 'Which of the following is NOT a valid addressing mode of 8086?',
        options: ['Direct Addressing', 'Indexed Register Addressing', 'Register Relative Addressing', 'Virtual Indirect Addressing'],
        ansIdx: 3,
        explanation: 'Virtual Indirect is not a valid addressing mode. The valid memory addressing modes of 8086 include direct, register indirect, based, indexed, based-indexed, and relative.'
      },
      {
        num: 3,
        text: 'In standard electrical Networks, the resonant frequency (Fr) of a series RLC circuit is:',
        options: ['1 / (2 * pi * L * C)', '1 / (2 * pi * sqrt(L * C))', '2 * pi * sqrt(L * C)', 'sqrt(L * C) / (2 * pi)'],
        ansIdx: 1,
        explanation: 'At resonance, inductive reactance equals capacitive reactance: XL = XC => 2*pi*f*L = 1/(2*pi*f*C), which yields Fr = 1 / (2 * pi * sqrt(L * C)).'
      }
    ]
  },
  {
    id: 'p-2023',
    title: '2023 Official TG-ECET CSE Question Paper',
    year: '2023',
    subject: 'Computer Science',
    difficulty: 'MEDIUM',
    questionsCount: 200,
    description: 'Official test paper from the 2023 state entrance exam conducted by TSCHE.',
    questions: [
      {
        num: 1,
        text: 'Which interrupt has the absolute highest priority in 8085 microprocessor?',
        options: ['TRAP (RST 4.5)', 'RST 7.5', 'RST 6.5', 'INTR'],
        ansIdx: 0,
        explanation: 'TRAP has the absolute highest priority of all interrupts in 8085. It is non-maskable and edge-and-level triggered.'
      },
      {
        num: 2,
        text: 'A 1-to-16 demultiplexer requires how many selection control lines?',
        options: ['2', '3', '4', '16'],
        ansIdx: 2,
        explanation: 'A demultiplexer has 1 input and 2^n outputs, where n is the number of select lines. Since 2^4 = 16, exactly 4 select lines are required.'
      }
    ]
  },
  {
    id: 'p-2022',
    title: '2022 Official TG-ECET CSE Question Paper',
    year: '2022',
    subject: 'Computer Science',
    difficulty: 'MEDIUM',
    questionsCount: 200,
    description: 'Official state examination paper from 2022.',
    questions: [
      {
        num: 1,
        text: 'The derivative of ln(sec(x) + tan(x)) with respect to x is:',
        options: ['sec(x)', 'tan(x)', 'sec(x) + tan(x)', 'sec^2(x)'],
        ansIdx: 0,
        explanation: 'd/dx [ln(sec x + tan x)] = 1/(sec x + tan x) * (sec x * tan x + sec^2 x) = sec x * (tan x + sec x) / (sec x + tan x) = sec x.'
      }
    ]
  },
  {
    id: 'p-math',
    title: 'Chapter PYQ: Matrices & Determinants',
    year: '2024',
    subject: 'Mathematics',
    difficulty: 'EASY',
    questionsCount: 15,
    description: 'Compilation of exam questions specifically from the Matrices & Determinants chapters.',
    questions: [
      {
        num: 1,
        text: 'For any square matrix A, the product of A and its adjoint matrix yields:',
        options: ['|A| * I', 'I', 'A^2', '|A|^2 * I'],
        ansIdx: 0,
        explanation: 'By standard matrix properties, A * Adj(A) = Adj(A) * A = |A| * I, where |A| is the determinant and I is the Identity matrix.'
      }
    ]
  },
  {
    id: 'p-net',
    title: 'Chapter PYQ: Network Theorems & Laws',
    year: '2023',
    subject: 'Computer Science',
    difficulty: 'HARD',
    questionsCount: 20,
    description: 'Specialized chapterwise collection of KCL/KVL, Thevenin, Norton, and Maximum Power theorems.',
    questions: [
      {
        num: 1,
        text: 'Maximum power is transferred from source to load when:',
        options: ['RL = RS', 'RL = 0', 'RL = RS / 2', 'RL = 2 * RS'],
        ansIdx: 0,
        explanation: 'The Maximum Power Transfer Theorem states that maximum power is transferred when load resistance RL is equal to source internal resistance RS.'
      }
    ]
  }
];

export interface College {
  name: string;
  code: string;
  location: string;
  cutoffs: {
    CSE: { OC: number; BC: number; SC: number; ST: number };
    ECE: { OC: number; BC: number; SC: number; ST: number };
    EEE: { OC: number; BC: number; SC: number; ST: number };
  };
}

export const COLLEGES_DATA: College[] = [
  {
    name: 'Osmania University College of Engineering (OUCE)',
    code: 'OUCE-HYD',
    location: 'Adikmet, Hyderabad',
    cutoffs: {
      CSE: { OC: 25, BC: 70, SC: 130, ST: 140 },
      ECE: { OC: 45, BC: 110, SC: 220, ST: 240 },
      EEE: { OC: 75, BC: 170, SC: 310, ST: 330 }
    }
  },
  {
    name: 'JNTU College of Engineering, Hyderabad (JNTUH)',
    code: 'JNTH-HYD',
    location: 'Kukatpally, Hyderabad',
    cutoffs: {
      CSE: { OC: 35, BC: 85, SC: 150, ST: 160 },
      ECE: { OC: 60, BC: 130, SC: 260, ST: 270 },
      EEE: { OC: 90, BC: 190, SC: 360, ST: 380 }
    }
  },
  {
    name: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    code: 'CBIT-HYD',
    location: 'Gandipet, Hyderabad',
    cutoffs: {
      CSE: { OC: 85, BC: 210, SC: 420, ST: 440 },
      ECE: { OC: 130, BC: 340, SC: 680, ST: 690 },
      EEE: { OC: 195, BC: 480, SC: 950, ST: 980 }
    }
  },
  {
    name: 'Vasavi College of Engineering (VCE)',
    code: 'VASV-HYD',
    location: 'Ibrahim Bagh, Hyderabad',
    cutoffs: {
      CSE: { OC: 110, BC: 270, SC: 520, ST: 540 },
      ECE: { OC: 170, BC: 430, SC: 850, ST: 870 },
      EEE: { OC: 240, BC: 580, SC: 1100, ST: 1150 }
    }
  },
  {
    name: 'VNR Vignana Jyothi Institute of Engineering & Technology',
    code: 'VNRV-HYD',
    location: 'Bachupally, Hyderabad',
    cutoffs: {
      CSE: { OC: 100, BC: 230, SC: 480, ST: 490 },
      ECE: { OC: 150, BC: 380, SC: 780, ST: 790 },
      EEE: { OC: 220, BC: 520, SC: 1050, ST: 1080 }
    }
  },
  {
    name: 'Gokaraju Rangaraju Institute of Engineering & Technology',
    code: 'GRIET-HYD',
    location: 'Bachupally, Hyderabad',
    cutoffs: {
      CSE: { OC: 175, BC: 410, SC: 920, ST: 940 },
      ECE: { OC: 270, BC: 630, SC: 1350, ST: 1380 },
      EEE: { OC: 380, BC: 820, SC: 1750, ST: 1800 }
    }
  },
  {
    name: 'MVSR Engineering College',
    code: 'MVSR-HYD',
    location: 'Nadergul, Hyderabad',
    cutoffs: {
      CSE: { OC: 240, BC: 540, SC: 1150, ST: 1180 },
      ECE: { OC: 340, BC: 780, SC: 1750, ST: 1780 },
      EEE: { OC: 490, BC: 1150, SC: 2400, ST: 2450 }
    }
  },
  {
    name: 'Matrusri Engineering College',
    code: 'MECS-HYD',
    location: 'Saidabad, Hyderabad',
    cutoffs: {
      CSE: { OC: 390, BC: 880, SC: 2100, ST: 2150 },
      ECE: { OC: 540, BC: 1180, SC: 2700, ST: 2750 },
      EEE: { OC: 780, BC: 1650, SC: 3200, ST: 3250 }
    }
  },
  {
    name: 'JNTU College of Engineering, Jagtial (JNTUJ)',
    code: 'JNTS-JGL',
    location: 'Jagtial, Telangana',
    cutoffs: {
      CSE: { OC: 150, BC: 380, SC: 850, ST: 890 },
      ECE: { OC: 240, BC: 580, SC: 1150, ST: 1180 },
      EEE: { OC: 340, BC: 780, SC: 1750, ST: 1780 }
    }
  }
];

export default function DashboardScreen({ 
  onStartExam, 
  candidateName, 
  rollNumber, 
  onUpdateProfile 
}: DashboardScreenProps) {
  
  const [selectedBranch, setSelectedBranch] = useState<SubjectSection>('Computer Science');
  const [history, setHistory] = useState<AttemptHistory[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(candidateName);
  const [tempRoll, setTempRoll] = useState(rollNumber);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [chartMetric, setChartMetric] = useState<'score' | 'accuracy'>('score');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // ECET Study Companion State declarations
  const [activeTab, setActiveTab] = useState<'CBT' | 'PLANNER' | 'STUDY' | 'PREDICTORS' | 'PAST_PAPERS' | 'SYLLABUS'>('CBT');
  const [daysRemaining, setDaysRemaining] = useState(132);
  const [dailyTarget, setDailyTarget] = useState(4);
  const [studyHoursLogged, setStudyHoursLogged] = useState(2.5);
  const [targetRank, setTargetRank] = useState(150);
  const [mockRank, setMockRank] = useState(315);
  
  // Is inline editing active for quick dashboard metrics
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
  const [expandedTracker, setExpandedTracker] = useState<'Mathematics' | 'DE' | 'Networks' | 'MP' | null>(null);

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
  const [activeMaterial, setActiveMaterial] = useState<'NOTES' | 'FORMULAS' | 'PYQS_INDEX' | 'FLASHCARDS' | null>(null);

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
  const [viewingPaperDetail, setViewingPaperDetail] = useState<any | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tg-ecet-mock-history');
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        // First load: seed default history
        localStorage.setItem('tg-ecet-mock-history', JSON.stringify(DEFAULT_HISTORY));
        setHistory(DEFAULT_HISTORY);
      }
    } catch (e) {
      console.error('Failed to load mock history', e);
      setHistory(DEFAULT_HISTORY);
    }
  }, []);

  // Update profile fields
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim() && tempRoll.trim()) {
      onUpdateProfile(tempName.trim(), tempRoll.trim().toUpperCase());
      setIsEditingProfile(false);
    }
  };

  // Reset history to defaults
  const handleResetHistory = () => {
    try {
      localStorage.setItem('tg-ecet-mock-history', JSON.stringify(DEFAULT_HISTORY));
      setHistory(DEFAULT_HISTORY);
      setShowResetConfirmModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Compute aggregate metrics
  const completedCount = history.length;
  const highestScore = history.reduce((max, h) => Math.max(max, h.totalScore), 0);
  const averageScore = completedCount > 0 
    ? Math.round(history.reduce((sum, h) => sum + h.totalScore, 0) / completedCount) 
    : 0;
  const averageAccuracy = completedCount > 0 
    ? Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / completedCount) 
    : 0;

  // Compute subtopic completion percentages dynamically
  const mathPercentage = Math.round((mathSubtopics.filter(s => s.completed).length / mathSubtopics.length) * 100);
  const dePercentage = Math.round((deSubtopics.filter(s => s.completed).length / deSubtopics.length) * 100);
  const networksPercentage = Math.round((networksSubtopics.filter(s => s.completed).length / networksSubtopics.length) * 100);
  const mpPercentage = Math.round((mpSubtopics.filter(s => s.completed).length / mpSubtopics.length) * 100);

  // SVG dimensions for custom graph
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 60;
  const paddingY = 30;

  // Calculate grid and coordinate points for SVG line chart
  const points = history.map((item, idx) => {
    const x = paddingX + (idx * (svgWidth - paddingX * 2)) / Math.max(1, history.length - 1);
    
    // Y scale depends on metric
    let y = 0;
    if (chartMetric === 'score') {
      // Scale 0 to 200 marks
      y = svgHeight - paddingY - (item.totalScore / 200) * (svgHeight - paddingY * 2);
    } else {
      // Scale 0 to 100% accuracy
      y = svgHeight - paddingY - (item.accuracy / 100) * (svgHeight - paddingY * 2);
    }
    
    return { x, y, item, idx };
  });

  // SVG grid lines array
  const gridYValues = chartMetric === 'score' ? [0, 50, 100, 150, 200] : [0, 25, 50, 75, 100];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none" id="dashboard-container">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-150 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center space-x-2.5">
          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base">TG ECET MOCK PORTAL</span>
            <span className="ml-2 text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Practice Dashboard</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="text-slate-500 font-mono hidden md:block">
            Hall Ticket: <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded">{rollNumber}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Welcome Block + Profile Customizer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
          {/* Subtle decorative background gradient accent */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/15 to-transparent pointer-events-none rounded-r-2xl" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-indigo-50/70 text-indigo-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>TSCHE State-Level CBT Exam Practice Engine</span>
            </div>
            
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold w-full sm:w-48 transition"
                  placeholder="Candidate Name"
                  maxLength={40}
                />
                <input
                  type="text"
                  required
                  value={tempRoll}
                  onChange={(e) => setTempRoll(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold w-full sm:w-36 font-mono uppercase transition"
                  placeholder="Roll Number"
                  maxLength={15}
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex-1 sm:flex-none uppercase tracking-wider cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(candidateName);
                      setTempRoll(rollNumber);
                      setIsEditingProfile(false);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition flex-1 sm:flex-none uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                  Welcome, <span className="text-indigo-650">{candidateName}</span>
                </h1>
                <button
                  onClick={() => {
                    setTempName(candidateName);
                    setTempRoll(rollNumber);
                    setIsEditingProfile(true);
                  }}
                  className="inline-flex items-center space-x-1 text-slate-400 hover:text-indigo-600 font-bold transition text-xs select-none py-1 px-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/50 cursor-pointer w-fit"
                  title="Customize candidate details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Customize Profile</span>
                </button>
              </div>
            )}
            
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg font-medium leading-relaxed">
              Hall Ticket: <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded text-xs">{rollNumber}</span> | Engineering Branch: <span className="text-indigo-650 font-bold">{selectedBranch === 'Computer Science' ? 'CSE / CS' : selectedBranch === 'Electronics & Communication' ? 'ECE' : selectedBranch === 'Electrical & Electronics' ? 'EEE' : selectedBranch === 'Mechanical Engineering' ? 'MECH' : selectedBranch === 'Civil Engineering' ? 'CIVIL' : selectedBranch}</span>
            </p>
          </div>
        </div>

        {/* Companion Tab Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex flex-wrap items-center gap-1 shadow-2xs select-none">
          <button
            onClick={() => setActiveTab('CBT')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
              activeTab === 'CBT' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>CBT Practice Center</span>
          </button>

          <button
            onClick={() => setActiveTab('PLANNER')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
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
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
              activeTab === 'STUDY' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Revision & Materials</span>
          </button>

          <button
            onClick={() => setActiveTab('PREDICTORS')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
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
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
              activeTab === 'PAST_PAPERS' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PYQs Solved Library</span>
          </button>

          <button
            onClick={() => setActiveTab('SYLLABUS')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all duration-150 ${
              activeTab === 'SYLLABUS' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus Page</span>
          </button>
        </div>

        {activeTab === 'CBT' ? (
          <>
            {/* CBT Exam Launch Center */}
            <div className="space-y-4">
          <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
            <span>CBT Exam Launchpad</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card A: Full Mock Test */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-200 transition-all duration-200">
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-red-50 text-red-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Full Syllabus</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">180 Minutes</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 tracking-tight">Full-Length CBT Mock Exam</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Complete simulated test containing exactly 200 questions: Mathematics (50), Physics (25), Chemistry (25), and your chosen core branch (100). Mimics the exact time constraints, weights, and scoring rules of the official TG-ECET exam.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-slate-500 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>200 MCQ Questions</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>200 Total Marks</span>
                  </div>
                </div>

                {/* Branch Selection Dropdown */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block">Choose Your Engineering Branch:</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value as SubjectSection)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold tracking-wide transition cursor-pointer"
                  >
                    <option value="Computer Science">Computer Science & CSE</option>
                    <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                    <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (MECH)</option>
                    <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => onStartExam(candidateName, rollNumber, 'MOCK', selectedBranch)}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs select-none cursor-pointer uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-xs active:scale-98 group"
                id="btn-start-full-mock"
              >
                <Play className="h-4 w-4 fill-current text-white group-hover:translate-x-0.5 transition duration-150" />
                <span>Begin 200-Q Mock Test</span>
              </button>
            </div>

            {/* Card B: Subject-Wise Practice */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-200 transition-all duration-200">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Targeted Practice</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">45 Minutes</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 tracking-tight">Subject-Wise Practice CBT</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Focus on a specific subject pool to master key concepts. Generates 50 random, unique questions from the chosen subject pool with the same realistic CBT interface and results scorecard.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-slate-500 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>50 Subject Questions</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>50 Total Marks</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                {(['Mathematics', 'Physics', 'Chemistry', selectedBranch] as SubjectSection[]).map((subj) => (
                  <button
                    key={subj}
                    onClick={() => onStartExam(candidateName, rollNumber, 'SUBJECT', subj)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold py-2.5 px-3 rounded-xl text-[10.5px] select-none cursor-pointer uppercase tracking-wider transition flex items-center justify-center space-x-1 border border-indigo-150/40 active:scale-95 hover:scale-101 duration-150"
                  >
                    <span>{subj === 'Computer Science' ? 'CSE / CS' : subj === 'Electronics & Communication' ? 'ECE' : subj === 'Electrical & Electronics' ? 'EEE' : subj === 'Mechanical Engineering' ? 'MECH' : subj === 'Civil Engineering' ? 'CIVIL' : subj}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 block font-extrabold uppercase tracking-wider text-[9px]">Attempts Completed</span>
            <span className="text-slate-900 font-extrabold text-2xl sm:text-3xl block mt-2 font-mono">{completedCount}</span>
            <span className="text-[10px] text-slate-450 block mt-1 font-semibold">Total full-length mock tests</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 block font-extrabold uppercase tracking-wider text-[9px]">Average Score</span>
            <span className="text-slate-900 font-extrabold text-2xl sm:text-3xl block mt-2 font-mono">
              {averageScore} <span className="text-xs text-slate-400 font-bold">/ 200</span>
            </span>
            <span className="text-[10px] text-slate-450 block mt-1 font-semibold">Mean evaluation score ({Math.round((averageScore/200)*100)}%)</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 block font-extrabold uppercase tracking-wider text-[9px]">Peak High Score</span>
            <span className="text-emerald-600 font-extrabold text-2xl sm:text-3xl block mt-2 font-mono">
              {highestScore} <span className="text-xs text-emerald-400 font-bold">/ 200</span>
            </span>
            <span className="text-[10px] text-slate-450 block mt-1 font-semibold">Highest achieved mark</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 block font-extrabold uppercase tracking-wider text-[9px]">Average Accuracy</span>
            <span className="text-indigo-600 font-extrabold text-2xl sm:text-3xl block mt-2 font-mono">{averageAccuracy}%</span>
            <span className="text-[10px] text-slate-450 block mt-1 font-semibold">Ratio of correct answers</span>
          </div>
        </div>

        {/* Previous Tests Comparison Graph Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="h-4.5 w-4.5 text-indigo-600" />
                <span>Previous Tests Comparison Graph</span>
              </h3>
              <p className="text-xs text-slate-450 font-semibold">Visualizing test result progress and section trends over multiple attempts.</p>
            </div>
            {/* Metric Toggle Filters */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 select-none text-xs font-bold w-fit">
              <button
                onClick={() => { setChartMetric('score'); setHoveredPoint(null); }}
                className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition cursor-pointer text-[9px] ${
                  chartMetric === 'score' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-450 hover:text-slate-900'
                }`}
              >
                Total Score
              </button>
              <button
                onClick={() => { setChartMetric('accuracy'); setHoveredPoint(null); }}
                className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition cursor-pointer text-[9px] ${
                  chartMetric === 'accuracy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-450 hover:text-slate-900'
                }`}
              >
                Accuracy (%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Custom SVG Graphical Chart */}
            <div className="lg:col-span-2 border border-slate-150 bg-slate-50/30 rounded-2xl p-4 flex flex-col justify-between select-none relative min-h-[260px]">
              
              {/* Plot canvas */}
              <div className="flex-1 relative w-full h-full pt-2">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {gridYValues.map((val) => {
                    const y = svgHeight - paddingY - (val / (chartMetric === 'score' ? 200 : 100)) * (svgHeight - paddingY * 2);
                    return (
                      <g key={val} className="opacity-40">
                        <line 
                          x1={paddingX} 
                          y1={y} 
                          x2={svgWidth - paddingX} 
                          y2={y} 
                          stroke="#cbd5e1" 
                          strokeWidth="1" 
                          strokeDasharray="4,4" 
                        />
                        <text 
                          x={paddingX - 12} 
                          y={y + 3.5} 
                          fill="#64748b" 
                          fontSize="9" 
                          fontWeight="bold"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {val}{chartMetric === 'accuracy' ? '%' : ''}
                        </text>
                      </g>
                    );
                  })}

                  {/* Connecting Trend Line Gradient Area */}
                  {points.length > 1 && (
                    <path
                      d={`
                        M ${points[0].x} ${svgHeight - paddingY}
                        ${points.map(p => `L ${p.x} ${p.y}`).join(' ')}
                        L ${points[points.length - 1].x} ${svgHeight - paddingY}
                        Z
                      `}
                      fill="url(#chartGrad)"
                      className="opacity-10"
                    />
                  )}

                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Main Trend Line */}
                  {points.length > 1 && (
                    <path
                      d={points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-[0_2px_4px_rgba(79,70,229,0.2)]"
                    />
                  )}

                  {/* Data Points */}
                  {points.map((p) => {
                    const isHovered = hoveredPoint === p.idx;
                    return (
                      <g key={p.idx} className="cursor-pointer">
                        {/* Larger interactive hover trigger area */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="18"
                          fill="transparent"
                          onMouseEnter={() => setHoveredPoint(p.idx)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        
                        {/* Visible circle outline */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? "8" : "5.5"}
                          fill={isHovered ? "#ffffff" : "#4f46e5"}
                          stroke="#4f46e5"
                          strokeWidth={isHovered ? "4" : "2"}
                          className="transition-all duration-150"
                        />

                        {/* X-Axis labels */}
                        <text
                          x={p.x}
                          y={svgHeight - 8}
                          fill="#64748b"
                          fontSize="9"
                          fontWeight="extrabold"
                          textAnchor="middle"
                          className="uppercase tracking-wider"
                        >
                          T-{p.idx + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Live Tooltip Overlay */}
                {hoveredPoint !== null && points[hoveredPoint] && (
                  <div 
                    className="absolute z-10 bg-slate-900 text-white rounded-2xl p-4 text-xs shadow-xl border border-slate-800 space-y-2 select-none w-52 pointer-events-none transition-all duration-150"
                    style={{
                      left: `${Math.min(
                        Math.max(10, (points[hoveredPoint].x / svgWidth) * 100 - 25), 
                        68
                      )}%`,
                      top: `${Math.max(5, (points[hoveredPoint].y / svgHeight) * 100 - 62)}%`
                    }}
                  >
                    <div className="border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span className="font-extrabold text-[10px] tracking-wider text-indigo-400 block uppercase">
                        Attempt T-{hoveredPoint + 1}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold">
                        {points[hoveredPoint].item.date}
                      </span>
                    </div>
                    
                    <div className="space-y-1 font-semibold text-slate-300">
                      <div className="flex justify-between">
                        <span>Total Marks:</span>
                        <span className="text-white font-bold">{points[hoveredPoint].item.totalScore} / 200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy:</span>
                        <span className="text-white font-bold">{points[hoveredPoint].item.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-[10px] pt-1 text-slate-400 border-t border-slate-850">
                        <span>Mathematics:</span>
                        <span className="text-slate-200 font-bold">{points[hoveredPoint].item.scores.Mathematics}/50</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-450">
                        <span>Physics:</span>
                        <span className="text-slate-200 font-bold">{points[hoveredPoint].item.scores.Physics}/25</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-450">
                        <span>Chemistry:</span>
                        <span className="text-slate-200 font-bold">{points[hoveredPoint].item.scores.Chemistry}/25</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-450">
                        <span>CSE Branch:</span>
                        <span className="text-slate-200 font-bold">{points[hoveredPoint].item.scores['Computer Science']}/100</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Legend / Guide details */}
              <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold px-2 pt-3 border-t border-slate-150 flex-none">
                <span>Scale: 0 to {chartMetric === 'score' ? '200 Marks' : '100% Accuracy'}</span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block"></span>
                  <span>{chartMetric === 'score' ? 'Exam Score Trend' : 'Accuracy Trend'}</span>
                </span>
                <span>Attempts: {completedCount} Total</span>
              </div>
            </div>

            {/* Side benchmark guide cards or quick comparison metrics list */}
            <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block border-b border-slate-200 pb-2">
                  Practice Milestones & Insights
                </span>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-800 block font-bold">Preparation Trend</strong>
                      <span className="text-slate-500 font-medium">
                        {completedCount > 1 && history[completedCount - 1].totalScore >= history[0].totalScore
                          ? `Progress is trending positive (+${history[completedCount - 1].totalScore - history[0].totalScore} marks since start!). Keep it up.`
                          : 'Initiate additional CBT exams to compile more progress benchmarks.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-800 block font-bold">Target Benchmark</strong>
                      <span className="text-slate-500 font-medium">Aim for 140+ marks (70%+) to secure a premium rank under the state counseling quota.</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="bg-slate-100 text-slate-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-800 block font-bold">Time Efficiency</strong>
                      <span className="text-slate-500 font-medium">
                        {completedCount > 0 
                          ? `On average, you spend ${Math.round(history.reduce((sum, h) => sum + h.timeTakenMinutes, 0) / completedCount)} mins of 180 limit per session.`
                          : 'Timer management metrics are tracked dynamically on exam submission.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {completedCount > 0 && (
                <button
                  onClick={() => setShowResetConfirmModal(true)}
                  className="mt-6 flex items-center justify-center space-x-1 bg-white hover:bg-slate-50 text-slate-450 hover:text-slate-700 border border-slate-200/80 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition select-none w-full"
                  title="Wipe previous attempt metrics"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Test Analytics</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Previous Tests Detailed Activity Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider">
            Mock Practice Assessment Logs
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Attempt Index</th>
                  <th className="py-3 px-4">Date Taken</th>
                  <th className="py-3 px-4 text-center">Mathematics (50)</th>
                  <th className="py-3 px-4 text-center">Physics (25)</th>
                  <th className="py-3 px-4 text-center">Chemistry (25)</th>
                  <th className="py-3 px-4 text-center">Core Domain (100)</th>
                  <th className="py-3 px-4 text-center">Total Score (200)</th>
                  <th className="py-3 px-4 text-center">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {history.slice().reverse().map((attempt, index) => {
                  const revIndex = history.length - index;
                  const coreScore = attempt.scores['Computer Science'] || 
                                    attempt.scores['Electronics & Communication'] || 
                                    attempt.scores['Electrical & Electronics'] || 
                                    attempt.scores['Mechanical Engineering'] || 
                                    attempt.scores['Civil Engineering'] || 
                                    0;
                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50/40 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Attempt T-{revIndex}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{attempt.date}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-800">{attempt.scores.Mathematics || 0}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-800">{attempt.scores.Physics || 0}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-800">{attempt.scores.Chemistry || 0}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-indigo-650">{coreScore}</td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-950">
                        {attempt.totalScore} <span className="text-[10px] text-slate-400 font-medium">/ 200</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                          attempt.accuracy >= 70 ? 'bg-emerald-50 text-emerald-700' : attempt.accuracy >= 50 ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {attempt.accuracy}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Syllabus / Subject Weightages reference panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider flex items-center space-x-2">
            <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
            <span>Official TG-ECET Syllabus & Exam Pattern</span>
          </h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed">
            The State Engineering Common Entrance Test (TG ECET) is evaluated for a total of 200 Marks. Ensure proper syllabus coverage across all four core domains:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/30 space-y-2">
              <strong className="text-slate-800 block font-bold border-b border-slate-150 pb-1.5">1. Mathematics (50 Marks)</strong>
              <p className="text-slate-500 leading-relaxed font-medium">Analytical Geometry, Matrices, Integration, Differential Equations, Laplace Transforms, and Probability.</p>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/30 space-y-2">
              <strong className="text-slate-800 block font-bold border-b border-slate-150 pb-1.5">2. Physics (25 Marks)</strong>
              <p className="text-slate-500 leading-relaxed font-medium">Units & Dimensions, Elements of Vectors, Kinematics, Friction, Work, Power & Energy, Simple Harmonic Motion, Acoustics, and Modern Physics.</p>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/30 space-y-2">
              <strong className="text-slate-800 block font-bold border-b border-slate-150 pb-1.5">3. Chemistry (25 Marks)</strong>
              <p className="text-slate-500 leading-relaxed font-medium">Atomic Structure, Chemical Bonding, Solutions, Acids & Bases, Electrochemistry, Corrosion, Polymers, and Water Technology.</p>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-150 bg-indigo-50/10 space-y-2">
              <strong className="text-indigo-900 block font-extrabold border-b border-indigo-100 pb-1.5">4. CSE Core (100 Marks)</strong>
              <p className="text-indigo-950/70 leading-relaxed font-semibold">Digital Electronics, Microprocessors, Computer Organization, C & C++, Data Structures, Operating Systems, RDBMS, and Java Programming.</p>
            </div>
          </div>
        </div>
          </>
        ) : activeTab === 'SYLLABUS' ? (
          <SyllabusView selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />
        ) : (
          <ECETCompanionHub 
            candidateName={candidateName} 
            rollNumber={rollNumber} 
            activeTab={activeTab as any} 
            setActiveTab={setActiveTab as any} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-150 text-slate-450 text-center py-5 px-6 text-xs font-semibold select-none">
        Note: This is just a mock test and is intended for practice and self-assessment only, not for real-time exam results or official certification.
      </footer>

      {/* Custom Warning Dialog Box for Resetting History */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/65 z-55 flex items-center justify-center p-4 animate-fade-in animate-duration-200" id="reset-confirm-modal">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <header className="bg-red-600 text-white p-5 text-center font-extrabold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center space-x-2 select-none">
              <AlertCircle className="h-5 w-5 text-white animate-pulse" />
              <span>Reset Practice History</span>
            </header>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <p className="font-bold text-slate-900 text-center text-sm select-none">
                Are you absolutely sure you want to reset your practice attempt history?
              </p>
              
              <div className="bg-red-50/50 border border-red-200/60 rounded-xl p-4 space-y-2 text-xs font-semibold text-slate-650">
                <p className="text-red-800 font-bold">This action is irreversible and will:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>Permanently delete all your personalized mock test logs.</li>
                  <li>Clear customized performance analytics, accuracy charts, and section trends.</li>
                  <li>Restore the default benchmark test statistics (Mock Test 1, 2, and 3 templates).</li>
                </ul>
              </div>

              <p className="text-slate-450 font-semibold text-center text-[10px] leading-relaxed select-none uppercase tracking-wider">
                Please confirm to proceed with restoring default benchmarks
              </p>
            </div>

            {/* Modal Footer */}
            <footer className="bg-slate-50 border-t border-slate-150 p-4.5 flex space-x-3 justify-end select-none">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs select-none cursor-pointer uppercase tracking-wider transition active:scale-97"
              >
                No, Keep History
              </button>
              <button
                onClick={handleResetHistory}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs select-none cursor-pointer uppercase tracking-wider transition active:scale-97 shadow-xs"
              >
                Yes, Reset History
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SYLLABUS VIEW COMPONENT
// ==========================================
interface SyllabusViewProps {
  selectedBranch: SubjectSection;
  setSelectedBranch: (branch: SubjectSection) => void;
}

function SyllabusView({ selectedBranch, setSelectedBranch }: SyllabusViewProps) {
  const [activeSyllabusTab, setActiveSyllabusTab] = useState<string>('core');

  const getBranchSyllabus = (branch: SubjectSection) => {
    switch (branch) {
      case 'Computer Science':
        return [
          { subject: 'Digital Electronics (15 Marks)', topics: ['Number Systems', 'Logic Gates', 'Boolean Algebra', 'Karnaugh Maps', 'Flip-Flops', 'Counters', 'Registers'] },
          { subject: 'Microprocessors (10 Marks)', topics: ['8085 Architecture', '8085 Instruction Set', 'Addressing Modes', 'Memory Interfacing', '8086 BIU & EU', 'Pipelining'] },
          { subject: 'Computer Organization (10 Marks)', topics: ['CPU Organisation', 'Instruction Formats', 'Addressing Modes', 'I/O Organisation', 'Memory Hierarchy', 'DMA Transfer'] },
          { subject: 'C & C++ Programming (15 Marks)', topics: ['Data Types', 'Operators', 'Control Statements', 'Arrays & Pointers', 'Functions', 'Structures', 'Classes & Objects', 'Inheritance'] },
          { subject: 'Data Structures (15 Marks)', topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Binary Trees', 'Searching & Sorting Techniques', 'Graphs'] },
          { subject: 'Operating Systems (15 Marks)', topics: ['Process Management', 'CPU Scheduling', 'Deadlocks', 'Memory Management', 'Virtual Memory', 'Disk Scheduling'] },
          { subject: 'RDBMS (10 Marks)', topics: ['E-R Diagrams', 'Normalization (1NF, 2NF, 3NF)', 'SQL Queries', 'Transactions', 'Concurrency Control'] },
          { subject: 'Java Programming (10 Marks)', topics: ['OOP Concepts', 'Packages & Interfaces', 'Exception Handling', 'Multithreading', 'Applets', 'AWT & Swings'] },
        ];
      case 'Electronics & Communication':
        return [
          { subject: 'Electronic Devices & Circuits (15 Marks)', topics: ['Semiconductor Diodes', 'BJT & FET Amplifiers', 'Feedback Amplifiers', 'Oscillators', 'Optoelectronic Devices'] },
          { subject: 'Network Theory (15 Marks)', topics: ['Mesh & Nodal Analysis', 'Thevenin & Norton Theorems', 'Maximum Power Transfer', 'Resonance', 'Two-Port Parameters'] },
          { subject: 'Digital Electronics (15 Marks)', topics: ['Combinational Circuits', 'Sequential Circuits', 'A/D and D/A Converters', 'Semiconductor Memories'] },
          { subject: 'Microprocessors & Microcontrollers (15 Marks)', topics: ['8086 Hardware Architecture', '8086 Assembly Language', '8051 Microcontroller Architecture', 'Interrupts'] },
          { subject: 'Communications Systems (25 Marks)', topics: ['Amplitude Modulation', 'Frequency Modulation', 'Superheterodyne Receivers', 'PCM & Delta Modulation', 'ASK, FSK, PSK Keying'] },
          { subject: 'Linear ICs & Microwave (15 Marks)', topics: ['OP-AMP Applications', '555 Timer Multivibrators', 'Waveguides & Antennas', 'Satellite & Fiber Optic Systems'] },
        ];
      case 'Electrical & Electronics':
        return [
          { subject: 'Basic Electrical Engineering (15 Marks)', topics: ['DC Circuits & Theorems', 'AC fundamentals', 'Electromagnetic Induction', 'Battery Technologies'] },
          { subject: 'Electrical Machines (25 Marks)', topics: ['DC Generators & Motors', 'Single Phase & Three Phase Transformers', 'Induction Motors', 'Synchronous Alternators'] },
          { subject: 'Power Systems (25 Marks)', topics: ['Generation (Thermal, Hydro, Nuclear)', 'Transmission Line Models', 'Insulators & Cables', 'Fault Analysis & Protection'] },
          { subject: 'Measurements & Instrumentation (10 Marks)', topics: ['PMMC & MI Ammeters/Voltmeters', 'Wattmeters', 'Energy Meters', 'Transducers', 'Oscilloscopes'] },
          { subject: 'Power Electronics & Control Systems (25 Marks)', topics: ['SCR, Triac, MOSFET characteristics', 'Phase Controlled Rectifiers', 'Choppers & Inverters', 'Transfer Functions', 'Stability Criteria'] },
        ];
      case 'Mechanical Engineering':
        return [
          { subject: 'Workshop Technology & Machine Drawing (20 Marks)', topics: ['Foundry & Welding', 'Lathe, Shaper, Milling Machines', 'Limits, Fits & Tolerances', 'Orthographic Projections'] },
          { subject: 'Strength of Materials & Design (20 Marks)', topics: ['Simple Stress & Strain', 'Shear Force & Bending Moment Diagrams', 'Torsion of Shafts', 'Machine Elements Design'] },
          { subject: 'Thermodynamics & IC Engines (20 Marks)', topics: ['Laws of Thermodynamics', 'Air Standard Cycles (Carnot, Otto, Diesel)', 'IC Engine performance', 'Air Compressors'] },
          { subject: 'Fluid Mechanics & Hydraulic Machinery (20 Marks)', topics: ['Fluid properties & pressure measurement', 'Bernoullis Theorem', 'Pelton, Francis, Kaplan Turbines', 'Centrifugal Pumps'] },
          { subject: 'Manufacturing & Industrial Engineering (20 Marks)', topics: ['Metal Cutting & Tool Life', 'CNC Machining', 'Production Planning & Control', 'Linear Programming & Forecasting'] },
        ];
      case 'Civil Engineering':
        return [
          { subject: 'Strength of Materials & Structures (25 Marks)', topics: ['Stresses & Strains', 'Bending & Shear Stresses', 'Columns & Struts', 'Trusses analysis', 'Concrete mix design'] },
          { subject: 'Hydraulics & Water Resources (25 Marks)', topics: ['Fluid Pressure & Flow', 'Weirs & Notches', 'Flow through pipes', 'Open Channel flow', 'Hydrological Cycle & Dams'] },
          { subject: 'Surveying & Transportation (20 Marks)', topics: ['Chain, Compass, Levelling', 'Theodolite & Tacheometry', 'Curves layout', 'Highway alignments & Pavement design'] },
          { subject: 'Environmental & Geotechnical Engineering (30 Marks)', topics: ['Water treatment & distribution', 'Sewage treatment', 'Air & Noise pollution', 'Soil classification', 'Permeability & Bearing Capacity'] },
        ];
      default:
        return [];
    }
  };

  const generalScienceSyllabus = {
    Math: [
      { subject: 'Matrices & Determinants (15 Marks)', topics: ['Adjoint & Inverse', 'Rank of Matrix', 'System of Linear Equations', 'Eigenvalues & Eigenvectors'] },
      { subject: 'Trigonometry (10 Marks)', topics: ['Compound Angles', 'Multiple & Submultiple Angles', 'Hyperbolic Functions', 'Properties of Triangles'] },
      { subject: 'Analytical Geometry (5 Marks)', topics: ['Straight Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola'] },
      { subject: 'Calculus & Laplace (20 Marks)', topics: ['Limits & Continuity', 'First & Higher Derivatives', 'Definite & Indefinite Integration', 'Differential Equations', 'Laplace & Inverse Laplace Transforms'] },
    ],
    Physics: [
      { subject: 'Mechanics & Heat (13 Marks)', topics: ['Units & Dimensions', 'Vector operations', 'Friction laws', 'Work, Power & Energy', 'Simple Harmonic Motion', 'Gas Laws & Thermodynamics'] },
      { subject: 'Waves & Modern Physics (12 Marks)', topics: ['Acoustics & Reverberation', 'Superconductivity', 'Photoelectric Effect', 'Laser principles', 'Fiber Optics'] },
    ],
    Chemistry: [
      { subject: 'General & Physical Chemistry (12 Marks)', topics: ['Atomic Structure & Quantum Numbers', 'Chemical Bonding', 'Solutions normality/molarity', 'Acids & Bases concepts'] },
      { subject: 'Applied Chemistry (13 Marks)', topics: ['Electrochemistry & EMF', 'Corrosion prevention', 'Water treatment processes', 'Polymers & Plastics', 'Environmental chemistry'] },
    ]
  };

  const activeBranchSyllabus = getBranchSyllabus(selectedBranch);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 animate-fade-in" id="syllabus-view-container">
      {/* Redirection Alert Banner */}
      <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-indigo-100/20 rounded-r-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-100 text-indigo-850 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TGCHE Official Syllabus Page</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Direct Access Portal</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            The official State Engineering Common Entrance Test curriculum is maintained by the Telangana State Council of Higher Education (TGCHE). Click below to view the official PDF syllabi, exam guides, and official updates on their secure academic server.
          </p>
        </div>
        <a
          href="https://ecet.tgche.ac.in/UI/Syllabus.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md transition duration-200 select-none text-xs uppercase tracking-wider w-full md:w-auto text-center justify-center cursor-pointer hover:scale-101 active:scale-99"
          id="btn-syllabus-redirect"
        >
          <span>Open Official Page</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Syllabus Content Hub */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-650" />
              <span>In-App Curriculum Reference</span>
            </h3>
            <p className="text-xs text-slate-450 font-semibold">Verify subjects, subtopics, and official weightages for the 200 Marks exam.</p>
          </div>

          {/* Quick branch switcher */}
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active Prep:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as SubjectSection)}
              className="bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-bold transition cursor-pointer"
            >
              <option value="Computer Science">CSE / CS</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Electrical & Electronics">EEE</option>
              <option value="Mechanical Engineering">MECH</option>
              <option value="Civil Engineering">CIVIL</option>
            </select>
          </div>
        </div>

        {/* Syllabus Tab Selection */}
        <div className="flex border-b border-slate-150 p-1 bg-slate-50 rounded-xl max-w-md select-none text-xs font-bold">
          <button
            onClick={() => setActiveSyllabusTab('core')}
            className={`flex-1 py-2 px-3 rounded-lg text-center font-bold tracking-wider uppercase transition cursor-pointer text-[10px] ${
              activeSyllabusTab === 'core' ? 'bg-white text-indigo-650 shadow-xs' : 'text-slate-450 hover:text-slate-800'
            }`}
          >
            Core ({selectedBranch === 'Computer Science' ? 'CSE' : selectedBranch === 'Electronics & Communication' ? 'ECE' : selectedBranch === 'Electrical & Electronics' ? 'EEE' : selectedBranch === 'Mechanical Engineering' ? 'MECH' : selectedBranch === 'Civil Engineering' ? 'CIVIL' : 'Core'} - 100M)
          </button>
          <button
            onClick={() => setActiveSyllabusTab('general')}
            className={`flex-1 py-2 px-3 rounded-lg text-center font-bold tracking-wider uppercase transition cursor-pointer text-[10px] ${
              activeSyllabusTab === 'general' ? 'bg-white text-indigo-650 shadow-xs' : 'text-slate-450 hover:text-slate-800'
            }`}
          >
            General Sciences (100M)
          </button>
        </div>

        {/* Syllabus Content Display */}
        {activeSyllabusTab === 'core' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {activeBranchSyllabus.map((item, idx) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{idx + 1}. Core Unit</span>
                <h4 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">{item.subject}</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.topics.map((t, tIdx) => (
                    <span key={tIdx} className="bg-white border border-slate-150 text-slate-600 font-bold px-2 py-1 rounded-lg text-[9.5px] transition hover:bg-indigo-50/20 hover:border-indigo-150/40">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Maths */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">Mathematics (50 Marks)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generalScienceSyllabus.Math.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                    <h5 className="text-[11.5px] font-extrabold text-slate-800">{item.subject}</h5>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.topics.map((t, tIdx) => (
                        <span key={tIdx} className="bg-white border border-slate-150 text-slate-600 font-bold px-2 py-1 rounded-lg text-[9px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Physics & Chemistry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Physics */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">Physics (25 Marks)</h4>
                </div>
                <div className="space-y-4">
                  {generalScienceSyllabus.Physics.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                      <h5 className="text-[11.5px] font-extrabold text-slate-800">{item.subject}</h5>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.topics.map((t, tIdx) => (
                          <span key={tIdx} className="bg-white border border-slate-150 text-slate-600 font-bold px-2 py-1 rounded-lg text-[9px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemistry */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">Chemistry (25 Marks)</h4>
                </div>
                <div className="space-y-4">
                  {generalScienceSyllabus.Chemistry.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                      <h5 className="text-[11.5px] font-extrabold text-slate-800">{item.subject}</h5>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.topics.map((t, tIdx) => (
                          <span key={tIdx} className="bg-white border border-slate-150 text-slate-600 font-bold px-2 py-1 rounded-lg text-[9px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secure Live Preview Iframe Frame */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden space-y-3" id="live-syllabus-preview">
        <div className="bg-slate-50 border-b border-slate-150 px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Live TGCHE Server Preview (Optional)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold">ecet.tgche.ac.in</span>
        </div>
        <div className="relative w-full h-[380px] bg-slate-50/20">
          <iframe 
            src="https://ecet.tgche.ac.in/UI/Syllabus.aspx" 
            title="TG-ECET Official Syllabus Page Preview" 
            className="w-full h-full border-0 rounded-b-2xl"
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-[10px] text-slate-400 font-semibold px-5 pb-3 text-center leading-relaxed">
          Note: If the live preview does not render due to institutional secure network policies, please click the <strong>Open Official Page</strong> button above to open the official server portal in a secure browser tab.
        </p>
      </div>
    </div>
  );
}
