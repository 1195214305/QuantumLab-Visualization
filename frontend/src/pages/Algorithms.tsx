import { useState } from 'react'
import { motion } from 'framer-motion'
import { quantumAlgorithms } from '../data/quantum'
import { ChevronRight, BookOpen, Code, Lightbulb } from 'lucide-react'

type AlgorithmType = keyof typeof quantumAlgorithms

export default function Algorithms() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('iqp')
  const algorithm = quantumAlgorithms[selectedAlgorithm]

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
            量子算法
          </h1>
          <p className="text-dark-400 max-w-2xl">
            探索量子计算的核心算法，了解它们的原理和应用场景。
          </p>
        </motion.div>

        {/* 算法选择卡片 */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {(Object.keys(quantumAlgorithms) as AlgorithmType[]).map((key) => {
            const algo = quantumAlgorithms[key]
            const isSelected = selectedAlgorithm === key
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedAlgorithm(key)}
                className={`
                  p-6 rounded-xl border text-left transition-all
                  ${isSelected
                    ? 'bg-quantum-500/10 border-quantum-500/50'
                    : 'bg-dark-900 border-dark-800 hover:border-dark-700'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-mono font-bold
                  ${key === 'iqp' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                  ${key === 'vqe' ? 'bg-cyan-500/20 text-cyan-400' : ''}
                  ${key === 'qpe' ? 'bg-violet-500/20 text-violet-400' : ''}
                `}>
                  {algo.name.charAt(0)}
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-quantum-400' : 'text-dark-100'}`}>
                  {algo.name}
                </h3>
                <p className="text-dark-500 text-sm">{algo.fullName}</p>
              </motion.button>
            )
          })}
        </div>

        {/* 算法详情 */}
        <motion.div
          key={selectedAlgorithm}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* 左侧：描述和步骤 */}
          <div className="space-y-6">
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-quantum-400" />
                <h2 className="text-lg font-semibold text-dark-100">算法简介</h2>
              </div>
              <p className="text-dark-300 leading-relaxed">
                {algorithm.description}
              </p>
            </div>

            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <ChevronRight className="w-5 h-5 text-quantum-400" />
                <h2 className="text-lg font-semibold text-dark-100">算法步骤</h2>
              </div>
              <ol className="space-y-3">
                {algorithm.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-quantum-500/20 text-quantum-400 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-dark-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-quantum-400" />
                <h2 className="text-lg font-semibold text-dark-100">应用场景</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {algorithm.applications.map((app, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-dark-800 text-dark-300 rounded-lg text-sm"
                  >
                    {app}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-dark-700">
                <span className="text-dark-500 text-sm">复杂度: </span>
                <span className="text-dark-300 text-sm font-mono">{algorithm.complexity}</span>
              </div>
            </div>
          </div>

          {/* 右侧：代码示例 */}
          <div className="space-y-6">
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-5 h-5 text-quantum-400" />
                <h2 className="text-lg font-semibold text-dark-100">MindQuantum 实现</h2>
              </div>
              <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-dark-200">
{selectedAlgorithm === 'iqp' ? `from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, RZ, X

def create_iqp_circuit(n_qubits, features):
    """创建IQP编码电路"""
    circuit = Circuit()

    # 第一层：Hadamard门
    for i in range(n_qubits):
        circuit += H.on(i)

    # 第二层：RZ门编码单比特特征
    for i in range(n_qubits):
        circuit += RZ(features[i]).on(i)

    # 第三层：CNOT + RZ编码双比特特征
    idx = n_qubits
    for i in range(n_qubits - 1):
        circuit += X.on(i + 1, i)  # CNOT
        circuit += RZ(features[idx]).on(i + 1)
        idx += 1

    return circuit

# 使用示例
n_qubits = 4
features = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
circuit = create_iqp_circuit(n_qubits, features)
print(circuit)` : selectedAlgorithm === 'vqe' ? `from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import RY, RZ, X
from mindquantum.core.operators import QubitOperator
from mindquantum.algorithm.nisq import generate_uccsd

def create_hardware_efficient_ansatz(n_qubits, n_layers):
    """创建Hardware Efficient Ansatz"""
    circuit = Circuit()
    param_idx = 0

    for layer in range(n_layers):
        # RY + RZ 旋转层
        for i in range(n_qubits):
            circuit += RY(f'theta_{param_idx}').on(i)
            param_idx += 1
            circuit += RZ(f'phi_{param_idx}').on(i)
            param_idx += 1

        # CNOT 纠缠层
        for i in range(n_qubits - 1):
            circuit += X.on(i + 1, i)

    return circuit

# H2分子哈密顿量（简化）
hamiltonian = QubitOperator('Z0') + QubitOperator('Z1')

# 创建Ansatz
ansatz = create_hardware_efficient_ansatz(4, 2)
print(ansatz)` : `from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, X, SWAP, PhaseShift
import numpy as np

def create_qft_circuit(n_qubits):
    """创建量子傅里叶变换电路"""
    circuit = Circuit()

    for i in range(n_qubits):
        circuit += H.on(i)
        for j in range(i + 1, n_qubits):
            angle = np.pi / (2 ** (j - i))
            circuit += PhaseShift(angle).on(j, i)

    # SWAP门反转比特顺序
    for i in range(n_qubits // 2):
        circuit += SWAP.on([i, n_qubits - 1 - i])

    return circuit

def create_qpe_circuit(n_auxiliary, unitary_gate):
    """创建量子相位估计电路"""
    circuit = Circuit()

    # 辅助比特Hadamard
    for i in range(n_auxiliary):
        circuit += H.on(i)

    # 受控酉操作
    for i in range(n_auxiliary):
        power = 2 ** (n_auxiliary - 1 - i)
        for _ in range(power):
            circuit += unitary_gate.on(n_auxiliary, i)

    # 逆QFT
    circuit += create_qft_circuit(n_auxiliary).hermitian()

    return circuit

# 使用示例
qpe = create_qpe_circuit(3, PhaseShift(np.pi/4))
print(qpe)`}
                </pre>
              </div>
            </div>

            {/* 算法可视化提示 */}
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
              <h2 className="text-lg font-semibold text-dark-100 mb-4">交互式演示</h2>
              <p className="text-dark-400 mb-4">
                想要亲手体验这个算法？前往实验室页面进行交互式操作。
              </p>
              <a
                href="/lab"
                className="inline-flex items-center gap-2 px-4 py-2 bg-quantum-500/20 text-quantum-400 rounded-lg border border-quantum-500/50 hover:bg-quantum-500/30 transition-colors"
              >
                进入实验室
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
