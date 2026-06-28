import { buildPrompt, buildSystemPrompt } from '../../electron/prompt-builder'

const BASE = 'http://localhost:11434'

export interface OllamaStatus {
  running: boolean
  models: string[]
}

export async function checkOllamaWeb(): Promise<OllamaStatus> {
  try {
    const r = await fetch(`${BASE}/api/tags`, { signal: AbortSignal.timeout(3000) })
    if (!r.ok) return { running: false, models: [] }
    const data = (await r.json()) as { models?: Array<{ name: string }> }
    return { running: true, models: data.models?.map((m) => m.name) ?? [] }
  } catch {
    return { running: false, models: [] }
  }
}

export async function callOllamaWeb(payload: {
  feature: string
  inputs: Record<string, unknown>
  imageBase64?: string | null
  language: 'en' | 'ar'
  model: string
}): Promise<string> {
  const prompt = buildPrompt(payload.feature, payload.inputs, payload.language)
  const system = buildSystemPrompt(payload.language)

  const userMsg: { role: string; content: string; images?: string[] } = {
    role: 'user',
    content: prompt,
  }
  if (payload.imageBase64) {
    userMsg.images = [payload.imageBase64]
  }

  const r = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: payload.model,
      messages: [{ role: 'system', content: system }, userMsg],
      stream: false,
    }),
  })

  if (!r.ok) {
    throw new Error(
      `Ollama returned HTTP ${r.status}. Is the model downloaded? Run: ollama pull ${payload.model}`
    )
  }

  const data = (await r.json()) as { message?: { content?: string } }
  return data.message?.content ?? ''
}
