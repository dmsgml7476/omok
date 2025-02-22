let timer;
let timeLeft;
const timerDisplay = document.querySelector(".timer-display");

// 타이머를 초기화하고 30초부터 카운트다운 시작
function resetTimer() {
  clearInterval(timer); // 기존 타이머 정리
  timeLeft = 20; // 초기 시간 설정
  timerDisplay.textContent = timeLeft;

  // 1초마다 timeLeft를 감소시키는 타이머 실행
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    // 시간이 다 되었을 경우 원하는 동작 실행
    if (timeLeft <= 0) {
      clearInterval(timer);
      placeRandomStone(); // 예시: 빈 칸에 랜덤으로 돌을 놓는 함수 호출
    }
  }, 1000);
}

// 타이머를 중지하는 함수
function stopTimer() {
  clearInterval(timer);
}

function placeRandomStone() {
  let emptyCells = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      if (game[row][col] === undefined) {
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
