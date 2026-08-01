'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Bouton } from '@/components/ui/bouton'
import { obtenirStatistiques, reinitialiserStatistiques } from '@/lib/utils/localStorage'
import { StatistiquesJeu } from '@/types'

interface ParametresModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ParametresModal({ isOpen, onClose }: ParametresModalProps) {
  const [stats, setStats] = useState<StatistiquesJeu | null>(null)
  const [confirmationReset, setConfirmationReset] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStats(obtenirStatistiques())
      setConfirmationReset(false)
    }
  }, [isOpen])

  const moyenne = stats && stats.partiesJouees > 0 ? (stats.scoreTotal / stats.partiesJouees).toFixed(1) : '—'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistiques & options">
      <div className="space-y-6">
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-dark-border bg-dark-tertiary p-3.5 text-center">
              <p className="text-2xl font-bold text-white">{stats.partiesJouees}</p>
              <p className="text-xs text-gray-400">Parties</p>
            </div>
            <div className="rounded-xl border border-dark-border bg-dark-tertiary p-3.5 text-center">
              <p className="text-2xl font-bold text-white">{stats.meilleurScore}/5</p>
              <p className="text-xs text-gray-400">Meilleur score</p>
            </div>
            <div className="rounded-xl border border-dark-border bg-dark-tertiary p-3.5 text-center">
              <p className="text-2xl font-bold text-white">{moyenne}</p>
              <p className="text-xs text-gray-400">Moyenne</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Crédits</h3>
          <div className="space-y-2 text-xs text-gray-400">
            <p>
              <span className="text-gray-300">🎨 Peinture :</span> images réelles issues d&apos;un jeu de données de
              tableaux classiques (domaine public) · images IA générées par diffusion.
            </p>
            <p>
              <span className="text-gray-300">📸 Réaliste :</span> photos réelles via Unsplash · visages et scènes IA
              générés par des modèles de type GAN.
            </p>
            <p>
              <span className="text-gray-300">🧑🏞️🏛️ Série du jour :</span> photos réelles via Unsplash (filtrées par
              thème) · images IA générées par des modèles de type GAN, spécifiques à chaque thème.
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">À propos</h3>
          <p className="text-xs leading-relaxed text-gray-400">
            AI or Not est un jeu éducatif gratuit pour développer son esprit critique face aux images générées par
            IA.
          </p>
        </div>

        <div className="border-t border-dark-border pt-4">
          {confirmationReset ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Bouton
                variant="secondary"
                size="sm"
                className="flex-1 !border-accent-red/40 !text-accent-red"
                onClick={() => {
                  reinitialiserStatistiques()
                  setStats(obtenirStatistiques())
                  setConfirmationReset(false)
                }}
              >
                Confirmer la réinitialisation
              </Bouton>
              <Bouton variant="ghost" size="sm" onClick={() => setConfirmationReset(false)}>
                Annuler
              </Bouton>
            </div>
          ) : (
            <Bouton variant="ghost" size="sm" onClick={() => setConfirmationReset(true)}>
              Réinitialiser mes statistiques
            </Bouton>
          )}
        </div>
      </div>
    </Modal>
  )
}
