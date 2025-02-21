const choB = document.querySelector("#imgB");
const choW = document.querySelector("#imgW");
const com = document.querySelector("#com");
const user = document.querySelector("#useruser");
const imgs = document.querySelectorAll(".img");
const match = document.querySelector(".match");
const start = document.querySelector("#start");
const B = document.querySelector("#B");
const W = document.querySelector("#W");
const input1 = document.querySelector("#input1");
const input2 = document.querySelector("#input2");
const todo = document.querySelector(".todo");

let user3 = 0;
let user1 = "";
let user2 = "";

// const start = document.querySelector("#start");
// const start = document.querySelector("#start");

user.addEventListener("click", () => {
  todo.textContent = "흑돌/백돌을 선택하고 이름을 입력하세요";
  imgs.forEach((img) => {
    img.style.border = "5px solid rgb(253, 160, 21)";
    img.style.backgroundColor = "rgb(252, 182, 76)";
  });
  com.style.display = "none";
  user.style.display = "none";

  const startButton = document.createElement("button");
  startButton.textContent = "시작하기";
  startButton.setAttribute("id", "start");

  // 생성된 버튼을 match 요소에 추가
  match.appendChild(startButton);

  imgs.forEach((img) => {
    img.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.05)"; // 이미지 확대
      img.style.transition = "transform 0.3s ease"; // 부드러운 애니메이션
    });

    img.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)"; // 원래 크기로 복구
    });
  });

  B.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text"; // 텍스트 입력받기
    input.value = user1; // 기존 값이 있으면 그 값을 입력란에 표시

    input.classList.add("input-style:focus");
    input.classList.add("input-style");

    input1.innerHTML = ""; // div B 내용 지우기
    input1.appendChild(input); // input 요소를 div B에 추가

    // 해야할 일 멘트 벼경

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "999"; // 가장 위에 표시
    document.body.appendChild(overlay); // 화면에 추가

    overlay.addEventListener("click", () => {
      input.focus();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const inputValue = input.value.trim(); // 입력값을 공백 제거 후 가져옴
        if (inputValue.length === 0) {
          alert("흑돌 유저의 닉네임을 입력하세요"); // 경고문구 추가
          return input.focus(); // 입력 필드에 포커스를 유지
        } else if (inputValue.length > 5) {
          alert("닉네임은 5자 이하로 정해주세요"); // 경고문구 추가
          return input.focus(); // 입력 필드에 포커스를 유지
        } else if (inputValue === user2) {
          alert("닉네임이 중복. 다시 입력하세요.");
          return input.focus;
        } else {
          user1 = inputValue; // 입력된 값 user1에 저장
          input1.textContent = user1; // div B의 텍스트를 user1 값으로 업데이트

          document.body.removeChild(overlay);
        }
      }
    });

    input.focus();
  });

  W.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text"; // 텍스트 입력받기
    input.value = user2; // 기존 값이 있으면 그 값을 입력란에 표시

    input.classList.add("input-style:focus");
    input.classList.add("input-style");

    input2.innerHTML = ""; // div B 내용 지우기
    input2.appendChild(input); // input 요소를 div B에 추가

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "999"; // 가장 위에 표시
    document.body.appendChild(overlay); // 화면에 추가

    overlay.addEventListener("click", () => {
      input.focus();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const inputValue = input.value.trim(); // 입력값을 공백 제거 후 가져옴
        if (inputValue.length === 0) {
          alert("흑돌 유저의 닉네임을 입력하세요"); // 경고문구 추가
          return input.focus(); // 입력 필드에 포커스를 유지
        } else if (inputValue.length > 5) {
          alert("닉네임은 5자 이하로 정해주세요"); // 경고문구 추가
          return input.focus(); // 입력 필드에 포커스를 유지
        } else if (inputValue === user1) {
          alert("닉네임이 중복. 다시 입력하세요.");
          return input.focus;
        } else {
          user2 = inputValue; // 입력된 값 user2에 저장
          input2.textContent = user2; // div B의 텍스트를 user1 값으로 업데이트
        }

        document.body.removeChild(overlay);
        checkStartButton();
      }
    });

    input.focus();
  });
});

const checkStartButton = () => {
  const startButton = document.querySelector("#start"); // 동적으로 생성된 버튼 다시 가져오기
  if (user1 && user2 && startButton) {
    startButton.disabled = false; // 버튼 활성화
    startButton.style.opacity = "1";
    startButton.style.cursor = "pointer";
    todo.textContent = "게임을 시작하세요! 승리를 기원합니다!";

    let isBlinking = true;
    const blinkInterval = setInterval(() => {
      startButton.style.opacity = isBlinking ? "0.5" : "1";
      isBlinking = !isBlinking;
    }, 500);

    startButton.addEventListener("click", () => {
      clearInterval(blinkInterval);
      localStorage.setItem("user1", user1);
      localStorage.setItem("user2", user2);
      window.location.href = "game.html";
    });
  }
};

// 컴퓨터 선택

com.addEventListener("click", () => {
  todo.textContent = "흑돌/백돌을 선택하세요!";
  imgs.forEach((img) => {
    img.style.border = "5px solid rgb(253, 160, 21)";
    img.style.backgroundColor = "rgb(252, 182, 76)";
  });
  com.style.display = "none";
  user.style.display = "none";

  const startButton = document.createElement("button");
  startButton.textContent = "시작하기";
  startButton.setAttribute("id", "start");
  startButton.disabled = true; // 버튼 초기 비활성화
  startButton.style.opacity = "0.5";
  startButton.style.cursor = "not-allowed";

  match.appendChild(startButton);

  imgs.forEach((img) => {
    img.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.05)";
      img.style.transition = "transform 0.3s ease";
    });

    img.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)";
    });
  });

  B.addEventListener("click", () => {
    todo.textContent = "흑돌을 선택하셨군요! 게임을 시작하세요!";
    user3 = "B";
    checkStartButtonForCom();
  });

  W.addEventListener("click", () => {
    todo.textContent = "백돌을 선택하셨군요! 게임을 시작하세요!";
    user3 = "W";
    checkStartButtonForCom();
  });
});

// 컴퓨터 모드에서 시작 버튼 활성화
const checkStartButtonForCom = () => {
  const startButton = document.querySelector("#start");
  if (user3 && startButton) {
    startButton.disabled = false;
    startButton.style.opacity = "1";
    startButton.style.cursor = "pointer";

    let isBlinking = true;
    const blinkInterval = setInterval(() => {
      startButton.style.opacity = isBlinking ? "0.5" : "1";
      isBlinking = !isBlinking;
    }, 500);

    startButton.addEventListener("click", () => {
      clearInterval(blinkInterval);
      localStorage.setItem("user3", user3);
      window.location.href = "com.html";
    });
  }
};
