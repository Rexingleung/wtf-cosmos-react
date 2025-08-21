import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useBlockchainStats } from '../../hooks/useBlockchainStats'

// Mock the mock API
vi.mock('../../api/mock', () => ({
  mockAPI: {
    getBlockchainInfo: vi.fn(),
    getMiningStatus: vi.fn(),
  }
}))

const mockAPI = vi.mocked(await import('../../api/mock')).mockAPI

describe('useBlockchainStats Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with default stats', () => {
    const { result } = renderHook(() => useBlockchainStats())
    
    expect(result.current.stats).toEqual({
      height: 0,
      pendingTransactions: 0,
      totalSupply: 0,
      miningStatus: false
    })
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('should fetch stats successfully', async () => {
    const mockStats = {
      blockchain: {
        height: 100,
        pendingTransactions: 5,
        totalSupply: 1000000
      }
    }
    
    const mockMiningStatus = {
      isMining: true
    }

    mockAPI.getBlockchainInfo.mockResolvedValue({ data: mockStats })
    mockAPI.getMiningStatus.mockResolvedValue({ data: mockMiningStatus })

    const { result } = renderHook(() => useBlockchainStats())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stats).toEqual({
      height: 100,
      pendingTransactions: 5,
      totalSupply: 1000000,
      miningStatus: true
    })
    expect(result.current.error).toBe(null)
  })

  it('should handle API errors', async () => {
    const errorMessage = 'API Error'
    mockAPI.getBlockchainInfo.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useBlockchainStats())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('获取数据失败')
  })

  it('should refetch stats when refetch is called', async () => {
    const mockStats = {
      blockchain: {
        height: 100,
        pendingTransactions: 5,
        totalSupply: 1000000
      }
    }

    mockAPI.getBlockchainInfo.mockResolvedValue({ data: mockStats })
    mockAPI.getMiningStatus.mockResolvedValue({ data: { isMining: false } })

    const { result } = renderHook(() => useBlockchainStats())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Call refetch
    result.current.refetch()

    expect(mockAPI.getBlockchainInfo).toHaveBeenCalledTimes(2)
  })

  it('should update stats every 10 seconds', async () => {
    const mockStats = {
      blockchain: {
        height: 100,
        pendingTransactions: 5,
        totalSupply: 1000000
      }
    }

    mockAPI.getBlockchainInfo.mockResolvedValue({ data: mockStats })
    mockAPI.getMiningStatus.mockResolvedValue({ data: { isMining: false } })

    renderHook(() => useBlockchainStats())

    // Wait for initial load
    await waitFor(() => {
      expect(mockAPI.getBlockchainInfo).toHaveBeenCalledTimes(1)
    })

    // Fast forward 10 seconds
    vi.advanceTimersByTime(10000)

    await waitFor(() => {
      expect(mockAPI.getBlockchainInfo).toHaveBeenCalledTimes(2)
    })
  })
})