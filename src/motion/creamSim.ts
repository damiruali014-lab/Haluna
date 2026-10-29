/**
 * How a squeezed tube of lotion actually behaves, modelled kinematically:
 *  - the thread leaves the nozzle at the extrusion speed and falls straight under gravity;
 *  - in the last stretch of its fall it bends toward where it will land;
 *  - it is laid down along a shrinking 3D spiral (a wide base winding up to a soft peak), seen
 *    from the side, which is what gives a real dollop its shape;
 *  - once down, it settles and spreads a touch under its own weight.
 *
 * Every particle position is a closed-form function of time, so the result is smooth, deterministic
 * and baked into frames that the hero scrubs forwards and backwards with the scroll position.
 */

export interface CreamFrames {
  frames: number
  maxParticles: number
  /** x, y, depth weight per particle per frame (stage units; weight 1 = front of the swirl). */
  pos: Float32Array
  /** live particle count per frame */
  count: Uint16Array
}

export interface CreamSimOptions {
  nozzle: { x: number; y: number }
  floorY: number
  /** thread radius as rendered, used to rest the first loop on the plinth */
  radius: number
  /** seconds of extrusion */
  pourTime?: number
  /** total seconds baked (pour + fall + settle) */
  totalTime?: number
  fps?: number
}

const SPACING = 2.6 // distance between particles along the thread
const EXTRUDE = 230 // units per second out of the nozzle
const GRAVITY = 1500 // stylised: slower than real so the fall reads on screen
const BEND = 46 // height above landing where the falling thread curves toward its landing spot
const BASE_RADIUS = 40 // first loop of the spiral
const PEAK_RADIUS = 3 // last loop (the peak)
const LAYER = 15 // height gained per full turn
const SETTLE = 0.3 // seconds to settle after landing
const SAG = 4 // how far a landed loop sinks while settling

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

export function bakeCream({ nozzle, floorY, radius, pourTime = 1.45, totalTime = 2.4, fps = 60 }: CreamSimOptions): CreamFrames {
  const frames = Math.round(totalTime * fps)
  const total = Math.floor((pourTime * EXTRUDE) / SPACING)
  const maxParticles = total
  const rest = floorY - radius * 0.62

  // Landing spots along the spiral, laid out by arc length so the thread lies down continuously.
  const land = new Float32Array(total * 2)
  const front = new Float32Array(total) // 1 = loop facing the viewer, ~0.3 = behind the dollop
  let angle = 0
  for (let k = 0; k < total; k++) {
    const u = k / Math.max(1, total - 1) // 0 at the base, 1 at the peak
    const r = BASE_RADIUS + (PEAK_RADIUS - BASE_RADIUS) * Math.pow(u, 0.8)
    const turns = angle / (Math.PI * 2)
    land[k * 2] = nozzle.x + Math.sin(angle) * r
    land[k * 2 + 1] = rest - turns * LAYER
    front[k] = 0.45 + 0.55 * Math.cos(angle)
    angle += SPACING / Math.max(r, 6) // constant spacing along the spiral
  }

  // Time for a particle to fall from the nozzle to its landing height.
  const fallTime = (dy: number) => (-EXTRUDE + Math.sqrt(EXTRUDE * EXTRUDE + 2 * GRAVITY * dy)) / GRAVITY

  const pos = new Float32Array(frames * maxParticles * 3)
  const count = new Uint16Array(frames)
  for (let f = 0; f < frames; f++) {
    const t = f / fps
    let n = 0
    const base = f * maxParticles * 3
    for (let k = 0; k < total; k++) {
      const tau = t - (k * SPACING) / EXTRUDE // time since this bit left the nozzle
      if (tau < 0) break
      const lx = land[k * 2]
      const ly = land[k * 2 + 1]
      const tl = fallTime(ly - nozzle.y)
      let x: number
      let y: number
      let w = 1
      if (tau < tl) {
        y = nozzle.y + EXTRUDE * tau + 0.5 * GRAVITY * tau * tau
        const bend = smooth((y - (ly - BEND)) / BEND)
        x = nozzle.x + (lx - nozzle.x) * bend
        w = 1 + (front[k] - 1) * bend
      } else {
        const s = smooth((tau - tl) / SETTLE)
        // Lower loops carry more weight: they sink and spread a little more.
        const weight = Math.max(0.2, 1 - (rest - ly) / 50)
        x = nozzle.x + (lx - nozzle.x) * (1 + 0.07 * s * weight)
        y = ly + SAG * s * weight
        w = front[k]
      }
      pos[base + n * 3] = x
      pos[base + n * 3 + 1] = Math.min(y, rest)
      pos[base + n * 3 + 2] = w
      n++
    }
    count[f] = n
  }
  return { frames, maxParticles, pos, count }
}

/**
 * Targets for the final morph: the settled dollop smooths out into the button's pill shape.
 * Particles are matched to pill points by sorted x so they slide sideways instead of crossing.
 * Input and output use the same x, y, weight layout as the baked frames.
 */
export function pillTargets(final: Float32Array, n: number, cx: number, bottom: number, w: number, h: number, inset: number) {
  // Keep particle centres inside the pill so the rendered surface (centres + radius) matches it.
  const iw = Math.max(1, w - inset * 2)
  const ih = Math.max(1, h - inset * 2)
  const cy = bottom - h / 2
  const pts: [number, number][] = []
  const cols = Math.max(2, Math.round(Math.sqrt((n * iw) / ih)))
  const rows = Math.max(1, Math.ceil(n / cols))
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) pts.push([cx - iw / 2 + (iw * (c + 0.5)) / cols, cy - ih / 2 + (ih * (r + 0.5)) / rows])
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => final[a * 3] - final[b * 3])
  const sorted = pts.sort((a, b) => a[0] - b[0]).slice(0, n)
  while (sorted.length < n) sorted.push([cx, cy])
  const out = new Float32Array(n * 3)
  order.forEach((p, i) => {
    out[p * 3] = sorted[i][0]
    out[p * 3 + 1] = sorted[i][1]
    out[p * 3 + 2] = 1
  })
  return out
}
