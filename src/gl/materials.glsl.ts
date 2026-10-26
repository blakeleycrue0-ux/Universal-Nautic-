// Procedural material library, shared by the live relief renderer (hero),
// the plate renderer (still images) and the texture baker (3D atelier).
//
// Every material is defined as a height field H(p) and an albedo A(p, h) over
// p in millimetres. Noise is periodic (period passed in `per`) so the same
// functions can bake seamless tiles for the 3D scene.

export const MATERIAL_IDS = {
  leather: 0,
  nappa: 1,
  canvas: 2,
  pile: 3,
  twill: 4,
  teak: 5,
  stone: 6,
} as const

export type MaterialName = keyof typeof MATERIAL_IDS

/** Tile period (mm) used when baking each material as a seamless texture. */
export const MATERIAL_PERIOD: Record<MaterialName, number> = {
  leather: 60,
  nappa: 57.6,
  canvas: 48,
  pile: 36,
  twill: 22.4,
  teak: 200,
  stone: 240,
}

export const MATERIALS_GLSL = /* glsl */ `
uniform int   uMat;
uniform float uPeriod;
uniform vec3  uTintA;
uniform vec3  uTintB;

// Integer PCG hash: stable for negative and large lattice coordinates,
// where sin()-based hashes lose float precision and turn blocky.
uvec2 pcg2d(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v ^= v >> 16u;
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v ^= v >> 16u;
  return v;
}
vec2 hash22(vec2 p) {
  return vec2(pcg2d(uvec2(ivec2(floor(p))))) * (1.0 / 4294967295.0);
}
float hash12(vec2 p) {
  return hash22(p + vec2(31.0, 17.0)).x;
}

// Periodic quintic gradient noise, range ~[-1, 1].
float gnoise(vec2 x, vec2 per) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 ga = hash22(mod(i, per)) * 2.0 - 1.0;
  vec2 gb = hash22(mod(i + vec2(1.0, 0.0), per)) * 2.0 - 1.0;
  vec2 gc = hash22(mod(i + vec2(0.0, 1.0), per)) * 2.0 - 1.0;
  vec2 gd = hash22(mod(i + vec2(1.0, 1.0), per)) * 2.0 - 1.0;
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  return 1.6 * mix(mix(va, vb, u.x), mix(vc, vd, u.x), u.y);
}

float fbm(vec2 x, vec2 per, int oct) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    s += a * gnoise(x, per);
    x *= 2.0;
    per *= 2.0;
    a *= 0.5;
  }
  return s;
}

// Periodic Voronoi: x = F1, y = F2, z = cell hash.
vec3 voronoi(vec2 x, vec2 per, float jitter) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  float f1 = 8.0;
  float f2 = 8.0;
  float id = 0.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 c = mod(n + g, per);
    vec2 o = 0.5 + jitter * (hash22(c) - 0.5);
    vec2 r = g + o - f;
    float d = dot(r, r);
    if (d < f1) { f2 = f1; f1 = d; id = hash12(c); }
    else if (d < f2) { f2 = d; }
  }
  return vec3(sqrt(f1), sqrt(f2), id);
}

// ---------------------------------------------------------------- leather
// Full-grain pebbled hide: domed cells, soft creases, pores and a slow
// undulation of the hide itself.
float pebble(vec2 q, vec2 per) {
  vec3 v = voronoi(q, per, 0.62);
  float e = v.y - v.x;
  float wall = smoothstep(0.0, 0.6, e);
  return wall * (1.0 - 0.3 * v.x * v.x) + (v.z - 0.5) * 0.1;
}
float hLeather(vec2 p) {
  vec2 P = vec2(uPeriod);
  vec2 w = vec2(fbm(p / 5.0, P / 5.0, 3), fbm(p / 5.0 + 7.3, P / 5.0, 3));
  float big = pebble(p / 1.2 + w * 0.6, P / 1.2);
  float small = pebble(p / 0.5 + w * 1.2 + 3.7, P / 0.5);
  float hide = fbm(p / 12.0, P / 12.0, 3) * 1.6;
  float micro = gnoise(p * 6.0, P * 6.0) * 0.04;
  return big * 0.5 + small * 0.16 + hide + micro;
}
vec3 aLeather(vec2 p, float h) {
  vec2 P = vec2(uPeriod);
  vec2 w = vec2(fbm(p / 5.0, P / 5.0, 3), fbm(p / 5.0 + 7.3, P / 5.0, 3));
  float big = pebble(p / 1.2 + w * 0.6, P / 1.2);
  float mottle = fbm(p / 8.0 + 11.0, P / 8.0, 3);
  vec3 c = mix(uTintB, uTintA, 0.55 + 0.45 * smoothstep(0.1, 0.8, big));
  return c * (0.93 + 0.14 * mottle);
}

// ---------------------------------------------------------------- nappa
// Smooth nappa with a hexagonal perforation pattern, as used for
// ventilated seating.
vec3 hexCell(vec2 p, float s) {
  // returns local offset to nearest hex centre (xy) and row parity (z)
  vec2 r = vec2(1.0, 1.7320508);
  vec2 h = r * 0.5;
  vec2 a = mod(p / s, r) - h;
  vec2 b = mod(p / s - h, r) - h;
  return dot(a, a) < dot(b, b) ? vec3(a * s, 0.0) : vec3(b * s, 1.0);
}
float hNappa(vec2 p) {
  vec2 P = vec2(uPeriod);
  float grain = fbm(p * 1.6, P * 1.6, 3) * 0.05;
  float hide = fbm(p / 14.4, P / 14.4, 2) * 1.1;
  vec3 hc = hexCell(p, 3.2);
  float d = length(hc.xy);
  float hole = 1.0 - smoothstep(0.38, 0.5, d);
  float lip = smoothstep(0.5, 0.62, d) * (1.0 - smoothstep(0.62, 1.1, d));
  return hide + grain + lip * 0.06 - hole * 1.6;
}
vec3 aNappa(vec2 p, float h) {
  vec3 hc = hexCell(p, 3.2);
  float hole = 1.0 - smoothstep(0.36, 0.48, length(hc.xy));
  vec3 c = mix(uTintA, uTintB, 0.5 + 0.5 * fbm(p / 9.6, vec2(uPeriod / 9.6), 2));
  return mix(c, c * 0.06, hole);
}

// ---------------------------------------------------------------- canvas
// Solution-dyed acrylic in plain weave, heathered yarns, visible twist.
float yarn(float f) { float x = f * 2.0 - 1.0; return sqrt(max(0.0, 1.0 - x * x)); }
float hCanvas(vec2 p) {
  vec2 c = p / 0.6;
  vec2 i = floor(c);
  vec2 f = fract(c);
  float par = mod(i.x + i.y, 2.0);
  float warp = yarn(f.x) * (0.85 + 0.15 * cos(3.14159 * (c.y - i.y - 0.5 + par)));
  float weft = yarn(f.y) * (0.85 + 0.15 * cos(3.14159 * (c.x - i.x - 0.5 + 1.0 - par)));
  float twistW = sin((f.y * 4.0 + f.x) * 6.2832) * 0.1;
  float twistF = sin((f.x * 4.0 + f.y) * 6.2832) * 0.1;
  float hw = warp + twistW + (par < 0.5 ? 0.25 : 0.0);
  float hf = weft + twistF + (par < 0.5 ? 0.0 : 0.25);
  float fuzz = gnoise(p * 8.0, vec2(uPeriod * 8.0)) * 0.05;
  return max(hw, hf) * 0.32 + fuzz;
}
vec3 aCanvas(vec2 p, float h) {
  vec2 c = p / 0.6;
  vec2 i = floor(c);
  vec2 f = fract(c);
  float par = mod(i.x + i.y, 2.0);
  float warp = yarn(f.x) + (par < 0.5 ? 0.25 : 0.0);
  float weft = yarn(f.y) + (par < 0.5 ? 0.0 : 0.25);
  float isWarp = step(weft, warp);
  float yarnId = isWarp > 0.5 ? hash12(vec2(mod(i.x, uPeriod / 0.6), 3.0)) : hash12(vec2(7.0, mod(i.y, uPeriod / 0.6)));
  float heather = hash12(floor(p * 9.0)) * 0.5 + yarnId * 0.5;
  return mix(uTintB, uTintA, smoothstep(0.15, 0.85, heather)) * (0.85 + 0.25 * h / 0.4);
}

// ---------------------------------------------------------------- pile
// Hand-tufted cut-pile wool: dense tufts with fibre ends.
float hPile(vec2 p) {
  vec2 P = vec2(uPeriod);
  vec3 v = voronoi(p / 0.6 + fbm(p / 3.6, P / 3.6, 2) * 0.8, P / 0.6, 0.8);
  float tuft = clamp(1.0 - v.x * 0.95, 0.0, 1.0);
  tuft = pow(tuft, 0.6) * (0.75 + 0.5 * v.z);
  float fibres = fbm(p * 14.0, P * 14.0, 2) * 0.45 + gnoise(p * 30.0, P * 30.0) * 0.2;
  float flow = fbm(p / 9.0, P / 9.0, 2) * 0.35;
  return tuft * 0.8 + fibres * (0.4 + tuft) + flow;
}
vec3 aPile(vec2 p, float h) {
  vec2 P = vec2(uPeriod);
  vec3 v = voronoi(p / 0.6 + fbm(p / 3.6, P / 3.6, 2) * 0.8, P / 0.6, 0.8);
  float tuft = clamp(1.0 - v.x * 0.95, 0.0, 1.0);
  float fib = gnoise(p * 22.0, P * 22.0);
  vec3 c = mix(uTintB, uTintA, clamp(v.z * 0.6 + 0.25 + 0.4 * fib, 0.0, 1.0));
  return c * mix(0.35, 1.05, smoothstep(0.0, 0.5, tuft));
}

// ---------------------------------------------------------------- twill
// 2/2 twill in fine wool-cashmere with a soft halo of fibre.
float hTwill(vec2 p) {
  vec2 c = p / 0.35;
  vec2 i = floor(c);
  vec2 f = fract(c);
  float k = mod(i.x + i.y, 4.0);
  float warpTop = step(k, 1.5);
  float warp = yarn(f.x) * (0.75 + 0.25 * warpTop);
  float weft = yarn(f.y) * (0.75 + 0.25 * (1.0 - warpTop));
  float base = max(warp + warpTop * 0.3, weft + (1.0 - warpTop) * 0.3);
  float halo = fbm(p * 3.0, vec2(uPeriod * 3.0), 3) * 0.12;
  return base * 0.18 + halo;
}
vec3 aTwill(vec2 p, float h) {
  float n = fbm(p * 2.0 + 5.0, vec2(uPeriod * 2.0), 3);
  return mix(uTintB, uTintA, 0.5 + 0.6 * n) * (0.8 + 0.5 * h / 0.25);
}

// ---------------------------------------------------------------- teak
// Laid teak deck: 45 mm planks, 5 mm black caulking, open grain.
float teakGrain(vec2 p, float plank) {
  vec2 q = vec2(p.x, p.y + plank * 13.7);
  float w = fbm(q * vec2(0.025, 0.3), vec2(uPeriod * 0.025, uPeriod * 0.3), 3);
  return sin((q.y + w * 14.0) * 0.9 + plank * 4.0);
}
float hTeak(vec2 p) {
  float plank = floor(p.y / 50.0);
  float y = mod(p.y, 50.0);
  float seam = smoothstep(4.2, 5.2, y) * (1.0 - smoothstep(49.0, 50.0, y));
  float grain = teakGrain(p, plank) * 0.12;
  float pores = smoothstep(0.6, 0.95, gnoise(p * vec2(0.6, 4.0), vec2(uPeriod * 0.6, uPeriod * 4.0))) * 0.12;
  float worn = fbm(p * 0.05, vec2(uPeriod * 0.05), 2) * 0.2;
  return seam * (0.9 + grain - pores + worn) - (1.0 - seam) * 0.25;
}
vec3 aTeak(vec2 p, float h) {
  float plank = floor(p.y / 50.0);
  float y = mod(p.y, 50.0);
  float seam = smoothstep(4.0, 5.0, y) * (1.0 - smoothstep(49.2, 50.0, y));
  float g = teakGrain(p, plank) * 0.5 + 0.5;
  float tone = hash12(vec2(plank, 2.0));
  float streak = gnoise(p * vec2(0.08, 2.5), vec2(uPeriod * 0.08, uPeriod * 2.5));
  float pore = smoothstep(0.55, 0.9, gnoise(p * vec2(0.6, 4.0), vec2(uPeriod * 0.6, uPeriod * 4.0)));
  vec3 wood = mix(uTintB, uTintA, clamp(0.2 + 0.55 * pow(g, 1.6) + 0.2 * tone + 0.05 * streak, 0.0, 1.0));
  wood *= 1.0 - pore * 0.35;
  return mix(vec3(0.018, 0.017, 0.016), wood, seam);
}

// ---------------------------------------------------------------- stone
// Honed limestone: soft cloud, fine pitting.
float hStone(vec2 p) {
  vec2 P = vec2(uPeriod);
  float pits = smoothstep(0.62, 0.8, gnoise(p * 0.8, P * 0.8)) * 0.3;
  return fbm(p / 30.0, P / 30.0, 2) * 0.15 + gnoise(p * 3.0, P * 3.0) * 0.015 - pits;
}
vec3 aStone(vec2 p, float h) {
  vec2 P = vec2(uPeriod);
  float cloud = fbm(p / 40.0 + 3.0, P / 40.0, 4);
  float vein = smoothstep(0.02, 0.0, abs(fbm(p / 60.0, P / 60.0, 3) - 0.1)) * 0.2;
  return mix(uTintB, uTintA, 0.5 + cloud) * (1.0 - vein);
}

float H(vec2 p) {
  if (uMat == 0) return hLeather(p);
  if (uMat == 1) return hNappa(p);
  if (uMat == 2) return hCanvas(p);
  if (uMat == 3) return hPile(p);
  if (uMat == 4) return hTwill(p);
  if (uMat == 5) return hTeak(p);
  return hStone(p);
}
vec3 A(vec2 p, float h) {
  if (uMat == 0) return aLeather(p, h);
  if (uMat == 1) return aNappa(p, h);
  if (uMat == 2) return aCanvas(p, h);
  if (uMat == 3) return aPile(p, h);
  if (uMat == 4) return aTwill(p, h);
  if (uMat == 5) return aTeak(p, h);
  return aStone(p, h);
}
// Material response: x = roughness, y = height scale (mm), z = sheen
vec3 R() {
  if (uMat == 0) return vec3(0.5, 0.075, 0.25);
  if (uMat == 1) return vec3(0.42, 0.09, 0.2);
  if (uMat == 2) return vec3(0.8, 0.22, 0.45);
  if (uMat == 3) return vec3(0.95, 0.32, 0.5);
  if (uMat == 4) return vec3(0.88, 0.16, 0.35);
  if (uMat == 5) return vec3(0.7, 0.5, 0.1);
  return vec3(0.75, 0.2, 0.0);
}
`
