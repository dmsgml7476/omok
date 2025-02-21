var chessBoard = [];
var me = true;
var over = false;

//Win Array
//A 3-dimensional array including all ways of winning
var wins = [];

//Win Statistics Array
//Two arrays recording how each way of winning are satisfied by player and AI
var myWin = [];
var computerWin = [];

//Total number of ways of winning
var count = 0;

//Initialize all the data needed for calculation
var initData = function() {
  chessBoard = [];
  me = true;
  over = false;

  wins = [];

  myWin = [];
  computerWin = [];

  //initialize the entire chessBoard
  for (var i = 0; i < 15; ++i) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; ++j) {
      chessBoard[i][j] = 0;
    }
  }

  //initialize Win Array
  for (var i = 0; i < 15; ++i) {
    wins[i] = [];
    for (var j = 0; j < 15; ++j) {
      wins[i][j] = [];
    }
  }

  count = 0;
  
  //Add vertical ways of winning into Win Array
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[i][j + k][count] = true;
      }
      count++;
    }
  }

  //Add horizontal ways of winning into Win Array
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[j + k][i][count] = true;
      }
      count++;
    }
  }

  //Add "back-slash" ways of winning into Win Array
  for (var i = 0; i < 11; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[i + k][j + k][count] = true;
      }
      count++;
    }
  }

  //Add "slash" ways of winning into Win Array
  for (var i = 0; i < 11; ++i) {
    for (var j = 14; j > 3; --j) {
      for (var k = 0; k < 5; ++k) {
        wins[i + k][j - k][count] = true;
      }
      count++;
    }
  }

  console.log(count);

  //initialize Win Strategy Array
  for (var i = 0; i < count; ++i) {
    myWin[i] = 0;
    computerWin[i] = 0;
  }
}
var chess = document.getElementById("chess");
var context = chess.getContext("2d");
var restart = document.getElementById("restart");

//draw the entire chess board
var initBoard = function() {
  context.strokeStyle = "#8F8F8F";

  var logo = new Image();
  logo.src =
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530606968302&di=a1f663c9a0ce430082da0e8583582007&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F14%2F80%2F41%2F42J58PICQnV_1024.jpg";
  logo.onload = function() {
    context.drawImage(logo, 0, 0, 450, 450);
    drawChessBoard();
  };
};

initBoard();
initData();

var drawChessBoard = function() {
  for (var i = 0; i < 15; ++i) {
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
};

//place one chess
var oneStep = function(i, j, me) {
  context.beginPath();
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  var gradient = context.createRadialGradient(
    15 + i * 30 + 2,
    15 + j * 30 - 2,
    13,
    15 + i * 30 + 2,
    15 + j * 30 - 2,
    0
  );
  if (me) {
    gradient.addColorStop(0, "#0A0A0A");
    gradient.addColorStop(1, "#636766");
  } else {
    gradient.addColorStop(0, "#D1D1D1");
    gradient.addColorStop(1, "#F9F9F9");
  }
  context.fillStyle = gradient;
  context.fill();
};

//player click to place chess
chess.onclick = function(e) {
  if (over) {
    return;
  }
  if (!me) {
    return;
  }
  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(x / 30);
  var j = Math.floor(y / 30);
  if (chessBoard[i][j] === 0) {
    oneStep(i, j, me);
    chessBoard[i][j] = 1;
    for (var k = 0; k < count; ++k) {
      if (wins[i][j][k]) {
        ++myWin[k];
        computerWin[k] = 6;
        if (myWin[k] == 5) {
          window.alert("You win! Press \"Restart\" to play again!");
          over = true;
          break;
        }
      }
    }
    if (!over) {
      me = !me;
      computerAI();
    }
  }
};

//AI place chess
var computerAI = function() {
  var myScore = [];
  var computerScore = [];
  var max = 0;
  var u = 0;
  var v = 0;

  for (var i = 0; i < 15; ++i) {
    myScore[i] = [];
    computerScore[i] = [];
    for (var j = 0; j < 15; ++j) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 15; ++j) {
      if (chessBoard[i][j] === 0) {
        for (var k = 0; k < count; ++k) {
          if (wins[i][j][k]) {
            if (myWin[k] == 1) {
              myScore[i][j] += 20;
            } else if (myWin[k] == 2) {
              myScore[i][j] += 400;
            } else if (myWin[k] == 3) {
              myScore[i][j] += 2000;
            } else if (myWin[k] == 4) {
              myScore[i][j] += 10000;
            }
            if (computerWin[k] == 1) {
              computerScore[i][j] += 40;
            } else if (computerWin[k] == 2) {
              computerScore[i][j] += 800;
            } else if (computerWin[k] == 3) {
              computerScore[i][j] += 4000;
            } else if (computerWin[k] == 4) {
              computerScore[i][j] += 20000;
            }
          }
        }
        console.log(i + '-' + j + '-' + myScore[i][j]);
        if (myScore[i][j] > max) {
          max = myScore[i][j];
          u = i;
          v = j;
        } else if (myScore[i][j] == max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        } else if (computerScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
        console.log("final:" + u + '-' + v + '-' + max);
      }
    }
  }
  oneStep(u, v, false);
  chessBoard[u][v] = 2;
  for (var k = 0; k < count; ++k) {
    if (wins[u][v][k]) {
      ++computerWin[k];
      myWin[k] = 6;
      if (computerWin[k] == 5) {
        window.alert("You Lose! Press \"Restart\" to play again!");
        over = true;
      }
    }
  }
  if (!over) {
    me = !me;
  }
}

//restart the entire board
restart.onclick = function() {
  chess.height = chess.height;
  initBoard();
  initData();
}
