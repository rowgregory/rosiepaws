import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxWrapper from './redux-wrapper'
import { auth } from './lib/auth'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: false
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export const metadata: Metadata = {
  metadataBase: new URL('https://rosiepawsapp.com'),
  title: 'Rosie Paws',
  description:
    'Rosie Paws is a compassionate app that helps disabled and end-of-life dog and cat owners track essential health stats like pain, water, movement, blood sugar, seizures, and more.',
  keywords: [
    'Rosie Paws',
    'pet health tracking',
    'dog health app',
    'cat health app',
    'pain scoring for pets',
    'pet seizure tracking',
    'pet blood sugar tracking',
    'end-of-life pet care',
    'disabled pet care',
    'pet wellness monitoring',
    'pet care app',
    'track pet health stats',
    'pet comfort app',
    'compassionate pet care',
    'quality of life tracking',
    'pet health management',
    'dog seizure log',
    'cat seizure log',
    'pet movement tracking',
    'pet water intake monitoring',
    'pet pain management',
    'support for senior pets',
    'disabled pet support',
    'end-of-life care for pets'
  ],
  openGraph: {
    title: 'Rosie Paws',
    description:
      'Rosie Paws helps disabled and end-of-life dog and cat owners track vital health stats — from pain and movement to blood sugar and seizures — with care and compassion.',
    url: 'https://rosiepawsapp.com',
    siteName: 'Rosie Paws',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/rosie-paws.firebasestorage.app/o/images%2Frosie-rich-preview.png?alt=media&token=ecdab6f0-bef9-4ee2-8ffe-ad3da05226f1',
        width: 1200,
        height: 630,
        alt: 'Rosie Paws logo'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow'
  },
  applicationName: 'Rosie Paws',
  appleWebApp: {
    title: 'Rosie Paws',
    statusBarStyle: 'default',
    capable: true
  },
  alternates: {
    canonical: 'https://rosiepawsapp.com'
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes'
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <head>
        <meta property="fb:app_id" content="710396524777703" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider session={session}>
          <ReduxWrapper>{children}</ReduxWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
