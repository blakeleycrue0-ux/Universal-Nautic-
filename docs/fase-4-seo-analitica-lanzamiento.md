# FASE 4 — SEO, analítica y lanzamiento

> No se incluyen volúmenes de búsqueda inventados ni se promete ninguna posición. Los volúmenes reales se consultan en el **Planificador de palabras clave de Google Ads** (gratis con una cuenta de Ads) y, una vez publicada la web, en **Google Search Console**.

## 1. Palabras clave

| Prioridad | Grupo | Palabras clave | Página |
|---|---|---|---|
| A | Genérica local | césped artificial Mallorca · comprar césped artificial Mallorca | `/` |
| A | Local Palma | césped artificial Palma · césped artificial Palma de Mallorca | `/cesped-artificial-palma/` |
| A | Uso: terrazas | césped artificial para terrazas Mallorca · césped artificial ático | `/cesped-artificial-para-terrazas/` |
| A | Uso: jardines | césped artificial para jardines Mallorca · césped artificial jardín | `/cesped-artificial-para-jardines/` |
| B | Uso: piscinas | césped artificial piscina Mallorca | `/cesped-artificial-para-piscinas/` |
| B | Uso: patios | césped artificial patio Mallorca · césped artificial perros | `/cesped-artificial-para-patios/` |
| B | Producto | césped artificial [altura] mm · nombre de cada modelo | `/catalogo/<modelo>/` |
| C | Informativa | cómo elegir césped artificial · césped artificial se calienta · mantenimiento | guía y preguntas frecuentes |

**Por qué empezar por Palma y las terrazas:** por «césped artificial Mallorca» compiten empresas con muchos años de presencia. Las búsquedas más concretas (Palma, terrazas, áticos) son más alcanzables a corto plazo y tienen una intención de compra clara.

## 2. Títulos y metadescripciones

Están implementados en cada página. Si se cambian, conviene que el título no pase de unos 60 caracteres y la descripción de unos 155.

| Página | Título | Metadescripción |
|---|---|---|
| Inicio | Césped artificial en Mallorca para jardines, terrazas y piscinas \| Universal Nautic | Césped artificial para casas en Mallorca: jardines, terrazas, patios y zonas de piscina. Te asesoramos y te preparamos un presupuesto con tus medidas. |
| Jardines | Césped artificial para jardines en Mallorca \| Universal Nautic | Césped artificial para jardines en Mallorca: cómo se prepara el terreno, qué modelo elegir y qué mantenimiento necesita. Pide presupuesto con tus medidas. |
| Terrazas | Césped artificial para terrazas y áticos en Mallorca \| Universal Nautic | Césped artificial para terrazas y áticos en Mallorca: sobre baldosa u hormigón, sin obras. Qué tener en cuenta y presupuesto con tus medidas. |
| Patios | Césped artificial para patios en Mallorca \| Universal Nautic | Césped artificial para patios en Mallorca: sin barro, apto para niños y mascotas y fácil de limpiar. Pide presupuesto con tus medidas y fotos. |
| Piscinas | Césped artificial para zonas de piscina en Mallorca \| Universal Nautic | Césped artificial alrededor de la piscina en Mallorca: drenaje, remates y elección del modelo. Pide presupuesto con tus medidas y fotos. |
| Palma | Césped artificial en Palma de Mallorca \| Universal Nautic | Césped artificial en Palma para terrazas, áticos, patios y jardines. Te asesoramos y preparamos tu presupuesto con medidas y fotos de tu espacio. |
| Catálogo | Catálogo de césped artificial \| Universal Nautic Mallorca | Modelos de césped artificial para jardines, terrazas, patios y piscinas en Mallorca: características, usos recomendados y presupuesto. |
| Guía | Cómo elegir césped artificial: guía práctica \| Universal Nautic Mallorca | Altura de fibra, densidad, drenaje, uso con mascotas y preparación de la base: lo que conviene mirar antes de comprar césped artificial. |
| Preguntas frecuentes | Preguntas frecuentes sobre césped artificial \| Universal Nautic Mallorca | Precio, instalación, mantenimiento, calor, mascotas, drenaje y garantía: respuestas claras sobre el césped artificial en Mallorca. |
| Presupuesto | Pedir presupuesto de césped artificial en Mallorca \| Universal Nautic | Solicita presupuesto de césped artificial en Mallorca: indica municipio, metros y tipo de espacio, adjunta fotos y te respondemos con una propuesta concreta. |

## 3. SEO técnico ya implementado

- HTML estático (Astro): carga muy rápida y nada de contenido que dependa de JavaScript para indexarse.
- URL limpias y descriptivas, con barra final y etiqueta `canonical` en cada página.
- `sitemap-index.xml` automático y `robots.txt` que lo enlaza.
- Datos estructurados: `Organization` en todas las páginas, `BreadcrumbList`, `FAQPage` (preguntas frecuentes y usos), `Article` (guía) y `Product` en cada ficha, con precio solo si existe.
- Open Graph y tarjeta de Twitter con imagen propia (`public/og.png`).
- Indexación controlada: hasta el lanzamiento todas las páginas llevan `noindex`. Se activa con `PUBLIC_INDEXABLE=true`.
- Accesibilidad e imágenes con texto alternativo; tipografías propias sin bloquear la carga.

## 4. SEO local

1. **Google Business Profile.** Es el factor más importante para aparecer en el mapa en búsquedas locales.
   - Requisito: atender en persona a los clientes, en un local con atención al público **o** desplazándose a su domicilio. Si se instala o se entrega a domicilio, se puede crear como **empresa de servicio a domicilio** y ocultar la dirección, indicando como zona de servicio los municipios de Mallorca.
   - Categoría principal sugerida: la que mejor describa la actividad real (p. ej. «Proveedor de césped artificial» si está disponible; si no, «Tienda de suministros de jardinería» o «Contratista de paisajismo» si se instala). Revisarla en el momento del alta.
   - Fotos reales: producto, muestras e instalaciones. Nunca fotos de stock presentadas como trabajos propios.
   - **Reseñas:** pedirlas a cada cliente al terminar, con el enlace directo. Nunca comprarlas ni redactarlas.
2. **NAP coherente:** el mismo nombre, teléfono y zona en la web, Business Profile, Facebook, Instagram y directorios.
3. **Directorios con criterio:** Habitissimo (permite recibir solicitudes) y Páginas Amarillas. Evitar los directorios de baja calidad.
4. **Menciones locales:** colaboraciones con jardineros y empresas de piscinas que enlacen a la web; algún artículo en un medio local o un blog de jardinería.

## 5. Contenido que conviene publicar (1 pieza cada 2 semanas)

1. Cuánto cuesta poner césped artificial en una terraza (con precios reales en cuanto los haya).
2. Césped artificial y perros: limpieza, olores y qué modelo elegir.
3. ¿El césped artificial se calienta en verano en Mallorca? Qué hacer.
4. Cómo medir tu terraza o jardín para pedir presupuesto (con dibujos).
5. Antes y después de instalaciones reales (cuando existan, con permiso del cliente).
6. Césped artificial en comunidades de propietarios y áticos de Palma.

## 6. Medición

**Herramientas recomendadas:**

- **Google Search Console** (gratis): impresiones, clics y búsquedas por las que aparece la web. Imprescindible desde el primer día.
- **Analítica web:** recomiendo **Plausible** (de pago, unos 9 €/mes; sin cookies, sin banner) o **GA4** (gratis; con banner de consentimiento ya integrado). Basta con definir una variable en Netlify:
  - `PUBLIC_PLAUSIBLE_DOMAIN=tudominio.es` **o** `PUBLIC_GA4_ID=G-XXXXXXX`.
- **Netlify Forms:** cada solicitud queda guardada con el origen (UTM o web de procedencia) y la página de entrada.

**Eventos que ya se registran:**

| Evento | Qué es | Tipo |
|---|---|---|
| `lead_presupuesto` | Envío correcto del formulario de presupuesto (una vez por envío) | **Conversión principal** |
| `lead_contacto` | Envío del formulario de contacto | Conversión secundaria |
| `llamada` / `whatsapp` | Clic en el teléfono o en WhatsApp | Microconversión |
| `cta_presupuesto` | Clic en un botón «Pedir presupuesto» (con su ubicación) | Interés |
| `formulario_inicio` | Primera interacción con el formulario | Embudo |

En GA4, marcar `lead_presupuesto` como evento clave. En Plausible, crear objetivos personalizados con esos nombres.

**Etiquetar los enlaces de campañas** con UTM, por ejemplo:
`https://dominio/presupuesto/?utm_source=instagram&utm_medium=social&utm_campaign=lanzamiento`. El origen llega dentro de la propia solicitud.

## 7. Lista de comprobación para el lanzamiento

- [ ] Dominio comprado y conectado en Netlify (HTTPS automático) · `SITE_URL` definido.
- [ ] Datos confirmados en `src/config/negocio.ts` (teléfono, WhatsApp, email, NIF…).
- [ ] Al menos 3 modelos en `src/data/productos.ts` con fotos y ficha técnica.
- [ ] Netlify → Forms: formularios `presupuesto` y `contacto` detectados · **notificación por email** activada.
- [ ] Envío de prueba real con foto desde un móvil.
- [ ] Analítica activada y evento `lead_presupuesto` comprobado en tiempo real.
- [ ] Search Console verificado y `sitemap-index.xml` enviado.
- [ ] `PUBLIC_INDEXABLE=true` en producción y nuevo despliegue.
- [ ] Google Business Profile creado (si cumple los requisitos).
- [ ] Revisión de los textos legales por la gestoría (NIF, registro, condiciones de venta).
