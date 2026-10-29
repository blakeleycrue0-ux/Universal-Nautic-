/**
 * REGISTRO DE FOTOGRAFÍAS — licencia y uso de cada imagen.
 *
 * Una foto se publica si su licencia está verificada (`licencia.verificada`)
 * o si el titular de la web la aportó e indicó usarla
 * (`licencia.autorizadaPorTitular`; en ese caso la acreditación de derechos
 * corresponde al titular, ver docs/ASSETS.md). Si no, la página va sin foto. Para revisarlas en
 * local sin publicarlas: PUBLIC_MOSTRAR_FOTOS_PENDIENTES=true npm run dev
 * (no definir nunca esa variable en Netlify).
 *
 * Los datos están en imagenes.json (también los lee scripts/fotos.mjs).
 * Al obtener la licencia: rellenar autor, urlOriginal y licencia, poner
 * `verificada: true`, regenerar con `npm run fotos` y actualizar docs/ASSETS.md.
 */

import datos from './imagenes.json'

export type Imagen = {
  id: string
  /** Prefijo de los archivos en public/images/ (<base>-<ancho>.avif|webp) */
  base: string
  anchos: number[]
  ancho: number
  alto: number
  /** Texto alternativo neutro: no afirma que el césped sea artificial si no está verificado. */
  alt: string
  /** ¿Se aprecia en la imagen que el césped es artificial? */
  cespedArtificial: 'verificado' | 'aparente' | 'no_verificable' | 'probablemente_natural'
  autor: string | null
  urlOriginal: string | null
  licencia: { nombre: string | null; url: string | null; verificada: boolean; autorizadaPorTitular?: boolean }
  /** Se usa en la web (además de tener licencia). */
  usar: boolean
  /** Páginas donde aparece (para docs/ASSETS.md). */
  usadaEn: string[]
  nota: string
}

export const imagenes = datos as Record<'piscinaBorde' | 'terrazaCenital' | 'villaPasos', Imagen>

export const mostrarPendientes = import.meta.env.PUBLIC_MOSTRAR_FOTOS_PENDIENTES === 'true'
export const publicable = (img: Imagen) => img.usar && (img.licencia.verificada || !!img.licencia.autorizadaPorTitular || mostrarPendientes)
