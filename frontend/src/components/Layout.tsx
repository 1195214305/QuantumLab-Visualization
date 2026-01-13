import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Cpu,
  GitBranch,
  Atom,
  FlaskConical,
  MessageSquare,
  BookOpen,
  Settings,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react'
import { useState } from 'react'
import { useThemeStore } from '../store/theme'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/gates', label: '量子门', icon: Cpu },
  { path: '/circuits', label: '量子电路', icon: GitBranch },
  { path: '/algorithms', label: '量子算法', icon: Atom },
  { path: '/lab', label: '实验室', icon: FlaskConical },
  { path: '/homework', label: '作业', icon: BookOpen },
  { path: '/ai', label: 'AI助手', icon: MessageSquare },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100">
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-quantum-500/20 flex items-center justify-center">
                <Atom className="w-5 h-5 text-quantum-400" />
              </div>
              <span className="font-semibold text-lg tracking-tight">
                Quantum<span className="text-quantum-400">Lab</span>
              </span>
            </Link>

            {/* 桌面导航 */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${isActive
                        ? 'text-quantum-400'
                        : 'text-dark-400 hover:text-dark-200'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-quantum-500/10 rounded-lg border border-quantum-500/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className={`p-2 rounded-lg transition-colors ${
                  location.pathname === '/settings'
                    ? 'text-quantum-400 bg-quantum-500/10'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                }`}
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-dark-900 border-b border-dark-800"
          >
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${isActive
                        ? 'bg-quantum-500/10 text-quantum-400 border border-quantum-500/20'
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${location.pathname === '/settings'
                    ? 'bg-quantum-500/10 text-quantum-400 border border-quantum-500/20'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                  }
                `}
              >
                <Settings className="w-5 h-5" />
                设置
              </Link>
            </nav>
          </motion.div>
        )}
      </header>

      {/* 主内容 */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-dark-900 border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Atom className="w-5 h-5 text-quantum-400" />
              <span className="text-dark-400 text-sm">
                QuantumLab - 量子计算可视化平台
              </span>
            </div>
            <div className="text-dark-500 text-sm">
              本项目由阿里云ESA提供加速、计算和保护
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
