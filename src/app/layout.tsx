import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
        >
          <div className="mx-auto flex h-full flex-col overflow-x-hidden bg-background">
            <div className="fixed inset-x-0 top-0 z-20 px-9 pt-9">
              <Header />
            </div>
            <LayoutWrapper>{children}</LayoutWrapper>
          </div>
          <Toaster />
        </body>
      </Providers>
    </html>
  )
}
