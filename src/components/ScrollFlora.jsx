import { useEffect, useRef, useState } from 'react'
import FloralSpray from './FloralSpray'

export default function ScrollFlora() {
  const [progress, setProgress] = useState({ enter: 0, page: 0 })
  const ticking = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const windowH = window.innerHeight
        const docH = document.documentElement.scrollHeight - windowH
        const pageProgress = docH > 0 ? scrollY / docH : 0
        const enterProgress = Math.min(scrollY / (windowH * 0.65), 1)
        setProgress({ enter: enterProgress, page: pageProgress })
        ticking.current = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const spreadX = progress.enter * 220
  const spreadY = progress.enter * 40
  const opacity = Math.max(0, 1 - progress.enter * 1.1)
  const scale = 1 + progress.enter * 0.22
  const rotate = progress.enter * 12
  const pageDrift = progress.page * 30

  return (
    <div className="scroll-flora" aria-hidden="true">
      <div
        className="scroll-flora-side scroll-flora-left"
        style={{
          transform: `translate(${-spreadX}px, ${spreadY + pageDrift}px) scale(${scale}) rotate(${-rotate}deg)`,
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
          transform: `translate(${spreadX}px, ${spreadY + pageDrift}px) scale(${scale}) rotate(${rotate}deg)`,
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
