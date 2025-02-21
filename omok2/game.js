const board = document.querySelector(".board");
const table = document.querySelector(".table");
const go = document.querySelector(".go");
const restart = document.querySelector("#reset");

// 오목판 그리기

for (var i = 0; i < 16; i++) {
  let tr = document.createElement("tr");
  table.appendChild(tr);
  for (var j = 0; j < 16; j++) {
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

let tds = document.querySelectorAll(".go td");
tds.forEach((item) => {
  item.addEventListener("click", () => {
    // 위치 체크
    let row = Number(item.id.substring(0, item.id.indexOf("-")));
    let col = Number(item.id.substring(item.id.indexOf("-") + 1));

    if (check3x3(row, col)) {
      console.log("금지 되었다니까!!!");
    } else {
      if (game[row][col] === undefined) {
        game[row][col] = turn;
        let myTurn = turn === "B";
        if (myTurn) {
          item.classList.add("black");
        } else {
          item.classList.add("white");
        }

        // 승리 체크
        if (checkWin(row, col, turn)) {
          let winner = myTurn ? "흑돌" : "백돌";
          setTimeout(function () {
            alert(winner + " 승!");
            location.reload();
          }, 100);
        }

        turn = myTurn ? "W" : "B";
        console.log(turn);
      }
    }
  });
  // 돌 놓기
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
        newRow > 16 ||
        newCol < 0 ||
        newCol > 16 ||
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
        newRow > 16 ||
        newCol < 0 ||
        newCol > 16 ||
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

// 새게임 처리

restart.addEventListener("click", () => {
  game = new game();
});
