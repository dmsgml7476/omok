
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var Turn = "w";
var BoardSize = 500;
canvas.width = BoardSize;
canvas.height = BoardSize;
var MaxStone = 19;
var StoneSize = BoardSize/MaxStone;

//board array
var boardArray = new Array(MaxStone).fill(0);
for (var i = 0; i < MaxStone; i++) {
  boardArray[i] = new Array(MaxStone).fill(0);
}

var Board = new Image();
var stone_white = new Image();
var stone_black = new Image();

//drawing board and fill canvas
Board.onload = function () {
 context.drawImage(Board, 0, 0, BoardSize, BoardSize);
}
Board.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Blank_Go_board.png/768px-Blank_Go_board.png";


//when both stone img loaded, add event on click
stone_white.onload = function() {
  stone_black.onload = function() {
    canvas.addEventListener('click', BoardClick, false);
  }
  stone_black.src = 'https://upload.wikimedia.org/wikipedia/ko/thumb/d/d1/Go_b_no_bg.svg/200px-Go_b_no_bg.svg.png';
}
stone_white.src = 'https://upload.wikimedia.org/wikipedia/ko/thumb/c/c3/Go_w_no_bg.svg/200px-Go_w_no_bg.svg.png';

function BoardClick(evt) {
  var mousePos = getMousePos(canvas, evt);
  var col = parseInt(mousePos.x / StoneSize);
  var row = parseInt(mousePos.y / StoneSize);
  var posX = col * StoneSize;
  var posY = row * StoneSize;

  if (Turn == "w" && boardArray[col][row] == 0) {
    context.drawImage(stone_white, posX, posY, StoneSize, StoneSize);
    boardArray[col][row] = 1; //1for w
    Turn = "b";
  } else if (Turn == "b" && boardArray[col][row] == 0) {
    context.drawImage(stone_black, posX, posY, StoneSize, StoneSize);
    boardArray[col][row] = 2; //2for b
    Turn = "w";
  } else {} //do nothing
} //BoardClick end

//do some win check here

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
