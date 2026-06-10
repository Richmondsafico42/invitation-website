import { useEffect } from 'react'

// Drives continuous scroll-linked parallax across the page.
export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let centers = []

    function recalculateCenters() {
      const scrollY = window.scrollY
      const newCenters = []
      const elements = [
        { selector: '.hero', targetColor: 0 },
        { selector: '.celebrant-showcase', targetColor: 1 },
        { selector: '.details', targetColor: 0 },
        { selector: '.map-section', targetColor: 1 },
        { selector: '.rsvp', targetColor: 0 },
        { selector: '.footer', targetColor: 0 }
      ]
      for (const elInfo of elements) {
        const el = document.querySelector(elInfo.selector)
        if (el) {
          const rect = el.getBoundingClientRect()
          const center = scrollY + rect.top + rect.height / 2
          newCenters.push({ y: center, color: elInfo.targetColor })
        }
      }
      newCenters.sort((a, b) => a.y - b.y)
      centers = newCenters
    }

    function update() {
      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const docH = document.documentElement.scrollHeight - viewportH
      const progress = docH > 0 ? scrollY / docH : 0

      const viewportCenter = scrollY + viewportH / 2

      let blend = 0 // Default to Pink (0)

      if (centers.length > 0) {
        if (viewportCenter <= centers[0].y) {
          blend = centers[0].color
        } else if (viewportCenter >= centers[centers.length - 1].y) {
          blend = centers[centers.length - 1].color
        } else {
          // Interpolate color blend factor between the two sections framing the viewport center
          for (let i = 0; i < centers.length - 1; i++) {
            const c1 = centers[i]
            const c2 = centers[i + 1]
            if (viewportCenter >= c1.y && viewportCenter <= c2.y) {
              const range = c2.y - c1.y
              const t = range > 0 ? (viewportCenter - c1.y) / range : 0
              // Use smoothstep for a softer, more organic transition
              const smoothT = t * t * (3 - 2 * t)
              blend = c1.color + smoothT * (c2.color - c1.color)
              break
            }
          }
        }
      }

      // Convert blend (0 = Pink, 1 = Blue) to shift values
      const pinkShift = 1 - blend
      const blueShift = blend

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

    function onResize() {
      recalculateCenters()
      update()
    }

    recalculateCenters()
    update()

    const t1 = setTimeout(recalculateCenters, 150)
    const t2 = setTimeout(recalculateCenters, 600)
    const t3 = setTimeout(recalculateCenters, 1500)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      document.documentElement.style.removeProperty('--scroll-y')
      document.documentElement.style.removeProperty('--scroll-progress')
      document.documentElement.style.removeProperty('--pink-shift')
      document.documentElement.style.removeProperty('--blue-shift')
    }
  }, [])

  return null
}
