import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'
import ImageUploader from '@/components/ImageUploader'
import ColorSwatch from '@/components/ColorSwatch'

const windowSizes = ['small', 'medium', 'large', 'floor']

export default function CurtainColor() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [wallColor, setWallColor] = useState('#e8e0d5')
  const [mainFurnitureColor, setMainFurnitureColor] = useState('#8b7355')
  const [windowSize, setWindowSize] = useState('medium')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    setError('')
    try {
      const result = await call('curtainColor', { wallColor, mainFurnitureColor, windowSize }, imageBase64)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.curtainColor"
      descKey="curtainColor.description"
      response={response}
      error={error}
      onSubmit={analyze}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('curtainColor.wallColor')}</label>
        <div className="flex items-center gap-3">
          <input type="color" value={wallColor} onChange={(e) => setWallColor(e.target.value)} className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200" />
          <input type="text" value={wallColor} onChange={(e) => setWallColor(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <ColorSwatch hex={wallColor} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('curtainColor.mainFurnitureColor')}</label>
        <div className="flex items-center gap-3">
          <input type="color" value={mainFurnitureColor} onChange={(e) => setMainFurnitureColor(e.target.value)} className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200" />
          <input type="text" value={mainFurnitureColor} onChange={(e) => setMainFurnitureColor(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <ColorSwatch hex={mainFurnitureColor} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('curtainColor.windowSize')}</label>
        <select value={windowSize} onChange={(e) => setWindowSize(e.target.value)} className={inputCls}>
          {windowSizes.map((s) => (
            <option key={s} value={s}>{t(`curtainColor.windowSizes.${s}`)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.uploadImage')}{' '}
          <span className="text-gray-400 font-normal">({t('common.optional')})</span>
        </label>
        <ImageUploader onImageChange={setImageBase64} />
      </div>
    </FeaturePage>
  )
}
