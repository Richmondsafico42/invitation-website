import { useState, useEffect } from 'react'

export default function MiniCountdown({ targetDate, prefix = "Time remaining:" }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const total = Math.max(0, new Date(targetDate).getTime() - Date.now())
    return total
  })

  useEffect(() => {
    const id = setInterval(() => {
      const total = Math.max(0, new Date(targetDate).getTime() - Date.now())
      setTimeLeft(total)
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (timeLeft <= 0) {
    return <span className="mini-countdown expired" style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}>RSVP Closed (Deadline passed)</span>
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60)
  const seconds = Math.floor((timeLeft / 1000) % 60)

  return (
    <span className="mini-countdown" style={{ fontSize: '0.9rem', letterSpacing: '0.04em' }}>
      {prefix} <strong style={{ color: 'var(--rose-deep)', fontFamily: 'monospace', fontSize: '0.95rem' }}>{days}d {hours}h {minutes}m {seconds}s</strong>
    </span>
  )
}
