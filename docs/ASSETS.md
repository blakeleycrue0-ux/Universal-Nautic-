# Inventario de imágenes y licencias

Fuente de datos: [`src/data/imagenes.json`](../src/data/imagenes.json). Una foto se publica si su licencia está verificada (`licencia.verificada: true`) o si el titular de la web la aportó e indicó usarla (`licencia.autorizadaPorTitular: true`). En el resto de casos no se publica. No se usan ilustraciones como sustituto.

## Estado a 29/10/2026: tres fotos publicadas, aportadas por Universal Nautic

Universal Nautic, titular de la web, aportó estas tres fotos el 29/10/2026 e indicó usarlas. **Su licencia no se ha podido verificar de forma independiente**: los archivos no traen URL de origen, autor ni metadatos (EXIF, IPTC y XMP vacíos), los bancos de imágenes están bloqueados desde el entorno de trabajo y una búsqueda web no encontró su procedencia. Por eso figuran con `autorizadaPorTitular: true` y `verificada: false`: **acreditar los derechos de uso corresponde al titular**, que debe conservar el justificante de compra o el permiso del autor de cada una antes de publicar la web.

La muestra de iStock con marca de agua (ID 2120469745) se ha **retirado** por indicación del titular.

| Archivo | Origen | Licencia | ¿Césped artificial? | Dónde se usa |
|---|---|---|---|---|
| `piscina-borde-cesped-{480,800,1206}.{avif,webp}` | Aportada por Universal Nautic (29/10/2026). Sin URL ni autor | No verificada; uso indicado por el titular | Aparente (corte recto, color uniforme), no confirmado | Portada (foto principal y bloque Piscinas), `/cesped-artificial-para-piscinas/` |
| `terraza-cesped-vista-cenital-{480,800,1200,1512}.{avif,webp}` | Aportada por Universal Nautic (29/10/2026). Sin URL ni autor | No verificada; uso indicado por el titular | Aparente (juntas entre rollos), no confirmado | Portada (bloque Terrazas), `/cesped-artificial-para-terrazas/`, `/cesped-artificial-para-patios/` |
| `villa-piscina-pasos-cesped-{480,800,1200,1600,2400}.{avif,webp}` | Aportada por Universal Nautic (29/10/2026). Sin URL ni autor | No verificada; uso indicado por el titular | **Probablemente natural**: el texto alternativo no dice que sea artificial | Portada (bloque Jardines), `/cesped-artificial-para-jardines/`, `/cesped-artificial-palma/` |

Todas llevan la etiqueta «Imagen de referencia» y ninguna se presenta como un trabajo de Universal Nautic.

**Limitaciones conocidas**
- La foto de la portada mide 1206 px de ancho: en pantallas muy grandes se ve algo blanda. Conviene sustituirla por una de al menos 2400 px.
- Con solo tres fotos, cada una aparece en varias páginas.
- La foto de jardines muestra, probablemente, césped natural. Para una web de césped artificial es mejor sustituirla por una en la que se vea el producto.

## Auditoría por página

| Página | Foto | Estado |
|---|---|---|
| `/` | Cabecera a sangre: piscina con franja de césped. Mosaico: terraza, piscina y jardín (Patios va sin foto) | ✔ |
| `/cesped-artificial-para-jardines/` | Casa con jardín y caminos de losas | ✔ (mejorable, ver arriba) |
| `/cesped-artificial-para-terrazas/` | Terraza vista desde arriba | ✔ |
| `/cesped-artificial-para-patios/` | Terraza vista desde arriba, con otro encuadre | ✔ (mejor una foto propia de patio) |
| `/cesped-artificial-para-piscinas/` | Piscina con franja de césped | ✔ |
| `/cesped-artificial-palma/` | Casa con jardín, con otro encuadre | ✔ (mejor una terraza urbana) |
| `/catalogo/` y `/catalogo/<modelo>/` | Fotos de cada modelo | ⏳ No hay modelos publicados: faltan las fichas del proveedor. No se usan fotos genéricas como si fueran productos |
| `/como-elegir-cesped-artificial/`, `/como-trabajamos/` | Cabecera de texto sobre fondo oscuro | Diseño previsto. Ideal: fotos de muestras del proveedor o de instalaciones reales |
| `/presupuesto/`, `/contacto/`, `/preguntas-frecuentes/`, páginas de agradecimiento, legales, 404 | — | ✔ No necesitan foto |

## Cómo dar de alta una foto

1. Si es de un banco de imágenes, abrirla en su **página oficial** (no en una copia) y guardar la URL, el autor y la licencia vigente. En stock de pago, guardar el justificante de compra.
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
| `public/og.png` | Creado para el proyecto con el logotipo oficial | Propio |
| Logotipo oficial (`public/marca/universal-nautic-logo.*`, favicon) | Archivo facilitado por Universal Nautic, recortado sobre transparente sin alterarlo | De la empresa (pedir el original vectorial) |
| Tipografía Bricolage Grotesque | Mathieu Triay | SIL Open Font License 1.1 |
| Tipografía Inter (`@fontsource-variable/inter`) | Rasmus Andersson | SIL Open Font License 1.1 |
