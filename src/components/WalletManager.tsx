import { useState } from 'react'
import { Wallet, Search, Plus } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import { validateAddress } from '../lib/utils'

interface WalletManagerProps {
  onSuccess: (message: string) => void
  onError: (error: string) => void
}

const WalletManager = ({ onSuccess, onError }: WalletManagerProps) => {
  const [balanceAddress, setBalanceAddress] = useState('')
  const [balanceResult, setBalanceResult] = useState('')
  const [loading, setLoading] = useState(false)

  const createWallet = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/wallets', { method: 'POST' })
      if (!response.ok) {
        throw new Error('创建钱包失败')
      }
      
      const wallet = await response.json()
      const walletInfo = `地址: ${wallet.address}\n私钥: ${wallet.privateKey}\n公钥: ${wallet.publicKey}`
      
      // 使用 alert 显示钱包信息（在实际应用中可能需要更好的UI）
      alert(`新钱包创建成功!\n\n${walletInfo}\n\n请安全保存私钥！`)
      onSuccess('新钱包创建成功')
    } catch (error) {
      onError(error instanceof Error ? error.message : '创建钱包失败')
    } finally {
      setLoading(false)
    }
  }

  const checkBalance = async () => {
    if (!balanceAddress) {
      onError('请输入地址')
      return
    }

    if (!validateAddress(balanceAddress)) {
      onError('请输入有效的地址')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/wallets/${balanceAddress}/balance`)
      if (!response.ok) {
        throw new Error('查询余额失败')
      }
      
      const data = await response.json()
      setBalanceResult(`余额: ${data.balance} WTF`)
    } catch (error) {
      setBalanceResult('查询失败')
      onError(error instanceof Error ? error.message : '查询余额失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-green-400" />
        钱包管理
      </h3>
      <div className="space-y-4">
        <Button
          onClick={createWallet}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={loading}
          icon={Plus}
        >
          {loading ? '创建中...' : '创建新钱包'}
        </Button>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            查询余额
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="输入地址"
              value={balanceAddress}
              onChange={(e) => setBalanceAddress(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={checkBalance}
              disabled={loading}
              icon={Search}
              className="bg-purple-600 hover:bg-purple-700"
            >
              查询
            </Button>
          </div>
          {balanceResult && (
            <p className="mt-2 text-sm text-white/70">{balanceResult}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

export default WalletManager