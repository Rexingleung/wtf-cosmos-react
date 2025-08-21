import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsCards from './components/StatsCards'
import TransferForm from './components/TransferForm'
import WalletManager from './components/WalletManager'
import MiningControl from './components/MiningControl'
import LatestBlocks from './components/LatestBlocks'
import GovernancePanel from './components/GovernancePanel'
import ValidatorsPanel from './components/ValidatorsPanel'
import NetworkInfo from './components/NetworkInfo'
import Notification from './components/ui/Notification'
import LoadingOverlay from './components/ui/LoadingOverlay'
import Tabs from './components/ui/Tabs'

import { useBlockchainStats } from './hooks/useBlockchainStats'
import { useLocalStorage } from './hooks/useLocalStorage'
import { NotificationProps } from './types'

function App() {
  const { stats, loading, error, refetch } = useBlockchainStats()
  const [notification, setNotification] = useState<NotificationProps | null>(null)
  const [activeTab, setActiveTab] = useLocalStorage('wtf-cosmos-active-tab', 'dashboard')
  const [isInitializing, setIsInitializing] = useState(false)

  const showNotification = (
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    setNotification({ message, type, onClose: () => setNotification(null) })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleInitialize = async () => {
    setIsInitializing(true)
    try {
      // 模拟初始化过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      showNotification('区块链初始化成功！', 'success')
      refetch()
    } catch (error) {
      showNotification('初始化失败，请重试', 'error')
    } finally {
      setIsInitializing(false)
    }
  }

  const handleTransferSuccess = () => {
    showNotification('交易提交成功！正在等待确认...', 'success')
    refetch()
  }

  const handleError = (error: string) => {
    showNotification(error, 'error')
  }

  const handleSuccess = (message: string) => {
    showNotification(message, 'success')
  }

  // 显示加载状态时的错误
  useEffect(() => {
    if (error) {
      showNotification(`数据加载失败: ${error}`, 'error')
    }
  }, [error])

  const tabs = [
    {
      id: 'dashboard',
      label: '仪表盘',
      content: (
        <div className="space-y-8">
          <StatsCards stats={stats} loading={loading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TransferForm 
              onSuccess={handleTransferSuccess}
              onError={handleError}
            />
            
            <WalletManager 
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
          
          <MiningControl 
            onSuccess={handleSuccess}
            onError={handleError}
          />
          
          <LatestBlocks onError={handleError} />
        </div>
      )
    },
    {
      id: 'governance',
      label: '治理',
      content: (
        <GovernancePanel 
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )
    },
    {
      id: 'validators',
      label: '验证者',
      content: (
        <ValidatorsPanel 
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )
    },
    {
      id: 'network',
      label: '网络信息',
      content: (
        <NetworkInfo 
          onError={handleError}
        />
      )
    }
  ]

  return (
    <div className="min-h-screen gradient-bg text-white relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>
      
      <div className="relative">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Hero 
            onRefresh={refetch} 
            onInitialize={handleInitialize}
            showNotification={showNotification}
            loading={isInitializing}
          />
          
          <Tabs 
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mt-8"
          />
        </main>
      </div>
      
      {/* 通知组件 */}
      {notification && (
        <Notification {...notification} />
      )}
      
      {/* 加载遮罩 */}
      {isInitializing && (
        <LoadingOverlay message="正在初始化区块链..." />
      )}
    </div>
  )
}

export default App