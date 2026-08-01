import { ThemeSerieDuJour } from '@/types'

const THEMES: ThemeSerieDuJour[] = ['portrait', 'nature', 'architecture']

// Meme hash simple que selection-images.ts, duplique volontairement ici pour
// ne pas creer de dependance circulaire entre modules de selection.
function hashSeed(texte: string): number {
  let h = 0
  for (let i = 0; i < texte.length; i++) {
    h = (Math.imul(31, h) + texte.charCodeAt(i)) | 0
  }
  return h
}

// Determine le theme de la Serie du jour pour une date donnee : deterministe
// (meme theme pour tout le monde ce jour-la), tire parmi les themes
// disponibles.
export function obtenirThemeDuJour(date: string): ThemeSerieDuJour {
  const seed = hashSeed(`serie:${date}`)
  const index = Math.abs(seed) % THEMES.length
  return THEMES[index]
}

export function nomAffichageTheme(theme: ThemeSerieDuJour): string {
  switch (theme) {
    case 'portrait':
      return 'Portrait'
    case 'nature':
      return 'Nature'
    case 'architecture':
      return 'Architecture'
  }
}

export function emojiTheme(theme: ThemeSerieDuJour): string {
  switch (theme) {
    case 'portrait':
      return '🧑'
    case 'nature':
      return '🏞️'
    case 'architecture':
      return '🏛️'
  }
}
