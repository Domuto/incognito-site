import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Reservations',
  description:
    "Contact Incognito and request a reservation at our hidden speakeasy and craft cocktail bar in Atlanta. Book private events, bookings, and inquiries.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact & Reservations | Incognito Atlanta',
    description:
      "Request a reservation or private event at Incognito, Atlanta's hidden speakeasy and craft cocktail bar.",
    url: '/contact',
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section className="sr-only">
        <h1>Contact &amp; Reservations at Incognito Atlanta</h1>
        <p>
          Get in touch with Incognito, a hidden speakeasy and craft cocktail bar
          in Atlanta, GA. Request a reservation, plan a private event, or send a
          booking inquiry for a night at our secret bar.
        </p>
        <h2>Reservations, private events &amp; bookings in Atlanta</h2>
      </section>
      {children}
    </>
  )
}
