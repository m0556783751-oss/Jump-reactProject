import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'

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

  const statusStyle = (status) => {
    if (status === 'COMPLETED') return 'bg-green/10 text-green-dark'
    if (status === 'CANCELLED') return 'bg-pink-pale text-pink-deep'
    return 'bg-cream-deep text-ink-light'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-ink mb-2">Orders</h1>
      <div className="mb-8 py-2.5 px-4 rounded-lg bg-green/8 text-green-dark text-sm flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span>Payment is collected upon delivery of your flowers.</span>
      </div>

      {error && <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm">{error.message}</div>}

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-light">Nothing here yet. Your first order is just a click away.</p>
        </div>
      )}

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="bg-white/50 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5">
            <div>
              <p className="font-display text-lg text-ink">{order.plant.name}</p>
              <p className="text-ink-faint text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${statusStyle(order.status)}`}>
              {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
