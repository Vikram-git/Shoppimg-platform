import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, FREE_SHIPPING_THRESHOLD_INR, SHIPPING_FLAT_INR } from '../utils/pricing'

const LAST_ORDER_KEY = 'arcadia-last-order-v1'

type LastOrderLine = {
  id: string
  name: string
  category: string
  price: number
  quantity: number
}

type LastOrder = {
  id: string
  placedAt: string
  eta: string
  email: string
  name: string
  address: string
  city: string
  pin: string
  subtotal: number
  compareSubtotal: number
  savings: number
  shipping: number
  total: number
  status: 'Processing' | 'Shipped' | 'Delivered'
  lines: LastOrderLine[]
}

const rows = [
  {
    zone: 'Metro cities — standard',
    time: '2–4 business days',
    cost: `${formatPrice(SHIPPING_FLAT_INR)} or free over ${formatPrice(FREE_SHIPPING_THRESHOLD_INR)}*`,
  },
  { zone: 'Rest of India — standard', time: '4–7 business days', cost: 'Same as cart (demo)' },
  { zone: 'Express (select zones)', time: '1–2 business days', cost: 'From ₹199 (demo)' },
  { zone: 'North-East & remote', time: '7–12 business days', cost: 'Calculated at checkout (demo)' },
]

export function DeliveryPage() {
  const [order, setOrder] = useState<LastOrder | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as LastOrder
      if (!parsed?.id || !Array.isArray(parsed.lines)) return

      const now = Date.now()
      const etaMs = Date.parse(parsed.eta)
      let status: LastOrder['status'] = parsed.status
      if (!Number.isNaN(etaMs)) {
        if (now > etaMs + 3 * 24 * 60 * 60 * 1000) status = 'Delivered'
        else if (now > etaMs - 2 * 24 * 60 * 60 * 1000) status = 'Shipped'
        else status = 'Processing'
      }

      setOrder({ ...parsed, status })
    } catch {
      setOrder(null)
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">Shipping & delivery</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink sm:text-4xl">
        Delivery across India
      </h1>
      <p className="mt-4 text-ink-muted leading-relaxed">
        Arcadia is a frontend demo — amounts below match the cart:{' '}
        <span className="font-medium text-ink">{formatPrice(SHIPPING_FLAT_INR)}</span> shipping on orders under{' '}
        <span className="font-medium text-ink">{formatPrice(FREE_SHIPPING_THRESHOLD_INR)}</span>, then{' '}
        <span className="font-medium text-ink">free delivery</span> on the subtotal after product discounts.
      </p>

      {order && (
        <section className="mt-8 rounded-2xl border border-cream bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-baseline">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Your latest order</p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
                Order {order.id}
              </h2>
              <p className="mt-1 text-xs text-ink-muted">
                Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                · ETA {new Date(order.eta).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <span
              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                order.status === 'Delivered'
                  ? 'bg-forest/10 text-forest'
                  : order.status === 'Shipped'
                    ? 'bg-accent/10 text-accent'
                    : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Delivering to</p>
              <p className="mt-1 font-medium text-ink">{order.name}</p>
              <p className="text-ink-muted">
                {order.address}
                <br />
                {order.city} · PIN {order.pin}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Summary</p>
              <dl className="mt-1 space-y-1 text-sm">
                <div className="flex justify-between text-ink-muted">
                  <dt>Items</dt>
                  <dd className="tabular-nums text-ink">{formatPrice(order.subtotal)}</dd>
                </div>
                {order.savings > 0 && (
                  <div className="flex justify-between text-accent text-xs">
                    <dt>Discounts</dt>
                    <dd className="tabular-nums">−{formatPrice(order.savings)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-ink-muted">
                  <dt>Shipping</dt>
                  <dd className="tabular-nums text-ink">
                    {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-cream pt-2 text-sm font-semibold text-forest">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPrice(order.total)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <ul className="mt-4 space-y-1 text-sm text-ink-muted">
            {order.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-2">
                <span className="truncate">
                  {line.name} × {line.quantity}
                </span>
                <span className="shrink-0 tabular-nums text-ink">
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs text-ink-muted">
            This order is stored only in your browser for demo purposes. Refreshing this page will keep it until you
            place another order or clear site data.
          </p>
        </section>
      )}

      <div className="mt-10 overflow-hidden rounded-2xl border border-cream bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-cream bg-cream/40 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <th className="px-4 py-3 sm:px-6">Region</th>
              <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Transit</th>
              <th className="px-4 py-3 text-right sm:px-6">From</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.zone} className="border-b border-cream last:border-0">
                <td className="px-4 py-4 font-medium text-ink sm:px-6">
                  {r.zone}
                  <p className="mt-1 text-xs font-normal text-ink-muted sm:hidden">{r.time}</p>
                </td>
                <td className="hidden px-4 py-4 text-ink-muted sm:table-cell sm:px-6">{r.time}</td>
                <td className="px-4 py-4 text-right text-forest sm:px-6">{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        *Subtotal in Indian Rupees (INR), after discounts — same rules as your bag and checkout summary.
      </p>

      <section className="mt-14">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">Packaging</h2>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
          Orders ship in recycled-content boxes with paper fill where possible. Gift invoices and GST-friendly
          packaging can be added in a full production build.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">Order tracking</h2>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
          In this demo, no courier AWB is created — the confirmation screen is the last step. A real store would SMS
          and email tracking once the handover to the carrier happens.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-cream bg-cream/25 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">Returns (demo)</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Policy copy only — reverse pickup and refunds are not implemented in this storefront.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          to="/shop"
          className="inline-flex rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Continue shopping
        </Link>
        <Link
          to="/cart"
          className="inline-flex items-center rounded-full border border-cream px-8 py-3.5 text-sm font-semibold text-ink hover:bg-cream/60"
        >
          View cart
        </Link>
      </div>
    </div>
  )
}
