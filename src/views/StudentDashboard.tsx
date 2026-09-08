import { useState } from "react";
import { MOCK_LOANS, MOCK_NOTIFICATIONS, type User, type Loan, type Notification } from "../lib/mockData";
import { returnBook, renewBook } from "../lib/api";
import type { View } from "../App";

interface Props {
  user: User;
  setView: (v: View) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

type DashTab = "loans" | "history" | "fines" | "notifications" | "wishlist";

const STATUS_BADGE: Record<string, { label: string; style: React.CSSProperties }> = {
  active: { label: "Active", style: { background: "#dbeafe", color: "#1e40af" } },
  overdue: { label: "Overdue", style: { background: "#fee2e2", color: "#991b1b" } },
  returned: { label: "Returned", style: { background: "#d1fae5", color: "#065f46" } },
  lost: { label: "Lost", style: { background: "#fef3c7", color: "#92400e" } },
};

function LoanRow({ loan, onReturn, onRenew }: { loan: Loan; onReturn: (id: string) => void; onRenew: (id: string) => void }) {
  const isOverdue = loan.status === "overdue";
  const isActive = loan.status === "active";
  const badge = STATUS_BADGE[loan.status];

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border transition-colors" style={{ background: "var(--card)", borderColor: isOverdue ? "#fca5a5" : "var(--border)" }}>
      <div className="w-10 h-14 rounded flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ background: loan.coverColor }}>
        {loan.bookTitle.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{loan.bookTitle}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{loan.bookAuthor}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={badge.style}>{badge.label}</span>
          <span className="text-[10px] font-mono" style={{ color: isOverdue ? "#dc2626" : "var(--muted-foreground)" }}>
            {loan.returnedAt ? `Returned ${loan.returnedAt}` : `Due ${loan.dueDate}`}
          </span>
          {loan.fine > 0 && (
            <span className="text-[10px] font-mono font-bold" style={{ color: "#dc2626" }}>৳{loan.fine} fine</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {isActive && !loan.renewed && (
          <button onClick={() => onRenew(loan.id)} className="text-xs px-3 py-1.5 rounded border transition-colors hover:shadow-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Renew</button>
        )}
        {isActive && (
          <button onClick={() => onReturn(loan.id)} className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
            style={{ background: "var(--primary)", color: "white" }}>Return</button>
        )}
        {isOverdue && (
          <button className="text-xs px-3 py-1.5 rounded font-medium"
            style={{ background: "#dc2626", color: "white" }}>Pay Fine</button>
        )}
      </div>
    </div>
  );
}

function NotifCard({ n }: { n: Notification }) {
  const colors = { info: "#2563eb", warning: "#d97706", success: "#16a34a", error: "#dc2626" };
  const bg = { info: "#eff6ff", warning: "#fffbeb", success: "#f0fdf4", error: "#fef2f2" };
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ background: n.read ? "var(--card)" : bg[n.type], borderColor: n.read ? "var(--border)" : colors[n.type] + "40" }}>
      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: n.read ? "transparent" : colors[n.type] }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{n.title}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{n.message}</p>
        <p className="text-[10px] mt-1.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{new Date(n.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function StudentDashboard({ user, setView, showToast }: Props) {
  const [tab, setTab] = useState<DashTab>("loans");
  const [loans, setLoans] = useState(MOCK_LOANS);
  const [notifs] = useState(MOCK_NOTIFICATIONS);

  const activeLoans = loans.filter(l => l.status === "active" || l.status === "overdue");
  const history = loans.filter(l => l.status === "returned" || l.status === "lost");
  const fines = loans.filter(l => l.fine > 0);
  const unreadNotifs = notifs.filter(n => !n.read);
  const totalFines = fines.reduce((sum, l) => sum + (l.finePaid ? 0 : l.fine), 0);

  async function handleReturn(id: string) {
    await returnBook(id);
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: "returned" as const, returnedAt: new Date().toISOString().slice(0, 10) } : l));
    showToast("Book returned successfully!", "success");
  }

  async function handleRenew(id: string) {
    await renewBook(id);
    const newDue = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    setLoans(prev => prev.map(l => l.id === id ? { ...l, dueDate: newDue, renewed: true } : l));
    showToast(`Renewed! New due date: ${newDue}`, "success");
  }

  const TABS: { id: DashTab; label: string; count?: number }[] = [
    { id: "loans", label: "Active Loans", count: activeLoans.length },
    { id: "history", label: "History", count: history.length },
    { id: "fines", label: "Fines", count: totalFines > 0 ? fines.length : undefined },
    { id: "notifications", label: "Notifications", count: unreadNotifs.length || undefined },
    { id: "wishlist", label: "Wishlist" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8" style={{ color: "var(--foreground)" }}>
      {/* Profile header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: "var(--primary)", color: "white" }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl">{user.name}</h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {user.studentId && <span className="font-mono">{user.studentId} · </span>}{user.email}
            </p>
          </div>
        </div>
        <button onClick={() => setView("browse")} className="px-4 py-2 rounded text-sm font-medium" style={{ background: "var(--primary)", color: "white" }}>
          Browse Books
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Borrowed", value: user.borrowCount, color: "var(--primary)" },
          { label: "Currently Active", value: activeLoans.length, color: "var(--accent)" },
          { label: "Overdue", value: loans.filter(l => l.status === "overdue").length, color: "#dc2626" },
          { label: "Unpaid Fines", value: `৳${totalFines}`, color: totalFines > 0 ? "#dc2626" : "#16a34a" },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg border text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="font-mono text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue warning */}
      {loans.some(l => l.status === "overdue") && (
        <div className="mb-5 p-4 rounded-lg border flex items-start gap-3" style={{ background: "#fef2f2", borderColor: "#fca5a5" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#991b1b" }}>You have overdue books</p>
            <p className="text-xs mt-0.5" style={{ color: "#b91c1c" }}>Return overdue books to avoid additional fines. Fine: ৳15/day.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b mb-5 overflow-x-auto" style={{ borderColor: "var(--border)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors"
            style={tab === t.id ? { borderColor: "var(--primary)", color: "var(--primary)" } : { borderColor: "transparent", color: "var(--muted-foreground)" }}>
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: t.id === "fines" || t.id === "notifications" ? "#dc2626" : "var(--primary)", color: "white" }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "loans" && (
        <div className="space-y-3 animate-fade-in">
          {activeLoans.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📖</div>
              <p className="font-medium">No active loans</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Browse our catalog to borrow your first book.</p>
              <button onClick={() => setView("browse")} className="mt-4 px-4 py-2 rounded text-sm font-medium" style={{ background: "var(--primary)", color: "white" }}>Browse Books</button>
            </div>
          ) : (
            activeLoans.map(l => <LoanRow key={l.id} loan={l} onReturn={handleReturn} onRenew={handleRenew} />)
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3 animate-fade-in">
          {history.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📚</div>
              <p className="font-medium">No borrowing history yet</p>
            </div>
          ) : (
            history.map(l => <LoanRow key={l.id} loan={l} onReturn={handleReturn} onRenew={handleRenew} />)
          )}
        </div>
      )}

      {tab === "fines" && (
        <div className="animate-fade-in">
          {totalFines > 0 ? (
            <>
              <div className="p-4 rounded-lg border mb-4 flex items-center justify-between" style={{ background: "#fef2f2", borderColor: "#fca5a5" }}>
                <div>
                  <p className="font-semibold" style={{ color: "#991b1b" }}>Total Outstanding Fines</p>
                  <p className="font-mono text-2xl font-bold mt-0.5" style={{ color: "#dc2626" }}>৳{totalFines}</p>
                </div>
                <button className="px-4 py-2 rounded text-sm font-semibold" style={{ background: "#dc2626", color: "white" }}>Pay at Counter</button>
              </div>
              <div className="space-y-3">
                {fines.filter(l => !l.finePaid).map(l => (
                  <div key={l.id} className="p-4 rounded-lg border flex items-center justify-between" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                    <div>
                      <p className="text-sm font-medium">{l.bookTitle}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Due: {l.dueDate} · Status: {l.status}</p>
                    </div>
                    <span className="font-mono font-bold" style={{ color: "#dc2626" }}>৳{l.fine}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-medium text-green-700">No outstanding fines!</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Great job returning books on time.</p>
            </div>
          )}
        </div>
      )}

      {tab === "notifications" && (
        <div className="space-y-3 animate-fade-in">
          {notifs.map(n => <NotifCard key={n.id} n={n} />)}
        </div>
      )}

      {tab === "wishlist" && (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-4xl mb-3">♡</div>
          <p className="font-medium">Your wishlist is empty</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Tap the heart icon on any book to save it for later.</p>
          <button onClick={() => setView("browse")} className="mt-4 px-4 py-2 rounded text-sm font-medium" style={{ background: "var(--primary)", color: "white" }}>Browse Books</button>
        </div>
      )}
    </div>
  );
}
