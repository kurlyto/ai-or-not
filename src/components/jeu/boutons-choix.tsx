import React from 'react'
import { ReponseUtilisateur } from '@/types'

interface BoutonsChoixProps {
  onReponse: (reponse: ReponseUtilisateur) => void
  isLoading?: boolean
  disabled?: boolean
}

export function BoutonsChoix({ onReponse, isLoading = false, disabled = false }: BoutonsChoixProps) {
  const bloque = isLoading || disabled

  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
      <button
        type="button"
        onClick={() => onReponse('ai')}
        disabled={bloque}
        className="group flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dark-border bg-dark-tertiary px-4 py-3 font-semibold text-white transition-all duration-150 hover:border-accent-purple hover:bg-accent-purple/10 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
      >
        <span className="text-2xl transition-transform group-hover:scale-110" aria-hidden>
          🤖
        </span>
        <span>Generee par IA</span>
      </button>

      <button
        type="button"
        onClick={() => onReponse('not_ai')}
        disabled={bloque}
        className="group flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dark-border bg-dark-tertiary px-4 py-3 font-semibold text-white transition-all duration-150 hover:border-accent-green hover:bg-accent-green/10 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
      >
        <span className="text-2xl transition-transform group-hover:scale-110" aria-hidden>
          📷
        </span>
        <span>Image reelle</span>
      </button>
    </div>
  )
}
