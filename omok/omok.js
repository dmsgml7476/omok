// rules.js - 규칙 검증 로직

function checkValidMove(row, col, isBlack) {
  if (isBlack && checkOpenThree(row, col)) {
    return false;
  }
  return true;
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
      const r = row + dr * i,
        c = col + dc * i;
      if (board[r]?.[c] === color) count++;
      else break;
    }
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i,
        c = col - dc * i;
      if (board[r]?.[c] === color) count++;
      else break;
    }
    if (count >= 5) {
      alert(
        `${color === "black" ? "흑돌이 이겼습니다" : "흰돌이 이겼습니다."}`
      );
      gameStarted = false;
      return true;
    }
  }
  return false;
}

function checkOpenThree(row, col) {
  if (!isBlackTurn) return false; // 33규칙은 흑돌만 적용

  const directions = [
    { dr: 0, dc: 1 }, // 가로
    { dr: 1, dc: 0 }, // 세로
    { dr: 1, dc: 1 }, // 대각선 (\)
    { dr: 1, dc: -1 }, // 대각선 (/)
  ];

  let openThreeCount = 0;

  for (const { dr, dc } of directions) {
    let count = 1;
    let openEnds = 0;

    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= 19 || c < 0 || c >= 19) continue;
      if (board[r][c] === "black") count++;
      else if (board[r][c] === null) openEnds++;
    }

    if (count === 3 && openEnds === 2) {
      openThreeCount++;
    }
  }

  return openThreeCount >= 2;
}
