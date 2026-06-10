import { useEffect, useRef } from 'react'

export default function ScrollReveal({
  children,
  className = '',
  as: Tag = 'div',
  mode = 'cine',
  ...props
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)

    // Safety fallback — never leave content invisible
    const fallback = window.setTimeout(() => {
      el.classList.add('visible')
    }, 2500)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal scroll-reveal--${mode} ${className}`.trim()}
      data-mode={mode}
      {...props}
    >
      {children}
    </Tag>
  )
}
