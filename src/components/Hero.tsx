import { RefreshCw, FileText } from 'lucide-react'
import Button from './ui/Button'

interface HeroProps {
  onRefresh: () => void
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void
}

const Hero = ({ onRefresh, showNotification }: HeroProps) => {
  const handleInitialize = () => {
    showNotification('区块链已初始化', 'success')
    onRefresh()
  }

  const handleShowAPIDoc = () => {
    window.open('/api', '_blank')
  }

  return (
    <div className="text-center mb-12 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
        欢迎来到 WTF Cosmos JS
      </h2>
      <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        用 JavaScript 构建的教育性区块链实现，现在使用现代化的 React + TypeScript 技术栈
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={handleInitialize}
          className="bg-blue-600 hover:bg-blue-700"
          icon={RefreshCw}
        >
          初始化区块链
        </Button>
        <Button
          onClick={handleShowAPIDoc}
          variant="outline"
          icon={FileText}
        >
          查看 API 文档
        </Button>
      </div>
    </div>
  )
}

export default Hero