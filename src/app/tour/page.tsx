import Link from 'next/link'
import Image from 'next/image'

const MATTERPORT_URL = 'https://my.matterport.com/show/?m=nBUnJQ2CqX7'

export default function TourPage() {
  return (
    <>
      <style>{`
        .tour-shell {
          position: fixed;
          inset: 0;
          display: block;
          background:
            radial-gradient(circle at 16% 8%, rgba(41, 98, 167, 0.32), transparent 38%),
            radial-gradient(circle at 84% 82%, rgba(10, 28, 49, 0.5), transparent 46%),
            #081425;
          overflow: hidden;
        }

        .tour-shell::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.25;
          pointer-events: none;
        }

        .tour-frame-wrap {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          z-index: 1;
          overflow: hidden;
        }

        .tour-frame {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
          background: #000;
        }

        .tour-chrome {
          position: fixed;
          left: 0;
          right: 0;
          top: 18px;
          z-index: 12;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 18px;
          pointer-events: auto;
        }

        .tour-back {
          margin-left: auto;
          color: rgba(245, 240, 232, 0.84);
          text-decoration: none;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.18em;
          font-size: 14px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
          pointer-events: auto;
          padding: 8px 10px;
          background: rgba(7, 15, 28, 0.42);
          border: 1px solid rgba(180, 210, 255, 0.22);
          backdrop-filter: blur(3px);
        }

        .tour-back:hover {
          color: #f5f0e8;
          border-color: rgba(245, 240, 232, 0.54);
        }

        .tour-logo {
          position: absolute;
          left: 50%;
          top: 34px;
          transform: translateX(-50%);
          width: min(30vw, 260px);
          height: auto;
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.5));
          opacity: 0.96;
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .tour-chrome {
            top: 14px;
            padding: 0 12px;
          }

          .tour-back {
            font-size: 12px;
            padding: 7px 9px;
          }

          .tour-logo {
            top: 30px;
            width: min(50vw, 210px);
          }
        }
      `}</style>

      <main className="tour-shell">
        <div className="tour-chrome">
          <Link href="/" className="tour-back">
            ← BACK
          </Link>

          <Image
            src="/1234.png"
            alt="INCOG"
            width={340}
            height={114}
            className="tour-logo"
            priority
          />

        </div>

        <section className="tour-frame-wrap" aria-label="Embedded virtual tour">
          <iframe
            className="tour-frame"
            src={MATTERPORT_URL}
            title="Incognito Space Virtual Tour"
            allow="xr-spatial-tracking; vr; gyroscope; accelerometer; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals allow-popups"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      </main>
    </>
  )
}
