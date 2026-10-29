// Genera las variantes responsive (AVIF + WebP) de cada foto del registro
// a partir de fotos-originales/<base>.jpg → public/images/<base>-<ancho>.<ext>
// Uso: npm run fotos
import sharp from 'sharp'
import { readFile, mkdir, access } from 'node:fs/promises'

const registro = JSON.parse(await readFile(new URL('../src/data/imagenes.json', import.meta.url), 'utf8'))
await mkdir(new URL('../public/images/', import.meta.url), { recursive: true })

for (const img of Object.values(registro)) {
  const origen = new URL(`../fotos-originales/${img.base}.jpg`, import.meta.url).pathname
  try {
    await access(origen)
  } catch {
    console.warn(`FALTA el original de ${img.id}: fotos-originales/${img.base}.jpg (revisión manual)`)
    continue
  }
  for (const w of img.anchos) {
    const base = sharp(origen).rotate().resize({ width: w })
    const destino = new URL(`../public/images/${img.base}-${w}`, import.meta.url).pathname
    await base.clone().avif({ quality: 55 }).toFile(`${destino}.avif`)
    await base.clone().webp({ quality: 80 }).toFile(`${destino}.webp`)
  }
  console.log(`${img.id}: ${img.anchos.join(', ')} px · licencia ${img.licencia.verificada ? 'verificada' : img.licencia.autorizadaPorTitular ? 'indicada por el titular' : 'PENDIENTE'}`)
}
