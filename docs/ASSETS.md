# Inventario de imágenes y licencias

Fuente de datos: [`src/data/imagenes.json`](../src/data/imagenes.json). **Una foto solo se publica en producción si su licencia está verificada** (`licencia.verificada: true`). Las pendientes se ven solo en las vistas previas de Netlify, para revisar el diseño. No se usan ilustraciones como sustituto.

## Estado a 29/10/2026: cinco fotos, ninguna con licencia verificada

Comprobación hecha el 29/10/2026 sobre los archivos entregados en la conversación (IMG_7066, IMG_7068, IMG_7069, IMG_7080 e IMG_7081):

- **Metadatos:** ninguno trae autor, copyright ni fuente; el EXIF solo contiene la resolución y el IPTC está vacío.
- **Origen:** no se facilitó la URL original de ninguna.
- **Pexels y Unsplash:** no se pueden consultar desde el entorno de trabajo (dominios bloqueados), y la búsqueda web no encontró estas fotos en esos bancos.
- **Las dos fotos de la casa** parecen de la misma sesión de un banco de imágenes de pago. Sin la URL no se puede saber cuál ni si su licencia es gratuita.

Por eso **todas siguen pendientes**:
- **Producción (`main`):** no se publica ninguna.
- **Vistas previas de Netlify:** se muestran para poder revisar el diseño. `netlify.toml` activa `PUBLIC_MOSTRAR_FOTOS_PENDIENTES` solo en los contextos `deploy-preview` y `branch-deploy`.
- **Repositorio:** los archivos optimizados están en `public/images/`, y el repositorio es público.

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

**En producción, mientras no se verifiquen:** las cabeceras se muestran sobre fondo oscuro, el mosaico de la portada aparece sin fotos y la guía, sin el primer plano.

## Cómo dar de alta una foto

1. Si es de un banco de imágenes, abrirla en su **página oficial** (no en una copia) y guardar la URL, el autor y la licencia vigente. En stock de pago, guardar el justificante de compra.
   - Unsplash y Pexels permiten el uso comercial sin atribución obligatoria, pero no vender la foto tal cual ni dar a entender que el autor respalda el negocio.
   - En Wikimedia hay que comprobar la licencia concreta de cada archivo (CC BY o CC BY-SA obligan a citar al autor).
2. Comprobar en la propia imagen qué se ve. **No describirla como césped artificial si no se aprecia claramente.**
3. Guardar el original como `fotos-originales/<base>.jpg` y registrarla en `src/data/imagenes.json` con autor, URL, licencia, `verificada: true` y `usadaEn`.
4. Ejecutar `npm run fotos` (genera AVIF y WebP en varios anchos).
5. Añadir solo esas variantes: `git add -f public/images/<base>-*`.
6. Actualizar las dos tablas de este documento.

Para ver en local las fotos pendientes: `PUBLIC_MOSTRAR_FOTOS_PENDIENTES=true npm run dev`. En Netlify esa variable solo se activa en las vistas previas (`netlify.toml`); **no definirla nunca para producción**.

## Otros recursos gráficos

| Archivo | Origen | Licencia |
|---|---|---|
| `public/og.png` | Creado para el proyecto con el logotipo oficial | Propio |
| Logotipo oficial (`public/marca/universal-nautic-logo.*`, favicon) | Archivo facilitado por Universal Nautic, recortado sobre transparente sin alterarlo | De la empresa (pedir el original vectorial) |
| Tipografía Bricolage Grotesque | Mathieu Triay | SIL Open Font License 1.1 |
| Tipografía Inter (`@fontsource-variable/inter`) | Rasmus Andersson | SIL Open Font License 1.1 |
