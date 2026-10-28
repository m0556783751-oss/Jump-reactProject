import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Register.css'

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

  return (
    <div className="register-page">
      <div className="register-card">
      <h2 className="register-title">Come on in</h2>
      <p className="register-subtitle">Takes about a minute.</p>

      {registerMutation.error && (
        <div className="register-error">{registerMutation.error.message}</div>
      )}

      <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="register-form">
        <div>
          <label className="register-label">Name</label>
          <input
            type="text"
            placeholder="What should we call you?"
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
            className="register-input"
          />
          {errors.name && <p className="register-field-error">{errors.name.message}</p>}
        </div>
        <div>
          <label className="register-label">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
            className="register-input"
          />
          {errors.email && <p className="register-field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="register-label">Password</label>
          <input
            type="password"
            placeholder="Something you'll remember"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
            className="register-input"
          />
          {errors.password && <p className="register-field-error">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="register-submit btn-primary"
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="register-login-text">
        Already here?{' '}
        <Link to="/login" className="register-login-link">Log in</Link>
      </p>
      </div>
    </div>
  )
}

export default Register
