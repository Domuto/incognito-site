'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .page-shell {
          position: fixed;
          inset: 0;
          background: #0e0e0e url('/ABOUTPAGE.jpeg?v=2') center/cover no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
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
          .page-shell {
            background: #0e0e0e url('/mobileabout.jpeg?v=2') center top/cover no-repeat;
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
        <Link href="/" className="back-btn">← BACK</Link>
      </div>
    </>
  )
}
