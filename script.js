"use strict";

const currentPlayerTextElement = document.getElementById("current-player-text");
const cells = document.querySelectorAll(".cell");
const winPlayerText = document.querySelector(".win-Player");

const modalGames = document.getElementById("modal-games");
const modalGamesRevenge = document.getElementById("modal-games__revenge");
const modalGamesReset = document.getElementById("modal-games__reset");

const playerCountWinX = document.querySelector(".player__countX");
const playerCountWinO = document.querySelector(".player__countO");

let matrix = ["n", "n", "n", "n", "n", "n", "n", "n", "n"];
let playerSymbols = ["x", "o"];
let currentPlayerIndex = 0;
let countMove = 0;

let xWinCount = 0;
let oWinCount = 0;

function get2DMatrix(matrix) {
  return matrix.reduce((result, value, index) => {
    if (index % 3 === 0) {
      result.push([]);
    }
    result[result.length - 1].push(value);
    return result;
  }, []);
}

function oldGameState() {
  matrix.fill("n");
  cells.forEach((cell) => (cell.className = "cell"));
  countMove = 0;
  currentPlayerIndex = 0;
  modalGames.classList.remove("active");

  updateCurrentPlayerText();
  initializeCells();
  winPlayerText.textContent = "Win Players: ";
}

const resetGame = () => {
  xWinCount = 0;
  oWinCount = 0;

  clearWinnerCount();
  oldGameState();
};

const revengeGame = () => {
  oldGameState();
};

function initializeCells() {
  let cellIndex = 0;
  cells.forEach((cell) => {
    cell.setAttribute("data-index", cellIndex++);
    cell.addEventListener("click", handleCellClick);
  });
}

function handleCellClick(event) {
  const cell = event.target;

  if (cell.classList.contains("x") || cell.classList.contains("o")) {
    return;
  }

  cell.classList.add(playerSymbols[currentPlayerIndex]);

  const index = parseInt(cell.getAttribute("data-index"), 10);
  matrix[index] = playerSymbols[currentPlayerIndex];
  countMove++;

  if (identifyWinner(playerSymbols[currentPlayerIndex])) {
    winPlayerText.textContent =
      "Winner: " + playerSymbols[currentPlayerIndex].toUpperCase();
    updateWinnerCount();
    modalGames.classList.add("active");
    disableCells();
  } else if (countMove >= 9) {
    winPlayerText.textContent = "It's a draw!";
    modalGames.classList.add("active");
  } else {
    togglePlayer();
    updateCurrentPlayerText();
  }
}

function updateWinnerCount() {
  if (playerSymbols[currentPlayerIndex] === "x") {
    playerCountWinX.textContent = "X: " + ++xWinCount;
  } else {
    playerCountWinO.textContent = "O: " + ++oWinCount;
  }
}

function clearWinnerCount() {
  playerCountWinX.textContent = "X: 0";
  playerCountWinO.textContent = "O: 0";
}

function togglePlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % 2;
}

function updateCurrentPlayerText() {
  currentPlayerTextElement.innerText =
    "Current Player: " + playerSymbols[currentPlayerIndex].toUpperCase();
}

function identifyWinner(playerSymbol) {
  return (
    checkingHorizontal(playerSymbol) ||
    checkingVertical(playerSymbol) ||
    checkingDiagonal(playerSymbol)
  );
}

function checkingHorizontal(playerSymbol) {
  const twoDMatrix = get2DMatrix(matrix);
  for (let i = 0; i < 3; i++) {
    if (
      twoDMatrix[i][0] === playerSymbol &&
      twoDMatrix[i][1] === playerSymbol &&
      twoDMatrix[i][2] === playerSymbol
    ) {
      return true;
    }
  }
  return false;
}

function checkingVertical(playerSymbol) {
  const twoDMatrix = get2DMatrix(matrix);
  for (let i = 0; i < 3; i++) {
    if (
      twoDMatrix[0][i] === playerSymbol &&
      twoDMatrix[1][i] === playerSymbol &&
      twoDMatrix[2][i] === playerSymbol
    ) {
      return true;
    }
  }
  return false;
}

function checkingDiagonal(playerSymbol) {
  const twoDMatrix = get2DMatrix(matrix);

  if (
    twoDMatrix[0][0] === playerSymbol &&
    twoDMatrix[1][1] === playerSymbol &&
    twoDMatrix[2][2] === playerSymbol
  ) {
    return true;
  }

  if (
    twoDMatrix[0][2] === playerSymbol &&
    twoDMatrix[1][1] === playerSymbol &&
    twoDMatrix[2][0] === playerSymbol
  ) {
    return true;
  }

  return false;
}

function disableCells() {
  cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
}

initializeCells();
updateCurrentPlayerText();

modalGamesReset.addEventListener("click", resetGame);
modalGamesRevenge.addEventListener("click", revengeGame);
