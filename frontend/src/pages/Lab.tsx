import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Download, Share2, Zap, Target, Layers } from 'lucide-react'
import QuantumGate from '../components/QuantumGate'
import BlochSphere from '../components/BlochSphere'

type GateType = 'H' | 'X' | 'Y' | 'Z' | 'RZ' | 'RY' | 'CNOT' | 'S' | 'T'

interface CircuitGate {
  id: string
  type: GateType
  qubit: number
  control?: number
  parameter?: number
  column: number
}

interface SimulationResult {
  statevector: { state: string; amplitude: number; phase: number }[]
  probabilities: { state: string; probability: number }[]
  blochAngles: { theta: number; phi: number }[]
}

const availableGates: { type: GateType; label: string; category: string }[] = [
  { type: 'H', label: 'Hadamard', category: '基础门' },
  { type: 'X', label: 'Pauli-X', category: '基础门' },
  { type: 'Y', label: 'Pauli-Y', category: '基础门' },
  { type: 'Z', label: 'Pauli-Z', category: '基础门' },
  { type: 'S', label: 'S门', category: '相位门' },
  { type: 'T', label: 'T门', category: '相位门' },
  { type: 'RZ', label: 'RZ旋转', category: '参数门' },
  { type: 'RY', label: 'RY旋转', category: '参数门' },
  { type: 'CNOT', label: 'CNOT', category: '双比特门' },
]

// 简化的量子模拟器
function simulateCircuit(gates: CircuitGate[], numQubits: number): SimulationResult {
  // 初始化状态向量 |00...0⟩
  const dim = Math.pow(2, numQubits)
  const stateReal = new Array(dim).fill(0)
  const stateImag = new Array(dim).fill(0)
  stateReal[0] = 1

  // 应用每个门
  const sortedGates = [...gates].sort((a, b) => a.column - b.column)

  for (const gate of sortedGates) {
    applyGate(stateReal, stateImag, gate, numQubits)
  }

  // 计算概率和相位
  const statevector: SimulationResult['statevector'] = []
  const probabilities: SimulationResult['probabilities'] = []

  for (let i = 0; i < dim; i++) {
    const amplitude = Math.sqrt(stateReal[i] ** 2 + stateImag[i] ** 2)
    const phase = Math.atan2(stateImag[i], stateReal[i])
    const probability = amplitude ** 2
    const state = i.toString(2).padStart(numQubits, '0')

    statevector.push({ state, amplitude, phase })
    probabilities.push({ state, probability })
  }

  // 计算布洛赫球角度（仅对单比特有意义）
  const blochAngles: { theta: number; phi: number }[] = []
  for (let q = 0; q < numQubits; q++) {
    // 简化计算：基于第一个比特的状态
    const theta = Math.acos(Math.abs(stateReal[0]))
    const phi = Math.atan2(stateImag[1] || 0, stateReal[1] || 0)
    blochAngles.push({ theta: theta * 2, phi })
  }

  return { statevector, probabilities, blochAngles }
}

function applyGate(stateReal: number[], stateImag: number[], gate: CircuitGate, numQubits: number) {
  const dim = stateReal.length
  const qubit = gate.qubit
  const mask = 1 << (numQubits - 1 - qubit)

  switch (gate.type) {
    case 'H': {
      const sqrt2 = 1 / Math.sqrt(2)
      for (let i = 0; i < dim; i++) {
        if ((i & mask) === 0) {
          const j = i | mask
          const aReal = stateReal[i], aImag = stateImag[i]
          const bReal = stateReal[j], bImag = stateImag[j]
          stateReal[i] = sqrt2 * (aReal + bReal)
          stateImag[i] = sqrt2 * (aImag + bImag)
          stateReal[j] = sqrt2 * (aReal - bReal)
          stateImag[j] = sqrt2 * (aImag - bImag)
        }
      }
      break
    }
    case 'X': {
      for (let i = 0; i < dim; i++) {
        if ((i & mask) === 0) {
          const j = i | mask
          ;[stateReal[i], stateReal[j]] = [stateReal[j], stateReal[i]]
          ;[stateImag[i], stateImag[j]] = [stateImag[j], stateImag[i]]
        }
      }
      break
    }
    case 'Y': {
      for (let i = 0; i < dim; i++) {
        if ((i & mask) === 0) {
          const j = i | mask
          const aReal = stateReal[i], aImag = stateImag[i]
          const bReal = stateReal[j], bImag = stateImag[j]
          stateReal[i] = bImag
          stateImag[i] = -bReal
          stateReal[j] = -aImag
          stateImag[j] = aReal
        }
      }
      break
    }
    case 'Z': {
      for (let i = 0; i < dim; i++) {
        if ((i & mask) !== 0) {
          stateReal[i] = -stateReal[i]
          stateImag[i] = -stateImag[i]
        }
      }
      break
    }
    case 'S': {
      for (let i = 0; i < dim; i++) {
        if ((i & mask) !== 0) {
          const temp = stateReal[i]
          stateReal[i] = -stateImag[i]
          stateImag[i] = temp
        }
      }
      break
    }
    case 'T': {
      const cos = Math.cos(Math.PI / 4)
      const sin = Math.sin(Math.PI / 4)
      for (let i = 0; i < dim; i++) {
        if ((i & mask) !== 0) {
          const real = stateReal[i], imag = stateImag[i]
          stateReal[i] = cos * real - sin * imag
          stateImag[i] = sin * real + cos * imag
        }
      }
      break
    }
    case 'RZ': {
      const angle = gate.parameter || Math.PI / 4
      const cos = Math.cos(angle / 2)
      const sin = Math.sin(angle / 2)
      for (let i = 0; i < dim; i++) {
        const real = stateReal[i], imag = stateImag[i]
        if ((i & mask) === 0) {
          stateReal[i] = cos * real + sin * imag
          stateImag[i] = cos * imag - sin * real
        } else {
          stateReal[i] = cos * real - sin * imag
          stateImag[i] = cos * imag + sin * real
        }
      }
      break
    }
    case 'RY': {
      const angle = gate.parameter || Math.PI / 4
      const cos = Math.cos(angle / 2)
      const sin = Math.sin(angle / 2)
      for (let i = 0; i < dim; i++) {
        if ((i & mask) === 0) {
          const j = i | mask
          const aReal = stateReal[i], aImag = stateImag[i]
          const bReal = stateReal[j], bImag = stateImag[j]
          stateReal[i] = cos * aReal - sin * bReal
          stateImag[i] = cos * aImag - sin * bImag
          stateReal[j] = sin * aReal + cos * bReal
          stateImag[j] = sin * aImag + cos * bImag
        }
      }
      break
    }
    case 'CNOT': {
      if (gate.control !== undefined) {
        const controlMask = 1 << (numQubits - 1 - gate.control)
        for (let i = 0; i < dim; i++) {
          if ((i & controlMask) !== 0 && (i & mask) === 0) {
            const j = i | mask
            ;[stateReal[i], stateReal[j]] = [stateReal[j], stateReal[i]]
            ;[stateImag[i], stateImag[j]] = [stateImag[j], stateImag[i]]
          }
        }
      }
      break
    }
  }
}

export default function Lab() {
  const [numQubits, setNumQubits] = useState(3)
  const [gates, setGates] = useState<CircuitGate[]>([])
  const [selectedGate, setSelectedGate] = useState<GateType>('H')
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [parameterValue, setParameterValue] = useState(Math.PI / 4)

  const addGate = useCallback((qubit: number, column: number) => {
    const newGate: CircuitGate = {
      id: `gate-${Date.now()}-${Math.random()}`,
      type: selectedGate,
      qubit,
      column,
      parameter: (selectedGate === 'RZ' || selectedGate === 'RY') ? parameterValue : undefined,
      control: selectedGate === 'CNOT' ? (qubit > 0 ? qubit - 1 : qubit + 1) : undefined,
    }
    setGates(prev => [...prev, newGate])
  }, [selectedGate, parameterValue])

  const removeGate = useCallback((id: string) => {
    setGates(prev => prev.filter(g => g.id !== id))
  }, [])

  const runSimulation = useCallback(() => {
    setIsSimulating(true)
    setTimeout(() => {
      const simResult = simulateCircuit(gates, numQubits)
      setResult(simResult)
      setIsSimulating(false)
    }, 500)
  }, [gates, numQubits])

  const resetCircuit = useCallback(() => {
    setGates([])
    setResult(null)
  }, [])

  const exportCode = useCallback(() => {
    const code = generateMindQuantumCode(gates, numQubits)
    navigator.clipboard.writeText(code)
    alert('代码已复制到剪贴板')
  }, [gates, numQubits])

  const maxColumn = Math.max(0, ...gates.map(g => g.column)) + 1

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-quantum-500 to-emerald-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-50">
              量子实验室
            </h1>
          </div>
          <p className="text-dark-400 text-sm sm:text-base">
            构建量子电路，运行模拟，探索量子计算的奥秘
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-4 lg:gap-6">
          {/* 左侧工具栏 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* 量子门选择 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-4">
              <h3 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                量子门
              </h3>

              {['基础门', '相位门', '参数门', '双比特门'].map(category => (
                <div key={category} className="mb-3 last:mb-0">
                  <p className="text-xs text-dark-500 mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {availableGates
                      .filter(g => g.category === category)
                      .map(g => (
                        <QuantumGate
                          key={g.type}
                          type={g.type}
                          size="sm"
                          active={selectedGate === g.type}
                          onClick={() => setSelectedGate(g.type)}
                        />
                      ))}
                  </div>
                </div>
              ))}

              {/* 参数调节 */}
              {(selectedGate === 'RZ' || selectedGate === 'RY') && (
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <label className="text-xs text-dark-400 block mb-2">
                    旋转角度: {(parameterValue / Math.PI).toFixed(2)}π
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={Math.PI * 2}
                    step={0.1}
                    value={parameterValue}
                    onChange={e => setParameterValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 量子比特数 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-4">
              <h3 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                量子比特
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumQubits(Math.max(1, numQubits - 1))}
                  className="w-8 h-8 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-mono text-dark-100 w-8 text-center">{numQubits}</span>
                <button
                  onClick={() => setNumQubits(Math.min(5, numQubits + 1))}
                  className="w-8 h-8 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-4 space-y-2">
              <button
                onClick={runSimulation}
                disabled={isSimulating || gates.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-quantum-500/20 text-quantum-400 border border-quantum-500/50 hover:bg-quantum-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {isSimulating ? '模拟中...' : '运行模拟'}
              </button>
              <button
                onClick={resetCircuit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置电路
              </button>
              <div className="flex gap-2">
                <button
                  onClick={exportCode}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs bg-dark-800 text-dark-400 hover:bg-dark-700 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  导出
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs bg-dark-800 text-dark-400 hover:bg-dark-700 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  分享
                </button>
              </div>
            </div>
          </motion.div>

          {/* 右侧主区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* 电路画布 */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-4 sm:p-6 overflow-x-auto">
              <h3 className="text-sm font-medium text-dark-300 mb-4">量子电路</h3>

              <div className="min-w-max">
                {Array.from({ length: numQubits }).map((_, qubitIdx) => (
                  <div key={qubitIdx} className="flex items-center gap-2 mb-4 last:mb-0">
                    {/* 量子比特标签 */}
                    <div className="w-14 flex-shrink-0 flex items-center gap-1">
                      <span className="text-dark-400 font-mono text-xs">q[{qubitIdx}]</span>
                    </div>

                    {/* 初始态 */}
                    <div className="w-8 h-8 rounded border border-dark-700 flex items-center justify-center text-dark-400 font-mono text-xs bg-dark-800/50">
                      |0⟩
                    </div>

                    {/* 量子线和门 */}
                    <div className="flex items-center relative flex-1 min-w-[300px]">
                      <div className="absolute left-0 right-0 h-px bg-dark-600" />

                      {/* 列位置 */}
                      {Array.from({ length: maxColumn + 3 }).map((_, colIdx) => {
                        const gateAtPosition = gates.find(
                          g => g.column === colIdx && (g.qubit === qubitIdx || g.control === qubitIdx)
                        )

                        return (
                          <div
                            key={colIdx}
                            className="relative z-10 mx-1"
                            style={{ minWidth: '40px' }}
                          >
                            {gateAtPosition ? (
                              gateAtPosition.type === 'CNOT' ? (
                                gateAtPosition.control === qubitIdx ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 rounded-full bg-cyan-500 mx-auto cursor-pointer"
                                    onClick={() => removeGate(gateAtPosition.id)}
                                  />
                                ) : (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-8 h-8 rounded-full border-2 border-cyan-500 flex items-center justify-center mx-auto cursor-pointer"
                                    onClick={() => removeGate(gateAtPosition.id)}
                                  >
                                    <div className="w-full h-0.5 bg-cyan-500 absolute" />
                                    <div className="w-0.5 h-full bg-cyan-500 absolute" />
                                  </motion.div>
                                )
                              ) : (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  onClick={() => removeGate(gateAtPosition.id)}
                                  className="cursor-pointer"
                                >
                                  <QuantumGate type={gateAtPosition.type} size="sm" />
                                </motion.div>
                              )
                            ) : (
                              <button
                                onClick={() => addGate(qubitIdx, colIdx)}
                                className="w-8 h-8 rounded border border-dashed border-dark-600 flex items-center justify-center text-dark-600 hover:border-quantum-500 hover:text-quantum-400 transition-colors mx-auto opacity-0 hover:opacity-100"
                              >
                                +
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* 测量 */}
                    <div className="w-8 h-8 rounded border border-dark-700 flex items-center justify-center bg-dark-800/50">
                      <svg className="w-4 h-4 text-dark-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 模拟结果 */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {/* 概率分布 */}
                  <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-dark-300 mb-4">测量概率分布</h3>
                    <div className="space-y-2">
                      {result.probabilities
                        .filter(p => p.probability > 0.001)
                        .sort((a, b) => b.probability - a.probability)
                        .slice(0, 8)
                        .map(({ state, probability }) => (
                          <div key={state} className="flex items-center gap-3">
                            <span className="font-mono text-xs text-dark-400 w-16">|{state}⟩</span>
                            <div className="flex-1 h-5 bg-dark-800 rounded overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${probability * 100}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-quantum-500 to-emerald-500"
                              />
                            </div>
                            <span className="font-mono text-xs text-dark-300 w-14 text-right">
                              {(probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 布洛赫球 */}
                  <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-dark-300 mb-4">量子态可视化</h3>
                    <div className="flex justify-center">
                      <BlochSphere
                        size={180}
                        theta={result.blochAngles[0]?.theta || 0}
                        phi={result.blochAngles[0]?.phi || 0}
                        showAxes
                      />
                    </div>
                    <p className="text-xs text-dark-500 text-center mt-3">
                      第一个量子比特的布洛赫球表示
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MindQuantum代码 */}
            {gates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-4 sm:p-6"
              >
                <h3 className="text-sm font-medium text-dark-300 mb-4">MindQuantum 代码</h3>
                <div className="bg-dark-800 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                  <pre className="text-dark-200">
                    {generateMindQuantumCode(gates, numQubits)}
                  </pre>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function generateMindQuantumCode(gates: CircuitGate[], numQubits: number): string {
  const sortedGates = [...gates].sort((a, b) => a.column - b.column)

  const gateImports = new Set<string>()
  sortedGates.forEach(g => {
    if (g.type === 'CNOT') {
      gateImports.add('X')
    } else {
      gateImports.add(g.type)
    }
  })

  const imports = `from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import ${Array.from(gateImports).join(', ')}
from mindquantum.simulator import Simulator`

  const gateCode = sortedGates.map(g => {
    if (g.type === 'CNOT') {
      return `circuit += X.on(${g.qubit}, ${g.control})  # CNOT门`
    } else if (g.type === 'RZ' || g.type === 'RY') {
      return `circuit += ${g.type}(${g.parameter?.toFixed(4) || 'theta'}).on(${g.qubit})`
    }
    return `circuit += ${g.type}.on(${g.qubit})`
  }).join('\n')

  return `${imports}

# 创建${numQubits}比特量子电路
circuit = Circuit()

# 添加量子门
${gateCode || '# 暂无量子门'}

# 打印电路
print(circuit)

# 创建模拟器并运行
sim = Simulator('mqvector', ${numQubits})
sim.apply_circuit(circuit)

# 获取量子态
state = sim.get_qs()
print("量子态:", state)`
}
