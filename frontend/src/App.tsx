import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Gates from './pages/Gates'
import Circuits from './pages/Circuits'
import Algorithms from './pages/Algorithms'
import Lab from './pages/Lab'
import AI from './pages/AI'
import Homework from './pages/Homework'
import Settings from './pages/Settings'
import { useThemeStore } from './store/theme'

export default function App() {
  const { isDark } = useThemeStore()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gates" element={<Gates />} />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
