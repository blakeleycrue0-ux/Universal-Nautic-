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

## Sistema visual

| | |
|---|---|
| Paleta | Blanco cal `#f7f4ee`, arena `#efe9de`, verde olivo `#2f4a2f` (marca), terracota `#b5603e` (solo botones de acción), mar `#2c6e86`. |
| Tipografía | *Fraunces* en titulares (serif cálida y elegante) y *Manrope* en textos e interfaz (muy legible en móvil). Las dos van alojadas en la propia web: sin depender de Google Fonts y sin cookies. |
| Imágenes | Ilustraciones mediterráneas originales (villa, olivo, piscina, terraza) mientras no haya fotos reales. **No son fotos de producto ni de trabajos**: se sustituyen por fotos reales del proveedor o de instalaciones propias en cuanto existan. |
| Movimiento | Entradas suaves al hacer scroll y al cargar la portada. Se desactivan si el sistema pide reducir el movimiento. |

## Experiencia de usuario (pensada primero para móvil)

- **Una sola acción principal:** «Pedir presupuesto», en terracota, siempre visible. En la cabecera en ordenador y en una barra fija abajo en móvil, junto a «Llamar» (o «WhatsApp» cuando haya número).
- **Formulario en tres bloques:** tu espacio, fotos y tus datos. Solo son obligatorios los campos imprescindibles. Las fotos se reducen en el propio móvil antes de enviarse.
- **Nada falso:** los botones de WhatsApp, el email, la dirección, los precios, la instalación, la garantía y la entrega **solo aparecen cuando están confirmados** en `src/config/negocio.ts`.
- **Accesibilidad:** HTML semántico, contraste suficiente, foco visible, menú usable con teclado, etiquetas en todos los campos y mensajes de error anunciados a lectores de pantalla.
