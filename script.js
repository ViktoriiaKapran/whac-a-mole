const moles = document.querySelectorAll(".mole");
const scoreEl = document.querySelector(".score span");
let score = 0;
const booms = document.querySelectorAll(".boom");
const button = document.querySelector(".button");
const boardEl = document.querySelector(".leaderboard");
let interval;

const startGame = () => {
  button.disabled = true;
  interval = setInterval(() => {
    const random = Math.floor(Math.random() * moles.length);
    hideMoles();
    moles[random].classList.add("active");
  }, 1200);
  setTimeout(() => {
    let userName = prompt('What is your name?');
    updateLeaderBoard(userName, score);
    showLeaderBoard();
    reset();
  }, 10000);
}

const hideMoles = () => {
  moles.forEach((mole) => {
    mole.classList.remove("active");
  });
}

button.addEventListener("click", startGame);

const sortLeaders = (a, b) => {
  if (a.score < b.score) {
    return 1;
  } else if (a.score > b.score) {
    return -1;
  } else {
    return 0;
  }
}

const updateLeaderBoard = (userName, score) => {
  let leaderBoard = JSON.parse(localStorage.getItem('leaderBoard')) || [];
  let existingUser = leaderBoard.find((item) => item.userName == userName);
  if (existingUser) {
    existingUser.score = score > existingUser.score ? score : existingUser.score;
  } else {
    leaderBoard.push({ userName, score });
  }
  leaderBoard.sort(sortLeaders);
  localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard));
}

const reset = () => {
  button.disabled = false;
  score = 0;
  scoreEl.innerHTML = score;
  clearInterval(interval);
  hideMoles();
}

const showLeaderBoard = () => {
  boardEl.style.display = 'block';
  document.querySelector(".overlay").style.display = "block";
  let leaderBoard = JSON.parse(localStorage.getItem('leaderBoard')) || [];
  let str = '<table style="padding: 20px"><tr><th>Name</th><th>Score</th></tr>';
  for (let user of leaderBoard) {
    str += `<tr><td>${user.userName}</td><td>${user.score}</td></tr>`;
  }
  str += '</table><div style="text-align: center;"><button class="button close">CLOSE</button></div>';
  boardEl.innerHTML = str;
  document.querySelector(".close").addEventListener("click", closeLeaderBoard);
}

const closeLeaderBoard = () => {
  boardEl.style.display = 'none';
  document.querySelector(".overlay").style.display = "none";

}



const handleClick = (mole, i) => {
  if (mole.classList.contains("active")) {
    score += 10;
    scoreEl.innerHTML = score;
    mole.classList.remove("active");
    booms[i].classList.add("boom-for-mole");
    setTimeout(() => {
      booms[i].classList.remove("boom-for-mole");
    }, 300);
  }
};

moles.forEach((mole, i) => {
  mole.addEventListener("click", function () { handleClick(mole, i) });
});