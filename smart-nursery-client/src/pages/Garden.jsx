import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import './Garden.css'

function Garden() {
  const { token } = useAuth()

  const { data: plants = [], isLoading, error } = useQuery({
    queryKey: ['garden'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/my-garden`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load garden')
      return res.json()
    },
    enabled: !!token
  })

  return (
    <div>
      <div className="garden-header">
        <h1 className="garden-title">Your garden</h1>
        <p className="garden-subtitle">Everything in one place. Nothing forgotten.</p>
      </div>

      {error && <div className="garden-error">{error.message}</div>}

      {isLoading && (
        <div className="garden-loading">
          <div className="garden-spinner" />
        </div>
      )}

      {!isLoading && plants.length === 0 && (
        <div className="garden-empty">
          <p className="garden-empty-text">Nothing here yet. That's about to change.</p>
        </div>
      )}

      <div className="garden-grid">
        {plants.map(item => (
          <div key={item.id} className="garden-card">
            <div className="garden-card-header">
              <p className="garden-card-name">{item.plant.name}</p>
              <span className="garden-card-category">
                {item.plant.category.name}
              </span>
            </div>
            <div className="garden-card-body">
            {item.careReminders.length > 0 ? (
              <div>
                <p className="garden-attention-label">Needs attention</p>
                <div className="garden-reminders">
                  {item.careReminders.map(reminder => (
                    <span key={reminder.id} className="garden-reminder-tag">
                      {reminder.type}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="garden-all-good">All good</p>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Garden
