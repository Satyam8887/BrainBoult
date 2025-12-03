import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import finalRoutes from "./routes/finalRoutes.js";   // ✅ import router
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { logger } from "./middleware/loggerMiddleware.js";

dotenv.config();

const app = express();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "client", "views"));
app.use(express.static(path.join(__dirname, "..", "client", "public")));

// Pages
app.get("/", (req, res) => {
  res.render("welcome");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Final page router (handles /final)
app.use("/", finalRoutes);          // ✅ finalRoutes has router.get("/final", ...)

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
