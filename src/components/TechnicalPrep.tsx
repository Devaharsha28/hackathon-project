import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  FileDown, 
  Cpu, 
  Layout, 
  SlidersHorizontal,
  Bookmark,
  Sparkles,
  ChevronRight,
  Code,
  CheckCircle
} from 'lucide-react';
import { StudyResource, StudentProfile } from '../types';

interface TechnicalPrepProps {
  student: StudentProfile;
}

export default function TechnicalPrep({ student }: TechnicalPrepProps) {
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>(student?.branch || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Study Notes' | 'Previous Papers' | 'Coding Challenges'>('All');
  const [activeResource, setActiveResource] = useState<StudyResource | null>(null);

  // Coding Challenges Workspace States
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/resources');
      const data = await res.json();
      setResources(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (!activeResource) {
      setCode('');
      setTestResults(null);
      setSubmissionMessage(null);
      return;
    }

    if (activeResource.category === 'Coding Challenges') {
      setTestResults(null);
      setSubmissionMessage(null);
      if (activeResource.id === 'res-all-code-1') {
        setCode(`function fizzBuzz(n) {\n  const result = [];\n  // Write your logic here\n  // Return array of strings representing FizzBuzz output up to n\n  for (let i = 1; i <= n; i++) {\n    if (i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");\n    else if (i % 3 === 0) result.push("Fizz");\n    else if (i % 5 === 0) result.push("Buzz");\n    else result.push(i.toString());\n  }\n  return result;\n}`);
      } else if (activeResource.id === 'res-cse-code-2') {
        setCode(`function reverseString(arr) {\n  // Write your logic here\n  // Reverse the array elements in place\n  let left = 0;\n  let right = arr.length - 1;\n  while (left < right) {\n    let temp = arr[left];\n    arr[left] = arr[right];\n    arr[right] = temp;\n    left++;\n    right--;\n  }\n  return arr;\n}`);
      } else if (activeResource.id === 'res-ece-code-3') {
        setCode(`function countSetBits(n) {\n  // Write your logic here\n  // Return the count of binary set bits (1s) of integer n\n  let count = 0;\n  while (n > 0) {\n    count += (n & 1);\n    n = n >> 1;\n  }\n  return count;\n}`);
      } else {
        setCode(`function solve() {\n  // Write your logic here\n  return true;\n}`);
      }
    }
  }, [activeResource]);

  const handleRunCode = () => {
    setIsRunningTests(true);
    setSubmissionMessage(null);
    
    setTimeout(() => {
      try {
        // Create function wrapper using dynamic execution
        const userFunction = new Function(`return ${code}`)();
        
        let cases: { input: any; expected: any; actual: any; passed: boolean }[] = [];
        
        if (activeResource?.id === 'res-all-code-1') {
          // FizzBuzz
          const testInputs = [5, 15];
          const expectedOutputs = [
            ["1", "2", "Fizz", "4", "Buzz"],
            ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
          ];
          
          cases = testInputs.map((input, idx) => {
            const actual = userFunction(input);
            const passed = JSON.stringify(actual) === JSON.stringify(expectedOutputs[idx]);
            return {
              input: `n = ${input}`,
              expected: JSON.stringify(expectedOutputs[idx]),
              actual: JSON.stringify(actual),
              passed
            };
          });
        } else if (activeResource?.id === 'res-cse-code-2') {
          // Reverse String
          const testInputs = [
            ['h', 'e', 'l', 'l', 'o'],
            ['a', 'b']
          ];
          const expectedOutputs = [
            ['o', 'l', 'l', 'e', 'h'],
            ['b', 'a']
          ];
          
          cases = testInputs.map((input, idx) => {
            const inputCopy = [...input];
            const actual = userFunction(inputCopy);
            const passed = JSON.stringify(actual) === JSON.stringify(expectedOutputs[idx]);
            return {
              input: `arr = ${JSON.stringify(input)}`,
              expected: JSON.stringify(expectedOutputs[idx]),
              actual: JSON.stringify(actual),
              passed
            };
          });
        } else if (activeResource?.id === 'res-ece-code-3') {
          // Count Set Bits
          const testInputs = [11, 15, 0];
          const expectedOutputs = [3, 4, 0];
          
          cases = testInputs.map((input, idx) => {
            const actual = userFunction(input);
            const passed = Number(actual) === expectedOutputs[idx];
            return {
              input: `n = ${input}`,
              expected: expectedOutputs[idx].toString(),
              actual: String(actual),
              passed
            };
          });
        } else {
          cases = [
            { input: "solve()", expected: "true", actual: String(userFunction()), passed: userFunction() === true }
          ];
        }
        
        setTestResults(cases);
        const allPassed = cases.every(c => c.passed);
        if (allPassed) {
          setSubmissionMessage({
            type: 'success',
            text: '🎉 Bravo! All simulated compiler test cases executed and passed successfully!'
          });
        } else {
          setSubmissionMessage({
            type: 'error',
            text: '❌ Output mismatch detected. Please review edge cases and logic parameters.'
          });
        }
      } catch (err: any) {
        setTestResults([
          {
            input: "Execution Error",
            expected: "Clean compilation",
            actual: err.message || "Runtime Exception",
            passed: false
          }
        ]);
        setSubmissionMessage({
          type: 'error',
          text: `⚠️ Execution Error: ${err.message}`
        });
      } finally {
        setIsRunningTests(false);
      }
    }, 800);
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.topic || r.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || r.branch === selectedBranch || r.branch === 'All';
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;

    return matchesSearch && matchesBranch && matchesCategory;
  });

  // Core engineering quick references
  const branchReferences: Record<string, { topic: string; formulas: { name: string; desc: string }[] }[]> = {
    "Computer Engineering": [
      {
        topic: "Data Structures & Algorithms",
        formulas: [
          { name: "Binary Search Time Complexity", desc: "O(log N) - requires a sorted array array." },
          { name: "Bubble Sort vs Quick Sort", desc: "Bubble: O(N²), QuickSort: O(N log N) average." },
          { name: "Stack LIFO vs Queue FIFO", desc: "Stack uses push/pop; Queue uses enqueue/dequeue pointers." }
        ]
      },
      {
        topic: "Web Concepts & TCP IP Handshake",
        formulas: [
          { name: "Three-Way Handshake", desc: "1. Client SYN -> 2. Server SYN-ACK -> 3. Client ACK." },
          { name: "HTTP Codes", desc: "200: Success, 404: Not Found, 500: Server Error." }
        ]
      }
    ],
    "Electronics & Communication": [
      {
        topic: "Microprocessor 8051 Registers",
        formulas: [
          { name: "Accumulator (A Reg)", desc: "Primary register used for all arithmetic / logic commands." },
          { name: "DPTR (Data Pointer)", desc: "16-bit register to point to external RAM/ROM spaces." },
          { name: "Program Status Word (PSW)", desc: "Tracks Carry (C), Auxiliary Carry (AC), and Parity (P) flags." }
        ]
      }
    ],
    "Electrical Engineering": [
      {
        topic: "Core Electrical Circuits",
        formulas: [
          { name: "Ohm's Law", desc: "V = I × R (Voltage = Current × Resistance)." },
          { name: "Active Power (Three Phase)", desc: "P = √3 × V_L × I_L × cos(θ) Watts." },
          { name: "Transformer Turn Ratio", desc: "V_p / V_s = N_p / N_s = I_s / I_p." }
        ]
      }
    ],
    "Mechanical Engineering": [
      {
        topic: "Thermodynamics & CAD",
        formulas: [
          { name: "First Law of Thermodynamics", desc: "ΔU = Q - W (Internal energy change = Heat input - Work done)." },
          { name: "AutoCAD Absolute Coordinate Input", desc: "Input format: X,Y (references global origin point)." }
        ]
      }
    ]
  };

  const currentRef = branchReferences[selectedBranch] || branchReferences["Computer Engineering"];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-white rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white rounded-3xl"></div>
          <div className="h-64 bg-white rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const BRANCHES = [
    "All",
    "Computer Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  return (
    <div className="space-y-6" id="prep-resources-module">
      
      {/* Search and Category switcher board */}
      <div className="bg-white border border-[#e8e6dd] rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c857e]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topic keywords, formulas, algorithms..."
              className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-2xl pl-10 pr-4 py-3 text-[#2c2a29]"
              id="resource-search-input"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-[#faf9f6] border border-[#e2dfd4] rounded-xl px-3 py-2 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#8c857e]" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent font-medium focus:outline-none text-[#2c2a29]"
              >
                {BRANCHES.map((b, idx) => (
                  <option key={idx} value={b}>{b === 'All' ? 'All Core Branches' : b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f1efe8]">
          {(['All', 'Study Notes', 'Previous Papers', 'Coding Challenges'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-50 border border-[#e8e6dd] text-[#5c5650] hover:bg-[#efede6]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main double column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core Resources feed list */}
        <div className={`lg:col-span-8 space-y-4 ${activeResource ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8c857e] uppercase tracking-wider">
              {filteredResources.length} Study Resources Available
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                onClick={() => setActiveResource(res)}
                className={`bg-white border rounded-3xl p-5 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-56 ${
                  activeResource?.id === res.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-[#e8e6dd]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-extrabold tracking-wider uppercase bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                      {res.category}
                    </span>
                    <span className="text-[10px] text-[#7c756e] font-bold">{res.branch}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#1c1a19] line-clamp-1">{res.title}</h3>
                    <p className="text-xs text-[#5c5650] line-clamp-2 mt-1 leading-normal">{res.summary || res.content}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f1efe8] flex items-center justify-between text-[10px] text-[#7c756e] font-medium">
                  <span>Topic: <strong className="text-[#1c1a19]">{res.topic || res.subject}</strong></span>
                  <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <span>{res.category === 'Coding Challenges' ? 'Code & Solve' : res.category === 'Previous Papers' ? 'Solve Paper' : 'Study Sheet'}</span> <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}

            {filteredResources.length === 0 && (
              <div className="col-span-full bg-white border border-[#e8e6dd] rounded-3xl p-12 text-center space-y-4">
                <div className="text-3xl">📚</div>
                <h3 className="text-sm font-bold text-[#1c1a19]">No Material Matches</h3>
                <p className="text-xs text-[#7c756e] max-w-sm mx-auto">
                  Try switching branch select to "All" or typing generic topic tags (e.g. PLC, boiler, 8051, microcontrollers).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed resource study window OR Core engineering cheat sheet */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Detailed Study Sheet Modal */}
          {activeResource ? (
            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 shadow-sm space-y-4" id="study-panel-drawer">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full">
                    {activeResource.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#1c1a19] pt-1">{activeResource.title}</h3>
                  <p className="text-[10px] text-[#8c857e]">Syllabus Topic: <strong>{activeResource.topic || activeResource.subject}</strong></p>
                </div>
                <button
                  onClick={() => setActiveResource(null)}
                  className="text-xs font-bold text-red-500 hover:underline shrink-0"
                >
                  Close
                </button>
              </div>

              {activeResource.category === 'Coding Challenges' ? (
                // CODING CHALLENGES INTERACTIVE WORKSPACE
                <div className="space-y-4">
                  <div className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl">
                    <span className="text-[10px] font-extrabold text-[#8c857e] uppercase block mb-1">Problem Description</span>
                    <div className="text-xs text-[#2c2a29] leading-relaxed whitespace-pre-wrap font-sans">
                      {activeResource.content}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-extrabold text-[#8c857e] uppercase">JavaScript Workspace</label>
                      <span className="text-[9px] font-mono text-emerald-600">Editable Sandbox</span>
                    </div>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-48 bg-slate-900 text-slate-100 font-mono text-xs p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      spellCheck="false"
                    />
                  </div>

                  {submissionMessage && (
                    <div className={`p-3 rounded-xl text-[11px] font-medium border ${
                      submissionMessage.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                        : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                      {submissionMessage.text}
                    </div>
                  )}

                  {testResults && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-[#8c857e] uppercase block">Test Cases Status:</span>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {testResults.map((tc, tcIdx) => (
                          <div key={tcIdx} className="bg-[#faf9f6] border border-[#e8e6dd] rounded-xl p-2.5 text-[10px] space-y-1 font-mono">
                            <div className="flex justify-between items-center">
                              <span className="text-[#5c5650] font-bold">Case {tcIdx + 1}: {tc.input}</span>
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                                tc.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {tc.passed ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                            <div className="text-[#8c857e] text-[9px] flex flex-col">
                              <span>Expected: {tc.expected}</span>
                              <span>Observed: {tc.actual}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isRunningTests}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Code className="h-4 w-4" />
                    <span>{isRunningTests ? 'Executing Test Cases...' : 'Execute & Run Code'}</span>
                  </button>
                </div>
              ) : (
                // STANDARD NOTES & PREVIOUS PAPERS VIEW
                <div className="space-y-4">
                  <div className="p-4 bg-[#faf9f6] border border-[#e8e6dd] rounded-2xl max-h-[380px] overflow-y-auto">
                    <span className="text-[10px] font-extrabold text-[#8c857e] uppercase block mb-1">Study Material Content</span>
                    <div className="text-xs text-[#2c2a29] leading-relaxed whitespace-pre-wrap">
                      {activeResource.content}
                    </div>
                  </div>

                  <div className="text-[10px] text-[#7c756e] flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-[#efede6]">
                    <span>Source: <strong>{activeResource.author || "College T&P Cell"}</strong></span>
                    <span>Verified: <strong>{activeResource.date || "July 2026"}</strong></span>
                  </div>

                  <button
                    onClick={() => {
                      window.alert("Document saved for offline study! You can view this anytime without active internet.");
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Save Offline Reference Copy</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Core Branch formulas/shortcuts widget */
            <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-[#8c857e] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                {selectedBranch === 'All' ? 'Computer Engineering' : selectedBranch} Reference Sheet
              </h4>
              <p className="text-[11px] text-[#7c756e] leading-relaxed">
                Core academic key parameters frequently queried during written tests and interview panels.
              </p>

              <div className="space-y-4">
                {currentRef ? (
                  currentRef.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-[#2c2a29] border-b border-[#efede6] pb-1 block">
                        {sec.topic}
                      </span>
                      <div className="space-y-2">
                        {sec.formulas.map((frm, fIdx) => (
                          <div key={fIdx} className="p-2.5 bg-[#faf9f6] border border-[#efede6] rounded-xl text-xs">
                            <span className="font-bold text-blue-700 block text-[11px]">{frm.name}</span>
                            <span className="text-[10px] text-[#5c5650] block mt-0.5">{frm.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#a29b93] italic">No active branch summary listed. Check back shortly!</p>
                )}
              </div>
            </div>
          )}

          {/* Quick branch Syllabus checklist */}
          <div className="bg-white border border-[#e8e6dd] rounded-3xl p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase text-[#8c857e]">Polytechnic Exam checklist</h4>
            <div className="space-y-2">
              {[
                "Verify mock score average is above 65%",
                "Include minimum 1 mini-project in resume",
                "Review TCS previous test logical puzzle papers",
                "Sync branch skills inside profile page"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#4c4844] font-medium leading-tight">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
