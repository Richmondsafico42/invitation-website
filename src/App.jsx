import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Countdown from './components/Countdown'
import RsvpForm from './components/RsvpForm'
import Petals from './components/Petals'
import FloralSpray from './components/FloralSpray'
import ScrollFlora from './components/ScrollFlora'
import ScrollMotion from './components/ScrollMotion'
import ScrollReveal from './components/ScrollReveal'
import CelebrantShowcase from './components/CelebrantShowcase'
import VenueMap from './components/VenueMap'
import RsvpAdmin from './components/RsvpAdmin'
import { eventConfig } from './eventConfig'
import MiniCountdown from './components/MiniCountdown'
import togetherPhoto from './assets/together.svg'
import topLeftDesign from './assets/left.svg'
import topRightDesign from './assets/right.svg'
import disortDesign from './assets/disort.svg'
import colorPaletteImg from './assets/color-palette.png'
import './App.css'


function FloralDivider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider-line" />
      <svg viewBox="0 0 32 32" className="divider-flower" fill="none">
        {/* Outer large petals (pink) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={`outer-${deg}`}
            cx="16"
            cy="7"
            rx="3.2"
            ry="7.5"
            fill="#f0c0e8"
            opacity="0.92"
            transform={`rotate(${deg} 16 16)`}
          />
        ))}
        {/* Inner accent petals (lilac) */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={`inner-${deg}`}
            cx="16"
            cy="9.5"
            rx="2.2"
            ry="5"
            fill="#c8a8e0"
            opacity="0.85"
            transform={`rotate(${deg} 16 16)`}
          />
        ))}
        <circle cx="16" cy="16" r="3.5" fill="#9eaad8" />
        <circle cx="16" cy="16" r="1.8" fill="#fff" opacity="0.7" />
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

const CEREMONY_DATA = [
  {
    id: 'roses',
    icon: '🌹',
    title: '6 Roses',
    names: ['Ronald Safico', 'Jhun Safico', 'Eric Safico', 'Troy Safico', 'Cris Baniel', 'Melvin Zabala', 'Ēwen Serrano'],
  },
  {
    id: 'candles',
    icon: '🕯️',
    title: '6 Candles',
    names: ['Sonia Zabala', 'Celia Baniel', 'Bel Serrano', 'Ester Kelbio', 'Nikki Safico', 'Sonia Safico'],
  },
  {
    id: 'bible',
    icon: '📖',
    title: 'Bible Verse for Us',
    names: ['Mheds Diamzon', 'Remedios Lugtu', 'Mercy Sampang', 'Fatima Cada', 'Lorieta Perico', 'Liwayway Mangiliman'],
  },
]

function CeremonyModal({ group, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="ceremony-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ceremony-modal-title">
      <div className="ceremony-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="ceremony-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="ceremony-modal-icon">{group.icon}</div>
        <h3 id="ceremony-modal-title" className="ceremony-modal-title">{group.title}</h3>
        <ul className="ceremony-modal-names">
          {group.names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  )
}

function CeremonySection() {
  const [activeGroup, setActiveGroup] = useState(null)
  const close = useCallback(() => setActiveGroup(null), [])

  return (
    <>
      <ScrollReveal as="section" className="ceremony-section" mode="stagger" aria-labelledby="ceremony-heading">
        <p id="ceremony-heading" className="details-eyebrow reveal-item" style={{ '--i': 0 }}>The Celebration</p>
        <h2 className="details-title reveal-item reveal-glow" style={{ '--i': 1 }}>Special Roles</h2>
        <div className="reveal-item" style={{ '--i': 2 }}><FloralDivider /></div>

        <div className="ceremony-cards reveal-item" style={{ '--i': 3 }}>
          {CEREMONY_DATA.map((group) => (
            <button
              key={group.id}
              className="ceremony-card-btn"
              onClick={() => setActiveGroup(group)}
              aria-label={`View ${group.title} participants`}
            >
              <span className="ceremony-card-icon">{group.icon}</span>
              <span className="ceremony-card-title">{group.title}</span>
              <span className="ceremony-card-count">{group.names.length} participants</span>
              <span className="ceremony-card-cta">Tap to view ↗</span>
            </button>
          ))}
        </div>
      </ScrollReveal>

      {activeGroup && <CeremonyModal group={activeGroup} onClose={close} />}
    </>
  )
}

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('admin')) {
      setIsAdminOpen(true)
    }
  }, [])

  const handleCreditClick = () => {
    setClickCount((prev) => {
      const next = prev + 1
      if (next >= 5) {
        setIsAdminOpen(true)
        return 0
      }
      return next
    })
  }

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

      <div className="scattered-container" aria-hidden="true">
        <img src={disortDesign} alt="" className="scattered-design" style={{ top: '5vh', left: '-40px', '--speed-x': '0.06', '--speed-y': '-0.08', '--rot-speed': '0.02', width: '180px' }} />
        <img src={disortDesign} alt="" className="scattered-design" style={{ top: '30vh', right: '-50px', '--speed-x': '-0.07', '--speed-y': '-0.1', '--rot-speed': '-0.03', width: '200px' }} />
        <img src={disortDesign} alt="" className="scattered-design" style={{ top: '55vh', left: '-30px', '--speed-x': '0.05', '--speed-y': '-0.07', '--rot-speed': '0.015', width: '160px' }} />
        <img src={disortDesign} alt="" className="scattered-design" style={{ top: '75vh', right: '-40px', '--speed-x': '-0.06', '--speed-y': '-0.09', '--rot-speed': '-0.025', width: '190px' }} />
        <img src={disortDesign} alt="" className="scattered-design" style={{ top: '90vh', left: '-35px', '--speed-x': '0.08', '--speed-y': '-0.12', '--rot-speed': '0.03', width: '170px' }} />
      </div>

      <div className="page">
        <ScrollMotion />
        <Petals count={typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 22} />
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
          Letters & Flowers: A Garden Soirée
        </h1>
        <p className="hero-subtitle cine" style={{ '--d': '0.65s' }}>
          Celebrating 60 years of Purpose & Vows that Continue to Bloom
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
          <p className="countdown-event-title" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-soft)', marginBottom: '0.65rem', fontSize: '1.05rem', letterSpacing: '0.04em' }}>
            The celebration starts in:
          </p>
          <Countdown dateISO={dateISO} />
        </div>
        <a
          className="btn btn-primary hero-cta cine"
          style={{ '--d': '1.1s' }}
          href="#rsvp"
        >
          RSVP
        </a>
        <div className="hero-rsvp-deadline cine" style={{ '--d': '1.2s', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
          <MiniCountdown targetDate="2026-07-13T15:00:00" prefix="RSVP Deadline:" />
        </div>
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

              <div className="color-palette-section reveal-item" style={{ '--i': 7 }}>
                <img
                  src={colorPaletteImg}
                  alt="Color palette for the event: Misty Gray (Side of Imelda), Periwinkle Blue (Side of Vic), Taupe and Lilac (All other guests)"
                  className="color-palette-img"
                />
                <p className="color-palette-attire" style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: '1.4' }}>
                  To complement our garden celebration, ladies are encouraged to wear long dresses, while gentlemen are requested to wear long-sleeved shirts or smart casual attire.
                </p>
              </div>
            </div>

            {note && (
              <p className="details-note reveal-item reveal-glow" style={{ '--i': 8 }}>
                &ldquo;{note}&rdquo;
              </p>
            )}

          </ScrollReveal>
        </section>

        {/* ── Ceremony Participants (separate box) ── */}
        <CeremonySection />

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
        
        <div className="credits-footer reveal-item" style={{ '--i': 3 }}>
          <p>
            Made by{' '}
            <span className="credit-author" onClick={handleCreditClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              Richmond M. Safico
            </span>
          </p>
          <p>
            Contact: <a href="tel:09925684748">09925684748</a> |{' '}
            <a href="https://www.facebook.com/Richmond.safico/" target="_blank" rel="noopener noreferrer">
              Facebook Profile
            </a>
          </p>
        </div>
      </ScrollReveal>
      {isAdminOpen && <RsvpAdmin onClose={() => setIsAdminOpen(false)} />}
    </div>
    </>
  )
}

export default App
