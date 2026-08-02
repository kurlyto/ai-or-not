import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Chakra_Petch, Manrope, Sora } from 'next/font/google'
import { FondAnime } from '@/components/ui/fond-anime'
import '../styles/globals.css'

const chakraPetch = Chakra_Petch({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-heading' })
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' })
const sora = Sora({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-button' })

export const metadata: Metadata = {
  title: 'AI or Not - Le jeu quotidien de détection IA',
  description:
    "Saurez-vous distinguer une image réelle d'une image générée par IA ? 5 images par jour, 2 modes : Réaliste et Peinture.",
  applicationName: 'AI or Not',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'AI or Not',
    description: "Le jeu quotidien pour tester votre œil face à l'IA générative.",
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${chakraPetch.variable} ${manrope.variable} ${sora.variable}`}>
      <body className="font-sans">
        <FondAnime />
        <div className="relative z-10">{children}</div>
        {/* Umami (self-hosted). data-domains limite la collecte au domaine de
            prod : le dev en localhost ne pollue pas les stats. */}
        <Script
          strategy="afterInteractive"
          src="https://analytics.mondevisdentaire.fr/script.js"
          data-website-id="6d0c31c9-83bf-4079-9bc0-373a79441a81"
          data-domains="ai-or-not.nathan-knaebel.com"
        />
      </body>
    </html>
  )
}
