// Idea 2: aparecer al bajar, camas que se abren en la foto y el video que corre solo cuando se ve.
(() => {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conMouse = matchMedia("(hover: hover)").matches;

  // 1. cada cama: la foto de base es la cerrada y la abierta aparece encima (si la abierta todavía no
  //    cargó, se ve la cerrada con la etiqueta "Cerrada": nunca se contradicen)
  const FOTOS = {
    "cama-kng.html": ["assets/reales/kng-blanco-3.jpg", "assets/reales/kng-blanco-2.jpg"],
    "cama-kng-scotch.html": ["assets/reales/kng-scotch-3.jpg", "assets/reales/kng-scotch-2.jpg"],
    "cama-kng-individual.html": ["assets/reales/individual-2.jpg", "assets/reales/individual-3.jpg"],
    "combo-kng.html": ["assets/reales/combo-kng-1.jpg", "assets/reales/combo-kng-3.jpg"],
  };
  const conDosFotos = [];
  document.querySelectorAll("#grilla .producto").forEach((a) => {
    const fotos = FOTOS[a.getAttribute("href")];
    if (!fotos) return;
    const caja = a.querySelector(".foto");
    const cerrada = caja.querySelector("img");
    cerrada.src = fotos[0];
    const abierta = document.createElement("img");
    abierta.className = "abierta-foto";
    abierta.src = fotos[1];
    abierta.alt = cerrada.alt + " (abierta)";
    abierta.loading = "lazy";
    caja.appendChild(abierta);
    const etiqueta = document.createElement("span");
    etiqueta.className = "que-ves";
    etiqueta.setAttribute("aria-hidden", "true");
    caja.appendChild(etiqueta);
    conDosFotos.push(a);
  });
  // en el celular no hay mouse: se abre cuando pasa por el medio de la pantalla
  if (!conMouse) {
    const medio = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("abierta", e.isIntersecting)),
      { rootMargin: "-38% 0px -38% 0px" });
    conDosFotos.forEach((a) => medio.observe(a));
  }

  // 2. el video corre solo mientras se ve (no gasta batería ni datos de más)
  const video = document.querySelector(".en-video video");
  if (video) {
    if (quieto) {
      video.removeAttribute("loop");
    } else {
      new IntersectionObserver(([e]) => { if (e.isIntersecting) video.play().catch(() => {}); else video.pause(); },
        { threshold: 0.25 }).observe(video);
    }
  }

  // 3. sombra de la cabecera al bajar
  const cabecera = document.querySelector(".cabecera");
  const sombra = () => cabecera.classList.toggle("con-sombra", scrollY > 8);
  addEventListener("scroll", sombra, { passive: true });
  sombra();

  // sin animaciones (o navegador viejo sin IntersectionObserver): todo visible, quieto
  if (quieto || !("IntersectionObserver" in window)) {
    document.documentElement.classList.remove("con-movimiento");
    return;
  }

  // 4. aparecer al bajar: los grupos (tarjetas, colores, preguntas) entran uno detrás de otro
  const GRUPOS = [
    ["#grilla > .producto", () => (innerWidth >= 900 ? 4 : 2), 0.09],
    ["#muestrario > li", () => (innerWidth >= 900 ? 5 : 3), 0.06],
    [".preguntas > details", () => 1, 0.05],
    [".zonas > li", () => 2, 0.04],
    [".fotos-fabrica > img", () => 2, 0.1],
  ];
  const SUELTOS = [".seccion-cabeza", ".comparar", ".en-video-texto", ".en-video-medio",
    "#envios .dos-col > div", "#fabrica .dos-col > div:first-child", ".mapa", ".pie .contenedor > div"];
  const observador = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    observador.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  const marcar = (el, retraso) => {
    el.classList.add("aparece");
    if (retraso) el.style.setProperty("--retraso", retraso + "s");
    observador.observe(el);
  };
  GRUPOS.forEach(([sel, columnas, paso]) => {
    document.querySelectorAll(sel).forEach((el, i) => marcar(el, Math.min((i % columnas()) * paso, 0.4)));
  });
  SUELTOS.forEach((sel) => document.querySelectorAll(sel).forEach((el) => marcar(el, 0)));
})();
