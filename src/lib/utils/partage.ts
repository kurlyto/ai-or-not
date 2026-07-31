import { DonneesPartage, ResultatPartie } from '@/types'

// Phrases de défi variées selon le score, pour donner envie de partager
const DEFIS_PAR_SCORE: Record<number, string[]> = {
  5: [
    'Score parfait ! Votre grand-mère fera-t-elle aussi bien ? Défiez-la !',
    "5/5, sans faute ! Quelqu'un peut-il faire mieux dans votre entourage ?",
  ],
  4: [
    'Votre grand-mère aura-t-elle plus de 4/5 ? Défiez-la !',
    'Presque parfait ! Qui peut faire mieux que vous ?',
  ],
  3: [
    'Votre grand-mère aura-t-elle plus de 3/5 ? Défiez-la !',
    "La moyenne, mais l'IA vous a bien eu sur certaines. À vous de faire mieux ?",
  ],
  2: [
    "L'IA vous a bien eu cette fois. Qui saura mieux repérer les pièges ?",
    "2/5... Votre entourage saura-t-il faire mieux face à l'IA ?",
  ],
  1: [
    "L'IA vous a berné presque à chaque fois ! Vengez-vous, ou trouvez quelqu'un de plus fort.",
    "1/5, l'IA est passée maître dans l'art de vous tromper. À qui le tour ?",
  ],
  0: [
    "0/5 : l'IA vous a totalement berné ! Quelqu'un fera forcément mieux.",
    "Match nul face à l'IA (0/5). Qui osera relever le défi ?",
  ],
}

function choisirDefi(score: number): string {
  const options = DEFIS_PAR_SCORE[score] || DEFIS_PAR_SCORE[3]
  return options[Math.floor(Math.random() * options.length)]
}

// Fonction pour générer le texte de partage
export function genererTextePartage(donnees: DonneesPartage): string {
  const { score, total, mode } = donnees
  const emoji = mode === 'painting' ? '🎨' : '📸'
  const modeTexte = mode === 'painting' ? 'Peinture' : 'Réaliste'

  const resultat = `${emoji} AI or Not (${modeTexte}) : ${score}/${total}`
  const defi = choisirDefi(score)

  return `${resultat}\n\n${defi}`
}

// Fonction pour générer le texte de partage avec lien
export function genererTextePartageAvecLien(donnees: DonneesPartage): string {
  const texteBase = genererTextePartage(donnees)
  const lien = obtenirLienJeu()

  return `${texteBase}\n\n${lien}`
}

// Fonction pour obtenir le lien du jeu
export function obtenirLienJeu(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'https://ai-or-not.nathan-knaebel.com'
}

// Fonction pour copier le texte dans le presse-papiers
export async function copierDansPressePapiers(texte: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texte)
      return true
    } else {
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea')
      textArea.value = texte
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const reussi = document.execCommand('copy')
      document.body.removeChild(textArea)
      return reussi
    }
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    return false
  }
}

// Fonction pour partager via l'API Web Share (mobile)
export async function partagerViaWebShare(donnees: DonneesPartage): Promise<boolean> {
  try {
    if (navigator.share) {
      const texte = genererTextePartageAvecLien(donnees)
      await navigator.share({
        title: 'AI or Not',
        text: texte,
        url: obtenirLienJeu(),
      })
      return true
    }
    return false
  } catch (error) {
    console.error('Erreur lors du partage:', error)
    return false
  }
}

// Fonction pour générer un lien de partage personnalisé
export function genererLienPartagePersonnalise(donnees: DonneesPartage): string {
  const baseUrl = obtenirLienJeu()
  const params = new URLSearchParams({
    score: donnees.score.toString(),
    total: donnees.total.toString(),
    mode: donnees.mode,
    date_jeu: donnees.date_jeu,
  })

  return `${baseUrl}?share=${btoa(params.toString())}`
}

// Fonction pour décoder un lien de partage
export function decoderLienPartage(encodedParams: string): DonneesPartage | null {
  try {
    const params = new URLSearchParams(atob(encodedParams))
    return {
      score: parseInt(params.get('score') || '0'),
      total: parseInt(params.get('total') || '5'),
      mode: (params.get('mode') as 'realistic' | 'painting') || 'realistic',
      date_jeu: params.get('date_jeu') || new Date().toISOString().split('T')[0],
    }
  } catch (error) {
    console.error('Erreur lors du décodage du lien:', error)
    return null
  }
}

// Fonction pour obtenir les options de partage disponibles
export function obtenirOptionsPartage(): {
  webShare: boolean
  clipboard: boolean
  twitter: boolean
  facebook: boolean
} {
  return {
    webShare: typeof navigator !== 'undefined' && !!navigator.share,
    clipboard: typeof navigator !== 'undefined' && !!navigator.clipboard,
    twitter: true,
    facebook: true,
  }
}

// Fonction pour générer les URLs de partage social
export function genererUrlsPartageSocial(donnees: DonneesPartage): {
  twitter: string
  facebook: string
  linkedin: string
} {
  const texte = genererTextePartage(donnees)
  const lien = obtenirLienJeu()
  const texteEncode = encodeURIComponent(texte)
  const lienEncode = encodeURIComponent(lien)

  return {
    twitter: `https://twitter.com/intent/tweet?text=${texteEncode}&url=${lienEncode}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${lienEncode}&quote=${texteEncode}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${lienEncode}`,
  }
}
