import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { discountPercent, formatPrice, isOnSale } from '../utils/pricing'

export function ProductCard({ product }: { product: Product }) {
  const onSale = isOnSale(product)
  const pct = discountPercent(product)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-cream/50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {onSale && pct != null && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
            −{pct}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{product.category}</p>
        <Link to={`/product/${product.slug}`}>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-ink group-hover:text-accent">
            {product.name}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-muted">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base font-semibold text-forest">{formatPrice(product.price)}</span>
            {onSale && product.compareAtPrice != null && (
              <span className="text-sm text-ink-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-accent"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
