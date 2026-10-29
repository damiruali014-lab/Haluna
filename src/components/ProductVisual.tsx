import type { Product, Shade } from '../data/products'

interface Props {
  product: Product
  shade?: Shade
  className?: string
  /** Eager-load for above-the-fold images. */
  priority?: boolean
  /** Rotates the gallery placeholder for alternate "angles". */
  variant?: 0 | 1 | 2
  /** No background or sun disc: for composing several bottles in one scene. */
  bare?: boolean
}

/**
 * Shows the real product photo when `image` is set in products.ts,
 * otherwise a CSS/SVG bottle in brand colours on a soft sun-glow gradient.
 */
export function ProductVisual({ product, shade, className = '', priority, variant = 0, bare }: Props) {
  const src = shade?.image ?? product.image
  const alt = `${product.name}${shade ? `, shade ${shade.name}` : ''}, ${product.size}`
  const { glow } = product.placeholder

  const backgrounds = [
    `radial-gradient(120% 90% at 50% 100%, ${glow} 0%, #FBF3EA 55%, #FBF7F1 100%)`,
    `radial-gradient(90% 70% at 20% 20%, ${glow} 0%, #F6EEE4 60%)`,
    `linear-gradient(160deg, #F4EDE3 0%, ${glow} 100%)`,
  ]

  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={bare ? undefined : { background: backgrounds[variant] }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <PlaceholderBottle product={product} shade={shade} alt={alt} variant={variant} bare={bare} />
      )}
    </div>
  )
}

function PlaceholderBottle({ product, shade, alt, variant, bare }: { product: Product; shade?: Shade; alt: string; variant: number; bare?: boolean }) {
  const { shape, body, label } = product.placeholder
  const cap = shade?.swatch ?? (shape === 'spray' ? '#FBF7F1' : '#2B1E16')
  const tilt = variant === 1 ? -8 : variant === 2 ? 6 : 0
  const textColor = '#2B1E16'

  return (
    <svg
      viewBox={bare ? '115 70 170 380' : '0 0 400 500'}
      role="img"
      aria-label={alt}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* sun disc */}
      {!bare && <circle cx="270" cy="150" r="78" fill="#F28C4B" opacity=".16" />}
      {/* soft floor shadow */}
      <ellipse cx="200" cy="438" rx="92" ry="12" fill="#2B1E16" opacity=".08" />

      <g transform={`rotate(${tilt} 200 300)`}>
        {shape === 'tube' && (
          <g>
            <path d="M150 120 h100 l-6 300 a14 14 0 0 1 -14 13 h-60 a14 14 0 0 1 -14 -13 Z" fill={body} stroke="#2B1E16" strokeOpacity=".08" />
            <rect x="160" y="80" width="80" height="44" rx="10" fill={cap} />
            <rect x="150" y="118" width="100" height="6" fill="#2B1E16" opacity=".06" />
            <path d="M165 135 v270" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity=".55" />
          </g>
        )}
        {shape === 'pump' && (
          <g>
            <rect x="146" y="160" width="108" height="270" rx="26" fill={body} stroke="#2B1E16" strokeOpacity=".08" />
            <rect x="180" y="128" width="40" height="34" rx="6" fill={cap} />
            <path d="M188 128 v-26 h52 v12 h-40 v14" fill="#2B1E16" />
            <rect x="160" y="178" width="10" height="230" rx="5" fill="#fff" opacity=".5" />
          </g>
        )}
        {shape === 'spray' && (
          <g>
            <rect x="148" y="150" width="104" height="282" rx="30" fill={body} stroke="#2B1E16" strokeOpacity=".08" />
            <rect x="166" y="96" width="68" height="58" rx="16" fill={cap} stroke="#2B1E16" strokeOpacity=".1" />
            <rect x="214" y="112" width="26" height="10" rx="5" fill="#2B1E16" opacity=".5" />
            <rect x="162" y="168" width="10" height="240" rx="5" fill="#fff" opacity=".35" />
          </g>
        )}

        {/* label */}
        <g fontFamily="Fraunces, Georgia, serif" textAnchor="middle">
          <text x="200" y={shape === 'tube' ? 215 : 238} fontSize="26" fill={textColor} letterSpacing="-0.5">
            haluna
          </text>
          <circle cx="200" cy={shape === 'tube' ? 248 : 268} r="9" fill={label} />
          <text
            x="200"
            y={shape === 'tube' ? 296 : 318}
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="11"
            fontWeight="600"
            letterSpacing="2"
            fill={textColor}
            opacity=".85"
          >
            {product.shortName.toUpperCase()}
          </text>
          <text x="200" y={shape === 'tube' ? 336 : 360} fontSize="30" fill={textColor}>
            SPF {product.spf}
          </text>
          <text
            x="200"
            y={shape === 'tube' ? 392 : 410}
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="10"
            letterSpacing="1.5"
            fill={textColor}
            opacity=".7"
          >
            {product.size.toUpperCase()}
            {shade ? ` · ${shade.name.toUpperCase()}` : ''}
          </text>
        </g>
      </g>
    </svg>
  )
}
