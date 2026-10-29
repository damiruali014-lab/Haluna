import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, label, [role="tab"], [role="button"], summary, select'

/**
 * Signature animation 6: a small cream drop that trails the pointer and swells over clickable things.
 * Only on fine pointers with hover, never with reduced motion. The native cursor stays for text fields.
 */
export default function CreamCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled] = useState(
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    const el = ref.current!
    document.documentElement.classList.add('has-cream-cursor')
    let x = -100
    let y = -100
    let cx = x
    let cy = y
    let scale = 1
    let target = 1
    let visible = false
    let raf = 0

    const loop = () => {
      cx += (x - cx) * 0.28
      cy += (y - cy) * 0.28
      scale += (target - scale) * 0.18
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -78%) scale(${scale})`
      raf = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        cx = x
        cy = y
        el.style.opacity = '1'
      }
      const t = e.target as Element | null
      const field = t?.closest('input, textarea, select')
      target = field ? 0 : t?.closest(INTERACTIVE) ? 2.3 : 1
    }
    const leave = () => {
      visible = false
      el.style.opacity = '0'
    }
    const down = () => (target *= 0.8)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    document.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cream-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[200] opacity-0 transition-opacity duration-200 will-change-transform">
      <svg width="14" height="18" viewBox="0 0 14 18" style={{ filter: 'drop-shadow(0 2px 3px rgb(28 26 23 / 0.35))' }}>
        <path d="M7 0.8C7 0.8 1 8.4 1 11.7A6 6 0 0 0 13 11.7C13 8.4 7 0.8 7 0.8Z" fill="#FBF8F2" stroke="#1C1A17" strokeOpacity="0.55" strokeWidth="0.9" />
      </svg>
    </div>
  )
}
