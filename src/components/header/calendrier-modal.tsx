import React from 'react'
import { Modal } from '@/components/ui/modal'
import { obtenirDatesDisponibles, formaterDateAffichage, obtenirDateJeu } from '@/lib/jeu/gestion-date'

interface CalendrierModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectionnerDate: (date: string) => void
}

export function CalendrierModal({ isOpen, onClose, onSelectionnerDate }: CalendrierModalProps) {
  const datesDisponibles = obtenirDatesDisponibles()
  const aujourdhui = obtenirDateJeu()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Parties précédentes">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Rejouez les parties des 7 derniers jours. Les parties passées peuvent être jouées à volonté.
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {datesDisponibles.map((date, index) => {
            const estAujourdhui = date === aujourdhui
            return (
              <button
                key={date}
                onClick={() => onSelectionnerDate(date)}
                className="flex min-h-[52px] flex-col items-start justify-center rounded-xl border border-dark-border bg-dark-tertiary px-4 py-2.5 text-left transition-colors hover:border-accent-blue/50 hover:bg-accent-blue/10 active:scale-[0.98]"
              >
                <span className="font-medium text-white">{formaterDateAffichage(date)}</span>
                <span className="text-xs text-gray-400">
                  {estAujourdhui ? "Aujourd'hui" : index === 1 ? 'Hier' : `Il y a ${index} jours`}
                </span>
              </button>
            )
          })}
        </div>

        <div className="border-t border-dark-border pt-4">
          <p className="text-xs text-gray-500">
            Chaque jour propose Réaliste, Peinture et une Série du jour à thème, avec 5 images chacun.
          </p>
        </div>
      </div>
    </Modal>
  )
}
