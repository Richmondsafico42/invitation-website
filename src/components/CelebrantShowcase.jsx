import { useEffect, useRef, useState, useCallback } from 'react'
import leftVines from '../assets/left-vines.svg'
import rightVines from '../assets/right-vines.svg'

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

/**
 * Uses IntersectionObserver to detect when the section is visible.
 * When visible (snapped into view), it animates progress from 0 → 0.55 (fully entered + hold).
 * When leaving, it animates back out.
 */
function useVisibilityProgress(ref) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const animRef = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Consider visible when at least 40% of section is in view
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.3)
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  // Animate progress smoothly when visibility changes
  useEffect(() => {
    const targetProgress = isVisible ? 0.55 : 0
    let startTime = null
    const duration = isVisible ? 1200 : 600 // slower enter, faster exit
    const startProgress = progress

    if (animRef.current) cancelAnimationFrame(animRef.current)

    function animate(timestamp) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = isVisible ? easeOutCubic(t) : easeInCubic(t)
      const current = startProgress + (targetProgress - startProgress) * eased
      setProgress(current)

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isVisible])

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

function CelebrantVines({ side, progress }) {
  // Delay vines: they appear later than the celebrant photos
  const delayedProgress = Math.max(0, (progress - 0.15) / 0.85)
  const state = getSlideState(delayedProgress)
  const fromSide = side === 'left' ? -1 : 1
  const enterX = (1 - state.enter) * fromSide * 38
  const exitX = state.exit * fromSide * 30
  const translateX = enterX + exitX
  const scale = 0.9 + state.enter * 0.1 - state.exit * 0.1

  const enterY = (1 - state.enter) * 12
  const exitY = -state.exit * 8
  const translateY = enterY + exitY

  const src = side === 'left' ? leftVines : rightVines

  return (
    <img
      src={src}
      className={`celebrant-vines celebrant-vines--${side}`}
      style={{
        position: 'absolute',
        bottom: '-28%',
        [side]: '-8vw',
        width: 'clamp(200px, 38vw, 400px)',
        transform: `translate3d(${translateX}vw, ${translateY}%, 0) scale(${scale})`,
        opacity: state.opacity * 0.65,
        willChange: 'transform, opacity',
        zIndex: 1,
      }}
      alt=""
      role="presentation"
    />
  )
}

export default function CelebrantShowcase({ celebrants = [], age, weddingYears }) {
  const sectionRef = useRef(null)
  const progress = useVisibilityProgress(sectionRef)


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

          <CelebrantVines side="left" progress={progress} />
          <CelebrantVines side="right" progress={progress} />
        </div>

        <p
          className="hero-officiating-text"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '280px',
            opacity: Math.max(0, (progress - 0.4) * 2),
            fontStyle: 'italic', color: '#5b3a7a', fontWeight: 500, margin: '0', fontSize: '1rem', lineHeight: '1.6', textAlign: 'center', zIndex: 10, padding: '0', textShadow: '0 0 8px rgba(255,255,255,0.9)'
          }}
        >
          Join us as we renew our vows and<br/>
          celebrate a love strengthened<br/>
          by time, faith, and God's grace.<br/>
          <span style={{ fontWeight: 600, display: 'block', marginTop: '1rem', color: '#5b3a7a' }}>
            Officiating Minister:<br/>
            Ptr. Jeremiah Abay
          </span>
        </p>

        <div className="celebrant-scroll-hint" style={{ opacity: Math.max(0, 1 - progress * 2.5) }}>
          <span className="scroll-hint-text">Scroll for more</span>
          <div className="mouse-indicator">
            <div className="mouse-wheel"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
