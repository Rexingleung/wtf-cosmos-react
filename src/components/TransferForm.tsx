import { useState } from 'react'
import { Send } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import { validateAddress, validateAmount } from '../lib/utils'

interface TransferFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

const TransferForm = ({ onSuccess, onError }: TransferFormProps) => {
  const [formData, setFormData] = useState({
    fromAddress: '',
    toAddress: '',
    amount: '',
    privateKey: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!formData.fromAddress || !formData.toAddress || !formData.amount || !formData.privateKey) {
      onError('请填写所有字段')
      return
    }

    if (!validateAddress(formData.fromAddress) || !validateAddress(formData.toAddress)) {
      onError('请输入有效的地址')
      return
    }

    if (!validateAmount(formData.amount)) {
      onError('请输入有效的金额')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAddress: formData.fromAddress,
          toAddress: formData.toAddress,
          amount: parseFloat(formData.amount),
          privateKey: formData.privateKey
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '交易失败')
      }

      setFormData({ fromAddress: '', toAddress: '', amount: '', privateKey: '' })
      onSuccess()
    } catch (error) {
      onError(error instanceof Error ? error.message : '交易失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Send className="h-5 w-5 text-blue-400" />
        快速转账
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="发送地址"
          type="text"
          placeholder="wtf1..."
          value={formData.fromAddress}
          onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
          required
        />
        <Input
          label="接收地址"
          type="text"
          placeholder="wtf1..."
          value={formData.toAddress}
          onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
          required
        />
        <Input
          label="金额"
          type="number"
          placeholder="100"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <Input
          label="私钥"
          type="password"
          placeholder="私钥"
          value={formData.privateKey}
          onChange={(e) => setFormData({ ...formData, privateKey: e.target.value })}
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          icon={Send}
        >
          {loading ? '发送中...' : '发送交易'}
        </Button>
      </form>
    </Card>
  )
}

export default TransferForm