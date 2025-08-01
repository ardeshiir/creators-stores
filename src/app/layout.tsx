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
          className={`${geistSans.variable} ${geistMono.variable} h-screen w-screen overflow-x-hidden antialiased`}
        >
          <div className="mx-auto flex h-full min-h-screen flex-col gap-10 overflow-x-hidden  bg-background pt-9">
            <div className="px-9">
              <Header />
            </div>
            <div className="relative h-full">{children}</div>
          </div>
          <Toaster />
        </body>
      </Providers>
    </html>
  )
}
