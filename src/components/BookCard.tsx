import type { Book } from "../lib/mockData";

interface Props {
  book: Book;
  onClick?: () => void;
  compact?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function BookCover({ book, size = "md" }: { book: Pick<Book, "title" | "author" | "coverColor">; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "w-12 h-16", md: "w-24 h-32", lg: "w-40 h-56" };
  const textSize = { sm: "text-[8px]", md: "text-xs", lg: "text-sm" };
  const initials = book.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <div className={`${dims[size]} rounded flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0`}
      style={{ background: book.coverColor }}>
      <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: "rgba(0,0,0,0.25)" }} />
      <span className="font-serif text-white/90 font-bold text-center px-1 leading-tight" style={{ fontSize: size === "sm" ? 10 : size === "lg" ? 18 : 13 }}>
        {initials}
      </span>
      <span className={`${textSize[size]} text-white/60 mt-1 text-center px-1 leading-tight`}>
        {book.author.split(",")[0].split(" ").slice(-1)[0]}
      </span>
    </div>
  );
}

export default function BookCard({ book, onClick, compact }: Props) {
  if (compact) {
    return (
      <button onClick={onClick} className="flex items-center gap-3 p-3 rounded border text-left transition-all hover:shadow-md group w-full"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <BookCover book={book} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors" style={{ color: "var(--foreground)" }}>
            {book.title}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{book.author}</p>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={book.rating} />
            <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>{book.rating}</span>
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${book.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {book.availableCopies > 0 ? `${book.availableCopies} avail.` : "Unavail."}
        </span>
      </button>
    );
  }

  return (
    <button onClick={onClick} className="flex flex-col rounded border overflow-hidden text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {/* Cover */}
      <div className="p-4 flex justify-center" style={{ background: "var(--muted)" }}>
        <BookCover book={book} size="md" />
      </div>
      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors" style={{ color: "var(--foreground)" }}>
          {book.title}
        </p>
        <p className="text-xs mt-1 truncate" style={{ color: "var(--muted-foreground)" }}>{book.author}</p>
        <div className="mt-2 flex items-center justify-between">
          <StarRating rating={book.rating} />
          <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>({book.reviewCount})</span>
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{book.category}</span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${book.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {book.availableCopies > 0 ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
    </button>
  );
}
