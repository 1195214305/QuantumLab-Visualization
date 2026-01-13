import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Code, Play, ChevronRight, Layers, Cpu, Atom, CheckCircle } from 'lucide-react'
import BlochSphere from '../components/BlochSphere'

type HomeworkType = 'iqp' | 'vqe' | 'qpe'

interface HomeworkData {
  id: HomeworkType
  title: string
  subtitle: string
  icon: typeof Layers
  color: string
  description: string
  objectives: string[]
  steps: { title: string; content: string; code?: string }[]
  interactiveDemo: React.ReactNode
}

export default function Homework() {
  const [selectedHomework, setSelectedHomework] = useState<HomeworkType>('iqp')
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const homeworks: Record<HomeworkType, HomeworkData> = {
    iqp: {
      id: 'iqp',
      title: 'IQP编码电路',
      subtitle: '作业一：量子特征编码',
      icon: Layers,
      color: 'emerald',
      description: 'IQP（Instantaneous Quantum Polynomial）编码是一种将经典数据编码到量子态的方法，广泛应用于量子机器学习。',
      objectives: [
        '理解IQP编码的基本原理',
        '掌握Hadamard门和RZ门的作用',
        '学会使用CNOT门创建量子纠缠',
        '能够用MindQuantum实现IQP电路',
      ],
      steps: [
        {
          title: '第一层：Hadamard门',
          content: '对所有量子比特应用Hadamard门，将|0⟩态变换为叠加态(|0⟩+|1⟩)/√2。这一步创建了量子并行性的基础。',
          code: `# 第一层：Hadamard门
for i in range(n_qubits):
    circuit += H.on(i)`
        },
        {
          title: '第二层：RZ门编码',
          content: '使用RZ门将经典特征编码到量子相位中。每个量子比特对应一个特征值，通过旋转角度进行编码。',
          code: `# 第二层：RZ门编码单比特特征
for i in range(n_qubits):
    circuit += RZ(features[i]).on(i)`
        },
        {
          title: '第三层：纠缠层',
          content: '使用CNOT门和RZ门编码双比特特征，创建量子纠缠。这使得电路能够捕获特征之间的相关性。',
          code: `# 第三层：CNOT + RZ编码双比特特征
idx = n_qubits
for i in range(n_qubits - 1):
    circuit += X.on(i + 1, i)  # CNOT
    circuit += RZ(features[idx]).on(i + 1)
    idx += 1`
        },
      ],
      interactiveDemo: <IQPDemo />,
    },
    vqe: {
      id: 'vqe',
      title: 'VQE算法',
      subtitle: '作业二：变分量子本征求解',
      icon: Cpu,
      color: 'cyan',
      description: 'VQE（Variational Quantum Eigensolver）是一种混合量子-经典算法，用于求解分子基态能量，是NISQ时代最重要的算法之一。',
      objectives: [
        '理解变分原理和VQE算法流程',
        '掌握参数化量子电路（Ansatz）的设计',
        '学会构建分子哈密顿量',
        '能够用MindQuantum实现VQE优化',
      ],
      steps: [
        {
          title: '构建Ansatz电路',
          content: 'Ansatz是参数化的量子电路，用于生成试探波函数。Hardware Efficient Ansatz使用RY、RZ旋转门和CNOT纠缠门。',
          code: `# Hardware Efficient Ansatz
for layer in range(n_layers):
    # 旋转层
    for i in range(n_qubits):
        circuit += RY(f'theta_{i}_{layer}').on(i)
        circuit += RZ(f'phi_{i}_{layer}').on(i)
    # 纠缠层
    for i in range(n_qubits - 1):
        circuit += X.on(i + 1, i)`
        },
        {
          title: '定义哈密顿量',
          content: '将分子哈密顿量转换为量子比特算符形式。对于H2分子，可以使用Jordan-Wigner变换。',
          code: `# H2分子哈密顿量（简化）
from mindquantum.core.operators import QubitOperator

hamiltonian = QubitOperator('Z0', 0.5) + \\
              QubitOperator('Z1', 0.5) + \\
              QubitOperator('Z0 Z1', 0.25)`
        },
        {
          title: '变分优化',
          content: '使用经典优化器（如梯度下降）最小化能量期望值。MindQuantum支持自动微分，可以高效计算梯度。',
          code: `# 创建模拟器和优化器
from mindquantum.simulator import Simulator
from mindquantum.core.operators import Hamiltonian

sim = Simulator('mqvector', n_qubits)
grad_ops = sim.get_expectation_with_grad(
    Hamiltonian(hamiltonian), circuit
)

# 优化循环
for epoch in range(100):
    f, g = grad_ops(params)
    params -= learning_rate * g`
        },
      ],
      interactiveDemo: <VQEDemo />,
    },
    qpe: {
      id: 'qpe',
      title: 'QPE算法',
      subtitle: '作业三：量子相位估计',
      icon: Atom,
      color: 'violet',
      description: 'QPE（Quantum Phase Estimation）是量子计算中的核心算法，用于估计酉算符的本征值相位，是Shor算法和量子化学模拟的基础。',
      objectives: [
        '理解量子傅里叶变换（QFT）',
        '掌握受控酉操作的实现',
        '学会QPE算法的完整流程',
        '能够用MindQuantum实现QPE',
      ],
      steps: [
        {
          title: '量子傅里叶变换',
          content: 'QFT是经典FFT的量子版本，将计算基态变换到傅里叶基态。它是QPE的核心组件。',
          code: `# 量子傅里叶变换
def create_qft_circuit(n_qubits):
    circuit = Circuit()
    for i in range(n_qubits):
        circuit += H.on(i)
        for j in range(i + 1, n_qubits):
            angle = np.pi / (2 ** (j - i))
            circuit += PhaseShift(angle).on(j, i)
    # SWAP反转比特顺序
    for i in range(n_qubits // 2):
        circuit += SWAP.on([i, n_qubits - 1 - i])
    return circuit`
        },
        {
          title: '受控酉操作',
          content: '对辅助比特应用Hadamard门，然后执行受控酉操作。控制比特k对应U^(2^k)操作。',
          code: `# 受控酉操作
for i in range(n_auxiliary):
    circuit += H.on(i)  # 辅助比特叠加

for i in range(n_auxiliary):
    power = 2 ** (n_auxiliary - 1 - i)
    for _ in range(power):
        circuit += unitary.on(target, i)  # 受控U`
        },
        {
          title: '逆QFT和测量',
          content: '应用逆量子傅里叶变换，将相位信息转换为计算基态。测量辅助比特得到相位的二进制表示。',
          code: `# 逆QFT
circuit += create_qft_circuit(n_auxiliary).hermitian()

# 测量辅助比特
# 测量结果 m 对应相位 φ = m / 2^n
# 本征值 λ = e^(2πiφ)`
        },
      ],
      interactiveDemo: <QPEDemo />,
    },
  }

  const homework = homeworks[selectedHomework]

  const markStepComplete = (step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]))
    if (step < homework.steps.length - 1) {
      setCurrentStep(step + 1)
    }
  }

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-50">
              MindQuantum作业
            </h1>
          </div>
          <p className="text-dark-400 text-sm sm:text-base">
            通过交互式演示，深入理解量子计算核心算法
          </p>
        </motion.div>

        {/* 作业选择卡片 */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {(Object.keys(homeworks) as HomeworkType[]).map((key) => {
            const hw = homeworks[key]
            const isSelected = selectedHomework === key
            const Icon = hw.icon
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setSelectedHomework(key)
                  setCurrentStep(0)
                  setCompletedSteps(new Set())
                }}
                className={`
                  p-5 rounded-xl border text-left transition-all
                  ${isSelected
                    ? `bg-${hw.color}-500/10 border-${hw.color}-500/50`
                    : 'bg-dark-900/80 border-dark-800 hover:border-dark-700'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mb-3
                  ${key === 'iqp' ? 'bg-emerald-500/20' : ''}
                  ${key === 'vqe' ? 'bg-cyan-500/20' : ''}
                  ${key === 'qpe' ? 'bg-violet-500/20' : ''}
                `}>
                  <Icon className={`w-5 h-5 ${
                    key === 'iqp' ? 'text-emerald-400' :
                    key === 'vqe' ? 'text-cyan-400' : 'text-violet-400'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${isSelected ? `text-${hw.color}-400` : 'text-dark-100'}`}>
                  {hw.title}
                </h3>
                <p className="text-dark-500 text-sm">{hw.subtitle}</p>
              </motion.button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：学习目标和步骤 */}
          <motion.div
            key={selectedHomework}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* 学习目标 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-5">
              <h3 className="text-sm font-medium text-dark-300 mb-3">学习目标</h3>
              <ul className="space-y-2">
                {homework.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-dark-400">
                    <ChevronRight className="w-4 h-4 text-quantum-400 flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 学习步骤 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-5">
              <h3 className="text-sm font-medium text-dark-300 mb-3">学习步骤</h3>
              <div className="space-y-2">
                {homework.steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                      ${currentStep === idx
                        ? 'bg-quantum-500/10 border border-quantum-500/30'
                        : 'hover:bg-dark-800'
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                      ${completedSteps.has(idx)
                        ? 'bg-quantum-500 text-white'
                        : currentStep === idx
                          ? 'bg-quantum-500/20 text-quantum-400 border border-quantum-500/50'
                          : 'bg-dark-700 text-dark-400'
                      }
                    `}>
                      {completedSteps.has(idx) ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-sm ${currentStep === idx ? 'text-dark-100' : 'text-dark-400'}`}>
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右侧：内容和演示 */}
          <motion.div
            key={`${selectedHomework}-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* 步骤内容 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-100">
                  {homework.steps[currentStep].title}
                </h2>
                <span className="text-xs text-dark-500">
                  步骤 {currentStep + 1} / {homework.steps.length}
                </span>
              </div>

              <p className="text-dark-300 text-sm leading-relaxed mb-4">
                {homework.steps[currentStep].content}
              </p>

              {homework.steps[currentStep].code && (
                <div className="bg-dark-800 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                  <pre className="text-emerald-400">
                    {homework.steps[currentStep].code}
                  </pre>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 rounded-lg text-sm bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一步
                </button>
                <button
                  onClick={() => markStepComplete(currentStep)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-quantum-500/20 text-quantum-400 border border-quantum-500/50 hover:bg-quantum-500/30 transition-colors"
                >
                  {completedSteps.has(currentStep) ? '已完成' : '标记完成'}
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 交互式演示 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-4 h-4 text-quantum-400" />
                <h3 className="text-sm font-medium text-dark-300">交互式演示</h3>
              </div>
              {homework.interactiveDemo}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// IQP编码演示组件
function IQPDemo() {
  const [features, setFeatures] = useState([0.5, 0.3, 0.7, 0.2])
  const [step, setStep] = useState(0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {features.map((f, idx) => (
          <div key={idx}>
            <label className="text-xs text-dark-500 block mb-1">特征 {idx + 1}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={f}
              onChange={(e) => {
                const newFeatures = [...features]
                newFeatures[idx] = parseFloat(e.target.value)
                setFeatures(newFeatures)
              }}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-dark-400">{f.toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setStep((step + 1) % 4)}
          className="px-4 py-2 rounded-lg text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors"
        >
          演示下一层
        </button>
        <span className="text-sm text-dark-400">
          当前层: {['初始态', 'Hadamard层', 'RZ编码层', '纠缠层'][step]}
        </span>
      </div>

      <div className="flex justify-center">
        <BlochSphere
          size={160}
          theta={step === 0 ? 0 : step === 1 ? Math.PI / 2 : Math.PI * features[0]}
          phi={step < 2 ? 0 : Math.PI * features[1]}
          showAxes
          animate={step > 0}
        />
      </div>
    </div>
  )
}

// VQE演示组件
function VQEDemo() {
  const [params, setParams] = useState({ theta: 0.5, phi: 0.3 })
  const [energy, setEnergy] = useState(0)
  const [history, setHistory] = useState<number[]>([])

  const calculateEnergy = (t: number, p: number) => {
    // 简化的能量函数
    return -0.5 * Math.cos(t * Math.PI) - 0.3 * Math.cos(p * Math.PI) + 0.2 * Math.sin(t * p * Math.PI)
  }

  const optimize = () => {
    let t = params.theta
    let p = params.phi
    const newHistory: number[] = []

    for (let i = 0; i < 20; i++) {
      const e = calculateEnergy(t, p)
      newHistory.push(e)

      // 简单梯度下降
      const dt = (calculateEnergy(t + 0.01, p) - e) / 0.01
      const dp = (calculateEnergy(t, p + 0.01) - e) / 0.01
      t -= 0.1 * dt
      p -= 0.1 * dp
    }

    setParams({ theta: t, phi: p })
    setEnergy(calculateEnergy(t, p))
    setHistory(newHistory)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-dark-500 block mb-1">θ参数</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={params.theta}
            onChange={(e) => setParams({ ...params, theta: parseFloat(e.target.value) })}
            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-dark-400">{params.theta.toFixed(2)}π</span>
        </div>
        <div>
          <label className="text-xs text-dark-500 block mb-1">φ参数</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={params.phi}
            onChange={(e) => setParams({ ...params, phi: parseFloat(e.target.value) })}
            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-dark-400">{params.phi.toFixed(2)}π</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={optimize}
          className="px-4 py-2 rounded-lg text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-colors"
        >
          运行优化
        </button>
        <span className="text-sm text-dark-400">
          当前能量: <span className="text-cyan-400 font-mono">{energy.toFixed(4)}</span>
        </span>
      </div>

      {history.length > 0 && (
        <div className="h-32 flex items-end gap-1">
          {history.map((e, idx) => (
            <div
              key={idx}
              className="flex-1 bg-cyan-500/50 rounded-t"
              style={{ height: `${((e + 1) / 2) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// QPE演示组件
function QPEDemo() {
  const [phase, setPhase] = useState(0.25)
  const [nBits, setNBits] = useState(3)
  const [result, setResult] = useState<string | null>(null)

  const runQPE = () => {
    // 模拟QPE结果
    const estimated = Math.round(phase * Math.pow(2, nBits)) / Math.pow(2, nBits)
    const binary = Math.round(estimated * Math.pow(2, nBits)).toString(2).padStart(nBits, '0')
    setResult(binary)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-dark-500 block mb-1">目标相位 φ</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={phase}
            onChange={(e) => setPhase(parseFloat(e.target.value))}
            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-dark-400">{phase.toFixed(2)} (λ = e^(2πi×{phase.toFixed(2)}))</span>
        </div>
        <div>
          <label className="text-xs text-dark-500 block mb-1">辅助比特数</label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setNBits(n)}
                className={`px-3 py-1 rounded text-sm ${
                  nBits === n
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                    : 'bg-dark-800 text-dark-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={runQPE}
          className="px-4 py-2 rounded-lg text-sm bg-violet-500/20 text-violet-400 border border-violet-500/50 hover:bg-violet-500/30 transition-colors"
        >
          运行QPE
        </button>
        {result && (
          <span className="text-sm text-dark-400">
            测量结果: <span className="text-violet-400 font-mono">|{result}⟩</span>
            {' '}→ 估计相位: <span className="text-violet-400 font-mono">
              {(parseInt(result, 2) / Math.pow(2, nBits)).toFixed(4)}
            </span>
          </span>
        )}
      </div>

      <div className="flex justify-center">
        <BlochSphere
          size={160}
          theta={Math.PI / 4}
          phi={phase * 2 * Math.PI}
          showAxes
        />
      </div>
    </div>
  )
}
