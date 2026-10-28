import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'

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
    <div className="max-w-3xl mx-auto">
      <AdminNav />
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Users</h1>
        <p className="text-ink-light text-sm mt-1">{users.length} registered customers</p>
      </div>

      {errorMessage && (
        <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => removeMutation.reset()} className="text-pink-deep/50 hover:text-pink-deep cursor-pointer ml-4">&times;</button>
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

      {!isLoading && users.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-light">No customers yet.</p>
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} className="bg-white/50 rounded-xl px-6 py-4 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-green-pale/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-green-dark">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                    <p className="text-xs text-ink-faint truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <p className="text-xs text-ink-faint hidden sm:block">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {confirmId === user.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeMutation.mutate(user.id)}
                        disabled={removeMutation.isPending}
                        className="px-3 py-1 text-xs font-medium text-white bg-pink-deep rounded-full cursor-pointer hover:bg-pink-deep/80 transition-colors disabled:opacity-50"
                      >
                        {removeMutation.isPending ? 'Removing...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-1 text-xs font-medium text-ink-light border border-green-pale/30 rounded-full hover:border-green-pale/60 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setConfirmId(user.id); setSuccess(''); removeMutation.reset() }}
                      className="px-3 py-1 text-xs font-medium text-pink-deep border border-pink-light/50 rounded-full hover:bg-pink-pale/50 transition-colors cursor-pointer"
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
