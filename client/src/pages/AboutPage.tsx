import { Link } from 'wouter'
import Footer from "@/components/Footer";
import Navbar from '@/components/Navbar'
const stats = [
  { value: '2018', label: 'Founded' },
  { value: '1,200+', label: 'Happy Customers' },
  { value: '40+', label: 'Makers Worldwide' },
  { value: '5,000+', label: 'Pieces Crafted' },
]

const services = [
  { icon: '🧶', title: 'Custom Orders', desc: 'Tell us your vision — colours, size, style — and our makers will bring it to life, stitch by stitch.' },
  { icon: '📖', title: 'Crochet Patterns', desc: 'Downloadable patterns for all skill levels, from beginner granny squares to advanced amigurumi.' },
  { icon: '🎁', title: 'Gift Wrapping', desc: 'Every order can be beautifully gift-wrapped with a handwritten note, ready to delight someone special.' },
  { icon: '🏪', title: 'Wholesale & Stockist', desc: 'Interested in carrying our pieces in your shop? We offer wholesale pricing for curated retailers.' },
  { icon: '🤝', title: 'Maker Collaborations', desc: 'Are you a crafter? Join our collective. We support independent makers with fair pay and a global platform.' },
  { icon: '🎓', title: 'Workshops', desc: 'Online and in-person crochet workshops led by our makers — perfect for beginners and enthusiasts alike.' },
]

const testimonials = [
  { name: 'Sophie M.', location: 'New York, USA', emoji: '🌸', stars: 5, text: 'I ordered a custom baby blanket and it arrived even more beautiful than I imagined. The care and detail in every stitch is just incredible.' },
  { name: 'Lena K.', location: 'Berlin, Germany', emoji: '🌷', stars: 5, text: 'The pattern I downloaded was so well-written. I finished my first amigurumi in a weekend! Will definitely be back for more.' },
  { name: 'Aisha R.', location: 'Dubai, UAE', emoji: '✨', stars: 5, text: 'Gifted a crochet flower bouquet to my mum and she cried happy tears. Feedle truly lives up to its name.' },
  { name: 'Clara B.', location: 'London, UK', emoji: '🧡', stars: 5, text: 'Fast shipping, gorgeous packaging, and the piece itself is a work of art. My go-to for handcrafted gifts from now on.' },
]

const locations = [
  { city: 'Portland', country: 'Oregon, USA', emoji: '🌲', desc: 'Our founding studio — where it all began with one hook and a rainy afternoon.' },
  { city: 'London', country: 'United Kingdom', emoji: '🎡', desc: 'Our European hub, home to pattern design and community events.' },
  { city: 'Austin', country: 'Texas, USA', emoji: '🌵', desc: 'Creative workshop space and wholesale fulfilment centre.' },
  { city: 'Melbourne', country: 'Australia', emoji: '🦘', desc: 'Our newest studio, serving the Asia-Pacific community.' },
]

export default function AboutPage() {
  return (
    <>
    <Navbar/>

      {/* ══════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════ */}
      <div className="about-hero">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <p className="breadcrumb">Home › About Us</p>
            <h1 className="page-title">
              Made with Intention.<br />
              <em>Shared with Care.</em>
            </h1>
            <p className="page-subtitle">
              We're a collective of passionate makers who believe that handcrafted
              objects carry something no machine ever can — a human story, a warm
              touch, and a little piece of someone's heart.
            </p>
            <div className="hero-badges">
              <span className="hero-badge">🧶 40+ Artisans</span>
              <span className="hero-badge">🌍 Ships Worldwide</span>
              <span className="hero-badge">⭐ 1,200+ Happy Customers</span>
            </div>
            <div className="about-hero-actions">
              <a href="#story" className="btn-submit">
                Our Story <i className="fa-solid fa-arrow-down"></i>
              </a>
              <Link to="/contact" className="btn-outline">
                Get in Touch <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="about-hero-img-wrap">
            <div className="about-hero-img-placeholder">
              <span>🧶</span>
              <p>Hero lifestyle photo</p>
              <small>Maker at work · Warm tones</small>
            </div>
  
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════
          2. YOUR STORY
      ══════════════════════════════════════ */}
      <section className="about-story" id="story">
        <div className="about-story-inner">
          <div className="story-img-wrap">
            <div className="story-img-placeholder">
              <span>🧶</span>
              <p>Our Story Photo</p>
            </div>

          </div>
          <div className="story-text">
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title">From One Hook to a Global Community</h2>
            <p>
              Feedle began in a small Portland apartment, where Clara picked up
              a crochet hook during a rainy weekend and never put it down. What started as
              a personal hobby quickly became a passion — and then a purpose.
            </p>
            <p>
              By 2020, Clara had connected with makers across three continents, all united
              by the same belief: that slow, intentional craft has a place in a fast world.
              Today, our collective spans 40+ artisans who pour their hearts into every stitch.
            </p>
            <p>
              We don't just sell handcrafted goods. We preserve a tradition, support independent
              makers, and bring a little warmth into every home we reach.
            </p>
            <div className="story-milestones">
              <div className="milestone"><span className="milestone-year">2018</span><p>Founded in Portland</p></div>
              <div className="milestone"><span className="milestone-year">2020</span><p>Went global — 3 continents</p></div>
              <div className="milestone"><span className="milestone-year">2023</span><p>1,000+ happy customers</p></div>
              <div className="milestone"><span className="milestone-year">2026</span><p>40+ makers worldwide</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. SERVICES OVERVIEW
      ══════════════════════════════════════ */}
      <section className="about-services">
        <div className="about-services-inner">
          <div className="section-header">
            <span className="section-eyebrow">What We Offer</span>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Everything from one-of-a-kind custom pieces to workshops and wholesale partnerships.</p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card" key={i}>
                <div className="service-icon">{s.icon}</div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="about-testimonials">
        <div className="about-testimonials-inner">
          <div className="section-header">
            <span className="section-eyebrow">Kind Words</span>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {'★'.repeat(t.stars)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.emoji}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-location"><i className="fa-solid fa-location-dot"></i> {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. LOCATIONS
      ══════════════════════════════════════ */}
      <section className="about-locations">
        <div className="about-locations-inner">
          <div className="section-header">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="section-title">Our Studios Around the World</h2>
            <p className="section-sub">Feedle has a growing presence across four cities — each one a hub of creativity and craft.</p>
          </div>
          <div className="locations-grid">
            {locations.map((l, i) => (
              <div className="location-card" key={i}>
                <div className="location-emoji">{l.emoji}</div>
                <h3 className="location-city">{l.city}</h3>
                <p className="location-country"><i className="fa-solid fa-location-dot"></i> {l.country}</p>
                <p className="location-desc">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. CTA
      ══════════════════════════════════════ */}
      <section className="about-cta">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="about-cta-inner">
          <span className="section-eyebrow">Let's Create Together</span>
          <h2 className="section-title">Ready to Start Your Handcrafted Journey?</h2>
          <p>Whether you're after a custom piece, a wholesale partnership, or just want to say hello — our makers are here for you.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn-submit">
              Contact Us <i className="fa-solid fa-paper-plane"></i>
            </Link>
            <a href="#" className="btn-outline btn-outline-dark">
              Browse Shop <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
