const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let avaliableQuestions = [];

let questions = [];

//Const
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

//fetch Open Trivia DB
fetch(
  "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple"
)
  .then((res) => {
    if (!res.ok) {
      if (res.status === 429) {
      throw new Error('Muitas requisições! Aguarde alguns segundos e tente novamente.');
    }
      if(res.status === 404) {
        throw new Error('API não encontrada')
      }
      throw new Error(`HTTP ERROR! status: ${res.status}`);
    } 
      
    return res.json();
  })
  .then((loadedQuestions) => {
    if (loadedQuestions.response_code !== 0) {
      throw new Error("Erro ao Carregar as questões!");
    }
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map((loadedQuestions) => {
      const formattedQuestion = {
        question: loadedQuestions.question,
      };

      const answerChoices = [...loadedQuestions.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestions.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((error) => {
    console.error("Erro: ", error);
    loader.classList.add("hidden");

    game.classList.remove("hidden");
    game.innerHTML = `
      <div class="error-container">
        <h2>Erro ao carregar o quiz</h2>
        <p>${error.message}</p>
        <button class="btn" onclick="window.location.reload()">Tentar Novamente</button>
      </div>
    `;
  });


//iniciar jogo
const startGame = () => {
  questionCounter = 0;
  score = 0;
  avaliableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

//pegar nova questão
const getNewQuestion = () => {
  //verifica quantidade de questões
  if (avaliableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("./end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //incrementando a barra de progresso
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  //pega questões randomicas pelo index
  const questionIndex = Math.floor(Math.random() * avaliableQuestions.length);
  currentQuestion = avaliableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  //pego as opções
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  //retiro a questão respondida
  avaliableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

//pegando a resposta do usuário e mostrando o feedback
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

//aumentando a pontuação
const incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
