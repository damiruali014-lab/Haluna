/**
 * Product catalogue. Edit this file to turn the template into a real store.
 * Images are paths under /public/images. Leave one undefined and the site renders
 * an SVG of the sand packaging instead (see ProductRender.tsx).
 */

export type Category = 'sun' | 'color'
export type Pack = 'tube' | 'stick' | 'jar' | 'vial'

export interface Shade {
  id: string
  name: string
  /** Colour of the product itself: swatch chip, smear, SVG fallback. */
  swatch: string
  /** Card background while this shade is selected (a sand-mixed version of the swatch). */
  tint: string
  image?: string
}

export interface Product {
  slug: string
  name: string
  /** Lowercase descriptor, as printed on the pack. */
  descriptor: string
  category: Category
  spf?: number
  size: string
  price: number
  description: string
  benefits: [string, string, string]
  ingredients: { name: string; note: string }[]
  howToUse: string[]
  rating: number
  reviewCount: number
  pack: Pack
  /** Packaging colour for the SVG fallback. */
  packColor: string
  image?: string
  /** Lifestyle shot shown on card hover and as the third gallery frame. */
  lifestyle: string
  /** Macro texture shot, second gallery frame. */
  texture: string
  shades?: Shade[]
  badge?: string
}

const TEXTURE = '/images/texture-cream.webp'

export const products: Product[] = [
  {
    slug: 'daily-mineral-sunscreen-spf-50',
    name: 'Daily Mineral Sunscreen SPF 50',
    descriptor: 'daily mineral sunscreen',
    category: 'sun',
    spf: 50,
    size: '50 ml',
    price: 28,
    description:
      'Our hero. A weightless mineral fluid that melts into skin and disappears: broad-spectrum SPF 50, no white cast, no shine, no pilling under makeup.',
    benefits: ['Invisible on every skin tone', 'Sinks in like a serum, never greasy', 'Smooth, grippy base for makeup'],
    ingredients: [
      { name: 'Zinc oxide 18%', note: 'Gentle mineral UVA/UVB protection.' },
      { name: 'Niacinamide 4%', note: 'Evens tone and supports the barrier.' },
      { name: 'Hyaluronic acid', note: 'Light, all-day hydration.' },
    ],
    howToUse: [
      'Shake. Smooth two finger-lengths over face and neck as the last step of your morning routine.',
      'Reapply every two hours outdoors, and after swimming or sweating.',
    ],
    rating: 4.9,
    reviewCount: 1842,
    pack: 'tube',
    packColor: '#DCC8AE',
    image: '/images/product-sunscreen.webp',
    lifestyle: '/images/lifestyle-1.webp',
    texture: TEXTURE,
    badge: 'Bestseller',
  },
  {
    slug: 'glow-tint-spf-30',
    name: 'Glow Tint SPF 30',
    descriptor: 'glow tint',
    category: 'sun',
    spf: 30,
    size: '40 ml',
    price: 32,
    description:
      'Sheer, buildable colour on a mineral SPF 30 base. Blurs redness, evens tone and leaves a soft, lit-from-within finish.',
    benefits: ['Sheer coverage that blurs and evens', 'Dewy glow without shine', 'Iron oxides help shield against visible light'],
    ingredients: [
      { name: 'Zinc oxide 15%', note: 'Mineral UVA/UVB protection.' },
      { name: 'Iron oxides', note: 'Natural tint that helps shield visible light.' },
      { name: 'Squalane', note: 'Weightless, skin-identical moisture.' },
    ],
    howToUse: ['Dot over face and blend outwards with fingers or a damp sponge.', 'Build a second layer where you want more coverage.'],
    rating: 4.8,
    reviewCount: 964,
    pack: 'tube',
    packColor: '#DCC8AE',
    lifestyle: '/images/lifestyle-3.webp',
    texture: TEXTURE,
    shades: [
      { id: 'light', name: 'Light', swatch: '#EFD9C2', tint: '#EADBC6', image: '/images/product-tint-light.webp' },
      { id: 'medium', name: 'Medium', swatch: '#C99560', tint: '#E3CBAE', image: '/images/product-tint-medium.webp' },
      { id: 'deep', name: 'Deep', swatch: '#7A4A2C', tint: '#E3CCB4', image: '/images/product-tint-deep.webp' },
    ],
  },
  {
    slug: 'sun-stick-spf-50',
    name: 'Sun Stick SPF 50',
    descriptor: 'sun stick',
    category: 'sun',
    spf: 50,
    size: '15 g',
    price: 22,
    description:
      'Clear mineral SPF 50 in a pocket-size stick. Glide it over makeup, ears, nose and the back of your neck. Reapplying finally feels easy.',
    benefits: ['Reapply over makeup without smudging', 'Clear glide, no residue on fingers', 'Fits a pocket or a jeans pocket'],
    ingredients: [
      { name: 'Zinc oxide 20%', note: 'Mineral UVA/UVB protection.' },
      { name: 'Jojoba esters', note: 'Silky, clear glide.' },
      { name: 'Vitamin E', note: 'Antioxidant support.' },
    ],
    howToUse: ['Twist up and glide four passes over each area.', 'Pat lightly to set. Reapply every two hours.'],
    rating: 4.7,
    reviewCount: 538,
    pack: 'stick',
    packColor: '#DCC8AE',
    image: '/images/product-stick.webp',
    lifestyle: '/images/lifestyle-3.webp',
    texture: TEXTURE,
  },
  {
    slug: 'cheek-balm-blush',
    name: 'Cheek Balm Blush',
    descriptor: 'cheek balm',
    category: 'color',
    size: '8 g',
    price: 24,
    description:
      'A cushiony balm that melts into skin like a flush from the inside. Sheer at first tap, buildable to a real bloom.',
    benefits: ['Melts in, never sits on top', 'Buildable from sheer to bold', 'Doubles as a lip balm'],
    ingredients: [
      { name: 'Shea butter', note: 'Cushiony, melting texture.' },
      { name: 'Rosehip oil', note: 'Glow and nourishment.' },
      { name: 'Mineral pigments', note: 'Soft, natural colour.' },
    ],
    howToUse: ['Tap a little onto the apples of your cheeks with fingertips.', 'Blend up towards the temples. Layer for more colour.'],
    rating: 4.9,
    reviewCount: 716,
    pack: 'jar',
    packColor: '#DCC8AE',
    lifestyle: '/images/lifestyle-2.webp',
    texture: TEXTURE,
    badge: 'New',
    shades: [
      { id: 'petal', name: 'Petal', swatch: '#E59A9B', tint: '#EBC9C0', image: '/images/product-blush-petal.webp' },
      { id: 'dusk-rose', name: 'Dusk Rose', swatch: '#B4757D', tint: '#E5CBC4', image: '/images/product-blush-dusk.webp' },
      { id: 'ember', name: 'Ember', swatch: '#D9765E', tint: '#ECCDBB', image: '/images/product-blush-ember.webp' },
    ],
  },
  {
    slug: 'lip-cheek-tint-spf-15',
    name: 'Lip & Cheek Tint SPF 15',
    descriptor: 'lip & cheek tint',
    category: 'color',
    spf: 15,
    size: '6 ml',
    price: 18,
    description: 'A watercolour stain for lips and cheeks with a little SPF 15. Light as water, lasts all afternoon.',
    benefits: ['Weightless, transfer-resistant stain', 'Works on lips and cheeks', 'SPF 15 for everyday lips'],
    ingredients: [
      { name: 'Zinc oxide', note: 'Mineral SPF 15.' },
      { name: 'Glycerin', note: 'Keeps lips soft.' },
      { name: 'Beet extract', note: 'Natural, buildable colour.' },
    ],
    howToUse: ['Dab onto lips and blot together.', 'Tap a dot onto cheeks and blend quickly with a fingertip.'],
    rating: 4.6,
    reviewCount: 402,
    pack: 'vial',
    packColor: '#DCC8AE',
    lifestyle: '/images/lifestyle-3.webp',
    texture: TEXTURE,
    shades: [
      { id: 'berry', name: 'Berry', swatch: '#B5294F', tint: '#EACCCB', image: '/images/product-liptint.webp' },
      { id: 'bare', name: 'Bare', swatch: '#C98B7B', tint: '#E8CDBF', image: undefined }, // '/images/product-liptint-bare.webp'
    ],
  },
  {
    slug: 'after-sun-cooling-gel',
    name: 'After-Sun Cooling Gel',
    descriptor: 'after-sun cooling gel',
    category: 'sun',
    size: '100 ml',
    price: 20,
    description: 'A cool, bouncy gel for skin that has had a long day outside. Calms, hydrates and absorbs in seconds.',
    benefits: ['Instantly cooling', 'Calms the look of redness', 'Absorbs fast, never sticky'],
    ingredients: [
      { name: 'Aloe vera', note: 'Cools and soothes.' },
      { name: 'Panthenol', note: 'Supports skin recovery.' },
      { name: 'Cucumber water', note: 'Fresh, light hydration.' },
    ],
    howToUse: ['Smooth generously over sun-warmed skin.', 'Keep it in the fridge for extra cooling.'],
    rating: 4.8,
    reviewCount: 391,
    pack: 'tube',
    packColor: '#C9D6D2',
    image: '/images/product-aftersun.webp',
    lifestyle: '/images/lifestyle-3.webp',
    texture: TEXTURE,
  },
]

export const CATEGORIES: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sun', label: 'Sun care' },
  { id: 'color', label: 'Color' },
]

export const FREE_SHIPPING_THRESHOLD = 50
export const SHIPPING_FEE = 5

export function getProduct(slug: string | undefined) {
  return products.find((p) => p.slug === slug)
}

export function defaultShade(p: Product) {
  return p.shades?.[0]
}

export function productImage(p: Product, shade?: Shade) {
  return shade ? shade.image : p.image
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
