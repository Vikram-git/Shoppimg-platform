import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'
import { formatPrice, FREE_SHIPPING_THRESHOLD_INR } from '../utils/pricing'
import { pickVarietyByCategory } from '../utils/pickVariety'

export function HomePage() {
  const featured = useMemo(() => products.filter((p) => p.featured), [])
  const varied = useMemo(() => {
    const featuredIds = new Set(products.filter((p) => p.featured).map((p) => p.id))
    const pool = products.filter((p) => !featuredIds.has(p.id))
    return pickVarietyByCategory(pool, 12)
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-paper">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-paper/70">Spring collection</p>
          <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Objects that earn a place on your shelf.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-paper/85">
            Thoughtful tools, wearables, and home pieces — browse a fully interactive storefront with cart and checkout
            (demo).
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-accent-hover"
            >
              Shop all
            </Link>
            <Link
              to="/shop?sort=price-asc"
              className="inline-flex items-center justify-center rounded-full border border-paper/35 bg-paper/5 px-8 py-3.5 text-sm font-semibold text-paper backdrop-blur-sm transition hover:bg-paper/15"
            >
              Budget picks (low → high)
            </Link>
            <Link
              to="/shop?sale=1"
              className="inline-flex items-center justify-center rounded-full border border-paper/35 bg-paper/5 px-8 py-3.5 text-sm font-semibold text-paper backdrop-blur-sm transition hover:bg-paper/15"
            >
              Sale
            </Link>
            <Link
              to="/delivery"
              className="inline-flex items-center justify-center text-sm font-semibold text-paper/90 underline decoration-paper/40 underline-offset-4 hover:text-paper"
            >
              Delivery info
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink sm:text-4xl">
              From the catalog
            </h2>
            <p className="mt-2 max-w-xl text-ink-muted">
              A rotating mix across categories — audio, home, bags, tech, and more — not limited to featured items.
            </p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-accent hover:text-accent-hover">
            View entire catalog →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {varied.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-t border-cream bg-cream/20">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink sm:text-3xl">
                  Staff picks
                </h2>
                <p className="mt-2 max-w-xl text-sm text-ink-muted">Highlighted pieces — also marked “featured” in the shop sort.</p>
              </div>
              <Link to="/shop" className="text-sm font-semibold text-accent hover:text-accent-hover">
                Shop all →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={`feat-${p.id}`} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-cream bg-cream/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6 sm:py-20">
          {[
            {
              t: 'Free shipping in INR',
              d: `Demo: free delivery when your bag reaches ${formatPrice(FREE_SHIPPING_THRESHOLD_INR)} or more (after discounts).`,
            },
            { t: 'Secure checkout UI', d: 'Validated form flow — data stays in your browser.' },
            { t: 'Persistent cart', d: 'Your bag survives refresh via local storage.' },
          ].map((x) => (
            <div key={x.t}>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest">{x.t}</h3>
              <p className="mt-2 text-sm text-ink-muted">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
