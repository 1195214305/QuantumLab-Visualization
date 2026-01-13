import { motion } from 'framer-motion'

interface QuantumGateProps {
  type: 'H' | 'X' | 'Y' | 'Z' | 'RZ' | 'RY' | 'CNOT' | 'S' | 'T'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  active?: boolean
  parameter?: string
}

const gateColors: Record<string, string> = {
  H: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 hover:bg-indigo-500/30',
  X: 'bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30',
  Y: 'bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30',
  Z: 'bg-sky-500/20 text-sky-400 border-sky-500/50 hover:bg-sky-500/30',
  RZ: 'bg-violet-500/20 text-violet-400 border-violet-500/50 hover:bg-violet-500/30',
  RY: 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30',
  CNOT: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30',
  S: 'bg-pink-500/20 text-pink-400 border-pink-500/50 hover:bg-pink-500/30',
  T: 'bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30',
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
}

export default function QuantumGate({
  type,
  size = 'md',
  onClick,
  active,
  parameter
}: QuantumGateProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        rounded-lg border font-mono font-semibold
        transition-all duration-200 cursor-pointer select-none
        ${sizeClasses[size]}
        ${gateColors[type]}
        ${active ? 'ring-2 ring-quantum-400 ring-offset-2 ring-offset-dark-900' : ''}
      `}
    >
      <span>{type}</span>
      {parameter && (
        <span className="text-[10px] opacity-70">{parameter}</span>
      )}
    </motion.button>
  )
}
