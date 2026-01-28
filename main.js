const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start");
const finalScreen = document.getElementById("final");

let gameRunning = false;

// Kirby jugador
const kirby = { x: 100, y: 250, w: 40, h: 40, dy: 0 };
const kirbyImg = new Image();
kirbyImg.src = "img/kirby.png";

// Fondo
const fondo = new Image();
fondo.src = "img/fondo.jpg";

// Flores
let flowers = [];
const flowerImg = new Image();
flowerImg.src = "img/flor.png";

// Nubes (obstáculos)
let clouds = [];
const cloudImg = new Image();
cloudImg.src = "img/nube.png";

// Contador de flores
let collectedFlowers = 0;

// Configuración
const gravity = 0.30;
const jump = -5;
const flowerSpacing = 200; // distancia entre flores
const cloudSpacing = 300;  // distancia entre nubes
let frameCount = 0;

// Imágenes finales
const kirbyFeliz = "img/ganastes.png";
const kirbyTriste = "img/perdio.png";

function startGame() {
  startScreen.style.display = "none";
  canvas.style.display = "block";
  finalScreen.style.display = "none";

  gameRunning = true;
  kirby.y = 250;
  kirby.dy = 0;
  flowers = [];
  clouds = [];
  frameCount = 0;
  collectedFlowers = 0;

  loop();
}

// Controles
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") kirby.dy = jump;
});
document.addEventListener("mousedown", () => {
  kirby.dy = jump;
});

// Crear flores
function createFlower() {
  const y = Math.random() * (canvas.height - 100) + 50;
  flowers.push({ x: canvas.width, y });
}

// Crear nube
function createCloud() {
  const y = Math.random() * (canvas.height - 150);
  clouds.push({ x: canvas.width, y, w: 80, h: 60 });
}

// Dibujar fondo
function drawBackground() {
  if (fondo.complete) {
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#a0e7ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Dibujar Kirby
function drawKirby() {
  ctx.drawImage(kirbyImg, kirby.x, kirby.y, kirby.w, kirby.h);
}

// Dibujar flores
function drawFlowers() {
  flowers.forEach(f => {
    ctx.drawImage(flowerImg, f.x - 12, f.y - 12, 24, 24);
  });
}

// Dibujar nubes
function drawClouds() {
  clouds.forEach(c => {
    ctx.drawImage(cloudImg, c.x, c.y, c.w, c.h);
  });
}

// Mover flores y nubes
function moveObjects() {
  flowers.forEach(f => f.x -= 3);
  clouds.forEach(c => c.x -= 3);

  flowers = flowers.filter(f => f.x + 12 > 0);
  clouds = clouds.filter(c => c.x + c.w > 0);
}

// Recolectar flores
function checkFlowers() {
  flowers = flowers.filter(f => {
    const dist = Math.hypot(kirby.x + kirby.w/2 - f.x, kirby.y + kirby.h/2 - f.y);
    if (dist <= 20) {
      collectedFlowers++;
      if (collectedFlowers >= 10) {
        endGame(true); // gana
      }
      return false;
    }
    return true;
  });
}

// Colisión con nubes
function checkCloudCollision() {
  for (let c of clouds) {
    const dx = Math.abs((kirby.x + kirby.w/2) - (c.x + c.w/2));
    const dy = Math.abs((kirby.y + kirby.h/2) - (c.y + c.h/2));
    if (dx < (kirby.w/2 + c.w/2 - 5) && dy < (kirby.h/2 + c.h/2 - 5)) {
      endGame(false); // pierde
    }
  }
}

// Colisión con suelo/techo
function checkBounds() {
  if (kirby.y < 0 || kirby.y + kirby.h > canvas.height) {
    endGame(false); // pierde
  }
}

// Dibujar contador de flores
function drawFlowerCount() {
  ctx.fillStyle = "#ff69b4";
  ctx.font = "25px Arial";
  ctx.fillText("Flores: " + collectedFlowers, 20, 40);
}

// Terminar juego con mensaje y Kirby final
function endGame(won = false) {
  if (!gameRunning) return; // evitar múltiples llamadas
  gameRunning = false;
  canvas.style.display = "none";
  finalScreen.style.display = "block";

  if (won) {
    finalScreen.innerHTML = `
      <h1>¡Kirby recolectó todas las flores! 🌸💖</h1>
      <img src="${kirbyFeliz}" width="200">
      <p>¡Vamos doña!</p>
    `;
  } else {
    finalScreen.innerHTML = `
      <h1>Kirby a caido</h1>
      <img src="${kirbyTriste}" width="200">
      <p>Usted puede doñita</p>
    `;
  }
}

// Loop principal
function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  kirby.dy += gravity;
  kirby.y += kirby.dy;
  drawKirby();

  frameCount++;
  if (frameCount % flowerSpacing === 0) createFlower();
  if (frameCount % cloudSpacing === 0) createCloud();

  moveObjects();
  drawFlowers();
  drawClouds();
  checkFlowers();
  checkCloudCollision();
  checkBounds();

  drawFlowerCount();

  requestAnimationFrame(loop);
}

// Control con pantalla táctil
document.addEventListener("touchstart", (e) => {
  kirby.dy = jump;
  e.preventDefault(); // evita que la pantalla se desplace al tocar
}, { passive: false });

// Saltar con teclado
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") kirby.dy = jump;
});

// Saltar con mouse (PC)
document.addEventListener("mousedown", () => {
  kirby.dy = jump;
});

// Saltar con touch (celular)
document.addEventListener("touchstart", (e) => {
  kirby.dy = jump;
  e.preventDefault();
}, { passive: false });

const btnStart = document.getElementById("btnStart");

// Clic PC
btnStart.addEventListener("click", startGame);

// Touch celular
btnStart.addEventListener("touchstart", (e) => {
  startGame();
  e.preventDefault(); // evita que se genere clic doble
}, { passive: false });

// Empezar tocando la pantalla
document.addEventListener("touchstart", function handler(e) {
  startGame();
  // eliminar este listener después de empezar
  document.removeEventListener("touchstart", handler);
}, { passive: false });
