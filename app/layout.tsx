import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxWrapper from './redux-wrapper'
import { auth } from './lib/auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

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
  metadataBase: new URL('https://www.rosiepawsapp.com'),
  title: 'Rosie Paws',
  description:
    'Rosie Paws is a compassionate app that helps disabled and end-of-life dog and cat owners track essential health stats like pain, water, movement, blood sugar, seizures, and more.',
  keywords: [
    // Primary keywords
    'dog app',
    'pet app',
    'animal care app',
    'dog health app',
    'cat health app',
    'pet care app',
    'pet health tracker',
    'veterinary app',

    // Feature-based keywords
    'track pet health',
    'pet medication tracker',
    'dog medication reminder',
    'pet symptom tracker',
    'pet health journal',
    'pet medical records app',
    'pet health log',
    'dog health monitor',
    'cat health monitor',

    // Condition-specific
    'dog seizure tracker',
    'cat seizure tracker',
    'pet diabetes tracker',
    'dog blood sugar monitor',
    'pet pain management app',
    'arthritis in dogs app',
    'senior dog care app',
    'elderly cat care',

    // Care-focused
    'end-of-life pet care',
    'hospice care for pets',
    'palliative care for dogs',
    'quality of life tracking',
    'disabled pet care',
    'special needs pets',
    'chronic illness pets',

    // Monitoring keywords
    'pet vital signs',
    'pet wellness app',
    'dog health records',
    'cat health records',
    'pet care management',
    'animal health tracking',
    'pet monitoring app',

    // User-focused
    'pet owner app',
    'dog owner app',
    'cat owner app',
    'pet parent app',
    'veterinary recommended app',

    // Original keywords
    'Rosie Paws',
    'pain scoring for pets',
    'pet water intake monitoring',
    'pet movement tracking',
    'compassionate pet care',
    'pet health management',
    'support for senior pets'
  ],
  openGraph: {
    title: 'Rosie Paws',
    description:
      'Rosie Paws helps disabled and end-of-life dog and cat owners track vital health stats — from pain and movement to blood sugar and seizures — with care and compassion.',
    url: 'https://www.rosiepawsapp.com',
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
    canonical: 'https://www.rosiepawsapp.com'
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'application-name': 'Rosie Paws Pet Health Tracker'
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Rosie Paws',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '500'
    },
    description: 'Pet health tracking app for dogs and cats. Monitor medications, pain, seizures, and vital signs.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rosie-paws.firebasestorage.app/o/images%2Frosie-rich-preview.png',
    url: 'https://www.rosiepawsapp.com'
  }
  const session = await auth()
  return (
    <html lang="en">
      <head>
        <meta property="fb:app_id" content="710396524777703" />
        <meta name="google-site-verification" content="q2armsY2LxpjTDARnN0pd15N-qNcnfzJQFHYd2WUf70" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider session={session}>
          <ReduxWrapper>{children}</ReduxWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
