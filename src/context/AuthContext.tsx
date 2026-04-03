import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type User = {
  email: string
  name: string
}

const USERS_KEY = 'arcadia-users-v1'
const SESSION_KEY = 'arcadia-session-v1'

type StoredUser = { password: string; name: string }

function readUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return {}
    const p = JSON.parse(raw) as Record<string, StoredUser>
    return p && typeof p === 'object' ? p : {}
  } catch {
    return {}
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as User
    if (p?.email && p?.name) return { email: p.email, name: p.name }
    return null
  } catch {
    return null
  }
}

function writeSession(user: User | null) {
  if (!user) localStorage.removeItem(SESSION_KEY)
  else localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

type AuthContextValue = {
  user: User | null
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  signUp: (email: string, password: string, name: string) => { ok: true } | { ok: false; error: string }
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    typeof window === 'undefined' ? null : readSession(),
  )

  useEffect(() => {
    writeSession(user)
  }, [user])

  const signIn = useCallback((email: string, password: string) => {
    const key = email.trim().toLowerCase()
    if (!key || password.length < 1) {
      return { ok: false as const, error: 'Email and password required.' }
    }
    const users = readUsers()
    const row = users[key]
    if (!row) return { ok: false as const, error: 'No account found for that email.' }
    if (row.password !== password) {
      return { ok: false as const, error: 'Incorrect password.' }
    }
    setUser({ email: key, name: row.name })
    return { ok: true as const }
  }, [])

  const signUp = useCallback((email: string, password: string, name: string) => {
    const key = email.trim().toLowerCase()
    const trimmedName = name.trim()
    if (!key || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
      return { ok: false as const, error: 'Valid email required.' }
    }
    if (password.length < 6) {
      return { ok: false as const, error: 'Password must be at least 6 characters.' }
    }
    if (trimmedName.length < 2) {
      return { ok: false as const, error: 'Please enter your name.' }
    }
    const users = readUsers()
    if (users[key]) {
      return { ok: false as const, error: 'An account with this email already exists.' }
    }
    users[key] = { password, name: trimmedName }
    writeUsers(users)
    setUser({ email: key, name: trimmedName })
    return { ok: true as const }
  }, [])

  const signOut = useCallback(() => setUser(null), [])

  const value = useMemo(
    () => ({ user, signIn, signUp, signOut }),
    [user, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
