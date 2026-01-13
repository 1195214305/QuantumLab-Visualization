import { useState } from 'react'
import { motion } from 'framer-motion'
import { quantumGates } from '../data/quantum'
import QuantumGate from '../components/QuantumGate'
import BlochSphere from '../components/BlochSphere'

type GateType = keyof typeof quantumGates

export default function Gates() {
  const [selectedGate, setSelectedGate] = useState<GateType>('H')
  const gate = quantumGates[selectedGate]

  // 根据门类型计算布洛赫球参数
  const getBlochParams = (gateType: GateType) => {
    switch (gateType) {
      case 'H':
        return { theta: Math.PI / 2, phi: 0 }
      case 'X':
        return { theta: Math.PI, phi: 0 }
      case 'Y':
        return { theta: Math.PI, phi: Math.PI / 2 }
      case 'Z':
        return { theta: 0, phi: Math.PI }
      case 'S':
        return { theta: Math.PI / 4, phi: Math.PI / 2 }
      case 'T':
        return { theta: Math.PI / 8, phi: Math.PI / 4 }
      default:
        return { theta: Math.PI / 4, phi: Math.PI / 4 }
    }
  }

  const blochParams = getBlochParams(selectedGate)

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
            量子门
          </h1>
          <p className="text-dark-400 max-w-2xl">
            量子门是量子计算的基本操作单元，类似于经典计算中的逻辑门。
            点击下方的量子门查看其详细信息和作用效果。
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：门选择 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
              <h2 className="text-lg font-semibold text-dark-100 mb-4">
                选择量子门
              </h2>

              {/* 单比特门 */}
              <div className="mb-6">
                <h3 className="text-sm text-dark-500 mb-3">单比特门</h3>
                <div className="grid grid-cols-4 gap-3">
                  {(['H', 'X', 'Y', 'Z', 'S', 'T', 'RZ', 'RY'] as GateType[]).map(type => (
                    <QuantumGate
                      key={type}
                      type={type}
                      size="md"
                      active={selectedGate === type}
                      onClick={() => setSelectedGate(type)}
                    />
                  ))}
                </div>
              </div>

              {/* 双比特门 */}
              <div>
                <h3 className="text-sm text-dark-500 mb-3">双比特门</h3>
                <div className="grid grid-cols-4 gap-3">
                  <QuantumGate
                    type="CNOT"
                    size="md"
                    active={selectedGate === 'CNOT'}
                    onClick={() => setSelectedGate('CNOT')}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：门详情 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-dark-50 mb-1">
                    {gate.name}
                  </h2>
                  <p className="text-dark-400">{gate.description}</p>
                </div>
                <QuantumGate type={selectedGate} size="lg" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 矩阵表示 */}
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-3">
                    矩阵表示
                  </h3>
                  <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-dark-500 text-2xl">[</span>
                      <div className="flex-1">
                        {gate.matrix.map((row, i) => (
                          <div key={i} className="flex justify-around py-1">
                            {row.map((cell, j) => (
                              <span key={j} className="text-quantum-400 min-w-[60px] text-center">
                                {cell}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                      <span className="text-dark-500 text-2xl">]</span>
                    </div>
                  </div>
                </div>

                {/* 作用效果 */}
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-3">
                    作用效果
                  </h3>
                  <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-dark-200 whitespace-pre-wrap">
                      {gate.effect}
                    </pre>
                  </div>
                </div>

                {/* 布洛赫球效果 */}
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-3">
                    布洛赫球效果
                  </h3>
                  <p className="text-dark-400 text-sm mb-4">{gate.blochEffect}</p>
                  <div className="flex justify-center">
                    <BlochSphere
                      size={180}
                      theta={blochParams.theta}
                      phi={blochParams.phi}
                      showAxes
                    />
                  </div>
                </div>

                {/* 代码示例 */}
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-3">
                    MindQuantum 代码
                  </h3>
                  <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-dark-200">
{selectedGate === 'CNOT' ? `from mindquantum.core.gates import X
from mindquantum.core.circuit import Circuit

# 创建CNOT门
circuit = Circuit()
circuit += X.on(1, 0)  # 控制比特0，目标比特1` : `from mindquantum.core.gates import ${selectedGate}
from mindquantum.core.circuit import Circuit

# 创建${gate.name}
circuit = Circuit()
circuit += ${selectedGate}${selectedGate === 'RZ' || selectedGate === 'RY' ? '(theta)' : ''}.on(0)`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 量子门对比表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-dark-900 rounded-xl border border-dark-800 p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-dark-100 mb-4">
              量子门对比
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">门</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">名称</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">布洛赫球效果</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">参数化</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(quantumGates) as GateType[]).map(type => (
                  <tr
                    key={type}
                    className="border-b border-dark-800 hover:bg-dark-800/50 cursor-pointer"
                    onClick={() => setSelectedGate(type)}
                  >
                    <td className="py-3 px-4">
                      <QuantumGate type={type} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-dark-200">
                      {quantumGates[type].name}
                    </td>
                    <td className="py-3 px-4 text-dark-400">
                      {quantumGates[type].blochEffect}
                    </td>
                    <td className="py-3 px-4">
                      {type === 'RZ' || type === 'RY' ? (
                        <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded text-xs">
                          是
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-dark-700 text-dark-400 rounded text-xs">
                          否
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
