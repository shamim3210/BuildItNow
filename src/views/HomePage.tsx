import { useState } from "react";
import { MOCK_BOOKS, CATEGORIES, STATS, type Book } from "../lib/mockData";
import BookCard from "../components/BookCard";
import type { View } from "../App";

interface Props {
  setView: (v: View) => void;
  setSelectedBookId: (id: string) => void;
  setBrowseCategory: (c: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Computer Science": "💻", "Programming": "⌨️", "Artificial Intelligence": "🤖",
  "Machine Learning": "🧠", "Data Science": "📊", "Cyber Security": "🔐",
  "Mathematics": "📐", "Physics": "⚛️", "Chemistry": "🧪", "Biology": "🌿",
  "Medical": "🩺", "Business": "💼", "Economics": "📈", "Law": "⚖️",
  "Psychology": "🧘", "History": "🏛️", "Literature": "📜", "Fiction": "✨",
  "Self Development": "🌱", "Philosophy": "🦉", "Religion": "☮️",
  "Engineering": "⚙️", "Art & Design": "🎨", "Children": "🧸",
};

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <span className="font-mono text-2xl font-bold" style={{ color }}>{value}</span>
      <span className="text-xs mt-1 text-center" style={{ color: "var(--muted-foreground)" }}>{label}</span>
    </div>
  );
}

function BookShelf({ title, books, onBook, accent }: { title: string; books: Book[]; onBook: (id: string) => void; accent?: boolean }) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-xl" style={{ color: accent ? "var(--accent)" : "var(--foreground)" }}>{title}</h2>
        <button className="text-xs font-medium hover:underline" style={{ color: "var(--accent)" }}>View all →</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {books.map(b => <BookCard key={b.id} book={b} onClick={() => onBook(b.id)} />)}
      </div>
    </section>
  );
}

export default function HomePage({ setView, setSelectedBookId, setBrowseCategory }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setView("browse");
  }

  function openBook(id: string) {
    setSelectedBookId(id);
    setView("book-detail");
  }

  const featured = MOCK_BOOKS.slice(0, 6);
  const newArrivals = MOCK_BOOKS.slice(6, 12);
  const popular = [...MOCK_BOOKS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
  const topRated = [...MOCK_BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div style={{ color: "var(--foreground)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,1) 60px, rgba(255,255,255,1) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,1) 60px, rgba(255,255,255,1) 61px)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>University Digital Library</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight">
              Discover Your Next<br />
              <span style={{ color: "var(--accent)" }}>Great Read</span>
            </h1>
            <p className="mt-4 text-white/60 text-base max-w-lg">
              Access over 30,000 books across 36 categories. Borrow, reserve, and manage your reading from anywhere.
            </p>
            {/* Search */}
            <form onSubmit={handleSearch} className="mt-6 flex gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, ISBN, category…"
                  className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }} />
              </div>
              <button type="submit" className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
                style={{ background: "var(--accent)", color: "white" }}>
                Search
              </button>
            </form>
            {/* Quick category pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["Computer Science", "Machine Learning", "Business", "Fiction", "Psychology", "Mathematics"].map(c => (
                <button key={c} onClick={() => { setBrowseCategory(c); setView("browse"); }}
                  className="text-xs px-3 py-1 rounded-full border transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "var(--secondary)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
            {[
              [STATS.totalBooks.toLocaleString(), "Total Books"],
              [STATS.availableCopies.toLocaleString(), "Available Now"],
              [STATS.totalStudents.toLocaleString(), "Members"],
              [STATS.monthlyBorrows.toLocaleString(), "Borrowed/Month"],
              [CATEGORIES.length.toString(), "Categories"],
              ["2", "Campus Branches"]
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-mono text-base font-bold" style={{ color: "var(--primary)" }}>{v}</p>
                <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Categories */}
        <section className="mt-10">
          <h2 className="font-serif text-xl mb-4" style={{ color: "var(--foreground)" }}>Browse by Category</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {CATEGORIES.slice(0, 20).map(cat => (
              <button key={cat} onClick={() => { setBrowseCategory(cat); setView("browse"); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <span className="text-2xl">{CATEGORY_ICONS[cat] || "📚"}</span>
                <span className="text-[10px] font-medium leading-tight" style={{ color: "var(--foreground)" }}>{cat}</span>
              </button>
            ))}
          </div>
        </section>

        <BookShelf title="Featured Books" books={featured} onBook={openBook} accent />
        <BookShelf title="New Arrivals" books={newArrivals} onBook={openBook} />
        <BookShelf title="Most Popular" books={popular} onBook={openBook} accent />
        <BookShelf title="Highest Rated" books={topRated} onBook={openBook} />

        {/* Announcement banner */}
        <div className="mt-12 rounded-xl p-6 flex items-start gap-4" style={{ background: "var(--primary)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">Library Closed — Public Holiday</h3>
            <p className="text-sm text-white/60 mt-1">The library will be closed on February 21 (International Mother Language Day). Digital borrowing remains active.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
