import fs from 'fs'
import path from 'path'
import { Manifest, ModeJeu } from '@/types'

const manifestCache = new Map<ModeJeu, Manifest>()

// Lit le manifest statique d'un mode (public/images/<mode>/manifest.json).
// Mis en cache en memoire process car le fichier ne change jamais au runtime.
export function lireManifest(mode: ModeJeu): Manifest {
  const cached = manifestCache.get(mode)
  if (cached) return cached

  const manifestPath = path.join(process.cwd(), 'public', 'images', mode, 'manifest.json')
  const brut = fs.readFileSync(manifestPath, 'utf-8')
  const manifest = JSON.parse(brut) as Manifest

  manifestCache.set(mode, manifest)
  return manifest
}
