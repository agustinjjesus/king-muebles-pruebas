// Ficha de producto: arma la página con los datos de datos.js.
// Cada página de producto tiene <main id="ficha" data-producto="id del producto">.

const main = document.getElementById("ficha");
const P = KM.productos.find((p) => p.id === main.dataset.producto);
const base = P.base || P.nombre;   // "Cama KNG", sin el color
// este producto y los otros colores del mismo modelo que tienen su propia ficha
const variantes = KM.productos.filter((p) => p === P || (p.modelo && p.modelo === P.modelo));
const MEDIDAS = (P.precios.blanco || P.precios.color).map(([m]) => m);
const elegido = { medida: MEDIDAS[0], color: P.color };

// Los precios van por medida, en blanco o en color (cualquier color que no sea Blanco). Sin precio: a consultar.
const tipoDeColor = (color) => (color === "Blanco" ? "blanco" : "color");
function precioDe(color, medida) {
  const fila = (P.precios[tipoDeColor(color)] || []).find(([m]) => m === medida);
  return fila ? fila[1] : null;
}

const textoMedida = (m) => (m.includes("x") ? m : m + " m");
const abrirEnWhatsApp = (a, msg) => {
  a.href = waLink(msg);
  a.target = "_blank";
  a.rel = "noopener";
};

main.innerHTML = `
  <div class="migas"><a href="index.html#catalogo">Catálogo</a> / <a href="index.html?cat=${encodeURIComponent(P.categoria)}#catalogo">${P.categoria}</a> / ${P.nombre}</div>
  <div class="ficha">
    <div class="galeria">
      <div class="principal" id="principal"></div>
      <div class="miniaturas" id="miniaturas"></div>
    </div>

    <div class="info-producto">
      <p class="eyebrow">${P.categoria}</p>
      <h1>${P.nombre}</h1>
      <p class="sub">${P.bajada}</p>

      <p class="precio-ficha" id="precio"></p>
      <p class="precio-nota" id="nota"></p>

      <div class="opcion">
        <span>Medida</span>
        <div class="botones" id="medidas"></div>
        <details class="guia-medidas">
          <summary>¿Qué medida necesito?</summary>
          <table class="tabla-medidas">
            <thead><tr><th>Cama</th><th>Colchón</th></tr></thead>
            <tbody>
              <tr><td>1 plaza</td><td>80 x 190 o 90 x 190 cm</td></tr>
              <tr><td>1 plaza y media</td><td>100 x 190 cm</td></tr>
              <tr><td>2 plazas</td><td>140 x 190 cm</td></tr>
              <tr><td>Queen</td><td>160 x 200 cm</td></tr>
              <tr><td>King</td><td>180 x 200 cm</td></tr>
              <tr><td>Super King</td><td>200 x 200 cm</td></tr>
            </tbody>
          </table>
          <p>Elegí la medida según tu colchón. Si tiene otra medida, consultanos: la hacemos a medida.</p>
        </details>
      </div>
      <div class="opcion">
        <span>Color · <span class="color-elegido" id="color-elegido"></span></span>
        <div class="botones colores" id="colores"></div>
        <p class="colores-nota">Los colores sin precio, a consultar.</p>
        <a class="ver-colores" href="index.html#colores">Ver los colores en grande →</a>
      </div>

      <a class="btn btn-negro btn-ancho" id="consultar">Consultar por WhatsApp</a>
      <a class="btn btn-borde btn-ancho" href="${igLink()}" target="_blank" rel="noopener">Consultar por Instagram</a>
      <button class="compartir" type="button" id="compartir">Compartir ${P.categoria === "Camas" ? "esta cama" : "este combo"}</button>
      <p class="ayuda">Atendido por sus dueños, sin respuestas automáticas. Envío con instalación en CABA y GBA · <a href="index.html#envios">Ver zonas</a></p>

      <dl class="tabla-specs">
        ${KM.specs[P.specs].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
      </dl>
    </div>
  </div>

  <section class="ficha-opiniones">
    <div class="seccion-cabeza">${htmlNotaGoogle()}</div>
    <ul class="opiniones">${htmlOpiniones()}</ul>
  </section>`;

// galería: fotos y videos
const principal = document.getElementById("principal");
const miniaturas = document.getElementById("miniaturas");
function mostrar(item) {
  principal.innerHTML = item.video
    ? `<video src="${item.video}" poster="${item.poster}" controls autoplay muted loop playsinline></video>`
    : `<img src="${item.foto}" alt="${item.alt || P.nombre}">`;
}
let fotoActual = 0;
function verFoto(i) {
  fotoActual = i;
  miniaturas.querySelectorAll("button").forEach((x, j) => x.classList.toggle("activa", j === i));
  mostrar(P.galeria[i]);
}
P.galeria.forEach((item, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-label", item.video ? "Video" : `Foto ${i + 1}`);
  b.innerHTML = item.video
    ? `<img src="${item.poster}" alt=""><span class="play">Video</span>`
    : `<img src="${item.foto}" alt="">`;
  b.addEventListener("click", () => verFoto(i));
  miniaturas.appendChild(b);
});
verFoto(0);
miniaturas.hidden = P.galeria.length < 2;

// si hay una foto del color elegido (ej. el combo en Helsinki), se muestra esa; si no hay y se estaba
// viendo la foto de otro color, vuelve a la principal
function fotoDelColor(color) {
  const i = color === P.color ? 0 : P.galeria.findIndex((item) => item.color === color);
  if (i >= 0) verFoto(i);
  else if (P.galeria[fotoActual].color) verFoto(0);
}

// medidas
const cajaMedidas = document.getElementById("medidas");
MEDIDAS.forEach((m) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = textoMedida(m);
  b.dataset.id = m;
  b.addEventListener("click", () => { elegido.medida = m; actualizar(); });
  cajaMedidas.appendChild(b);
});

// colores: los que tienen ficha propia llevan a esa ficha; el resto se elige acá, con su precio o a consultar
const cajaColores = document.getElementById("colores");
KM.colores.forEach((c) => {
  const variante = variantes.find((v) => v.color === c.nombre);
  const propia = variante && variante.id === P.id;
  const el = document.createElement(variante && !propia ? "a" : "button");
  el.className = "muestra";
  el.title = c.nombre;
  el.dataset.id = c.nombre;
  el.innerHTML = `<img src="${c.img}" alt=""><span>${c.nombre}<small></small></span>`;
  if (variante && !propia) {
    el.href = variante.url;
  } else {
    el.type = "button";
    el.addEventListener("click", () => { elegido.color = c.nombre; fotoDelColor(c.nombre); actualizar(); });
  }
  cajaColores.appendChild(el);
});

function actualizar() {
  cajaMedidas.querySelectorAll("button").forEach((b) => b.classList.toggle("activa", b.dataset.id === elegido.medida));
  // cada muestra dice cuánto sale en la medida elegida
  let sinPrecio = 0;
  cajaColores.querySelectorAll(".muestra").forEach((b) => {
    b.classList.toggle("activa", b.dataset.id === elegido.color);
    const p = precioDe(b.dataset.id, elegido.medida);
    if (!p) sinPrecio++;
    b.querySelector("small").textContent = p ? pesos(p) : "";
  });
  document.querySelector(".colores-nota").hidden = sinPrecio === 0;

  const mismoColor = elegido.color === P.color;
  const precio = precioDe(elegido.color, elegido.medida);
  const medida = textoMedida(elegido.medida);
  const nombre = mismoColor ? P.nombre : `${base} en ${elegido.color}`;

  document.getElementById("color-elegido").textContent = elegido.color;
  document.getElementById("precio").textContent = precio ? pesos(precio) : "Precio a consultar";
  // los combos muestran cuánto sale cada parte (solo en la medida de la que pasaron el desglose)
  const desglose = P.partes && precio && elegido.medida === MEDIDAS[0] ? P.partes[tipoDeColor(elegido.color)] : null;
  const partes = desglose ? desglose.map(([n, p]) => `${n} ${pesos(p)}`).join(" + ") : null;
  // otro color: las fotos y el título siguen siendo los de este producto
  document.getElementById("nota").textContent = precio
    ? (partes ? `${partes} · Color ${elegido.color}` : `Color ${elegido.color} · ${medida}`)
    : (P.precios[tipoDeColor(elegido.color)]
      ? "Te pasamos el precio por WhatsApp"
      : `En ${elegido.color}, te pasamos el precio por WhatsApp`);

  const msg = precio
    ? `Hola! Vi en la web ${articulo(P)} ${nombre} de ${medida} (${pesos(precio)}). ¿Me pasás más info?`
    : `Hola! Vi en la web ${articulo(P)} ${base} y ${pronombre(P)} quiero de ${medida}, color ${elegido.color}. ¿Me pasás el precio?`;
  abrirEnWhatsApp(document.getElementById("consultar"), msg);

  // barra fija del celular
  document.getElementById("barra-precio").textContent = precio ? pesos(precio) : "Precio a consultar";
  document.getElementById("barra-detalle").textContent = `${base} · ${medida} · ${elegido.color}`;
  abrirEnWhatsApp(document.getElementById("barra-consultar"), msg);
}
actualizar();

// Compartir: en el celular abre el menú de compartir (WhatsApp, Instagram…); en la compu, WhatsApp
document.getElementById("compartir").addEventListener("click", () => {
  const url = location.href.split("#")[0].split("?")[0];
  const texto = `Mirá ${articulo(P)} ${P.nombre} de King Muebles`;
  if (navigator.share) {
    navigator.share({ title: P.nombre, text: texto, url }).catch(() => {});
  } else {
    window.open("https://wa.me/?text=" + encodeURIComponent(`${texto}: ${url}`), "_blank", "noopener");
  }
});

// la barra aparece cuando el botón principal no está en pantalla
const barra = document.getElementById("barra-fija");
const botonPrincipal = document.getElementById("consultar");
function revisarBarra() {
  const r = botonPrincipal.getBoundingClientRect();
  const visible = r.bottom < 0 || r.top > window.innerHeight;
  barra.classList.toggle("visible", visible);
  barra.setAttribute("aria-hidden", String(!visible));
  document.body.classList.toggle("con-barra", visible);
}
window.addEventListener("scroll", revisarBarra, { passive: true });
window.addEventListener("resize", revisarBarra);
revisarBarra();
