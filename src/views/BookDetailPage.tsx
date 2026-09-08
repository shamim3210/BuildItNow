import { useState } from "react";
import { MOCK_BOOKS, type Book, type User } from "../lib/mockData";
import { BookCover } from "../components/BookCard";
import { borrowBook, reserveBook } from "../lib/api";
import type { View } from "../App";

interface Props {
  bookId: string;
  user: User | null;
  setView: (v: View) => void;
  setSelectedBookId: (id: string) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

const MOCK_REVIEWS = [
  { id: "r1", userId: "u1", userName: "Arif Rahman", rating: 5, comment: "Excellent book! Changed the way I write code. Every programmer should read this.", createdAt: "2024-01-15" },
  { id: "r2", userId: "u2", userName: "Fatima Khanam", rating: 4, comment: "Very insightful and practical. Some examples feel dated but the principles are timeless.", createdAt: "2023-12-20" },
  { id: "r3", userId: "u5", userName: "Rahim Uddin", rating: 5, comment: "One of the best software engineering books I have ever read. Highly recommended!", createdAt: "2023-11-08" },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function BookDetailPage({ bookId, user, setView, setSelectedBookId, showToast }: Props) {
  const book = MOCK_BOOKS.find(b => b.id === bookId) || MOCK_BOOKS[0];
  const similar = MOCK_BOOKS.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);
  const [loading, setLoading] = useState<"borrow" | "reserve" | "wishlist" | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "location">("details");

  async function handleBorrow() {
    if (!user) { setView("auth"); return; }
    setLoading("borrow");
    try {
      await borrowBook(book.id);
      showToast(`"${book.title}" borrowed successfully! Due in 14 days.`, "success");
    } catch { showToast("Could not borrow. Check your account status.", "error"); }
    finally { setLoading(null); }
  }

  async function handleReserve() {
    if (!user) { setView("auth"); return; }
    setLoading("reserve");
    try {
      await reserveBook(book.id);
      showToast(`"${book.title}" reserved. You are #3 in queue.`, "success");
    } catch { showToast("Could not reserve. Try again later.", "error"); }
    finally { setLoading(null); }
  }

  function handleWishlist() {
    if (!user) { setView("auth"); return; }
    setWishlisted(!wishlisted);
    showToast(wishlisted ? "Removed from wishlist." : "Added to wishlist!", "info");
  }

  const availPct = Math.round((book.availableCopies / book.totalCopies) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" style={{ color: "var(--foreground)" }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
        <button onClick={() => setView("home")} className="hover:underline">Home</button>
        <span>/</span>
        <button onClick={() => setView("browse")} className="hover:underline">Browse</button>
        <span>/</span>
        <span className="truncate max-w-xs" style={{ color: "var(--foreground)" }}>{book.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Cover + Actions */}
        <div className="lg:col-span-1">
          <div className="rounded-xl p-8 flex justify-center border" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <BookCover book={book} size="lg" />
          </div>
          {/* Availability bar */}
          <div className="mt-4 p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "var(--muted-foreground)" }}>Availability</span>
              <span className="font-mono font-medium" style={{ color: book.availableCopies > 0 ? "#16a34a" : "#dc2626" }}>
                {book.availableCopies}/{book.totalCopies} copies
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "var(--muted)" }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${availPct}%`, background: availPct > 30 ? "#16a34a" : availPct > 10 ? "#d97706" : "#dc2626" }} />
            </div>
            <p className="text-xs mt-1.5" style={{ color: "var(--muted-foreground)" }}>
              {book.borrowedCopies} currently borrowed
            </p>
          </div>
          {/* Action buttons */}
          <div className="mt-4 space-y-2">
            {book.availableCopies > 0 ? (
              <button onClick={handleBorrow} disabled={loading === "borrow"}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                {loading === "borrow" ? "Processing…" : "Borrow This Book"}
              </button>
            ) : (
              <button onClick={handleReserve} disabled={loading === "reserve"}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: "var(--accent)", color: "white" }}>
                {loading === "reserve" ? "Reserving…" : "Reserve (Join Queue)"}
              </button>
            )}
            <button onClick={handleWishlist}
              className="w-full py-2.5 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2"
              style={wishlisted ? { background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" } : { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlisted ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>
          {/* QR code placeholder */}
          <div className="mt-4 p-4 rounded-lg border text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="w-24 h-24 mx-auto rounded border flex items-center justify-center" style={{ borderColor: "var(--border)" }}>
              <div className="grid grid-cols-5 gap-0.5 w-16 h-16">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="rounded-sm" style={{ background: (i * 7 + i * i) % 3 === 0 ? "var(--foreground)" : "transparent" }} />
                ))}
              </div>
            </div>
            <p className="text-[10px] mt-2 font-mono" style={{ color: "var(--muted-foreground)" }}>ISBN: {book.isbn}</p>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--accent)" }}>{book.category}</span>
              <h1 className="font-serif text-3xl mt-2 leading-tight">{book.title}</h1>
              <p className="text-lg mt-1" style={{ color: "var(--muted-foreground)" }}>{book.author}</p>
            </div>
          </div>

          {/* Rating summary */}
          <div className="flex items-center gap-4 mt-4 p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-center">
              <p className="font-mono text-3xl font-bold" style={{ color: "var(--accent)" }}>{book.rating}</p>
              <StarRow rating={Math.round(book.rating)} />
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{book.reviewCount} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-xs w-2 font-mono" style={{ color: "var(--muted-foreground)" }}>{s}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${[68, 20, 8, 3, 1][5 - s]}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mt-6" style={{ borderColor: "var(--border)" }}>
            {(["details", "reviews", "location"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors"
                style={activeTab === t ? { borderColor: "var(--primary)", color: "var(--primary)" } : { borderColor: "transparent", color: "var(--muted-foreground)" }}>
                {t}
              </button>
            ))}
          </div>

          {activeTab === "details" && (
            <div className="mt-5 animate-fade-in">
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{book.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Publisher", book.publisher],
                  ["Year", book.year.toString()],
                  ["Edition", book.edition],
                  ["Language", book.language],
                  ["ISBN", book.isbn],
                  ["Status", book.status],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-lg border" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--muted-foreground)" }}>{k}</p>
                    <p className="text-sm font-medium font-mono capitalize" style={{ color: "var(--foreground)" }}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {book.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs border" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>#{t}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="mt-5 space-y-4 animate-fade-in">
              {MOCK_REVIEWS.map(r => (
                <div key={r.id} className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "white" }}>
                        {r.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.userName}</p>
                        <StarRow rating={r.rating} />
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r.createdAt}</span>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: "var(--foreground)" }}>{r.comment}</p>
                </div>
              ))}
              {user && (
                <div className="p-4 rounded-lg border" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                  <p className="text-sm font-medium mb-2">Write a Review</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>You can review this book after borrowing and returning it.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "location" && (
            <div className="mt-5 animate-fade-in">
              <div className="p-5 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <h3 className="font-medium mb-4">Physical Location</h3>
                <div className="space-y-3">
                  {[
                    ["Floor", book.floor],
                    ["Room / Section", book.room],
                    ["Rack", book.rack],
                    ["Shelf", book.shelf],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                      <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                      <span className="text-sm font-mono font-semibold" style={{ color: "var(--foreground)" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded" style={{ background: "var(--muted)" }}>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Full path: Library → Main Building → {book.floor} → {book.room} → {book.rack} → Shelf {book.shelf}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Books */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl mb-4">Similar Books in {book.category}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similar.map(b => (
              <button key={b.id} onClick={() => setSelectedBookId(b.id)}
                className="flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:shadow-md"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <BookCover book={b} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold line-clamp-2" style={{ color: "var(--foreground)" }}>{b.title}</p>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{b.author.split(",")[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
