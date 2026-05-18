import crochetImg from '../../assets/flower.jpg'

export default function ContactLeft() {
  return (
    <aside className="contact-left">
      <div className="img-placeholder" role="img" aria-label="Crocheted hibiscus flower wall hanging">
        <img src={crochetImg} alt="Crocheted hibiscus flower wall hanging" className="placeholder-img" />
      </div>

      <div className="reach-us-card">
        <h3 className="reach-title">Other Ways to Reach Us</h3>

        <div className="reach-item">
          <div className="reach-icon"><i className="fa-regular fa-envelope"></i></div>
          <div>
            <p className="reach-label">Email us directly</p>
            <a href="mailto:hello@handmadewithlove.com" className="reach-value">hello@handmadewithlove.com</a>
          </div>
        </div>

        <div className="reach-item">
          <div className="reach-icon"><i className="fa-brands fa-instagram"></i></div>
          <div>
            <p className="reach-label">Instagram</p>
            <a href="#" className="reach-value">@handmadewithlove</a>
          </div>
        </div>

        <div className="reach-item">
          <div className="reach-icon"><i className="fa-brands fa-pinterest"></i></div>
          <div>
            <p className="reach-label">Pinterest</p>
            <a href="#" className="reach-value">Handmade with Love</a>
          </div>
        </div>

        <div className="reach-item">
          <div className="reach-icon"><i className="fa-brands fa-facebook-f"></i></div>
          <div>
            <p className="reach-label">Facebook Community</p>
            <a href="#" className="reach-value">Join our group</a>
          </div>
        </div>

        <div className="support-blurb">
          <p>
            Our makers are often busy with their hooks —
            expect a reply within <strong>24–48 hours</strong>.
            Every message is read by a real person who loves crochet just as much as you do.
          </p>
        </div>
      </div>
    </aside>
  )
}
