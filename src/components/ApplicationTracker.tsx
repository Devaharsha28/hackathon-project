import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Edit2,
  Check
} from 'lucide-react';
import { Application, StudentProfile } from '../types';

interface ApplicationTrackerProps {
  student: StudentProfile;
}

export default function ApplicationTracker({ student }: ApplicationTrackerProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  
  // Timeline Edit states
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [newStage, setNewStage] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (!student || !student.email) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/student/applications?email=${encodeURIComponent(student.email)}`);
      const data = await res.json();
      setApplications(data);
      
      // Expand the first application by default if any
      if (data.length > 0 && !expandedAppId) {
        setExpandedAppId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [student]);

  const handleUpdateStatus = async (appId: string) => {
    setActionLoading(appId);
    try {
      const res = await fetch('/api/applications/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId,
          status: newStage,
          feedback: newComment
        })
      });
      if (!res.ok) throw new Error("Could not update hiring stage status.");
      
      setEditingAppId(null);
      await fetchApplications();
    } catch (e) {
      console.error(e);
      window.alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (app: Application) => {
    setEditingAppId(app.id);
    setNewStage(app.status);
    setNewComment(app.feedback || '');
  };

  // Helper metrics count
  const metrics = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    testing: applications.filter(a => a.status === 'Online Written Test').length,
    interviewing: applications.filter(a => a.status === 'Interview Round').length,
    placed: applications.filter(a => a.status === 'Selected' || a.status === 'Placed').length,
    rejected: applications.filter(a => a.status === 'Rejected').length
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-white rounded-3xl"></div>
        <div className="h-64 bg-white rounded-3xl"></div>
      </div>
    );
  }

  // Visual helper for progress stages
  const STAGES = [
    'Applied',
    'Online Written Test',
    'Interview Round',
    'Selected',
    'Placed',
    'Rejected'
  ];

  const getStageIndex = (current: string) => {
    if (current === 'Rejected') return 5;
    return STAGES.indexOf(current);
  };

  return (
    <div className="space-y-6" id="applications-tracker-section">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Submissions", value: metrics.total, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "In Screening", value: metrics.applied + metrics.testing, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Interviewing", value: metrics.interviewing, color: "text-purple-600 bg-purple-50 border-purple-100" },
          { label: "Placed / Placed Offer", value: metrics.placed, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Rejected / Ineligible", value: metrics.rejected, color: "text-red-600 bg-red-50 border-red-100" }
        ].map((met, idx) => (
          <div key={idx} className={`p-4 bg-white border rounded-2xl flex flex-col justify-between space-y-1 ${met.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 block">{met.label}</span>
            <span className="text-xl font-bold font-sans">{met.value} Drives</span>
          </div>
        ))}
      </div>

      {/* Main Track layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Applied listings Column */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">
            Active Submissions Pipeline
          </h3>

          <div className="space-y-3">
            {applications.map((app) => {
              const isExpanded = expandedAppId === app.id;
              const isPlaced = app.status === 'Selected' || app.status === 'Placed';
              const isRejected = app.status === 'Rejected';

              return (
                <div
                  key={app.id}
                  className={`bg-white border rounded-3xl p-5 hover:shadow-xs transition duration-200 cursor-pointer ${
                    isExpanded ? 'border-blue-500 ring-2 ring-blue-100' : 'border-[#e8e6dd]'
                  }`}
                  onClick={() => setExpandedAppId(app.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center font-black text-blue-700">
                        {app.companyLogo || '💼'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1c1a19]">{app.companyName}</h4>
                        <p className="text-[10px] text-[#7c756e] font-medium">{app.jobRole}</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      isPlaced 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : isRejected 
                        ? 'bg-red-50 border-red-100 text-red-700' 
                        : 'bg-amber-50 border-amber-100 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#f1efe8] flex items-center justify-between text-[10px] text-[#7c756e] font-medium">
                    <span className="flex items-center gap-1 font-mono">Applied: {app.dateApplied}</span>
                    <span className="flex items-center gap-1 text-blue-600 font-bold">
                      View Timeline {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                </div>
              );
            })}

            {applications.length === 0 && (
              <div className="bg-white border border-[#e8e6dd] rounded-3xl p-12 text-center space-y-4">
                <div className="text-3xl">📁</div>
                <h3 className="text-sm font-bold text-[#1c1a19]">No Applications Filed</h3>
                <p className="text-xs text-[#7c756e] max-w-sm mx-auto">
                  Go to the "Job Openings" tab to view matching corporate drives and apply to activate your recruitment pipelines.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Timeline Tracker details Column */}
        <div className="lg:col-span-6">
          {expandedAppId ? (
            (() => {
              const activeApp = applications.find(a => a.id === expandedAppId);
              if (!activeApp) return null;
              
              const currentStageIdx = getStageIndex(activeApp.status);
              const isRejected = activeApp.status === 'Rejected';

              return (
                <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
                  <div className="flex items-center justify-between pb-4 border-b border-[#f1efe8]">
                    <div>
                      <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#8c857e]">Recruitment Status Tracker</h4>
                      <h3 className="text-base font-serif font-bold text-[#1c1a19]">{activeApp.companyName}</h3>
                      <p className="text-[10px] text-[#7c756e]">Role: <strong>{activeApp.jobRole}</strong></p>
                    </div>

                    <button
                      onClick={() => startEdit(activeApp)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <Edit2 className="h-3 w-3" /> Update Stage
                    </button>
                  </div>

                  {/* Stage Timeline editor block */}
                  {editingAppId === activeApp.id && (
                    <div className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl space-y-3" id="stage-editor">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-[#8c857e]">Configure Stage</span>
                        <button onClick={() => setEditingAppId(null)} className="text-[10px] text-red-500 font-bold hover:underline">Cancel</button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-[#7c756e]">Current Status</label>
                          <select
                            value={newStage}
                            onChange={(e) => setNewStage(e.target.value)}
                            className="w-full text-xs bg-white border border-[#e2dfd4] rounded-lg p-2"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Online Written Test">Online Written Test</option>
                            <option value="Interview Round">Interview Round</option>
                            <option value="Selected">Selected</option>
                            <option value="Placed">Placed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-[#7c756e]">Custom remarks/notes</label>
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="e.g. Cleared quant test!"
                            className="w-full text-xs bg-white border border-[#e2dfd4] rounded-lg p-2"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpdateStatus(activeApp.id)}
                        disabled={actionLoading === activeApp.id}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" /> Save stage update
                      </button>
                    </div>
                  )}

                  {/* Custom vertical timeline */}
                  <div className="space-y-6 pl-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#efede6]">
                    {[
                      { title: "Application Submitted", value: "Applied", desc: `Direct registration cleared on ${activeApp.dateApplied}.` },
                      { title: "Corporate Written screening", value: "Online Written Test", desc: "Quantitative puzzles, English aptitude, and engineering theory MCQ scores." },
                      { title: "Panel Interviews Round", value: "Interview Round", desc: "Technical viva voce, code debugging, or practical circuit diagnostics." },
                      { title: "Offer Decision Compiled", value: "Selected", desc: "Placement cell issues letter of intent for review." }
                    ].map((step, idx) => {
                      const isDone = currentStageIdx >= idx && !isRejected;
                      const isActive = currentStageIdx === idx && !isRejected;
                      const isStepRejected = isRejected && currentStageIdx === idx;

                      return (
                        <div key={idx} className="relative pl-6 space-y-1 animate-slide-up">
                          {/* Dot */}
                          <div className={`absolute left-[-19px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                            isStepRejected 
                              ? 'bg-red-600 border-red-600 ring-4 ring-red-100'
                              : isDone 
                              ? 'bg-emerald-600 border-emerald-600 ring-4 ring-emerald-100' 
                              : 'bg-white border-[#c6c2b3]'
                          }`}></div>

                          <h4 className={`text-xs font-bold ${
                            isStepRejected ? 'text-red-700' : isDone ? 'text-[#1c1a19]' : 'text-[#a29b93]'
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-[#7c756e] leading-relaxed">{step.desc}</p>
                          
                          {isActive && activeApp.feedback && (
                            <div className="mt-2 p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[10px] text-blue-800 flex items-start gap-1.5 leading-normal">
                              <MessageSquare className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>Remarks: "{activeApp.feedback}"</span>
                            </div>
                          )}

                          {isStepRejected && activeApp.feedback && (
                            <div className="mt-2 p-2.5 bg-red-50/50 border border-red-100 rounded-xl text-[10px] text-red-800 flex items-start gap-1.5 leading-normal">
                              <MessageSquare className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                              <span>Feedback: "{activeApp.feedback}"</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })()
          ) : (
            <div className="bg-[#faf9f6] border border-[#e8e6dd] border-dashed rounded-3xl p-12 text-center text-[#8c857e] text-xs">
              Select an application on the left to review its recruitment step timeline.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
