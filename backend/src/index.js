import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { app, server } from "./lib/socket.js";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

// load .env preferring repo root (../.env relative to backend), fallback to backend/.env
const candidatePaths = [
  path.resolve(process.cwd(), "..", ".env"), // repo-root when npm runs from backend
  path.resolve(process.cwd(), ".env"), // backend/.env
];
let loadedPath = null;
for (const p of candidatePaths) {
  try {
    if (require("fs").existsSync(p)) {
      dotenv.config({ path: p });
      loadedPath = p;
      break;
    }
  } catch (e) {
    // ignore
  }
}
if (!loadedPath) {
  // fallback: try default dotenv lookup (current dir)
  dotenv.config();
  loadedPath = "(default)";
}
console.log(
  "Loaded environment from:",
  loadedPath,
  "NODE_ENV=",
  process.env.NODE_ENV
);

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const __dirname = path.resolve();

console.log(`FRONTEND_URL=${FRONTEND_URL}`);
console.log(`BACKEND_URL=${BACKEND_URL}`);

// security & performance middlewares
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json({ limit: "10mb" })); // to parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); //
app.use(cookieParser()); // to parse cookies from request headers
app.use(
  cors({
    origin: FRONTEND_URL, // frontend URL
    credentials: true, // allow cookies to be sent
  })
);

import rateLimit from "express-rate-limit";

// apply rate limiter to auth routes to mitigate brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/messages", messageRoutes);

// simple health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Serve index.html for any route using a regex to avoid path-to-regexp parsing issues in some environments (e.g., Render)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  });
