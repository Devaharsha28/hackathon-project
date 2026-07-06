import React, { useState } from 'react';
import { ShieldAlert, Compass, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (role: 'student' | 'admin', user: any) => void;
  initialMode?: 'login' | 'register';
}

export default function Auth({ onAuthSuccess, initialMode = 'login' }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [college, setCollege] = useState('State Government Polytechnic College');
  const [percentage, setPercentage] = useState('80');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }
      onAuthSuccess(data.role, data.user);
    } catch (err: any) {
      setError(err.message || 'Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !branch || !college || !percentage) {
      setError("Please fill out all mandatory fields.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, branch, college, percentage: Number(percentage) })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      setSuccessMsg("Registration successful! Logging you in...");
      setTimeout(() => {
        onAuthSuccess(data.role, data.user);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccessMsg(data.message || "A secure reset link has been dispatched to your email address.");
      setTimeout(() => {
        setSuccessMsg(null);
        setMode('login');
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Forgot password failed.');
    } finally {
      setLoading(false);
    }
  };

  // Immediate Testing Credentials Switchers
  const triggerBypass = async (role: 'student' | 'admin') => {
    setLoading(true);
    setError(null);
    const bypassEmail = role === 'student' ? 'student@placementpro.in' : 'admin@placementpro.in';
    const bypassPassword = role === 'student' ? 'password' : 'admin';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: bypassEmail, password: bypassPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAuthSuccess(data.role, data.user);
    } catch (err: any) {
      setError(err.message || 'Bypass failed.');
    } finally {
      setLoading(false);
    }
  };

  const BRANCHES = [
    "Computer Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-[#faf9f6]" id="auth-portal">
      <div className="w-full max-w-md bg-white border border-[#e8e6dd] rounded-3xl p-8 shadow-sm relative overflow-hidden">
        
        {/* Dynamic header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400"></div>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mx-auto">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1c1a19]">
            {mode === 'login' ? 'Welcome to PlacementPro' : mode === 'register' ? 'Register Student Profile' : 'Reset Password'}
          </h2>
          <p className="text-xs text-[#7c756e]">
            {mode === 'login' 
              ? 'Enter credentials to prepare, test, & apply.' 
              : mode === 'register' 
              ? 'Exclusively for Polytechnic Diploma students.' 
              : 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-800 text-xs flex gap-2" id="auth-error-banner">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs flex gap-2" id="auth-success-banner">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Module */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Diploma Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@placementpro.in"
                className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Secure Password</label>
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#e2dfd4] text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs text-[#5c5650] font-medium">Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition duration-200 shadow-sm flex items-center justify-center gap-2"
              id="submit-login-btn"
            >
              {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-xs text-[#7c756e] pt-2">
              New Diploma student?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-blue-600 font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Diploma Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.in"
                className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full text-xs bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 text-[#2c2a29]"
                >
                  {BRANCHES.map((b, idx) => (
                    <option key={idx} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">CGPA / Percentage</label>
                <input
                  type="number"
                  required
                  min="35"
                  max="100"
                  step="0.1"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="e.g. 78.5"
                  className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Polytechnic College Name</label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Government Polytechnic College"
                className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Account Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create strong password"
                className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition"
              id="submit-register-btn"
            >
              {loading ? 'Creating Student Profile...' : 'Complete Profile & Register'}
            </button>

            <p className="text-center text-xs text-[#7c756e]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5c5650] uppercase tracking-wide">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.in"
                className="w-full text-sm bg-[#faf9f6] border border-[#e2dfd4] rounded-xl p-3 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm"
              id="submit-forgot-btn"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-2 bg-transparent border border-[#e2dfd4] text-[#5c5650] font-medium rounded-xl text-xs"
            >
              Cancel and Return
            </button>
          </form>
        )}

        {/* HIGH-FIDELITY BYPASS AREA FOR THE USER */}
        <div className="mt-8 pt-6 border-t border-[#f1efe8] space-y-3">
          <h4 className="text-[10px] uppercase font-bold text-[#8c857e] tracking-wider text-center flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-amber-500" />
            AI Studio MVP Bypass Controllers
          </h4>
          <p className="text-[10px] text-center text-[#7c756e] leading-relaxed">
            Click to instantly login as either prefilled role for testing of all dashboards.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => triggerBypass('student')}
              className="py-2.5 px-3 bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl transition flex flex-col items-center justify-center text-center gap-0.5"
              id="quick-bypass-student"
            >
              <span className="text-[10px] opacity-80 font-normal">Test Student</span>
              <span>Rajesh (CS)</span>
            </button>
            <button
              type="button"
              onClick={() => triggerBypass('admin')}
              className="py-2.5 px-3 bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 text-xs font-bold rounded-xl transition flex flex-col items-center justify-center text-center gap-0.5"
              id="quick-bypass-admin"
            >
              <span className="text-[10px] opacity-80 font-normal">Test Administrator</span>
              <span>T&P Director</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
