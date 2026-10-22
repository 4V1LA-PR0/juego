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
    RAIZ + "audios/perdio3.mp3",
    RAIZ + "audios/perdio4.mp3",
    RAIZ + "audios/perdio5.mp3"
  ];

  const finalScreen = document.getElementById("finalScreen");
  if (!finalScreen) return;

  let perdidas = 0;      // cuántas veces ha perdido
  let audioActual = null;

  // Precargar la imagen para que cambie al instante
  new Image().src = IMG_BOCA;

  function prepararKirby(img) {
    const imagenNormal = img.getAttribute("src");
    const audioSrc = AUDIOS[perdidas % AUDIOS.length];
    perdidas++;

    img.dataset.listo = "1";
    img.style.cursor = "pointer";

    const aviso = document.createElement("p");
    aviso.textContent = "👆 Toca a Kirby";
    img.insertAdjacentElement("afterend", aviso);

    img.addEventListener("click", () => {
      if (audioActual) audioActual.pause();

      img.src = IMG_BOCA;

      audioActual = new Audio(audioSrc);
      audioActual.addEventListener("ended", () => { img.src = imagenNormal; });
      audioActual.play().catch(() => { img.src = imagenNormal; });
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