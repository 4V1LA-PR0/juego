// ==================================================
// INSTRUCCIONES ANTES DE CADA NIVEL
// Antes de empezar cada nivel sale una pantalla que explica de qué trata,
// con un botón "¡Jugar!". Solo sale la primera vez que llegas a cada nivel
// (si pierdes y repites el nivel 1, no te la vuelve a mostrar).
// No necesitas tocar main.js, solo cargar este archivo después de él.
// ==================================================
document.addEventListener("DOMContentLoaded", () => {

  // Aquí puedes cambiar los textos de cada nivel
  const NIVELES = {
    1: {
      emoji: "🌸",
      titulo: "Flappy Kirby",
      objetivo: "Ayuda a Kirby a volar y recoger flores.",
      puntos: [
        "Doña toque la pantalla para que Kirby suba. Si no lo hace, se va a caer peor que las elecciones.",
        "Recoja las 10 flores para pasar de nivel.",
        "Tiene que esquivar las nubes.",
        "Si toca una nube o el borde de arriba o de abajo, pierde."
      ]
    },
    2: {
      emoji: "🐱",
      titulo: "Rescate los gatos blancos y Gatos con audifonos",
      objetivo: "Toque a los gatitos que van cayendo para rescatarlos.",
      puntos: [
        "Toque los gatitos para salvarlos. Tiene que rescatar 10 gatitos",
        "No toque a los gatos negros y alienigenas porque la arañan y le quitan una vida.",
        "Tampoco toque al ratón ni al perro, son bravos.",
        "Tienes 3 vidas. También pierdes una si un gatito cae sin que lo rescates."
      ]
    },
    3: {
      emoji: "🃏",
      titulo: "Encuentra las parejas",
      objetivo: "Voltea las cartas y encuentra todas las parejas.",
      puntos: [
        "Tiene que tocar dos cartas para voltearlas.",
        "Si son iguales, se quedan descubiertas.",
        "Hay 8 parejas por encontrar.",
        "Tiene 60 segundos."
      ]
    },
    4: {
      emoji: "✏️",
      titulo: "La misión de los lápices",
      objetivo: "Recoge los lápices sin que el profesor te vea.",
      puntos: [
        " Mueva a kirby usando los botones ▲ ◀ ▼ ▶.",
        " Recoja los 5 lápices antes de que pasen 30 segundos.",
        " Cuando Anael escriba en la pizarra, puede moverse.",
        " Cuando diga ¡VIGILANDO!, escóndase detrás de un pupitre. Si la ve, pierdes."
      ]
    }
  };

  const TOTAL = Object.keys(NIVELES).length;
  const vistos = new Set();   // niveles que ya mostraron su explicación
  let pendiente = null;       // nivel y botón que esperan a que le des "¡Jugar!"
  let saltar = false;         // true mientras dejamos pasar el botón original
  let abiertoEn = 0;

  // ---------- Pantalla de instrucciones ----------
  const overlay = document.createElement("div");
  overlay.setAttribute("aria-live", "polite");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:1500;display:none;justify-content:center;" +
    "align-items:center;padding:20px;overflow-y:auto;background:#fff0f5;" +
    "font-family:'Courier New',monospace;";

  const tarjeta = document.createElement("div");
  tarjeta.style.cssText =
    "width:min(100%,460px);margin:auto;padding:24px 20px;text-align:center;" +
    "color:#292343;background:#f4df9b;border:5px solid #8c5e75;" +
    "box-shadow:6px 6px #17152a;";

  const elNivel = document.createElement("div");
  elNivel.style.cssText = "font-size:13px;font-weight:bold;letter-spacing:2px;color:#7454a0;";
  const elEmoji = document.createElement("div");
  elEmoji.style.cssText = "font-size:52px;margin:8px 0 4px;";
  const elTitulo = document.createElement("h2");
  elTitulo.style.cssText = "margin:0 0 8px;font-size:24px;color:#7454a0;";
  const elObjetivo = document.createElement("p");
  elObjetivo.style.cssText = "margin:0 0 12px;font-size:16px;font-weight:bold;line-height:1.4;";
  const elLista = document.createElement("ul");
  elLista.style.cssText =
    "margin:0 0 18px;padding:0;list-style:none;text-align:left;font-size:15px;line-height:1.45;";

  const btnJugar = document.createElement("button");
  btnJugar.type = "button";
  btnJugar.textContent = "¡Jugar!";
  btnJugar.style.cssText =
    "padding:12px 28px;font:inherit;font-size:18px;font-weight:bold;color:#fff;" +
    "background:#7454a0;border:3px solid #44305f;box-shadow:0 4px #44305f;cursor:pointer;";

  tarjeta.append(elNivel, elEmoji, elTitulo, elObjetivo, elLista, btnJugar);
  overlay.appendChild(tarjeta);
  document.body.appendChild(overlay);

  function mostrar(nivel, boton) {
    const n = NIVELES[nivel];
    pendiente = { nivel, boton };
    elNivel.textContent = "NIVEL " + nivel + " DE " + TOTAL;
    elEmoji.textContent = n.emoji;
    elTitulo.textContent = n.titulo;
    elObjetivo.textContent = n.objetivo;
    elLista.innerHTML = "";
    n.puntos.forEach(texto => {
      const li = document.createElement("li");
      li.style.cssText = "margin:0 0 8px;";
      li.textContent = texto;
      elLista.appendChild(li);
    });
    abiertoEn = Date.now();
    overlay.style.display = "flex";
  }

  btnJugar.addEventListener("click", () => {
    // Ignora toques seguidos (por ejemplo, un doble toque al botón anterior)
    if (!pendiente || Date.now() - abiertoEn < 400) return;

    const { nivel, boton } = pendiente;
    pendiente = null;
    vistos.add(nivel);
    overlay.style.display = "none";

    // Ahora sí, activa el botón original para que empiece el nivel
    saltar = true;
    try { boton.click(); } finally { saltar = false; }
  });

  // ---------- Saber qué nivel va a empezar cada botón ----------
  function nivelDe(boton) {
    const texto = (boton.textContent || "").toLowerCase();
    const pantallaFinal = document.getElementById("finalScreen");
    const contenidoFinal = pantallaFinal ? pantallaFinal.textContent.toLowerCase() : "";

    switch (boton.id) {
      case "btnStart":     return 1;
      case "btnNext":      return 2;
      case "btnNextLevel":
        if (texto.includes("reiniciar")) return 1;
        return contenidoFinal.includes("pares") ? 4 : 3;
      case "btnAction":    return texto.includes("siguiente") ? 4 : 1;
      case "btnRestart":   return texto.includes("inicio") ? null : 1;
      default:             return null;
    }
  }

  // ---------- Interceptar el botón antes de que main.js empiece el nivel ----------
  function interceptar(e) {
    if (saltar) return;
    const boton = e.target && e.target.closest ? e.target.closest("button") : null;
    if (!boton || overlay.contains(boton)) return;

    const nivel = nivelDe(boton);
    if (!nivel || vistos.has(nivel)) return;     // ya la vio: deja pasar

    e.preventDefault();
    e.stopImmediatePropagation();
    if (overlay.style.display !== "flex") mostrar(nivel, boton);
  }

  document.addEventListener("click", interceptar, true);
  document.addEventListener("touchstart", interceptar, { capture: true, passive: false });
});