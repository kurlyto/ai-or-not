'use client'

import React, { useState } from 'react'
import { DonneesPartage } from '@/types'
import {
  genererTextePartage,
  genererLiensPartageDirects,
  partagerViaWebShare,
  partageNatifDisponible,
  copierDansPressePapiers,
} from '@/lib/utils/partage'
import { IconeWhatsApp, IconeSms, IconeX, IconeCopier, IconePartage } from '@/components/ui/icones'

interface PopoverPartageProps {
  donnees: DonneesPartage
  onFermer: () => void
}

export function PopoverPartage({ donnees, onFermer }: PopoverPartageProps) {
  const [copie, setCopie] = useState(false)
  const message = genererTextePartage(donnees)
  const liens = genererLiensPartageDirects(donnees)
  const natifDisponible = partageNatifDisponible()

  const handlePartageNatif = async () => {
    const reussi = await partagerViaWebShare(donnees)
    if (reussi) onFermer()
  }

  const handleCopier = async () => {
    const reussi = await copierDansPressePapiers(message)
    if (reussi) {
      setCopie(true)
      window.setTimeout(() => setCopie(false), 1800)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={onFermer}>
      <div
        className="glass-card relative w-full max-w-sm animate-pop-in rounded-3xl bg-dark-secondary p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onFermer}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-5 mt-2 text-5xl font-extrabold text-white">
          {donnees.score}
          <span className="text-2xl text-gray-500">/{donnees.total}</span>
        </div>

        <p className="mb-6 text-balance text-base font-medium leading-relaxed text-gray-200">{message}</p>

        {natifDisponible ? (
          <button
            onClick={handlePartageNatif}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-blue px-4 py-3.5 font-semibold text-white shadow-glow transition-transform active:scale-[0.97]"
          >
            <IconePartage />
            Partager mon score
          </button>
        ) : null}

        <div className="grid grid-cols-4 gap-2">
          <a
            href={liens.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur WhatsApp"
            className="flex flex-col items-center gap-1 rounded-xl border border-dark-border bg-dark-tertiary py-3 text-[#25D366] transition-transform active:scale-[0.95]"
          >
            <IconeWhatsApp />
          </a>
          <a
            href={liens.sms}
            aria-label="Partager par SMS"
            className="flex flex-col items-center gap-1 rounded-xl border border-dark-border bg-dark-tertiary py-3 text-accent-blue-light transition-transform active:scale-[0.95]"
          >
            <IconeSms />
          </a>
          <a
            href={liens.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur X"
            className="flex flex-col items-center gap-1 rounded-xl border border-dark-border bg-dark-tertiary py-3 text-white transition-transform active:scale-[0.95]"
          >
            <IconeX />
          </a>
          <button
            onClick={handleCopier}
            aria-label="Copier le message"
            className="flex flex-col items-center gap-1 rounded-xl border border-dark-border bg-dark-tertiary py-3 text-gray-300 transition-transform active:scale-[0.95]"
          >
            <IconeCopier />
          </button>
        </div>
        {copie && <p className="mt-2 text-xs text-accent-green">Message copié !</p>}

        <button onClick={onFermer} className="mt-5 text-sm text-gray-500 underline-offset-2 hover:text-gray-300 hover:underline">
          Voir mon résumé détaillé
        </button>
      </div>
    </div>
  )
}
