# Registro de imágenes

Fuente de datos: [`src/data/imagenes.json`](../src/data/imagenes.json). **Una foto solo se publica si su licencia está verificada** (`licencia.verificada: true`). Mientras no lo esté, la web muestra en su lugar la ilustración original correspondiente.

## Estado a 28/10/2026

No se ha podido verificar la licencia de ninguna de las tres fotografías:

- Llegaron como archivos adjuntos en la conversación, **sin URL de origen ni autor**.
- Los archivos **no contienen metadatos** de autoría o licencia (EXIF, IPTC y XMP vacíos).
- No se han podido abrir las páginas oficiales de los bancos de imágenes: la red del entorno de trabajo bloquea Unsplash, Pexels, Pixabay, Adobe Stock, iStock, Shutterstock y Wikimedia Commons.

Por eso las tres están marcadas **para revisión manual** y **no se publican**. Además, como el repositorio de GitHub es público, sus archivos **no se suben a git**: los originales están en `fotos-originales/` y las variantes optimizadas en `public/images/`, ambas carpetas fuera del control de versiones.

| Archivo (variantes en `public/images/`) | Autor | URL original | Licencia | ¿Se ve césped artificial? | Uso previsto | Estado |
|---|---|---|---|---|---|---|
| `piscina-borde-cesped-{480,800,1200}.{avif,webp}` | Desconocido | Desconocida | Sin verificar | Aparente (franja de corte recto y color uniforme), no confirmado | Portada, cabecera | ⏸ Pendiente de licencia: hasta entonces se ve la ilustración |
| `terraza-cesped-vista-cenital-{480,800,1200,1512}.{avif,webp}` | Desconocido | Desconocida | Sin verificar | Aparente (juntas rectas entre rollos), no confirmado | `/cesped-artificial-para-terrazas/`, cabecera | ⏸ Pendiente de licencia: hasta entonces se ve la ilustración |
| `villa-piscina-pasos-cesped-{480…2576}.{avif,webp}` | Desconocido | Desconocida | Sin verificar | **Probablemente natural** (variaciones de tono, crecimiento entre losas) | Ninguno | ⛔ No se usa: en una web de césped artificial podría inducir a error |

Los textos alternativos describen lo que se ve **sin afirmar que el césped sea artificial**. Todas las fotos de stock llevan en la web la etiqueta «Imagen de referencia», para no presentarlas como trabajos de Universal Nautic.

## Cómo dar de alta una foto (cuando haya licencia)

1. Conseguir la foto desde su página oficial y guardar la **página de la licencia** o el justificante de compra (Adobe Stock, iStock…). Para Unsplash o Pexels, guardar la URL de la foto: su licencia permite el uso comercial sin atribución, pero no la reventa de la imagen tal cual ni que se dé a entender que el autor respalda el negocio.
2. Guardar el original como `fotos-originales/<base>.jpg`.
3. En `src/data/imagenes.json`, rellenar `autor`, `urlOriginal`, `licencia.nombre`, `licencia.url` y poner `licencia.verificada: true`.
4. Ejecutar `npm run fotos` (genera AVIF y WebP en varios anchos).
5. Añadir solo esas variantes al repositorio: `git add -f public/images/<base>-*`.
6. Actualizar esta tabla.

Para **ver las fotos pendientes en local** sin publicarlas:
`PUBLIC_MOSTRAR_FOTOS_PENDIENTES=true npm run dev`. No definir nunca esa variable en Netlify.

## Fotos que faltan para completar la web

Con las tres fotos actuales no se cubren todos los usos, y repetir la misma imagen en varias páginas no es buena idea. Hacen falta, idealmente reales (proveedor o instalaciones propias, con permiso):

| Uso | Qué foto buscar |
|---|---|
| Jardines | Jardín de casa con césped artificial **claramente identificado** (o del proveedor) |
| Patios | Patio cerrado con césped, mejor con niños o mascotas |
| Piscinas | Perímetro de piscina con césped, que no sea la misma foto de la portada |
| Texturas | Macro de la fibra y de la base del rollo (fotos del proveedor o de las muestras) |
| Tarjetas de la portada | Una foto distinta por uso |

## Otras imágenes del proyecto

| Archivo | Origen | Licencia |
|---|---|---|
| Ilustraciones de `src/components/Escena.astro` | Originales del proyecto (SVG) | Propias |
| `public/og.png`, `public/marca/*` | Originales del proyecto | Propias |
