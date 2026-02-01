/**
 * Cached number formatter with decimals
 */
const eurDecimalFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Cached number formatter without decimals
 */
const eurIntegerFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a price in EUR currency
 * Shows decimals only if they're not .00
 * @param price - The price to format
 * @returns Formatted price string (e.g., "1.329 EUR" or "1.329,50 EUR")
 */
export function formatPrice(price: number): string {
  const hasDecimals = price % 1 !== 0;
  const formatter = hasDecimals ? eurDecimalFormatter : eurIntegerFormatter;
  return `${formatter.format(price)} EUR`;
}
