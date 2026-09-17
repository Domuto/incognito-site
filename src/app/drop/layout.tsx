import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Drop',
  description:
    "The Drop from Incognito — exclusive releases and hidden surprises from Atlanta's secret speakeasy and craft cocktail bar.",
  alternates: { canonical: '/drop' },
  openGraph: {
    title: 'The Drop | Incognito Atlanta',
    description:
      "Exclusive releases and hidden surprises from Incognito, Atlanta's secret speakeasy.",
    url: '/drop',
    type: 'website',
  },
}

export default function DropLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="sr-only">
        <h1>The Drop — Exclusive Releases from Incognito Atlanta</h1>
        <p>
          The Drop is where Incognito, a hidden speakeasy and craft cocktail bar
          in Atlanta, shares exclusive releases and hidden surprises for those
          who know where to look.
        </p>
        <h2>Hidden surprises from a secret Atlanta bar</h2>
      </section>
      {children}
    </>
  )
}
