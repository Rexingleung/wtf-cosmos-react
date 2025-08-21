import { Rocket } from 'lucide-react'

const Navbar = () => {
  const navItems = [
    { href: '#dashboard', label: '仪表盘' },
    { href: '#explorer', label: '区块浏览器' },
    { href: '#wallet', label: '钱包' },
    { href: '#mining', label: '挖矿' },
    { href: '#governance', label: '治理' },
  ]

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-shadow">WTF Cosmos JS</h1>
          </div>
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar