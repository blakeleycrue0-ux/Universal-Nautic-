# Pendientes de confirmar

Mientras un dato no esté confirmado, la web **no lo muestra**. Cada respuesta se traslada al archivo indicado y se vuelve a publicar.

## Imprescindible para vender (semana 1)

| # | Pregunta | Dónde se rellena |
|---|---|---|
| 1 | ¿Qué proveedor y marca? ¿Qué modelos hay disponibles? Hacen falta las fichas técnicas (altura, densidad, peso, drenaje, anchos de rollo, uso con mascotas). | `src/data/productos.ts` |
| 2 | Fotos de producto del proveedor **con permiso de uso** (detalle, rollo, ambiente). | `public/productos/<modelo>/` |
| 3 | Precio de venta por m² de cada modelo (IVA incluido) y si se quiere publicar. Pedido mínimo. Accesorios y su precio. | `productos.ts` · `negocio.ts → condiciones.pedidoMinimo` |
| 4 | ¿Vendéis solo material, o también instalación (propia o subcontratada)? | `negocio.ts → condiciones.instalacion` / `ventaSoloMaterial` |
| 5 | ¿El presupuesto es gratuito? ¿Hay visita de medición? | `condiciones.presupuestoGratuito` / `visitaMedicion` |
| 6 | Entrega: ¿stock en Mallorca o bajo pedido? Plazo real y coste por zona. | `condiciones.entrega` |
| 7 | Garantía del fabricante para cada modelo (texto exacto). | `condiciones.garantia` y cada producto |
| 8 | ¿El teléfono +34 971 691 043 atiende esta línea? ¿Hay número de WhatsApp comercial? ¿Email? ¿Horario? | `negocio.ts → contacto` |

## Antes del lanzamiento

| # | Pregunta | Dónde se rellena |
|---|---|---|
| 9 | Nombre comercial definitivo de la línea (¿submarca?) y dominio. | `negocio.ts → marca` · `SITE_URL` en Netlify |
| 10 | NIF y datos del Registro Mercantil de Universal Nautic S.L. | `negocio.ts → titular` |
| 11 | ¿Hay muestras para ver en Son Bugadelles? ¿Atención al público? (Decide cómo darse de alta en Google Business Profile.) | `contacto.mostrarDireccion` · `condiciones.muestras` |
| 12 | Formas de pago aceptadas. | `condiciones.formasPago` |
| 13 | ¿Quién recibe y responde las solicitudes, y con qué tiempo de respuesta se compromete? | Netlify → Forms → notificaciones |
| 14 | Analítica: ¿Plausible (sin cookies, de pago) o GA4 (gratis, con banner)? | `PUBLIC_PLAUSIBLE_DOMAIN` o `PUBLIC_GA4_ID` en Netlify |

## Para la estrategia

| # | Pregunta |
|---|---|
| 15 | ¿Qué se intentó en estos dos años para vender césped y por qué crees que no funcionó? |
| 16 | Presupuesto mensual disponible para marketing (aunque sea 0). |
| 17 | Margen por m² (para fijar la comisión de los colaboradores y el coste máximo por cliente en publicidad). |
| 18 | ¿Hay clientes de Universal Nautic a los que se pueda presentar la línea, con su consentimiento? |

## Contenido provisional que hay ahora en la web

- **Fotografías:** ninguna publicada. Las cinco fotos registradas no tienen licencia verificable, así que no se publican ni están en el repositorio. Hacen falta fotos con licencia comprobable (por ejemplo, de Pexels con la URL de su página). Ver [ASSETS.md](ASSETS.md).
- **Logotipo:** el oficial de Universal Nautic, extraído de un JPG. Falta el original vectorial (SVG, AI o EPS).
- **Catálogo:** vacío a propósito. La web dice que las fichas están en preparación y ofrece una recomendación personalizada.
- **Aviso legal y privacidad:** NIF y datos registrales marcados como «pendiente» (#10).
