import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useCart } from './hooks/useCart'
import Register from './pages/Register'
import Login from './pages/Login'
import Plants from './pages/Plants'
import Orders from './pages/Orders'
import Messages from './pages/Messages'
import Garden from './pages/Garden'
import CareReminders from './pages/CareReminders'
import Home from './pages/Home'
import Cart from './pages/Cart'
import StaffRoute from './components/StaffRoute'
import AdminPlants from './pages/admin/AdminPlants'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMessages from './pages/admin/AdminMessages'
import logoImg from './assets/logo.png'

function App() {
  const { token, isStaff, logout } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <nav className="bg-white/85 backdrop-blur-md border-b border-pink-light/25 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="no-underline hover:opacity-80 transition-opacity">
              <img src={logoImg} alt="Verdora" className="h-14" />
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 text-ink-light hover:text-ink transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-6">
              <NavLinks token={token} logout={logout} itemCount={itemCount} isStaff={isStaff} />
            </div>
          </div>

          {menuOpen && (
            <div className="sm:hidden pb-4 flex flex-col gap-2" onClick={() => setMenuOpen(false)}>
              <NavLinks token={token} logout={logout} itemCount={itemCount} isStaff={isStaff} />
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/reminders" element={<CareReminders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Navigate to="/admin/plants" replace />} />
          <Route path="/admin/plants" element={<StaffRoute><AdminPlants /></StaffRoute>} />
          <Route path="/admin/orders" element={<StaffRoute><AdminOrders /></StaffRoute>} />
          <Route path="/admin/messages" element={<StaffRoute><AdminMessages /></StaffRoute>} />
        </Routes>
      </main>

      <footer className="bg-green-pale/20 border-t border-green-pale/25">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="font-display text-lg text-green-dark mb-3 flex items-center gap-2">
                <VerdoraLeaf className="w-5 h-5 text-green" />
                Verdora
              </p>
              <p className="text-sm text-ink-faint leading-relaxed">
                A smart, tech-driven plant boutique. Curated greens, delivered seamlessly.
              </p>
            </div>
            <div>
              <p className="font-display text-base text-green-dark mb-3">Contact</p>
              <div className="space-y-1.5 text-sm text-ink-faint">
                <p>Phone: 050-123-4567</p>
                <p>Email: info@verdora.co.il</p>
                <p>Sun-Thu: 9:00-18:00</p>
                <p>Fri: 9:00-13:00</p>
              </div>
            </div>
            <div>
              <p className="font-display text-base text-green-dark mb-3">Quick links</p>
              <div className="space-y-1.5 text-sm text-ink-faint">
                <p><Link to="/plants" className="text-ink-faint no-underline hover:text-green-dark transition-colors">Browse plants</Link></p>
                <p><Link to="/garden" className="text-ink-faint no-underline hover:text-green-dark transition-colors">My garden</Link></p>
                <p><Link to="/reminders" className="text-ink-faint no-underline hover:text-green-dark transition-colors">Care reminders</Link></p>
              </div>
              <div className="mt-4 inline-block px-3 py-1.5 rounded-full bg-pink-pale/30 text-xs text-pink-dark font-medium">
                Payment upon delivery
              </div>
            </div>
          </div>
          <div className="border-t border-green-pale/25 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-ink-faint/60">&copy; {new Date().getFullYear()} Verdora. All rights reserved.</p>
            <p className="text-xs text-ink-faint/60">Naturally smarter for you</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function VerdoraLeaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 10 17 10 12C10 8 11 5 12 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14C9.5 12.5 6 12 4.5 13C4.5 13 6.5 16.5 12 14Z" fill="currentColor" opacity="0.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9C14 6.5 15 3.5 14.5 2C14.5 2 11 3 12 9Z" fill="currentColor" opacity="0.3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11C14.5 10 17 8 17 6C17 6 14 6 12 11Z" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

function NavLinks({ token, logout, itemCount, isStaff }) {
  const link = "text-sm text-ink-light no-underline hover:text-green transition-colors"

  return (
    <>
      <Link to="/plants" className={link}>Plants</Link>
      {token ? (
        <>
          <Link to="/orders" className={link}>Orders</Link>
          <Link to="/garden" className={link}>Garden</Link>
          <Link to="/messages" className={link}>Messages</Link>
          <Link to="/reminders" className={link}>Reminders</Link>
          {isStaff && (
            <Link to="/admin" className="text-sm text-green no-underline hover:text-green-dark transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              Admin
            </Link>
          )}
          <Link to="/cart" className="relative text-ink-light no-underline hover:text-pink-dark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -left-2 min-w-[18px] h-[18px] bg-pink text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={logout} className="text-sm text-ink-faint hover:text-pink-dark transition-colors cursor-pointer">Log out</button>
        </>
      ) : (
        <>
          <Link to="/login" className={link}>Log in</Link>
          <Link to="/register" className="btn-primary text-sm px-5 py-1.5 rounded-full no-underline">
            Join
          </Link>
        </>
      )}
    </>
  )
}

export default App
