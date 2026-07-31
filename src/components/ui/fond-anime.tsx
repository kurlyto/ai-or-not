'use client'

import { useEffect, useRef } from 'react'

// Fond radial qui suit la souris (desktop) en douceur, via variables CSS
// mises a jour dans une rAF pour rester fluide sans re-render React.
export function FondAnime() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return // pas d'effet utile au toucher

    let cible = { x: 50, y: 30 }
    let courant = { x: 50, y: 30 }
    let frame = 0

    const onMouseMove = (e: MouseEvent) => {
      cible = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 }
    }

    const anime = () => {
      courant.x += (cible.x - courant.x) * 0.06
      courant.y += (cible.y - courant.y) * 0.06
      ref.current?.style.setProperty('--mx', `${courant.x}%`)
      ref.current?.style.setProperty('--my', `${courant.y}%`)
      frame = requestAnimationFrame(anime)
    }

    window.addEventListener('mousemove', onMouseMove)
    frame = requestAnimationFrame(anime)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-0 fond-anime" aria-hidden />
}
