import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import './Orders.css'

function Orders() {
  const { token } = useAuth()

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch orders')
      return res.json()
    },
    enabled: !!token
  })

  const statusClass = (status) => {
    if (status === 'COMPLETED') return 'order-status--completed'
    if (status === 'CANCELLED') return 'order-status--cancelled'
    return 'order-status--pending'
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">Orders</h1>
      <div className="orders-payment-banner">
        <svg className="orders-payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span>Payment is collected upon delivery of your flowers.</span>
      </div>

      {error && <div className="orders-error">{error.message}</div>}

      {isLoading && (
        <div className="orders-loading">
          <div className="orders-spinner" />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="orders-empty">
          <p className="orders-empty-text">Nothing here yet. Your first order is just a click away.</p>
        </div>
      )}

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div>
              <p className="order-item-name">{order.plant.name}</p>
              <p className="order-item-date">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`order-status ${statusClass(order.status)}`}>
              {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
