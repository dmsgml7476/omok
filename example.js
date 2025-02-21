let board = [];
const BOARD_SIZE = 19;
let currentPlayer = "●";

// 게임판 초기화
function resetBoard() {
  board = Array(BOARD_SIZE)
    .fill()
    .map(() => Array(BOARD_SIZE).fill(""));
  currentPlayer = "●";
  drawBoard();
}

// 게임판 그리기
function drawBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  for (let i = 0; i < BOARD_SIZE; i++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cellElement = document.createElement("div");
      cellElement.textContent = board[i][j];
      cellElement.addEventListener("click", () => makeMove(i, j));
      rowElement.appendChild(cellElement);
    }
    boardElement.appendChild(rowElement);
  }
}
// 움직임 처리
function makeMove(i, j) {
  if (board[i][j] !== "") return; // 이미 말이 놓인 칸에는 놓을 수 없음
  board[i][j] = currentPlayer;
  if (checkWin(i, j)) {
    alert(`Player ${currentPlayer} wins!`);
    resetBoard();
    return;
  }
  currentPlayer = currentPlayer === "●" ? "O" : "●"; // 플레이어 바꾸기
  drawBoard();
}
function forbid(i, j) {
  // 33법칙 위배될 시 돌 제거
  board[i][j] = "●";
  const three = checkThree(i, j);
  board[i][j] = null;
  return three;
}
function checkThree(i, j) {
  let threeDirection = [];
  const direction = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
}

// 승리 조건 체크
function checkWin(i, j) {
  // 가로, 세로, 대각선 방향에 대해 5개의 연속된 돌이 놓였는지 체크
  // 실제 게임에서는 이 부분의 로직이 더 복잡할 수 있음
  return (
    checkLine(i, j, -1, 0) || // 가로 체크
    checkLine(i, j, 0, -1) || // 세로 체크
    checkLine(i, j, -1, -1) || // 대각선 체크
    checkLine(i, j, -1, 1) // 반대편 대각선 체크
  );
}

function checkLine(row, col, dRow, dCol) {
  let count = 0;
  for (let i = -4; i <= 4; i++) {
    let r = row + i * dRow;
    let c = col + i * dCol;
    if (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      board[r][c] === currentPlayer
    ) {
      if (++count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
}

resetBoard(); // 게임 시작dd
