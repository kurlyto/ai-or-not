import { ModeJeu } from '@/types'

// Libelle affichable (emoji + nom) pour chaque mode/theme, utilise partout ou
// le mode d'une partie doit etre affiche a l'utilisateur.
export const LABEL_PAR_MODE: Record<ModeJeu, string> = {
  realistic: '📸 Réaliste',
  painting: '🎨 Peinture',
  portrait: '🧑 Portrait',
  nature: '🏞️ Nature',
  architecture: '🏛️ Architecture',
}
