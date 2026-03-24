import { describe, expect, it } from 'vitest'
import { formatLargeNumber, formatPercent, formatPrice } from './formatting'

describe('formatting utilities', () => {
  it('formats price with currency symbol and decimals', () => {
    expect(formatPrice(1234.5, 'ZAR')).toBe('R 1,234.50')
    expect(formatPrice(1000, 'USD')).toBe('$ 1,000.00')
  })

  it('formats large numbers with trillion support', () => {
    expect(formatLargeNumber(1_250_000_000_000, 'ZAR')).toBe('R1.25T')
    expect(formatLargeNumber(2_500_000_000, 'USD')).toBe('$2.50B')
    expect(formatLargeNumber(7_500_000, 'EUR')).toBe('€7.50M')
    expect(formatLargeNumber(12_300, 'GBP')).toBe('£12.30K')
  })

  it('formats negative large numbers with sign', () => {
    expect(formatLargeNumber(-1_500_000_000_000, 'USD')).toBe('-$1.50T')
    expect(formatLargeNumber(-1200, 'ZAR')).toBe('-R1.20K')
  })

  it('formats percentages with explicit sign', () => {
    expect(formatPercent(2.456)).toBe('+2.46%')
    expect(formatPercent(-2.456)).toBe('-2.46%')
    expect(formatPercent(0)).toBe('0.00%')
  })
})
