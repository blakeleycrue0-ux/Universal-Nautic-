// Dev helper: renders atelier frames at given progress values.
// node tools/shoot-atelier.mjs out-dir w h look q p1 p2 ...
import { createServer } from 'vite'
import { createRequire } from 'node:module'
import { writeFile, mkdir } from 'node:fs/promises'
const { chromium } = createRequire(import.meta.url)('playwright')
const [out, w, h, look, q, ...ps] = process.argv.slice(2)
await mkdir(out, { recursive: true })
const server = await createServer({ server: { port: 5198 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
page.on('console', (m) => console.log('[page]', m.text()))
page.on('pageerror', (e) => console.log('[error]', e.message))
await page.goto(`http://localhost:5198/tools/atelier.html?w=${w}&h=${h}&look=${look}&q=${q}`, { waitUntil: 'commit' })
await page.waitForFunction(() => window.ready === true, null, { timeout: 600000 })
for (const p of ps) {
  const t = Date.now()
  const url = await page.evaluate((p) => window.shot(p), +p)
  await writeFile(`${out}/${look}-${p}.jpg`, Buffer.from(url.split(',')[1], 'base64'))
  console.log(p, Date.now() - t, 'ms')
}
await browser.close()
await server.close()
