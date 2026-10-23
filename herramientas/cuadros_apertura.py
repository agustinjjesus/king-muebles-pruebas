# Cuadros de la cama abriéndose para la idea 1 (la cama se abre mientras bajás).
# Sale del clip 2 del video 3 (videos/03-cama-kng-ia/clips/c2a.mp4): recorte 4:5 con la cama entera
# (de la tapa levantada a los zapateros abiertos) y N cuadros repartidos en la apertura.
#   python herramientas/cuadros_apertura.py
import os
import shutil
import subprocess
import tempfile

from PIL import Image

D = os.path.dirname(os.path.abspath(__file__))
CLIP = os.path.join(D, "..", "..", "..", "videos", "03-cama-kng-ia", "clips", "c2a.mp4")
SALIDA = os.path.join(D, "..", "assets", "abrir")

DESDE, HASTA = 0.30, 4.10      # la apertura va de ~0,45 a ~3,8 s del clip
CUADROS = 64
RECORTE = (0, 380, 1080, 1350)  # x, y, ancho, alto (4:5) sobre el clip de 1080x1920
TAMANO = (720, 900)

tmp = tempfile.mkdtemp()
try:
    fps = (CUADROS - 1) / (HASTA - DESDE)
    x, y, w, h = RECORTE
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(DESDE), "-t", str(HASTA - DESDE + 0.05),
                    "-i", CLIP, "-vf", f"fps={fps:.4f},crop={w}:{h}:{x}:{y},scale={TAMANO[0]}:{TAMANO[1]}:flags=lanczos",
                    "-frames:v", str(CUADROS), os.path.join(tmp, "c%03d.png")], check=True)
    if os.path.isdir(SALIDA):
        shutil.rmtree(SALIDA)
    os.makedirs(SALIDA)
    total = 0
    pngs = sorted(f for f in os.listdir(tmp) if f.endswith(".png"))
    for i, f in enumerate(pngs):
        dest = os.path.join(SALIDA, "%02d.webp" % i)
        Image.open(os.path.join(tmp, f)).save(dest, quality=70, method=6)
        total += os.path.getsize(dest)
    # el primero y el último también en jpg, para quien no tenga webp y para el fondo mientras carga
    Image.open(os.path.join(tmp, pngs[0])).convert("RGB").save(os.path.join(SALIDA, "cerrada.jpg"), quality=82)
    Image.open(os.path.join(tmp, pngs[-1])).convert("RGB").save(os.path.join(SALIDA, "abierta.jpg"), quality=82)
    print("%d cuadros, %.1f MB en total" % (len(pngs), total / 1e6))
finally:
    shutil.rmtree(tmp)
