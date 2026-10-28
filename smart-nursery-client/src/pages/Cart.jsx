import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import './Cart.css'

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

  if (!token) {
    return (
      <div className="cart-center">
        <p className="cart-center-text">Log in to use your cart.</p>
        <Link to="/login" className="cart-center-link btn-primary">
          Log in
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="cart-center">
        <p className="cart-success-title">Order placed</p>
        <p className="cart-success-subtitle">Your plants are on their way.</p>
        <p className="cart-success-note">Remember — payment is collected upon delivery.</p>
        <Link to="/orders" className="cart-center-link btn-primary">
          View your orders
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-center">
        <p className="cart-center-text">Your cart is empty. Time to browse?</p>
        <Link to="/plants" className="cart-center-link btn-primary">
          See the collection
        </Link>
      </div>
    )
  }

  if (step === 'checkout') {
    return (
      <div className="cart-page">
        <button onClick={() => setStep('cart')} className="checkout-back">
          &larr; Back to cart
        </button>

        <h1 className="checkout-title">Checkout</h1>

        {checkoutMutation.error && (
          <div className="checkout-error">
            <span>{checkoutMutation.error.message}</span>
            <button onClick={() => checkoutMutation.reset()} className="checkout-error-close">&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit(() => checkoutMutation.mutate())}>
          <div className="checkout-card">
            <p className="checkout-card-title">Delivery details</p>
            <div className="checkout-fields">
              <div>
                <label className="checkout-label">Full name *</label>
                <input {...register('name', { required: 'Name is required' })} className="checkout-input" placeholder="Your full name" />
                {errors.name && <p className="checkout-field-error">{errors.name.message}</p>}
              </div>
              <div>
                <label className="checkout-label">Phone *</label>
                <input type="tel" {...register('phone', { required: 'Phone is required' })} className="checkout-input" placeholder="05X-XXXXXXX" />
                {errors.phone && <p className="checkout-field-error">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="checkout-label">Delivery address *</label>
                <input {...register('address', { required: 'Address is required' })} className="checkout-input" placeholder="Street, city" />
                {errors.address && <p className="checkout-field-error">{errors.address.message}</p>}
              </div>
              <div>
                <label className="checkout-label">Notes</label>
                <textarea {...register('notes')} rows={2} className="checkout-input checkout-textarea" placeholder="Special instructions, delivery preferences..." />
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <p className="checkout-card-title">Order summary</p>
            <div className="checkout-summary-items">
              {items.map(item => (
                <div key={item.plantId} className="checkout-summary-row">
                  <span className="checkout-summary-name">{item.name} <span className="checkout-summary-qty">&times; {item.quantity}</span></span>
                  <span className="checkout-summary-price">{item.price * item.quantity} &#8362;</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary-divider">
              <span className="checkout-summary-total-label">Total</span>
              <span className="checkout-summary-total-value">{total} &#8362;</span>
            </div>
          </div>

          <div className="checkout-payment-banner">
            <svg className="checkout-payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span>Payment is collected upon delivery of your flowers. No prepayment required.</span>
          </div>

          <button
            type="submit"
            disabled={checkoutMutation.isPending || !isValid}
            className="checkout-submit btn-primary"
          >
            {checkoutMutation.isPending ? 'Placing order...' : 'Confirm order'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your cart</h1>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.plantId} className="cart-item">
            <div>
              <p className="cart-item-name">{item.name}</p>
              <p className="cart-item-price">{item.price} &#8362; each</p>
            </div>
            <div className="cart-item-controls">
              <div className="cart-qty-wrap">
                <button
                  onClick={() => updateQuantity(item.plantId, item.quantity - 1)}
                  className="cart-qty-button"
                >
                  &minus;
                </button>
                <span className="cart-qty-value">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.plantId, item.quantity + 1)}
                  className="cart-qty-button"
                >
                  +
                </button>
              </div>
              <span className="cart-item-total">{item.price * item.quantity} &#8362;</span>
              <button
                onClick={() => removeFromCart(item.plantId)}
                className="cart-item-remove"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total-row">
          <span className="cart-total-label">Total</span>
          <span className="cart-total-value">{total} &#8362;</span>
        </div>
        <button
          onClick={() => setStep('checkout')}
          className="cart-checkout-button btn-primary"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
