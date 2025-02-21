(function () {
    let handle = 0;
    let $canvas = null;
    let ctx = null;
    let currentPlayer = "검은돌";
  
    const [cw, ch] = [720, 720];
  
    const line = 18; // 바둑판 총 선 개수
    const stoneSize = 19; // 바둑돌 크기
    const rowSize = cw / line; // 각 블럭 크기 (선과 선 사이 간격)
  
    const board = [];
  
    function start() {
      bind();
      renderBoard();
      createBoard();
    }
  
    // 이벤트
    function bind() {
      $canvas.removeEventListener("click", addStone);
      $canvas.removeEventListener("mousemove", drawMouseStone);
  
      // 바둑돌 두기
      $canvas.addEventListener("click", addStone);
      // 마우스를 따라다니는 임시 바둑돌
      $canvas.addEventListener("mousemove", drawMouseStone);
    }
  
    function createBoard() {
      currentPlayer = "검은돌";
  
      for (let i = 0; i < line; i++) {
        board[i] = new Array(line - 1).fill("");
      }
    }
  
    // 게임판 그리기
    function renderBoard() {
      drawLine();
  
      board.forEach((rows, yIndex) => {
        rows.forEach((stone, xIndex) => {
          if (stone) {
            drawStone(xIndex + 1, yIndex + 1, stone);
          }
        });
      });
    }
  
    function drawLine() {
      // 바둑판 배경 채우기
      ctx.fillStyle = "#dcb35c";
      ctx.fillRect(0, 0, cw, ch);
  
      // 바둑판 선 그리기
      for (let linePos = 0; linePos <= cw; linePos += rowSize) {
        ctx.beginPath();
        // 가로선
        ctx.moveTo(linePos, 0);
        ctx.lineTo(linePos, ch);
        // 세로선
        ctx.moveTo(0, linePos);
        ctx.lineTo(cw, linePos);
        ctx.closePath();
        ctx.stroke();
      }
  
      // 6개 간격의 원 무늬
      ctx.fillStyle = "#000";
  
      for (let x = 3; x <= line; x += 6) {
        for (let y = 3; y <= 15; y += 6) {
          ctx.beginPath();
          ctx.arc(rowSize * x, rowSize * y, stoneSize / 3, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  
    // 바둑돌 그리기
    function drawStone(x, y, stone) {
      ctx.beginPath();
      ctx.fillStyle = stone === "검은돌" ? "#111" : "#fff";
      ctx.arc(x * rowSize, y * rowSize, stoneSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  
    // 마우스를 따라 다니는 임시의 바둑돌
    function drawMouseStone({ offsetX, offsetY }) {
      const [xIndex, yIndex] = convertIndex(offsetX, offsetY);
      
      // 이미 둔 수가 있을 시
      if (board?.[yIndex]?.[xIndex] === "") {
         renderBoard();
        // 임시의 정보를 넣어 그려줌
        drawStone(xIndex + 1, yIndex + 1, currentPlayer);
      }
    }
  
    // 새로운 바둑돌 추가
    function addStone({ offsetX, offsetY }) {
      const [xIndex, yIndex] = convertIndex(offsetX, offsetY);
  
      // 해당 위치에 돌이 없을 시
      if (board?.[yIndex]?.[xIndex] === "") {
        // 가상 바둑판 배열에 저장
        board[yIndex][xIndex] = currentPlayer;
  
        renderBoard();
        checkWin(xIndex, yIndex);
        switchPlayer();
      }
    }
  
    // 위치를 바둑판 기준 블럭 index 구하기
    function convertIndex(mouseX, mouseY) {
      const xIndex = Math.floor(Math.abs(mouseX - stoneSize) / rowSize);
      const yIndex = Math.floor(Math.abs(mouseY - stoneSize) / rowSize);
      return [xIndex, yIndex];
    }
  
    // 방금 돌을 놓은 턴에 게임이 끝났는지
    function checkWin(xIndex, yIndex) {
      const directions = [
        [1, 0], // 가로
        [0, 1], // 세로
        [1, 1], //  대각선 (↘)
        [1, -1], //  대각선 (↗),
      ];
  
      for (const [dx, dy] of directions) {
        // 현재 놓은 돌을 포함한 개수
        let count = 1;
  
        for (let i = 1; i <= 4; i++, count++) {
          // 이동한 방향에 존재하는 돌이 현재 플레이어와 같은 색이 아닐 시 해당 방향은 중지
          if (board?.[yIndex + i * dy]?.[xIndex + i * dx] !== currentPlayer) {
            break;
          }
        }
  
        // 반대방향 비교해보기
        for (let i = 1; i <= 4; i++, count++) {
          if (board?.[yIndex - i * dy]?.[xIndex - i * dx] !== currentPlayer) {
            break;
          }
        }
  
        // 5개 이상의 돌이 있을 시
        if (5 <= count) {
          return showMessage(`${currentPlayer}님이 승리하였습니다.`, start);
        }
      }
    }
  
    function switchPlayer() {
      currentPlayer = currentPlayer === "검은돌" ? "흰돌" : "검은돌";
  
      document.querySelector(".user span").textContent = currentPlayer;
    }
  
    function showMessage(text, callback, delay = 1500) {
      clearTimeout(handle);
  
      const $main = document.querySelector("main");
      $main.classList.add("open");
      $main.querySelector('.message').textContent = text;
  
      handle = setTimeout(() => {
        callback && callback();
        $main.classList.remove("open");
      }, delay);
    }
  
    window.onload = () => {
      $canvas = document.querySelector("canvas");
      ctx = $canvas.getContext("2d");
  
      $canvas.width = cw;
      $canvas.height = ch;
  
      showMessage("GAME START.", start);
    };
  })();