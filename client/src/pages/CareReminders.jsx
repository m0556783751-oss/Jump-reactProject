import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import './CareReminders.css'

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
    <div className="reminders-page">
      <div className="reminders-header">
        <h1 className="reminders-title">What needs doing</h1>
        <p className="reminders-subtitle">A gentle list. No pressure.</p>
      </div>

      {error && <div className="reminders-error">{error}</div>}

      {isLoading && (
        <div className="reminders-loading">
          <div className="reminders-spinner" />
        </div>
      )}

      {!isLoading && reminders.length === 0 && (
        <div className="reminders-empty">
          <p className="reminders-empty-text">Nothing right now. Enjoy the quiet.</p>
        </div>
      )}

      <div className="reminders-list">
        {reminders.map(reminder => (
          <div key={reminder.id} className="reminder-item">
            <div>
              <div className="reminder-item-top">
                <span className="reminder-type-tag">
                  {reminder.type}
                </span>
                <span className="reminder-message">{reminder.message}</span>
              </div>
              <p className="reminder-date">
                Due {new Date(reminder.dueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => markDoneMutation.mutate(reminder.id)}
              className="reminder-done-button btn-outline"
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
