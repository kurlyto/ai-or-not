import { Image, ModeJeu } from '@/types'
import { lireManifest } from '@/lib/data/manifest'

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

// Genere les 5 images d'une partie de facon deterministe pour (date, mode).
// Repartition variable (2 ou 3 images IA sur 5) selon le seed, pour que le
// nombre d'images IA ne soit pas devinable a l'avance.
export function genererPartieDuJour(date: string, mode: ModeJeu): Image[] {
  const manifest = lireManifest(mode)
  const seedBase = hashSeed(`${date}:${mode}`)

  const repartitionRand = creerGenerateur(seedBase)()
  const nombreIA = repartitionRand < 0.5 ? 2 : 3
  const nombreReelles = 5 - nombreIA

  const imagesIA = choisirNAvecSeed(manifest.ai, nombreIA, seedBase + 1)
  const imagesReelles = choisirNAvecSeed(manifest.real, nombreReelles, seedBase + 2)

  const selection: Image[] = [
    ...imagesIA.map((entry, index) => ({
      id: `${mode}-ai-${entry.file}`,
      url: `/images/${mode}/ai/${entry.file}`,
      categorie: mode,
      est_ia: true,
      credits: entry.credits,
    })),
    ...imagesReelles.map((entry, index) => ({
      id: `${mode}-real-${entry.file}`,
      url: `/images/${mode}/real/${entry.file}`,
      categorie: mode,
      est_ia: false,
      credits: entry.credits,
    })),
  ]

  return melangerAvecSeed(selection, seedBase + 3)
}

// Retrouve une image du jour par son id (pour la verification cote serveur)
export function trouverImageParId(date: string, mode: ModeJeu, imageId: string): Image | null {
  const images = genererPartieDuJour(date, mode)
  return images.find((img) => img.id === imageId) || null
}
