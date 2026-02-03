document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Hacer canvas responsive para celulares
function resizeCanvas() {
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.9;
  const ratio = 360 / 640; // Proporción original del canvas
  
  let newWidth = maxWidth;
  let newHeight = newWidth / ratio;
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * ratio;
  }
  
  canvas.style.width = newWidth + "px";
  canvas.style.height = newHeight + "px";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
}

// Aplicar tamaño responsive al cargar y al cambiar de orientación
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

const startScreen = document.getElementById("start");
const finalScreen = document.getElementById("finalScreen");
const btnStart = document.getElementById("btnStart");

let gameRunning = false;
let level = 1;

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
  // reinicio al nivel 1
  level = 1;
  startScreen.style.display = "none";
  finalScreen.style.display = "none";
  document.getElementById("cardGame").classList.add("hidden");
  // ocultar scoreboard si estaba visible
  if (scoreBoard) scoreBoard.style.display = "none";
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
      if (collectedFlowers >= 10) endLevel1();
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

function endLevel1() {
  if (!gameRunning) return;
  gameRunning = false;

  canvas.style.display = "none";
  finalScreen.style.display = "flex";
  finalScreen.style.background = "#fff0f5";

  finalScreen.innerHTML = `
    <h1>🌸 Nivel superado 🌸</h1>
    <p>Kirby recolectó todas las flores</p>
    <button id="btnNext">Siguiente nivel ➜</button>
  `;

  const btnNext = document.getElementById("btnNext");

  btnNext.addEventListener("click", startCatchGame);
  btnNext.addEventListener("touchstart", e => {
    e.preventDefault();
    startCatchGame();
  }, { passive: false });
}

//nivel 2 - Fruit Ninja Style Game
let score = 0;
let lives = 3;
let gameTimer = null;
let gameDuration = 60000; // 60 segundos
let startTime = 0;
let targetFlowers = 10; // Objetivo de flores a recolectar

// Imágenes de objetos
let rosaImg = new Image();
rosaImg.src = "img/rosa.png";

let rosafalsaImg = new Image();
// usar la imagen de engaño para las rosas falsas
rosafalsaImg.src = "img/engaño.png";

let enganoImg = new Image();
// segunda flor falsa (puedes reemplazar la imagen)
enganoImg.src = "img/falsa.png";

let bombaImg = new Image();
bombaImg.src = "img/bomba.png";

// Fondo del nivel 2
let bgLevel2Img = new Image();
bgLevel2Img.src = "img/fondo2.jpg"; // Reemplaza con tu imagen de fondo

// Array de objetos que caen
let fallingObjects = [];
let scoreBoard = document.getElementById("scoreBoard");

// Crear scoreBoard si no existe
if (!scoreBoard) {
  scoreBoard = document.createElement("div");
  scoreBoard.id = "scoreBoard";
  scoreBoard.style.position = "fixed";
  scoreBoard.style.top = "10px";
  scoreBoard.style.left = "10px";
  scoreBoard.style.fontSize = "20px";
  scoreBoard.style.fontWeight = "bold";
  scoreBoard.style.color = "#FFB6D9";
  scoreBoard.style.zIndex = "1000";
  document.body.appendChild(scoreBoard);
}

function startCatchGame() {
  level = 2;
  score = 0;
  lives = 3;
  gameRunning = true;
  fallingObjects = [];
  startTime = Date.now();
  finalScreen.style.display = "none";
  // mostrar canvas y el scoreBoard (por si estaban ocultos al pasar a nivel 3)
  canvas.style.display = "block";
  if (scoreBoard) scoreBoard.style.display = "block";
  scoreBoard.textContent = `🌸: ${score}/${targetFlowers} | ❤️: ${lives} | ⏱️: 60s`;
  
  // Generar objetos continuamente (más lentamente)
  const spawnInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(spawnInterval);
      return;
    }
    spawnObject();
  }, 1000); // reducido a 1000ms para más objetos (balance)
  
  // Actualizar juego
  const gameLoop = setInterval(() => {
    if (!gameRunning) {
      clearInterval(gameLoop);
      return;
    }
    updateGame();
  }, 30);
  
  // Actualizar cronómetro cada segundo
  const timerInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(timerInterval);
      return;
    }
    const elapsed = Math.ceil((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, 60 - elapsed);
    scoreBoard.textContent = `🌸: ${score}/${targetFlowers} | ❤️: ${lives} | ⏱️: ${remaining}s`;
  }, 1000);
  
  // Terminar juego después del tiempo o cuando recolectes 10 flores
  gameTimer = setTimeout(() => {
    clearInterval(spawnInterval);
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    gameRunning = false;
    endCatchGame();
  }, gameDuration);
}

// Crear un objeto que cae
function spawnObject() {
  if (!gameRunning) return;
  
  // Probabilidades ajustadas: 35% rosa, 22% rosafals, 22% engano, 21% bomba
  const rand = Math.random();
  let type;
  if (rand < 0.35) {
    type = "rosa";
  } else if (rand < 0.57) {
    type = "rosafals";
  } else if (rand < 0.79) {
    type = "engano";
  } else {
    type = "bomba";
  }
  
  fallingObjects.push({
    x: Math.random() * (canvas.width - 50),
    y: -50,
    size: 50,
    vy: 2.8 + Math.random() * 2, // Velocidad aumentada para mayor dificultad
    vx: (Math.random() - 0.5) * 1,
    type: type,
    active: true,
    rotation: 0
  });
}

// Actualizar posiciones de objetos
function updateGame() {
  // Dibujar fondo del nivel 2
  if (bgLevel2Img.complete) {
    ctx.drawImage(bgLevel2Img, 0, 0, canvas.width, canvas.height);
  } else {
    // Si la imagen no ha cargado, dibuja un fondo de color
    ctx.fillStyle = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  fallingObjects = fallingObjects.filter(obj => {
    if (!obj.active) return false;
    
    // Actualizar posición
    obj.y += obj.vy;
    obj.x += obj.vx;
    
    // Rotación simple
    obj.rotation += 0.05;
    
    // Dibujar objeto según tipo
    if (obj.type === "rosa" && rosaImg.complete) {
      ctx.save();
      ctx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2);
      ctx.rotate(obj.rotation);
      ctx.drawImage(rosaImg, -obj.size / 2, -obj.size / 2, obj.size, obj.size);
      ctx.restore();
    } else if (obj.type === "rosafals" && rosafalsaImg.complete) {
      ctx.save();
      ctx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2);
      ctx.rotate(obj.rotation);
      ctx.drawImage(rosafalsaImg, -obj.size / 2, -obj.size / 2, obj.size, obj.size);
      ctx.restore();
    } else if (obj.type === "engano" && enganoImg.complete) {
      ctx.save();
      ctx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2);
      ctx.rotate(obj.rotation);
      ctx.drawImage(enganoImg, -obj.size / 2, -obj.size / 2, obj.size, obj.size);
      ctx.restore();
    } else if (obj.type === "bomba" && bombaImg.complete) {
      ctx.save();
      ctx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2);
      ctx.rotate(obj.rotation);
      ctx.drawImage(bombaImg, -obj.size / 2, -obj.size / 2, obj.size, obj.size);
      ctx.restore();
    }
    
    // Si sale de pantalla (toca el fondo sin tocar)
    if (obj.y > canvas.height) {
      if (obj.type === "rosa") {
        // Perdiste una rosa, resta vida
        lives--;
        const elapsed = Math.ceil((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, 60 - elapsed);
        scoreBoard.textContent = `🌸: ${score}/${targetFlowers} | ❤️: ${lives} | ⏱️: ${remaining}s`;
        if (lives <= 0) {
          gameRunning = false;
          endCatchGame();
        }
      }
      return false;
    }
    
    return true;
  });
}

// Detectar clicks/toques
function handleTap(mx, my) {
  if (!gameRunning) return;
  
  // Revisar de atrás hacia adelante (últimos objetos primero)
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    const obj = fallingObjects[i];
    if (!obj.active) continue;
    
    // Verificar si el tap está dentro del objeto
    const dx = (mx - (obj.x + obj.size / 2));
    const dy = (my - (obj.y + obj.size / 2));
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < obj.size / 2) {
      const elapsed = Math.ceil((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      
      if (obj.type === "rosa") {
        score++;
        obj.active = false;
        scoreBoard.textContent = `🌸: ${score}/${targetFlowers} | ❤️: ${lives} | ⏱️: ${remaining}s`;
        
        // Si recolectaste 10 flores, ¡ganaste!
        if (score >= targetFlowers) {
          gameRunning = false;
          endCatchGame();
        }
      } else if (obj.type === "rosafals") {
        // Tocaste una rosa falsa, pierdes vida
        lives--;
        obj.active = false;
        scoreBoard.textContent = `🌸: ${score}/${targetFlowers} | ❤️: ${lives} | ⏱️: ${remaining}s`;
        if (lives <= 0) {
          gameRunning = false;
          endCatchGame();
        }
      } else if (obj.type === "engano") {
        // Tocaste la otra flor falsa, pierdes vida
        lives--;
        obj.active = false;
        scoreBoard.textContent = `🌸: ${score}/${targetFlowers} | ❤️: ${lives} | ⏱️: ${remaining}s`;
        if (lives <= 0) {
          gameRunning = false;
          endCatchGame();
        }
      } else if (obj.type === "bomba") {
        // Tocaste una bomba, pierdes vida
        lives--;
        obj.active = false;
        scoreBoard.textContent = `🌸: ${score}/${targetFlowers} | ❤️: ${lives} | ⏱️: ${remaining}s`;
        if (lives <= 0) {
          gameRunning = false;
          endCatchGame();
        }
      }
      break;
    }
  }
}

canvas.addEventListener("click", e => {
  if (!gameRunning) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  handleTap(mx, my);
});

canvas.addEventListener("touchstart", e => {
  if (!gameRunning) return;
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const mx = t.clientX - rect.left;
  const my = t.clientY - rect.top;
  handleTap(mx, my);
  e.preventDefault();
}, { passive: false });

function endCatchGame() {
  gameRunning = false;
  // prevenir que el timeout global se dispare después (si quedó activo)
  clearTimeout(gameTimer);
  canvas.style.display = "none";
  finalScreen.style.display = "flex";
  finalScreen.style.background = "#fff0f5";
  
  let result = "";
  if (score >= targetFlowers) {
    result = `<h1> ¡Ganaste! </h1>
              <p>¡Asi es Doñita!</p>`;
  } else if (score >= 7) {
    result = `<h1>Un poco mas</h1>
              <p>Casi lo logras Doña</p>`;
  } else if (score >= 5) {
    result = `<h1>Buen intento </h1>
              <p>Si no gana le robo los lapices</p>`;
  } else {
    result = `<h1>Perdiste</h1>
              <p>Nambe doña</p>`;
  }
  // elegir imagen final según si ganó o no
  const finalImg = score >= targetFlowers ? kirbyFeliz : kirbyTriste;

  finalScreen.innerHTML = `
    ${result}
    <img src="${finalImg}" width="180">
    <p>🌸 Rosas recolectadas: ${score}/${targetFlowers}</p>
    <p>❤️ Vidas restantes: ${lives}</p>
    <button id="btnNextLevel">Siguiente nivel ➜</button>
  `;

  const btnNextLevel = document.getElementById("btnNextLevel");
  btnNextLevel.addEventListener("click", startCardGame);
  btnNextLevel.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startCardGame();
  }, { passive: false });
}

//nivel 3
const images = [
  "ella/tu.jpg",
  "ella/tu2.jpg",
  "ella/tu3.jpg",
  "ella/tu4.jpg",
  "ella/tu5.jpg",
  "ella/tu6.jpg",
  "ella/tu7.png",
  "ella/tu8.jpg",
 
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
// temporizador nivel 3
let cardTimerInterval = null;
let cardTimeRemaining = 60; // segundos
let cardTimeout = null;

function startCardGame() {
  level = 3;
  // evitar que el temporizador del nivel 2 siga ejecutándose
  clearTimeout(gameTimer);
  // detener lógica del nivel 2
  gameRunning = false;
  // ocultar canvas y scoreBoard del nivel 2
  canvas.style.display = "none";
  if (scoreBoard) scoreBoard.style.display = "none";
  // ocultar/limpiar ambos elementos finales por si alguno quedó visible
 const finalScreenDiv = document.getElementById("finalScreen");
if (finalScreenDiv) {
    finalScreenDiv.style.display = "none";
    finalScreenDiv.innerHTML = "";
}

  // limpiar scoreBoard
  if (scoreBoard) scoreBoard.textContent = "";
  document.getElementById("cardGame").classList.remove("hidden");
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  matches = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  cards = [...images, ...images]
    .sort(() => 0.5 - Math.random());

  cards.forEach(img => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"><img src="${img}"></div>
        <div class="card-face card-back"><img src="ella/fondo.png"></div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card, img));
    board.appendChild(card);
  });

  // Crear/mostrar temporizador de 60s dentro de #cardGame
  const cardGameDiv = document.getElementById("cardGame");
  let timerEl = document.getElementById("cardTimer");
  if (!timerEl) {
    timerEl = document.createElement("div");
    timerEl.id = "cardTimer";
    timerEl.style.color = "#fff";
    timerEl.style.fontSize = "22px";
    timerEl.style.marginBottom = "12px";
    cardGameDiv.insertBefore(timerEl, board);
  }
  // reiniciar y arrancar
  clearInterval(cardTimerInterval);
  clearTimeout(cardTimeout);
  cardTimeRemaining = 60;
  timerEl.textContent = `⏱️ ${cardTimeRemaining}s`;
  cardTimerInterval = setInterval(() => {
    cardTimeRemaining -= 1;
    timerEl.textContent = `⏱️ ${cardTimeRemaining}s`;
    if (cardTimeRemaining <= 0) {
      clearInterval(cardTimerInterval);
      endCardGame();
    }
  }, 1000);
  cardTimeout = setTimeout(() => {
    clearInterval(cardTimerInterval);
    endCardGame();
  }, 60 * 1000);
}

function flipCard(card, img) {
  if (lockBoard || card === firstCard) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    firstCard.dataset.img = img;
    return;
  }

  secondCard = card;
  secondCard.dataset.img = img;
  lockBoard = true;

  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.img === secondCard.dataset.img) {
    matches++;
    resetTurn();

    if (matches === images.length) {
      setTimeout(winCardGame, 500);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function winCardGame() {
  clearInterval(cardTimerInterval);
  clearTimeout(cardTimeout);

  document.getElementById("cardGame").classList.add("hidden");

  finalScreen.style.display = "flex"; // 👈 Agregar esta línea
  finalScreen.classList.remove("hidden");
  finalScreen.innerHTML = `
    <h1>💖 ¡Ganaste! 💖</h1>
    <p>Encontraste todos los pares — jajjaa</p>
    <img src="img/ganastes.png" width="180">
    <button id="btnNextLevel">Siguiente nivel ➜</button>
  `;

  const btnNextLevel = document.getElementById("btnNextLevel"); // 👈 Crear variable
  btnNextLevel.addEventListener("click", () => {
    finalScreen.style.display = "none";
    startBrickGame();
  });
  
  // 👇 Agregar también listener para touch
  btnNextLevel.addEventListener("touchstart", (e) => {
    e.preventDefault();
    finalScreen.style.display = "none";
    startBrickGame();
  }, { passive: false });
}

function endCardGame() {
  // termina el nivel 3 por tiempo
  lockBoard = true;
  clearInterval(cardTimerInterval);
  clearTimeout(cardTimeout);
  document.getElementById("cardGame").classList.add("hidden");
  finalScreen.classList.remove("hidden");
  const totalPairs = images.length;
  const foundPairs = matches;
  let msg = "";
  let showNextBtn = false;
  if (foundPairs === totalPairs) {
    msg = `<h1>💖 ¡Ganaste! 💖</h1><p>Encontraste todos los pares</p>`;
    showNextBtn = true;
  } else if (foundPairs > 0) {
    msg = `<h1>⏱️ Tiempo!</h1><p>Encontraste ${foundPairs}/${totalPairs} pares</p>`;
    showNextBtn = true;
  } else {
    msg = `<h1>⏱️ Tiempo!</h1><p>No encontraste pares</p>`;
  }
  finalScreen.innerHTML = `
    ${msg}
    <button id="btnAction">${showNextBtn ? 'Siguiente nivel ➜' : 'Reiniciar'}</button>
  `;

  const btnAction = document.getElementById("btnAction");
  btnAction.addEventListener("click", () => {
    if (showNextBtn) {
      startBrickGame();
    } else {
      startGame();
    }
  });
  btnAction.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (showNextBtn) {
      startBrickGame();
    } else {
      startGame();
    }
  }, { passive: false });
}

});

// ===== NIVEL 4 - BREAKOUT GAME =====
let brickGameState = {
  ballRadius: 8,
  x: 0,
  y: 0,
  dx: 20,  // 👈 Cambia esto, 20 es demasiado rápido
  dy: -20, // 👈 Cambia esto también
  paddleHeight: 10,
  paddleWidth: 75,
  paddleX: 0,
  rightPressed: false,
  leftPressed: false,
  score: 0,
  gameRunning: false,
  bricks: [],
  brickRowCount: 5,
  brickColumnCount: 7,
  brickWidth: 55,
  brickHeight: 20,
  brickPadding: 10,
  brickOffsetTop: 30,
  brickOffsetLeft: 30,
  brickAnimationId: null,
  keydownHandler: null,
  keyupHandler: null,
  kirbyBallImg: null,
  ballRotation: 0  // 👈 Agregar rotación aquí
};

function startBrickGame() {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const finalScreen = document.getElementById("finalScreen");

  brickGameState.gameRunning = true;

  if (!brickGameState.kirbyBallImg) {
    brickGameState.kirbyBallImg = new Image();
    brickGameState.kirbyBallImg.src = "img/pelota.png";
  }

  finalScreen.style.display = "none";
  canvas.style.display = "block";

  if (document.getElementById("scoreBoard")) {
    document.getElementById("scoreBoard").style.display = "none";
  }
  document.getElementById("cardGame").classList.add("hidden");

  // Reiniciar estado
  brickGameState.score = 0;
  brickGameState.ballRadius = 8;
  brickGameState.ballRotation = 0; // 👈 Reiniciar rotación
  brickGameState.x = canvas.width / 2;
  brickGameState.y = canvas.height - 30;
  brickGameState.dx = 2;
  brickGameState.dy = -2;
  brickGameState.paddleX = (canvas.width - brickGameState.paddleWidth) / 2;
  brickGameState.rightPressed = false;
  brickGameState.leftPressed = false;
  brickGameState.bricks = [];

  // Ajuste automático del ancho de ladrillos
  const totalPadding = (brickGameState.brickColumnCount - 1) * brickGameState.brickPadding;
  brickGameState.brickWidth =
    (canvas.width - brickGameState.brickOffsetLeft * 2 - totalPadding) /
    brickGameState.brickColumnCount;

  // Crear ladrillos
  for (let c = 0; c < brickGameState.brickColumnCount; c++) {
    brickGameState.bricks[c] = [];
    for (let r = 0; r < brickGameState.brickRowCount; r++) {
      brickGameState.bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  // Controles
  brickGameState.keydownHandler = (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") brickGameState.rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") brickGameState.leftPressed = true;
  };

  brickGameState.keyupHandler = (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") brickGameState.rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") brickGameState.leftPressed = false;
  };

  document.addEventListener("keydown", brickGameState.keydownHandler);
  document.addEventListener("keyup", brickGameState.keyupHandler);

  // Touch
  canvas.addEventListener("touchmove", (e) => {
    if (!brickGameState.gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    brickGameState.paddleX = touchX - brickGameState.paddleWidth / 2;
    if (brickGameState.paddleX < 0) brickGameState.paddleX = 0;
    if (brickGameState.paddleX + brickGameState.paddleWidth > canvas.width) {
      brickGameState.paddleX = canvas.width - brickGameState.paddleWidth;
    }
    e.preventDefault();
  }, { passive: false });

  brickGameLoop(canvas, ctx, finalScreen);
}

function brickGameLoop(canvas, ctx, finalScreen) {
  if (!brickGameState.gameRunning) return;

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar ladrillos
  for (let c = 0; c < brickGameState.brickColumnCount; c++) {
    for (let r = 0; r < brickGameState.brickRowCount; r++) {
      if (brickGameState.bricks[c][r].status === 1) {
        const brickX = c * (brickGameState.brickWidth + brickGameState.brickPadding) + brickGameState.brickOffsetLeft;
        const brickY = r * (brickGameState.brickHeight + brickGameState.brickPadding) + brickGameState.brickOffsetTop;
        brickGameState.bricks[c][r].x = brickX;
        brickGameState.bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickGameState.brickWidth, brickGameState.brickHeight);
        ctx.fillStyle = "#ff0066";
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  // Pelota con rotación
  if (brickGameState.kirbyBallImg && brickGameState.kirbyBallImg.complete) {
    const size = brickGameState.ballRadius * 4;
    
    ctx.save();
    ctx.translate(brickGameState.x, brickGameState.y);
    ctx.rotate(brickGameState.ballRotation);
    ctx.drawImage(
      brickGameState.kirbyBallImg,
      -size / 2,
      -size / 2,
      size,
      size
    );
    ctx.restore();
    
    // Incrementar rotación
    brickGameState.ballRotation += 0.1;
  } else {
    // Si la imagen no carga, usa el círculo normal
    ctx.beginPath();
    ctx.arc(brickGameState.x, brickGameState.y, brickGameState.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffcc";
    ctx.fill();
    ctx.closePath();
  }

  // Paleta
  ctx.beginPath();
  ctx.rect(brickGameState.paddleX, canvas.height - brickGameState.paddleHeight, brickGameState.paddleWidth, brickGameState.paddleHeight);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();

  // Puntaje
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Puntos: " + brickGameState.score, 8, 20);

  // Colisiones con ladrillos
  for (let c = 0; c < brickGameState.brickColumnCount; c++) {
    for (let r = 0; r < brickGameState.brickRowCount; r++) {
      const b = brickGameState.bricks[c][r];
      if (b.status === 1) {
        if (
          brickGameState.x > b.x &&
          brickGameState.x < b.x + brickGameState.brickWidth &&
          brickGameState.y > b.y &&
          brickGameState.y < b.y + brickGameState.brickHeight
        ) {
          brickGameState.dy = -brickGameState.dy;
          b.status = 0;
          brickGameState.score++;

          if (brickGameState.score === brickGameState.brickRowCount * brickGameState.brickColumnCount) {
            endBrickGame(true, canvas, finalScreen);
            return;
          }
        }
      }
    }
  }

  // Rebotes
  if (brickGameState.x + brickGameState.dx > canvas.width - brickGameState.ballRadius || brickGameState.x + brickGameState.dx < brickGameState.ballRadius) {
    brickGameState.dx = -brickGameState.dx;
  }
  if (brickGameState.y + brickGameState.dy < brickGameState.ballRadius) {
    brickGameState.dy = -brickGameState.dy;
  } else if (brickGameState.y + brickGameState.dy > canvas.height - brickGameState.ballRadius) {
    if (brickGameState.x > brickGameState.paddleX && brickGameState.x < brickGameState.paddleX + brickGameState.paddleWidth) {
      brickGameState.dy = -brickGameState.dy;
    } else {
      endBrickGame(false, canvas, finalScreen);
      return;
    }
  }

  // Movimiento paleta
  if (brickGameState.rightPressed && brickGameState.paddleX < canvas.width - brickGameState.paddleWidth) {
    brickGameState.paddleX += 5;
  } else if (brickGameState.leftPressed && brickGameState.paddleX > 0) {
    brickGameState.paddleX -= 5;
  }

  // Actualizar pelota
  brickGameState.x += brickGameState.dx;
  brickGameState.y += brickGameState.dy;

  brickGameState.brickAnimationId = requestAnimationFrame(() => brickGameLoop(canvas, ctx, finalScreen));
}

function endBrickGame(won, canvas, finalScreen) {
  brickGameState.gameRunning = false;

  if (brickGameState.brickAnimationId) {
    cancelAnimationFrame(brickGameState.brickAnimationId);
    brickGameState.brickAnimationId = null;
  }

  document.removeEventListener("keydown", brickGameState.keydownHandler);
  document.removeEventListener("keyup", brickGameState.keyupHandler);

  canvas.style.display = "none";
  finalScreen.style.display = "flex";
  finalScreen.style.background = won ? "#fff0f5" : "#ffe4e1";

  finalScreen.innerHTML = won
    ? `<h1>🎉 ¡GANASTE! 🎉</h1>
       <img src="img/ganastes.png" width="180">
       <p>¡Rompiste todos los bloques! 💥</p>
       <button id="btnRestart">Reiniciar</button>`
    : `<h1>💀 GAME OVER 💀</h1>
       <img src="img/perdio.png" width="180">
       <p>Puntos: ${brickGameState.score}/${brickGameState.brickRowCount * brickGameState.brickColumnCount}</p>
       <button id="btnRestart">Reiniciar</button>`;

  document.getElementById("btnRestart").addEventListener("click", () => {
    finalScreen.style.display = "none";
    document.getElementById("start").style.display = "flex";
  });
}