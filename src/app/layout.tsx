import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Incognito',
  description: 'You weren\'t supposed to find this.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Incognito',
    description: 'You weren\'t supposed to find this.',
    images: [
      {
        url: '/logo.png',
        width: 400,
        height: 150,
        alt: 'Incognito',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Incognito',
    description: 'You weren\'t supposed to find this.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
