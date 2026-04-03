import { catalog } from './catalog'
import type { Product } from './productTypes'

export type { Product } from './productTypes'

export const products = catalog

export const categories = [
  'All',
  'Audio',
  'Wearables',
  'Home',
  'Bags',
  'Footwear',
  'Kitchen',
  'Accessories',
  'Tech',
] as const

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
}
