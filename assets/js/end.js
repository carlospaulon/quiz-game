import { sanitizePlayerName } from "./utils.js";

const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

username.addEventListener("input", () => {
  try {
    sanitizePlayerName(username.value);
    saveScoreBtn.disabled = false;
    username.classList.remove("error");
  } catch(error) {
    saveScoreBtn.disabled = true;
    username.classList.add("error");
    username.title = error.message;
  }
});

const saveHighScore = (e) => {
  e.preventDefault();

  try {
    const sanitizedName = sanitizePlayerName(username.value);

    const score = {
      score: mostRecentScore,
      name: sanitizedName,
    };

    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("../index.html");
  } catch (error) {
    alert(error.message);
  }
};

saveScoreBtn.addEventListener('click', saveHighScore)
