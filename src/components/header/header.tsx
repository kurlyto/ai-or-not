'use client'

import React, { useState } from 'react'
import { IconeCalendrier, IconeQuestion, IconeParametres } from '@/components/ui/icones'
import { CalendrierModal } from './calendrier-modal'
import { GuideModal } from './guide-modal'
import { ParametresModal } from './parametres-modal'

interface HeaderProps {
  onSelectionnerDate: (date: string) => void
}

export function Header({ onSelectionnerDate }: HeaderProps) {
  const [calendrierOpen, setCalendrierOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [parametresOpen, setParametresOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-dark-border bg-dark-primary/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-lg font-bold text-white">
            <span aria-hidden>🎭</span>
            <span className="hidden xs:inline">AI or Not</span>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => setCalendrierOpen(true)}
              aria-label="Parties précédentes"
              className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white sm:px-3"
            >
              <IconeCalendrier />
              <span className="hidden sm:inline">Historique</span>
            </button>

            <button
              onClick={() => setGuideOpen(true)}
              aria-label="Guide de détection"
              className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white sm:px-3"
            >
              <IconeQuestion />
              <span className="hidden sm:inline">Guide</span>
            </button>

            <button
              onClick={() => setParametresOpen(true)}
              aria-label="Paramètres"
              className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white sm:px-3"
            >
              <IconeParametres />
              <span className="hidden sm:inline">Options</span>
            </button>
          </nav>
        </div>
      </header>

      <CalendrierModal
        isOpen={calendrierOpen}
        onClose={() => setCalendrierOpen(false)}
        onSelectionnerDate={(date) => {
          onSelectionnerDate(date)
          setCalendrierOpen(false)
        }}
      />

      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />

      <ParametresModal isOpen={parametresOpen} onClose={() => setParametresOpen(false)} />
    </>
  )
}
