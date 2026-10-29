// Renders public/og-image.png (1200×630) from an inline SVG. Run: npm run og
import sharp from 'sharp'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="78%" cy="30%" r="60%">
      <stop offset="0" stop-color="#F7B27F"/><stop offset=".45" stop-color="#FBD9BE"/><stop offset="1" stop-color="#FBF7F1"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="110" cy="122" r="26" fill="#F28C4B"/>
  <path d="M74 136h72" stroke="#2B1E16" stroke-width="6" stroke-linecap="round"/>
  <text x="160" y="140" font-family="Fraunces, Georgia, serif" font-size="64" fill="#2B1E16">haluna</text>
  <text x="80" y="330" font-family="Fraunces, Georgia, serif" font-size="84" fill="#2B1E16">Sun care that feels</text>
  <text x="80" y="430" font-family="Fraunces, Georgia, serif" font-size="84" font-style="italic" fill="#A84C14">like nothing.</text>
  <text x="80" y="530" font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" fill="#6B5A4E">Mineral SPF · No white cast · Reef-friendly</text>
  <g transform="translate(930 190)">
    <ellipse cx="80" cy="390" rx="110" ry="14" fill="#2B1E16" opacity=".08"/>
    <rect x="20" y="40" width="120" height="340" rx="22" fill="#FFFDF9" stroke="#2B1E16" stroke-opacity=".08"/>
    <rect x="35" y="0" width="90" height="48" rx="10" fill="#2B1E16"/>
    <text x="80" y="150" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="30" fill="#2B1E16">haluna</text>
    <circle cx="80" cy="185" r="10" fill="#F28C4B"/>
    <text x="80" y="250" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="34" fill="#2B1E16">SPF 50</text>
  </g>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og-image.png')
console.log('Wrote public/og-image.png')
