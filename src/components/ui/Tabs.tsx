import { useState } from 'react'
import { cn } from '../../lib/utils'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onChange?: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills'
}

const Tabs = ({ 
  tabs, 
  activeTab: controlledActiveTab,
  onChange,
  className,
  variant = 'default'
}: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '')
  
  const activeTab = controlledActiveTab || internalActiveTab
  
  const handleTabChange = (tabId: string) => {
    if (onChange) {
      onChange(tabId)
    } else {
      setInternalActiveTab(tabId)
    }
  }
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  const tabListClasses = {
    default: 'border-b border-white/20',
    pills: 'bg-white/5 rounded-lg p-1'
  }

  const tabButtonClasses = {
    default: {
      base: 'px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent',
      active: 'text-white border-blue-400',
      inactive: 'text-white/60 hover:text-white hover:border-white/30'
    },
    pills: {
      base: 'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
      active: 'bg-white/20 text-white shadow-sm',
      inactive: 'text-white/60 hover:text-white hover:bg-white/10'
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Tab 导航 */}
      <div className={cn('flex space-x-1', tabListClasses[variant])}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const isDisabled = tab.disabled
          
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && handleTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                tabButtonClasses[variant].base,
                isActive 
                  ? tabButtonClasses[variant].active 
                  : tabButtonClasses[variant].inactive,
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      
      {/* Tab 内容 */}
      <div className="mt-6">
        {activeTabContent}
      </div>
    </div>
  )
}

export default Tabs