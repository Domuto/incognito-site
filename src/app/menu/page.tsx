'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MenuPage() {
  const [currentPage, setCurrentPage] = useState(1)

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
          gap: 40px;
          padding: 80px 20px 20px;
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
          gap: 30px;
          align-items: center;
          width: 100%;
        }
        @keyframes glitch-show {
          0% {
            opacity: 0;
            transform: translate(2px, -2px);
            clip-path: inset(0 50% 0 0);
          }
          20% {
            clip-path: inset(0 30% 0 0);
          }
          40% {
            opacity: 1;
            transform: translate(-1px, 1px);
            clip-path: inset(0 0 0 0);
          }
          60% {
            transform: translate(1px, -1px);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0);
            clip-path: inset(0 0 0 0);
          }
        }
        @keyframes glitch-hide {
          0% {
            opacity: 1;
            transform: translate(0, 0);
          }
          50% {
            opacity: 0.3;
            transform: translate(-2px, 2px);
          }
          100% {
            opacity: 0;
            visibility: hidden;
            transform: translate(1px, -1px);
          }
        }
        .secret-btn:hover {
          border-color: rgba(245,240,232,1);
          color: rgba(245,240,232,1);
          box-shadow: 0 0 8px rgba(245,240,232,0.3);
        }
        .page-title {
          font-size: clamp(48px, 10vw, 96px);
          color: #f5f0e8;
          letter-spacing: 0.08em;
        }
        .page-note {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.15em;
          color: rgba(245,240,232,0.35);
          text-transform: uppercase;
        }
        .flipbook-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          width: 100%;
          height: 100%;
          max-width: 800px;
          max-height: 600px;
        }
        .flipbook-viewer {
          position: relative;
          width: 100%;
          max-width: 700px;
          aspect-ratio: 16/9;
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
        }
        .flipbook-controls {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: center;
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
        .flip-btn:hover {
          background: rgba(245, 240, 232, 0.3);
          border-color: rgba(245, 240, 232, 1);
          color: rgba(245, 240, 232, 1);
        }
        .page-counter {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 240, 232, 0.6);
          min-width: 100px;
          text-align: center;
        }
      `}</style>
      <div className="page-shell">
        <Link href="/" className="back-btn">← BACK</Link>
        <div className="flipbook-container">
          <div className="flipbook-viewer">
            <iframe
              src={`/INCOG MENU WEB.pdf#page=${currentPage}`}
              className="flipbook-pdf"
              title="Incognito Menu"
            />
          </div>
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
