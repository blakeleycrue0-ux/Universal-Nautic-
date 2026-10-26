// Browser QA: scrolls the page down and back up at several viewports,
// collects console errors, broken images and screenshots.
// node tools/qa.mjs <out-dir> [url]
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
const { chromium } = createRequire(import.meta.url)('playwright')

const out = process.argv[2] || 'qa'
const url = process.argv[3] || 'http://localhost:4173/'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })

const runs = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'reduced', viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' },
]
const sections = ['top', 'introduction', 'stitch', 'materials', 'interior', 'exterior', 'execution', 'work', 'people', 'contact']

for (const run of runs) {
  const ctx = await browser.newContext(run)
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`))
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: `${out}/${run.name}-00-hero.jpg`, quality: 70 })

  // slow scroll to the bottom and back to exercise every trigger in both directions
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((y) => scrollTo(0, y), y)
    await page.waitForTimeout(60)
  }
  for (let y = h; y > 0; y -= 800) {
    await page.evaluate((y) => scrollTo(0, y), y)
    await page.waitForTimeout(40)
  }

  for (const [i, id] of sections.entries()) {
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }), id)
    await page.waitForTimeout(id === 'stitch' ? 2500 : 1600)
    await page.screenshot({ path: `${out}/${run.name}-${String(i + 1).padStart(2, '0')}-${id}.jpg`, quality: 70 })
  }

  // stitch sequence frames
  if (run.name !== 'reduced') {
    const box = await page.evaluate(() => {
      const s = document.getElementById('stitch')
      return { top: s.offsetTop, h: s.offsetHeight - innerHeight }
    })
    for (const p of [0.05, 0.3, 0.55, 0.78, 0.97]) {
      await page.evaluate((y) => scrollTo(0, y), box.top + box.h * p)
      await page.waitForTimeout(2200)
      await page.screenshot({ path: `${out}/${run.name}-stitch-${p}.jpg`, quality: 70 })
    }
  }

  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc),
  )
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  const live = await page.evaluate(() => ({
    hero: document.querySelector('[data-hero-canvas]').classList.contains('is-live'),
    stitch: document.querySelector('[data-stitch]').classList.contains('is-live'),
  }))
  console.log(JSON.stringify({ run: run.name, errors, broken, horizontalOverflow: overflow, live }, null, 1))
  await ctx.close()
}
await browser.close()
