import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { app, server } from "./lib/socket.js";
dotenv.config();
// console.log(process.env.PORT);

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // to parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); //
app.use(cookieParser()); // to parse cookies from request headers
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies to be sent
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

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
