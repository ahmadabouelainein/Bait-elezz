import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  language: 'en' | 'ar'
  hasApiKey: boolean
  isLoading: boolean
  setLanguage: (lang: 'en' | 'ar') => void
  setHasApiKey: (has: boolean) => void
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ar',
      hasApiKey: false,
      isLoading: false,
      setLanguage: (language) => set({ language }),
      setHasApiKey: (hasApiKey) => set({ hasApiKey }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'bait-elezz-store' }
  )
)
