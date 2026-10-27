import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

function Cart() {
  const { token, user } = useAuth()
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState('cart')
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: '',
      address: '',
      notes: ''
    },
    mode: 'onChange'
  })

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const orderPromises = items.flatMap(item =>
        Array.from({ length: item.quantity }, () =>
          fetch(`${import.meta.env.VITE_API_URL}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ plantId: item.plantId })
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to order ${item.name}`)
            return res.json()
          })
        )
      )
      return Promise.all(orderPromises)
    },
    onSuccess: () => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setSuccess(true)
    }
  })

  const input = "w-full px-4 py-2.5 rounded-lg border border-green-pale/20 bg-white text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20 transition-colors text-sm"
  const label = "block text-sm font-medium text-ink-light mb-1.5"

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-ink-light mb-6">Log in to use your cart.</p>
        <Link to="/login" className="btn-primary px-7 py-3 rounded-full no-underline text-sm font-medium">
          Log in
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="font-display text-2xl text-ink mb-2">Order placed</p>
        <p className="text-ink-light mb-3">Your plants are on their way.</p>
        <p className="text-ink-faint text-sm mb-8">Remember — payment is collected upon delivery.</p>
        <Link to="/orders" className="btn-primary px-7 py-3 rounded-full no-underline text-sm font-medium">
          View your orders
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-ink-light mb-6">Your cart is empty. Time to browse?</p>
        <Link to="/plants" className="btn-primary px-7 py-3 rounded-full no-underline text-sm font-medium">
          See the collection
        </Link>
      </div>
    )
  }

  if (step === 'checkout') {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setStep('cart')} className="text-sm text-ink-faint hover:text-green transition-colors cursor-pointer mb-6 flex items-center gap-1">
          &larr; Back to cart
        </button>

        <h1 className="font-display text-3xl text-ink mb-8">Checkout</h1>

        {checkoutMutation.error && (
          <div className="mb-6 py-3 px-5 rounded-xl bg-pink-pale text-pink-deep text-sm flex items-center justify-between">
            <span>{checkoutMutation.error.message}</span>
            <button onClick={() => checkoutMutation.reset()} className="text-pink-deep/50 hover:text-pink-deep cursor-pointer ml-4">&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit(() => checkoutMutation.mutate())}>
          <div className="bg-white/50 rounded-xl p-6 mb-6 border border-green-pale/15">
            <p className="font-display text-lg text-ink mb-4">Delivery details</p>
            <div className="space-y-4">
              <div>
                <label className={label}>Full name *</label>
                <input {...register('name', { required: 'Name is required' })} className={input} placeholder="Your full name" />
                {errors.name && <p className="text-pink-dark text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className={label}>Phone *</label>
                <input type="tel" {...register('phone', { required: 'Phone is required' })} className={input} placeholder="05X-XXXXXXX" />
                {errors.phone && <p className="text-pink-dark text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className={label}>Delivery address *</label>
                <input {...register('address', { required: 'Address is required' })} className={input} placeholder="Street, city" />
                {errors.address && <p className="text-pink-dark text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <label className={label}>Notes</label>
                <textarea {...register('notes')} rows={2} className={input + ' resize-none'} placeholder="Special instructions, delivery preferences..." />
              </div>
            </div>
          </div>

          <div className="bg-white/50 rounded-xl p-6 mb-6 border border-green-pale/15">
            <p className="font-display text-lg text-ink mb-4">Order summary</p>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.plantId} className="flex justify-between text-sm">
                  <span className="text-ink">{item.name} <span className="text-ink-faint">&times; {item.quantity}</span></span>
                  <span className="text-ink font-medium">{item.price * item.quantity} &#8362;</span>
                </div>
              ))}
            </div>
            <div className="border-t border-green-pale/20 mt-4 pt-4 flex justify-between">
              <span className="font-display text-lg text-ink">Total</span>
              <span className="text-green-dark font-semibold text-xl">{total} &#8362;</span>
            </div>
          </div>

          <div className="mb-4 py-2.5 px-4 rounded-lg bg-green/8 text-green-dark text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span>Payment is collected upon delivery of your flowers. No prepayment required.</span>
          </div>

          <button
            type="submit"
            disabled={checkoutMutation.isPending || !isValid}
            className="w-full py-3 btn-primary rounded-full font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutMutation.isPending ? 'Placing order...' : 'Confirm order'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-ink mb-8">Your cart</h1>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.plantId} className="bg-white/50 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-green-pale/15 transition-all duration-300 hover:border-green-pale/40 hover:shadow-md hover:-translate-y-0.5">
            <div>
              <p className="font-display text-lg text-ink">{item.name}</p>
              <p className="text-ink-faint text-sm">{item.price} &#8362; each</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.plantId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-green-pale/30 text-ink-light hover:border-green hover:text-green transition-colors cursor-pointer flex items-center justify-center"
                >
                  &minus;
                </button>
                <span className="w-8 text-center text-sm font-medium text-ink">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.plantId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-green-pale/30 text-ink-light hover:border-green hover:text-green transition-colors cursor-pointer flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <span className="text-green-dark font-semibold min-w-[60px] text-right">{item.price * item.quantity} &#8362;</span>
              <button
                onClick={() => removeFromCart(item.plantId)}
                className="text-ink-faint hover:text-pink-dark transition-colors cursor-pointer text-lg"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-green-pale/20 pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="font-display text-xl text-ink">Total</span>
          <span className="text-green-dark font-semibold text-2xl">{total} &#8362;</span>
        </div>
        <button
          onClick={() => setStep('checkout')}
          className="w-full py-3 btn-primary rounded-full font-medium cursor-pointer"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
