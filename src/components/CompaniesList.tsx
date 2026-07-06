import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  Bookmark, 
  CheckCircle, 
  ShieldAlert, 
  Globe,
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react';
import { Company, StudentProfile } from '../types';

interface CompaniesListProps {
  student: StudentProfile;
  onApplySuccess?: () => void;
}

export default function CompaniesList({ student, onApplySuccess }: CompaniesListProps) {
  const [companies, setCompanies] = useState<(Company & { isEligible: boolean, eligibilityReason: string, appliedStatus: string | null, applicationId: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<'All' | 'Eligible'>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [activeCompany, setActiveCompany] = useState<Company & { isEligible: boolean, eligibilityReason: string, appliedStatus: string | null, applicationId: string | null } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResumeType, setSelectedResumeType] = useState<'built' | 'uploaded' | 'none'>('none');
  const [coverNote, setCoverNote] = useState('');

  useEffect(() => {
    if (student) {
      if (student.resumeBuilderData?.personalDetails?.fullName) {
        setSelectedResumeType('built');
      } else if (student.resumeFileName) {
        setSelectedResumeType('uploaded');
      } else {
        setSelectedResumeType('none');
      }
    }
  }, [student, showApplyModal]);

  const fetchCompanies = async () => {
    if (!student || !student.email) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/companies?email=${encodeURIComponent(student.email)}`);
      const data = await res.json();
      setCompanies(data);
      
      // If we have an active company open, keep its values updated
      if (activeCompany) {
        const updated = data.find((c: any) => c.id === activeCompany.id);
        if (updated) setActiveCompany(updated);
      }
    } catch (e) {
      console.error("Failed to fetch companies list", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [student]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApply = async (companyId: string) => {
    setActionLoading(companyId);
    try {
      const res = await fetch('/api/companies/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: student.email, 
          companyId,
          resumeType: selectedResumeType,
          coverNote
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Application submitted successfully! Your tracking pipeline is active.");
      setShowApplyModal(false);
      setCoverNote('');
      await fetchCompanies();
      if (onApplySuccess) onApplySuccess();
    } catch (e: any) {
      showToast(e.message || "Failed to submit application", 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSave = async (companyId: string) => {
    setActionLoading(companyId);
    try {
      const res = await fetch('/api/companies/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: student.email, companyId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Drive listing saved to your private tracker.");
      await fetchCompanies();
    } catch (e: any) {
      showToast(e.message || "Failed to save drive", 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Branch list
  const BRANCHES = [
    "All",
    "Computer Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  // Filtering calculations
  const filteredCompanies = companies.filter(c => {
    // 1. Search term
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Eligibility filter
    const matchesEligibility = eligibilityFilter === 'All' || c.isEligible;

    // 3. Branch filter
    const matchesBranch = selectedBranch === 'All' || c.allowedBranches.includes(selectedBranch) || c.allowedBranches.includes("All");

    return matchesSearch && matchesEligibility && matchesBranch;
  });

  return (
    <div className="space-y-6" id="companies-module">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-slide-up max-w-sm ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Filter and search board bar */}
      <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c857e]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies, job roles, or locations..."
              className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-2xl pl-10 pr-4 py-3 text-[#2c2a29] placeholder-[#a29b93] focus:outline-none focus:border-blue-500 transition"
              id="company-search-input"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            {/* Eligibility toggle */}
            <button
              onClick={() => setEligibilityFilter(eligibilityFilter === 'All' ? 'Eligible' : 'All')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                eligibilityFilter === 'Eligible' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-white border-[#e8e6dd] text-[#5c5650] hover:bg-slate-50'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>{eligibilityFilter === 'Eligible' ? 'Showing Eligible Only' : 'Filter Eligible Only'}</span>
            </button>

            {/* Branch dropdown */}
            <div className="flex items-center gap-1.5 bg-[#faf9f6] border border-[#e2dfd4] rounded-xl px-3 py-2 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#8c857e]" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent font-medium focus:outline-none text-[#2c2a29]"
              >
                {BRANCHES.map((b, idx) => (
                  <option key={idx} value={b}>{b === "All" ? "All Engineering Branches" : b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main drive grid and optional detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Drive grid */}
        <div className={`lg:col-span-7 space-y-4 ${activeCompany ? 'hidden lg:block' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">
              {filteredCompanies.length} Career Opportunities Found
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map((c) => {
              const isSelected = activeCompany?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCompany(c)}
                  className={`bg-white border rounded-3xl p-5 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-64 ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-[#e8e6dd]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-xs text-blue-700">
                          {c.logo}
                        </div>
                        <h4 className="text-xs font-bold text-[#8c857e] mt-2 line-clamp-1">{c.name}</h4>
                      </div>

                      {/* Eligibility label badge */}
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        c.isEligible 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                          : 'bg-red-50 border-red-100 text-red-700'
                      }`}>
                        {c.isEligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#1c1a19] line-clamp-1">{c.jobRole}</h3>
                      <p className="text-[11px] text-[#7c756e] line-clamp-2 mt-1 leading-normal">{c.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f1efe8] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#5c5650] font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#8c857e]" />
                        {c.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-[#8c857e]" />
                        {c.salaryPackage}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCompany(c);
                      }}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredCompanies.length === 0 && (
              <div className="col-span-full bg-white border border-[#e8e6dd] rounded-3xl p-12 text-center space-y-4">
                <div className="text-3xl">📭</div>
                <h3 className="text-sm font-bold text-[#1c1a19]">No Matching Recruitment Drives</h3>
                <p className="text-xs text-[#7c756e] max-w-sm mx-auto">
                  No company listings matched your active filters or query. Expand search parameters or complete your eligibility requirements.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Info Panel Side panel */}
        {activeCompany && (
          <div className="lg:col-span-5 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-sm space-y-6 sticky top-24" id="company-detail-panel">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-700">
                  {activeCompany.logo}
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#8c857e]">{activeCompany.name}</h4>
                  <h3 className="text-base font-bold text-[#1c1a19]">{activeCompany.jobRole}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveCompany(null)}
                className="p-1 hover:bg-slate-50 text-[#8c857e] rounded-lg"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Structured Cutoff details check */}
            <div className={`p-4 rounded-2xl border ${
              activeCompany.isEligible 
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50/50 border-red-200 text-red-800'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                {activeCompany.isEligible ? (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="h-4.5 w-4.5 text-red-600" />
                )}
                Eligibility Checker Result: {activeCompany.isEligible ? 'Eligible' : 'Not Eligible'}
              </h4>
              <p className="text-xs mt-2 leading-relaxed font-medium">
                {activeCompany.eligibilityReason}
              </p>
            </div>

            {/* Quick specifications */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8c857e] tracking-wider block">Cutoff criteria</span>
                <span className="font-bold text-[#2c2a29]">{activeCompany.minPercentage}% Marks</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8c857e] tracking-wider block">Max Backlogs Limit</span>
                <span className="font-bold text-[#2c2a29]">{activeCompany.maxBacklogsAllowed} outstanding</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8c857e] tracking-wider block">Compensation</span>
                <span className="font-bold text-blue-700 text-sm font-sans">{activeCompany.salaryPackage}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8c857e] tracking-wider block">Deadline</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {activeCompany.applicationDeadline}
                </span>
              </div>
            </div>

            {/* Company full descriptions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c857e]">About the placement</h4>
              <p className="text-xs text-[#5c5650] leading-relaxed">
                {activeCompany.description}
              </p>
            </div>

            {/* Recruitment Pipeline steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c857e]">Hiring Process Stages</h4>
              <div className="space-y-1.5">
                {activeCompany.selectionProcess.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-[#faf9f6] border border-[#f1efe8] rounded-xl text-xs text-[#4c4844] font-medium">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions block */}
            <div className="pt-4 border-t border-[#f1efe8] flex gap-3">
              {activeCompany.appliedStatus ? (
                <div className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-xs text-center font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-slate-600" />
                  <span>Already {activeCompany.appliedStatus}</span>
                </div>
              ) : (
                <>
                  <button
                    disabled={actionLoading === activeCompany.id || !activeCompany.isEligible}
                    onClick={() => setShowApplyModal(true)}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {actionLoading === activeCompany.id ? 'Applying...' : 'Apply via Portal'}
                  </button>

                  <button
                    disabled={actionLoading === activeCompany.id}
                    onClick={() => handleSave(activeCompany.id)}
                    className="px-3 py-3 border border-[#e2dfd4] hover:bg-slate-50 rounded-xl text-[#5c5650] transition duration-200"
                    title="Save listing"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            <div className="text-center pt-2">
              <a 
                href={activeCompany.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 hover:underline flex items-center justify-center gap-1"
              >
                <Globe className="h-3 w-3" /> Visit Corporate Portal
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Apply Confirmation Modal Overlay */}
      {showApplyModal && activeCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#f1efe8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-700 text-lg">
                  {activeCompany.logo}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1c1a19]">Application Confirmation</h3>
                  <p className="text-xs text-[#7c756e]">{activeCompany.name} • {activeCompany.jobRole}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="p-1 hover:bg-slate-50 text-[#8c857e] rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Candidate Credentials Verification */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#8c857e]">Verify Your Profile Credentials</h4>
              <div className="bg-[#faf9f6] border border-[#efede6] rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] text-[#8c857e] block">Full Name</span>
                  <span className="font-bold text-[#1c1a19]">{student.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8c857e] block">Branch of Study</span>
                  <span className="font-bold text-[#1c1a19]">{student.branch}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8c857e] block">Academic Marks</span>
                  <span className="font-bold text-blue-700">{student.percentage}% Score</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8c857e] block">Outstanding Backlogs</span>
                  <span className="font-bold text-[#1c1a19]">{student.backlogs} Backlogs</span>
                </div>
              </div>
            </div>

            {/* Resume Selection Card */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#8c857e]">Select Resume Attachment</h4>
              
              <div className="space-y-2.5">
                {/* Built Resume */}
                {student.resumeBuilderData?.personalDetails?.fullName && (
                  <label className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition text-xs ${
                    selectedResumeType === 'built'
                      ? 'bg-blue-50/50 border-blue-400 text-blue-900 ring-2 ring-blue-100'
                      : 'bg-white border-[#e8e6dd] text-[#4c4844] hover:bg-slate-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="resumeSelect" 
                      value="built" 
                      checked={selectedResumeType === 'built'}
                      onChange={() => setSelectedResumeType('built')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-0.5">
                      <span className="font-bold block">📄 Use Built Resume (ATS-Friendly)</span>
                      <span className="text-[10px] text-[#8c857e]">Created with step-by-step Resume Builder</span>
                    </div>
                  </label>
                )}

                {/* Uploaded Resume */}
                {student.resumeFileName && (
                  <label className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition text-xs ${
                    selectedResumeType === 'uploaded'
                      ? 'bg-blue-50/50 border-blue-400 text-blue-900 ring-2 ring-blue-100'
                      : 'bg-white border-[#e8e6dd] text-[#4c4844] hover:bg-slate-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="resumeSelect" 
                      value="uploaded" 
                      checked={selectedResumeType === 'uploaded'}
                      onChange={() => setSelectedResumeType('uploaded')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-0.5">
                      <span className="font-bold block">📎 Use Custom Uploaded Resume File</span>
                      <span className="text-[10px] text-[#8c857e]">File: {student.resumeFileName}</span>
                    </div>
                  </label>
                )}

                {/* No resume backup */}
                {!student.resumeBuilderData?.personalDetails?.fullName && !student.resumeFileName && (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl space-y-1">
                    <span className="text-xs font-bold block flex items-center gap-1">
                      ⚠️ No Saved Resume Found
                    </span>
                    <p className="text-[11px] text-amber-800 leading-normal">
                      Applying without an attached resume might reduce your eligibility screening score. We strongly suggest building one first, but you may submit with your basic profile credentials.
                    </p>
                    <label className="flex items-center gap-2 mt-2 font-semibold text-xs cursor-pointer text-amber-950">
                      <input 
                        type="checkbox" 
                        required 
                        checked={selectedResumeType === 'none'}
                        onChange={(e) => setSelectedResumeType(e.target.checked ? 'none' : 'none')}
                        className="rounded border-amber-300 text-amber-700 focus:ring-amber-500"
                      />
                      <span>Apply using basic profile data only</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Notes to Recruiter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#8c857e] block">
                Cover Note / Message to recruiter (Optional)
              </label>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Pitch yourself! What makes you the right fit for this role? (e.g. My final year project aligns with this domain...)"
                rows={3}
                className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-2xl p-3 text-[#2c2a29] focus:outline-none focus:border-blue-500 transition resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2 border-t border-[#f1efe8]">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading === activeCompany.id}
                onClick={() => handleApply(activeCompany.id)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
              >
                {actionLoading === activeCompany.id ? 'Submitting...' : 'Confirm & Apply'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
