
        // --- DOM Elements ---
        const startScreen = document.getElementById('start-screen');
        const quizScreen = document.getElementById('quiz-screen');
        const endScreen = document.getElementById('end-screen');
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        const progressEl = document.getElementById('progress');
        const scoreEl = document.getElementById('score');
        const questionEl = document.getElementById('question');
        const optionsContainer = document.getElementById('options-container');
        const finalScoreEl = document.getElementById('final-score');
        const startErrorEl = document.getElementById('start-error');

        // --- API Configuration ---
        const API_URL = 'http://localhost:8080/api/questions';

        // --- Quiz State ---
        let score = 0;
        let currentQuestionIndex = 0;
        let questions = []; // This will hold questions fetched from the API
        let allCapitals = []; // To generate incorrect options
        const TOTAL_QUESTIONS = 10;

        // --- Event Listeners ---
        startBtn.addEventListener('click', startGame);
        restartBtn.addEventListener('click', startGame);
        
        /**
         * Initializes the quiz, fetches questions from the API, and starts the game.
         */
        async function startGame() {
            startBtn.disabled = true;
            startBtn.textContent = 'Loading...';
            startErrorEl.style.display = 'none';

            try {
                // Fetch questions from the backend API
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                questions = await response.json();
                allCapitals = questions.map(q => q.capital);

                // Reset state
                score = 0;
                currentQuestionIndex = 0;
                scoreEl.textContent = `Score: ${score}`;

                // Switch screens
                startScreen.classList.add('d-none');
                endScreen.classList.add('d-none');
                quizScreen.classList.remove('d-none');

                displayQuestion();

            } catch (error) {
                console.error('Failed to fetch questions:', error);
                startErrorEl.style.display = 'block'; // Show error message
            } finally {
                // Re-enable the start button
                startBtn.disabled = false;
                startBtn.textContent = 'Start Quiz';
            }
        }

        /**
         * Displays the current question and its options.
         */
        function displayQuestion() {
            optionsContainer.innerHTML = '';

            if (currentQuestionIndex >= TOTAL_QUESTIONS) {
                endGame();
                return;
            }

            progressEl.textContent = `Question ${currentQuestionIndex + 1}/${TOTAL_QUESTIONS}`;
            const currentQuestion = questions[currentQuestionIndex];
            const correctAnswer = currentQuestion.capital;
            questionEl.textContent = `What is the capital of ${currentQuestion.country}?`;

            // Generate 3 incorrect answers from the list of all capitals
            const incorrectAnswers = allCapitals.filter(c => c !== correctAnswer);
            shuffleArray(incorrectAnswers);
            const options = incorrectAnswers.slice(0, 3);
            options.push(correctAnswer);

            shuffleArray(options);

            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('btn', 'btn-light', 'border', 'option-btn');
                button.addEventListener('click', () => selectAnswer(button, option, correctAnswer));
                optionsContainer.appendChild(button);
            });
        }
        
        /**
         * Handles the user's answer selection.
         */
        function selectAnswer(selectedButton, selectedAnswer, correctAnswer) {
            const optionButtons = optionsContainer.querySelectorAll('.option-btn');
            optionButtons.forEach(btn => btn.disabled = true);
            
            if (selectedAnswer === correctAnswer) {
                score++;
                scoreEl.textContent = `Score: ${score}`;
                selectedButton.classList.add('correct');
            } else {
                selectedButton.classList.add('incorrect');
                optionButtons.forEach(btn => {
                    if (btn.textContent === correctAnswer) {
                        btn.classList.add('correct');
                    }
                });
            }
            
            selectedButton.classList.add('feedback-animation');

            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion();
            }, 1200);
        }

        /**
         * Ends the quiz and displays the final score.
         */
        function endGame() {
            finalScoreEl.textContent = score;
            quizScreen.classList.add('d-none');
            endScreen.classList.remove('d-none');
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
   