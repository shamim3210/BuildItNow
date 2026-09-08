import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import ToastContainer, { type ToastMessage } from "./components/Toast";
import AuthPage from "./views/AuthPage";
import HomePage from "./views/HomePage";
import BrowsePage from "./views/BrowsePage";
import BookDetailPage from "./views/BookDetailPage";
import StudentDashboard from "./views/StudentDashboard";
import LibrarianDashboard from "./views/LibrarianDashboard";
import AdminDashboard from "./views/AdminDashboard";
import { MOCK_NOTIFICATIONS } from "./lib/mockData";
import type { User } from "./lib/mockData";

export type View =
  | "home" | "browse" | "book-detail" | "auth"
  | "student-dashboard" | "librarian-dashboard" | "admin-dashboard"
  | "notifications" | "profile";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [user, setUser] = useState<User | null>(null);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [browseCategory, setBrowseCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  function handleLogin(u: User) {
    setUser(u);
    if (u.role === "admin") setView("admin-dashboard");
    else if (u.role === "librarian") setView("librarian-dashboard");
    else setView("home");
  }

  function handleLogout() {
    localStorage.removeItem("lms_token");
    setUser(null);
    setView("home");
    showToast("Signed out successfully.", "info");
  }

  function toggleDark() {
    setDarkMode(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  function handleSetView(v: View) {
    if ((v === "student-dashboard" || v === "librarian-dashboard" || v === "admin-dashboard") && !user) {
      setView("auth");
      return;
    }
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  if (view === "auth") {
    return (
      <>
        <AuthPage onLogin={handleLogin} showToast={showToast} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <Navbar
        user={user}
        view={view}
        setView={handleSetView}
        onLogout={handleLogout}
        unreadCount={unreadCount}
        darkMode={darkMode}
        toggleDark={toggleDark}
      />

      <main className="flex-1">
        {view === "home" && (
          <HomePage
            setView={handleSetView}
            setSelectedBookId={setSelectedBookId}
            setBrowseCategory={setBrowseCategory}
          />
        )}
        {view === "browse" && (
          <BrowsePage
            setView={handleSetView}
            setSelectedBookId={setSelectedBookId}
            initialCategory={browseCategory}
          />
        )}
        {view === "book-detail" && (
          <BookDetailPage
            bookId={selectedBookId}
            user={user}
            setView={handleSetView}
            setSelectedBookId={setSelectedBookId}
            showToast={showToast}
          />
        )}
        {view === "student-dashboard" && user && (
          <StudentDashboard
            user={user}
            setView={handleSetView}
            showToast={showToast}
          />
        )}
        {view === "librarian-dashboard" && user && (
          <LibrarianDashboard
            user={user}
            setView={handleSetView}
            setSelectedBookId={setSelectedBookId}
            showToast={showToast}
          />
        )}
        {view === "admin-dashboard" && user && (
          <AdminDashboard
            user={user}
            setView={handleSetView}
            showToast={showToast}
          />
        )}
        {view === "notifications" && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="font-serif text-2xl mb-6" style={{ color: "var(--foreground)" }}>Notifications</h1>
            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.map(n => {
                const colors = { info: "#2563eb", warning: "#d97706", success: "#16a34a", error: "#dc2626" };
                const bg = { info: "#eff6ff", warning: "#fffbeb", success: "#f0fdf4", error: "#fef2f2" };
                return (
                  <div key={n.id} className="p-4 rounded-lg border" style={{ background: n.read ? "var(--card)" : bg[n.type], borderColor: n.read ? "var(--border)" : colors[n.type] + "40", color: "var(--foreground)" }}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: colors[n.type] }} />}
                    </div>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{n.message}</p>
                    <p className="text-[10px] mt-2 font-mono" style={{ color: "var(--muted-foreground)" }}>{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto" style={{ background: "var(--primary)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--accent)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </div>
                <span className="font-serif text-white">LibraryMS</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                University Digital Library — 30,000+ books across two campuses. Open Mon–Fri, 8:00–20:00.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Quick Links</p>
              <div className="space-y-1.5">
                {["Browse Catalog", "My Loans", "New Arrivals", "FAQ"].map(l => (
                  <p key={l} className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Contact</p>
              <div className="space-y-1.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                <p>library@university.edu</p>
                <p>+880 2-XXXX-XXXX</p>
                <p>Main Campus · City Campus</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex items-center justify-between text-[10px]" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)" }}>
            <span>© 2024 LibraryMS. All rights reserved.</span>
            <span>Built with LibraryMS v2.0</span>
          </div>
        </div>
      </footer>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
