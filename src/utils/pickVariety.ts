import type { Product } from '../data/products'

/**
 * Round-robin picks across categories so the home page shows a spread of the catalog,
 * not only featured or alphabetical blocks.
 */
export function pickVarietyByCategory(all: Product[], limit: number): Product[] {
  const byCat = new Map<string, Product[]>()
  for (const p of all) {
    const key = p.category
    const list = byCat.get(key) ?? []
    list.push(p)
    byCat.set(key, list)
  }

  const categories = [...byCat.keys()].sort((a, b) => a.localeCompare(b))
  const buckets = categories.map((c) => [...(byCat.get(c) ?? [])])
  const out: Product[] = []
  let guard = 0
  const maxGuard = limit * categories.length + 50

  while (out.length < limit && buckets.some((b) => b.length > 0) && guard < maxGuard) {
    for (const b of buckets) {
      if (out.length >= limit) break
      const next = b.shift()
      if (next) out.push(next)
    }
    guard++
  }

  if (out.length < limit) {
    const seen = new Set(out.map((p) => p.id))
    for (const p of all) {
      if (out.length >= limit) break
      if (!seen.has(p.id)) {
        seen.add(p.id)
        out.push(p)
      }
    }
  }

  return out
}
