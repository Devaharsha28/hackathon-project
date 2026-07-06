import { Company, MockTest, StudyResource, Announcement, PlacementQuestion, StudentProfile, Notification } from '../types';

export const INITIAL_STUDENT: StudentProfile = {
  name: "Rajesh Kumar",
  email: "student@placementpro.in",
  phone: "9876543210",
  college: "State Government Polytechnic College",
  branch: "Computer Engineering",
  semester: 6,
  percentage: 81.5,
  backlogs: 0,
  skills: ["C Programming", "HTML & CSS", "JavaScript", "SQL", "Technical Support"],
  certifications: ["NPTEL Python Programming Certificate", "Google IT Support Professional Certificate"],
  preferredLocation: "Bengaluru",
  resumeFileName: "Rajesh_Kumar_Diploma_CS_Resume.pdf",
  resumeUploadedAt: "2026-06-25T14:30:00Z",
  linkedin: "https://linkedin.com/in/rajesh-kumar-poly",
  github: "https://github.com/rajeshkumar-poly",
  resumeBuilderData: {
    personalDetails: {
      fullName: "Rajesh Kumar",
      email: "student@placementpro.in",
      phone: "9876543210",
      address: "Room 403, Boys Hostel, Polytechnic Campus, Salem, TN",
      summary: "Dedicated Computer Engineering Diploma student with solid foundations in software development, web designing, and database administration. Passionate about problem-solving and eager to secure an entry-level software development or tech role."
    },
    education: [
      {
        institution: "State Government Polytechnic College",
        course: "Diploma in Computer Engineering",
        yearOfPassing: "2026",
        score: "81.5%"
      },
      {
        institution: "Model Government Higher Secondary School",
        course: "SSLC (10th Standard)",
        yearOfPassing: "2023",
        score: "89.2%"
      }
    ],
    projects: [
      {
        title: "Hostel Complaints Portal",
        techStack: "HTML, CSS, PHP, MySQL",
        description: "Created a full-stack complaints tracking portal for the polytechnic boys' hostel. Allows hostellers to register issues and wardens to assign tasks to electricians/plumbers."
      },
      {
        title: "Arduino Automatic Bell Controller",
        techStack: "C++, Arduino IDE, RTC Module",
        description: "Programmed an automated bell-ringing system for our college with an LCD interface, eliminating human delays in class bells."
      }
    ],
    skills: ["C Programming", "HTML & CSS", "JavaScript", "SQL", "Git", "Hardware Troubleshooting"],
    internships: [
      {
        company: "Apex Tech Services Ltd",
        role: "IT & Hardware Intern",
        duration: "4 Weeks (Summer 2025)",
        description: "Assisted in local area network wiring, system configuration, software installations, and peripheral diagnostic tests across office desks."
      }
    ],
    certifications: ["Google IT Support Professional", "Intro to Python by Cisco Networking Academy"],
    achievements: [
      { id: "1", text: "First prize in State-level Polytechnic Technical Paper Presentation 2025" } as any,
      { id: "2", text: "Elected as Class Representative for consecutive semesters" } as any
    ],
    languages: ["English", "Hindi", "Tamil"]
  }
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "Tata Consultancy Services (TCS) - Smart Hiring",
    logo: "TCS",
    description: "TCS Smart Hiring is exclusively designed for BCA, B.Sc, and Diploma students. It is an amazing gateway to kickstart an IT career in one of the world's most prestigious consulting firms.",
    minPercentage: 60,
    allowedBranches: ["Computer Engineering", "Electronics & Communication", "Electrical Engineering"],
    maxBacklogsAllowed: 0,
    salaryPackage: "2.8 LPA",
    jobRole: "Associate System Engineer",
    selectionProcess: ["Cognitive Assessment", "Technical Interview", "HR Interview"],
    applicationDeadline: "2026-07-20",
    location: "Mumbai, Pune, Bengaluru",
    website: "https://www.tcs.com/careers/smart-hiring",
    status: "Active"
  },
  {
    id: "comp-2",
    name: "L&T Construction",
    logo: "L&T",
    description: "Larsen & Toubro Construction is recruiting Diploma candidates for their massive infrastructure, energy, and smart city projects. Highly stable, premium engineering program with robust on-site training.",
    minPercentage: 65,
    allowedBranches: ["Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
    maxBacklogsAllowed: 0,
    salaryPackage: "3.2 LPA",
    jobRole: "Diploma Engineer Trainee (DET)",
    selectionProcess: ["Online Aptitude", "Technical Written Test", "In-person Panel Interview"],
    applicationDeadline: "2026-07-28",
    location: "Chennai, Hyderabad, Delhi NCR",
    website: "https://www.lnthydrocarbon.com",
    status: "Active"
  },
  {
    id: "comp-3",
    name: "Infosys - Technical Support Graduate Program",
    logo: "INFY",
    description: "Infosys is onboarding Diploma holders for handling global system engineering, cloud diagnostics, enterprise infrastructure management, and developer-relations assistance.",
    minPercentage: 60,
    allowedBranches: ["Computer Engineering", "Electronics & Communication", "Electrical Engineering"],
    maxBacklogsAllowed: 1,
    salaryPackage: "2.6 LPA",
    jobRole: "Operations Executive",
    selectionProcess: ["Infosys Online Assessment (Aptitude & Technical)", "Video Interview"],
    applicationDeadline: "2026-07-15",
    location: "Mysore, Pune",
    website: "https://www.infosys.com",
    status: "Active"
  },
  {
    id: "comp-4",
    name: "Schneider Electric",
    logo: "SE",
    description: "Schneider Electric leads the digital transformation of energy management and automation. They recruit brilliant electronics, electrical, and mechanical polytechnic graduates for industrial board designs and automation units.",
    minPercentage: 70,
    allowedBranches: ["Electronics & Communication", "Electrical Engineering", "Mechanical Engineering"],
    maxBacklogsAllowed: 0,
    salaryPackage: "3.5 LPA",
    jobRole: "Automation Associate Engineer",
    selectionProcess: ["Group Discussion", "Technical Interview (Analog/Digital)", "HR Round"],
    applicationDeadline: "2026-08-02",
    location: "Bengaluru",
    website: "https://www.se.com",
    status: "Active"
  },
  {
    id: "comp-5",
    name: "Wipro - STEP Academy",
    logo: "WIP",
    description: "STEP is Wipro's premier entry-level track for high-performing polytechnic graduates. Work with cutting-edge telecom, web architecture, and enterprise application maintenance pipelines.",
    minPercentage: 55,
    allowedBranches: ["Computer Engineering", "Electronics & Communication"],
    maxBacklogsAllowed: 2,
    salaryPackage: "2.4 LPA",
    jobRole: "Systems Administrator Trainee",
    selectionProcess: ["Wipro Online Aptitude Test", "Technical Interview", "HR Discussion"],
    applicationDeadline: "2026-07-18",
    location: "Kochi, Pune, Chennai",
    website: "https://careers.wipro.com",
    status: "Active"
  },
  {
    id: "comp-6",
    name: "Tata Motors",
    logo: "TM",
    description: "Tata Motors is seeking Diploma holders in Mechanical and Electrical branches to support high-scale manufacturing lines, EV design logistics, and production line diagnostics.",
    minPercentage: 62,
    allowedBranches: ["Mechanical Engineering", "Electrical Engineering"],
    maxBacklogsAllowed: 0,
    salaryPackage: "3.0 LPA",
    jobRole: "Graduate Apprenticeship Trainee (GAT)",
    selectionProcess: ["Written Technical Test", "Shop Floor Practical Evaluation", "Interview"],
    applicationDeadline: "2026-07-12",
    location: "Jamshedpur, Pune",
    website: "https://www.tatamotors.com",
    status: "Active"
  }
];

export const INITIAL_QUESTIONS: PlacementQuestion[] = [
  // Quantitative Aptitude
  {
    id: "q-1",
    category: "Quantitative",
    text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "150 metres", "324 metres", "180 metres"],
    correctOptionIndex: 1,
    explanation: "Speed = 60 * (5/18) m/sec = 50/3 m/sec. Length of train = Speed * Time = (50/3) * 9 = 150 metres."
  },
  {
    id: "q-2",
    category: "Quantitative",
    text: "A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?",
    options: ["3.6 km/hr", "7.2 km/hr", "8.4 km/hr", "10 km/hr"],
    correctOptionIndex: 1,
    explanation: "Speed = 600m / (5 * 60)sec = 2 m/sec. To convert to km/hr, multiply by 18/5: 2 * 18/5 = 7.2 km/hr."
  },
  {
    id: "q-3",
    category: "Quantitative",
    text: "If A and B together can complete a piece of work in 15 days, and B alone can complete it in 20 days, in how many days can A alone complete the work?",
    options: ["30 days", "40 days", "45 days", "60 days"],
    correctOptionIndex: 3,
    explanation: "A's 1-day work = (1/15) - (1/20) = (4 - 3)/60 = 1/60. So, A alone can complete it in 60 days."
  },
  
  // Logical Reasoning
  {
    id: "q-4",
    category: "Logical",
    text: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
    correctOptionIndex: 1,
    explanation: "This is a geometric progression where each term is divided by 2 to get the next term. (1/4) / 2 = 1/8."
  },
  {
    id: "q-5",
    category: "Logical",
    text: "SCD, TEF, UGH, ____, WKL. Find the missing alphabetical combination.",
    options: ["VIJ", "VJT", "UJI", "IJV"],
    correctOptionIndex: 0,
    explanation: "The first letter increases by 1 step (S -> T -> U -> V -> W). The second and third letters follow an alphabetical sequence (CD -> EF -> GH -> IJ -> KL). Thus, the answer is VIJ."
  },
  {
    id: "q-6",
    category: "Logical",
    text: "Pointing to a photograph, Mohan said, 'His mother's only son is my brother.' Whose photograph was it?",
    options: ["Mohan's cousin", "Mohan's uncle", "Mohan's father", "Mohan's own self / brother"],
    correctOptionIndex: 3,
    explanation: "Mohan's mother's only son is Mohan himself, and this only son is the speaker's brother, implying the photograph belongs to his brother or himself depending on context. Given the options, 'Mohan's own self / brother' fits."
  },

  // English
  {
    id: "q-7",
    category: "English",
    text: "Choose the word which is most nearly SYNONYMOUS with the word: CANDID.",
    options: ["Frank", "Devious", "Polite", "Vague"],
    correctOptionIndex: 0,
    explanation: "Candid means truth-telling, straightforward, and sincere. 'Frank' is the closest synonym."
  },
  {
    id: "q-8",
    category: "English",
    text: "Fill in the blank: The team was _______ by the coach's encouraging speech.",
    options: ["motivate", "motivated", "motivates", "motivatingly"],
    correctOptionIndex: 1,
    explanation: "The sentence is in passive voice, requiring the past participle form 'motivated'."
  },

  // Technical (ECE, CS, EE, Mech)
  {
    id: "q-9",
    category: "Technical",
    text: "In C Programming, what is the default value of a global variable?",
    options: ["Garbage value", "0", "1", "Null pointer exception"],
    correctOptionIndex: 1,
    explanation: "Global variables and static local variables in C are automatically initialized to 0 by the compiler. Normal local variables are initialized to garbage."
  },
  {
    id: "q-10",
    category: "Technical",
    text: "Which of the following logic gates is known as a Universal Gate?",
    options: ["AND Gate", "OR Gate", "NAND Gate", "XOR Gate"],
    correctOptionIndex: 2,
    explanation: "NAND and NOR gates are universal gates because any other Boolean gate (AND, OR, NOT) can be constructed using only them."
  },
  {
    id: "q-11",
    category: "Technical",
    text: "Which device converts direct current (DC) to alternating current (AC)?",
    options: ["Transformer", "Inverter", "Rectifier", "Alternator"],
    correctOptionIndex: 1,
    explanation: "An inverter converts DC to AC, whereas a rectifier converts AC to DC."
  },
  {
    id: "q-12",
    category: "Technical",
    text: "Which thermodynamic cycle is used in gasoline (petrol) engines?",
    options: ["Carnot Cycle", "Diesel Cycle", "Rankine Cycle", "Otto Cycle"],
    correctOptionIndex: 3,
    explanation: "The Otto cycle is the ideal thermodynamic cycle for spark-ignition (gasoline/petrol) engines."
  }
];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: "test-aptitude",
    title: "General Quantitative Aptitude Test",
    category: "Quantitative Aptitude",
    durationMinutes: 10,
    questions: INITIAL_QUESTIONS.filter(q => q.category === "Quantitative")
  },
  {
    id: "test-logical",
    title: "Logical Reasoning Assessment",
    category: "Logical Reasoning",
    durationMinutes: 10,
    questions: INITIAL_QUESTIONS.filter(q => q.category === "Logical")
  },
  {
    id: "test-english",
    title: "Basic Workplace English Test",
    category: "English",
    durationMinutes: 10,
    questions: INITIAL_QUESTIONS.filter(q => q.category === "English")
  },
  {
    id: "test-technical",
    title: "Core Engineering Fundamentals MCQ",
    category: "Technical",
    durationMinutes: 15,
    questions: INITIAL_QUESTIONS.filter(q => q.category === "Technical")
  }
];

export const INITIAL_RESOURCES: StudyResource[] = [
  // STUDY NOTES
  {
    id: "res-ece-1",
    title: "C Programming & Embedded Systems Fundamentals",
    branch: "Electronics & Communication",
    subject: "C Programming & Embedded Basics",
    category: "Study Notes",
    summary: "Learn essential memory mapping, register access, volatile pointer declarations, bit masking, and interrupt service routine (ISR) implementations in embedded C.",
    content: "### C Programming for Embedded Electronics\n\nUnlike traditional desktop programming, Embedded C targets microcontrollers with highly limited memory. Here are critical concepts:\n\n#### 1. The `volatile` Keyword\nUsing `volatile` tells the compiler that the value of the variable can change at any time without action from the nearby code. This is essential for:\n- Memory-mapped peripheral registers\n- Global variables accessed within Interrupt Service Routines (ISRs)\n- Delay loop variables\n\n```c\nvolatile uint8_t *pStatusReg = (volatile uint8_t *)0x40003000;\nwhile ((*pStatusReg & 0x01) == 0);\n```\n\n#### 2. Bit Manipulation Operations\n- **Setting a bit:** `PORTB |= (1 << 3);` (sets bit 3)\n- **Clearing a bit:** `PORTB &= ~(1 << 3);` (clears bit 3)\n- **Toggling a bit:** `PORTB ^= (1 << 3);` (toggles bit 3)\n- **Checking a bit status:** `if (PINB & (1 << 2)) { ... }`"
  },
  {
    id: "res-ece-2",
    title: "Digital Electronics Cheatsheet",
    branch: "Electronics & Communication",
    subject: "Digital Circuits",
    category: "Study Notes",
    summary: "Complete review sheet for Boolean theorems, Karnaugh Maps simplification, Flip-Flops (SR, JK, D, T), Counters (Synchronous/Asynchronous) and multiplexers.",
    content: "### Digital Electronics Formulas & Simplification\n\n#### 1. De Morgan's Theorems\n- `NOT(A AND B) = NOT(A) OR NOT(B)`\n- `NOT(A OR B) = NOT(A) AND NOT(B)`\n\n#### 2. JK Flip Flop Excitation Table\n| Q(t) | Q(t+1) | J | K |\n|------|--------|---|---|\n|  0   |   0    | 0 | X |\n|  0   |   1    | 1 | X |\n|  1   |   0    | X | 1 |\n|  1   |   1    | X | 0 |\n\n#### 3. Setup and Hold Time\n- **Setup Time ($t_s$):** The minimum time data must remain stable at the input before the active edge of the clock arrives.\n- **Hold Time ($t_h$):** The minimum time data must remain stable at the input after the active edge of the clock passes."
  },
  {
    id: "res-cse-notes-1",
    title: "Data Structures & Algorithms Basics",
    branch: "Computer Engineering",
    subject: "Data Structures",
    category: "Study Notes",
    summary: "Essential DSA study notes covering Time Complexity (Big O), Stack/Queue operations, LinkedList traversals, and Binary Search Trees.",
    content: "### DSA Interview Quick Notes\n\n#### 1. Complexity Analysis Cheat Sheet\n* **Binary Search:** O(log N) time, O(1) space.\n* **Quick Sort:** O(N log N) average, O(N²) worst-case time.\n* **Merge Sort:** O(N log N) time in all cases, O(N) space.\n* **Hash Table Lookup:** O(1) average time.\n\n#### 2. LinkedList vs Array\n* **Array:** Contiguous memory blocks, random access in O(1) time, insertions in O(N) time.\n* **LinkedList:** Scattered memory blocks with pointers, sequential access in O(N) time, dynamic sizing, insertions in O(1) time if pointer is known."
  },
  {
    id: "res-ee-notes-1",
    title: "AC & DC Machines Quick Reference Notes",
    branch: "Electrical Engineering",
    subject: "Electrical Machines",
    category: "Study Notes",
    summary: "Key concepts on transformer operation, induction motor slip calculations, and DC generator characteristics.",
    content: "### Electrical Machines Core Guide\n\n#### 1. Transformer Turn Ratio & EMF Equation\n$$E = 4.44 \\cdot f \\cdot N \\cdot \\Phi_m$$\nTurn Ratio is given by:\n$$\\frac{V_p}{V_s} = \\frac{N_p}{N_s} = \\frac{I_s}{I_p}$$\n\n#### 2. Three-Phase Induction Motor Slip\nSynchronous speed ($N_s$):\n$$N_s = \\frac{120 f}{P}$$\nSlip ($s$):\n$$s = \\frac{N_s - N_r}{N_s}$$\nWhere:\n* $f$ = Supply Frequency in Hz\n* $P$ = Number of poles\n* $N_r$ = Rotor actual speed in RPM"
  },
  {
    id: "res-me-notes-1",
    title: "Thermodynamics & Fluid Mechanics Notes",
    branch: "Mechanical Engineering",
    subject: "Thermodynamics",
    category: "Study Notes",
    summary: "Fundamental equations and definitions of First/Second Laws, Otto & Diesel cycles, and Bernoulli's fluid equation.",
    content: "### Thermodynamics & Fluids Cheat Sheet\n\n#### 1. First Law of Thermodynamics\n$$\\Delta U = Q - W$$\nWhere:\n* $\\Delta U$ = Change in internal energy\n* $Q$ = Heat added to system\n* $W$ = Work done by system\n\n#### 2. Bernoulli's Equation for Fluid Flow\n$$P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{Constant}$$\nWhere:\n* $P$ = Static pressure of fluid\n* $\\rho$ = Density of fluid\n* $v$ = Flow velocity\n* $g$ = Acceleration due to gravity\n* $h$ = Elevation height"
  },

  // PREVIOUS PAPERS
  {
    id: "res-all-paper-1",
    title: "TCS Smart Hiring 2025 Solved Placement Paper",
    branch: "All",
    subject: "Aptitude & Technical Basics",
    category: "Previous Papers",
    summary: "Solved actual examination questions from TCS Smart Hiring for Diploma Students. Covers numerical ability, verbal reasoning, and basic coding elements.",
    content: "### TCS Smart Hiring Previous Solved Questions (2025 Exam)\n\n#### Section A: Numerical & Logical Ability\n\n**Q1: A sum of money doubles itself in 8 years at simple interest. In how many years will it become triple itself?**\n* **Solution:** Let principal be $P$. If it doubles, Interest = $P$.\n  Using Simple Interest formula: $I = \\frac{P \\cdot R \\cdot T}{100} \\implies P = \\frac{P \\cdot R \\cdot 8}{100} \\implies R = 12.5\\%$.\n  To become triple, Interest must be $2P$.\n  $2P = \\frac{P \\cdot 12.5 \\cdot T}{100} \\implies T = \\frac{200}{12.5} = 16$ Years.\n  *Answer: 16 Years*\n\n**Q2: Find the missing term in the sequence: 3, 12, 48, 192, ?**\n* **Solution:** The pattern is multiplication by 4.\n  $3 \\times 4 = 12$, $12 \\times 4 = 48$, $48 \\times 4 = 192$.\n  Next term = $192 \\times 4 = 768$.\n  *Answer: 768*\n\n#### Section B: Basic Programming\n\n**Q3: What will be the output of the following C code snippet?**\n```c\n#include <stdio.h>\nint main() {\n    int a = 5, b = 2;\n    float result = a / b;\n    printf(\"%.1f\", result);\n    return 0;\n}\n```\n* **Solution:** Since both `a` and `b` are integers, `a / b` performs integer division resulting in `2`. This integer value `2` is then cast to float, resulting in `2.0`.\n  *Answer: 2.0*"
  },
  {
    id: "res-cse-paper-1",
    title: "Infosys Diploma Trainee Technical Exam 2024",
    branch: "Computer Engineering",
    subject: "Computer Systems & Programming",
    category: "Previous Papers",
    summary: "Previous placement paper questions for Computer Engineering/IT branch candidates at Infosys. Focused on Pseudocode, OOPs, and Database queries.",
    content: "### Infosys Diploma Trainee Solved Questions (2024 Exam)\n\n#### Q1: Pseudocode Execution\n**What is the output of the following pseudocode for a=3, b=7?**\n```\nFunction solve(a, b):\n  if (a > b):\n    return a - b\n  else:\n    return solve(a + 1, b - 1) + 2\n```\n* **Execution Steps:**\n  1. `solve(3, 7)`: Since $3 \\le 7$, calls `solve(4, 6) + 2`\n  2. `solve(4, 6)`: Since $4 \\le 6$, calls `solve(5, 5) + 2`\n  3. `solve(5, 5)`: Since $5 \\le 5$, calls `solve(6, 4) + 2`\n  4. `solve(6, 4)`: Since $6 > 4$, returns $6 - 4 = 2$\n  5. Going back up: `solve(5, 5) = 2 + 2 = 4`\n  6. `solve(4, 6) = 4 + 2 = 6`\n  7. `solve(3, 7) = 6 + 2 = 8`\n  *Answer: 8*\n\n#### Q2: Database Joins\n**Which join returns all rows from the left table, even if there are no matches in the right table?**\n* **Answer:** `LEFT OUTER JOIN` (or simply `LEFT JOIN`)."
  },
  {
    id: "res-ee-paper-1",
    title: "Tata Power Junior Engineer Trainee (JET) Solved Paper",
    branch: "Electrical Engineering",
    subject: "Power & Systems",
    category: "Previous Papers",
    summary: "Original electrical systems questions from Tata Power technical test paper for diploma students.",
    content: "### Tata Power JET Electrical Exam Paper\n\n#### Q1: In a balanced star-connected load, what is the relation between line current ($I_L$) and phase current ($I_{ph}$)?\n* **Answer:** In a star (Y) connection, the line current is equal to the phase current ($I_L = I_{ph}$).\n  *Note:* In delta connection, $I_L = \\sqrt{3} I_{ph}$.\n\n#### Q2: Why is the core of a power transformer laminated?\n* **Answer:** Transformer cores are laminated with thin silicon steel sheets to reduce **Eddy Current losses**. Silicon steel is chosen to also minimize Hysteresis losses."
  },

  // CODING CHALLENGES
  {
    id: "res-all-code-1",
    title: "Classic Puzzle: FizzBuzz Implementation",
    branch: "All",
    subject: "Programming Basics",
    category: "Coding Challenges",
    summary: "Write a program that prints numbers from 1 to N, replacing multiples of 3 with 'Fizz', multiples of 5 with 'Buzz', and multiples of both with 'FizzBuzz'.",
    content: "### Coding Challenge: FizzBuzz\n\n#### Challenge Goal\nWrite a function `fizzBuzz(n)` that accepts a positive integer `n` and returns an array of strings representing the output.\n\n#### Input Specs\n* Parameter: `n` (integer, e.g. `15`)\n\n#### Output Specs\nAn array of strings where:\n* `arr[i]` is \"Fizz\" if `i` is divisible by 3\n* `arr[i]` is \"Buzz\" if `i` is divisible by 5\n* `arr[i]` is \"FizzBuzz\" if `i` is divisible by 3 and 5\n* `arr[i]` is the index `i` (as a string) otherwise\n\n#### Starter Template\n```javascript\nfunction fizzBuzz(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 3 === 0 && i % 5 === 0) {\n      result.push(\"FizzBuzz\");\n    } else if (i % 3 === 0) {\n      result.push(\"Fizz\");\n    } else if (i % 5 === 0) {\n      result.push(\"Buzz\");\n    } else {\n      result.push(i.toString());\n    }\n  }\n  return result;\n}\n```\n\n#### Verify Output\nIf you input `n = 5`, expected array output: `[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]`."
  },
  {
    id: "res-cse-code-2",
    title: "Reverse a String In-Place",
    branch: "Computer Engineering",
    subject: "Algorithms",
    category: "Coding Challenges",
    summary: "Write an algorithm to reverse an array of characters in place. Essential for learning two-pointer array operations.",
    content: "### Coding Challenge: Reverse a String In-Place\n\n#### Challenge Goal\nWrite a function `reverseString(arr)` that takes an array of characters and reverses them **in-place** with $O(1)$ extra memory.\n\n#### Input Specs\n* Parameter: `arr` (array of characters, e.g. `['h', 'e', 'l', 'l', 'o']`)\n\n#### Starter Template\n```javascript\nfunction reverseString(arr) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left < right) {\n    let temp = arr[left];\n    arr[left] = arr[right];\n    arr[right] = temp;\n    left++;\n    right--;\n  }\n  return arr;\n}\n```\n\n#### Verify Output\nIf you input `['h', 'e', 'l', 'l', 'o']`, the output should be `['o', 'l', 'l', 'e', 'h']`."
  },
  {
    id: "res-ece-code-3",
    title: "Bit Manipulation: Count Set Bits",
    branch: "Electronics & Communication",
    subject: "Embedded C Operations",
    category: "Coding Challenges",
    summary: "Write a function that counts how many bits are set to 1 in a positive integer's binary representation. Frequently asked in firmware/embedded interviews.",
    content: "### Coding Challenge: Count Set Bits (Hamming Weight)\n\n#### Challenge Goal\nWrite a function `countSetBits(n)` that counts the number of 1s in the binary representation of an unsigned integer.\n\n#### Input Specs\n* Parameter: `n` (unsigned integer, e.g. `11` which is `1011` in binary)\n\n#### Starter Template\n```javascript\nfunction countSetBits(n) {\n  let count = 0;\n  while (n > 0) {\n    count += (n & 1);\n    n = n >> 1;\n  }\n  return count;\n}\n```\n\n#### Verify Output\nIf you input `11` (binary `1011`), expected output is `3` set bits."
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "TCS Smart Hiring Registration Deadline Extended!",
    content: "Greetings students! TCS has extended the registration portal for the Smart Hiring Diploma Trainee path till July 20, 2026. All eligible CSE, ECE, and EE students with 60% and above must complete their profile and apply immediately. This is a great starting role with excellent training pathways.",
    author: "Prof. S. Raghunath (Placement Officer)",
    date: "2026-07-04",
    important: true
  },
  {
    id: "ann-2",
    title: "Mock Interview Drills starting this Friday",
    content: "To build confidence, our college's Alumni Network is organizing simulated technical and HR mock interview drills this Friday from 10:00 AM in Room 201. Carry two copies of your printed PlacementPro resumes.",
    author: "T&P Administration",
    date: "2026-07-02",
    important: false
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "not-1",
    title: "New Company Drive Listed",
    content: "Infosys Technical Graduate Program is now accepting applications. Check your eligibility.",
    type: "Drive",
    date: "2026-07-05",
    read: false
  },
  {
    id: "not-2",
    title: "Urgent: Complete Mock Tests",
    content: "To boost your Placement Readiness Score, complete at least 2 pending mock assessments.",
    type: "Reminder",
    date: "2026-07-03",
    read: false
  }
];
