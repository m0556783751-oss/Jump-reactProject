import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'
import './AdminOrders.css'

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

  const statusClass = (status) => {
    if (status === 'COMPLETED') return 'admin-order-status--completed'
    if (status === 'CANCELLED') return 'admin-order-status--cancelled'
    return 'admin-order-status--pending'
  }

  const isPending = (status) => status !== 'COMPLETED' && status !== 'CANCELLED'
  const filtered = filter ? orders.filter(o => o.status === filter) : orders
  const pendingCount = orders.filter(o => isPending(o.status)).length

  return (
    <div className="admin-orders-page">
      <AdminNav />
      <div className="admin-orders-header">
        <div>
          <h1 className="admin-orders-title">Manage orders</h1>
          <p className="admin-orders-subtitle">
            {pendingCount > 0 ? `${pendingCount} pending` : 'All caught up'}
            {' '}&middot; {orders.length} total
          </p>
        </div>
        <div className="admin-orders-pills">
          {[['', 'All'], ['PENDING', 'Pending'], ['COMPLETED', 'Completed'], ['CANCELLED', 'Cancelled']].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`admin-orders-pill ${filter === value ? 'admin-orders-pill--active' : 'admin-orders-pill--inactive'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="admin-orders-error">
          <span>{errorMessage}</span>
          <button onClick={() => statusMutation.reset()} className="admin-orders-error-close">&times;</button>
        </div>
      )}
      {success && (
        <div className="admin-orders-success">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="admin-orders-success-close">&times;</button>
        </div>
      )}

      {isLoading && (
        <div className="admin-orders-loading">
          <div className="admin-orders-spinner" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="admin-orders-empty">
          <p className="admin-orders-empty-text">{filter ? `No ${filter.toLowerCase()} orders.` : 'No orders yet.'}</p>
        </div>
      )}

      <div className="admin-orders-list">
        {filtered.map(order => (
          <div key={order.id} className="admin-order-card">
            <div className="admin-order-info">
              <p className="admin-order-plant">{order.plant?.name || 'Unknown plant'}</p>
              <div className="admin-order-meta">
                {order.user && <span>{order.user.name || order.user.email}</span>}
                <span>&middot;</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="admin-order-actions">
              <span className={`admin-order-status ${statusClass(order.status)}`}>
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </span>
              {isPending(order.status) && (
                <>
                  <button
                    onClick={() => statusMutation.mutate({ orderId: order.id, status: 'COMPLETED' })}
                    className="admin-order-complete-btn"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => statusMutation.mutate({ orderId: order.id, status: 'CANCELLED' })}
                    className="admin-order-cancel-btn"
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
