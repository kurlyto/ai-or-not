import { Image, ModeJeu } from '@/types'
import { lireManifest } from '@/lib/data/manifest'
import { obtenirPhotosDuJour } from '@/lib/unsplash/cache-quotidien'

// PRNG deterministe (mulberry32) : meme seed => meme suite de nombres,
// necessaire pour que tous les joueurs aient la meme partie un jour donne.
function creerGenerateur(seed: number) {
  let a = seed
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Transforme une chaine (date + mode) en seed numerique stable
function hashSeed(texte: string): number {
  let h = 0
  for (let i = 0; i < texte.length; i++) {
    h = (Math.imul(31, h) + texte.charCodeAt(i)) | 0
  }
  return h
}

function melangerAvecSeed<T>(items: T[], seed: number): T[] {
  const tableau = [...items]
  const rand = creerGenerateur(seed)
  for (let i = tableau.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[tableau[i], tableau[j]] = [tableau[j], tableau[i]]
  }
  return tableau
}

function choisirNAvecSeed<T>(items: T[], n: number, seed: number): T[] {
  return melangerAvecSeed(items, seed).slice(0, n)
}

function calculerRepartition(seedBase: number): { nombreIA: number; nombreReelles: number } {
  const repartitionRand = creerGenerateur(seedBase)()
  const nombreIA = repartitionRand < 0.5 ? 2 : 3
  return { nombreIA, nombreReelles: 5 - nombreIA }
}

// Genere les 5 images d'une partie de facon deterministe pour (date, mode).
// - painting : images IA + reelles depuis le manifest statique local
// - realistic : images IA depuis le manifest local, images reelles depuis
//   l'API Unsplash (cachees par jour, voir cache-quotidien.ts)
export async function genererPartieDuJour(date: string, mode: ModeJeu): Promise<Image[]> {
  const manifest = lireManifest(mode)
  const seedBase = hashSeed(`${date}:${mode}`)
  const { nombreIA, nombreReelles } = calculerRepartition(seedBase)

  const imagesIA = choisirNAvecSeed(manifest.ai, nombreIA, seedBase + 1).map((entry) => ({
    id: `${mode}-ai-${entry.file}`,
    url: `/images/${mode}/ai/${entry.file}`,
    categorie: mode,
    est_ia: true,
    credits: entry.credits,
  }))

  let imagesReelles: Image[]

  if (mode === 'realistic') {
    const photos = await obtenirPhotosDuJour(date)
    const photosChoisies = choisirNAvecSeed(photos, nombreReelles, seedBase + 2)
    imagesReelles = photosChoisies.map((photo) => ({
      id: `realistic-unsplash-${photo.id}`,
      url: photo.url,
      categorie: mode,
      est_ia: false,
      credits: `Photo de ${photo.attribution.photographeNom} sur Unsplash`,
      attributionUnsplash: photo.attribution,
    }))
  } else {
    imagesReelles = choisirNAvecSeed(manifest.real, nombreReelles, seedBase + 2).map((entry) => ({
      id: `${mode}-real-${entry.file}`,
      url: `/images/${mode}/real/${entry.file}`,
      categorie: mode,
      est_ia: false,
      credits: entry.credits,
    }))
  }

  const selection: Image[] = [...imagesIA, ...imagesReelles]
  return melangerAvecSeed(selection, seedBase + 3)
}

// Retrouve une image du jour par son id (pour la verification cote serveur)
export async function trouverImageParId(date: string, mode: ModeJeu, imageId: string): Promise<Image | null> {
  const images = await genererPartieDuJour(date, mode)
  return images.find((img) => img.id === imageId) || null
}
