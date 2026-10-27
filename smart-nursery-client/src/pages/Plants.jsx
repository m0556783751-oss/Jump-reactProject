import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getPlantIllustration } from '../components/PlantIllustrations'

const DIFFICULTY_HE = { EASY: 'קל', MEDIUM: 'בינוני', HARD: 'מאתגר' }
const SUNLIGHT_HE = { FULL_SUN: 'שמש מלאה', PARTIAL_SHADE: 'אור עקיף', LOW_LIGHT: 'צל' }

function waterLabel(days) {
  if (!days) return null
  if (days <= 3) return 'כל 2-3 ימים'
  if (days <= 7) return 'פעם בשבוע'
  if (days <= 14) return 'כל שבועיים'
  return `כל ${days} ימים`
}

const CARD_BG = '#FDF8F6'
const CARD_TAG_BG = '#F5EAE6'
const CARD_TAG_TEXT = '#905A67'

function Plants() {
  const { token } = useAuth()
  const { addToCart } = useCart()
  const [message, setMessage] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/plants`)
      if (!res.ok) throw new Error('Failed to load plants')
      return res.json()
    }
  })

  const categories = [...new Map(
    plants
      .filter(p => p.category)
      .map(p => [p.category.id, p.category.name])
  ).entries()].map(([id, name]) => ({ id, name }))

  const filtered = plants
    .filter(p => !activeCategory || p.category?.id === activeCategory)
    .filter(p => !search.trim() || p.name.toLowerCase().includes(search.trim().toLowerCase()) || p.description?.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <div className="-mx-4 sm:-mx-6 -mt-10 px-4 sm:px-6 pt-10 pb-10 bg-pink-pale/8 min-h-screen">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-display text-4xl text-ink mb-1">The Collection</h1>
        <p className="text-ink-light text-sm">Curated plants for every space and every lifestyle.</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative sm:w-64">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-green-pale/20 bg-white/70 text-ink placeholder-ink-faint focus:outline-none focus:border-green-pale focus:ring-1 focus:ring-green-pale/30 transition-colors text-sm"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <Chip active={!activeCategory} onClick={() => setActiveCategory('')}>All</Chip>
            {categories.map(cat => (
              <Chip key={cat.id} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)}>
                {cat.name}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {message && (
        <div className="mb-4 py-2 px-4 rounded-xl bg-green-pale/20 text-green-dark text-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-green-dark/40 hover:text-green-dark cursor-pointer ml-4">&times;</button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center">
          <EmptyPot />
          <p className="text-ink-faint text-sm mt-4 font-light">No plants match your search.</p>
          {(search || activeCategory) && (
            <button
              onClick={() => { setSearch(''); setActiveCategory('') }}
              className="mt-2 text-green-dark text-sm font-medium hover:text-green transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filtered.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            token={token}
            onAdd={() => { addToCart(plant); setMessage(`${plant.name} added to cart.`) }}
          />
        ))}
      </div>
    </div>
  )
}


/* ─── Product card ─── */

function PlantCard({ plant, token, onAdd }) {
  return (
    <div className="group bg-white/50 border border-green-pale/15 rounded-2xl overflow-hidden transition-all duration-500 hover:border-green-pale/40 hover:shadow-lg hover:-translate-y-1">
      {/* Illustration area */}
      <div className="relative px-4 pt-4 pb-2 flex justify-center h-40 sm:h-48" style={{ backgroundColor: CARD_BG }}>
        <div className="w-full h-full max-w-[140px] transition-transform duration-500 group-hover:scale-[1.03]">
          {getPlantIllustration(plant.name)}
        </div>
        {plant.category && (
          <span
            className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ backgroundColor: CARD_TAG_BG, color: CARD_TAG_TEXT }}
          >
            {plant.category.name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4">
        <h3 className="font-display text-base sm:text-lg text-ink font-semibold leading-tight mb-0.5 truncate">{plant.name}</h3>
        <p className="text-base text-green-dark font-semibold mb-2">₪{plant.price}</p>

        {/* Spec icons row */}
        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
          {plant.wateringFrequencyDays && (
            <span className="flex items-center gap-1 text-ink-faint" title={waterLabel(plant.wateringFrequencyDays)}>
              <DropIcon />
              <span className="text-[10px]">{waterLabel(plant.wateringFrequencyDays)}</span>
            </span>
          )}
          {plant.sunlight && (
            <span className="flex items-center gap-1 text-ink-faint" title={SUNLIGHT_HE[plant.sunlight] || plant.sunlight}>
              <SunIcon />
              <span className="text-[10px]">{SUNLIGHT_HE[plant.sunlight]}</span>
            </span>
          )}
          {plant.difficulty && (
            <span className="flex items-center gap-1 text-ink-faint" title={DIFFICULTY_HE[plant.difficulty] || plant.difficulty}>
              <CareIcon />
              <span className="text-[10px]">{DIFFICULTY_HE[plant.difficulty]}</span>
            </span>
          )}
        </div>

        {/* Add to cart */}
        {token && (
          <button
            onClick={onAdd}
            className="w-full py-2 rounded-full text-xs font-medium border border-pink-light/50 text-pink-dark bg-pink-pale/15 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-pink-light/30 hover:border-pink cursor-pointer"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  )
}


/* ─── Chip ─── */

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
        active
          ? 'bg-pink-dark text-white border border-pink-dark'
          : 'text-ink-light hover:text-ink border border-pink-light/50 hover:border-pink-light bg-white/50'
      }`}
    >
      {children}
    </button>
  )
}


/* ─── Icons (logo thin-line style) ─── */

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint/50" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M13 13l4 4" />
    </svg>
  )
}

function DropIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 14" fill="none">
      <path d="M6 1C6 1 2 6.5 2 9C2 11.2 3.8 13 6 13C8.2 13 10 11.2 10 9C10 6.5 6 1 6 1Z" stroke="#5F7150" strokeWidth="0.9" fill="#5F7150" opacity="0.2" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="3" stroke="#5F7150" strokeWidth="0.8" fill="#5F7150" opacity="0.15" />
      <path d="M7 1.5V0.5 M7 13.5V12.5 M1.5 7H0.5 M13.5 7H12.5 M3.1 3.1L2.4 2.4 M10.9 10.9L10.2 10.2 M3.1 10.9L2.4 11.6 M10.9 3.1L10.2 3.8" stroke="#5F7150" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}

function CareIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 14" fill="none">
      <path d="M6 13C6 13 5 9.5 5 7.5C5 5.5 5.5 3 6 1" stroke="#5F7150" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M6 8.5C4.5 7.5 2.5 7 2 8C2 8 3.5 10 6 8.5Z" fill="#5F7150" opacity="0.4" stroke="#5F7150" strokeWidth="0.5" />
      <path d="M6 5C7 3 7.5 1.5 7 1C7 1 5.5 2 6 5Z" fill="#AE7882" opacity="0.45" stroke="#AE7882" strokeWidth="0.5" />
    </svg>
  )
}


/* ─── Empty state ─── */

function EmptyPot() {
  return (
    <svg className="w-20 h-24" viewBox="0 0 80 96" fill="none">
      <path d="M28 56L52 56L49 72L31 72Z" fill="#F0E8DE" stroke="#E2D8CC" strokeWidth="1" />
      <rect x="25" y="52" width="30" height="5" rx="2" fill="#E2D8CC" stroke="#D6CCBE" strokeWidth="0.6" />
      <path d="M40 52 C40 44, 39 36, 40 30" stroke="#5F7150" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.3" />
      <path d="M40 36 C36 32, 30 31, 29 34 C28 37, 34 38, 40 36Z" stroke="#5F7150" strokeWidth="0.8" opacity="0.2" fill="none" strokeDasharray="2 2" />
      <path d="M40 42 C44 38, 48 35, 48 32 C44 34, 42 38, 40 42Z" stroke="#AE7882" strokeWidth="0.8" opacity="0.25" fill="none" strokeDasharray="2 2" />
    </svg>
  )
}


export default Plants
