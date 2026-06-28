export interface ElectronAPI {
  callClaude(payload: {
    feature: string
    inputs: Record<string, unknown>
    imageBase64?: string
    language: 'en' | 'ar'
  }): Promise<string>
  saveApiKey(key: string): Promise<boolean>
  getApiKey(): Promise<string>
  hasApiKey(): Promise<boolean>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
