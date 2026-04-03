/**
 * Demo storefront: countdown until this instant (India Standard Time).
 * Update the ISO string to extend the “sale ends” timer.
 */
export const SALE_END_AT_ISO = '2026-05-15T23:59:59+05:30'

export function getSaleEndTimestamp(): number {
  return new Date(SALE_END_AT_ISO).getTime()
}
