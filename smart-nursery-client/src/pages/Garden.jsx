import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'

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
      <div className="mb-10">
        <h1 className="font-display text-3xl text-ink mb-2">Your garden</h1>
        <p className="text-pink-dark/60">Everything in one place. Nothing forgotten.</p>
      </div>

      {error && <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm">{error.message}</div>}

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && plants.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-light">Nothing here yet. That's about to change.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {plants.map(item => (
          <div key={item.id} className="group rounded-2xl overflow-hidden border border-green-pale/15 bg-white/50 transition-all duration-500 hover:border-green-pale/40 hover:shadow-lg hover:-translate-y-1">
            <div className="px-4 pt-4 pb-2" style={{ backgroundColor: '#FDF8F6' }}>
              <p className="font-display text-xl text-ink mb-0.5">{item.plant.name}</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#F5EAE6', color: '#905A67' }}>
                {item.plant.category.name}
              </span>
            </div>
            <div className="px-4 pt-3 pb-4">
            {item.careReminders.length > 0 ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-pink-dark mb-2">Needs attention</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.careReminders.map(reminder => (
                    <span key={reminder.id} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#F5EAE6', color: '#905A67' }}>
                      {reminder.type}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs font-medium text-green">All good</p>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Garden
