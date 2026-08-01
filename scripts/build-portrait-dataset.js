// Construit le dataset du theme "Portrait" en reutilisant les visages IA
// deja telecharges pour le mode realistic (thisfacenotexist.com), sans les
// scenes de plage qui font aussi partie de ce pool.
// Usage: node scripts/build-portrait-dataset.js

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SRC_MANIFEST = path.join(ROOT, 'public/images/realistic/manifest.json')
const SRC_AI_DIR = path.join(ROOT, 'public/images/realistic/ai')
const OUT_DIR = path.join(ROOT, 'public/images/portrait')
const OUT_AI_DIR = path.join(OUT_DIR, 'ai')

function main() {
  const manifest = JSON.parse(fs.readFileSync(SRC_MANIFEST, 'utf-8'))
  const visages = manifest.ai.filter((entry) => entry.credits.includes('thisfacenotexist'))

  console.log(`${visages.length} visages trouves dans le manifest realistic`)

  fs.mkdirSync(OUT_AI_DIR, { recursive: true })

  const portraitManifest = { ai: [] }

  visages.forEach((entry, index) => {
    const destName = `portrait-ai-${String(index + 1).padStart(3, '0')}.jpg`
    fs.copyFileSync(path.join(SRC_AI_DIR, entry.file), path.join(OUT_AI_DIR, destName))
    portraitManifest.ai.push({ file: destName, credits: entry.credits })
  })

  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(portraitManifest, null, 2))
  console.log(`Termine. ${portraitManifest.ai.length} images copiees dans public/images/portrait/ai/`)
}

main()
