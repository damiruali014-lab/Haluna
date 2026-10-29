/**
 * Product catalogue. This is the only file you need to edit to turn the
 * template into a real store: swap names, prices and copy, and set `image`
 * (or a shade's `image`) to a path in /public/images to replace the
 * CSS bottle placeholder with a real photo.
 */

export type BottleShape = 'tube' | 'pump' | 'spray'

export interface Shade {
  id: string
  name: string
  /** Swatch colour shown on the chip and the placeholder bottle cap. */
  swatch: string
  /** Real product photo for this shade, e.g. '/images/tint-spf30-light.webp'. */
  image?: string
}

export interface Ingredient {
  name: string
  note: string
}

export interface Product {
  slug: string
  name: string
  shortName: string
  spf: number
  size: string
  price: number
  tagline: string
  description: string
  benefits: [string, string, string]
  ingredients: Ingredient[]
  howToUse: string[]
  rating: number
  reviewCount: number
  /** Real product photo. Leave undefined to render the placeholder bottle. */
  image?: string
  shades?: Shade[]
  /** Placeholder styling, used until `image` is set. */
  placeholder: {
    shape: BottleShape
    body: string
    label: string
    glow: string
  }
}

export const products: Product[] = [
  {
    slug: 'daily-fluid-spf-50',
    name: 'Haluna Daily Fluid SPF 50',
    shortName: 'Daily Fluid',
    spf: 50,
    size: '50 ml',
    price: 28,
    tagline: 'Weightless face sunscreen',
    description:
      'A water-light mineral fluid that disappears into skin in seconds. Broad-spectrum SPF 50 with no white cast, no grease and no pilling under makeup.',
    benefits: [
      'Invisible finish on every skin tone',
      'Sinks in fast, never greasy or sticky',
      'Smooth base that sits well under makeup',
    ],
    ingredients: [
      { name: 'Zinc oxide 18%', note: 'Mineral broad-spectrum UVA/UVB filter.' },
      { name: 'Niacinamide 4%', note: 'Evens tone and supports the skin barrier.' },
      { name: 'Hyaluronic acid', note: 'Lightweight, all-day hydration.' },
    ],
    howToUse: [
      'Shake well. Apply two finger-lengths to face and neck as the last step of your morning routine.',
      'Reapply every two hours outdoors, and after swimming or sweating.',
    ],
    rating: 4.8,
    reviewCount: 1284,
    image: undefined, // '/images/fluid-spf50.webp'
    placeholder: { shape: 'tube', body: '#FFFDF9', label: '#F28C4B', glow: '#F8C9A0' },
  },
  {
    slug: 'glow-tint-spf-30',
    name: 'Haluna Glow Tint SPF 30',
    shortName: 'Glow Tint',
    spf: 30,
    size: '40 ml',
    price: 32,
    tagline: 'Tinted sunscreen with a soft glow',
    description:
      'Sheer, buildable coverage meets mineral SPF 30. Blurs redness, evens tone and leaves a healthy, lit-from-within finish in three adaptable shades.',
    benefits: [
      'Sheer coverage that blurs and evens',
      'Dewy glow without shine',
      'Iron oxides help defend against visible light',
    ],
    ingredients: [
      { name: 'Zinc oxide 15%', note: 'Mineral broad-spectrum UVA/UVB filter.' },
      { name: 'Iron oxides', note: 'Natural tint that helps shield against visible light.' },
      { name: 'Aloe vera', note: 'Soothes and calms on hot days.' },
    ],
    howToUse: [
      'Dot over face and blend outwards with fingers or a damp sponge.',
      'Build a second layer where you want more coverage. Reapply every two hours in the sun.',
    ],
    rating: 4.7,
    reviewCount: 862,
    image: undefined,
    shades: [
      { id: 'light', name: 'Light', swatch: '#EBCDB3', image: undefined }, // '/images/tint-spf30-light.webp'
      { id: 'medium', name: 'Medium', swatch: '#C8946A', image: undefined }, // '/images/tint-spf30-medium.webp'
      { id: 'deep', name: 'Deep', swatch: '#7F5236', image: undefined }, // '/images/tint-spf30-deep.webp'
    ],
    placeholder: { shape: 'pump', body: '#EADFCF', label: '#2B1E16', glow: '#F2B98F' },
  },
  {
    slug: 'body-mist-spf-50',
    name: 'Haluna Body Mist SPF 50',
    shortName: 'Body Mist',
    spf: 50,
    size: '150 ml',
    price: 24,
    tagline: 'Featherlight body spray',
    description:
      'A fine, continuous mist that covers shoulders, legs and hard-to-reach backs in seconds. Dries clear and non-sticky, so you can get dressed straight away.',
    benefits: [
      '360° spray reaches every angle',
      'Dries clear in under a minute',
      'Water-resistant for 80 minutes',
    ],
    ingredients: [
      { name: 'Zinc oxide 20%', note: 'Mineral broad-spectrum UVA/UVB filter.' },
      { name: 'Aloe vera', note: 'Cools and calms sun-warmed skin.' },
      { name: 'Vitamin E', note: 'Antioxidant support against free radicals.' },
    ],
    howToUse: [
      'Shake well. Hold 10–15 cm from skin and spray generously until skin glistens, then rub in.',
      'Do not spray directly on the face: spray into hands first. Reapply after 80 minutes of swimming.',
    ],
    rating: 4.9,
    reviewCount: 547,
    image: undefined, // '/images/body-mist.webp'
    placeholder: { shape: 'spray', body: '#BCC8B4', label: '#FBF7F1', glow: '#D6DFC9' },
  },
]

export const FREE_SHIPPING_THRESHOLD = 50
export const SHIPPING_FEE = 5

export function getProduct(slug: string | undefined) {
  return products.find((p) => p.slug === slug)
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
