// ==================================================
// KIRBY HABLA AL PERDER
// Cada vez que pierdes sale un audio distinto (1, 2, 3, 4, 5 y vuelve al 1).
// Al tocar a Kirby abre la boca y suena el audio.
// No necesitas tocar main.js, solo cargar este archivo después de él.
// ==================================================
document.addEventListener("DOMContentLoaded", () => {

  // Carpeta donde están tus imágenes y audios.
  // Si todo está junto a tu index.html, déjala vacía: ""
  const RAIZ = "../juego/";

  // Imagen que sale al perder (la que ya usas) y la nueva con la boca abierta
  const IMG_PIERDE = "perdio.png";
  const IMG_BOCA = RAIZ + "img/kirby_boca.png";

  // Tus 5 audios, en el orden en que van a sonar
  const AUDIOS = [
    RAIZ + "audios/perdio1.mp3",
    RAIZ + "audios/perdio2.mp3",
  ];

  // Tiempo (ms) que se ignoran los toques justo después de perder,
  // para que los toques del juego no activen a Kirby sin querer
  const ESPERA_MS = 800;

  const finalScreen = document.getElementById("finalScreen");
  if (!finalScreen) return;

  let perdidas = 0; // cuántas veces ha perdido

  // Precargar la imagen para que cambie al instante
  new Image().src = IMG_BOCA;

  function prepararKirby(img) {
    const imagenNormal = img.getAttribute("src");
    const audioSrc = AUDIOS[perdidas % AUDIOS.length];
    perdidas++;

    // El audio se carga desde que aparece la pantalla, así suena al tocar
    const audio = new Audio(audioSrc);
    audio.preload = "auto";

    const listoDesde = Date.now() + ESPERA_MS;
    let sonando = false;

    img.dataset.listo = "1";
    img.style.cursor = "pointer";

    const aviso = document.createElement("p");
    aviso.textContent = "👆 Toca a Kirby";
    img.insertAdjacentElement("afterend", aviso);

    function volverNormal() {
      sonando = false;
      img.src = imagenNormal;
    }

    audio.addEventListener("ended", volverNormal);

    // Si el audio no existe o tiene otro nombre, avisa en pantalla
    audio.addEventListener("error", () => {
      volverNormal();
      aviso.textContent = "⚠️ No encontré el audio: " + audioSrc;
    });

    img.addEventListener("click", () => {
      if (Date.now() < listoDesde) return; // toque del juego, no cuenta
      if (sonando) return;                 // ya está sonando, no lo reinicia

      sonando = true;
      img.src = IMG_BOCA;
      audio.currentTime = 0;
      audio.play().catch(() => { volverNormal(); });
    });
  }

  // Cada vez que se muestra una pantalla final, revisa si es de derrota
  const observador = new MutationObserver(() => {
    const img = finalScreen.querySelector("img");
    if (!img || img.dataset.listo) return;
    if ((img.getAttribute("src") || "").endsWith(IMG_PIERDE)) {
      prepararKirby(img);
    }
  });

  observador.observe(finalScreen, { childList: true });
});