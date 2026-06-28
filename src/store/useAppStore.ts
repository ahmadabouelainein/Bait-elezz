import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  language: 'en' | 'ar'
  hasApiKey: boolean
  isLoading: boolean
  provider: 'gemini' | 'ollama'
  ollamaModel: string
  setLanguage: (lang: 'en' | 'ar') => void
  setHasApiKey: (has: boolean) => void
  setIsLoading: (loading: boolean) => void
  setProvider: (provider: 'gemini' | 'ollama') => void
  setOllamaModel: (model: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ar',
      hasApiKey: false,
      isLoading: false,
      provider: 'gemini',
      ollamaModel: 'qwen2.5-vl:7b',
      setLanguage: (language) => set({ language }),
      setHasApiKey: (hasApiKey) => set({ hasApiKey }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setProvider: (provider) => set({ provider }),
      setOllamaModel: (ollamaModel) => set({ ollamaModel }),
    }),
    { name: 'bait-elezz-store' }
  )
)
