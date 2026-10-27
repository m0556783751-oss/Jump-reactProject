import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      return data
    },
    onSuccess: (data) => {
      login(data.token, data.user)
      navigate('/plants')
    }
  })

  const input = "w-full px-4 py-2.5 rounded-lg border border-green-pale/20 bg-white text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20 transition-colors text-sm"

  return (
    <div className="max-w-sm mx-auto pt-8">
      <div className="bg-white/50 border border-green-pale/15 rounded-2xl p-8">
      <h2 className="font-display text-3xl text-ink mb-1">Come on in</h2>
      <p className="text-pink-dark/50 text-sm mb-8">Takes about a minute.</p>

      {registerMutation.error && (
        <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm">{registerMutation.error.message}</div>
      )}

      <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-light mb-1.5">Name</label>
          <input
            type="text"
            placeholder="What should we call you?"
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
            className={input}
          />
          {errors.name && <p className="text-pink-dark text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-light mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
            className={input}
          />
          {errors.email && <p className="text-pink-dark text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-light mb-1.5">Password</label>
          <input
            type="password"
            placeholder="Something you'll remember"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
            className={input}
          />
          {errors.password && <p className="text-pink-dark text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full py-2.5 btn-primary rounded-lg font-medium text-sm cursor-pointer disabled:opacity-50"
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-ink-faint">
        Already here?{' '}
        <Link to="/login" className="text-green hover:text-green-dark transition-colors">Log in</Link>
      </p>
      </div>
    </div>
  )
}

export default Register
