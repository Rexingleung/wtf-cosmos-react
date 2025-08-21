import { useState, useEffect, useCallback } from 'react'
import { BlockchainStats } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export function useBlockchainStats() {
  const [stats, setStats] = useState<BlockchainStats>({
    height: 0,
    pendingTransactions: 0,
    totalSupply: 0,
    miningStatus: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 获取区块链统计信息
      const response = await fetch(`${API_BASE}/api`)
      const data = await response.json()
      
      // 获取挖矿状态
      const miningResponse = await fetch(`${API_BASE}/api/mining/status`)
      const miningData = await miningResponse.json()
      
      setStats({
        height: data.blockchain?.height || 0,
        pendingTransactions: data.blockchain?.pendingTransactions || 0,
        totalSupply: data.blockchain?.totalSupply || 0,
        miningStatus: miningData.isMining || false
      })
    } catch (err) {
      setError('获取数据失败')
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // 每5秒更新一次
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}