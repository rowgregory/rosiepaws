import type { Metadata } from 'next'
import { Barlow_Condensed, Merriweather, Satisfy, Sora } from 'next/font/google'
import './globals.css'
import ReduxWrapper from './redux-wrapper'
import { auth } from './lib/auth'
import { SessionProvider } from 'next-auth/react'

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const satisfy = Satisfy({
  variable: '--font-satisfy',
  subsets: ['latin'],
  weight: ['400']
})

const merrieweather = Merriweather({
  variable: '--font-merrieweather',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900']
})

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'Rosie Paws',
  description:
    'Rosie Paws is an app designed to help pet owners track important end of life care stats for their dogs and cats, like meals, medications, mood, and mobility. Share updates directly with your vet, stay organized, and feel supported during a difficult time'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${satisfy.variable} ${merrieweather.variable} ${sora.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ReduxWrapper session={session}>{children}</ReduxWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
