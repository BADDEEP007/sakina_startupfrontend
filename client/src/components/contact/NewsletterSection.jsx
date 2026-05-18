import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-blob blob-left"></div>
      <div className="newsletter-blob blob-right"></div>
      <div className="newsletter-inner">
        <div className="newsletter-icon">🧶</div>
        <h2 className="newsletter-title">Stay in the Loop</h2>
        <p className="newsletter-desc">
          Be the first to know about new collections, limited drops, pattern releases,
          and behind-the-scenes maker stories.
        </p>

        {submitted ? (
          <div className="newsletter-success">
            <span>🎉</span> You're on the list! We'll be in touch soon.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <div className="newsletter-input-wrap">
              <i className="fa-regular fa-envelope newsletter-input-icon"></i>
              <input
                type="email"
                placeholder="Enter your email address…"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">
              Keep Me Updated <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>
        )}

        <p className="newsletter-note">
          <i className="fa-solid fa-lock"></i> No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
