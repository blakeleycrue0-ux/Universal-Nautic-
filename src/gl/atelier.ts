// THE STITCH — a real-time scene in millimetres.
//
// A piped leather seat cushion rests on a limestone plinth. A machine needle
// closes the last stitches of its top-stitched seam; the camera starts a few
// millimetres above the hide, follows the needle, travels along the finished
// seam around the corner and finally pulls back to reveal the whole piece.
// Everything is driven by a single progress value (0 → 1) from the page's
// scroll position, so it plays identically forwards and backwards.

import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { bakeMaterial, threadBump, type BakedMaterial } from './bake'
import type { MaterialName } from './materials.glsl'

// ---------------------------------------------------------------- geometry
const W = 640 // cushion width (x)
const D = 560 // depth (z)
const T = 110 // thickness (y)
const EDGE = 9 // edge radius of the cushion box
const BULGE = 9 // crown of the top panel
const PIPE = 4.2 // piping radius
const INSET = 22 // top-stitch distance from the edge
const STITCH = 4.6 // stitch length
const THREAD = 0.3 // thread radius
const SEW = 9 // stitches sewn live by the needle

const crown = (x: number, z: number) => {
  const u = Math.min(1, Math.abs(x) / (W / 2))
  const v = Math.min(1, Math.abs(z) / (D / 2))
  return BULGE * (1 - u ** 4) * (1 - v ** 4)
}
const topY = (x: number, z: number) => T / 2 + crown(x, z)

/** Closed rounded rectangle path in the XZ plane. */
class RoundRect {
  readonly length: number
  private segs: { len: number; at: (t: number) => [number, number, number, number] }[] = []
  constructor(a: number, b: number, r: number) {
    // start on the front edge (z = +b) at x = 0, heading +x, counter-clockwise seen from above
    const line = (x0: number, z0: number, x1: number, z1: number) => {
      const len = Math.hypot(x1 - x0, z1 - z0)
      const tx = (x1 - x0) / len
      const tz = (z1 - z0) / len
      return { len, at: (t: number) => [x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, tx, tz] as [number, number, number, number] }
    }
    const arc = (cx: number, cz: number, a0: number) => ({
      len: (Math.PI / 2) * r,
      at: (t: number) => {
        const ang = a0 - (Math.PI / 2) * t
        return [cx + r * Math.cos(ang), cz + r * Math.sin(ang), Math.sin(ang), -Math.cos(ang)] as [number, number, number, number]
      },
    })
    this.segs = [
      line(0, b, a - r, b),
      arc(a - r, b - r, Math.PI / 2),
      line(a, b - r, a, -b + r),
      arc(a - r, -b + r, 0),
      line(a - r, -b, -a + r, -b),
      arc(-a + r, -b + r, -Math.PI / 2),
      line(-a, -b + r, -a, b - r),
      arc(-a + r, b - r, -Math.PI),
      line(-a + r, b, 0, b),
    ]
    this.length = this.segs.reduce((s, g) => s + g.len, 0)
  }
  /** returns [x, z, tangentX, tangentZ] */
  at(s: number): [number, number, number, number] {
    s = ((s % this.length) + this.length) % this.length
    for (const g of this.segs) {
      if (s <= g.len) return g.at(s / g.len)
      s -= g.len
    }
    return this.segs[0].at(0)
  }
}

/** Tile a shared baked texture by scaling UVs (render-target textures cannot be cloned). */
const scaleUV = <G extends THREE.BufferGeometry>(g: G, sx: number, sy: number) => {
  const uv = g.attributes.uv as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy)
  return g
}

/**
 * Uniformly subdivided rounded box (RoundedBoxGeometry packs its vertices
 * into the corners, which leaves no room to sculpt the panels).
 * `crown(a, b)` adds a soft dome to both faces along the `axis`.
 */
function cushionGeometry(
  w: number,
  h: number,
  d: number,
  r: number,
  axis: 'y' | 'z',
  crownFn: (a: number, b: number) => number,
  period: number,
) {
  const step = 6
  const g = new THREE.BoxGeometry(w, h, d, Math.ceil(w / step), Math.ceil(h / step), Math.ceil(d / step))
  const pos = g.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const inner = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    inner.set(
      THREE.MathUtils.clamp(v.x, -w / 2 + r, w / 2 - r),
      THREE.MathUtils.clamp(v.y, -h / 2 + r, h / 2 - r),
      THREE.MathUtils.clamp(v.z, -d / 2 + r, d / 2 - r),
    )
    const off = v.clone().sub(inner)
    if (off.lengthSq() > 1e-6) v.copy(inner).addScaledVector(off.normalize(), r)
    const half = axis === 'y' ? h / 2 : d / 2
    const c = axis === 'y' ? v.y : v.z
    const k = smooth(half - r, half, Math.abs(c)) * Math.sign(c)
    const bump = axis === 'y' ? crownFn(v.x, v.z) : crownFn(v.x, v.y)
    if (axis === 'y') v.y += bump * k
    else v.z += bump * k
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  // planar UVs per face direction, in millimetres / tile period: no stretching on the sides
  const nrm = g.attributes.normal as THREE.BufferAttribute
  const uv = g.attributes.uv as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const ax = Math.abs(nrm.getX(i))
    const ay = Math.abs(nrm.getY(i))
    const az = Math.abs(nrm.getZ(i))
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    if (ay >= ax && ay >= az) uv.setXY(i, x / period, z / period)
    else if (az >= ax) uv.setXY(i, x / period, y / period)
    else uv.setXY(i, z / period, y / period)
  }
  return g
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// ---------------------------------------------------------------- presets
export type AtelierLook = {
  seat: { material: MaterialName; tintA: string; tintB: string; normal: number; roughness: number }
  back: { material: MaterialName; tintA: string; tintB: string; normal: number; roughness: number }
  thread: string
  plinth: 'stone' | 'teak'
  background: string
  key: { color: string; intensity: number; dir: [number, number, number] }
  ambient: number
}

export const LOOKS: Record<'atelier' | 'deck', AtelierLook> = {
  atelier: {
    seat: { material: 'leather', tintA: '#d8ccb9', tintB: '#a99680', normal: 1.3, roughness: 0.55 },
    back: { material: 'nappa', tintA: '#28333c', tintB: '#1b252d', normal: 1, roughness: 0.48 },
    thread: '#7d5a3c',
    plinth: 'stone',
    background: '#0d0e0f',
    key: { color: '#ffe9d0', intensity: 3.2, dir: [-0.75, 0.42, 0.5] },
    ambient: 0.22,
  },
  deck: {
    seat: { material: 'canvas', tintA: '#e2dbcd', tintB: '#aaa08f', normal: 1.2, roughness: 0.85 },
    back: { material: 'canvas', tintA: '#4a5862', tintB: '#2e3a43', normal: 1.2, roughness: 0.85 },
    thread: '#857b6c',
    plinth: 'teak',
    background: '#9fb3bd',
    key: { color: '#fff6e8', intensity: 4.2, dir: [0.45, 0.85, 0.35] },
    ambient: 0.75,
  },
}

export type AtelierOptions = { quality: 'high' | 'low'; look?: keyof typeof LOOKS; preserve?: boolean }

export class Atelier {
  readonly canvas: HTMLCanvasElement
  readonly renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20000)
  private composer?: EffectComposer
  private bokeh?: BokehPass
  private grain?: ShaderPass
  private key = new THREE.DirectionalLight()
  private hemi = new THREE.HemisphereLight()
  private path = new RoundRect(W / 2 - INSET, D / 2 - INSET, 30)
  private stitches!: THREE.Mesh
  private holes!: THREE.InstancedMesh
  private needle!: THREE.Group
  private live!: THREE.Mesh
  private threadMat!: THREE.MeshStandardMaterial
  private stitchCount: number
  private sEnd: number
  private quality: 'high' | 'low'
  private look: AtelierLook
  private baked = new Map<string, BakedMaterial>()
  progress = 0
  /** Fixed camera for still renders: overrides the scroll choreography. */
  still?: { cam: [number, number, number]; target: [number, number, number]; fov: number; aperture: number }

  constructor(canvas: HTMLCanvasElement, opts: AtelierOptions) {
    this.canvas = canvas
    this.quality = opts.quality
    this.look = LOOKS[opts.look ?? 'atelier']
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: opts.quality === 'low',
      powerPreference: 'high-performance',
      preserveDrawingBuffer: !!opts.preserve,
    })
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.78
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.stitchCount = Math.floor(this.path.length / STITCH)
    // The seam closes on the front edge, a little before the front-right corner.
    this.sEnd = this.stitchCount * STITCH

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.35
    pmrem.dispose()

    this.build()
    if (opts.quality === 'high') this.buildPost()
  }

  private surface(name: MaterialName, a: string, b: string, size = 1024) {
    const key = `${name}${a}${b}`
    if (!this.baked.has(key)) this.baked.set(key, bakeMaterial(this.renderer, name, a, b, size))
    return this.baked.get(key)!
  }

  private build() {
    const L = this.look
    const tex = this.quality === 'high' ? 1024 : 512
    this.scene.background = new THREE.Color(L.background)
    this.scene.fog = new THREE.Fog(L.background, 1800, 5200)

    // ---- seat cushion
    // crown only on the top panel; the underside sits flat on the plinth
    const seatSurf = this.surface(L.seat.material, L.seat.tintA, L.seat.tintB, tex)
    const seatGeo = cushionGeometry(W, T, D, EDGE, 'y', (x, z) => crown(x, z), seatSurf.period)
    const sp = seatGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < sp.count; i++) if (sp.getY(i) < -T / 2 + EDGE) sp.setY(i, Math.max(sp.getY(i), -T / 2 - 0.0))
    seatGeo.computeVertexNormals()
    const seatMat = new THREE.MeshPhysicalMaterial({
      map: seatSurf.map,
      normalMap: seatSurf.normalMap,
      normalScale: new THREE.Vector2(L.seat.normal, L.seat.normal),
      roughness: L.seat.roughness,
      sheen: 0.25,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color(L.seat.tintA),
    })
    const seat = new THREE.Mesh(seatGeo, seatMat)
    seat.castShadow = seat.receiveShadow = true
    this.scene.add(seat)

    // ---- piping, top and bottom edge
    const pipeMat = seatMat
    for (const y of [T / 2 - 1.5, -T / 2 + 1.5]) {
      const rr = new RoundRect(W / 2 - 0.8, D / 2 - 0.8, EDGE)
      const pts: THREE.Vector3[] = []
      for (let i = 0; i < 400; i++) {
        const [x, z] = rr.at((i / 400) * rr.length)
        pts.push(new THREE.Vector3(x, y, z))
      }
      const pipeGeo = scaleUV(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 800, PIPE, 12, true), rr.length / seatSurf.period, (PIPE * 2 * Math.PI) / seatSurf.period)
      const pipe = new THREE.Mesh(pipeGeo, pipeMat)
      pipe.castShadow = pipe.receiveShadow = true
      this.scene.add(pipe)
    }

    // ---- back cushion, leaning against an implied wall
    const backSurf = this.surface(L.back.material, L.back.tintA, L.back.tintB, tex)
    const BH = 400
    const BT = 150
    const backGeo = cushionGeometry(W, BH, BT, 30, 'z', (x, y) => {
      const u = Math.min(1, Math.abs(x) / (W / 2))
      const v = Math.min(1, Math.abs(y) / (BH / 2))
      return 20 * (1 - u ** 4) * (1 - v ** 4)
    }, backSurf.period)
    const back = new THREE.Mesh(
      backGeo,
      new THREE.MeshPhysicalMaterial({
        map: backSurf.map,
        normalMap: backSurf.normalMap,
        normalScale: new THREE.Vector2(L.back.normal, L.back.normal),
        roughness: L.back.roughness,
        sheen: 0.2,
        sheenColor: new THREE.Color(L.back.tintA),
      }),
    )
    back.position.set(0, T / 2 + BH / 2 - 14, -D / 2 + 60)
    back.rotation.x = -0.24
    back.castShadow = back.receiveShadow = true
    this.scene.add(back)

    // ---- plinth and floor
    const plinthSurf =
      L.plinth === 'stone' ? this.surface('stone', '#7a746c', '#69635c', tex) : this.surface('teak', '#a07a55', '#4f3b2a', tex)
    const pw = 1500
    const ph = 300
    const pd = 900
    const plinthGeo = scaleUV(new THREE.BoxGeometry(pw, ph, pd), pw / plinthSurf.period, pd / plinthSurf.period)
    const plinth = new THREE.Mesh(
      plinthGeo,
      new THREE.MeshStandardMaterial({
        map: plinthSurf.map,
        normalMap: plinthSurf.normalMap,
        roughness: L.plinth === 'stone' ? 0.8 : 0.72,
        normalScale: new THREE.Vector2(0.35, 0.35),
      }),
    )
    plinth.position.set(0, -T / 2 - ph / 2, -pd / 2 + D / 2 + 120)
    plinth.receiveShadow = plinth.castShadow = true
    this.scene.add(plinth)

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20000, 20000),
      new THREE.MeshStandardMaterial({ color: L.background, roughness: 0.95 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -T / 2 - ph
    floor.receiveShadow = true
    this.scene.add(floor)

    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(20000, 8000),
      new THREE.MeshStandardMaterial({ color: L.background, roughness: 1 }),
    )
    wall.position.set(0, 3000, -D / 2 - 120)
    wall.receiveShadow = true
    this.scene.add(wall)

    // ---- stitches: one merged mesh ordered along the seam so drawRange can grow it
    const bump = threadBump()
    bump.repeat.set(7, 1)
    this.threadMat = new THREE.MeshStandardMaterial({
      color: L.thread,
      roughness: 0.62,
      bumpMap: bump,
      bumpScale: 1.2,
    })
    const tubes: THREE.BufferGeometry[] = []
    for (let i = 0; i < this.stitchCount; i++) tubes.push(this.stitchGeo(i * STITCH, (i + 1) * STITCH))
    const merged = mergeGeometries(tubes)!
    tubes.forEach((g) => g.dispose())
    this.stitches = new THREE.Mesh(merged, this.threadMat)
    this.stitches.castShadow = true
    this.scene.add(this.stitches)
    ;(this.stitches.userData as { perStitch: number }).perStitch = merged.index!.count / this.stitchCount

    // ---- needle holes: soft dark dimples under each stitch end
    const holeTex = (() => {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const g = c.getContext('2d')!
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grd.addColorStop(0, 'rgba(10,6,3,0.9)')
      grd.addColorStop(0.35, 'rgba(20,12,6,0.55)')
      grd.addColorStop(1, 'rgba(20,12,6,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    })()
    this.holes = new THREE.InstancedMesh(
      new THREE.CircleGeometry(1.1, 16).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({
        map: holeTex,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
      this.stitchCount + 1,
    )
    const m = new THREE.Matrix4()
    for (let i = 0; i <= this.stitchCount; i++) {
      const [x, z] = this.path.at(i * STITCH)
      m.makeTranslation(x, topY(x, z) + 0.05, z)
      this.holes.setMatrixAt(i, m)
    }
    this.scene.add(this.holes)

    // ---- needle (sewing-machine needle, polished steel)
    const prof: THREE.Vector2[] = []
    const shaft = 0.8
    for (let i = 0; i <= 24; i++) {
      const t = i / 24
      const y = t * 4.5
      prof.push(new THREE.Vector2(shaft * Math.pow(t, 0.55) + 0.0001, y))
    }
    prof.push(new THREE.Vector2(shaft, 60))
    prof.push(new THREE.Vector2(0.0001, 60))
    const needleMesh = new THREE.Mesh(
      new THREE.LatheGeometry(prof, 32),
      new THREE.MeshStandardMaterial({ color: '#d9dcdf', metalness: 1, roughness: 0.16 }),
    )
    needleMesh.castShadow = true
    // eye: a dark slot near the point
    const eye = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.16, 1.1, 4, 8),
      new THREE.MeshBasicMaterial({ color: '#0b0b0b' }),
    )
    eye.position.y = 7
    eye.scale.set(1.6, 1, 2.6)
    this.needle = new THREE.Group()
    this.needle.add(needleMesh, eye)
    this.scene.add(this.needle)

    // ---- the live thread from the last hole up through the needle eye
    this.live = new THREE.Mesh(new THREE.BufferGeometry(), this.threadMat)
    this.live.castShadow = true
    this.scene.add(this.live)

    // ---- lights
    this.key.color.set(L.key.color)
    this.key.intensity = L.key.intensity
    this.key.castShadow = true
    const sm = this.quality === 'high' ? 2048 : 1024
    this.key.shadow.mapSize.set(sm, sm)
    this.key.shadow.bias = -0.0002
    this.key.shadow.normalBias = 0.02
    this.scene.add(this.key, this.key.target)
    this.hemi.color.set('#d9dde0')
    this.hemi.groundColor.set('#2a2622')
    this.hemi.intensity = L.ambient
    this.scene.add(this.hemi)
  }

  private stitchGeo(s0: number, s1: number) {
    const [x0, z0] = this.path.at(s0)
    const [x1, z1] = this.path.at(s1)
    const pt = (t: number, lift: number) => {
      const x = x0 + (x1 - x0) * t
      const z = z0 + (z1 - z0) * t
      return new THREE.Vector3(x, topY(x, z) + lift, z)
    }
    const curve = new THREE.CatmullRomCurve3(
      [pt(0.02, -0.3), pt(0.1, 0.12), pt(0.3, THREAD * 0.8), pt(0.7, THREAD * 0.8), pt(0.9, 0.12), pt(0.98, -0.3)],
      false,
      'centripetal',
    )
    return new THREE.TubeGeometry(curve, 14, THREAD, 7, false)
  }

  private buildPost() {
    const r = this.renderer
    this.composer = new EffectComposer(r)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bokeh = new BokehPass(this.scene, this.camera, { focus: 30, aperture: 0.002, maxblur: 0.012 })
    this.composer.addPass(this.bokeh)
    this.composer.addPass(new OutputPass())
    this.grain = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
        float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTime) * 43758.5453); }
        void main(){
          vec4 c = texture2D(tDiffuse, vUv);
          vec2 q = vUv - 0.5;
          c.rgb *= 1.0 - dot(q, q) * 0.9;
          c.rgb += (h(gl_FragCoord.xy * 0.01) - 0.5) * 0.03;
          gl_FragColor = c;
        }`,
    })
    this.composer.addPass(this.grain)
  }

  resize(w: number, h: number, dpr: number) {
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    this.composer?.setPixelRatio(dpr)
    this.composer?.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  /** Point on the seam at arc length s, lifted above the surface. */
  private seam(s: number, lift = 0) {
    const [x, z, tx, tz] = this.path.at(s)
    return { p: new THREE.Vector3(x, topY(x, z) + lift, z), t: new THREE.Vector3(tx, 0, tz) }
  }

  /** Lay out the whole scene for a progress value in [0, 1]. */
  private pose(p: number, time: number) {
    const sStart = this.sEnd - SEW * STITCH
    const portrait = this.camera.aspect < 0.9

    // --- needle: descends (0.12–0.18), sews (0.18–0.44), withdraws (0.44–0.52)
    const sewT = smooth(0.18, 0.44, p)
    const stitchF = sewT * SEW // continuous stitch counter
    const k = Math.min(SEW - 1, Math.floor(stitchF))
    const phase = stitchF >= SEW ? 1 : stitchF - k
    // material is fed while the needle is up (middle of each cycle)
    const feed = smooth(0.3, 0.75, phase)
    const sNeedle = sStart + (k + feed) * STITCH
    // needle height: pierced at phase 0 and 1, highest mid-cycle
    const lift = Math.sin(Math.PI * phase)
    const enter = 1 - smooth(0.12, 0.19, p)
    const leave = smooth(0.44, 0.52, p)
    const tipY = -2.2 + lift * 6.5 + (enter + leave) * 90

    const nAt = this.seam(sNeedle)
    this.needle.position.set(nAt.p.x, nAt.p.y + tipY, nAt.p.z)
    this.needle.rotation.y = Math.atan2(-nAt.t.z, nAt.t.x)
    this.needle.visible = enter < 0.999 && leave < 0.999

    // --- finished stitches: everything except the live gap
    const done = Math.floor(this.stitchCount - SEW + (stitchF >= SEW ? SEW : k))
    const per = (this.stitches.userData as { perStitch: number }).perStitch
    this.stitches.geometry.setDrawRange(0, done * per)
    this.holes.count = Math.min(this.stitchCount + 1, done + 1 + (phase > 0.75 || stitchF >= SEW ? 1 : 0))

    // --- live thread: from the last finished hole, along the surface, up through the eye
    const lastHole = this.seam(sStart + k * STITCH, -0.5)
    const eye = new THREE.Vector3(nAt.p.x, nAt.p.y + tipY + 7, nAt.p.z)
    const pts: THREE.Vector3[] = [lastHole.p]
    if (stitchF < SEW && this.needle.visible) {
      const reach = Math.max(0, sNeedle - (sStart + k * STITCH))
      if (reach > 0.4) {
        pts.push(this.seam(sStart + k * STITCH + Math.min(0.5, reach * 0.2), 0.2).p)
        const lie = Math.max(0, tipY < 0.5 ? reach : 0)
        if (lie > 1) pts.push(this.seam(sStart + k * STITCH + lie * 0.5, THREAD * 0.85).p)
      }
      pts.push(new THREE.Vector3().lerpVectors(pts[pts.length - 1], eye, 0.5).add(new THREE.Vector3(0, 0.4, 0)))
      pts.push(eye)
      const front = new THREE.Vector3(-nAt.t.x, 0, -nAt.t.z).multiplyScalar(0.8 + THREAD)
      pts.push(eye.clone().add(front).add(new THREE.Vector3(0, 6, 0)))
      pts.push(eye.clone().add(front).add(new THREE.Vector3(0, 60, 0)))
      this.live.geometry.dispose()
      this.live.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, THREAD, 7, false)
      this.live.visible = true
    } else {
      this.live.visible = false
    }

    // --- camera choreography
    const pull = ease(smooth(0.6, 0.9, p))
    // A: material — low across untouched hide, creeping forward
    // B: craft — beside the needle
    // C: transformation — along the finished seam and round the corner
    const travel = ease(smooth(0.46, 0.7, p)) * 300
    const sFocus = p < 0.18 ? sStart + 14 - smooth(0, 0.18, p) * 14 : sNeedle + travel
    const f = this.seam(sFocus)
    const inward = new THREE.Vector3(-f.t.z, 0, f.t.x) // points into the cushion
    const rise = smooth(0.5, 0.7, p)
    const macroDist = (portrait ? 40 : 30) + rise * 70
    const macroCam = f.p
      .clone()
      .addScaledVector(f.t, -macroDist * 0.78)
      .addScaledVector(inward, macroDist * 0.42)
      .add(new THREE.Vector3(0, 6 + (1 - smooth(0, 0.16, p)) * -1.5 + rise * 40 + (p > 0.14 ? 4 : 0) * smooth(0.12, 0.2, p), 0))
    const macroTarget = f.p.clone().add(new THREE.Vector3(0, 3.5 * smooth(0.1, 0.2, p) * (1 - leave), 0))

    // D: reveal — a calm three-quarter view of the whole piece
    const wideTarget = new THREE.Vector3(portrait ? 20 : -90, 80, 20)
    const wideCam = portrait ? new THREE.Vector3(900, 620, 1900) : new THREE.Vector3(820, 360, 980)

    // interpolate direction and log-distance so the dolly feels physical
    const dirA = macroCam.clone().sub(macroTarget)
    const dirB = wideCam.clone().sub(wideTarget)
    const dA = dirA.length()
    const dB = dirB.length()
    const dir = dirA.normalize().lerp(dirB.normalize(), pull).normalize()
    const dist = Math.exp(Math.log(dA) + (Math.log(dB) - Math.log(dA)) * pull)
    const target = macroTarget.clone().lerp(wideTarget, pull)
    this.camera.position.copy(target).addScaledVector(dir, dist)
    this.camera.lookAt(target)
    this.camera.near = Math.max(0.2, dist * 0.02)
    this.camera.far = dist * 40 + 8000
    this.camera.fov = portrait ? 40 : 32
    this.camera.updateProjectionMatrix()

    // --- light: slow raking sweep in macro, settling for the reveal
    const L = this.look.key.dir
    const sweep = (1 - pull) * (Math.sin(time * 0.25) * 0.25 + (p - 0.2) * 0.9)
    const ld = new THREE.Vector3(L[0], L[1] * (0.55 + 0.45 * pull), L[2]).applyAxisAngle(new THREE.Vector3(0, 1, 0), sweep).normalize()
    const span = Math.max(30, dist * 0.9)
    this.key.target.position.copy(target)
    this.key.position.copy(target).addScaledVector(ld, span * 3)
    const sc = this.key.shadow.camera
    const ext = Math.max(18, Math.min(1100, dist * 0.9))
    sc.left = sc.bottom = -ext
    sc.right = sc.top = ext
    sc.near = span * 0.5
    sc.far = span * 6
    sc.updateProjectionMatrix()

    if (this.still) {
      const v = this.still
      this.camera.position.set(...v.cam)
      const tg = new THREE.Vector3(...v.target)
      this.camera.lookAt(tg)
      this.camera.fov = v.fov
      const d = this.camera.position.distanceTo(tg)
      this.camera.near = Math.max(0.2, d * 0.02)
      this.camera.updateProjectionMatrix()
      this.key.target.position.copy(tg)
      this.key.position.copy(tg).addScaledVector(new THREE.Vector3(...this.look.key.dir).normalize(), 3000)
      sc.left = sc.bottom = -900
      sc.right = sc.top = 900
      sc.near = 1000
      sc.far = 6000
      sc.updateProjectionMatrix()
      if (this.bokeh) {
        const u = this.bokeh.uniforms as Record<string, THREE.IUniform>
        u.focus.value = d
        u.aperture.value = v.aperture
        u.maxblur.value = 0.01
      }
      this.hemi.intensity = this.look.ambient
      this.scene.environmentIntensity = 0.35
      return
    }

    this.hemi.intensity = this.look.ambient * (0.45 + 0.55 * pull)
    this.scene.environmentIntensity = 0.18 + 0.2 * pull

    if (this.bokeh) {
      const u = this.bokeh.uniforms as Record<string, THREE.IUniform>
      u.focus.value = dist
      u.aperture.value = (1 - pull) * 0.0012 + pull * 0.0000035 + 0.0000025
      u.maxblur.value = 0.01 * (1 - pull * 0.6)
    }
  }

  render(time = 0) {
    this.pose(this.progress, time)
    if (this.grain) this.grain.uniforms.uTime.value = time % 10
    if (this.composer) this.composer.render()
    else this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.renderer.dispose()
    this.composer?.dispose()
  }
}
