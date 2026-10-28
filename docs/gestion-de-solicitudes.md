# Gestión de solicitudes, presupuestos y seguimiento

## Flujo

```
Formulario web ─► Netlify Forms ─► email de aviso ─► hoja de seguimiento
                                                      │
          Respuesta < 4 h laborables ◄────────────────┘
                   │
       Llamada o WhatsApp: confirmar medidas, uso y superficie
                   │
       Presupuesto por escrito (plantilla) en < 48 h
                   │
       Seguimiento: día 2 · día 7 · día 21
                   │
       Ganado ─► entrega o instalación ─► fotos (con permiso) ─► reseña en Google
       Perdido ─► anotar el motivo (precio, plazo, sin respuesta, se lo hizo otro…)
```

## 1. Recibir

- **Netlify → Forms → `presupuesto`**: activar la notificación por email (*Form notifications → Email*) a la persona que gestiona las solicitudes. Las fotos se descargan desde el propio panel.
- Copiar cada solicitud a la hoja [`plantillas/seguimiento-solicitudes.csv`](plantillas/seguimiento-solicitudes.csv). Sirve importada en Google Sheets o Excel.

## 2. Cualificar (en la primera llamada)

| Pregunta | Para qué |
|---|---|
| ¿La superficie es aproximada o medida? | Fiabilidad del presupuesto |
| ¿Qué hay ahora debajo (tierra, baldosa, hormigón)? | Preparación y material auxiliar |
| ¿Uso: niños, mascotas, solo decorativo? | Elección del modelo |
| ¿Para cuándo lo quiere? | Prioridad |
| ¿Ha pedido otros presupuestos? | Contexto de precio |
| ¿Acceso para el material (ascensor, escalera, ancho de puerta)? | Logística y ancho de rollo |

**Estados en la hoja:** `nueva` → `contactada` → `presupuesto_enviado` → `ganada` / `perdida` / `en_espera`.

## 3. Presupuestar (contenido mínimo)

1. Datos del cliente y del espacio (municipio, m², tipo, superficie).
2. Modelo recomendado y por qué (y una alternativa más económica si la hay).
3. Desglose: m² de césped (con el sobrante por cortes), accesorios, transporte, instalación si procede.
4. Precio con IVA y sin IVA.
5. Plazo de entrega o instalación **confirmado con el proveedor**.
6. Garantía del fabricante del modelo, por escrito.
7. Validez del presupuesto (por ejemplo 15 días) y forma de pago.
8. Si se contrata a distancia (sin reunión física), informar del **derecho de desistimiento de 14 días** según la normativa de consumo. Revisarlo con la gestoría, sobre todo en material cortado a medida.

## 4. Mensajes tipo (adaptar al cliente)

**Primera respuesta (WhatsApp o SMS):**
> Hola, [nombre]. Soy [tu nombre], de Universal Nautic. Hemos recibido tu solicitud de césped artificial para [tipo] en [municipio] (~[m²] m²). ¿Te va bien una llamada de 5 minutos hoy o mañana para confirmar un par de detalles y prepararte el presupuesto?

**Envío del presupuesto:**
> Te adjunto el presupuesto para tu [tipo]. Te he recomendado [modelo] porque [motivo]. Si quieres, te enseño una muestra. Cualquier duda, aquí estoy.

**Seguimiento, día 2:**
> Hola, [nombre]. ¿Has podido ver el presupuesto? Si quieres ajustar algo (modelo, metros, fechas), lo vemos sin problema.

**Seguimiento, día 7:**
> Te escribo por si te ayuda: [consejo útil o respuesta a una duda habitual]. El presupuesto sigue vigente hasta el [fecha].

**Cierre, día 21:**
> No quiero ser pesado. Si de momento lo dejas aparcado, lo entiendo. ¿Me dices si lo descartas o lo retomamos más adelante? Así no te molesto.

## 5. Después de la venta

- Pedir permiso **por escrito** para usar las fotos (antes y después) en la web y en redes.
- Enviar el enlace directo de reseña de Google Business Profile 2–3 días después.
- Añadir el trabajo como proyecto real cuando haya varios. Por ahora la web no muestra trabajos inventados.

## 6. Revisión semanal (viernes, 30 minutos)

- Solicitudes nuevas por canal (columna «origen»).
- Tiempo medio de primera respuesta.
- Presupuestos pendientes de seguimiento.
- Motivos de pérdida: si se repite «precio», revisar la oferta; si se repite «plazo», revisar la logística.
