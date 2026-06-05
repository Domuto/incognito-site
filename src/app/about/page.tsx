'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AboutPage() {
  const [desktopLoaded, setDesktopLoaded] = useState(false)
  const [mobileLoaded, setMobileLoaded] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .page-shell {
          position: fixed;
          inset: 0;
          background: #1b1611;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          overflow: hidden;
        }

        .bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0;
          transition: opacity 0.24s ease-out;
          pointer-events: none;
        }

        .bg-image.loaded {
          opacity: 1;
        }

        .bg-image.mobile {
          display: none;
        }

        .page-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.08);
          pointer-events: none;
        }

        .page-shell > * {
          position: relative;
          z-index: 1;
        }

        .back-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          color: rgba(245,240,232,0.5);
          text-decoration: none;
          position: fixed;
          top: 28px;
          left: 28px;
          transition: color 0.2s;
          z-index: 100;
        }

        .back-btn:hover { color: rgba(245,240,232,1); }

        @media (max-width: 768px) {
          .bg-image.desktop {
            display: none;
          }

          .bg-image.mobile {
            display: block;
            object-position: center top;
          }

          .page-shell::before {
            background: rgba(0, 0, 0, 0.04);
          }

          .back-btn {
            top: 18px;
            left: 16px;
            font-size: 12px;
          }
        }
      `}</style>
      <div className="page-shell">
        <img
          src="/ABOUTPAGE.jpeg?v=3"
          alt=""
          aria-hidden="true"
          className={`bg-image desktop${desktopLoaded ? ' loaded' : ''}`}
          loading="eager"
          fetchPriority="high"
          onLoad={() => setDesktopLoaded(true)}
        />
        <img
          src="/mobileabout.jpeg?v=3"
          alt=""
          aria-hidden="true"
          className={`bg-image mobile${mobileLoaded ? ' loaded' : ''}`}
          loading="eager"
          fetchPriority="high"
          onLoad={() => setMobileLoaded(true)}
        />
        <Link href="/" className="back-btn">← BACK</Link>
      </div>
    </>
  )
}
