// /routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @body    { username, email, password }
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & return JWT
 * @body    { email, password }
 */
router.post("/login", login);

export default router;
