import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  formatPrice,
  FREE_SHIPPING_THRESHOLD_INR,
  isOnSale,
  lineSavings,
  SHIPPING_FLAT_INR,
} from '../utils/pricing'

export function CartPage() {
  const { lines, subtotal, savings, compareSubtotal, setQuantity, removeItem } = useCart()
  const shipping =
    subtotal > 0 ? (subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_FLAT_INR) : 0
  const total = subtotal + shipping

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">Your cart</h1>
        <p className="mt-4 text-ink-muted">Your bag is empty — discover something you love.</p>
        <Link
          to="/shop"
          className="mt-10 inline-flex rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">Your cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <ul className="space-y-6 lg:col-span-2">
          {lines.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex gap-4 rounded-2xl border border-cream bg-white p-4 sm:gap-6 sm:p-5"
            >
              <Link to={`/product/${product.slug}`} className="shrink-0 overflow-hidden rounded-xl bg-cream/40">
                <img src={product.image} alt={product.name} className="h-28 w-24 object-cover sm:h-32 sm:w-28" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink hover:text-accent"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-ink-muted">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-forest">{formatPrice(product.price * quantity)}</p>
                    {isOnSale(product) && product.compareAtPrice != null && (
                      <p className="text-xs text-ink-muted line-through">
                        {formatPrice(product.compareAtPrice * quantity)}
                      </p>
                    )}
                    {lineSavings(product, quantity) > 0 && (
                      <p className="text-xs font-medium text-accent">You save {formatPrice(lineSavings(product, quantity))}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-lg border border-cream">
                    <button
                      type="button"
                      className="px-3 py-2 text-ink hover:bg-cream/60"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-2 text-ink hover:bg-cream/60"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="text-sm font-medium text-ink-muted underline-offset-4 hover:text-accent hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-cream bg-cream/25 p-6 lg:sticky lg:top-24">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            {savings > 0 && (
              <>
                <div className="flex justify-between text-ink-muted">
                  <dt>List price</dt>
                  <dd className="tabular-nums line-through">{formatPrice(compareSubtotal)}</dd>
                </div>
                <div className="flex justify-between text-sm font-medium text-accent">
                  <dt>Discounts</dt>
                  <dd className="tabular-nums">−{formatPrice(savings)}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between text-ink-muted">
              <dt>Subtotal</dt>
              <dd className="font-medium text-ink tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-muted">
              <dt>Shipping (demo)</dt>
              <dd className="font-medium text-ink tabular-nums">
                {shipping === 0 && subtotal > 0 ? 'Free' : formatPrice(shipping)}
              </dd>
            </div>
            {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD_INR && (
              <p className="text-xs text-ink-muted">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD_INR - subtotal)} more for free shipping (demo).
              </p>
            )}
            <div className="flex justify-between border-t border-cream pt-4 text-base font-semibold text-forest">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-8 flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Checkout
          </Link>
          <Link to="/shop" className="mt-4 block text-center text-sm font-medium text-accent hover:text-accent-hover">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
