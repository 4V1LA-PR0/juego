// ==================================================
// MÚSICA DE FONDO
// Suena mientras juegas los 4 niveles.
// Se pausa en la pantalla de inicio y en las pantallas finales
// (así se escuchan los audios de tus amigos al perder).
// Incluye un botón 🔊 / 🔇 arriba a la derecha para silenciarla.
// ==================================================
document.addEventListener("DOMContentLoaded", () => {

  // Carpeta donde está tu carpeta audios (igual que en perdidas.js)
  const RAIZ = "";

  // Tu canción: ponla en la carpeta audios con este nombre
  const MUSICA = RAIZ + "audios/fondo.mp3";

  // Volumen de 0 a 1 (0.4 = suave, para que no tape los demás audios)
  const VOLUMEN = 0.4;

  const inicio = document.getElementById("start");
  const finalScreen = document.getElementById("finalScreen");
  if (!inicio || !finalScreen) return;

  const musica = new Audio(MUSICA);
  musica.loop = true;
  musica.volume = VOLUMEN;
  musica.preload = "auto";

  let silenciada = false;

  function visible(el) {
    return getComputedStyle(el).display !== "none";
  }

  // Decide si la música debe sonar o estar en pausa
  function actualizar() {
    const jugando = !visible(inicio) && !visible(finalScreen);

    if (jugando && !silenciada) {
      if (musica.paused) musica.play().catch(() => {});
    } else if (!musica.paused) {
      musica.pause();
    }
  }

  // Revisa cada vez que cambian la pantalla de inicio o la final
  const observador = new MutationObserver(actualizar);
  const opciones = { attributes: true, attributeFilter: ["style", "class"] };
  observador.observe(inicio, opciones);
  observador.observe(finalScreen, opciones);

  // El navegador solo deja sonar audio después de un toque del jugador,
  // así que se vuelve a intentar con cada toque o tecla
  ["pointerup", "touchend", "click", "keydown"].forEach(evento => {
    document.addEventListener(evento, actualizar, true);
  });

  // Botón para silenciar
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = "🔊";
  boton.setAttribute("aria-label", "Silenciar música");
  boton.style.cssText =
    "position:fixed;top:10px;right:10px;z-index:2000;width:44px;height:44px;" +
    "border-radius:50%;border:3px solid #44305f;background:#7454a0;" +
    "color:#fff;font-size:20px;cursor:pointer;";
  document.body.appendChild(boton);

  // Que tocar el botón no haga saltar a Kirby en el nivel 1
  ["touchstart", "mousedown"].forEach(evento => {
    boton.addEventListener(evento, e => e.stopPropagation(), { passive: true });
  });

  boton.addEventListener("click", () => {
    silenciada = !silenciada;
    boton.textContent = silenciada ? "🔇" : "🔊";
    actualizar();
  });
});