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

let user1 = "";
let user2 = "";

// const start = document.querySelector("#start");
// const start = document.querySelector("#start");

user.addEventListener("click", () => {
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

    input.classList.add("input-style");

    input1.innerHTML = ""; // div B 내용 지우기
    input1.appendChild(input); // input 요소를 div B에 추가

    input.addEventListener("blur", () => {
      // 입력 필드에서 포커스를 잃으면 실행
      user1 = input.value; // 입력된 값 user1에 저장
      input1.textContent = user1; // div B의 텍스트를 user1 값으로 업데이트
    });
    input.focus();
    input.classList.add("input-style:focus");
  });
});
