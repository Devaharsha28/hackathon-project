import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckSquare, Award, User, FileText, AlertCircle } from 'lucide-react';
import { SubjectSection } from '../types';

interface InstructionsScreenProps {
  candidateName: string;
  rollNumber: string;
  onBegin: () => void;
  examMode: 'MOCK' | 'SUBJECT';
  selectedSubject?: SubjectSection;
  onHome: () => void;
}

export default function InstructionsScreen({ 
  candidateName, 
  rollNumber, 
  onBegin,
  examMode,
  selectedSubject,
  onHome
}: InstructionsScreenProps) {
  const [accepted, setAccepted] = useState(false);

  const isSubjectMode = examMode === 'SUBJECT';

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none" id="instructions-container">
      {/* Premium Minimal Header */}
      <header className="bg-white border-b border-slate-150 px-6 py-4 flex justify-between items-center">
        <div 
          onClick={onHome}
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
          title="Return to Dashboard"
        >
          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition duration-150">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition duration-150">TG ECET MOCK PORTAL</span>
            <span className="hidden sm:inline-block ml-2 text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
              {isSubjectMode ? `${selectedSubject} Practice Instructions` : 'General Instructions'}
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono font-semibold">
          Hall Ticket: <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded">{rollNumber}</span>
        </div>
      </header>

      {/* Main Inner Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto flex flex-col lg:flex-row p-6 md:p-8 gap-8 items-stretch">
        
        {/* Left Side: Instructions Contents Scrolling */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
          <div className="bg-slate-50/75 px-6 py-4 border-b border-slate-150 flex justify-between items-center flex-none">
            <h2 className="font-extrabold text-slate-850 text-sm sm:text-base flex items-center space-x-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
              <span>{isSubjectMode ? 'Practice CBT Instructions' : 'General Instructions & Guidelines'}</span>
            </h2>
            <div className="text-xs font-bold text-slate-450 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              Language: <span className="text-indigo-600">English (Default)</span>
            </div>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 text-slate-700 leading-relaxed flex-1 max-h-[50vh] lg:max-h-[60vh]">
            <section className="space-y-3">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 text-sm sm:text-base">Test Parameters:</h3>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm pl-0.5 text-slate-600">
                <li>The total duration of this examination is <strong className="text-slate-900">{isSubjectMode ? '45 minutes' : '180 minutes (3 hours)'}</strong>.</li>
                <li>The computer system clock will be automatically set. A countdown timer on the top right-hand side of your assessment screen will display the time remaining for you to finish the examination.</li>
                <li>When the countdown timer reaches zero, the exam will submit itself. You do not need to manually end or submit your responses at that point.</li>
                <li>
                  {isSubjectMode ? (
                    <span>
                      There are a total of <strong className="text-slate-900">50 questions</strong> in this practice exam, selected randomly from the comprehensive <strong className="text-indigo-600">{selectedSubject}</strong> question pool.
                    </span>
                  ) : (
                    <span>
                      There are a total of <strong className="text-slate-900">200 questions</strong> in this exam, selected randomly on each test instance from our comprehensive question banks (comprising authentic previous years' papers from 2022, 2023, and 2024):
                      <ul className="list-disc list-inside pl-6 mt-1.5 text-xs space-y-1.5 text-slate-550 font-medium">
                        <li>Mathematics: <strong className="text-slate-850">50 Questions</strong> (drawn from a pool of <strong className="text-slate-900">250</strong>)</li>
                        <li>Physics: <strong className="text-slate-850">25 Questions</strong> (drawn from a pool of <strong className="text-slate-900">125</strong>)</li>
                        <li>Chemistry: <strong className="text-slate-850">25 Questions</strong> (drawn from a pool of <strong className="text-slate-900">125</strong>)</li>
                        <li>Computer Science & Engg: <strong className="text-slate-850">100 Questions</strong> (drawn from a pool of <strong className="text-slate-900">500</strong>)</li>
                      </ul>
                    </span>
                  )}
                </li>
                <li>Each correct response awards <strong className="text-emerald-700 font-bold">+1.0 mark</strong>. There is <strong className="text-slate-500">no negative marking</strong> for incorrect responses.</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 text-sm sm:text-base">Question Palette Status Colors:</h3>
              <p className="text-xs text-slate-500 font-medium mb-1.5">The Question Palette on the right-hand panel of your screen displays the status of each question using the following shapes and color codes:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-500 font-bold border border-slate-200 flex items-center justify-center font-mono text-[11px]">01</div>
                  <span className="text-slate-600"><strong className="text-slate-900">Not Visited:</strong> You have not visited this question yet.</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-8 h-8 rounded bg-red-50 text-red-650 font-bold border border-red-200/50 flex items-center justify-center font-mono text-[11px]">02</div>
                  <span className="text-slate-600"><strong className="text-slate-900">Not Answered:</strong> You have visited but not answered this question.</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/50 flex items-center justify-center font-mono text-[11px]">03</div>
                  <span className="text-slate-600"><strong className="text-slate-900">Answered:</strong> You have answered the question and saved it.</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-700 font-bold border border-violet-200/50 flex items-center justify-center font-mono text-[11px]">04</div>
                  <span className="text-slate-600"><strong className="text-slate-900">Marked for Review:</strong> You have opted to review this question later.</span>
                </div>
                <div className="flex items-center space-x-3 text-xs sm:col-span-2 pt-1 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-700 font-bold border border-violet-200/50 flex items-center justify-center relative font-mono text-[11px] shrink-0">
                    05
                    <div className="absolute right-0 bottom-0 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-slate-600"><strong className="text-slate-900">Answered & Marked for Review:</strong> The response is recorded and will be evaluated even if not changed.</span>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 text-sm sm:text-base">Navigating and Answering:</h3>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-0.5 text-slate-600">
                <li>To select an option, click on one of the radio buttons corresponding to the options.</li>
                <li>To deselect your chosen answer, click on the <strong className="text-slate-900">Clear Response</strong> button at the bottom of the test window.</li>
                <li>To change your chosen answer, click on another option and then click on <strong className="text-slate-900">Save & Next</strong>.</li>
                <li>To save your answer, you <strong className="text-slate-900">MUST</strong> click on the <strong className="text-slate-900">Save & Next</strong> button to register the response.</li>
                <li>To mark the question for review, click on the <strong className="text-slate-900">Mark for Review & Next</strong> button.</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Right Side: Candidate Portrait Panel */}
        <div className="w-full lg:w-80 flex flex-col space-y-5">
          {/* Candidate Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center flex flex-col justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto border border-slate-200 overflow-hidden flex items-center justify-center relative group">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mt-3.5 uppercase tracking-tight">
              {candidateName}
            </h3>
            <p className="text-slate-450 text-xs font-mono font-semibold mt-0.5">{rollNumber}</p>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col space-y-2.5 text-left text-xs font-medium text-slate-500">
              <div className="flex justify-between items-center">
                <span>Category:</span>
                <span className="font-bold text-slate-800">CSE General</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Post/Stream:</span>
                <span className="font-bold text-indigo-650">Computer Science</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Paper Code:</span>
                <span className="font-bold text-slate-800 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">TG_ECET_CS_26</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-150/50 rounded-2xl p-5 text-xs space-y-2.5 text-indigo-950 font-medium leading-relaxed">
            <h4 className="font-bold text-indigo-900 flex items-center space-x-1 uppercase tracking-wider text-[10px] mb-1">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Practice Guidelines</span>
            </h4>
            <p>1. Shuffling is simulated dynamically to test structural readiness and memory retention.</p>
            <p>2. Keep the tab active. Do not reload the page once the mock session begins.</p>
            <p>3. Stay online to preserve review session progress logs in your local storage.</p>
          </div>
        </div>
      </main>

      {/* Accept terms checkbox & Ready to Begin action bar */}
      <footer className="bg-white border-t border-slate-150 p-6 flex-none">
        <div className="max-w-6xl mx-auto flex flex-col space-y-4">
          {/* Checkbox wrapper */}
          <label htmlFor="accepted-terms-box" className="flex items-start space-x-3.5 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 cursor-pointer select-none transition hover:bg-slate-50">
            <input
              type="checkbox"
              id="accepted-terms-box"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4.5 w-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer transition"
            />
            <div className="text-xs text-slate-650 font-medium leading-relaxed">
              I have read and understood all general instructions. All computer hardware, mouse, virtual keys, and connection channels configured here are verified to be in fully proper working condition. I agree that under no circumstances will the simulated assessment engine be held liable for standard offline data storage limits on my browser. I am ready to initiate the simulator.
            </div>
          </label>

          {/* Button box */}
          <div className="flex justify-end pt-1">
            <button
              onClick={onBegin}
              disabled={!accepted}
              className={`flex items-center space-x-2 font-bold px-7 py-3 rounded-xl shadow-xs cursor-pointer transition uppercase text-xs tracking-wider select-none ${
                accepted
                  ? 'bg-slate-900 hover:bg-slate-850 text-white active:scale-98'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              id="btn-ready-to-begin"
            >
              <span>I am ready to begin</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
