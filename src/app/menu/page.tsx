'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '') || ''

export default function MenuPage() {
  const [isCoverView, setIsCoverView] = useState(true)
  const [isOpeningCover, setIsOpeningCover] = useState(false)
  const [currentSpreadStart, setCurrentSpreadStart] = useState(2)
  const [nextSpreadTarget, setNextSpreadTarget] = useState<number | null>(null)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')
  const [isFlipping, setIsFlipping] = useState(false)
  const touchStartX = useRef(0)
  const touchStartTime = useRef(0)
  const totalPages = 18
  const getLocalPageImageUrl = (pageNumber: number) =>
    `/incog_page-${String(pageNumber).padStart(2, '0')}.webp`
  const getPageImageUrl = (pageNumber: number, useLocal = false) => {
    const localPath = getLocalPageImageUrl(pageNumber)
    if (useLocal || !MEDIA_BASE_URL) return localPath
    return `${MEDIA_BASE_URL}${localPath}`
  }

  const handlePageImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    pageNumber: number
  ) => {
    const img = e.currentTarget
    if (img.dataset.fallbackApplied === 'true') return
    img.dataset.fallbackApplied = 'true'
    img.src = getPageImageUrl(pageNumber, true)
  }

  useEffect(() => {
    // Preload the first visible spreads so opening the cover feels instant.
    ;[2, 3, 4, 5].forEach((pageNumber) => {
      const img = new window.Image()
      img.src = getPageImageUrl(pageNumber)
    })
  }, [])

  const currentLeftPage = currentSpreadStart
  const currentRightPage = Math.min(currentSpreadStart + 1, totalPages)
  const incomingLeftPage = nextSpreadTarget
  const incomingRightPage = nextSpreadTarget
    ? Math.min(nextSpreadTarget + 1, totalPages)
    : null

  const openCover = () => {
    if (isOpeningCover || !isCoverView) return

    setIsOpeningCover(true)
    window.setTimeout(() => {
      setIsCoverView(false)
      setIsOpeningCover(false)
    }, 620)
  }

  const triggerFlip = (targetSpreadStart: number, direction: 'next' | 'prev') => {
    if (isCoverView || isOpeningCover || isFlipping || targetSpreadStart === currentSpreadStart) return

    setFlipDirection(direction)
    setNextSpreadTarget(targetSpreadStart)
    setIsFlipping(true)

    window.setTimeout(() => {
      setCurrentSpreadStart(targetSpreadStart)
      setNextSpreadTarget(null)
      setIsFlipping(false)
    }, 520)
  }

  const nextPage = () => {
    if (isCoverView) {
      openCover()
      return
    }

    if (currentSpreadStart + 2 <= totalPages) {
      triggerFlip(currentSpreadStart + 2, 'next')
    } else {
      // Last spread — close the book back to cover
      setIsCoverView(true)
    }
  }

  const prevPage = () => {
    if (isCoverView) return

    if (currentSpreadStart - 2 >= 1) {
      triggerFlip(currentSpreadStart - 2, 'prev')
    }
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
          background-color: #203f8f;
          background-image: url('/blue%20bg.JPEG');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
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
          transition: color 0.24s ease, transform 0.24s ease;
          z-index: 100;
        }

        .back-btn:hover {
          color: rgba(245,240,232,1);
          transform: translateY(-1px);
        }

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
          aspect-ratio: 2 / 1;
          max-width: 1050px;
          max-height: calc(100dvh - 170px);
          background: linear-gradient(180deg, rgba(30, 20, 12, 0.2), rgba(10, 10, 10, 0.35));
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          perspective: 1400px;
          cursor: grab;
          user-select: none;
          touch-action: pan-y;
          transition: filter 0.3s ease;
        }

        .flipbook-viewer:active {
          cursor: grabbing;
        }

        .flipbook-page-stack {
          position: relative;
          width: min(100%, 980px);
          height: min(100%, calc(980px / 2));
          background: transparent;
          padding: clamp(10px, 1.8vw, 20px) clamp(10px, 1.8vw, 22px);
        }

        .menu-cover {
          position: absolute;
          inset: clamp(10px, 1.8vw, 20px) clamp(10px, 1.8vw, 22px);
          border: 0;
          background: transparent;
          padding: 0;
          margin: 0;
          cursor: pointer;
          transform-origin: left center;
          z-index: 5;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          box-shadow:
            0 16px 28px rgba(0, 0, 0, 0.34),
            inset -14px 0 20px rgba(0, 0, 0, 0.22);
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .menu-cover:hover {
          transform: translateY(-2px) rotate(-0.2deg);
          filter: brightness(1.02);
        }

        .menu-cover.opening {
          animation: cover-open 0.62s cubic-bezier(0.2, 0.68, 0.28, 1) forwards;
          pointer-events: none;
        }

        .menu-cover img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          background: transparent;
        }

        .cover-open-hint {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(245, 240, 232, 0.76);
          text-transform: uppercase;
          background: rgba(0, 0, 0, 0.36);
          border: 1px solid rgba(245, 240, 232, 0.28);
          padding: 7px 10px;
          border-radius: 999px;
          white-space: nowrap;
          pointer-events: none;
        }

        .book-open-stage {
          position: absolute;
          inset: 0;
          opacity: 1;
          z-index: 2;
        }

        .book-open-stage.revealing {
          animation: reveal-spread 0.62s cubic-bezier(0.2, 0.68, 0.28, 1) forwards;
        }

        .flipbook-page-stack::before {
          content: '';
          position: absolute;
          left: 9%;
          right: 9%;
          bottom: 2px;
          height: 26px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.48), transparent 72%);
          filter: blur(5px);
          z-index: 0;
          pointer-events: none;
        }

        .book-spine {
          position: absolute;
          top: 4%;
          bottom: 4%;
          left: 50%;
          width: clamp(10px, 1.8vw, 18px);
          transform: translateX(-50%);
          border-radius: 999px;
          background:
            linear-gradient(90deg, rgba(18, 10, 7, 0.9), rgba(58, 33, 23, 0.68) 35%, rgba(16, 8, 6, 0.92) 65%, rgba(52, 30, 20, 0.75));
          box-shadow:
            inset 0 0 8px rgba(255, 244, 224, 0.12),
            0 0 10px rgba(0, 0, 0, 0.4);
          z-index: 3;
          pointer-events: none;
        }

        .flipbook-spread {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2px, 0.45vw, 7px);
          backface-visibility: hidden;
          transform-origin: center;
          will-change: transform, opacity, filter;
          transition: filter 0.28s ease;
          z-index: 1;
        }

        .flipbook-page {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          border: 1px solid rgba(55, 35, 20, 0.3);
          border-radius: 4px;
          overflow: hidden;
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px rgba(255, 250, 240, 0.22);
        }

        .flipbook-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(0deg, rgba(70, 45, 24, 0.03) 0, rgba(70, 45, 24, 0.03) 1px, transparent 1px, transparent 4px),
            radial-gradient(circle at 20% 16%, rgba(255, 250, 240, 0.28), transparent 58%);
          pointer-events: none;
          z-index: 2;
          mix-blend-mode: multiply;
        }

        .flipbook-page img {
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: contain;
          object-position: center;
          display: block;
          background: transparent;
          position: relative;
          z-index: 1;
          margin-top: 0;
          margin-left: 0;
        }

        .flipbook-page.left-page {
          transform: perspective(1200px) rotateY(2.2deg);
          transform-origin: right center;
          box-shadow:
            -2px 10px 20px rgba(0, 0, 0, 0.18),
            10px 0 18px rgba(0, 0, 0, 0.22),
            inset -12px 0 15px rgba(0, 0, 0, 0.16);
        }

        .flipbook-page.right-page {
          transform: perspective(1200px) rotateY(-2.2deg);
          transform-origin: left center;
          box-shadow:
            2px 10px 20px rgba(0, 0, 0, 0.18),
            -10px 0 18px rgba(0, 0, 0, 0.22),
            inset 12px 0 15px rgba(0, 0, 0, 0.16);
        }

        .flipbook-page.blank {
          background: rgba(10, 10, 10, 0.45);
          border-style: dashed;
          border-color: rgba(245, 240, 232, 0.16);
        }

        .flipbook-spread.current,
        .flipbook-spread.incoming {
          background: transparent;
        }

        .flipbook-spread.current {
          z-index: 2;
        }

        .flipbook-spread.incoming {
          z-index: 1;
        }

        .flipbook-viewer.flipping-next .flipbook-spread.current {
          animation: page-flip-out-next 0.52s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }

        .flipbook-viewer.flipping-next .flipbook-spread.incoming {
          animation: page-flip-in-next 0.52s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }

        .flipbook-viewer.flipping-prev .flipbook-spread.current {
          animation: page-flip-out-prev 0.52s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }

        .flipbook-viewer.flipping-prev .flipbook-spread.incoming {
          animation: page-flip-in-prev 0.52s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }

        @keyframes page-flip-out-next {
          0% { transform: rotateY(0deg) scale(1); opacity: 1; filter: blur(0); }
          100% { transform: rotateY(-68deg) scale(0.985); opacity: 0.12; filter: blur(0.8px); }
        }

        @keyframes page-flip-in-next {
          0% { transform: rotateY(68deg) scale(0.985); opacity: 0.12; filter: blur(0.8px); }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; filter: blur(0); }
        }

        @keyframes page-flip-out-prev {
          0% { transform: rotateY(0deg) scale(1); opacity: 1; filter: blur(0); }
          100% { transform: rotateY(68deg) scale(0.985); opacity: 0.12; filter: blur(0.8px); }
        }

        @keyframes page-flip-in-prev {
          0% { transform: rotateY(-68deg) scale(0.985); opacity: 0.12; filter: blur(0.8px); }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; filter: blur(0); }
        }

        @keyframes cover-open {
          0% { transform: rotateY(0deg) scale(1); opacity: 1; }
          100% { transform: rotateY(-98deg) scale(0.98); opacity: 0.04; }
        }

        @keyframes reveal-spread {
          0% { opacity: 0.16; transform: translateX(18px) scale(0.985); filter: blur(0.8px); }
          100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }

        .flipbook-controls {
          display: none;
        }

        .swipe-hint {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 240, 232, 0.5);
          text-align: center;
          letter-spacing: 0.05em;
          animation: hint-fade 2.6s ease-in-out infinite;
        }

        @keyframes hint-fade {
          0%, 100% { opacity: 0.48; }
          50% { opacity: 0.92; }
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
          transition: background 0.26s ease, border-color 0.26s ease, color 0.26s ease, transform 0.2s ease;
          text-transform: uppercase;
          border-radius: 2px;
          display: inline-block;
        }

        .pdf-btn:hover {
          background: rgba(245, 240, 232, 0.15);
          border-color: rgba(245, 240, 232, 0.7);
          color: rgba(245, 240, 232, 1);
          transform: translateY(-1px);
        }

        .pdf-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .page-shell {
            justify-content: center;
            align-items: center;
            gap: 10px;
            padding: 52px 4px 10px;
          }

          .back-btn {
            top: 16px;
            left: 14px;
            font-size: 12px;
          }

          .flipbook-container {
            width: 100%;
            padding: 0 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .flipbook-viewer {
            width: calc(100vw - 8px);
            max-width: none;
            max-height: none;
            aspect-ratio: 2 / 1;
          }

          .flipbook-page-stack {
            width: 100%;
            height: 100%;
            padding: 6px;
          }

          .menu-cover {
            inset: 8px;
          }

          .cover-open-hint {
            font-size: 10px;
            letter-spacing: 0.07em;
            bottom: 10px;
            padding: 6px 8px;
          }

          .book-spine {
            width: 10px;
            top: 3%;
            bottom: 3%;
          }

          .flipbook-spread {
            gap: 3px;
          }

          .flipbook-page {
            border-radius: 2px;
          }

          .flipbook-page img {
            width: 100%;
            height: 100%;
            margin-top: 0;
            margin-left: 0;
          }

          .flipbook-page.left-page,
          .flipbook-page.right-page {
            transform: none;
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
            animation: hint-fade 2.6s ease-in-out infinite;
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
            onClick={openCover}
          >
            <div className="flipbook-page-stack">
              {(isCoverView || isOpeningCover) && (
                <button
                  type="button"
                  className={`menu-cover${isOpeningCover ? ' opening' : ''}`}
                  onClick={openCover}
                  aria-label="Open menu book"
                >
                  <img
                    src={getPageImageUrl(1)}
                    alt="Incognito menu cover"
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    onError={(e) => handlePageImageError(e, 1)}
                  />
                  {!isOpeningCover && <div className="cover-open-hint">Tap or swipe left to open</div>}
                </button>
              )}
              {(!isCoverView || isOpeningCover) && (
                <div className={`book-open-stage${isOpeningCover ? ' revealing' : ''}`}>
                  <div className="book-spine" aria-hidden="true" />
                  <div className="flipbook-spread current" aria-live="polite">
                    <div className="flipbook-page left-page">
                      <img
                        src={getPageImageUrl(currentLeftPage)}
                        alt={`Incognito Menu Page ${currentLeftPage}`}
                        draggable={false}
                        loading="eager"
                        decoding="async"
                        onError={(e) => handlePageImageError(e, currentLeftPage)}
                      />
                    </div>
                    <div className="flipbook-page right-page">
                      <img
                        src={getPageImageUrl(currentRightPage)}
                        alt={`Incognito Menu Page ${currentRightPage}`}
                        draggable={false}
                        loading="eager"
                        decoding="async"
                        onError={(e) => handlePageImageError(e, currentRightPage)}
                      />
                    </div>
                  </div>
                  {isFlipping && nextSpreadTarget && incomingLeftPage && incomingRightPage && (
                    <div className="flipbook-spread incoming" aria-hidden="true">
                      <div className="flipbook-page left-page">
                        <img
                          src={getPageImageUrl(incomingLeftPage)}
                          alt=""
                          draggable={false}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => handlePageImageError(e, incomingLeftPage)}
                        />
                      </div>
                      <div className="flipbook-page right-page">
                        <img
                          src={getPageImageUrl(incomingRightPage)}
                          alt=""
                          draggable={false}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => handlePageImageError(e, incomingRightPage)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="page-counter">
            {isCoverView ? 'Cover' : `Pages ${currentLeftPage}-${currentRightPage} / ${totalPages}`}
          </div>
          <div className="swipe-hint">
            {isCoverView ? '← SWIPE LEFT TO OPEN THE MENU →' : '← SWIPE TO TURN SPREADS →'}
          </div>
          <div className="mobile-swipe-hint">
            {isCoverView ? 'Swipe left to open the menu' : 'Swipe left or right to turn spreads'}
          </div>
          <a href="/INCOG MENUvv.pdf" target="_blank" rel="noopener noreferrer" className="pdf-btn">
            📄 VIEW MENU PDF
          </a>
        </div>
      </div>
    </>
  )
}
