import { 
  Sparkles, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Building, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onStart: (tab: 'login' | 'register') => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Polytechnic Students Helped", value: "14,500+", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Active Partner Companies", value: "120+", icon: Building, color: "text-emerald-600 bg-emerald-50" },
    { label: "Average Salary Package Offered", value: "3.2 LPA", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
    { label: "Diploma Branches Covered", value: "All Key Branches", icon: Cpu, color: "text-purple-600 bg-purple-50" }
  ];

  const features = [
    {
      title: "Exclusive Diploma Placements",
      description: "Tired of competing against B.Tech graduates? Get access to drives designed strictly for polytechnic candidates (TCS Smart Hiring, L&T DET, etc.).",
      icon: ShieldCheck
    },
    {
      title: "Smart Eligibility Checker",
      description: "Our rules-based engine instantly checks your academic percentage, active backlogs, and branch parameters against real corporate hiring rules.",
      icon: Cpu
    },
    {
      title: "Diploma Resume Wizard",
      description: "Build an ATS-compliant resume engineered for entry-level technician and junior developer roles, then download as a clean PDF.",
      icon: Sparkles
    },
    {
      title: "Custom Syllabus Mock Tests",
      description: "Practice on quantitative aptitude, logical reasoning, verbal English, and core branch engineering questions with step-by-step solutions.",
      icon: BookOpen
    }
  ];

  const faqs = [
    {
      q: "Is PlacementPro really designed only for Diploma / Polytechnic candidates?",
      a: "Yes! PlacementPro was explicitly founded to bridge the gap for Diploma students. Unlike other portals that cluster engineering graduates, we filter jobs and preparation material strictly matching the curriculum of 3-year Polytechnic programs."
    },
    {
      q: "How does the Eligibility Checker calculate my eligibility?",
      a: "We parse company rules (e.g. L&T requires minimum 65% aggregate, 0 backlogs, and Civil/Mechanical branches) and contrast them immediately with your completed student profile parameters. No AI guesses, just precise, direct rules."
    },
    {
      q: "Does this portal help students from ECE, Mechanical, and Electrical branches?",
      a: "Absolutely. We support and separate study notes, technical aptitude mock tests, and company drives for Computer Engineering, Electronics & Communication (ECE), Electrical Engineering (EE), Mechanical Engineering (ME), and Civil Engineering."
    },
    {
      q: "Can I download my built resume as a PDF?",
      a: "Yes! Our custom built-in resume wizard compiles your data into a professionally structured, ATS-friendly format ready for direct physical printing or digital uploads."
    }
  ];

  return (
    <div className="bg-[#faf9f6] text-[#2c2a29] selection:bg-[#e4e2db] selection:text-[#1c1a19]" id="landing-page">
      
      {/* Dynamic Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pb-28">
        {/* Soft atmospheric glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-6 text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold tracking-wide shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            Designed Exclusively for Polytechnic Engineering
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1c1a19] tracking-tight max-w-4xl mx-auto leading-tight">
            Secure Your Dream Job with <span className="text-blue-600 relative">PlacementPro</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5c5650] max-w-2xl mx-auto leading-relaxed">
            The ultimate preparation and placement hub engineered exclusively for Diploma candidates. Stop competing with higher degrees—unlock targeted careers today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onStart('register')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              id="hero-cta-register-btn"
            >
              Start Your Placement Journey
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onStart('login')}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 border border-[#e2dfd4] text-[#2c2a29] font-medium rounded-2xl transition duration-200 flex items-center justify-center"
              id="hero-cta-login-btn"
            >
              Student Portal Login
            </button>
          </div>

          <p className="text-[11px] text-[#8c857e] tracking-wide uppercase font-bold pt-2">
            No Fees • No Higher Studies Confusion • 100% Core Placements
          </p>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-t border-b border-[#e5e3da] bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf9f6] border border-[#f1efe8]">
                  <div className={`p-3 rounded-xl ${s.color}`}>
                    <Icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#1c1a19] tracking-tight">{s.value}</div>
                    <div className="text-xs text-[#7c756e] font-medium mt-0.5">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Panel */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">All-in-One Platform</h2>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1a19]">
            Everything you need to crack recruitment
          </h3>
          <p className="text-sm text-[#7c756e] max-w-lg mx-auto">
            Eliminate confusion with custom rule engines, curated study notes, mock interviews, and live status tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-white border border-[#e8e6dd] p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition duration-200">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                  <Icon className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h4 className="text-base font-bold text-[#1c1a19]">{f.title}</h4>
                <p className="text-xs text-[#5c5650] leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Structured "How it Works" Steps */}
      <section className="bg-white border-t border-b border-[#e5e3da] py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600">Simple Workflow</h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1a19]">
              Four Steps to Placement Success
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-blue-100 hidden sm:block -z-0"></div>

            {[
              { step: "01", title: "Complete Profile", desc: "Fill in your diploma GPA, outstanding backlogs, and preferred locations instantly." },
              { step: "02", title: "Get Readiness Score", desc: "Our engine tracks your weaknesses and suggests items to boost your placement rate." },
              { step: "03", title: "Take Branch Quizzes", desc: "Practice quantitative puzzles and technical electronic or coding test structures." },
              { step: "04", title: "Apply & Win Jobs", desc: "Match criteria, apply in 1-click, and track hiring stages with our visual timeline." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#faf9f6] border border-[#e8e6dd] rounded-3xl p-6 relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono text-sm font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <h4 className="text-base font-bold text-[#1c1a19]">{item.title}</h4>
                <p className="text-xs text-[#5c5650] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials placeholders */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">Success Stories</h2>
          <h3 className="text-3xl font-serif font-bold text-[#1c1a19]">Proud Alumni Placed via Drive Partnerships</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              name: "Amir Khan",
              role: "Junior Automation Engineer",
              company: "Schneider Electric",
              branch: "Diploma in ECE (2025)",
              quote: "PlacementPro saved me from competing in B.Tech portals. The embedded C resources matched my interview exactly, and the direct eligibility criteria check was 100% accurate."
            },
            {
              name: "Pooja Patel",
              role: "Operations Executive",
              company: "Infosys",
              branch: "Diploma in Computer Eng. (2024)",
              quote: "The built-in Resume Builder is outstanding. It compiled my polytechnic mini-projects into a clean single-page layout that immediately cleared the Infosys screening exam."
            },
            {
              name: "Saurabh Deshmukh",
              role: "Diploma Engineer Trainee",
              company: "L&T Construction",
              branch: "Diploma in Electrical Eng. (2025)",
              quote: "Taking the Quantitative Aptitude Mock Tests daily prepared me for the L&T written tests. Tracking my application status timeline kept me calm throughout the process."
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-white border border-[#e8e6dd] p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#5c5650] italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="pt-4 border-t border-[#f1efe8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1c1a19]">{t.name}</h4>
                  <p className="text-[10px] text-[#7c756e]">{t.role} at {t.company}</p>
                  <p className="text-[9px] text-[#a29b93] font-mono">{t.branch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elegant FAQ */}
      <section className="bg-white border-t border-[#e5e3da] py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">Got Questions?</h2>
            <h3 className="text-3xl font-serif font-bold text-[#1c1a19]">Frequently Answered Policies</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-[#e8e6dd] rounded-2xl overflow-hidden bg-[#faf9f6] transition duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-bold text-xs sm:text-sm text-[#1c1a19] hover:bg-[#efede6] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#8c857e] transition duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#5c5650] leading-relaxed border-t border-[#f1efe8] bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold">Ready to Start Your Careers Preparation?</h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto leading-relaxed">
          Create your profile, calculate your Placement Readiness Score, and check active eligibility for TCS, L&T, Infosys and Schneider Electric immediately.
        </p>
        <button
          onClick={() => onStart('register')}
          className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-2xl transition duration-200 shadow-md inline-flex items-center gap-2 text-xs sm:text-sm"
          id="cta-bottom-btn"
        >
          Start Your Placement Journey
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

    </div>
  );
}
