'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '') || ''

const getMediaUrl = (path: string) =>
  MEDIA_BASE_URL
    ? `${MEDIA_BASE_URL}/${path.replace(/^\//, '')}`
    : path

export default function Home() {
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    document.body.classList.add('home-lock-scroll')

    return () => {
      document.body.classList.remove('home-lock-scroll')
    }
  }, [])

  useEffect(() => {
    if (!showIntro) return

    const introVideo = introVideoRef.current
    if (!introVideo) {
      setShowIntro(false)
      return
    }

    const tryPlayIntro = () => {
      introVideo.play().catch(() => {
        // If autoplay is blocked, bail out quickly so nav buttons are visible.
        setShowIntro(false)
      })
    }

    // Start playback as soon as possible, then retry when media becomes playable.
    tryPlayIntro()
    const handleCanPlay = () => {
      if (introVideo.paused && showIntro) {
        tryPlayIntro()
      }
    }
    const handleVideoFailure = () => {
      setShowIntro(false)
    }

    introVideo.addEventListener('canplay', handleCanPlay)
    introVideo.addEventListener('error', handleVideoFailure)
    introVideo.addEventListener('stalled', handleVideoFailure)
    introVideo.addEventListener('abort', handleVideoFailure)

    const fallbackTimer = setTimeout(() => {
      setShowIntro(false)
    }, 6000)

    return () => {
      introVideo.removeEventListener('canplay', handleCanPlay)
      introVideo.removeEventListener('error', handleVideoFailure)
      introVideo.removeEventListener('stalled', handleVideoFailure)
      introVideo.removeEventListener('abort', handleVideoFailure)
      clearTimeout(fallbackTimer)
    }
  }, [showIntro])

  const completeIntro = () => {
    const introVideo = introVideoRef.current
    if (introVideo) {
      introVideo.pause()
      introVideo.currentTime = 0
    }
    setShowIntro(false)
  }

  return (
    <>
      <section className="sr-only" aria-hidden="false">
        <h1>Incognito — Hidden Cocktail Bar &amp; Speakeasy in Atlanta</h1>
        <p>
          Incognito is a hidden speakeasy and craft cocktail bar in Atlanta, GA.
          Step behind the secret entrance for seasonal cocktails, an intimate
          after-dark atmosphere, and a night you weren&apos;t supposed to find.
        </p>
        <h2>Explore Incognito Atlanta</h2>
        <ul>
          <li>
            <Link href="/menu">The Files — our craft cocktail &amp; drink menu</Link>
          </li>
          <li>
            <Link href="/about">The Alibi — about Incognito&apos;s hidden Atlanta bar</Link>
          </li>
          <li>
            <Link href="/contact">Contact &amp; reservations at Incognito Atlanta</Link>
          </li>
          <li>
            <Link href="/tour">Take a virtual tour of Incognito</Link>
          </li>
        </ul>
      </section>

      <div className="incognito-entrance">
        <div className="grain" aria-hidden="true" />

        {showIntro && (
          <div className="intro-video-overlay">
            <div className="intro-video-frame">
              <video
                ref={introVideoRef}
                className="intro-video"
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={completeIntro}
              >
                <source src={getMediaUrl('/02.mp4')} type="video/mp4" />
                <source src="/02.mp4" type="video/mp4" />
              </video>
            </div>

            <button type="button" className="intro-skip-btn" onClick={completeIntro}>
              Skip Intro
            </button>
          </div>
        )}

        {!showIntro && (
          <div className="entrance-full">
            <div className="home-bg" aria-hidden="true">
              <video
                className="home-bg-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={getMediaUrl('/02.mp4')} type="video/mp4" />
                <source src="/02.mp4" type="video/mp4" />
              </video>
              <div className="home-bg-tint" />
            </div>

            <nav className="floating-options">
              <div className="top-logo">
                <Image
                  src="/INCOG.png"
                  alt="Incog"
                  width={320}
                  height={120}
                  className="top-logo-image"
                  priority
                />
              </div>
              <div className="primary-options primary-options-three">
                <Link href="/menu" className="option-portal">
                  <Image
                    src="/menubutton.PNG"
                    alt="THE FILES"
                    width={200}
                    height={200}
                    className="option-image"
                  />
                </Link>
                <Link href="/contact" className="option-portal">
                  <Image
                    src="/CONTACT.png"
                    alt="Contact Us"
                    width={200}
                    height={200}
                    className="option-image"
                  />
                </Link>
                <Link href="/about" className="option-portal">
                  <Image
                    src="/aboutbuton.PNG"
                    alt="THE ALIBI"
                    width={200}
                    height={200}
                    className="option-image"
                  />
                </Link>
              </div>
              <Link href="/pool" className="arcade-button">
                Pool Table Game
              </Link>
              <Link href="/tour" className="tour-button">
                Virtual Tour
              </Link>
            </nav>

            <a
              href="https://www.instagram.com/bar_incognitoatl/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-ig-link"
              aria-label="Visit Incognito on Instagram"
            >
              <img src="/igicon.png" alt="" aria-hidden="true" />
            </a>

            <a
              href="https://ouragency.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="home-credit-link"
              aria-label="Website by Our Agency"
            >
              website by Our Agency
            </a>
          </div>
        )}
      </div>
    </>
  )
}
