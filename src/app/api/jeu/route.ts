import { NextRequest, NextResponse } from 'next/server'
import { genererPartieDuJour } from '@/lib/jeu/selection-images'
import { obtenirDateJeu } from '@/lib/jeu/gestion-date'
import { ModeJeu } from '@/types'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') as ModeJeu
    const dateParam = searchParams.get('date')

    if (!mode || !['realistic', 'painting'].includes(mode)) {
      return NextResponse.json({ success: false, error: 'Mode invalide' }, { status: 400 })
    }

    if (dateParam && !DATE_REGEX.test(dateParam)) {
      return NextResponse.json({ success: false, error: 'Date invalide' }, { status: 400 })
    }

    const dateJeu = dateParam || obtenirDateJeu()

    // Interdit de jouer une date future (contournerait le reset quotidien)
    if (dateJeu > obtenirDateJeu()) {
      return NextResponse.json({ success: false, error: 'Date invalide' }, { status: 400 })
    }

    const images = await genererPartieDuJour(dateJeu, mode)

    return NextResponse.json({
      success: true,
      data: {
        images,
        mode,
        date_jeu: dateJeu,
        nombre_images: images.length,
      },
    })
  } catch (error) {
    console.error('Erreur dans l\'API jeu:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
