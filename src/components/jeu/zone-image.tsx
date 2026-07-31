import React, { useEffect, useRef, useState } from 'react'
import { Image } from '@/types'

interface FeedbackReponse {
  estCorrecte: boolean
  reponseCorrecte: 'ai' | 'not_ai'
}

interface ZoneImageProps {
  image: Image
  feedback?: FeedbackReponse | null
}

export function ZoneImage({ image, feedback }: ZoneImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageChargee, setImageChargee] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setImageError(false)
    // L'image peut deja etre en cache navigateur au moment du mount : dans ce
    // cas l'evenement onLoad ne se declenchera jamais, donc on verifie
    // manuellement `complete` pour eviter de rester bloque sur opacity-0.
    setImageChargee(imgRef.current?.complete ?? false)
  }, [image.id])

  const bordureFeedback = feedback
    ? feedback.estCorrecte
      ? 'ring-4 ring-accent-green'
      : 'ring-4 ring-accent-red animate-shake'
    : ''

  return (
    <div className={`image-container transition-shadow duration-200 ${bordureFeedback}`}>
      {!imageChargee && !imageError && <div className="skeleton absolute inset-0" />}

      {imageError ? (
        <div className="flex h-full items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-dark-tertiary text-2xl">
              🖼️
            </div>
            <p className="text-gray-400">Image indisponible</p>
          </div>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={image.url}
          alt="Devinez : image reelle ou generee par IA ?"
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            imageChargee ? 'opacity-100' : 'opacity-0'
          }`}
          draggable={false}
          onLoad={() => setImageChargee(true)}
          onError={() => setImageError(true)}
        />
      )}

      {feedback && (
        <div
          className={`absolute inset-0 flex items-end justify-center pb-4 animate-fade-in ${
            feedback.estCorrecte ? 'bg-accent-green/10' : 'bg-accent-red/10'
          }`}
        >
          <div
            className={`animate-pop-in flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-dark-lg ${
              feedback.estCorrecte ? 'bg-accent-green text-white' : 'bg-accent-red text-white'
            }`}
          >
            <span>{feedback.estCorrecte ? '✓ Correct' : '✕ Raté'}</span>
            <span className="opacity-80">
              — c&apos;etait {feedback.reponseCorrecte === 'ai' ? 'une image IA' : 'une image reelle'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
