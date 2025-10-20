import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import Header from '@/components/navigation/header'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Creators Class Stores Panel',
  description: 'Creators Class Stores Panel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
        >
          <div className="mx-auto flex h-full max-h-screen min-h-screen flex-col overflow-x-hidden bg-background">
            <div className="fixed inset-x-0 top-0 px-9 pt-9">
              <Header />
            </div>
            <div className="relative mt-[124px] h-screen max-h-screen overflow-y-hidden pt-[64px] md:mt-[98px]">
              <div className="max-h-full overflow-y-scroll">{children}</div>
            </div>
          </div>
          <Toaster />
        </body>
      </Providers>
    </html>
  )
}
