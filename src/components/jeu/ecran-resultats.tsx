'use client'

import React, { useState } from 'react'
import { Bouton } from '@/components/ui/bouton'
import { ResultatPartie } from '@/types'

interface EcranResultatsProps {
  resultat: ResultatPartie
  onRejouer: () => void
  onRepartager: () => void
}

function getMessageScore(score: number): string {
  if (score === 5) return 'Parfait ! Vous avez un œil infaillible.'
  if (score >= 4) return 'Excellent ! Très bon niveau de détection.'
  if (score >= 3) return 'Bien joué ! Vous progressez.'
  if (score >= 2) return 'Pas mal, continuez à vous entraîner.'
  return "L'IA vous a bien eu cette fois. Retentez votre chance !"
}

export function EcranResultats({ resultat, onRejouer, onRepartager }: EcranResultatsProps) {
  const [imageAgrandie, setImageAgrandie] = useState<number | null>(null)
  const pourcentage = Math.round((resultat.score / resultat.total) * 100)

  const imageSelectionnee = imageAgrandie !== null ? resultat.images[imageAgrandie] : null
  const reponseSelectionnee = imageAgrandie !== null ? resultat.reponses[imageAgrandie] : null

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-2">
      <div className="animate-fade-in-up space-y-1 text-center">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Partie terminée</h2>
        <p className="text-sm text-gray-400">
          Mode {resultat.mode === 'painting' ? '🎨 Peinture' : '📸 Réaliste'}
        </p>
      </div>

      <div className="glass-card animate-pop-in flex flex-col items-center gap-1.5 rounded-3xl px-8 py-5">
        <div className="text-5xl font-extrabold text-white">
          {resultat.score}
          <span className="text-2xl text-gray-500">/{resultat.total}</span>
        </div>
        <div className="text-sm font-medium text-accent-blue-light">{pourcentage}% de bonnes réponses</div>
        <p className="mt-1 max-w-[220px] text-center text-sm text-gray-300">{getMessageScore(resultat.score)}</p>
      </div>

      <div className="grid w-full animate-fade-in-up grid-cols-5 gap-2" style={{ animationDelay: '80ms' }}>
        {resultat.images.map((image, index) => {
          const reponse = resultat.reponses[index]
          return (
            <button
              key={image.id}
              onClick={() => setImageAgrandie(index)}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-transform active:scale-95 ${
                reponse.estCorrecte ? 'border-accent-green/60' : 'border-accent-red/60'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/40`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow ${
                    reponse.estCorrecte ? 'bg-accent-green text-white' : 'bg-accent-red text-white'
                  }`}
                >
                  {reponse.estCorrecte ? '✓' : '✕'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex w-full animate-fade-in-up flex-col gap-3 sm:flex-row" style={{ animationDelay: '140ms' }}>
        <Bouton onClick={onRejouer} variant="primary" size="lg" className="flex-1">
          🔄 Rejouer
        </Bouton>
        <Bouton onClick={onRepartager} variant="secondary" size="lg" className="flex-1">
          📤 Partager
        </Bouton>
      </div>

      {imageSelectionnee && reponseSelectionnee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
          onClick={() => setImageAgrandie(null)}
        >
          <div className="relative max-h-[85vh] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setImageAgrandie(null)}
              aria-label="Fermer"
              className="absolute -top-10 right-0 flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSelectionnee.url} alt="Image agrandie" className="max-h-[70vh] w-full object-contain" />
              <div
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  reponseSelectionnee.estCorrecte ? 'bg-accent-green/20' : 'bg-accent-red/20'
                }`}
              >
                <span className="text-white">
                  {imageSelectionnee.est_ia ? '🤖 Générée par IA' : '📷 Image réelle'}
                </span>
                <span className={reponseSelectionnee.estCorrecte ? 'text-accent-green' : 'text-accent-red'}>
                  {reponseSelectionnee.estCorrecte ? '✓ Correct' : '✕ Raté'}
                </span>
              </div>
              {imageSelectionnee.attributionUnsplash ? (
                <p className="bg-dark-secondary px-4 py-2 text-xs text-gray-400">
                  Photo de{' '}
                  <a
                    href={imageSelectionnee.attributionUnsplash.photographeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    {imageSelectionnee.attributionUnsplash.photographeNom}
                  </a>{' '}
                  sur{' '}
                  <a
                    href={imageSelectionnee.attributionUnsplash.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    Unsplash
                  </a>
                </p>
              ) : imageSelectionnee.credits ? (
                <p className="bg-dark-secondary px-4 py-2 text-xs text-gray-400">{imageSelectionnee.credits}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
