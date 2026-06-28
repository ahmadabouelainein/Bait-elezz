import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { saveApiKeyMobile } from '@/lib/claude-mobile'
import { KeyRound, ExternalLink } from 'lucide-react'

export default function Settings() {
  const { t } = useTranslation()
  const { setHasApiKey } = useAppStore()
  const [apiKey, setApiKey] = useState('')
  const [masked, setMasked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      if (window.electronAPI) {
        const has = await window.electronAPI.hasApiKey()
        if (has) {
          setApiKey('••••••••••••••••••••••••')
          setMasked(true)
          setHasApiKey(true)
        }
      }
    }
    init()
  }, [setHasApiKey])

  const handleSave = async () => {
    if (!apiKey || masked) return
    setError('')
    try {
      if (window.electronAPI) {
        await window.electronAPI.saveApiKey(apiKey)
      } else {
        await saveApiKeyMobile(apiKey)
      }
      setHasApiKey(true)
      setMasked(true)
      setApiKey('••••••••••••••••••••••••')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Failed to save API key')
    }
  }

  const handleChange = (val: string) => {
    if (masked) {
      setMasked(false)
      setApiKey('')
    } else {
      setApiKey(val)
    }
  }

  const handleFocus = () => {
    if (masked) {
      setMasked(false)
      setApiKey('')
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="bg-primary-50 p-2.5 rounded-lg">
            <KeyRound size={20} className="text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-sm">{t('settings.apiKey')}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{t('settings.apiKeyHint')}</p>
          </div>
        </div>

        <div>
          <input
            type="password"
            value={masked ? '••••••••••••••••••••••••' : apiKey}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            placeholder={t('settings.apiKeyPlaceholder')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       placeholder:text-gray-300"
          />
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <ExternalLink size={11} />
          <span>{t('settings.getKeyAt')}</span>
          <span className="text-primary-600 font-mono">console.groq.com</span>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2.5 text-xs text-orange-700 space-y-1">
          <p className="font-medium">{t('settings.groqFreeTier')}</p>
          <p>{t('settings.groqFreeTierDetail')}</p>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={!apiKey || masked}
          className="bg-primary-500 disabled:opacity-50 hover:bg-primary-600 text-white
                     px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                     disabled:cursor-not-allowed"
        >
          {saved ? t('settings.saved') : t('settings.save')}
        </button>

        {masked && (
          <button
            onClick={() => {
              setMasked(false)
              setApiKey('')
            }}
            className="text-xs text-gray-400 hover:text-gray-600 underline ms-3"
          >
            {t('settings.change')}
          </button>
        )}
      </div>
    </div>
  )
}
