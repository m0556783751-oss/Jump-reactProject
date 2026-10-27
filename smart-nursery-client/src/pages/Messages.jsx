import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'

function Messages() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset } = useForm()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load messages')
      return res.json()
    },
    enabled: !!token
  })

  const sendMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      setSuccess('Sent.')
      reset()
    }
  })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl text-ink mb-8">Messages</h1>

      <div className="bg-white/50 rounded-xl p-6 mb-10 border border-green-pale/15">
        <p className="font-medium text-ink mb-4">Send us a note</p>

        {sendMutation.error && <div className="mb-4 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm">{sendMutation.error.message}</div>}
        {success && <div className="mb-4 py-2.5 px-4 rounded-lg bg-green/10 text-green-dark text-sm">{success}</div>}

        <form onSubmit={handleSubmit((data) => { setSuccess(''); sendMutation.mutate(data) })}>
          <textarea
            rows={3}
            placeholder="What's on your mind?"
            {...register('content', { required: true })}
            className="w-full px-4 py-3 rounded-lg border border-green-pale/20 bg-cream text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20 transition-colors resize-none mb-4 text-sm"
          />
          <button
            type="submit"
            disabled={sendMutation.isPending}
            className="btn-outline px-5 py-2 text-sm font-medium rounded-full cursor-pointer disabled:opacity-50"
          >
            {sendMutation.isPending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      <p className="text-xs font-medium uppercase tracking-widest text-ink-faint mb-4">History</p>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && messages.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-ink-light">No messages yet. We're here when you need us.</p>
        </div>
      )}

      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white/50 rounded-xl px-6 py-4 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5">
            <p className="text-ink text-sm mb-1">{msg.content}</p>
            <p className="text-xs text-ink-faint">{new Date(msg.createdAt).toLocaleDateString()}</p>
            {msg.reply && (
              <div className="mt-3 pl-4 border-l-2 border-pink-light/50">
                <p className="text-sm text-ink-light">{msg.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages
