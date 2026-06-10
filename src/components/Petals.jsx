import { useState } from 'react'

const COLORS = ['#c8a8e0', '#b8c4e8', '#e0b8d8', '#a890d4', '#d4c0ec', '#9eaad8', '#f0d8ef']

function buildPetals(count) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 9 + Math.random() * 10,
    size: 10 + Math.random() * 14,
    drift: -40 + Math.random() * 80,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
  }))
}

// Floating flower petals that drift down the page.
export default function Petals({ count = 22 }) {
  const [petals] = useState(() => buildPetals(count))

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.25}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
