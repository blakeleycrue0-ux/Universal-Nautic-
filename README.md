# Universal Nautic · Césped artificial (Mallorca)

Web comercial de la línea de césped artificial para particulares de Universal Nautic S.L., y su estrategia de lanzamiento.

- **Tecnología:** [Astro](https://astro.build) con TypeScript y CSS propio. Genera HTML estático: muy rápido y fácil de posicionar.
- **Formularios:** Netlify Forms (presupuesto con fotos y contacto), sin servidor propio.
- **Alojamiento:** Netlify, ya conectado a este repositorio.

## Estrategia y documentación

| Fase | Documento |
|---|---|
| 1. Auditoría, competencia, riesgos y plan | [docs/fase-1-auditoria-y-plan.md](docs/fase-1-auditoria-y-plan.md) |
| 2. Arquitectura, marca y experiencia | [docs/fase-2-arquitectura-y-marca.md](docs/fase-2-arquitectura-y-marca.md) |
| 3. Web funcional | este repositorio |
| 4. SEO, analítica y lanzamiento | [docs/fase-4-seo-analitica-lanzamiento.md](docs/fase-4-seo-analitica-lanzamiento.md) |
| 5. Marketing, primeros 30 días | [docs/fase-5-marketing-30-dias.md](docs/fase-5-marketing-30-dias.md) |
| 6. Evaluación y optimización | [docs/fase-6-evaluacion-y-optimizacion.md](docs/fase-6-evaluacion-y-optimizacion.md) |
| Gestión de solicitudes y presupuestos | [docs/gestion-de-solicitudes.md](docs/gestion-de-solicitudes.md) · [plantilla CSV](docs/plantillas/seguimiento-solicitudes.csv) |
| **Datos pendientes de confirmar** | [docs/PENDIENTES.md](docs/PENDIENTES.md) |
| **Registro de imágenes y licencias** | [docs/ASSETS.md](docs/ASSETS.md) |

## Ejecutar en local

Requiere Node.js 22.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # comprobación de tipos y build de producción en dist/
npm run preview    # sirve dist/ en local
```

> Los formularios solo envían de verdad una vez publicados en Netlify. En local, el envío muestra un mensaje de error: es lo esperado.

## Publicar

Cada cambio en `main` se publica solo en Netlify (`netlify.toml`: `npm run build:netlify` → `dist/`). Cada pull request tiene su vista previa.

Variables de entorno (Netlify → *Site configuration → Environment variables*):

| Variable | Para qué | Ejemplo |
|---|---|---|
| `SITE_URL` | Dominio definitivo (canonical, sitemap, Open Graph) | `https://www.ejemplo.es` |
| `PUBLIC_INDEXABLE` | `true` solo en el lanzamiento. Mientras tanto la web lleva `noindex` | `true` |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Analítica sin cookies (Plausible) | `ejemplo.es` |
| `PUBLIC_GA4_ID` | Google Analytics 4 (activa el aviso de cookies) | `G-XXXXXXX` |

Después del primer despliegue, en **Netlify → Forms**: comprobar que aparecen `presupuesto` y `contacto` y activar las **notificaciones por email**.

## Actualizar el contenido

- **Datos del negocio** (teléfono, WhatsApp, email, instalación, entrega, garantía…): `src/config/negocio.ts`. Lo que está a `null` no se muestra. Al rellenarlo, aparece en la web: el botón de WhatsApp, las condiciones, las respuestas de las preguntas frecuentes y los textos legales.
- **Modelos de césped:** `src/data/productos.ts`, con fotos en `public/productos/<modelo>/`. Cada modelo genera su ficha en `/catalogo/<modelo>/` y aparece en el catálogo y en la portada.
- **Preguntas frecuentes:** `src/data/faq.ts`.
- **Fotografías:** `src/data/imagenes.json` + `npm run fotos`. Solo se publican las que tienen la licencia verificada. Ver [docs/ASSETS.md](docs/ASSETS.md).

## Estructura

```
src/
  config/negocio.ts         datos comerciales (fuente única; null = no confirmado)
  data/productos.ts         catálogo (vacío hasta tener fichas del proveedor)
  data/faq.ts               preguntas frecuentes
  layouts/Base.astro        SEO, Open Graph, datos estructurados, analítica, aviso de cookies
  components/               cabecera, pie, barra móvil, formulario, ilustraciones…
  lib/analitica.ts          eventos de conversión (Plausible / GA4)
  pages/                    una carpeta por URL
docs/                       estrategia, procesos y plantillas
public/                     favicon, imagen para redes, símbolo
```

## Reglas de contenido

No se publican modelos, precios, existencias, garantías, plazos, certificaciones, testimonios ni trabajos que no estén confirmados. Las ilustraciones son ilustraciones: nunca se presentan como fotos de producto ni de instalaciones reales.
