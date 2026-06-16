import { useEffect } from 'react'

// Drives continuous scroll-linked parallax across the page.
export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const isMobile = window.innerWidth < 768
    let centers = []

    // Smoothed values for mobile lerp
    let currentScrollY = 0
    let currentProgress = 0
    let currentPink = 1
    let currentBlue = 0
    let rafId = null

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

    function calcTargets() {
      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const docH = document.documentElement.scrollHeight - viewportH
      const progress = docH > 0 ? scrollY / docH : 0

      const viewportCenter = scrollY + viewportH / 2

      let blend = 0

      if (centers.length > 0) {
        if (viewportCenter <= centers[0].y) {
          blend = centers[0].color
        } else if (viewportCenter >= centers[centers.length - 1].y) {
          blend = centers[centers.length - 1].color
        } else {
          for (let i = 0; i < centers.length - 1; i++) {
            const c1 = centers[i]
            const c2 = centers[i + 1]
            if (viewportCenter >= c1.y && viewportCenter <= c2.y) {
              const range = c2.y - c1.y
              const t = range > 0 ? (viewportCenter - c1.y) / range : 0
              const smoothT = t * t * (3 - 2 * t)
              blend = c1.color + smoothT * (c2.color - c1.color)
              break
            }
          }
        }
      }

      return { scrollY, progress, pinkShift: 1 - blend, blueShift: blend }
    }

    function applyValues(scrollY, progress, pinkShift, blueShift) {
      const root = document.documentElement.style
      root.setProperty('--scroll-y', `${scrollY}px`)
      root.setProperty('--scroll-progress', `${progress}`)
      root.setProperty('--pink-shift', pinkShift.toFixed(3))
      root.setProperty('--blue-shift', blueShift.toFixed(3))
    }

    if (isMobile) {
      // Smooth lerp loop on mobile — prevents jitter
      const lerpFactor = 0.1

      function animate() {
        const targets = calcTargets()
        currentScrollY += (targets.scrollY - currentScrollY) * lerpFactor
        currentProgress += (targets.progress - currentProgress) * lerpFactor
        currentPink += (targets.pinkShift - currentPink) * lerpFactor
        currentBlue += (targets.blueShift - currentBlue) * lerpFactor

        applyValues(currentScrollY, currentProgress, currentPink, currentBlue)
        rafId = requestAnimationFrame(animate)
      }

      recalculateCenters()
      const targets = calcTargets()
      currentScrollY = targets.scrollY
      currentProgress = targets.progress
      currentPink = targets.pinkShift
      currentBlue = targets.blueShift
      applyValues(currentScrollY, currentProgress, currentPink, currentBlue)

      rafId = requestAnimationFrame(animate)

      const t1 = setTimeout(recalculateCenters, 150)
      const t2 = setTimeout(recalculateCenters, 600)
      const t3 = setTimeout(recalculateCenters, 1500)

      const onResize = () => recalculateCenters()
      window.addEventListener('resize', onResize)

      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        window.removeEventListener('resize', onResize)
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        document.documentElement.style.removeProperty('--scroll-y')
        document.documentElement.style.removeProperty('--scroll-progress')
        document.documentElement.style.removeProperty('--pink-shift')
        document.documentElement.style.removeProperty('--blue-shift')
      }
    } else {
      // Desktop: direct rAF-throttled
      let ticking = false

      function update() {
        const targets = calcTargets()
        applyValues(targets.scrollY, targets.progress, targets.pinkShift, targets.blueShift)
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
    }
  }, [])

  return null
}

