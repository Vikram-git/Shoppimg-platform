import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { getProductBySlug, getRelatedProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import { discountPercent, formatPrice, isOnSale } from '../utils/pricing'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  const product = slug ? getProductBySlug(slug) : undefined
  const related = useMemo(() => (product ? getRelatedProducts(product) : []), [product])

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">Product not found</h1>
        <p className="mt-2 text-ink-muted">This item may have been removed from the demo catalog.</p>
        <Link to="/shop" className="mt-8 inline-block text-sm font-semibold text-accent hover:text-accent-hover">
          ← Back to shop
        </Link>
      </div>
    )
  }

  const item = product

  function handleAdd() {
    addItem(item, qty)
    setQty(1)
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="text-sm text-ink-muted">
        <Link to="/shop" className="hover:text-accent">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-cream bg-cream/30">
          <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-ink-muted">{product.category}</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {isOnSale(product) && discountPercent(product) != null && (
              <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-bold text-accent">
                {discountPercent(product)}% off
              </span>
            )}
            <p className="text-2xl font-semibold text-forest">{formatPrice(product.price)}</p>
            {isOnSale(product) && product.compareAtPrice != null && (
              <p className="text-lg text-ink-muted line-through">{formatPrice(product.compareAtPrice)}</p>
            )}
          </div>
          <p className="mt-6 text-ink-muted leading-relaxed">{product.longDescription}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-cream bg-white">
              <button
                type="button"
                className="px-4 py-3 text-lg text-ink hover:bg-cream/50"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums">{qty}</span>
              <button
                type="button"
                className="px-4 py-3 text-lg text-ink hover:bg-cream/50"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-full bg-accent px-10 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent-hover"
            >
              Add to cart
            </button>
          </div>

          <ul className="mt-10 space-y-2 text-sm text-ink-muted">
            <li>• In-stock for demo purposes</li>
            <li>• Returns policy not enforced (frontend only)</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-cream pt-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">You may also like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
