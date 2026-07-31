import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-primary text-white">
      <div className="space-y-5 text-center px-4">
        <h1 className="font-heading text-6xl font-bold text-accent-blue">404</h1>
        <h2 className="font-heading text-2xl font-semibold text-white">Page introuvable</h2>
        <p className="max-w-md text-gray-400">Désolé, cette page n&apos;existe pas.</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-accent-blue px-6 py-3 font-semibold text-white shadow-glow transition-colors hover:bg-[#3d68f0]"
        >
          Retour au jeu
        </Link>
      </div>
    </div>
  )
}
