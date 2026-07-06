import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import { 
  INITIAL_STUDENT, 
  INITIAL_COMPANIES, 
  INITIAL_QUESTIONS, 
  INITIAL_MOCK_TESTS, 
  INITIAL_RESOURCES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS 
} from './src/data/mockData.js';
import { 
  StudentProfile, 
  Company, 
  Application, 
  MockTestResult, 
  StudyResource, 
  Notification as PlacementNotification, 
  Announcement, 
  DailyTask,
  PlacementReadinessReport,
  MockTest,
  PlacementQuestion,
  ActivityLog
} from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB File Path
const DB_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Memory DB Interface
interface DatabaseSchema {
  students: { [email: string]: StudentProfile & { password?: string } };
  companies: Company[];
  applications: Application[];
  mockTests: MockTest[];
  testResults: MockTestResult[];
  resources: StudyResource[];
  notifications: PlacementNotification[];
  announcements: Announcement[];
  dailyTasks: DailyTask[];
  activityLog?: ActivityLog[];
}

let db: DatabaseSchema = {
  students: {},
  companies: [],
  applications: [],
  mockTests: [],
  testResults: [],
  resources: [],
  notifications: [],
  announcements: [],
  dailyTasks: [],
  activityLog: []
};

function generateMockActivities(email: string): ActivityLog[] {
  const activities: ActivityLog[] = [];
  const types: ('Mock Test' | 'Study Library' | 'Resume' | 'Application' | 'Login' | 'Task')[] = 
    ['Login', 'Study Library', 'Mock Test', 'Task', 'Resume', 'Application'];
  
  // Let's create records for the last 50 days (ending at current date July 5, 2026)
  const endDate = new Date("2026-07-05");
  for (let i = 50; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
    const randomChance = Math.random();
    
    // Higher activity on weekdays, lower on weekends
    const threshold = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.75 : 0.35;
    if (randomChance > threshold) {
      const count = Math.floor(Math.random() * 3) + 1;
      const dayTypes = new Set<string>();
      
      for (let j = 0; j < count; j++) {
        let type: typeof types[number] = 'Login';
        const typeChance = Math.random();
        if (typeChance < 0.3) type = 'Login';
        else if (typeChance < 0.55) type = 'Study Library';
        else if (typeChance < 0.75) type = 'Task';
        else if (typeChance < 0.85) type = 'Mock Test';
        else if (typeChance < 0.95) type = 'Resume';
        else type = 'Application';
        
        if (dayTypes.has(type)) continue;
        dayTypes.add(type);

        let desc = "";
        if (type === 'Login') desc = "Accessed PlacementPro Candidate Portal";
        else if (type === 'Study Library') desc = "Reviewed branch syllabus guides";
        else if (type === 'Mock Test') desc = "Completed a diagnostic mock test exam";
        else if (type === 'Task') desc = "Completed daily tasks checklist";
        else if (type === 'Resume') desc = "Updated resume credentials in ATS builder";
        else desc = "Submitted placement application drive";

        activities.push({
          id: `act-${dateStr}-${j}-${Math.floor(Math.random()*1000)}`,
          studentEmail: email,
          type,
          description: desc,
          date: dateStr
        });
      }
    }
  }
  return activities;
}

// Initialize database with default data if not present
function initializeDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      
      // Sync/Merge INITIAL_RESOURCES to ensure new categories (Study Notes, Previous Papers, Coding Challenges) are fully available
      if (!db.resources) {
        db.resources = [];
      }
      const existingResourceIds = new Set(db.resources.map(r => r.id));
      let databaseUpdated = false;
      
      INITIAL_RESOURCES.forEach(r => {
        if (!existingResourceIds.has(r.id)) {
          db.resources.push(r);
          databaseUpdated = true;
        }
      });
      
      // Update categories or content for any existing default resources that have been upgraded
      INITIAL_RESOURCES.forEach(r => {
        const existingIdx = db.resources.findIndex(ex => ex.id === r.id);
        if (existingIdx !== -1) {
          if (db.resources[existingIdx].category !== r.category || db.resources[existingIdx].title !== r.title) {
            db.resources[existingIdx].category = r.category;
            db.resources[existingIdx].title = r.title;
            db.resources[existingIdx].content = r.content;
            databaseUpdated = true;
          }
        }
      });

      if (!db.activityLog || db.activityLog.length === 0) {
        db.activityLog = generateMockActivities("student@placementpro.in");
        databaseUpdated = true;
      }
      
      if (databaseUpdated) {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
      }
      console.log(`[PlacementPro DB] Loaded and synchronized database from ${DB_FILE}`);
    } else {
      console.log(`[PlacementPro DB] Creating new database at ${DB_FILE}`);
      db = {
        students: {
          "student@placementpro.in": {
            ...INITIAL_STUDENT,
            password: "password"
          }
        },
        companies: INITIAL_COMPANIES,
        applications: [
          {
            id: "app-default-1",
            studentEmail: "student@placementpro.in",
            companyId: "comp-1",
            companyName: "Tata Consultancy Services (TCS) - Smart Hiring",
            jobRole: "Associate System Engineer",
            salaryPackage: "2.8 LPA",
            status: "Applied",
            timeline: [
              { status: "Saved", date: "2026-07-01", notes: "Saved to explore rules." },
              { status: "Applied", date: "2026-07-02", notes: "Applied via PlacementPro portal." }
            ],
            appliedAt: "2026-07-02T11:00:00Z"
          },
          {
            id: "app-default-2",
            studentEmail: "student@placementpro.in",
            companyId: "comp-3",
            companyName: "Infosys - Technical Support Graduate Program",
            jobRole: "Operations Executive",
            salaryPackage: "2.6 LPA",
            status: "Online Test",
            timeline: [
              { status: "Saved", date: "2026-07-01", notes: "Saved profile." },
              { status: "Applied", date: "2026-07-03", notes: "Application submitted." },
              { status: "Online Test", date: "2026-07-05", notes: "Test link received. Scheduled for tomorrow." }
            ],
            appliedAt: "2026-07-03T09:15:00Z"
          }
        ],
        mockTests: INITIAL_MOCK_TESTS,
        testResults: [
          {
            id: "res-default-1",
            studentEmail: "student@placementpro.in",
            testId: "test-aptitude",
            testTitle: "General Quantitative Aptitude Test",
            category: "Quantitative Aptitude",
            score: 2,
            totalQuestions: 3,
            correctAnswers: 2,
            timeTakenSeconds: 145,
            date: "2026-07-03T16:20:00Z"
          }
        ],
        resources: INITIAL_RESOURCES,
        notifications: INITIAL_NOTIFICATIONS,
        announcements: INITIAL_ANNOUNCEMENTS,
        dailyTasks: [
          {
            id: "task-def-1",
            studentEmail: "student@placementpro.in",
            text: "Complete at least one aptitude mock test on the platform.",
            category: "Aptitude",
            completed: true,
            date: "2026-07-05"
          },
          {
            id: "task-def-2",
            studentEmail: "student@placementpro.in",
            text: "Check eligibility for L&T Construction Drive.",
            category: "Application",
            completed: false,
            date: "2026-07-05"
          },
          {
            id: "task-def-3",
            studentEmail: "student@placementpro.in",
            text: "Review embedded C programming memory layout guides.",
            category: "Technical",
            completed: false,
            date: "2026-07-05"
          }
        ],
        activityLog: generateMockActivities("student@placementpro.in")
      };
      saveDatabase();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing database to file:", error);
  }
}

function logStudentActivity(
  email: string, 
  type: 'Mock Test' | 'Study Library' | 'Resume' | 'Application' | 'Login' | 'Task', 
  description: string
) {
  if (!db.activityLog) {
    db.activityLog = [];
  }
  const dateStr = new Date().toISOString().split('T')[0];
  const isDuplicate = db.activityLog.some(
    a => a.studentEmail === email && a.type === type && a.date === dateStr && a.description === description
  );
  if (!isDuplicate) {
    db.activityLog.push({
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentEmail: email,
      type,
      description,
      date: dateStr
    });
  }
}

// Helper: Calculate placement readiness score & suggestions
function calculateReadinessScore(student: StudentProfile, studentEmail: string): PlacementReadinessReport {
  // 1. Resume status score (Max 20)
  let resumeScore = 0;
  const hasUploadedResume = !!student.resumeFileName;
  const hasBuiltResume = student.resumeBuilderData && student.resumeBuilderData.personalDetails && student.resumeBuilderData.personalDetails.fullName;
  
  if (hasUploadedResume && hasBuiltResume) {
    resumeScore = 20;
  } else if (hasUploadedResume || hasBuiltResume) {
    resumeScore = 12;
  }

  // 2. Skills score (Max 25)
  // 5 pts per skill, up to 5 skills
  const skillsCount = student.skills ? student.skills.length : 0;
  const skillsScore = Math.min(25, skillsCount * 5);

  // 3. Mock Test Scores (Max 25)
  // Retrieve test history for this student
  const studentResults = db.testResults.filter(r => r.studentEmail === studentEmail);
  let mockTestsScore = 0;
  if (studentResults.length > 0) {
    const totalPercentage = studentResults.reduce((acc, curr) => {
      const percent = (curr.correctAnswers / curr.totalQuestions) * 100;
      return acc + percent;
    }, 0);
    const averagePercent = totalPercentage / studentResults.length;
    mockTestsScore = Math.round((averagePercent / 100) * 25);
  } else {
    // Basic default starting score if profile has items but no mock tests yet
    mockTestsScore = 5;
  }

  // 4. Projects score (Max 15)
  // 7.5 pts per project listed in builder or general skills, max 15
  const projectsCount = (student.resumeBuilderData?.projects ? student.resumeBuilderData.projects.length : 0);
  const projectsScore = Math.min(15, projectsCount * 7.5);

  // 5. Certifications (Max 10)
  // 5 pts per cert, max 10
  const certsCount = student.certifications ? student.certifications.length : 0;
  const certsScore = Math.min(10, certsCount * 5);

  // 6. Profile Completion (Max 5)
  // Check required profile fields
  let completionPoints = 0;
  if (student.name) completionPoints += 0.5;
  if (student.phone) completionPoints += 0.5;
  if (student.college) completionPoints += 0.5;
  if (student.branch) completionPoints += 0.5;
  if (student.percentage > 0) completionPoints += 1;
  if (student.linkedin || student.github) completionPoints += 1;
  if (student.preferredLocation) completionPoints += 1;
  const profileCompletionScore = Math.min(5, completionPoints);

  const totalScore = resumeScore + skillsScore + mockTestsScore + projectsScore + certsScore + profileCompletionScore;

  // Strength, weakness, and suggestion analysis
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvementSuggestions: string[] = [];

  // Resume suggestions
  if (resumeScore === 20) {
    strengths.push("Excellent Resume representation (Both custom-built and uploaded PDF are on file)");
  } else if (resumeScore === 12) {
    strengths.push("Resume is active");
    improvementSuggestions.push("Ensure your custom resume details are fully filled out in the PlacementPro builder to unlock premium PDF templates.");
  } else {
    weaknesses.push("Missing / Incomplete Resume");
    improvementSuggestions.push("Create an ATS-friendly resume using our custom step-by-step Resume Builder to secure higher screening success.");
  }

  // Skills suggestions
  if (skillsCount >= 5) {
    strengths.push(`Strong skills count (${skillsCount} skills listed)`);
  } else {
    weaknesses.push("Underdeveloped skills section");
    improvementSuggestions.push("Add at least 5 key technical skills matching your engineering branch (e.g., C Programming, AutoCAD, PLC Diagnostics).");
  }

  // Mock test suggestions
  if (studentResults.length >= 3) {
    strengths.push("Consistent practice in Aptitude and Technical Mock Assessments");
  } else if (studentResults.length === 0) {
    weaknesses.push("No Mock Test scores recorded");
    improvementSuggestions.push("Take at least 2 Mock Tests (Aptitude, Verbal, and Branch-Technical) under timer constraints to review correct answers.");
  } else {
    improvementSuggestions.push("Attempt more mock test subjects to get a broader analysis of your strength areas.");
  }

  // Academics status
  if (student.percentage >= 75) {
    strengths.push(`Outstanding Academics (${student.percentage}% with 0 active backlogs)`);
  } else if (student.percentage < 60) {
    weaknesses.push("Academic percentage below typical company eligibility cutoffs");
    improvementSuggestions.push("Focus heavily on companies with 55% or 60% requirements, and ensure zero outstanding backlogs.");
  }

  if (student.backlogs > 0) {
    weaknesses.push(`Active Backlogs (${student.backlogs} current backlogs)`);
    improvementSuggestions.push("Many MNCs require 0 active backlogs. Clear outstanding subjects to meet MNC recruitment parameters.");
  }

  // Certifications suggestions
  if (certsCount >= 2) {
    strengths.push("Valuable industrial certifications registered");
  } else if (certsCount === 0) {
    improvementSuggestions.push("List technical certifications (NPTEL, Coursera, Google) to gain 10 bonus points in your resume screening score.");
  }

  // Fallback suggestions if student is doing great
  if (improvementSuggestions.length === 0) {
    improvementSuggestions.push("Your placement preparedness is top-tier! Start applying to drive listings like TCS Smart Hiring and Schneider Electric immediately.");
  }

  return {
    score: totalScore,
    strengths,
    weaknesses,
    improvementSuggestions,
    breakdown: {
      resume: resumeScore,
      skills: skillsScore,
      mockTests: mockTestsScore,
      projects: projectsScore,
      certifications: certsScore,
      profileCompletion: Math.round((profileCompletionScore / 5) * 5)
    }
  };
}

// Generate daily tasks dynamically if not already set for today
function getOrCreateDailyTasks(email: string): DailyTask[] {
  const today = new Date().toISOString().split('T')[0];
  const userTasks = db.dailyTasks.filter(t => t.studentEmail === email && t.date === today);
  
  if (userTasks.length > 0) {
    return userTasks;
  }

  // Generate 3 random structured tasks based on rules
  const student = db.students[email] || INITIAL_STUDENT;
  const newTasks: DailyTask[] = [];

  // Task 1: Aptitude
  newTasks.push({
    id: `task-${Date.now()}-1`,
    studentEmail: email,
    text: "Complete one Aptitude Mock Test to boost logical speed.",
    category: "Aptitude",
    completed: false,
    date: today
  });

  // Task 2: Resume / Skill check
  if (!student.resumeFileName && (!student.resumeBuilderData || !student.resumeBuilderData.personalDetails.fullName)) {
    newTasks.push({
      id: `task-${Date.now()}-2`,
      studentEmail: email,
      text: "Open the Resume Builder and fill your personal/education details.",
      category: "Resume",
      completed: false,
      date: today
    });
  } else if (student.skills.length < 5) {
    newTasks.push({
      id: `task-${Date.now()}-2`,
      studentEmail: email,
      text: "Add at least 5 technical/soft skills to complete your profile.",
      category: "Technical",
      completed: false,
      date: today
    });
  } else {
    newTasks.push({
      id: `task-${Date.now()}-2`,
      studentEmail: email,
      text: "Apply to at least 1 eligible company in the active drive listings.",
      category: "Application",
      completed: false,
      date: today
    });
  }

  // Task 3: Read notes / Practice HR
  const branchSubjectMap: { [key: string]: string } = {
    "Computer Engineering": "RDBMS & SQL Joins",
    "Electronics & Communication": "Embedded C volatile variables",
    "Electrical Engineering": "Transformer and AC parameters",
    "Mechanical Engineering": "AutoCAD projection views",
  };
  const subj = branchSubjectMap[student.branch] || "Interview preparation notes";

  newTasks.push({
    id: `task-${Date.now()}-3`,
    studentEmail: email,
    text: `Study notes regarding ${subj} in the Technical Prep tab.`,
    category: "Technical",
    completed: false,
    date: today
  });

  db.dailyTasks.push(...newTasks);
  saveDatabase();
  return newTasks;
}

// Start Server Setup
async function startServer() {
  initializeDatabase();

  const app = express();
  app.use(express.json());

  // API route for TG ECET CSE AI Tutor using Groq
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      // Support GROQ_API_KEY, or fallbacks if they added the key under other names
      const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: "Groq API Key (GROQ_API_KEY) is not configured on the server. Please add your key in the Settings > Secrets or in a local .env file." 
        });
      }

      const groq = new Groq({ apiKey });

      const systemInstruction = `You are the TG ECET CSE AI Tutor, a dedicated AI assistant built directly into the TG ECET Mock Test & CSE Prep Companion Portal.
Your goal is to provide highly relevant, accurate, and encouraging academic guidance, exam tips, engineering admission advice, and concept explanations specifically for the Telangana State Engineering Common Entrance Test (TG ECET) for Diploma holders in Computer Science and Engineering.

When users chat with you, they might ask about:
1. Mathematics (matrices, calculus, analytical geometry, Fourier series, probability, differential equations).
2. Physics (units/dimensions, elements of vectors, kinematics, friction, thermodynamics, modern physics).
3. Chemistry (atomic structure, solutions, electrochemistry, polymers, environmental chemistry).
4. Computer Science & Engineering (digital electronics, computer organization, operating systems, data structures, Java, OOP, DBMS, software engineering, computer networks).
5. TG ECET exam pattern, branch-specific syllabus, marking scheme, important dates, and smart preparation strategies.
6. College predictions, rank-wise engineering colleges under TS PGECET/ECET counselling (e.g. JNTUH, OU, CBIT, Vasavi, VNR VJIET, MGIT, Gokaraju Rangaraju, etc.), and admission/counselling procedures in Telangana.

Guidelines:
- Keep your answers precise, structured, clear, and easy to read. Use clear formatting, bullet points, code blocks, or simple equations where applicable.
- Maintain a warm, encouraging tone, supporting their transition from Diploma to B.Tech.
- If a user asks something completely unrelated, gently guide them back to TG ECET CSE preparation, but always be friendly and helpful.`;

      // Map history to standard chat message roles
      const messages: any[] = [
        { role: "system", content: systemInstruction }
      ];

      if (Array.isArray(history)) {
        history.forEach((item: any) => {
          const role = item.role === 'assistant' ? 'assistant' : 'user';
          messages.push({
            role: role,
            content: item.text || ""
          });
        });
      }

      // Append the latest user message
      messages.push({
        role: "user",
        content: message
      });

      // Make request to Groq API
      const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4096,
      });

      const reply = chatCompletion.choices?.[0]?.message?.content || "No reply was generated.";
      res.json({ reply });

    } catch (error: any) {
      console.error("Error in AI Chat with Groq:", error);
      res.status(500).json({ error: error.message || "Something went wrong. Please try again." });
    }
  });

  // ----------------------------------------------------
  // AUTHENTICATION ENDPOINTS
  // ----------------------------------------------------
  
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Easy Admin log in bypass
    if (email === "admin@placementpro.in" && password === "admin") {
      return res.json({
        success: true,
        role: "admin",
        user: {
          name: "Placement Director (Admin)",
          email: "admin@placementpro.in",
          college: "State Government Polytechnic HQ"
        }
      });
    }

    const student = db.students[email];
    if (student && student.password === password) {
      return res.json({
        success: true,
        role: "student",
        user: {
          name: student.name,
          email: student.email,
          branch: student.branch
        }
      });
    }

    // Dynamic bypass for testing - if student is loaded in cache but not registered, we register on first try
    if (email === "student@placementpro.in" && password === "password") {
      db.students["student@placementpro.in"] = {
        ...INITIAL_STUDENT,
        password: "password"
      };
      saveDatabase();
      return res.json({
        success: true,
        role: "student",
        user: {
          name: INITIAL_STUDENT.name,
          email: INITIAL_STUDENT.email,
          branch: INITIAL_STUDENT.branch
        }
      });
    }

    return res.status(401).json({ error: "Invalid credentials. Try student@placementpro.in with 'password' or admin@placementpro.in with 'admin'." });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, branch, college, percentage } = req.body;
    
    if (!name || !email || !password || !branch || !college) {
      return res.status(400).json({ error: "Please fill out all mandatory fields." });
    }

    if (db.students[email] || email === "admin@placementpro.in") {
      return res.status(400).json({ error: "This email address is already registered." });
    }

    const newStudent: StudentProfile & { password?: string } = {
      name,
      email,
      phone: "",
      college,
      branch,
      semester: 6,
      percentage: Number(percentage) || 70,
      backlogs: 0,
      skills: ["C Programming", "HTML & CSS"],
      certifications: [],
      preferredLocation: "Bengaluru",
      password
    };

    db.students[email] = newStudent;
    saveDatabase();

    return res.json({
      success: true,
      role: "student",
      user: {
        name,
        email,
        branch
      }
    });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please provide a valid email." });
    }
    return res.json({ success: true, message: "A secure reset link has been dispatched to your email address." });
  });

  // ----------------------------------------------------
  // PROFILE ENDPOINTS
  // ----------------------------------------------------
  
  app.get('/api/student/profile', (req, res) => {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email query parameter required." });
    }

    const student = db.students[email as string];
    if (!student) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    return res.json(student);
  });

  app.post('/api/student/profile', (req, res) => {
    const { email, profileData } = req.body;
    if (!email || !profileData) {
      return res.status(400).json({ error: "Email and profileData are required." });
    }

    const existing = db.students[email];
    if (!existing) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    // Update with preservation of passwords
    db.students[email] = {
      ...existing,
      ...profileData,
      email: existing.email, // lock email
    };

    saveDatabase();
    return res.json({ success: true, profile: db.students[email] });
  });

  // ----------------------------------------------------
  // DASHBOARD & PLACEMENT READINESS SCORE
  // ----------------------------------------------------
  
  app.get('/api/student/dashboard-stats', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const student = db.students[email as string];
    if (!student) return res.status(404).json({ error: "Student profile not found." });

    // Calculate dynamic Placement Readiness Score
    const report = calculateReadinessScore(student, email as string);

    // Profile completion calculations
    let filledCount = 0;
    const essentialFields = ['name', 'phone', 'college', 'branch', 'semester', 'percentage', 'preferredLocation', 'linkedin'];
    essentialFields.forEach(f => {
      if ((student as any)[f]) filledCount++;
    });
    const completionPercent = Math.round((filledCount / essentialFields.length) * 100);

    // Resume Status
    let resumeStatus: 'Incomplete' | 'Uploaded' | 'Built' = 'Incomplete';
    if (student.resumeFileName) resumeStatus = 'Uploaded';
    if (student.resumeBuilderData?.personalDetails?.fullName) resumeStatus = 'Built';

    // Eligible companies count
    const studentBranch = student.branch;
    const studentPercent = student.percentage;
    const studentBacklogs = student.backlogs;

    const eligibleCompanies = db.companies.filter(c => {
      if (c.status !== 'Active') return false;
      const isBranchEligible = c.allowedBranches.includes(studentBranch) || c.allowedBranches.includes("All");
      const isPercentEligible = studentPercent >= c.minPercentage;
      const isBacklogEligible = studentBacklogs <= c.maxBacklogsAllowed;
      return isBranchEligible && isPercentEligible && isBacklogEligible;
    });

    // Applications Summary
    const userApplications = db.applications.filter(a => a.studentEmail === email);
    const saved = userApplications.filter(a => a.status === 'Saved').length;
    const applied = userApplications.filter(a => a.status === 'Applied').length;
    const inProgress = userApplications.filter(a => ['Online Test', 'Interview'].includes(a.status)).length;
    const placed = userApplications.filter(a => ['Selected', 'Offer Received'].includes(a.status)).length;
    const rejected = userApplications.filter(a => a.status === 'Rejected').length;

    // Test stats
    const results = db.testResults.filter(r => r.studentEmail === email);
    const totalTestsTaken = results.length;
    let avgScore = 0;
    if (totalTestsTaken > 0) {
      const totalPoints = results.reduce((acc, curr) => {
        const percent = (curr.correctAnswers / curr.totalQuestions) * 100;
        return acc + percent;
      }, 0);
      avgScore = Math.round(totalPoints / totalTestsTaken);
    }

    // Daily tasks completion count
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = getOrCreateDailyTasks(email as string);
    const completedTasksCount = todayTasks.filter(t => t.completed).length;

    return res.json({
      readinessReport: report,
      profileCompletion: completionPercent,
      resumeStatus,
      upcomingDrivesCount: db.companies.filter(c => c.status === 'Active').length,
      eligibleCompaniesCount: eligibleCompanies.length,
      todayTasksSummary: {
        total: todayTasks.length,
        completed: completedTasksCount
      },
      applicationsSummary: {
        saved,
        applied,
        inProgress,
        placed,
        rejected
      },
      mockTestPerformance: {
        averageScore: avgScore,
        testsTaken: totalTestsTaken
      },
      activities: (db.activityLog || []).filter(a => a.studentEmail === email)
    });
  });

  app.post('/api/student/activity', (req, res) => {
    const { email, type, description } = req.body;
    if (!email || !type || !description) {
      return res.status(400).json({ error: "Email, type, and description are required." });
    }
    const student = db.students[email];
    if (!student) return res.status(404).json({ error: "Student profile not found." });

    logStudentActivity(email, type, description);
    saveDatabase();
    return res.json({ success: true });
  });

  // ----------------------------------------------------
  // COMPANY & ELIGIBILITY ENDPOINTS
  // ----------------------------------------------------
  
  app.get('/api/companies', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const student = db.students[email as string];
    if (!student) return res.status(404).json({ error: "Student profile not found." });

    const userApplications = db.applications.filter(a => a.studentEmail === email);

    // Map each company and attach structural eligibility checks and application status
    const result = db.companies.map(c => {
      // 1. Calculate eligibility
      let eligible = true;
      const reasons: string[] = [];

      if (student.percentage < c.minPercentage) {
        eligible = false;
        reasons.push(`Minimum CGPA/Percentage required is ${c.minPercentage}%. Your academic percentage is ${student.percentage}%.`);
      }

      const branchClean = student.branch.trim();
      const isBranchAllowed = c.allowedBranches.some(b => b.trim() === branchClean || b.trim() === "All");
      if (!isBranchAllowed) {
        eligible = false;
        reasons.push(`Drive is restricted to: ${c.allowedBranches.join(', ')}. Your branch is ${student.branch}.`);
      }

      if (student.backlogs > c.maxBacklogsAllowed) {
        eligible = false;
        reasons.push(`Maximum allowed backlogs is ${c.maxBacklogsAllowed}. You have ${student.backlogs} active backlogs.`);
      }

      const application = userApplications.find(app => app.companyId === c.id);

      return {
        ...c,
        isEligible: eligible,
        eligibilityReason: eligible 
          ? "Meets percentage, branch, and backlog criteria." 
          : reasons.join(' '),
        appliedStatus: application ? application.status : null,
        applicationId: application ? application.id : null
      };
    });

    return res.json(result);
  });

  // ----------------------------------------------------
  // JOB APPLICATION TRACKER
  // ----------------------------------------------------
  
  app.get('/api/applications', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const userApps = db.applications.filter(a => a.studentEmail === email);
    return res.json(userApps);
  });

  app.post('/api/companies/apply', (req, res) => {
    const { email, companyId, resumeType, coverNote } = req.body;
    if (!email || !companyId) return res.status(400).json({ error: "Email and companyId are required." });

    const company = db.companies.find(c => c.id === companyId);
    if (!company) return res.status(404).json({ error: "Company listing not found." });

    // Ensure not already applied
    const existing = db.applications.find(a => a.studentEmail === email && a.companyId === companyId);
    if (existing) {
      if (existing.status !== 'Saved') {
        return res.status(400).json({ error: "You have already applied to this company." });
      } else {
        // Upgrade Saved to Applied
        existing.status = 'Applied';
        existing.resumeType = resumeType || 'none';
        existing.coverNote = coverNote || '';
        existing.timeline.push({
          status: 'Applied',
          date: new Date().toISOString().split('T')[0],
          notes: "Upgraded from saved listing. Application successfully registered."
        });
        saveDatabase();
        return res.json({ success: true, application: existing });
      }
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      studentEmail: email,
      companyId: companyId,
      companyName: company.name,
      jobRole: company.jobRole,
      salaryPackage: company.salaryPackage,
      status: 'Applied',
      timeline: [
        {
          status: 'Applied',
          date: new Date().toISOString().split('T')[0],
          notes: "Applied via PlacementPro smart carrier connector."
        }
      ],
      appliedAt: new Date().toISOString(),
      resumeType: resumeType || 'none',
      coverNote: coverNote || ''
    };

    db.applications.push(newApp);
    logStudentActivity(email, 'Application', `Submitted application for ${company.name} (${company.jobRole})`);
    
    // Auto trigger notification
    db.notifications.push({
      id: `notif-${Date.now()}`,
      title: "Application Successful",
      content: `Your application to ${company.name} for the role of ${company.jobRole} has been registered successfully.`,
      type: "Drive",
      date: new Date().toISOString().split('T')[0],
      read: false
    });

    saveDatabase();
    return res.json({ success: true, application: newApp });
  });

  app.post('/api/companies/save', (req, res) => {
    const { email, companyId } = req.body;
    if (!email || !companyId) return res.status(400).json({ error: "Email and companyId are required." });

    const company = db.companies.find(c => c.id === companyId);
    if (!company) return res.status(404).json({ error: "Company not found." });

    // Check if already in applications
    const existing = db.applications.find(a => a.studentEmail === email && a.companyId === companyId);
    if (existing) {
      return res.json({ success: true, message: "Listing is already tracked.", application: existing });
    }

    const savedApp: Application = {
      id: `app-${Date.now()}`,
      studentEmail: email,
      companyId: companyId,
      companyName: company.name,
      jobRole: company.jobRole,
      salaryPackage: company.salaryPackage,
      status: 'Saved',
      timeline: [
        {
          status: 'Saved',
          date: new Date().toISOString().split('T')[0],
          notes: "Saved to explore rules later."
        }
      ],
      appliedAt: new Date().toISOString()
    };

    db.applications.push(savedApp);
    logStudentActivity(email, 'Application', `Saved job drive: ${company.name}`);
    saveDatabase();
    return res.json({ success: true, application: savedApp });
  });

  app.post('/api/applications/update-status', (req, res) => {
    const { applicationId, status, notes } = req.body;
    if (!applicationId || !status) return res.status(400).json({ error: "applicationId and status are required." });

    const appRecord = db.applications.find(a => a.id === applicationId);
    if (!appRecord) return res.status(404).json({ error: "Application tracker record not found." });

    appRecord.status = status;
    appRecord.timeline.push({
      status,
      date: new Date().toISOString().split('T')[0],
      notes: notes || `Application timeline updated to: ${status}`
    });

    saveDatabase();
    return res.json({ success: true, application: appRecord });
  });

  // ----------------------------------------------------
  // RESUME UPLOAD AND BUILDER
  // ----------------------------------------------------
  
  app.post('/api/student/resume-upload', (req, res) => {
    const { email, fileName } = req.body;
    if (!email || !fileName) return res.status(400).json({ error: "Email and fileName are required." });

    const student = db.students[email];
    if (!student) return res.status(404).json({ error: "Student profile not found." });

    student.resumeFileName = fileName;
    student.resumeUploadedAt = new Date().toISOString();
    
    // Log as daily task completed
    const today = new Date().toISOString().split('T')[0];
    const uploadTasks = db.dailyTasks.filter(t => t.studentEmail === email && t.category === "Resume" && t.date === today);
    uploadTasks.forEach(t => t.completed = true);

    logStudentActivity(email, 'Resume', `Uploaded resume document: ${fileName}`);

    saveDatabase();
    return res.json({ success: true, profile: student });
  });

  app.post('/api/student/resume-builder', (req, res) => {
    const { email, resumeData } = req.body;
    if (!email || !resumeData) return res.status(400).json({ error: "Email and resumeData are required." });

    const student = db.students[email];
    if (!student) return res.status(404).json({ error: "Student profile not found." });

    student.resumeBuilderData = resumeData;
    
    // Sync critical variables into main student profile
    if (resumeData.personalDetails) {
      if (resumeData.personalDetails.fullName) student.name = resumeData.personalDetails.fullName;
      if (resumeData.personalDetails.phone) student.phone = resumeData.personalDetails.phone;
    }
    if (resumeData.skills && resumeData.skills.length > 0) {
      // union skills
      const currentSkills = new Set(student.skills || []);
      resumeData.skills.forEach((s: string) => {
        if (s && s.trim()) currentSkills.add(s.trim());
      });
      student.skills = Array.from(currentSkills);
    }
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      const currentCerts = new Set(student.certifications || []);
      resumeData.certifications.forEach((c: string) => {
        if (c && c.trim()) currentCerts.add(c.trim());
      });
      student.certifications = Array.from(currentCerts);
    }

    // Auto mark daily task if builder updated
    const today = new Date().toISOString().split('T')[0];
    const resumeTasks = db.dailyTasks.filter(t => t.studentEmail === email && t.category === "Resume" && t.date === today);
    resumeTasks.forEach(t => t.completed = true);

    logStudentActivity(email, 'Resume', "Updated profile resume data using ATS Builder");

    saveDatabase();
    return res.json({ success: true, profile: student });
  });

  // ----------------------------------------------------
  // MOCK TESTS & ASSESSMENTS
  // ----------------------------------------------------
  
  app.get('/api/mock-tests', (req, res) => {
    // Return tests without correctOptionIndex for security if student taking test
    const sanitizedTests = db.mockTests.map(test => ({
      ...test,
      questions: test.questions.map(q => {
        const { correctOptionIndex, explanation, ...rest } = q;
        return rest; // omit critical values during gameplay
      })
    }));
    return res.json(sanitizedTests);
  });

  app.get('/api/mock-tests/questions', (req, res) => {
    const { testId } = req.query;
    if (!testId) return res.status(400).json({ error: "testId is required" });
    const test = db.mockTests.find(t => t.id === testId);
    if (!test) return res.status(404).json({ error: "Mock test not found" });

    const sanitizedQuestions = test.questions.map(q => {
      const { correctOptionIndex, explanation, ...rest } = q;
      return rest;
    });
    return res.json(sanitizedQuestions);
  });

  app.post('/api/mock-tests/submit', (req, res) => {
    const { email, testId, answers, timeTakenSeconds } = req.body;
    if (!email || !testId || !answers) return res.status(400).json({ error: "Missing required properties." });

    const originalTest = db.mockTests.find(t => t.id === testId);
    if (!originalTest) return res.status(404).json({ error: "Mock test ID not found." });

    let correctCount = 0;
    const feedbackList = originalTest.questions.map((q) => {
      const selectedOptionText = answers[q.id];
      const userIndex = q.options.indexOf(selectedOptionText);
      const isCorrect = userIndex === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        text: q.text,
        options: q.options,
        userAnswerIndex: userIndex,
        correctAnswerIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const finalScore = correctCount;
    const totalQuestions = originalTest.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = percentage >= 60; // 60% passing score cutoff

    const explanations = feedbackList.map(f => ({
      questionId: f.questionId,
      questionText: f.text,
      selectedAnswer: answers[f.questionId] || 'Not answered',
      correctAnswer: f.options[f.correctAnswerIndex] || 'N/A',
      isCorrect: f.isCorrect,
      explanation: f.explanation
    }));

    const resultRecord = {
      id: `res-${Date.now()}`,
      studentEmail: email,
      testId: testId,
      testTitle: originalTest.title,
      category: originalTest.category,
      score: finalScore,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      timeTakenSeconds: timeTakenSeconds || 60,
      date: new Date().toISOString(),
      percentage,
      passed,
      explanations
    };

    db.testResults.push(resultRecord as any);
    logStudentActivity(email, 'Mock Test', `Completed Mock Test: ${originalTest.title} (Score: ${correctCount}/${totalQuestions})`);

    // Auto complete daily task
    const today = new Date().toISOString().split('T')[0];
    const testTasks = db.dailyTasks.filter(t => t.studentEmail === email && t.category === "Aptitude" && t.date === today);
    testTasks.forEach(t => t.completed = true);

    saveDatabase();

    // The client expects result to have: score, totalQuestions, correctAnswers, percentage, passed, explanations
    const clientResult = {
      ...resultRecord
    };

    return res.json({
      success: true,
      result: clientResult,
      detailedFeedback: feedbackList
    });
  });

  app.get('/api/mock-tests/history', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const results = db.testResults.filter(r => r.studentEmail === email).map(r => {
      const percentage = r.totalQuestions > 0 ? Math.round((r.correctAnswers / r.totalQuestions) * 100) : 0;
      const passed = percentage >= 60;
      return {
        ...r,
        percentage,
        passed
      };
    });
    return res.json(results);
  });

  // ----------------------------------------------------
  // TECHNICAL STUDY PREPARATION RESOURCES
  // ----------------------------------------------------
  
  app.get('/api/resources', (req, res) => {
    const { branch } = req.query;
    if (branch && branch !== 'All') {
      const filtered = db.resources.filter(r => r.branch === branch || r.branch === "All");
      return res.json(filtered);
    }
    return res.json(db.resources);
  });

  // ----------------------------------------------------
  // DAILY TASKS SYSTEM
  // ----------------------------------------------------
  
  app.get('/api/daily-tasks', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required." });

    const tasks = getOrCreateDailyTasks(email as string);
    return res.json(tasks);
  });

  app.post('/api/daily-tasks/toggle', (req, res) => {
    const { taskId, completed } = req.body;
    if (!taskId) return res.status(400).json({ error: "taskId is required." });

    const task = db.dailyTasks.find(t => t.id === taskId);
    if (!task) return res.status(404).json({ error: "Daily task not found." });

    task.completed = completed;
    saveDatabase();

    return res.json({ success: true, task });
  });

  // ----------------------------------------------------
  // ANNOUNCEMENTS & NOTIFICATIONS
  // ----------------------------------------------------
  
  app.get('/api/announcements', (req, res) => {
    return res.json(db.announcements);
  });

  app.get('/api/notifications', (req, res) => {
    return res.json(db.notifications);
  });

  app.post('/api/notifications/mark-read', (req, res) => {
    const { id } = req.body;
    if (id) {
      const notif = db.notifications.find(n => n.id === id);
      if (notif) notif.read = true;
    } else {
      // Mark all read
      db.notifications.forEach(n => n.read = true);
    }
    saveDatabase();
    return res.json({ success: true });
  });

  // ----------------------------------------------------
  // ADMINISTRATOR PANEL OPERATION ENDPOINTS
  // ----------------------------------------------------
  
  // 1. Get List of Enrolled Students
  app.get('/api/admin/students', (req, res) => {
    // Map with calculated readiness score
    const studentsList = Object.keys(db.students).map(email => {
      const profile = db.students[email];
      const stats = calculateReadinessScore(profile, email);
      return {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        college: profile.college,
        branch: profile.branch,
        percentage: profile.percentage,
        backlogs: profile.backlogs,
        skillsCount: profile.skills ? profile.skills.length : 0,
        readinessScore: stats.score
      };
    });
    return res.json(studentsList);
  });

  // 2. Company CRUD
  app.post('/api/admin/companies', (req, res) => {
    const companyData = req.body;
    if (!companyData.name || !companyData.jobRole || !companyData.salaryPackage) {
      return res.status(400).json({ error: "Missing required company parameters." });
    }

    const newComp: Company = {
      id: `comp-${Date.now()}`,
      name: companyData.name,
      logo: companyData.logo || "COMP",
      description: companyData.description || "",
      minPercentage: Number(companyData.minPercentage) || 60,
      allowedBranches: Array.isArray(companyData.allowedBranches) ? companyData.allowedBranches : ["All"],
      maxBacklogsAllowed: Number(companyData.maxBacklogsAllowed) ?? 0,
      salaryPackage: companyData.salaryPackage,
      jobRole: companyData.jobRole,
      selectionProcess: Array.isArray(companyData.selectionProcess) ? companyData.selectionProcess : ["Aptitude Test", "Interview"],
      applicationDeadline: companyData.applicationDeadline || new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
      location: companyData.location || "Pan India",
      website: companyData.website || "https://example.com",
      status: companyData.status || "Active"
    };

    db.companies.push(newComp);

    // Auto broadcast drive announcement
    db.announcements.push({
      id: `ann-${Date.now()}`,
      title: `New Placement Drive: ${newComp.name} hiring for ${newComp.jobRole}`,
      content: `A brand-new active career placement drive is open for eligible ${newComp.allowedBranches.join('/')} Diploma engineering students. Deadline to apply is ${newComp.applicationDeadline}. Salary package is ${newComp.salaryPackage}.`,
      author: "Placement Officer System",
      date: new Date().toISOString().split('T')[0],
      important: true
    });

    db.notifications.push({
      id: `notif-${Date.now()}`,
      title: "New Drive Announced",
      content: `${newComp.name} is now conducting placements for ${newComp.jobRole}.`,
      type: "Drive",
      date: new Date().toISOString().split('T')[0],
      read: false
    });

    saveDatabase();
    return res.json({ success: true, company: newComp });
  });

  app.put('/api/admin/companies/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const compIdx = db.companies.findIndex(c => c.id === id);

    if (compIdx === -1) {
      return res.status(404).json({ error: "Company listing not found." });
    }

    db.companies[compIdx] = {
      ...db.companies[compIdx],
      ...body,
      id // lock ID
    };

    saveDatabase();
    return res.json({ success: true, company: db.companies[compIdx] });
  });

  app.delete('/api/admin/companies/:id', (req, res) => {
    const { id } = req.params;
    const filtered = db.companies.filter(c => c.id !== id);
    if (filtered.length === db.companies.length) {
      return res.status(404).json({ error: "Company not found." });
    }
    db.companies = filtered;
    saveDatabase();
    return res.json({ success: true });
  });

  // 3. Create Campus Announcements
  app.post('/api/admin/announcements', (req, res) => {
    const { title, content, important } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content required." });

    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      author: "Placement Cell Admin",
      date: new Date().toISOString().split('T')[0],
      important: !!important
    };

    db.announcements.unshift(ann);
    saveDatabase();
    return res.json({ success: true, announcement: ann });
  });

  // 4. Create/Upload Notes & Resources
  app.post('/api/admin/resources', (req, res) => {
    const { title, branch, subject, category, summary, content } = req.body;
    if (!title || !branch || !subject || !content) {
      return res.status(400).json({ error: "Missing required study resource parameters." });
    }

    const resItem: StudyResource = {
      id: `res-${Date.now()}`,
      title,
      branch,
      subject,
      category: category || "Notes",
      summary: summary || "",
      content
    };

    db.resources.unshift(resItem);
    saveDatabase();
    return res.json({ success: true, resource: resItem });
  });

  // 5. Add Custom Test MCQ Question
  app.post('/api/admin/questions', (req, res) => {
    const { testId, text, options, correctOptionIndex, explanation, category } = req.body;
    if (!testId || !text || !options || correctOptionIndex === undefined) {
      return res.status(400).json({ error: "Missing question parameters." });
    }

    const test = db.mockTests.find(t => t.id === testId);
    if (!test) return res.status(404).json({ error: "Mock test ID not found." });

    const newQuest: PlacementQuestion = {
      id: `q-${Date.now()}`,
      text,
      options,
      correctOptionIndex: Number(correctOptionIndex),
      explanation: explanation || "",
      category: category || test.category
    };

    test.questions.push(newQuest);
    saveDatabase();
    return res.json({ success: true, question: newQuest });
  });

  // 6. Admin Analytics dashboard aggregating stats
  app.get('/api/admin/analytics', (req, res) => {
    const studentsList = Object.values(db.students);
    const totalStudents = studentsList.length;
    const totalCompanies = db.companies.length;
    const totalApplications = db.applications.length;

    // Placed count calculation
    const placedStudentsSet = new Set(
      db.applications
        .filter(a => ['Selected', 'Offer Received'].includes(a.status))
        .map(a => a.studentEmail)
    );
    const placedCount = placedStudentsSet.size;

    // Branches distribution
    const branchCounts: { [key: string]: number } = {};
    studentsList.forEach(s => {
      branchCounts[s.branch] = (branchCounts[s.branch] || 0) + 1;
    });

    // Readiness averages
    let sumScore = 0;
    studentsList.forEach(s => {
      sumScore += calculateReadinessScore(s, s.email).score;
    });
    const avgReadiness = totalStudents > 0 ? Math.round(sumScore / totalStudents) : 0;

    // Packages ranges
    const activePackages = db.companies.map(c => {
      const num = parseFloat(c.salaryPackage);
      return isNaN(num) ? 0 : num;
    });
    const maxPackage = activePackages.length > 0 ? Math.max(...activePackages) : 0;

    // Applications timelines counts
    const statusBreakdown = {
      Saved: db.applications.filter(a => a.status === 'Saved').length,
      Applied: db.applications.filter(a => a.status === 'Applied').length,
      OnlineTest: db.applications.filter(a => a.status === 'Online Test').length,
      Interview: db.applications.filter(a => a.status === 'Interview').length,
      Selected: db.applications.filter(a => a.status === 'Selected').length,
      Rejected: db.applications.filter(a => a.status === 'Rejected').length,
      OfferReceived: db.applications.filter(a => a.status === 'Offer Received').length
    };

    return res.json({
      totalStudents,
      totalCompanies,
      totalApplications,
      placedCount,
      placedPercentage: totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0,
      branchDistribution: branchCounts,
      averageReadinessScore: avgReadiness,
      highestSalaryLPA: `${maxPackage} LPA`,
      statusBreakdown
    });
  });

  // ----------------------------------------------------
  // FRONTEND OR DEV SERVER HANDLER
  // ----------------------------------------------------
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`[PlacementPro] Express engine is fully bootlocked on port ${port}`);
    console.log(`[PlacementPro] Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[PlacementPro] Access preview at: http://localhost:${port}`);
    console.log(`======================================================\n`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting Express platform:", err);
});
