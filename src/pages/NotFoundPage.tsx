import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-ink-muted">404</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-4 text-ink-muted">That URL does not exist in this storefront.</p>
      <Link to="/" className="mt-10 inline-block text-sm font-semibold text-accent hover:text-accent-hover">
        Go home
      </Link>
    </div>
  )
}
