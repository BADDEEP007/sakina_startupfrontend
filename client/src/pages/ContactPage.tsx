import PageHero from '../components/contact/PageHero'
import ContactLeft from '../components/contact/ContactLeft'
import ContactRight from '../components/contact/ContactRight'
import Footer from "@/components/Footer";
import Navbar from '@/components/Navbar'

export default function ContactPage() {
  return (
    <>
      <Navbar/>
      <PageHero />
      <main className="contact-main" id="contact-form">
        <div className="contact-grid">
          <ContactLeft />
          <ContactRight />
        </div>
      </main>
      <Footer />
    </>
  )
}
