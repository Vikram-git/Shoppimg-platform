import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import {
  formatPrice,
  FREE_SHIPPING_THRESHOLD_INR,
  SHIPPING_FLAT_INR,
} from '../utils/pricing'

const LAST_ORDER_KEY = 'arcadia-last-order-v1'

type FormState = {
  email: string
  name: string
  address: string
  city: string
  zip: string
  card: string
}

const initial: FormState = {
  email: '',
  name: '',
  address: '',
  city: '',
  zip: '',
  card: '',
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lines, subtotal, savings, compareSubtotal, clearCart } = useCart()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        email: f.email || user.email,
        name: f.name || user.name,
      }))
    }
  }, [user])

  const shipping =
    subtotal > 0 ? (subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_FLAT_INR) : 0
  const total = subtotal + shipping

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">Checkout</h1>
        <p className="mt-4 text-ink-muted">Your cart is empty.</p>
        <Link to="/shop" className="mt-8 inline-block text-sm font-semibold text-accent">
          ← Shop
        </Link>
      </div>
    )
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (form.name.trim().length < 2) e.name = 'Full name required'
    if (form.address.trim().length < 5) e.address = 'Address required'
    if (form.city.trim().length < 2) e.city = 'City required'
    if (!/^\d{6}$/.test(form.zip.trim())) e.zip = 'Valid 6-digit PIN required'
    const digits = form.card.replace(/\D/g, '')
    if (digits.length !== 16) e.card = 'Card must be 16 digits (demo)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    const orderId = `ARC-${Date.now().toString(36).toUpperCase()}`
    const placedAt = new Date().toISOString()

    try {
      const etaDays =
        subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 3 : 5
      const etaDate = new Date()
      etaDate.setDate(etaDate.getDate() + etaDays)

      const orderPayload = {
        id: orderId,
        placedAt,
        eta: etaDate.toISOString(),
        email: form.email,
        name: form.name,
        address: form.address,
        city: form.city,
        pin: form.zip,
        subtotal,
        compareSubtotal,
        savings,
        shipping,
        total,
        lines: lines.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          quantity,
        })),
        status: 'Processing' as const,
      }
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(orderPayload))
    } catch {
      // ignore persistence issues; checkout flow should still continue
    }

    clearCart()
    navigate('/order-confirmed', {
      replace: true,
      state: {
        orderId,
        email: form.email,
        total,
      },
    })
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">Checkout</h1>
      <p className="mt-2 text-sm text-ink-muted">Demo only — nothing is charged or stored on a server.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <form onSubmit={onSubmit} className="space-y-6 lg:col-span-3" noValidate>
          <fieldset className="space-y-4 rounded-2xl border border-cream bg-white p-6">
            <legend className="font-[family-name:var(--font-display)] px-1 text-lg font-semibold text-ink">
              Contact
            </legend>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-ink">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-cream bg-white p-6">
            <legend className="font-[family-name:var(--font-display)] px-1 text-lg font-semibold text-ink">
              Shipping
            </legend>
            <div>
              <label htmlFor="address" className="text-sm font-medium text-ink">
                Street address
              </label>
              <input
                id="address"
                type="text"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
              />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="text-sm font-medium text-ink">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
                />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="zip" className="text-sm font-medium text-ink">
                  PIN code
                </label>
                <input
                  id="zip"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  value={form.zip}
                  onChange={(e) => set('zip', e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
                />
                {errors.zip && <p className="mt-1 text-xs text-red-600">{errors.zip}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-cream bg-white p-6">
            <legend className="font-[family-name:var(--font-display)] px-1 text-lg font-semibold text-ink">
              Payment (demo)
            </legend>
            <div>
              <label htmlFor="card" className="text-sm font-medium text-ink">
                Card number
              </label>
              <input
                id="card"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={form.card}
                onChange={(e) => set('card', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
              />
              {errors.card && <p className="mt-1 text-xs text-red-600">{errors.card}</p>}
              <p className="mt-2 text-xs text-ink-muted">Use any 16 digits — validation is for UI flow only.</p>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-full bg-accent py-4 text-sm font-semibold text-white hover:bg-accent-hover sm:w-auto sm:px-14"
          >
            Place order
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-cream bg-cream/25 p-6 lg:col-span-2 lg:sticky lg:top-24">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">In your bag</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-2 text-ink-muted">
                <span>
                  {product.name} × {quantity}
                </span>
                <span className="shrink-0 tabular-nums text-ink">{formatPrice(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-cream pt-4 text-sm">
            {savings > 0 && (
              <>
                <div className="flex justify-between text-ink-muted">
                  <dt>List price</dt>
                  <dd className="tabular-nums line-through">{formatPrice(compareSubtotal)}</dd>
                </div>
                <div className="flex justify-between font-medium text-accent">
                  <dt>Discounts</dt>
                  <dd className="tabular-nums">−{formatPrice(savings)}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between text-ink-muted">
              <dt>Subtotal</dt>
              <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-muted">
              <dt>Shipping</dt>
              <dd className="tabular-nums text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold text-forest">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
