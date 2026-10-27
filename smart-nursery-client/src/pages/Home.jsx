import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Home() {
  const { token } = useAuth()

  return (
    <div className="-mx-4 sm:-mx-6 -mt-10">

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-14 sm:pt-20 pb-6 sm:pb-10 min-h-[75vh] flex items-center justify-center">
        <div className="absolute top-[12%] left-[6%] w-[220px] h-[220px] blob-float-4 bg-green-pale/15 -z-10" />
        <div className="absolute bottom-[15%] right-[8%] w-[180px] h-[180px] blob-float-5 bg-pink-pale/15 -z-10" />

        <div className="max-w-3xl mx-auto text-center relative">
          <BrandLeaf className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5" />
          <h1 className="font-display text-5xl sm:text-7xl font-light tracking-[0.15em] text-green-dark uppercase mb-4">
            Verdora
          </h1>
          <div className="w-20 h-px bg-pink-light/60 mx-auto mb-4" />
          <p className="font-display text-xl sm:text-2xl italic text-ink-faint font-light mb-10">
            Naturally Smarter for You.
          </p>

          <Link
            to="/plants"
            className="inline-block px-9 py-3.5 no-underline text-sm font-semibold text-green-dark bg-green-pale/25 border border-green-pale/50 rounded-full hover:bg-green-pale/40 hover:border-green-pale/80 transition-all duration-300 hover:shadow-sm"
          >
            Explore the collection
          </Link>

          <div className="mt-10 animate-bounce">
            <svg className="w-5 h-5 mx-auto text-ink-faint/40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M10 3v14M4 11l6 6 6-6" />
            </svg>
          </div>
        </div>
      </section>

      <StemDivider />

      {/* The Concept — with product card */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-10 sm:py-16 bg-pink-pale/12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <p className="text-pink font-medium text-sm tracking-[0.2em] uppercase mb-3">The concept</p>
              <h2 dir="ltr" className="font-display text-4xl sm:text-5xl text-ink leading-[1.15] mb-5 font-medium">
                A plant boutique<br />
                that <span className="text-gradient italic">thinks ahead</span>
              </h2>
              <p className="text-ink-light leading-relaxed mb-3">
                Verdora is a smart plant platform with over 100 curated varieties.
                We deliver every plant to your door, and then our technology takes
                over — personalized care schedules, automated reminders, and a
                living dashboard that tracks your entire garden.
              </p>
              <p className="text-ink-light leading-relaxed">
                No guesswork. You pay only when your plants arrive — and from
                that moment, our system makes sure every leaf thrives.
              </p>
            </div>

            <ProductCard />
          </div>
        </div>
      </section>

      <StemDivider flip />

      {/* How it works — 3 steps connected by stem */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 bg-green-pale/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-medium">How it works</h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%]">
              <svg className="w-full h-8" viewBox="0 0 600 28" fill="none" preserveAspectRatio="none">
                <path d="M0 14 C80 4, 160 24, 300 14 C440 4, 520 24, 600 14" stroke="#5F7150" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
                <circle cx="300" cy="14" r="2.5" fill="#AE7882" opacity="0.6" />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
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
          <section className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div className="text-center">
              <h2 className="font-display text-3xl text-ink mb-3">Ready to start growing?</h2>
              <p className="text-pink-dark/50 mb-6 font-light">
                Join Verdora and experience smarter plant care.
              </p>
              <Link
                to="/register"
                className="inline-block px-9 py-3.5 no-underline text-sm font-semibold text-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-[1.03]"
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


/* ─── Logo leaf ─── */

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


/* ─── Stem divider ─── */

function StemDivider({ flip }) {
  return (
    <div className="max-w-sm mx-auto px-8 py-1">
      <svg className={`w-full h-5 ${flip ? 'scale-y-[-1]' : ''}`} viewBox="0 0 400 20" fill="none" preserveAspectRatio="none">
        <path d="M0 10 C60 3, 140 17, 200 10 C260 3, 340 17, 400 10" stroke="#7A8B6A" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      </svg>
    </div>
  )
}


/* ─── Product card illustration (Hebrew) ─── */

function ProductCard() {
  return (
    <div className="flex justify-center group">
      <svg className="w-full max-w-[280px] sm:max-w-[300px] transition-all duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-lg" viewBox="0 0 260 440" fill="none">
        {/* Card shell */}
        <rect x="6" y="6" width="248" height="428" rx="18" fill="#FEFCF9" stroke="#C5D1BB" strokeWidth="0.8" />

        {/* ── Plant illustration area ── */}
        <rect x="18" y="18" width="224" height="150" rx="14" fill="#F7F4EF" />

        {/* Pot */}
        <g transform="translate(100, 60)">
          <path d="M16 80 L44 80 L40 100 L20 100Z" fill="#F0E8DE" stroke="#E2D8CC" strokeWidth="1" />
          <rect x="13" y="76" width="34" height="6" rx="2" fill="#E2D8CC" stroke="#D6CCBE" strokeWidth="0.6" />
          {/* Stem */}
          <path d="M30 76 C30 60, 29 40, 30 15" stroke="#7A8B6A" strokeWidth="1.6" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M30 55 C22 48, 10 45, 6 50 C4 55, 16 58, 30 55Z" fill="#7A8B6A" opacity="0.5" stroke="#7A8B6A" strokeWidth="0.7" />
          <path d="M30 40 C38 30, 46 20, 42 12 C38 16, 32 28, 30 40Z" fill="#96A788" opacity="0.45" stroke="#96A788" strokeWidth="0.7" />
          <path d="M30 48 C40 42, 50 34, 50 24 C46 28, 38 36, 30 48Z" fill="#7A8B6A" opacity="0.4" stroke="#7A8B6A" strokeWidth="0.7" />
          <path d="M30 32 C22 22, 12 16, 10 22 C8 28, 22 30, 30 32Z" fill="#96A788" opacity="0.4" stroke="#96A788" strokeWidth="0.7" />
          <path d="M30 22 C34 12, 36 4, 34 0 C30 4, 28 12, 30 22Z" fill="#AE7882" opacity="0.6" stroke="#AE7882" strokeWidth="0.7" />
        </g>

        {/* ── Name + price ── */}
        <text x="130" y="190" textAnchor="middle" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fill: '#2E332B', fontWeight: 600 }}>מונסטרה דלסיוזה</text>
        <text x="130" y="207" textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: '#A0AA96' }}>Monstera Deliciosa</text>
        <text x="130" y="228" textAnchor="middle" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fill: '#5B6A4C', fontWeight: 600 }}>₪89</text>

        {/* ── Divider ── */}
        <path d="M40 240 C80 236, 180 244, 220 240" stroke="#C9A2A9" strokeWidth="0.6" opacity="0.5" />

        {/* ── Specs grid: 2×2 ── */}

        {/* Row 1 — Watering */}
        <g transform="translate(36, 252)">
          {/* Drop icon */}
          <path d="M8 0 C8 0 5 5.5, 5 7.5 C5 10, 7 11.5, 8 11.5 C9 11.5, 11 10, 11 7.5 C11 5.5, 8 0, 8 0Z" stroke="#7A8B6A" strokeWidth="1" fill="#7A8B6A" opacity="0.25" strokeLinejoin="round" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>פעם בשבוע</text>
        </g>

        {/* Row 1 — Light */}
        <g transform="translate(148, 252)">
          {/* Sun icon */}
          <circle cx="7" cy="6" r="3.5" stroke="#7A8B6A" strokeWidth="0.9" fill="#7A8B6A" opacity="0.15" />
          <path d="M7 0.5V-0.5 M7 12.5V11.5 M1.2 6H0.2 M13.8 6H12.8 M3 2L2.3 1.3 M11 10L10.3 9.3 M3 10L2.3 10.7 M11 2L10.3 2.7" stroke="#7A8B6A" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>אור עקיף</text>
        </g>

        {/* Row 2 — Care level */}
        <g transform="translate(36, 275)">
          {/* Leaf icon */}
          <path d="M7 12 C7 12 6 8, 7 4" stroke="#7A8B6A" strokeWidth="1" strokeLinecap="round" />
          <path d="M7 7 C5 5.5, 2.5 5, 2 6.5 C2 6.5 4 8.5, 7 7Z" fill="#7A8B6A" opacity="0.4" stroke="#7A8B6A" strokeWidth="0.5" />
          <path d="M7 5 C8.5 3, 9.5 1.5, 9 0.5 C9 0.5 7 1.5, 7 5Z" fill="#AE7882" opacity="0.55" stroke="#AE7882" strokeWidth="0.5" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>טיפול קל</text>
        </g>

        {/* Row 2 — Size */}
        <g transform="translate(148, 275)">
          {/* Height icon */}
          <path d="M7 1V12 M4.5 3.5L7 1L9.5 3.5 M4.5 9.5L7 12L9.5 9.5" stroke="#7A8B6A" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          <text x="16" y="9" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, fill: '#6B7561' }}>בינוני, 40-60 ס״מ</text>
        </g>

        {/* ── Divider ── */}
        <path d="M40 298 C80 294, 180 302, 220 298" stroke="#C9A2A9" strokeWidth="0.6" opacity="0.5" />

        {/* ── Health bar ── */}
        <text x="224" y="316" textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, fill: '#A0AA96' }}>בריאות</text>
        <text x="42" y="316" style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, fill: '#5B6A4C', fontWeight: 500 }}>מצוין</text>
        <rect x="36" y="322" width="188" height="5" rx="2.5" fill="#F0E8DE" />
        <rect x="36" y="322" width="158" height="5" rx="2.5" fill="#7A8B6A" opacity="0.5" />

        {/* ── Next watering ── */}
        <rect x="18" y="340" width="224" height="44" rx="12" fill="white" stroke="#C9A2A9" strokeWidth="0.7" />

        {/* Water drop accent */}
        <path d="M218 352 C218 352 215 357, 215 359.5 C215 362, 217 363.5, 218 363.5 C219 363.5 221 362, 221 359.5 C221 357 218 352 218 352Z" fill="#AE7882" opacity="0.45" stroke="#AE7882" strokeWidth="0.6" />

        <text x="206" y="358" textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontSize: 7.5, fill: '#AE7882', fontWeight: 500 }}>השקיה הבאה</text>
        <text x="206" y="372" textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: '#2E332B', fontWeight: 500 }}>מחר, 8:00 בבוקר</text>

        {/* ── CTA button ── */}
        <rect x="36" y="396" width="188" height="28" rx="14" fill="#7A8B6A" opacity="0.12" stroke="#7A8B6A" strokeWidth="0.6" opacity="0.3" />
        <text x="130" y="414" textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: '#5B6A4C', fontWeight: 600 }}>הוסיפי לעגלה</text>
      </svg>
    </div>
  )
}


/* ─── How-it-works ─── */

function StepCard({ number, icon, title, text }) {
  return (
    <div className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
      <div className="w-16 h-16 rounded-2xl bg-white/80 border border-green-pale/40 flex items-center justify-center mb-4 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.03]">
        {icon}
      </div>
      <span className="text-ink-faint text-[11px] font-medium tracking-[0.2em] uppercase mb-1.5">Step {number}</span>
      <h3 className="font-display text-lg text-ink mb-1.5 font-medium">{title}</h3>
      <p className="text-ink-light text-sm leading-relaxed max-w-[240px]">{text}</p>
    </div>
  )
}

function ChoosePlantIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
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
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
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
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
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
