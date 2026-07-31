import { PartieEnCours, Image, Reponse, ResultatPartie, ReponseUtilisateur } from '@/types'

// Fonction pour créer une nouvelle partie
export function creerNouvellePartie(mode: 'realistic' | 'painting', images: Image[], dateJeu: string): PartieEnCours {
  return {
    id: `partie_${Date.now()}`,
    mode,
    images,
    image_actuelle: 0,
    reponses: [],
    date_jeu: dateJeu
  }
}

// Fonction pour passer à l'image suivante
export function passerImageSuivante(partie: PartieEnCours): PartieEnCours {
  return {
    ...partie,
    image_actuelle: partie.image_actuelle + 1
  }
}

// Fonction pour ajouter une réponse
export function ajouterReponse(
  partie: PartieEnCours, 
  reponse: ReponseUtilisateur, 
  estCorrecte: boolean
): PartieEnCours {
  const imageActuelle = obtenirImageActuelle(partie)
  if (!imageActuelle) return partie

  const nouvelleReponse: Reponse = {
    imageId: imageActuelle.id,
    reponseUtilisateur: reponse,
    estCorrecte
  }

  return {
    ...partie,
    reponses: [...partie.reponses, nouvelleReponse]
  }
}

// Fonction pour vérifier si la partie est terminée
export function estPartieTerminee(partie: PartieEnCours): boolean {
  return partie.reponses.length >= 5
}

// Fonction pour calculer le résultat final
export function calculerResultat(partie: PartieEnCours): ResultatPartie {
  const score = partie.reponses.filter(r => r.estCorrecte).length
  
  return {
    id: partie.id,
    mode: partie.mode,
    score,
    total: 5,
    reponses: partie.reponses,
    date_jeu: partie.date_jeu,
    images: partie.images
  }
}

// Fonction pour obtenir l'image actuelle
export function obtenirImageActuelle(partie: PartieEnCours): Image | null {
  return partie.images[partie.image_actuelle] || null
}