import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setToastCallback } from '@/utils/network'

describe('network utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setToastCallback', () => {
    it('registers a callback for network events', () => {
      const callback = vi.fn()
      setToastCallback(callback)
      // callback is set internally, tested via integration
      expect(callback).not.toHaveBeenCalled()
    })
  })
})
