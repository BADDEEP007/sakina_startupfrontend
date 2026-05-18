import crochetImg from '../../assets/crochet.jpg'

export default function PageHero() {
  return (
    <div className="page-hero">
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      <div className="page-hero-inner">
        {/* Left: text content */}
        <div className="hero-text">
          <p className="breadcrumb">Home › Contact Us</p>
          <h1 className="page-title">Send Us a Note</h1>
          <p className="page-subtitle">
            We're here to help your vision come to life. Whether it's a custom
            piece, a pattern question, or just a hello — our makers are ready
            to hear from you.
          </p>
          <div className="hero-badges">
            <span className="hero-badge">🧶 Handcrafted with Love</span>
            <span className="hero-badge">📦 Ships Worldwide</span>
            <span className="hero-badge">💬 Reply in 24–48 hrs</span>
          </div>
          <a href="#contact-form" className="btn-submit hero-cta">
            Get in Touch <i className="fa-solid fa-arrow-down"></i>
          </a>
        </div>

        {/* Right: image */}
        <div className="hero-image-wrap">
          <img src={crochetImg} alt="Crocheted hibiscus flower wall hanging" className="hero-img" />

        </div>
      </div>
    </div>
  )
}
