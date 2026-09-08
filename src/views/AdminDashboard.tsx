import { useState } from "react";
import { STATS, AUDIT_LOG, MOCK_USERS, CATEGORIES, type User } from "../lib/mockData";
import type { View } from "../App";

interface Props {
  user: User;
  setView: (v: View) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

type AdminTab = "dashboard" | "users" | "librarians" | "settings" | "audit" | "reports";

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon: string }) {
  return (
    <div className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="font-mono text-xl font-bold" style={{ color }}>{typeof value === "number" ? value.toLocaleString() : value}</span>
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{sub}</p>}
    </div>
  );
}

function SimpleBarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="space-y-2.5">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs w-32 truncate flex-shrink-0" style={{ color: "var(--muted-foreground)" }}>{d.label}</span>
          <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ background: "var(--muted)" }}>
            <div className="h-full rounded-sm transition-all" style={{ width: `${(d.value / max) * 100}%`, background: d.color || "var(--primary)" }} />
          </div>
          <span className="text-xs font-mono w-10 text-right flex-shrink-0" style={{ color: "var(--foreground)" }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function MiniLineChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count));
  const min = Math.min(...data.map(d => d.count));
  const range = max - min || 1;
  const W = 300, H = 80;
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((d.count - min) / range) * (H - 10) - 5
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L 0 ${H} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--primary)" />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map(d => (
          <span key={d.month} className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ user, setView, showToast }: Props) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [finePerDay, setFinePerDay] = useState("15");
  const [maxBorrowDays, setMaxBorrowDays] = useState("14");
  const [maxBooksPerUser, setMaxBooksPerUser] = useState("3");
  const [renewalLimit, setRenewalLimit] = useState("1");
  const [staffCode, setStaffCode] = useState("LIB-STAFF-2024");
  const [fineCap, setFineCap] = useState("100");

  const monthlyData = [
    { month: "Aug", count: 2890 },
    { month: "Sep", count: 3120 },
    { month: "Oct", count: 2980 },
    { month: "Nov", count: 3240 },
    { month: "Dec", count: 2640 },
    { month: "Jan", count: 3240 },
  ];

  const categoryData = [
    { label: "Computer Science", value: 312, color: "var(--primary)" },
    { label: "Self Development", value: 278, color: "var(--accent)" },
    { label: "Machine Learning", value: 241, color: "#16a34a" },
    { label: "Psychology", value: 198, color: "#7c3aed" },
    { label: "Business", value: 187, color: "#0891b2" },
  ];

  const mostBorrowed = [
    { label: "Atomic Habits", value: 89 },
    { label: "Clean Code", value: 72 },
    { label: "Deep Learning", value: 64 },
    { label: "Thinking, Fast...", value: 58 },
    { label: "Intro to Algorithms", value: 51 },
  ];

  const TABS: { id: AdminTab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Students" },
    { id: "librarians", label: "Librarians" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
    { id: "audit", label: "Audit Log" },
  ];

  function saveSettings() {
    showToast("System settings saved successfully.", "success");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" style={{ color: "var(--foreground)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono tracking-wider uppercase mb-1" style={{ color: "var(--accent)" }}>Admin Panel</p>
          <h1 className="font-serif text-2xl">System Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-3 py-2 rounded border flex items-center gap-1.5" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button className="text-xs px-3 py-2 rounded flex items-center gap-1.5" style={{ background: "var(--primary)", color: "white" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto" style={{ borderColor: "var(--border)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors"
            style={tab === t.id ? { borderColor: "var(--primary)", color: "var(--primary)" } : { borderColor: "transparent", color: "var(--muted-foreground)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="space-y-6 animate-fade-in">
          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard label="Total Books" value={STATS.totalBooks} icon="📚" color="var(--primary)" sub="30 categories" />
            <StatCard label="Available Copies" value={STATS.availableCopies} icon="✅" color="#16a34a" sub="of 89,430 total" />
            <StatCard label="Active Borrows" value={STATS.borrowedBooks} icon="📤" color="var(--accent)" sub="this semester" />
            <StatCard label="Overdue" value={STATS.overdueBooks} icon="⚠️" color="#dc2626" sub="need attention" />
            <StatCard label="Total Students" value={STATS.totalStudents} icon="👥" color="var(--primary)" sub={`${STATS.activeStudents} active`} />
            <StatCard label="Librarians" value={STATS.totalLibrarians} icon="👨‍💼" color="#7c3aed" sub="2 branches" />
            <StatCard label="Unpaid Fines" value={`৳${STATS.totalFinesUnpaid.toLocaleString()}`} icon="💰" color="#dc2626" sub="pending collection" />
            <StatCard label="Reservations" value={STATS.pendingReservations} icon="📌" color="#0891b2" sub="pending pickup" />
          </div>

          {/* Charts row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold mb-4">Monthly Borrowing Trend</h3>
              <MiniLineChart data={monthlyData} />
              <p className="text-xs mt-3 text-right font-mono" style={{ color: "var(--muted-foreground)" }}>
                This month: {STATS.monthlyBorrows.toLocaleString()} borrows · {STATS.monthlyReturns.toLocaleString()} returns
              </p>
            </div>
            <div className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold mb-4">Demand by Category</h3>
              <SimpleBarChart data={categoryData} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold mb-4">Most Borrowed Books</h3>
              <SimpleBarChart data={mostBorrowed} />
            </div>
            <div className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold mb-4">Fine Collection Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Fines Generated", value: `৳${(STATS.totalFinesUnpaid + STATS.totalFinesPaid).toLocaleString()}`, color: "var(--foreground)" },
                  { label: "Collected", value: `৳${STATS.totalFinesPaid.toLocaleString()}`, color: "#16a34a" },
                  { label: "Outstanding", value: `৳${STATS.totalFinesUnpaid.toLocaleString()}`, color: "#dc2626" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{r.label}</span>
                    <span className="text-sm font-mono font-bold" style={{ color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <div className="h-2 rounded-full mt-2" style={{ background: "var(--muted)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${Math.round((STATS.totalFinesPaid / (STATS.totalFinesPaid + STATS.totalFinesUnpaid)) * 100)}%`, background: "#16a34a" }} />
                </div>
                <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                  {Math.round((STATS.totalFinesPaid / (STATS.totalFinesPaid + STATS.totalFinesUnpaid)) * 100)}% collected
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="animate-fade-in">
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--muted)" }}>
                  {["Student", "ID", "Email", "Joined", "Borrows", "Fines", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {MOCK_USERS.filter(u => u.role === "student").map(u => (
                  <tr key={u.id} style={{ background: "var(--card)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "white" }}>
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{u.studentId}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{u.email}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{u.joinedAt}</td>
                    <td className="px-4 py-3 text-center font-mono">{u.borrowCount}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: u.activeFines > 0 ? "#dc2626" : "#16a34a" }}>
                      {u.activeFines > 0 ? `৳${u.activeFines}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={u.active ? { background: "#d1fae5", color: "#065f46" } : { background: "#fee2e2", color: "#991b1b" }}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => showToast(`User ${u.name} deactivated.`, "info")}
                        className="text-xs px-2 py-1 rounded border" style={{ borderColor: "var(--border)", color: u.active ? "#dc2626" : "#16a34a" }}>
                        {u.active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "librarians" && (
        <div className="animate-fade-in">
          <div className="mb-4 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ background: "var(--primary)", color: "white" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Librarian
            </button>
          </div>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--muted)" }}>
                  {["Librarian", "Email", "Branch", "Joined", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.filter(u => u.role === "librarian").map(u => (
                  <tr key={u.id} style={{ background: "var(--card)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--accent)", color: "white" }}>
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{u.email}</td>
                    <td className="px-4 py-3 text-xs">Main Campus</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{u.joinedAt}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>Active</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => showToast("Librarian permissions updated.", "info")}
                        className="text-xs px-2 py-1 rounded border" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="max-w-2xl animate-fade-in space-y-6">
          <div className="p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="font-semibold mb-4">Borrowing Rules</h2>
            <div className="space-y-4">
              {[
                { label: "Borrow Duration (days)", value: maxBorrowDays, set: setMaxBorrowDays, help: "How long a member can keep a book" },
                { label: "Max Books Per Member", value: maxBooksPerUser, set: setMaxBooksPerUser, help: "Maximum simultaneous borrows" },
                { label: "Max Renewals Per Loan", value: renewalLimit, set: setRenewalLimit, help: "0 = no renewals allowed" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{r.label}</label>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{r.help}</p>
                  </div>
                  <input type="number" value={r.value} onChange={e => r.set(e.target.value)} min="1"
                    className="w-20 px-3 py-2 rounded border text-sm text-center outline-none font-mono"
                    style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="font-semibold mb-4">Fine Settings</h2>
            <div className="space-y-4">
              {[
                { label: "Fine per Overdue Day (৳)", value: finePerDay, set: setFinePerDay, help: "Charged per day past due date" },
                { label: "Fine Cap — Block Borrowing (৳)", value: fineCap, set: setFineCap, help: "Borrowing blocked above this amount" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{r.label}</label>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{r.help}</p>
                  </div>
                  <input type="number" value={r.value} onChange={e => r.set(e.target.value)} min="0"
                    className="w-24 px-3 py-2 rounded border text-sm text-center outline-none font-mono"
                    style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="font-semibold mb-2">Librarian Registration Code</h2>
            <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>Anyone with this code can register as a librarian. Change it immediately if compromised.</p>
            <div className="flex gap-2">
              <input value={staffCode} onChange={e => setStaffCode(e.target.value)}
                className="flex-1 px-3 py-2 rounded border text-sm outline-none font-mono"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              <button onClick={() => setStaffCode(`LIB-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${new Date().getFullYear()}`)}
                className="px-3 py-2 rounded border text-xs font-medium" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                Regenerate
              </button>
            </div>
          </div>
          <button onClick={saveSettings} className="px-6 py-2.5 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "white" }}>
            Save All Settings
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="animate-fade-in">
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--muted)" }}>
                  {["User", "Role", "Action", "Target", "Result", "Timestamp"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {AUDIT_LOG.map(a => (
                  <tr key={a.id} style={{ background: "var(--card)" }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--foreground)" }}>{a.user}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={a.role === "Admin" ? { background: "#fef3c7", color: "#92400e" } : a.role === "Librarian" ? { background: "#dbeafe", color: "#1e40af" } : { background: "var(--muted)", color: "var(--muted-foreground)" }}>
                        {a.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--foreground)" }}>{a.action}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{a.target}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium" style={{ color: a.result === "Success" ? "#16a34a" : "#dc2626" }}>{a.result}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "reports" && (
        <div className="animate-fade-in grid sm:grid-cols-2 gap-4">
          {[
            { title: "Inventory Report", desc: "All books, copies, available, borrowed counts", icon: "📊" },
            { title: "Currently Borrowed", desc: "All active loans with member and due date", icon: "📤" },
            { title: "Overdue Report", desc: "Books past due date and fine calculations", icon: "⚠️" },
            { title: "Fine Report", desc: "All fines, paid and unpaid, with members", icon: "💰" },
            { title: "Member Activity", desc: "Most active members and borrowing stats", icon: "👥" },
            { title: "Category Analysis", desc: "Demand by category, popular shelves", icon: "📈" },
          ].map(r => (
            <div key={r.title} className="p-4 rounded-lg border flex items-start gap-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <span className="text-2xl">{r.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{r.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{r.desc}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => showToast("Generating CSV export…", "info")} className="text-xs px-2.5 py-1.5 rounded border" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>CSV</button>
                <button onClick={() => showToast("Generating PDF report…", "info")} className="text-xs px-2.5 py-1.5 rounded" style={{ background: "var(--primary)", color: "white" }}>PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
