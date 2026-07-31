// Selectionne et optimise un sous-ensemble du dataset painting local
// (dataset/datasets/painting/training_set) vers public/images/painting/{real,ai}
// + genere public/images/painting/manifest.json
//
// Usage: node scripts/build-painting-dataset.js

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const SRC_REAL = path.join(ROOT, 'dataset/datasets/painting/training_set/real')
const SRC_FAKE = path.join(ROOT, 'dataset/datasets/painting/training_set/fake')
const OUT_DIR = path.join(ROOT, 'public/images/painting')
const OUT_REAL = path.join(OUT_DIR, 'real')
const OUT_AI = path.join(OUT_DIR, 'ai')

const PER_ARTIST = 7 // images reelles par artiste
const AI_COUNT = 90 // nombre d'images IA a garder

function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function artistFromFilename(filename) {
  // "Alfred_Sisley_140.jpg" -> "Alfred Sisley"
  const base = filename.replace(/\.[a-zA-Z]+$/, '')
  const parts = base.split('_')
  parts.pop() // retire le numero
  return parts.join(' ')
}

async function optimize(srcPath, destPath) {
  await sharp(srcPath)
    .resize(1100, 1100, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(destPath)
}

async function main() {
  fs.mkdirSync(OUT_REAL, { recursive: true })
  fs.mkdirSync(OUT_AI, { recursive: true })

  // --- REAL : echantillonnage stratifie par artiste ---
  const realFiles = fs.readdirSync(SRC_REAL).filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  const byArtist = {}
  for (const f of realFiles) {
    const artist = artistFromFilename(f)
    if (!byArtist[artist]) byArtist[artist] = []
    byArtist[artist].push(f)
  }

  const selectedReal = []
  for (const [artist, files] of Object.entries(byArtist)) {
    const shuffled = seededShuffle(files, artist.length * 7919)
    selectedReal.push(...shuffled.slice(0, PER_ARTIST).map((f) => ({ file: f, artist })))
  }

  console.log(`Real: ${selectedReal.length} images selectionnees sur ${realFiles.length} (${Object.keys(byArtist).length} artistes)`)

  const realManifest = []
  let i = 1
  for (const { file, artist } of selectedReal) {
    const destName = `real-${String(i).padStart(3, '0')}.jpg`
    await optimize(path.join(SRC_REAL, file), path.join(OUT_REAL, destName))
    realManifest.push({ file: destName, credits: `${artist} (peinture classique)` })
    i++
  }

  // --- AI : echantillonnage aleatoire simple ---
  const fakeFiles = fs.readdirSync(SRC_FAKE).filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  const selectedFake = seededShuffle(fakeFiles, 424242).slice(0, AI_COUNT)

  console.log(`AI: ${selectedFake.length} images selectionnees sur ${fakeFiles.length}`)

  const aiManifest = []
  let j = 1
  for (const file of selectedFake) {
    const destName = `ai-${String(j).padStart(3, '0')}.jpg`
    await optimize(path.join(SRC_FAKE, file), path.join(OUT_AI, destName))
    aiManifest.push({ file: destName, credits: 'Generation IA (Stable Diffusion)' })
    j++
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ real: realManifest, ai: aiManifest }, null, 2)
  )

  console.log('Termine. Manifest ecrit dans public/images/painting/manifest.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
