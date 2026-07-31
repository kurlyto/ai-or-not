import { DonneesPartage, ResultatPartie } from '@/types'

// Fonction pour générer le texte de partage
export function genererTextePartage(donnees: DonneesPartage): string {
  const { score, total, mode, date_jeu } = donnees
  const pourcentage = Math.round((score / total) * 100)
  
  // Emojis selon le mode
  const emoji = mode === 'painting' ? '🎨' : '📸'
  
  // Messages selon le score
  let message = ''
  if (pourcentage === 100) {
    message = `Perfect score! I got ${score}/${total} on AI or Not! ${emoji}`
  } else if (pourcentage >= 80) {
    message = `Great score! I got ${score}/${total} on AI or Not! ${emoji}`
  } else if (pourcentage >= 60) {
    message = `Good score! I got ${score}/${total} on AI or Not! ${emoji}`
  } else {
    message = `I scored ${score}/${total} on AI or Not! ${emoji}`
  }
  
  const challenge = 'Can you beat my score?'
  const hashtag = '#AIorNot #AIDetection'
  
  return `${message}\n${challenge}\n\n${hashtag}`
}

// Fonction pour générer le texte de partage avec lien
export function genererTextePartageAvecLien(donnees: DonneesPartage): string {
  const texteBase = genererTextePartage(donnees)
  const lien = obtenirLienJeu()
  
  return `${texteBase}\n\nPlay here: ${lien}`
}

// Fonction pour obtenir le lien du jeu
export function obtenirLienJeu(): string {
  // En production, remplacer par votre vraie URL
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'https://ai-or-not.vercel.app'
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
        title: 'AI or Not - My Score',
        text: texte,
        url: obtenirLienJeu()
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
    date_jeu: donnees.date_jeu
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
      date_jeu: params.get('date_jeu') || new Date().toISOString().split('T')[0]
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
    twitter: true, // Toujours disponible via URL
    facebook: true // Toujours disponible via URL
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
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${lienEncode}`
  }
}
