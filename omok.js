const boardSize = 15;
const board = [];
let currentPlayer = "black"; // 게임 시작은 검은 돌

// 보드 생성
function createBoard() {
  const boardContainer = document.getElementById("board");

  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleCellClick);
      boardContainer.appendChild(cell);
      board[row][col] = null; // 빈 칸으로 초기화
    }
  }
}

// 클릭한 셀에 돌을 놓는 함수
function handleCellClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

  if (board[row][col]) return; // 이미 돌이 놓여 있으면 클릭을 무시

  // 금수룰 체크
  if (checkForbiddenMove(row, col)) {
    alert("금수룰을 위반한 수입니다!");
    return;
  }

  // 돌 놓기
  board[row][col] = currentPlayer;
  event.target.classList.add(currentPlayer);

  // 승리 조건 체크
  if (checkWinner(row, col)) {
    alert(`${currentPlayer === "black" ? "검은" : "흰"} 돌이 승리했습니다!`);
    return;
  }

  // 턴 변경
  currentPlayer = currentPlayer === "black" ? "white" : "black";
}

// 금수룰 체크 (3-3, 4-4 금지)
function checkForbiddenMove(row, col) {
  // 3-3 금수룰 및 4-4 금수룰을 체크하는 함수
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // 가로, 세로, 대각선
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];

  for (let dir of directions) {
    const [dx, dy] = dir;
    let count = 1;
    let tempRow = row + dx;
    let tempCol = col + dy;

    // 한 방향으로 연결된 돌 개수 세기
    while (
      tempRow >= 0 &&
      tempRow < boardSize &&
      tempCol >= 0 &&
      tempCol < boardSize &&
      board[tempRow][tempCol] === currentPlayer
    ) {
      count++;
      tempRow += dx;
      tempCol += dy;
    }

    tempRow = row - dx;
    tempCol = col - dy;

    // 반대 방향으로 연결된 돌 개수 세기
    while (
      tempRow >= 0 &&
      tempRow < boardSize &&
      tempCol >= 0 &&
      tempCol < boardSize &&
      board[tempRow][tempCol] === currentPlayer
    ) {
      count++;
      tempRow -= dx;
      tempCol -= dy;
    }

    // 3-3 또는 4-4 금지 체크
    if (count === 3 || count === 4) {
      return true;
    }
  }
  return false;
}

// 승리 체크
function checkWinner(row, col) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // 가로, 세로, 대각선
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];

  for (let dir of directions) {
    let count = 1;
    let tempRow = row + dir[0];
    let tempCol = col + dir[1];

    // 한 방향으로 연결된 돌 개수 세기
    while (
      tempRow >= 0 &&
      tempRow < boardSize &&
      tempCol >= 0 &&
      tempCol < boardSize &&
      board[tempRow][tempCol] === currentPlayer
    ) {
      count++;
      tempRow += dir[0];
      tempCol += dir[1];
    }

    tempRow = row - dir[0];
    tempCol = col - dir[1];

    // 반대 방향으로 연결된 돌 개수 세기
    while (
      tempRow >= 0 &&
      tempRow < boardSize &&
      tempCol >= 0 &&
      tempCol < boardSize &&
      board[tempRow][tempCol] === currentPlayer
    ) {
      count++;
      tempRow -= dir[0];
      tempCol -= dir[1];
    }

    // 5개가 연속이면 승리
    if (count >= 5) {
      return true;
    }
  }
  return false;
}

createBoard();
