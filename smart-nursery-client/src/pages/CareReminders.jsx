import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'

function CareReminders() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const { data: reminders = [], isLoading, error: queryError } = useQuery({
    queryKey: ['care-reminders'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/care-reminders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load reminders')
      return res.json()
    },
    enabled: !!token
  })

  const markDoneMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/care-reminders/${id}/done`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to mark as done')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-reminders'] })
      queryClient.invalidateQueries({ queryKey: ['garden'] })
    }
  })

  const error = queryError?.message || markDoneMutation.error?.message

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl text-ink mb-2">What needs doing</h1>
        <p className="text-pink-dark/60">A gentle list. No pressure.</p>
      </div>

      {error && <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm">{error}</div>}

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && reminders.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-light">Nothing right now. Enjoy the quiet.</p>
        </div>
      )}

      <div className="space-y-3">
        {reminders.map(reminder => (
          <div key={reminder.id} className="bg-white/50 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#F5EAE6', color: '#905A67' }}>
                  {reminder.type}
                </span>
                <span className="text-ink font-medium text-sm">{reminder.message}</span>
              </div>
              <p className="text-xs text-ink-faint">
                Due {new Date(reminder.dueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => markDoneMutation.mutate(reminder.id)}
              className="btn-outline px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer shrink-0"
            >
              Done
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CareReminders
