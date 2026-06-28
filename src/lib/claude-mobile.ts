import { buildPrompt, buildSystemPrompt } from '../../electron/prompt-builder'

async function getStoredApiKey(): Promise<string> {
  try {
    const { Preferences } = await import('@capacitor/preferences')
    const { value } = await Preferences.get({ key: 'anthropic_api_key' })
    return value ?? ''
  } catch {
    return ''
  }
}

export async function saveApiKeyMobile(key: string): Promise<boolean> {
  try {
    const { Preferences } = await import('@capacitor/preferences')
    await Preferences.set({ key: 'anthropic_api_key', value: key })
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

  const userContent: Array<{ type: string; [key: string]: unknown }> = []

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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: buildSystemPrompt(payload.language),
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${response.status}`)
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>
  }
  const textBlock = data.content.find((b) => b.type === 'text')
  return textBlock?.text ?? ''
}
