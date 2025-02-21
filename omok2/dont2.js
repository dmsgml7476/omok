function check3x3(row, col) {
  const directions = [
    [1, 0], // 상하

    [0, 1], // 좌우

    [1, 1], // 좌상우하 대각선

    [1, -1], // 우상좌하 대각선
  ];

  let three = 0;
  let forbidden = 0;
  let canPlace = turn;

  for (const [dx, dy] of directions) {
    let countR = 0;
    let countO = 0;

    // 특정 방향으로 진행하면서 연속된 돌 개수 세기
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      // 상대방이 금수룰 끝을 막고 있는지 확인
      const blockedEnd1Row = row + dx * 2;
      const blockedEnd1Col = col + dy * 2;
      const blockedEnd2Row = row - dx * 2;
      const blockedEnd2Col = col - dy * 2;

      // 상대방이 끝을 막고 있으면 해당 자리에 놓을 수 있도록 예외 처리
      if (
        (blockedEnd1Row >= 0 &&
          blockedEnd1Row < 15 &&
          blockedEnd1Col >= 0 &&
          blockedEnd1Col < 15 &&
          game[blockedEnd1Row][blockedEnd1Col] ===
            (turn === "B" ? "W" : "B")) ||
        (blockedEnd2Row >= 0 &&
          blockedEnd2Row < 15 &&
          blockedEnd2Col >= 0 &&
          blockedEnd2Col < 15 &&
          game[blockedEnd2Row][blockedEnd2Col] === (turn === "B" ? "W" : "B"))
      ) {
        canPlace = false; // 상대방이 끝을 막고 있으면 돌을 놓을 수 있음
      } else {
        canPlace = true; // 상대방이 끝을 막고 있지 않으면 돌을 놓을 수 없음
      }

      if (
        newRow < 0 ||
        newRow > 16 ||
        newCol < 0 ||
        newCol > 16 ||
        game[newRow][newCol] !== "B"
      ) {
        if (
          newRow < 0 ||
          newRow > 16 ||
          newCol < 0 ||
          newCol > 16 ||
          game[newRow][newCol] !== "W"
        ) {
        }
        console.log("근처에 아무것도 없는듯?");
        break;
      }
      countR++;
      console.log("정방향 : " + countR);
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
        game[newRow][newCol] !== "B"
      ) {
        if (
          newRow < 0 ||
          newRow > 16 ||
          newCol < 0 ||
          newCol > 16 ||
          game[newRow][newCol] !== "W"
        ) {
        }
        console.log("근처에 아무것도 없는듯?");
        break;
      }

      countO++;
      console.log("역방향 : " + countO);
    }

    if (countO === 1 && countR === 1) {
      three++;
    }
  }
  console.log("3줄 수 : " == three);

  if (three === 2) {
    forbidden++;
    console.log(forbidden);
  }

  console.log("forbit : " + forbidden);
  console.log("흰돌 인식했니? : " + canPlace);

  if (forbidden === 1 && canPlace) {
    console.log("금지된자리야!");
    return true;
  }
  return false;

  //   if (three === 2) {
  //     console.log("금지된자리야!");
  //     return true;
  //   }
  //   return false;
}
