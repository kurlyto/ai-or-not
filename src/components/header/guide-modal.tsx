import React from 'react'
import { Modal } from '@/components/ui/modal'

interface GuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const TECHNIQUES = [
  {
    emoji: '💡',
    titre: 'Lumiere et ombres',
    texte: 'Verifiez la coherence des ombres : viennent-elles toutes de la meme source de lumiere ?',
  },
  {
    emoji: '✋',
    titre: 'Mains et details',
    texte: "Les mains, doigts et oreilles restent des points faibles frequents pour l'IA.",
  },
  {
    emoji: '🔁',
    titre: 'Repetitions',
    texte: 'Motifs, textures ou objets qui se dupliquent de facon suspecte en arriere-plan.',
  },
  {
    emoji: '📐',
    titre: 'Proportions',
    texte: 'Perspective bizarre, objets deformes ou proportions anatomiques incorrectes.',
  },
  {
    emoji: '🔤',
    titre: 'Texte illisible',
    texte: "Un texte flou, incoherent ou impossible a lire est un indice tres fiable.",
  },
  {
    emoji: '✨',
    titre: 'Rendu trop lisse',
    texte: 'Une texture de peau ou de matiere trop parfaite, presque cireuse, trahit souvent une IA.',
  },
]

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comment jouer">
      <div className="space-y-7">
        <div className="space-y-2 text-sm text-gray-300">
          <p>5 images vous sont presentees. Pour chacune, devinez si elle a ete generee par IA ou si elle est reelle.</p>
          <p>Une partie par mode et par jour. Nouvelle partie chaque jour a minuit (heure de Paris).</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Comment reperer une image IA
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TECHNIQUES.map((t) => (
              <div key={t.titre} className="rounded-xl border border-dark-border bg-dark-tertiary p-3.5">
                <div className="mb-1 flex items-center gap-2">
                  <span aria-hidden>{t.emoji}</span>
                  <span className="text-sm font-medium text-white">{t.titre}</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-400">{t.texte}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-accent-yellow/20 bg-accent-yellow/5 p-3.5">
          <p className="text-xs leading-relaxed text-accent-yellow/90">
            ⚠️ Les modeles d&apos;IA s&apos;ameliorent tres vite : ces indices ne sont pas infaillibles. Gardez toujours
            un esprit critique face au contenu que vous voyez en ligne.
          </p>
        </div>
      </div>
    </Modal>
  )
}
