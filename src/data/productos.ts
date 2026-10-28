/**
 * CATÁLOGO. Vacío a propósito: no hay modelos confirmados por el proveedor.
 *
 * Para publicar un modelo, añade un objeto con los datos de la ficha técnica
 * del proveedor y sus fotos en public/productos/<slug>/. Se generará su
 * página en /catalogo/<slug>/ y aparecerá en el catálogo y en la portada.
 * No rellenes ningún campo con datos supuestos: deja `null` lo que no conste.
 *
 * Ejemplo (NO es un producto real):
 * {
 *   slug: 'nombre-del-modelo',
 *   nombre: 'Nombre comercial del proveedor',
 *   resumen: 'Una frase sobre para qué es.',
 *   usos: ['jardin', 'piscina'],
 *   alturaFibraMm: 40,
 *   densidadPuntadasM2: null,
 *   pesoTotalGm2: null,
 *   tonos: 'Bicolor, verde y verde oliva',
 *   anchoRolloM: [2, 4],
 *   drenaje: null,
 *   aptoMascotas: null,
 *   garantia: null,
 *   precioM2: null,          // € IVA incluido, solo material
 *   fotos: ['/productos/nombre-del-modelo/1.webp'],
 *   fichaTecnicaPdf: null,
 * }
 */

export type Uso = 'jardin' | 'terraza' | 'patio' | 'piscina'

export type Producto = {
  slug: string
  nombre: string
  resumen: string
  usos: Uso[]
  alturaFibraMm: number | null
  densidadPuntadasM2: number | null
  pesoTotalGm2: number | null
  tonos: string | null
  anchoRolloM: number[] | null
  drenaje: string | null
  aptoMascotas: boolean | null
  garantia: string | null
  precioM2: number | null
  fotos: string[]
  fichaTecnicaPdf: string | null
}

export const productos: Producto[] = []
