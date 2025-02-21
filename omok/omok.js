const canvas = document.querySelector(".borad");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

const boardSize = 19;
const cellSize = (canvas.width - 40) / (boardSize - 1);
let board = Array.from(Array(boardSize), () => Array(boardSize).fill(null));
let currentPlayer = "black";
let playerMode = "2p"; // 기본값: 2인용
let timer = 30;
let timerInterval;

// --- 1. 오목판 그리기 ---
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  for (let i = 0; i < boardSize; i++) {
    // 가로선
    ctx.beginPath();
    ctx.moveTo(20, 20 + i * cellSize);
    ctx.lineTo(canvas.width - 20, 20 + i * cellSize);
    ctx.stroke();

    // 세로선
    ctx.beginPath();
    ctx.moveTo(20 + i * cellSize, 20);
    ctx.lineTo(20 + i * cellSize, canvas.height - 20);
    ctx.stroke();
  }
}

// --- 2. 돌 그리기 ---
function drawStone(x, y, color) {
  ctx.beginPath();
  ctx.arc(20 + x * cellSize, 20 + y * cellSize, cellSize / 3, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

// --- 3. 가장 가까운 교차점 찾기 ---
function getClosestIntersection(x, y) {
  const gridX = (x - 20) / cellSize;
  const gridY = (y - 20) / cellSize;

  const closestX = Math.round(gridX);
  const closestY = Math.round(gridY);

  return { x: closestX, y: closestY };
}

// --- 4. 돌 놓기 ---
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const pos = getClosestIntersection(x, y);
  const i = pos.x;
  const j = pos.y;

  if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && !board[j][i]) {
    board[j][i] = currentPlayer;
    drawStone(i, j, currentPlayer);

    // 차례 바꾸기
    currentPlayer = currentPlayer === "black" ? "white" : "black";
    resetTimer();
  }
});

// --- 5. 1인용 / 2인용 선택 ---
document.querySelector("#com").addEventListener("click", () => {
  playerMode = "1p";
});
document.querySelector("#user").addEventListener("click", () => {
  playerMode = "2p";
});

// --- 6. 흑 / 백 선택 ---
const blackButton = document.querySelector("#black");
const whiteButton = document.querySelector("#white");

blackButton.addEventListener("click", () => {
  currentPlayer = "black";
  blackButton.style.border = "2px solid blue";
  whiteButton.style.border = "none";
});

whiteButton.addEventListener("click", () => {
  currentPlayer = "white";
  whiteButton.style.border = "2px solid blue";
  blackButton.style.border = "none";
});

// --- 7. 30초 제한시간 ---
function startTimer() {
  clearInterval(timerInterval);
  timer = 30;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timer--;
    updateTimerDisplay();
    if (timer <= 0) {
      clearInterval(timerInterval);
      alert("시간 초과! 턴이 넘어갑니다.");
      currentPlayer = currentPlayer === "black" ? "white" : "black";
      resetTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  startTimer();
}

function updateTimerDisplay() {
  document.querySelector(".time").textContent = `Time ${timer}`;
}

// --- 8. 게임 시작하기 ---
document.querySelector(".button-start").addEventListener("click", () => {
  board = Array.from(Array(boardSize), () => Array(boardSize).fill(null));
  currentPlayer = "black";
  drawBoard();
  startTimer();
});

// --- 초기화 ---
drawBoard();
startTimer();
