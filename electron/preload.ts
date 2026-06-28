import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  callClaude: (payload: {
    feature: string
    inputs: Record<string, unknown>
    imageBase64?: string
    language: 'en' | 'ar'
  }) => ipcRenderer.invoke('claude:call', payload),

  saveApiKey: (key: string) => ipcRenderer.invoke('store:set-api-key', key),
  getApiKey: () => ipcRenderer.invoke('store:get-api-key'),
  hasApiKey: () => ipcRenderer.invoke('store:has-api-key'),
})
