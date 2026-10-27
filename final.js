// ==================================================
// PANTALLA FINAL: ¡HAS PASADO EL JUEGO!
// Sale cuando ganas el último nivel (la misión de los lápices).
// Con confeti y un mensaje que puedes escribir tú.
// No necesitas tocar main.js, solo cargar este archivo después de él.
// ==================================================
document.addEventListener("DOMContentLoaded", () => {

  // ================== ESCRIBE AQUÍ TU MENSAJE ==================
  const TITULO = "🎉 ¡Felicidades DOÑA!";
  const SUBTITULO = "Como lo paso? ni idea pero lo paso";

  // Cada línea de esta lista sale como un párrafo. Puedes poner las que quieras.
  const MENSAJE = [
    "Espero le haya gustado, este juego creado para usted.",
    "Asi se hace doñaa, hasta la proxima!"
  ];

  // Opcional: tu firma o dedicatoria. Déjala vacía ("") si no quieres.
  const FIRMA = "";

  const BOTON = "Volver al inicio";
  // =============================================================

  // Carpeta donde está tu carpeta img (igual que en los otros archivos)
  const RAIZ = "";

  // Imagen de Kirby feliz. Pon "" si no quieres imagen.
  const IMAGEN = RAIZ + "img/ganastes.png";

  // Texto que sale en la pantalla cuando ganas el nivel 4
  // (el título "¡Misión cumplida!" de main.js)
  const TEXTO_VICTORIA = "Misión cumplida";

  const finalScreen = document.getElementById("finalScreen");
  if (!finalScreen) return;

  let mostrando = false;
  let abiertoEn = 0;
  let botonOriginal = null;

  // ---------- Animación de confeti ----------
  const estilo = document.createElement("style");
  estilo.textContent =
    "@keyframes confeti-caer{from{transform:translateY(-12vh) rotate(0deg);}" +
    "to{transform:translateY(112vh) rotate(360deg);}}";
  document.head.appendChild(estilo);

  // ---------- Pantalla de felicitación ----------
  const overlay = document.createElement("div");
  overlay.setAttribute("aria-live", "polite");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:1600;display:none;justify-content:center;" +
    "align-items:center;padding:20px;overflow-y:auto;" +
    "background:linear-gradient(#ccefff,#ffd6eb);" +
    "font-family:'Courier New',monospace;";

  const confeti = document.createElement("div");
  confeti.style.cssText =
    "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;";

  const tarjeta = document.createElement("div");
  tarjeta.style.cssText =
    "position:relative;z-index:1;width:min(100%,460px);margin:auto;padding:24px 20px;" +
    "text-align:center;color:#292343;background:#f4df9b;border:5px solid #8c5e75;" +
    "box-shadow:6px 6px #17152a;";

  const elTitulo = document.createElement("h1");
  elTitulo.style.cssText = "margin:0 0 6px;font-size:28px;color:#7454a0;";
  const elImagen = document.createElement("img");
  elImagen.alt = "Kirby feliz";
  elImagen.style.cssText = "display:block;width:150px;max-width:50%;height:auto;margin:10px auto;";
  const elSubtitulo = document.createElement("h2");
  elSubtitulo.style.cssText = "margin:0 0 12px;font-size:21px;color:#a52b70;";
  const elMensaje = document.createElement("div");
  elMensaje.style.cssText = "font-size:16px;line-height:1.5;";
  const elFirma = document.createElement("p");
  elFirma.style.cssText = "margin:14px 0 0;font-size:15px;font-style:italic;";

  const btnVolver = document.createElement("button");
  btnVolver.type = "button";
  btnVolver.textContent = BOTON;
  btnVolver.style.cssText =
    "margin-top:18px;padding:12px 24px;font:inherit;font-size:17px;font-weight:bold;" +
    "color:#fff;background:#7454a0;border:3px solid #44305f;" +
    "box-shadow:0 4px #44305f;cursor:pointer;";

  tarjeta.append(elTitulo, elImagen, elSubtitulo, elMensaje, elFirma, btnVolver);
  overlay.append(confeti, tarjeta);
  document.body.appendChild(overlay);

  function lanzarConfeti() {
    const emojis = ["🎉", "🌸", "✨", "💖", "⭐", "🎊"];
    confeti.innerHTML = "";
    for (let i = 0; i < 36; i++) {
      const p = document.createElement("span");
      p.textContent = emojis[i % emojis.length];
      p.style.cssText =
        "position:absolute;top:0;left:" + Math.random() * 100 + "%;" +
        "font-size:" + (18 + Math.random() * 20) + "px;" +
        "animation:confeti-caer " + (3 + Math.random() * 4) + "s linear " +
        (Math.random() * 4) + "s infinite;";
      confeti.appendChild(p);
    }
  }

  function mostrar() {
    elTitulo.textContent = TITULO;
    elSubtitulo.textContent = SUBTITULO;

    if (IMAGEN) {
      elImagen.src = IMAGEN;
      elImagen.style.display = "block";
      elImagen.onerror = () => { elImagen.style.display = "none"; };
    } else {
      elImagen.style.display = "none";
    }

    elMensaje.innerHTML = "";
    MENSAJE.forEach(linea => {
      const p = document.createElement("p");
      p.style.cssText = "margin:0 0 8px;";
      p.textContent = linea;
      elMensaje.appendChild(p);
    });

    elFirma.textContent = FIRMA;
    elFirma.style.display = FIRMA ? "block" : "none";

    lanzarConfeti();
    abiertoEn = Date.now();
    mostrando = true;
    overlay.style.display = "flex";
  }

  btnVolver.addEventListener("click", () => {
    // Ignora toques seguidos justo al ganar
    if (Date.now() - abiertoEn < 600) return;

    mostrando = false;
    overlay.style.display = "none";
    confeti.innerHTML = "";

    // Usa el botón "Volver al inicio" original para regresar al principio
    if (botonOriginal && document.body.contains(botonOriginal)) {
      botonOriginal.click();
    } else {
      location.reload();
    }
  });

  // ---------- Detectar que ganaste el último nivel ----------
  const observador = new MutationObserver(() => {
    if (mostrando) return;
    if (finalScreen.textContent.includes(TEXTO_VICTORIA)) {
      botonOriginal = finalScreen.querySelector("button");
      mostrar();
    }
  });

  observador.observe(finalScreen, { childList: true });
});