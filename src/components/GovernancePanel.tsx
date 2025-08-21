import { useState, useEffect } from 'react'
import { Vote, FileText, Users, Clock, CheckCircle, XCircle } from 'lucide-react'
import Card, { CardHeader, CardContent } from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import { Proposal, CreateProposalFormData, VoteFormData } from '../types'
import { formatDate, formatCurrency, cn } from '../lib/utils'

interface GovernancePanelProps {
  onSuccess: (message: string) => void
  onError: (error: string) => void
}

// 模拟提案数据
const mockProposals: Proposal[] = [
  {
    id: 1,
    title: '增加区块奖励',
    description: '提议将挖矿奖励从50 WTF增加到75 WTF，以激励更多矿工参与网络维护。',
    proposer: 'wtf1proposer123456789abcdef',
    status: 'voting',
    votingEndTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后
    votes: {
      yes: 650000,
      no: 120000,
      abstain: 50000,
      noWithVeto: 30000
    },
    deposit: 1000,
    totalDeposit: 1000
  },
  {
    id: 2,
    title: '网络升级提案',
    description: '升级共识算法以提高网络安全性和交易处理速度。',
    proposer: 'wtf1proposer987654321fedcba',
    status: 'passed',
    votingEndTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前结束
    votes: {
      yes: 890000,
      no: 45000,
      abstain: 30000,
      noWithVeto: 15000
    },
    deposit: 2000,
    totalDeposit: 2000
  }
]

const GovernancePanel = ({ onSuccess, onError }: GovernancePanelProps) => {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals)
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState<CreateProposalFormData>({
    title: '',
    description: '',
    deposit: '',
    proposer: '',
    privateKey: ''
  })

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!createFormData.title || !createFormData.description || !createFormData.deposit || !createFormData.proposer) {
      onError('请填写所有必填字段')
      return
    }

    setLoading(true)
    try {
      // 模拟创建提案
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newProposal: Proposal = {
        id: proposals.length + 1,
        title: createFormData.title,
        description: createFormData.description,
        proposer: createFormData.proposer,
        status: 'voting',
        votingEndTime: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14天后
        votes: { yes: 0, no: 0, abstain: 0, noWithVeto: 0 },
        deposit: parseFloat(createFormData.deposit),
        totalDeposit: parseFloat(createFormData.deposit)
      }
      
      setProposals([newProposal, ...proposals])
      setCreateFormData({ title: '', description: '', deposit: '', proposer: '', privateKey: '' })
      setShowCreateForm(false)
      onSuccess('提案创建成功！')
    } catch (error) {
      onError('创建提案失败')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (proposalId: number, option: VoteFormData['option']) => {
    setLoading(true)
    try {
      // 模拟投票
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProposals(proposals.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            votes: {
              ...proposal.votes,
              [option]: proposal.votes[option] + 10000 // 模拟投票权重
            }
          }
        }
        return proposal
      }))
      
      onSuccess(`投票成功！您选择了：${option === 'yes' ? '赞成' : option === 'no' ? '反对' : option === 'abstain' ? '弃权' : '强烈反对'}`)
    } catch (error) {
      onError('投票失败')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'voting': return 'text-blue-400'
      case 'passed': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'failed': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'voting': return Clock
      case 'passed': return CheckCircle
      case 'rejected': return XCircle
      case 'failed': return XCircle
      default: return Clock
    }
  }

  const calculateVotePercentage = (votes: Proposal['votes'], option: keyof Proposal['votes']) => {
    const total = Object.values(votes).reduce((sum, count) => sum + count, 0)
    return total > 0 ? (votes[option] / total) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* 创建提案 */}
      <Card>
        <CardHeader 
          title="治理中心"
          subtitle="参与网络治理，投票决定网络发展方向"
          icon={Vote}
          action={
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              icon={FileText}
            >
              {showCreateForm ? '取消' : '创建提案'}
            </Button>
          }
        />
        
        {showCreateForm && (
          <CardContent>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="提案标题"
                  placeholder="输入提案标题"
                  value={createFormData.title}
                  onChange={(value) => setCreateFormData({...createFormData, title: value})}
                  required
                />
                <Input
                  label="押金 (WTF)"
                  type="number"
                  placeholder="1000"
                  value={createFormData.deposit}
                  onChange={(value) => setCreateFormData({...createFormData, deposit: value})}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">提案描述</label>
                  <textarea
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="详细描述您的提案内容..."
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="提案者地址"
                    placeholder="wtf1..."
                    value={createFormData.proposer}
                    onChange={(value) => setCreateFormData({...createFormData, proposer: value})}
                    required
                  />
                  <Input
                    label="私钥"
                    type="password"
                    placeholder="私钥用于签名"
                    value={createFormData.privateKey}
                    onChange={(value) => setCreateFormData({...createFormData, privateKey: value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  创建提案
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* 提案列表 */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const StatusIcon = getStatusIcon(proposal.status)
          const totalVotes = Object.values(proposal.votes).reduce((sum, count) => sum + count, 0)
          
          return (
            <Card key={proposal.id} className="overflow-hidden">
              <div className="space-y-4">
                {/* 提案头部 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-mono text-white/60">#{proposal.id}</span>
                      <div className={cn('flex items-center space-x-1', getStatusColor(proposal.status))}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">
                          {proposal.status === 'voting' ? '投票中' : 
                           proposal.status === 'passed' ? '已通过' :
                           proposal.status === 'rejected' ? '已拒绝' : '已失败'}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{proposal.title}</h3>
                    <p className="text-white/70 text-sm">{proposal.description}</p>
                  </div>
                </div>

                {/* 提案信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">提案者:</span>
                    <p className="text-white font-mono text-xs">
                      {proposal.proposer.substring(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <span className="text-white/50">押金:</span>
                    <p className="text-white">{formatCurrency(proposal.totalDeposit)}</p>
                  </div>
                  <div>
                    <span className="text-white/50">总投票:</span>
                    <p className="text-white">{formatCurrency(totalVotes)}</p>
                  </div>
                  <div>
                    <span className="text-white/50">截止时间:</span>
                    <p className="text-white text-xs">
                      {proposal.status === 'voting' ? formatDate(proposal.votingEndTime, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '已结束'}
                    </p>
                  </div>
                </div>

                {/* 投票结果 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">投票结果</span>
                    <span className="text-white/50">{formatCurrency(totalVotes)} 总投票</span>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(proposal.votes).map(([option, count]) => {
                      const percentage = calculateVotePercentage(proposal.votes, option as keyof Proposal['votes'])
                      const colors = {
                        yes: 'bg-green-500',
                        no: 'bg-red-500',
                        abstain: 'bg-gray-500',
                        noWithVeto: 'bg-orange-500'
                      }
                      
                      const labels = {
                        yes: '赞成',
                        no: '反对',
                        abstain: '弃权',
                        noWithVeto: '强烈反对'
                      }
                      
                      return (
                        <div key={option} className="flex items-center space-x-3">
                          <div className="w-16 text-xs text-white/70">
                            {labels[option as keyof typeof labels]}
                          </div>
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${colors[option as keyof typeof colors]}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-16 text-xs text-white text-right">
                            {percentage.toFixed(1)}%
                          </div>
                          <div className="w-20 text-xs text-white/50 text-right">
                            {formatCurrency(count)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 投票按钮 */}
                {proposal.status === 'voting' && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    <Button
                      size="sm"
                      onClick={() => handleVote(proposal.id, 'yes')}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      赞成
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleVote(proposal.id, 'no')}
                      disabled={loading}
                    >
                      反对
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleVote(proposal.id, 'abstain')}
                      disabled={loading}
                    >
                      弃权
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(proposal.id, 'noWithVeto')}
                      disabled={loading}
                    >
                      强烈反对
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {proposals.length === 0 && (
        <Card className="text-center py-12">
          <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/70 mb-2">暂无治理提案</h3>
          <p className="text-white/50">创建您的第一个提案来参与网络治理</p>
        </Card>
      )}
    </div>
  )
}

export default GovernancePanel