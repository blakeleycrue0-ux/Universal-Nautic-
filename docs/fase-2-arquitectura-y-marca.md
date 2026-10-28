# FASE 2 — Arquitectura web, identidad y experiencia

## Mapa del sitio

| URL | Objetivo | Búsqueda principal |
|---|---|---|
| `/` | Propuesta de valor y paso al presupuesto | césped artificial Mallorca |
| `/cesped-artificial-para-jardines/` | Página de aterrizaje por uso | césped artificial para jardines Mallorca |
| `/cesped-artificial-para-terrazas/` | Página de aterrizaje por uso | césped artificial para terrazas Mallorca |
| `/cesped-artificial-para-patios/` | Página de aterrizaje por uso | césped artificial patio Mallorca |
| `/cesped-artificial-para-piscinas/` | Página de aterrizaje por uso | césped artificial piscina Mallorca |
| `/cesped-artificial-palma/` | Página local | césped artificial Palma |
| `/catalogo/` y `/catalogo/<modelo>/` | Fichas de producto (se generan solas desde `src/data/productos.ts`) | nombre del modelo, comprar césped artificial Mallorca |
| `/como-elegir-cesped-artificial/` | Guía útil que capta búsquedas informativas | cómo elegir césped artificial |
| `/como-trabajamos/` | Proceso y condiciones (solo las confirmadas) | — |
| `/preguntas-frecuentes/` | Dudas habituales y objeciones | dudas de compra |
| `/presupuesto/` → `/presupuesto/gracias/` | **Conversión principal** | — |
| `/contacto/` → `/contacto/gracias/` | Conversión secundaria | — |
| `/aviso-legal/`, `/politica-de-privacidad/`, `/politica-de-cookies/` | Cumplimiento legal | — |

Al ampliar a otras islas, se añadirá **una página por isla** (no por pueblo) cuando haya servicio real allí: `/cesped-artificial-menorca/`, `/cesped-artificial-ibiza/`. Crear páginas por municipio sin contenido propio se considera spam en Google y no aporta nada.

## Marca

- **Provisional:** «Universal Nautic · Césped artificial · Mallorca», con un símbolo propio: una brizna sobre una línea de horizonte, que guiña al mar sin parecer náutico.
- **Recomendación:** una submarca descriptiva que deje claro el producto, con «by Universal Nautic» como aval. Por ejemplo «UN Césped» o «Verde Mallorca by Universal Nautic». Hay que **comprobar en la OEPM y en el registro de dominios** que esté libre antes de decidirla.
- **Tono:** cercano, claro y honesto. Se tutea al cliente y se habla de su casa, no de «soluciones».

## Sistema visual (rediseño 28/10/2026)

Dirección: empresa profesional y cercana, especializada en césped, **no** estética de lujo ni de inmobiliaria.

| | |
|---|---|
| Color principal | Verde oscuro `#0f3d2c` (cabeceras, franjas, pie, textos destacados). |
| Acento | Verde césped `#4cb043` (botón «Pedir presupuesto», marcas y detalles). El texto del botón es verde oscuro para mantener el contraste. |
| Fondos | Blanco y gris muy claro `#f5f7f6`. No se usa beige, crema ni arena. |
| Texto | `#121c17` y `#47534d`. Contraste alto en todo el sitio. |
| Tipografía | **Inter** (sans serif variable), alojada en la propia web. Titulares en negrita y tamaños contenidos. |
| Componentes | Esquinas de 6 px, bordes finos en lugar de sombras, sin degradados decorativos. Iconos de línea solo donde identifican algo (tipos de espacio, ventajas, pasos). |
| Fotografía | Grandes y reales, en la cabecera de la portada y de cada página de uso. **Solo se publican fotos con licencia verificada** (ver [ASSETS.md](ASSETS.md)). Sin foto verificada, el diseño funciona sin imagen: cabecera en verde oscuro con un bloque útil (pasos del presupuesto o qué necesitamos saber). No se usan ilustraciones como sustituto. |
| Movimiento | Solo una entrada suave de los bloques al hacer scroll. Se desactiva si el sistema pide reducir el movimiento. |

### Referencias del sector
Las webs de referencia indicadas (apavigreen.com, opengarden.es, artificial-grass-spain.com, greenial.es) **no se pudieron consultar**: la red del entorno de trabajo las bloquea y el buscador no las indexa. El rediseño se basa en las convenciones habituales de las webs de instaladores de césped y jardinería: teléfono visible arriba, botón de presupuesto siempre a mano, servicios por tipo de espacio, proceso en pasos, preguntas frecuentes y fotografía de proyectos. Conviene revisarlo con esas referencias delante cuando estén accesibles.

## Experiencia de usuario (pensada primero para móvil)

- **Una sola acción principal:** «Pedir presupuesto», en verde césped, siempre visible. En la cabecera en ordenador y en una barra fija abajo en móvil, junto a «Llamar» (o «WhatsApp» cuando haya número).
- **Formulario en tres bloques:** tu espacio, fotos y tus datos. Solo son obligatorios los campos imprescindibles. Las fotos se reducen en el propio móvil antes de enviarse.
- **Nada falso:** los botones de WhatsApp, el email, la dirección, los precios, la instalación, la garantía y la entrega **solo aparecen cuando están confirmados** en `src/config/negocio.ts`.
- **Accesibilidad:** HTML semántico, contraste suficiente, foco visible, menú usable con teclado, etiquetas en todos los campos y mensajes de error anunciados a lectores de pantalla.
