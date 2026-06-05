import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  ),
  title: 'Incognito',
  description: "You weren't supposed to find this.",
  openGraph: {
    title: 'Incognito',
    description: "You weren't supposed to find this.",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Incognito',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Incognito',
    description: "You weren't supposed to find this.",
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
