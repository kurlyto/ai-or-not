import { NextRequest, NextResponse } from 'next/server'
import { genererPartieDuJour } from '@/lib/jeu/selection-images'
import { obtenirDateJeu } from '@/lib/jeu/gestion-date'
import { obtenirThemeDuJour } from '@/lib/jeu/serie-du-jour'
import { ModeJeu } from '@/types'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MODES_VALIDES = ['realistic', 'painting', 'portrait', 'nature', 'architecture']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modeParam = searchParams.get('mode')
    const dateParam = searchParams.get('date')

    if (!modeParam || (modeParam !== 'serie' && !MODES_VALIDES.includes(modeParam))) {
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

    // 'serie' est resolu cote serveur vers le theme du jour : le client ne
    // connait jamais le theme a l'avance, seulement apres l'appel.
    const mode: ModeJeu = modeParam === 'serie' ? obtenirThemeDuJour(dateJeu) : (modeParam as ModeJeu)

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
