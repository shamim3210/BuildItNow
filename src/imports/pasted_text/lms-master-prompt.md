হ্যাঁ। **১ম থেকে সবকিছু একসাথে** অন্য AI-কে দেওয়ার মতো করে চাইলে আগের prompt-টা আরও clean করে একটাই master prompt বানানো ভালো। নিচেরটা পুরোটা copy করে দাও।

I have an existing Library Management System (LMS) project. First, inspect the entire existing project, frontend, backend, database, APIs, authentication, UI and all existing features. Preserve all working functionality and improve/extend it without unnecessarily rewriting or breaking the current system.

Build it into a complete, modern, secure and realistic Library Management System.

## 1. User Roles & Authentication

Create three properly separated roles:

* Student/Member
* Librarian
* Admin

Students must never be able to become Librarians/Admin simply by changing a frontend role value.

Student registration should remain simple:

* Name
* Member/Student ID
* Gmail/Email
* Phone/recovery information
* Password

Librarian registration should use a simple configurable:

* Librarian ID / Staff Code / Library Code

The code should be configurable by Admin, so registration is easy but ordinary students cannot register as Librarian.

Admin accounts should be controlled securely.

Include:

* Register
* Login
* Logout
* Email verification
* Forgot Password
* Password reset through secure email/OTP
* Change Password
* Forgot Email/Gmail recovery
* Account activation/deactivation
* Profile management
* Secure authentication
* JWT/session management
* Role-based authorization

If a student forgets both Gmail and password:
Member ID → verification/OTP → show masked registered email → password reset.

Example:
a******@gmail.com

Never expose the complete email unnecessarily.

---

## 2. Large Book Database

The current project needs a much larger realistic book catalog.

Create approximately 50,000 books with proper seed/import architecture.

Include many categories:

* Computer Science
* Programming
* Artificial Intelligence
* Machine Learning
* Data Science
* Cyber Security
* Software Engineering
* Engineering
* Mathematics
* Physics
* Chemistry
* Biology
* Medical
* Business
* Economics
* Accounting
* Finance
* Management
* Marketing
* Law
* Psychology
* Sociology
* History
* Geography
* Literature
* English
* Religion
* Islamic Studies
* Philosophy
* Architecture
* Art & Design
* Self Development
* Fiction
* Non-fiction
* Novels
* Children
* Academic
* Research
* Exam Preparation
* General Knowledge
* and other useful categories.

Every book should contain:

* Title
* Author
* ISBN
* Publisher
* Publication year
* Edition
* Category
* Subcategory
* Description
* Language
* Cover image
* Total copies
* Available copies
* Borrowed copies
* Rating
* Review count
* Shelf/rack location
* Book status
* QR code/barcode

Do NOT load all 50,000 books into the browser at once.

Use:

* Pagination
* Lazy loading/infinite scrolling where suitable
* Database indexing
* Optimized queries
* Search optimization

---

## 3. Home Page

Create a professional library homepage.

Show:

* Search bar
* Categories
* Featured Books
* New Arrivals
* Popular Books
* Trending Books
* Highest Rated Books
* Most Borrowed Books
* Recently Added Books
* Recommended Books
* Recently Viewed Books

Students should immediately be able to discover books.

---

## 4. Student/Member Features

Students can:

* Browse books
* Search books
* Advanced filter
* Sort books
* View book details
* Check availability
* Find shelf/rack location
* Borrow books
* Return books
* Renew books
* Reserve unavailable books
* Cancel reservation
* See reservation queue position
* Add/remove wishlist
* Rate books
* Write reviews
* Edit/delete their own reviews
* View borrowing history
* View current borrowed books
* View due dates
* View overdue books
* View fines
* Pay fines
* View payment history
* Receive notifications
* See announcements
* See new books
* See popular books
* See recommended books
* See similar books
* View reading statistics
* Set reading goals
* Manage profile
* Change password
* Recover account

---

## 5. Borrow, Return & Renewal System

Create a realistic circulation system.

Support:

* Borrow
* Return
* Renew
* Due date
* Overdue detection
* Automatic fine calculation
* Borrowing limits
* Renewal limits
* Reservation queue
* Automatic copy availability updates
* Borrow confirmation
* Return confirmation
* Renewal confirmation
* Overdue status

Prevent users from bypassing borrowing rules through frontend manipulation.

All important validation must happen on the backend.

---

## 6. Fine Management

Implement:

* Automatic overdue fine
* Configurable fine per day
* Fine status
* Unpaid fine
* Paid fine
* Partial payment if appropriate
* Payment history
* Fine receipt
* Librarian fine management
* Admin fine settings

Admin should be able to configure borrowing and fine rules.

---

## 7. Payment System

Support:

### Cash Payment

Librarian can record:

* Cash payment
* Amount
* Transaction/reference ID
* Payment date
* Librarian who received payment

### Online Payment Ready Architecture

Create a secure architecture that can later integrate payment gateways.

Never store:

* Card numbers
* CVV
* Payment passwords
* Other sensitive payment credentials

Students should see:

* Fine amount
* Payment status
* Payment history
* Receipt

---

## 8. QR Code / Barcode

Implement QR/barcode for every book/copy.

Features:

* Generate QR/barcode
* Display on book details
* Scan/search book
* Quick book identification
* Quick borrow workflow
* Quick return workflow
* Librarian scanning system

---

## 9. Shelf/Rack Management

Create complete physical location management:

Library
→ Building
→ Floor
→ Room
→ Section
→ Rack
→ Shelf

Example:

Computer Science Section
Rack A3
Shelf 02

Students should see the exact location of books.

Librarians can add/edit/manage locations.

---

## 10. Advanced Search

Search by:

* Title
* Author
* ISBN
* Publisher
* Category
* Subcategory
* Publication year
* Language
* Rating
* Availability
* Shelf/rack

Sorting:

* Newest
* Oldest
* Most borrowed
* Highest rated
* Most reviewed
* Recently added
* Alphabetical

---

## 11. Notification System

Create a proper notification center.

Notifications for:

* Due tomorrow
* Overdue
* Fine generated
* Reservation available
* Book borrowed
* Book returned
* Renewal successful
* Renewal rejected
* Payment successful
* New books
* Library announcements

Include:

* Read/unread
* Mark as read
* Notification history

---

## 12. Recommendation System

Create a simple intelligent recommendation system using:

* Borrowing history
* Wishlist
* Ratings
* Categories
* Authors
* Popularity

Show:

* Recommended for You
* Similar Books
* Because You Read...
* Trending Books
* Popular in Your Category

Do not make it unnecessarily complicated. A practical content-based recommendation system is sufficient.

---

## 13. Review & Rating System

Students can rate and review books.

Include:

* 1–5 star rating
* Written review
* Edit own review
* Delete own review
* Review history
* Average rating
* Review count

Preferably only students who have borrowed/read a book can review it.

Prevent duplicate or fake reviews.

---

## 14. Librarian Dashboard

Librarian must have a different dashboard from Students.

Librarian can:

* Add books
* Edit books
* Manage book copies
* Manage categories
* Manage authors
* Manage publishers
* Manage shelves/racks
* Issue books
* Return books
* Renew books
* Manage reservations
* Manage fines
* Record cash payments
* Scan QR/barcodes
* Manage members
* Send notifications
* Generate reports
* View borrowing statistics

Librarian must NOT automatically have every Admin permission.

---

## 15. Admin Dashboard

Admin has complete system control.

Include:

* Dashboard
* Student management
* Librarian management
* Role/permission management
* Book management
* Copy management
* Category management
* Author management
* Publisher management
* Shelf/rack management
* Fine settings
* Borrowing rules
* Reservation settings
* Notification management
* Reports
* Analytics
* Audit logs
* System settings

---

## 16. Analytics & Reports

Dashboard should show:

* Total books
* Total copies
* Available copies
* Borrowed books
* Returned books
* Overdue books
* Total students
* Active students
* Total librarians
* Reservations
* Total fines
* Paid fines
* Unpaid fines
* Monthly borrowing
* Monthly returns
* Monthly fines
* Popular categories
* Most borrowed books
* Highest-rated books
* Most active members

Add charts and useful statistics.

Allow:

* PDF export
* CSV/Excel export

---

## 17. Audit Log

Track important actions:

* Login
* Logout
* Failed login
* Book added
* Book edited
* Book deleted
* Borrow
* Return
* Renewal
* Reservation
* Fine modification
* Payment
* User activation/deactivation
* Role changes
* Admin actions
* Librarian actions

Record:

* User
* Action
* Date/time
* Relevant object
* Result/status

---

# 18. Strong Security & Protection

Security is extremely important.

Implement:

* Server-side Role-Based Access Control
* Server-side authorization for every protected API
* Secure password hashing using bcrypt/Argon2
* JWT access/refresh token security
* Secure logout
* Token/session revocation
* Email verification
* Secure password-reset tokens
* Reset-token expiry
* One-time reset tokens
* OTP expiry
* OTP attempt limit
* OTP resend cooldown
* Brute-force protection
* Temporary account lockout
* API rate limiting
* Login rate limiting
* Input validation
* Input sanitization
* SQL/NoSQL injection protection
* XSS protection
* CSRF protection where applicable
* Secure CORS
* Secure HTTP headers
* Protected file uploads
* File type and file size validation
* No sensitive information in logs
* No passwords/tokens/OTP stored in plain text
* No card/payment credentials stored
* Secrets in environment variables
* Never expose `.env`
* Proper production error handling
* No database stack traces exposed to users
* Database backup-friendly architecture

Most importantly:

A user must NEVER be able to become Admin/Librarian by changing frontend requests such as:

role = "admin"

Backend must always verify the actual authenticated user's role and permissions.

Also validate:

* Book ownership
* Borrowing permission
* Fine status
* Payment status
* Reservation ownership
* Review ownership
* Renewal eligibility
* Book availability

on the server.

---

## 19. Account Protection

Implement:

* Account activation/deactivation
* Failed login tracking
* Temporary lockout
* Password strength requirements
* Password change
* Password reset
* Email verification
* Recovery email
* Recovery phone/OTP
* Active session management where practical

Students should have an easy recovery flow, while Admin/Librarian accounts should have stronger verification.

---

## 20. UI/UX

Make the UI modern, clean, professional and responsive.

Support:

* Desktop
* Tablet
* Mobile
* Dark mode
* Light mode
* Bangla/English language toggle

Use:

* Loading states
* Skeleton loaders where useful
* Empty states
* Error states
* Success messages
* Confirmation dialogs
* Toast notifications
* Proper form validation
* Responsive tables
* Responsive cards
* Clean navigation
* Accessible buttons/forms

---

## 21. Book Details Page

Every book page should display:

* Cover
* Title
* Author
* Description
* ISBN
* Publisher
* Edition
* Publication year
* Language
* Category
* Rating
* Reviews
* Total copies
* Available copies
* Borrowed copies
* Shelf/rack location
* QR/barcode
* Borrow button
* Renew option when applicable
* Reserve button
* Wishlist button
* Similar books

---

## 22. Additional Professional Features

Add other realistic features where useful:

* Recently viewed books
* Reading goals
* Favorite categories
* Library announcements
* FAQ
* Help/Contact
* Library rules
* Opening hours
* Lost book status
* Damaged book status
* Missing book status
* Book copy management
* Acquisition/new-book management
* Reservation queue
* Automatic availability update
* Member statistics
* Librarian activity statistics
* Admin activity statistics

Do not add unnecessary gimmicky features. Prioritize features that make sense for a real library.

---

## 23. Database & Backend Quality

Maintain a clean normalized database structure.

Use appropriate relationships for:

* Users
* Roles
* Books
* Book copies
* Authors
* Publishers
* Categories
* Shelves
* Borrow records
* Return records
* Renewal records
* Reservations
* Wishlist
* Reviews
* Ratings
* Fines
* Payments
* Notifications
* Audit logs

Add indexes for frequently searched fields.

Use transactions for critical operations such as:

* Borrow
* Return
* Renewal
* Payment
* Reservation

Prevent:

* Duplicate borrowing
* Invalid return
* Duplicate payment records
* Negative available copies
* Invalid renewals
* Unauthorized access

---

## 24. Testing

Test the complete system.

At minimum test:

### Authentication

* Register
* Login
* Logout
* Forgot password
* Forgot email
* OTP
* Email verification
* Wrong password
* Locked account

### Student

* Search
* Borrow
* Return
* Renew
* Reserve
* Wishlist
* Review
* Fine
* Payment
* Notifications

### Librarian

* Book management
* Copy management
* Borrow/return
* Renewal
* Fine
* Cash payment
* Member management

### Admin

* User management
* Librarian management
* Permissions
* Reports
* Settings
* Audit logs

### Security

Try unauthorized API requests and confirm that users cannot bypass permissions.

---

## 25. Performance

Because the system contains approximately 50,000 books:

* Use pagination
* Database indexing
* Efficient queries
* Search optimization
* Lazy loading
* Image optimization
* API pagination
* Avoid unnecessary database queries
* Avoid loading all books simultaneously
* Cache suitable frequently accessed data where appropriate

The application must remain fast and usable.

---

## 26. Documentation

Prepare complete project documentation including:

* Introduction
* Problem Statement
* Objectives
* Scope
* Functional Requirements
* Non-functional Requirements
* System Architecture
* Technology Stack
* Database Design
* ER Diagram
* Use Case Diagram
* DFD
* Activity Diagram
* Sequence Diagram
* Class Diagram
* API documentation
* Security design
* Testing
* Test cases
* Screenshots
* Limitations
* Future improvements
* Conclusion

---

## 27. Final Implementation Rules

IMPORTANT:

1. Inspect my existing project before changing anything.
2. Preserve all working features.
3. Do not unnecessarily rewrite the entire project.
4. Do not create duplicate functionality.
5. Fix existing bugs you find.
6. Keep frontend, backend and database synchronized.
7. Update migrations/schema correctly.
8. Seed/import approximately 50,000 realistic books.
9. Make the large book database performant.
10. Implement all authentication and authorization securely.
11. Never trust frontend role values.
12. Never expose secrets.
13. Never store sensitive payment information.
14. Do not remove existing useful features.
15. Keep the UI professional and easy to use.
16. Test all major workflows after implementation.
17. If a requested feature already exists, improve it instead of duplicating it.
18. If an existing implementation conflicts with security or data integrity, safely refactor it.
19. Keep the project runnable after every major change.
20. Do not use fake buttons or non-functional UI. Every visible feature should actually work.

## FINAL USER FLOW

Student:

Register → Verify → Login → Browse 50,000+ Books → Search/Filter → View Book → Find Shelf → Borrow → Renew → Return → Fine → Cash/Online Payment → Review → Wishlist → Reserve → Notifications → Recommendations → Reading History → Account Recovery if needed.

Librarian:

Register with Staff/Library Code → Login → Dashboard → Manage Books/Copies → Manage Shelves → Scan QR/Barcode → Borrow → Return → Renew → Reservations → Fines → Cash Payments → Members → Notifications → Reports.

Admin:

Secure Login → Dashboard → Manage Students → Manage Librarians → Manage Roles/Permissions → Books → Copies → Categories → Shelves → Borrowing Rules → Fine Rules → Payments → Notifications → Reports → Analytics → Audit Logs → System Settings.

The final result should look and behave like a real-world professional Library Management System rather than a basic CRUD/demo project.
