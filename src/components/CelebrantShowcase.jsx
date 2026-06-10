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


function CelebrantPhoto({ person, side, progress }) {
  const state = getSlideState(progress)
  const fromSide = side === 'left' ? -1 : 1
  const enterX = (1 - state.enter) * fromSide * 48
  const exitX = state.exit * fromSide * 34
  const translateX = enterX + exitX
  const scale = 0.9 + state.enter * 0.12 - state.exit * 0.08
  const rotate = fromSide * (4 * (1 - state.enter) - 4 * state.exit)
  const blur = (1 - state.enter) * 5 + state.exit * 3

  const nameTagClass = side === 'left' ? 'celebrant-name-tag--top-right' : 'celebrant-name-tag--bottom-left'

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
        <div className={`celebrant-name-tag ${nameTagClass}`}>
          <span className="celebrant-tag-name">{person.fullName || person.name}</span>
          <span className="celebrant-tag-role">{person.tagline}</span>
        </div>
      </div>
    </figure>
  )
}

export default function CelebrantShowcase({ celebrants = [], age, weddingYears }) {
  const sectionRef = useRef(null)
  const progress = useScrollProgress(sectionRef)


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
