import { GoogleGenerativeAI } from '@google/generative-ai'
import Store from 'electron-store'
import type { IpcMain } from 'electron'
import { buildPrompt, buildSystemPrompt } from './prompt-builder'

const store = new Store<{ apiKey: string }>({ encryptionKey: 'bait-elezz-v1' })

export function setupClaudeIPC(ipcMain: IpcMain) {
  ipcMain.handle('store:set-api-key', (_e, key: string) => {
    store.set('apiKey', key)
    return true
  })

  ipcMain.handle('store:get-api-key', () => store.get('apiKey', ''))

  ipcMain.handle('store:has-api-key', () => !!store.get('apiKey', ''))

  ipcMain.handle(
    'claude:call',
    async (
      _e,
      payload: {
        feature: string
        inputs: Record<string, unknown>
        imageBase64?: string
        language: 'en' | 'ar'
      }
    ) => {
      const apiKey = store.get('apiKey', '')
      if (!apiKey) throw new Error('API key not configured')

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: buildSystemPrompt(payload.language),
      })

      type Part =
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }

      const parts: Part[] = []

      if (payload.imageBase64) {
        parts.push({
          inlineData: { mimeType: 'image/jpeg', data: payload.imageBase64 },
        })
      }

      parts.push({ text: buildPrompt(payload.feature, payload.inputs, payload.language) })

      try {
        const result = await model.generateContent(parts)
        return result.response.text()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('API_KEY_INVALID') || msg.includes('invalid authentication') || msg.includes('UNAUTHENTICATED')) {
          throw new Error('Invalid API key. Go to Settings and enter a valid key from aistudio.google.com. Make sure it has no Android-app restrictions.')
        }
        if (msg.includes('PERMISSION_DENIED') || msg.includes('blocked')) {
          throw new Error('API key is restricted. Remove any "Android apps" restriction from your key in Google Cloud Console, or use an unrestricted key.')
        }
        throw err
      }
    }
  )
}
