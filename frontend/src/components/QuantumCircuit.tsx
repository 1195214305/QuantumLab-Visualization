import { motion } from 'framer-motion'
import QuantumGate from './QuantumGate'

interface CircuitGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'RZ' | 'RY' | 'CNOT' | 'S' | 'T'
  qubit: number
  control?: number
  parameter?: string
}

interface QuantumCircuitProps {
  qubits: number
  gates: CircuitGate[]
  title?: string
  onGateClick?: (gate: CircuitGate, index: number) => void
  highlightStep?: number
}

export default function QuantumCircuit({
  qubits,
  gates,
  title,
  onGateClick,
  highlightStep
}: QuantumCircuitProps) {
  // 按时间步骤组织门
  const steps: CircuitGate[][] = []
  gates.forEach((gate, idx) => {
    const stepIdx = Math.floor(idx / qubits)
    if (!steps[stepIdx]) steps[stepIdx] = []
    steps[stepIdx].push(gate)
  })

  return (
    <div className="bg-dark-900 rounded-xl border border-dark-800 p-4 sm:p-6 overflow-x-auto">
      {title && (
        <h3 className="text-lg font-semibold text-dark-100 mb-4">{title}</h3>
      )}

      <div className="min-w-max">
        {/* 量子比特线 */}
        {Array.from({ length: qubits }).map((_, qubitIdx) => (
          <div key={qubitIdx} className="flex items-center gap-2 mb-4 last:mb-0">
            {/* 量子比特标签 */}
            <div className="w-12 sm:w-16 flex-shrink-0">
              <span className="text-dark-400 font-mono text-sm">
                q[{qubitIdx}]
              </span>
            </div>

            {/* 初始态 */}
            <div className="w-8 h-8 rounded border border-dark-700 flex items-center justify-center text-dark-400 font-mono text-sm">
              |0⟩
            </div>

            {/* 量子线和门 */}
            <div className="flex items-center relative">
              {/* 背景线 */}
              <div className="absolute left-0 right-0 h-0.5 bg-dark-700" />

              {/* 门 */}
              {gates.map((gate, gateIdx) => {
                if (gate.qubit !== qubitIdx && gate.control !== qubitIdx) {
                  return (
                    <div key={gateIdx} className="w-14 sm:w-16 flex-shrink-0" />
                  )
                }

                const isHighlighted = highlightStep === gateIdx

                if (gate.type === 'CNOT') {
                  if (gate.control === qubitIdx) {
                    // 控制点
                    return (
                      <motion.div
                        key={gateIdx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: gateIdx * 0.1 }}
                        className={`
                          w-14 sm:w-16 flex-shrink-0 flex justify-center relative z-10
                          ${isHighlighted ? 'ring-2 ring-quantum-400 rounded-full' : ''}
                        `}
                      >
                        <div className="w-4 h-4 rounded-full bg-cyan-500" />
                      </motion.div>
                    )
                  } else {
                    // 目标点
                    return (
                      <motion.div
                        key={gateIdx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: gateIdx * 0.1 }}
                        className={`
                          w-14 sm:w-16 flex-shrink-0 flex justify-center relative z-10
                          ${isHighlighted ? 'ring-2 ring-quantum-400 rounded-lg' : ''}
                        `}
                        onClick={() => onGateClick?.(gate, gateIdx)}
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-cyan-500" />
                          <div className="absolute w-0.5 h-full bg-cyan-500" />
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
                    transition={{ delay: gateIdx * 0.1 }}
                    className={`
                      w-14 sm:w-16 flex-shrink-0 flex justify-center relative z-10
                      ${isHighlighted ? 'ring-2 ring-quantum-400 rounded-lg' : ''}
                    `}
                    onClick={() => onGateClick?.(gate, gateIdx)}
                  >
                    <QuantumGate
                      type={gate.type}
                      size="sm"
                      parameter={gate.parameter}
                    />
                  </motion.div>
                )
              })}
            </div>

            {/* 测量 */}
            <div className="w-10 h-8 rounded border border-dark-700 flex items-center justify-center ml-2">
              <svg className="w-5 h-5 text-dark-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        ))}

        {/* CNOT连接线 */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {gates.map((gate, idx) => {
            if (gate.type === 'CNOT' && gate.control !== undefined) {
              const y1 = gate.control * 48 + 24
              const y2 = gate.qubit * 48 + 24
              const x = 80 + idx * 64 + 32
              return (
                <line
                  key={idx}
                  x1={x}
                  y1={y1}
                  x2={x}
                  y2={y2}
                  stroke="#06b6d4"
                  strokeWidth="2"
                />
              )
            }
            return null
          })}
        </svg>
      </div>
    </div>
  )
}
