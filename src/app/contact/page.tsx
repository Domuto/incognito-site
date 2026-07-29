'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function ContactPage() {
  const tripleseatMountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!tripleseatMountRef.current) return

    const mountNode = tripleseatMountRef.current
    mountNode.innerHTML = ''
    let cancelled = false

    const hideTripleseatLink = () => {
      mountNode.querySelectorAll('#tripleseat_link').forEach((link) => {
        link.remove()
      })
    }

    const moveTripleseatForm = () => {
      const form = document.querySelector('#tripleseat_embed_form, #tripleseat_embed_form_inline')
      if (form && !mountNode.contains(form)) {
        mountNode.appendChild(form)
      }
    }

    const observer = new MutationObserver(hideTripleseatLink)
    observer.observe(mountNode, { childList: true, subtree: true })

    const bodyObserver = new MutationObserver(() => {
      moveTripleseatForm()
      hideTripleseatLink()
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    const loadScript = (src: string, parent: ParentNode = document.head) =>
      new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`)
        if (existingScript) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load ${src}`))
        parent.appendChild(script)
      })

    const initializeTripleseat = async () => {
      try {
        await loadScript('https://www.google.com/recaptcha/api.js')
        if (cancelled) return

        await loadScript(
          'https://api.tripleseat.com/v1/leads/ts_script.js?lead_form_id=26805&public_key=90e0e457ced62ccf86f2f5d9a0deb7857a4676d9',
          mountNode,
        )
        if (cancelled) return

        moveTripleseatForm()
        hideTripleseatLink()
        setLoaded(true)
      } catch {
        if (!cancelled) setLoaded(true)
      }
    }

    void initializeTripleseat()

    return () => {
      cancelled = true
      observer.disconnect()
      bodyObserver.disconnect()
      mountNode.innerHTML = ''
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .contact-shell {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(135deg, rgba(12, 13, 18, 0.78), rgba(17, 19, 25, 0.72)),
            url('/Screenshot%202026-06-05%20at%2012.00.05%E2%80%AFPM.png'),
            url('/Screenshot%202026-06-05%20at%2011.59.52%E2%80%AFAM.png'),
            url('/Screenshot%202026-06-05%20at%2011.59.32%E2%80%AFAM.png');
          background-position: center, center, center, center;
          background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
          background-size: cover, cover, cover, cover;
          background-blend-mode: multiply, soft-light, overlay, normal;
          overflow-y: auto;
          padding: 72px 18px 24px;
        }

        .contact-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.3;
          pointer-events: none;
        }

        .contact-card {
          position: relative;
          width: min(92vw, 580px);
          border: 1px solid rgba(245, 240, 232, 0.26);
          background: rgba(10, 10, 10, 0.55);
          backdrop-filter: blur(4px);
          padding: clamp(22px, 4vw, 36px);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.48);
          z-index: 1;
          margin: auto;
        }

        .contact-card #tripleseat_embed_form,
        .contact-card #tripleseat_embed_form_inline {
          color: #f5f0e8;
          font-family: 'Space Mono', monospace;
        }

        body > #tripleseat_embed_form,
        body > #tripleseat_embed_form_inline {
          position: relative;
          z-index: 2;
          width: min(92vw, 580px);
          margin: 20px auto 24px;
          border: 1px solid rgba(245, 240, 232, 0.26);
          background: rgba(10, 10, 10, 0.55);
          backdrop-filter: blur(4px);
          padding: clamp(22px, 4vw, 36px);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.48);
          color: #f5f0e8;
          font-family: 'Space Mono', monospace;
        }

        .contact-card #tripleseat_embed_form table,
        .contact-card #tripleseat_embed_form_inline table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        .contact-card #tripleseat_embed_form td,
        .contact-card #tripleseat_embed_form_inline td {
          padding: 0;
        }

        .contact-card #tripleseat_embed_form h2,
        .contact-card #tripleseat_embed_form_inline h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.08em;
          color: #f5f0e8;
          margin: 0 0 2px;
        }

        .contact-card #tripleseat_embed_form label,
        .contact-card #tripleseat_embed_form_inline label {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245, 240, 232, 0.55);
          margin-bottom: 5px;
        }

        .contact-card #tripleseat_embed_form input,
        .contact-card #tripleseat_embed_form select,
        .contact-card #tripleseat_embed_form textarea,
        .contact-card #tripleseat_embed_form_inline input,
        .contact-card #tripleseat_embed_form_inline select,
        .contact-card #tripleseat_embed_form_inline textarea {
          width: 100%;
          background: rgba(245, 240, 232, 0.06);
          border: 1px solid rgba(245, 240, 232, 0.22);
          border-radius: 2px;
          color: #f5f0e8;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          padding: 10px 12px;
          outline: none;
          box-sizing: border-box;
        }

        .contact-card #tripleseat_embed_form input:focus,
        .contact-card #tripleseat_embed_form select:focus,
        .contact-card #tripleseat_embed_form textarea:focus,
        .contact-card #tripleseat_embed_form_inline input:focus,
        .contact-card #tripleseat_embed_form_inline select:focus,
        .contact-card #tripleseat_embed_form_inline textarea:focus {
          border-color: rgba(245, 240, 232, 0.6);
          background: rgba(245, 240, 232, 0.1);
          outline: none;
        }

        .contact-card #tripleseat_embed_form select option,
        .contact-card #tripleseat_embed_form_inline select option {
          background: #14161c;
          color: #f5f0e8;
        }

        .contact-card #tripleseat_embed_form textarea,
        .contact-card #tripleseat_embed_form_inline textarea {
          min-height: 90px;
          resize: vertical;
        }

        .contact-card #tripleseat_embed_form .button,
        .contact-card #tripleseat_embed_form_inline .button {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.14em;
          color: #14161c;
          background: #f5f0e8;
          border: none;
          border-radius: 0;
          padding: 13px 24px;
          width: 100%;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .contact-card #tripleseat_embed_form .button:hover,
        .contact-card #tripleseat_embed_form_inline .button:hover {
          background: #fff;
          transform: translateY(-1px);
        }

        .contact-card #tripleseat_embed_form .errorExplanation,
        .contact-card #tripleseat_embed_form_inline .errorExplanation {
          width: 100%;
          box-sizing: border-box;
          background: rgba(224, 85, 85, 0.1);
          border: 1px solid rgba(224, 85, 85, 0.35);
          color: #f5f0e8;
          margin: 0 0 16px;
        }

        .contact-card #tripleseat_embed_form .errorExplanation h2,
        .contact-card #tripleseat_embed_form_inline .errorExplanation h2 {
          font-size: 18px;
          color: #e05555;
          margin-bottom: 6px;
        }

        .contact-card #tripleseat_embed_form .help-block.danger,
        .contact-card #tripleseat_embed_form_inline .help-block.danger {
          color: #e05555;
        }

        .contact-card #tripleseat_link {
          display: none !important;
        }

        .contact-card #tripleseat_embed_form .ui-datepicker,
        .contact-card #tripleseat_embed_form_inline .ui-datepicker {
          background: #14161c;
          border: 1px solid rgba(245, 240, 232, 0.22);
        }

        .contact-card #tripleseat_embed_form .ui-datepicker a,
        .contact-card #tripleseat_embed_form_inline .ui-datepicker a {
          color: #f5f0e8;
        }

        .contact-kicker {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(245, 240, 232, 0.6);
          margin-bottom: 10px;
        }

        .contact-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(38px, 10vw, 68px);
          letter-spacing: 0.05em;
          color: #f5f0e8;
          line-height: 0.95;
          margin-bottom: 6px;
        }

        .contact-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: clamp(11px, 2vw, 13px);
          line-height: 1.6;
          color: rgba(245, 240, 232, 0.62);
          margin-bottom: 24px;
        }

        .tasting-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245, 240, 232, 0.55);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(245, 240, 232, 0.06);
          border: 1px solid rgba(245, 240, 232, 0.22);
          color: #f5f0e8;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          padding: 10px 12px;
          outline: none;
          border-radius: 2px;
          transition: border-color 0.2s ease, background 0.2s ease;
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: rgba(245, 240, 232, 0.6);
          background: rgba(245, 240, 232, 0.1);
        }

        .form-group input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.5);
          cursor: pointer;
        }

        .form-group select option {
          background: #14161c;
          color: #f5f0e8;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-submit {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.14em;
          color: #14161c;
          background: #f5f0e8;
          border: none;
          padding: 13px 24px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
          width: 100%;
          margin-top: 4px;
        }

        .form-submit:hover:not(:disabled) {
          background: #fff;
          transform: translateY(-1px);
        }

        .form-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-error {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #e05555;
          letter-spacing: 0.04em;
          margin-top: -4px;
        }

        .form-divider {
          border: none;
          border-top: 1px solid rgba(245, 240, 232, 0.12);
          margin: 6px 0;
        }

        .ig-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(245, 240, 232, 0.55);
          text-decoration: none;
          margin-top: 8px;
          transition: color 0.2s ease;
        }

        .ig-link:hover { color: rgba(245, 240, 232, 0.95); }

        .success-box {
          text-align: center;
          padding: 16px 0 8px;
        }

        .success-box h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 9vw, 60px);
          color: #f5f0e8;
          letter-spacing: 0.05em;
          line-height: 1;
          margin-bottom: 10px;
        }

        .success-box p {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(245, 240, 232, 0.7);
          line-height: 1.6;
        }

        .back-btn {
          position: fixed;
          top: 24px;
          left: 24px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 0.18em;
          text-decoration: none;
          color: rgba(245, 240, 232, 0.56);
          z-index: 2;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .back-btn:hover {
          color: rgba(245, 240, 232, 0.95);
          transform: translateY(-1px);
        }

        .tripleseat-loading {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245, 240, 232, 0.55);
          padding: 8px 0 2px;
        }

        @media (max-width: 520px) {
          .contact-card #tripleseat_embed_form input,
          .contact-card #tripleseat_embed_form select,
          .contact-card #tripleseat_embed_form textarea,
          .contact-card #tripleseat_embed_form_inline input,
          .contact-card #tripleseat_embed_form_inline select,
          .contact-card #tripleseat_embed_form_inline textarea {
            font-size: 16px;
          }

          .contact-shell {
            padding: 64px 14px 20px;
          }

          .contact-card {
            padding: 20px 16px;
          }

          .back-btn {
            top: 14px;
            left: 14px;
            font-size: 12px;
          }
        }
      `}</style>

      <main className="contact-shell">
        <Link href="/" className="back-btn">← BACK</Link>

        <section className="contact-card" aria-label="Contact us form">
          <p className="contact-kicker">Book an experience</p>
          <h1 className="contact-title">CONTACT US</h1>
          <p className="contact-subtitle">
            For any Private Events, buyouts and exclusive experiences
          </p>

          {!loaded && <p className="tripleseat-loading">Loading contact form...</p>}
          <div ref={tripleseatMountRef} />
        </section>
      </main>
    </>
  )
}
