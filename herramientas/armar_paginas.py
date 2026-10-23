# Arma idea-1.html e idea-2.html a partir del index.html de la web real (web/maqueta), para probar
# el movimiento sin tocar la web publicada. El index.html de esta carpeta es el que elige entre las dos.
#   python herramientas/armar_paginas.py
import os

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
base = open(os.path.join(D, "..", "maqueta", "index.html"), encoding="utf-8").read()


def reemplazar(html, viejo, nuevo):
    assert html.count(viejo) == 1, "no encontré (o hay más de uno): " + viejo[:60]
    return html.replace(viejo, nuevo)


def barra(n, que):
    return (f'  <div class="barra-prueba"><div class="contenedor"><span>Prueba de movimiento · <strong>Idea {n}</strong>: {que}</span>'
            f'<a href="index.html">Ver las dos pruebas</a></div></div>\n\n  <header class="cabecera">')


# ---------------------------------------------------------------- idea 1
ABRIR = '''  <section class="abrir" id="abrir" aria-label="La Cama KNG abriéndose">
    <div class="abrir-fijo">
      <div class="contenedor abrir-grilla">
        <div class="abrir-textos">
          <p class="eyebrow">Cama KNG · tres en uno</p>
          <h2 class="abrir-titulo">Una cómoda, una zapatera y una cama.</h2>
          <ol class="abrir-pasos">
            <li data-desde="0.10"><strong>6 cajones</strong><span>con guías telescópicas</span></li>
            <li data-desde="0.18"><strong>2 bauleras</strong><span>debajo de la tapa de arriba</span></li>
            <li data-desde="0.38"><strong>2 zapateros</strong><span>con pistones a gas</span></li>
          </ol>
          <div class="abrir-final" data-desde="0.80">
            <p>En melamina de 18 mm, de 2 plazas a king size. <span class="abrir-precio">Desde $499.000</span></p>
            <a class="link-flecha" href="cama-kng.html">Ver la Cama KNG →</a>
          </div>
        </div>
        <div class="abrir-imagen">
          <img class="abrir-respaldo" src="assets/abrir/cerrada.jpg" alt="Cama KNG blanca cerrada" width="720" height="900">
          <canvas width="720" height="900" aria-hidden="true"></canvas>
          <p class="abrir-pista">Bajá y mirá cómo se abre <span>↓</span></p>
          <div class="abrir-barra"><span></span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="seccion" id="catalogo">'''

h1 = base
h1 = reemplazar(h1, '<link rel="stylesheet" href="estilos.css?v=19">',
                '<link rel="stylesheet" href="estilos.css?v=19">\n  <link rel="stylesheet" href="pruebas.css?v=1">\n  <link rel="stylesheet" href="movimiento-1.css?v=2">')
h1 = reemplazar(h1, '<title>King Muebles · Fábrica de muebles de melamina</title>',
                '<title>Prueba · Idea 1 · King Muebles</title>')
h1 = reemplazar(h1, '\n  <header class="cabecera">', '\n' + barra(1, "la cama se abre mientras bajás"))
h1 = reemplazar(h1, '  <section class="seccion" id="catalogo">', ABRIR)
h1 = reemplazar(h1, '</body>', '  <script src="movimiento-1.js?v=1"></script>\n</body>')
open(os.path.join(D, "idea-1.html"), "w", encoding="utf-8", newline="\n").write(h1)

# ---------------------------------------------------------------- idea 2
VIDEO = '''  <section class="seccion en-video" id="hecha">
    <div class="contenedor en-video-grilla">
      <div class="en-video-texto">
        <p class="eyebrow">Hecha en nuestra fábrica</p>
        <h2>Abrila, cerrala, usala todos los días.</h2>
        <p class="lead">Melamina de 18 mm adentro y afuera, cantos de PVC, guías telescópicas y pistones a gas en las puertas. Aguanta hasta 600 kg.</p>
        <a class="link-flecha" href="cama-kng.html">Ver la Cama KNG →</a>
      </div>
      <div class="en-video-medio">
        <video src="assets/medios/orbita.mp4" poster="assets/medios/orbita-poster.jpg" muted loop playsinline preload="metadata" aria-label="La Cama KNG abierta, vista girando alrededor"></video>
      </div>
    </div>
  </section>

  <section class="seccion seccion-alt" id="comparar">'''

h2 = base
h2 = reemplazar(h2, '<link rel="stylesheet" href="estilos.css?v=19">',
                '<link rel="stylesheet" href="estilos.css?v=19">\n  <link rel="stylesheet" href="pruebas.css?v=1">\n  <link rel="stylesheet" href="movimiento-2.css?v=2">')
h2 = reemplazar(h2, '<title>King Muebles · Fábrica de muebles de melamina</title>',
                '<title>Prueba · Idea 2 · King Muebles</title>')
h2 = reemplazar(h2, '<html lang="es-AR">', '<html lang="es-AR" class="con-movimiento">')
h2 = reemplazar(h2, '\n  <header class="cabecera">', '\n' + barra(2, "movimiento suave en todo el sitio"))
h2 = reemplazar(h2, '  <section class="seccion seccion-alt" id="comparar">', VIDEO)
h2 = reemplazar(h2, '</body>', '  <script src="movimiento-2.js?v=3"></script>\n</body>')
open(os.path.join(D, "idea-2.html"), "w", encoding="utf-8", newline="\n").write(h2)
print("idea-1.html e idea-2.html listas")
