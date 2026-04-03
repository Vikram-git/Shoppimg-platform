import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { SalePromoBar } from './SalePromoBar'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-cream text-ink' : 'text-ink-muted hover:bg-cream/60 hover:text-ink'
  }`

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
      />
    </svg>
  )
}

export function Header() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const saleOnly =
    location.pathname === '/shop' && new URLSearchParams(location.search).get('sale') === '1'
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [search, setSearch] = useState('')
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocClick(ev: MouseEvent) {
      if (!accountRef.current?.contains(ev.target as Node)) setAccountOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    setOpen(false)
    setAccountOpen(false)
  }, [location.pathname, location.search])

  function onSearchSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const q = search.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setSearch('')
  }

  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-50 border-b border-cream/90 bg-paper/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          to="/"
          className="shrink-0 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-forest sm:text-2xl"
          onClick={() => setOpen(false)}
        >
          Arcadia
        </Link>

        <form
          onSubmit={onSearchSubmit}
          className="mx-auto hidden min-w-0 max-w-md flex-1 md:flex"
          role="search"
        >
          <label htmlFor="header-search" className="sr-only">
            Search products
          </label>
          <div className="flex w-full items-center gap-0 overflow-hidden rounded-full border border-cream bg-white shadow-inner ring-accent/0 transition focus-within:border-cream focus-within:ring-2 focus-within:ring-accent/25">
            <span className="pl-4 text-ink-muted" aria-hidden>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              id="header-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the catalog…"
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pl-2 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="hidden shrink-0 bg-forest px-5 py-2.5 text-sm font-semibold text-paper sm:block"
            >
              Search
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) => navClass({ isActive: isActive && !saleOnly })}
          >
            Shop
          </NavLink>
          <NavLink to="/shop?sale=1" className={() => navClass({ isActive: saleOnly })}>
            Sale
          </NavLink>
          <NavLink to="/delivery" className={navClass}>
            Delivery
          </NavLink>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="relative hidden sm:block" ref={accountRef}>
            {user ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAccountOpen((v) => !v)
                  }}
                  className="flex items-center gap-2 rounded-full border border-cream bg-white py-1 pl-1 pr-3 text-left shadow-sm transition hover:border-cream hover:bg-cream/30"
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-paper">
                    {initial}
                  </span>
                  <span className="max-w-[7rem] truncate text-sm font-medium text-ink">{user.name}</span>
                  <svg className="h-4 w-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accountOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-cream bg-paper py-2 shadow-lg"
                    role="menu"
                  >
                    <p className="truncate px-4 py-2 text-xs text-ink-muted">{user.email}</p>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        signOut()
                        setAccountOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-ink hover:bg-cream/60"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/sign-in"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink-muted transition hover:bg-cream/60 hover:text-ink"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-paper shadow-sm transition hover:bg-forest/90"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="relative flex items-center justify-center rounded-full p-2.5 text-ink-muted transition hover:bg-cream/70 hover:text-ink lg:border lg:border-cream lg:bg-white"
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <CartIcon className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="rounded-full p-2.5 text-ink hover:bg-cream/80 lg:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={onSearchSubmit} className="border-t border-cream/60 px-4 py-3 md:hidden" role="search">
        <label htmlFor="header-search-mobile" className="sr-only">
          Search products
        </label>
        <div className="flex gap-2">
          <input
            id="header-search-mobile"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="min-w-0 flex-1 rounded-xl border border-cream bg-white px-4 py-2.5 text-sm outline-none ring-accent/25 focus:ring-2"
          />
          <button type="submit" className="shrink-0 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-paper">
            Go
          </button>
        </div>
      </form>

      <SalePromoBar />

      {open && (
        <div className="border-t border-cream bg-paper px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={navClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => navClass({ isActive: isActive && !saleOnly })}
              onClick={() => setOpen(false)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/shop?sale=1"
              className={() => navClass({ isActive: saleOnly })}
              onClick={() => setOpen(false)}
            >
              Sale
            </NavLink>
            <NavLink to="/delivery" className={navClass} onClick={() => setOpen(false)}>
              Delivery
            </NavLink>
            <NavLink to="/cart" className={navClass} onClick={() => setOpen(false)}>
              Cart {itemCount > 0 ? `(${itemCount})` : ''}
            </NavLink>
            <hr className="my-2 border-cream" />
            {user ? (
              <>
                <p className="px-3 py-2 text-sm font-medium text-ink">{user.name}</p>
                <p className="px-3 pb-2 text-xs text-ink-muted">{user.email}</p>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-cream/60"
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-cream/60"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-accent hover:bg-cream/60"
                  onClick={() => setOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
