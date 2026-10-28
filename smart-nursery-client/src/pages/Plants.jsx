import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getPlantIllustration } from '../components/PlantIllustrations'
import './Plants.css'

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
    <div className="plants-page">
      <div className="plants-header">
        <h1 className="plants-title">The Collection</h1>
        <p className="plants-subtitle">Curated plants for every space and every lifestyle.</p>
      </div>

      <div className="plants-filters">
        <div className="plants-search-wrap">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="plants-search-input"
          />
        </div>

        {categories.length > 0 && (
          <div className="plants-chips">
            <Chip active={!activeCategory} onClick={() => setActiveCategory('')}>All</Chip>
            {categories.map(cat => (
              <Chip key={cat.id} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)}>
                {cat.name}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {message && (
        <div className="plants-toast">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="plants-toast-close">&times;</button>
        </div>
      )}

      {isLoading && (
        <div className="plants-loading">
          <div className="plants-spinner" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="plants-empty">
          <EmptyPot />
          <p className="plants-empty-text">No plants match your search.</p>
          {(search || activeCategory) && (
            <button
              onClick={() => { setSearch(''); setActiveCategory('') }}
              className="plants-empty-clear"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="plants-grid">
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


function PlantCard({ plant, token, onAdd }) {
  return (
    <div className="plant-card">
      <div className="plant-card-illustration" style={{ backgroundColor: CARD_BG }}>
        <div className="plant-card-illustration-inner">
          {getPlantIllustration(plant.name)}
        </div>
        {plant.category && (
          <span
            className="plant-card-category"
            style={{ backgroundColor: CARD_TAG_BG, color: CARD_TAG_TEXT }}
          >
            {plant.category.name}
          </span>
        )}
      </div>

      <div className="plant-card-info">
        <h3 className="plant-card-name">{plant.name}</h3>
        <p className="plant-card-price">₪{plant.price}</p>

        <div className="plant-card-specs">
          {plant.wateringFrequencyDays && (
            <span className="plant-card-spec" title={waterLabel(plant.wateringFrequencyDays)}>
              <DropIcon />
              <span className="plant-card-spec-text">{waterLabel(plant.wateringFrequencyDays)}</span>
            </span>
          )}
          {plant.sunlight && (
            <span className="plant-card-spec" title={SUNLIGHT_HE[plant.sunlight] || plant.sunlight}>
              <SunIcon />
              <span className="plant-card-spec-text">{SUNLIGHT_HE[plant.sunlight]}</span>
            </span>
          )}
          {plant.difficulty && (
            <span className="plant-card-spec" title={DIFFICULTY_HE[plant.difficulty] || plant.difficulty}>
              <CareIcon />
              <span className="plant-card-spec-text">{DIFFICULTY_HE[plant.difficulty]}</span>
            </span>
          )}
        </div>

        {token && (
          <button onClick={onAdd} className="plant-card-add">
            Add to cart
          </button>
        )}
      </div>
    </div>
  )
}


function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`plants-chip ${active ? 'plants-chip--active' : 'plants-chip--inactive'}`}
    >
      {children}
    </button>
  )
}


function SearchIcon() {
  return (
    <svg className="plants-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M13 13l4 4" />
    </svg>
  )
}

function DropIcon() {
  return (
    <svg className="plant-card-spec-icon" viewBox="0 0 12 14" fill="none">
      <path d="M6 1C6 1 2 6.5 2 9C2 11.2 3.8 13 6 13C8.2 13 10 11.2 10 9C10 6.5 6 1 6 1Z" stroke="#5F7150" strokeWidth="0.9" fill="#5F7150" opacity="0.2" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="plant-card-spec-icon" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="3" stroke="#5F7150" strokeWidth="0.8" fill="#5F7150" opacity="0.15" />
      <path d="M7 1.5V0.5 M7 13.5V12.5 M1.5 7H0.5 M13.5 7H12.5 M3.1 3.1L2.4 2.4 M10.9 10.9L10.2 10.2 M3.1 10.9L2.4 11.6 M10.9 3.1L10.2 3.8" stroke="#5F7150" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}

function CareIcon() {
  return (
    <svg className="plant-card-spec-icon" viewBox="0 0 12 14" fill="none">
      <path d="M6 13C6 13 5 9.5 5 7.5C5 5.5 5.5 3 6 1" stroke="#5F7150" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M6 8.5C4.5 7.5 2.5 7 2 8C2 8 3.5 10 6 8.5Z" fill="#5F7150" opacity="0.4" stroke="#5F7150" strokeWidth="0.5" />
      <path d="M6 5C7 3 7.5 1.5 7 1C7 1 5.5 2 6 5Z" fill="#AE7882" opacity="0.45" stroke="#AE7882" strokeWidth="0.5" />
    </svg>
  )
}


function EmptyPot() {
  return (
    <svg className="plants-empty-pot" viewBox="0 0 80 96" fill="none">
      <path d="M28 56L52 56L49 72L31 72Z" fill="#F0E8DE" stroke="#E2D8CC" strokeWidth="1" />
      <rect x="25" y="52" width="30" height="5" rx="2" fill="#E2D8CC" stroke="#D6CCBE" strokeWidth="0.6" />
      <path d="M40 52 C40 44, 39 36, 40 30" stroke="#5F7150" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.3" />
      <path d="M40 36 C36 32, 30 31, 29 34 C28 37, 34 38, 40 36Z" stroke="#5F7150" strokeWidth="0.8" opacity="0.2" fill="none" strokeDasharray="2 2" />
      <path d="M40 42 C44 38, 48 35, 48 32 C44 34, 42 38, 40 42Z" stroke="#AE7882" strokeWidth="0.8" opacity="0.25" fill="none" strokeDasharray="2 2" />
    </svg>
  )
}


export default Plants
