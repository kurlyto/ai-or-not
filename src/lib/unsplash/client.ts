import { AttributionUnsplash } from '@/types'

const UNSPLASH_API_BASE = 'https://api.unsplash.com'

interface PhotoUnsplashBrut {
  id: string
  urls: { regular: string }
  user: { name: string; links: { html: string } }
  links: { html: string; download_location: string }
}

export interface PhotoUnsplash {
  id: string
  url: string
  attribution: AttributionUnsplash
}

function cleAcces(): string {
  const cle = process.env.UNSPLASH_ACCESS_KEY
  if (!cle) throw new Error('UNSPLASH_ACCESS_KEY manquante')
  return cle
}

function versPhotoUnsplash(brut: PhotoUnsplashBrut): PhotoUnsplash {
  return {
    id: brut.id,
    url: brut.urls.regular,
    attribution: {
      photographeNom: brut.user.name,
      photographeUrl: `${brut.user.links.html}?utm_source=ai_or_not&utm_medium=referral`,
      photoUrl: `${brut.links.html}?utm_source=ai_or_not&utm_medium=referral`,
      downloadLocation: brut.links.download_location,
    },
  }
}

// Recupere N photos aleatoires reelles depuis Unsplash, optionnellement
// filtrees par theme (query). A appeler rarement (rate limit 50 req/h en
// mode Demo) : le resultat doit etre mis en cache cote serveur, jamais
// rappele a chaque visite.
export async function obtenirPhotosAleatoires(nombre: number, query?: string): Promise<PhotoUnsplash[]> {
  const url = new URL(`${UNSPLASH_API_BASE}/photos/random`)
  url.searchParams.set('count', String(nombre))
  url.searchParams.set('content_filter', 'high')
  if (query) url.searchParams.set('query', query)

  const reponse = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${cleAcces()}` },
  })

  if (!reponse.ok) {
    throw new Error(`Unsplash API error: ${reponse.status} ${await reponse.text()}`)
  }

  const donnees: PhotoUnsplashBrut[] = await reponse.json()
  return donnees.map(versPhotoUnsplash)
}

// A appeler une fois par photo, au moment ou elle est reellement affichee au
// joueur (pas au moment ou elle est recuperee/cachee) : c'est l'exigence des
// guidelines Unsplash pour compter un "usage" de la photo.
export async function declencherTelechargement(downloadLocation: string): Promise<void> {
  try {
    await fetch(`${downloadLocation}${downloadLocation.includes('?') ? '&' : '?'}client_id=${cleAcces()}`)
  } catch (error) {
    // Best-effort : un echec de tracking ne doit jamais casser le jeu
    console.error('Erreur declenchement telechargement Unsplash:', error)
  }
}
