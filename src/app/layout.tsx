import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AI or Not - Le jeu quotidien de detection IA',
  description:
    'Saurez-vous distinguer une image reelle d\'une image generee par IA ? 5 images par jour, 2 modes : Realiste et Peinture.',
  applicationName: 'AI or Not',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'AI or Not',
    description: "Le jeu quotidien pour tester votre oeil face a l'IA generative.",
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
    <html lang="fr" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
