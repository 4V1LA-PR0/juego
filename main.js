document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start");
const finalScreen = document.getElementById("final");
const btnStart = document.getElementById("btnStart");

let gameRunning = false;

// Kirby
const kirby = { x: 80, y: 300, w: 40, h: 40, dy: 0 };
const kirbyImg = new Image();
kirbyImg.src = "img/kirby.png";

// Imágenes finales
const kirbyFeliz = "img/ganastes.png";
const kirbyTriste = "img/perdio.png";

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

//fondo 
const bgImg = new Image();
bgImg.src = "img/fondo.jpg";

// Obstáculos
let clouds = [];
const cloudImg = new Image();
cloudImg.src = "img/nube.png";

// Flores
let flowers = [];
const flowerImg = new Image();
flowerImg.src = "img/flor.png";

let collectedFlowers = 0;

// Física
const gravity = 0.30;
const jump = -5;
let frame = 0;

// ===== INICIO =====
btnStart.addEventListener("click", startGame);
btnStart.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startGame();
}, { passive: false });

function startGame() {
  startScreen.style.display = "none";
  finalScreen.style.display = "none";
  canvas.style.display = "block";

  gameRunning = true;
  kirby.y = 300;
  kirby.dy = 0;
  clouds = [];
  flowers = [];
  collectedFlowers = 0;
  frame = 0;

  loop();
}

// ===== CONTROLES =====
document.addEventListener("keydown", e => {
  if (e.code === "Space") kirby.dy = jump;
});

document.addEventListener("mousedown", () => kirby.dy = jump);
document.addEventListener("touchstart", e => {
  if (!gameRunning) return;
  kirby.dy = jump;
  e.preventDefault();
}, { passive: false });

// ===== OBJETOS =====
function createCloud() {
  clouds.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 200),
    w: 80,
    h: 60
  });
}

function createFlower() {
  flowers.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 100) + 50
  });
}

// ===== DIBUJAR =====
function drawKirby() {
  ctx.drawImage(kirbyImg, kirby.x, kirby.y, kirby.w, kirby.h);
}

function drawClouds() {
  clouds.forEach(c => ctx.drawImage(cloudImg, c.x, c.y, c.w, c.h));
}

function drawFlowers() {
  flowers.forEach(f => ctx.drawImage(flowerImg, f.x - 12, f.y - 12, 24, 24));
}

function drawCounter() {
  ctx.fillStyle = "#ff69b4";
  ctx.font = "20px Arial";
  ctx.fillText("Flores: " + collectedFlowers, 15, 30);
}

// ===== COLISIONES =====
function checkCollisions() {
  clouds.forEach(c => {
    if (
      kirby.x < c.x + c.w - 8 &&
      kirby.x + kirby.w > c.x + 8 &&
      kirby.y < c.y + c.h - 8 &&
      kirby.y + kirby.h > c.y + 8
    ) {
      endGame(false);
    }
  });

  flowers = flowers.filter(f => {
    const d = Math.hypot(
      kirby.x + kirby.w / 2 - f.x,
      kirby.y + kirby.h / 2 - f.y
    );
    if (d < 20) {
      collectedFlowers++;
      if (collectedFlowers >= 10) endGame(true);
      return false;
    }
    return true;
  });

  if (kirby.y < 0 || kirby.y + kirby.h > canvas.height) {
    endGame(false);
  }
}

// ===== FIN =====
function endGame(win) {
  if (!gameRunning) return;
  gameRunning = false;

  canvas.style.display = "none";
  finalScreen.style.display = "flex";

  // cambiar color de fondo según gane o pierda
  finalScreen.style.background = win ? "#fff0f5" : "#ffe4e1";

  finalScreen.innerHTML = win
    ? `<h1>!Kirby lo logró¡</h1>
       <img src="${kirbyFeliz}" width="180">
       <p>Gano Doñita</p>
       <button id="btnRestart">Reiniciar</button>`
    : `<h1>kirby a perdido</h1>
       <img src="${kirbyTriste}" width="180">
       <p>Usted puede doña</p>
       <button id="btnRestart">Reiniciar</button>`;

  const btnRestart = document.getElementById("btnRestart");
  btnRestart.addEventListener("click", startGame);
  btnRestart.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startGame();
  }, { passive: false });
}


// ===== LOOP =====
function loop() {
  if (!gameRunning) return;

  // 👇 FONDO PRIMERO
  drawBackground();

  kirby.dy += gravity;
  kirby.y += kirby.dy;

  frame++;
  if (frame % 90 === 0) createCloud();
  if (frame % 120 === 0) createFlower();

  clouds.forEach(c => c.x -= 3);
  flowers.forEach(f => f.x -= 3);

  drawKirby();
  drawClouds();
  drawFlowers();
  drawCounter();
  checkCollisions();

  requestAnimationFrame(loop);
}

  if (!gameRunning) return;

  // 👇 FONDO PRIMERO
  kirby.dy += gravity;
  kirby.y += kirby.dy;

  frame++;
  if (frame % 90 === 0) createCloud();
  if (frame % 120 === 0) createFlower();

  clouds.forEach(c => c.x -= 3);
  flowers.forEach(f => f.x -= 3);

  drawKirby();
  drawClouds();
  drawFlowers();
  drawCounter();
  checkCollisions();

  requestAnimationFrame(loop);
});
