import { useAppStore } from '@/store/useAppStore'
import { callClaudeMobile, hasApiKeyMobile } from './claude-mobile'

declare const __HAS_DEFAULT_KEY__: boolean

interface CallPayload {
  feature: string
  inputs: Record<string, unknown>
  imageBase64?: string
  language: 'en' | 'ar'
}

export function useClaudeCall() {
  const { language, hasApiKey, setIsLoading } = useAppStore()

  const call = async (
    feature: string,
    inputs: Record<string, unknown>,
    imageBase64?: string | null
  ): Promise<string> => {
    setIsLoading(true)
    try {
      const payload: CallPayload = {
        feature,
        inputs,
        ...(imageBase64 ? { imageBase64 } : {}),
        language,
      }

      if (window.electronAPI) {
        return await window.electronAPI.callClaude(payload)
      } else {
        return await callClaudeMobile(payload)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const checkApiKey = async (): Promise<boolean> => {
    if (typeof __HAS_DEFAULT_KEY__ !== 'undefined' && __HAS_DEFAULT_KEY__) return true
    if (window.electronAPI) return hasApiKey
    return hasApiKeyMobile()
  }

  return { call, checkApiKey, language }
}
