# Inventario de imágenes y licencias

## Autorización de publicación (30/10/2026)

El titular ha ordenado expresamente publicar las fotografías aportadas como procedentes de Pexels. Se activa `publicacionAutorizadaPorTitular` en las cuatro imágenes disponibles; `licencia.verificada` permanece en false, sin inventar una comprobación independiente ni autores. Esta autorización sustituye el bloqueo de revisión local descrito en las notas anteriores. Se incluyen las variantes AVIF/WebP en Git, conservando los originales fuera del repositorio. Todas se presentan como imágenes de referencia, no como instalaciones propias ni fichas de producto.

## Archivos recuperados para revisión local (30/10/2026)

Los adjuntos JPG ya están disponibles y se han copiado a las rutas locales ignoradas:

- `fotos-originales/villa-piscina-pasos-cesped.jpg`: adjunto `1-Photo-1.jpg`, 1280 × 854.
- `fotos-originales/terraza-cesped-vista-cenital.jpg`: adjunto `2-Photo-2.jpg`, 960 × 1280.
- `fotos-originales/villa-jardin-camino.jpg`: adjunto `3-Photo-3.jpg`, 1280 × 854.
- `fotos-originales/piscina-borde-cesped.jpg`: recuperado de la primera entrega, 1206 × 792.

`npm run fotos` genera las variantes AVIF/WebP en `public/images/`, sin ampliar por encima del tamaño recibido. Se han ajustado los tamaños del registro para que coincidan con los archivos reales. El detalle de césped sigue ausente y se desactiva su uso. Las páginas con fotos pendientes solo las muestran en desarrollo con `PUBLIC_MOSTRAR_FOTOS_PENDIENTES=true`; el build de producción las oculta. Los originales y variantes pendientes permanecen fuera de Git.

No se ha establecido una correspondencia individual entre las URLs de las villas/piscina y sus JPG: las páginas siguen bloqueadas. La URL de terraza se registra como fuente facilitada, sin autor ni licencia marcados como verificados. Las fuentes recibidas permiten avanzar con la composición local, pero no acreditan una comprobación independiente. Ninguna imagen se presenta como trabajo propio ni como ficha de producto. El césped de las villas parece natural.

## Fuentes facilitadas el 30/10/2026 para Universal Grass

El usuario ha facilitado estas páginas de Pexels como fuentes de las fotografías:

- https://www.pexels.com/photo/green-grass-lawn-near-swimming-pool-8134751/
- https://www.pexels.com/photo/courtyard-of-modern-villa-in-sunny-day-7031593/
- https://www.pexels.com/photo/a-beautiful-house-with-swimming-pool-near-the-garden-with-green-grass-8134849/
- https://www.pexels.com/photo/modern-rooftop-terrace-with-green-turf-34989777/

Estado: fuentes recibidas; pendientes de consulta, identificación de autores, descarga y correspondencia visual con los adjuntos. No se han marcado licencias como verificadas ni se han creado rutas de imágenes inexistentes. La consulta de la primera página devolvió `Tunnel connection failed: 403 Forbidden`; la política del entorno no permite Pexels. Se necesita acceso a `www.pexels.com` para consultar las páginas y la licencia (`https://www.pexels.com/license/`), y a `images.pexels.com` para descargar las fotografías. Añadir `pexels.com` si hay redirecciones al dominio sin www.

Una vez disponibles, registrar autor y licencia, inspeccionar cada original y decidir el uso. Las fotografías se identificarán como referencias, no como instalaciones realizadas por Universal Grass. No afirmar que muestran césped artificial cuando no pueda comprobarse.

Fuente de datos: [`src/data/imagenes.json`](../src/data/imagenes.json). **Una foto solo se publica en producción si su licencia está verificada** (`licencia.verificada: true`). Las pendientes se ven solo en las vistas previas de Netlify, para revisar el diseño. No se usan ilustraciones como sustituto.

## Estado a 29/10/2026: cinco fotos, ninguna con licencia verificada

Comprobación hecha el 29/10/2026 sobre los archivos entregados en la conversación (IMG_7066, IMG_7068, IMG_7069, IMG_7080 e IMG_7081):

- **Metadatos:** ninguno trae autor, copyright ni fuente; el EXIF solo contiene la resolución y el IPTC está vacío.
- **Origen:** no se facilitó la URL original de ninguna.
- **Pexels y Unsplash:** no se pueden consultar desde el entorno de trabajo (dominios bloqueados), y la búsqueda web no encontró estas fotos en esos bancos.
- **Las dos fotos de la casa** parecen de la misma sesión de un banco de imágenes de pago. Sin la URL no se puede saber cuál ni si su licencia es gratuita.

Por eso **todas siguen pendientes y no se publican**. Desde el 29/10/2026 sus archivos **ya no están en el repositorio**: se guardan solo en local, en `fotos-originales/` y `public/images/`, fuera de git. La web de producción se muestra sin ellas:
- las cabeceras van sobre fondo oscuro;
- los bloques de la portada y la guía, sin foto.

**Para verificar cada una** hace falta la URL de su página en Pexels o Unsplash, o el justificante de compra o el permiso del autor. Con eso se rellenan `autor`, `urlOriginal` y `licencia`, y se pone `verificada: true`. Si una foto no se puede acreditar, hay que sustituirla.

**Revisión del 29/10/2026 (tarde).** El titular confirma que no dispone de las URL originales de ninguna de las cinco fotos. Ninguna se atribuye a Pexels, a Unsplash ni a ningún otro banco.

Se intentó sustituirlas por fotos con licencia verificable, sin éxito:
- **Bancos de imágenes:** desde el entorno de trabajo no se puede acceder a Pexels, Unsplash, Pixabay, Wikimedia Commons, Flickr ni jsDelivr (solo responden npm y GitHub).
- **Otras fuentes:** en las fuentes accesibles no hay fotografías de este tema con una licencia comprobable.

**Las cinco siguen pendientes.** Se sustituirán en cuanto haya fotos verificables, por cualquiera de estas dos vías:
- se permite el acceso a `www.pexels.com` e `images.pexels.com` (o a `unsplash.com` e `images.unsplash.com`) en la configuración de red del entorno;
- el titular descarga las fotos elegidas y facilita la URL de la página de cada una.

| Archivo | Entrega | Autor | URL original | Licencia | ¿Césped artificial? | Dónde se usa |
|---|---|---|---|---|---|---|
| `villa-jardin-camino-{480…2400}` | Nueva (casa con piscina y camino de losas, vista lateral) | Desconocido | Desconocida | ⏸ Pendiente | Probablemente natural | Portada (foto principal) |
| `villa-piscina-pasos-cesped-{480…2400}` | Repetida (misma casa, vista diagonal) | Desconocido | Desconocida | ⏸ Pendiente | Probablemente natural | Portada (bloque Jardines), `/cesped-artificial-para-jardines/`, `/cesped-artificial-palma/` |
| `piscina-borde-cesped-{480,800,1206}` | Repetida | Desconocido | Desconocida | ⏸ Pendiente | Aparente, no confirmado | Portada (bloque Piscinas), `/cesped-artificial-para-piscinas/` |
| `terraza-cesped-vista-cenital-{480…1512}` | Repetida | Desconocido | Desconocida | ⏸ Pendiente | Aparente (juntas entre rollos), no confirmado | Portada (bloque Terrazas), `/cesped-artificial-para-terrazas/`, `/cesped-artificial-para-patios/` |
| `cesped-detalle-cenital-{480…2236}` | Nueva (primer plano) | Desconocido | Desconocida | ⏸ Pendiente | No verificable (parece natural) | `/como-elegir-cesped-artificial/` (dentro del texto) |

Los textos alternativos describen lo que se ve sin afirmar que el césped sea artificial. Todas las fotos llevan la etiqueta «Imagen de referencia» y ninguna se presenta como trabajo de Universal Nautic.

## Auditoría por página

| Página | Foto | Estado |
|---|---|---|
| `/` | Cabecera a sangre: casa con piscina y jardín. Mosaico: terraza, piscina y jardín (Patios va sin foto) | ⏸ Pendiente de licencia |
| `/cesped-artificial-para-jardines/` | Casa con jardín y caminos de losas | ⏸ Pendiente |
| `/cesped-artificial-para-terrazas/` | Terraza vista desde arriba | ⏸ Pendiente |
| `/cesped-artificial-para-patios/` | Terraza vista desde arriba, con otro encuadre | ⏸ Pendiente (mejor una foto de patio) |
| `/cesped-artificial-para-piscinas/` | Piscina con franja de césped | ⏸ Pendiente |
| `/cesped-artificial-palma/` | Casa con jardín, con otro encuadre | ⏸ Pendiente (mejor una terraza urbana) |
| `/como-elegir-cesped-artificial/` | Primer plano de césped, dentro del texto | ⏸ Pendiente |
| `/catalogo/` y `/catalogo/<modelo>/` | Fotos de cada modelo | No hay modelos publicados: faltan las fichas del proveedor |
| `/como-trabajamos/`, `/presupuesto/`, `/contacto/`, `/preguntas-frecuentes/`, páginas de agradecimiento, legales, 404 | — | ✔ No necesitan foto |

**En producción, mientras no se verifiquen:** las cabeceras se muestran sobre fondo oscuro, el mosaico de la portada aparece sin fotos y la guía, sin el primer plano. Para añadir una foto verificada, seguir «Cómo dar de alta una foto».

## Cómo dar de alta una foto

1. Si es de un banco de imágenes, abrirla en su **página oficial** (no en una copia) y guardar la URL, el autor y la licencia vigente. En stock de pago, guardar el justificante de compra.
   - Unsplash y Pexels permiten el uso comercial sin atribución obligatoria, pero no vender la foto tal cual ni dar a entender que el autor respalda el negocio.
   - En Wikimedia hay que comprobar la licencia concreta de cada archivo (CC BY o CC BY-SA obligan a citar al autor).
2. Comprobar en la propia imagen qué se ve. **No describirla como césped artificial si no se aprecia claramente.**
3. Guardar el original como `fotos-originales/<base>.jpg` y registrarla en `src/data/imagenes.json` con autor, URL, licencia, `verificada: true` y `usadaEn`.
4. Ejecutar `npm run fotos` (genera AVIF y WebP en varios anchos).
5. Añadir solo esas variantes: `git add -f public/images/<base>-*`.
6. Actualizar las dos tablas de este documento.

Para ver en local las fotos pendientes: `PUBLIC_MOSTRAR_FOTOS_PENDIENTES=true npm run dev`. **No definir nunca esa variable en Netlify.**

## Otros recursos gráficos

| Archivo | Origen | Licencia |
|---|---|---|
| `public/og.png` | Creado para el proyecto con el logotipo oficial | Propio |
| Logotipo oficial (`public/marca/universal-nautic-logo.*`, favicon) | Archivo facilitado por Universal Nautic, recortado sobre transparente sin alterarlo | De la empresa (pedir el original vectorial) |
| Tipografía Bricolage Grotesque | Mathieu Triay | SIL Open Font License 1.1 |
| Tipografía Inter (`@fontsource-variable/inter`) | Rasmus Andersson | SIL Open Font License 1.1 |
