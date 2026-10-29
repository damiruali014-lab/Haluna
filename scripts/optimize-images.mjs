// Generates responsive WebP sizes into public/images/r/ and writes src/data/image-sizes.json,
// which <Img> reads to build srcset. Also derives the hero leaf-shadow backdrop.
// Run after adding or replacing photos: npm run images
import sharp from 'sharp'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'

const SRC = 'public/images'
const OUT = `${SRC}/r`
mkdirSync(OUT, { recursive: true })

const widthsFor = (w) => [480, 800, 1200, 1600].filter((x) => x < w * 0.9)
const manifest = {}

for (const file of readdirSync(SRC).filter((f) => f.endsWith('.webp'))) {
  const name = file.replace(/\.webp$/, '')
  const meta = await sharp(`${SRC}/${file}`).metadata()
  const widths = widthsFor(meta.width)
  for (const w of widths) {
    const out = `${OUT}/${name}-${w}.webp`
    if (!existsSync(out)) await sharp(`${SRC}/${file}`).resize({ width: w }).webp({ quality: 74 }).toFile(out)
  }
  manifest[name] = { w: meta.width, h: meta.height, sizes: widths }
}

// Hero stage backdrop: the empty, leaf-shadowed left side of the collection banner.
if (existsSync(`${SRC}/collection-banner.webp`)) {
  await sharp(`${SRC}/collection-banner.webp`)
    .extract({ left: 0, top: 0, width: 740, height: 1357 })
    .resize({ width: 720 })
    .webp({ quality: 70 })
    .toFile(`${OUT}/hero-shadow.webp`)
}

writeFileSync('src/data/image-sizes.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(`Optimised ${Object.keys(manifest).length} images → ${OUT}`)
