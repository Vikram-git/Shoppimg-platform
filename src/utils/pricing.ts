import type { Product } from '../data/products'

/** Cart uses these for demo shipping (all prices in INR). */
export const FREE_SHIPPING_THRESHOLD_INR = 12_499
export const SHIPPING_FLAT_INR = 99

export function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function isOnSale(product: Product): boolean {
  return (
    product.compareAtPrice != null &&
    product.compareAtPrice > product.price
  )
}

export function discountPercent(product: Product): number | null {
  if (!isOnSale(product) || !product.compareAtPrice) return null
  return Math.round((1 - product.price / product.compareAtPrice) * 100)
}

export function lineSubtotal(product: Product, quantity: number) {
  return product.price * quantity
}

export function lineCompareTotal(product: Product, quantity: number) {
  const base = product.compareAtPrice ?? product.price
  return base * quantity
}

export function lineSavings(product: Product, quantity: number) {
  if (!isOnSale(product) || !product.compareAtPrice) return 0
  return (product.compareAtPrice - product.price) * quantity
}
