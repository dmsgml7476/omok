const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d"); // 2D 그래픽 그리기
const size = 18;
const cellSize = canvas.width / size;
const board = Array.from({ length: size }, () => Array(size).fill(0));

let currentPlayer = 1;
let mouseX = -1, mouseY = -1;

// 바둑판 그리기
function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < size; i++) {
        const pos = i * cellSize + cellSize / 2;

        // 세로선
        context.beginPath();
        context.moveTo(pos, cellSize / 2);
        context.lineTo(pos, canvas.height - cellSize / 2);

        // 가로선
        context.moveTo(cellSize / 2, pos);
        context.lineTo(canvas.width - cellSize / 2, pos);
        
        context.stroke();
    }
    
    // 기존 돌 다시 그리기
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] !== 0) {
                drawStone(x, y, board[x][y]);
            }
        }
    }
    
    // 마우스 위치에 반투명 돌
    if (mouseX >= 0 && mouseY >= 0 && board[mouseX][mouseY] === 0) {
        drawStone(mouseX, mouseY, currentPlayer, 0.5);
    }
}

// 바둑돌 그리기
function drawStone(x, y, player, alpha = 1) {
    context.beginPath();
    context.arc(
        x * cellSize + cellSize / 2,
        y * cellSize + cellSize / 2,
        cellSize / 3,
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
    
    if (x < 0 || y < 0 || x >= size || y >= size) {
        mouseX = -1;
        mouseY = -1;
        drawBoard();
        return;
    }
    
    if (x !== mouseX || y !== mouseY) {
        mouseX = x;
        mouseY = y;
        drawBoard();
    }
}

// 클릭하면 바둑돌 놓기
function handleClick() {
    if (mouseX < 0 || mouseY < 0 || mouseX >= size || mouseY >= size || board[mouseX][mouseY] !== 0) return;

    console.log(`🔵 돌을 놓음: (${mouseX}, ${mouseY}), 플레이어: ${currentPlayer}`);

    if (currentPlayer === 1 && checkThreeThree(mouseX, mouseY, currentPlayer)) {
        alert("흑은 3x3 금수 위치에 돌을 놓을 수 없습니다.");
        console.log(`⛔ 금수 위치! 돌 배치 취소: (${mouseX}, ${mouseY})`);
        return;
    }

    board[mouseX][mouseY] = currentPlayer;
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    drawBoard();

    document.getElementById("status").innerText = currentPlayer === 1 ? "검은 돌 차례" : "흰 돌 차례";
}

// 🔥 삼삼(33) 금수 체크 함수 (console.log 추가됨)
let globalThreeCount = 0; // 전역 변수로 선언

function checkThreeThree(x, y, player) {
    if (player !== 1) return false; // 흑돌만 금수룰 적용

    let directions = [
        [[1, 0], [-1, 0]],  // 가로
        [[0, 1], [0, -1]],  // 세로
        [[1, 1], [-1, -1]], // 대각선 (\ 방향)
        [[1, -1], [-1, 1]]  // 대각선 (/ 방향)
    ];

    console.log(`[checkThreeThree] 실행됨 - 플레이어: ${player}, 위치: (${x}, ${y})`);

    for (let [[dx1, dy1], [dx2, dy2]] of directions) {
        let tempCount = 1; // 연속된 돌 개수
        let openEnds = 0;  // 열린 끝 개수

        console.log(`🔎 방향 체크: (${dx1}, ${dy1}) ↔ (${dx2}, ${dy2})`);

        // 두 방향 탐색
        for (let [dx, dy] of [[dx1, dy1], [dx2, dy2]]) {
            let nx = x + dx, ny = y + dy;

            while (nx >= 0 && ny >= 0 && nx < size && ny < size && board[nx][ny] === player) {
                tempCount++;
                nx += dx;
                ny += dy;
            }

            // 열린 3 여부 확인
            if (nx >= 0 && ny >= 0 && nx < size && ny < size && board[nx][ny] === 0) {
                openEnds++;
            }
        }

        console.log(`방향: (${dx1}, ${dy1}) ↔ (${dx2}, ${dy2}), tempCount: ${tempCount}, openEnds: ${openEnds}`);

        // 열린 3 발견 시 globalThreeCount 증가
        if (tempCount === 3 && openEnds >= 2) {
            globalThreeCount++; 
            console.warn(`⚠ 열린 3 감지! 현재 globalThreeCount: ${globalThreeCount}`);
        }
    }

    console.log(`✅ 최종 globalThreeCount: ${globalThreeCount}`);

    return globalThreeCount >= 2; // 삼삼 여부 판별
}


// 🔥 5목(승리) 체크 함수
function checkFiveStone(x, y) {
    let directions = [
        [[1, 0], [-1, 0]],  // 가로
        [[0, 1], [0, -1]],  // 세로
        [[1, 1], [-1, -1]], // 대각선 (\ 방향)
        [[1, -1], [-1, 1]]  // 대각선 (/ 방향)
    ];

    for (let [[dx1, dy1], [dx2, dy2]] of directions) {
        let count = 1;

        for (let [dx, dy] of [[dx1, dy1], [dx2, dy2]]) {
            let nx = x + dx, ny = y + dy;

            while (nx >= 0 && ny >= 0 && nx < size && ny < size && board[nx][ny] === currentPlayer) {
                count++;
                nx += dx;
                ny += dy;
            }
        }

        console.log(`5목 체크 - 위치: (${x}, ${y}), 방향: (${dx1}, ${dy1}) ↔ (${dx2}, ${dy2}), count: ${count}`);

        if (count >= 5) return true;
    }
    return false;
}

// 이벤트 리스너 추가
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("click", handleClick);

// 바둑판 초기화
drawBoard();
