import { useState, useEffect } from "react";
import { MOCK_BOOKS, CATEGORIES, type Book } from "../lib/mockData";
import BookCard from "../components/BookCard";
import type { View } from "../App";

interface Props {
  setView: (v: View) => void;
  setSelectedBookId: (id: string) => void;
  initialCategory?: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "title", label: "A → Z" },
  { value: "available", label: "Available First" },
];

export default function BrowsePage({ setView, setSelectedBookId, initialCategory }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory || "");
  const [sort, setSort] = useState("newest");
  const [availability, setAvailability] = useState<"all" | "available" | "unavailable">("all");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const PER_PAGE = 24;

  useEffect(() => { setPage(1); }, [query, category, sort, availability]);

  const filtered = MOCK_BOOKS
    .filter(b => !query || b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()) || b.isbn.includes(query))
    .filter(b => !category || b.category === category)
    .filter(b => availability === "all" || (availability === "available" ? b.availableCopies > 0 : b.availableCopies === 0));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "popular") return b.reviewCount - a.reviewCount;
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "available") return b.availableCopies - a.availableCopies;
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function openBook(id: string) {
    setSelectedBookId(id);
    setView("book-detail");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" style={{ color: "var(--foreground)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl">Browse Books</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Showing {sorted.length.toLocaleString()} books{category ? ` in ${category}` : ""}
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-20 space-y-5">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Category</h3>
              <div className="space-y-0.5 max-h-80 overflow-y-auto">
                <button onClick={() => setCategory("")}
                  className="w-full text-left px-2 py-1.5 rounded text-sm transition-colors"
                  style={{ background: category === "" ? "var(--primary)" : "transparent", color: category === "" ? "var(--primary-foreground)" : "var(--foreground)" }}>
                  All Categories
                </button>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className="w-full text-left px-2 py-1.5 rounded text-sm transition-colors"
                    style={{ background: category === c ? "var(--primary)" : "transparent", color: category === c ? "var(--primary-foreground)" : "var(--foreground)" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Availability</h3>
              {(["all", "available", "unavailable"] as const).map(a => (
                <button key={a} onClick={() => setAvailability(a)}
                  className="w-full text-left px-2 py-1.5 rounded text-sm transition-colors capitalize"
                  style={{ background: availability === a ? "var(--primary)" : "transparent", color: availability === a ? "var(--primary-foreground)" : "var(--foreground)" }}>
                  {a === "all" ? "All Books" : a === "available" ? "Available Now" : "Currently Out"}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Search + sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)" }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search title, author, ISBN…"
                className="w-full pl-9 pr-4 py-2 rounded border text-sm outline-none"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-3 py-2 rounded border text-sm outline-none"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {/* Mobile filter toggle */}
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded border text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filters
            </button>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="lg:hidden mb-4 p-4 rounded-lg border animate-fade-in" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCategory("")}
                  className="px-3 py-1 rounded-full text-xs border font-medium"
                  style={category === "" ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                  All
                </button>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className="px-3 py-1 rounded-full text-xs border font-medium"
                    style={category === c ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {(category || availability !== "all") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "var(--primary)", color: "white" }}>
                  {category}
                  <button onClick={() => setCategory("")} className="opacity-70 hover:opacity-100">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </span>
              )}
              {availability !== "all" && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "var(--accent)", color: "white" }}>
                  {availability === "available" ? "Available" : "Unavailable"}
                  <button onClick={() => setAvailability("all")} className="opacity-70 hover:opacity-100">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {paged.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📚</div>
              <p className="font-medium" style={{ color: "var(--foreground)" }}>No books found</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {paged.map(b => <BookCard key={b.id} book={b} onClick={() => openBook(b.id)} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-30 transition-colors hover:bg-muted"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>← Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1 : Math.max(1, page - 2) + i;
                if (p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className="w-8 h-8 rounded border text-sm font-medium transition-colors"
                    style={page === p ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "var(--border)", color: "var(--foreground)" }}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-30 transition-colors hover:bg-muted"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
