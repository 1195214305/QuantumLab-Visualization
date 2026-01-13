import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Atom, Cpu, GitBranch, FlaskConical, ArrowRight, Sparkles } from 'lucide-react'
import BlochSphere from '../components/BlochSphere'

const features = [
  {
    icon: Cpu,
    title: '量子门可视化',
    description: '交互式展示H、X、Y、Z、RZ、RY、CNOT等量子门的作用原理',
    link: '/gates',
    color: 'emerald'
  },
  {
    icon: GitBranch,
    title: '量子电路构建',
    description: '拖拽式量子电路设计器，实时查看量子态演化',
    link: '/circuits',
    color: 'cyan'
  },
  {
    icon: Atom,
    title: '量子算法演示',
    description: 'IQP编码、VQE算法、QPE相位估计等核心算法可视化',
    link: '/algorithms',
    color: 'violet'
  },
  {
    icon: FlaskConical,
    title: '量子实验室',
    description: '基于MindQuantum的三个实战作业：IQP、VQE、QPE',
    link: '/lab',
    color: 'amber'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-quantum-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧文字 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-quantum-500/10 border border-quantum-500/20 text-quantum-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>基于 MindQuantum 量子计算框架</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-50 leading-tight mb-6">
                探索
                <span className="text-quantum-400">量子计算</span>
                的奥秘
              </h1>

              <p className="text-lg text-dark-400 mb-8 max-w-xl">
                QuantumLab 是一个交互式量子计算学习平台，通过可视化演示帮助你理解量子门、量子电路和量子算法的工作原理。
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-quantum-500 hover:bg-quantum-600 text-dark-950 font-semibold rounded-lg transition-colors"
                >
                  开始实验
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/gates"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-100 font-semibold rounded-lg border border-dark-700 transition-colors"
                >
                  了解量子门
                </Link>
              </div>
            </motion.div>

            {/* 右侧布洛赫球 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <BlochSphere size={300} animate showAxes />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-dark-500 text-sm">
                  布洛赫球 - 量子态可视化
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              核心功能
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              从基础量子门到复杂量子算法，全方位学习量子计算
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={feature.link}
                    className="block h-full p-6 bg-dark-800/50 hover:bg-dark-800 rounded-xl border border-dark-700 hover:border-dark-600 transition-all group"
                  >
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center mb-4
                      ${feature.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                      ${feature.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : ''}
                      ${feature.color === 'violet' ? 'bg-violet-500/20 text-violet-400' : ''}
                      ${feature.color === 'amber' ? 'bg-amber-500/20 text-amber-400' : ''}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-100 mb-2 group-hover:text-quantum-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-dark-400 text-sm">
                      {feature.description}
                    </p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Algorithm Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              量子算法实战
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              基于 MindQuantum 训练营的三个核心作业，深入理解量子算法
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'IQP 编码电路',
                description: '学习如何将经典数据编码到量子态中，理解量子机器学习的基础',
                tags: ['H门', 'RZ门', 'CNOT门'],
                color: 'emerald'
              },
              {
                title: 'VQE 分子模拟',
                description: '使用变分量子本征求解器计算H₂分子的势能曲线',
                tags: ['Ansatz', '优化器', '哈密顿量'],
                color: 'cyan'
              },
              {
                title: 'QPE 相位估计',
                description: '通过量子相位估计算法找出神秘量子门的相位参数',
                tags: ['QFT', '受控门', '相位'],
                color: 'violet'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-dark-800/50 rounded-xl border border-dark-700"
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-mono font-bold
                  ${item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                  ${item.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : ''}
                  ${item.color === 'violet' ? 'bg-violet-500/20 text-violet-400' : ''}
                `}>
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-dark-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-dark-400 text-sm mb-4">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-dark-700 text-dark-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-6 py-3 bg-quantum-500 hover:bg-quantum-600 text-dark-950 font-semibold rounded-lg transition-colors"
            >
              进入实验室
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-dark-50 mb-8">
              技术栈
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Framer Motion', 'MindQuantum', 'ESA Edge'].map(tech => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-dark-800 text-dark-300 rounded-lg border border-dark-700 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
