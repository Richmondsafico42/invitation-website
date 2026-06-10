import Countdown from './components/Countdown'
import RsvpForm from './components/RsvpForm'
import { eventConfig } from './eventConfig'
import './App.css'

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
      <header className="hero">
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className={`confetti-piece c${i % 6}`} />
          ))}
        </div>
        <p className="hero-eyebrow">{title}</p>
        <h1 className="hero-name">{celebrant}'s</h1>
        <p className="hero-subtitle">
          {age}
          <sup>th</sup> Birthday Celebration
        </p>
        <Countdown dateISO={dateISO} />
        <a className="btn btn-primary hero-cta" href="#rsvp">
          RSVP Now
        </a>
      </header>

      <main>
        <section className="details" aria-labelledby="details-heading">
          <h2 id="details-heading" className="section-title">
            Event Details
          </h2>
          <div className="detail-grid">
            <div className="detail-card">
              <span className="detail-icon" aria-hidden="true">📅</span>
              <h3>When</h3>
              <p>{dateLabel}</p>
              <p>{timeLabel}</p>
            </div>
            <div className="detail-card">
              <span className="detail-icon" aria-hidden="true">📍</span>
              <h3>Where</h3>
              <p>{venue}</p>
              <p>{address}</p>
            </div>
            <div className="detail-card">
              <span className="detail-icon" aria-hidden="true">👗</span>
              <h3>Dress Code</h3>
              <p>{dressCode}</p>
            </div>
          </div>
          {note && <p className="details-note">{note}</p>}
        </section>

        <section id="rsvp" className="rsvp" aria-labelledby="rsvp-heading">
          <h2 id="rsvp-heading" className="section-title">
            RSVP
          </h2>
          <p className="rsvp-intro">
            Kindly respond so we can save you a seat at the party.
          </p>
          <RsvpForm />
        </section>
      </main>

      <footer className="footer">
        <p>
          With love, {celebrant} 💖 — Hope to see you on {dateLabel}!
        </p>
      </footer>
    </div>
  )
}

export default App
