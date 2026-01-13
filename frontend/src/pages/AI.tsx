import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, BookOpen, Code, Lightbulb, Trash2, Settings, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSettingsStore } from '../store/settings'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickQuestions = [
  { icon: BookOpen, text: '什么是量子叠加态？', category: '基础概念' },
  { icon: Code, text: '如何用MindQuantum创建Bell态？', category: '代码实现' },
  { icon: Lightbulb, text: 'VQE算法的原理是什么？', category: '算法原理' },
  { icon: Sparkles, text: '量子纠缠有什么应用？', category: '应用场景' },
]

const presetResponses: Record<string, string> = {
  '什么是量子叠加态？': `**量子叠加态**是量子力学中最基本的概念之一。

在经典计算中，一个比特只能处于0或1的状态。但在量子计算中，一个**量子比特（qubit）**可以同时处于0和1的叠加态：

\`|ψ⟩ = α|0⟩ + β|1⟩\`

其中α和β是复数振幅，满足 \`|α|² + |β|² = 1\`。

**关键特性：**
1. **概率性**：测量时，得到|0⟩的概率是|α|²，得到|1⟩的概率是|β|²
2. **相干性**：叠加态保持量子相干性，直到被测量
3. **Hadamard门**：可以用H门将|0⟩变换为等概率叠加态 \`(|0⟩+|1⟩)/√2\`

**MindQuantum示例：**
\`\`\`python
from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H

# 创建叠加态
circuit = Circuit()
circuit += H.on(0)  # 对第0个量子比特应用H门
\`\`\``,

  '如何用MindQuantum创建Bell态？': `**Bell态**是最简单的量子纠缠态，由两个量子比特组成。

最常见的Bell态是：\`|Φ+⟩ = (|00⟩ + |11⟩)/√2\`

**创建步骤：**
1. 对第一个量子比特应用Hadamard门
2. 对两个量子比特应用CNOT门

**MindQuantum代码：**
\`\`\`python
from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, X
from mindquantum.simulator import Simulator

# 创建Bell态电路
circuit = Circuit()
circuit += H.on(0)           # Hadamard门
circuit += X.on(1, 0)        # CNOT门（控制比特0，目标比特1）

# 模拟
sim = Simulator('mqvector', 2)
sim.apply_circuit(circuit)
state = sim.get_qs()
print("Bell态:", state)
# 输出: [0.707+0j, 0, 0, 0.707+0j]
\`\`\`

**四种Bell态：**
- |Φ+⟩ = (|00⟩ + |11⟩)/√2
- |Φ-⟩ = (|00⟩ - |11⟩)/√2
- |Ψ+⟩ = (|01⟩ + |10⟩)/√2
- |Ψ-⟩ = (|01⟩ - |10⟩)/√2`,

  'VQE算法的原理是什么？': `**VQE（变分量子本征求解器）**是一种混合量子-经典算法，用于求解分子基态能量。

**核心思想：**
利用变分原理：对于任意试探波函数|ψ(θ)⟩，其能量期望值总是大于等于基态能量。

\`E(θ) = ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀\`

**算法流程：**
1. **准备参数化量子电路（Ansatz）**
2. **在量子计算机上测量能量期望值**
3. **用经典优化器更新参数**
4. **重复直到收敛**

**MindQuantum实现：**
\`\`\`python
from mindquantum.algorithm.nisq import generate_uccsd
from mindquantum.core.operators import QubitOperator

# 定义哈密顿量（以H2分子为例）
hamiltonian = QubitOperator('Z0 Z1', 0.5) + \\
              QubitOperator('X0 X1', 0.2)

# 生成UCCSD ansatz
ansatz = generate_uccsd(n_qubits=4, n_electrons=2)

# 使用梯度下降优化参数
# ... 优化代码
\`\`\`

**应用场景：**
- 量子化学模拟
- 材料科学
- 药物分子设计`,

  '量子纠缠有什么应用？': `**量子纠缠**是量子力学中最神奇的现象之一，爱因斯坦称之为"幽灵般的超距作用"。

**主要应用领域：**

**1. 量子通信**
- **量子密钥分发（QKD）**：利用纠缠态实现绝对安全的密钥分发
- **量子隐形传态**：传输量子态而非经典信息

**2. 量子计算**
- **量子并行性**：纠缠使量子计算机能同时处理多个计算
- **量子纠错**：利用纠缠态保护量子信息

**3. 量子传感**
- **超精密测量**：突破经典测量的标准量子极限
- **量子雷达**：提高探测灵敏度

**4. 量子网络**
- **量子互联网**：连接量子计算机和量子传感器
- **分布式量子计算**：多个量子处理器协同工作

**MindQuantum创建纠缠态：**
\`\`\`python
from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, X

# GHZ态（多体纠缠）
circuit = Circuit()
circuit += H.on(0)
circuit += X.on(1, 0)
circuit += X.on(2, 1)
# 创建 (|000⟩ + |111⟩)/√2
\`\`\``
}

// 量子计算系统提示词
const SYSTEM_PROMPT = `你是QuantumLab的AI助教，专门帮助用户学习量子计算知识。

你的职责：
1. 解答量子计算相关问题（量子门、量子电路、量子算法等）
2. 提供MindQuantum代码示例
3. 解释量子力学基础概念
4. 指导用户完成MindQuantum作业

回答要求：
- 使用简体中文回答
- 回答要准确、专业但易于理解
- 适当使用数学公式
- 提供代码示例时使用MindQuantum框架
- 保持友好和鼓励的语气`

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { apiKey, apiEndpoint, model } = useSettingsStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const callQwenAPI = async (userMessage: string, history: Message[]): Promise<string> => {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: userMessage }
    ]

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('API调用失败')
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || '抱歉，我无法生成回复。'
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response = presetResponses[content.trim()]

      if (!response) {
        // 如果用户配置了API Key，使用通义千问API
        if (apiKey) {
          try {
            response = await callQwenAPI(content.trim(), messages)
          } catch (error) {
            console.error('API调用失败:', error)
            response = generateDefaultResponse(content.trim())
          }
        } else {
          // 没有API Key时使用本地知识库
          response = generateDefaultResponse(content.trim())
        }
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后再试。',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-50">
                  量子AI助教
                </h1>
                <p className="text-dark-400 text-sm">
                  {apiKey ? '已连接通义千问API' : '使用本地知识库'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* API Key 提示 */}
        {!apiKey && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-amber-400 text-sm">
                未配置API Key，AI助手将使用本地预设回答。
                <Link to="/settings" className="underline ml-1 hover:text-amber-300">
                  前往设置配置API Key
                </Link>
              </p>
            </div>
            <Link
              to="/settings"
              className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* 聊天区域 */}
        <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 overflow-hidden">
          {/* 消息列表 */}
          <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-lg font-medium text-dark-200 mb-2">
                  开始探索量子计算
                </h3>
                <p className="text-dark-400 text-sm text-center max-w-md mb-6">
                  我是你的量子计算AI助教，可以回答关于量子门、量子电路、量子算法等问题
                </p>

                {/* 快捷问题 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {quickQuestions.map((q, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-dark-800/50 border border-dark-700 hover:border-violet-500/50 hover:bg-dark-800 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                        <q.icon className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-dark-200 text-sm truncate">{q.text}</p>
                        <p className="text-dark-500 text-xs">{q.category}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl p-4 ${
                          message.role === 'user'
                            ? 'bg-quantum-500/20 border border-quantum-500/30'
                            : 'bg-dark-800 border border-dark-700'
                        }`}
                      >
                        <div
                          className={`text-sm leading-relaxed whitespace-pre-wrap ${
                            message.role === 'user' ? 'text-dark-100' : 'text-dark-200'
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message.content)
                          }}
                        />
                        <p className="text-dark-500 text-xs mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-quantum-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-quantum-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t border-dark-700 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入你的问题..."
                className="flex-1 bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2.5 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/50 hover:bg-violet-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* 功能说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          {[
            { icon: BookOpen, title: '概念解释', desc: '量子计算基础知识' },
            { icon: Code, title: '代码示例', desc: 'MindQuantum实现' },
            { icon: Lightbulb, title: '算法原理', desc: '深入理解量子算法' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-dark-900/50 rounded-lg border border-dark-800 p-4 text-center"
            >
              <item.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
              <h4 className="text-dark-200 text-sm font-medium">{item.title}</h4>
              <p className="text-dark-500 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function formatMessage(content: string): string {
  // 简单的Markdown格式化
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-100">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-dark-700 px-1.5 py-0.5 rounded text-violet-400 text-xs">$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-dark-700 rounded-lg p-3 mt-2 mb-2 overflow-x-auto text-xs"><code class="text-indigo-400">$2</code></pre>')
    .replace(/\n/g, '<br/>')
}

function generateDefaultResponse(question: string): string {
  const keywords = question.toLowerCase()

  if (keywords.includes('量子门') || keywords.includes('gate')) {
    return `量子门是量子计算的基本操作单元。常见的量子门包括：

**单比特门：**
- **H门（Hadamard）**：创建叠加态
- **X门（Pauli-X）**：量子NOT门
- **Y门（Pauli-Y）**：绕Y轴旋转
- **Z门（Pauli-Z）**：相位翻转

**双比特门：**
- **CNOT门**：受控NOT门，用于创建纠缠

你可以在"量子门"页面查看详细信息和交互演示。`
  }

  if (keywords.includes('电路') || keywords.includes('circuit')) {
    return `量子电路是由量子门组成的计算序列。

**基本结构：**
1. 量子比特初始化（通常为|0⟩）
2. 应用量子门序列
3. 测量获取结果

你可以在"量子电路"页面构建自己的电路，或在"实验室"进行模拟。`
  }

  if (keywords.includes('mindquantum') || keywords.includes('代码')) {
    return `MindQuantum是华为开源的量子计算框架。

**基本用法：**
\`\`\`python
from mindquantum.core.circuit import Circuit
from mindquantum.core.gates import H, X
from mindquantum.simulator import Simulator

# 创建电路
circuit = Circuit()
circuit += H.on(0)
circuit += X.on(1, 0)

# 模拟
sim = Simulator('mqvector', 2)
sim.apply_circuit(circuit)
print(sim.get_qs())
\`\`\`

更多示例请查看"算法"页面。`
  }

  return `感谢你的问题！

作为量子计算AI助教，我可以帮助你了解：
- 量子计算基础概念
- 量子门和量子电路
- 量子算法原理
- MindQuantum编程

请尝试更具体的问题，或点击上方的快捷问题开始学习。

**提示**：配置通义千问API Key后，可以获得更智能的回答。前往"设置"页面配置。`
}
