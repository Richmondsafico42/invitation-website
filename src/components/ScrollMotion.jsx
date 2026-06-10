import { useEffect } from 'react'

// Drives continuous scroll-linked parallax across the page.
export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false

    function update() {
      const scrollY = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const progress = docH > 0 ? scrollY / docH : 0
      const pinkShift = Math.min(progress / 0.42, 1)
      const blueShift = progress <= 0.42 ? 0 : Math.min((progress - 0.42) / 0.58, 1)

      document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`)
      document.documentElement.style.setProperty('--scroll-progress', `${progress}`)
      document.documentElement.style.setProperty('--pink-shift', pinkShift.toFixed(3))
      document.documentElement.style.setProperty('--blue-shift', blueShift.toFixed(3))

      ticking = false
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.documentElement.style.removeProperty('--scroll-y')
      document.documentElement.style.removeProperty('--scroll-progress')
      document.documentElement.style.removeProperty('--pink-shift')
      document.documentElement.style.removeProperty('--blue-shift')
    }
  }, [])

  return null
}
