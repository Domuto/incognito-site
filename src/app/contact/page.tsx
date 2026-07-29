'use client'

import Link from 'next/link'

export default function ContactPage() {
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

          <p className="tripleseat-loading">Loading contact form...</p>
          <iframe
            title="Tripleseat contact form"
            src="/contact/embed"
            className="tripleseat-frame"
            loading="eager"
            sandbox="allow-scripts allow-forms allow-same-origin"
            style={{
              width: '100%',
              minHeight: 1200,
              border: 0,
              display: 'block',
              background: 'transparent',
            }}
          />
        </section>
      </main>
    </>
  )
}
