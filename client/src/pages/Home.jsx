import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import './Home.css'
import './HomeMotion.css'

function Home() {
  const { token } = useAuth()
  const pageRef = useRef(null)

  useEffect(() => {
    const el = pageRef.current
    if (!el) return

    /* אובזרבר כללי – לסקשנים עם .reveal */
    const revealItems = el.querySelectorAll('.reveal, .reveal-scale')
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    revealItems.forEach(item => revealObserver.observe(item))

    /* אובזרבר מחמיר – לסקשן "איך זה עובד" */
    /* threshold גבוה + rootMargin שלילי כדי שייכנס רק כשבאמת רואים אותו */
    const howSection = el.querySelector('.how-section')
    let howObserver
    if (howSection) {
      howObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const steps = howSection.querySelectorAll('.how-step')
            steps.forEach((step, idx) => {
              step.style.animationDelay = `${idx * 0.15}s`
              step.classList.add('how-visible')
            })
            howObserver.unobserve(howSection)
          }
        },
        { threshold: 0.28, rootMargin: '0px 0px -15% 0px' }
      )
      howObserver.observe(howSection)
    }

    return () => {
      revealObserver.disconnect()
      howObserver?.disconnect()
    }
  }, [])

  return (
    <div className="home-page" ref={pageRef}>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-blob-1" />
        <div className="home-hero-blob-2" />

        {/* עלים צפים ברקע */}
        <div className="hero-leaves">
          <FloatingLeaf n={1} d="M12 2C12 2 8 6 8 10C8 14 10 16 12 16C14 16 16 14 16 10C16 6 12 2 12 2Z" color="#7A8B6A" />
          <FloatingLeaf n={2} d="M10 2C6 6 4 10 6 14C8 12 12 8 10 2Z" color="#96A788" />
          <FloatingLeaf n={3} d="M8 0C8 0 2 6 4 12C6 10 10 6 8 0Z" color="#AE7882" />
          <FloatingLeaf n={4} d="M10 2C14 6 16 12 12 16C10 12 8 6 10 2Z" color="#A7B89B" />
          <FloatingLeaf n={5} d="M12 2C12 2 8 6 8 10C8 14 10 16 12 16C14 16 16 14 16 10C16 6 12 2 12 2Z" color="#C9A2A9" />
          <FloatingLeaf n={6} d="M10 2C6 6 4 10 6 14C8 12 12 8 10 2Z" color="#7A8B6A" />
        </div>

        <div className="home-hero-content">
          <BrandLeaf className="home-hero-logo hero-stagger hero-stagger--1" />
          <h1 className="home-hero-title hero-stagger hero-stagger--2">
            Verdora
          </h1>
          <div className="home-hero-divider hero-stagger hero-stagger--3" />
          <p className="home-hero-tagline hero-stagger hero-stagger--4">
            Naturally Smarter for You.
          </p>

          <Link to="/plants" className="home-hero-cta hero-stagger hero-stagger--5">
            Explore the collection
          </Link>

          <div className="home-hero-scroll hero-stagger hero-stagger--6">
            <svg className="home-hero-scroll-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M10 3v14M4 11l6 6 6-6" />
            </svg>
          </div>
        </div>
      </section>

      <StemDivider />

      {/* The Concept */}
      <section className="home-concept reveal">
        <div className="home-concept-inner">
          <div className="home-concept-grid">
            <div>
              <p className="home-concept-label">The concept</p>
              <h2 dir="ltr" className="home-concept-title">
                A plant boutique<br />
                that <span className="text-gradient italic">thinks ahead</span>
              </h2>
              <p className="home-concept-text">
                Verdora is a smart plant platform with over 100 curated varieties.
                We deliver every plant to your door, and then our technology takes
                over — personalized care schedules, automated reminders, and a
                living dashboard that tracks your entire garden.
              </p>
              <p className="home-concept-text">
                No guesswork. You pay only when your plants arrive — and from
                that moment, our system makes sure every leaf thrives.
              </p>
            </div>

            <ProductCard />
          </div>
        </div>
      </section>

      <StemDivider flip />

      {/* How it works */}
      <section className="home-how how-section">
        <div className="home-how-inner">
          <h2 className="home-how-title how-step">How it works</h2>

          <div className="home-how-steps-wrap">
            <div className="home-how-vine how-step">
              <svg className="home-how-vine-svg" viewBox="0 0 600 28" fill="none" preserveAspectRatio="none">
                <path d="M0 14 C80 4, 160 24, 300 14 C440 4, 520 24, 600 14" stroke="#5F7150" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
                <circle cx="300" cy="14" r="2.5" fill="#AE7882" opacity="0.6" />
              </svg>
            </div>

            <div className="home-how-grid">
              <StepCard
                number="1"
                icon={<ChoosePlantIcon />}
                title="Choose your plant"
                text="Browse our curated collection and find the perfect match for your space."
              />
              <StepCard
                number="2"
                icon={<DeliveryIcon />}
                title="We bring it home"
                text="Carefully packaged and delivered to your door — pay only on arrival."
              />
              <StepCard
                number="3"
                icon={<SmartCareIcon />}
                title="Smart care begins"
                text="Our system tracks your plant's needs and sends timely care reminders."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {!token && (
        <>
          <StemDivider />
          <section className="home-cta reveal">
            <div className="home-cta-inner">
              <h2 className="home-cta-title">Ready to start growing?</h2>
              <p className="home-cta-subtitle">
                Join Verdora and experience smarter plant care.
              </p>
              <Link
                to="/register"
                className="home-cta-button"
                style={{
                  background: 'linear-gradient(135deg, #5F7150 0%, #455436 100%)',
                  boxShadow: '0 4px 20px rgba(95, 113, 80, 0.3)'
                }}
              >
                Join Verdora
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}


function FloatingLeaf({ n, d, color }) {
  return (
    <svg className={`hero-leaf hero-leaf--${n}`} viewBox="0 0 24 18" fill="none">
      <path d={d} fill={color} opacity="0.6" stroke={color} strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  )
}


function BrandLeaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path d="M32 56C32 56 28 44 28 32C28 22 30 14 32 8" stroke="#7A8B6A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 38C26 34 18 33 14 35C14 35 18 42 32 38Z" fill="#7A8B6A" opacity="0.7" stroke="#7A8B6A" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M32 26C36 18 38 10 36 6C36 6 28 8 32 26Z" fill="#AE7882" opacity="0.8" stroke="#AE7882" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M32 30C38 28 44 24 44 18C44 18 36 18 32 30Z" fill="#96A788" opacity="0.6" stroke="#96A788" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  )
}


function StemDivider({ flip }) {
  return (
    <div className="home-stem-divider">
      <svg className={`home-stem-svg ${flip ? 'scale-y-[-1]' : ''}`} viewBox="0 0 400 20" fill="none" preserveAspectRatio="none">
        <path d="M0 10 C60 3, 140 17, 200 10 C260 3, 340 17, 400 10" stroke="#7A8B6A" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      </svg>
    </div>
  )
}


function ProductCard() {
  return (
    <div className="home-product-card product-float">
      <svg className="home-product-svg" viewBox="0 0 260 440" fill="none">
        <rect x="6" y="6" width="248" height="428" rx="18" fill="#FEFCF9" stroke="#C5D1BB" strokeWidth="0.8" />
        <rect x="18" y="18" width="224" height="150" rx="14" fill="#F7F4EF" />
        <g transform="translate(100, 60)">
          <path d="M16 80 L44 80 L40 100 L20 100Z" fill="#F0E8DE" stroke="#E2D8CC" strokeWidth="1" />
          <rect x="13" y="76" width="34" height="6" rx="2" fill="#E2D8CC" stroke="#D6CCBE" strokeWidth="0.6" />
          <path d="M30 76 C30 60, 29 40, 30 15" stroke="#7A8B6A" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M30 55 C22 48, 10 45, 6 50 C4 55, 16 58, 30 55Z" fill="#7A8B6A" opacity="0.5" stroke="#7A8B6A" strokeWidth="0.7" />
          <path d="M30 40 C38 30, 46 20, 42 12 C38 16, 32 28, 30 40Z" fill="#96A788" opacity="0.45" stroke="#96A788" strokeWidth="0.7" />
          <path d="M30 48 C40 42, 50 34, 50 24 C46 28, 38 36, 30 48Z" fill="#7A8B6A" opacity="0.4" stroke="#7A8B6A" strokeWidth="0.7" />
          <path d="M30 32 C22 22, 12 16, 10 22 C8 28, 22 30, 30 32Z" fill="#96A788" opacity="0.4" stroke="#96A788" strokeWidth="0.7" />
          <path d="M30 22 C34 12, 36 4, 34 0 C30 4, 28 12, 30 22Z" fill="#AE7882" opacity="0.6" stroke="#AE7882" strokeWidth="0.7" />
        </g>
        <text x="130" y="190" textAnchor="middle" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fill: '#2E332B', fontWeight: 600 }}>מונסטרה דלסיוזה</text>
        <text x="130" y="207" textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: '#A0AA96' }}>Monstera Deliciosa</text>
        <text x="130" y="228" textAnchor="middle" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fill: '#5B6A4C', fontWeight: 600 }}>₪89</text>
        <path d="M40 240 C80 236, 180 244, 220 240" stroke="#C9A2A9" strokeWidth="0.6" opacity="0.5" />
        <g transform="translate(36, 252)">
          <path d="M8 0 C8 0 5 5.5, 5 7.5 C5 10, 7 11.5, 8 11.5 C9 11.5, 11 10, 11 7.5 C11 5.5, 8 0, 8 0Z" stroke="#7A8B6A" strokeWidth="1" fill="#7A8B6A" opacity="0.25" strokeLinejoin="round" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>פעם בשבוע</text>
        </g>
        <g transform="translate(148, 252)">
          <circle cx="7" cy="6" r="3.5" stroke="#7A8B6A" strokeWidth="0.9" fill="#7A8B6A" opacity="0.15" />
          <path d="M7 0.5V-0.5 M7 12.5V11.5 M1.2 6H0.2 M13.8 6H12.8 M3 2L2.3 1.3 M11 10L10.3 9.3 M3 10L2.3 10.7 M11 2L10.3 2.7" stroke="#7A8B6A" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>אור עקיף</text>
        </g>
        <g transform="translate(36, 275)">
          <path d="M7 12 C7 12 6 8, 7 4" stroke="#7A8B6A" strokeWidth="1" strokeLinecap="round" />
          <path d="M7 7 C5 5.5, 2.5 5, 2 6.5 C2 6.5 4 8.5, 7 7Z" fill="#7A8B6A" opacity="0.4" stroke="#7A8B6A" strokeWidth="0.5" />
          <path d="M7 5 C8.5 3, 9.5 1.5, 9 0.5 C9 0.5 7 1.5, 7 5Z" fill="#AE7882" opacity="0.55" stroke="#AE7882" strokeWidth="0.5" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>טיפול קל</text>
        </g>
        <g transform="translate(148, 275)">
          <path d="M7 1V12 M4.5 3.5L7 1L9.5 3.5 M4.5 9.5L7 12L9.5 9.5" stroke="#7A8B6A" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>בינוני, 40-60 ס״מ</text>
        </g>
        <path d="M40 298 C80 294, 180 302, 220 298" stroke="#C9A2A9" strokeWidth="0.6" opacity="0.5" />
        <text x="224" y="316" textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, fill: '#A0AA96' }}>בריאות</text>
        <text x="42" y="316" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, fill: '#5B6A4C', fontWeight: 500 }}>מצוין</text>
        <rect x="36" y="322" width="188" height="5" rx="2.5" fill="#F0E8DE" />
        <rect x="36" y="322" width="158" height="5" rx="2.5" fill="#7A8B6A" opacity="0.5" />
        <rect x="18" y="340" width="224" height="44" rx="12" fill="white" stroke="#C9A2A9" strokeWidth="0.7" />
        <path d="M218 352 C218 352 215 357, 215 359.5 C215 362, 217 363.5, 218 363.5 C219 363.5 221 362, 221 359.5 C221 357 218 352 218 352Z" fill="#AE7882" opacity="0.45" stroke="#AE7882" strokeWidth="0.6" />
        <text x="206" y="358" textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontSize: 7.5, fill: '#AE7882', fontWeight: 500 }}>השקיה הבאה</text>
        <text x="206" y="372" textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: '#2E332B', fontWeight: 500 }}>מחר, 8:00 בבוקר</text>
        <rect x="36" y="396" width="188" height="28" rx="14" fill="#7A8B6A" opacity="0.12" stroke="#7A8B6A" strokeWidth="0.6" opacity="0.3" />
        <text x="130" y="414" textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: '#5B6A4C', fontWeight: 600 }}>הוסיפי לעגלה</text>
      </svg>
    </div>
  )
}


function StepCard({ number, icon, title, text }) {
  return (
    <div className="home-step how-step">
      <div className="home-step-icon-wrap">
        {icon}
      </div>
      <span className="home-step-number">Step {number}</span>
      <h3 className="home-step-title">{title}</h3>
      <p className="home-step-text">{text}</p>
    </div>
  )
}

function ChoosePlantIcon() {
  return (
    <svg className="home-step-icon" viewBox="0 0 28 28" fill="none">
      <path d="M14 24C14 24 12 18 12 14C12 10 13 6 14 3" stroke="#7A8B6A" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 16C11 14, 7 13.5, 5.5 15C5.5 15 8 18 14 16Z" fill="#7A8B6A" opacity="0.5" stroke="#7A8B6A" strokeWidth="0.6" />
      <path d="M14 10C16 6, 17 3, 16.5 1.5C16.5 1.5 12.5 3 14 10Z" fill="#AE7882" opacity="0.6" stroke="#AE7882" strokeWidth="0.6" />
      <path d="M14 12C18 10.5, 22 8, 22 5C22 5 17 5 14 12Z" fill="#96A788" opacity="0.45" stroke="#96A788" strokeWidth="0.6" />
      <circle cx="21" cy="18" r="4" stroke="#AE7882" strokeWidth="0.8" opacity="0.6" fill="none" />
      <path d="M21 16.5V19.5M19.5 18H22.5" stroke="#AE7882" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

function DeliveryIcon() {
  return (
    <svg className="home-step-icon" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="12" width="18" height="13" rx="2" stroke="#7A8B6A" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M5 16H23" stroke="#7A8B6A" strokeWidth="0.8" opacity="0.3" />
      <path d="M14 12C14 12 13 7, 14 4" stroke="#7A8B6A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 8C12 6, 9 5.5, 8.5 7C8.5 7 10.5 9, 14 8Z" fill="#7A8B6A" opacity="0.5" stroke="#7A8B6A" strokeWidth="0.5" />
      <path d="M14 6C15.5 3.5, 17 2, 16.5 1C16.5 1 13.5 2 14 6Z" fill="#AE7882" opacity="0.6" stroke="#AE7882" strokeWidth="0.5" />
      <path d="M22 22L24.5 20L27 22" stroke="#A0AA96" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 22V25H26V22" stroke="#A0AA96" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  )
}

function SmartCareIcon() {
  return (
    <svg className="home-step-icon" viewBox="0 0 28 28" fill="none">
      <rect x="6" y="2" width="16" height="24" rx="3" stroke="#7A8B6A" strokeWidth="1" opacity="0.4" fill="none" />
      <path d="M14 20C14 20 13 15, 14 11" stroke="#7A8B6A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 16C12 14.5, 9 14, 8.5 15.5C8.5 15.5 10.5 17.5, 14 16Z" fill="#7A8B6A" opacity="0.45" stroke="#7A8B6A" strokeWidth="0.5" />
      <path d="M14 13C15.5 10, 16 8, 15.5 7C15.5 7 13 8, 14 13Z" fill="#AE7882" opacity="0.55" stroke="#AE7882" strokeWidth="0.5" />
      <circle cx="20" cy="5" r="2.5" fill="#AE7882" opacity="0.65" />
      <path d="M24 10C25 9, 25 7, 24 6" stroke="#96A788" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M26 11C27.5 9, 27.5 6, 26 4.5" stroke="#96A788" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}


export default Home
