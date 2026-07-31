import { DonneesPartage, ResultatPartie } from '@/types'
import { encoderPartie } from './lien-partie'

// Phrases de défi variées selon le score, pour donner envie de partager
const DEFIS_PAR_SCORE: Record<number, string[]> = {
  5: [
    "Score parfait, 5/5. Tu fais moins bien ? Tu me dois une bière. T'es chaud ?",
    'Sans faute ! Qui ose se mesurer à moi ?',
    'Score parfait ! Ta grand-mère peut-elle faire mieux ?',
  ],
  4: [
    "4/5, presque parfait. T'es capable de faire mieux ?",
    'Ta grand-mère aura-t-elle plus de 4/5 ? Défie-la !',
  ],
  3: [
    "3/5... Tu penses que ta grand-mère peut faire mieux ?",
    "La moyenne, mais l'IA m'a bien eu sur certaines. À toi de faire mieux ?",
  ],
  2: [
    "L'IA m'a bien eu cette fois (2/5). Toi, tu sauras repérer les pièges ?",
    "2/5... Même ta grand-mère ferait mieux, non ?",
  ],
  1: [
    "L'IA m'a berné presque à chaque fois (1/5). Venge-moi, ou avoue que tu feras pire.",
    "1/5, l'IA m'a totalement eu. À qui le tour ?",
  ],
  0: [
    "0/5 : l'IA m'a totalement berné ! Quelqu'un peut forcément faire mieux.",
    "Match nul face à l'IA (0/5). Tu oses relever le défi ?",
  ],
}

function choisirDefi(score: number): string {
  const options = DEFIS_PAR_SCORE[score] || DEFIS_PAR_SCORE[3]
  return options[Math.floor(Math.random() * options.length)]
}

// Fonction pour générer le texte de partage
export function genererTextePartage(donnees: DonneesPartage): string {
  const { score, mode } = donnees
  const emoji = mode === 'painting' ? '🎨' : '📸'

  const defi = choisirDefi(score)

  return `${emoji} ${defi}`
}

// Fonction pour générer le texte de partage avec lien
export function genererTextePartageAvecLien(donnees: DonneesPartage): string {
  const texteBase = genererTextePartage(donnees)
  const lien = obtenirLienPartie(donnees)

  return `${texteBase}\n\n${lien}`
}

// Fonction pour obtenir le lien du jeu (accueil generale, sans partie precise)
export function obtenirLienJeu(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'https://ai-or-not.nathan-knaebel.com'
}

// Fonction pour obtenir un lien pointant vers la partie exacte qui vient
// d'etre jouee (memes 5 images, quel que soit le mode ou la date a laquelle
// le destinataire clique dessus)
export function obtenirLienPartie(donnees: DonneesPartage): string {
  const base = obtenirLienJeu()
  const id = encoderPartie(donnees.mode, donnees.images)
  return `${base}?partie=${id}`
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

// Fonction pour partager via l'API Web Share (mobile + desktop compatibles :
// ouvre le sélecteur natif de l'appareil avec toutes les apps installées,
// y compris Instagram/Messenger qui n'ont pas de lien de partage direct)
export async function partagerViaWebShare(donnees: DonneesPartage): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'AI or Not',
        text: genererTextePartage(donnees),
        url: obtenirLienPartie(donnees),
      })
      return true
    }
    return false
  } catch (error) {
    // AbortError = l'utilisateur a annulé le partage, ce n'est pas une erreur
    if (error instanceof Error && error.name === 'AbortError') return true
    console.error('Erreur lors du partage:', error)
    return false
  }
}

// Fonction pour vérifier si le partage natif est disponible sur cet appareil
export function partageNatifDisponible(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share
}

// Fonction pour générer les liens de partage directs (WhatsApp, SMS, X).
// Instagram et Messenger n'ont pas d'URL scheme public pour pré-remplir un
// message : ils ne sont accessibles que via le partage natif ci-dessus.
export function genererLiensPartageDirects(donnees: DonneesPartage): {
  whatsapp: string
  sms: string
  x: string
} {
  const texte = genererTextePartageAvecLien(donnees)
  const texteEncode = encodeURIComponent(texte)

  return {
    whatsapp: `https://wa.me/?text=${texteEncode}`,
    sms: `sms:?&body=${texteEncode}`,
    x: `https://twitter.com/intent/tweet?text=${texteEncode}`,
  }
}
