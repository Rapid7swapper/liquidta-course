import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Liquida Capital | Training Academy',
  description: 'Exclusive professional training for Liquida Capital team members. Master the skills you need to excel with our comprehensive certification program.',
  keywords: ['Liquida Capital', 'training', 'certification', 'professional development', 'CRM', 'sales training'],
  authors: [{ name: 'Liquida Capital' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL('https://liquidta-course-larrys-projects-4d5a0128.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Liquida Capital Training Academy',
    title: 'Liquida Capital | Training Academy',
    description: 'Exclusive professional training for Liquida Capital team members. Master the skills you need to excel with our comprehensive certification program.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liquida Capital | Training Academy',
    description: 'Exclusive professional training for Liquida Capital team members.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
