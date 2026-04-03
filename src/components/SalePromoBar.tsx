import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSaleEndTimestamp } from '../config/promo'
import { formatPrice, FREE_SHIPPING_THRESHOLD_INR } from '../utils/pricing'

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

function getRemaining(end: number, now: number): Remaining | null {
  const ms = end - now
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center rounded-lg bg-paper/95 px-2 py-1 shadow-sm ring-1 ring-forest/10 sm:min-w-[2.75rem] sm:px-2.5 sm:py-1.5">
      <span className="font-mono text-base font-bold tabular-nums text-forest sm:text-lg">{v}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">{label}</span>
    </div>
  )
}

export function SalePromoBar() {
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    getRemaining(getSaleEndTimestamp(), Date.now()),
  )

  useEffect(() => {
    const end = getSaleEndTimestamp()
    const tick = () => setRemaining(getRemaining(end, Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="border-t border-accent/25 bg-gradient-to-r from-accent/12 via-forest/[0.07] to-accent/12">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-2.5">
        <div className="min-w-0 text-center text-sm sm:text-left">
          <p className="font-semibold text-forest">
            <span className="text-accent">Limited-time sale</span>
            <span className="font-normal text-ink-muted"> — markdowns on </span>
            <Link to="/shop?sale=1" className="font-semibold text-accent underline decoration-accent/40 underline-offset-2 hover:text-accent-hover">
              selected products
            </Link>
            <span className="font-normal text-ink-muted"> · Free delivery over {formatPrice(FREE_SHIPPING_THRESHOLD_INR)} </span>
            <Link to="/delivery" className="font-medium text-forest underline decoration-cream underline-offset-2 hover:text-accent">
              Delivery
            </Link>
          </p>
        </div>

        <div
          className="flex shrink-0 flex-col items-center gap-2 sm:flex-row sm:gap-3"
          role="timer"
          aria-live="polite"
          aria-atomic="true"
        >
          {remaining ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Sale ends in</span>
              <div className="flex items-start gap-1.5 sm:gap-2">
                <TimeUnit value={remaining.days} label="Days" />
                <TimeUnit value={remaining.hours} label="Hrs" />
                <TimeUnit value={remaining.minutes} label="Min" />
                <TimeUnit value={remaining.seconds} label="Sec" />
              </div>
            </>
          ) : (
            <p className="text-sm font-medium text-ink-muted">This sale window has closed — explore the full catalog anytime.</p>
          )}
        </div>
      </div>
    </div>
  )
}
