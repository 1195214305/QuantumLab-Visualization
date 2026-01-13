import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  apiKey: string
  apiEndpoint: string
  model: string
  setApiKey: (key: string) => void
  setApiEndpoint: (endpoint: string) => void
  setModel: (model: string) => void
  clearSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      model: 'qwen-turbo',
      setApiKey: (key) => set({ apiKey: key }),
      setApiEndpoint: (endpoint) => set({ apiEndpoint: endpoint }),
      setModel: (model) => set({ model: model }),
      clearSettings: () => set({ apiKey: '', apiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-turbo' }),
    }),
    {
      name: 'quantum-lab-settings',
    }
  )
)
