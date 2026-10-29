import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Hero } from '../components/home/Hero'
import { UVSection } from '../components/home/UVSection'
import { ShopSection } from '../components/home/ShopSection'
import { TextureSection } from '../components/home/TextureSection'
import { ColorSection } from '../components/home/ColorSection'
import { Quiz } from '../components/home/Quiz'
import { Ingredients } from '../components/home/Ingredients'
import { Reviews } from '../components/home/Reviews'
import { FaqSection, Newsletter } from '../components/home/FaqNewsletter'

export default function Home() {
  useDocumentMeta(
    'Haluna — Sun care that disappears into your skin',
    'Haluna is a clean-beauty concept brand: weightless mineral sunscreens with no white cast, and soft balm colour for cheeks and lips.',
  )
  return (
    <>
      <Hero />
      <UVSection />
      <ShopSection />
      <TextureSection />
      <ColorSection />
      <Quiz />
      <Ingredients />
      <Reviews />
      <FaqSection />
      <Newsletter />
    </>
  )
}
