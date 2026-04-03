import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../utils/pricing'

type LocationState = {
  orderId?: string
  email?: string
  total?: number
}

export function OrderConfirmedPage() {
  const { state } = useLocation() as { state: LocationState | null }
  const orderId = state?.orderId ?? '—'
  const email = state?.email ?? ''
  const total = state?.total

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-8 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">Order confirmed</h1>
      <p className="mt-4 text-ink-muted">
        Thank you — this is a frontend demo. No payment was processed
        {email ? (
          <>
            {' '}
            (confirmation would go to <span className="font-medium text-ink">{email}</span>).
          </>
        ) : (
          '.'
        )}
      </p>
      <dl className="mt-10 rounded-2xl border border-cream bg-cream/20 px-6 py-6 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Order ID</dt>
          <dd className="font-mono text-sm font-medium text-ink">{orderId}</dd>
        </div>
        {total != null && (
          <div className="mt-3 flex justify-between gap-4 border-t border-cream pt-3">
            <dt className="text-ink-muted">Total</dt>
            <dd className="font-semibold text-forest tabular-nums">{formatPrice(total)}</dd>
          </div>
        )}
      </dl>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          to="/shop"
          className="inline-flex rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Keep shopping
        </Link>
        <Link to="/" className="text-sm font-semibold text-ink-muted hover:text-accent">
          Back to home
        </Link>
      </div>
    </div>
  )
}
