/**
 * Format a date-only value (e.g. "2025-03-11" or ISO string) for display
 * without timezone shift. Treats the value as a calendar date so it displays
 * as the same day the user selected (avoids "one day in the past" in zones behind UTC).
 */

export function formatDateOnly(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
): string {

  if (value === undefined || value === null) return '-';

  const str = typeof value === 'string' ? value.slice(0, 10) : (value as Date).toISOString().slice(0, 10)
  const [y, m, d] = str.split('-').map(Number)

  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return '-';

  // Local date with this calendar day so display doesn't shift by timezone
  const localDate = new Date(y, m - 1, d)
  return localDate.toLocaleDateString('en-US', options)
}
