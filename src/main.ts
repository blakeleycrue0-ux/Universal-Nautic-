import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReliefRenderer, type ReliefShot } from './gl/relief'
import { HERO_SHOT } from './gl/shots'

gsap.registerPlugin(ScrollTrigger)

const root = document.documentElement
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const coarse = matchMedia('(pointer: coarse)').matches
const small = () => innerWidth < 700
// Live rendering needs WebGL2 on a real GPU. Software rasterisers (SwiftShader,
// llvmpipe) take seconds per frame, so they get the pre-rendered stills.
// `?gl=force` bypasses the check for testing.
const hasWebGL2 = (() => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) return false
    if (new URLSearchParams(location.search).get('gl') === 'force') return true
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return !/swiftshader|llvmpipe|software|basic render/i.test(name)
  } catch {
    return false
  }
})()
const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s)
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)]

root.classList.add('is-ready')

// ------------------------------------------------------------------ navigation
function initNav() {
  const nav = $('[data-nav]')!
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]')!
  const menu = $('[data-menu]')!
  let lastY = scrollY
  let open = false

  addEventListener(
    'scroll',
    () => {
      const y = scrollY
      nav.classList.toggle('is-hidden', !open && y > lastY && y > innerHeight * 0.6)
      lastY = y
    },
    { passive: true },
  )

  const setOpen = (v: boolean) => {
    open = v
    toggle.setAttribute('aria-expanded', String(v))
    toggle.querySelector('.nav__toggle-label')!.textContent = v ? 'Close' : 'Index'
    if (v) {
      menu.hidden = false
      requestAnimationFrame(() => menu.classList.add('is-open'))
      document.body.style.overflow = 'hidden'
      $<HTMLAnchorElement>('a', menu)?.focus({ preventScroll: true })
    } else {
      menu.classList.remove('is-open')
      document.body.style.overflow = ''
      setTimeout(() => !open && (menu.hidden = true), 800)
    }
  }
  toggle.addEventListener('click', () => setOpen(!open))
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false)
  })
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false)
      toggle.focus()
    }
    // keep focus inside the open menu
    if (e.key === 'Tab' && open) {
      const items = [toggle, ...$$<HTMLElement>('a', menu)]
      const i = items.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && i <= 0) {
        e.preventDefault()
        items[items.length - 1].focus()
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault()
        items[0].focus()
      }
    }
  })
}

// ------------------------------------------------------------------ line splitting
// Wraps each rendered line of a heading in a mask so lines can rise into place.
const originals = new WeakMap<HTMLElement, string>()
function splitLines(el: HTMLElement) {
  if (!originals.has(el)) originals.set(el, el.innerHTML)
  el.innerHTML = originals.get(el)!
  const words: HTMLElement[] = []
  const walk = (node: Node, wrapEm: boolean) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        for (const part of (child.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue
          if (/^\s+$/.test(part)) {
            frag.append(' ')
            continue
          }
          const w = document.createElement(wrapEm ? 'em' : 'span')
          w.className = 'w'
          w.textContent = part
          words.push(w)
          frag.append(w)
        }
        child.replaceWith(frag)
      } else if (child instanceof HTMLElement && child.tagName === 'EM') {
        walk(child, true)
        child.replaceWith(...child.childNodes)
      } else if (child instanceof HTMLElement) {
        walk(child, wrapEm)
      }
    }
  }
  walk(el, false)
  const lines: HTMLElement[][] = []
  let top = -1
  for (const w of words) {
    const t = w.offsetTop
    if (Math.abs(t - top) > 4) {
      lines.push([])
      top = t
    }
    lines[lines.length - 1].push(w)
  }
  el.innerHTML = ''
  for (const line of lines) {
    const mask = document.createElement('span')
    mask.className = 'sl'
    const inner = document.createElement('span')
    line.forEach((w, i) => {
      if (i) inner.append(' ')
      inner.append(w)
    })
    mask.append(inner)
    el.append(mask)
  }
  return $$('.sl > span', el)
}

// ------------------------------------------------------------------ reveals
function initReveals() {
  if (reduced) return
  const splits = $$('[data-split]')
  const run = () => {
    for (const el of splits) {
      const lines = splitLines(el)
      if (el.dataset.done) continue
      gsap.set(lines, { yPercent: 105 })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          el.dataset.done = '1'
          gsap.to(lines, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09 })
        },
      })
    }
  }
  run()
  let w = innerWidth
  addEventListener('resize', () => {
    if (innerWidth === w) return
    w = innerWidth
    for (const el of splits) {
      const lines = splitLines(el)
      if (!el.dataset.done) gsap.set(lines, { yPercent: 105 })
    }
  })

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }),
  })
  ScrollTrigger.batch('[data-reveal-img]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) =>
      els.forEach((el, i) => {
        gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut', delay: i * 0.1 })
        const img = el.querySelector('img')
        if (img && !img.hasAttribute('data-parallax')) gsap.from(img, { scale: 1.18, duration: 2.2, ease: 'expo.out', delay: i * 0.1 })
      }),
  })

  for (const img of $$('[data-parallax]')) {
    gsap.fromTo(
      img,
      { yPercent: -5 },
      { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
  }

  for (const rule of $$('[data-seam]')) {
    gsap.fromTo(
      rule,
      { '--seam': 0 },
      { '--seam': 1, ease: 'none', scrollTrigger: { trigger: rule, start: 'top 95%', end: 'top 45%', scrub: true } },
    )
  }

  // ledgers and process steps: rows stitch in one after another
  for (const list of $$('[data-ledger], [data-process], [data-credits]')) {
    const rows = [...list.children]
    gsap.set(rows, { opacity: 0, y: 20 })
    ScrollTrigger.create({
      trigger: list,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(rows, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }),
    })
  }
}

// ------------------------------------------------------------------ hero
function initHero() {
  const hero = $('[data-hero]')!
  const frame = $('[data-hero-frame]')!
  const canvas = $<HTMLCanvasElement>('[data-hero-canvas]')!

  if (!reduced) {
    gsap.from('[data-hero-line]', { yPercent: 110, duration: 1.8, ease: 'expo.out', stagger: 0.12, delay: 0.15 })
    gsap.from('[data-hero-in]', { opacity: 0, y: 14, duration: 1.4, ease: 'expo.out', stagger: 0.1, delay: 0.6 })
  }

  let scroll = 0
  if (!reduced) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (st) => {
        scroll = st.progress
        const inset = st.progress * 9
        frame.style.clipPath = `inset(${inset * 0.6}% ${inset}% 0% ${inset}%)`
      },
    })
    gsap.to('.hero__content', {
      yPercent: -18,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: '75% top', scrub: true },
    })
  }

  if (!hasWebGL2 || reduced) return
  let r: ReliefRenderer
  try {
    r = new ReliefRenderer(canvas)
  } catch {
    return
  }
  const lowPower = coarse || small() || (navigator.hardwareConcurrency ?? 8) <= 4
  r.scale = lowPower ? 0.5 : 0.75
  r.shadowSteps = lowPower ? 6 : 10

  const size = () => r.resize(frame.clientWidth, frame.clientHeight, Math.min(devicePixelRatio, 1.5))
  size()
  addEventListener('resize', size)

  let px = 0
  let py = 0
  let tx = 0
  let ty = 0
  if (!coarse) {
    hero.addEventListener('pointermove', (e) => {
      tx = (e.clientX / innerWidth) * 2 - 1
      ty = (e.clientY / innerHeight) * 2 - 1
    })
  }

  let visible = true
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(hero)

  let frames = 0
  let slow = 0
  let last = performance.now()
  let alive = true
  const t0 = last
  const shot: ReliefShot = { ...HERO_SHOT }
  const loop = (now: number) => {
    if (!alive) return
    requestAnimationFrame(loop)
    if (!visible || document.hidden) {
      last = now
      return
    }
    const dt = now - last
    last = now
    const t = (now - t0) / 1000
    px += (tx - px) * 0.04
    py += (ty - py) * 0.04

    // Camera rises away from the hide as the page scrolls; light drifts.
    const s = scroll
    const az = Math.sin(t * 0.12) * 0.35 + px * 0.5
    const L = HERO_SHOT.light
    shot.light = [L[0] * Math.cos(az) - L[1] * Math.sin(az), L[0] * Math.sin(az) + L[1] * Math.cos(az), L[2] + py * -0.06]
    shot.cam = [HERO_SHOT.cam[0] + px * 1.5, HERO_SHOT.cam[1] - s * 22, HERO_SHOT.cam[2] + s * 34]
    shot.target = [HERO_SHOT.target[0], HERO_SHOT.target[1] + t * 0.15]
    shot.pool = [HERO_SHOT.pool[0] + Math.sin(t * 0.1) * 3, HERO_SHOT.pool[1] + t * 0.15]
    shot.poolRadius = HERO_SHOT.poolRadius + s * 20
    r.render(shot, t)

    if (frames === 0) canvas.classList.add('is-live')
    frames++
    // A device that cannot draw the relief at a few frames per second keeps the poster.
    if (frames > 1 && frames <= 6 && dt > 140) slow += 10
    if (frames === 6 && slow >= 40) {
      alive = false
      canvas.classList.remove('is-live')
      r.dispose()
      return
    }
    if (frames === 6) slow = 0
    // adapt resolution once if the device struggles
    if (frames > 10 && frames < 70 && dt > 34) slow++
    if (frames === 70 && slow > 30 && r.scale > 0.4) {
      r.scale *= 0.65
      r.shadowSteps = 5
      size()
    }
  }
  requestAnimationFrame(loop)
}

// ------------------------------------------------------------------ the stitch
function initStitch() {
  const section = $('[data-stitch]')!
  const canvas = $<HTMLCanvasElement>('[data-stitch-canvas]')!
  const chapters = $$('li', $('[data-stitch-chapters]')!)
  const stills = $$<HTMLImageElement>('img', $('[data-stitch-stills]')!)
  const bar = $('[data-stitch-bar]')!
  const marks = [0, 0.15, 0.45, 0.66, 0.88]

  if (reduced) {
    section.classList.add('is-static')
    stills.forEach((img) => (img.loading = 'eager'))
    return
  }

  let progress = 0
  const setChapter = (p: number) => {
    let idx = 0
    marks.forEach((m, i) => p >= m && (idx = i))
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx))
    stills.forEach((img, i) => img.classList.toggle('is-active', i === idx))
    bar.style.setProperty('--p', String(p))
  }
  setChapter(0)

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (st) => {
      progress = st.progress
      setChapter(progress)
    },
  })

  if (!hasWebGL2) return

  // Load the 3D scene only as the section approaches.
  const io = new IntersectionObserver(
    async ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const lowPower = coarse || small() || (navigator.hardwareConcurrency ?? 8) <= 4
      let atelier: import('./gl/atelier').Atelier
      try {
        const { Atelier } = await import('./gl/atelier')
        atelier = new Atelier(canvas, { quality: lowPower ? 'low' : 'high' })
      } catch (err) {
        console.warn('Stitch scene unavailable, showing stills.', err)
        return
      }
      const sticky = canvas.parentElement!
      const size = () => atelier.resize(sticky.clientWidth, sticky.clientHeight, Math.min(devicePixelRatio, lowPower ? 1.25 : 1.5))
      size()
      addEventListener('resize', size)

      let visible = false
      new IntersectionObserver(([v]) => (visible = v.isIntersecting)).observe(section)

      let smoothP = progress
      let frames = 0
      let slow = 0
      let last = performance.now()
      let alive = true
      const loop = (now: number) => {
        if (!alive) return
        requestAnimationFrame(loop)
        if (!visible || document.hidden) {
          last = now
          return
        }
        const dt = now - last
        last = now
        smoothP += (progress - smoothP) * 0.12
        atelier.progress = smoothP
        atelier.render(now / 1000)
        if (frames === 0) {
          canvas.classList.add('is-live')
          section.classList.add('is-live')
        }
        frames++
        // Performance guard: fall back to the rendered stills if frames are too slow.
        if (frames > 15 && frames < 90 && dt > 55) slow++
        if (frames > 1 && frames <= 6 && dt > 160) slow += 10
        if (frames === 6 && slow < 40) slow = 0
        if ((frames === 6 && slow >= 40) || (frames === 90 && slow > 45)) {
          alive = false
          canvas.classList.remove('is-live')
          section.classList.remove('is-live')
          atelier.dispose()
        }
      }
      requestAnimationFrame(loop)
    },
    { rootMargin: '150% 0px' },
  )
  io.observe(section)
}

// ------------------------------------------------------------------ loupe
function initLoupe() {
  if (coarse) return
  for (const fig of $$('[data-loupe]')) {
    const img = $<HTMLImageElement>('img', fig)!
    const lens = document.createElement('div')
    lens.className = 'loupe__lens'
    lens.setAttribute('aria-hidden', 'true')
    fig.append(lens)
    const zoom = 2.6
    fig.addEventListener('pointerenter', () => {
      // always inspect the full-resolution plate
      const full = img.srcset.split(',').pop()!.trim().split(' ')[0] || img.src
      lens.style.backgroundImage = `url(${full})`
      fig.classList.add('is-inspecting')
    })
    fig.addEventListener('pointerleave', () => fig.classList.remove('is-inspecting'))
    fig.addEventListener('pointermove', (e) => {
      const r = fig.getBoundingClientRect()
      const ir = img.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      lens.style.left = `${x}px`
      lens.style.top = `${y}px`
      const bw = ir.width * zoom
      const bh = ir.height * zoom
      lens.style.backgroundSize = `${bw}px ${bh}px`
      lens.style.backgroundPosition = `${-(e.clientX - ir.left) * zoom + 110}px ${-(e.clientY - ir.top) * zoom + 110}px`
    })
  }
}

// ------------------------------------------------------------------ boot
initNav()
initHero()
initStitch()
initLoupe()
document.fonts.ready.then(() => {
  initReveals()
  ScrollTrigger.refresh()
})
