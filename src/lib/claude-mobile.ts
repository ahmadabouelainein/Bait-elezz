import { buildPrompt, buildSystemPrompt } from '../../electron/prompt-builder'

const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

async function getStoredApiKey(): Promise<string> {
  try {
    const { Preferences } = await import('@capacitor/preferences')
    const { value } = await Preferences.get({ key: 'gemini_api_key' })
    return value ?? ''
  } catch {
    return ''
  }
}

export async function saveApiKeyMobile(key: string): Promise<boolean> {
  try {
    const { Preferences } = await import('@capacitor/preferences')
    await Preferences.set({ key: 'gemini_api_key', value: key })
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
  const apiKey = await getStoredApiKey()
  if (!apiKey) throw new Error('API key not configured')

  type Part =
    | { text: string }
    | { inline_data: { mime_type: string; data: string } }

  const parts: Part[] = []

  if (payload.imageBase64) {
    parts.push({
      inline_data: { mime_type: 'image/jpeg', data: payload.imageBase64 },
    })
  }

  parts.push({ text: buildPrompt(payload.feature, payload.inputs, payload.language) })

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystemPrompt(payload.language) }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { maxOutputTokens: 4096 },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const errObj = (err as { error?: { message?: string; status?: string } }).error
    if (response.status === 401 || errObj?.status === 'UNAUTHENTICATED') {
      throw new Error('Invalid API key. Go to Settings and enter a valid Gemini API key from aistudio.google.com. Make sure the key has no Android-app restrictions.')
    }
    if (response.status === 403 || errObj?.status === 'PERMISSION_DENIED') {
      throw new Error('API key is restricted. If you set an "Android apps" restriction on your key, remove it — the desktop app cannot pass Android credentials. Use an unrestricted key or create a separate one.')
    }
    if (response.status === 429 || errObj?.status === 'RESOURCE_EXHAUSTED') {
      throw new Error('Rate limit exceeded. The free tier allows 15 requests per minute. Please wait a moment and try again.')
    }
    throw new Error(errObj?.message ?? `HTTP ${response.status}`)
  }

  const data = (await response.json()) as {
    candidates: Array<{ content: { parts: Array<{ text?: string }> } }>
  }
  return data.candidates[0]?.content?.parts?.[0]?.text ?? ''
}
