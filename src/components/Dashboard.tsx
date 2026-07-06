import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Briefcase, 
  UserCheck, 
  ChevronRight,
  ClipboardList,
  AlertCircle,
  FileCheck,
  Megaphone,
  CheckSquare,
  Square
} from 'lucide-react';
import { StudentProfile, DailyTask, Announcement, DashboardStats, ActivityLog } from '../types';

interface DashboardProps {
  student: StudentProfile;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ student, onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskToggling, setTaskToggling] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!student || !student.email) return;
    try {
      setLoading(true);
      
      // 1. Fetch dashboard stats
      const statsRes = await fetch(`/api/student/dashboard-stats?email=${encodeURIComponent(student.email)}`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // 2. Fetch daily tasks
      const tasksRes = await fetch(`/api/daily-tasks?email=${encodeURIComponent(student.email)}`);
      const tasksData = await tasksRes.json();
      setTasks(tasksData);

      // 3. Fetch announcements
      const annRes = await fetch('/api/announcements');
      const annData = await annRes.json();
      setAnnouncements(annData.slice(0, 3)); // show top 3
      
    } catch (e) {
      console.error("Failed to load dashboard statistics", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [student]);

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    setTaskToggling(taskId);
    try {
      const res = await fetch('/api/daily-tasks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: !currentStatus })
      });
      if (res.ok) {
        // Optimistically update tasks and refresh stats
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
        
        // Refresh stats silently
        const statsRes = await fetch(`/api/student/dashboard-stats?email=${encodeURIComponent(student.email)}`);
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTaskToggling(null);
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse" id="dashboard-loading">
        <div className="h-40 bg-white border border-[#e8e6dd] rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white border border-[#e8e6dd] rounded-3xl"></div>
          <div className="h-64 bg-white border border-[#e8e6dd] rounded-3xl"></div>
          <div className="h-64 bg-white border border-[#e8e6dd] rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const report = stats.readinessReport;
  const score = report.score;

  // Group activities by date
  const activitiesByDate = (stats.activities || []).reduce((acc, act) => {
    const dStr = act.date;
    if (!acc[dStr]) acc[dStr] = [];
    acc[dStr].push(act);
    return acc;
  }, {} as Record<string, ActivityLog[]>);

  // Calculate stats
  const activeDates = Object.keys(activitiesByDate).sort();
  const totalActiveDays = activeDates.length;

  // Streak calculation (backwards from current date July 5, 2026)
  let currentStreak = 0;
  let tempDate = new Date("2026-07-05");
  while (true) {
    const dStr = tempDate.toISOString().split('T')[0];
    if (activitiesByDate[dStr]) {
      currentStreak++;
      tempDate.setDate(tempDate.getDate() - 1);
    } else {
      // If we checked today and it's not active, check if yesterday was active to continue streak
      if (tempDate.toISOString().split('T')[0] === "2026-07-05") {
        tempDate.setDate(tempDate.getDate() - 1);
        const yestStr = tempDate.toISOString().split('T')[0];
        if (activitiesByDate[yestStr]) {
          currentStreak++;
          tempDate.setDate(tempDate.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  // Longest streak calculation
  let longestStreak = 0;
  let currentRun = 0;
  let lastDate: Date | null = null;

  const sortedDates = activeDates.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  sortedDates.forEach((d) => {
    if (!lastDate) {
      currentRun = 1;
    } else {
      const diffTime = Math.abs(d.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentRun++;
      } else if (diffDays > 1) {
        currentRun = 1;
      }
    }
    if (currentRun > longestStreak) {
      longestStreak = currentRun;
    }
    lastDate = d;
  });

  // Generate heatmap grid cells for the last 23 weeks (161 days)
  const endDate = new Date("2026-07-05");
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 161); // 23 weeks

  // Align start to the preceding Sunday so each column starts on Sunday
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);

  const cells: { date: Date; dateStr: string; dayOfWeek: number }[] = [];
  let currentGridDate = new Date(startDate);
  while (currentGridDate <= endDate) {
    const dateStr = currentGridDate.toISOString().split('T')[0];
    cells.push({
      date: new Date(currentGridDate),
      dateStr,
      dayOfWeek: currentGridDate.getDay()
    });
    currentGridDate.setDate(currentGridDate.getDate() + 1);
  }

  // Chunk into weeks (each column will be a week of 7 cells)
  const weeks: { date: Date; dateStr: string; dayOfWeek: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Find score color range
  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-emerald-600 border-emerald-200 bg-emerald-50';
    if (s >= 55) return 'text-blue-600 border-blue-200 bg-blue-50';
    return 'text-amber-600 border-amber-200 bg-amber-50';
  };

  return (
    <div className="space-y-8" id="student-dashboard">
      
      {/* 1. Welcoming Hero Banner */}
      <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/70 via-transparent to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#efede6] rounded-full text-xs font-semibold text-[#5c5650]">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Active Diploma Semester 6 Candidate
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1a19]">
            Welcome back, {student.name}!
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5650] max-w-xl leading-relaxed">
            Ready to secure your career placement? Your profiles are calibrated for <strong className="text-[#1c1a19]">{student.branch}</strong> at {student.college}. Update your skills and check mock scores to maintain placement eligibility.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[11px] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg font-bold text-blue-700">
              GPA: {student.percentage}%
            </span>
            <span className="text-[11px] bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg font-bold text-red-700">
              Backlogs: {student.backlogs} Active
            </span>
            <span className="text-[11px] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg font-bold text-emerald-700">
              {stats.eligibleCompaniesCount} Eligible Placements Drive
            </span>
          </div>
        </div>

        {/* Dynamic score graphic widget */}
        <div className="flex flex-col items-center justify-center text-center shrink-0 p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl sm:w-48 relative">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8c857e] mb-1">Readiness Score</div>
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#f1efe8" strokeWidth="6" fill="transparent" />
              <circle 
                cx="48" 
                cy="48" 
                r="40" 
                stroke={score >= 75 ? "#10b981" : score >= 55 ? "#3b82f6" : "#f59e0b"} 
                strokeWidth="6" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-2xl font-black text-[#1c1a19] font-mono">{score}<span className="text-xs font-normal text-[#8c857e]">/100</span></div>
          </div>
          <div className={`mt-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getScoreColor(score)}`}>
            {score >= 75 ? 'Top Placement Ready' : score >= 55 ? 'Good Progress' : 'Action Needed'}
          </div>
        </div>
      </div>

      {/* 2. Top Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider">Profile Setup</span>
            <span className="text-xs font-bold text-blue-600">{stats.profileCompletion}%</span>
          </div>
          <div className="h-2 bg-[#f1efe8] rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${stats.profileCompletion}%` }}></div>
          </div>
          <p className="text-[10px] text-[#7c756e]">
            {stats.profileCompletion === 100 ? 'All parameters complete.' : 'Fill missing socials to hit 100%.'}
          </p>
        </div>

        <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider block">Resume Integrity</span>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold text-[#1c1a19]">{stats.resumeStatus}</span>
          </div>
          <p className="text-[10px] text-[#7c756e]">
            {stats.resumeStatus === 'Built' ? 'Formatted with PDF templates.' : 'Upload PDF or use our Builder.'}
          </p>
        </div>

        <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider block">Mock Test average</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-bold text-[#1c1a19] font-mono">{stats.mockTestPerformance.averageScore}%</span>
          </div>
          <p className="text-[10px] text-[#7c756e]">
            Based on {stats.mockTestPerformance.testsTaken} assessment submissions.
          </p>
        </div>

        <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
          <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider block">Active Drive Eligibility</span>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-bold text-[#1c1a19]">{stats.eligibleCompaniesCount} Company Matches</span>
          </div>
          <p className="text-[10px] text-[#7c756e]">
            Meeting all cutoff parameters.
          </p>
        </div>

      </div>

      {/* Consistency Heatmap Card */}
      <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-6" id="consistency-heatmap-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#1c1a19] flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Candidate Consistency Heatmap
            </h3>
            <p className="text-xs text-[#7c756e]">
              Daily platform engagement tracking (Mock Tests, Study Notes, ATS Builder updates, Applications)
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider bg-[#faf9f6] px-2.5 py-1 rounded-lg border border-[#e8e6dd]">
              Avg. Consistency: {Math.round((totalActiveDays / 161) * 100)}%
            </span>
          </div>
        </div>

        {/* Heatmap Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#faf9f6] p-4 rounded-2xl border border-[#efede6]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider block">Total Active Days</span>
            <div className="text-lg font-black text-[#1c1a19] font-mono">{totalActiveDays} Days</div>
          </div>
          <div className="space-y-1 border-l border-[#efede6] pl-4">
            <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider block">Current Streak</span>
            <div className="text-lg font-black text-amber-600 font-mono flex items-center gap-1">
              {currentStreak} Days 🔥
            </div>
          </div>
          <div className="space-y-1 border-l border-[#efede6] pl-4">
            <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider block">Longest Streak</span>
            <div className="text-lg font-black text-emerald-600 font-mono">{longestStreak} Days 🏆</div>
          </div>
          <div className="space-y-1 border-l border-[#efede6] pl-4">
            <span className="text-[10px] font-bold text-[#8c857e] uppercase tracking-wider block">Completed Actions</span>
            <div className="text-lg font-black text-blue-600 font-mono">{(stats.activities || []).length} Actions</div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-3">
          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200" id="heatmap-grid-container">
            <div className="min-w-[720px] flex gap-3 select-none">
              {/* Day Labels Column */}
              <div className="flex flex-col justify-between text-[10px] font-bold text-[#8c857e] py-1 shrink-0 w-8">
                <span>Sun</span>
                <span>Tue</span>
                <span>Thu</span>
                <span>Sat</span>
              </div>

              {/* Heatmap weeks columns */}
              <div className="flex gap-1.5 items-center flex-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5">
                    {week.map((dayCell) => {
                      const dayActivities = activitiesByDate[dayCell.dateStr] || [];
                      const count = dayActivities.length;
                      
                      // Color ranges
                      let cellColor = 'bg-[#efede6] text-[#c6c2b3]';
                      if (count === 1) cellColor = 'bg-blue-100 hover:bg-blue-200 border border-blue-200/50 cursor-pointer';
                      else if (count === 2) cellColor = 'bg-blue-300 hover:bg-blue-400 border border-blue-400/50 cursor-pointer';
                      else if (count >= 3) cellColor = 'bg-blue-600 hover:bg-blue-700 border border-blue-700/50 cursor-pointer text-white';

                      const dateDisplay = new Date(dayCell.dateStr).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });

                      const titleTooltip = `${dateDisplay}: ${count} activity${count === 1 ? '' : 'ies'}`;

                      return (
                        <button
                          key={dayCell.dateStr}
                          title={titleTooltip}
                          onClick={() => count > 0 && setSelectedDate(selectedDate === dayCell.dateStr ? null : dayCell.dateStr)}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${cellColor} ${
                            selectedDate === dayCell.dateStr ? 'ring-2 ring-indigo-600 ring-offset-1 scale-110 z-10' : ''
                          }`}
                        >
                          {count > 0 && (
                            <span className="text-[7px] font-bold pointer-events-none">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#7c756e]">
            <span className="italic text-[11px]">Click on highlighted days to view activity breakdown below</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-[#efede6] border border-[#e8e6dd]"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200/50"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-300 border border-blue-400/50"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-600 border border-blue-700/50"></div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Selected date activity detail logs */}
        {selectedDate && activitiesByDate[selectedDate] && (
          <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-blue-100/50 pb-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Activities on {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-[10px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded-lg cursor-pointer"
              >
                Clear selection
              </button>
            </div>
            <ul className="space-y-2">
              {activitiesByDate[selectedDate].map((act, idx) => (
                <li key={idx} className="bg-white p-3 rounded-xl border border-blue-100 flex items-start gap-3">
                  <div className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-lg text-[9px] uppercase font-extrabold tracking-wider mt-0.5 shrink-0">
                    {act.type}
                  </div>
                  <div className="flex-1 text-xs text-[#3c3630] leading-relaxed">
                    {act.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. Main Grid layout: Readiness Breakdown vs Tasks Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Grid: Placement Readiness Score Report */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-[#1c1a19]">Placement Readiness Audit</h3>
              <p className="text-xs text-[#7c756e]">A detailed point-based diagnostic compiled from real polytechnic hiring filters.</p>
            </div>

            {/* Score item progress bars */}
            <div className="space-y-3 pt-2">
              {[
                { name: "Technical Skills Listing", score: report.breakdown.skills, max: 25, desc: "Branch competencies" },
                { name: "Mock Test Practice Grades", score: report.breakdown.mockTests, max: 25, desc: "Aptitude & English averages" },
                { name: "Resume Formatting & Integrity", score: report.breakdown.resume, max: 20, desc: "Builder detail checklist" },
                { name: "Project Demonstrations", score: report.breakdown.projects, max: 15, desc: "Mini projects listed" },
                { name: "Technical Certifications", score: report.breakdown.certifications, max: 10, desc: "NPTEL/Google additions" },
                { name: "Basic Profile Completion", score: report.breakdown.profileCompletion, max: 5, desc: "Primary academic fields" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 bg-[#faf9f6] p-3 rounded-2xl border border-[#f1efe8]">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#2c2a29]">{item.name}</span>
                    <span className="text-[#5c5650] font-mono">{item.score} / {item.max}</span>
                  </div>
                  <div className="h-1.5 bg-[#efede6] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Strengths & Weaknesses expansion panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#8c857e]">Strengths Identified</span>
                <ul className="space-y-1.5">
                  {report.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-1.5 leading-tight">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                  {report.strengths.length === 0 && (
                    <p className="text-[10px] text-[#a29b93] italic">No active strengths recorded. Fill details to show status.</p>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#8c857e]">Development Opportunities</span>
                <ul className="space-y-1.5">
                  {report.weaknesses.map((weak, idx) => (
                    <li key={idx} className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex items-start gap-1.5 leading-tight">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                  {report.weaknesses.length === 0 && (
                    <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 leading-tight">
                      Awesome! No major weaknesses flagged.
                    </p>
                  )}
                </ul>
              </div>
            </div>

            {/* Dynamic rule-based recommendations */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Recommended Action Items:
              </span>
              <ul className="space-y-1 text-xs text-[#4c4844] leading-relaxed">
                {report.improvementSuggestions.map((sug, idx) => (
                  <li key={idx} className="list-disc ml-4">{sug}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Grid: Daily Tasks & Campus Announcements */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily Tasks Interactive checklist */}
          <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4" id="daily-tasks-panel">
            <div>
              <h3 className="text-base font-serif font-bold text-[#1c1a19] flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-[#8c857e]" />
                Daily Actions Guide
              </h3>
              <p className="text-xs text-[#7c756e]">Rule-generated steps to increase score and ready you for active drives.</p>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  disabled={taskToggling === task.id}
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className={`w-full text-left p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                    task.completed 
                      ? 'bg-slate-50 border-[#efede6] text-[#8c857e]' 
                      : 'bg-white border-[#e8e6dd] text-[#2c2a29] hover:bg-slate-50'
                  }`}
                >
                  <span className="shrink-0 mt-0.5">
                    {task.completed ? (
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600 stroke-[2]" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-md border border-[#c6c2b3]"></div>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-relaxed ${task.completed ? 'line-through' : ''}`}>
                      {task.text}
                    </p>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#a29b93] mt-1 block">
                      Category: {task.category}
                    </span>
                  </div>
                </button>
              ))}

              {tasks.length === 0 && (
                <p className="text-xs text-[#a29b93] italic text-center py-4">Generating your checklist. Please wait...</p>
              )}
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Placement Portal Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate('mock-tests')}
                className="p-3 text-left bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl transition text-xs font-bold text-blue-800 space-y-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>Take Mock Tests</span>
              </button>
              
              <button 
                onClick={() => onNavigate('resume-builder')}
                className="p-3 text-left bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-2xl transition text-xs font-bold text-emerald-800 space-y-1"
              >
                <FileCheck className="h-4 w-4" />
                <span>Build ATS Resume</span>
              </button>
              
              <button 
                onClick={() => onNavigate('companies')}
                className="p-3 text-left bg-amber-50/50 hover:bg-amber-50 border border-amber-100 rounded-2xl transition text-xs font-bold text-amber-800 space-y-1"
              >
                <Briefcase className="h-4 w-4" />
                <span>Check Eligibility</span>
              </button>

              <button 
                onClick={() => onNavigate('technical-prep')}
                className="p-3 text-left bg-purple-50/50 hover:bg-purple-50 border border-purple-100 rounded-2xl transition text-xs font-bold text-purple-800 space-y-1"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Technical prep notes</span>
              </button>
            </div>
          </div>

          {/* Campus Bulletin announcements */}
          <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="h-4 w-4" />
                Active Campus Announcements
              </h3>
            </div>
            
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#1c1a19] line-clamp-1">{ann.title}</span>
                    {ann.important && (
                      <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Urgent</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5c5650] line-clamp-2 leading-relaxed">{ann.content}</p>
                  <div className="flex items-center justify-between text-[9px] text-[#a29b93] font-mono pt-1">
                    <span>{ann.author}</span>
                    <span>{ann.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
