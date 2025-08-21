// API 工具函数和配置

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

// 通用的 API 请求函数
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`
    }))
    throw new Error(error.message || 'API request failed')
  }

  return response.json()
}

// 具体的 API 函数
export const blockchainAPI = {
  // 获取区块链统计信息
  getStats: () => apiRequest('/api'),
  
  // 获取区块列表
  getBlocks: (limit = 5) => apiRequest(`/api/blockchain/blocks?limit=${limit}`),
}

export const walletAPI = {
  // 创建新钱包
  create: () => apiRequest('/api/wallets', { method: 'POST' }),
  
  // 查询余额
  getBalance: (address: string) => apiRequest(`/api/wallets/${address}/balance`),
}

export const transactionAPI = {
  // 创建交易
  create: (data: {
    fromAddress: string
    toAddress: string
    amount: number
    privateKey: string
  }) => apiRequest('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
}

export const miningAPI = {
  // 获取挖矿状态
  getStatus: () => apiRequest('/api/mining/status'),
  
  // 开始挖矿
  start: (minerAddress: string) => apiRequest('/api/mining/start', {
    method: 'POST',
    body: JSON.stringify({ minerAddress })
  }),
  
  // 停止挖矿
  stop: () => apiRequest('/api/mining/stop', { method: 'POST' }),
}