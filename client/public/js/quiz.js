console.log("✅ quiz.js loaded");

// --- DOM Elements ---
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const finalScoreEl = document.getElementById("final-score");
const startErrorEl = document.getElementById("start-error");

// --- API Configuration ---
const QUIZ_API_URL = "/api/quiz/random";

// --- Quiz State ---
let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let allCapitals = [];
let allCountries = [];
let allCurrencies = [];
const TOTAL_QUESTIONS = 10;

// Available question types
const QUESTION_TYPES = [
  "COUNTRY_TO_CAPITAL",   // What is the capital of India?
  "CAPITAL_TO_COUNTRY",   // Which country has capital New Delhi?
  "COUNTRY_TO_CURRENCY",  // What is the currency of India?
  "CURRENCY_TO_COUNTRY",  // Which country's currency is Rupee?
  "CAPITAL_TO_CURRENCY",  // What is the currency of the country whose capital is New Delhi?
];

// Map for currency usage count (within this quiz dataset)
let currencyCountMap = {};

// --- Event Listeners ---
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

/**
 * Helper to fetch one random question from backend
 */
async function fetchRandomQuestion() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No auth token found. Please log in first.");
  }

  const response = await fetch(QUIZ_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Not authorized. Please log in again.");
    }
    throw new Error("Failed to fetch question from server.");
  }

  const data = await response.json();
  return data; // { id, country, capital, currency }
}

/**
 * Initializes the quiz, fetches questions, and starts the game.
 */
async function startGame() {
  startBtn.disabled = true;
  startBtn.textContent = "Loading...";
  startErrorEl.style.display = "none";

  try {
    questions = [];
    allCapitals = [];
    allCountries = [];
    allCurrencies = [];
    currencyCountMap = {};

    score = 0;
    currentQuestionIndex = 0;
    scoreEl.textContent = `Score: ${score}`;

    // Fetch unique questions until TOTAL_QUESTIONS is reached
    while (questions.length < TOTAL_QUESTIONS) {
      const q = await fetchRandomQuestion();
      const alreadyExists = questions.some((item) => item.id === q.id);
      if (!alreadyExists) {
        questions.push(q);
      }
    }

    // Build unique lists for options
    allCapitals = [...new Set(questions.map((q) => q.capital))];
    allCountries = [...new Set(questions.map((q) => q.country))];
    allCurrencies = [...new Set(questions.map((q) => q.currency))];

    // Build currency usage count map (within this quiz dataset)
    questions.forEach((q) => {
      if (!currencyCountMap[q.currency]) {
        currencyCountMap[q.currency] = 0;
      }
      currencyCountMap[q.currency]++;
    });

    startScreen.classList.add("d-none");
    endScreen.classList.add("d-none");
    quizScreen.classList.remove("d-none");

    displayQuestion();
  } catch (error) {
    console.error("Failed to start game:", error);
    startErrorEl.textContent =
      error.message || "Could not connect to the server. Please try again.";
    startErrorEl.style.display = "block";
  } finally {
    startBtn.disabled = false;
    startBtn.textContent = "Start Quiz";
  }
}

/**
 * Returns a random question type from the list,
 * but avoids CURRENCY_TO_COUNTRY if currency is shared by multiple countries.
 */
function getRandomQuestionType(question) {
  const possibleTypes = [...QUESTION_TYPES];

  // If this currency is used by more than one country in the quiz data,
  // remove CURRENCY_TO_COUNTRY to avoid multiple correct answers.
  if (currencyCountMap[question.currency] > 1) {
    const idx = possibleTypes.indexOf("CURRENCY_TO_COUNTRY");
    if (idx !== -1) {
      possibleTypes.splice(idx, 1);
    }
  }

  const randomIndex = Math.floor(Math.random() * (possibleTypes.length));
  return possibleTypes[randomIndex];
}

/**
 * Based on question type, build:
 * - question text
 * - correct answer
 * - 4 options (1 correct + 3 incorrect)
 */
function buildQuestionConfig(question, type) {
  let questionText;
  let correctAnswer;
  let pool = [];

  switch (type) {
    case "COUNTRY_TO_CAPITAL":
      questionText = `What is the capital of ${question.country}?`;
      correctAnswer = question.capital;
      pool = allCapitals;
      break;

    case "CAPITAL_TO_COUNTRY":
      questionText = `Which country has the capital ${question.capital}?`;
      correctAnswer = question.country;
      pool = allCountries;
      break;

    case "COUNTRY_TO_CURRENCY":
      questionText = `What is the currency of ${question.country}?`;
      correctAnswer = question.currency;
      pool = allCurrencies;
      break;

    case "CURRENCY_TO_COUNTRY":
      questionText = `Which country's currency is ${question.currency}?`;
      correctAnswer = question.country;
      pool = allCountries;
      break;

    case "CAPITAL_TO_CURRENCY":
      questionText = `What is the currency of the country whose capital is ${question.capital}?`;
      correctAnswer = question.currency;
      pool = allCurrencies;
      break;

    default:
      // Fallback to country -> capital
      questionText = `What is the capital of ${question.country}?`;
      correctAnswer = question.capital;
      pool = allCapitals;
  }

  // Build options: 1 correct + 3 random incorrect from pool
  const incorrectAnswers = pool.filter(
    (item) => item && item !== correctAnswer
  );

  shuffleArray(incorrectAnswers);

  const options = incorrectAnswers.slice(0, 3);
  options.push(correctAnswer);
  shuffleArray(options);

  return { questionText, correctAnswer, options };
}

/**
 * Displays the current question and its options.
 */
function displayQuestion() {
  optionsContainer.innerHTML = "";

  if (currentQuestionIndex >= TOTAL_QUESTIONS) {
    endGame();
    return;
  }

  progressEl.textContent = `Question ${
    currentQuestionIndex + 1
  }/${TOTAL_QUESTIONS}`;

  const currentQuestion = questions[currentQuestionIndex];

  // Pick a random valid type for this question
  const type = getRandomQuestionType(currentQuestion);
  const { questionText, correctAnswer, options } = buildQuestionConfig(
    currentQuestion,
    type
  );

  questionEl.textContent = questionText;

  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("btn", "btn-light", "border", "option-btn");
    button.addEventListener("click", () =>
      selectAnswer(button, option, correctAnswer)
    );
    optionsContainer.appendChild(button);
  });
}

/**
 * Handles the user's answer selection.
 */
function selectAnswer(selectedButton, selectedAnswer, correctAnswer) {
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => (btn.disabled = true));

  if (selectedAnswer === correctAnswer) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    selectedButton.classList.add("correct");
  } else {
    selectedButton.classList.add("incorrect");
    optionButtons.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }

  // your animation class
  selectedButton.classList.add("feedback-animation");

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 1600);
}

/**
 * Ends the quiz and displays the final score.
 */
function endGame() {
  // Redirect to final page with score + total questions
  window.location.href = `/final?score=${score}&total=${TOTAL_QUESTIONS}`;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
