'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

export default function MenuPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [nextPageTarget, setNextPageTarget] = useState<number | null>(null)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')
  const [isFlipping, setIsFlipping] = useState(false)
  const touchStartX = useRef(0)
  const touchStartTime = useRef(0)
  const totalPages = 14
  const currentImageUrl = `/incog_page-${String(currentPage).padStart(2, '0')}.png`
  const incomingImageUrl = nextPageTarget
    ? `/incog_page-${String(nextPageTarget).padStart(2, '0')}.png`
    : ''

  const triggerFlip = (target: number, direction: 'next' | 'prev') => {
    if (isFlipping || target === currentPage) return

    setFlipDirection(direction)
    setNextPageTarget(target)
    setIsFlipping(true)

    window.setTimeout(() => {
      setCurrentPage(target)
      setNextPageTarget(null)
      setIsFlipping(false)
    }, 420)
  }

  const nextPage = () => {
    if (currentPage < totalPages) triggerFlip(currentPage + 1, 'next')
  }

  const prevPage = () => {
    if (currentPage > 1) triggerFlip(currentPage - 1, 'prev')
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchDuration = Date.now() - touchStartTime.current
    const swipeDistance = touchStartX.current - touchEndX
    const minSwipeDistance = 50
    const maxSwipeDuration = 1000

    if (Math.abs(swipeDistance) > minSwipeDistance && touchDuration < maxSwipeDuration) {
      if (swipeDistance > 0) {
        // Swiped left - next page
        nextPage()
      } else {
        // Swiped right - previous page
        prevPage()
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
    touchStartTime.current = Date.now()
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const touchEndX = e.clientX
    const touchDuration = Date.now() - touchStartTime.current
    const swipeDistance = touchStartX.current - touchEndX
    const minSwipeDistance = 50
    const maxSwipeDuration = 1000

    if (Math.abs(swipeDistance) > minSwipeDistance && touchDuration < maxSwipeDuration) {
      if (swipeDistance > 0) {
        // Swiped left - next page
        nextPage()
      } else {
        // Swiped right - previous page
        prevPage()
      }
    }
  }

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
          gap: 14px;
          padding: 64px 10px 14px;
          overflow-y: auto;
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
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
          gap: 12px;
          align-items: center;
          width: min(96vw, 1050px);
          max-width: 1050px;
          padding: 0 8px;
        }

        .flipbook-viewer {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 1050px;
          max-height: calc(100dvh - 170px);
          background: transparent;
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          perspective: 1200px;
          cursor: grab;
          user-select: none;
          touch-action: pan-y;
        }

        .flipbook-viewer:active {
          cursor: grabbing;
        }

        .flipbook-page-stack {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
        }

        .flipbook-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          backface-visibility: hidden;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .flipbook-image.current,
        .flipbook-image.incoming {
          background: transparent;
        }

        .flipbook-image.current {
          z-index: 2;
        }

        .flipbook-image.incoming {
          z-index: 1;
        }

        .flipbook-viewer.flipping-next .flipbook-image.current {
          animation: page-flip-out-next 0.42s ease-in-out forwards;
        }

        .flipbook-viewer.flipping-next .flipbook-image.incoming {
          animation: page-flip-in-next 0.42s ease-in-out forwards;
        }

        .flipbook-viewer.flipping-prev .flipbook-image.current {
          animation: page-flip-out-prev 0.42s ease-in-out forwards;
        }

        .flipbook-viewer.flipping-prev .flipbook-image.incoming {
          animation: page-flip-in-prev 0.42s ease-in-out forwards;
        }

        @keyframes page-flip-out-next {
          0% { transform: rotateY(0deg) scale(1); opacity: 1; }
          100% { transform: rotateY(-75deg) scale(0.98); opacity: 0.05; }
        }

        @keyframes page-flip-in-next {
          0% { transform: rotateY(75deg) scale(0.98); opacity: 0.05; }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; }
        }

        @keyframes page-flip-out-prev {
          0% { transform: rotateY(0deg) scale(1); opacity: 1; }
          100% { transform: rotateY(75deg) scale(0.98); opacity: 0.05; }
        }

        @keyframes page-flip-in-prev {
          0% { transform: rotateY(-75deg) scale(0.98); opacity: 0.05; }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; }
        }

        .flipbook-controls {
          display: none;
        }

        .swipe-hint {
          display: none;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 240, 232, 0.5);
          text-align: center;
          letter-spacing: 0.05em;
        }

        .mobile-swipe-hint {
          display: none;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 240, 232, 0.5);
          text-align: center;
          letter-spacing: 0.05em;
        }

        .page-counter {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 240, 232, 0.6);
          min-width: 100px;
          text-align: center;
        }

        .pdf-btn {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(245, 240, 232, 0.7);
          background: rgba(245, 240, 232, 0.1);
          border: 1px solid rgba(245, 240, 232, 0.4);
          padding: 8px 16px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          border-radius: 2px;
          display: inline-block;
        }

        .pdf-btn:hover {
          background: rgba(245, 240, 232, 0.15);
          border-color: rgba(245, 240, 232, 0.7);
          color: rgba(245, 240, 232, 1);
        }

        .pdf-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .page-shell {
            justify-content: flex-start;
            gap: 12px;
            padding: 58px 6px 8px;
          }

          .back-btn {
            top: 16px;
            left: 14px;
            font-size: 12px;
          }

          .flipbook-viewer {
            width: 100%;
            max-width: calc(100vw - 12px);
            max-height: calc(100dvh - 150px);
          }

          .page-counter {
            display: none;
          }

          .swipe-hint {
            display: none;
          }

          .mobile-swipe-hint {
            display: block;
            font-size: 11px;
            letter-spacing: 0.08em;
            opacity: 0.9;
          }

          .pdf-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 10px;
            padding: 6px 12px;
          }
        }
      `}</style>
      <div className="page-shell">
        <Link href="/" className="back-btn">← BACK</Link>
        <div className="flipbook-container">
          <div 
            className={`flipbook-viewer${isFlipping ? ` flipping-${flipDirection}` : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <div className="flipbook-page-stack">
              <img
                src={currentImageUrl}
                className="flipbook-image current"
                alt={`Incognito Menu Page ${currentPage}`}
                draggable={false}
              />
              {isFlipping && nextPageTarget && (
                <img
                  src={incomingImageUrl}
                  className="flipbook-image incoming"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
              )}
            </div>
          </div>
          <div className="page-counter">Page {currentPage} / {totalPages}</div>
          <div className="swipe-hint">← SWIPE TO TURN PAGES →</div>
          <div className="mobile-swipe-hint">Swipe left or right to turn pages</div>
          <a href="/INCOG MENU WEB.pdf" target="_blank" rel="noopener noreferrer" className="pdf-btn">
            📄 VIEW MENU PDF
          </a>
        </div>
      </div>
    </>
  )
}
