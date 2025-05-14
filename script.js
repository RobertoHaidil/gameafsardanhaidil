function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}
showSection('about');

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const controls = document.getElementById("controls");

const paddleWidth = 10, paddleHeight = 100;
const player1 = { x: 0, y: 200, width: paddleWidth, height: paddleHeight, dy: 5, score: 0 };
const player2 = { x: canvas.width - paddleWidth, y: 200, width: paddleWidth, height: paddleHeight, dy: 5, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speed: 5, velocityX: 5, velocityY: 5 };

let keys = {}, gameOver = false, winner = "";

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  player1.y = mouseY - player1.height / 2;
  player2.y = mouseY - player2.height / 2;
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 15)
    drawRect(canvas.width / 2 - 1, i, 2, 10, "white");
}

function drawText(text, x, y, size = "40px") {
  ctx.fillStyle = "white";
  ctx.font = `${size} Arial`;
  ctx.fillText(text, x, y);
}

function collision(ball, paddle) {
  return ball.x < paddle.x + paddle.width &&
         ball.x + ball.radius > paddle.x &&
         ball.y < paddle.y + paddle.height &&
         ball.y + ball.radius > paddle.y;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 5;
}

function resetGame() {
  player1.score = 0;
  player2.score = 0;
  winner = "";
  gameOver = false;
  resetBall();
}

function resumeGame() {
  resetGame();
  controls.style.display = "none";
}

function update() {
  if (canvas.style.display === "none" || gameOver) return;

  if (keys["w"] && player1.y > 0) player1.y -= player1.dy;
  if (keys["s"] && player1.y + player1.height < canvas.height) player1.y += player1.dy;
  if (keys["ArrowUp"] && player2.y > 0) player2.y -= player2.dy;
  if (keys["ArrowDown"] && player2.y + player2.height < canvas.height) player2.y += player2.dy;

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
    ball.velocityY = -ball.velocityY;

  let paddle = ball.x < canvas.width / 2 ? player1 : player2;
  if (collision(ball, paddle)) {
    let angle = (ball.y - (paddle.y + paddle.height / 2)) * Math.PI / 4 / (paddle.height / 2);
    let dir = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = dir * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
    ball.speed += 0.5;
  }

  if (ball.x - ball.radius < 0) { player2.score++; resetBall(); }
  else if (ball.x + ball.radius > canvas.width) { player1.score++; resetBall(); }

  if (player1.score >= 10 || player2.score >= 10) {
    winner = player1.score >= 10 ? "Player 1" : "Player 2";
    gameOver = true;
    controls.style.display = "block";
  }
}

function render() {
  if (canvas.style.display === "none") return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawNet();
  drawRect(player1.x, player1.y, player1.width, player1.height, "white");
  drawRect(player2.x, player2.y, player2.width, player2.height, "white");
  drawCircle(ball.x, ball.y, ball.radius, "white");

  drawText("Player 1", canvas.width / 4 - 50, 30, "20px");
  drawText("Player 2", 3 * canvas.width / 4 - 50, 30, "20px");
  drawText(player1.score, canvas.width / 4, 60);
  drawText(player2.score, 3 * canvas.width / 4, 60);

  if (gameOver) drawText(`${winner} Menang!`, canvas.width / 2 - 150, canvas.height / 2, "30px");
}

setInterval(() => {
  update();
  render();
}, 1000 / 60);
