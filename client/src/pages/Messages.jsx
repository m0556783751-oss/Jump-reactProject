import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import './Messages.css'

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
    <div className="messages-page">
      <h1 className="messages-title">Messages</h1>

      <div className="messages-send-card">
        <p className="messages-send-title">Send us a note</p>

        {sendMutation.error && <div className="messages-error">{sendMutation.error.message}</div>}
        {success && <div className="messages-success">{success}</div>}

        <form onSubmit={handleSubmit((data) => { setSuccess(''); sendMutation.mutate(data) })}>
          <textarea
            rows={3}
            placeholder="What's on your mind?"
            {...register('content', { required: true })}
            className="messages-textarea"
          />
          <button
            type="submit"
            disabled={sendMutation.isPending}
            className="messages-send-button btn-outline"
          >
            {sendMutation.isPending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      <p className="messages-history-label">History</p>

      {isLoading && (
        <div className="messages-loading">
          <div className="messages-spinner" />
        </div>
      )}

      {!isLoading && messages.length === 0 && (
        <div className="messages-empty">
          <p className="messages-empty-text">No messages yet. We're here when you need us.</p>
        </div>
      )}

      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className="message-card">
            <p className="message-content">{msg.content}</p>
            <p className="message-date">{new Date(msg.createdAt).toLocaleDateString()}</p>
            {msg.reply && (
              <div className="message-reply">
                <p className="message-reply-text">{msg.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages
