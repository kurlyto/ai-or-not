// Types principaux pour l'application AI or Not

export type ModeJeu = 'realistic' | 'painting'
export type ReponseUtilisateur = 'ai' | 'not_ai'

export interface AttributionUnsplash {
  photographeNom: string
  photographeUrl: string
  photoUrl: string
  downloadLocation: string
}

export interface Image {
  id: string
  url: string
  categorie: ModeJeu
  est_ia: boolean
  credits?: string
  attributionUnsplash?: AttributionUnsplash
}

export interface Reponse {
  imageId: string
  reponseUtilisateur: ReponseUtilisateur
  estCorrecte: boolean
}

export interface PartieEnCours {
  id: string
  mode: ModeJeu
  images: Image[]
  image_actuelle: number // Index de l'image actuelle (0 à 4)
  reponses: Reponse[]
  date_jeu: string // Date au format YYYY-MM-DD
  estPartiePartagee?: boolean // true si chargee depuis un lien de partage (?partie=)
}

export interface ResultatPartie {
  id: string
  mode: ModeJeu
  score: number
  total: number // Toujours 5
  reponses: Reponse[]
  date_jeu: string
  images: Image[] // Inclure les images pour l'écran de résultats
}

export interface DonneesPartage {
  score: number
  total: number
  mode: ModeJeu
  date_jeu: string
  images: Image[]
}

export interface StatistiquesJeu {
  partiesJouees: number
  scoreTotal: number
  meilleurScore: number
  dernierePartie: ResultatPartie | null
}

// Une entree brute du manifest statique public/images/<mode>/manifest.json
export interface ManifestEntry {
  file: string
  credits: string
}

export interface Manifest {
  real: ManifestEntry[]
  ai: ManifestEntry[]
}
