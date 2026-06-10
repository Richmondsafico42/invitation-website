import Countdown from './components/Countdown'
import RsvpForm from './components/RsvpForm'
import Petals from './components/Petals'
import FloralSpray from './components/FloralSpray'
import ScrollFlora from './components/ScrollFlora'
import VenueMap from './components/VenueMap'
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
    celebrants,
    age,
    title,
    dateISO,
    dateLabel,
    timeLabel,
    venue,
    address,
    dressCode,
    note,
    mapLat,
    mapLng,
    mapZoom,
  } = eventConfig

  const names = celebrants.join(' & ')
  const initials = celebrants.map((n) => n.charAt(0)).join(' & ')

  return (
    <div className="page">
      <Petals />
      <ScrollFlora />

      <header className="hero">
        <FloralSpray className="spray spray-hero-l" />
        <FloralSpray className="spray spray-hero-r" />

        <p className="hero-eyebrow cine" style={{ '--d': '0s' }}>
          {title}
        </p>
        <div className="monogram cine" style={{ '--d': '0.2s' }}>
          {initials}
        </div>
        <h1 className="hero-name cine" style={{ '--d': '0.45s' }}>
          {names}
        </h1>
        <p className="hero-subtitle cine" style={{ '--d': '0.65s' }}>
          are turning <span className="hero-age">{age}</span>
        </p>
        <FloralDivider />
        <div className="cine" style={{ '--d': '0.85s' }}>
          <Countdown dateISO={dateISO} />
        </div>
        <a
          className="btn btn-primary hero-cta cine"
          style={{ '--d': '1.1s' }}
          href="#rsvp"
        >
          RSVP
        </a>
      </header>

      <main>
        <section className="details fade-section" aria-labelledby="details-heading">
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
          {note && <p className="details-note">"{note}"</p>}
        </section>

        <section className="map-section fade-section" aria-labelledby="map-heading">
          <h2 id="map-heading" className="section-title">
            Find Us Here
          </h2>
          <FloralDivider />
          <VenueMap
            lat={mapLat}
            lng={mapLng}
            zoom={mapZoom}
            venue={venue}
            address={address}
          />
        </section>

        <section id="rsvp" className="rsvp fade-section" aria-labelledby="rsvp-heading">
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
        <p className="footer-script">With love, {names}</p>
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
