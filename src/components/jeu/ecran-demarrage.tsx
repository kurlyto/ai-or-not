'use client'

import React, { useEffect, useState } from 'react'
import { ModeJeu } from '@/types'
import { peutJouerMode, formaterDateAffichage } from '@/lib/jeu/gestion-date'

interface EcranDemarrageProps {
  onDemarrerJeu: (mode: ModeJeu) => void
  isLoading?: boolean
  dateSelectionnee?: string | null
}

interface CarteMode {
  mode: ModeJeu
  titre: string
  emoji: string
  degrade: string
}

const MODES: CarteMode[] = [
  {
    mode: 'realistic',
    titre: 'Réaliste',
    emoji: '📸',
    degrade: 'from-accent-blue/20 to-transparent',
  },
  {
    mode: 'painting',
    titre: 'Peinture',
    emoji: '🎨',
    degrade: 'from-accent-purple/20 to-transparent',
  },
]

export function EcranDemarrage({ onDemarrerJeu, isLoading = false, dateSelectionnee }: EcranDemarrageProps) {
  // La disponibilité dépend du localStorage, donc calculée uniquement côté client
  // pour éviter un mismatch d'hydratation SSR/CSR.
  const [disponibilite, setDisponibilite] = useState<Record<ModeJeu, boolean>>({
    realistic: true,
    painting: true,
  })

  useEffect(() => {
    if (dateSelectionnee) {
      setDisponibilite({ realistic: true, painting: true })
      return
    }
    setDisponibilite({
      realistic: peutJouerMode('realistic'),
      painting: peutJouerMode('painting'),
    })
  }, [dateSelectionnee])

  const aucunModeJouable = !dateSelectionnee && !disponibilite.realistic && !disponibilite.painting

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-4">
      <div className="animate-fade-in-up space-y-2 text-center">
        {dateSelectionnee && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-dark-tertiary px-3 py-1 text-xs font-medium text-accent-blue-light">
            📅 Partie du {formaterDateAffichage(dateSelectionnee)}
          </p>
        )}
        <h1 className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          AI or Not
        </h1>
        <p className="mx-auto max-w-sm text-balance text-sm text-gray-400 sm:text-lg">
          Saurez-vous distinguer une image réelle d&apos;une image générée par IA ?
        </p>
      </div>

      <div className="grid w-full animate-fade-in-up grid-cols-2 gap-3.5" style={{ animationDelay: '80ms' }}>
        {MODES.map((carte) => {
          const jouable = disponibilite[carte.mode]
          return (
            <button
              key={carte.mode}
              onClick={() => onDemarrerJeu(carte.mode)}
              disabled={!jouable || isLoading}
              className={`group relative flex min-h-[96px] flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dark-border bg-gradient-to-br ${carte.degrade} bg-dark-secondary p-5 transition-all duration-200 hover:border-[#3a3a47] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0`}
            >
              <span className="text-3xl transition-transform duration-200 group-hover:scale-110" aria-hidden>
                {carte.emoji}
              </span>
              <p className="text-lg font-bold text-white">{carte.titre}</p>
              {!jouable && (
                <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-medium text-gray-300">
                  Déjà joué
                </span>
              )}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-secondary/70">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="animate-fade-in-up space-y-1 text-center" style={{ animationDelay: '140ms' }}>
        <p className="text-xs text-gray-500">
          5 images par partie · nouvelle partie chaque jour à minuit
        </p>
        {aucunModeJouable && (
          <p className="text-sm font-medium text-accent-yellow">
            Vous avez déjà joué les deux modes aujourd&apos;hui. Revenez demain !
          </p>
        )}
      </div>
    </div>
  )
}
