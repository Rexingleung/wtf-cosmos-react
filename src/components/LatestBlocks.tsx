import { useState, useEffect } from 'react'
import { Package, RefreshCw, Eye, Clock, Hash } from 'lucide-react'
import Card, { CardHeader, CardContent } from './ui/Card'
import Button from './ui/Button'
import { Block } from '../types'
import { formatDate, truncateHash, formatNumber, getErrorMessage } from '../lib/utils'
import { mockAPI } from '../api/mock'

interface LatestBlocksProps {
  onError: (error: string) => void
}

const LatestBlocks = ({ onError }: LatestBlocksProps) => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [showBlockModal, setShowBlockModal] = useState(false)

  const loadBlocks = async () => {
    setLoading(true)
    try {
      const response = await mockAPI.getBlocks(10)
      setBlocks(response.data.blocks || [])
    } catch (error) {
      onError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlocks()
    
    // 每15秒自动刷新
    const interval = setInterval(loadBlocks, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block)
    setShowBlockModal(true)
  }

  const getBlockAge = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  }

  const calculateBlockSize = (block: Block): string => {
    // 模拟计算区块大小（字节）
    const baseSize = 500 // 基础区块大小
    const txSize = block.transactions.length * 250 // 每个交易约250字节
    const totalSize = baseSize + txSize
    
    if (totalSize > 1024) {
      return `${(totalSize / 1024).toFixed(1)} KB`
    }
    return `${totalSize} B`
  }

  return (
    <>
      <Card>
        <CardHeader 
          title="最新区块"
          subtitle={`共 ${blocks.length} 个区块，点击查看详情`}
          icon={Package}
          action={
            <Button
              onClick={loadBlocks}
              disabled={loading}
              loading={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
              icon={RefreshCw}
              size="sm"
            >
              刷新
            </Button>
          }
        />
        
        <CardContent>
          {loading && blocks.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full mb-2"></div>
              <p className="text-white/60">加载中...</p>
            </div>
          ) : blocks.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Package className="h-12 w-12 mx-auto mb-4 text-white/30" />
              <p>暂无区块数据</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blocks.map((block, index) => (
                <div
                  key={`${block.index}-${block.hash}`}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleBlockClick(block)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <Package className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          区块 #{formatNumber(block.index)}
                        </span>
                        <p className="text-sm text-white/60">
                          {getBlockAge(block.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-white/60 group-hover:text-white/80 transition-colors">
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="text-xs">查看详情</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-white/50 block mb-1">区块哈希</span>
                      <span className="text-white font-mono text-xs">
                        {truncateHash(block.hash, 8, 8)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-white/50 block mb-1">交易数</span>
                      <span className="text-white font-medium">
                        {formatNumber(block.transactions.length)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-white/50 block mb-1">区块大小</span>
                      <span className="text-white font-medium">
                        {calculateBlockSize(block)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-white/50 block mb-1">Nonce</span>
                      <span className="text-white font-mono text-xs">
                        {formatNumber(block.nonce)}
                      </span>
                    </div>
                  </div>

                  {/* 区块进度条（装饰性） */}
                  <div className="mt-3">
                    <div className="w-full bg-white/5 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500 group-hover:from-blue-400 group-hover:to-purple-400"
                        style={{ width: `${Math.min((block.transactions.length / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/40 mt-1">
                      <span>交易密度</span>
                      <span>{((block.transactions.length / 10) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 区块详情模态框 */}
      {showBlockModal && selectedBlock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-400" />
                区块 #{formatNumber(selectedBlock.index)} 详情
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* 区块基本信息 */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Hash className="h-4 w-4 mr-2 text-purple-400" />
                  基本信息
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-white/50 block mb-1">区块高度</span>
                      <span className="text-white font-mono">{formatNumber(selectedBlock.index)}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block mb-1">时间戳</span>
                      <span className="text-white">{formatDate(selectedBlock.timestamp)}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block mb-1">交易数量</span>
                      <span className="text-white font-medium">{selectedBlock.transactions.length}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-white/50 block mb-1">Nonce</span>
                      <span className="text-white font-mono">{formatNumber(selectedBlock.nonce)}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block mb-1">区块大小</span>
                      <span className="text-white">{calculateBlockSize(selectedBlock)}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block mb-1">区块年龄</span>
                      <span className="text-white">{getBlockAge(selectedBlock.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 哈希信息 */}
              <div>
                <h4 className="text-white font-medium mb-3">哈希信息</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-white/50 block mb-1">区块哈希</span>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 font-mono text-xs text-white break-all">
                      {selectedBlock.hash}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/50 block mb-1">前一区块哈希</span>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 font-mono text-xs text-white break-all">
                      {selectedBlock.previousHash}
                    </div>
                  </div>
                </div>
              </div>

              {/* 交易列表 */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-400" />
                  交易列表 ({selectedBlock.transactions.length})
                </h4>
                {selectedBlock.transactions.length === 0 ? (
                  <div className="text-center py-6 text-white/60">
                    <p>此区块没有交易</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedBlock.transactions.map((tx, index) => (
                      <div key={tx.id} className="p-3 bg-white/5 rounded border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono text-white/60">#{index + 1}</span>
                          <span className="text-xs text-white/50">
                            {formatDate(tx.timestamp, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-white/50 block">From:</span>
                            <span className="text-white font-mono">
                              {tx.fromAddress === 'mining_reward' ? '挖矿奖励' : 
                               tx.fromAddress === 'genesis' ? '创世区块' :
                               truncateHash(tx.fromAddress, 6, 4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/50 block">To:</span>
                            <span className="text-white font-mono">
                              {truncateHash(tx.toAddress, 6, 4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/50 block">Amount:</span>
                            <span className="text-white font-semibold">
                              {formatNumber(tx.amount)} WTF
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setShowBlockModal(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LatestBlocks