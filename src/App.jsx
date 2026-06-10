import Countdown from './components/Countdown'
import RsvpForm from './components/RsvpForm'
import Petals from './components/Petals'
import FloralSpray from './components/FloralSpray'
import { eventConfig } from './eventConfig'
import './App.css'

function FloralDivider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider-line" />
      <svg viewBox="0 0 24 24" className="divider-flower" fill="none">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="12"
            cy="6.5"
            rx="2.6"
            ry="5"
            fill="#e89ab8"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
        <circle cx="12" cy="12" r="2.6" fill="#f2c75c" />
      </svg>
      <span className="divider-line" />
    </div>
  )
}

function App() {
  const {
    celebrant,
    age,
    title,
    dateISO,
    dateLabel,
    timeLabel,
    venue,
    address,
    dressCode,
    note,
  } = eventConfig

  return (
    <div className="page">
      <Petals />
      <FloralSpray className="spray spray-tl" />
      <FloralSpray className="spray spray-br" />

      <header className="hero">
        <FloralSpray className="spray spray-hero-l" />
        <FloralSpray className="spray spray-hero-r" />

        <p className="hero-eyebrow reveal">{title}</p>
        <div className="monogram reveal" style={{ animationDelay: '0.1s' }}>
          {celebrant.charAt(0)}
        </div>
        <h1 className="hero-name reveal" style={{ animationDelay: '0.2s' }}>
          {celebrant}
        </h1>
        <p className="hero-subtitle reveal" style={{ animationDelay: '0.3s' }}>
          is turning <span className="hero-age">{age}</span>
        </p>
        <FloralDivider />
        <div className="reveal" style={{ animationDelay: '0.4s' }}>
          <Countdown dateISO={dateISO} />
        </div>
        <a
          className="btn btn-primary hero-cta reveal"
          style={{ animationDelay: '0.5s' }}
          href="#rsvp"
        >
          RSVP
        </a>
      </header>

      <main>
        <section className="details" aria-labelledby="details-heading">
          <h2 id="details-heading" className="section-title">
            Celebration Details
          </h2>
          <FloralDivider />
          <div className="detail-grid">
            <DetailCard icon="🌸" title="When">
              <p>{dateLabel}</p>
              <p>{timeLabel}</p>
            </DetailCard>
            <DetailCard icon="🌷" title="Where">
              <p>{venue}</p>
              <p>{address}</p>
            </DetailCard>
            <DetailCard icon="🌿" title="Dress Code">
              <p>{dressCode}</p>
            </DetailCard>
          </div>
          {note && <p className="details-note">“{note}”</p>}
        </section>

        <section id="rsvp" className="rsvp" aria-labelledby="rsvp-heading">
          <FloralSpray className="spray spray-rsvp" />
          <h2 id="rsvp-heading" className="section-title">
            Will You Join Us?
          </h2>
          <FloralDivider />
          <p className="rsvp-intro">
            Kindly respond so we can save you a seat among the flowers.
          </p>
          <RsvpForm />
        </section>
      </main>

      <footer className="footer">
        <FloralDivider />
        <p className="footer-script">With love, {celebrant}</p>
        <p className="footer-sub">Hope to see you on {dateLabel}</p>
      </footer>
    </div>
  )
}

function DetailCard({ icon, title, children }) {
  return (
    <div className="detail-card">
      <span className="detail-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default App
