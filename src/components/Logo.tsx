/**
 * Haluna logo system, drawn as strokes so it matches the thin, widely tracked
 * capitals printed on the packaging. The U is a cupped bowl holding one drop of cream.
 *
 * - <Wordmark />          horizontal, for the header
 * - <WordmarkVertical />  stacked, for packaging-style rails and the footer
 * - <Mark />              U + drop, for favicon / app icon / small spaces
 */

type Glyph = { w: number; d: string }

// Cap height 24 units. Strokes are centred on these paths.
const GLYPHS: Record<'H' | 'A' | 'L' | 'U' | 'N', Glyph> = {
  H: { w: 15, d: 'M0.75 0V24M14.25 0V24M0.75 12.4H14.25' },
  A: { w: 17, d: 'M0.6 24L8.5 0.2L16.4 24M3.55 15.6H13.45' },
  L: { w: 12, d: 'M0.75 0V23.25H12' },
  // Flared like two cupped hands; the bowl is a true semicircle.
  U: { w: 21, d: 'M0 0.4C1.5 0.9 2.2 2.2 2.2 4.4V14.2A8.3 8.3 0 0 0 18.8 14.2V4.4C18.8 2.2 19.5 0.9 21 0.4' },
  N: { w: 15, d: 'M0.75 24V0.2L14.25 23.8V0' },
}
const DROP = 'M10.5 5.6C10.5 5.6 7.05 10.9 7.05 14.15A3.45 3.45 0 0 0 13.95 14.15C13.95 10.9 10.5 5.6 10.5 5.6Z'
const WORD = ['H', 'A', 'L', 'U', 'N', 'A'] as const

function Letter({ ch, x, y, stroke }: { ch: (typeof WORD)[number]; x: number; y: number; stroke: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={GLYPHS[ch].d} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="miter" />
      {ch === 'U' && <path d={DROP} fill="currentColor" className="hl-drop" />}
    </g>
  )
}

interface LogoProps {
  className?: string
  /** Stroke weight in glyph units (cap height = 24). Packaging weight is ~1.4. */
  weight?: number
  title?: string
}

export function Wordmark({ className = '', weight = 1.5, title = 'Haluna' }: LogoProps) {
  const gap = 12.5
  let x = 0
  const placed = WORD.map((ch) => {
    const at = x
    x += GLYPHS[ch].w + gap
    return { ch, at }
  })
  const width = x - gap
  return (
    <svg viewBox={`-1 -1.5 ${width + 2} 27`} className={className} role="img" aria-label={title}>
      {placed.map(({ ch, at }, i) => (
        <Letter key={i} ch={ch} x={at} y={0} stroke={weight} />
      ))}
    </svg>
  )
}

export function WordmarkVertical({ className = '', weight = 1.4, title = 'Haluna' }: LogoProps) {
  const col = 21
  const step = 24 + 15
  return (
    <svg viewBox={`-1 -1.5 ${col + 2} ${step * 5 + 27}`} className={className} role="img" aria-label={title}>
      {WORD.map((ch, i) => (
        <Letter key={i} ch={ch} x={(col - GLYPHS[ch].w) / 2} y={i * step} stroke={weight} />
      ))}
    </svg>
  )
}

export function Mark({ className = '', weight = 2.2, title = 'Haluna', tile = false }: LogoProps & { tile?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role={title ? 'img' : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true}>
      {tile && <rect width="32" height="32" rx="8" fill="#E4D3BC" />}
      <g transform="translate(5.5 4.5) scale(1)" color={tile ? '#1C1A17' : undefined}>
        <path d={GLYPHS.U.d} fill="none" stroke="currentColor" strokeWidth={weight} />
        <path d={DROP} fill="currentColor" />
      </g>
    </svg>
  )
}
