import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Key, Server, Cpu, Save, Trash2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useSettingsStore } from '../store/settings'

export default function Settings() {
  const { apiKey, apiEndpoint, model, setApiKey, setApiEndpoint, setModel, clearSettings } = useSettingsStore()
  const [showApiKey, setShowApiKey] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')

  const [localApiKey, setLocalApiKey] = useState(apiKey)
  const [localEndpoint, setLocalEndpoint] = useState(apiEndpoint)
  const [localModel, setLocalModel] = useState(model)

  const handleSave = () => {
    setApiKey(localApiKey)
    setApiEndpoint(localEndpoint)
    setModel(localModel)
    setTestStatus('idle')
    setTestMessage('设置已保存')
    setTimeout(() => setTestMessage(''), 3000)
  }

  const handleClear = () => {
    clearSettings()
    setLocalApiKey('')
    setLocalEndpoint('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions')
    setLocalModel('qwen-turbo')
    setTestStatus('idle')
    setTestMessage('设置已清除')
    setTimeout(() => setTestMessage(''), 3000)
  }

  const testConnection = async () => {
    if (!localApiKey) {
      setTestStatus('error')
      setTestMessage('请先输入API Key')
      return
    }

    setTestStatus('testing')
    setTestMessage('正在测试连接...')

    try {
      const response = await fetch(localEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localApiKey}`,
        },
        body: JSON.stringify({
          model: localModel,
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 10,
        }),
      })

      if (response.ok) {
        setTestStatus('success')
        setTestMessage('连接成功！API Key有效')
      } else {
        const error = await response.json()
        setTestStatus('error')
        setTestMessage(`连接失败: ${error.error?.message || '未知错误'}`)
      }
    } catch (error) {
      setTestStatus('error')
      setTestMessage(`连接失败: ${error instanceof Error ? error.message : '网络错误'}`)
    }
  }

  const models = [
    { value: 'qwen-turbo', label: 'Qwen Turbo', desc: '快速响应，适合日常对话' },
    { value: 'qwen-plus', label: 'Qwen Plus', desc: '更强能力，适合复杂任务' },
    { value: 'qwen-max', label: 'Qwen Max', desc: '最强模型，适合专业场景' },
  ]

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-50">
              设置
            </h1>
          </div>
          <p className="text-dark-400 text-sm sm:text-base">
            配置AI助手的API密钥和模型参数
          </p>
        </motion.div>

        {/* 设置表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* API Key */}
          <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-quantum-400" />
              <h2 className="text-lg font-semibold text-dark-100">通义千问 API Key</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              请输入您的通义千问API密钥。您可以在
              <a
                href="https://dashscope.console.aliyun.com/apiKey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-quantum-400 hover:underline mx-1"
              >
                阿里云控制台
              </a>
              获取API Key。
            </p>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 pr-12 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-quantum-500/50 transition-colors font-mono text-sm"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* API Endpoint */}
          <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-5 h-5 text-quantum-400" />
              <h2 className="text-lg font-semibold text-dark-100">API 端点</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              通义千问API的请求地址，通常无需修改。
            </p>
            <input
              type="text"
              value={localEndpoint}
              onChange={(e) => setLocalEndpoint(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-quantum-500/50 transition-colors font-mono text-sm"
            />
          </div>

          {/* Model Selection */}
          <div className="bg-dark-900/80 backdrop-blur rounded-xl border border-dark-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-5 h-5 text-quantum-400" />
              <h2 className="text-lg font-semibold text-dark-100">模型选择</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              选择用于AI助手的模型。不同模型有不同的能力和响应速度。
            </p>
            <div className="grid gap-3">
              {models.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setLocalModel(m.value)}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border text-left transition-all
                    ${localModel === m.value
                      ? 'bg-quantum-500/10 border-quantum-500/50'
                      : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                    }
                  `}
                >
                  <div>
                    <div className={`font-medium ${localModel === m.value ? 'text-quantum-400' : 'text-dark-200'}`}>
                      {m.label}
                    </div>
                    <div className="text-dark-500 text-sm">{m.desc}</div>
                  </div>
                  {localModel === m.value && (
                    <CheckCircle className="w-5 h-5 text-quantum-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 状态消息 */}
          {testMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                flex items-center gap-3 p-4 rounded-lg
                ${testStatus === 'success' ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400' : ''}
                ${testStatus === 'error' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : ''}
                ${testStatus === 'testing' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : ''}
                ${testStatus === 'idle' ? 'bg-dark-800 border border-dark-700 text-dark-300' : ''}
              `}
            >
              {testStatus === 'success' && <CheckCircle className="w-5 h-5" />}
              {testStatus === 'error' && <AlertCircle className="w-5 h-5" />}
              {testStatus === 'testing' && (
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              )}
              <span className="text-sm">{testMessage}</span>
            </motion.div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-quantum-500/20 text-quantum-400 border border-quantum-500/50 hover:bg-quantum-500/30 transition-colors"
            >
              <Save className="w-4 h-4" />
              保存设置
            </button>
            <button
              onClick={testConnection}
              disabled={testStatus === 'testing'}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-dark-800 text-dark-200 hover:bg-dark-700 transition-colors disabled:opacity-50"
            >
              测试连接
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清除设置
            </button>
          </div>

          {/* 说明 */}
          <div className="bg-dark-900/50 rounded-xl border border-dark-800 p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-3">使用说明</h3>
            <ul className="space-y-2 text-dark-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-quantum-400">•</span>
                API Key将安全存储在您的浏览器本地，不会上传到服务器
              </li>
              <li className="flex items-start gap-2">
                <span className="text-quantum-400">•</span>
                配置API Key后，AI助手将使用您的密钥进行对话
              </li>
              <li className="flex items-start gap-2">
                <span className="text-quantum-400">•</span>
                如果未配置API Key，AI助手将使用预设的本地知识库回答
              </li>
              <li className="flex items-start gap-2">
                <span className="text-quantum-400">•</span>
                建议使用qwen-turbo模型，响应速度快且成本较低
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
