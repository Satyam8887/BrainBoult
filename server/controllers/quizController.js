// /controllers/quizController.js
import { getRandomQuestion, getQuestionByCountry } from "../models/questionModel.js";

export const getRandomQuizQuestion = async (req, res, next) => {
  try {
    const question = await getRandomQuestion();

    if (!question) {
      return res.status(404).json({ message: "No questions found" });
    }

    // question already has { id, country, capital, currency }
    res.json(question);
  } catch (err) {
    next(err);
  }
};


export const checkAnswer = async (req, res, next) => {
  try {
    const { country, userCapital } = req.body;

    if (!country || !userCapital) {
      return res
        .status(400)
        .json({ message: "country and userCapital required" });
    }

    const question = await getQuestionByCountry(country);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // question.capital is actually capital_name from DB (aliased)
    const isCorrect =
      question.capital.toLowerCase().trim() ===
      userCapital.toLowerCase().trim();

    res.json({
      correct: isCorrect,
      correctCapital: question.capital,
    });
  } catch (err) {
    next(err);
  }
};