# Universal Nautic — *Beyond the Surface*

> **Independent design concept.** This is a private, speculative prototype. It
> is **not** the official Universal Nautic website, has not been commissioned
> or approved by Universal Nautic S.L., and must not be deployed publicly or
> presented as an official redesign. It does not touch the live site, its
> hosting, DNS, CMS or analytics. Official site: https://universalnautic.com/

A single-page, scroll-driven showcase for a superyacht furnishing and marine
upholstery workshop in Santa Ponsa, Mallorca. The material itself is the
protagonist: every image on the page is an original procedural rendering of a
surface — leather, nappa, wool, cashmere twill, canvas, teak — and the
signature sequence is a real-time 3D scene in which a needle closes the
top-stitched seam of a leather cushion.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm run plates     # re-render every image in public/plates (≈10 min, uses Playwright + headless Chromium)
```

`npm run plates` needs Playwright with a Chromium build available
(`npx playwright install chromium` on a fresh machine). Pass names to render a
subset (`node tools/render-plates.mjs leather teak`) and `SCALE=0.4` for quick
previews.

## Creative direction

| | |
|---|---|
| **Idea** | *Beyond the Surface* — begin at the scale of a millimetre of hide and pull back to the finished piece. Craft before claims. |
| **Palette** | Ink `#0d0e0f`, warm ivory `#f2eee6`, natural stone `#cfc6b8`, graphite `#2b2d2f`, deep marine `#14232c`, a pale sea-light for the exterior chapter. One accent only: **thread** `#9b7350`, the colour of the seam, used for numerals, rules and focus states. No gold. |
| **Typography** | *Newsreader* (variable, optical sizes) at light weights for display and editorial text; *Inter Tight* for interface, labels and small print. Display sizes are set tight (-0.03 to -0.045em) with deliberate line breaks; small caps labels are tracked wide. |
| **Grid** | 12 columns, gutters `clamp(16px, 4vw, 64px)`. Every section uses the grid differently — offset pairs, full bleed, sticky ledger, five-column process, magazine spread, credits roll — so no two sections share a template. |
| **Image treatment** | Macro, raking light, shallow depth of field, a single warm key falling off into ink. Exterior switches to flat Mediterranean daylight on a pale ground. Images are revealed by a vertical mask and settle from a slight scale. |
| **Motion** | Native scroll only (no smooth-scroll hijack). GSAP ScrollTrigger scrubs the hero frame and the stitch sequence; headings rise line by line; lists stitch in row by row; a dashed thread rule draws across the page. No bounce, no elastic, nothing loops except the hero light. Reduced-motion users get a static, fully readable page. |
| **Tone** | Quiet, exact, experienced. British English. Short sentences. |

### The opening
A live WebGL rendering of pebbled full-grain leather, photographed as if through
a macro lens: a low raking light drifts across it and follows the pointer; as
the page scrolls, the camera lifts away from the hide and the image is framed
in by the layout. A pre-rendered still of the same scene is the poster and the
fallback, so nothing waits on JavaScript.

### The stitch (signature)
A pinned, scroll-scrubbed Three.js scene, in millimetres:

1. **Material** — the camera is a few millimetres above untouched leather.
2. **Craft** — a polished machine needle descends and closes the last nine
   stitches of the seam; the thread is real geometry (twisted-ply relief,
   shadows, needle holes) running from the last hole up through the eye.
3. **Line** — the camera travels along the finished seam and around a corner.
4. **Form** — a dolly-out (interpolated in log-distance) reveals a piped, crowned
   seat cushion and a perforated nappa back cushion on a limestone plinth.
5. **Message** — *Excellence lives in the details.*

Surfaces are baked on the GPU from the same procedural material library as the
still plates, so the 3D scene and the photography match. The scene is only
loaded as it approaches, only renders while visible, uses depth of field and
grain on capable desktops, a lighter path on mobile, and **falls back to five
pre-rendered frames** if WebGL2 is missing or the device cannot hold the frame
rate. A deliberately honest note: this is a convincing *machine* top-stitch at
macro scale; it is not a hand-sewing simulation, and the wide reveal reads as a
3D study rather than a photograph.

## Technology

- **Vite** + **TypeScript** (no framework — the page is static HTML with progressive enhancement)
- **GSAP 3 / ScrollTrigger** for scroll choreography
- **Three.js** (code-split, loaded on demand) for the stitch scene: `RoomEnvironment` reflections, `BokehPass` depth of field, PCF shadows
- A small **raw WebGL2** renderer (`src/gl/relief.ts`) for the hero and the material plates: height-field relief, self-shadowing, DOF by footprint
- Self-hosted variable fonts via **@fontsource** (Newsreader, Inter Tight)
- **Playwright** + **sharp** (dev only) to render plates to WebP at two sizes

```
index.html                 the page (all nine sections)
src/main.ts                navigation, reveals, hero loop, stitch driver, loupe
src/styles/main.css        design tokens and every section's layout
src/gl/materials.glsl.ts   procedural material library (shared)
src/gl/relief.ts           macro relief renderer (hero + plates)
src/gl/shots.ts            art-directed camera/light set-ups for each plate
src/gl/bake.ts             GPU texture baking for the 3D scene
src/gl/atelier.ts          the stitch scene
tools/render-plates.mjs    renders public/plates/*.webp
tools/plates.html, tools/atelier.html   dev pages used by the renderer
public/plates/             rendered stills (WebP, full + -sm)
```

## Assets to replace

Everything visual is **temporary** and original — no third-party photography
and no Universal Nautic photography (the live site could not be reached from
the build environment, and its imagery has not been licensed for this concept).

| Asset | Where | Replace with |
|---|---|---|
| Typographic wordmark "Universal Nautic" | header, footer | the **official logo file** (not redrawn here on purpose) |
| `hero.webp`, `hero-portrait.webp` + live hero render | Hero | optional: real macro footage/photography of company leatherwork; the live render can stay |
| `leather`, `nappa`, `pile`, `twill`, `canvas`, `teak` plates | Materials, Exterior | macro photographs of real materials from the showroom (keep the crops: 4:5, 3:2, 1:1, 16:9) |
| `interior.webp`, `deck.webp` | Interior, Exterior | real detail photographs of company work |
| `stitch-1…5.webp` | Stitch fallback | regenerate after any scene change (`npm run plates stitch-1 …`) |
| "Finished interior / Finished deck" placeholders | Interior, Exterior | photographs of verified completed projects |
| Selected work slots 01–03 | Selected work | verified projects: name, vessel, scope, year, photographs |
| Workshop placeholder | People | photograph of the Son Bugadelles workshop and team |
| Email | Contact | the company's real address (not found during research; deliberately not invented) |

## Content requiring company approval

Gathered from the company's own web pages via search snippets (the site
itself was blocked by the build environment's network policy) and third-party
directories. **Every item should be confirmed before any use.**

- Founded "at the beginning of 2000"; "more than twenty-five years" is derived from that date.
- Directors **Leon Blakeley** and **Paul Kerrison**, described as hands-on craftsmen.
- Team first names and roles (Heidi; upholsterers Eusebio, Manolo, Dario, Toni; machinists Loli, Julie, Aurora, Eusmane, Natalia; cover makers Antonio, Nathan; carpet fitters Oscar, David). The source snapshot was about a year old — staff may have changed, and staff should consent to being named.
- Workshop/head office **1,000 m²** and showroom **150 m²** (About page). The Deck page separately mentions a **200 m² in-house Garpa showroom** for teak furniture — the two figures need reconciling.
- "Soft Italian leathers in 1000 shades", hand-tufted carpets and rugs, classic cashmeres.
- Textile houses listed: Loro Piana Interiors, Rubelli, Sunbrella, Perennials, Kravet, Designers Guild, Ralph Lauren Home — confirm the relationships and permission to name them.
- Homepage reportedly states "Official distributors of Sylka Spain" — **not used** on the page until confirmed.
- Telephone **+34 971 691 043** (from a directory listing) and address **Calle Islas Baleares 36A, Pol. Son Bugadelles, Santa Ponsa** (directory listings).
- Interior and exterior service lists; "coordinates all trades" and "works with owner-supplied items".
- Process wording in *Project execution* (Advice → Design → Workshop → Aboard → Coordination) is an editorial arrangement of the verified capabilities, not the company's stated method.
- All headlines and body copy are proposed concept copy.

Nothing on the page names a client, yacht, award, certification or statistic
beyond the items above.

## Limitations

- The official website could not be inspected directly (network policy blocked
  it and every image CDN); research relied on search-engine excerpts of its pages.
- Procedural materials are studies, not photographs; they are labelled as such on the page.
- The stitch scene's wide reveal is clearly a 3D render. A filmed macro sequence of
  the real workshop would be the natural next step for that moment.
- The contact section has no form (by design) and no email address (unknown).
