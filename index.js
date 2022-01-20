const players = {
  one: {
    active: true,
    moves: [],
  },
  two: {
    active: false,
    moves: [],
  },
};

const board = document.querySelector(".board");
const winInfo = document.querySelector(".win-info");
const boardSizeInput = document.getElementById("boardSize");
const squareSizeInput = document.getElementById("squareSize");
const pointsToWinInput = document.getElementById("pointsToWin");
const recapSpeedInput = document.getElementById("recapSpeed");
const boardSizeLabel = document.getElementById("boardSizeLabel");
const squareSizeLabel = document.getElementById("squareSizeLabel");
const pointsToWinLabel = document.getElementById("pointsToWinLabel");
const recapSpeedLabel = document.getElementById("recapSpeedLabel");
const defaultSettingsValue = document.getElementById("defaultSettingsValues");

boardSizeInput.addEventListener("input", (e) => {
  n = Number(e.target.value);

  boardSizeLabel.textContent = `Board Size (${n})`;

  createBoard();
  resetBoard();
});

squareSizeInput.addEventListener("input", (e) => {
  squareSize = Number(e.target.value);

  squareSizeLabel.textContent = `Square Size (${squareSize})`;

  createBoard();
  resetBoard();
});

pointsToWinInput.addEventListener("input", (e) => {
  minToWin = Number(e.target.value);

  pointsToWinLabel.textContent = `Points to Win (${minToWin})`;

  createBoard();
  resetBoard();
});

recapSpeedInput.addEventListener("input", (e) => {
  recapSpeed = Number(e.target.value);

  recapSpeedLabel.textContent = `Recap speed (${recapSpeed} ms)`;
});

defaultSettingsValue.addEventListener("click", () => {
  if (n === 10 && squareSize === 50 && minToWin === 5 && recapSpeed === 500)
    return;

  n = 10;
  squareSize = 50;
  minToWin = 5;
  recapSpeed = 500;

  boardSizeInput.value = n;
  squareSizeInput.value = squareSize;
  pointsToWinInput.value = minToWin;
  recapSpeedInput.value = recapSpeed;

  boardSizeLabel.textContent = `Board Size (${n})`;
  squareSizeLabel.textContent = `Square Size (${squareSize})`;
  pointsToWinLabel.textContent = `Points to Win (${minToWin})`;
  recapSpeedLabel.textContent = `Recap speed (${recapSpeed} ms)`;

  createBoard();
  resetBoard();
});

let gameState = [];
let n = 10;
let squareSize = 50;
let minToWin = 5;
let recapSpeed = 500;
let moves = 0;

createBoard();

function createBoard() {
  for (let i = 0; i < n; i++) {
    let row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < n; j++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.style.width = `${squareSize}px`;
      square.style.height = `${squareSize}px`;
      square.id = `${i * n + j}`;

      row.appendChild(square);
    }

    board.appendChild(row);
  }

  const squares = document.querySelectorAll(".square");

  const blueCircle = document.createElement("img");
  blueCircle.src = "./images/blue_circle.png";
  blueCircle.style.width = `${squareSize - squareSize / 5}px`;
  blueCircle.style.height = `${squareSize - squareSize / 5}px`;
  blueCircle.style.pointerEvents = "none";
  blueCircle.style.userSelect = "none";

  const redCross = document.createElement("img");
  redCross.src = "./images/red_cross.png";
  redCross.style.width = `${squareSize - squareSize / 5}px`;
  redCross.style.height = `${squareSize - squareSize / 5}px`;
  redCross.style.pointerEvents = "none";
  redCross.style.userSelect = "none";

  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("circle") ||
        e.target.classList.contains("cross")
      ) {
        return;
      }

      const position = e.target.id;
      moves++;

      if (players.one.active) {
        e.target.appendChild(blueCircle.cloneNode(true));
        e.target.classList.add("circle");

        gameState[position] = "o";
        players.one.moves.push(position);

        players.one.active = false;
        players.two.active = true;
      } else {
        e.target.appendChild(redCross.cloneNode(true));
        e.target.classList.add("cross");

        gameState[position] = "x";
        players.two.moves.push(position);

        players.one.active = true;
        players.two.active = false;
      }

      checkWin();
    });
  });
}

function checkWin() {
  if (checkRows() || checkCols() || checkDiags() || checkAntiDiags()) {
    const winMsg = document.createElement("p");
    winMsg.textContent = players.one ? "Red won" : "Blue won";

    const recapBtn = document.createElement("button");
    recapBtn.textContent = "RECAP";
    recapBtn.style.marginRight = "10px";
    recapBtn.onclick = () => recapBoard();

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "RESET";
    resetBtn.onclick = () => resetBoard();

    winInfo.appendChild(winMsg);
    winInfo.appendChild(recapBtn);
    winInfo.appendChild(resetBtn);

    disableBoard();
  }
}

function checkRows() {
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (
        j !== n - 1 &&
        gameState[i * n + j] !== undefined &&
        gameState[i * n + j] === gameState[i * n + j + 1]
      ) {
        count++;

        if (count === minToWin - 1) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }

  return false;
}

function checkCols() {
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (
        j !== n - 1 &&
        gameState[i + j * n] !== undefined &&
        gameState[i + j * n] === gameState[i + (j + 1) * n]
      ) {
        count++;

        if (count === minToWin - 1) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }

  return false;
}

function checkDiags() {
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (
        j !== n - 1 &&
        gameState[i + j * n + j] !== undefined &&
        gameState[i + j * n + j] === gameState[i + (j + 1) * n + j + 1]
      ) {
        count++;

        if (count === minToWin - 1) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (
        j !== n - 1 &&
        gameState[i * n + j * n + j] !== undefined &&
        gameState[i * n + j * n + j] === gameState[i * n + (j + 1) * n + j + 1]
      ) {
        count++;

        if (count === minToWin - 1) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }
}

function checkAntiDiags() {
  let count = 0;

  for (let i = n - 1; i > 0; i--) {
    for (let j = 0; j < n; j++) {
      if (
        j !== n - 1 &&
        gameState[i + j * n - j] !== undefined &&
        gameState[i + j * n - j] === gameState[i + (j + 1) * n - j - 1]
      ) {
        count++;

        if (count === minToWin - 1) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= n; j++) {
      if (
        j !== n - 1 &&
        gameState[j * n - j + i * n] !== undefined &&
        gameState[j * n - j + i * n] === gameState[(j + 1) * n - j + i * n - 1]
      ) {
        count++;

        if (count === minToWin - 1) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }
}

function disableBoard() {
  board.classList.add("disabled");
}

function enableBoard() {
  board.classList.remove("disabled");
}

let movesOrdered = [];

function resetBoard() {
  board.innerHTML = "";
  winInfo.innerHTML = "";
  gameState = [];
  movesOrdered = [];
  players.one.moves = [];
  players.two.moves = [];
  createBoard();
  enableBoard();
}

function recapBoard() {
  board.innerHTML = "";
  gameState = [];
  createBoard();

  let o = 0;
  let x = 0;
  movesOrdered = [];

  for (let i = 0; i < moves; i++) {
    if (i % 2 === 0) {
      movesOrdered.push(players.one.moves[o]);
      o++;
    } else {
      movesOrdered.push(players.two.moves[x]);
      x++;
    }
  }

  let i = 0;

  const squares = document.querySelectorAll(".square");

  const blueCircle = document.createElement("img");
  blueCircle.src = "./images/blue_circle.png";
  blueCircle.style.width = `${squareSize - squareSize / 5}px`;
  blueCircle.style.height = `${squareSize - squareSize / 5}px`;
  blueCircle.style.pointerEvents = "none";
  blueCircle.style.userSelect = "none";

  const redCross = document.createElement("img");
  redCross.src = "./images/red_cross.png";
  redCross.style.width = `${squareSize - squareSize / 5}px`;
  redCross.style.height = `${squareSize - squareSize / 5}px`;
  redCross.style.pointerEvents = "none";
  redCross.style.userSelect = "none";

  setInterval(() => {
    if (i % 2 === 0) {
      squares[movesOrdered[i]].appendChild(blueCircle.cloneNode(true));
      squares[movesOrdered[i]].classList.add("circle");
    } else {
      squares[movesOrdered[i]].appendChild(redCross.cloneNode(true));
      squares[movesOrdered[i]].classList.add("cross");
    }

    i++;
  }, recapSpeed);
}
