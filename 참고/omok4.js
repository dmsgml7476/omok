function checkOmokCompleted(coord, takes) {
    //(0, 1), (1, 1), (1, 0), (1, -1)
    const offset = [
      { x: 1, y: 0 }, //가로
      { x: 1, y: 1 }, //대각선1
      { x: 0, y: 1 }, //세로
      { x: -1, y: 1 }, //대각선2
    ];
  
    return offset.some((dir) => {
      let streak = 1;
      const type = (takes.length - 1) % 2;
  
      //정방향
      for (
        let x = coord.x + dir.x, y = coord.y + dir.y;
        x > 0 && x < 19 && y > 0 && y < 19;
        x += dir.x, y += dir.y
      ) {
        if (takes.some((t, index) => t.x == x && t.y == y && index % 2 == type))
          streak++;
        else break;
      }
  
      //반대방향
      for (
        let x = coord.x - dir.x, y = coord.y - dir.y;
        x > 0 && x < 19 && y > 0 && y < 19;
        x -= dir.x, y -= dir.y
      ) {
        if (takes.some((t, index) => t.x == x && t.y == y && index % 2 == type))
          streak++;
        else break;
      }
  
      if (streak === 5) {
        return true;
      }
    });
  }
  
  wsServer.on("connection", (socket) => {
    ...
    
    socket.on("player_selected", (coord) => {
      ...
  
      if (checkOmokCompleted(coord, room.takes)) {
        console.log("Omok completed!");
        wsServer.in(name).emit("game_end", isBlackTurn ? "black" : "white");
        wsServer.in(name).emit("message", `${socket.id}님이 승리하셨습니다!`);
        room.blackPlayer = "";
        room.whitePlayer = "";
        emitPlayerChange(room);
        return;
      }
      
      ...
    });
  });

  const GamingRoom = ({ publicRoom }) => {
    const [roomName, setRoomName] = React.useState(publicRoom.name);
    const [blackPlayer, setBlackPlayer] = React.useState(publicRoom.blackPlayer);
    const [whitePlayer, setWhitePlayer] = React.useState(publicRoom.whitePlayer);
    const [takes, setTakes] = React.useState(publicRoom.takes);
  
    const [winner, setWinner] = React.useState("");
  
    console.log(publicRoom);
    document.title = `공개방: ${roomName}`;
  
    const onGameEnd = () => {
      setWinner("");
    };
  
    const GameEndScreen = ({ winner }) => {
      const text = `${winner === "black" ? "흑돌" : "백돌"} 승리!`;
      return (
        <div className="endscreen">
          <div className="endscreen__main">
            <h3 className="endscreen__text">{text}</h3>
            <button className="endscreen__button" onClick={onGameEnd}>
              확인
            </button>
          </div>
        </div>
      );
    };
  
    React.useEffect(() => {
      ...
      socket.on("game_end", (winner) => {
        setWinner(winner);
      });
    }, []);
  
    return (
      <div className="gaming-room">
        ...
        {winner !== "" ? <GameEndScreen winner={winner} /> : null}
      </div>
    );
  };