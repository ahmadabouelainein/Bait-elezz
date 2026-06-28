import Anthropic from '@anthropic-ai/sdk'
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

      const client = new Anthropic({ apiKey })

      const userContent: Anthropic.ContentBlockParam[] = []

      if (payload.imageBase64) {
        userContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: payload.imageBase64,
          },
        })
      }

      userContent.push({
        type: 'text',
        text: buildPrompt(payload.feature, payload.inputs, payload.language),
      })

      const response = await client.messages.create({
        model: 'claude-opus-4-8',
        max_tokens: 4096,
        system: buildSystemPrompt(payload.language),
        messages: [{ role: 'user', content: userContent }],
      })

      const textBlock = response.content.find((b) => b.type === 'text')
      return textBlock?.type === 'text' ? textBlock.text : ''
    }
  )
}
