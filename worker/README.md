# Servicio de títulos (opcional)

Algunas emisoras (Kiss FM, Hit FM, Loca FM, Flaix FM…) sí publican el título de la canción dentro del audio, pero los navegadores no dejan leerlo desde otra web. Este mini servicio lo lee por ti. Es gratis.

1. Crea cuenta en https://dash.cloudflare.com (gratis).
2. Workers & Pages → Create → Create Worker → ponle un nombre, por ejemplo `sintonia-titulos` → Deploy.
3. Edit code → borra lo que hay y pega el contenido de `nowplaying.js` → Deploy.
4. Copia la dirección que te da (`https://sintonia-titulos.TUUSUARIO.workers.dev`).
5. En Sintonía, abajo: «Títulos de canciones (opcional)» → pega la dirección → Guardar.

Solo funciona con las emisoras de la lista `ALLOW` del archivo. Las emisoras HLS (Cadena 100, Rock FM, MegaStar, Radio 3) no usan este método: sus títulos van dentro del propio stream cuando la emisora los incluye.
