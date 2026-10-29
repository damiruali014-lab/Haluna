// Renders public/og-image.png (1200×630): the collection banner with the Haluna wordmark. Run: npm run og
import sharp from 'sharp'

// Same stroke glyphs as src/components/Logo.tsx (cap height 24).
const G = {
  H: [15, 'M0.75 0V24M14.25 0V24M0.75 12.4H14.25'],
  A: [17, 'M0.6 24L8.5 0.2L16.4 24M3.55 15.6H13.45'],
  L: [12, 'M0.75 0V23.25H12'],
  U: [21, 'M0 0.4C1.5 0.9 2.2 2.2 2.2 4.4V14.2A8.3 8.3 0 0 0 18.8 14.2V4.4C18.8 2.2 19.5 0.9 21 0.4'],
  N: [15, 'M0.75 24V0.2L14.25 23.8V0'],
}
const DROP = 'M10.5 5.6C10.5 5.6 7.05 10.9 7.05 14.15A3.45 3.45 0 0 0 13.95 14.15C13.95 10.9 10.5 5.6 10.5 5.6Z'
let x = 0
const letters = [...'HALUNA']
  .map((ch) => {
    const [w, d] = G[ch]
    const g = `<g transform="translate(${x} 0)"><path d="${d}" fill="none" stroke="#1C1A17" stroke-width="1.3"/>${ch === 'U' ? `<path d="${DROP}" fill="#1C1A17"/>` : ''}</g>`
    x += w + 12.5
    return g
  })
  .join('')

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="#F5EFE6" stop-opacity="0.92"/>
      <stop offset="0.42" stop-color="#F5EFE6" stop-opacity="0.55"/>
      <stop offset="0.62" stop-color="#F5EFE6" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <g transform="translate(72 84) scale(1.6)">${letters}</g>
  <text x="72" y="330" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="66" font-weight="300" letter-spacing="-2" fill="#1C1A17">Sun care that</text>
  <text x="72" y="404" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="66" font-weight="300" letter-spacing="-2" fill="#9A4F55">disappears</text>
  <text x="72" y="478" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="66" font-weight="300" letter-spacing="-2" fill="#1C1A17">into your skin.</text>
  <text x="74" y="560" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="17" font-weight="500" letter-spacing="5" fill="#5E554C">MINERAL SUN CARE · SOFT COLOUR</text>
</svg>`

await sharp('public/images/collection-banner.webp')
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([{ input: Buffer.from(overlay) }])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png')
console.log('Wrote public/og-image.png')
