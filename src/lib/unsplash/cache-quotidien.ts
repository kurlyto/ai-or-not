import fs from 'fs'
import path from 'path'
import { obtenirPhotosAleatoires, PhotoUnsplash } from './client'

const CACHE_DIR = path.join(process.cwd(), 'data', 'unsplash-cache')

// Requete Unsplash (query) associee a chaque mode qui utilise des photos
// reelles Unsplash. 'realistic' reste volontairement sans filtre (contenu
// generaliste), les themes de la Serie du jour sont filtres par sujet.
const QUERY_PAR_MODE: Partial<Record<string, string>> = {
  portrait: 'portrait',
  nature: 'landscape nature',
  architecture: 'architecture building',
}

function cheminCache(date: string, mode: string): string {
  return path.join(CACHE_DIR, `${date}-${mode}.json`)
}

// Retourne les 5 photos reelles Unsplash du jour pour un mode donne,
// generees une seule fois par (date, mode) et reutilisees ensuite (fichier
// cache sur disque). Necessaire car l'API Unsplash /photos/random n'a pas de
// mode deterministe et le quota (50 req/h en Demo) interdit un appel par
// visite.
export async function obtenirPhotosDuJour(date: string, mode: string = 'realistic'): Promise<PhotoUnsplash[]> {
  const chemin = cheminCache(date, mode)

  if (fs.existsSync(chemin)) {
    const brut = fs.readFileSync(chemin, 'utf-8')
    return JSON.parse(brut) as PhotoUnsplash[]
  }

  const photos = await obtenirPhotosAleatoires(5, QUERY_PAR_MODE[mode])

  fs.mkdirSync(CACHE_DIR, { recursive: true })
  // Ecriture atomique (tmp + rename) pour eviter une lecture partielle si
  // deux requetes concurrentes generent le cache du meme jour en meme temps.
  const chaine = JSON.stringify(photos, null, 2)
  const cheminTmp = `${chemin}.${process.pid}.tmp`
  fs.writeFileSync(cheminTmp, chaine)
  fs.renameSync(cheminTmp, chemin)

  return photos
}
