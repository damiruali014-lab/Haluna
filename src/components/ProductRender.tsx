import type { Product, Shade } from '../data/products'

/**
 * SVG stand-in for a missing product photo: the sand packaging family
 * (tube, stick, jar, vial) with the vertical H A L U N A print, on a sand sweep.
 */
export function ProductRender({ product, shade, className = '', label }: { product: Product; shade?: Shade; className?: string; label: string }) {
  const pack = product.packColor
  const colour = shade?.swatch ?? '#FBF8F2'
  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`sweep-${product.slug}`} cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor="#EBDAC4" />
          <stop offset="1" stopColor="#DFC9AF" />
        </radialGradient>
        <linearGradient id={`body-${product.slug}`} x1="0" x2="1">
          <stop offset="0" stopColor={pack} stopOpacity=".92" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor={pack} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill={`url(#sweep-${product.slug})`} />
      <ellipse cx="300" cy="512" rx="120" ry="12" fill="#1C1A17" opacity=".08" />

      {product.pack === 'tube' && (
        <g>
          <path d="M214 92h172v18c-4 70-18 230-26 326h-120c-8-96-22-256-26-326Z" fill={pack} />
          <path d="M214 92h172v18c-4 70-18 230-26 326h-120c-8-96-22-256-26-326Z" fill={`url(#body-${product.slug})`} />
          <path d="M214 92h172v16H214Z" fill="#1C1A17" opacity=".06" />
          <rect x="240" y="434" width="120" height="76" rx="12" fill="#FBF8F2" />
          <Print x={318} y={150} />
        </g>
      )}
      {product.pack === 'stick' && (
        <g>
          <rect x="245" y="70" width="110" height="60" rx="20" fill="#FBF8F2" />
          <rect x="240" y="122" width="120" height="370" rx="18" fill={pack} />
          <rect x="240" y="122" width="120" height="370" rx="18" fill={`url(#body-${product.slug})`} />
          <rect x="240" y="470" width="120" height="30" rx="10" fill="#FBF8F2" />
          <Print x={318} y={180} />
        </g>
      )}
      {product.pack === 'jar' && (
        <g>
          <ellipse cx="250" cy="378" rx="120" ry="34" fill={pack} />
          <rect x="130" y="378" width="240" height="96" fill={pack} />
          <ellipse cx="250" cy="474" rx="120" ry="34" fill={pack} />
          <ellipse cx="250" cy="378" rx="104" ry="26" fill={colour} />
          <ellipse cx="420" cy="330" rx="88" ry="96" fill={pack} transform="rotate(-18 420 330)" />
          <text x="420" y="336" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="300" fontSize="20" letterSpacing="9" fill="#1C1A17" transform="rotate(-18 420 330)">
            HALUNA
          </text>
        </g>
      )}
      {product.pack === 'vial' && (
        <g>
          <rect x="262" y="70" width="76" height="130" rx="10" fill={pack} />
          <rect x="258" y="196" width="84" height="300" rx="14" fill={colour} />
          <rect x="258" y="196" width="84" height="300" rx="14" fill="#fff" opacity=".12" />
          <rect x="270" y="208" width="10" height="270" rx="5" fill="#fff" opacity=".35" />
          <Print x={312} y={240} size={18} />
        </g>
      )}
    </svg>
  )
}

function Print({ x, y, size = 20 }: { x: number; y: number; size?: number }) {
  return (
    <text
      x={x}
      y={y}
      fontFamily="Manrope, sans-serif"
      fontWeight="300"
      fontSize={size}
      letterSpacing={size * 0.55}
      fill="#1C1A17"
      transform={`rotate(90 ${x} ${y})`}
    >
      HALUNA
    </text>
  )
}
