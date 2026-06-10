import { useEffect, useRef, useState } from 'react'
import FloralSpray from './FloralSpray'

// Floral sprays on both sides that start visible at the top and slide/fade
// outward as the user scrolls down — like curtains parting.
export default function ScrollFlora() {
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const windowH = window.innerHeight
        const p = Math.min(scrollY / (windowH * 0.7), 1)
        setProgress(p)
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const spreadX = progress * 160
  const opacity = 1 - progress
  const scale = 1 + progress * 0.15

  return (
    <div className="scroll-flora" aria-hidden="true">
      <div
        className="scroll-flora-side scroll-flora-left"
        style={{
          transform: `translateX(${-spreadX}px) scale(${scale})`,
          opacity,
        }}
      >
        <FloralSpray />
        <FloralSpray className="scroll-flora-extra" />
        <FloralSpray className="scroll-flora-extra-low" />
      </div>
      <div
        className="scroll-flora-side scroll-flora-right"
        style={{
          transform: `translateX(${spreadX}px) scale(${scale})`,
          opacity,
        }}
      >
        <FloralSpray />
        <FloralSpray className="scroll-flora-extra" />
        <FloralSpray className="scroll-flora-extra-low" />
      </div>
    </div>
  )
}
