import { ResultatPartie, StatistiquesJeu } from '@/types'

// Fonction pour sauvegarder la dernière partie
export function sauvegarderDernierePartie(resultat: ResultatPartie): void {
  try {
    localStorage.setItem('derniere_partie', JSON.stringify(resultat))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la dernière partie:', error)
  }
}

// Fonction pour récupérer la dernière partie
export function recupererDernierePartie(): ResultatPartie | null {
  try {
    const donnees = localStorage.getItem('derniere_partie')
    return donnees ? JSON.parse(donnees) : null
  } catch (error) {
    console.error('Erreur lors de la récupération de la dernière partie:', error)
    return null
  }
}

// Fonction pour mettre à jour les statistiques
export function mettreAJourStatistiques(resultat: ResultatPartie): void {
  try {
    const stats = obtenirStatistiques()
    
    stats.partiesJouees += 1
    stats.scoreTotal += resultat.score
    stats.meilleurScore = Math.max(stats.meilleurScore, resultat.score)
    stats.dernierePartie = resultat
    
    localStorage.setItem('statistiques_jeu', JSON.stringify(stats))
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques:', error)
  }
}

// Fonction pour obtenir les statistiques
export function obtenirStatistiques(): StatistiquesJeu {
  try {
    const donnees = localStorage.getItem('statistiques_jeu')
    if (donnees) {
      return JSON.parse(donnees)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
  }
  
  // Valeurs par défaut
  return {
    partiesJouees: 0,
    scoreTotal: 0,
    meilleurScore: 0,
    dernierePartie: null
  }
}

// Fonction pour réinitialiser les statistiques
export function reinitialiserStatistiques(): void {
  try {
    localStorage.removeItem('statistiques_jeu')
    localStorage.removeItem('derniere_partie')
    localStorage.removeItem('parties_jouees')
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des statistiques:', error)
  }
}