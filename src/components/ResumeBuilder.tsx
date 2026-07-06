import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Printer, 
  Save, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  Briefcase,
  BookOpen,
  FolderCode,
  Award
} from 'lucide-react';
import { StudentProfile, ResumeBuilderData } from '../types';

interface ResumeBuilderProps {
  student: StudentProfile;
  onSaveSuccess?: () => void;
}

export default function ResumeBuilder({ student, onSaveSuccess }: ResumeBuilderProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: student.name || '',
    email: student.email || '',
    phone: student.phone || '',
    address: 'Polytechnic Hostel Campus, Room 302',
    summary: 'Diligent Diploma student possessing core knowledge in engineering methodologies, diagnostic analysis, and modern technical suites. Motivated to deliver results in junior developer or on-site engineering tracks.'
  });

  const [education, setEducation] = useState([
    { institution: student.college || 'State Polytechnic College', course: student.branch || 'Diploma Engineering', yearOfPassing: '2026', score: `${student.percentage}%` },
    { institution: 'Model High Secondary School', course: 'Secondary School leaving certificate (10th)', yearOfPassing: '2023', score: '82%' }
  ]);

  const [projects, setProjects] = useState([
    { title: 'Smart Industrial Boiler controller', techStack: 'Microcontroller 8051, assembly language, Relays', description: 'Engineered an automated emergency cut-off system that tracks temperatures and trips safety relays in high-scale steam boilers.' }
  ]);

  const [skills, setSkills] = useState<string[]>(student.skills && student.skills.length > 0 ? student.skills : ['C Programming', 'Digital Electronics', 'AutoCAD Drawing']);
  const [newSkill, setNewSkill] = useState('');

  const [internships, setInternships] = useState([
    { company: 'State Electrical Substation Grid', role: 'Operations Assistant Trainee', duration: '4 Weeks', description: 'Assisted safety officers in monitoring high-tension distribution lines, transformer health records, and logging daily load values.' }
  ]);

  const [certifications, setCertifications] = useState<string[]>(student.certifications && student.certifications.length > 0 ? student.certifications : ['NPTEL Certified Industrial Electronics Program']);
  const [newCert, setNewCert] = useState('');

  const [achievements, setAchievements] = useState<string[]>(['First Position in Annual Branch Paper Presentation Seminar 2025']);
  const [newAch, setNewAch] = useState('');

  const [languages, setLanguages] = useState<string[]>(['English', 'Hindi']);
  const [newLang, setNewLang] = useState('');

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Auto load existing resume builder data if on profile
  useEffect(() => {
    if (student.resumeBuilderData) {
      const data = student.resumeBuilderData;
      if (data.personalDetails) setPersonalDetails(data.personalDetails);
      if (data.education) setEducation(data.education);
      if (data.projects) setProjects(data.projects);
      if (data.skills) setSkills(data.skills);
      if (data.internships) setInternships(data.internships);
      if (data.certifications) setCertifications(data.certifications);
      if (data.achievements) setAchievements(data.achievements);
      if (data.languages) setLanguages(data.languages);
    }
  }, [student]);

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus(null);
    const resumeData: ResumeBuilderData = {
      personalDetails,
      education,
      projects,
      skills,
      internships,
      certifications,
      achievements,
      languages
    };

    try {
      const res = await fetch('/api/student/resume-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: student.email, resumeData })
      });
      if (!res.ok) throw new Error("Could not sync resume data.");
      
      setSaveStatus("Resume saved successfully! Score recalculated.");
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      console.error(e);
      setSaveStatus("Failed to save resume.");
    } finally {
      setLoading(false);
    }
  };

  // Helper arrays adder
  const addEducation = () => setEducation([...education, { institution: '', course: '', yearOfPassing: '', score: '' }]);
  const removeEducation = (index: number) => setEducation(education.filter((_, i) => i !== index));

  const addProject = () => setProjects([...projects, { title: '', techStack: '', description: '' }]);
  const removeProject = (index: number) => setProjects(projects.filter((_, i) => i !== index));

  const addInternship = () => setInternships([...internships, { company: '', role: '', duration: '', description: '' }]);
  const removeInternship = (index: number) => setInternships(internships.filter((_, i) => i !== index));

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddCert = () => {
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const handleAddAch = () => {
    if (newAch.trim() && !achievements.includes(newAch.trim())) {
      setAchievements([...achievements, newAch.trim()]);
      setNewAch('');
    }
  };

  const handleAddLang = () => {
    if (newLang.trim() && !languages.includes(newLang.trim())) {
      setLanguages([...languages, newLang.trim()]);
      setNewLang('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Initialize jsPDF with A4 options in points unit (A4 is 595 x 842 pt)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    let y = 45; // Start vertical offset
    const margin = 40;
    const pageWidth = 595;
    const contentWidth = pageWidth - (margin * 2);

    // Helpers for safe coordinates
    const addSectionHeader = (title: string) => {
      y += 15;
      // Prevent running out of space at section start
      if (y > 760) { doc.addPage(); y = 45; }
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), margin, y);
      y += 4;
      // Draw a neat horizontal line under the heading
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;
    };

    // 1. Header (Name & Contact details)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const fullNameText = personalDetails.fullName || 'Candidate Name';
    doc.text(fullNameText, pageWidth / 2, y, { align: 'center' });
    y += 14;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const contactInfo = `Email: ${personalDetails.email}  |  Phone: ${personalDetails.phone}`;
    doc.text(contactInfo, pageWidth / 2, y, { align: 'center' });
    y += 12;

    if (personalDetails.address) {
      doc.setFontSize(8.5);
      doc.text(personalDetails.address, pageWidth / 2, y, { align: 'center' });
      y += 16;
    }

    // 2. Summary Section
    if (personalDetails.summary) {
      addSectionHeader('Professional Profile Summary');
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      
      const wrappedSummary = doc.splitTextToSize(personalDetails.summary, contentWidth);
      doc.text(wrappedSummary, margin, y);
      y += (wrappedSummary.length * 11) + 4;
    }

    // 3. Education Section
    if (education && education.length > 0) {
      addSectionHeader('Academic Credentials');
      education.forEach((edu) => {
        // Prevent page overflow
        if (y > 760) { doc.addPage(); y = 45; }

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(edu.institution || 'Institution', margin, y);

        // Year on right side
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 80);
        if (edu.yearOfPassing) {
          doc.text(edu.yearOfPassing, pageWidth - margin, y, { align: 'right' });
        }
        y += 11;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(edu.course || 'Course', margin, y);

        // Score on right side
        if (edu.score) {
          doc.setFont('Helvetica', 'bold');
          doc.text(`Score: ${edu.score}`, pageWidth - margin, y, { align: 'right' });
        }
        y += 15;
      });
    }

    // 4. Projects Section
    if (projects && projects.length > 0) {
      addSectionHeader('Technical Project Work');
      projects.forEach((proj) => {
        if (y > 730) { doc.addPage(); y = 45; }

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(proj.title || 'Project Title', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 100, 100);
        const stackLabel = `Core Stack: ${proj.techStack || 'N/A'}`;
        doc.text(stackLabel, pageWidth - margin, y, { align: 'right' });
        y += 12;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        const wrappedDesc = doc.splitTextToSize(proj.description || '', contentWidth);
        doc.text(wrappedDesc, margin, y);
        y += (wrappedDesc.length * 11) + 8;
      });
    }

    // 5. Skills Section
    if (skills && skills.length > 0) {
      if (y > 760) { doc.addPage(); y = 45; }
      addSectionHeader('Technical Competencies & Core Skills');
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);

      const skillsLine = skills.join(', ');
      const wrappedSkills = doc.splitTextToSize(skillsLine, contentWidth);
      doc.text(wrappedSkills, margin, y);
      y += (wrappedSkills.length * 11) + 6;
    }

    // 6. Internships Section
    if (internships && internships.length > 0) {
      addSectionHeader('Industrial Internships & Apprenticeships');
      internships.forEach((intern) => {
        if (y > 730) { doc.addPage(); y = 45; }

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${intern.company || 'Company'} — ${intern.role || 'Role'}`, margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        if (intern.duration) {
          doc.text(intern.duration, pageWidth - margin, y, { align: 'right' });
        }
        y += 12;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        const wrappedDesc = doc.splitTextToSize(intern.description || '', contentWidth);
        doc.text(wrappedDesc, margin, y);
        y += (wrappedDesc.length * 11) + 8;
      });
    }

    // 7. Extra-Curriculars
    if (certifications.length > 0 || achievements.length > 0 || languages.length > 0) {
      if (y > 720) { doc.addPage(); y = 45; }
      addSectionHeader('Certifications, Achievements, & Languages');

      if (certifications.length > 0) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('Professional Certifications:', margin, y);
        y += 11;

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        certifications.forEach((c) => {
          if (y > 780) { doc.addPage(); y = 45; }
          doc.text(`• ${c}`, margin + 10, y);
          y += 11;
        });
        y += 4;
      }

      if (achievements.length > 0) {
        if (y > 760) { doc.addPage(); y = 45; }
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('Academic Achievements:', margin, y);
        y += 11;

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        achievements.forEach((a) => {
          if (y > 780) { doc.addPage(); y = 45; }
          doc.text(`• ${a}`, margin + 10, y);
          y += 11;
        });
        y += 4;
      }

      if (languages.length > 0) {
        if (y > 760) { doc.addPage(); y = 45; }
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('Languages Known: ', margin, y);
        
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        doc.text(languages.join(', '), margin + 95, y);
        y += 14;
      }
    }

    // Save PDF file
    const sanitizedFilename = (personalDetails.fullName || 'Diploma_Resume')
      .trim()
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    doc.save(`${sanitizedFilename}_resume.pdf`);
  };

  const steps = ["Personal Details", "Education History", "Projects", "Skills & Certifications", "Internships"];

  return (
    <div className="space-y-6" id="resume-builder-section">
      
      {/* Action panel ribbon */}
      <div className="bg-white border border-[#e8e6dd] rounded-3xl p-4 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1c1a19]">Diploma Resume Builder</h3>
            <p className="text-[10px] text-[#7c756e]">Craft high-contrast ATS-compliant A4 documents.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#e8e6dd] text-[#2c2a29] rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            {showPreview ? 'Edit Form' : 'View Full Document'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            id="save-resume-btn"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Sync & Save'}
          </button>

          {showPreview && (
            <>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer animate-fadeIn"
                id="export-pdf-vector-btn"
              >
                <FileText className="h-4 w-4" />
                <span>Export PDF (Vector)</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                id="print-resume-btn"
              >
                <Printer className="h-4 w-4" />
                <span>Print A4 / Save PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex gap-2 font-medium" id="resume-save-toast">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main workspace */}
      {!showPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Step controls & Form panel */}
          <div className="lg:col-span-7 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-6">
            
            {/* Steps indicator bar */}
            <div className="flex justify-between items-center border-b border-[#f1efe8] pb-4 overflow-x-auto gap-3">
              {steps.map((stepName, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setActiveStep(sIdx)}
                  className={`text-[10px] font-bold uppercase tracking-wider pb-1 shrink-0 border-b-2 transition ${
                    activeStep === sIdx 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-[#a29b93] hover:text-[#5c5650]'
                  }`}
                >
                  {sIdx + 1}. {stepName}
                </button>
              ))}
            </div>

            {/* Form body based on step */}
            <div className="space-y-4">
              
              {/* Step 0: Personal */}
              {activeStep === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                    Personal specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8c857e] uppercase">Full Legal Name</label>
                      <input
                        type="text"
                        value={personalDetails.fullName}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                        className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8c857e] uppercase">Contact Number</label>
                      <input
                        type="text"
                        value={personalDetails.phone}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                        className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#8c857e] uppercase">Home/Hostel Address</label>
                      <input
                        type="text"
                        value={personalDetails.address}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
                        className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#8c857e] uppercase">Professional Profile Summary</label>
                      <textarea
                        rows={3}
                        value={personalDetails.summary}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, summary: e.target.value })}
                        className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-3 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Education */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      Academic details
                    </h4>
                    <button
                      onClick={addEducation}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition"
                    >
                      <Plus className="h-3 w-3" /> Add Institution
                    </button>
                  </div>

                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl relative space-y-3">
                        {education.length > 1 && (
                          <button
                            onClick={() => removeEducation(idx)}
                            className="absolute top-3 right-3 p-1 hover:bg-red-50 text-red-600 rounded-lg transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">School/College Name</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...education];
                                updated[idx].institution = e.target.value;
                                setEducation(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Course/Board Name</label>
                            <input
                              type="text"
                              value={edu.course}
                              onChange={(e) => {
                                const updated = [...education];
                                updated[idx].course = e.target.value;
                                setEducation(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Year of Passing</label>
                            <input
                              type="text"
                              value={edu.yearOfPassing}
                              onChange={(e) => {
                                const updated = [...education];
                                updated[idx].yearOfPassing = e.target.value;
                                setEducation(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Percentage / GPA Score</label>
                            <input
                              type="text"
                              value={edu.score}
                              onChange={(e) => {
                                const updated = [...education];
                                updated[idx].score = e.target.value;
                                setEducation(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Projects */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      Mini / Semester Projects
                    </h4>
                    <button
                      onClick={addProject}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition"
                    >
                      <Plus className="h-3 w-3" /> Add Project
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl relative space-y-3">
                        <button
                          onClick={() => removeProject(idx)}
                          className="absolute top-3 right-3 p-1 hover:bg-red-50 text-red-600 rounded-lg transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Project Title</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].title = e.target.value;
                                setProjects(updated);
                              }}
                              placeholder="e.g. Automatic Streetlight sensor"
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Tech Stack / Tools Used</label>
                            <input
                              type="text"
                              value={proj.techStack}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].techStack = e.target.value;
                                setProjects(updated);
                              }}
                              placeholder="e.g. Arduino, LDR Resistor, Embedded C"
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Brief Explanation of Project</label>
                            <textarea
                              rows={2}
                              value={proj.description}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[idx].description = e.target.value;
                                setProjects(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Skills, Certifications, achievements */}
              {activeStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Skills lists */}
                  <div className="space-y-3 p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl">
                    <label className="text-xs font-bold text-[#1c1a19] uppercase block">Technical Core Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g. AutoCAD, PLC, Python"
                        className="flex-1 text-xs bg-white border border-[#e2dfd4] rounded-xl p-2 focus:outline-none"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                      />
                      <button 
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skills.map((s, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                          {s}
                          <button type="button" onClick={() => setSkills(skills.filter(i => i !== s))} className="hover:text-red-600 text-slate-400 font-bold">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications list */}
                  <div className="space-y-3 p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl">
                    <label className="text-xs font-bold text-[#1c1a19] uppercase block font-sans">Certifications & Training</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        placeholder="e.g. NPTEL Internet of Things"
                        className="flex-1 text-xs bg-white border border-[#e2dfd4] rounded-xl p-2 focus:outline-none"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCert(); } }}
                      />
                      <button 
                        type="button"
                        onClick={handleAddCert}
                        className="px-3.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      {certifications.map((c, cIdx) => (
                        <div key={cIdx} className="text-xs bg-white border border-[#efede6] px-3 py-1.5 rounded-xl flex items-center justify-between text-[#2c2a29]">
                          <span className="truncate pr-4 font-medium">{c}</span>
                          <button type="button" onClick={() => setCertifications(certifications.filter(i => i !== c))} className="text-red-500 hover:underline text-[10px]">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements and Languages inline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3 p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl">
                      <label className="text-xs font-bold text-[#1c1a19] uppercase block">Academic Achievements</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newAch}
                          onChange={(e) => setNewAch(e.target.value)}
                          className="flex-1 text-xs bg-white border border-[#e2dfd4] rounded-xl p-2"
                        />
                        <button type="button" onClick={handleAddAch} className="px-2 bg-blue-600 text-white rounded-lg text-xs">+</button>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {achievements.map((a, aIdx) => (
                          <div key={aIdx} className="text-[10px] bg-white border border-[#efede6] p-1.5 rounded-lg flex justify-between gap-1">
                            <span className="truncate">{a}</span>
                            <button type="button" onClick={() => setAchievements(achievements.filter(i => i !== a))} className="text-red-500">×</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl">
                      <label className="text-xs font-bold text-[#1c1a19] uppercase block">Languages Known</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newLang}
                          onChange={(e) => setNewLang(e.target.value)}
                          className="flex-1 text-xs bg-white border border-[#e2dfd4] rounded-xl p-2"
                        />
                        <button type="button" onClick={handleAddLang} className="px-2 bg-blue-600 text-white rounded-lg text-xs">+</button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {languages.map((l, lIdx) => (
                          <span key={lIdx} className="text-[9px] bg-white border border-[#efede6] px-2 py-0.5 rounded-md flex items-center gap-1">
                            {l}
                            <button type="button" onClick={() => setLanguages(languages.filter(i => i !== l))} className="text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Step 4: Internships */}
              {activeStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      Industrial Internships / Apprenticeships
                    </h4>
                    <button
                      onClick={addInternship}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition"
                    >
                      <Plus className="h-3 w-3" /> Add Internship
                    </button>
                  </div>

                  <div className="space-y-4">
                    {internships.map((intern, idx) => (
                      <div key={idx} className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl relative space-y-3">
                        <button
                          onClick={() => removeInternship(idx)}
                          className="absolute top-3 right-3 p-1 hover:bg-red-50 text-red-600 rounded-lg transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Company/Industry Name</label>
                            <input
                              type="text"
                              value={intern.company}
                              onChange={(e) => {
                                const updated = [...internships];
                                updated[idx].company = e.target.value;
                                setInternships(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Role/Title Held</label>
                            <input
                              type="text"
                              value={intern.role}
                              onChange={(e) => {
                                const updated = [...internships];
                                updated[idx].role = e.target.value;
                                setInternships(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-3">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Duration</label>
                            <input
                              type="text"
                              value={intern.duration}
                              onChange={(e) => {
                                const updated = [...internships];
                                updated[idx].duration = e.target.value;
                                setInternships(updated);
                              }}
                              placeholder="e.g. 4 Weeks (Summer 2025)"
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-3">
                            <label className="text-[9px] font-bold text-[#8c857e] uppercase">Description of Responsibilities</label>
                            <textarea
                              rows={2}
                              value={intern.description}
                              onChange={(e) => {
                                const updated = [...internships];
                                updated[idx].description = e.target.value;
                                setInternships(updated);
                              }}
                              className="w-full text-xs bg-white border border-[#e2dfd4] rounded-xl p-2.5 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-[#f1efe8]">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 bg-white hover:bg-[#faf9f6] disabled:opacity-30 disabled:cursor-not-allowed border border-[#e2dfd4] rounded-xl text-xs font-bold text-[#5c5650] flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              <span className="text-[10px] font-mono font-bold text-[#8c857e]">
                Step {activeStep + 1} / {steps.length}
              </span>

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Save className="h-4 w-4" /> Sync & Save Resume
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Live Side Preview (Desktop only) */}
          <div className="lg:col-span-5 bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c857e]">Live Document Preview</h4>
            
            {/* Live mockup frame */}
            <div className="border border-[#e5e3da] bg-[#faf9f6] p-4 rounded-2xl max-h-[500px] overflow-y-auto shadow-inner text-[9px] font-serif leading-relaxed text-[#2c2a29] space-y-4">
              <div className="text-center border-b border-gray-300 pb-2 space-y-0.5">
                <h2 className="text-sm font-bold text-black tracking-wide uppercase">{personalDetails.fullName || 'Candidate Name'}</h2>
                <div className="text-[8px] text-gray-500 font-sans flex flex-wrap justify-center gap-x-2">
                  <span>{personalDetails.email}</span>
                  <span>•</span>
                  <span>{personalDetails.phone}</span>
                </div>
                <div className="text-[8px] text-gray-400 font-sans italic">{personalDetails.address}</div>
              </div>

              {personalDetails.summary && (
                <div className="space-y-1">
                  <h3 className="text-[8px] font-bold uppercase border-b border-gray-200 text-black">Summary</h3>
                  <p className="text-[8px] text-gray-600 leading-normal">{personalDetails.summary}</p>
                </div>
              )}

              {education.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-[8px] font-bold uppercase border-b border-gray-200 text-black flex items-center gap-1">
                    <BookOpen className="h-2.5 w-2.5" /> Education
                  </h3>
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2">
                      <div>
                        <strong className="text-black">{edu.institution || 'Institution Name'}</strong>
                        <p className="text-[8px] text-gray-600">{edu.course || 'Course details'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-black block">{edu.yearOfPassing}</span>
                        <span className="text-[8px] text-gray-500 font-mono font-bold">{edu.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {projects.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-[8px] font-bold uppercase border-b border-gray-200 text-black flex items-center gap-1">
                    <FolderCode className="h-2.5 w-2.5" /> Technical Projects
                  </h3>
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-black">
                        <span>{proj.title || 'Project title'}</span>
                        <span className="text-[8px] text-gray-500 font-sans font-light">Stack: {proj.techStack}</span>
                      </div>
                      <p className="text-[8px] text-gray-600">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {skills.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-[8px] font-bold uppercase border-b border-gray-200 text-black">Technical Core Skills</h3>
                  <p className="text-[8px] text-gray-600 font-sans">{skills.join(', ')}</p>
                </div>
              )}

              {internships.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-[8px] font-bold uppercase border-b border-gray-200 text-black flex items-center gap-1">
                    <Briefcase className="h-2.5 w-2.5" /> Internships
                  </h3>
                  {internships.map((intern, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-black">
                        <span>{intern.company || 'Company'} - {intern.role}</span>
                        <span className="text-[8px] text-gray-400">{intern.duration}</span>
                      </div>
                      <p className="text-[8px] text-gray-600">{intern.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {certifications.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-[8px] font-bold uppercase border-b border-gray-200 text-black flex items-center gap-1">
                    <Award className="h-2.5 w-2.5" /> Certifications & Achievements
                  </h3>
                  <ul className="list-disc pl-3 text-[8px] text-gray-600">
                    {certifications.map((c, idx) => <li key={idx}>{c}</li>)}
                    {achievements.map((a, idx) => <li key={idx}>{a}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-[10px] text-blue-800 leading-normal">
              💡 <strong>Pro-Tip:</strong> Complete all 5 sections then click <strong>"View Full Document"</strong> to trigger full A4 printable settings.
            </div>
          </div>

        </div>
      ) : (
        /* Full A4 Printable Template Mockup Preview */
        <div className="bg-white border border-[#e5e3da] p-8 max-w-4xl mx-auto shadow-md rounded-2xl space-y-8" id="resume-print-canvas">
          
          <div className="border border-dashed border-blue-200 p-4 rounded-xl bg-blue-50/50 text-xs text-blue-800 leading-relaxed no-print">
            📍 <strong>Standard Print Guide:</strong> Click the green <strong>"Print A4 / Save PDF"</strong> button on the top right. In the browser printer box, select <strong>"Save as PDF"</strong>, ensure <strong>"Background graphics"</strong> is checked, margins are set to <strong>"Default"</strong>, and paper size is <strong>"A4"</strong>. This produces a perfect 1-page ATS template vector file.
          </div>

          {/* Printable page layout */}
          <div className="bg-white p-12 text-xs font-serif leading-relaxed text-[#2c2a29] space-y-6 max-w-[210mm] mx-auto min-h-[297mm]">
            
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-3 space-y-1">
              <h1 className="text-2xl font-black text-black tracking-wide uppercase font-serif">
                {personalDetails.fullName || 'Rajesh Kumar'}
              </h1>
              <div className="text-[10px] text-gray-600 font-sans flex flex-wrap justify-center gap-3">
                <span>Email: {personalDetails.email}</span>
                <span>•</span>
                <span>Phone: {personalDetails.phone}</span>
                <span>•</span>
                <span>Address: {personalDetails.address}</span>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 text-black font-serif">
                Professional Profile Summary
              </h2>
              <p className="text-[11px] text-gray-700 text-justify">
                {personalDetails.summary}
              </p>
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 text-black font-serif">
                  Academic Credentials
                </h2>
                <div className="space-y-2">
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <strong className="text-black text-[11px]">{edu.institution}</strong>
                        <p className="text-[10px] text-gray-600">{edu.course}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-black block text-[10px]">{edu.yearOfPassing}</span>
                        <span className="text-[10px] font-bold text-gray-800 font-mono">{edu.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Projects */}
            {projects.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 text-black font-serif">
                  Technical Project Work
                </h2>
                <div className="space-y-2.5">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-bold text-black text-[11px]">
                        <span>{proj.title}</span>
                        <span className="text-[10px] text-gray-500 font-sans font-normal">Core Stack: {proj.techStack}</span>
                      </div>
                      <p className="text-[10px] text-gray-700 leading-relaxed text-justify">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Skills */}
            {skills.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 text-black font-serif">
                  Technical Competencies & Core Skills
                </h2>
                <p className="text-[10px] text-gray-700 font-sans">
                  {skills.join(', ')}
                </p>
              </div>
            )}

            {/* Internships */}
            {internships.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 text-black font-serif">
                  Industrial Internships & Apprenticeships
                </h2>
                <div className="space-y-2.5">
                  {internships.map((intern, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-bold text-black text-[11px]">
                        <span>{intern.company} — {intern.role}</span>
                        <span className="text-[10px] text-gray-500 font-normal">{intern.duration}</span>
                      </div>
                      <p className="text-[10px] text-gray-700 text-justify">
                        {intern.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications and other extras */}
            {(certifications.length > 0 || achievements.length > 0 || languages.length > 0) && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 text-black font-serif">
                  Certifications, Achievements, & Extra-Curriculars
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] text-gray-700">
                  {certifications.length > 0 && (
                    <div className="space-y-1">
                      <strong className="text-black">Professional Certifications:</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {certifications.map((c, idx) => <li key={idx}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                  {achievements.length > 0 && (
                    <div className="space-y-1">
                      <strong className="text-black">Academic Achievements:</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {achievements.map((a, idx) => <li key={idx}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {languages.length > 0 && (
                  <div className="pt-1.5 text-[10px]">
                    <strong className="text-black font-serif">Languages Known:</strong> {languages.join(', ')}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
