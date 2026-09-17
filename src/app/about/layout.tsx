import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Alibi — About Incognito',
  description:
    "The Alibi: the story behind Incognito, a hidden speakeasy and craft cocktail bar in Atlanta with a secret entrance and an intimate after-dark atmosphere.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'The Alibi — About Incognito | Incognito Atlanta',
    description:
      "The story behind Incognito, Atlanta's hidden speakeasy and craft cocktail bar.",
    url: '/about',
    type: 'website',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="sr-only">
        <h1>The Alibi — About Incognito, a Hidden Atlanta Speakeasy</h1>
        <p>
          Incognito is a hidden speakeasy and craft cocktail bar in Atlanta, GA.
          Behind a secret entrance you&apos;ll find seasonal cocktails, warm
          low-lit interiors, and an intimate after-dark atmosphere built for
          nights you weren&apos;t supposed to find.
        </p>
        <h2>Our story &amp; the Atlanta speakeasy experience</h2>
      </section>
      {children}
    </>
  )
}
