// Idea 1: el scroll elige el cuadro de la apertura y prende los textos de cada parte.
(() => {
  const seccion = document.getElementById("abrir");
  if (!seccion) return;
  const lienzo = seccion.querySelector("canvas");
  const respaldo = seccion.querySelector(".abrir-respaldo");
  const pista = seccion.querySelector(".abrir-pista");
  const barra = seccion.querySelector(".abrir-barra span");
  const pasos = [...seccion.querySelectorAll("[data-desde]")];

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    respaldo.src = "assets/abrir/abierta.jpg";
    respaldo.alt = "Cama KNG blanca abierta: cajones, bauleras y zapateros";
    pasos.forEach((p) => p.classList.add("prendido"));
    return;
  }

  const N = 64;
  const ctx = lienzo.getContext("2d");
  const cuadros = new Array(N);
  let actual = -1;

  // primero el cerrado, el abierto y algunos del medio (para que nunca quede vacío), después el resto
  const orden = [0, N - 1, 16, 32, 48, 8, 24, 40, 56];
  for (let i = 0; i < N; i++) if (!orden.includes(i)) orden.push(i);
  orden.forEach((i) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => { cuadros[i] = im; if (actual === -1 || i === objetivo) pintar(true); };
    im.src = `assets/abrir/${String(i).padStart(2, "0")}.webp`;
  });

  let objetivo = 0;
  function cercano(i) {           // el cuadro cargado más cercano al pedido
    for (let d = 0; d < N; d++) {
      if (cuadros[i - d]) return i - d;
      if (cuadros[i + d]) return i + d;
    }
    return -1;
  }
  function pintar(forzar) {
    const i = cercano(objetivo);
    if (i < 0 || (i === actual && !forzar)) return;
    ctx.drawImage(cuadros[i], 0, 0, lienzo.width, lienzo.height);
    actual = i;
  }

  // 0 a 1 a lo largo de la sección; la cama queda cerrada al principio y abierta al final un ratito
  function progreso() {
    const r = seccion.getBoundingClientRect();
    const recorrido = seccion.offsetHeight - (innerHeight - 72);
    return Math.min(1, Math.max(0, -r.top / recorrido));
  }
  let pendiente = false;
  function actualizar() {
    pendiente = false;
    const p = progreso();
    const apertura = Math.min(1, Math.max(0, (p - 0.06) / 0.78));
    objetivo = Math.round(apertura * (N - 1));
    pintar(false);
    barra.style.transform = `scaleX(${apertura})`;
    pista.style.opacity = p > 0.04 ? 0 : 1;
    pasos.forEach((el) => el.classList.toggle("prendido", apertura >= parseFloat(el.dataset.desde)));
  }
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); } };
  addEventListener("scroll", pedir, { passive: true });
  addEventListener("resize", pedir);
  actualizar();
})();
