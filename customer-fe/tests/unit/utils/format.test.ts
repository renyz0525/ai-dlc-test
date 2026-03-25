import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from '@/utils/format'

describe('formatPrice', () => {
  it('formats price with comma separator and won symbol', () => {
    expect(formatPrice(15000)).toBe('15,000원')
  })

  it('formats zero price', () => {
    expect(formatPrice(0)).toBe('0원')
  })

  it('formats large price', () => {
    expect(formatPrice(1000000)).toBe('1,000,000원')
  })

  it('formats price without comma for small amounts', () => {
    expect(formatPrice(500)).toBe('500원')
  })
})

describe('formatDate', () => {
  it('formats ISO date string to YYYY-MM-DD HH:mm', () => {
    const result = formatDate('2026-03-25T09:15:00Z')
    expect(result).toMatch(/2026-03-25/)
    expect(result).toMatch(/\d{2}:\d{2}/)
  })
})
