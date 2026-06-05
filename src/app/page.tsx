'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [stage, setStage] = useState(0) // 0: black, 1: warning, 2: logo, 3: full site
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [backgroundTexture, setBackgroundTexture] = useState(0)

  useEffect(() => {
    // Randomly select a background texture
    setBackgroundTexture(Math.floor(Math.random() * 8))
  }, [])

  useEffect(() => {
    // Start with black screen and ambient hum
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.play().catch(() => {
        // Autoplay blocked, continue anyway
      })
    }

    // Stage 1: Show warning after 0.8s
    const timer1 = setTimeout(() => {
      setStage(1)
    }, 800)

    // Stage 2: Show logo after 2.5s total
    const timer2 = setTimeout(() => {
      setStage(2)
    }, 2500)

    // Stage 3: Show full site after 4.5s total
    const timer3 = setTimeout(() => {
      setStage(3)
    }, 4500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <div className="incognito-entrance" onMouseMove={handleMouseMove}>
        {/* Ambient hum audio */}
        <audio ref={audioRef} loop volume={0.3}>
          <source src="/ambient-hum.mp3" type="audio/mpeg" />
        </audio>

        {/* Grain texture overlay */}
        <div className="grain" aria-hidden="true" />

        {/* Stage 0-1: Black screen with warning */}
        {stage < 3 && (
          <div className={`entry-phase entry-phase-${stage}`}>
            {stage >= 1 && (
              <div className="warning-text">
                <p>You weren't supposed to find this.</p>
              </div>
            )}
          </div>
        )}

        {/* Stage 2-3: Logo reveal */}
        {stage >= 2 && (
          <div className={`logo-reveal${stage >= 3 ? ' settled' : ''}`}>
            <Image
              src="/logo.png"
              alt="INCÓGNITO"
              width={400}
              height={150}
              className="logo-image"
              priority
            />
          </div>
        )}

        {/* Stage 3: Full entrance with textured background */}
        {stage >= 3 && (
          <div className="entrance-full">
            {/* Textured background */}
            <div className={`textured-bg texture-${backgroundTexture}`}></div>

            {/* Three floating options */}
            <nav className="floating-options">
              <Link href="/menu" className="option-portal">
                <span className="option-label">THE FILES</span>
              </Link>
              <Link href="/about" className="option-portal">
                <span className="option-label">THE ALIBI</span>
              </Link>
              <Link href="/drop" className="option-portal">
                <span className="option-label">THE DROP</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
