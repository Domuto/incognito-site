'use client'

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

const DESKTOP_TABLE_WIDTH = 1100
const DESKTOP_TABLE_HEIGHT = 620
const MOBILE_TABLE_WIDTH = 620
const MOBILE_TABLE_HEIGHT = 1100
const BALL_RADIUS = 13
const DESKTOP_POCKET_RADIUS = 38
const MOBILE_POCKET_RADIUS = 44
const FRICTION_PER_FRAME = 0.996
const WALL_BOUNCE = -0.97

function createPockets(tableWidth: number, tableHeight: number) {
  return [
    { x: 20, y: 20 },
    { x: tableWidth / 2, y: 12 },
    { x: tableWidth - 20, y: 20 },
    { x: 20, y: tableHeight - 20 },
    { x: tableWidth / 2, y: tableHeight - 12 },
    { x: tableWidth - 20, y: tableHeight - 20 },
  ]
}

function getCueStart(isMobileLayout: boolean, tableWidth: number, tableHeight: number) {
  return isMobileLayout
    ? { x: tableWidth / 2, y: tableHeight - 92 }
    : { x: 250, y: tableHeight / 2 }
}

function createBalls(isMobileLayout: boolean, tableWidth: number, tableHeight: number): Ball[] {
  const step = BALL_RADIUS * 2 + 1
  const ids = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
  ]
  const colors = [
    '#f2c037',
    '#3f7fe7',
    '#d53b2d',
    '#6642a6',
    '#ef9834',
    '#2f9c5b',
    '#7a2d26',
    '#222222',
    '#f3e16d',
    '#6db8ff',
    '#ef7266',
    '#9f78dc',
    '#6bc178',
    '#eeac5c',
    '#5b97d4',
  ]

  const cueStart = getCueStart(isMobileLayout, tableWidth, tableHeight)
  const rackBalls: Ball[] = []
  let colorIndex = 0

  if (isMobileLayout) {
    // Mobile uses a smaller rack so it feels cleaner and more natural on the narrow felt.
    const rackStart = { x: tableWidth / 2, y: 210 }

    for (let row = 0; row < 4; row += 1) {
      const ballsInRow = 4 - row
      for (let slot = 0; slot < ballsInRow; slot += 1) {
        const offset = (slot - (ballsInRow - 1) / 2) * BALL_RADIUS * 2
        rackBalls.push({
          id: ids[colorIndex],
          x: rackStart.x + offset,
          y: rackStart.y + row * step,
          vx: 0,
          vy: 0,
          color: colors[colorIndex],
          pocketed: false,
        })
        colorIndex += 1
      }
    }
  } else {
    const rackStart = { x: 770, y: tableHeight / 2 }

    for (let row = 0; row < 5; row += 1) {
      for (let slot = 0; slot <= row; slot += 1) {
        const offset = (slot - row / 2) * BALL_RADIUS * 2
        rackBalls.push({
          id: ids[colorIndex],
          x: rackStart.x + row * step,
          y: rackStart.y + offset,
          vx: 0,
          vy: 0,
          color: colors[colorIndex],
          pocketed: false,
        })
        colorIndex += 1
      }
    }
  }

  return [
    { id: 'cue', x: cueStart.x, y: cueStart.y, vx: 0, vy: 0, color: '#f6f7f2', pocketed: false, isCue: true },
    ...rackBalls,
  ]
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function PoolPage() {
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const [balls, setBalls] = useState<Ball[]>(() =>
    createBalls(false, DESKTOP_TABLE_WIDTH, DESKTOP_TABLE_HEIGHT)
  )
  const [isAiming, setIsAiming] = useState(false)
  const [aimPoint, setAimPoint] = useState<{ x: number; y: number } | null>(null)
  const [message, setMessage] = useState('Drag from cue ball to shoot.')

  const tableRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const tableWidth = isMobileLayout ? MOBILE_TABLE_WIDTH : DESKTOP_TABLE_WIDTH
  const tableHeight = isMobileLayout ? MOBILE_TABLE_HEIGHT : DESKTOP_TABLE_HEIGHT
  const pocketRadius = isMobileLayout ? MOBILE_POCKET_RADIUS : DESKTOP_POCKET_RADIUS
  const pockets = useMemo(() => createPockets(tableWidth, tableHeight), [tableWidth, tableHeight])

  const cueBall = useMemo(() => balls.find((ball) => ball.isCue && !ball.pocketed) ?? null, [balls])
  const targetsRemaining = useMemo(() => balls.filter((ball) => !ball.isCue && !ball.pocketed).length, [balls])
  const allBallsStopped = useMemo(
    () => balls.every((ball) => ball.pocketed || Math.hypot(ball.vx, ball.vy) < 0.08),
    [balls]
  )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')

    const applyLayout = (mobile: boolean) => {
      const width = mobile ? MOBILE_TABLE_WIDTH : DESKTOP_TABLE_WIDTH
      const height = mobile ? MOBILE_TABLE_HEIGHT : DESKTOP_TABLE_HEIGHT

      setIsMobileLayout(mobile)
      setBalls(createBalls(mobile, width, height))
      setIsAiming(false)
      setAimPoint(null)
      setMessage('Fresh rack. Drag from cue ball to shoot.')
    }

    applyLayout(media.matches)

    const onChange = (event: MediaQueryListEvent) => {
      applyLayout(event.matches)
    }

    media.addEventListener('change', onChange)

    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [])

  useEffect(() => {
    if (targetsRemaining === 0) {
      setMessage('Table cleared. Rack again.')
    } else if (allBallsStopped) {
      setMessage('Drag from cue ball to shoot.')
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

          const friction = Math.pow(FRICTION_PER_FRAME, delta)
          ball.vx *= friction
          ball.vy *= friction

          if (Math.abs(ball.vx) < 0.01) ball.vx = 0
          if (Math.abs(ball.vy) < 0.01) ball.vy = 0

          if (ball.x <= BALL_RADIUS) {
            ball.x = BALL_RADIUS
            ball.vx *= WALL_BOUNCE
          }
          if (ball.x >= tableWidth - BALL_RADIUS) {
            ball.x = tableWidth - BALL_RADIUS
            ball.vx *= WALL_BOUNCE
          }
          if (ball.y <= BALL_RADIUS) {
            ball.y = BALL_RADIUS
            ball.vy *= WALL_BOUNCE
          }
          if (ball.y >= tableHeight - BALL_RADIUS) {
            ball.y = tableHeight - BALL_RADIUS
            ball.vy *= WALL_BOUNCE
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
            const tx = -ny
            const ty = nx
            const aTangent = a.vx * tx + a.vy * ty
            const bTangent = b.vx * tx + b.vy * ty

            a.vx = bNormal * nx + aTangent * tx
            a.vy = bNormal * ny + aTangent * ty
            b.vx = aNormal * nx + bTangent * tx
            b.vy = aNormal * ny + bTangent * ty
          }
        }

        nextBalls.forEach((ball) => {
          if (ball.pocketed) return

          const isPocketed = pockets.some(
            (pocket) => Math.hypot(ball.x - pocket.x, ball.y - pocket.y) <= pocketRadius
          )
          if (!isPocketed) return

          if (ball.isCue) {
            const cueStart = getCueStart(isMobileLayout, tableWidth, tableHeight)
            ball.x = cueStart.x
            ball.y = cueStart.y
            ball.vx = 0
            ball.vy = 0
            nextMessage = 'Scratch. Cue reset.'
            return
          }

          ball.pocketed = true
          ball.vx = 0
          ball.vy = 0
          nextMessage = 'Nice shot.'
        })

        return nextBalls
      })

      if (nextMessage) setMessage(nextMessage)
      animationRef.current = requestAnimationFrame(step)
    }

    animationRef.current = requestAnimationFrame(step)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isMobileLayout, pocketRadius, pockets, tableHeight, tableWidth])

  const getTablePoint = (clientX: number, clientY: number) => {
    const table = tableRef.current
    if (!table) return null

    const rect = table.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * tableWidth
    const y = ((clientY - rect.top) / rect.height) * tableHeight

    return {
      x: clamp(x, 0, tableWidth),
      y: clamp(y, 0, tableHeight),
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cueBall || !allBallsStopped) return

    const point = getTablePoint(event.clientX, event.clientY)
    if (!point) return

    const grabRadius = isMobileLayout ? BALL_RADIUS * 4.4 : BALL_RADIUS * 3
    const dist = Math.hypot(point.x - cueBall.x, point.y - cueBall.y)
    if (dist > grabRadius) return

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

    if (distance < 10) return

    const speed = Math.min(distance * 0.14, isMobileLayout ? 52 : 46)

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
    setBalls(createBalls(isMobileLayout, tableWidth, tableHeight))
    setIsAiming(false)
    setAimPoint(null)
    setMessage('Fresh rack. Drag from cue ball to shoot.')
  }

  return (
    <>
      <style>{`
        .pool-stage {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 64px 14px 14px;
          background:
            radial-gradient(circle at 18% 10%, rgba(41, 98, 167, 0.32), transparent 38%),
            radial-gradient(circle at 86% 88%, rgba(10, 28, 49, 0.5), transparent 46%),
            #081425;
          background-attachment: fixed;
          overflow: auto;
        }

        .pool-back {
          position: fixed;
          top: 18px;
          left: 18px;
          z-index: 30;
          color: rgba(245, 240, 232, 0.82);
          text-decoration: none;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.18em;
          font-size: 14px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
        }

        .pool-back:hover {
          color: #f5f0e8;
        }

        .pool-table-wrap {
          width: min(96vw, 1320px);
        }

        .pool-table {
          position: relative;
          width: 100%;
          aspect-ratio: 1298 / 760;
          background-image: url('/Untitled-1.png');
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
          box-shadow:
            0 24px 64px rgba(0, 0, 0, 0.56),
            0 0 0 1px rgba(84, 155, 255, 0.2);
          user-select: none;
          -webkit-user-select: none;
        }

        .pool-playfield {
          position: absolute;
          top: 6%;
          right: 5.1%;
          bottom: 6%;
          left: 5.1%;
          border-radius: 10px;
          touch-action: none;
          cursor: crosshair;
        }

        .pool-ball {
          position: absolute;
          width: 26px;
          height: 26px;
          margin-left: -13px;
          margin-top: -13px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.58);
          box-shadow:
            inset -4px -4px 10px rgba(0, 0, 0, 0.34),
            inset 3px 3px 8px rgba(255, 255, 255, 0.22),
            0 3px 8px rgba(0, 0, 0, 0.25);
          z-index: 12;
          pointer-events: none;
        }

        .cue-ball-ring {
          position: absolute;
          width: 48px;
          height: 48px;
          margin-left: -24px;
          margin-top: -24px;
          border-radius: 999px;
          border: 2px dashed rgba(255, 255, 255, 0.46);
          box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.08);
          z-index: 13;
          pointer-events: none;
        }

        .aim-line {
          position: absolute;
          height: 3px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.45));
          transform-origin: left center;
          z-index: 13;
          pointer-events: none;
        }

        .pool-ui {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Space Mono', monospace;
          color: rgba(245, 240, 232, 0.82);
          padding: 10px 14px;
          border: 1px solid rgba(130, 171, 228, 0.22);
          background: linear-gradient(180deg, rgba(7, 19, 38, 0.62), rgba(4, 14, 31, 0.66));
          backdrop-filter: blur(2px);
        }

        .pool-status {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(224, 234, 250, 0.95);
        }

        .pool-reset {
          appearance: none;
          border: 1px solid rgba(245, 240, 232, 0.48);
          background: rgba(245, 240, 232, 0.08);
          color: #f5f0e8;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 14px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .pool-reset:hover {
          background: rgba(245, 240, 232, 0.18);
          border-color: rgba(245, 240, 232, 0.8);
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .pool-stage {
            justify-content: flex-start;
            padding: 56px 8px 14px;
            gap: 8px;
          }

          .pool-back {
            top: 14px;
            left: 14px;
            font-size: 12px;
          }

          .pool-table-wrap {
            width: min(92vw, calc((100dvh - 170px) * 0.586));
          }

          .pool-table {
            aspect-ratio: 760 / 1298;
            background-image: url('/s1.png');
            max-height: calc(100dvh - 170px);
          }

          .pool-playfield {
            top: 6.15%;
            right: 6.7%;
            bottom: 6.15%;
            left: 6.7%;
          }

          .pool-ball {
            width: 28px;
            height: 28px;
            margin-left: -14px;
            margin-top: -14px;
          }

          .pool-ui {
            gap: 8px;
            flex-wrap: wrap;
            padding: 8px 10px;
          }

          .pool-status {
            font-size: 11px;
          }

          .pool-reset {
            font-size: 10px;
            padding: 8px 11px;
          }
        }
      `}</style>

      <main className="pool-stage">
        <Link href="/" className="pool-back">
          ← BACK
        </Link>

        <div className="pool-table-wrap">
          <section className="pool-table" aria-label="Playable pool table with center logo">
            <div
              ref={tableRef}
              className="pool-playfield"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {cueBall && allBallsStopped && (
                <div
                  className="cue-ball-ring"
                  style={{
                    left: `${(cueBall.x / tableWidth) * 100}%`,
                    top: `${(cueBall.y / tableHeight) * 100}%`,
                  }}
                />
              )}

              {cueBall && isAiming && aimPoint && (
                <div
                  className="aim-line"
                  style={{
                    left: `${(cueBall.x / tableWidth) * 100}%`,
                    top: `${(cueBall.y / tableHeight) * 100}%`,
                    width: `${(Math.hypot(cueBall.x - aimPoint.x, cueBall.y - aimPoint.y) / tableWidth) * 100}%`,
                    transform: `rotate(${Math.atan2(aimPoint.y - cueBall.y, aimPoint.x - cueBall.x)}rad)`,
                  }}
                />
              )}

              {balls.filter((ball) => !ball.pocketed).map((ball) => (
                <div
                  key={ball.id}
                  className="pool-ball"
                  style={{
                    left: `${(ball.x / tableWidth) * 100}%`,
                    top: `${(ball.y / tableHeight) * 100}%`,
                    background: ball.color,
                  }}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="pool-ui">
          <div className="pool-status">{message}</div>
          <button type="button" className="pool-reset" onClick={resetGame}>
            Reset Rack
          </button>
        </div>
      </main>
    </>
  )
}
