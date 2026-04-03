import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } | string } | null)?.from ?? '/'
  const redirectTo = typeof from === 'string' ? from : (from.pathname ?? '/')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    setError('')
    const r = signUp(email, password, name)
    if (!r.ok) {
      setError(r.error)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">
        Create account
      </h1>
      <p className="mt-2 text-center text-sm text-ink-muted">
        Save your details for faster checkout. Data never leaves this device.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-5 rounded-2xl border border-cream bg-white p-6 shadow-sm">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="signup-name" className="text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream px-4 py-3 text-sm outline-none ring-accent/25 focus:ring-2"
          />
          <p className="mt-1 text-xs text-ink-muted">At least 6 characters (demo).</p>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-forest py-3.5 text-sm font-semibold text-paper hover:bg-forest/90"
        >
          Sign up
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/sign-in" className="font-semibold text-accent hover:text-accent-hover" state={{ from }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
