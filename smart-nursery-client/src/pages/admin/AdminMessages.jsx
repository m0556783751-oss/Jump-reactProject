import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'
import './AdminMessages.css'

function AdminMessages() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [showAll, setShowAll] = useState(true)

  const { register, handleSubmit, reset } = useForm()

  const api = import.meta.env.VITE_API_URL

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await fetch(`${api}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load messages')
      return res.json()
    },
    enabled: !!token
  })

  const replyMutation = useMutation({
    mutationFn: async ({ msgId, reply }) => {
      const res = await fetch(`${api}/messages/${msgId}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ reply: reply.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send reply')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      setReplyingTo(null)
      reset()
      setSuccess('Reply sent.')
    }
  })

  const unrepliedCount = messages.filter(m => !m.reply).length
  const filtered = showAll ? messages : messages.filter(m => !m.reply)
  const errorMessage = replyMutation.error?.message

  const startReply = (msgId) => {
    setReplyingTo(msgId)
    reset({ reply: '' })
    setSuccess('')
    replyMutation.reset()
  }

  const cancelReply = () => {
    setReplyingTo(null)
    reset()
  }

  return (
    <div className="admin-messages-page">
      <AdminNav />
      <div className="admin-messages-header">
        <div>
          <h1 className="admin-messages-title">Customer messages</h1>
          <p className="admin-messages-subtitle">
            {unrepliedCount > 0 ? `${unrepliedCount} awaiting reply` : 'All replied'}
            {' '}&middot; {messages.length} total
          </p>
        </div>
        <div className="admin-messages-pills">
          <button onClick={() => setShowAll(true)} className={`admin-messages-pill ${showAll ? 'admin-messages-pill--active' : 'admin-messages-pill--inactive'}`}>All</button>
          <button onClick={() => setShowAll(false)} className={`admin-messages-pill ${!showAll ? 'admin-messages-pill--active' : 'admin-messages-pill--inactive'}`}>
            Unreplied{unrepliedCount > 0 && ` (${unrepliedCount})`}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="admin-messages-error">
          <span>{errorMessage}</span>
          <button onClick={() => replyMutation.reset()} className="admin-messages-error-close">&times;</button>
        </div>
      )}
      {success && (
        <div className="admin-messages-success">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="admin-messages-success-close">&times;</button>
        </div>
      )}

      {isLoading && (
        <div className="admin-messages-loading">
          <div className="admin-messages-spinner" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="admin-messages-empty">
          <p className="admin-messages-empty-text">{showAll ? 'No messages yet.' : 'All messages have been replied to.'}</p>
        </div>
      )}

      <div className="admin-messages-list">
        {filtered.map(msg => (
          <div key={msg.id} className="admin-message-card">
            <div className="admin-message-top">
              <div className="admin-message-user-wrap">
                <p className="admin-message-user">{msg.user?.name || msg.user?.email || 'Customer'}</p>
                {!msg.reply && (
                  <span className="admin-message-new-tag">New</span>
                )}
              </div>
              <p className="admin-message-date">{new Date(msg.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="admin-message-content">{msg.content}</p>

            {msg.reply ? (
              <div className="admin-message-reply">
                <p className="admin-message-reply-label">Staff reply</p>
                <p className="admin-message-reply-text">{msg.reply}</p>
              </div>
            ) : (
              <>
                {replyingTo === msg.id ? (
                  <form
                    onSubmit={handleSubmit((data) => replyMutation.mutate({ msgId: msg.id, reply: data.reply }))}
                    className="admin-message-reply-form"
                  >
                    <textarea
                      rows={2}
                      {...register('reply', { required: true })}
                      placeholder="Type your reply..."
                      className="admin-message-reply-textarea"
                    />
                    <div className="admin-message-reply-actions">
                      <button
                        type="submit"
                        disabled={replyMutation.isPending}
                        className="admin-message-reply-submit btn-primary"
                      >
                        {replyMutation.isPending ? 'Sending...' : 'Send reply'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="admin-message-reply-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => startReply(msg.id)}
                    className="admin-message-reply-btn btn-outline"
                  >
                    Reply
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminMessages
