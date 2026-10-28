import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "That didn't work. Try again?")
      return data
    },
    onSuccess: (data) => {
      login(data.token, data.user)
      navigate(data.user.role === 'STAFF' ? '/admin' : '/plants')
    }
  })

  return (
    <div className="login-page">
      <div className="login-card">
      <h2 className="login-title">Welcome back</h2>
      <p className="login-subtitle">Pick up where you left off.</p>

      {loginMutation.error && (
        <div className="login-error">{loginMutation.error.message}</div>
      )}

      <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="login-form">
        <div>
          <label className="login-label">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
            className="login-input"
          />
          {errors.email && <p className="login-field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="login-label">Password</label>
          <input
            type="password"
            placeholder="Your password"
            {...register('password', { required: 'Password is required' })}
            className="login-input"
          />
          {errors.password && <p className="login-field-error">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="login-submit btn-primary"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="login-register-text">
        New around here?{' '}
        <Link to="/register" className="login-register-link">Create an account</Link>
      </p>
      </div>
    </div>
  )
}

export default Login
