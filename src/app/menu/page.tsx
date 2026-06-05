'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MenuPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const menuPdfUrl = '/INCOG%20MENU%20WEB.pdf'

  const nextPage = () => setCurrentPage(p => p + 1)
  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .page-shell {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          padding: 84px 16px 24px;
          overflow-y: auto;
        }

        .page-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.8;
          pointer-events: none;
          z-index: 0;
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

        .flipbook-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          width: 100%;
          max-width: 920px;
        }

        .flipbook-viewer {
          position: relative;
          width: 100%;
          max-width: 860px;
          height: min(70vh, 700px);
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(245, 240, 232, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }

        .flipbook-pdf {
          width: 100%;
          height: 100%;
          border: 0;
        }

        .flipbook-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .flip-btn {
          background: rgba(245, 240, 232, 0.2);
          border: 1px solid rgba(245, 240, 232, 0.5);
          color: rgba(245, 240, 232, 0.8);
          padding: 10px 20px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .flip-btn:hover:not(:disabled) {
          background: rgba(245, 240, 232, 0.3);
          border-color: rgba(245, 240, 232, 1);
          color: rgba(245, 240, 232, 1);
        }

        .flip-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .page-counter {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 240, 232, 0.6);
          min-width: 100px;
          text-align: center;
        }

        .mobile-open {
          display: none;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.85);
          text-decoration: none;
          border: 1px solid rgba(245,240,232,0.5);
          padding: 10px 14px;
        }

        @media (max-width: 768px) {
          .page-shell {
            justify-content: flex-start;
            gap: 14px;
            padding: 76px 12px 16px;
          }

          .back-btn {
            top: 18px;
            left: 16px;
            font-size: 12px;
          }

          .flipbook-viewer {
            height: 56vh;
            min-height: 340px;
          }

          .mobile-open {
            display: inline-block;
          }
        }
      `}</style>
      <div className="page-shell">
        <Link href="/" className="back-btn">← BACK</Link>
        <div className="flipbook-container">
          <div className="flipbook-viewer">
            <iframe
              src={`${menuPdfUrl}#page=${currentPage}`}
              className="flipbook-pdf"
              title="Incognito Menu"
            />
          </div>
          <a className="mobile-open" href={`${menuPdfUrl}#page=${currentPage}`} target="_blank" rel="noreferrer">
            OPEN MENU
          </a>
          <div className="flipbook-controls">
            <button className="flip-btn" onClick={prevPage} disabled={currentPage === 1}>
              ← PREVIOUS
            </button>
            <div className="page-counter">Page {currentPage}</div>
            <button className="flip-btn" onClick={nextPage}>
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
