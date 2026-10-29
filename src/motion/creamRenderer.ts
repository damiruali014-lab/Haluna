/**
 * Renders cream particles as a lit, glossy surface (WebGL1):
 *  1. Every particle is splatted as a soft gaussian into an offscreen "thickness" texture.
 *  2. A full-screen pass thresholds that field into a smooth surface, derives normals from its
 *     gradient and shades it: warm diffuse, tight specular highlight, a touch of subsurface glow at
 *     thin edges, and a soft contact shadow on the stone below.
 */

const SPLAT_VS = `
attribute vec3 a_pos; // x, y in stage units; z = depth weight (1 front, lower = behind)
uniform vec2 u_stage;
uniform float u_size;
varying float v_w;
void main() {
  vec2 c = a_pos.xy / u_stage * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  gl_PointSize = u_size * (0.82 + 0.18 * a_pos.z);
  v_w = a_pos.z;
}`

const SPLAT_FS = `
precision mediump float;
varying float v_w;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float a = exp(-d * 2.4) * 0.11 * v_w;
  gl_FragColor = vec4(a, a, a, a);
}`

const SHADE_VS = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const SHADE_FS = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_field;
uniform vec2 u_px;
uniform float u_alpha;
const float T = 0.16;

float field(vec2 uv) { return texture2D(u_field, uv).r; }
// Rounded profile: thicker cream rises like a dome instead of plateauing.
float height(vec2 uv) { return sqrt(max(field(uv) - T * 0.7, 0.0)); }

void main() {
  float f = field(v_uv);
  float body = smoothstep(T - 0.012, T + 0.012, f);

  // Surface normal from the height field (wider taps = rounder, creamier forms).
  vec2 o = u_px * 3.0;
  float hx = height(v_uv + vec2(o.x, 0.0)) - height(v_uv - vec2(o.x, 0.0));
  float hy = height(v_uv + vec2(0.0, o.y)) - height(v_uv - vec2(0.0, o.y));
  vec3 n = normalize(vec3(-hx * 1.6, -hy * 1.6, 1.0));

  vec3 L = normalize(vec3(-0.5, 0.62, 0.62));   // warm sun from the upper left
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(n, H), 0.0), 55.0) * 0.6 + pow(max(dot(n, H), 0.0), 10.0) * 0.08;
  float rim = pow(1.0 - n.z, 2.0);

  vec3 cream = vec3(0.985, 0.968, 0.938);
  vec3 shade = vec3(0.79, 0.735, 0.67);
  vec3 col = mix(shade, cream, 0.25 + 0.75 * diff);
  // thin edges let warm light through, like real lotion
  float thin = 1.0 - smoothstep(T, T + 0.1, f);
  col = mix(col, vec3(0.98, 0.93, 0.86), thin * 0.35);
  col += spec * vec3(1.0, 0.99, 0.97);
  col -= rim * 0.025;

  // Soft contact shadow cast down-right onto the plinth / wall.
  float s = 0.0;
  for (int i = -2; i <= 2; i++) {
    for (int j = -2; j <= 2; j++) {
      s += field(v_uv + vec2(-0.012, 0.016) + vec2(float(i), float(j)) * u_px * 4.0);
    }
  }
  s = smoothstep(0.05, 0.5, s / 25.0) * 0.28 * (1.0 - body);
  vec3 shadowCol = vec3(0.29, 0.17, 0.2);

  float a = (body + s) * u_alpha;
  vec3 rgb = (col * body + shadowCol * s) * u_alpha;
  gl_FragColor = vec4(rgb, a);
}`

export interface CreamRenderer {
  /** points: x, y, depth weight per particle */
  draw: (points: Float32Array, n: number, alpha?: number) => void
  resize: () => void
  destroy: () => void
}

export function createCreamRenderer(canvas: HTMLCanvasElement, stage: { w: number; h: number }, radius: number): CreamRenderer | null {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return null

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader')
    return sh
  }
  const program = (vs: string, fs: string) => {
    const p = gl.createProgram()!
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs))
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(p)
    return p
  }

  let splat: WebGLProgram, shade: WebGLProgram
  try {
    splat = program(SPLAT_VS, SPLAT_FS)
    shade = program(SHADE_VS, SHADE_FS)
  } catch {
    return null
  }

  const pointBuf = gl.createBuffer()
  const quadBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  // A half-float thickness buffer keeps normals smooth (8-bit gives grainy highlights).
  const half = gl.getExtension('OES_texture_half_float')
  const halfLinear = gl.getExtension('OES_texture_half_float_linear')
  gl.getExtension('EXT_color_buffer_half_float')
  let texType: number = half && halfLinear ? half.HALF_FLOAT_OES : gl.UNSIGNED_BYTE
  const tex = gl.createTexture()
  const fbo = gl.createFramebuffer()
  let w = 0
  let h = 0
  let scale = 1

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(rect.width * dpr))
    h = Math.max(1, Math.round(rect.height * dpr))
    canvas.width = w
    canvas.height = h
    scale = w / stage.w
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, texType, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    // Fall back to 8-bit if this GPU can't render to half floats.
    if (texType !== gl.UNSIGNED_BYTE && gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      texType = gl.UNSIGNED_BYTE
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      return resize()
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  resize()

  const draw = (points: Float32Array, n: number, alpha = 1) => {
    // Pass 1: thickness field
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.viewport(0, 0, w, h)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (n > 0) {
      gl.useProgram(splat)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE)
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf)
      gl.bufferData(gl.ARRAY_BUFFER, points.subarray(0, n * 3), gl.DYNAMIC_DRAW)
      const loc = gl.getAttribLocation(splat, 'a_pos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
      gl.uniform2f(gl.getUniformLocation(splat, 'u_stage'), stage.w, stage.h)
      gl.uniform1f(gl.getUniformLocation(splat, 'u_size'), radius * 2 * scale)
      gl.drawArrays(gl.POINTS, 0, n)
    }
    // Pass 2: shading
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, w, h)
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (n === 0 || alpha <= 0) return
    gl.useProgram(shade)
    gl.disable(gl.BLEND)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    const q = gl.getAttribLocation(shade, 'a_pos')
    gl.enableVertexAttribArray(q)
    gl.vertexAttribPointer(q, 2, gl.FLOAT, false, 0, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.uniform1i(gl.getUniformLocation(shade, 'u_field'), 0)
    gl.uniform2f(gl.getUniformLocation(shade, 'u_px'), 1 / w, 1 / h)
    gl.uniform1f(gl.getUniformLocation(shade, 'u_alpha'), alpha)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  return {
    draw,
    resize,
    destroy: () => gl.getExtension('WEBGL_lose_context')?.loseContext(),
  }
}
