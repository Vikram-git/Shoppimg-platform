import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { categories, products } from '../data/products'
import { isOnSale } from '../utils/pricing'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const cat = params.get('category') ?? 'All'
  const sort = (params.get('sort') as Sort) || 'featured'
  const saleOnly = params.get('sale') === '1'

  const list = useMemo(() => {
    let rows = [...products]
    if (saleOnly) {
      rows = rows.filter(isOnSale)
    }
    if (cat && cat !== 'All') {
      rows = rows.filter((p) => p.category === cat)
    }
    if (q) {
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    switch (sort) {
      case 'price-asc':
        rows.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        rows.sort((a, b) => b.price - a.price)
        break
      case 'name':
        rows.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        rows.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
    }
    return rows
  }, [q, cat, sort, saleOnly])

  function setCategory(c: string) {
    const next = new URLSearchParams(params)
    if (c === 'All') next.delete('category')
    else next.set('category', c)
    setParams(next, { replace: true })
  }

  function setSort(s: Sort) {
    const next = new URLSearchParams(params)
    if (s === 'featured') next.delete('sort')
    else next.set('sort', s)
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink sm:text-4xl">Shop</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        {saleOnly ? (
          <>
            Showing <span className="font-medium text-accent">discounted</span> items only — compare-at prices
            crossed out in the catalog.
          </>
        ) : (
          <>Filter by category, search by name, and sort — all client-side on this demo catalog.</>
        )}
      </p>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                (c === 'All' && (!cat || cat === 'All')) || c === cat
                  ? 'bg-forest text-paper'
                  : 'bg-cream/80 text-ink hover:bg-cream'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <label className="sr-only" htmlFor="shop-search">
            Search
          </label>
          <input
            id="shop-search"
            type="search"
            placeholder="Search products…"
            value={params.get('q') ?? ''}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              const v = e.target.value
              if (v) next.set('q', v)
              else next.delete('q')
              setParams(next, { replace: true })
            }}
            className="w-full min-w-[200px] rounded-xl border border-cream bg-white px-4 py-2.5 text-sm outline-none ring-accent/25 focus:ring-2 sm:max-w-xs"
          />
          <label className="sr-only" htmlFor="shop-sort">
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-full rounded-xl border border-cream bg-white px-4 py-2.5 text-sm outline-none ring-accent/25 focus:ring-2 sm:w-48"
          >
            <option value="featured">Featured first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        {list.length} {list.length === 1 ? 'product' : 'products'}
      </p>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-cream bg-cream/20 px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-display)] text-lg font-medium text-ink">No matches</p>
          <p className="mt-2 text-sm text-ink-muted">Try another search or category.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
