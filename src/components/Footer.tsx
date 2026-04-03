import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-cream bg-cream/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest">Arcadia</p>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Curated goods for calm spaces and daily rituals. Frontend demo — no real payments.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/shop" className="text-ink hover:text-accent">
                All products
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Audio" className="text-ink hover:text-accent">
                Audio
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Home" className="text-ink hover:text-accent">
                Home
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Help</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/delivery" className="text-ink hover:text-accent">
                Delivery & shipping
              </Link>
            </li>
            <li>
              <Link to="/shop?sale=1" className="text-ink hover:text-accent">
                Sale items
              </Link>
            </li>
            <li className="text-ink-muted">Contact: hello@arcadia.example</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Newsletter</p>
          <p className="mt-4 text-sm text-ink-muted">Join for launches (not wired up).</p>
          <div className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="min-w-0 flex-1 rounded-lg border border-cream bg-paper px-3 py-2 text-sm outline-none ring-accent/30 placeholder:text-ink-muted/60 focus:ring-2"
              readOnly
              aria-label="Email (demo)"
            />
            <button
              type="button"
              className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-paper opacity-60"
              disabled
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/80 py-6 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Arcadia. Built as a frontend-only storefront.
      </div>
    </footer>
  )
}
