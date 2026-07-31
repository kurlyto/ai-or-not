import fs from 'fs'
import path from 'path'
import { obtenirPhotosAleatoires, PhotoUnsplash } from './client'

const CACHE_DIR = path.join(process.cwd(), 'data', 'unsplash-cache')

function cheminCache(date: string): string {
  return path.join(CACHE_DIR, `${date}.json`)
}

// Retourne les 5 photos reelles Unsplash du jour, generees une seule fois
// par date et reutilisees ensuite (fichier cache sur disque). Necessaire
// car l'API Unsplash /photos/random n'a pas de mode deterministe et le
// quota (50 req/h en Demo) interdit un appel par visite.
export async function obtenirPhotosDuJour(date: string): Promise<PhotoUnsplash[]> {
  const chemin = cheminCache(date)

  if (fs.existsSync(chemin)) {
    const brut = fs.readFileSync(chemin, 'utf-8')
    return JSON.parse(brut) as PhotoUnsplash[]
  }

  const photos = await obtenirPhotosAleatoires(5)

  fs.mkdirSync(CACHE_DIR, { recursive: true })
  // Ecriture atomique (tmp + rename) pour eviter une lecture partielle si
  // deux requetes concurrentes generent le cache du meme jour en meme temps.
  const chaine = JSON.stringify(photos, null, 2)
  const cheminTmp = `${chemin}.${process.pid}.tmp`
  fs.writeFileSync(cheminTmp, chaine)
  fs.renameSync(cheminTmp, chemin)

  return photos
}
