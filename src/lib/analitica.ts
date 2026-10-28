/**
 * Medición de conversiones, independiente del proveedor.
 *
 * - PUBLIC_PLAUSIBLE_DOMAIN → Plausible (sin cookies: no necesita banner).
 * - PUBLIC_GA4_ID           → Google Analytics 4, que SOLO se carga tras aceptar cookies.
 * - Sin ninguna de las dos  → no se carga nada y no se usan cookies.
 *
 * Eventos que se registran (nombres estables para informes):
 *   cta_presupuesto   clic en cualquier botón "Pedir presupuesto"
 *   llamada           clic en un enlace tel:
 *   whatsapp          clic en un enlace de WhatsApp
 *   formulario_inicio primera interacción con el formulario de presupuesto
 *   lead_presupuesto  envío correcto del formulario de presupuesto (conversión principal)
 *   lead_contacto     envío correcto del formulario de contacto
 */

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: ((e: string, o?: { props?: Props }) => void) & { q?: unknown[] }
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    unTrack?: (evento: string, props?: Props) => void
  }
}

const PLAUSIBLE = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN as string | undefined
const GA4 = import.meta.env.PUBLIC_GA4_ID as string | undefined
const CLAVE = 'un-cookies'

function cargarScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  document.head.append(s)
}

function iniciarPlausible(dominio: string) {
  window.plausible =
    window.plausible ||
    Object.assign((...a: unknown[]) => (window.plausible!.q = window.plausible!.q || []).push(a), {})
  cargarScript('https://plausible.io/js/script.js', { 'data-domain': dominio })
}

function iniciarGA4(id: string) {
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { anonymize_ip: true })
  cargarScript(`https://www.googletagmanager.com/gtag/js?id=${id}`)
}

export function track(evento: string, props: Props = {}) {
  try {
    window.plausible?.(evento, { props })
    window.gtag?.('event', evento, props)
    window.dataLayer?.push({ event: evento, ...props })
  } catch {
    /* la medición nunca debe romper la página */
  }
}

function leerConsentimiento(): 'si' | 'no' | null {
  try {
    return (localStorage.getItem(CLAVE) as 'si' | 'no' | null) ?? null
  } catch {
    return null
  }
}

function guardarConsentimiento(v: 'si' | 'no') {
  try {
    localStorage.setItem(CLAVE, v)
  } catch {
    /* sin almacenamiento: se volverá a preguntar */
  }
}

function bannerCookies(id: string) {
  const banner = document.querySelector<HTMLElement>('[data-banner-cookies]')
  if (!banner) return
  const decision = leerConsentimiento()
  if (decision === 'si') return iniciarGA4(id)
  if (decision === 'no') return
  banner.hidden = false
  banner.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-decision]')
    if (!b) return
    const v = b.dataset.decision === 'si' ? 'si' : 'no'
    guardarConsentimiento(v)
    banner.hidden = true
    if (v === 'si') iniciarGA4(id)
  })
}

export function iniciarAnalitica() {
  window.unTrack = track
  try {
    if (!sessionStorage.getItem('un-entrada')) sessionStorage.setItem('un-entrada', location.pathname)
  } catch {
    /* sin sessionStorage */
  }
  if (PLAUSIBLE) iniciarPlausible(PLAUSIBLE)
  if (GA4) bannerCookies(GA4)

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a, button')
    if (!a) return
    const nombre = a.dataset.track
    if (nombre) track(nombre, { ubicacion: a.dataset.ubicacion ?? location.pathname })
    const href = a.getAttribute('href') ?? ''
    if (href.startsWith('tel:')) track('llamada', { ubicacion: location.pathname })
    if (href.includes('wa.me/')) track('whatsapp', { ubicacion: location.pathname })
  })
}
