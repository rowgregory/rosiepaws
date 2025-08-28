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
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider session={session}>
          <ReduxWrapper>{children}</ReduxWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
