import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface BlochSphereProps {
  theta?: number  // 0 to π
  phi?: number    // 0 to 2π
  size?: number
  showAxes?: boolean
  animate?: boolean
}

export default function BlochSphere({
  theta = Math.PI / 4,
  phi = Math.PI / 4,
  size = 200,
  showAxes = true,
  animate = false
}: BlochSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.35

    const draw = () => {
      ctx.clearRect(0, 0, size, size)

      // 绘制球体轮廓
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // 绘制经线
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI
        ctx.beginPath()
        ctx.ellipse(
          centerX,
          centerY,
          radius * Math.cos(angle + rotation),
          radius,
          0,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)'
        ctx.stroke()
      }

      // 绘制纬线
      for (let i = 1; i < 4; i++) {
        const y = centerY - radius + (i / 4) * radius * 2
        const r = Math.sqrt(radius * radius - Math.pow(y - centerY, 2))
        ctx.beginPath()
        ctx.ellipse(centerX, y, r, r * 0.3, 0, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)'
        ctx.stroke()
      }

      if (showAxes) {
        // Z轴
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - radius - 10)
        ctx.lineTo(centerX, centerY + radius + 10)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // |0⟩ 标签
        ctx.fillStyle = '#38bdf8'
        ctx.font = '12px JetBrains Mono'
        ctx.fillText('|0⟩', centerX + 5, centerY - radius - 12)

        // |1⟩ 标签
        ctx.fillText('|1⟩', centerX + 5, centerY + radius + 18)

        // X轴
        ctx.beginPath()
        ctx.moveTo(centerX - radius - 10, centerY)
        ctx.lineTo(centerX + radius + 10, centerY)
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.5)'
        ctx.stroke()

        // Y轴 (透视效果)
        ctx.beginPath()
        ctx.moveTo(centerX - radius * 0.5, centerY + radius * 0.3)
        ctx.lineTo(centerX + radius * 0.5, centerY - radius * 0.3)
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)'
        ctx.stroke()
      }

      // 计算量子态向量位置
      const x = Math.sin(theta) * Math.cos(phi + rotation)
      const y = Math.sin(theta) * Math.sin(phi + rotation)
      const z = Math.cos(theta)

      // 投影到2D
      const projX = centerX + radius * (x * 0.866 + y * 0.5)
      const projY = centerY - radius * z + radius * y * 0.2

      // 绘制量子态向量
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(projX, projY)
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.stroke()

      // 绘制量子态点
      ctx.beginPath()
      ctx.arc(projX, projY, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#22c55e'
      ctx.fill()

      // 发光效果
      const gradient = ctx.createRadialGradient(projX, projY, 0, projX, projY, 15)
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)')
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)')
      ctx.beginPath()
      ctx.arc(projX, projY, 15, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    draw()

    if (animate) {
      const interval = setInterval(() => {
        setRotation(r => r + 0.02)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [theta, phi, size, showAxes, animate, rotation])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-lg"
      />
    </motion.div>
  )
}
