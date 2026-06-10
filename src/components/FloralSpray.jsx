// Decorative floral spray used in the page corners. Purely ornamental.
export default function FloralSpray({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* stems */}
      <path
        d="M20 180 C 60 150, 70 110, 90 70 M40 175 C 70 150, 110 140, 150 120 M30 178 C 55 165, 75 165, 110 160"
        stroke="#9bbf8a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* leaves */}
      <g className="floral-leaf" fill="#a9cf99">
        <path d="M70 120 C 55 110, 55 90, 72 92 C 80 104, 82 116, 70 120 Z" />
        <path d="M120 140 C 110 126, 122 110, 136 118 C 134 132, 132 142, 120 140 Z" />
        <path d="M55 158 C 44 150, 48 134, 62 140 C 62 150, 64 158, 55 158 Z" />
      </g>
      {/* blossoms */}
      <g className="floral-bloom">
        <Bloom cx={92} cy={62} scale={1.15} petal="#f6a8c4" center="#f5d271" />
        <Bloom cx={150} cy={114} scale={0.85} petal="#f7c0d4" center="#f3cf6b" />
        <Bloom cx={112} cy={150} scale={0.7} petal="#efb7cf" center="#f4d579" />
      </g>
    </svg>
  )
}

function Bloom({ cx, cy, scale = 1, petal, center }) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-12"
          rx="7.5"
          ry="13"
          fill={petal}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle cx="0" cy="0" r="6.5" fill={center} />
    </g>
  )
}
