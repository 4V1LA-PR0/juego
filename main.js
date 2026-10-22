document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.9;
  const ratio = 360 / 640;
  let newWidth = maxWidth;
  let newHeight = newWidth / ratio;
  if (newHeight > maxHeight) { newHeight = maxHeight; newWidth = newHeight * ratio; }
  canvas.style.width = newWidth + "px";
  canvas.style.height = newHeight + "px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

const startScreen = document.getElementById("start");
const finalScreen = document.getElementById("finalScreen");
const btnStart = document.getElementById("btnStart");

let gameRunning = false;
let level = 1;

const assetRoot = "../juego/";
const kirby = { x: 70, y: 70, w: 70, h: 70, dy: 0 };
const kirbyBaja = new Image(); kirbyBaja.src = assetRoot + "img/kirby_baja.png";
const kirbySube = new Image(); kirbySube.src = assetRoot + "img/kirby_sube.png";
const kirbyFeliz = assetRoot + "img/ganastes.png";
const kirbyTriste = assetRoot + "img/perdio.png";

function drawBackground() {
  if (bgImg.complete && bgImg.naturalWidth > 0) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  else { ctx.fillStyle = "#4a0e8f"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
}
const bgImg = new Image(); bgImg.src = assetRoot + "img/fondo.jpg";

let clouds = [];
const cloudImg = new Image(); cloudImg.src = assetRoot + "img/nube.png";
let flowers = [];
const flowerImg = new Image(); flowerImg.src = assetRoot + "img/flor.png";
let collectedFlowers = 0;
const gravity = 0.30, jump = -5;
let frame = 0;

btnStart.addEventListener("click", startGame);
btnStart.addEventListener("touchstart", (e) => { e.preventDefault(); startGame(); }, { passive: false });

function startGame() {
  level = 1;
  startScreen.style.display = "none";
  finalScreen.style.display = "none";
  finalScreen.classList.add("hidden");
  document.getElementById("level2Intro").classList.add("hidden");
  document.getElementById("cardGame").classList.add("hidden");
  document.getElementById("pencilGame").classList.add("hidden");
  if (scoreBoard) scoreBoard.style.display = "none";
  canvas.style.display = "block";
  gameRunning = true;
  kirby.y = 300; kirby.dy = jump;
  clouds = []; flowers = []; collectedFlowers = 0; frame = 0;
  loop();
}

document.addEventListener("keydown", e => { if (e.code === "Space" && level === 1) kirby.dy = jump; });
document.addEventListener("mousedown", () => { if (!gameRunning || level !== 1) return; kirby.dy = jump; });
document.addEventListener("touchstart", e => {
  if (!gameRunning || level !== 1) return;
  kirby.dy = jump; e.preventDefault();
}, { passive: false });

function createCloud() { clouds.push({ x: canvas.width, y: Math.random() * (canvas.height - 200), w: 80, h: 60 }); }
function createFlower() { flowers.push({ x: canvas.width, y: Math.random() * (canvas.height - 100) + 50 }); }

function drawKirby1() {
  const imgActual = kirby.dy < 0 ? kirbySube : kirbyBaja;
  if (imgActual.complete && imgActual.naturalWidth > 0) ctx.drawImage(imgActual, kirby.x, kirby.y, kirby.w, kirby.h);
}
function drawClouds() {
  if (cloudImg.complete && cloudImg.naturalWidth > 0) clouds.forEach(c => ctx.drawImage(cloudImg, c.x, c.y, c.w, c.h));
}
function drawFlowers() {
  flowers.forEach(f => {
    ctx.save(); ctx.shadowColor = "#ff05b4"; ctx.shadowBlur = 15;
    if (flowerImg.complete && flowerImg.naturalWidth > 0) ctx.drawImage(flowerImg, f.x - 12, f.y - 12, 24, 24);
    ctx.restore();
  });
}
function drawCounter() { ctx.fillStyle = "#ff69b4"; ctx.font = "20px Arial"; ctx.fillText("Flores: " + collectedFlowers, 15, 30); }

function checkCollisions() {
  clouds.forEach(c => {
    const margin = 20;
    if (kirby.x + 8 < c.x + c.w - margin && kirby.x + kirby.w - 8 > c.x + margin &&
        kirby.y + 8 < c.y + c.h - margin && kirby.y + kirby.h - 8 > c.y + margin) endGame(false);
  });
  flowers = flowers.filter(f => {
    const d = Math.hypot(kirby.x + kirby.w / 2 - f.x, kirby.y + kirby.h / 2 - f.y);
    if (d < 20) { collectedFlowers++; if (collectedFlowers >= 10) endLevel1(); return false; }
    return true;
  });
  if (kirby.y < 0 || kirby.y + kirby.h > canvas.height) endGame(false);
}

function endGame(win) {
  if (!gameRunning) return;
  gameRunning = false;
  canvas.style.display = "none";
  finalScreen.style.display = "flex"; finalScreen.classList.remove("hidden");
  finalScreen.style.background = win ? "#fff0f5" : "#ffe4e1";
  finalScreen.innerHTML = win
    ? `<h1>!Kirby lo logró¡</h1><img src="${kirbyFeliz}" width="180"><p>Gano Doñita</p><button id="btnRestart">Reiniciar</button>`
    : `<h1>kirby a perdido</h1><img src="${kirbyTriste}" width="180"><p>Usted puede doña</p><button id="btnRestart">Reiniciar</button>`;
  const btnRestart = document.getElementById("btnRestart");
  btnRestart.addEventListener("click", startGame);
  btnRestart.addEventListener("touchstart", (e) => { e.preventDefault(); startGame(); }, { passive: false });
}

function loop() {
  if (!gameRunning) return;
  drawBackground(); kirby.dy += gravity; kirby.y += kirby.dy; frame++;
  if (frame % 90 === 0) createCloud();
  if (frame % 120 === 0) createFlower();
  clouds.forEach(c => c.x -= 3); flowers.forEach(f => f.x -= 3);
  drawKirby1(); drawClouds(); drawFlowers(); drawCounter(); checkCollisions();
  requestAnimationFrame(loop);
}

function endLevel1() {
  if (!gameRunning) return;
  gameRunning = false;
  canvas.style.display = "none";
  finalScreen.style.display = "flex"; finalScreen.classList.remove("hidden");
  finalScreen.style.background = "#fff0f5";
  finalScreen.innerHTML = `<h1>🌸 Nivel superado 🌸</h1><p>Kirby recolectó todas las flores</p><button id="btnNext">Siguiente nivel ➜</button>`;
  const btnNext = document.getElementById("btnNext");
  btnNext.addEventListener("click", startCatchGame);
  btnNext.addEventListener("touchstart", e => { e.preventDefault(); startCatchGame(); }, { passive: false });
}

// ===== NIVEL 2 =====
let spawnIntervalId = null, gameLoopId = null;
let score = 0, lives = 3;
let targetCats = 10;

let gatito1Img = new Image(); gatito1Img.src = assetRoot + "img/gatito1.png";
let gatito2Img = new Image(); gatito2Img.src = assetRoot + "img/gatito2.png";
let gatoEnojado1Img = new Image(); gatoEnojado1Img.src = assetRoot + "img/gato_enojado1.png";
let gatoEnojado2Img = new Image(); gatoEnojado2Img.src = assetRoot + "img/gato_enojado2.png";
let bolaPeloImg = new Image(); bolaPeloImg.src = assetRoot + "img/raton.png";
let pepinoImg = new Image(); pepinoImg.src = assetRoot + "img/perro.png";
let bgLevel2Img = new Image(); bgLevel2Img.src = assetRoot + "img/fondo2.jpg";

let fallingObjects = [];
let scoreBoard = document.getElementById("scoreBoard");
if (!scoreBoard) {
  scoreBoard = document.createElement("div");
  scoreBoard.id = "scoreBoard";
  scoreBoard.style.cssText = "position:fixed;top:10px;left:10px;font-size:20px;font-weight:bold;color:#FFB6D9;z-index:1000;";
  document.body.appendChild(scoreBoard);
}

let scratchTimer = null;
let scratchOverlay = document.createElement("div");
scratchOverlay.style.cssText = "position:fixed;inset:0;display:none;flex-direction:column;justify-content:center;align-items:center;z-index:999;pointer-events:none;background:rgba(255,0,0,0.3);";
scratchOverlay.innerHTML = `<div style="font-size:80px;color:red;text-shadow:2px 2px 8px #000;">／／／</div><div style="font-size:40px;color:white;font-weight:bold;text-shadow:2px 2px 8px #000;">¡AUCH!</div>`;
document.body.appendChild(scratchOverlay);

function playOuchSound() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)();
    const o = a.createOscillator(), g = a.createGain();
    o.connect(g); g.connect(a.destination);
    o.frequency.setValueAtTime(400, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(150, a.currentTime + 0.3);
    g.gain.setValueAtTime(0.5, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, a.currentTime + 0.4);
    o.start(a.currentTime); o.stop(a.currentTime + 0.4);
  } catch(e) {}
}

function showScratchAnimation() {
  scratchOverlay.style.display = "flex"; playOuchSound();
  clearTimeout(scratchTimer);
  scratchTimer = setTimeout(() => { scratchOverlay.style.display = "none"; }, 600);
}

function stopLevel2() {
  clearInterval(spawnIntervalId); clearInterval(gameLoopId);
  spawnIntervalId = null; gameLoopId = null;
}
function startCatchGame() {
  level = 2; gameRunning = false;

  // Ocultar todo primero
  canvas.style.display = "none";
  finalScreen.style.display = "none";
  finalScreen.classList.add("hidden");
  document.getElementById("level2Intro").classList.add("hidden");
  document.getElementById("cardGame").classList.add("hidden");
  document.getElementById("pencilGame").classList.add("hidden");
  if (scoreBoard) scoreBoard.style.display = "none";

  iniciarNivel2();
}
function iniciarNivel2() {
  gameRunning = true; score = 0; lives = 3;
  fallingObjects = [];
  stopLevel2();
  document.getElementById("level2Intro").classList.remove("hidden");
  canvas.style.display = "block";
  finalScreen.style.display = "none"; finalScreen.classList.add("hidden"); finalScreen.innerHTML = "";
  scratchOverlay.style.display = "none";
  if (scoreBoard) {
    scoreBoard.style.display = "block";
    scoreBoard.textContent = `🐱: 0/${targetCats} | ❤️: 3`;
  }

  spawnIntervalId = setInterval(() => {
    if (!gameRunning || level !== 2) { clearInterval(spawnIntervalId); return; }
    spawnObject();
  }, 1000);

  gameLoopId = setInterval(() => {
    if (!gameRunning || level !== 2) { clearInterval(gameLoopId); return; }
    updateGame();
  }, 30);

}

function spawnObject() {
  if (!gameRunning || level !== 2) return;
  const rand = Math.random();
  let type, img;
  if (rand < 0.30) { type = "gatito1"; img = gatito1Img; }
  else if (rand < 0.60) { type = "gatito2"; img = gatito2Img; }
  else if (rand < 0.75) { type = "enojado1"; img = gatoEnojado1Img; }
  else if (rand < 0.90) { type = "enojado2"; img = gatoEnojado2Img; }
  else if (rand < 0.95) { type = "bola"; img = bolaPeloImg; }
  else { type = "pepino"; img = pepinoImg; }
  fallingObjects.push({ x: Math.random() * (canvas.width - 50), y: -50, size: 50, vy: 2.8 + Math.random() * 2, vx: (Math.random() - 0.5), type, img, active: true, rotation: 0 });
}

function updateGame() {
  if (!gameRunning || level !== 2) return;
  const c = document.getElementById("game"), cx = c.getContext("2d");
  cx.clearRect(0, 0, c.width, c.height);
  if (bgLevel2Img.complete && bgLevel2Img.naturalWidth > 0) cx.drawImage(bgLevel2Img, 0, 0, c.width, c.height);
  else { cx.fillStyle = "#4a0e8f"; cx.fillRect(0, 0, c.width, c.height); }
  fallingObjects = fallingObjects.filter(obj => {
    if (!obj.active) return false;
    obj.y += obj.vy; obj.x += obj.vx; obj.rotation += 0.05;
    if (obj.img && obj.img.complete && obj.img.naturalWidth > 0) {
      cx.save(); cx.translate(obj.x + obj.size/2, obj.y + obj.size/2);
      cx.rotate(obj.rotation); cx.drawImage(obj.img, -obj.size/2, -obj.size/2, obj.size, obj.size); cx.restore();
    }
    if (obj.y > c.height) {
      if ((obj.type === "gatito1" || obj.type === "gatito2") && gameRunning) {
        lives--; updateScoreBoard();
        if (lives <= 0) { gameRunning = false; stopLevel2(); endCatchGame(); }
      }
      return false;
    }
    return true;
  });
}

function updateScoreBoard() {
  if (scoreBoard) scoreBoard.textContent = `🐱: ${score}/${targetCats} | ❤️: ${lives}`;
}

function handleTap(mx, my) {
  if (!gameRunning || level !== 2) return;
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    const obj = fallingObjects[i];
    if (!obj.active) continue;
    const dx = mx - (obj.x + obj.size/2), dy = my - (obj.y + obj.size/2);
    if (Math.sqrt(dx*dx + dy*dy) < obj.size/2) {
      if (obj.type === "gatito1" || obj.type === "gatito2") {
        score++; obj.active = false; updateScoreBoard();
        if (score >= targetCats) { gameRunning = false; stopLevel2(); endCatchGame(); }
      } else if (obj.type === "enojado1" || obj.type === "enojado2") {
        lives--; obj.active = false; showScratchAnimation(); updateScoreBoard();
        if (lives <= 0) { gameRunning = false; stopLevel2(); endCatchGame(); }
      } else {
        lives--; obj.active = false; updateScoreBoard();
        if (lives <= 0) { gameRunning = false; stopLevel2(); endCatchGame(); }
      }
      break;
    }
  }
}

function handleCanvasTap(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  handleTap((clientX - rect.left) * (canvas.width / rect.width), (clientY - rect.top) * (canvas.height / rect.height));
}

canvas.addEventListener("click", e => { if (level !== 2) return; handleCanvasTap(e.clientX, e.clientY); });
canvas.addEventListener("touchstart", e => {
  if (level !== 2 || !gameRunning) return;
  const t = e.touches[0]; handleCanvasTap(t.clientX, t.clientY); e.preventDefault();
}, { passive: false });

function endCatchGame() {
  gameRunning = false; stopLevel2();
  scratchOverlay.style.display = "none";
  document.getElementById("level2Intro").classList.add("hidden");
  canvas.style.display = "none";
  finalScreen.style.display = "flex"; finalScreen.classList.remove("hidden");
  finalScreen.style.background = "#fff0f5";
  let result = "";
  if (score >= targetCats) result = `<h1>🐱 ¡Ganaste! 🐱</h1><p>¡Salvaste a todos los gatitos!</p>`;
  else if (score >= 7) result = `<h1>Casi lo logras</h1><p>Casi salvas a todos los gatitos</p>`;
  else if (score >= 5) result = `<h1>Buen intento</h1><p>Los gatitos necesitan más ayuda</p>`;
  else result = `<h1>Perdiste</h1><p>Los gatitos se perdieron 😿</p>`;
  const finalImg = score >= targetCats ? kirbyFeliz : kirbyTriste;
  finalScreen.innerHTML = `${result}<img src="${finalImg}" width="180"><p>🐱 Gatitos: ${score}/${targetCats}</p><p>❤️ Vidas: ${lives}</p><button id="btnNextLevel">Siguiente nivel ➜</button>`;
  const btn = document.getElementById("btnNextLevel");
  btn.addEventListener("click", startCardGame);
  btn.addEventListener("touchstart", (e) => { e.preventDefault(); startCardGame(); }, { passive: false });
}

// ===== NIVEL 3 =====
const images = ["tu.jpg","tu2.jpg","tu3.jpg","tu4.jpg","tu5.jpg","tu6.jpg","tu7.png","tu8.jpg"];
let cards = [], firstCard = null, secondCard = null, lockBoard = false, matches = 0;
let cardTimerInterval = null, cardTimeRemaining = 60, cardTimeout = null;

function startCardGame() {
  level = 3; stopLevel2(); gameRunning = false;
  canvas.style.display = "none";
  if (scoreBoard) scoreBoard.style.display = "none";
  finalScreen.style.display = "none"; finalScreen.classList.add("hidden"); finalScreen.innerHTML = "";
  document.getElementById("level2Intro").classList.add("hidden");
  document.getElementById("pencilGame").classList.add("hidden");
  document.getElementById("cardGame").classList.remove("hidden");
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";
  matches = 0; firstCard = null; secondCard = null; lockBoard = false;
  cards = [...images, ...images].sort(() => 0.5 - Math.random());
  cards.forEach(img => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card-inner"><div class="card-face card-front"><img src="${assetRoot}ella/${img}"></div><div class="card-face card-back"><img src="${assetRoot}ella/fondo.png"></div></div>`;
    card.addEventListener("click", () => flipCard(card, img));
    board.appendChild(card);
  });
  const cardGameDiv = document.getElementById("cardGame");
  let timerEl = document.getElementById("cardTimer");
  if (!timerEl) {
    timerEl = document.createElement("div"); timerEl.id = "cardTimer";
    timerEl.style.cssText = "color:#fff;font-size:22px;margin-bottom:12px;";
    cardGameDiv.insertBefore(timerEl, board);
  }
  clearInterval(cardTimerInterval); clearTimeout(cardTimeout);
  cardTimeRemaining = 60; timerEl.textContent = `⏱️ ${cardTimeRemaining}s`;
  cardTimerInterval = setInterval(() => {
    cardTimeRemaining--; timerEl.textContent = `⏱️ ${cardTimeRemaining}s`;
    if (cardTimeRemaining <= 0) { clearInterval(cardTimerInterval); endCardGame(); }
  }, 1000);
  cardTimeout = setTimeout(() => { clearInterval(cardTimerInterval); endCardGame(); }, 60000);
}

function flipCard(card, img) {
  if (lockBoard || card === firstCard) return;
  card.classList.add("flip");
  if (!firstCard) { firstCard = card; firstCard.dataset.img = img; return; }
  secondCard = card; secondCard.dataset.img = img; lockBoard = true; checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.img === secondCard.dataset.img) {
    matches++; resetTurn();
    if (matches === images.length) setTimeout(winCardGame, 500);
  } else {
    setTimeout(() => { firstCard.classList.remove("flip"); secondCard.classList.remove("flip"); resetTurn(); }, 800);
  }
}

function resetTurn() { firstCard = null; secondCard = null; lockBoard = false; }

function winCardGame() {
  clearInterval(cardTimerInterval); clearTimeout(cardTimeout);
  document.getElementById("cardGame").classList.add("hidden");
  finalScreen.style.display = "flex"; finalScreen.classList.remove("hidden");
  finalScreen.innerHTML = `<h1>💖 ¡Ganaste! 💖</h1><p>Encontraste todos los pares</p><img src="${kirbyFeliz}" width="180"><button id="btnNextLevel">Siguiente nivel ➜</button>`;
  const btn = document.getElementById("btnNextLevel");
  btn.addEventListener("click", () => { finalScreen.style.display = "none"; finalScreen.classList.add("hidden"); startPencilGame(); });
  btn.addEventListener("touchstart", (e) => { e.preventDefault(); finalScreen.style.display = "none"; finalScreen.classList.add("hidden"); startPencilGame(); }, { passive: false });
}

function endCardGame() {
  lockBoard = true; clearInterval(cardTimerInterval); clearTimeout(cardTimeout);
  document.getElementById("cardGame").classList.add("hidden");
  finalScreen.classList.remove("hidden"); finalScreen.style.display = "flex";
  const totalPairs = images.length, foundPairs = matches;
  let msg = "", showNext = false;
  if (foundPairs === totalPairs) { msg = `<h1>💖 ¡Ganaste! 💖</h1><p>Encontraste todos los pares</p>`; showNext = true; }
  else if (foundPairs > 0) { msg = `<h1>⏱️ Tiempo!</h1><p>Encontraste ${foundPairs}/${totalPairs} pares</p>`; showNext = true; }
  else { msg = `<h1>⏱️ Tiempo!</h1><p>No encontraste pares</p>`; }
  finalScreen.innerHTML = `${msg}<button id="btnAction">${showNext ? 'Siguiente nivel ➜' : 'Reiniciar'}</button>`;
  const btn = document.getElementById("btnAction");
  btn.addEventListener("click", () => { if (showNext) startPencilGame(); else startGame(); });
  btn.addEventListener("touchstart", (e) => { e.preventDefault(); if (showNext) startPencilGame(); else startGame(); }, { passive: false });
}

// ===== NIVEL 4 - MISIÓN DE LÁPICES =====
const profesorEspaldaImg = new Image(); profesorEspaldaImg.src = assetRoot + "img2/profesor_espalda.png";
const profesorFrenteImg = new Image(); profesorFrenteImg.src = assetRoot + "img2/profesor_frente.png";
const profesorAlertaImg = new Image(); profesorAlertaImg.src = assetRoot + "img2/profesor_alerta.png";

const pCanvas = document.getElementById("gameCanvas");
const pCtx = pCanvas.getContext("2d");
const PW = pCanvas.width, PH = pCanvas.height;
const GAME_TIME = 30, PLAYER_SPEED = 190;

let pPlayer, pPencils, pCollected, pTimeLeft, pGameState, pLastTime, pElapsed;
let teacherWatching, teacherClock, teacherCaught, pAnimId;

const pKeys = {};
const pTouchDirs = new Set();

const pDesks = [
  {x:95,y:265,w:135,h:65},{x:300,y:265,w:135,h:65},{x:505,y:265,w:135,h:65},{x:710,y:265,w:135,h:65},
  {x:95,y:390,w:135,h:65},{x:300,y:390,w:135,h:65},{x:505,y:390,w:135,h:65},{x:710,y:390,w:135,h:65},
  {x:95,y:500,w:135,h:55},{x:300,y:500,w:135,h:55},{x:505,y:500,w:135,h:55},{x:710,y:500,w:135,h:55},
];

const pPencilSpots = [
  {x:155,y:250,color:"#ffcc45"},{x:365,y:250,color:"#ff72b6"},
  {x:570,y:375,color:"#55d69a"},{x:775,y:375,color:"#66c9ff"},{x:365,y:485,color:"#ff795e"},
];

// HUD del nivel 4
const pencilCountEl = document.getElementById("pencilCount");
const pencilTimerEl = document.getElementById("pencilTimer");
const teacherStatusEl = document.getElementById("teacherStatus");
const hintEl = document.getElementById("hint");

function startPencilGame() {
  level = 4; gameRunning = false;
  canvas.style.display = "none";
  document.getElementById("level2Intro").classList.add("hidden");
  if (scoreBoard) scoreBoard.style.display = "none";
  finalScreen.style.display = "none"; finalScreen.classList.add("hidden");
  document.getElementById("cardGame").classList.add("hidden");
  document.getElementById("pencilGame").classList.remove("hidden");

  pPlayer = { x: 480, y: 555, radius: 13, direction: "up" };
  pPencils = pPencilSpots.map((p, i) => ({ ...p, collected: false, number: i }));
  pCollected = 0; pTimeLeft = GAME_TIME; pElapsed = 0;
  teacherClock = 0; teacherWatching = false; teacherCaught = false;
  pGameState = "playing"; pLastTime = performance.now();

  if (pencilCountEl) pencilCountEl.textContent = "0 / 5";
  if (pencilTimerEl) pencilTimerEl.textContent = GAME_TIME;
  if (teacherStatusEl) { teacherStatusEl.textContent = "Escribiendo"; teacherStatusEl.style.color = "#fff2ae"; }
  if (hintEl) hintEl.textContent = "¡Recoge los cinco lápices y evita que el profesor te vea!";

  for (const k in pKeys) pKeys[k] = false;
  pTouchDirs.clear();

  if (pAnimId) cancelAnimationFrame(pAnimId);
  pAnimId = requestAnimationFrame(pGameLoop);
}

function pIsPressed(dir) { return Boolean(pKeys[dir]) || pTouchDirs.has(dir); }

function pCollidesDesk(x, y) {
  const r = pPlayer.radius;
  return pDesks.some(d => {
    const cx = Math.max(d.x, Math.min(x, d.x+d.w)), cy = Math.max(d.y, Math.min(y, d.y+d.h));
    const dx = x-cx, dy = y-cy; return dx*dx+dy*dy < r*r;
  });
}

function pMovePlayer(dx, dy) {
  const nx = Math.max(pPlayer.radius+5, Math.min(PW-pPlayer.radius-5, pPlayer.x+dx));
  const ny = Math.max(215, Math.min(PH-pPlayer.radius-8, pPlayer.y+dy));
  if (!pCollidesDesk(nx, pPlayer.y)) pPlayer.x = nx;
  if (!pCollidesDesk(pPlayer.x, ny)) pPlayer.y = ny;
}

function pUpdatePlayer(dt) {
  let dx=0, dy=0;
  if (pIsPressed("left")) dx--; if (pIsPressed("right")) dx++;
  if (pIsPressed("up")) dy--; if (pIsPressed("down")) dy++;
  if (dx!==0 || dy!==0) {
    const len = Math.hypot(dx,dy); dx/=len; dy/=len;
    if (Math.abs(dx)>Math.abs(dy)) pPlayer.direction = dx>0?"right":"left";
    else pPlayer.direction = dy>0?"down":"up";
    pMovePlayer(dx*PLAYER_SPEED*dt, dy*PLAYER_SPEED*dt);
  }
}

function pCanTeacherSee() {
  const tx=480, ty=160;
  const dx=pPlayer.x-tx, dy=pPlayer.y-ty;
  const dist = Math.hypot(dx,dy);
  if (dist>500 || dy<-20) return false;
  const hw = 280+dy*0.4;
  if (Math.abs(dx)>hw) return false;
  const steps = Math.ceil(dist/8);
  for (let i=1; i<steps; i++) {
    const t=i/steps, x=tx+dx*t, y=ty+dy*t;
    if (pDesks.some(d => x>d.x+10 && x<d.x+d.w-10 && y>d.y+10 && y<d.y+d.h-10)) return false;
  }
  return true;
}

function pUpdateTeacher(dt) {
  teacherClock += dt;
  teacherWatching = (teacherClock % 5) >= 3;
  if (teacherStatusEl) {
    if (teacherWatching) { teacherStatusEl.textContent = "¡VIGILANDO!"; teacherStatusEl.style.color = "#ff8585"; if (hintEl) hintEl.textContent = "¡El profesor está mirando! Escóndete detrás de los pupitres."; }
    else { teacherStatusEl.textContent = "Escribiendo"; teacherStatusEl.style.color = "#fff2ae"; if (hintEl) hintEl.textContent = "¡Aprovecha! El profesor está escribiendo en la pizarra."; }
  }
  if (teacherWatching && pCanTeacherSee()) { teacherCaught = true; endPencilGame(false, "¡El profesor te descubrió!"); }
}

function pUpdateCollect() {
  for (const p of pPencils) {
    if (p.collected) continue;
    if (Math.hypot(pPlayer.x-p.x, pPlayer.y-p.y) < 25) {
      p.collected = true; pCollected++;
      if (pencilCountEl) pencilCountEl.textContent = `${pCollected} / 5`;
      if (pCollected === 5) endPencilGame(true, "¡Conseguiste todos los lápices sin que te atraparan!");
    }
  }
}

function pUpdate(dt) {
  if (pGameState !== "playing") return;
  pElapsed += dt; pTimeLeft = Math.max(0, GAME_TIME - pElapsed);
  if (pencilTimerEl) { pencilTimerEl.textContent = Math.ceil(pTimeLeft); pencilTimerEl.style.color = pTimeLeft<=5?"#ff5555":"#ffb0d2"; }
  pUpdatePlayer(dt); pUpdateCollect(); pUpdateTeacher(dt);
  if (pGameState === "playing" && pTimeLeft <= 0) endPencilGame(false, "Se acabó el tiempo. ¡El profesor se quedó con los lápices!");
}

function drawPClassroom() {
  pCtx.fillStyle="#e6d18b"; pCtx.fillRect(0,0,PW,205);
  pCtx.fillStyle="#c39b68"; pCtx.fillRect(0,198,PW,12);
  pCtx.fillStyle="#79513d"; pCtx.fillRect(180,18,600,128);
  pCtx.fillStyle="#4f6748"; pCtx.fillRect(190,28,580,108);
  pCtx.fillStyle="#f4e8ba"; pCtx.font="18px monospace";
  pCtx.fillText("MATEMÁTICAS",215,57); pCtx.fillText("2 + 2 = 4",235,91); pCtx.fillText("¡A estudiar!",600,115);
  pCtx.fillStyle="#a77c55"; pCtx.fillRect(170,145,620,12);
  pCtx.fillStyle="#86553b"; pCtx.fillRect(835,25,95,173);
  pCtx.fillStyle="#b87b50"; pCtx.fillRect(845,35,75,153);
  pCtx.fillStyle="#f4d68b"; pCtx.fillRect(902,105,7,7);
  pCtx.fillStyle="#d8a66e"; pCtx.fillRect(0,210,PW,PH-210);
  for (let y=210; y<PH; y+=28) {
    pCtx.fillStyle="#b87f52"; pCtx.fillRect(0,y,PW,3);
    const off=(Math.floor(y/28)%2)*65;
    for (let x=-off; x<PW; x+=130) pCtx.fillRect(x,y,3,28);
  }
  pCtx.fillStyle="#79513d"; pCtx.fillRect(18,25,100,110);
  pCtx.fillStyle="#a5d9ef"; pCtx.fillRect(25,32,86,96);
  pCtx.fillStyle="#f4df9b"; pCtx.fillRect(65,32,5,96); pCtx.fillRect(25,77,86,5);
  pCtx.fillStyle="#80523d"; pCtx.fillRect(790,30,35,35);
  pCtx.fillStyle="#fff3ce"; pCtx.fillRect(795,35,25,25);
  pCtx.fillStyle="#4c3c38"; pCtx.fillRect(807,39,2,11); pCtx.fillRect(807,48,8,2);
}

function drawPDesks() {
  for (const d of pDesks) {
    pCtx.fillStyle="#62453d"; pCtx.fillRect(d.x+8,d.y+d.h-3,7,13); pCtx.fillRect(d.x+d.w-15,d.y+d.h-3,7,13);
    pCtx.fillStyle="#795744"; pCtx.fillRect(d.x+3,d.y+5,d.w,d.h);
    pCtx.fillStyle="#f4c48b"; pCtx.fillRect(d.x,d.y,d.w,d.h-7);
    pCtx.fillStyle="#b57b51"; pCtx.fillRect(d.x,d.y,d.w,4); pCtx.fillRect(d.x,d.y,4,d.h-7); pCtx.fillRect(d.x+d.w-4,d.y,4,d.h-7);
    pCtx.fillStyle="#f9f0d6"; pCtx.fillRect(d.x+16,d.y+12,22,16);
    pCtx.fillStyle="#b5a4cd"; pCtx.fillRect(d.x+19,d.y+16,15,2); pCtx.fillRect(d.x+19,d.y+21,12,2);
  }
}

function drawPPencils() {
  pPencils.forEach((p, i) => {
    if (p.collected) return;
    const bob = Math.sin(pElapsed*5+i)*2;
    pCtx.save(); pCtx.translate(p.x, p.y+bob); pCtx.rotate(-0.65);
    pCtx.fillStyle="#fff4a0"; pCtx.fillRect(-3,-15,10,30);
    pCtx.fillStyle=p.color; pCtx.fillRect(-4,-13,8,26);
    pCtx.fillStyle="#594344"; pCtx.fillRect(-5,-13,2,26); pCtx.fillRect(4,-13,2,26);
    pCtx.fillStyle="#e6c49a"; pCtx.fillRect(-3,-17,6,4);
    pCtx.fillStyle="#443537"; pCtx.fillRect(-1,-19,2,3);
    pCtx.fillStyle="#ffb6d0"; pCtx.fillRect(-4,13,8,4);
    pCtx.restore();
  });
}

function drawPTeacher() {
  pCtx.fillStyle="#76503d"; pCtx.fillRect(340,155,280,58);
  pCtx.fillStyle="#edb77d"; pCtx.fillRect(330,145,300,25);
  pCtx.fillStyle="#f7d3a0"; pCtx.fillRect(340,150,280,15);

  const imgP = teacherCaught ? profesorAlertaImg : (teacherWatching ? profesorFrenteImg : profesorEspaldaImg);
  const pw=150, ph=150;
  pCtx.save(); pCtx.beginPath(); pCtx.rect(480-pw/2,55,pw,95); pCtx.clip();
  if (imgP.complete && imgP.naturalWidth > 0) pCtx.drawImage(imgP, 480-pw/2, 55, pw, ph);
  pCtx.restore();

  if (teacherWatching) {
    pCtx.save(); pCtx.globalAlpha=0.22; pCtx.fillStyle="#00cfff";
    pCtx.beginPath(); pCtx.moveTo(480,155);
    pCtx.quadraticCurveTo(150,180,0,350); pCtx.lineTo(0,600);
    pCtx.lineTo(960,600); pCtx.lineTo(960,350);
    pCtx.quadraticCurveTo(810,180,480,155); pCtx.closePath(); pCtx.fill(); pCtx.restore();
    pCtx.fillStyle="#ff5555"; pCtx.font="bold 13px monospace"; pCtx.textAlign="center";
    pCtx.fillText("¡VIGILANDO!",480,225); pCtx.textAlign="left";
  }
}

function drawPKirby() {
  const x=Math.round(pPlayer.x), y=Math.round(pPlayer.y);
  pCtx.fillStyle="rgba(60,35,45,0.28)"; pCtx.fillRect(x-15,y+10,30,6);
  pCtx.fillStyle="#d84d83"; pCtx.fillRect(x-16,y+5,12,9); pCtx.fillRect(x+4,y+5,12,9);
  pCtx.fillStyle="#ff8fc5";
  pCtx.fillRect(x-17,y-10,34,25); pCtx.fillRect(x-12,y-16,24,34);
  pCtx.fillRect(x-20,y-5,8,17); pCtx.fillRect(x+12,y-5,8,17);
  pCtx.fillStyle="#ffd2e7"; pCtx.fillRect(x-10,y-11,7,5); pCtx.fillRect(x-15,y-4,4,5);
  pCtx.fillStyle="#252442"; pCtx.fillRect(x-8,y-6,4,10); pCtx.fillRect(x+4,y-6,4,10);
  pCtx.fillStyle="#ffffff"; pCtx.fillRect(x-7,y-5,2,3); pCtx.fillRect(x+5,y-5,2,3);
  pCtx.fillStyle="#ed578d"; pCtx.fillRect(x-13,y+3,5,3); pCtx.fillRect(x+9,y+3,5,3);
  if (pPlayer.direction==="up") { pCtx.fillStyle="#fff2a8"; pCtx.fillRect(x-3,y-19,6,3); }
}

function drawPGame() {
  drawPClassroom();
  if (teacherWatching) {
    pCtx.save(); pCtx.globalAlpha=0.15; pCtx.fillStyle="#00cfff";
    pCtx.beginPath(); pCtx.moveTo(480,165); pCtx.lineTo(300,555); pCtx.lineTo(660,555); pCtx.closePath(); pCtx.fill(); pCtx.restore();
  }
  drawPDesks(); pPencils.forEach(drawPPencils); drawPTeacher(); drawPKirby();
}

function pGameLoop(now) {
  if (pGameState !== "playing") return;
  const dt = Math.min((now-pLastTime)/1000, 0.05); pLastTime = now;
  pUpdate(dt); drawPGame();
  pAnimId = requestAnimationFrame(pGameLoop);
}

// Controles teclado nivel 4
const dirMap = {ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"};
window.addEventListener("keydown", e => {
  if (level !== 4) return;
  const dir = dirMap[e.key]; if (dir) { e.preventDefault(); pKeys[dir]=true; }
});
window.addEventListener("keyup", e => {
  if (level !== 4) return;
  const dir = dirMap[e.key]; if (dir) pKeys[dir]=false;
});
window.addEventListener("blur", () => { for (const k in pKeys) pKeys[k]=false; pTouchDirs.clear(); });

// D-pad táctil nivel 4
document.querySelectorAll(".direction").forEach(btn => {
  const dir = btn.dataset.dir;
  btn.addEventListener("pointerdown", e => { e.preventDefault(); btn.setPointerCapture(e.pointerId); pTouchDirs.add(dir); btn.classList.add("pressed"); });
  const release = e => { e.preventDefault(); pTouchDirs.delete(dir); btn.classList.remove("pressed"); };
  btn.addEventListener("pointerup", release); btn.addEventListener("pointercancel", release);
  btn.addEventListener("lostpointercapture", () => { pTouchDirs.delete(dir); btn.classList.remove("pressed"); });
});

function endPencilGame(won, text) {
  if (pGameState !== "playing") return;
  pGameState = won ? "won" : "lost";
  if (pAnimId) { cancelAnimationFrame(pAnimId); pAnimId = null; }
  document.getElementById("pencilGame").classList.add("hidden");
  finalScreen.style.display = "flex"; finalScreen.classList.remove("hidden");
  finalScreen.style.background = won ? "#fff0f5" : "#ffe4e1";
  const finalImg = won ? kirbyFeliz : kirbyTriste;
  finalScreen.innerHTML = `
    ${won ? `<h1>✏️ ¡Misión cumplida! ✏️</h1>` : `<h1>😱 ¡Te atraparon!</h1>`}
    <img src="${finalImg}" width="180">
    <p>${text}</p>
    <p>✏️ Lápices: ${pCollected}/5</p>
    <button id="btnRestart">Volver al inicio</button>
  `;
  const btnR = document.getElementById("btnRestart");
  btnR.addEventListener("click", () => { finalScreen.style.display="none"; finalScreen.classList.add("hidden"); startScreen.style.display="flex"; });
  btnR.addEventListener("touchstart", (e) => { e.preventDefault(); finalScreen.style.display="none"; finalScreen.classList.add("hidden"); startScreen.style.display="flex"; }, { passive: false });
}

});
