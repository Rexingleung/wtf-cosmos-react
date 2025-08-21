import { TrendingUp, Clock, Coins, Pickaxe, Activity } from 'lucide-react'
import { BlockchainStats } from '../types'
import { formatNumber, formatCurrency } from '../lib/utils'
import { StatsCard } from './ui/Card'

interface StatsCardsProps {
  stats: BlockchainStats
  loading: boolean
}

const StatsCards = ({ stats, loading }: StatsCardsProps) => {
  const cards = [
    {
      title: '区块高度',
      value: loading ? '-' : formatNumber(stats.height),
      icon: TrendingUp,
      color: 'text-blue-400',
      change: loading ? undefined : {
        value: 2.3,
        trend: 'up' as const
      }
    },
    {
      title: '待处理交易',
      value: loading ? '-' : formatNumber(stats.pendingTransactions),
      icon: Clock,
      color: 'text-yellow-400',
      change: loading ? undefined : {
        value: stats.pendingTransactions > 5 ? 12.5 : -5.2,
        trend: (stats.pendingTransactions > 5 ? 'up' : 'down') as const
      }
    },
    {
      title: '总供应量',
      value: loading ? '-' : formatCurrency(stats.totalSupply),
      icon: Coins,
      color: 'text-green-400',
      change: loading ? undefined : {
        value: 0.8,
        trend: 'up' as const
      }
    },
    {
      title: '挖矿状态',
      value: loading ? '-' : (stats.miningStatus ? '挖矿中' : '空闲'),
      icon: stats.miningStatus ? Activity : Pickaxe,
      color: stats.miningStatus ? 'text-orange-400' : 'text-gray-400',
      change: loading ? undefined : {
        value: stats.miningStatus ? 15.3 : 0,
        trend: (stats.miningStatus ? 'up' : 'stable') as const
      }
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card, index) => (
        <div 
          key={card.title} 
          className="animate-slide-up" 
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <StatsCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            change={card.change}
            loading={loading}
          />
        </div>
      ))}
    </div>
  )
}

export default StatsCards