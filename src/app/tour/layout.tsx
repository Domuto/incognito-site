import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtual Tour',
  description:
    "Take an interactive 3D virtual tour of Incognito, a hidden speakeasy and craft cocktail bar in Atlanta. Explore the space before you visit.",
  alternates: { canonical: '/tour' },
  openGraph: {
    title: 'Virtual Tour | Incognito Atlanta',
    description:
      "Explore a 3D virtual tour of Incognito, Atlanta's hidden speakeasy and cocktail bar.",
    url: '/tour',
    type: 'website',
  },
}

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="sr-only">
        <h1>Virtual Tour of Incognito, a Hidden Atlanta Speakeasy</h1>
        <p>
          Take an interactive 3D virtual tour of Incognito, a hidden cocktail
          bar and speakeasy in Atlanta, GA. Walk through the space and preview
          the after-dark atmosphere before you find the secret entrance.
        </p>
        <h2>Explore the space in 3D</h2>
      </section>
      {children}
    </>
  )
}
