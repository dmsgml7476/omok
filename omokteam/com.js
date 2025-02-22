const user3 = localStorage.getItem("user3");

const home = document.querySelector("#home");
const board = document.querySelector(".board");
const table = document.querySelector(".table");
const go = document.querySelector(".go");
const restart = document.querySelector("#reset");
const userB = document.querySelector("#black");
const userW = document.querySelector("#white");

white.style.textDecoration = "none";
white.textContent = user2;
black.style.textDecoration = "underline";
black.textContent = user1;

for (var i = 0; i < 16; i++) {
  let tr = document.createElement("tr");
  table.appendChild(tr);
  for (var j = 0; j < 16; j++) {
    let td = document.createElement("td");
    td.setAttribute("class", "square");
    tr.appendChild(td);
  }
}

for (var i = 0; i < 15; i++) {
  let tr = document.createElement("tr");
  go.appendChild(tr);
  for (var j = 0; j < 15; j++) {
    let td = document.createElement("td");
    td.setAttribute("id", i + "-" + j);
    tr.appendChild(td);
  }
}

let game = Array.from(Array(15), () => Array(15).fill(undefined));
let turn = user3 === "B" ? "B" : "W";
if (turn === "B") {
  black.style.textDecoration = "underline";
  white.style.textDecoration = "none";
} else {
  black.style.textDecoration = "none";
  white.style.textDecoration = "underline";
  setTimeout(computerMove, 500);
}

document.querySelectorAll(".go td").forEach((item) => {
  item.addEventListener("click", () => {
    if (turn === user3) {
      let [row, col] = item.id.split("-").map(Number);
      if (!game[row][col]) {
        makeMove(row, col, turn);
        if (!checkWin(row, col, turn)) {
          turn = turn === "B" ? "W" : "B";
          setTimeout(computerMove, 500);
        }
      }
    }
  });
});

function makeMove(row, col, turn) {
  game[row][col] = turn;
  let cell = document.getElementById(`${row}-${col}`);
  cell.classList.add(turn === "B" ? "black" : "white");
  black.style.textDecoration = turn === "B" ? "none" : "underline";
  white.style.textDecoration = turn === "B" ? "underline" : "none";

  if (checkWin(row, col, turn)) {
    setTimeout(() => showWinModal(turn === "B" ? "흑돌" : "백돌"), 100);
  }
}

function computerMove() {
  let emptyCells = [];
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (!game[i][j]) emptyCells.push([i, j]);
    }
  }
  if (emptyCells.length > 0) {
    let [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(row, col, turn);
    turn = turn === "B" ? "W" : "B";
  }
}

function checkWin(row, col, turn) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];
  for (const [dx, dy] of directions) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      let newRow = row + dx * i,
        newCol = col + dy * i;
      if (
        newRow < 0 ||
        newRow >= 15 ||
        newCol < 0 ||
        newCol >= 15 ||
        game[newRow][newCol] !== turn
      )
        break;
      count++;
    }
    for (let i = 1; i < 5; i++) {
      let newRow = row - dx * i,
        newCol = col - dy * i;
      if (
        newRow < 0 ||
        newRow >= 15 ||
        newCol < 0 ||
        newCol >= 15 ||
        game[newRow][newCol] !== turn
      )
        break;
      count++;
    }
    if (count >= 5) return true;
  }
  return false;
}

function showWinModal(winner) {
  document.getElementById("winnerText").textContent = winner + " 승리!";
  document.getElementById("winModal").style.display = "block";
}

restart.addEventListener("click", () => location.reload(true));
home.addEventListener("click", () => (window.location.href = "index.html"));
