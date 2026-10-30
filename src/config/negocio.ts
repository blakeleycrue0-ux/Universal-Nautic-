/**
 * DATOS COMERCIALES — fuente única de verdad.
 *
 * Regla: lo que no está confirmado por Universal Nautic o por el proveedor
 * vale `null`. Cada componente comprueba estos valores antes de mostrar
 * nada: si un dato es `null`, la web no lo anuncia (ni lo inventa).
 * Cuando se confirme, basta con rellenarlo aquí y volver a publicar.
 * La lista de lo que falta está en docs/PENDIENTES.md.
 */

export const negocio = {
  /** Nombre comercial confirmado en el encargo Universal Grass. */
  marca: 'Universal Grass',
  linea: 'Césped artificial',
  /** Titular legal (aviso legal, privacidad). */
  titular: {
    razonSocial: 'Universal Nautic S.L.',
    nif: null as string | null, // PENDIENTE
    domicilio: 'Calle Islas Baleares 36A, Pol. Son Bugadelles, Santa Ponsa (Calvià), Mallorca', // confirmar
    registroMercantil: null as string | null, // PENDIENTE (tomo, folio, hoja)
  },

  contacto: {
    /** Teléfono general de Universal Nautic. PENDIENTE: confirmar si atiende esta línea. */
    telefono: '+34 971 691 043' as string | null,
    /** Solo dígitos con prefijo, p. ej. '34600000000'. Si es null, no se muestra WhatsApp. */
    whatsapp: null as string | null,
    email: null as string | null,
    horario: null as string | null,
    /** Mostrar la dirección como punto de atención al público (solo si hay muestras/exposición). */
    mostrarDireccion: false,
  },

  /** Condiciones comerciales: todas pendientes de confirmar con el proveedor. */
  condiciones: {
    ventaSoloMaterial: true as boolean | null,
    instalacion: true as boolean | null,
    presupuestoGratuito: null as boolean | null,
    visitaMedicion: null as boolean | null,
    muestras: null as boolean | null,
    entrega: null as string | null, // p. ej. "Entrega en toda Mallorca en X días laborables"
    garantia: null as string | null, // texto exacto de la garantía del fabricante
    pedidoMinimo: null as string | null,
    formasPago: null as string | null,
  },

  /** Zona de servicio. Arranque: Mallorca; ampliación progresiva a Baleares. */
  zona: {
    actual: 'Mallorca',
    proximamente: ['Menorca', 'Ibiza', 'Formentera'],
  },

  /** Universal Nautic existe desde el año 2000 (dato verificado del logotipo y la web corporativa). */
  fundacion: 2000,
} as const

export const municipiosMallorca = [
  'Alaró', 'Alcúdia', 'Algaida', 'Andratx', 'Ariany', 'Artà', 'Banyalbufar', 'Binissalem', 'Búger',
  'Bunyola', 'Calvià', 'Campanet', 'Campos', 'Capdepera', 'Consell', 'Costitx', 'Deià', 'Escorca',
  'Esporles', 'Estellencs', 'Felanitx', 'Fornalutx', 'Inca', 'Lloret de Vistalegre', 'Lloseta', 'Llubí',
  'Llucmajor', 'Manacor', 'Mancor de la Vall', 'Maria de la Salut', 'Marratxí', 'Montuïri', 'Muro',
  'Palma', 'Petra', 'Pollença', 'Porreres', 'Puigpunyent', 'Sa Pobla', 'Sant Joan',
  'Sant Llorenç des Cardassar', 'Santa Eugènia', 'Santa Margalida', 'Santa Maria del Camí', 'Santanyí',
  'Selva', 'Sencelles', 'Ses Salines', 'Sineu', 'Sóller', 'Son Servera', 'Valldemossa',
  'Vilafranca de Bonany',
] as const

export const telHref = (t: string) => `tel:${t.replace(/\s/g, '')}`
export const waHref = (n: string, texto = 'Hola, me interesa un presupuesto de césped artificial.') =>
  `https://wa.me/${n}?text=${encodeURIComponent(texto)}`
