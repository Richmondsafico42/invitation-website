import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function easeInCubic(t) {
  return t ** 3
}

function getSlideState(progress) {
  const enterEnd = 0.45
  const holdEnd = 0.75

  if (progress < enterEnd) {
    const t = easeOutCubic(progress / enterEnd)
    return { enter: t, hold: 1, exit: 0, opacity: Math.min(t * 1.4, 1) }
  }
  if (progress < holdEnd) {
    return { enter: 1, hold: 1, exit: 0, opacity: 1 }
  }
  const t = easeInCubic((progress - holdEnd) / (1 - holdEnd))
  return { enter: 1, hold: 1 - t, exit: t, opacity: Math.max(0, 1 - t) }
}

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    function update() {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const stickyRange = rect.height - windowH
      if (stickyRange <= 0) {
        setProgress(0)
        ticking = false
        return
      }
      // Start tracking earlier when the section enters the viewport
      const startOffset = windowH * 0.7
      const scrolled = startOffset - rect.top
      const totalRange = stickyRange + startOffset
      const pct = scrolled / totalRange
      setProgress(Math.min(Math.max(pct, 0), 1))
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
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
  
  // Disable heavy blur filters on mobile to prevent extreme layout lag
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const blur = isMobile ? 0 : ((1 - state.enter) * 5 + state.exit * 3)

  // Vertical parallax to create a beautiful diagonal entry/exit path
  const enterY = (1 - state.enter) * 12
  const exitY = -state.exit * 8
  const translateY = -50 + enterY + exitY

  const nameTagClass = side === 'left' ? 'celebrant-name-tag--top-right' : 'celebrant-name-tag--bottom-left'

  return (
    <figure
      className={`celebrant-card celebrant-card--${side}`}
      style={{
        transform: `translate3d(${translateX}vw, ${translateY}%, 0) scale(${scale}) rotate(${rotate}deg)`,
        opacity: state.opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        willChange: 'transform, opacity',
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
        </div>
      </div>
    </figure>
  )
}

export default function CelebrantShowcase({ celebrants = [], age, weddingYears }) {
  const sectionRef = useRef(null)
  const progress = useScrollProgress(sectionRef)


  if (celebrants.length < 2) return null

  const headerOpacity = Math.min(progress * 2.2, 1) * (1 - Math.max(0, (progress - 0.75) * 4))
  const headerY = (1 - Math.min(progress * 2.2, 1)) * 30

  // Disable blur filter on mobile to save performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const headerBlur = isMobile ? 0 : (1 - headerOpacity) * 4

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
            filter: headerBlur > 0 ? `blur(${headerBlur}px)` : 'none',
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
