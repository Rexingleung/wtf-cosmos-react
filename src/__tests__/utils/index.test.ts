import {
  formatNumber,
  formatCurrency,
  formatDate,
  truncateHash,
  validateAddress,
  validateAmount,
  generateId,
  copyToClipboard
} from '../../lib/utils'

describe('Utility Functions', () => {
  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(123.45)).toBe('123.45')
    })

    it('should handle zero and negative numbers', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(-1000)).toBe('-1,000')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency with default WTF', () => {
      expect(formatCurrency(100)).toBe('100 WTF')
      expect(formatCurrency(1000.5)).toBe('1,000.5 WTF')
    })

    it('should format currency with custom symbol', () => {
      expect(formatCurrency(100, 'USD')).toBe('100 USD')
    })
  })

  describe('formatDate', () => {
    it('should format timestamp to readable date', () => {
      const timestamp = new Date('2023-01-01T00:00:00Z').getTime()
      const formatted = formatDate(timestamp)
      expect(formatted).toContain('2023')
    })
  })

  describe('truncateHash', () => {
    it('should truncate long hashes', () => {
      const hash = 'abcdefghijklmnopqrstuvwxyz1234567890'
      expect(truncateHash(hash)).toBe('abcdefgh...34567890')
    })

    it('should return original hash if short', () => {
      const hash = 'short'
      expect(truncateHash(hash)).toBe('short')
    })

    it('should handle custom lengths', () => {
      const hash = 'abcdefghijklmnopqrstuvwxyz1234567890'
      expect(truncateHash(hash, 4, 4)).toBe('abcd...7890')
    })
  })

  describe('validateAddress', () => {
    it('should validate correct addresses', () => {
      expect(validateAddress('wtf1abcdefghijk')).toBe(true)
      expect(validateAddress('wtf1longeraddress123456789')).toBe(true)
    })

    it('should reject invalid addresses', () => {
      expect(validateAddress('')).toBe(false)
      expect(validateAddress('invalid')).toBe(false)
      expect(validateAddress('wtf1')).toBe(false)
      expect(validateAddress('cosmos1abcdef')).toBe(false)
    })
  })

  describe('validateAmount', () => {
    it('should validate positive numbers', () => {
      expect(validateAmount('100')).toBe(true)
      expect(validateAmount('0.1')).toBe(true)
      expect(validateAmount(100)).toBe(true)
    })

    it('should reject invalid amounts', () => {
      expect(validateAmount('0')).toBe(false)
      expect(validateAmount('-100')).toBe(false)
      expect(validateAmount('invalid')).toBe(false)
      expect(validateAmount('')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('should generate ID of specified length', () => {
      expect(generateId(8)).toHaveLength(8)
      expect(generateId(16)).toHaveLength(16)
    })

    it('should generate different IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('copyToClipboard', () => {
    const mockWriteText = vi.fn()
    
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      })
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('should copy text to clipboard successfully', async () => {
      mockWriteText.mockResolvedValue(undefined)
      
      const result = await copyToClipboard('test text')
      
      expect(mockWriteText).toHaveBeenCalledWith('test text')
      expect(result).toBe(true)
    })

    it('should handle clipboard errors', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard error'))
      
      const result = await copyToClipboard('test text')
      
      expect(result).toBe(false)
    })
  })
})