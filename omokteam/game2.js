const user1 = localStorage.getItem("user1");
const user2 = localStorage.getItem("user2");
const home = document.querySelector("#home");
const board = document.querySelector(".board");
const table = document.querySelector(".table");
const go = document.querySelector(".go");
const restart = document.querySelector("#reset");
const userB = document.querySelector("#black");

const userW = document.querySelector("#white");

// 오목판 그리기

white.style.textDecoration = "none";
white.textContent = user2;

black.style.textDecoration = "underline";
black.textContent = user1;

for (var i = 0; i < 14; i++) {
  let tr = document.createElement("tr");
  table.appendChild(tr);
  for (var j = 0; j < 14; j++) {
    let td = document.createElement("td");
    td.setAttribute("class", "square");
    tr.appendChild(td);
  }
}

// 오목돌이 들어갈 영역

for (var i = 0; i < 15; i++) {
  let tr = document.createElement("tr");
  go.appendChild(tr);
  for (var j = 0; j < 15; j++) {
    let td = document.createElement("td");
    td.setAttribute("id", i + "-" + j);
    tr.appendChild(td);
  }
}
let game = new Array(17);
for (let i = 0; i < game.length; i++) {
  game[i] = new Array(17);
}

let turn = "B";
function placeStone(row, col) {
  if (game[row][col] !== undefined) return; // 이미 돌이 있으면 무시

  game[row][col] = turn;
  let myTurn = turn === "B";

  let item = document.getElementById(`${row}-${col}`);
  if (myTurn) {
    item.classList.add("black");
    white.style.textDecoration = "underline";
    black.style.textDecoration = "none";
  } else {
    item.classList.add("white");
    white.style.textDecoration = "none";
    black.style.textDecoration = "underline";
  }

  // 승리 체크
  if (checkWin(row, col, turn)) {
    let winner = myTurn ? "흑돌" : "백돌";
    let imageSrc = myTurn ? "img/흑돌.png" : "img/백돌.png";

    setTimeout(() => {
      showWinModal(winner, imageSrc);
    }, 100);
  }

  turn = myTurn ? "W" : "B";
  console.log(turn);
  resetTimer(); // 착수 시 타이머 초기화
}

// 클릭 이벤트에서 placeStone 호출
document.querySelectorAll(".go td").forEach((item) => {
  item.addEventListener("click", () => {
    let row = Number(item.id.split("-")[0]);
    let col = Number(item.id.split("-")[1]);

    if (!check3x3(row, col)) {
      placeStone(row, col);
    } else {
      console.log("금지된 자리!");
    }
  });
});

function checkWin(row, col, turn) {
  const directions = [
    [-1, 0],
    [1, 0], // 상하
    [0, -1],
    [0, 1], // 좌우
    [-1, -1],
    [1, 1], // 좌상우하 대각선
    [-1, 1],
    [1, -1], // 우상좌하 대각선
  ];

  for (const [dx, dy] of directions) {
    let cnt = 1;
    // 특정 방향으로 진행하면서 연속된 돌 개수 세기
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;

      if (
        newRow < 0 ||
        newRow > 15 ||
        newCol < 0 ||
        newCol > 15 ||
        game[newRow][newCol] !== turn
      ) {
        break;
      }
      cnt++;
    }
    // 반대 방향으로 진행하면서 연속된 돌 개수 세기
    for (let i = 1; i < 5; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;

      if (
        newRow < 0 ||
        newRow > 15 ||
        newCol < 0 ||
        newCol > 15 ||
        game[newRow][newCol] !== turn
      ) {
        break;
      }
      cnt++;
    }

    // 5개 이상일 경우 승리
    if (cnt >= 5) {
      return true;
    }
  }
  return false;
}

function check3x3(row, col) {
  if (turn !== "B") return false;
  const directions = [
    [1, 0], // 상하
    [0, 1], // 좌우
    [1, 1], // 좌상우하 대각선
    [1, -1], // 우상좌하 대각선
  ];

  let threeCount = 0;

  let forbidden = false; // 금수 여부 저장

  for (const [dx, dy] of directions) {
    let count = 1;
    let openEnds = 0;
    let blockedEnds = 0;
    // 특정 방향으로 진행하면서 연속된 돌 개수 세기
    for (let i = 1; i < 5; i++) {
      // 상대방이 금수룰 끝을 막고 있는지 확인
      const x = row + dx * i;
      const y = col + dy * i;

      // 상대방이 끝을 막고 있으면 해당 자리에 놓을 수 있도록 예외 처리
      if (x >= 0 && x < 15 && y >= 0 && y < 15) {
        if (game[x][y] === "B") {
          count++;
          console.log("B개수 : " + count);
        } else if (game[x][y] === undefined) {
          openEnds++;
          break;
          // 빈칸이 있으면 끝이 열린 것으로 간주
        } else if (game[x][y] === "W") {
          blockedEnds++;
          break;
        }
      }

      //   if (x >= 0 && x < 15 && y >= 0 && y < 17 && game[x][y] === undefined) {
      //     openEnds++;
      //     console.log(openEnds);
      //   }
    }

    for (let i = 1; i < 5; i++) {
      const x = row - dx * i;
      const y = col - dy * i;

      if (x >= 0 && x < 15 && y >= 0 && y < 15) {
        if (game[x][y] === "B") {
          count++;
          console.log("역B개수 : " + count);
        } else if (game[x][y] === undefined) {
          openEnds++;
          break; // 열린 공간이 나오면 더 이상 검사할 필요 없음
        } else if (game[x][y] === "W") {
          blockedEnds++;
          break; // 백돌이 있으면 막힌 것으로 간주
        }
      }
    }

    console.log("총 B개수 : " + count);
    console.log("총 끝에 :  " + openEnds);

    if (count === 3 && openEnds === 2 && blockedEnds === 0) {
      threeCount++;
    }
  }

  return threeCount >= 2;

  //     if (count === 3 && openEnds >= 2) {
  //       console.log("금지된자리야!");
  //       forbidden = true;
  //     }
  //   }
  //   return forbidden;
}

function showWinModal(winner, imgSrc) {
  document.getElementById("winnerImage").src = imgSrc;
  document.getElementById("winnerText").textContent = winner + " 승리!";
  document.getElementById("winModal").style.display = "block";
}

function closeModal() {
  document.getElementById("winModal").style.display = "none";
  location.reload();
}

function closeModalOnly() {
  document.getElementById("winModal").style.display = "none";
}

// 새게임 처리

restart.addEventListener("click", () => {
  location.reload(true);
});

// home 화면으로 돌아가기

home.addEventListener("click", () => {
  console.log("클릭 잡혔니");
  localStorage.removeItem("user1");
  localStorage.removeItem("user2");
  window.location.href = "index.html";
});

resetTimer();
