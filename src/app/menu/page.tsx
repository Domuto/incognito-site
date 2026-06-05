'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function MenuPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [numPages, setNumPages] = useState<number>(1)
  const [pageWidth, setPageWidth] = useState(820)
  const viewerRef = useRef<HTMLDivElement>(null)
  const menuPdfUrl = '/INCOG%20MENU%20WEB.pdf'

  useEffect(() => {
    const updateWidth = () => {
      if (!viewerRef.current) return
      setPageWidth(Math.max(240, Math.floor(viewerRef.current.clientWidth - 24)))
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    if (viewerRef.current) observer.observe(viewerRef.current)

    window.addEventListener('resize', updateWidth)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  const onLoadSuccess = ({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages)
    setCurrentPage(prev => Math.min(prev, totalPages))
  }

  const nextPage = () => setCurrentPage(p => Math.min(numPages, p + 1))
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
          min-height: 320px;
          background: rgba(0, 0, 0, 0.28);
          border: 2px solid rgba(245, 240, 232, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          padding: 12px;
        }

        .flipbook-page {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .flipbook-page canvas {
          max-width: 100%;
          height: auto !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          background: #fff;
        }

        .menu-loading,
        .menu-error {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          color: rgba(245,240,232,0.75);
          text-transform: uppercase;
          text-align: center;
        }

        .menu-error-link {
          color: rgba(245,240,232,0.9);
          border: 1px solid rgba(245,240,232,0.5);
          text-decoration: none;
          padding: 8px 12px;
          display: inline-block;
          margin-top: 10px;
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
            min-height: 280px;
            padding: 8px;
          }

          .flipbook-page canvas {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
          }

          .mobile-open {
            display: inline-block;
          }
        }
      `}</style>
      <div className="page-shell">
        <Link href="/" className="back-btn">← BACK</Link>
        <div className="flipbook-container">
          <div className="flipbook-viewer" ref={viewerRef}>
            <div className="flipbook-page">
              <Document
                file={menuPdfUrl}
                onLoadSuccess={onLoadSuccess}
                loading={<div className="menu-loading">LOADING MENU…</div>}
                error={
                  <div className="menu-error">
                    MENU PREVIEW FAILED
                    <br />
                    <a className="menu-error-link" href={menuPdfUrl} target="_blank" rel="noreferrer">
                      OPEN PDF
                    </a>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          </div>
          <a className="mobile-open" href={`${menuPdfUrl}#page=${currentPage}`} target="_blank" rel="noreferrer">
            OPEN MENU
          </a>
          <div className="flipbook-controls">
            <button className="flip-btn" onClick={prevPage} disabled={currentPage === 1}>
              ← PREVIOUS
            </button>
            <div className="page-counter">Page {currentPage} / {numPages}</div>
            <button className="flip-btn" onClick={nextPage} disabled={currentPage >= numPages}>
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
