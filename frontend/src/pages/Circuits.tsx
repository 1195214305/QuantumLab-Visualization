import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react'
import QuantumGate from '../components/QuantumGate'

type GateType = 'H' | 'X' | 'Y' | 'Z' | 'RZ' | 'RY' | 'CNOT' | 'S' | 'T'

interface CircuitGate {
  type: GateType
  qubit: number
  control?: number
  parameter?: string
}

const availableGates: GateType[] = ['H', 'X', 'Y', 'Z', 'S', 'T', 'RZ', 'RY', 'CNOT']

export default function Circuits() {
  const [qubits, setQubits] = useState(3)
  const [gates, setGates] = useState<CircuitGate[]>([
    { type: 'H', qubit: 0 },
    { type: 'CNOT', qubit: 1, control: 0 },
    { type: 'H', qubit: 2 },
  ])
  const [selectedGate, setSelectedGate] = useState<GateType>('H')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  const addGate = (qubit: number) => {
    if (selectedGate === 'CNOT') {
      // CNOT需要两个比特
      const control = qubit === 0 ? 1 : qubit - 1
      setGates([...gates, { type: 'CNOT', qubit, control }])
    } else {
      setGates([...gates, { type: selectedGate, qubit }])
    }
  }

  const removeGate = (index: number) => {
    setGates(gates.filter((_, i) => i !== index))
  }

  const clearCircuit = () => {
    setGates([])
    setCurrentStep(-1)
    setIsRunning(false)
  }

  const runCircuit = () => {
    if (isRunning) {
      setIsRunning(false)
      return
    }

    setIsRunning(true)
    setCurrentStep(0)

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= gates.length - 1) {
          clearInterval(interval)
          setIsRunning(false)
          return prev
        }
        return prev + 1
      })
    }, 800)
  }

  const resetCircuit = () => {
    setCurrentStep(-1)
    setIsRunning(false)
  }

  // 计算量子态（简化模拟）
  const calculateState = () => {
    const states = Array(qubits).fill('|0⟩')
    for (let i = 0; i <= currentStep && i < gates.length; i++) {
      const gate = gates[i]
      if (gate.type === 'H') {
        states[gate.qubit] = '|+⟩'
      } else if (gate.type === 'X') {
        states[gate.qubit] = states[gate.qubit] === '|0⟩' ? '|1⟩' : '|0⟩'
      }
    }
    return states
  }

  const currentStates = calculateState()

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
            量子电路
          </h1>
          <p className="text-dark-400 max-w-2xl">
            构建和模拟量子电路。选择量子门，点击量子线添加门，观察量子态的演化过程。
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 左侧：工具栏 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-4 sticky top-20">
              <h2 className="text-sm font-medium text-dark-300 mb-4">量子门工具箱</h2>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {availableGates.map(type => (
                  <QuantumGate
                    key={type}
                    type={type}
                    size="sm"
                    active={selectedGate === type}
                    onClick={() => setSelectedGate(type)}
                  />
                ))}
              </div>

              <div className="border-t border-dark-700 pt-4 mb-4">
                <h3 className="text-sm font-medium text-dark-300 mb-3">量子比特数</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQubits(Math.max(1, qubits - 1))}
                    className="w-8 h-8 rounded bg-dark-800 text-dark-300 hover:bg-dark-700"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-dark-200">{qubits}</span>
                  <button
                    onClick={() => setQubits(Math.min(6, qubits + 1))}
                    className="w-8 h-8 rounded bg-dark-800 text-dark-300 hover:bg-dark-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-dark-700 pt-4">
                <h3 className="text-sm font-medium text-dark-300 mb-3">控制</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={runCircuit}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                      ${isRunning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                        : 'bg-quantum-500/20 text-quantum-400 border border-quantum-500/50'
                      }
                    `}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? '暂停' : '运行'}
                  </button>
                  <button
                    onClick={resetCircuit}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-dark-800 text-dark-300 hover:bg-dark-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重置
                  </button>
                  <button
                    onClick={clearCircuit}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-rose-500/20 text-rose-400 border border-rose-500/50"
                  >
                    <Trash2 className="w-4 h-4" />
                    清空
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：电路画布 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6 overflow-x-auto">
              <h2 className="text-lg font-semibold text-dark-100 mb-6">量子电路</h2>

              <div className="min-w-max">
                {Array.from({ length: qubits }).map((_, qubitIdx) => (
                  <div key={qubitIdx} className="flex items-center gap-3 mb-6 last:mb-0">
                    {/* 量子比特标签 */}
                    <div className="w-16 flex-shrink-0 flex items-center gap-2">
                      <span className="text-dark-400 font-mono text-sm">q[{qubitIdx}]</span>
                      <span className="text-dark-500 font-mono text-xs">
                        {currentStates[qubitIdx]}
                      </span>
                    </div>

                    {/* 初始态 */}
                    <div className="w-10 h-10 rounded-lg border border-dark-700 flex items-center justify-center text-dark-400 font-mono text-sm bg-dark-800">
                      |0⟩
                    </div>

                    {/* 量子线和门 */}
                    <div className="flex items-center relative flex-1">
                      {/* 背景线 */}
                      <div className="absolute left-0 right-0 h-0.5 bg-dark-700" />

                      {/* 已添加的门 */}
                      {gates.map((gate, gateIdx) => {
                        if (gate.qubit !== qubitIdx && gate.control !== qubitIdx) {
                          return null
                        }

                        const isHighlighted = currentStep === gateIdx
                        const isPast = currentStep > gateIdx

                        if (gate.type === 'CNOT') {
                          if (gate.control === qubitIdx) {
                            return (
                              <motion.div
                                key={gateIdx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`
                                  relative z-10 mx-2
                                  ${isHighlighted ? 'ring-2 ring-quantum-400 rounded-full' : ''}
                                  ${isPast ? 'opacity-50' : ''}
                                `}
                                style={{ marginLeft: gateIdx * 56 }}
                              >
                                <div className="w-5 h-5 rounded-full bg-cyan-500" />
                              </motion.div>
                            )
                          } else {
                            return (
                              <motion.div
                                key={gateIdx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`
                                  relative z-10 mx-2 cursor-pointer group
                                  ${isHighlighted ? 'ring-2 ring-quantum-400 rounded-full' : ''}
                                  ${isPast ? 'opacity-50' : ''}
                                `}
                                style={{ marginLeft: gateIdx * 56 }}
                                onClick={() => removeGate(gateIdx)}
                              >
                                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 flex items-center justify-center relative">
                                  <div className="w-full h-0.5 bg-cyan-500 absolute" />
                                  <div className="w-0.5 h-full bg-cyan-500 absolute" />
                                </div>
                              </motion.div>
                            )
                          }
                        }

                        return (
                          <motion.div
                            key={gateIdx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`
                              relative z-10 mx-2 cursor-pointer
                              ${isHighlighted ? 'ring-2 ring-quantum-400 rounded-lg' : ''}
                              ${isPast ? 'opacity-50' : ''}
                            `}
                            style={{ marginLeft: gateIdx * 56 }}
                            onClick={() => removeGate(gateIdx)}
                          >
                            <QuantumGate type={gate.type} size="sm" />
                          </motion.div>
                        )
                      })}

                      {/* 添加门按钮 */}
                      <button
                        onClick={() => addGate(qubitIdx)}
                        className="relative z-10 w-10 h-10 rounded-lg border-2 border-dashed border-dark-600 flex items-center justify-center text-dark-500 hover:border-quantum-500 hover:text-quantum-400 transition-colors ml-auto"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* 测量 */}
                    <div className="w-10 h-10 rounded-lg border border-dark-700 flex items-center justify-center bg-dark-800">
                      <svg className="w-5 h-5 text-dark-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 状态向量 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-dark-900 rounded-xl border border-dark-800 p-6"
            >
              <h2 className="text-lg font-semibold text-dark-100 mb-4">量子态</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: Math.pow(2, qubits) }).slice(0, 8).map((_, i) => {
                  const binary = i.toString(2).padStart(qubits, '0')
                  const amplitude = i === 0 ? 1 : 0 // 简化显示
                  return (
                    <div
                      key={i}
                      className="p-3 bg-dark-800 rounded-lg border border-dark-700"
                    >
                      <div className="text-dark-400 font-mono text-sm mb-1">
                        |{binary}⟩
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-quantum-500 transition-all duration-300"
                          style={{ width: `${amplitude * 100}%` }}
                        />
                      </div>
                      <div className="text-dark-500 text-xs mt-1">
                        {(amplitude * 100).toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* 代码导出 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-dark-900 rounded-xl border border-dark-800 p-6"
            >
              <h2 className="text-lg font-semibold text-dark-100 mb-4">MindQuantum 代码</h2>
              <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-dark-200">
{`from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, X, Y, Z, RZ, RY, CNOT

# 创建量子电路
circuit = Circuit()

# 添加量子门
${gates.map(gate => {
  if (gate.type === 'CNOT') {
    return `circuit += X.on(${gate.qubit}, ${gate.control})  # CNOT门`
  }
  return `circuit += ${gate.type}.on(${gate.qubit})`
}).join('\n')}

print(circuit)`}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
