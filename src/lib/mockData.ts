export type Role = "student" | "librarian" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  phone?: string;
  avatar?: string;
  verified: boolean;
  active: boolean;
  joinedAt: string;
  borrowCount: number;
  activeFines: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  edition: string;
  category: string;
  subcategory: string;
  description: string;
  language: string;
  coverColor: string;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  rating: number;
  reviewCount: number;
  shelf: string;
  rack: string;
  floor: string;
  room: string;
  status: "available" | "unavailable" | "lost" | "damaged";
  tags: string[];
  addedAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  coverColor: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  renewed: boolean;
  status: "active" | "returned" | "overdue" | "lost";
  fine: number;
  finePaid: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const CATEGORIES = [
  "Computer Science", "Programming", "Artificial Intelligence", "Machine Learning",
  "Data Science", "Cyber Security", "Software Engineering", "Engineering",
  "Mathematics", "Physics", "Chemistry", "Biology", "Medical", "Business",
  "Economics", "Accounting", "Finance", "Management", "Marketing", "Law",
  "Psychology", "Sociology", "History", "Geography", "Literature", "English",
  "Religion", "Islamic Studies", "Philosophy", "Architecture", "Art & Design",
  "Self Development", "Fiction", "Non-fiction", "Novels", "Children",
  "Academic", "Research", "Exam Preparation", "General Knowledge"
];

const COVER_COLORS = [
  "#1a2744", "#8b3a3a", "#2d5a2d", "#4a2d8b", "#8b6914", "#1e5c7a",
  "#7a3d1e", "#3d6b6b", "#6b3d6b", "#1e4a1e", "#5c1e1e", "#1e3d5c",
  "#8b7355", "#4a6b1e", "#6b1e4a", "#1e6b4a", "#7a5c1e", "#3a3a8b"
];

function randomColor() { return COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)]; }

export const MOCK_BOOKS: Book[] = [
  {
    id: "b1", title: "Clean Code: A Handbook of Agile Software Craftsmanship", author: "Robert C. Martin",
    isbn: "978-0132350884", publisher: "Prentice Hall", year: 2008, edition: "1st",
    category: "Software Engineering", subcategory: "Best Practices",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
    language: "English", coverColor: "#1a2744", totalCopies: 8, availableCopies: 3, borrowedCopies: 5,
    rating: 4.7, reviewCount: 234, shelf: "A-2", rack: "Rack 3", floor: "2nd Floor", room: "CS Section",
    status: "available", tags: ["programming", "software", "best-practices"], addedAt: "2023-01-15"
  },
  {
    id: "b2", title: "The Pragmatic Programmer: Your Journey to Mastery", author: "David Thomas, Andrew Hunt",
    isbn: "978-0135957059", publisher: "Addison-Wesley", year: 2019, edition: "20th Anniversary",
    category: "Programming", subcategory: "Professional Development",
    description: "One of the most influential books in software development. Packed with practical advice to help you become a better programmer.",
    language: "English", coverColor: "#8b3a3a", totalCopies: 6, availableCopies: 2, borrowedCopies: 4,
    rating: 4.8, reviewCount: 189, shelf: "B-1", rack: "Rack 1", floor: "2nd Floor", room: "CS Section",
    status: "available", tags: ["programming", "career", "software"], addedAt: "2023-03-22"
  },
  {
    id: "b3", title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein",
    isbn: "978-0262033848", publisher: "MIT Press", year: 2022, edition: "4th",
    category: "Computer Science", subcategory: "Algorithms",
    description: "The definitive reference for algorithms. Covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
    language: "English", coverColor: "#2d5a2d", totalCopies: 12, availableCopies: 0, borrowedCopies: 12,
    rating: 4.5, reviewCount: 412, shelf: "A-1", rack: "Rack 2", floor: "2nd Floor", room: "CS Section",
    status: "unavailable", tags: ["algorithms", "data-structures", "computer-science"], addedAt: "2022-11-10"
  },
  {
    id: "b4", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig",
    isbn: "978-0134610993", publisher: "Pearson", year: 2020, edition: "4th",
    category: "Artificial Intelligence", subcategory: "Foundations",
    description: "The leading textbook in Artificial Intelligence. Used in over 1400 universities in 128 countries. Comprehensive coverage of AI concepts.",
    language: "English", coverColor: "#4a2d8b", totalCopies: 10, availableCopies: 4, borrowedCopies: 6,
    rating: 4.6, reviewCount: 321, shelf: "C-3", rack: "Rack 1", floor: "3rd Floor", room: "AI Section",
    status: "available", tags: ["ai", "machine-learning", "algorithms"], addedAt: "2023-05-18"
  },
  {
    id: "b5", title: "Deep Learning", author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    isbn: "978-0262035613", publisher: "MIT Press", year: 2016, edition: "1st",
    category: "Machine Learning", subcategory: "Neural Networks",
    description: "An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep learning techniques used in industry, and research perspectives.",
    language: "English", coverColor: "#8b6914", totalCopies: 7, availableCopies: 1, borrowedCopies: 6,
    rating: 4.7, reviewCount: 276, shelf: "C-4", rack: "Rack 2", floor: "3rd Floor", room: "AI Section",
    status: "available", tags: ["deep-learning", "neural-networks", "ai"], addedAt: "2023-02-14"
  },
  {
    id: "b6", title: "Data Science for Business", author: "Foster Provost, Tom Fawcett",
    isbn: "978-1449361327", publisher: "O'Reilly Media", year: 2013, edition: "1st",
    category: "Data Science", subcategory: "Applied Data Science",
    description: "Written by renowned data science experts, this guide explains the fundamental principles of data science and walks through the data-analytic thinking necessary for extracting useful knowledge.",
    language: "English", coverColor: "#1e5c7a", totalCopies: 9, availableCopies: 5, borrowedCopies: 4,
    rating: 4.4, reviewCount: 198, shelf: "D-1", rack: "Rack 1", floor: "2nd Floor", room: "Data Lab",
    status: "available", tags: ["data-science", "business", "analytics"], addedAt: "2023-04-07"
  },
  {
    id: "b7", title: "The Art of War", author: "Sun Tzu",
    isbn: "978-1590302255", publisher: "Shambhala", year: 2005, edition: "Translation",
    category: "Philosophy", subcategory: "Military Strategy",
    description: "An ancient Chinese military treatise dating from the Late Spring and Autumn Period. One of the most influential strategy texts in history.",
    language: "English", coverColor: "#7a3d1e", totalCopies: 15, availableCopies: 11, borrowedCopies: 4,
    rating: 4.3, reviewCount: 567, shelf: "H-5", rack: "Rack 8", floor: "1st Floor", room: "Philosophy",
    status: "available", tags: ["philosophy", "strategy", "classics"], addedAt: "2022-08-20"
  },
  {
    id: "b8", title: "Thinking, Fast and Slow", author: "Daniel Kahneman",
    isbn: "978-0374533557", publisher: "Farrar, Straus and Giroux", year: 2011, edition: "1st",
    category: "Psychology", subcategory: "Cognitive Psychology",
    description: "In this work, Kahneman examines the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.",
    language: "English", coverColor: "#3d6b6b", totalCopies: 11, availableCopies: 6, borrowedCopies: 5,
    rating: 4.6, reviewCount: 489, shelf: "G-2", rack: "Rack 4", floor: "1st Floor", room: "Psychology",
    status: "available", tags: ["psychology", "behavioral-economics", "cognition"], addedAt: "2023-01-30"
  },
  {
    id: "b9", title: "Atomic Habits", author: "James Clear",
    isbn: "978-0735211292", publisher: "Avery", year: 2018, edition: "1st",
    category: "Self Development", subcategory: "Productivity",
    description: "An easy and proven way to build good habits and break bad ones. Tiny Changes, Remarkable Results.",
    language: "English", coverColor: "#6b3d6b", totalCopies: 20, availableCopies: 7, borrowedCopies: 13,
    rating: 4.8, reviewCount: 892, shelf: "I-1", rack: "Rack 1", floor: "1st Floor", room: "Self-Help",
    status: "available", tags: ["habits", "productivity", "self-improvement"], addedAt: "2023-06-12"
  },
  {
    id: "b10", title: "Principles of Economics", author: "N. Gregory Mankiw",
    isbn: "978-0538453059", publisher: "Cengage Learning", year: 2020, edition: "8th",
    category: "Economics", subcategory: "Macroeconomics",
    description: "The world's best-selling economics textbook. Provides the essential concepts needed for understanding the economics of today.",
    language: "English", coverColor: "#1e4a1e", totalCopies: 18, availableCopies: 9, borrowedCopies: 9,
    rating: 4.2, reviewCount: 334, shelf: "E-1", rack: "Rack 2", floor: "3rd Floor", room: "Business",
    status: "available", tags: ["economics", "textbook", "academic"], addedAt: "2022-12-05"
  },
  {
    id: "b11", title: "The Great Gatsby", author: "F. Scott Fitzgerald",
    isbn: "978-0743273565", publisher: "Scribner", year: 1925, edition: "Reprint",
    category: "Fiction", subcategory: "American Literature",
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island.",
    language: "English", coverColor: "#5c1e1e", totalCopies: 12, availableCopies: 8, borrowedCopies: 4,
    rating: 4.1, reviewCount: 1204, shelf: "L-3", rack: "Rack 5", floor: "1st Floor", room: "Literature",
    status: "available", tags: ["fiction", "classic", "american-lit"], addedAt: "2022-09-14"
  },
  {
    id: "b12", title: "Cybersecurity Essentials", author: "Charles Brooks",
    isbn: "978-0789759337", publisher: "Pearson IT Certification", year: 2018, edition: "1st",
    category: "Cyber Security", subcategory: "Network Security",
    description: "A comprehensive introduction to cybersecurity, covering the skills needed to identify threats, vulnerabilities, and risks.",
    language: "English", coverColor: "#1e3d5c", totalCopies: 8, availableCopies: 3, borrowedCopies: 5,
    rating: 4.3, reviewCount: 145, shelf: "A-5", rack: "Rack 6", floor: "2nd Floor", room: "CS Section",
    status: "available", tags: ["cybersecurity", "networking", "security"], addedAt: "2023-07-22"
  }
];

export const MOCK_USERS: User[] = [
  {
    id: "u1", name: "Arif Rahman", email: "arif@student.edu", role: "student",
    studentId: "CS-2021-001", phone: "+880 1711-234567",
    verified: true, active: true, joinedAt: "2021-09-01",
    borrowCount: 23, activeFines: 0
  },
  {
    id: "u2", name: "Fatima Khanam", email: "fatima@student.edu", role: "student",
    studentId: "BBA-2022-045", phone: "+880 1812-345678",
    verified: true, active: true, joinedAt: "2022-09-01",
    borrowCount: 11, activeFines: 50
  },
  {
    id: "u3", name: "Mizanur Hossain", email: "mizan@librarian.edu", role: "librarian",
    verified: true, active: true, joinedAt: "2020-01-15",
    borrowCount: 0, activeFines: 0
  },
  {
    id: "u4", name: "Admin User", email: "admin@library.edu", role: "admin",
    verified: true, active: true, joinedAt: "2019-06-01",
    borrowCount: 0, activeFines: 0
  }
];

export const MOCK_LOANS: Loan[] = [
  {
    id: "l1", bookId: "b1", bookTitle: "Clean Code", bookAuthor: "Robert C. Martin",
    coverColor: "#1a2744", borrowedAt: "2024-01-10", dueDate: "2024-01-31",
    renewed: false, status: "active", fine: 0, finePaid: false
  },
  {
    id: "l2", bookId: "b9", bookTitle: "Atomic Habits", bookAuthor: "James Clear",
    coverColor: "#6b3d6b", borrowedAt: "2024-01-05", dueDate: "2024-01-20",
    renewed: false, status: "overdue", fine: 150, finePaid: false
  },
  {
    id: "l3", bookId: "b8", bookTitle: "Thinking, Fast and Slow", bookAuthor: "Daniel Kahneman",
    coverColor: "#3d6b6b", borrowedAt: "2023-12-15", dueDate: "2024-01-05", returnedAt: "2024-01-04",
    renewed: false, status: "returned", fine: 0, finePaid: false
  },
  {
    id: "l4", bookId: "b4", bookTitle: "Artificial Intelligence: A Modern Approach", bookAuthor: "Stuart Russell",
    coverColor: "#4a2d8b", borrowedAt: "2023-11-20", dueDate: "2023-12-10", returnedAt: "2023-12-09",
    renewed: true, status: "returned", fine: 0, finePaid: false
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1", title: "Book Due Tomorrow",
    message: "\"Clean Code\" is due tomorrow (Jan 31). Please return or renew before the due date.",
    type: "warning", read: false, createdAt: "2024-01-30T09:00:00"
  },
  {
    id: "n2", title: "Overdue Fine Generated",
    message: "A fine of ৳150 has been generated for \"Atomic Habits\". Please pay at the library counter.",
    type: "error", read: false, createdAt: "2024-01-21T08:00:00"
  },
  {
    id: "n3", title: "Reservation Available",
    message: "\"Introduction to Algorithms\" that you reserved is now available. Pick it up within 3 days.",
    type: "success", read: true, createdAt: "2024-01-18T14:30:00"
  },
  {
    id: "n4", title: "New Arrivals This Week",
    message: "23 new books added this week including titles in AI, Data Science, and Fiction.",
    type: "info", read: true, createdAt: "2024-01-15T10:00:00"
  }
];

export const STATS = {
  totalBooks: 30247,
  totalCopies: 89430,
  availableCopies: 61823,
  borrowedBooks: 27607,
  totalStudents: 4821,
  activeStudents: 2134,
  totalLibrarians: 12,
  pendingReservations: 234,
  totalFinesUnpaid: 28650,
  totalFinesPaid: 142300,
  overdueBooks: 1203,
  monthlyBorrows: 3240,
  monthlyReturns: 2987
};

export const RECENT_ACTIVITY = [
  { id: 1, user: "Arif Rahman", action: "Borrowed", book: "Clean Code", time: "2 min ago" },
  { id: 2, user: "Fatima Khanam", action: "Returned", book: "Atomic Habits", time: "15 min ago" },
  { id: 3, user: "Rahim Uddin", action: "Reserved", book: "Introduction to Algorithms", time: "32 min ago" },
  { id: 4, user: "Nusrat Jahan", action: "Renewed", book: "Deep Learning", time: "1 hr ago" },
  { id: 5, user: "Kabir Hossain", action: "Borrowed", book: "The Pragmatic Programmer", time: "2 hr ago" },
];

export const AUDIT_LOG = [
  { id: 1, user: "admin@library.edu", role: "Admin", action: "User deactivated", target: "rogue.user@student.edu", result: "Success", time: "2024-01-30 11:23:14" },
  { id: 2, user: "mizan@librarian.edu", role: "Librarian", action: "Book added", target: "Clean Architecture (ISBN 978-0134494166)", result: "Success", time: "2024-01-30 09:45:22" },
  { id: 3, user: "mizan@librarian.edu", role: "Librarian", action: "Fine marked paid", target: "Fatima Khanam — ৳150", result: "Success", time: "2024-01-29 14:12:08" },
  { id: 4, user: "arif@student.edu", role: "Student", action: "Login failed", target: "Wrong password (attempt 2)", result: "Failed", time: "2024-01-29 08:00:31" },
  { id: 5, user: "admin@library.edu", role: "Admin", action: "Fine settings updated", target: "Per-day fine: ৳10 → ৳15", result: "Success", time: "2024-01-28 16:34:50" },
];
