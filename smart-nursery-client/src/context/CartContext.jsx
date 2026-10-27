import { createContext, useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    if (!token) setItems([])
  }, [token])

  const addToCart = (plant) => {
    setItems(prev => {
      const existing = prev.find(item => item.plantId === plant.id)
      if (existing) {
        return prev.map(item =>
          item.plantId === plant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { plantId: plant.id, name: plant.name, price: plant.price, quantity: 1 }]
    })
  }

  const removeFromCart = (plantId) => {
    setItems(prev => prev.filter(item => item.plantId !== plantId))
  }

  const updateQuantity = (plantId, quantity) => {
    if (quantity < 1) {
      removeFromCart(plantId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.plantId === plantId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}
