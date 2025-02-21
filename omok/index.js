const board = document.querySelector(".board");
const table = document.querySelector(".table"); // 오목판
const go = document.querySelector(".go"); // 바둑돌이 놓일 곳

for (var i = 0; i < 15; i++) {
  let tr = document.createElement("tr");
  table.appendChild(tr);
  for (var j = 0; j < 15; j++) {
    let td = document.createElement("td");
    td.setAttribute("class", "square");
    tr.appendChild(td);
  }
}
for (var i = 0; i < 14; i++) {
  let tr = document.createElement("tr");
  go.appendChild(tr);
  for (var j = 0; j < 14; j++) {
    let td = document.createElement("td");
    td.setAttribute("id", i + "-" + j);
    tr.appendChild(td);
  }
}
///dfsg

let game = new Array(14);
for (let i = 0; i < game.length; i++) {
  game[i] = new Array(14);
}

let turn = "B";

let tds = document.querySelectorAll(".go td");
tds.forEach((item) => {
  item.addEventListener("click", () => {
    let col = Number(item.id.substring(0, item.id.indexOf("-")));
    let row = Number(item.id.substring(item.id.indexOf("-") + 1));

    if (game[row][col] === undefined) {
      game[row][col] = turn;
      if (turn === "B") {
        item.setAttribute("class", "black");
      } else {
        item.setAttribute("class", "white");
      }

      if (turn === "B") {
        turn = "W";
      } else {
        turn = "B";
      }
    }
  });
});
