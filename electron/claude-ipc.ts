import Store from 'electron-store'
import type { IpcMain } from 'electron'
import { buildPrompt, buildSystemPrompt } from './prompt-builder'
import { DEFAULT_GROQ_KEY } from './default-key'

const store = new Store<{ apiKey: string }>({ encryptionKey: 'bait-elezz-v1' })

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const TEXT_MODEL = 'llama-3.3-70b-versatile'
const VISION_MODEL = 'llama-3.2-11b-vision-preview'

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
      const apiKey = store.get('apiKey', '') || DEFAULT_GROQ_KEY
      if (!apiKey) throw new Error('API key not configured')

      const model = payload.imageBase64 ? VISION_MODEL : TEXT_MODEL
      const prompt = buildPrompt(payload.feature, payload.inputs, payload.language)
      const system = buildSystemPrompt(payload.language)

      const userContent = payload.imageBase64
        ? [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${payload.imageBase64}` } },
            { type: 'text', text: prompt },
          ]
        : prompt

      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userContent },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      })

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
        const msg = err.error?.message ?? `HTTP ${res.status}`
        if (res.status === 401) {
          throw new Error('Invalid API key. Go to Settings and enter a valid key from console.groq.com')
        }
        if (res.status === 429) {
          throw new Error('Rate limit exceeded. Groq free tier allows 30 requests per minute. Please wait a moment and try again.')
        }
        throw new Error(`Groq error: ${msg}`)
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }
      return data.choices?.[0]?.message?.content ?? ''
    }
  )
}
