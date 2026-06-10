import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function easeInCubic(t) {
  return t ** 3
}

function getSlideState(progress) {
  const enterEnd = 0.38
  const holdEnd = 0.58

  if (progress < enterEnd) {
    const t = easeOutCubic(progress / enterEnd)
    return { enter: t, hold: 1, exit: 0, opacity: Math.min(t * 1.4, 1) }
  }
  if (progress < holdEnd) {
    return { enter: 1, hold: 1, exit: 0, opacity: 1 }
  }
  const t = easeInCubic((progress - holdEnd) / (1 - holdEnd))
  return { enter: 1, hold: 1 - t, exit: t, opacity: 1 - t * 0.85 }
}

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const total = rect.height + windowH
      const scrolled = windowH - rect.top
      setProgress(Math.min(Math.max(scrolled / total, 0), 1))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return progress
}

/* Decorative floral cluster for the showcase name box */
function FloralCorner({ position }) {
  const styles = {
    'top-left': { top: -18, left: -16, transform: 'rotate(-8deg)' },
    'top-right': { top: -18, right: -16, transform: 'scaleX(-1) rotate(-8deg)' },
    'bottom-left': { bottom: -18, left: -16, transform: 'scaleY(-1) rotate(-8deg)' },
    'bottom-right': { bottom: -18, right: -16, transform: 'scale(-1) rotate(-8deg)' },
  }
  return (
    <svg
      className="floral-corner"
      style={{ position: 'absolute', width: 92, height: 92, ...styles[position] }}
      viewBox="0 0 92 92"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`rose-${position}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fff7fb" />
          <stop offset="55%" stopColor="#f6c8dc" />
          <stop offset="100%" stopColor="#d88ab0" />
        </radialGradient>
        <radialGradient id={`bud-${position}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fffaf4" />
          <stop offset="50%" stopColor="#ecd2f7" />
          <stop offset="100%" stopColor="#b48fd3" />
        </radialGradient>
      </defs>
      <path d="M14 81 C25 61 31 42 36 18" stroke="#88a17d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M27 82 C34 64 39 48 49 26" stroke="#9ab08d" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M34 34 C28 26 20 28 16 38 C24 40 31 40 34 34 Z" fill="#7fa16b" opacity="0.95" />
      <path d="M43 48 C39 38 46 31 56 32 C56 40 52 47 43 48 Z" fill="#8cae77" opacity="0.95" />
      <path d="M24 58 C18 49 10 50 8 61 C16 64 23 64 24 58 Z" fill="#9eb98b" opacity="0.82" />
      <g transform="translate(38 20)">
        <ellipse cx="9" cy="13" rx="7" ry="12" fill={`url(#rose-${position})`} />
        <ellipse cx="19" cy="16" rx="7" ry="12" fill={`url(#rose-${position})`} transform="rotate(42 19 16)" />
        <ellipse cx="7" cy="25" rx="7" ry="12" fill={`url(#rose-${position})`} transform="rotate(-32 7 25)" />
        <ellipse cx="20" cy="28" rx="8" ry="13" fill={`url(#rose-${position})`} transform="rotate(24 20 28)" />
        <ellipse cx="31" cy="19" rx="7" ry="11" fill={`url(#bud-${position})`} transform="rotate(18 31 19)" />
        <circle cx="15" cy="20" r="5.5" fill="#ffd979" />
        <circle cx="15" cy="20" r="2.4" fill="#e5aa49" />
      </g>
      <g transform="translate(18 8)">
        <ellipse cx="10" cy="12" rx="5.2" ry="9" fill={`url(#bud-${position})`} transform="rotate(-18 10 12)" />
        <ellipse cx="18" cy="18" rx="4.6" ry="8" fill="#f2dbee" transform="rotate(18 18 18)" />
      </g>
    </svg>
  )
}

function CelebrantPhoto({ person, side, progress }) {
  const state = getSlideState(progress)
  const fromSide = side === 'left' ? -1 : 1
  const enterX = (1 - state.enter) * fromSide * 48
  const exitX = state.exit * fromSide * 34
  const translateX = enterX + exitX
  const scale = 0.9 + state.enter * 0.12 - state.exit * 0.08
  const rotate = fromSide * (4 * (1 - state.enter) - 4 * state.exit)
  const blur = (1 - state.enter) * 5 + state.exit * 3

  return (
    <figure
      className={`celebrant-card celebrant-card--${side}`}
      style={{
        transform: `translate(${translateX}vw, -50%) scale(${scale}) rotate(${rotate}deg)`,
        opacity: state.opacity,
        filter: `blur(${blur}px)`,
      }}
    >
      <div className="celebrant-frame">
        <img
          src={person.photo}
          alt={person.fullName || person.name}
          className="celebrant-photo"
          loading="eager"
          decoding="async"
        />
      </div>
    </figure>
  )
}

export default function CelebrantShowcase({ celebrants = [], age, weddingYears }) {
  const sectionRef = useRef(null)
  const progress = useScrollProgress(sectionRef)
  const slideState = getSlideState(progress)

  if (celebrants.length < 2) return null

  const headerOpacity = Math.min(progress * 3, 1) * (1 - Math.max(0, (progress - 0.7) * 3))
  const headerY = (1 - Math.min(progress * 2.5, 1)) * 30

  return (
    <section
      ref={sectionRef}
      className="celebrant-showcase"
      aria-labelledby="celebrants-heading"
    >
      <div className="celebrant-showcase-sticky">
        <h2
          id="celebrants-heading"
          className="section-title celebrant-showcase-title"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            filter: `blur(${(1 - headerOpacity) * 4}px)`,
          }}
        >
          Our Celebrants
        </h2>
        <p
          className="celebrant-showcase-sub"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY * 0.6}px)`,
          }}
        >
          Celebrating a <strong>{age}th birthday</strong><br />
          and <strong>{weddingYears} years</strong> of wedding anniversary
        </p>

        <div className="celebrant-stage" aria-hidden={progress < 0.05 || progress > 0.95}>
          {/* Left — Mel's photo pushed to the very edge */}
          <CelebrantPhoto person={celebrants[0]} side="left" progress={progress} />

          {/* Center — Names block with decorative flowers */}
          <div
            className="celebrant-center-names"
            style={{
              opacity: slideState.opacity,
              transform: `scale(${0.5 + slideState.enter * 0.5}) rotate(${(1 - slideState.enter) * 20}deg)`,
              filter: `blur(${(1 - slideState.enter) * 3}px)`,
            }}
          >
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />
            <FloralCorner position="bottom-left" />
            <FloralCorner position="bottom-right" />
            <div className="celebrant-center-primary">
              <span className="celebrant-name celebrant-name--left">{celebrants[0].name}</span>
              <span className="celebrant-ampersand">&</span>
              <span className="celebrant-name celebrant-name--right">{celebrants[1].name}</span>
            </div>
            <div className="celebrant-center-secondary" aria-label="Full names">
              <span className="celebrant-fullname">{celebrants[0].fullName || celebrants[0].name}</span>
              <span className="celebrant-fullname">{celebrants[1].fullName || celebrants[1].name}</span>
            </div>
          </div>

          {/* Right — Vic's photo pushed to the very edge */}
          <CelebrantPhoto person={celebrants[1]} side="right" progress={progress} />
        </div>

        <p className="celebrant-scroll-hint" style={{ opacity: Math.max(0, 1 - progress * 2.5) }}>
          Scroll to meet them
        </p>
      </div>
    </section>
  )
}
