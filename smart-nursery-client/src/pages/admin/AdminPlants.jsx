import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import AdminNav from '../../components/AdminNav'

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

  const input = "w-full px-4 py-2.5 rounded-lg border border-green-pale/20 bg-white text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20 transition-colors text-sm"
  const labelCls = "block text-sm font-medium text-ink-light mb-1.5"

  return (
    <div className="max-w-4xl mx-auto">
      <AdminNav />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Manage plants</h1>
          <p className="text-ink-light text-sm mt-1">Add, edit, or hide plants from the shop.</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="btn-primary px-5 py-2 text-sm font-medium rounded-full cursor-pointer">
            + Add plant
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-5 py-2.5 px-4 rounded-lg bg-pink-pale text-pink-deep text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={dismissError} className="text-pink-deep/50 hover:text-pink-deep cursor-pointer ml-4">&times;</button>
        </div>
      )}
      {success && (
        <div className="mb-5 py-2.5 px-4 rounded-lg bg-green/10 text-green-dark text-sm flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-dark/50 hover:text-green-dark cursor-pointer ml-4">&times;</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white/50 rounded-xl p-6 mb-8 border border-green-pale/15">
          <p className="font-display text-xl text-ink mb-5">{editingId ? 'Edit plant' : 'New plant'}</p>
          <form onSubmit={handleSubmit((data) => submitMutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input {...register('name', { required: 'Name is required' })} className={input} placeholder="e.g. Peace Lily" />
                {errors.name && <p className="text-pink-dark text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Category *</label>
                <select {...register('categoryId', { required: 'Category is required' })} className={input}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-pink-dark text-xs mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea {...register('description', { required: 'Description is required' })} rows={2} className={input + ' resize-none'} placeholder="Short description" />
              {errors.description && <p className="text-pink-dark text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Price (&#8362;) *</label>
                <input type="number" min="0.01" step="0.01" {...register('price', { required: 'Price is required' })} className={input} />
                {errors.price && <p className="text-pink-dark text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Difficulty *</label>
                <select {...register('difficulty')} className={input}>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Sunlight *</label>
                <select {...register('sunlight')} className={input}>
                  <option value="FULL_SUN">Full sun</option>
                  <option value="PARTIAL_SHADE">Partial shade</option>
                  <option value="SHADE">Shade</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Watering (days) *</label>
                <input type="number" min="1" max="90" {...register('wateringFrequencyDays', { required: 'Required' })} className={input} />
                {errors.wateringFrequencyDays && <p className="text-pink-dark text-xs mt-1">{errors.wateringFrequencyDays.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Season</label>
                <input {...register('season')} className={input} placeholder="e.g. Spring" />
              </div>
              <div>
                <label className={labelCls}>Image URL</label>
                <input type="url" {...register('imageUrl')} className={input} placeholder="https://..." />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-light cursor-pointer">
              <input type="checkbox" {...register('inStock')} className="accent-green" />
              Visible in shop
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitMutation.isPending} className="btn-primary px-5 py-2 text-sm font-medium rounded-full cursor-pointer disabled:opacity-50">
                {submitMutation.isPending ? 'Saving...' : editingId ? 'Save changes' : 'Create plant'}
              </button>
              <button type="button" onClick={cancelForm} className="px-5 py-2 text-sm font-medium text-ink-light border border-green-pale/30 rounded-full hover:border-green-pale/60 transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && plants.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-light">No plants yet. Add your first one above.</p>
        </div>
      )}

      <div className="space-y-3">
        {plants.map(plant => (
          <div key={plant.id} className={`bg-white/50 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5 ${plant.inStock === false ? 'opacity-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display text-lg text-ink truncate">{plant.name}</p>
                {plant.inStock === false && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0" style={{ backgroundColor: '#F5EAE6', color: '#905A67' }}>Hidden</span>
                )}
              </div>
              <p className="text-ink-faint text-sm truncate">{plant.description}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-ink-faint">
                <span>{plant.category?.name}</span>
                <span>·</span>
                <span className="text-green-dark font-semibold">{plant.price} &#8362;</span>
                <span>·</span>
                <span>{plant.difficulty?.charAt(0) + plant.difficulty?.slice(1).toLowerCase()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(plant)} className="btn-outline px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer">
                Edit
              </button>
              <button onClick={() => toggleMutation.mutate(plant)} className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer ${
                plant.inStock === false
                  ? 'text-green-dark border border-green-pale hover:bg-green/10'
                  : 'text-pink-dark border border-pink-light hover:bg-pink-pale'
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
