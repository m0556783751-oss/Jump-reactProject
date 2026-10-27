import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'

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

  const pillClass = (active) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
      active
        ? 'bg-pink-dark text-white border border-pink-dark'
        : 'text-ink-light hover:text-ink border border-pink-light/50 hover:border-pink-light bg-white/50'
    }`

  return (
    <div className="max-w-3xl mx-auto">
      <AdminNav />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Customer messages</h1>
          <p className="text-ink-light text-sm mt-1">
            {unrepliedCount > 0 ? `${unrepliedCount} awaiting reply` : 'All replied'}
            {' '}&middot; {messages.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAll(true)} className={pillClass(showAll)}>All</button>
          <button onClick={() => setShowAll(false)} className={pillClass(!showAll)}>
            Unreplied{unrepliedCount > 0 && ` (${unrepliedCount})`}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => replyMutation.reset()} className="text-pink-deep/50 hover:text-pink-deep cursor-pointer ml-4">&times;</button>
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

      {!isLoading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-light">{showAll ? 'No messages yet.' : 'All messages have been replied to.'}</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(msg => (
          <div key={msg.id} className="bg-white/50 rounded-xl px-6 py-4 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{msg.user?.name || msg.user?.email || 'Customer'}</p>
                {!msg.reply && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-pink-pale text-pink-deep">New</span>
                )}
              </div>
              <p className="text-xs text-ink-faint">{new Date(msg.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="text-ink text-sm mb-2">{msg.content}</p>

            {msg.reply ? (
              <div className="mt-3 pl-4 border-l-2 border-pink-light/50">
                <p className="text-xs font-medium text-green-dark mb-1">Staff reply</p>
                <p className="text-sm text-ink-light">{msg.reply}</p>
              </div>
            ) : (
              <>
                {replyingTo === msg.id ? (
                  <form
                    onSubmit={handleSubmit((data) => replyMutation.mutate({ msgId: msg.id, reply: data.reply }))}
                    className="mt-3 pt-3 border-t border-green-pale/15"
                  >
                    <textarea
                      rows={2}
                      {...register('reply', { required: true })}
                      placeholder="Type your reply..."
                      className="w-full px-4 py-2.5 rounded-lg border border-green-pale/20 bg-cream text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20 transition-colors resize-none text-sm mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={replyMutation.isPending}
                        className="btn-primary px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer disabled:opacity-50"
                      >
                        {replyMutation.isPending ? 'Sending...' : 'Send reply'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="px-4 py-1.5 text-sm font-medium text-ink-light border border-green-pale/30 rounded-full hover:border-green-pale/60 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => startReply(msg.id)}
                    className="mt-2 btn-outline px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer"
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
