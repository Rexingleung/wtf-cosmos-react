import { useState, useEffect } from 'react'
import { Pickaxe, Play, Square, Zap, Clock, Award } from 'lucide-react'
import Card, { CardHeader, CardContent, StatsCard } from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import { validateAddress, getErrorMessage, formatNumber } from '../lib/utils'
import { mockAPI } from '../api/mock'
import { MiningStatus } from '../types'

interface MiningControlProps {
  onSuccess: (message: string) => void
  onError: (error: string) => void
}

const MiningControl = ({ onSuccess, onError }: MiningControlProps) => {
  const [minerAddress, setMinerAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [miningStatus, setMiningStatus] = useState<MiningStatus>({
    isMining: false,
    minerAddress: '',
    hashRate: 0,
    difficulty: 4,
    blocksFound: 0
  })
  const [miningStats, setMiningStats] = useState({
    totalHashRate: 0,
    estimatedTime: 0,
    rewardPerBlock: 50
  })

  // 定时更新挖矿状态
  useEffect(() => {
    const updateMiningStatus = async () => {
      try {
        const response = await mockAPI.getMiningStatus()
        setMiningStatus(response.data)
        
        // 计算挖矿统计
        if (response.data.isMining) {
          setMiningStats({
            totalHashRate: response.data.hashRate || 0,
            estimatedTime: Math.floor(Math.random() * 300) + 60, // 1-5分钟
            rewardPerBlock: 50
          })
        }
      } catch (error) {
        console.error('获取挖矿状态失败:', error)
      }
    }

    updateMiningStatus()
    const interval = setInterval(updateMiningStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const startMining = async () => {
    if (!minerAddress) {
      onError('请输入矿工地址')
      return
    }

    if (!validateAddress(minerAddress)) {
      onError('请输入有效的地址')
      return
    }

    setLoading(true)
    try {
      await mockAPI.startMining(minerAddress)
      onSuccess('挖矿已启动！正在寻找新区块...')
    } catch (error) {
      onError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const stopMining = async () => {
    setLoading(true)
    try {
      await mockAPI.stopMining()
      onSuccess('挖矿已停止')
      setMiningStats({ totalHashRate: 0, estimatedTime: 0, rewardPerBlock: 50 })
    } catch (error) {
      onError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const generateSampleMinerAddress = () => {
    const sampleAddresses = [
      'wtf1miner123456789abcdefghijklmnop',
      'wtf1hashpower987654321fedcbazyx',
      'wtf1digger555666777888999aaabbb'
    ]
    const randomAddress = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)]
    setMinerAddress(randomAddress)
  }

  const formatHashRate = (hashRate: number): string => {
    if (hashRate >= 1000000) {
      return `${(hashRate / 1000000).toFixed(1)} MH/s`
    } else if (hashRate >= 1000) {
      return `${(hashRate / 1000).toFixed(1)} KH/s`
    }
    return `${hashRate} H/s`
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* 挖矿统计 */}
      {miningStatus.isMining && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="算力"
            value={formatHashRate(miningStatus.hashRate || 0)}
            icon={Zap}
            color="text-yellow-400"
          />
          <StatsCard
            title="预计出块时间"
            value={formatTime(miningStats.estimatedTime)}
            icon={Clock}
            color="text-blue-400"
          />
          <StatsCard
            title="已挖出区块"
            value={miningStatus.blocksFound || 0}
            icon={Award}
            color="text-green-400"
            change={{
              value: 5.2,
              trend: 'up'
            }}
          />
        </div>
      )}

      {/* 挖矿控制面板 */}
      <Card>
        <CardHeader 
          title="挖矿控制中心"
          subtitle={
            miningStatus.isMining 
              ? `正在为 ${miningStatus.minerAddress?.substring(0, 12)}... 挖矿` 
              : '启动挖矿来获得 WTF 代币奖励'
          }
          icon={Pickaxe}
          action={
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              miningStatus.isMining 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {miningStatus.isMining ? '挖矿中' : '空闲'}
            </div>
          }
        />
        
        <CardContent>
          <div className="space-y-6">
            {/* 挖矿参数设置 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="矿工地址"
                placeholder="wtf1miner..."
                value={minerAddress}
                onChange={setMinerAddress}
                disabled={miningStatus.isMining}
                helperText={
                  <span>
                    挖矿奖励将发送到此地址
                    {!miningStatus.isMining && (
                      <button
                        type="button"
                        className="ml-2 text-blue-400 hover:text-blue-300 text-xs underline"
                        onClick={generateSampleMinerAddress}
                      >
                        使用示例
                      </button>
                    )}
                  </span>
                }
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">挖矿难度</label>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Difficulty: {miningStatus.difficulty}</span>
                    <span className="text-white/60 text-sm">自动调整</span>
                  </div>
                  <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1 rounded-full"
                      style={{ width: `${(miningStatus.difficulty || 0) * 20}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 挖矿信息 */}
            {miningStatus.isMining && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  实时挖矿信息
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/50 block">当前算力</span>
                    <span className="text-white font-medium">{formatHashRate(miningStatus.hashRate || 0)}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">已运行时间</span>
                    <span className="text-white font-medium">
                      {miningStatus.lastBlockTime 
                        ? formatTime(Math.floor((Date.now() - miningStatus.lastBlockTime) / 1000))
                        : '0s'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50 block">总奖励</span>
                    <span className="text-white font-medium">
                      {(miningStatus.blocksFound || 0) * miningStats.rewardPerBlock} WTF
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50 block">效率</span>
                    <span className="text-white font-medium">
                      {miningStatus.hashRate && miningStatus.hashRate > 0 
                        ? ((miningStatus.blocksFound || 0) / (miningStatus.hashRate / 1000)).toFixed(2)
                        : '0'
                      } 块/KH
                    </span>
                  </div>
                </div>
                
                {/* 算力进度条 */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>算力输出</span>
                    <span>{formatHashRate(miningStatus.hashRate || 0)}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${Math.min((miningStatus.hashRate || 0) / 1000 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 挖矿参数信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-white/60 text-sm">区块奖励</div>
                <div className="text-white font-semibold">{miningStats.rewardPerBlock} WTF</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-white/60 text-sm">目标出块时间</div>
                <div className="text-white font-semibold">10-30s</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-white/60 text-sm">网络难度</div>
                <div className="text-white font-semibold">{miningStatus.difficulty}</div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!miningStatus.isMining ? (
                <Button
                  onClick={startMining}
                  disabled={loading || !minerAddress}
                  loading={loading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  icon={Play}
                  size="lg"
                >
                  {loading ? '启动中...' : '开始挖矿'}
                </Button>
              ) : (
                <Button
                  onClick={stopMining}
                  disabled={loading}
                  loading={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  icon={Square}
                  size="lg"
                >
                  {loading ? '停止中...' : '停止挖矿'}
                </Button>
              )}
            </div>

            {/* 安全提示 */}
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <h4 className="text-orange-400 font-medium mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                挖矿提示
              </h4>
              <ul className="text-orange-300 text-sm space-y-1">
                <li>• 挖矿是一个计算密集型过程，可能会消耗大量 CPU 资源</li>
                <li>• 在此演示中，挖矿是模拟的，不会实际消耗系统资源</li>
                <li>• 挖矿奖励将自动发送到您指定的地址</li>
                <li>• 在真实网络中，请确保使用安全的硬件和网络环境</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MiningControl