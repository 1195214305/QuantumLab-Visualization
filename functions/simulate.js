// 量子电路模拟边缘函数
// 在边缘节点执行量子电路模拟，减少延迟

export async function onRequest(context) {
  const { request } = context

  // 处理CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '仅支持POST请求' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { gates, numQubits } = await request.json()

    if (!Array.isArray(gates) || typeof numQubits !== 'number') {
      return new Response(JSON.stringify({ error: '无效的电路参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (numQubits > 10) {
      return new Response(JSON.stringify({ error: '量子比特数不能超过10' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 执行量子电路模拟
    const result = simulateCircuit(gates, numQubits)

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Edge-Location': context.request.cf?.colo || 'unknown',
      },
    })

  } catch (error) {
    console.error('模拟出错:', error)
    return new Response(JSON.stringify({ error: '模拟失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

// 量子电路模拟器
function simulateCircuit(gates, numQubits) {
  const dim = Math.pow(2, numQubits)
  const stateReal = new Array(dim).fill(0)
  const stateImag = new Array(dim).fill(0)
  stateReal[0] = 1

  // 按列排序门
  const sortedGates = [...gates].sort((a, b) => (a.column || 0) - (b.column || 0))

  // 应用每个门
  for (const gate of sortedGates) {
    applyGate(stateReal, stateImag, gate, numQubits)
  }

  // 计算结果
  const statevector = []
  const probabilities = []

  for (let i = 0; i < dim; i++) {
    const amplitude = Math.sqrt(stateReal[i] ** 2 + stateImag[i] ** 2)
    const phase = Math.atan2(stateImag[i], stateReal[i])
    const probability = amplitude ** 2
    const state = i.toString(2).padStart(numQubits, '0')

    statevector.push({
      state,
      real: stateReal[i],
      imag: stateImag[i],
      amplitude,
      phase
    })
    probabilities.push({ state, probability })
  }

  // 计算布洛赫球角度
  const blochAngles = []
  for (let q = 0; q < Math.min(numQubits, 3); q++) {
    const theta = Math.acos(Math.abs(stateReal[0])) * 2
    const phi = Math.atan2(stateImag[1] || 0, stateReal[1] || 0)
    blochAngles.push({ theta, phi })
  }

  return {
    statevector,
    probabilities,
    blochAngles,
    numQubits,
    gateCount: gates.length
  }
}

// 应用量子门
function applyGate(stateReal, stateImag, gate, numQubits) {
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
