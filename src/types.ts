export type SubjectSection = 
  | 'Mathematics' 
  | 'Physics' 
  | 'Chemistry' 
  | 'Computer Science' 
  | 'Electronics & Communication' 
  | 'Electrical & Electronics' 
  | 'Mechanical Engineering' 
  | 'Civil Engineering';

// TG-ECET Exam Question
export interface Question {
  id: number; // 1 to 200
  section: SubjectSection;
  questionNumber: number; // 1-based index within the subject (e.g., 1-50 for Maths)
  questionText: string;
  codeSnippet?: string; // Optional pre-formatted code block/terminal output
  code?: string; // Unique permanent code (e.g., M1, M250, P45, etc.)
  options: string[]; // Always exactly 4 choices
  correctOptionIndex: number; // 0 to 3
  explanation: string;
}

export type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_AND_MARKED_FOR_REVIEW';

export interface TestSession {
  examName: string;
  durationSeconds: number; // countdown
  startTime: string; // ISO String
}

export interface Scorecard {
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  sectionMetrics: Partial<Record<SubjectSection, {
    total: number;
    attempted: number;
    correct: number;
    wrong: number;
    score: number;
  }>>;
}

/**
 * Types and Interfaces for PlacementPro
 */

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string; // "Computer Engineering", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"
  semester: number; // 1 to 6 (Diploma usually has 6 semesters)
  percentage: number; // e.g. 78.5
  backlogs: number; // e.g. 0
  skills: string[];
  certifications: string[];
  preferredLocation: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  linkedin?: string;
  github?: string;
  resumeBuilderData?: ResumeBuilderData;
}

export interface ResumeBuilderData {
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  education: {
    institution: string;
    course: string;
    yearOfPassing: string;
    score: string;
  }[];
  projects: {
    title: string;
    techStack: string;
    description: string;
  }[];
  skills: string[];
  internships: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  certifications: string[];
  achievements: string[];
  languages: string[];
}

export interface Company {
  id: string;
  name: string;
  logo: string; // Tailwind color placeholder or initials
  description: string;
  minPercentage: number;
  allowedBranches: string[]; // e.g. ["Computer Engineering", "Electronics & Communication"]
  maxBacklogsAllowed: number;
  salaryPackage: string; // e.g. "4.2 LPA", "3.6 LPA"
  jobRole: string; // e.g. "Junior Software Engineer", "Embedded Intern", "CAD Technician"
  selectionProcess: string[]; // e.g. ["Aptitude Test", "Technical MCQ", "Technical Interview", "HR Interview"]
  applicationDeadline: string; // YYYY-MM-DD
  location: string;
  website: string;
  status: 'Active' | 'Closed';
}

export interface Application {
  id: string;
  studentEmail: string;
  companyId: string;
  companyName: string;
  jobRole: string;
  salaryPackage: string;
  status: 'Saved' | 'Applied' | 'Online Test' | 'Interview' | 'Selected' | 'Rejected' | 'Offer Received';
  timeline: {
    status: string;
    date: string;
    notes?: string;
  }[];
  appliedAt: string;
  feedback?: string;
  resumeType?: 'built' | 'uploaded' | 'none';
  coverNote?: string;
}

// Placement-specific Question
export interface PlacementQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  category: string; // e.g. "Quantitative", "Logical", "English", "Technical"
}

export interface MockTest {
  id: string;
  title: string;
  category: 'Quantitative Aptitude' | 'Logical Reasoning' | 'English' | 'Technical';
  durationMinutes: number;
  questions: PlacementQuestion[];
}

export interface MockTestResult {
  id: string;
  studentEmail: string;
  testId: string;
  testTitle: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  date: string;
}

export interface StudyResource {
  id: string;
  title: string;
  branch: string; // "All", "Electronics & Communication", "Computer Engineering", "Electrical Engineering", "Mechanical Engineering"
  subject: string;
  category: 'Study Notes' | 'Previous Papers' | 'Coding Challenges' | 'Notes' | 'Syllabus' | 'Interview Questions' | 'Formula Sheet';
  summary: string;
  content: string; // Rich-text or Markdown content
  fileName?: string;
  fileSize?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'Drive' | 'Deadline' | 'Reminder' | 'Announcement';
  date: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  important: boolean;
}

export interface DailyTask {
  id: string;
  studentEmail: string;
  text: string;
  category: 'Aptitude' | 'Technical' | 'Resume' | 'Application' | 'Interview';
  completed: boolean;
  date: string;
}

export interface ActivityLog {
  id: string;
  studentEmail: string;
  type: 'Mock Test' | 'Study Library' | 'Resume' | 'Application' | 'Login' | 'Task';
  description: string;
  date: string; // YYYY-MM-DD
}

export interface PlacementReadinessReport {
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  breakdown: {
    resume: number; // 0-20
    skills: number; // 0-25
    mockTests: number; // 0-25
    projects: number; // 0-15
    certifications: number; // 0-10
    profileCompletion: number; // 0-5
  };
}

export interface DashboardStats {
  readinessScore: number;
  profileCompletion: number;
  resumeStatus: 'Incomplete' | 'Uploaded' | 'Built';
  upcomingDrivesCount: number;
  eligibleCompaniesCount: number;
  applicationsSummary: {
    saved: number;
    applied: number;
    inProgress: number; // Test or Interview
    placed: number;
    rejected: number;
  };
  mockTestPerformance: {
    averageScore: number;
    testsTaken: number;
    categoryPerformance: {
      aptitude: number;
      logical: number;
      english: number;
      technical: number;
    };
  };
  activities?: ActivityLog[];
}
