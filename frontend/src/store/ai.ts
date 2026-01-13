import { create } from 'zustand'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIState {
  messages: Message[]
  isLoading: boolean
  addMessage: (message: Message) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
}))
