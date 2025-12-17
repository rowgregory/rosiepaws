import { ReactNode } from 'react'
import './globals.css'
import { auth } from './lib/auth'
import { SessionProvider } from 'next-auth/react'
import ReduxWrapper from './redux-wrapper'
import PageWrapper from './page-wrapper'
import { StructredData } from './structured-data'
import { Inter } from 'next/font/google'
import { siteMetadata } from './metadata'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: false
})

export const metadata = siteMetadata

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <head>
        <meta property="fb:app_id" content="710396524777703" />
        <meta name="google-site-verification" content="q2armsY2LxpjTDARnN0pd15N-qNcnfzJQFHYd2WUf70" />
        <StructredData />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider session={session}>
          <ReduxWrapper>
            <PageWrapper>{children}</PageWrapper>
          </ReduxWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
