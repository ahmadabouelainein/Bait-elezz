import { buildPrompt, buildSystemPrompt } from '../../electron/prompt-builder'

declare const __GROQ_DEFAULT_KEY__: string

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const TEXT_MODEL = 'llama-3.3-70b-versatile'
const VISION_MODEL = 'llama-3.2-11b-vision-preview'

async function getStoredApiKey(): Promise<string> {
  try {
    const { Preferences } = await import('@capacitor/preferences')
    const { value } = await Preferences.get({ key: 'groq_api_key' })
    return value ?? ''
  } catch {
    return ''
  }
}

async function getEffectiveApiKey(): Promise<string> {
  const stored = await getStoredApiKey()
  if (stored) return stored
  return typeof __GROQ_DEFAULT_KEY__ !== 'undefined' ? __GROQ_DEFAULT_KEY__ : ''
}

export async function saveApiKeyMobile(key: string): Promise<boolean> {
  try {
    const { Preferences } = await import('@capacitor/preferences')
    await Preferences.set({ key: 'groq_api_key', value: key })
    return true
  } catch {
    return false
  }
}

export async function hasApiKeyMobile(): Promise<boolean> {
  const key = await getStoredApiKey()
  return !!key
}

export async function callClaudeMobile(payload: {
  feature: string
  inputs: Record<string, unknown>
  imageBase64?: string
  language: 'en' | 'ar'
}): Promise<string> {
  const apiKey = await getEffectiveApiKey()
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

  const response = await fetch(GROQ_URL, {
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

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } }
    const msg = err.error?.message ?? `HTTP ${response.status}`
    if (response.status === 401) {
      throw new Error('Invalid API key. Go to Settings and enter a valid key from console.groq.com')
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Groq free tier allows 30 requests per minute. Please wait a moment and try again.')
    }
    throw new Error(`Groq error: ${msg}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  return data.choices?.[0]?.message?.content ?? ''
}
