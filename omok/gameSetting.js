document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector(".borad");
  const ctx = canvas.getContext("2d");
  const startButton = document.querySelector(".button-start");
  const undoButton = document.querySelector(".button-undo");

  const blackStone = document.getElementById("black");
  const whiteStone = document.getElementById("white");

  const size = 665;
  const gridCount = 19;
  const cellSize = 35;

  canvas.width = size;
  canvas.height = size;

  let gameStarted = false;

  const blackScoreDisplay = document.querySelector(
    ".blackPoint .point:last-child"
  );
  const whiteScoreDisplay = document.querySelector(
    ".whitePoint .point:last-child"
  );

  let blackScore = 0;
  let whiteScore = 0;
  let board;
  let isBlackTurn;
  let moveHistory;
  let timer;
  let timeLeft;
  const timerDisplay = document.querySelector(".timer-display");

  function drawBoard() {
    ctx.fillStyle = "burlywood";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for (let i = 0; i < gridCount; i++) {
      let pos = i * cellSize + cellSize / 2;

      ctx.beginPath();
      ctx.moveTo(pos, cellSize / 2);
      ctx.lineTo(pos, size - cellSize / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cellSize / 2, pos);
      ctx.lineTo(size - cellSize / 2, pos);
      ctx.stroke();
    }

    const starPoints = [
      { x: 3, y: 3 },
      { x: 9, y: 9 },
      { x: 15, y: 3 },
      { x: 3, y: 15 },
      { x: 15, y: 15 },
    ];

    ctx.fillStyle = "black";
    starPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(
        point.x * cellSize + cellSize / 2,
        point.y * cellSize + cellSize / 2,
        5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  drawBoard();

  function initializeGame() {
    board = Array.from({ length: gridCount }, () =>
      Array(gridCount).fill(null)
    );
    isBlackTurn = true;
    moveHistory = [];
    gameStarted = true;
    drawBoard();
    resetTimer();
    highlightSelectedStone();
  }

  function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        placeRandomStone();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function placeRandomStone() {
    if (!gameStarted) return;
    let emptyCells = [];
    for (let row = 0; row < gridCount; row++) {
      for (let col = 0; col < gridCount; col++) {
        if (board[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      placeStone(row, col);
    }
  }

  function checkWin(row, col, color) {
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];

    for (const { dr, dc } of directions) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (
          r < 0 ||
          r >= gridCount ||
          c < 0 ||
          c >= gridCount ||
          board[r][c] !== color
        )
          break;
        count++;
      }
      for (let i = 1; i < 5; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (
          r < 0 ||
          r >= gridCount ||
          c < 0 ||
          c >= gridCount ||
          board[r][c] !== color
        )
          break;
        count++;
      }
      if (count >= 5) {
        updateScore(color);
        setTimeout(() => {
          alert(
            `${color === "black" ? "흑돌이 이겼습니다" : "흰돌이 이겼습니다."}`
          );
        }, 100);
        gameStarted = false;
        stopTimer();
        return true;
      }
    }
    return false;
  }

  function updateScore(color) {
    if (color === "black") {
      blackScore++;
      blackScoreDisplay.textContent = blackScore;
    } else {
      whiteScore++;
      whiteScoreDisplay.textContent = whiteScore;
    }
  }

  function placeStone(row, col) {
    if (!gameStarted || board[row][col] !== null) return;
    board[row][col] = isBlackTurn ? "black" : "white";
    moveHistory.push({ row, col, color: board[row][col] });

    ctx.fillStyle = isBlackTurn ? "black" : "white";
    ctx.beginPath();
    ctx.arc(
      col * cellSize + cellSize / 2,
      row * cellSize + cellSize / 2,
      15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    if (!checkWin(row, col, board[row][col])) {
      isBlackTurn = !isBlackTurn;
      resetTimer();
      highlightSelectedStone();
    }
  }

  function undoMove() {
    if (!gameStarted || moveHistory.length === 0) return;
    let lastMove = moveHistory.pop();
    board[lastMove.row][lastMove.col] = null;
    drawBoard();
    moveHistory.forEach(({ row, col, color }) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        col * cellSize + cellSize / 2,
        row * cellSize + cellSize / 2,
        15,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
    });
    isBlackTurn = !isBlackTurn;
    highlightSelectedStone();
  }

  function highlightSelectedStone() {
    blackStone.style.border = isBlackTurn ? "3px solid red" : "none";
    whiteStone.style.border = !isBlackTurn ? "3px solid red" : "none";
  }

  canvas.addEventListener("click", (event) => {
    if (!gameStarted) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.round((x - cellSize / 2) / cellSize);
    const row = Math.round((y - cellSize / 2) / cellSize);

    if (col < 0 || col >= gridCount || row < 0 || row >= gridCount) return;
    if (board[row][col] !== null) return;

    placeStone(row, col);
  });

  startButton.addEventListener("click", () => {
    initializeGame();
  });

  undoButton.addEventListener("click", () => {
    undoMove();
  });
});
