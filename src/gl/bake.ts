// Bakes the procedural materials into seamless albedo + normal textures on the
// GPU, so the 3D atelier scene uses exactly the same surfaces as the plates.

import * as THREE from 'three'
import { MATERIALS_GLSL, MATERIAL_IDS, MATERIAL_PERIOD, type MaterialName } from './materials.glsl'
import { lin } from './relief'

const VERT = /* glsl */ `
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform int uMode;
uniform float uTexel;
${MATERIALS_GLSL}
void main() {
  vec2 p = vUv * uPeriod;
  float h0 = H(p);
  if (uMode == 0) {
    outColor = vec4(A(p, h0), 1.0);
    return;
  }
  float e = uTexel;
  float hs = R().y;
  float dx = (H(p + vec2(e, 0.0)) - H(p - vec2(e, 0.0))) / (2.0 * e) * hs;
  float dy = (H(p + vec2(0.0, e)) - H(p - vec2(0.0, e))) / (2.0 * e) * hs;
  vec3 n = normalize(vec3(-dx, -dy, 1.0));
  outColor = vec4(n * 0.5 + 0.5, 1.0);
}
`

export type BakedMaterial = { map: THREE.Texture; normalMap: THREE.Texture; period: number }

export function bakeMaterial(
  renderer: THREE.WebGLRenderer,
  name: MaterialName,
  tintA: string,
  tintB: string,
  size = 1024,
): BakedMaterial {
  const period = MATERIAL_PERIOD[name]
  const mat = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uMode: { value: 0 },
      uTexel: { value: period / size },
      uMat: { value: MATERIAL_IDS[name] },
      uPeriod: { value: period },
      uTintA: { value: new THREE.Vector3(...lin(tintA)) },
      uTintB: { value: new THREE.Vector3(...lin(tintB)) },
    },
    depthTest: false,
    depthWrite: false,
  })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat)
  const scene = new THREE.Scene()
  scene.add(quad)
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const aniso = renderer.capabilities.getMaxAnisotropy()

  const make = (mode: number, colorSpace: THREE.ColorSpace) => {
    const rt = new THREE.WebGLRenderTarget(size, size, {
      colorSpace,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      depthBuffer: false,
    })
    rt.texture.anisotropy = aniso
    mat.uniforms.uMode.value = mode
    const prev = renderer.getRenderTarget()
    renderer.setRenderTarget(rt)
    renderer.render(scene, cam)
    renderer.setRenderTarget(prev)
    return rt.texture
  }

  const map = make(0, THREE.SRGBColorSpace)
  const normalMap = make(1, THREE.NoColorSpace)
  mat.dispose()
  quad.geometry.dispose()
  return { map, normalMap, period }
}

/** Two-ply twist relief for the thread, as a bump texture. */
export function threadBump(): THREE.Texture {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(s, s)
  for (let y = 0; y < s; y++)
    for (let x = 0; x < s; x++) {
      const u = x / s
      const v = y / s
      const t = (u * 2 + v * 2) % 1
      const ply = Math.pow(Math.sin(Math.PI * t), 0.6)
      const fibre = 0.08 * Math.sin((u * 16 + v * 4) * Math.PI * 2)
      const val = Math.max(0, Math.min(255, (ply * 0.9 + fibre) * 255))
      const i = (y * s + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = val
      img.data[i + 3] = 255
    }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.NoColorSpace
  return tex
}
