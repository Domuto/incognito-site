import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Files — Cocktail & Drink Menu',
  description:
    "Browse The Files, Incognito's craft cocktail and drink menu — seasonal cocktails, spirits, and signature pours at our hidden speakeasy in Atlanta.",
  alternates: { canonical: '/menu' },
  openGraph: {
    title: 'The Files — Cocktail & Drink Menu | Incognito Atlanta',
    description:
      "Incognito's craft cocktail and drink menu — seasonal cocktails and signature pours at our hidden Atlanta speakeasy.",
    url: '/menu',
    type: 'website',
  },
}

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="sr-only">
        <h1>The Files — Incognito Cocktail &amp; Drink Menu</h1>
        <p>
          Explore the menu at Incognito, a hidden cocktail bar and speakeasy in
          Atlanta. The Files feature seasonal craft cocktails, curated spirits,
          and signature pours served in an intimate after-dark setting.
        </p>
        <h2>Craft cocktails &amp; drinks in Atlanta</h2>
      </section>
      {children}
    </>
  )
}
