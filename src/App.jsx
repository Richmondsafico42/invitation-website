import Countdown from './components/Countdown'
import RsvpForm from './components/RsvpForm'
import Petals from './components/Petals'
import FloralSpray from './components/FloralSpray'
import ScrollFlora from './components/ScrollFlora'
import ScrollMotion from './components/ScrollMotion'
import ScrollReveal from './components/ScrollReveal'
import CelebrantShowcase from './components/CelebrantShowcase'
import VenueMap from './components/VenueMap'
import { eventConfig } from './eventConfig'
import togetherPhoto from './assets/together.svg'
import topLeftDesign from './assets/left.svg'
import topRightDesign from './assets/right.svg'
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
            fill="#c8a8e0"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
        <circle cx="12" cy="12" r="2.6" fill="#9eaad8" />
      </svg>
      <span className="divider-line" />
    </div>
  )
}

function DetailRow({ icon, label, children, index, from }) {
  return (
    <div
      className="detail-row reveal-item"
      data-from={from}
      style={{ '--i': index }}
    >
      <span className="detail-row-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="detail-row-content">
        <h3 className="detail-row-label">{label}</h3>
        {children}
      </div>
    </div>
  )
}

function App() {
  const {
    celebrants,
    celebrantProfiles,
    age,
    weddingYears,
    title,
    subtitle,
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
    <>
      <div className="top-corner-designs" aria-hidden="true">
        <img src={topLeftDesign} alt="" className="top-design top-design--left" />
        <img src={topRightDesign} alt="" className="top-design top-design--right" />
      </div>

      <div className="page">
        <ScrollMotion />
        <Petals />
        <ScrollFlora />

      <header className="hero hero-parallax">
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
          {subtitle}
        </p>

        {/* ── Combined celebrants photo ── */}
        <div
          className="hero-couple-photo cine"
          style={{ '--d': '0.75s' }}
        >
          <img
            src={togetherPhoto}
            alt={`${celebrants.join(' and ')} together`}
            className="hero-couple-img"
          />
        </div>

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
        <CelebrantShowcase celebrants={celebrantProfiles} age={age} weddingYears={weddingYears} />

        <section className="details" aria-labelledby="details-heading">
          <ScrollReveal className="details-invitation" mode="stagger">
            <FloralSpray className="spray spray-details-l" />
            <FloralSpray className="spray spray-details-r" />

            <p id="details-heading" className="details-eyebrow reveal-item" style={{ '--i': 0 }}>
              The Occasion
            </p>
            <h2 className="details-title reveal-item reveal-glow" style={{ '--i': 1 }}>
              Celebration Details
            </h2>
            <div className="reveal-item" style={{ '--i': 2 }}>
              <FloralDivider />
            </div>

            <div className="details-rows">
              <DetailRow icon="🌸" label="When" index={3} from="left">
                <p className="detail-primary">{dateLabel}</p>
                <p className="detail-secondary">{timeLabel}</p>
              </DetailRow>

              <span className="details-row-rule reveal-item reveal-rule" style={{ '--i': 4 }} aria-hidden="true" />

              <DetailRow icon="🌷" label="Where" index={5} from="right">
                <p className="detail-primary">{venue}</p>
                <p className="detail-secondary">{address}</p>
              </DetailRow>

              <span className="details-row-rule reveal-item reveal-rule" style={{ '--i': 6 }} aria-hidden="true" />

              <DetailRow icon="🌿" label="Dress Code" index={7} from="left">
                <p className="detail-primary">{dressCode}</p>
              </DetailRow>
            </div>

            {note && (
              <p className="details-note reveal-item reveal-glow" style={{ '--i': 8 }}>
                &ldquo;{note}&rdquo;
              </p>
            )}
          </ScrollReveal>
        </section>

        <ScrollReveal as="section" className="map-section" mode="cine" aria-labelledby="map-heading">
          <h2 id="map-heading" className="section-title reveal-item" style={{ '--i': 0 }}>
            Find Us Here
          </h2>
          <div className="reveal-item" style={{ '--i': 1 }}>
            <FloralDivider />
          </div>
          <div className="reveal-item reveal-zoom" style={{ '--i': 2 }}>
            <VenueMap
              lat={mapLat}
              lng={mapLng}
              zoom={mapZoom}
              venue={venue}
              address={address}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" id="rsvp" className="rsvp" mode="stagger" aria-labelledby="rsvp-heading">
          <FloralSpray className="spray spray-rsvp" />
          <h2 id="rsvp-heading" className="section-title reveal-item reveal-glow" style={{ '--i': 0 }}>
            Will You Join Us?
          </h2>
          <div className="reveal-item" style={{ '--i': 1 }}>
            <FloralDivider />
          </div>
          <p className="rsvp-intro reveal-item" style={{ '--i': 2 }}>
            Kindly respond so we can save you a seat among the flowers.
          </p>
          <div className="reveal-item reveal-zoom" style={{ '--i': 3 }}>
            <RsvpForm />
          </div>
        </ScrollReveal>
      </main>

      <ScrollReveal as="footer" className="footer" mode="cine">
        <div className="reveal-item" style={{ '--i': 0 }}>
          <FloralDivider />
        </div>
        <p className="footer-script reveal-item reveal-glow" style={{ '--i': 1 }}>
          With love, {names}
        </p>
        <p className="footer-sub reveal-item" style={{ '--i': 2 }}>
          Hope to see you on {dateLabel}
        </p>
      </ScrollReveal>
    </div>
    </>
  )
}

export default App
