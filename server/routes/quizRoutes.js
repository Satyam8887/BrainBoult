// /routes/quizRoutes.js
import express from "express";
import {
  getRandomQuizQuestion,
  checkAnswer,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/quiz/random
 * @desc    Get a random country–capital question
 * @access  Protected (JWT)
 */
router.get("/random", protect, getRandomQuizQuestion);

/**
 * @route   POST /api/quiz/check
 * @desc    Check user answer for a question
 * @body    { country, userCapital }
 * @access  Protected (JWT)
 */
router.post("/check", protect, checkAnswer);

export default router;
