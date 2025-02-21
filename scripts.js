const BOARD_SIZE = 15;
const CELL_SIZE = 40;
let board = [];
let isBlackTurn = true;
const gameBoard = document.getElementById("game-board");
const gameStatus = document.getElementById("game-status");

function initBoard() {
  board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );
  gameBoard.innerHTML = "";

  for (let i = 0; i < BOARD_SIZE; i++) {
    const horizontalLine = document.createElement("div");
    horizontalLine.classList.add("line", "horizontal");
    horizontalLine.style.top = `${i * CELL_SIZE}px`;
    gameBoard.appendChild(horizontalLine);

    const verticalLine = document.createElement("div");
    verticalLine.classList.add("line", "vertical");
    verticalLine.style.left = `${i * CELL_SIZE}px`;
    gameBoard.appendChild(verticalLine);
  }

  gameBoard.addEventListener("click", handleBoardClick);
  updateStatus();
}

function handleBoardClick(event) {
  const rect = gameBoard.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.round(x / CELL_SIZE);
  const row = Math.round(y / CELL_SIZE);

  if (
    col >= 0 &&
    col < BOARD_SIZE &&
    row >= 0 &&
    row < BOARD_SIZE &&
    !board[row][col]
  ) {
    if (checkSixInARow(row, col, isBlackTurn ? "black" : "white")) {
      alert("6목은 허용되지 않습니다");
      return;
    }

    if (isBlackTurn && checkCaseB(row, col)) {
      alert("3-3은 허용되지 않습니다");
      return;
    }

    board[row][col] = isBlackTurn ? "black" : "white";
    const stone = document.createElement("div");
    stone.classList.add("cell", board[row][col]);
    stone.style.left = `${col * CELL_SIZE}px`;
    stone.style.top = `${row * CELL_SIZE}px`;
    gameBoard.appendChild(stone);

    if (checkWin(row, col)) {
      gameStatus.textContent = `${isBlackTurn ? "Black" : "White"} wins!`;
      gameBoard.removeEventListener("click", handleBoardClick);
    } else {
      isBlackTurn = !isBlackTurn;
      updateStatus();
    }
  }
}

function checkSixInARow(row, col, color) {
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];

  for (let { dr, dc } of directions) {
    let count = 1;
    for (let i = 1; i <= 5; i++) {
      if (board[row + dr * i]?.[col + dc * i] === color) count++;
      else break;
    }
    for (let i = 1; i <= 5; i++) {
      if (board[row - dr * i]?.[col - dc * i] === color) count++;
      else break;
    }
    if (count >= 6) return true;
  }
  return false;
}

function checkCaseB(row, col) {
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];

  let caseACount = 0;

  for (let { dr, dc } of directions) {
    let count = 1;
    let blocks = 0;
    let gap = false;

    for (let i = 1; i <= 4; i++) {
      const nr = row + dr * i;
      const nc = col + dc * i;

      if (
        nr < 0 ||
        nr >= BOARD_SIZE ||
        nc < 0 ||
        nc >= BOARD_SIZE ||
        board[nr][nc] === "white"
      ) {
        blocks++;
        break;
      }

      if (board[nr][nc] === "black") {
        count++;
      } else {
        if (gap) break;
        gap = true;
      }
    }

    for (let i = 1; i <= 4; i++) {
      const nr = row - dr * i;
      const nc = col - dc * i;

      if (
        nr < 0 ||
        nr >= BOARD_SIZE ||
        nc < 0 ||
        nc >= BOARD_SIZE ||
        board[nr][nc] === "white"
      ) {
        blocks++;
        break;
      }

      if (board[nr][nc] === "black") {
        count++;
      } else {
        if (gap) break;
        gap = true;
      }
    }

    if (count >= 3 && blocks < 2) {
      caseACount++;
    }
  }

  if (caseACount >= 2) {
    let validRows = 0;

    for (let { dr, dc } of directions) {
      let leftBlocked = false;
      let rightBlocked = false;

      const nr1 = row + dr;
      const nc1 = col + dc;
      const nr2 = row - dr;
      const nc2 = col - dc;

      if (
        (nr1 >= 0 &&
          nr1 < BOARD_SIZE &&
          nc1 >= 0 &&
          nc1 < BOARD_SIZE &&
          board[nr1][nc1] === "white") ||
        (nr2 >= 0 &&
          nr2 < BOARD_SIZE &&
          nc2 >= 0 &&
          nc2 < BOARD_SIZE &&
          board[nr2][nc2] === "white")
      ) {
        continue;
      }

      if (
        nr1 >= 0 &&
        nr1 < BOARD_SIZE &&
        nc1 >= 0 &&
        nc1 < BOARD_SIZE &&
        board[nr1][nc1] === "black" &&
        nr2 >= 0 &&
        nr2 < BOARD_SIZE &&
        nc2 >= 0 &&
        nc2 < BOARD_SIZE &&
        board[nr2][nc2] === "black"
      ) {
        validRows++;
        if (validRows >= 2) {
          return true;
        }
      }
    }
  }

  return false;
}

function checkWin(row, col) {
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];
  const color = board[row][col];
  for (let { dr, dc } of directions) {
    let count = 1;
    for (let i = 1; i <= 4; i++) {
      if (board[row + dr * i]?.[col + dc * i] === color) count++;
      else break;
    }
    for (let i = 1; i <= 4; i++) {
      if (board[row - dr * i]?.[col - dc * i] === color) count++;
      else break;
    }
    if (count === 5) return true;
  }
  return false;
}

function updateStatus() {
  gameStatus.textContent = `${isBlackTurn ? "Black" : "White"}'s turn`;
}

initBoard();
