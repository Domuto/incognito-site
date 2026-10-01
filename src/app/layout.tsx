import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const SITE_URL = 'https://www.incognito404.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Incognito | Hidden Cocktail Bar & Speakeasy in Atlanta',
    template: '%s | Incognito Atlanta',
  },
  description:
    "Incognito is a hidden speakeasy and craft cocktail bar in Atlanta — secret entrance, seasonal cocktails, and an intimate after-dark atmosphere. You weren't supposed to find this.",
  applicationName: 'Incognito',
  keywords: [
    'Incognito',
    'Incognito Atlanta',
    'Incognito ATL',
    'speakeasy Atlanta',
    'hidden bar Atlanta',
    'secret bar Atlanta',
    'cocktail bar Atlanta',
    'craft cocktails Atlanta',
    'private bar Atlanta',
    'Atlanta nightlife',
    'Atlanta lounge',
    'Botanico Hospitality',
  ],
  authors: [{ name: 'Incognito' }],
  creator: 'Incognito',
  publisher: 'Incognito',
  category: 'Bar',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Incognito | Hidden Cocktail Bar & Speakeasy in Atlanta',
    description:
      "A hidden speakeasy and craft cocktail bar in Atlanta. You weren't supposed to find this.",
    url: SITE_URL,
    siteName: 'Incognito',
    locale: 'en_US',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Incognito — Hidden Cocktail Bar & Speakeasy in Atlanta',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Incognito | Hidden Cocktail Bar & Speakeasy in Atlanta',
    description:
      "A hidden speakeasy and craft cocktail bar in Atlanta. You weren't supposed to find this.",
    images: ['/logo.png'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'BarOrPub',
  '@id': `${SITE_URL}/#incognito`,
  name: 'Incognito',
  alternateName: 'Incognito ATL',
  description:
    'Hidden speakeasy and craft cocktail bar in Atlanta with a secret entrance, seasonal cocktails, and an intimate after-dark atmosphere.',
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  logo: `${SITE_URL}/logo.png`,
  servesCuisine: 'Cocktails',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Atlanta',
    addressRegion: 'GA',
    addressCountry: 'US',
  },
  sameAs: ['https://www.instagram.com/bar_incognitoatl/'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Script
          id="klaviyo-onsite"
          strategy="afterInteractive"
          src="https://static.klaviyo.com/onsite/js/WQTE5K/klaviyo.js?company_id=WQTE5K"
        />
        <Script id="klaviyo-init" strategy="afterInteractive">
          {`!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`}
        </Script>
      </body>
    </html>
  )
}
