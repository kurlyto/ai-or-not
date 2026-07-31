import React from 'react'
import { PartieEnCours } from '@/types'

interface IndicateurProgressionProps {
  partie: PartieEnCours
}

export function IndicateurProgression({ partie }: IndicateurProgressionProps) {
  const numeroActuel = Math.min(partie.image_actuelle + 1, partie.images.length)
  const total = partie.images.length
  const score = partie.reponses.filter((r) => r.estCorrecte).length

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, index) => {
          const reponse = partie.reponses[index]
          const estActuelle = index === partie.image_actuelle
          return (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                estActuelle ? 'w-7' : 'w-2'
              } ${
                reponse
                  ? reponse.estCorrecte
                    ? 'bg-accent-green'
                    : 'bg-accent-red'
                  : estActuelle
                    ? 'bg-accent-blue'
                    : 'bg-dark-border'
              }`}
            />
          )
        })}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span className="font-medium text-white">
          {numeroActuel}/{total}
        </span>
        <span className="hidden sm:inline text-dark-border">•</span>
        <span className="hidden sm:inline">
          {partie.mode === 'painting' ? '🎨 Peinture' : '📸 Realiste'}
        </span>
        <span className="rounded-full bg-dark-tertiary px-2.5 py-1 font-medium text-white">
          {score} pt{score > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
