function check3x3(row, col) {
  const directions = [
    [1, 0], // 상하
    [0, 1], // 좌우
    [1, 1], // 좌상우하 대각선
    [1, -1], // 우상좌하 대각선
  ];

  let three = 0;

  for (const [dx, dy] of directions) {
    let countR = 0;
    let countO = 0;

    // 특정 방향으로 진행하면서 연속된 돌 개수 세기
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;

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
        break;
      }
      countO++;
      console.log("역방향 : " + countO);
    }

    if (countO === 1 && countR === 1) {
      three++;
    }
  }

  if (three === 2) {
    console.log("금지된자리야!");
    return true;
  }
  return false;
}
