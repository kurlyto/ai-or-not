'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/header/header'
import { EcranDemarrage } from '@/components/jeu/ecran-demarrage'
import { ZoneImage } from '@/components/jeu/zone-image'
import { BoutonsChoix } from '@/components/jeu/boutons-choix'
import { IndicateurProgression } from '@/components/jeu/indicateur-progression'
import { EcranResultats } from '@/components/jeu/ecran-resultats'
import { PopoverPartage } from '@/components/jeu/popover-partage'
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
import { decoderPartie } from '@/lib/utils/lien-partie'

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
  const [popoverPartageVisible, setPopoverPartageVisible] = useState(false)
  // Mode reellement demande par le joueur ('serie' ou un ModeJeu direct) :
  // distinct du mode resolu stocke dans la partie, necessaire pour marquer
  // "Serie du jour" comme jouee independamment du theme du jour resolu.
  const [modeDemandeActuel, setModeDemandeActuel] = useState<ModeJeu | 'serie' | null>(null)

  // Si l'URL contient ?partie=..., on charge exactement cette partie (memes
  // 5 images que celle partagee), plutot que de generer la partie du jour.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idPartie = params.get('partie')
    if (!idPartie) return

    const decodee = decoderPartie(idPartie)
    if (!decodee) return

    const nouvellePartie = creerNouvellePartie(decodee.mode, decodee.images, obtenirDateJeu(), true)
    setPartie(nouvellePartie)
    setEtatJeu('en_cours')

    // Nettoie l'URL pour eviter de recharger la meme partie sur un refresh
    // ou de la re-partager par erreur avec le lien de la page courante.
    window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const demarrerJeu = async (modeDemande: ModeJeu | 'serie') => {
    setIsLoading(true)
    setError(null)

    try {
      const url = new URL('/api/jeu', window.location.origin)
      url.searchParams.set('mode', modeDemande)
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
      // Le serveur resout 'serie' vers le vrai theme du jour (portrait,
      // nature, architecture...) : c'est ce mode resolu qu'on doit stocker.
      const modeResolu: ModeJeu = data.data.mode

      if (images.length !== 5) {
        throw new Error(`Nombre d'images incorrect: ${images.length} au lieu de 5`)
      }

      const nouvellePartie = creerNouvellePartie(modeResolu, images, dateJeu)
      setPartie(nouvellePartie)
      setModeDemandeActuel(modeDemande)
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
      let estCorrecte: boolean
      let reponseCorrecte: 'ai' | 'not_ai'

      if (partie.estPartiePartagee) {
        // Partie chargee depuis un lien de partage : les images sont deja
        // connues cote client, pas besoin d'aller demander au serveur.
        estCorrecte = (imageActuelle.est_ia && reponse === 'ai') || (!imageActuelle.est_ia && reponse === 'not_ai')
        reponseCorrecte = imageActuelle.est_ia ? 'ai' : 'not_ai'
      } else {
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

        estCorrecte = data.data.est_correcte
        reponseCorrecte = data.data.reponse_correcte
      }

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
          if (!dateSelectionnee && !partie.estPartiePartagee && modeDemandeActuel) {
            marquerModeJoue(modeDemandeActuel)
          }
          setEtatJeu('resultats')
          setPopoverPartageVisible(true)
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
    setPopoverPartageVisible(false)
    setModeDemandeActuel(null)
  }

  const obtenirResultatActuel = (): ResultatPartie | null => {
    if (!partie) return null
    return calculerResultat(partie)
  }

  return (
    <main className="flex h-dvh flex-col overflow-y-auto bg-dark-primary text-white">
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
          <>
            <EcranResultats
              resultat={obtenirResultatActuel()!}
              onRejouer={rejouer}
              onRepartager={() => setPopoverPartageVisible(true)}
            />
            {popoverPartageVisible && (
              <PopoverPartage
                donnees={{
                  score: obtenirResultatActuel()!.score,
                  total: obtenirResultatActuel()!.total,
                  mode: partie.mode,
                  date_jeu: partie.date_jeu,
                  images: partie.images,
                }}
                onFermer={() => setPopoverPartageVisible(false)}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}
