import { productImage, type Product, type Shade } from '../data/products'
import { Img } from './Img'
import { ProductRender } from './ProductRender'

/** The product photo for a product/shade, or the SVG packaging render when the photo is missing. */
export function ProductImage({
  product,
  shade,
  className = '',
  sizes = '(min-width: 1024px) 33vw, 90vw',
  priority,
}: {
  product: Product
  shade?: Shade
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const src = productImage(product, shade)
  const alt = `${product.name}${shade ? ` in ${shade.name}` : ''}, ${product.size}`
  if (!src) return <ProductRender product={product} shade={shade} label={alt} className={`h-full w-full ${className}`} />
  return <Img src={src} alt={alt} sizes={sizes} priority={priority} className={`h-full w-full object-cover ${className}`} />
}
