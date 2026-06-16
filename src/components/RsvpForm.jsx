import { useState } from 'react'

const initialForm = { name: '', email: '', guests: '1', attending: 'yes', message: '' }

export default function RsvpForm() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function validate(values) {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) {
      next.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Please enter a valid email.'
    }
    return next
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setLoading(true)
      setSubmitError(null)
      fetch('api/rsvp.php?action=add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to submit RSVP')
          return res.json()
        })
        .then(data => {
          if (data.success) {
            setSubmitted(true)
          } else {
            throw new Error(data.error || 'Failed to submit RSVP')
          }
        })
        .catch(err => {
          console.error(err)
          setSubmitError(err.message || 'Failed to submit RSVP. Please try again.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  if (submitted) {
    return (
      <div className="rsvp-success cine" style={{ '--d': '0s' }} role="status">
        <h3>Thank you, {form.name}! 🎈</h3>
        <p>
          {form.attending === 'yes'
            ? "We can't wait to celebrate with you."
            : "We're sorry you can't make it — you'll be missed!"}
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setForm(initialForm)
            setSubmitted(false)
          }}
        >
          Submit another response
        </button>
      </div>
    )
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      <div className="field rsvp-field-anim" style={{ '--i': 4 }}>
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field rsvp-field-anim" style={{ '--i': 5 }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="field-row rsvp-field-anim" style={{ '--i': 6 }}>
        <div className="field">
          <label htmlFor="attending">Will you attend?</label>
          <select
            id="attending"
            name="attending"
            value={form.attending}
            onChange={handleChange}
          >
            <option value="yes">Yes, I'll be there</option>
            <option value="no">Sorry, can't make it</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="guests">Number of guests</label>
          <select
            id="guests"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            disabled={form.attending === 'no'}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field rsvp-field-anim" style={{ '--i': 7 }}>
        <label htmlFor="message">Message (optional)</label>
        <textarea
          id="message"
          name="message"
          rows="3"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      {submitError && <div className="error rsvp-submit-error" style={{ marginBottom: '1rem', color: 'var(--color-accent, #e2b07e)', textAlign: 'center' }}>{submitError}</div>}
      <button type="submit" className="btn btn-primary rsvp-field-anim" style={{ '--i': 8 }} disabled={loading}>
        {loading ? 'Sending...' : 'Send RSVP'}
      </button>
    </form>
  )
}
