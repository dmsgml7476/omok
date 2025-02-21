const board = document.getElementById('board');
    const table = document.getElementById('table'); // 오목판
    const go = document.getElementById('go');       // 바둑돌이 놓일 곳

    for(var i = 0 ; i < 18 ; i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for(var j = 0 ; j < 18 ; j++) {
            let td = document.createElement('td');
            td.setAttribute('class', 'square');
            tr.appendChild(td);
        }
    }
    for(var i = 0 ; i < 17 ; i++) {
        let tr = document.createElement('tr');
        go.appendChild(tr);
        for(var j = 0 ; j < 17 ; j++) {
            let td = document.createElement('td');
            td.setAttribute('id', i + '-' + j);
            tr.appendChild(td);
        }
    }

    let game = new Array(17);
for(let i = 0 ; i < game.length ; i++) {
    game[i] = new Array(17);
}

let turn = 'B';

let tds = document.querySelectorAll('#go td');
tds.forEach((item) => {
    item.addEventListener('click', () => {
        // 위치 체크
        let col = Number(item.id.substring(0, item.id.indexOf('-')));
        let row = Number(item.id.substring(item.id.indexOf('-') + 1));

        // 돌 놓기
        if(game[row][col] === undefined) {
            game[row][col] = turn;
            if(turn === 'B') {
                item.setAttribute('class', 'black');
            } else {
                item.setAttribute('class', 'white');
            }

            if(turn === 'B') {
                turn = 'W';
            } else {
                turn = 'B';
            }
        }
    })
})