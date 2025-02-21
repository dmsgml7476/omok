const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d"); // 2D 그래픽 그리기
const size = 18;
const cellSize = canvas.width / size; // 바둑판 크기
const board = Array.from({ length: size }, () => Array(size).fill(0)); // 바둑판 배열

let currentPlayer = 1; // 1 = 흑돌, 2 = 백돌
let mouseX = -1, mouseY = -1; // 마우스 위치 저장

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height); // 바둑판 초기화
    
    for (let i = 0; i < size; i++) {
        const pos = i * cellSize + cellSize / 2; // 중앙 정렬
        
        // 세로선 그리기
        context.beginPath();
        context.moveTo(pos, cellSize / 2);
        context.lineTo(pos, canvas.height - cellSize / 2);
        
        // 가로선 그리기
        context.moveTo(cellSize / 2, pos);
        context.lineTo(canvas.width - cellSize / 2, pos);
        
        context.stroke();
    }
    
    // 기존에 놓은 돌 다시 그리기
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] !== 0) {
                drawStone(x, y, board[x][y]);
            }
        }
    }
    
    // 마우스를 따라가는 임시 바둑돌 그리기 (유효한 좌표인지 확인)
    if (mouseX >= 0 && mouseY >= 0 && mouseX < size && mouseY < size && board[mouseX] !== undefined && board[mouseX][mouseY] === 0) {
        drawStone(mouseX, mouseY, currentPlayer, 0.5); // 반투명 돌
    }
}

// 바둑돌 그리기 함수
function drawStone(x, y, player, alpha = 1) {
    context.beginPath();
    context.arc(
        x * cellSize + cellSize / 2,
        y * cellSize + cellSize / 2,
        cellSize / 3, // 바둑돌 크기
        0, Math.PI * 2
    );
    context.fillStyle = player === 1 ? `rgba(0, 0, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    context.fill();
    context.stroke();
}

// 마우스 이동 시 임시 바둑돌 위치 업데이트
function handleMouseMove(event) {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / cellSize);
    let y = Math.floor((event.clientY - rect.top) / cellSize);
    
    // 마우스 좌표가 바둑판을 벗어나면 업데이트하지 않음
    if (x < 0 || y < 0 || x >= size || y >= size) {
        mouseX = -1;
        mouseY = -1;
        drawBoard(); // 마우스가 바둑판 밖으로 나갔을 때도 보드 다시 그림
        return;
    }
    
    if (x !== mouseX || y !== mouseY) {
        mouseX = x;
        mouseY = y;
        drawBoard(); // 마우스 이동 시 바둑판 다시 그리기
    }
}

// 클릭하면 바둑돌 놓기
function handleClick() {
    if (mouseX < 0 || mouseY < 0 || mouseX >= size || mouseY >= size || board[mouseX][mouseY] !== 0) return;

    
    console.log(`Attempting to place stone at (${mouseX}, ${mouseY}) - Player: ${currentPlayer}`);
    
    if (currentPlayer === 1 && checkThreeThree(mouseX, mouseY, board, currentPlayer)) {
        alert("흑은 3x3 금수 위치에 돌을 놓을 수 없습니다.");
        console.log(`Move rejected due to 3x3 restriction at (${mouseX}, ${mouseY})`);
        return;
    }

    board[mouseX][mouseY] = currentPlayer;
    console.log(`Stone placed at (${mouseX}, ${mouseY}) - Player: ${currentPlayer}`);

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    
    // 바둑판 다시 그려서 돌 고정
    drawBoard();

    // 상태 업데이트
    document.getElementById("status").innerText = currentPlayer === 1 ? "검은 돌 차례" : "흰 돌 차례";
}

class ForbiddenStone {
    constructor(board, x, y, isBlack) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.currentPlayer = isBlack ? 1 : 2;
        this.otherPlayer = isBlack ? 2 : 1;
        this.size = board.length; // 바둑판 크기
        this.board[y][x] = this.currentPlayer; // 돌을 미리 놓고 체크
    }

    // 삼삼 체크 (열린 3이 2개 이상이면 금수)
    samsam() {
        let openSamCount = 0;
        openSamCount += this.find1();
        openSamCount += this.find2();
        openSamCount += this.find3();
        openSamCount += this.find4();
        return openSamCount >= 2;
    }

    // 사사 체크 (열린 4가 2개 이상이면 금수)
    sasa() {
        let fourStone = 0;
        fourStone += this.fourORjang(1, 1);
        fourStone += this.fourORjang(2, 1);
        fourStone += this.fourORjang(3, 1);
        fourStone += this.fourORjang(4, 1);
        return fourStone >= 2;
    }

    // 장목 체크 (6목 이상)
    jangmok() {
        let result = 0;
        result += this.fourORjang(1, 2);
        result += this.fourORjang(2, 2);
        result += this.fourORjang(3, 2);
        result += this.fourORjang(4, 2);
        return result >= 1;
    }

    // 5목 체크 (승리 여부)
    fiveStone() {
        let result = 0;
        result += this.fourORjang(1, 3);
        result += this.fourORjang(2, 3);
        result += this.fourORjang(3, 3);
        result += this.fourORjang(4, 3);
        return result >= 1;
    }

    // 4가지 방향 탐색
    fourORjang(direction, trigger) {
        const dx = [1, 1, 0, -1]; // → ↘ ↓ ↙
        const dy = [0, 1, 1, 1]; // → ↘ ↓ ↙
        let stone1 = 0, stone2 = 0, allStone = 0;
        let blink1 = trigger === 3 ? 0 : 1;
        
        // 한 방향 탐색 (예: →)
        let xx = this.x - dx[direction - 1];
        let yy = this.y - dy[direction - 1];
        let check = false;
        
        while (xx >= 0 && yy >= 0 && xx < this.size && yy < this.size) {
            if (this.board[yy][xx] === this.currentPlayer) {
                check = false;
                stone1++;
            } else if (this.board[yy][xx] === this.otherPlayer) {
                break;
            } else {
                if (check) {
                    blink1++;
                    break;
                }
                check = true;
                if (blink1 === 1) blink1--;
                else break;
            }
            xx -= dx[direction - 1];
            yy -= dy[direction - 1];
        }

        // 반대 방향 탐색 (예: ←)
        let blink2 = blink1;
        if (blink1 === 1) blink1 = 0;
        xx = this.x + dx[direction - 1];
        yy = this.y + dy[direction - 1];
        check = false;
        
        while (xx >= 0 && yy >= 0 && xx < this.size && yy < this.size) {
            if (this.board[yy][xx] === this.currentPlayer) {
                check = false;
                stone2++;
            } else if (this.board[yy][xx] === this.otherPlayer) {
                break;
            } else {
                if (check) {
                    blink2++;
                    break;
                }
                check = true;
                if (blink2 === 1) blink2--;
                else break;
            }
            xx += dx[direction - 1];
            yy += dy[direction - 1];
        }

        allStone = stone1 + stone2;
        
        // 삼삼 금수 판별
        if (trigger === 1) {
            return allStone === 3 ? 1 : 0;
        }
        
        // 6목 이상 (장목) 판별
        if (trigger === 2) {
            return allStone >= 5 && stone1 !== 0 && stone2 !== 0 ? 1 : 0;
        }

        // 5목 달성 여부 판별
        if (trigger === 3) {
            return allStone === 4 ? 1 : 0;
        }

        return 0;
    }
}

// 금수 체크 함수
function checkForbiddenStone(board, x, y, isBlack) {
    const game = new ForbiddenStone(board, x, y, isBlack);

    // 흑돌일 경우 금수 체크
    if (isBlack) {
        if (game.samsam()) {
            alert("삼삼 금수입니다.");
            return true;
        }
        if (game.sasa()) {
            alert("사사 금수입니다.");
            return true;
        }
        if (game.jangmok()) {
            alert("장목(6목 이상) 금수입니다.");
            return true;
        }
    }

    // 5목이면 승리
    if (game.fiveStone()) {
        alert(isBlack ? "흑이 승리했습니다!" : "백이 승리했습니다!");
        return true;
    }

    return false;
}

// 3x3 금수 체크 함수 (수정됨)
// const checkThreeThree = (x, y, board, currentPlayer) => {
//     let count3 = 0;
//     const size = board.length;

//     // 4가지 방향 (가로, 세로, 대각선 ↘↖, 역대각선 ↙↗)
//     const directions = [
//         [[1, 0], [-1, 0]], // 가로 (→ ←)
//         [[0, 1], [0, -1]], // 세로 (↓ ↑)
//         [[1, 1], [-1, -1]], // 대각선 (↘ ↖)
//         [[1, -1], [-1, 1]]  // 역대각선 (↙ ↗)
//     ];

//     for (let [[dx1, dy1], [dx2, dy2]] of directions) {
//         let count = 1;

//         for (let [dx, dy] of [[dx1, dy1], [dx2, dy2]]) {
//             let nx = x + dx;
//             let ny = y + dy;

//             while (nx >= 0 && ny >= 0 && nx < size && ny < size && board[nx] !== undefined && board[nx][ny] === currentPlayer) {
//                 count++;
//                 nx += dx;
//                 ny += dy;
//                 console.log(count)
//             }
//         }

//         if (count === 3) count3++;
//         console.log(count3)
//     }

//     return count3 >= 2 ? 1 : 0;
// };

// 이벤트 리스너 추가
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("click", handleClick);

// 바둑판 초기화
drawBoard();