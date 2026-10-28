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

- **Logotipo:** se usa el logotipo oficial de Universal Nautic tal cual. No hay símbolo ni logotipo propio para la línea de césped.
- **Recomendación:** una submarca descriptiva que deje claro el producto, con «by Universal Nautic» como aval. Por ejemplo «UN Césped» o «Verde Mallorca by Universal Nautic». Hay que **comprobar en la OEPM y en el registro de dominios** que esté libre antes de decidirla.
- **Tono:** cercano, claro y honesto. Se tutea al cliente y se habla de su casa, no de «soluciones».

## Sistema visual (dirección actual)

**La fotografía es la protagonista.** La portada y las páginas de cada espacio se construyen sobre una foto a sangre, con el titular y el botón encima, abajo a la izquierda, y un sombreado suave solo donde hace falta para leerlos.

| | |
|---|---|
| Marca | **Logotipo oficial de Universal Nautic**, sin modificar (versión blanco y azul sobre fondo oscuro). Sin símbolos, iconos ni versiones inventadas. |
| Colores | Tonos oscuros `#101713` (cabecera, cierre, pie), blanco, gris muy claro `#f4f5f3` y verde profundo `#1f4d36` solo en detalles (números, enlaces). El verde de la foto pone el color. |
| Tipografía | Titulares en **Bricolage Grotesque** (con carácter, sin parecer de lujo) y textos en **Inter**. |
| Componentes | Botones sobrios (blanco sobre la foto; oscuro sobre fondo claro), esquinas de 4 px, sin sombras ni degradados decorativos. **Sin iconos decorativos ni etiquetas sobre los titulares.** |
| Texto | Poco y con intención. Un titular, una frase y una acción por bloque. Sin repetir «césped artificial» en la misma pantalla. |
| Secciones | Cada una con una composición distinta: foto a sangre, texto a dos columnas, mosaico de espacios con fotos, pasos numerados, preguntas y cierre oscuro con teléfono. |
| Sin foto con licencia | La cabecera se muestra sobre fondo oscuro con el mismo texto. Funciona, pero **la portada necesita su foto**: no está pensada para publicarse sin ella. |

### Referencias del sector
Las webs de referencia indicadas no se pudieron consultar desde el entorno de trabajo (red bloqueada y sin indexar en el buscador). Conviene revisar el diseño con ellas delante.

## Experiencia de usuario (pensada primero para móvil)

- **Una sola acción principal:** «Pedir presupuesto», siempre visible: en la cabecera en ordenador y en una barra fija abajo en móvil, junto a «Llamar» (o «WhatsApp» cuando haya número).
- **Formulario en tres bloques:** tu espacio, fotos y tus datos. Solo son obligatorios los campos imprescindibles. Las fotos se reducen en el propio móvil antes de enviarse.
- **Nada falso:** los botones de WhatsApp, el email, la dirección, los precios, la instalación, la garantía y la entrega **solo aparecen cuando están confirmados** en `src/config/negocio.ts`.
- **Accesibilidad:** HTML semántico, contraste suficiente, foco visible, menú usable con teclado, etiquetas en todos los campos y mensajes de error anunciados a lectores de pantalla.
