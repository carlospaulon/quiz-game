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


//fetch das questões pelo arquivo JSON
fetch("../assets/data/questions.json")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    startGame();
  })
  .catch((err) => {
    console.log(err);
  });




//Const
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 4;

//iniciar jogo
startGame = () => {
  questionCounter = 0;
  score = 0;
  avaliableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

//pegar nova questão
getNewQuestion = () => {
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
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
