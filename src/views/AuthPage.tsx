import { useState } from "react";
import { login, register } from "../lib/api";
import type { User } from "../lib/mockData";

type Tab = "login" | "register";
type RegRole = "student" | "librarian";

interface Props {
  onLogin: (user: User) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function AuthPage({ onLogin, showToast }: Props) {
  const [tab, setTab] = useState<Tab>("login");
  const [role, setRole] = useState<RegRole>("student");
  const [loading, setLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [staffCode, setStaffCode] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPass);
      showToast(`Welcome back, ${user.name}!`, "success");
      onLogin(user as User);
    } catch {
      showToast("Invalid email or password.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (regPass !== regConfirmPass) { showToast("Passwords do not match.", "error"); return; }
    if (regPass.length < 8) { showToast("Password must be at least 8 characters.", "error"); return; }
    setLoading(true);
    try {
      await register({ name: regName, email: regEmail, password: regPass, studentId: regStudentId, phone: regPhone, role });
      showToast("Registered! Please verify your email before logging in.", "success");
      setTab("login");
      setLoginEmail(regEmail);
    } catch {
      showToast("Registration failed. Try a different email.", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded border text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-0";
  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute font-serif text-white/20 select-none"
              style={{ top: `${(i * 17) % 90}%`, left: `${(i * 23) % 85}%`, fontSize: `${40 + (i * 13) % 60}px`, transform: `rotate(${(i * 7) % 20 - 10}deg)` }}>
              ❝
            </div>
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <span className="font-serif text-2xl text-white">LibraryMS</span>
          </div>
        </div>
        <div className="relative z-10">
          <blockquote className="font-serif text-3xl text-white/90 leading-tight max-w-sm">
            "A library is not a luxury but one of the necessities of life."
          </blockquote>
          <p className="mt-4 text-white/50 text-sm">— Henry Ward Beecher</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[["30,000+", "Books"], ["36", "Categories"], ["4,800+", "Members"]].map(([n, l]) => (
            <div key={l} className="rounded p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
              <p className="font-mono text-xl font-bold" style={{ color: "var(--accent)" }}>{n}</p>
              <p className="text-xs text-white/50 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
            </div>
            <span className="font-serif text-xl" style={{ color: "var(--primary)" }}>LibraryMS</span>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg p-1 mb-6" style={{ background: "var(--muted)" }}>
            {(["login", "register"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-md text-sm font-semibold capitalize transition-all"
                style={tab === t ? { background: "var(--card)", color: "var(--foreground)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { color: "var(--muted-foreground)" }}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Email Address</label>
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  placeholder="arif@student.edu" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Password</label>
                <div className="relative">
                  <input type={showLoginPass ? "text" : "password"} required value={loginPass} onChange={e => setLoginPass(e.target.value)}
                    placeholder="Your password" className={`${inputClass} pr-10`} style={inputStyle} />
                  <button type="button" onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showLoginPass ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <button type="button" className="text-xs hover:underline" style={{ color: "var(--accent)" }}>Forgot password?</button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
              <div className="text-center pt-2">
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Demo: <span className="font-mono">arif@student.edu</span> · <span className="font-mono">mizan@librarian.edu</span> · <span className="font-mono">admin@library.edu</span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>(any password works in demo mode)</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["student", "librarian"] as RegRole[]).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className="py-2 rounded border text-sm font-medium capitalize transition-all"
                      style={role === r
                        ? { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                        : { background: "var(--card)", color: "var(--muted-foreground)", borderColor: "var(--border)" }}>
                      {r === "student" ? "Student / Member" : "Librarian"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Full Name</label>
                  <input required value={regName} onChange={e => setRegName(e.target.value)} placeholder="Arif Rahman" className={inputClass} style={inputStyle} />
                </div>
                {role === "student" && (
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Student / Member ID</label>
                    <input required value={regStudentId} onChange={e => setRegStudentId(e.target.value)} placeholder="CS-2024-001" className={inputClass} style={inputStyle} />
                  </div>
                )}
                <div className={role === "student" ? "" : "col-span-2"}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Phone</label>
                  <input value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="+880 17XX-XXXXXX" className={inputClass} style={inputStyle} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Email Address</label>
                  <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@student.edu" className={inputClass} style={inputStyle} />
                </div>
                {role === "librarian" && (
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Staff / Library Code</label>
                    <input required value={staffCode} onChange={e => setStaffCode(e.target.value)} placeholder="LIB-STAFF-2024" className={inputClass} style={inputStyle} />
                    <p className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>Contact your library admin for the staff code.</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Password</label>
                  <input type="password" required value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Min. 8 characters" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Confirm Password</label>
                  <input type="password" required value={regConfirmPass} onChange={e => setRegConfirmPass(e.target.value)} placeholder="Repeat password" className={inputClass} style={inputStyle} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
