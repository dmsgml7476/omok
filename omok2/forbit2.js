// function check3x3(row, col) {
//   const directions = [
//     [1, 0], // 상하
//     [0, 1], // 좌우
//     [1, 1], // 좌상우하 대각선
//     [1, -1], // 우상좌하 대각선
//   ];

//   for (const [dx, dy] of directions) {
//     let count = 1;
//     let openEnds = 0;
//     // 특정 방향으로 진행하면서 연속된 돌 개수 세기
//     for (let i = 1; i < 5; i++) {
//       // 상대방이 금수룰 끝을 막고 있는지 확인
//       const x = row + dx * i;
//       const y = col + dy * i;

//       // 상대방이 끝을 막고 있으면 해당 자리에 놓을 수 있도록 예외 처리
//       if (x >= 0 && x < 15 && y >= 0 && y < 17) {
//         if (game[x][y] === "B") {
//           count++;
//           console.log("B개수 : " + count);
//         } else if (game[x][y] === undefined) {
//           openEnds++;
//           // 빈칸이 있으면 끝이 열린 것으로 간주
//         }
//       }

//       if (x >= 0 && x < 15 && y >= 0 && y < 17 && game[x][y] === undefined) {
//         openEnds++;
//         console.log(openEnds);
//       }
//     }

//     for (let i = 1; i < 5; i++) {
//       const x = row - dx * i;
//       const y = col - dy * i;

//       if (x >= 0 && x < 15 && y >= 0 && y < 17) {
//         if (game[x][y] === "B") {
//           count++;
//           console.log("역B개수 : " + count);
//         } else if (game[x][y] === undefined) {
//           openEnds++;
//           // 빈칸이 있으면 끝이 열린 것으로 간주
//         }
//       }
//     }

//     console.log("총 B개수 : " + count);
//     console.log("총 끝에 :  " + openEnds);

//     if (count === 3 && openEnds >= 2) {
//       console.log("금지된자리야!");
//       return true;
//     }

//     return false;
//   }
// }
