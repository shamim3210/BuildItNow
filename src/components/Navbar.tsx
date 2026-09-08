import { useState } from "react";
import type { User } from "../lib/mockData";
import type { View } from "../App";

interface Props {
  user: User | null;
  view: View;
  setView: (v: View) => void;
  onLogout: () => void;
  unreadCount: number;
  darkMode: boolean;
  toggleDark: () => void;
}

export default function Navbar({ user, view, setView, onLogout, unreadCount, darkMode, toggleDark }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks: { label: string; view: View }[] = [
    { label: "Home", view: "home" },
    { label: "Browse", view: "browse" },
  ];

  if (user?.role === "student") {
    navLinks.push({ label: "My Loans", view: "student-dashboard" });
  } else if (user?.role === "librarian") {
    navLinks.push({ label: "Dashboard", view: "librarian-dashboard" });
  } else if (user?.role === "admin") {
    navLinks.push({ label: "Admin", view: "admin-dashboard" });
    navLinks.push({ label: "Librarian", view: "librarian-dashboard" });
  }

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: "var(--primary)", borderColor: "rgba(255,255,255,0.1)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button onClick={() => setView("home")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <span className="font-serif text-lg text-white tracking-wide hidden sm:block">LibraryMS</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <button
                key={l.view}
                onClick={() => setView(l.view)}
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  color: view === l.view ? "var(--accent)" : "rgba(255,255,255,0.7)",
                  background: view === l.view ? "rgba(200,149,42,0.12)" : "transparent"
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <button onClick={toggleDark} className="w-8 h-8 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              {darkMode
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <button onClick={() => setView("notifications")} className="relative w-8 h-8 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: "var(--accent)", color: "white" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--accent)", color: "white" }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white/80 hidden sm:block">{user.name.split(" ")[0]}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 rounded shadow-xl border z-50 animate-fade-in" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{user.name}</p>
                        <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--muted-foreground)" }}>{user.role} · {user.email}</p>
                      </div>
                      <div className="p-1">
                        <button onClick={() => { setView("profile"); setProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors" style={{ color: "var(--foreground)" }}>Profile Settings</button>
                        <button onClick={() => { onLogout(); setProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm rounded transition-colors" style={{ color: "#dc2626" }}>Sign Out</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button onClick={() => setView("auth")} className="px-4 py-1.5 rounded text-sm font-medium transition-colors" style={{ background: "var(--accent)", color: "white" }}>
                Sign In
              </button>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-8 h-8 rounded flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t py-2 animate-fade-in" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            {navLinks.map(l => (
              <button key={l.view} onClick={() => { setView(l.view); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors"
                style={{ color: view === l.view ? "var(--accent)" : "rgba(255,255,255,0.7)" }}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
