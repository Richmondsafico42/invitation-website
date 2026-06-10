import { useEffect, useState } from 'react'

function getTimeLeft(target) {
  const total = Math.max(0, new Date(target).getTime() - Date.now())
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((total / (1000 * 60)) % 60)
  const seconds = Math.floor((total / 1000) % 60)
  return { total, days, hours, minutes, seconds }
}

export default function Countdown({ dateISO }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(dateISO))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(dateISO)), 1000)
    return () => clearInterval(id)
  }, [dateISO])

  if (timeLeft.total <= 0) {
    return <p className="countdown-live">The celebration has begun! 🎉</p>
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="countdown" aria-label="Time until the party">
      {units.map((u) => (
        <div className="countdown-unit" key={u.label}>
          <span className="countdown-value">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="countdown-label">{u.label}</span>
        </div>
      ))}
    </div>
  )
}
