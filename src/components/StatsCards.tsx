import { TrendingUp, Clock, Coins, Pickaxe } from 'lucide-react'
import { BlockchainStats } from '../types'
import { formatNumber } from '../lib/utils'
import Card from './ui/Card'

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
      color: 'text-blue-400'
    },
    {
      title: '待处理交易',
      value: loading ? '-' : formatNumber(stats.pendingTransactions),
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      title: '总供应量',
      value: loading ? '-' : formatNumber(stats.totalSupply),
      icon: Coins,
      color: 'text-green-400'
    },
    {
      title: '挖矿状态',
      value: loading ? '-' : (stats.miningStatus ? '挖矿中' : '空闲'),
      icon: Pickaxe,
      color: stats.miningStatus ? 'text-orange-400' : 'text-gray-400'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card, index) => (
        <Card key={card.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <card.icon className={`h-8 w-8 ${card.color}`} />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StatsCards