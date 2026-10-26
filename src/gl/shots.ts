// Art-directed camera and light set-ups for every material photograph.
// The palette deliberately stays within ink, ivory, stone, graphite and
// deep marine; colour lives in the materials themselves.

import { lin, type ReliefShot } from './relief'

const warmKey = lin('#fff1dc').map((v) => v * 3.2) as [number, number, number]
const daylight = lin('#fff8ee').map((v) => v * 4.2) as [number, number, number]
const shade = lin('#1b2328')

export const HERO_SHOT: ReliefShot = {
  material: 'leather',
  tintA: lin('#d9cdbb'),
  tintB: lin('#a8977f'),
  cam: [0, -26, 13],
  target: [0, 0],
  fov: 34,
  aperture: 0.05,
  light: [-0.9, 0.5, 0.2],
  lightCol: warmKey,
  pool: [-14, 10],
  poolRadius: 17,
  exposure: 1.1,
  shadowTint: lin('#2a3036'),
}

export const PLATES: Record<string, ReliefShot> = {
  // Interior — full-grain hide in natural stone.
  leather: {
    ...HERO_SHOT,
    cam: [8, -30, 22],
    target: [0, 2],
    roll: 0.05,
    aperture: 0.035,
    light: [-0.8, 0.45, 0.26],
    pool: [-6, 10],
    poolRadius: 24,
    exposure: 0.95,
  },
  // Interior — perforated nappa, deep marine.
  nappa: {
    material: 'nappa',
    tintA: lin('#26323b'),
    tintB: lin('#1a242c'),
    cam: [0, -44, 30],
    target: [0, 0],
    roll: -0.12,
    fov: 30,
    aperture: 0.03,
    light: [0.7, 0.6, 0.38],
    lightCol: warmKey,
    pool: [6, 4],
    poolRadius: 42,
    exposure: 1.35,
    shadowTint: shade,
  },
  // Interior — hand-tufted cut-pile wool.
  pile: {
    material: 'pile',
    tintA: lin('#cdbfa8'),
    tintB: lin('#8f8170'),
    cam: [0, -16, 11],
    target: [0, 0],
    fov: 36,
    aperture: 0.06,
    light: [-0.6, 0.7, 0.45],
    lightCol: warmKey,
    pool: [-3, 3],
    poolRadius: 26,
    exposure: 1.0,
    shadowTint: lin('#2c2a28'),
  },
  // Interior — wool-cashmere twill, graphite.
  twill: {
    material: 'twill',
    tintA: lin('#6c6e70'),
    tintB: lin('#2f3133'),
    cam: [0, -9, 8],
    target: [0, 0],
    roll: 0.6,
    fov: 34,
    aperture: 0.03,
    light: [-0.5, 0.75, 0.42],
    lightCol: warmKey,
    pool: [0, 2],
    poolRadius: 16,
    exposure: 0.85,
    shadowTint: lin('#24272a'),
  },
  // Exterior — solution-dyed canvas under hard Mediterranean sun.
  canvas: {
    material: 'canvas',
    tintA: lin('#d6cebe'),
    tintB: lin('#9e9483'),
    cam: [0, -11, 10],
    target: [0, 0],
    roll: 0.785,
    fov: 34,
    aperture: 0.035,
    light: [0.55, 0.65, 0.52],
    lightCol: daylight,
    pool: [0, 0],
    poolRadius: 400,
    exposure: 0.5,
    shadowTint: lin('#4a5a66'),
  },
  // Exterior — laid teak deck with black caulking.
  teak: {
    material: 'teak',
    tintA: lin('#9a7a58'),
    tintB: lin('#4f3b2a'),
    cam: [-40, -260, 210],
    target: [0, 0],
    roll: 0.02,
    fov: 32,
    aperture: 0.02,
    light: [0.5, 0.7, 0.55],
    lightCol: daylight,
    pool: [0, 0],
    poolRadius: 5000,
    exposure: 0.7,
    shadowTint: lin('#56656f'),
  },
}
