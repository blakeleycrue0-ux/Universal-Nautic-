// A small WebGL2 renderer that photographs a procedural material at macro
// scale: a perspective camera looks across a height field, which is lit by a
// low raking key light with self-shadowing. Depth of field is approximated by
// widening the normal-sampling footprint outside the focal plane.
//
// Used live for the hero and offline (tools/render-plates.mjs) for the still
// material plates, so both share one look.

import { MATERIALS_GLSL, MATERIAL_IDS, type MaterialName } from './materials.glsl'

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() { vUv = aPos; gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCam;
uniform vec3  uFwd;
uniform vec3  uRight;
uniform vec3  uUp;
uniform float uTanFov;
uniform float uFocus;
uniform float uAperture;
uniform vec3  uLight;
uniform vec3  uLightCol;
uniform vec2  uPool;
uniform float uPoolRadius;
uniform float uExposure;
uniform float uGrain;
uniform vec3  uShadowTint;
uniform int   uShadowSteps;

${MATERIALS_GLSL}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec3 dir = normalize(uFwd + vUv.x * aspect * uTanFov * uRight + vUv.y * uTanFov * uUp);
  float t = -uCam.z / min(dir.z, -1e-3);
  vec2 p = uCam.xy + dir.xy * t;

  vec3 resp = R();
  float rough = resp.x;
  float hs = resp.y;
  float sheen = resp.z;

  float coc = uAperture * abs(t - uFocus) / max(t, 1e-3);
  float eps = 0.015 + coc;
  float h0 = H(p);
  float hx = H(p + vec2(eps, 0.0));
  float hy = H(p + vec2(0.0, eps));
  vec3 n = normalize(vec3(-(hx - h0) / eps * hs, -(hy - h0) / eps * hs, 1.0));
  vec3 alb = A(p, h0);

  vec3 L = normalize(uLight);
  vec3 V = -dir;

  // Height-field self-shadowing toward the key light.
  float sh = 1.0;
  vec3 o = vec3(p, h0 * hs + 0.002);
  float s = 0.04;
  for (int i = 0; i < 12; i++) {
    if (i >= uShadowSteps) break;
    vec3 q = o + L * s;
    float d = q.z - H(q.xy) * hs;
    sh = min(sh, clamp(10.0 * d / s, 0.0, 1.0));
    s *= 1.55;
  }

  float NdL = max(dot(n, L), 0.0);
  float wrap = mix(0.0, 0.35, sheen);
  float diff = max((dot(n, L) + wrap) / (1.0 + wrap), 0.0) * mix(sh, 1.0, wrap * 0.4);

  vec3 Hv = normalize(L + V);
  float NdH = max(dot(n, Hv), 0.0);
  float a2 = rough * rough * rough * rough;
  float D = a2 / (3.14159 * pow(NdH * NdH * (a2 - 1.0) + 1.0, 2.0));
  float F = 0.04 + 0.96 * pow(1.0 - max(dot(Hv, V), 0.0), 5.0);
  float spec = D * F * NdL * sh * 0.25;

  float NdV = max(dot(n, V), 0.0);
  float rim = sheen * pow(1.0 - NdV, 4.0) * NdL * sh;

  float cavity = mix(0.45, 1.0, clamp(h0 * 0.7 + 0.55, 0.0, 1.0));
  float pool = exp(-dot(p - uPool, p - uPool) / (uPoolRadius * uPoolRadius));

  vec3 key = uLightCol * pool;
  vec3 col = alb * key * diff + key * spec + key * rim * alb * 1.5;
  vec3 amb = mix(uShadowTint * 0.6, uShadowTint, n.z) * cavity;
  col += alb * amb * (0.35 + 0.65 * pool);

  // Atmospheric falloff with distance from the lens.
  col *= exp(-max(t - uFocus * 2.5, 0.0) * 0.004);

  col = aces(col * uExposure);
  col = pow(col, vec3(1.0 / 2.2));

  vec2 q = vUv * 0.5;
  col *= 1.0 - dot(q, q) * 0.55;
  float g = hash12(gl_FragCoord.xy + fract(uTime * 7.0) * 113.0) - 0.5;
  col += g * uGrain;

  outColor = vec4(col, 1.0);
}
`

export type ReliefShot = {
  material: MaterialName
  tintA: [number, number, number]
  tintB: [number, number, number]
  /** camera position in mm; z is height above the surface */
  cam: [number, number, number]
  /** point on the surface the camera looks at */
  target: [number, number]
  /** roll of the frame in radians */
  roll?: number
  fov: number
  aperture: number
  light: [number, number, number]
  lightCol: [number, number, number]
  pool: [number, number]
  poolRadius: number
  exposure: number
  shadowTint: [number, number, number]
  grain?: number
}

export class ReliefRenderer {
  readonly canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext
  private prog: WebGLProgram
  private loc: Record<string, WebGLUniformLocation | null> = {}
  scale = 1
  shadowSteps = 10

  constructor(canvas: HTMLCanvasElement, opts: { preserve?: boolean } = {}) {
    this.canvas = canvas
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: !!opts.preserve,
      powerPreference: 'high-performance',
    })
    if (!gl) throw new Error('WebGL2 unavailable')
    this.gl = gl
    this.prog = this.link(VERT, FRAG)
    gl.useProgram(this.prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(this.prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    for (const name of [
      'uRes', 'uTime', 'uCam', 'uFwd', 'uRight', 'uUp', 'uTanFov', 'uFocus', 'uAperture',
      'uLight', 'uLightCol', 'uPool', 'uPoolRadius', 'uExposure', 'uGrain', 'uShadowTint',
      'uShadowSteps', 'uMat', 'uPeriod', 'uTintA', 'uTintB',
    ]) {
      this.loc[name] = gl.getUniformLocation(this.prog, name)
    }
  }

  private link(vs: string, fs: string) {
    const gl = this.gl
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader')
      return s
    }
    const p = gl.createProgram()!
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs))
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link')
    return p
  }

  resize(cssW: number, cssH: number, dpr: number) {
    const w = Math.max(1, Math.round(cssW * dpr * this.scale))
    const h = Math.max(1, Math.round(cssH * dpr * this.scale))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
    }
  }

  render(shot: ReliefShot, time = 0) {
    const gl = this.gl
    const l = this.loc
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)

    const [cx, cy, cz] = shot.cam
    const fwd = norm([shot.target[0] - cx, shot.target[1] - cy, -cz])
    let right = norm(cross(fwd, [0, 0, 1]))
    let up = cross(right, fwd)
    if (shot.roll) {
      const c = Math.cos(shot.roll)
      const s = Math.sin(shot.roll)
      const r2 = add(scale(right, c), scale(up, s))
      up = add(scale(up, c), scale(right, -s))
      right = r2
    }
    const focus = Math.hypot(shot.target[0] - cx, shot.target[1] - cy, cz)

    gl.uniform2f(l.uRes, this.canvas.width, this.canvas.height)
    gl.uniform1f(l.uTime, time)
    gl.uniform3f(l.uCam, cx, cy, cz)
    gl.uniform3fv(l.uFwd, fwd)
    gl.uniform3fv(l.uRight, right)
    gl.uniform3fv(l.uUp, up)
    gl.uniform1f(l.uTanFov, Math.tan((shot.fov * Math.PI) / 360))
    gl.uniform1f(l.uFocus, focus)
    gl.uniform1f(l.uAperture, shot.aperture)
    gl.uniform3fv(l.uLight, shot.light)
    gl.uniform3fv(l.uLightCol, shot.lightCol)
    gl.uniform2fv(l.uPool, shot.pool)
    gl.uniform1f(l.uPoolRadius, shot.poolRadius)
    gl.uniform1f(l.uExposure, shot.exposure)
    gl.uniform1f(l.uGrain, shot.grain ?? 0.035)
    gl.uniform3fv(l.uShadowTint, shot.shadowTint)
    gl.uniform1i(l.uShadowSteps, this.shadowSteps)
    gl.uniform1i(l.uMat, MATERIAL_IDS[shot.material])
    gl.uniform1f(l.uPeriod, 20000)
    gl.uniform3fv(l.uTintA, shot.tintA)
    gl.uniform3fv(l.uTintB, shot.tintB)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  dispose() {
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

type V3 = [number, number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a: V3): V3 => scale(a, 1 / Math.hypot(...a))

/** sRGB hex → linear RGB triple */
export function lin(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return c as [number, number, number]
}
