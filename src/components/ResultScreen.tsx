import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Question, QuestionStatus, SubjectSection, Scorecard } from '../types';
import MathFormula from './MathFormula';
import { 
  Award, TrendingUp, CheckCircle, XCircle, HelpCircle, 
  RefreshCw, Filter, ArrowUpRight, BarChart3, ChevronDown, ChevronUp,
  Printer, Clock
} from 'lucide-react';

interface ResultScreenProps {
  candidateName: string;
  rollNumber: string;
  answers: Record<number, number>;
  statuses: Record<number, QuestionStatus>;
  questions: Question[];
  timeRemainingSeconds: number; // to compute time taken
  onRestart: () => void;
}

export default function ResultScreen({ 
  candidateName, 
  rollNumber, 
  answers, 
  statuses, 
  questions, 
  timeRemainingSeconds, 
  onRestart 
}: ResultScreenProps) {
  
  // Tab controllers
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<'All' | SubjectSection>('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'All' | 'Correct' | 'Wrong' | 'Unattempted'>('All');
  const [expandedExplanation, setExpandedExplanation] = useState<Record<number, boolean>>({});

  // Calculations
  const totalQuestions = questions.length; // 200
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  // Track subject wise metrics
  const sectionMetrics: Record<SubjectSection, { total: number; attempted: number; correct: number; wrong: number; score: number }> = {
    'Mathematics': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
    'Physics': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
    'Chemistry': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
    'Computer Science': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
    'Electronics & Communication': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
    'Electrical & Electronics': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
    'Mechanical Engineering': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
    'Civil Engineering': { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0 },
  };

  questions.forEach((q) => {
    sectionMetrics[q.section].total++;
  });

  questions.forEach((q) => {
    const section = q.section;
    const userAnswerIndex = answers[q.id];
    const isAnswered = userAnswerIndex !== undefined;

    if (!isAnswered) {
      unattemptedCount++;
    } else {
      sectionMetrics[section].attempted++;
      if (userAnswerIndex === q.correctOptionIndex) {
        correctCount++;
        sectionMetrics[section].correct++;
        sectionMetrics[section].score++;
      } else {
        wrongCount++;
        sectionMetrics[section].wrong++;
      }
    }
  });

  const rawScore = correctCount; // Since each question is +1
  const accuracy = correctCount + wrongCount > 0 
    ? Math.round((correctCount / (correctCount + wrongCount)) * 100) 
    : 0;

  const totalTimeSeconds = questions.length === 50 ? 2700 : 10800; // 45 mins vs 3 hours
  const timeTakenSeconds = totalTimeSeconds - timeRemainingSeconds;
  const formatTimeTaken = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  // Toggle single explanation accordion
  const toggleExplanation = (id: number) => {
    setExpandedExplanation((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter lists based on subject and status filters
  const filteredQuestions = questions.filter((q) => {
    const userAnswerIndex = answers[q.id];
    const isAnswerCorrect = userAnswerIndex === q.correctOptionIndex;
    const isAnswered = userAnswerIndex !== undefined;

    // 1. Subject filter
    const matchesSubject = activeSubjectFilter === 'All' || q.section === activeSubjectFilter;

    // 2. Status filter
    let matchesStatus = true;
    if (activeStatusFilter === 'Correct') {
      matchesStatus = isAnswered && isAnswerCorrect;
    } else if (activeStatusFilter === 'Wrong') {
      matchesStatus = isAnswered && !isAnswerCorrect;
    } else if (activeStatusFilter === 'Unattempted') {
      matchesStatus = !isAnswered;
    }

    return matchesSubject && matchesStatus;
  });

  const subjects: SubjectSection[] = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];

  const downloadPdfReport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryColor = [30, 42, 56]; // #1e2a38 (Navy)
      const accentColor = [249, 115, 22]; // #f97316 (Orange/Amber)
      const lightBg = [248, 250, 252]; // #f8fafc (Slate 50)
      const borderColor = [226, 232, 240]; // #e2e8f0 (Slate 200)
      const textDark = [15, 23, 42]; // #0f172a (Slate 900)
      const textMuted = [100, 116, 139]; // #64748b (Slate 500)

      // Draw Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(15, 15, 180, 24, 'F');

      // Top Header text
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('TELANGANA STATE COUNCIL OF HIGHER EDUCATION', 22, 23);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(220, 220, 220);
      doc.text('STATE-LEVEL ENGINEERING COMMON ENTRANCE TEST (TG ECET)', 22, 28);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text('OFFICIAL MOCK EXAMINATION SCORECARD', 22, 34);

      // Candidate Metadata Card
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(15, 45, 180, 32, 'FD');

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'bold');
      doc.text('CANDIDATE PERSPECTIVE MATRIX & ASSESSMENT RECORD', 20, 52);

      // Line divider inside card
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 55, 190, 55);

      // Metadata left column
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Candidate Name:', 20, 61);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${candidateName}`, 48, 61);

      doc.setFont('Helvetica', 'normal');
      doc.text('Hall Ticket Number:', 20, 67);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${rollNumber}`, 48, 67);

      doc.setFont('Helvetica', 'normal');
      doc.text('Exam Stream:', 20, 73);
      doc.setFont('Helvetica', 'bold');
      doc.text('Computer Science & Engineering', 48, 73);

      // Metadata right column
      doc.setFont('Helvetica', 'normal');
      doc.text('Exam Date:', 115, 61);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 135, 61);

      doc.setFont('Helvetica', 'normal');
      doc.text('Attempt Status:', 115, 67);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(16, 185, 129); // emerald Green
      doc.text('COMPLETED / VERIFIED', 135, 67);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text('System Time Taken:', 115, 73);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${formatTimeTaken(timeTakenSeconds)}`, 146, 73);

      // Draw Key Statistics Bento boxes
      const drawStatBox = (x: number, y: number, label: string, value: string, badge: string, iconColor: number[]) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.rect(x, y, 42, 26, 'FD');

        // Color Accent line
        doc.setFillColor(iconColor[0], iconColor[1], iconColor[2]);
        doc.rect(x, y, 42, 1.5, 'F');

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.text(label.toUpperCase(), x + 4, y + 6);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(value, x + 4, y + 15);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.text(badge, x + 4, y + 21);
      };

      drawStatBox(15, 83, 'Total Score', `${rawScore} / ${totalQuestions}`, `Marks Obtained (${Math.round((rawScore / totalQuestions) * 100)}%)`, [249, 115, 22]);
      drawStatBox(61, 83, 'Accuracy Rate', `${accuracy}%`, 'Percentage of correct attempts', [59, 130, 246]);
      drawStatBox(107, 83, 'Exam Timer', `${formatTimeTaken(timeTakenSeconds)}`, 'Total CBT completed time', [16, 185, 129]);
      
      const qualifyState = rawScore >= 50 ? 'QUALIFIED' : 'NOT QUALIFIED';
      const qualifyDesc = rawScore >= 50 ? 'Eligible for Mock Seat Allocation' : 'Score below qualifying threshold';
      const qualifyColor = rawScore >= 50 ? [16, 185, 129] : [239, 68, 68];
      drawStatBox(153, 83, 'CBT Status', qualifyState, qualifyDesc, qualifyColor);

      // Subject Performance Table Header
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'bold');
      doc.text('SUBJECT-WISE ANALYSIS REPORT', 15, 120);

      // Let's draw table header
      let tableY = 124;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(15, tableY, 180, 7.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('Helvetica', 'bold');
      doc.text('Subject', 18, tableY + 5);
      doc.text('Total Questions', 65, tableY + 5);
      doc.text('Attempted', 95, tableY + 5);
      doc.text('Correct Answers', 120, tableY + 5);
      doc.text('Subject Score', 148, tableY + 5);
      doc.text('Grade Status', 173, tableY + 5);

      // Generate rows
      const tableData = [
        { name: 'Mathematics', ...sectionMetrics['Mathematics'] },
        { name: 'Physics', ...sectionMetrics['Physics'] },
        { name: 'Chemistry', ...sectionMetrics['Chemistry'] },
        { name: 'Computer Science', ...sectionMetrics['Computer Science'] }
      ];

      tableData.forEach((row, index) => {
        const rowY = tableY + 7.5 + (index * 7.5);
        // Zebra stripes bg
        if (index % 2 === 1) {
          doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
          doc.rect(15, rowY, 180, 7.5, 'F');
        } else {
          doc.setFillColor(255, 255, 255);
          doc.rect(15, rowY, 180, 7.5, 'F');
        }
        
        // Row borders
        doc.setDrawColor(240, 240, 240);
        doc.line(15, rowY + 7.5, 195, rowY + 7.5);

        // Values
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFont('Helvetica', 'normal');
        doc.text(row.name, 18, rowY + 5);
        doc.text(`${row.total}`, 75, rowY + 5);
        doc.text(`${row.attempted}`, 103, rowY + 5);
        doc.text(`${row.correct}`, 129, rowY + 5);
        
        doc.setFont('Helvetica', 'bold');
        doc.text(`${row.score} / ${row.total}`, 154, rowY + 5);

        // Grade status calculation
        const pct = row.total > 0 ? (row.score / row.total) * 100 : 0;
        let grade = row.total > 0 ? 'Needs Work' : 'N/A';
        doc.setTextColor(239, 68, 68); // Red
        if (row.total === 0) {
          doc.setTextColor(100, 116, 139); // Gray
        } else if (pct >= 75) {
          grade = 'Excellent';
          doc.setTextColor(16, 185, 129); // Green
        } else if (pct >= 50) {
          grade = 'Good';
          doc.setTextColor(59, 130, 246); // Blue
        } else if (pct >= 35) {
          grade = 'Qualifying';
          doc.setTextColor(245, 158, 11); // Amber
        }
        doc.text(grade, 173, rowY + 5);
      });

      // Recommendations Frame
      const recY = 168;
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(15, recY, 180, 36, 'FD');

      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(15, recY, 2, 36, 'F'); // left highlight strip

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('PERSONALIZED PREPARATION INSIGHTS & STRATEGY', 20, recY + 6);

      // Compute weak and strong subjects
      let bestSub = 'Mathematics';
      let bestPct = -1;
      let worstSub = 'Mathematics';
      let worstPct = 999;

      tableData.forEach(row => {
        if (row.total > 0) {
          const pct = (row.score / row.total) * 100;
          if (pct > bestPct) {
            bestPct = pct;
            bestSub = row.name;
          }
          if (pct < worstPct) {
            worstPct = pct;
            worstSub = row.name;
          }
        }
      });
      if (bestPct === -1) bestPct = 0;
      if (worstPct === 999) worstPct = 0;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text('Based on your simulated mock score distributions, here is your customized syllabus preparation feedback:', 20, recY + 12);

      doc.setFont('Helvetica', 'bold');
      doc.text('• Primary Strength:', 20, recY + 17.5);
      doc.setFont('Helvetica', 'normal');
      doc.text('Your top performing subject was ', 46, recY + 17.5);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${bestSub} (${Math.round(bestPct)}%)`, 86, recY + 17.5);
      doc.setFont('Helvetica', 'normal');
      doc.text('. Leverage this solid foundation to preserve your rank.', 116, recY + 17.5);

      doc.setFont('Helvetica', 'bold');
      doc.text('• Revision Priority:', 20, recY + 23.5);
      doc.setFont('Helvetica', 'normal');
      doc.text('A lower relative performance was observed in ', 46, recY + 23.5);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${worstSub} (${Math.round(worstPct)}%)`, 104, recY + 23.5);
      doc.setFont('Helvetica', 'normal');
      doc.text('. Recalibrate focus on standard textbook formulas.', 134, recY + 23.5);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text('Note: The TG ECET qualifying aggregate mark threshold is set at 25% (or 50 out of 200 marks) for general candidates.', 20, recY + 31.5);

      // Draw CBT simulation certification watermark footer
      const footY = 215;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, footY, 190, footY);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text('Disclaimer: This simulated record sheet acts strictly as a practice analysis artifact. All exam designs mimic the official TCS iON Digital Assessment portal.', 15, footY + 4);
      doc.text('System Integrity Signature: GENERATED SECURELY BY TG-ECET MOCK PLATFORM PORTAL ENGINE', 15, footY + 7.5);

      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('PAGE 1 OF 1', 178, footY + 5);

      // Save Document
      const filename = `TG_ECET_Mock_Report_${rollNumber || 'CANDIDATE'}.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error("PDF generation failed, falling back to browser print:", e);
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none" id="result-portal">
      {/* Stylesheet specifically for printing formatting */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide interactive web elements completely */
          #result-portal-web {
            display: none !important;
          }
          /* Show print optimized elements */
          .print-only-block {
            display: block !important;
          }
          /* Custom layout overrides for neat paper margin spacing */
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .avoid-break-inside {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* PRINT-ONLY OFFICIAL SCORECARD HEADER AND TRANSCRIPT */}
      <div className="hidden print-only-block print:block bg-white p-6 space-y-6 text-slate-900 border-b-2 border-slate-350">
        <div className="text-center space-y-1.5 pb-4 border-b">
          <h1 className="text-xl font-bold uppercase tracking-tight">Telangana State Engineering Common Entrance Test</h1>
          <h2 className="text-base font-semibold text-slate-700 uppercase">TG ECET 2026 OFFICIAL MOCK EXAM TRANSCRIPT</h2>
          <p className="text-[10px] text-slate-400">Simulation of Actual TCS iON Digital Assessment Practice CBT</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p><strong>Candidate Name:</strong> {candidateName}</p>
            <p><strong>Hall Ticket Number:</strong> {rollNumber}</p>
            <p><strong>Exam Date & Time:</strong> {new Date().toLocaleString()}</p>
          </div>
          <div className="space-y-1 text-right">
            <p><strong>Final Aggregate Score:</strong> <span className="text-sm font-bold">{rawScore} / {totalQuestions} Marks ({Math.round((rawScore/totalQuestions)*100)}%)</span></p>
            <p><strong>Test Accuracy Rate:</strong> {accuracy}%</p>
            <p><strong>Total Duration Elapsed:</strong> {formatTimeTaken(timeTakenSeconds)}</p>
          </div>
        </div>

        {/* Subject-Wise Report Table */}
        <div className="pt-2">
          <h3 className="font-bold text-xs uppercase tracking-wide mb-2 text-slate-700">Detailed Subject-wise Performance Analysis</h3>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 font-bold">
                <th className="border border-slate-300 px-3 py-2 text-left">Subject / Section Name</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Total Weightage</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Attempted</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Correct Answers</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Wrong Answers</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => {
                const metric = sectionMetrics[subj];
                return (
                  <tr key={subj} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-3 py-2 font-medium">{subj === 'Computer Science' ? 'Computer Science & Engineering' : subj}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono">{metric.total}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono">{metric.attempted}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono text-emerald-800 font-semibold">{metric.correct}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono text-red-650 font-semibold">{metric.wrong}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-extrabold font-mono text-slate-900 bg-slate-50/50">{metric.score}</td>
                  </tr>
                );
              })}
              <tr className="bg-slate-100 font-bold">
                <td className="border border-slate-300 px-3 py-2">Aggregate Summary Breakdown</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-mono">{totalQuestions}</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-mono">{correctCount + wrongCount}</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-mono text-emerald-800">{correctCount}</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-mono text-red-650">{wrongCount}</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-extrabold font-mono bg-slate-100">{rawScore}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT-ONLY ALL QUESTIONS AND SOLUTIONS BOOKLET */}
      <div className="hidden print-only-block print:block bg-white p-6 space-y-6 text-slate-900">
        <h3 className="font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 border-slate-350 text-slate-700">
          Entire Mock Examination Question Booklet & Explanatory Solutions (All 200 Questions)
        </h3>
        <div className="space-y-6">
          {questions.map((q) => {
            const userAnswerIndex = answers[q.id];
            const isUserAnswered = userAnswerIndex !== undefined;
            const isAnswerCorrect = isUserAnswered && userAnswerIndex === q.correctOptionIndex;
            
            return (
              <div key={q.id} className="space-y-2 pb-5 border-b border-slate-200 avoid-break-inside">
                {/* Header tag */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>QUESTION ID: Q{q.id} ({q.section} Section Question No. {q.questionNumber}) {q.code && `[Pool ID: ${q.code}]`}</span>
                  <span className="font-bold uppercase font-sans text-[9px]">
                    {isUserAnswered ? (
                      isAnswerCorrect ? '✓ Correct Option Chosen' : '✗ Incorrect Option Chosen'
                    ) : (
                      'Skipped / Unattempted'
                    )}
                  </span>
                </div>
                
                {/* Question text with formulas */}
                <h4 className="font-semibold text-xs sm:text-sm text-slate-800">
                  <MathFormula text={q.questionText} />
                </h4>

                {/* Multiple choice options */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isCorrectOption = oIdx === q.correctOptionIndex;
                    const isSelectedByCandidate = oIdx === userAnswerIndex;
                    
                    let prefixLabel = `(${oIdx + 1}) `;
                    let boxColor = "bg-slate-50 border-slate-200 text-slate-700";
                    let suffix = "";
                    
                    if (isCorrectOption) {
                      boxColor = "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold";
                      suffix = " [✓ Reference Correct]";
                    } else if (isSelectedByCandidate) {
                      boxColor = "bg-red-50/70 border-red-300 text-red-950 line-through";
                      suffix = " [✗ Candidate Chosen]";
                    }
                    
                    return (
                      <div key={oIdx} className={`px-2.5 py-1.5 rounded border ${boxColor}`}>
                        <span className="font-bold font-mono">{prefixLabel}</span>
                        <MathFormula text={opt} />
                        {suffix && <span className="text-[9px] font-bold uppercase ml-1 opacity-75">{suffix}</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Question solutions explanation */}
                <div className="bg-slate-50 rounded border border-slate-200 p-3 mt-2 text-xs space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[9px] text-slate-405 block border-b pb-0.5 mb-1">
                    Step-by-Step Explanatory Solution details:
                  </span>
                  <div className="text-slate-850 leading-relaxed whitespace-pre-line font-medium">
                    <MathFormula text={q.explanation} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WEB ONLY DISPLAY PORTAL CONTAINER */}
      <div id="result-portal-web" className="flex flex-col flex-1">
        {/* Top Banner Header */}
        <header className="bg-white border-b border-slate-150 px-6 py-4 flex justify-between items-center flex-none">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase">
                TG ECET MOCK PORTAL
              </h1>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono font-semibold">
            Hall Ticket: <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded">{rollNumber}</span>
          </div>
        </header>

        {/* Main Container */}
        <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-8 space-y-6">
          
          {/* Banner Welcome Info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between shadow-xs gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Mock Assessment Completed Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                Candidate: <span className="text-slate-800 font-extrabold">{candidateName}</span> | Hall Ticket: <span className="font-mono text-slate-700 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded font-bold">{rollNumber}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={downloadPdfReport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs select-none cursor-pointer uppercase tracking-wider transition flex items-center space-x-1.5 shadow-xs active:scale-97"
                id="btn-print-pdf"
              >
                <Printer className="h-4.5 w-4.5" />
                <span>Export PDF Report</span>
              </button>
              <button
                onClick={onRestart}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold px-5 py-2.5 rounded-xl text-xs select-none cursor-pointer uppercase tracking-wider transition flex items-center space-x-1.5 shadow-xs active:scale-97"
                id="btn-restart"
              >
                <RefreshCw className="h-4.5 w-4.5" />
                <span>Retake Mock Exam</span>
              </button>
            </div>
          </div>

        {/* BENTO STATISTICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Score */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-extrabold tracking-wider text-[9px]">Total Score</span>
              <span className="text-slate-900 font-extrabold text-xl sm:text-2xl mt-0.5 block">{rawScore} / {totalQuestions}</span>
              <span className="text-[10px] text-slate-450 block font-semibold">Marks ({Math.round((rawScore/totalQuestions)*100)}%)</span>
            </div>
          </div>

          {/* Card 2: Accuracy */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-extrabold tracking-wider text-[9px]">Test Accuracy</span>
              <span className="text-slate-900 font-extrabold text-xl sm:text-2xl mt-0.5 block">{accuracy}%</span>
              <span className="text-[10px] text-slate-450 block font-semibold">Correct answer ratio</span>
            </div>
          </div>

          {/* Card 3: Correct/Wrong */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 shrink-0">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-extrabold tracking-wider text-[9px]">Question Status</span>
              <span className="text-slate-900 font-bold text-sm sm:text-base mt-1 block flex items-center space-x-1.5">
                <span className="text-emerald-600 font-extrabold text-base sm:text-lg">{correctCount} C</span>
                <span className="text-slate-300">|</span>
                <span className="text-red-500 font-extrabold text-base sm:text-lg">{wrongCount} W</span>
              </span>
              <span className="text-[10px] text-slate-450 block font-semibold leading-none">Unattempted: {unattemptedCount}</span>
            </div>
          </div>

          {/* Card 4: Time taken */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
            <div className="bg-slate-50 p-3 rounded-xl text-slate-600 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-extrabold tracking-wider text-[9px]">Time Elapsed</span>
              <span className="text-slate-900 font-extrabold text-base sm:text-lg mt-0.5 block truncate">
                {formatTimeTaken(timeTakenSeconds)}
              </span>
              <span className="text-[10px] text-slate-450 block font-semibold">Of {questions.length === 50 ? '45' : '180'} minutes limit</span>
            </div>
          </div>

        </div>

        {/* CUSTOM SVG DYNAMIC SUMMARY BAR CHART */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-5 flex items-center space-x-2 select-none">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-600" />
            <span>Subject-wise Performance Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left box: Render custom compact HTML SVG bars */}
            <div className="space-y-4">
              {subjects.map((subj) => {
                const metric = sectionMetrics[subj];
                const percentage = metric.total > 0 ? Math.round((metric.score / metric.total) * 100) : 0;
                return (
                  <div key={subj} className="space-y-1.5">
                    <div className="flex justify-between text-xs select-none font-semibold text-slate-700">
                      <span>{subj === 'Computer Science' ? 'Computer Science & Engineering' : subj}</span>
                      <span>{metric.score} / {metric.total} Marks ({percentage}% Accuracy)</span>
                    </div>
                    {/* SVG progress bar bar */}
                    <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 70 ? 'bg-emerald-500' : percentage >= 40 ? 'bg-indigo-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 select-none font-medium">
                      <span>Attempted: {metric.attempted} (Accuracy: {metric.attempted > 0 ? Math.round((metric.correct/metric.attempted)*100) : 0}%)</span>
                      <span>Skipped: {metric.total - metric.attempted}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right box: Beautiful comparative SVG column bar block */}
            <div className="border border-slate-150 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-between h-56 select-none relative">
              <span className="text-[10px] text-slate-450 font-extrabold block uppercase tracking-wider text-center">Score Ratio Visualizer</span>
              <div className="flex-1 flex items-end justify-around space-x-3 pt-4 pb-2 border-b border-slate-200">
                {subjects.map((subj) => {
                  const metric = sectionMetrics[subj];
                  const ratio = metric.total > 0 ? metric.score / metric.total : 0; // 0 to 1
                  const heightPercentage = Math.round(ratio * 90) + 10; // minimum height 10%
                  return (
                    <div key={subj} className="flex flex-col items-center flex-1 group">
                      <div className="relative w-full flex flex-col justify-end items-center h-28">
                        <div 
                          className="w-8 select-none p-1 rounded-t bg-gradient-to-t from-indigo-600 to-indigo-400 hover:opacity-90 shadow-sm relative transition-all duration-300"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[9px] py-0.5 px-1.5 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow block">
                            {metric.score} Marks
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-450 mt-1.5 uppercase tracking-wider text-center line-clamp-1 block">
                        {subj === 'Computer Science' ? 'CSE' : subj.slice(0, 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold px-1 pt-2">
                <span>Total: {totalQuestions} Marks</span>
                <span>Accuracy: {accuracy}%</span>
              </div>
            </div>

          </div>
        </div>

        {/* DETAILED QUESTION REVIEWS PANEL */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center space-x-2 select-none">
              <Filter className="h-5 w-5 text-indigo-600" />
              <span>Response Analysis Worksheet ({filteredQuestions.length})</span>
            </h3>

            {/* Subject Filters dropdown/selector */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 select-none">
                {(['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'] as const).map((s) => {
                  const isActive = activeSubjectFilter === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setActiveSubjectFilter(s)}
                      className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition cursor-pointer text-[9px] ${
                        isActive ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-450 hover:text-slate-900'
                      }`}
                    >
                      {s === 'Computer Science' ? 'CS' : s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-start space-x-2 select-none">
            {/* Status tab filters */}
            {(['All', 'Correct', 'Wrong', 'Unattempted'] as const).map((st) => {
              const isActive = activeStatusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setActiveStatusFilter(st)}
                  className={`px-4 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer select-none ${
                    isActive 
                      ? 'bg-slate-950 border-slate-950 text-white shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Core Answers Review list loop */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs font-bold select-none">
                No draft answers match the active search filter combination.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const userAnswerIndex = answers[q.id];
                const isSelected = userAnswerIndex !== undefined;
                const isCorrect = isSelected && userAnswerIndex === q.correctOptionIndex;
                const isExpOpen = expandedExplanation[q.id];

                return (
                  <div 
                    key={q.id}
                    className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition ${
                      isCorrect 
                        ? 'border-l-4 border-l-emerald-500' 
                        : isSelected 
                          ? 'border-l-4 border-l-red-500' 
                          : 'border-l-4 border-l-slate-300'
                    }`}
                  >
                    {/* Collapsible header */}
                    <div 
                      onClick={() => toggleExplanation(q.id)}
                      className="px-6 py-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-slate-50/50 transition gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Q{q.id} • {q.section} Q{q.questionNumber} {q.code && `[ID: ${q.code}]`}
                          </span>
                          {isSelected ? (
                            isCorrect ? (
                              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Correct</span>
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                                <XCircle className="h-3 w-3" />
                                <span>Incorrect</span>
                              </span>
                            )
                          ) : (
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Unattempted
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-850 text-sm pr-4 line-clamp-2 sm:line-clamp-none leading-relaxed tracking-tight">
                          <MathFormula text={q.questionText} />
                        </h4>
                      </div>

                      {/* Header chevron trigger */}
                      <div className="text-indigo-650 self-end sm:self-center transition flex items-center space-x-1 text-xs select-none font-bold shrink-0">
                        <span>{isExpOpen ? 'Collapse' : 'Explain'}</span>
                        {isExpOpen ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                      </div>
                    </div>

                    {/* Explanations Details panel expansion */}
                    {isExpOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs sm:text-sm bg-slate-50/20">
                        
                        {/* Options reviews grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 select-none">
                          {q.options.map((opt, oIdx) => {
                            const isCorrectIndex = oIdx === q.correctOptionIndex;
                            const isChoseIndex = oIdx === userAnswerIndex;

                            let optionBoxStyle = 'bg-white border border-slate-200 text-slate-700 rounded-xl';
                            
                            if (isCorrectIndex) {
                              optionBoxStyle = 'bg-emerald-50/50 border-emerald-250 text-emerald-950 font-semibold rounded-xl';
                            } else if (isChoseIndex) {
                              optionBoxStyle = 'bg-red-50/50 border-red-250 text-red-950 font-semibold rounded-xl';
                            }

                            return (
                              <div key={oIdx} className={`p-3 ${optionBoxStyle} flex items-center justify-between`}>
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-slate-400 font-mono">({oIdx + 1})</span>
                                  <MathFormula text={opt} />
                                </div>
                                {isCorrectIndex && <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />}
                                {!isCorrectIndex && isChoseIndex && <XCircle className="h-4 w-4 text-red-500 shrink-0 ml-1" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Step by step explanatory logic */}
                        <div className="bg-white border border-slate-150 rounded-2xl p-4.5 space-y-2.5 shadow-xs">
                          <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest block pb-1 border-b border-slate-100 flex items-center space-x-1.5">
                            <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Step-by-step explanatory logic details</span>
                          </span>
                          <div className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line tracking-wide pt-0.5 font-medium">
                            <MathFormula text={q.explanation} />
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>

      {/* Footer footer */}
      <footer className="bg-white border-t border-slate-150 text-slate-450 text-center py-5 px-6 text-xs font-semibold select-none mt-12">
        Note: This is just a mock test and is intended for practice and self-assessment only, not for real-time exam results or official certification.
      </footer>
      </div> {/* Close #result-portal-web */}
    </div>
  );
}
