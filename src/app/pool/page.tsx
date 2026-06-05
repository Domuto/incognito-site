'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

type Ball = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  color: string
  pocketed: boolean
  isCue?: boolean
}

const TABLE_WIDTH = 1000
const TABLE_HEIGHT = 560
const BALL_RADIUS = 14
const POCKET_RADIUS = 40
const pockets = [
  { x: 18, y: 18 },
  { x: TABLE_WIDTH / 2, y: 12 },
  { x: TABLE_WIDTH - 18, y: 18 },
  { x: 18, y: TABLE_HEIGHT - 18 },
  { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT - 12 },
  { x: TABLE_WIDTH - 18, y: TABLE_HEIGHT - 18 },
]

function createBalls(): Ball[] {
  return [
    { id: 'cue', x: 240, y: TABLE_HEIGHT / 2, vx: 0, vy: 0, color: '#f8f8f4', pocketed: false, isCue: true },
    { id: 'one', x: 720, y: 280, vx: 0, vy: 0, color: '#f1c232', pocketed: false },
    { id: 'two', x: 748, y: 264, vx: 0, vy: 0, color: '#3d85c6', pocketed: false },
    { id: 'three', x: 748, y: 296, vx: 0, vy: 0, color: '#cc0000', pocketed: false },
    { id: 'four', x: 776, y: 248, vx: 0, vy: 0, color: '#674ea7', pocketed: false },
    { id: 'five', x: 776, y: 280, vx: 0, vy: 0, color: '#f39c12', pocketed: false },
    { id: 'six', x: 776, y: 312, vx: 0, vy: 0, color: '#6aa84f', pocketed: false },
  ]
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function PoolPage() {
  const [balls, setBalls] = useState<Ball[]>(createBalls)
  const [isAiming, setIsAiming] = useState(false)
  const [aimPoint, setAimPoint] = useState<{ x: number; y: number } | null>(null)
  const [message, setMessage] = useState('Drag from the cue ball to shoot.')
  const tableRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const cueBall = useMemo(() => balls.find((ball) => ball.isCue && !ball.pocketed) ?? null, [balls])
  const targetsRemaining = useMemo(() => balls.filter((ball) => !ball.isCue && !ball.pocketed).length, [balls])
  const allBallsStopped = useMemo(
    () => balls.every((ball) => ball.pocketed || Math.hypot(ball.vx, ball.vy) < 0.08),
    [balls]
  )

  useEffect(() => {
    if (targetsRemaining === 0) {
      setMessage('Table cleared. Rack them again.')
    } else if (allBallsStopped) {
      setMessage('Drag from the cue ball to shoot.')
    }
  }, [allBallsStopped, targetsRemaining])

  useEffect(() => {
    const step = (timestamp: number) => {
      const lastTime = lastTimeRef.current ?? timestamp
      const delta = Math.min((timestamp - lastTime) / 16.6667, 2)
      lastTimeRef.current = timestamp
      let nextMessage: string | null = null

      setBalls((currentBalls) => {
        const nextBalls = currentBalls.map((ball) => ({ ...ball }))

        nextBalls.forEach((ball) => {
          if (ball.pocketed) return

          ball.x += ball.vx * delta
          ball.y += ball.vy * delta

          const friction = Math.pow(0.99, delta)
          ball.vx *= friction
          ball.vy *= friction

          if (Math.abs(ball.vx) < 0.01) ball.vx = 0
          if (Math.abs(ball.vy) < 0.01) ball.vy = 0

          if (ball.x <= BALL_RADIUS) {
            ball.x = BALL_RADIUS
            ball.vx *= -0.96
          }
          if (ball.x >= TABLE_WIDTH - BALL_RADIUS) {
            ball.x = TABLE_WIDTH - BALL_RADIUS
            ball.vx *= -0.96
          }
          if (ball.y <= BALL_RADIUS) {
            ball.y = BALL_RADIUS
            ball.vy *= -0.96
          }
          if (ball.y >= TABLE_HEIGHT - BALL_RADIUS) {
            ball.y = TABLE_HEIGHT - BALL_RADIUS
            ball.vy *= -0.96
          }
        })

        for (let i = 0; i < nextBalls.length; i += 1) {
          for (let j = i + 1; j < nextBalls.length; j += 1) {
            const a = nextBalls[i]
            const b = nextBalls[j]
            if (a.pocketed || b.pocketed) continue

            const dx = b.x - a.x
            const dy = b.y - a.y
            const distance = Math.hypot(dx, dy)
            const minDistance = BALL_RADIUS * 2

            if (!distance || distance >= minDistance) continue

            const nx = dx / distance
            const ny = dy / distance
            const overlap = (minDistance - distance) / 2

            a.x -= nx * overlap
            a.y -= ny * overlap
            b.x += nx * overlap
            b.y += ny * overlap

            const aNormal = a.vx * nx + a.vy * ny
            const bNormal = b.vx * nx + b.vy * ny
            const tangentX = -ny
            const tangentY = nx
            const aTangent = a.vx * tangentX + a.vy * tangentY
            const bTangent = b.vx * tangentX + b.vy * tangentY

            a.vx = bNormal * nx + aTangent * tangentX
            a.vy = bNormal * ny + aTangent * tangentY
            b.vx = aNormal * nx + bTangent * tangentX
            b.vy = aNormal * ny + bTangent * tangentY
          }
        }

        nextBalls.forEach((ball) => {
          if (ball.pocketed) return

          const pocketed = pockets.some((pocket) => Math.hypot(ball.x - pocket.x, ball.y - pocket.y) <= POCKET_RADIUS)
          if (!pocketed) return

          if (ball.isCue) {
            ball.x = 240
            ball.y = TABLE_HEIGHT / 2
            ball.vx = 0
            ball.vy = 0
            nextMessage = 'Scratch. Cue ball reset.'
            return
          }

          ball.pocketed = true
          ball.vx = 0
          ball.vy = 0
          nextMessage = 'Nice shot.'
        })

        return nextBalls
      })

      if (nextMessage) {
        setMessage(nextMessage)
      }

      animationRef.current = requestAnimationFrame(step)
    }

    animationRef.current = requestAnimationFrame(step)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const getTablePoint = (clientX: number, clientY: number) => {
    const table = tableRef.current
    if (!table) return null

    const rect = table.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * TABLE_WIDTH
    const y = ((clientY - rect.top) / rect.height) * TABLE_HEIGHT

    return {
      x: clamp(x, 0, TABLE_WIDTH),
      y: clamp(y, 0, TABLE_HEIGHT),
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cueBall || !allBallsStopped) return

    const point = getTablePoint(event.clientX, event.clientY)
    if (!point) return

    const distanceToCue = Math.hypot(point.x - cueBall.x, point.y - cueBall.y)
    if (distanceToCue > BALL_RADIUS * 2.2) return

    setAimPoint(point)
    setIsAiming(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isAiming) return
    const point = getTablePoint(event.clientX, event.clientY)
    if (!point) return
    setAimPoint(point)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isAiming || !cueBall) return

    const point = getTablePoint(event.clientX, event.clientY)
    setIsAiming(false)
    setAimPoint(null)

    if (!point) return

    const dx = cueBall.x - point.x
    const dy = cueBall.y - point.y
    const distance = Math.hypot(dx, dy)
    if (distance < 8) return

    const speed = Math.min(distance * 0.095, 30)

    setBalls((currentBalls) =>
      currentBalls.map((ball) =>
        ball.isCue
          ? {
              ...ball,
              vx: (dx / distance) * speed,
              vy: (dy / distance) * speed,
            }
          : ball
      )
    )
    setMessage('Rolling...')
  }

  const resetGame = () => {
    setBalls(createBalls())
    setMessage('Fresh rack. Drag from the cue ball to shoot.')
    setIsAiming(false)
    setAimPoint(null)
  }

  return (
    <>
      <style>{`
        .pool-shell {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 72px 16px 24px;
          background: radial-gradient(circle at center, rgba(16, 70, 44, 0.35), transparent 55%),
            url('/blue%20bg.JPEG') center/cover no-repeat;
          overflow: auto;
        }

        .pool-shell::before {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(8, 8, 8, 0.42);
          pointer-events: none;
        }

        .pool-shell > * {
          position: relative;
          z-index: 1;
        }

        .pool-back {
          position: fixed;
          top: 24px;
          left: 24px;
          color: rgba(245, 240, 232, 0.72);
          text-decoration: none;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.18em;
          font-size: 14px;
        }

        .pool-status {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: rgba(245, 240, 232, 0.78);
          text-transform: uppercase;
        }

        .pool-table-wrap {
          width: min(94vw, 1100px);
        }

        .pool-table {
          position: relative;
          width: 100%;
          aspect-ratio: 1000 / 560;
          border-radius: 28px;
          background:
            radial-gradient(circle at 50% 50%, rgba(165, 220, 255, 0.18) 0%, rgba(165, 220, 255, 0.08) 24%, transparent 54%),
            linear-gradient(180deg, #1e85e8 0%, #1568c7 52%, #0d4ea4 100%);
          border: 16px solid #3a2415;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45), inset 0 0 0 3px rgba(255, 236, 193, 0.2);
          overflow: hidden;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }

        .pool-table * {
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
        }

        .pool-felt-markings {
          position: absolute;
          inset: 22px;
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
        }

        .pool-center-line {
          position: absolute;
          top: 22px;
          bottom: 22px;
          left: 25%;
          width: 2px;
          background: rgba(255, 255, 255, 0.12);
        }

        .pool-logo {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(18vw, 170px);
          height: auto;
          opacity: 0.78;
          pointer-events: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
          object-fit: contain;
          filter: none;
          mix-blend-mode: normal;
        }

        .pool-pocket {
          position: absolute;
          width: 44px;
          height: 44px;
          margin-left: -22px;
          margin-top: -22px;
          border-radius: 999px;
          background: #040404;
          box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.85);
        }

        .pool-ball {
          position: absolute;
          width: 28px;
          height: 28px;
          margin-left: -14px;
          margin-top: -14px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.55);
          box-shadow: inset -4px -4px 10px rgba(0, 0, 0, 0.35), inset 3px 3px 8px rgba(255, 255, 255, 0.25);
        }

        .cue-ball-ring {
          position: absolute;
          width: 48px;
          height: 48px;
          margin-left: -24px;
          margin-top: -24px;
          border-radius: 999px;
          border: 1px dashed rgba(255, 255, 255, 0.35);
          pointer-events: none;
        }

        .aim-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0.75), rgba(255,255,255,0));
          transform-origin: left center;
          pointer-events: none;
        }

        .pool-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Space Mono', monospace;
          color: rgba(245, 240, 232, 0.75);
        }

        .pool-reset {
          appearance: none;
          border: 1px solid rgba(245, 240, 232, 0.45);
          background: rgba(245, 240, 232, 0.08);
          color: #f5f0e8;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 14px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .pool-shell {
            justify-content: flex-start;
            padding: 58px 8px 14px;
            gap: 8px;
          }

          .pool-back {
            top: 16px;
            left: 16px;
            font-size: 12px;
          }

          .pool-table-wrap {
            width: min(96vw, calc((100dvh - 150px) * 1.785714));
          }

          .pool-table {
            border-width: 10px;
            border-radius: 18px;
            max-height: calc(100dvh - 150px);
          }

          .pool-logo {
            width: 104px;
          }

          .pool-status {
            font-size: 11px;
          }

          .pool-controls {
            gap: 8px;
          }

          .pool-reset {
            padding: 8px 11px;
            font-size: 10px;
          }
        }
      `}</style>
      <div className="pool-shell">
        <Link href="/" className="pool-back">← BACK</Link>

        <div className="pool-table-wrap">
          <div
            ref={tableRef}
            className="pool-table"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div className="pool-felt-markings" />
            <div className="pool-center-line" />
            <Image src="/INCOG.png" alt="Incog" width={300} height={300} className="pool-logo" priority draggable={false} />

            {pockets.map((pocket, index) => (
              <div
                key={`pocket-${index}`}
                className="pool-pocket"
                style={{
                  left: `${(pocket.x / TABLE_WIDTH) * 100}%`,
                  top: `${(pocket.y / TABLE_HEIGHT) * 100}%`,
                }}
              />
            ))}

            {cueBall && allBallsStopped && (
              <div
                className="cue-ball-ring"
                style={{
                  left: `${(cueBall.x / TABLE_WIDTH) * 100}%`,
                  top: `${(cueBall.y / TABLE_HEIGHT) * 100}%`,
                }}
              />
            )}

            {cueBall && isAiming && aimPoint && (
              <div
                className="aim-line"
                style={{
                  left: `${(cueBall.x / TABLE_WIDTH) * 100}%`,
                  top: `${(cueBall.y / TABLE_HEIGHT) * 100}%`,
                  width: `${(Math.hypot(cueBall.x - aimPoint.x, cueBall.y - aimPoint.y) / TABLE_WIDTH) * 100}%`,
                  transform: `rotate(${Math.atan2(aimPoint.y - cueBall.y, aimPoint.x - cueBall.x)}rad)`,
                }}
              />
            )}

            {balls.filter((ball) => !ball.pocketed).map((ball) => (
              <div
                key={ball.id}
                className="pool-ball"
                style={{
                  left: `${(ball.x / TABLE_WIDTH) * 100}%`,
                  top: `${(ball.y / TABLE_HEIGHT) * 100}%`,
                  background: ball.color,
                }}
              />
            ))}
          </div>
        </div>

        <div className="pool-controls">
          <div className="pool-status">{message}</div>
          <button type="button" className="pool-reset" onClick={resetGame}>
            Reset Rack
          </button>
        </div>
      </div>
    </>
  )
}
