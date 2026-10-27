import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'

function AdminOrders() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('')

  const api = import.meta.env.VITE_API_URL

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch(`${api}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load orders')
      return res.json()
    },
    enabled: !!token
  })

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const res = await fetch(`${api}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update')
      return { status }
    },
    onSuccess: ({ status }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['garden'] })
      setSuccess(`Order ${status === 'COMPLETED' ? 'completed' : 'cancelled'}.`)
    }
  })

  const errorMessage = statusMutation.error?.message

  const statusStyle = (status) => {
    if (status === 'COMPLETED') return 'bg-green/10 text-green-dark'
    if (status === 'CANCELLED') return 'bg-pink-pale text-pink-deep'
    return 'bg-cream-deep text-ink-light'
  }

  const isPending = (status) => status !== 'COMPLETED' && status !== 'CANCELLED'
  const filtered = filter ? orders.filter(o => o.status === filter) : orders
  const pendingCount = orders.filter(o => isPending(o.status)).length

  const pillClass = (value) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
      filter === value
        ? 'bg-pink-dark text-white border border-pink-dark'
        : 'text-ink-light hover:text-ink border border-pink-light/50 hover:border-pink-light bg-white/50'
    }`

  return (
    <div className="max-w-4xl mx-auto">
      <AdminNav />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Manage orders</h1>
          <p className="text-ink-light text-sm mt-1">
            {pendingCount > 0 ? `${pendingCount} pending` : 'All caught up'}
            {' '}&middot; {orders.length} total
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('')} className={pillClass('')}>All</button>
          <button onClick={() => setFilter('PENDING')} className={pillClass('PENDING')}>Pending</button>
          <button onClick={() => setFilter('COMPLETED')} className={pillClass('COMPLETED')}>Completed</button>
          <button onClick={() => setFilter('CANCELLED')} className={pillClass('CANCELLED')}>Cancelled</button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => statusMutation.reset()} className="text-pink-deep/50 hover:text-pink-deep cursor-pointer ml-4">&times;</button>
        </div>
      )}
      {success && (
        <div className="mb-5 py-2.5 px-4 rounded-lg bg-green/10 text-green-dark text-sm flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-dark/50 hover:text-green-dark cursor-pointer ml-4">&times;</button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-light">{filter ? `No ${filter.toLowerCase()} orders.` : 'No orders yet.'}</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-white/50 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg text-ink">{order.plant?.name || 'Unknown plant'}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-ink-faint">
                {order.user && <span>{order.user.name || order.user.email}</span>}
                <span>&middot;</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(order.status)}`}>
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </span>
              {isPending(order.status) && (
                <>
                  <button
                    onClick={() => statusMutation.mutate({ orderId: order.id, status: 'COMPLETED' })}
                    className="px-4 py-1.5 text-sm font-medium text-green-dark border border-green-pale rounded-full hover:bg-green/10 transition-colors cursor-pointer"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => statusMutation.mutate({ orderId: order.id, status: 'CANCELLED' })}
                    className="px-4 py-1.5 text-sm font-medium text-pink-dark border border-pink-light rounded-full hover:bg-pink-pale transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOrders
