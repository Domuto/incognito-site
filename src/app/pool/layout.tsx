import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pool Table Game',
  description:
    "Play the Incognito pool table game — a hidden interactive experience from Atlanta's secret speakeasy and craft cocktail bar.",
  alternates: { canonical: '/pool' },
  openGraph: {
    title: 'Pool Table Game | Incognito Atlanta',
    description:
      "Play the interactive pool table game from Incognito, Atlanta's hidden speakeasy.",
    url: '/pool',
    type: 'website',
  },
}

export default function PoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="sr-only">
        <h1>Incognito Pool Table Game</h1>
        <p>
          Rack up and play the interactive pool table game from Incognito, a
          hidden speakeasy and craft cocktail bar in Atlanta, GA — a little
          after-hours fun from our secret bar.
        </p>
        <h2>Interactive game from a hidden Atlanta bar</h2>
      </section>
      {children}
    </>
  )
}
