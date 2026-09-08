# LibraryMS — Online Library Management System

A full university library project: requirement analysis document, MongoDB database with 30,000+ books across 36 subject categories, an Express REST API with real login/auth, and a **fully responsive web app** — one app that works on your laptop and your phone, no separate mobile build needed.

## ✨ What the web app can do

- **Home** — live catalog stats, department browser, quick search
- **Browse & search** — filter by category, paginated results, colorful book covers, tap any book for full detail
- **Login / Register** — real accounts (Student or Librarian), JWT-secured, **email verification required**
- **Forgot / Reset password** — real email flow via Gmail SMTP
- **Real book cover images** — looked up automatically via the free Open Library API and cached, with a colorful initials-based cover as fallback for the (many) synthetically-generated catalog entries that don't match a real published book
- **Borrow / Return / Reserve** — borrow or reserve a book from its detail card, return it from My Loans, fines calculate automatically for late returns, reservation holders get emailed when a book becomes available
- **Ratings & recommendations** — rate a book you've returned; "You might also like" suggests similar titles
- **My Loans** — see everything you've borrowed, due dates, overdue warnings, outstanding fines
- **Librarian dashboard** (visible only to librarian/admin accounts):
  - Inventory & fines reports, with **CSV export**
  - Currently-borrowed table
  - Add a book, or **bulk import via CSV**
  - **Member directory with search** — click any member to see their full borrow history, current loans, and fines ("যে কোনো ছাত্র কী বই নিয়েছে" — answered directly)
  - **Analytics** — most-borrowed books, demand by department, top readers (bar charts)
  - **Activity log** — an audit trail of every add/edit/delete/deactivate action, who did it and when
- **Dark mode** toggle, **accessibility** (skip link, focus outlines, `aria-live` status regions, reduced-motion support)
- **Mobile-first** — bottom tab bar on phones, top nav on desktop, same single codebase, same server

## 🔒 Advanced features (all real, not stubs)

- **Two-factor authentication (2FA)** — TOTP-based, works with Google Authenticator/Authy; opt-in from the account settings (gear icon next to your name)
- **QR codes** — every book has a scannable QR on its detail page; librarians can scan it (Admin → Scan) to look a book up instantly at the desk
- **Multi-branch support** — books and members can belong to a branch (e.g. "Main Campus", "City Campus"), with a branch filter in Browse
- **Bangla/English toggle** — switch languages from the top bar; preference is remembered
- **PWA / installable** — has a manifest and service worker, so it can be "installed" to a phone's home screen; the app shell (UI) loads even with no connection, though book data always needs a live connection to the backend (there's no offline data cache — being upfront about that limit)
- **Smarter recommendations** — "You might also like" now uses real co-borrowing data ("students who borrowed this also borrowed…") when there's enough history, falling back to same-category matching for newer books
- **PDF exports** — catalog, fines, and inventory reports can be downloaded as PDF (in addition to CSV)
- **Automated tests** — `npm test` in `/backend` runs 14 unit tests (validators, CSV export, seed-data generator) using Node's built-in test runner, no extra dependency needed
- **Manual QA checklist** — see `TESTING.md` for everything that needs a human pass (live DB, real email, camera, screen readers)
- **Study room booking** — students can book an hourly slot in any study room from the Rooms tab; librarians manage the room list from Admin → Rooms
- **Book suggestions** — students can request a book that's missing from the catalog (My Loans → Suggest a book); librarians approve/reject from Admin → Suggestions
- **In-app notifications** — a bell icon with unread count shows updates (reservation ready, due-date reminders, fine notices, suggestion decisions)
- **Library announcements** — librarians can post notices that show as a banner on the home page (Admin → Announcements)
- **Ask a librarian** — a contact form (linked from the home page) that emails every active librarian at once
- **Fine cap** — borrowing is blocked once a student's unpaid fines reach ৳100, same policy most real university libraries enforce; librarians can mark fines as paid to lift the block
- **Report a lost book** — students can report a borrowed book lost from My Loans; this charges a flat replacement fee and pulls the copy out of circulation
- **Loan renewal** — one renewal allowed per loan, blocked automatically if someone else has reserved the book
- **New Arrivals & Trending shelves** — horizontally-scrolling rows on the home page, pulled from real data (most recently added books, most borrowed this week)

## 🔒 What's still not included

Being upfront about the remaining gap from the original wishlist:
- Offline **data** browsing (the PWA caches the app shell, not the book catalog itself)
- Deep learning / embedding-based recommendations (current one is collaborative co-borrow + category fallback, no trained ML model)
- Book cover lookups only succeed for titles that actually exist in Open Library — most of the 30,000+ synthetically-generated catalog entries will show the designed fallback cover instead of a real photo, which is expected given the scale needed for a course project


## 📁 What's in this project

```
LibraryMS/
├── docs/
│   ├── LibraryMS_Requirement_Analysis.docx   ← full requirement doc (15 sections)
│   └── build_doc.js                          ← regenerates the .docx above
├── backend/
│   ├── server.js                             ← Express app entry point
│   ├── render.yaml                           ← one-click Render deploy config
│   ├── config/
│   │   ├── db.js                             ← MongoDB connection
│   │   └── mailer.js                         ← Nodemailer (Gmail SMTP) + email templates
│   ├── models/                               ← Book, User, Transaction, Room, RoomBooking,
│   │                                            BookSuggestion, Notification, Announcement, AuditLog
│   ├── routes/                                ← one file per feature area: auth, books, users,
│   │                                            transactions, reports, rooms, suggestions,
│   │                                            notifications, announcements, contact
│   ├── middleware/                           ← JWT auth/role guards, centralized error handler
│   ├── utils/                                ← validators, CSV/PDF writers, audit logger,
│   │                                            notification helper, Open Library cover lookup
│   ├── scripts/
│   │   ├── seedBooks.js                      ← generates 30,000+ books into MongoDB
│   │   ├── seedRooms.js                      ← creates default study rooms
│   │   ├── sendReminders.js                  ← due-date & fine emails (run manually or schedule)
│   │   └── weeklyDigest.js                   ← new-arrivals/trending email digest
│   └── tests/                                ← 15 unit tests (`npm test`)
└── frontend/
    ├── index.html                            ← the whole app (all views live here)
    ├── app.js                                ← all app logic
    ├── style.css
    ├── i18n.js                               ← English/Bangla dictionary
    ├── manifest.json / service-worker.js     ← PWA install + offline app shell
    ├── icons/                                ← app icons for PWA install
    ├── verify.html                           ← landing page for the emailed verification link
    ├── reset-password.html                   ← landing page for the emailed reset link
    └── vercel.json                           ← one-click Vercel deploy config
```

## 🚀 How to run it

### 1. Install MongoDB

Two options:

**Option A — MongoDB Atlas (cloud, free, easiest):**
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account
2. Create a free (M0) cluster
3. Get your connection string (looks like `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/libraryms`)

**Option B — Local MongoDB:**
Install MongoDB Community Server on your machine: https://www.mongodb.com/try/download/community

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# edit .env and paste your MONGO_URI
```

**To enable real emails (verification, password reset, due-date reminders):**
1. Turn on 2-Step Verification on your Gmail account: https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords and create an app password for "Mail"
3. In `.env`, set:
   ```
   EMAIL_USER=youraddress@gmail.com
   EMAIL_PASS=<the 16-character app password, not your real Gmail password>
   APP_URL=http://localhost:3000
   ```
4. If you skip this, the app still works — it just logs a warning and skips sending the email instead of failing.

**About book cover images:** the app automatically looks up a real cover for each book via the free Open Library API the first time it's viewed, and caches the result so it's instant after that. Since most of the 30,000+ catalog entries are synthetically generated for course-project scale (not real published books), many won't have a real match — those fall back to a colorful cover with the book's initials, which is expected and by design, not a bug.

**To send due-date reminders and fine notices**, run this whenever you like (or schedule it — e.g. a free cron service like cron-job.org calling a small wrapper endpoint once a day):
```bash
node scripts/sendReminders.js
```

**To send the weekly new-arrivals/trending digest** to verified students:
```bash
node scripts/weeklyDigest.js
```

### Running tests

```bash
cd backend
npm test
```

Runs 15 unit tests covering input validation, CSV export, and the seed-data generator — no live database needed. For everything that does need a live database, real email, or a camera (2FA, QR scanning, borrow/return flows), see `TESTING.md` for a manual checklist to run through before a demo.

### 3. Install dependencies & seed the database

```bash
npm install
npm run seed
npm run seed:rooms
```

This inserts **30,000+ book records** across 36 categories, including dedicated CSE, BBA, EEE, Civil Engineering, Mechanical Engineering, Textile Engineering, and Bangla Literature departments, spread across two branches (Main Campus, City Campus) — takes 1–3 minutes. `seed:rooms` adds five default study rooms so the Rooms tab has something to book.

### 4. Start the backend

```bash
npm start
```

Server runs at `http://localhost:5000`.

### Online payment setup

Online bKash, Nagad, and Rocket payments require approved merchant or sandbox accounts from the providers. Add the issued credentials to `backend/.env`; never commit real secrets or paste them into chat.

```env
APP_URL=https://your-public-frontend-domain.com

BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_USERNAME=
BKASH_PASSWORD=
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

NAGAD_MERCHANT_ID=
NAGAD_PUBLIC_KEY=
NAGAD_PRIVATE_KEY=
NAGAD_BASE_URL=

ROCKET_MERCHANT_ID=
ROCKET_API_KEY=
ROCKET_BASE_URL=
```

`APP_URL` must be a public HTTPS URL because the provider redirects to `payment-callback.html`. Restart the backend with `npm start` after adding credentials. Without provider credentials, Cash and manual payment requests remain available.

### 5. Open the frontend

**On your computer:** just open `frontend/index.html` in a browser (double-click it, or serve it with any static server). It talks to `http://localhost:5000` by default.

**On your phone (or any other device):**
1. Make sure your phone and computer are on the **same Wi-Fi**.
2. Find your computer's local IP address:
   - Windows: `ipconfig` → look for "IPv4 Address" (e.g. `192.168.0.12`)
   - Mac/Linux: `ifconfig` or `ip a` → look for something like `192.168.0.12`
3. Serve the frontend folder instead of opening the file directly, so your phone can reach it too:
   ```bash
   cd frontend
   npx serve -l 3000
   ```
4. On your phone's browser, go to `http://<your-computer-ip>:3000` (e.g. `http://192.168.0.12:3000`).
5. In the app, tap the **"Server"** button (top right) and enter `http://<your-computer-ip>:5000` — this points the app at your backend over Wi-Fi. Tap **Save & test**.

That's it — the same app now works identically on your phone.

**Want it reachable from anywhere (not just home Wi-Fi)?** Deploy the backend to a free host like Render or Railway, and the frontend to Vercel or Netlify (or GitHub Pages) — then anyone can use it from any network, no IP juggling needed. Ask if you'd like help setting that up.

### 6. Create your first account

Open the app, tap **Log in → Register**, and create a Librarian account first (so you can add books and see the dashboard). Create a Student account separately to test borrowing.

## 🌍 Deploy it live (so it works from anywhere, not just your Wi-Fi)

Deployment config files (`render.yaml`, `vercel.json`) are already included — this takes about 10 minutes.

### Step 1 — Push the project to GitHub
1. Create a free GitHub account if you don't have one: https://github.com/signup
2. Create a new empty repository (e.g. `LibraryMS`)
3. Upload this whole folder to it (GitHub's web upload works fine, or use `git push` if you know Git)

### Step 2 — Set up MongoDB Atlas (if you haven't already)
1. https://www.mongodb.com/cloud/atlas/register → free account → create a free M0 cluster
2. Under "Database Access," create a database user with a password
3. Under "Network Access," add `0.0.0.0/0` (allow access from anywhere) so Render can connect
4. Copy your connection string (looks like `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/libraryms`)

### Step 3 — Deploy the backend on Render
1. https://render.com → sign up free → **New → Web Service**
2. Connect your GitHub repo, set **Root Directory** to `backend`
3. Render will detect `render.yaml` automatically — it sets build/start commands for you
4. When it asks for `MONGO_URI`, paste your Atlas connection string from Step 2
5. Deploy — you'll get a URL like `https://libraryms-backend.onrender.com`
6. Once it's live, run the seed scripts once from your own computer pointed at Atlas (`MONGO_URI=<atlas string> npm run seed && npm run seed:rooms`) to populate the 30,000+ books and default rooms — Render's free tier isn't meant for long one-off scripts

### Step 4 — Deploy the frontend on Vercel
1. https://vercel.com → sign up free → **Add New → Project**
2. Import the same GitHub repo, set **Root Directory** to `frontend`
3. Deploy — you'll get a URL like `https://libraryms.vercel.app`

### Step 5 — Connect them
Open your new Vercel URL, tap **Server** (top right), and enter your Render backend URL (`https://libraryms-backend.onrender.com`). Save.

That's it — your app now has a permanent link that works on any device, any network, even after your computer is off. Share the Vercel link with your instructor or classmates to demo it directly.

**Note:** Render's free tier "sleeps" after 15 minutes of no traffic and takes ~30 seconds to wake up on the next request — completely normal for a free-tier demo, not a bug.

## 📚 Book categories included (30 total)

Computer Science, Engineering, Mathematics, Physics, Chemistry, Biology, Business & Economics, Law, Medical & Pharmacy, English Literature, Bangla Literature, History, Philosophy, Religion & Theology, Psychology, Sociology, Political Science, Fiction, Science Fiction & Fantasy, Biography & Memoir, Self-Help, Art & Design, Architecture, Environmental Science, Journalism & Media, Poetry, Children's Books, Reference & Encyclopedia, Textbook, Thesis & Research Paper.

## 🔌 API Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create a Student or Librarian account (sends verification email) |
| POST | `/api/auth/login` | — | Log in, get a JWT |
| POST | `/api/auth/verify-email` | — | Verify email using the token from the emailed link |
| POST | `/api/auth/resend-verification` | — | Resend the verification email |
| POST | `/api/auth/forgot-password` | — | Request a password reset link by email |
| POST | `/api/auth/reset-password` | — | Set a new password using the emailed token |
| GET | `/api/auth/me` | Bearer token | Get current logged-in user |
| POST | `/api/auth/2fa/setup` | Logged in | Generate a 2FA secret + QR code |
| POST | `/api/auth/2fa/confirm` | Logged in | Confirm the 6-digit code and enable 2FA |
| POST | `/api/auth/2fa/disable` | Logged in | Turn off 2FA |
| GET | `/api/books/search?q=&category=&branch=&page=` | — | FR-01: Search books |
| GET | `/api/books/suggest?q=` | — | Search-as-you-type suggestions |
| GET | `/api/books/branches` | — | List all branches (multi-branch support) |
| GET | `/api/books/export/csv` | Librarian/Admin | Export the full catalog as CSV |
| GET | `/api/books/export/pdf` | Librarian/Admin | Export the full catalog as PDF |
| POST | `/api/books` | Librarian/Admin | FR-05: Add a book |
| POST | `/api/books/bulk-import` | Librarian/Admin | FR-12: Bulk import books from CSV |
| GET | `/api/books/:id/similar` | — | Recommendation: co-borrowed books, category fallback |
| GET | `/api/books/:id/qrcode` | — | QR code (PNG data URL) encoding the book's ID |
| GET | `/api/books/:id/cover` | — | Real cover image lookup (Open Library), cached |
| POST | `/api/books/covers/batch` | — | Batch cover lookup for a page of results |
| DELETE | `/api/books/:id` | Librarian/Admin | FR-05: Remove a book |
| POST | `/api/transactions/borrow` | Logged in | FR-02: Borrow a book |
| POST | `/api/transactions/return` | Logged in | FR-03: Return a book (emails next reservation holder) |
| POST | `/api/transactions/reserve` | Logged in | FR-10: Reserve an unavailable book |
| POST | `/api/transactions/reserve/:id/cancel` | Logged in | Cancel a reservation |
| POST | `/api/transactions/:id/renew` | Logged in | Renew a loan (once, if not reserved by someone else) |
| POST | `/api/transactions/:id/report-lost` | Logged in | Report a borrowed book lost (charges replacement fee) |
| PATCH | `/api/transactions/:id/mark-paid` | Librarian/Admin | Mark a fine as paid (clears the fine cap) |
| POST | `/api/transactions/:id/review` | Logged in | FR-11: Rate & review a returned book |
| GET | `/api/transactions/my-history` | Logged in | My Loans list (includes reservation queue position) |
| GET | `/api/users` | Librarian/Admin | FR-06: List/search members |
| GET | `/api/users/:id/detail` | Librarian/Admin | Full borrow history for one member |
| PATCH | `/api/users/:id/status` | Librarian/Admin | FR-06: Activate/deactivate a member |
| GET | `/api/users/me/profile` / PUT | Logged in | View/update your own profile |
| GET | `/api/reports/inventory` | Librarian/Admin | FR-07: Inventory report |
| GET | `/api/reports/borrowed` | Librarian/Admin | FR-07: Currently borrowed report |
| GET | `/api/reports/fines` | Librarian/Admin | FR-07: Fines report |
| GET | `/api/reports/fines/export` | Librarian/Admin | Export fines as CSV |
| GET | `/api/reports/fines/export-pdf` | Librarian/Admin | Export fines as PDF |
| GET | `/api/reports/inventory/export-pdf` | Librarian/Admin | Export inventory summary as PDF |
| GET | `/api/reports/analytics` | Librarian/Admin | Most-borrowed, category demand, top readers |
| GET | `/api/reports/audit-log` | Librarian/Admin | Activity trail of catalog/member changes |
| GET | `/api/reports/trending` | — | Most-borrowed books this week (home page) |
| GET | `/api/books/new-arrivals` | — | Most recently added books (home page) |
| GET / POST | `/api/rooms` | — / Librarian | List rooms / add a room |
| GET | `/api/rooms/:id/availability?date=` | — | Which hourly slots are free on a given date |
| POST | `/api/rooms/:id/book` | Logged in | Book an hourly study room slot |
| GET | `/api/rooms/bookings/mine` | Logged in | Your upcoming room bookings |
| POST | `/api/rooms/bookings/:id/cancel` | Logged in | Cancel a room booking |
| POST | `/api/suggestions` | Logged in | Suggest a book that's missing from the catalog |
| GET | `/api/suggestions/mine` | Logged in | Your own suggestions and their status |
| GET | `/api/suggestions?status=` | Librarian/Admin | All suggestions, optionally filtered |
| PATCH | `/api/suggestions/:id` | Librarian/Admin | Approve/reject a suggestion |
| GET | `/api/notifications` | Logged in | Your notifications + unread count |
| PATCH | `/api/notifications/:id/read` | Logged in | Mark one notification as read |
| POST | `/api/notifications/read-all` | Logged in | Mark all notifications as read |
| GET | `/api/announcements` | — | Active announcements (home page banner) |
| POST | `/api/announcements` | Librarian/Admin | Post a new announcement |
| GET | `/api/announcements/all` | Librarian/Admin | All announcements (including inactive) |
| DELETE | `/api/announcements/:id` | Librarian/Admin | Take an announcement down |
| POST | `/api/contact` | — | Ask a librarian — emails all active librarians |

Protected routes expect `Authorization: Bearer <token>` — the frontend handles this automatically once you're logged in.

## 📄 Included sample data

`sample_books_510.csv` — a 510-row sample export (17 books × 30 categories) so you can preview the data shape without running the full seed.
