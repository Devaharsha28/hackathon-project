import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  BookOpen, 
  Megaphone, 
  Plus, 
  Trash2, 
  CheckCircle, 
  TrendingUp, 
  AlertCircle,
  Sliders,
  Check,
  FilePlus,
  Compass
} from 'lucide-react';
import { StudentProfile, Company, MockTest, StudyResource, Announcement } from '../types';

interface AdminPanelProps {
  adminEmail: string;
}

export default function AdminPanel({ adminEmail }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<'analytics' | 'students' | 'companies' | 'materials' | 'announcements'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for ADD COMPANY
  const [compName, setCompName] = useState('');
  const [compLogo, setCompLogo] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compRole, setCompRole] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compPercentage, setCompPercentage] = useState('65');
  const [compBacklogs, setCompBacklogs] = useState('0');
  const [compSalary, setCompSalary] = useState('3.5 LPA');
  const [compLocation, setCompLocation] = useState('Pune');
  const [compBranches, setCompBranches] = useState<string[]>(['Computer Engineering']);
  const [compDeadline, setCompDeadline] = useState('2026-12-15');

  // Form states for ADD MATERIAL
  const [matTitle, setMatTitle] = useState('');
  const [matBranch, setMatBranch] = useState('Computer Engineering');
  const [matTopic, setMatTopic] = useState('');
  const [matCategory, setMatCategory] = useState<'Study Notes' | 'Previous Papers' | 'Coding Challenges'>('Study Notes');
  const [matContent, setMatContent] = useState('');

  // Form states for ADD ANNOUNCEMENT
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annImportant, setAnnImportant] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Admin Analytics
      const analRes = await fetch('/api/admin/analytics');
      const analData = await analRes.json();
      setAnalytics(analData);

      // 2. Fetch Students List
      const studRes = await fetch('/api/admin/students');
      const studData = await studRes.json();
      setStudents(studData);

      // 3. Fetch Companies List
      const compRes = await fetch('/api/companies');
      const compData = await compRes.json();
      setCompanies(compData);

      // 4. Fetch Materials
      const matRes = await fetch('/api/study-resources');
      const matData = await matRes.json();
      setResources(matData);

      // 5. Fetch Announcements
      const annRes = await fetch('/api/announcements');
      const annData = await annRes.json();
      setAnnouncements(annData);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Add Company
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName || !compRole || !compDesc) return;

    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: compName,
          logo: compLogo || compName.substring(0, 2).toUpperCase(),
          website: compWebsite || 'https://example.com',
          jobRole: compRole,
          description: compDesc,
          minPercentage: Number(compPercentage),
          maxBacklogsAllowed: Number(compBacklogs),
          salaryPackage: compSalary,
          location: compLocation,
          allowedBranches: compBranches,
          selectionProcess: ["Online Aptitude Test", "Technical Interview Panel", "HR Clearance Board"],
          applicationDeadline: compDeadline
        })
      });
      if (!res.ok) throw new Error("Could not insert company.");

      triggerToast(`Drive created for ${compName}! Matches synced.`);
      // reset form
      setCompName('');
      setCompRole('');
      setCompDesc('');
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Study Material
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle || !matTopic || !matContent) return;

    try {
      const res = await fetch('/api/admin/study-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: matTitle,
          branch: matBranch,
          topic: matTopic,
          category: matCategory,
          content: matContent,
          author: 'T&P Officer Director'
        })
      });
      if (!res.ok) throw new Error("Failed to publish study note.");

      triggerToast(`Published note on "${matTitle}" to student portal!`);
      // reset
      setMatTitle('');
      setMatTopic('');
      setMatContent('');
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Announcement
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          important: annImportant,
          author: 'Training & Placement Cell'
        })
      });
      if (!res.ok) throw new Error("Failed to post alert.");

      triggerToast(`Campus Broadcast sent: "${annTitle}"`);
      setAnnTitle('');
      setAnnContent('');
      setAnnImportant(false);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white border border-[#e8e6dd] rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-48 bg-white rounded-3xl"></div>
          <div className="h-48 bg-white rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const BRANCHES = [
    "Computer Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  return (
    <div className="space-y-8" id="tpo-admin-panel">
      
      {/* 1. Header and navigation bar */}
      <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 shadow-2xs flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl">
            <Compass className="h-6 w-6 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#1c1a19]">Placement Director Executive Suite</h2>
            <p className="text-[10px] text-[#7c756e]">Broadcast listings, review diagnostic statistics, and manage student cutoff parameters.</p>
          </div>
        </div>

        {/* Section toggles */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'analytics', label: 'Overview Analytics', icon: TrendingUp },
            { id: 'students', label: 'Student Directory', icon: Users },
            { id: 'companies', label: 'Manage Drives', icon: Building },
            { id: 'materials', label: 'Publish Notes', icon: BookOpen },
            { id: 'announcements', label: 'Broadcaster Alerts', icon: Megaphone }
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSection === sec.id 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'bg-[#faf9f6] border border-[#e8e6dd] text-[#5c5650] hover:bg-slate-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex gap-2" id="admin-success-banner">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. SECTION MODULES */}
      
      {/* SECTION A: Analytics */}
      {activeSection === 'analytics' && (
        <div className="space-y-6 animate-fade-in" id="admin-analytics">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#8c857e] uppercase block">Students Audited</span>
              <span className="text-2xl font-bold text-[#1c1a19]">{analytics.totalStudents} Registered</span>
              <p className="text-[10px] text-[#7c756e]">Actively updating skills weekly.</p>
            </div>

            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#8c857e] uppercase block">Partner Corporate Drives</span>
              <span className="text-2xl font-bold text-blue-600">{analytics.totalCompanies} Active</span>
              <p className="text-[10px] text-[#7c756e]">Live matching parameters enabled.</p>
            </div>

            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#8c857e] uppercase block">Applications Tracked</span>
              <span className="text-2xl font-bold text-purple-600">{analytics.totalApplications} Submitted</span>
              <p className="text-[10px] text-[#7c756e]">Currently traversing stages.</p>
            </div>

            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#8c857e] uppercase block">Offers Extended</span>
              <span className="text-2xl font-bold text-emerald-600">{analytics.placementRatio}% Ratio</span>
              <p className="text-[10px] text-[#7c756e]">Average package: 3.25 LPA.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Placed metrics table summary */}
            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Hiring Stage Distribution</h3>
              <div className="space-y-3">
                {[
                  { name: "Selected & Placed", count: analytics.applicationsBreakdown.placed, max: analytics.totalApplications, color: "bg-emerald-500" },
                  { name: "Interview Round Scheduled", count: analytics.applicationsBreakdown.interviewing, max: analytics.totalApplications, color: "bg-purple-500" },
                  { name: "Online Test Pending", count: analytics.applicationsBreakdown.testing, max: analytics.totalApplications, color: "bg-amber-500" },
                  { name: "Applied (Screening Stage)", count: analytics.applicationsBreakdown.applied, max: analytics.totalApplications, color: "bg-blue-500" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#2c2a29]">
                      <span>{item.name}</span>
                      <span className="font-mono">{item.count}</span>
                    </div>
                    <div className="h-2 bg-[#f1efe8] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`} 
                        style={{ width: `${item.max > 0 ? (item.count / item.max) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick reminders list */}
            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Placement Drive Highlights</h3>
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-blue-800 block">L&T Drive Closing Soon</span>
                  <p className="text-[10px] text-[#5c5650] leading-relaxed">Ensure all ECE and Electrical students with GPA &gt; 65% have updated resume files before Friday.</p>
                </div>
                <div className="p-3.5 bg-purple-50 border border-purple-100 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-purple-800 block">Schneider Electric Placements Complete</span>
                  <p className="text-[10px] text-[#5c5650] leading-relaxed">3 candidates selected for Diploma Trainee positions. Selected list synced with state dashboard.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SECTION B: Student Directory */}
      {activeSection === 'students' && (
        <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4 animate-fade-in" id="students-directory">
          <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Registered Students Profiles</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#2c2a29]">
              <thead className="bg-[#faf9f6] border-b border-[#e8e6dd] text-[#8c857e] uppercase text-[9px] tracking-wider font-extrabold">
                <tr>
                  <th className="p-4 rounded-l-xl">Candidate</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Academic Score</th>
                  <th className="p-4">Active Backlogs</th>
                  <th className="p-4">Readiness Score</th>
                  <th className="p-4 rounded-r-xl text-right">Status Checks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1efe8]">
                {students.map((stud) => (
                  <tr key={stud.id} className="hover:bg-[#faf9f6]/40">
                    <td className="p-4">
                      <div className="font-bold text-[#1c1a19]">{stud.name}</div>
                      <div className="text-[10px] text-[#7c756e] font-mono">{stud.email}</div>
                    </td>
                    <td className="p-4 font-medium">{stud.branch}</td>
                    <td className="p-4 font-bold font-mono">{stud.percentage}%</td>
                    <td className="p-4 font-bold text-red-600 font-mono">{stud.backlogs}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold font-mono text-blue-700">{stud.resumeBuilderData?.personalDetails ? '75' : '45'}/100</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        stud.resumeBuilderData?.personalDetails 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                          : 'bg-amber-50 border-amber-100 text-amber-700'
                      }`}>
                        {stud.resumeBuilderData?.personalDetails ? 'Resume Ready' : 'Pending Builder'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION C: Manage Companies Drives */}
      {activeSection === 'companies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in" id="companies-manager">
          
          {/* List of currently listed drives */}
          <div className="lg:col-span-6 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Currently Active corporate Placement Drives</h3>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {companies.map((comp) => (
                <div key={comp.id} className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center font-black text-blue-700 text-xs">
                      {comp.logo}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1c1a19]">{comp.name}</h4>
                      <p className="text-[10px] text-[#7c756e] font-medium">{comp.jobRole} ({comp.salaryPackage})</p>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold text-red-600">Cutoff: {comp.minPercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ADD NEW COMPANY FORM */}
          <div className="lg:col-span-6 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-4.5 w-4.5 text-purple-600" /> List a New Polytechnic Drive
            </h3>

            <form onSubmit={handleAddCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Company Corporate Name</label>
                  <input
                    type="text"
                    required
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    placeholder="e.g. L&T Construction"
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Job Designation Role</label>
                  <input
                    type="text"
                    required
                    value={compRole}
                    onChange={(e) => setCompRole(e.target.value)}
                    placeholder="e.g. Diploma Engineer Trainee"
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#5c5650] uppercase">Recruitment Cutoff (Min % Aggregate)</label>
                <input
                  type="number"
                  required
                  min="35"
                  max="100"
                  value={compPercentage}
                  onChange={(e) => setCompPercentage(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Annual Package (LPA)</label>
                  <input
                    type="text"
                    required
                    value={compSalary}
                    onChange={(e) => setCompSalary(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Max Backlogs Allowed</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="10"
                    value={compBacklogs}
                    onChange={(e) => setCompBacklogs(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* Branch Checklist multi select checkboxes */}
              <div className="space-y-1">
                <label className="font-bold text-[#5c5650] uppercase block">Eligible Polytechnic Branches</label>
                <div className="grid grid-cols-2 gap-2 bg-[#faf9f6] p-3 rounded-xl border border-[#e2dfd4]">
                  {BRANCHES.map((br, idx) => {
                    const isChecked = compBranches.includes(br);
                    return (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setCompBranches(compBranches.filter(b => b !== br));
                            } else {
                              setCompBranches([...compBranches, br]);
                            }
                          }}
                          className="rounded border-[#e2dfd4] text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-[10px] text-[#2c2a29] font-medium">{br}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#5c5650] uppercase">Placement Description</label>
                <textarea
                  rows={2}
                  required
                  value={compDesc}
                  onChange={(e) => setCompDesc(e.target.value)}
                  placeholder="Responsibilities, physical location details, apprenticeship terms..."
                  className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition"
              >
                Launch Placement Drive Notification
              </button>
            </form>
          </div>

        </div>
      )}

      {/* SECTION D: Publish Study Notes */}
      {activeSection === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in" id="materials-publisher">
          
          <div className="lg:col-span-5 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Currently Published Documents</h3>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {resources.map((res) => (
                <div key={res.id} className="p-3 bg-[#faf9f6] border border-[#e8e6dd] rounded-xl space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-[#1c1a19] truncate">{res.title}</span>
                    <span className="text-[8px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-md shrink-0">{res.category}</span>
                  </div>
                  <p className="text-[10px] text-[#7c756e] line-clamp-1">{res.topic} — {res.branch}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider flex items-center gap-1.5">
              <FilePlus className="h-4.5 w-4.5 text-purple-600" /> Publish Core Engineering Study Guide
            </h3>

            <form onSubmit={handleAddMaterial} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Syllabus Guide Title</label>
                  <input
                    type="text"
                    required
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    placeholder="e.g. AutoCAD Coordination input steps"
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Engineering Branch</label>
                  <select
                    value={matBranch}
                    onChange={(e) => setMatBranch(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 text-[#2c2a29]"
                  >
                    {BRANCHES.map((b, idx) => (
                      <option key={idx} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Subject Topic</label>
                  <input
                    type="text"
                    required
                    value={matTopic}
                    onChange={(e) => setMatTopic(e.target.value)}
                    placeholder="e.g. CAD Design, Microcontroller assembly"
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#5c5650] uppercase">Publication Category</label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value as any)}
                    className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 text-[#2c2a29]"
                  >
                    <option value="Study Notes">Study Notes</option>
                    <option value="Previous Papers">Previous Papers</option>
                    <option value="Coding Challenges">Coding Challenges</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#5c5650] uppercase">Guide Book / Study Note Content Text</label>
                <textarea
                  rows={4}
                  required
                  value={matContent}
                  onChange={(e) => setMatContent(e.target.value)}
                  placeholder="Write clear formulas, pin references, step-by-step assembly coding notes here..."
                  className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition"
              >
                Publish Note to Student Library
              </button>
            </form>
          </div>

        </div>
      )}

      {/* SECTION E: Broadcast Announcements */}
      {activeSection === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in" id="announcements-broadcaster">
          
          <div className="lg:col-span-5 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">Broadcasted Bulletins</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#1c1a19]">{ann.title}</span>
                    {ann.important && (
                      <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Urgent</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#5c5650] line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider flex items-center gap-1.5">
              <Megaphone className="h-4.5 w-4.5 text-purple-600" /> Broadcast Campus Bulletin Notice
            </h3>

            <form onSubmit={handleAddAnnouncement} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#5c5650] uppercase">Notice Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. TCS Smart Hiring registration opens"
                  className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#5c5650] uppercase">Notice Information details</label>
                <textarea
                  rows={3}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Syllabus patterns, deadlines, link targets, hall tickets distribution timelines..."
                  className="w-full bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={annImportant}
                    onChange={(e) => setAnnImportant(e.target.checked)}
                    className="rounded border-[#e2dfd4] text-purple-600 focus:ring-purple-500 h-4 w-4"
                  />
                  <span className="text-xs text-[#5c5650] font-bold uppercase">Mark notice as urgent / Priority</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition"
              >
                Send Notice Broadcast Alert
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
