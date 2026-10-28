# Inventario de imágenes y licencias

Fuente de datos: [`src/data/imagenes.json`](../src/data/imagenes.json). **Una foto solo se publica si su licencia está verificada** (`licencia.verificada: true`). Si no lo está, la página se muestra sin foto: cabecera en verde oscuro y un bloque útil (los pasos del presupuesto o lo que necesitamos saber). No se usan ilustraciones como sustituto.

## Estado a 28/10/2026: no hay ninguna foto con licencia verificada

**Ninguna página lleva fotografía en este PR.** El motivo es concreto:

- **Bancos de imágenes:** la red del entorno de trabajo bloquea todos los consultados (Unsplash, Pexels, Pixabay, Wikimedia Commons, Openverse, Flickr, Burst, StockSnap, Rawpixel, Adobe Stock, iStock y Shutterstock). Comprobado el 28/10/2026: todas las conexiones fueron rechazadas. Sin acceder a la página original no se puede descargar el archivo ni verificar su licencia, autor y condiciones.
- **Fotos facilitadas en la conversación:** llegaron sin URL de origen ni autor, y los archivos no contienen metadatos de licencia (EXIF, IPTC y XMP vacíos).
- **Webs de la competencia:** no se han usado, por indicación expresa.

**Para desbloquearlo** hay dos opciones:
- Permitir en *Network access* del entorno los dominios `unsplash.com`, `images.unsplash.com`, `www.pexels.com`, `images.pexels.com`, `commons.wikimedia.org` y `upload.wikimedia.org`. Con eso se pueden seleccionar, verificar y descargar las fotos.
- Facilitar fotos propias, del proveedor, o de stock con su enlace original o el justificante de compra.

## Fotos registradas (pendientes de revisión manual)

Los archivos optimizados están solo en local (`public/images/`, `fotos-originales/`) y **no se suben al repositorio**, porque es público.

| Archivo | Autor | URL original | Licencia | Comprobación | ¿Césped artificial? | Uso previsto | Estado |
|---|---|---|---|---|---|---|---|
| `piscina-borde-cesped-{480,800,1200}.{avif,webp}` | Desconocido | Desconocida | No verificable | 28/10/2026: sin origen ni metadatos | Aparente, no confirmado | Portada (fondo de cabecera) | ⏸ No se publica |
| `terraza-cesped-vista-cenital-{480,800,1200,1512}.{avif,webp}` | Desconocido | Desconocida | No verificable | 28/10/2026: sin origen ni metadatos | Aparente (juntas entre rollos), no confirmado | `/cesped-artificial-para-terrazas/` (cabecera) | ⏸ No se publica |
| `villa-piscina-pasos-cesped-{480…2576}.{avif,webp}` | Desconocido | Desconocida | No verificable | 28/10/2026: sin origen ni metadatos | Probablemente natural | Ninguno | ⛔ Descartada: podría inducir a error |

## Auditoría por página: qué foto necesita cada una

| Página | Dónde va la foto | Qué foto hace falta | Estado |
|---|---|---|---|
| `/` | Fondo de la cabecera | Jardín o piscina de una vivienda con césped artificial, horizontal y grande | ⏳ Pendiente (candidata sin licencia: `piscina-borde-cesped`) |
| `/cesped-artificial-para-jardines/` | Cabecera | Jardín residencial mediterráneo con césped artificial identificable | ⏳ Pendiente |
| `/cesped-artificial-para-terrazas/` | Cabecera | Terraza o ático con césped sobre suelo duro | ⏳ Pendiente (candidata sin licencia: `terraza-cesped-vista-cenital`) |
| `/cesped-artificial-para-patios/` | Cabecera | Patio pequeño con césped, mejor con mascota si se ofrece ese uso | ⏳ Pendiente |
| `/cesped-artificial-para-piscinas/` | Cabecera | Perímetro de piscina con césped, distinta de la portada | ⏳ Pendiente |
| `/cesped-artificial-palma/` | Cabecera | Terraza o patio urbano (ambiente de ciudad) | ⏳ Pendiente |
| `/como-elegir-cesped-artificial/` | Dentro del texto | Primeros planos de fibras (alturas distintas) y de la base del rollo con orificios de drenaje | ⏳ Pendiente (ideal: fotos de las muestras del proveedor) |
| `/como-trabajamos/` | Dentro del texto | Preparación del terreno, juntas, rollo, medición | ⏳ Pendiente (ideal: fotos reales del instalador) |
| `/catalogo/` y `/catalogo/<modelo>/` | Tarjeta y ficha de cada modelo | Fotos del proveedor de cada modelo (detalle y ambiente) | ⏳ Pendiente de datos del proveedor |
| `/presupuesto/`, `/contacto/`, `/preguntas-frecuentes/`, páginas de agradecimiento, legales, 404 | — | No necesitan foto: son páginas funcionales | ✔ No aplica |

El código ya está preparado: `/` y `/cesped-artificial-para-terrazas/` llevan la foto asignada; para el resto de páginas de uso basta con registrar la foto y pasarla con `foto={imagenes.<id>}` en la página.

## Cómo dar de alta una foto

1. Abrirla en su **página oficial** (no en una copia) y guardar la URL, el autor y la licencia vigente. En stock de pago, guardar el justificante de compra.
   - Unsplash y Pexels permiten el uso comercial sin atribución obligatoria, pero no vender la foto tal cual ni dar a entender que el autor respalda el negocio.
   - En Wikimedia hay que comprobar la licencia concreta de cada archivo (CC BY o CC BY-SA obligan a citar al autor).
2. Comprobar en la propia imagen qué se ve. **No describirla como césped artificial si no se aprecia claramente.**
3. Guardar el original como `fotos-originales/<base>.jpg` y registrarla en `src/data/imagenes.json` con autor, URL, licencia, `verificada: true` y `usadaEn`.
4. Ejecutar `npm run fotos` (genera AVIF y WebP en varios anchos).
5. Añadir solo esas variantes: `git add -f public/images/<base>-*`.
6. Actualizar las dos tablas de este documento.

Para ver en local las fotos pendientes sin publicarlas: `PUBLIC_MOSTRAR_FOTOS_PENDIENTES=true npm run dev`. No definir nunca esa variable en Netlify.

## Otros recursos gráficos

| Archivo | Origen | Licencia |
|---|---|---|
| `public/og.png`, `public/marca/*` (favicon, símbolo) | Creados para el proyecto | Propios |
| Iconos de `src/components/Icono.astro` | Dibujados para el proyecto (SVG) | Propios |
| Tipografía Inter (`@fontsource-variable/inter`) | Rasmus Andersson | SIL Open Font License 1.1 |
