import { useState } from "react";
import { MOCK_BOOKS, MOCK_LOANS, MOCK_USERS, RECENT_ACTIVITY, type User } from "../lib/mockData";
import { BookCover } from "../components/BookCard";
import type { View } from "../App";

interface Props {
  user: User;
  setView: (v: View) => void;
  setSelectedBookId: (id: string) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

type LibTab = "overview" | "members" | "books" | "issue-return" | "fines";

export default function LibrarianDashboard({ user, setView, setSelectedBookId, showToast }: Props) {
  const [tab, setTab] = useState<LibTab>("overview");
  const [memberSearch, setMemberSearch] = useState("");
  const [issueBookId, setIssueBookId] = useState("");
  const [issueMemberId, setIssueMemberId] = useState("");
  const [returnId, setReturnId] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "", category: "", publisher: "", year: "", copies: "1" });

  const members = MOCK_USERS.filter(u => u.role === "student" &&
    (!memberSearch || u.name.toLowerCase().includes(memberSearch.toLowerCase()) || u.email.includes(memberSearch)));

  const activeLoans = MOCK_LOANS.filter(l => l.status === "active" || l.status === "overdue");
  const overdueLoans = MOCK_LOANS.filter(l => l.status === "overdue");

  function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    showToast(`Book "${issueBookId}" issued to member ${issueMemberId}. Due in 14 days.`, "success");
    setIssueBookId(""); setIssueMemberId("");
  }

  function handleReturn(e: React.FormEvent) {
    e.preventDefault();
    const loan = MOCK_LOANS.find(l => l.id === returnId || l.bookId === returnId);
    if (!loan) { showToast("Loan record not found.", "error"); return; }
    showToast(`"${loan.bookTitle}" returned successfully. No fines.`, "success");
    setReturnId("");
  }

  function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    showToast(`Book "${newBook.title}" added to catalog successfully.`, "success");
    setShowAddBook(false);
    setNewBook({ title: "", author: "", isbn: "", category: "", publisher: "", year: "", copies: "1" });
  }

  const inputClass = "w-full px-3 py-2 rounded border text-sm outline-none";
  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  const TABS: { id: LibTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "issue-return", label: "Issue / Return" },
    { id: "members", label: "Members" },
    { id: "books", label: "Catalog" },
    { id: "fines", label: "Fines" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8" style={{ color: "var(--foreground)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono tracking-wider uppercase mb-1" style={{ color: "var(--accent)" }}>Librarian Dashboard</p>
          <h1 className="font-serif text-2xl">{user.name}</h1>
        </div>
        <button onClick={() => setShowAddBook(true)} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-colors"
          style={{ background: "var(--primary)", color: "white" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Book
        </button>
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

      {tab === "overview" && (
        <div className="animate-fade-in space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Books", value: "30,247", icon: "📚", color: "var(--primary)" },
              { label: "Active Loans", value: activeLoans.length, icon: "📤", color: "var(--accent)" },
              { label: "Overdue", value: overdueLoans.length, icon: "⚠️", color: "#dc2626" },
              { label: "Members", value: MOCK_USERS.filter(u => u.role === "student").length, icon: "👥", color: "#16a34a" },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className="font-mono text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="font-semibold text-sm">Recent Activity</h2>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {RECENT_ACTIVITY.map(a => (
                <div key={a.id} className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "white" }}>
                      {a.user.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{a.user}</span>
                      <span className="text-sm mx-1.5" style={{ color: "var(--muted-foreground)" }}>{a.action}</span>
                      <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{a.book}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue alerts */}
          {overdueLoans.length > 0 && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#fca5a5" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#fef2f2" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span className="text-sm font-semibold" style={{ color: "#991b1b" }}>{overdueLoans.length} Overdue Loan{overdueLoans.length > 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y" style={{ borderColor: "#fecaca" }}>
                {overdueLoans.map(l => (
                  <div key={l.id} className="flex items-center justify-between px-4 py-3" style={{ background: "#fff5f5" }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#991b1b" }}>{l.bookTitle}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#b91c1c" }}>Due: {l.dueDate} · Fine: ৳{l.fine}</p>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded font-medium" style={{ background: "#dc2626", color: "white" }}>Notify</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "issue-return" && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          {/* Issue */}
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-4 py-3 border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="font-semibold flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Issue Book
              </h2>
            </div>
            <form onSubmit={handleIssue} className="p-4 space-y-4" style={{ background: "var(--card)" }}>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Book ID / ISBN / Barcode</label>
                <input required value={issueBookId} onChange={e => setIssueBookId(e.target.value)}
                  placeholder="Scan or enter book ID" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Member ID / Email</label>
                <input required value={issueMemberId} onChange={e => setIssueMemberId(e.target.value)}
                  placeholder="Scan member card or enter ID" className={inputClass} style={inputStyle} />
              </div>
              <button type="submit" className="w-full py-2.5 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "white" }}>
                Issue Book
              </button>
            </form>
          </div>

          {/* Return */}
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-4 py-3 border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="font-semibold flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Return Book
              </h2>
            </div>
            <form onSubmit={handleReturn} className="p-4 space-y-4" style={{ background: "var(--card)" }}>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Loan ID / Book ID / Barcode</label>
                <input required value={returnId} onChange={e => setReturnId(e.target.value)}
                  placeholder="Scan or enter loan ID" className={inputClass} style={inputStyle} />
              </div>
              <div className="p-3 rounded" style={{ background: "var(--muted)" }}>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>The system will automatically calculate any fines based on return date. Current fine rate: ৳15/day.</p>
              </div>
              <button type="submit" className="w-full py-2.5 rounded text-sm font-semibold" style={{ background: "var(--accent)", color: "white" }}>
                Process Return
              </button>
            </form>
          </div>

          {/* Currently borrowed table */}
          <div className="md:col-span-2 rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-4 py-3 border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="font-semibold text-sm">Currently Borrowed ({activeLoans.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--muted)" }}>
                    {["Book", "Member", "Borrowed", "Due Date", "Status", "Fine"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {activeLoans.map(l => (
                    <tr key={l.id} style={{ background: "var(--card)" }}>
                      <td className="px-4 py-3 font-medium truncate max-w-40">{l.bookTitle}</td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>—</td>
                      <td className="px-4 py-3 font-mono text-xs">{l.borrowedAt}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: l.status === "overdue" ? "#dc2626" : "var(--foreground)" }}>{l.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={l.status === "overdue" ? { background: "#fee2e2", color: "#991b1b" } : { background: "#dbeafe", color: "#1e40af" }}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: l.fine > 0 ? "#dc2626" : "var(--muted-foreground)" }}>
                        {l.fine > 0 ? `৳${l.fine}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "members" && (
        <div className="animate-fade-in">
          <div className="mb-4">
            <div className="relative max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)" }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                placeholder="Search members…" className="w-full pl-9 pr-4 py-2 rounded border text-sm outline-none"
                style={inputStyle} />
            </div>
          </div>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--muted)" }}>
                  {["Member", "Student ID", "Email", "Joined", "Borrows", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ background: "var(--card)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "white" }}>
                          {m.name.charAt(0)}
                        </div>
                        <span className="font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{m.studentId || "—"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{m.email}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{m.joinedAt}</td>
                    <td className="px-4 py-3 font-mono text-xs text-center">{m.borrowCount}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={m.active ? { background: "#d1fae5", color: "#065f46" } : { background: "#fee2e2", color: "#991b1b" }}>
                        {m.active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "books" && (
        <div className="animate-fade-in">
          <div className="space-y-3">
            {MOCK_BOOKS.slice(0, 8).map(b => (
              <div key={b.id} className="flex items-center gap-4 p-3 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <BookCover book={b} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{b.title}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{b.author} · {b.category}</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>ISBN: {b.isbn} · {b.shelf}, {b.rack}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium" style={{ color: b.availableCopies > 0 ? "#16a34a" : "#dc2626" }}>
                    {b.availableCopies}/{b.totalCopies}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>available</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedBookId(b.id); setView("book-detail"); }}
                    className="text-xs px-2.5 py-1.5 rounded border" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>View</button>
                  <button className="text-xs px-2.5 py-1.5 rounded" style={{ background: "var(--primary)", color: "white" }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "fines" && (
        <div className="animate-fade-in">
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--muted)" }}>
                  {["Member", "Book", "Fine Amount", "Status", "Action"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {MOCK_LOANS.filter(l => l.fine > 0).map(l => (
                  <tr key={l.id} style={{ background: "var(--card)" }}>
                    <td className="px-4 py-3 font-medium">Fatima Khanam</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{l.bookTitle}</td>
                    <td className="px-4 py-3 font-mono font-bold" style={{ color: "#dc2626" }}>৳{l.fine}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={l.finePaid ? { background: "#d1fae5", color: "#065f46" } : { background: "#fee2e2", color: "#991b1b" }}>
                        {l.finePaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!l.finePaid && (
                        <button onClick={() => showToast(`Fine of ৳${l.fine} marked as paid.`, "success")}
                          className="text-xs px-3 py-1.5 rounded font-medium" style={{ background: "#16a34a", color: "white" }}>
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-lg rounded-xl border shadow-2xl animate-fade-in" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold">Add New Book</h2>
              <button onClick={() => setShowAddBook(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Title</label>
                  <input required value={newBook.title} onChange={e => setNewBook(p => ({ ...p, title: e.target.value }))}
                    placeholder="Book title" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Author</label>
                  <input required value={newBook.author} onChange={e => setNewBook(p => ({ ...p, author: e.target.value }))}
                    placeholder="Author name" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">ISBN</label>
                  <input value={newBook.isbn} onChange={e => setNewBook(p => ({ ...p, isbn: e.target.value }))}
                    placeholder="978-XXXXXXXXXX" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <input value={newBook.category} onChange={e => setNewBook(p => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. Computer Science" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Copies</label>
                  <input type="number" min="1" value={newBook.copies} onChange={e => setNewBook(p => ({ ...p, copies: e.target.value }))}
                    className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddBook(false)}
                  className="flex-1 py-2.5 rounded border text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "white" }}>
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
