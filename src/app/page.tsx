'use client'

import React, { useState } from 'react'
import { Header } from '@/components/header/header'
import { EcranDemarrage } from '@/components/jeu/ecran-demarrage'
import { ZoneImage } from '@/components/jeu/zone-image'
import { BoutonsChoix } from '@/components/jeu/boutons-choix'
import { IndicateurProgression } from '@/components/jeu/indicateur-progression'
import { EcranResultats } from '@/components/jeu/ecran-resultats'
import { ModeJeu, PartieEnCours, ResultatPartie, ReponseUtilisateur } from '@/types'
import {
  creerNouvellePartie,
  passerImageSuivante,
  ajouterReponse,
  estPartieTerminee,
  calculerResultat,
  obtenirImageActuelle,
} from '@/lib/jeu/logique-jeu'
import { sauvegarderDernierePartie, mettreAJourStatistiques } from '@/lib/utils/localStorage'
import { obtenirDateJeu, marquerModeJoue } from '@/lib/jeu/gestion-date'

type EtatJeu = 'demarrage' | 'en_cours' | 'resultats'

interface FeedbackReponse {
  estCorrecte: boolean
  reponseCorrecte: 'ai' | 'not_ai'
}

export default function HomePage() {
  const [etatJeu, setEtatJeu] = useState<EtatJeu>('demarrage')
  const [partie, setPartie] = useState<PartieEnCours | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateSelectionnee, setDateSelectionnee] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackReponse | null>(null)

  const demarrerJeu = async (mode: ModeJeu) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = new URL('/api/jeu', window.location.origin)
      url.searchParams.set('mode', mode)
      if (dateSelectionnee) {
        url.searchParams.set('date', dateSelectionnee)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement du jeu')
      }

      const images = data.data.images
      const dateJeu: string = data.data.date_jeu

      if (images.length !== 5) {
        throw new Error(`Nombre d'images incorrect: ${images.length} au lieu de 5`)
      }

      const nouvellePartie = creerNouvellePartie(mode, images, dateJeu)
      setPartie(nouvellePartie)
      setFeedback(null)
      setEtatJeu('en_cours')
    } catch (err) {
      console.error('Erreur lors du démarrage du jeu:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const traiterReponse = async (reponse: ReponseUtilisateur) => {
    if (!partie || feedback) return

    const imageActuelle = obtenirImageActuelle(partie)
    if (!imageActuelle) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/verifier-reponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_id: imageActuelle.id,
          reponse,
          mode: partie.mode,
          date_jeu: partie.date_jeu,
        }),
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la vérification')
      }

      const estCorrecte: boolean = data.data.est_correcte
      const reponseCorrecte: 'ai' | 'not_ai' = data.data.reponse_correcte

      // Affiche le feedback (bonne/mauvaise reponse) avant de passer a la suite
      setFeedback({ estCorrecte, reponseCorrecte })

      const partieMiseAJour = ajouterReponse(partie, reponse, estCorrecte)
      setPartie(partieMiseAJour)

      window.setTimeout(() => {
        setFeedback(null)

        if (estPartieTerminee(partieMiseAJour)) {
          const resultat = calculerResultat(partieMiseAJour)
          sauvegarderDernierePartie(resultat)
          mettreAJourStatistiques(resultat)
          if (!dateSelectionnee) {
            marquerModeJoue(partie.mode)
          }
          setEtatJeu('resultats')
        } else {
          setPartie(passerImageSuivante(partieMiseAJour))
        }
      }, 1100)
    } catch (err) {
      console.error('Erreur lors du traitement de la réponse:', err)
      setError('Erreur lors de la vérification de la réponse')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelection = (date: string) => {
    setDateSelectionnee(date)
    setEtatJeu('demarrage')
    setPartie(null)
    setError(null)
  }

  const rejouer = () => {
    setEtatJeu('demarrage')
    setPartie(null)
    setError(null)
    setFeedback(null)
    setDateSelectionnee(null)
  }

  const obtenirResultatActuel = (): ResultatPartie | null => {
    if (!partie) return null
    return calculerResultat(partie)
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-dark-primary text-white">
      <Header onSelectionnerDate={handleDateSelection} />

      <div className="container mx-auto flex min-h-0 flex-1 flex-col justify-center px-4 py-3">
        {error && (
          <div className="mx-auto mb-4 max-w-lg rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-300 underline underline-offset-2 hover:text-red-100"
            >
              Fermer
            </button>
          </div>
        )}

        {etatJeu === 'demarrage' && (
          <EcranDemarrage
            onDemarrerJeu={demarrerJeu}
            isLoading={isLoading}
            dateSelectionnee={dateSelectionnee}
          />
        )}

        {etatJeu === 'en_cours' &&
          partie &&
          (() => {
            const imageActuelle = obtenirImageActuelle(partie)
            return (
              <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col justify-center gap-4">
                <IndicateurProgression partie={partie} />

                {imageActuelle && <ZoneImage image={imageActuelle} feedback={feedback} />}

                <BoutonsChoix onReponse={traiterReponse} isLoading={isLoading} disabled={!!feedback} />
              </div>
            )
          })()}

        {etatJeu === 'resultats' && partie && (
          <EcranResultats resultat={obtenirResultatActuel()!} onRejouer={rejouer} />
        )}
      </div>
    </main>
  )
}
