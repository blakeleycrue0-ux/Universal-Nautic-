// Renders the procedural material plates to optimised WebP stills.
// Usage: npm run plates   (starts its own Vite dev server)
import { createServer } from 'vite'
import { createRequire } from 'node:module'
import sharp from 'sharp'
const { chromium } = createRequire(import.meta.url)('playwright') // pre-installed globally in this environment
import { mkdir } from 'node:fs/promises'

const OUT = new URL('../public/plates/', import.meta.url)
const only = process.argv.slice(2)
const jobs = [
  ['hero', 2400, 1500],
  ['hero-portrait', 1200, 1800, 'hero'],
  ['leather', 1600, 2000],
  ['nappa', 1800, 1200],
  ['pile', 1600, 2000],
  ['twill', 1400, 1400],
  ['canvas', 1600, 2000],
  ['teak', 2400, 1350],
].filter(([n]) => !only.length || only.includes(n))

await mkdir(OUT, { recursive: true })
const server = await createServer({ server: { port: 5199 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage()
page.on('console', (m) => console.log('[page]', m.text()))
await page.goto('http://localhost:5199/tools/plates.html')
await page.waitForFunction(() => window.ready === true)

const S = Number(process.env.SCALE || 1) // SCALE=0.4 for quick previews
for (let [file, w, h, shot = file] of jobs) {
  w = Math.round(w * S)
  h = Math.round(h * S)
  const t = Date.now()
  const url = await page.evaluate(([s, w, h]) => window.renderPlate(s, w, h), [shot, w, h])
  const png = Buffer.from(url.split(',')[1], 'base64')
  for (const width of [w, Math.round(w / 2)]) {
    const suffix = width === w ? '' : '-sm'
    await sharp(png).resize({ width }).webp({ quality: 80 }).toFile(new URL(`${file}${suffix}.webp`, OUT).pathname)
  }
  console.log(`${file} ${w}x${h} ${Date.now() - t}ms`)
}

// Stills of the 3D atelier scene: fallbacks for the stitch sequence and
// section imagery. [file, width, height, look, progress]
const stills = [
  ['stitch-1', 1920, 1200, 'atelier', 0.06],
  ['stitch-2', 1920, 1200, 'atelier', 0.3],
  ['stitch-3', 1920, 1200, 'atelier', 0.56],
  ['stitch-4', 1920, 1200, 'atelier', 0.8],
  ['stitch-5', 1920, 1200, 'atelier', 1],
  // macro seam details for the interior and exterior sections
  ['interior', 2400, 1350, 'atelier', 0.6],
  ['interior-portrait', 1200, 1800, 'atelier', 0.6],
  ['deck', 2400, 1500, 'deck', 0.6],
].filter(([n]) => !only.length || only.includes(n))

for (let [file, w, h, look, p, still] of stills) {
  w = Math.round(w * S)
  h = Math.round(h * S)
  const t = Date.now()
  const pg = await browser.newPage({ viewport: { width: w, height: h } })
  pg.on('pageerror', (e) => console.log('[error]', e.message))
  await pg.goto(`http://localhost:5199/tools/atelier.html?w=${w}&h=${h}&look=${look}&q=high${still ? '&still=' + encodeURIComponent(JSON.stringify(still)) : ''}`, { waitUntil: 'commit' })
  await pg.waitForFunction(() => window.ready === true, null, { timeout: 600000 })
  const url = await pg.evaluate((p) => window.shot(p), p)
  const img = Buffer.from(url.split(',')[1], 'base64')
  for (const width of [w, Math.round(w / 2)]) {
    const suffix = width === w ? '' : '-sm'
    await sharp(img).resize({ width }).webp({ quality: 80 }).toFile(new URL(`${file}${suffix}.webp`, OUT).pathname)
  }
  await pg.close()
  console.log(`${file} ${w}x${h} ${Date.now() - t}ms`)
}

await browser.close()
await server.close()
