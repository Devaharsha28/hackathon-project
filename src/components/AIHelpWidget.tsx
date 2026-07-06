import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Bot, Sparkles, AlertCircle, RefreshCw, GraduationCap, 
  HelpCircle, ChevronRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { label: '📚 CSE Core Subjects', text: 'What are the most important Computer Science topics in the TG ECET CSE syllabus?' },
  { label: '📊 CBIT cutoff rank', text: 'What is the cutoff rank for CSE branch in CBIT Hyderabad for ECET candidates?' },
  { label: '🧠 Digital Electronics tips', text: 'Can you explain the key concepts to focus on in Digital Electronics for TG ECET?' },
  { label: '📝 Prep Strategy', text: 'What is a smart 3-month preparation strategy for a Diploma candidate to score top rank in ECET CSE?' },
];

export default function AIHelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I am your **TG ECET CSE AI Tutor**. 🎓\n\nI can help you with engineering concepts, mock test doubts, Telangana engineering college predictor queries, and syllabus strategies. What would you like to discuss today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages or loading state changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Build history for backend API (Express endpoint)
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        text: data.reply || "I'm sorry, I couldn't formulate a response. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("AI chat error:", err);
      setErrorMsg(err.message || "Failed to communicate with AI server. Please check your network and API key setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: "Let's start fresh! What academic concepts or TG ECET doubts can I help you clear up?",
        timestamp: new Date()
      }
    ]);
    setErrorMsg(null);
  };

  // Safe and clean parser for bold (**bold**) and inline code (`code`) as well as lists
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Check for markdown bullet list
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const rawContent = line.trim().substring(2);
        return (
          <li key={lineIdx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 leading-relaxed mb-1">
            {parseInlineStyles(rawContent)}
          </li>
        );
      }
      
      // Check for markdown numbered list
      const numMatch = line.trim().match(/^(\d+)\.\s(.*)$/);
      if (numMatch) {
        return (
          <li key={lineIdx} className="ml-4 list-decimal text-xs sm:text-sm text-slate-700 leading-relaxed mb-1">
            {parseInlineStyles(numMatch[2])}
          </li>
        );
      }

      // Standard paragraph line
      return (
        <p key={lineIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-1.5 min-h-[0.5rem]">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const parseInlineStyles = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-indigo-50 text-indigo-700 font-mono font-bold text-xs px-1.5 py-0.5 rounded border border-indigo-100/50">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end select-none">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
            isOpen 
              ? 'bg-slate-800 text-white' 
              : 'bg-indigo-650 hover:bg-indigo-700 text-white hover:scale-105 active:scale-95'
          }`}
          id="ai-helper-bubble"
          aria-label="Toggle AI Help Desk"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 rotate-90" />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
              {/* Pulse Ping notification */}
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[9px] text-white font-black items-center justify-center">!</span>
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* CHAT WINDOW INTERFACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[410px] h-[550px] max-h-[80vh] bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden select-none"
            id="ai-helper-window"
          >
            {/* Window Header */}
            <header className="bg-slate-900 text-white p-4 flex justify-between items-center relative overflow-hidden shrink-0">
              {/* background ambiance glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="bg-indigo-600/30 border border-indigo-500/50 p-2 rounded-2xl text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span>AI Tutor</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-indigo-300 font-semibold tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>Always Online AI Tutor</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 relative z-10">
                <button
                  onClick={clearChat}
                  title="Clear Chat History"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition duration-150 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition duration-150 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Chat Body & Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
              
              {/* Suggestion Prompts if chat is empty or contains only welcome message */}
              {messages.length <= 1 && (
                <div className="bg-white p-3 rounded-2xl border border-slate-150 shadow-xs space-y-2.5 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Suggested Prep Topics</span>
                  <div className="grid grid-cols-1 gap-2">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt.text)}
                        className="text-left w-full p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/30 text-xs text-slate-700 hover:text-indigo-950 transition duration-150 font-medium flex justify-between items-center group cursor-pointer"
                      >
                        <span className="truncate mr-2">{prompt.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Render */}
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 p-1.5 rounded-xl shrink-0 mt-0.5">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      <div className="whitespace-pre-line">
                        {msg.role === 'user' ? (
                          <p className="text-xs sm:text-sm text-white leading-relaxed">{msg.text}</p>
                        ) : (
                          renderFormattedText(msg.text)
                        )}
                      </div>
                      <span className={`text-[9px] block text-right mt-1.5 ${
                        msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading state indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5 justify-start">
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 p-1.5 rounded-xl shrink-0 mt-0.5 animate-bounce">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="max-w-[85%] bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs">
                      <div className="flex space-x-1.5 py-1 items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-2xl text-xs flex gap-2.5 items-start">
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Chat Error</p>
                      <p className="text-red-600 font-semibold mt-0.5 leading-relaxed">{errorMsg}</p>
                    </div>
                  </div>
                )}
              </div>

              <div ref={chatEndRef} />
            </div>

            {/* Input Form Footer */}
            <form 
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask ECET AI Tutor anything..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-2xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none transition duration-150 disabled:opacity-60 text-slate-800"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 rounded-2xl bg-indigo-650 hover:bg-indigo-700 text-white disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-150 cursor-pointer shrink-0 flex items-center justify-center hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
