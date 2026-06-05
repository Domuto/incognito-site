'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [secretButtonShown, setSecretButtonShown] = useState(true)

  useEffect(() => {
    // Randomly show/hide the secret button with glitchy animations
    const showButton = () => {
      setSecretButtonShown(Math.random() > 0.4)
    }
    
    const interval = setInterval(showButton, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSecretClick = () => {
    alert('🤫')
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        .page-shell {
          position: fixed;
          inset: 0;
          background: url('/ABOUTPAGE.jpeg') center/cover no-repeat;
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
          background: rgba(0, 0, 0, 0.2);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .page-shell {
            background: url('/mobileabout.jpeg') center/cover no-repeat;
          }
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
        }
        .back-btn:hover { color: rgba(245,240,232,1); }
        .secret-btn {
          position: fixed;
          top: 28px;
          right: 28px;
          z-index: 110;
          background: transparent;
          border: 1px solid rgba(245,240,232,0.6);
          padding: 8px 12px;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(245,240,232,0.6);
          text-transform: uppercase;
          transition: all 0.1s ease;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          animation: glitch-hide 0.3s ease-out;
        }
        .secret-btn.shown {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          animation: glitch-show 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
          font-family: 'Bebas Neue', sans-serif;
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
      `}</style>
      <div className="page-shell">
        <Link href="/" className="back-btn">← BACK</Link>
        <button
          className={`secret-btn${secretButtonShown ? ' shown' : ''}`}
          onClick={handleSecretClick}
          aria-hidden={!secretButtonShown}
        >
          ••••••
        </button>
        <h1 className="page-title" style={{ display: 'none' }}>THE ALIBI</h1>
      </div>
    </>
  )
}
