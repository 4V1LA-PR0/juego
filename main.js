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
const finalScreen = document.getElementById("final");
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
  canvas.style.display = "block";
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
  canvas.style.display = "none";
  finalScreen.style.display = "flex";
  finalScreen.style.background = "#fff0f5";
  
  let result = "";
  if (score >= targetFlowers) {
    result = `<h1> ¡Ganaste! </h1>
              <p>¡Asi es Doñita!</p>`;
  } else if (score >= 7) {
    result = `<h1>Un poco mas</h1>
              <p>Casi lo logras Doña/p>`;
  } else if (score >= 5) {
    result = `<h1>Buen intento </h1>
              <p>Si no gana le robo los lapices</p>`;
  } else {
    result = `<h1>Perdiste</h1>
              <p>Nambe doña</p>`;
  }
  
  finalScreen.innerHTML = `
    ${result}
    <p>🌸 Rosas recolectadas: ${score}/${targetFlowers}</p>
    <p>❤️ Vidas restantes: ${lives}</p>
    <button onclick="location.reload()">Volver a jugar</button>
  `;
}
});