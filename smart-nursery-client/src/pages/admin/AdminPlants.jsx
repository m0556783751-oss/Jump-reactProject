import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'
import './AdminPlants.css'

const EMPTY_FORM = {
  name: '', description: '', categoryId: '', price: '',
  imageUrl: '', difficulty: 'EASY', sunlight: 'FULL_SUN',
  wateringFrequencyDays: '', season: '', inStock: true
}

function AdminPlants() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: EMPTY_FORM
  })

  const api = import.meta.env.VITE_API_URL
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const res = await fetch(`${api}/plants`)
      if (!res.ok) throw new Error('Failed to load plants')
      return res.json()
    }
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${api}/categories`)
      if (!res.ok) throw new Error('Failed to load categories')
      return res.json()
    }
  })

  const submitMutation = useMutation({
    mutationFn: async (formData) => {
      const body = {
        name: formData.name,
        description: formData.description,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        difficulty: formData.difficulty,
        sunlight: formData.sunlight,
        wateringFrequencyDays: Number(formData.wateringFrequencyDays),
        inStock: formData.inStock
      }
      if (formData.imageUrl) body.imageUrl = formData.imageUrl
      if (formData.season) body.season = formData.season

      const url = editingId ? `${api}/plants/${editingId}` : `${api}/plants`
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Something went wrong')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] })
      setSuccess(editingId ? 'Plant updated.' : 'Plant created.')
      cancelForm()
    }
  })

  const toggleMutation = useMutation({
    mutationFn: async (plant) => {
      const newStock = plant.inStock === false
      const res = await fetch(`${api}/plants/${plant.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ inStock: newStock })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update')
      return { data, name: plant.name, newStock }
    },
    onSuccess: ({ name, newStock }) => {
      queryClient.invalidateQueries({ queryKey: ['plants'] })
      setSuccess(newStock ? `${name} is now visible.` : `${name} has been hidden.`)
    }
  })

  const openCreate = () => {
    setEditingId(null)
    reset(EMPTY_FORM)
    setShowForm(true)
    setSuccess('')
    submitMutation.reset()
  }

  const openEdit = (plant) => {
    setEditingId(plant.id)
    reset({
      name: plant.name || '',
      description: plant.description || '',
      categoryId: plant.categoryId || plant.category?.id || '',
      price: plant.price || '',
      imageUrl: plant.imageUrl || '',
      difficulty: plant.difficulty || 'EASY',
      sunlight: plant.sunlight || 'FULL_SUN',
      wateringFrequencyDays: plant.wateringFrequencyDays || '',
      season: plant.season || '',
      inStock: plant.inStock !== false
    })
    setShowForm(true)
    setSuccess('')
    submitMutation.reset()
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    reset(EMPTY_FORM)
  }

  const errorMessage = submitMutation.error?.message || toggleMutation.error?.message
  const dismissError = () => { submitMutation.reset(); toggleMutation.reset() }

  return (
    <div className="admin-plants-page">
      <AdminNav />
      <div className="admin-plants-header">
        <div>
          <h1 className="admin-plants-title">Manage plants</h1>
          <p className="admin-plants-subtitle">Add, edit, or hide plants from the shop.</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="admin-plants-add-btn btn-primary">
            + Add plant
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="admin-plants-error">
          <span>{errorMessage}</span>
          <button onClick={dismissError} className="admin-plants-error-close">&times;</button>
        </div>
      )}
      {success && (
        <div className="admin-plants-success">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="admin-plants-success-close">&times;</button>
        </div>
      )}

      {showForm && (
        <div className="admin-plants-form-card">
          <p className="admin-plants-form-title">{editingId ? 'Edit plant' : 'New plant'}</p>
          <form onSubmit={handleSubmit((data) => submitMutation.mutate(data))} className="admin-plants-form">
            <div className="admin-plants-form-row-2">
              <div>
                <label className="admin-plants-label">Name *</label>
                <input {...register('name', { required: 'Name is required' })} className="admin-plants-input" placeholder="e.g. Peace Lily" />
                {errors.name && <p className="admin-plants-field-error">{errors.name.message}</p>}
              </div>
              <div>
                <label className="admin-plants-label">Category *</label>
                <select {...register('categoryId', { required: 'Category is required' })} className="admin-plants-input">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="admin-plants-field-error">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div>
              <label className="admin-plants-label">Description *</label>
              <textarea {...register('description', { required: 'Description is required' })} rows={2} className="admin-plants-input admin-plants-textarea" placeholder="Short description" />
              {errors.description && <p className="admin-plants-field-error">{errors.description.message}</p>}
            </div>

            <div className="admin-plants-form-row-3">
              <div>
                <label className="admin-plants-label">Price (&#8362;) *</label>
                <input type="number" min="0.01" step="0.01" {...register('price', { required: 'Price is required' })} className="admin-plants-input" />
                {errors.price && <p className="admin-plants-field-error">{errors.price.message}</p>}
              </div>
              <div>
                <label className="admin-plants-label">Difficulty *</label>
                <select {...register('difficulty')} className="admin-plants-input">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div>
                <label className="admin-plants-label">Sunlight *</label>
                <select {...register('sunlight')} className="admin-plants-input">
                  <option value="FULL_SUN">Full sun</option>
                  <option value="PARTIAL_SHADE">Partial shade</option>
                  <option value="SHADE">Shade</option>
                </select>
              </div>
            </div>

            <div className="admin-plants-form-row-3">
              <div>
                <label className="admin-plants-label">Watering (days) *</label>
                <input type="number" min="1" max="90" {...register('wateringFrequencyDays', { required: 'Required' })} className="admin-plants-input" />
                {errors.wateringFrequencyDays && <p className="admin-plants-field-error">{errors.wateringFrequencyDays.message}</p>}
              </div>
              <div>
                <label className="admin-plants-label">Season</label>
                <input {...register('season')} className="admin-plants-input" placeholder="e.g. Spring" />
              </div>
              <div>
                <label className="admin-plants-label">Image URL</label>
                <input type="url" {...register('imageUrl')} className="admin-plants-input" placeholder="https://..." />
              </div>
            </div>

            <label className="admin-plants-checkbox-label">
              <input type="checkbox" {...register('inStock')} className="admin-plants-checkbox" />
              Visible in shop
            </label>

            <div className="admin-plants-form-actions">
              <button type="submit" disabled={submitMutation.isPending} className="admin-plants-form-submit btn-primary">
                {submitMutation.isPending ? 'Saving...' : editingId ? 'Save changes' : 'Create plant'}
              </button>
              <button type="button" onClick={cancelForm} className="admin-plants-form-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="admin-plants-loading">
          <div className="admin-plants-spinner" />
        </div>
      )}

      {!isLoading && plants.length === 0 && (
        <div className="admin-plants-empty">
          <p className="admin-plants-empty-text">No plants yet. Add your first one above.</p>
        </div>
      )}

      <div className="admin-plants-list">
        {plants.map(plant => (
          <div key={plant.id} className={`admin-plant-card ${plant.inStock === false ? 'admin-plant-card--hidden' : ''}`}>
            <div className="admin-plant-info">
              <div className="admin-plant-name-row">
                <p className="admin-plant-name">{plant.name}</p>
                {plant.inStock === false && (
                  <span className="admin-plant-hidden-tag">Hidden</span>
                )}
              </div>
              <p className="admin-plant-desc">{plant.description}</p>
              <div className="admin-plant-meta">
                <span>{plant.category?.name}</span>
                <span>·</span>
                <span className="admin-plant-price">{plant.price} &#8362;</span>
                <span>·</span>
                <span>{plant.difficulty?.charAt(0) + plant.difficulty?.slice(1).toLowerCase()}</span>
              </div>
            </div>
            <div className="admin-plant-actions">
              <button onClick={() => openEdit(plant)} className="admin-plant-edit-btn btn-outline">
                Edit
              </button>
              <button onClick={() => toggleMutation.mutate(plant)} className={`admin-plant-toggle-btn ${
                plant.inStock === false ? 'admin-plant-toggle-btn--show' : 'admin-plant-toggle-btn--hide'
              }`}>
                {plant.inStock === false ? 'Show' : 'Hide'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPlants
