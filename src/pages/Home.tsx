import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Hero } from '../components/home/Hero'
import { Quiz } from '../components/home/Quiz'
import { BenefitsStrip, FaqSection, IngredientsSection, Newsletter, ReviewsSection, ShopSection } from '../components/home/Sections'

export default function Home() {
  useDocumentMeta(
    'Haluna — Sun care that feels like nothing',
    'Weightless, reef-friendly mineral sunscreens with no white cast. Daily Fluid SPF 50, Glow Tint SPF 30 and Body Mist SPF 50.',
  )
  return (
    <>
      <Hero />
      <BenefitsStrip />
      <ShopSection />
      <Quiz />
      <IngredientsSection />
      <ReviewsSection />
      <FaqSection />
      <Newsletter />
    </>
  )
}
