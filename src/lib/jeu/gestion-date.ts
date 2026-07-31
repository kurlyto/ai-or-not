import { ModeJeu } from '@/types'

// Fonction pour obtenir la date de jeu (format YYYY-MM-DD), alignee sur le
// fuseau Europe/Paris independamment du fuseau du serveur ou du navigateur
export function obtenirDateJeu(): string {
  const maintenant = new Date()
  const formateur = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formateur.format(maintenant) // en-CA => YYYY-MM-DD
}

// Fonction pour vérifier si un mode peut être joué aujourd'hui
export function peutJouerMode(mode: ModeJeu): boolean {
  const aujourdhui = obtenirDateJeu()
  const donnees = obtenirDonneesPartiesJouees()

  // Vérifier si ce mode a déjà été joué aujourd'hui
  return !donnees[aujourdhui]?.[mode]
}

// Fonction pour marquer qu'un mode a été joué
export function marquerModeJoue(mode: ModeJeu): void {
  if (typeof window === 'undefined') return

  const aujourdhui = obtenirDateJeu()
  const donnees = obtenirDonneesPartiesJouees()

  if (!donnees[aujourdhui]) {
    donnees[aujourdhui] = { realistic: false, painting: false }
  }

  donnees[aujourdhui][mode] = true
  localStorage.setItem('parties_jouees', JSON.stringify(donnees))
}

// Fonction pour obtenir les données des parties jouées
export function obtenirDonneesPartiesJouees(): Record<string, { realistic: boolean, painting: boolean }> {
  if (typeof window === 'undefined') return {}

  try {
    const donnees = localStorage.getItem('parties_jouees')
    return donnees ? JSON.parse(donnees) : {}
  } catch {
    return {}
  }
}

// Fonction pour formater une date pour l'affichage
export function formaterDateAffichage(date: string): string {
  const [annee, mois, jour] = date.split('-')
  return `${jour}/${mois}/${annee}`
}

// Fonction pour obtenir les dates disponibles (7 derniers jours, dont aujourd'hui)
export function obtenirDatesDisponibles(): string[] {
  const dates: string[] = []
  const aujourdhui = obtenirDateJeu()
  const [annee, mois, jour] = aujourdhui.split('-').map(Number)
  // Construit a midi UTC pour eviter tout glissement de jour lors du setDate
  const base = new Date(Date.UTC(annee, mois - 1, jour, 12))

  const formateur = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  for (let i = 0; i < 7; i++) {
    const date = new Date(base)
    date.setUTCDate(date.getUTCDate() - i)
    dates.push(formateur.format(date))
  }

  return dates
}