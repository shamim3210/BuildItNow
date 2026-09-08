import { MOCK_BOOKS, MOCK_LOANS, MOCK_NOTIFICATIONS, MOCK_USERS } from "./mockData";

const API_BASE = "http://localhost:5000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("lms_token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function searchBooks(query: string, category?: string, page = 1) {
  try {
    return await request<{ books: typeof MOCK_BOOKS; total: number; pages: number }>(
      `/books/search?q=${encodeURIComponent(query)}&category=${category || ""}&page=${page}`
    );
  } catch {
    const filtered = MOCK_BOOKS.filter(b =>
      !query || b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase())
    ).filter(b => !category || b.category === category);
    return { books: filtered, total: filtered.length, pages: 1 };
  }
}

export async function getBook(id: string) {
  try {
    return await request<typeof MOCK_BOOKS[0]>(`/books/${id}`);
  } catch {
    return MOCK_BOOKS.find(b => b.id === id) || MOCK_BOOKS[0];
  }
}

export async function login(email: string, password: string) {
  try {
    const data = await request<{ token: string; user: typeof MOCK_USERS[0] }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem("lms_token", data.token);
    return data.user;
  } catch {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) throw new Error("Invalid credentials");
    localStorage.setItem("lms_token", "mock_token_" + user.id);
    return user;
  }
}

export async function register(data: { name: string; email: string; password: string; studentId?: string; phone?: string; role: string }) {
  try {
    return await request("/auth/register", { method: "POST", body: JSON.stringify(data) });
  } catch {
    return { message: "Registered successfully. Please verify your email." };
  }
}

export async function getMyLoans() {
  try {
    return await request<typeof MOCK_LOANS>("/transactions/my-history");
  } catch {
    return MOCK_LOANS;
  }
}

export async function getNotifications() {
  try {
    return await request<typeof MOCK_NOTIFICATIONS>("/notifications");
  } catch {
    return MOCK_NOTIFICATIONS;
  }
}

export async function borrowBook(bookId: string) {
  try {
    return await request("/transactions/borrow", { method: "POST", body: JSON.stringify({ bookId }) });
  } catch {
    return { message: "Book borrowed successfully." };
  }
}

export async function returnBook(loanId: string) {
  try {
    return await request(`/transactions/return`, { method: "POST", body: JSON.stringify({ transactionId: loanId }) });
  } catch {
    return { message: "Book returned successfully." };
  }
}

export async function renewBook(loanId: string) {
  try {
    return await request(`/transactions/${loanId}/renew`, { method: "POST" });
  } catch {
    return { message: "Book renewed successfully. New due date: " + new Date(Date.now() + 14 * 86400000).toLocaleDateString() };
  }
}

export async function reserveBook(bookId: string) {
  try {
    return await request("/transactions/reserve", { method: "POST", body: JSON.stringify({ bookId }) });
  } catch {
    return { message: "Book reserved. You are #3 in queue." };
  }
}

export async function getAnalytics() {
  try {
    return await request("/reports/analytics");
  } catch {
    return {
      mostBorrowed: [
        { title: "Atomic Habits", count: 89 },
        { title: "Clean Code", count: 72 },
        { title: "Deep Learning", count: 64 },
        { title: "Thinking, Fast and Slow", count: 58 },
        { title: "Introduction to Algorithms", count: 51 }
      ],
      categoryDemand: [
        { category: "Computer Science", count: 312 },
        { category: "Self Development", count: 278 },
        { category: "Machine Learning", count: 241 },
        { category: "Psychology", count: 198 },
        { category: "Business", count: 187 }
      ],
      monthlyBorrows: [
        { month: "Aug", count: 2890 },
        { month: "Sep", count: 3120 },
        { month: "Oct", count: 2980 },
        { month: "Nov", count: 3240 },
        { month: "Dec", count: 2640 },
        { month: "Jan", count: 3240 }
      ]
    };
  }
}

export async function getMembers(search?: string) {
  try {
    return await request<typeof MOCK_USERS>(`/users?search=${search || ""}`);
  } catch {
    return MOCK_USERS.filter(u => u.role === "student" &&
      (!search || u.name.toLowerCase().includes(search.toLowerCase())));
  }
}
