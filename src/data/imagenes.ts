/**
 * REGISTRO DE FOTOGRAFÍAS — licencia y uso de cada imagen.
 *
 * Una foto solo se publica si `licencia.verificada === true`; sus archivos
 * se suben al repositorio solo entonces. Para revisar en local las pendientes
 * (archivos en fotos-originales/ y public/images/, fuera de git):
 * PUBLIC_MOSTRAR_FOTOS_PENDIENTES=true npm run dev
 * (no definir nunca esa variable para producción).
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
  licencia: { nombre: string | null; url: string | null; verificada: boolean }
  /** Se usa en la web (además de tener licencia). */
  usar: boolean
  /** Páginas donde aparece (para docs/ASSETS.md). */
  usadaEn: string[]
  nota: string
}

export const imagenes = datos as Record<'villaCamino' | 'cespedDetalle' | 'piscinaBorde' | 'terrazaCenital' | 'villaPasos', Imagen>

export const mostrarPendientes = import.meta.env.PUBLIC_MOSTRAR_FOTOS_PENDIENTES === 'true'
export const publicable = (img: Imagen) => img.usar && (img.licencia.verificada || mostrarPendientes)
