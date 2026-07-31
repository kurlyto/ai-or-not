import { Image, ModeJeu, AttributionUnsplash } from '@/types'

// Format compact d'une image pour l'encodage dans l'URL (evite de gonfler le
// lien avec des champs redondants ou verbeux)
interface ImageCompacte {
  i: string // id
  u: string // url
  a: boolean // est_ia
  c?: string // credits
  p?: [string, string, string, string] // attributionUnsplash: [nom, urlPhotographe, urlPhoto, downloadLocation]
}

interface PartieCompacte {
  m: ModeJeu
  im: ImageCompacte[]
}

function versCompacte(image: Image): ImageCompacte {
  const compacte: ImageCompacte = { i: image.id, u: image.url, a: image.est_ia }
  if (image.credits) compacte.c = image.credits
  if (image.attributionUnsplash) {
    const attr = image.attributionUnsplash
    compacte.p = [attr.photographeNom, attr.photographeUrl, attr.photoUrl, attr.downloadLocation]
  }
  return compacte
}

function depuisCompacte(compacte: ImageCompacte, mode: ModeJeu): Image {
  let attributionUnsplash: AttributionUnsplash | undefined
  if (compacte.p) {
    const [photographeNom, photographeUrl, photoUrl, downloadLocation] = compacte.p
    attributionUnsplash = { photographeNom, photographeUrl, photoUrl, downloadLocation }
  }
  return {
    id: compacte.i,
    url: compacte.u,
    categorie: mode,
    est_ia: compacte.a,
    credits: compacte.c,
    attributionUnsplash,
  }
}

// Encode les 5 images exactes d'une partie dans une chaine compacte pour
// l'URL. Autonome : ne depend d'aucune resolution serveur ulterieure, donc
// fonctionne aussi bien pour les modes quotidiens que pour un futur mode a
// parties illimitees (rejouable).
export function encoderPartie(mode: ModeJeu, images: Image[]): string {
  const partie: PartieCompacte = { m: mode, im: images.map(versCompacte) }
  const json = JSON.stringify(partie)
  // encodeURIComponent + btoa pour supporter les caracteres UTF-8 (accents)
  return btoa(encodeURIComponent(json))
}

// Decode une chaine generee par encoderPartie. Renvoie null si le format est
// invalide (lien corrompu, trop ancien, etc.) : ne doit jamais faire planter
// le jeu, juste retomber sur le flux normal.
export function decoderPartie(chaine: string): { mode: ModeJeu; images: Image[] } | null {
  try {
    const json = decodeURIComponent(atob(chaine))
    const partie: PartieCompacte = JSON.parse(json)

    if (!partie.m || !Array.isArray(partie.im) || partie.im.length !== 5) return null

    return {
      mode: partie.m,
      images: partie.im.map((img) => depuisCompacte(img, partie.m)),
    }
  } catch {
    return null
  }
}
