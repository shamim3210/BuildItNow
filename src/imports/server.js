require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { run: runReminders } = require("./scripts/sendReminders");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const allowedOrigins = (process.env.APP_ORIGIN || "http://localhost:3000").split(",").map((origin) => origin.trim()).filter(Boolean);
const allowLocalFileOrigin = process.env.NODE_ENV !== "production";
app.use(cors({
  origin: (origin, callback) => {
    const isLocalDevOrigin = allowLocalFileOrigin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
    if (!origin || allowedOrigins.includes(origin) || (allowLocalFileOrigin && origin === "null") || isLocalDevOrigin) return callback(null, true);
    return callback(new Error("Origin is not allowed."));
  },
}));
app.use(express.json({ limit: "4mb" })); // raised for base64 book cover uploads

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
});
app.use("/api", apiLimiter);

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === "change_this_secret_key")) {
  throw new Error("JWT_SECRET must be a strong secret of at least 32 characters in production.");
}

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "📚 LibraryMS API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);

// 404 for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// Centralized error handler — must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Keep due-date notifications current in local and hosted deployments.
const REMINDER_INTERVAL = 24 * 60 * 60 * 1000;
setTimeout(() => runReminders().catch((err) => console.error("Reminder job failed:", err.message)), 15000);
setInterval(() => runReminders().catch((err) => console.error("Reminder job failed:", err.message)), REMINDER_INTERVAL);
