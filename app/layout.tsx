import type { Metadata } from 'next'
import { Barlow_Condensed, Merriweather, Satisfy } from 'next/font/google'
import './globals.css'
import ReduxWrapper from './redux-wrapper'

// import { getUserFromServerCookie } from './lib/auth-helpers'

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
  // let user
  // try {
  //   user = await getUserFromServerCookie()
  // } catch (error) {
  //   console.error('ERROR: ', error)
  // }

  return (
    <html lang="en">
      <body className={`${barlowCondensed.variable} ${satisfy.variable} ${merrieweather.variable} antialiased`}>
        <ReduxWrapper>{children}</ReduxWrapper>
      </body>
    </html>
  )
}
