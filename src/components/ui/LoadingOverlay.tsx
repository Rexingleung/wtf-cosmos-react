import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  message?: string
}

const LoadingOverlay = ({ message = '加载中...' }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center max-w-sm mx-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay