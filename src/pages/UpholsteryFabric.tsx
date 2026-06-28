import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'
import ImageUploader from '@/components/ImageUploader'
import ColorSwatch from '@/components/ColorSwatch'

const furnitureTypes = ['sofa', 'armchair', 'diningChairs', 'bedHeadboard', 'ottoman', 'other']
const usageLevels = ['light', 'medium', 'heavy']

export default function UpholsteryFabric() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [furnitureType, setFurnitureType] = useState('sofa')
  const [usage, setUsage] = useState('medium')
  const [currentColor, setCurrentColor] = useState('#c8975a')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    setError('')
    try {
      const result = await call('upholsteryFabric', { furnitureType: t(`upholsteryFabric.furnitureTypes.${furnitureType}`), usage: t(`upholsteryFabric.usageLevels.${usage}`), currentColor }, imageBase64)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.upholsteryFabric"
      descKey="upholsteryFabric.description"
      response={response}
      error={error}
      onSubmit={analyze}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('upholsteryFabric.furnitureType')}</label>
        <select value={furnitureType} onChange={(e) => setFurnitureType(e.target.value)} className={inputCls}>
          {furnitureTypes.map((f) => <option key={f} value={f}>{t(`upholsteryFabric.furnitureTypes.${f}`)}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('upholsteryFabric.usage')}</label>
        <div className="grid grid-cols-1 gap-2">
          {usageLevels.map((level) => (
            <label key={level} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors
              ${usage === level ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="usage" value={level} checked={usage === level} onChange={() => setUsage(level)} className="accent-primary-500" />
              <span className="text-sm text-gray-700">{t(`upholsteryFabric.usageLevels.${level}`)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('upholsteryFabric.currentColor')}{' '}
          <span className="text-gray-400 font-normal">({t('common.optional')})</span>
        </label>
        <div className="flex items-center gap-3">
          <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200" />
          <input type="text" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <ColorSwatch hex={currentColor} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.uploadImage')}{' '}
          <span className="text-gray-400 font-normal">({t('common.recommended')})</span>
        </label>
        <ImageUploader onImageChange={setImageBase64} />
      </div>
    </FeaturePage>
  )
}
