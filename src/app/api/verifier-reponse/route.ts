import { NextRequest, NextResponse } from 'next/server'
import { trouverImageParId } from '@/lib/jeu/selection-images'
import { obtenirDateJeu } from '@/lib/jeu/gestion-date'
import { ModeJeu } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image_id, reponse, mode, date_jeu } = body

    if (!image_id || typeof image_id !== 'string') {
      return NextResponse.json({ success: false, error: 'ID d\'image manquant' }, { status: 400 })
    }

    if (!reponse || !['ai', 'not_ai'].includes(reponse)) {
      return NextResponse.json({ success: false, error: 'Réponse invalide' }, { status: 400 })
    }

    if (!mode || !['realistic', 'painting'].includes(mode)) {
      return NextResponse.json({ success: false, error: 'Mode invalide' }, { status: 400 })
    }

    const dateJeu: string = date_jeu || obtenirDateJeu()
    const image = trouverImageParId(dateJeu, mode as ModeJeu, image_id)

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image introuvable pour cette partie' }, { status: 404 })
    }

    const estCorrecte = (image.est_ia && reponse === 'ai') || (!image.est_ia && reponse === 'not_ai')

    return NextResponse.json({
      success: true,
      data: {
        image_id,
        reponse,
        est_correcte: estCorrecte,
        reponse_correcte: image.est_ia ? 'ai' : 'not_ai',
      },
    })
  } catch (error) {
    console.error('Erreur dans l\'API vérification:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
