'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.volume = 0.3
      audioElement.play().catch(() => {
        // Autoplay blocked, continue anyway
      })
    }

    const introVideo = introVideoRef.current
    if (introVideo) {
      introVideo.play().catch(() => {
        // If autoplay is blocked, the skip button still lets the user continue.
      })
    }

    const fallbackTimer = setTimeout(() => {
      setShowIntro(false)
    }, 7000)

    return () => {
      clearTimeout(fallbackTimer)
    }
  }, [])

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
      <div className="incognito-entrance">
        <audio ref={audioRef} loop>
          <source src="/ambient-hum.mp3" type="audio/mpeg" />
        </audio>

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
                <source src="/inc.mp4" type="video/mp4" />
              </video>
            </div>

            <button type="button" className="intro-skip-btn" onClick={completeIntro}>
              Skip Intro
            </button>
          </div>
        )}

        {!showIntro && (
          <div className="entrance-full">
            <div className="home-bg" aria-hidden="true" />

            <div className="home-table" aria-hidden="true">
              <Image
                src="/s1.png"
                alt="Pool table"
                width={760}
                height={1298}
                className="home-table-image"
                priority
              />
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
              <div className="primary-options">
                <Link href="/menu" className="option-portal">
                  <Image
                    src="/menubutton.PNG"
                    alt="THE FILES"
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
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
