import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

function loadUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(loadUser)
  const [authLoading, setAuthLoading] = useState(() => !!localStorage.getItem('token') && !loadUser())

  useEffect(() => {
    if (!token) return
    if (user) return

    setAuthLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token')
        return res.json()
      })
      .then(data => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      })
      .catch(() => {
        setToken('')
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      .finally(() => setAuthLoading(false))
  }, [token, user])

  const isStaff = user?.role === 'STAFF'

  const login = (newToken, userData) => {
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ token, user, isStaff, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
