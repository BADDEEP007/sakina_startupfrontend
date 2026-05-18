import { useState } from 'react'

export default function ContactRight() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section className="contact-right">
      <div className="form-wrapper">
        <div className="form-header">
          <h2 className="form-title">Write to Us</h2>
          <p className="form-desc">
            Whether it's a custom order, a pattern question, or just a hello —
            we'd love to hear from you.
          </p>
        </div>

        <form className="letter-form" noValidate onSubmit={handleSubmit}>
          <div className="form-row two-col">
            <div className="field-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" placeholder="e.g. Sophie Miller"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="sophie@example.com"
                value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="subject">How Can We Help?</label>
            <div className="select-wrapper">
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
                <option value="" disabled>Choose a topic…</option>
                <option value="custom-order">🧶 Custom Order Inquiry</option>
                <option value="pattern-support">📖 Pattern Support</option>
                <option value="wholesale">🏪 Wholesale &amp; Stockist</option>
                <option value="collaboration">🤝 Maker Collaboration</option>
                <option value="shipping">📦 Shipping &amp; Returns</option>
                <option value="gift">🎁 Gift &amp; Gifting Options</option>
                <option value="other">💬 Something Else</option>
              </select>
              <i className="fa-solid fa-chevron-down select-arrow"></i>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="message">Your Message</label>
            <textarea id="message" name="message" rows="6"
              placeholder="Tell us about your project, question, or idea — the more detail, the better we can help…"
              value={formData.message} onChange={handleChange} required></textarea>
          </div>

          <div className="form-footer-row">
            <p className="privacy-note">
              <i className="fa-solid fa-lock"></i>
              Your details are safe with us. We never share your information.
            </p>
            <button type="submit" className="btn-submit">
              Send Your Note <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>

      <div className="artist-card">
        <div className="artist-badge">Featured Maker</div>
        <div className="artist-inner">
          <div className="artist-avatar" aria-label="Featured maker portrait photo">
            <span>🧵</span>
          </div>
          <div className="artist-bio">
            <h4 className="artist-name">Clara &amp; her Hooks</h4>
            <p className="artist-location"><i className="fa-solid fa-location-dot"></i> Portland, Oregon</p>
            <blockquote className="artist-quote">
              "Every stitch is a small act of love. I pour my heart into each piece I make for this community."
            </blockquote>
            <a href="#" className="artist-link">See Clara's Collection →</a>
          </div>
        </div>
      </div>
    </section>
  )
}
