import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { NotificationProps } from '../../types'
import { cn } from '../../lib/utils'

const Notification = ({ message, type, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500'
  }

  const Icon = icons[type]

  return (
    <div className={cn(
      'fixed top-4 right-4 p-4 rounded-lg shadow-lg border backdrop-blur-sm z-50 max-w-md animate-slide-up',
      colors[type]
    )}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
        <p className="text-white text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-0.5 rounded hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Notification