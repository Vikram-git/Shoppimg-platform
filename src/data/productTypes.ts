export type Product = {
  id: string
  name: string
  slug: string
  /** Current sale price in INR (what the customer pays). */
  price: number
  /** Optional original / list price in INR; when higher than `price`, item is on sale. */
  compareAtPrice?: number
  category: string
  description: string
  longDescription: string
  image: string
  featured?: boolean
}
