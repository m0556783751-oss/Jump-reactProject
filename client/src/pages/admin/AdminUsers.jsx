import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'
import './AdminUsers.css'

function AdminUsers() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [confirmId, setConfirmId] = useState(null)
  const [success, setSuccess] = useState('')

  const api = import.meta.env.VITE_API_URL

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch(`${api}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load users')
      return res.json()
    },
    enabled: !!token
  })

  const users = allUsers.filter(u => u.role === 'CUSTOMER')

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${api}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to remove user')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setConfirmId(null)
      setSuccess('User removed.')
    },
    onError: () => {
      setConfirmId(null)
    }
  })

  const errorMessage = removeMutation.error?.message

  return (
    <div className="admin-users-page">
      <AdminNav />
      <div className="admin-users-header">
        <h1 className="admin-users-title">Users</h1>
        <p className="admin-users-subtitle">{users.length} registered customers</p>
      </div>

      {errorMessage && (
        <div className="admin-users-error">
          <span>{errorMessage}</span>
          <button onClick={() => removeMutation.reset()} className="admin-users-error-close">&times;</button>
        </div>
      )}
      {success && (
        <div className="admin-users-success">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="admin-users-success-close">&times;</button>
        </div>
      )}

      {isLoading && (
        <div className="admin-users-loading">
          <div className="admin-users-spinner" />
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <div className="admin-users-empty">
          <p className="admin-users-empty-text">No customers yet.</p>
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <div className="admin-users-list">
          {users.map(user => (
            <div key={user.id} className="admin-user-card">
              <div className="admin-user-row">
                <div className="admin-user-info">
                  <div className="admin-user-avatar">
                    <span className="admin-user-avatar-letter">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="admin-user-details">
                    <p className="admin-user-name">{user.name}</p>
                    <p className="admin-user-email">{user.email}</p>
                  </div>
                </div>

                <div className="admin-user-actions">
                  <p className="admin-user-date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {confirmId === user.id ? (
                    <div className="admin-user-confirm-wrap">
                      <button
                        onClick={() => removeMutation.mutate(user.id)}
                        disabled={removeMutation.isPending}
                        className="admin-user-confirm-btn"
                      >
                        {removeMutation.isPending ? 'Removing...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="admin-user-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setConfirmId(user.id); setSuccess(''); removeMutation.reset() }}
                      className="admin-user-remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
