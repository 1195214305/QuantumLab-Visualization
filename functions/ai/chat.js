// 量子计算AI助教边缘函数
// 部署在阿里云ESA边缘节点，提供低延迟的AI问答服务

const QWEN_API_KEY = 'sk-54ae495d0e8e4dfb92607467bfcdf357'
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'

// 量子计算知识库
const QUANTUM_KNOWLEDGE = {
  concepts: {
    '量子比特': '量子比特（qubit）是量子计算的基本信息单元，与经典比特不同，它可以同时处于|0⟩和|1⟩的叠加态。',
    '叠加态': '叠加态是量子力学的核心概念，一个量子系统可以同时处于多个状态的线性组合中。',
    '量子纠缠': '量子纠缠是两个或多个量子比特之间的特殊关联，测量其中一个会立即影响另一个的状态。',
    '量子门': '量子门是对量子比特进行操作的基本单元，类似于经典计算中的逻辑门。',
    '布洛赫球': '布洛赫球是单量子比特状态的几何表示，球面上的每个点对应一个纯态。',
  },
  gates: {
    'H门': 'Hadamard门，将|0⟩变换为(|0⟩+|1⟩)/√2，创建等概率叠加态。',
    'X门': 'Pauli-X门，量子NOT门，将|0⟩变为|1⟩，|1⟩变为|0⟩。',
    'Y门': 'Pauli-Y门，绕布洛赫球Y轴旋转π角度。',
    'Z门': 'Pauli-Z门，相位翻转门，给|1⟩态添加π相位。',
    'CNOT门': '受控NOT门，双比特门，当控制比特为|1⟩时翻转目标比特。',
    'RZ门': '绕Z轴旋转门，参数化门，旋转角度可调。',
    'RY门': '绕Y轴旋转门，参数化门，常用于变分电路。',
  },
  algorithms: {
    'IQP': 'Instantaneous Quantum Polynomial编码，用于量子机器学习的特征编码方法。',
    'VQE': '变分量子本征求解器，混合量子-经典算法，用于求解分子基态能量。',
    'QPE': '量子相位估计，用于估计酉算符本征值的相位，是Shor算法的核心。',
    'QFT': '量子傅里叶变换，经典FFT的量子版本，是多个量子算法的基础。',
  }
}

// 系统提示词
const SYSTEM_PROMPT = `你是QuantumLab的AI助教，专门帮助用户学习量子计算知识。

你的职责：
1. 解答量子计算相关问题（量子门、量子电路、量子算法等）
2. 提供MindQuantum代码示例
3. 解释量子力学基础概念
4. 指导用户完成MindQuantum作业

回答要求：
- 使用简体中文回答
- 回答要准确、专业但易于理解
- 适当使用数学公式（用LaTeX格式）
- 提供代码示例时使用MindQuantum框架
- 保持友好和鼓励的语气

知识背景：
${JSON.stringify(QUANTUM_KNOWLEDGE, null, 2)}`

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
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: '请提供有效的消息' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 构建消息历史
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ]

    // 调用通义千问API
    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API调用失败:', errorText)
      return new Response(JSON.stringify({
        error: 'AI服务暂时不可用',
        response: generateFallbackResponse(message)
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || generateFallbackResponse(message)

    return new Response(JSON.stringify({
      response: aiResponse,
      usage: data.usage,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('处理请求时出错:', error)
    return new Response(JSON.stringify({
      error: '服务器内部错误',
      response: '抱歉，AI服务暂时不可用。请稍后再试，或查看我们的文档获取帮助。'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

// 备用响应生成
function generateFallbackResponse(question) {
  const q = question.toLowerCase()

  // 检查是否匹配知识库
  for (const [key, value] of Object.entries(QUANTUM_KNOWLEDGE.concepts)) {
    if (q.includes(key.toLowerCase())) {
      return `**${key}**\n\n${value}\n\n如需了解更多，请查看我们的量子门和量子电路页面。`
    }
  }

  for (const [key, value] of Object.entries(QUANTUM_KNOWLEDGE.gates)) {
    if (q.includes(key.toLowerCase()) || q.includes(key.replace('门', '').toLowerCase())) {
      return `**${key}**\n\n${value}\n\n你可以在"量子门"页面查看详细的矩阵表示和布洛赫球效果。`
    }
  }

  for (const [key, value] of Object.entries(QUANTUM_KNOWLEDGE.algorithms)) {
    if (q.includes(key.toLowerCase())) {
      return `**${key}算法**\n\n${value}\n\n在"作业"页面有详细的交互式教程。`
    }
  }

  // 默认响应
  return `感谢你的问题！

作为量子计算AI助教，我可以帮助你了解：
- **量子计算基础**：量子比特、叠加态、纠缠
- **量子门操作**：H门、X门、CNOT门等
- **量子算法**：IQP、VQE、QPE
- **MindQuantum编程**：代码示例和最佳实践

请尝试更具体的问题，例如：
- "什么是量子叠加态？"
- "如何用MindQuantum创建Bell态？"
- "VQE算法的原理是什么？"`
}
