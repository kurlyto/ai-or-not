'use client'

import React, { useState } from 'react'
import { Bouton } from '@/components/ui/bouton'
import { ResultatPartie } from '@/types'
import { genererTextePartageAvecLien, copierDansPressePapiers, partagerViaWebShare } from '@/lib/utils/partage'

interface EcranResultatsProps {
  resultat: ResultatPartie
  onRejouer: () => void
}

function getMessageScore(score: number): string {
  if (score === 5) return 'Parfait ! Vous avez un oeil infaillible.'
  if (score >= 4) return 'Excellent ! Tres bon niveau de detection.'
  if (score >= 3) return 'Bien joue ! Vous progressez.'
  if (score >= 2) return 'Pas mal, continuez a vous entrainer.'
  return "L'IA vous a bien eu cette fois. Retentez votre chance !"
}

export function EcranResultats({ resultat, onRejouer }: EcranResultatsProps) {
  const [copie, setCopie] = useState(false)
  const pourcentage = Math.round((resultat.score / resultat.total) * 100)

  const handlePartager = async () => {
    const donnees = {
      score: resultat.score,
      total: resultat.total,
      mode: resultat.mode,
      date_jeu: resultat.date_jeu,
    }

    const viaShare = await partagerViaWebShare(donnees)
    if (viaShare) return

    const texte = genererTextePartageAvecLien(donnees)
    const reussi = await copierDansPressePapiers(texte)
    if (reussi) {
      setCopie(true)
      window.setTimeout(() => setCopie(false), 2000)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-7 py-6 sm:py-10">
      <div className="animate-fade-in-up space-y-1 text-center">
        <h2 className="text-2xl font-bold text-white">Partie terminee</h2>
        <p className="text-sm text-gray-400">
          Mode {resultat.mode === 'painting' ? '🎨 Peinture' : '📸 Realiste'}
        </p>
      </div>

      <div className="glass-card animate-pop-in flex flex-col items-center gap-2 rounded-3xl px-10 py-8">
        <div className="text-6xl font-extrabold text-white">
          {resultat.score}
          <span className="text-3xl text-gray-500">/{resultat.total}</span>
        </div>
        <div className="text-sm font-medium text-accent-blue-light">{pourcentage}% de bonnes reponses</div>
        <p className="mt-2 max-w-[220px] text-center text-sm text-gray-300">{getMessageScore(resultat.score)}</p>
      </div>

      <div className="w-full animate-fade-in-up space-y-2" style={{ animationDelay: '80ms' }}>
        {resultat.reponses.map((reponse, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-secondary px-4 py-2.5"
          >
            <span className="text-sm text-gray-400">Image {index + 1}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Votre reponse : {reponse.reponseUtilisateur === 'ai' ? 'IA' : 'Reelle'}
              </span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  reponse.estCorrecte ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                }`}
              >
                {reponse.estCorrecte ? '✓' : '✕'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full animate-fade-in-up flex-col gap-3 sm:flex-row" style={{ animationDelay: '140ms' }}>
        <Bouton onClick={onRejouer} variant="primary" size="lg" className="flex-1">
          🔄 Rejouer
        </Bouton>
        <Bouton onClick={handlePartager} variant="secondary" size="lg" className="flex-1">
          {copie ? '✓ Copie !' : '📤 Partager'}
        </Bouton>
      </div>
    </div>
  )
}
